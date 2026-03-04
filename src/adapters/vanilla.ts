import type { ChatConfig, ChatState, ChatActions, Message } from '../types';
import { streamCompletion, generateId } from '../core/ChatEngine';

export type ChatInstance = ChatState &
    ChatActions & {
    subscribe: (listener: (state: ChatState) => void) => () => void;
};

/**
 * createChat — headless chat instance for vanilla JS, Vue, Svelte, etc.
 *
 * @example
 * const chat = createChat({ provider: 'anthropic', apiKey: 'sk-ant-...' });
 * chat.subscribe(state => console.log(state.messages));
 * await chat.sendMessage('Hello!');
 */
export function createChat(config: ChatConfig): ChatInstance {
    let state: ChatState = {
        messages: config.initialMessages ? [...config.initialMessages] : [],
        isLoading: false,
        isStreaming: false,
        streamingMessage: '',
        error: null,
    };

    let abortController: AbortController | null = null;
    const listeners = new Set<(state: ChatState) => void>();
    let systemPrompt = config.systemPrompt ?? '';

    function setState(partial: Partial<ChatState>) {
        state = { ...state, ...partial };
        listeners.forEach((l) => l(state));
    }

    function subscribe(listener: (state: ChatState) => void) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    async function sendMessage(content: string) {
        if (!content.trim() || state.isLoading || state.isStreaming) return;

        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: content.trim(),
            createdAt: new Date(),
        };

        const history = [...state.messages, userMessage];
        setState({ messages: history, isLoading: true, error: null });

        const mergedConfig: ChatConfig = { ...config, systemPrompt };

        abortController = streamCompletion(history, mergedConfig, {
            onChunk(text) {
                if (!state.isStreaming) {
                    setState({ isLoading: false, isStreaming: true, streamingMessage: '' });
                }
                setState({ streamingMessage: state.streamingMessage + text });
            },
            onDone(fullText) {
                const assistantMessage: Message = {
                    id: generateId(),
                    role: 'assistant',
                    content: fullText,
                    createdAt: new Date(),
                };
                setState({
                    messages: [...state.messages, assistantMessage],
                    isStreaming: false,
                    streamingMessage: '',
                });
            },
            onError(error) {
                setState({ error, isLoading: false, isStreaming: false, streamingMessage: '' });
            },
        });
    }

    function abortResponse() {
        abortController?.abort();
        setState({ isLoading: false, isStreaming: false, streamingMessage: '' });
    }

    function clearHistory() {
        abortController?.abort();
        setState({
            messages: [],
            isLoading: false,
            isStreaming: false,
            streamingMessage: '',
            error: null,
        });
    }

    function setSystemPrompt(prompt: string) {
        systemPrompt = prompt;
    }

    // Proxy to always return fresh state properties
    return new Proxy(
        { subscribe, sendMessage, abortResponse, clearHistory, setSystemPrompt } as unknown as ChatInstance,
        {
            get(target, prop) {
                if (prop in state) return state[prop as keyof ChatState];
                return target[prop as keyof typeof target];
            },
        }
    );
}

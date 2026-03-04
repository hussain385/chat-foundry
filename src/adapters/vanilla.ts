import type { ChatConfig, ChatState, ChatActions, Message, UserContext } from '../types/index';
import {
    streamCompletion,
    generateId,
    buildSystemPrompt,
    setSessionMessages,
    clearSession,
} from '../core/ChatEngine';

export type ChatInstance = ChatState &
    ChatActions & {
    subscribe: (listener: (state: ChatState) => void) => () => void;
};

/**
 * createChat — headless chat instance for vanilla JS, Vue, Svelte, etc.
 * Supports per-user isolation via userId + sessionId, and personalised
 * responses via userContext.
 *
 * @example
 * const chat = createChat({
 *   provider: 'anthropic',
 *   apiKey: 'sk-ant-...',
 *   userId: 'user_123',
 *   userContext: { name: 'Hussain', plan: 'premium' },
 * });
 * chat.subscribe(state => renderMessages(state.messages));
 * await chat.sendMessage('Hello!');
 */
export function createChat(config: ChatConfig): ChatInstance {
    const sessionId = config.sessionId ?? generateId();

    let state: ChatState = {
        messages: config.initialMessages ? [...config.initialMessages] : [],
        isLoading: false,
        isStreaming: false,
        streamingMessage: '',
        error: null,
        sessionId,
        userId: config.userId,
    };

    let abortController: AbortController | null = null;
    const listeners = new Set<(state: ChatState) => void>();
    let systemPrompt = config.systemPrompt ?? '';
    let userContext: UserContext | undefined = config.userContext;

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
        setSessionMessages(config.userId, sessionId, history);

        const resolvedSystemPrompt = buildSystemPrompt(systemPrompt, userContext);
        const mergedConfig: ChatConfig = { ...config, systemPrompt: resolvedSystemPrompt };

        let streamingStarted = false;

        abortController = streamCompletion(history, mergedConfig, {
            onChunk(text) {
                if (!streamingStarted) {
                    streamingStarted = true;
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
                const finalHistory = [...history, assistantMessage];
                setSessionMessages(config.userId, sessionId, finalHistory);
                setState({ messages: finalHistory, isStreaming: false, streamingMessage: '' });
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
        clearSession(config.userId, sessionId);
        setState({ messages: [], isLoading: false, isStreaming: false, streamingMessage: '', error: null });
    }

    function setSystemPrompt(prompt: string) {
        systemPrompt = prompt;
    }

    function setUserContext(ctx: UserContext) {
        userContext = ctx;
    }

    return new Proxy(
        { subscribe, sendMessage, abortResponse, clearHistory, setSystemPrompt, setUserContext } as unknown as ChatInstance,
        {
            get(target, prop) {
                if (prop in state) return state[prop as keyof ChatState];
                return target[prop as keyof typeof target];
            },
        }
    );
}

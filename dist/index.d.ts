type Role = 'user' | 'assistant' | 'system';
interface Message {
    id: string;
    role: Role;
    content: string;
    createdAt: Date;
}
type Provider = 'openai' | 'anthropic' | 'custom';
interface ChatConfig {
    provider: Provider;
    apiKey?: string;
    backendUrl?: string;
    model?: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    initialMessages?: Message[];
}
interface ChatState {
    messages: Message[];
    isLoading: boolean;
    isStreaming: boolean;
    streamingMessage: string;
    error: Error | null;
}
interface ChatActions {
    sendMessage: (content: string) => Promise<void>;
    clearHistory: () => void;
    abortResponse: () => void;
    setSystemPrompt: (prompt: string) => void;
}
type ChatHookReturn = ChatState & ChatActions;
interface ProviderAdapter {
    buildRequest(messages: Message[], config: ChatConfig): RequestInit & {
        url: string;
    };
    parseChunk(chunk: string): string | null;
    isDone(chunk: string): boolean;
}

/**
 * useChat — headless chat hook for React and React Native.
 *
 * @example
 * const { messages, sendMessage, isStreaming, streamingMessage } = useChat({
 *   provider: 'openai',
 *   apiKey: 'sk-...',
 * });
 */
declare function useChat(config: ChatConfig): ChatHookReturn;

type ChatInstance = ChatState & ChatActions & {
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
declare function createChat(config: ChatConfig): ChatInstance;

declare function generateId(): string;
declare function getAdapter(config: ChatConfig): ProviderAdapter;
interface StreamCallbacks {
    onChunk: (text: string) => void;
    onDone: (fullText: string) => void;
    onError: (error: Error) => void;
}
/**
 * Streams a chat completion using chunked fetch — works on Web AND React Native.
 * Returns an AbortController so callers can cancel mid-stream.
 */
declare function streamCompletion(messages: Message[], config: ChatConfig, callbacks: StreamCallbacks): AbortController;

declare const openaiAdapter: ProviderAdapter;

declare const anthropicAdapter: ProviderAdapter;

export { type ChatActions, type ChatConfig, type ChatHookReturn, type ChatState, type Message, type Provider, type ProviderAdapter, type Role, anthropicAdapter, createChat, generateId, getAdapter, openaiAdapter, streamCompletion, useChat };

type Role = 'user' | 'assistant' | 'system';
interface Message {
    id: string;
    role: Role;
    content: string;
    createdAt: Date;
}
type Provider = 'openai' | 'anthropic' | 'custom';
/**
 * Arbitrary key-value data about the current user.
 * Injected automatically into the system prompt so the chatbot
 * can personalise responses (name, plan, order history, etc.)
 */
interface UserContext {
    name?: string;
    email?: string;
    [key: string]: unknown;
}
interface ChatConfig {
    /** AI provider to use */
    provider: Provider;
    /** API key (use backendUrl for production to keep this secret) */
    apiKey?: string;
    /** Proxy your own backend to avoid exposing API keys */
    backendUrl?: string;
    /** Model identifier */
    model?: string;
    /** System prompt */
    systemPrompt?: string;
    /** Sampling temperature (0-1) */
    temperature?: number;
    /** Max tokens in response */
    maxTokens?: number;
    /** Initial messages to seed the conversation */
    initialMessages?: Message[];
    /**
     * Unique identifier for the current user.
     * Keeps chat history and session isolated per user in memory.
     */
    userId?: string;
    /**
     * Contextual data about the user injected into the system prompt.
     * E.g. { name: 'Hussain', plan: 'premium', recentOrders: ['iPhone 15'] }
     */
    userContext?: UserContext;
    /**
     * Override the auto-generated session ID.
     * Useful if you want to resume a specific conversation.
     */
    sessionId?: string;
}
interface ChatState {
    messages: Message[];
    isLoading: boolean;
    isStreaming: boolean;
    streamingMessage: string;
    error: Error | null;
    /** Unique session ID for this conversation */
    sessionId: string;
    /** The userId this session belongs to */
    userId: string | undefined;
}
interface ChatActions {
    sendMessage: (content: string) => Promise<void>;
    clearHistory: () => void;
    abortResponse: () => void;
    setSystemPrompt: (prompt: string) => void;
    /** Update user context at runtime (e.g. after login or cart update) */
    setUserContext: (ctx: UserContext) => void;
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
 * Supports per-user isolation via userId + sessionId, and personalised
 * responses via userContext.
 *
 * @example
 * const { messages, sendMessage, isStreaming, sessionId } = useChat({
 *   provider: 'openai',
 *   apiKey: 'sk-...',
 *   userId: currentUser.id,
 *   userContext: {
 *     name: currentUser.name,
 *     plan: currentUser.plan,
 *     recentOrders: currentUser.orders,
 *   },
 * });
 */
declare function useChat(config: ChatConfig): ChatHookReturn;

type ChatInstance = ChatState & ChatActions & {
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
declare function createChat(config: ChatConfig): ChatInstance;

declare function generateId(): string;
declare function buildSystemPrompt(basePrompt: string | undefined, userContext: UserContext | undefined): string | undefined;
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

export { type ChatActions, type ChatConfig, type ChatHookReturn, type ChatState, type Message, type Provider, type ProviderAdapter, type Role, type UserContext, anthropicAdapter, buildSystemPrompt, createChat, generateId, getAdapter, openaiAdapter, streamCompletion, useChat };

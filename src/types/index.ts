export type Role = 'user' | 'assistant' | 'system';

export interface Message {
    id: string;
    role: Role;
    content: string;
    createdAt: Date;
}

export type Provider = 'openai' | 'anthropic' | 'custom';

/**
 * Arbitrary key-value data about the current user.
 * Injected automatically into the system prompt so the chatbot
 * can personalise responses (name, plan, order history, etc.)
 */
export interface UserContext {
    name?: string;
    email?: string;
    [key: string]: unknown; // any extra fields: plan, orders, preferences…
}

export interface ChatConfig {
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

export interface ChatState {
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

export interface ChatActions {
    sendMessage: (content: string) => Promise<void>;
    clearHistory: () => void;
    abortResponse: () => void;
    setSystemPrompt: (prompt: string) => void;
    /** Update user context at runtime (e.g. after login or cart update) */
    setUserContext: (ctx: UserContext) => void;
}

export type ChatHookReturn = ChatState & ChatActions;

export interface ProviderAdapter {
    buildRequest(messages: Message[], config: ChatConfig): RequestInit & { url: string };
    parseChunk(chunk: string): string | null;
    isDone(chunk: string): boolean;
}

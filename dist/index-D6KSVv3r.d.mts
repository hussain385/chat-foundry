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
    /**
     * Display name for the AI assistant, e.g. 'Nova'.
     * Injected into the system prompt so the model knows its own name,
     * and shown by the optional UI components.
     */
    assistantName?: string;
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

export type { ChatConfig as C, Message as M, ProviderAdapter as P, Role as R, UserContext as U, ChatHookReturn as a, ChatState as b, ChatActions as c, Provider as d };

import { C as ChatConfig, a as ChatHookReturn, b as ChatState, c as ChatActions, U as UserContext, P as ProviderAdapter, M as Message } from './index-D6KSVv3r.js';
export { d as Provider, R as Role } from './index-D6KSVv3r.js';

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
declare function buildSystemPrompt(basePrompt: string | undefined, userContext: UserContext | undefined, assistantName?: string): string | undefined;
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

export { ChatActions, ChatConfig, ChatHookReturn, ChatState, Message, ProviderAdapter, UserContext, anthropicAdapter, buildSystemPrompt, createChat, generateId, getAdapter, openaiAdapter, streamCompletion, useChat };

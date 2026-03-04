// Types
export type {
    Message,
    Role,
    Provider,
    ChatConfig,
    ChatState,
    ChatActions,
    ChatHookReturn,
    ProviderAdapter,
    UserContext,
} from './types/index';

// React / React Native hook
export { useChat } from './adapters/react';

// Vanilla JS (Vue, Svelte, plain JS)
export { createChat } from './adapters/vanilla';

// Core engine (for building custom adapters)
export { streamCompletion, generateId, getAdapter, buildSystemPrompt } from './core/ChatEngine';

// Provider adapters (for advanced custom usage)
export { openaiAdapter } from './providers/openai';
export { anthropicAdapter } from './providers/anthropic';

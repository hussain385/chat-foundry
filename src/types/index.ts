export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
}

export type Provider = 'openai' | 'anthropic' | 'custom';

export interface ChatConfig {
  provider: Provider;
  apiKey?: string;
  backendUrl?: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  initialMessages?: Message[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingMessage: string;
  error: Error | null;
}

export interface ChatActions {
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
  abortResponse: () => void;
  setSystemPrompt: (prompt: string) => void;
}

export type ChatHookReturn = ChatState & ChatActions;

export interface ProviderAdapter {
  buildRequest(messages: Message[], config: ChatConfig): RequestInit & { url: string };
  parseChunk(chunk: string): string | null;
  isDone(chunk: string): boolean;
}

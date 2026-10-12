import type { Message, ChatConfig, ProviderAdapter } from '../types';

export const anthropicAdapter: ProviderAdapter = {
  buildRequest(messages: Message[], config: ChatConfig) {
    const url =
      config.backendUrl ?? 'https://api.anthropic.com/v1/messages';

    const body = {
      model: config.model ?? 'claude-opus-5-5',
      stream: true,
      // Current models think before answering, and thinking counts toward max_tokens
      max_tokens: config.maxTokens ?? 16000,
      // Current Claude models reject non-default sampling params, so only send when set
      ...(config.temperature !== undefined ? { temperature: config.temperature } : {}),
      // Server-side refusal fallback (Claude API only; proxies may not forward the beta header)
      ...(config.backendUrl ? {} : { fallbacks: 'default' }),
      ...(config.systemPrompt ? { system: config.systemPrompt } : {}),
      messages: messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content })),
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    };

    if (!config.backendUrl) {
      headers['anthropic-beta'] = 'server-side-fallback-2026-07-01';
    }

    if (config.apiKey) {
      headers['x-api-key'] = config.apiKey;
    }

    return {
      url,
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };
  },

  parseChunk(chunk: string): string | null {
    // Anthropic sends: data: {"type":"content_block_delta","delta":{"text":"..."}}
    const line = chunk.trim();
    if (!line.startsWith('data: ')) return null;
    const data = line.slice(6);
    try {
      const parsed = JSON.parse(data);
      // Skip thinking_delta and other non-text deltas
      if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
        return parsed.delta.text ?? null;
      }
      return null;
    } catch {
      return null;
    }
  },

  isDone(chunk: string): boolean {
    try {
      const line = chunk.trim();
      if (!line.startsWith('data: ')) return false;
      const parsed = JSON.parse(line.slice(6));
      return parsed.type === 'message_stop';
    } catch {
      return false;
    }
  },
};

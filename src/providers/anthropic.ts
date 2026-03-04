import type { Message, ChatConfig, ProviderAdapter } from '../types';

export const anthropicAdapter: ProviderAdapter = {
  buildRequest(messages: Message[], config: ChatConfig) {
    const url =
      config.backendUrl ?? 'https://api.anthropic.com/v1/messages';

    const body = {
      model: config.model ?? 'claude-sonnet-4-20250514',
      stream: true,
      max_tokens: config.maxTokens ?? 1024,
      temperature: config.temperature ?? 0.7,
      ...(config.systemPrompt ? { system: config.systemPrompt } : {}),
      messages: messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content })),
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    };

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
      if (parsed.type === 'content_block_delta') {
        return parsed.delta?.text ?? null;
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

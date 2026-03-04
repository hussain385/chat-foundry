import type { Message, ChatConfig, ProviderAdapter } from '../types';

export const openaiAdapter: ProviderAdapter = {
  buildRequest(messages: Message[], config: ChatConfig) {
    const url =
      config.backendUrl ?? 'https://api.openai.com/v1/chat/completions';

    const body = {
      model: config.model ?? 'gpt-4o',
      stream: true,
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 1024,
      messages: [
        ...(config.systemPrompt
          ? [{ role: 'system', content: config.systemPrompt }]
          : []),
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    return {
      url,
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };
  },

  parseChunk(chunk: string): string | null {
    // OpenAI sends: data: {"choices":[{"delta":{"content":"..."}}]}
    const line = chunk.trim();
    if (!line.startsWith('data: ')) return null;
    const data = line.slice(6);
    if (data === '[DONE]') return null;
    try {
      const parsed = JSON.parse(data);
      return parsed.choices?.[0]?.delta?.content ?? null;
    } catch {
      return null;
    }
  },

  isDone(chunk: string): boolean {
    return chunk.trim() === 'data: [DONE]';
  },
};

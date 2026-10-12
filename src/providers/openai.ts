import type { Message, ChatConfig, ProviderAdapter } from '../types';

export const openaiAdapter: ProviderAdapter = {
  buildRequest(messages: Message[], config: ChatConfig) {
    const url =
      config.backendUrl ?? 'https://api.openai.com/v1/chat/completions';

    const body = {
      model: config.model ?? 'gpt-6.1-sol',
      stream: true,
      // Reasoning models reject non-default temperature, so only send when set
      ...(config.temperature !== undefined ? { temperature: config.temperature } : {}),
      // Reasoning models reject max_tokens; this limit also covers reasoning tokens
      max_completion_tokens: config.maxTokens ?? 16000,
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

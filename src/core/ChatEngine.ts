import type { Message, ChatConfig, ProviderAdapter } from '../types';
import { openaiAdapter } from '../providers/openai';
import { anthropicAdapter } from '../providers/anthropic';

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function getAdapter(config: ChatConfig): ProviderAdapter {
  switch (config.provider) {
    case 'openai':
      return openaiAdapter;
    case 'anthropic':
      return anthropicAdapter;
    case 'custom':
      throw new Error(
        '[headless-chat] For "custom" provider, pass a backendUrl that accepts OpenAI-compatible streaming.'
      );
    default:
      throw new Error(`[headless-chat] Unknown provider: ${config.provider}`);
  }
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: Error) => void;
}

/**
 * Streams a chat completion using chunked fetch — works on Web AND React Native.
 * Returns an AbortController so callers can cancel mid-stream.
 */
export function streamCompletion(
  messages: Message[],
  config: ChatConfig,
  callbacks: StreamCallbacks
): AbortController {
  const controller = new AbortController();
  const adapter = getAdapter(config);
  const { url, ...requestInit } = adapter.buildRequest(messages, config);

  let fullText = '';

  (async () => {
    try {
      const response = await fetch(url, {
        ...requestInit,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `[headless-chat] HTTP ${response.status}: ${errorBody}`
        );
      }

      if (!response.body) {
        throw new Error('[headless-chat] Response body is null.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Split on newlines — SSE lines are newline-delimited
        const lines = buffer.split('\n');
        // Keep the last (possibly incomplete) line in the buffer
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          if (adapter.isDone(line)) {
            callbacks.onDone(fullText);
            return;
          }
          const text = adapter.parseChunk(line);
          if (text) {
            fullText += text;
            callbacks.onChunk(text);
          }
        }
      }

      // Flush remaining buffer
      if (buffer.trim()) {
        const text = adapter.parseChunk(buffer);
        if (text) {
          fullText += text;
          callbacks.onChunk(text);
        }
      }

      callbacks.onDone(fullText);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return; // User cancelled
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    }
  })();

  return controller;
}

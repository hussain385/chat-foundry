import type { Message, ChatConfig, ProviderAdapter, UserContext } from '../types/index';
import { openaiAdapter } from '../providers/openai';
import { anthropicAdapter } from '../providers/anthropic';

export function generateId(): string {
    return Math.random().toString(36).slice(2, 11);
}

// ---------------------------------------------------------------------------
// In-memory session store — isolated per userId + sessionId
// ---------------------------------------------------------------------------

interface Session {
    sessionId: string;
    userId: string | undefined;
    messages: Message[];
}

const sessionStore = new Map<string, Session>();

function getSessionKey(userId: string | undefined, sessionId: string): string {
    return `${userId ?? 'anonymous'}::${sessionId}`;
}

export function getSession(userId: string | undefined, sessionId: string): Session {
    const key = getSessionKey(userId, sessionId);
    if (!sessionStore.has(key)) {
        sessionStore.set(key, { sessionId, userId, messages: [] });
    }
    return sessionStore.get(key)!;
}

export function setSessionMessages(
    userId: string | undefined,
    sessionId: string,
    messages: Message[]
): void {
    const key = getSessionKey(userId, sessionId);
    const session = sessionStore.get(key) ?? { sessionId, userId, messages: [] };
    sessionStore.set(key, { ...session, messages });
}

export function clearSession(userId: string | undefined, sessionId: string): void {
    sessionStore.delete(getSessionKey(userId, sessionId));
}

// ---------------------------------------------------------------------------
// UserContext → system prompt injection
// ---------------------------------------------------------------------------

export function buildSystemPrompt(
    basePrompt: string | undefined,
    userContext: UserContext | undefined
): string | undefined {
    if (!userContext || Object.keys(userContext).length === 0) return basePrompt;

    const lines: string[] = ['[Current User Information]'];

    if (userContext.name) lines.push(`- Name: ${userContext.name}`);
    if (userContext.email) lines.push(`- Email: ${userContext.email}`);

    // Append any extra fields generically
    for (const [key, value] of Object.entries(userContext)) {
        if (key === 'name' || key === 'email') continue;
        const formatted = Array.isArray(value) ? value.join(', ') : String(value);
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        lines.push(`- ${label}: ${formatted}`);
    }

    const contextBlock = lines.join('\n');
    return basePrompt ? `${basePrompt}\n\n${contextBlock}` : contextBlock;
}

// ---------------------------------------------------------------------------
// Adapter resolver
// ---------------------------------------------------------------------------

export function getAdapter(config: ChatConfig): ProviderAdapter {
    switch (config.provider) {
        case 'openai':
            return openaiAdapter;
        case 'anthropic':
            return anthropicAdapter;
        case 'custom':
            throw new Error(
                '[chat-foundry] For "custom" provider, pass a backendUrl that accepts OpenAI-compatible streaming.'
            );
        default:
            throw new Error(`[chat-foundry] Unknown provider: ${config.provider}`);
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
                throw new Error(`[chat-foundry] HTTP ${response.status}: ${errorBody}`);
            }

            if (!response.body) {
                throw new Error('[chat-foundry] Response body is null.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split('\n');
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

            if (buffer.trim()) {
                const text = adapter.parseChunk(buffer);
                if (text) {
                    fullText += text;
                    callbacks.onChunk(text);
                }
            }

            callbacks.onDone(fullText);
        } catch (err) {
            if ((err as Error).name === 'AbortError') return;
            callbacks.onError(err instanceof Error ? err : new Error(String(err)));
        }
    })();

    return controller;
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateId, getAdapter } from '../src/core/ChatEngine';
import { openaiAdapter } from '../src/providers/openai';
import { anthropicAdapter } from '../src/providers/anthropic';
import type { ChatConfig, Message } from '../src/types';

const baseMessages: Message[] = [
  { id: '1', role: 'user', content: 'Hello', createdAt: new Date() },
];

// ---------------------------------------------------------------------------
// generateId
// ---------------------------------------------------------------------------
describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId));
    expect(ids.size).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// getAdapter
// ---------------------------------------------------------------------------
describe('getAdapter', () => {
  it('returns openai adapter for openai provider', () => {
    const config: ChatConfig = { provider: 'openai' };
    expect(getAdapter(config)).toBe(openaiAdapter);
  });

  it('returns anthropic adapter for anthropic provider', () => {
    const config: ChatConfig = { provider: 'anthropic' };
    expect(getAdapter(config)).toBe(anthropicAdapter);
  });

  it('throws for custom provider without guidance', () => {
    const config: ChatConfig = { provider: 'custom' };
    expect(() => getAdapter(config)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// OpenAI adapter
// ---------------------------------------------------------------------------
describe('openaiAdapter', () => {
  it('builds correct request URL', () => {
    const config: ChatConfig = { provider: 'openai', apiKey: 'test-key' };
    const { url } = openaiAdapter.buildRequest(baseMessages, config);
    expect(url).toBe('https://api.openai.com/v1/chat/completions');
  });

  it('uses backendUrl when provided', () => {
    const config: ChatConfig = { provider: 'openai', backendUrl: 'https://my.api/chat' };
    const { url } = openaiAdapter.buildRequest(baseMessages, config);
    expect(url).toBe('https://my.api/chat');
  });

  it('includes system prompt in messages', () => {
    const config: ChatConfig = { provider: 'openai', apiKey: 'k', systemPrompt: 'Be helpful' };
    const { body } = openaiAdapter.buildRequest(baseMessages, config);
    const parsed = JSON.parse(body as string);
    expect(parsed.messages[0].role).toBe('system');
    expect(parsed.messages[0].content).toBe('Be helpful');
  });

  it('parses a valid SSE chunk', () => {
    const chunk = `data: {"choices":[{"delta":{"content":"Hello"}}]}`;
    expect(openaiAdapter.parseChunk(chunk)).toBe('Hello');
  });

  it('returns null for [DONE] chunk', () => {
    expect(openaiAdapter.parseChunk('data: [DONE]')).toBeNull();
    expect(openaiAdapter.isDone('data: [DONE]')).toBe(true);
  });

  it('returns null for malformed chunk', () => {
    expect(openaiAdapter.parseChunk('not valid')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Anthropic adapter
// ---------------------------------------------------------------------------
describe('anthropicAdapter', () => {
  it('builds correct request URL', () => {
    const config: ChatConfig = { provider: 'anthropic', apiKey: 'test-key' };
    const { url } = anthropicAdapter.buildRequest(baseMessages, config);
    expect(url).toBe('https://api.anthropic.com/v1/messages');
  });

  it('includes anthropic-version header', () => {
    const config: ChatConfig = { provider: 'anthropic', apiKey: 'k' };
    const req = anthropicAdapter.buildRequest(baseMessages, config);
    const headers = req.headers as Record<string, string>;
    expect(headers['anthropic-version']).toBe('2023-06-01');
  });

  it('puts systemPrompt at top level, not in messages', () => {
    const config: ChatConfig = { provider: 'anthropic', apiKey: 'k', systemPrompt: 'Be terse' };
    const { body } = anthropicAdapter.buildRequest(baseMessages, config);
    const parsed = JSON.parse(body as string);
    expect(parsed.system).toBe('Be terse');
    expect(parsed.messages.every((m: { role: string }) => m.role !== 'system')).toBe(true);
  });

  it('parses a content_block_delta chunk', () => {
    const chunk = `data: {"type":"content_block_delta","delta":{"text":"Hi"}}`;
    expect(anthropicAdapter.parseChunk(chunk)).toBe('Hi');
  });

  it('detects message_stop as done', () => {
    const chunk = `data: {"type":"message_stop"}`;
    expect(anthropicAdapter.isDone(chunk)).toBe(true);
  });
});

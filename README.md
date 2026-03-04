# chat-foundry

A headless, zero-dependency chat logic library for **React**, **React Native**, and **vanilla JS**. Supports **OpenAI** and **Anthropic** with real-time streaming — no UI included, so you bring your own design.

- ✅ Works with any UI framework (React, React Native, Vue, Svelte, plain JS)
- ✅ Streaming out of the box — chunked `fetch`, no `EventSource` (React Native safe)
- ✅ TypeScript-first
- ✅ Zero runtime dependencies
- ✅ Tiny bundle (~3kb gzipped)

---

## Installation

```bash
npm install chat-foundry
```

React is an **optional** peer dependency. Install it only if you're using the `useChat` hook.

---

## Quick Start

### React / React Native

```tsx
import { useChat } from 'chat-foundry';

export function MyChatScreen() {
  const {
    messages,
    sendMessage,
    isLoading,
    isStreaming,
    streamingMessage,
    error,
    clearHistory,
    abortResponse,
  } = useChat({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,   // ⚠️ use backendUrl in production
    model: 'gpt-4o',
    systemPrompt: 'You are a helpful assistant.',
  });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}

      {/* Show partial streamed response */}
      {isStreaming && <div><strong>assistant:</strong> {streamingMessage}</div>}
      {isLoading && <div>Thinking...</div>}
      {error && <div>Error: {error.message}</div>}

      <button onClick={() => sendMessage('Tell me a joke')}>Send</button>
      <button onClick={abortResponse}>Stop</button>
      <button onClick={clearHistory}>Clear</button>
    </div>
  );
}
```

### Anthropic

```tsx
const chat = useChat({
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-sonnet-4-20250514',
  systemPrompt: 'You are a concise assistant.',
});
```

### Vanilla JS (Vue, Svelte, plain JS)

```js
import { createChat } from 'chat-foundry';

const chat = createChat({
  provider: 'openai',
  apiKey: 'sk-...',
});

// Subscribe to state changes
const unsubscribe = chat.subscribe((state) => {
  console.log('messages:', state.messages);
  console.log('streaming:', state.streamingMessage);
});

await chat.sendMessage('Hello!');

// Later
unsubscribe();
```

---

## ⚠️ API Key Security

**Never expose your API key in a client-side app.** Use `backendUrl` to proxy through your own server:

```ts
useChat({
  provider: 'openai',
  backendUrl: 'https://your-api.com/api/chat', // Your backend handles the key
})
```

Your backend receives the same request body and forwards it to OpenAI/Anthropic with the secret key.

---

## Config Options

| Option | Type | Default | Description |
|---|---|---|---|
| `provider` | `'openai' \| 'anthropic' \| 'custom'` | — | **Required.** AI provider |
| `apiKey` | `string` | — | Provider API key (use `backendUrl` in production) |
| `backendUrl` | `string` | — | Your own proxy endpoint |
| `model` | `string` | `gpt-4o` / `claude-sonnet-4-20250514` | Model identifier |
| `systemPrompt` | `string` | — | System-level instructions |
| `temperature` | `number` | `0.7` | Sampling temperature (0–1) |
| `maxTokens` | `number` | `1024` | Max tokens in response |
| `initialMessages` | `Message[]` | `[]` | Seed conversation history |

---

## API Reference

### `useChat(config)` (React / React Native)

Returns a `ChatHookReturn` object:

| Field | Type | Description |
|---|---|---|
| `messages` | `Message[]` | Full conversation history |
| `isLoading` | `boolean` | Waiting for first token |
| `isStreaming` | `boolean` | Tokens are streaming in |
| `streamingMessage` | `string` | Partial message being built |
| `error` | `Error \| null` | Last error, if any |
| `sendMessage(text)` | `(text: string) => Promise<void>` | Send a user message |
| `abortResponse()` | `() => void` | Cancel the current stream |
| `clearHistory()` | `() => void` | Reset conversation |
| `setSystemPrompt(p)` | `(prompt: string) => void` | Override system prompt at runtime |

### `createChat(config)` (Vanilla JS)

Returns same fields as `useChat` plus:

| Field | Type | Description |
|---|---|---|
| `subscribe(fn)` | `(fn: (state) => void) => () => void` | Subscribe to state changes. Returns unsubscribe fn. |

---

## Building a Custom Provider

```ts
import { streamCompletion } from 'chat-foundry';
import type { ProviderAdapter } from 'chat-foundry';

const myAdapter: ProviderAdapter = {
  buildRequest(messages, config) {
    return {
      url: 'https://my-llm.com/v1/stream',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    };
  },
  parseChunk(chunk) {
    // return extracted text, or null
  },
  isDone(chunk) {
    return chunk.includes('[DONE]');
  },
};

// Use streamCompletion directly
const controller = streamCompletion(messages, config, {
  onChunk: (text) => console.log(text),
  onDone: (full) => console.log('Done:', full),
  onError: (err) => console.error(err),
});
```
---

## License

MIT

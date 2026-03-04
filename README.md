# chat-foundry

A headless, zero-dependency chat logic library for **React**, **React Native**, and **vanilla JS**. Supports **OpenAI** and **Anthropic** with real-time streaming — no UI included, so you bring your own design.

Every user gets their own **isolated chat session** with **personalised responses** powered by user context injection.

---

## Why chat-foundry?

- ✅ Works with any UI framework (React, React Native, Vue, Svelte, plain JS)
- ✅ Per-user chat isolation via `userId` + `sessionId`
- ✅ Personalised responses via `userContext` — inject name, plan, orders, anything
- ✅ Streaming out of the box — chunked `fetch`, no `EventSource` (React Native safe)
- ✅ TypeScript-first with full type exports
- ✅ Zero runtime dependencies (~7kb gzipped)

---

## Installation

```bash
npm install chat-foundry
```

React is an **optional** peer dependency. Only needed if you use the `useChat` hook.

---

## Quick Start

### React / React Native

```tsx
import { useChat } from 'chat-foundry';

export function ChatScreen() {
  const {
    messages,
    sendMessage,
    isLoading,
    isStreaming,
    streamingMessage,
    error,
    sessionId,
    clearHistory,
    abortResponse,
  } = useChat({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY, // ⚠️ use backendUrl in production
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
      {isStreaming && <div><strong>assistant:</strong> {streamingMessage}</div>}
      {isLoading && <div>Thinking...</div>}
      {error && <div>Error: {error.message}</div>}

      <button onClick={() => sendMessage('Hello!')}>Send</button>
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

---

## Per-User Chatbot Sessions

Give every user their own isolated chat history and personalised chatbot experience.
Pass `userId` to isolate sessions in memory, and `userContext` to personalise responses.

```tsx
import { useChat } from 'chat-foundry';

export function SupportChat({ currentUser }) {
  const { messages, sendMessage, isStreaming, streamingMessage, setUserContext } = useChat({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,

    // 👤 Isolate chat history per user
    userId: currentUser.id,

    // 🧠 Tell the chatbot who this user is
    userContext: {
      name: currentUser.name,
      email: currentUser.email,
      plan: currentUser.membership,         // e.g. 'premium'
      recentOrders: currentUser.orders,     // e.g. ['iPhone 15', 'AirPods Pro']
      preferences: currentUser.preferences, // e.g. ['fast shipping']
    },

    systemPrompt: 'You are a helpful e-commerce support assistant.',
  });

  // Update context at runtime (e.g. after cart changes)
  const handleCartUpdate = (newCart) => {
    setUserContext({ cartItems: newCart });
  };

  return ( /* your chat UI */ );
}
```

The chatbot automatically receives a system prompt like:

```
You are a helpful e-commerce support assistant.

[Current User Information]
- Name: Hussain
- Email: hussain@example.com
- Plan: premium
- RecentOrders: iPhone 15, AirPods Pro
- Preferences: fast shipping
```

### Multiple users, fully isolated

Different users calling `useChat` with different `userId` values get completely separate conversations — they never see each other's messages.

```tsx
// User A — their own chatbot session
useChat({ provider: 'openai', userId: 'user_001', userContext: { name: 'Alice' } });

// User B — their own chatbot session
useChat({ provider: 'openai', userId: 'user_002', userContext: { name: 'Bob' } });
```

---

## Vanilla JS (Vue, Svelte, plain JS)

```js
import { createChat } from 'chat-foundry';

const chat = createChat({
  provider: 'openai',
  apiKey: 'sk-...',
  userId: currentUser.id,
  userContext: { name: currentUser.name, plan: currentUser.plan },
});

// Subscribe to state changes
const unsubscribe = chat.subscribe((state) => {
  console.log('messages:', state.messages);
  console.log('sessionId:', state.sessionId);
  console.log('streaming:', state.streamingMessage);
});

await chat.sendMessage('What are my recent orders?');

// Update context at runtime
chat.setUserContext({ cartItems: ['MacBook Pro', 'Magic Mouse'] });

// Later
unsubscribe();
```

---

## ⚠️ API Key Security

**Never expose your API key in a client-side app.** Use `backendUrl` to proxy through your own server:

```ts
useChat({
  provider: 'openai',
  backendUrl: 'https://your-api.com/api/chat', // your backend adds the secret key
});
```

---

## Config Options

| Option | Type | Default | Description |
|---|---|---|---|
| `provider` | `'openai' \| 'anthropic' \| 'custom'` | — | **Required.** AI provider |
| `apiKey` | `string` | — | Provider API key (use `backendUrl` in production) |
| `backendUrl` | `string` | — | Your own proxy endpoint |
| `model` | `string` | `gpt-4o` / `claude-sonnet-4-20250514` | Model identifier |
| `systemPrompt` | `string` | — | System-level instructions for the chatbot |
| `temperature` | `number` | `0.7` | Sampling temperature (0–1) |
| `maxTokens` | `number` | `1024` | Max tokens in response |
| `initialMessages` | `Message[]` | `[]` | Seed conversation history |
| `userId` | `string` | — | Unique user ID — isolates chat session in memory |
| `userContext` | `UserContext` | — | User data injected into the chatbot's system prompt |
| `sessionId` | `string` | auto-generated | Override the session ID (e.g. to resume a conversation) |

---

## API Reference

### `useChat(config)` — React / React Native

Returns a `ChatHookReturn` object:

| Field | Type | Description |
|---|---|---|
| `messages` | `Message[]` | Full conversation history |
| `isLoading` | `boolean` | Waiting for first token |
| `isStreaming` | `boolean` | Tokens are streaming in |
| `streamingMessage` | `string` | Partial message being built |
| `error` | `Error \| null` | Last error, if any |
| `sessionId` | `string` | Unique ID for this conversation |
| `userId` | `string \| undefined` | The userId this session belongs to |
| `sendMessage(text)` | `(text: string) => Promise<void>` | Send a user message |
| `abortResponse()` | `() => void` | Cancel the current stream |
| `clearHistory()` | `() => void` | Reset conversation and clear session |
| `setSystemPrompt(p)` | `(prompt: string) => void` | Override system prompt at runtime |
| `setUserContext(ctx)` | `(ctx: UserContext) => void` | Update user context at runtime |

### `createChat(config)` — Vanilla JS

Same fields as `useChat` plus:

| Field | Type | Description |
|---|---|---|
| `subscribe(fn)` | `(fn: (state) => void) => () => void` | Subscribe to state changes. Returns unsubscribe fn. |

### `UserContext`

```ts
interface UserContext {
  name?: string;
  email?: string;
  [key: string]: unknown; // any extra fields: plan, orders, preferences, cartItems…
}
```

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
    // return extracted text token, or null
  },
  isDone(chunk) {
    return chunk.includes('[DONE]');
  },
};
```
---

## License

MIT

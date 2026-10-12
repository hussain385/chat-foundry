import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChatWidget, ChatRoot, ChatMessages, ChatInput, themeToCssVars } from '../src/ui';
import { buildSystemPrompt } from '../src/core/ChatEngine';
import type { ChatHookReturn, Message } from '../src/types';

const msg = (role: Message['role'], content: string): Message => ({
  id: `${role}-${content}`,
  role,
  content,
  createdAt: new Date('2026-01-01T10:00:00Z'),
});

function fakeChat(overrides: Partial<ChatHookReturn> = {}): ChatHookReturn {
  return {
    messages: [],
    isLoading: false,
    isStreaming: false,
    streamingMessage: '',
    error: null,
    sessionId: 's1',
    userId: undefined,
    sendMessage: async () => {},
    clearHistory: () => {},
    abortResponse: () => {},
    setSystemPrompt: () => {},
    setUserContext: () => {},
    ...overrides,
  };
}

describe('assistantName', () => {
  it('is injected into the system prompt', () => {
    expect(buildSystemPrompt('Be helpful.', undefined, 'Nova')).toBe('Your name is Nova.\n\nBe helpful.');
  });

  it('works with no base prompt', () => {
    expect(buildSystemPrompt(undefined, undefined, 'Nova')).toBe('Your name is Nova.');
    expect(buildSystemPrompt(undefined, undefined, '  ')).toBeUndefined();
  });

  it('is shown in the widget header, from config or prop', () => {
    const fromConfig = renderToStaticMarkup(
      <ChatWidget config={{ provider: 'openai', assistantName: 'Nova' }} />
    );
    expect(fromConfig).toContain('>Nova</p>');

    const fromProp = renderToStaticMarkup(<ChatWidget chat={fakeChat()} assistantName="Atlas" />);
    expect(fromProp).toContain('>Atlas</p>');
  });

  it('defaults to "Assistant"', () => {
    expect(renderToStaticMarkup(<ChatWidget chat={fakeChat()} />)).toContain('>Assistant</p>');
  });
});

describe('ChatWidget', () => {
  it('renders messages, hides system messages, and shows the streaming reply', () => {
    const html = renderToStaticMarkup(
      <ChatWidget
        chat={fakeChat({
          messages: [msg('system', 'secret'), msg('user', 'Hi'), msg('assistant', 'Hello!')],
          isStreaming: true,
          streamingMessage: 'Partial',
        })}
      />
    );
    expect(html).toContain('Hi');
    expect(html).toContain('Hello!');
    expect(html).toContain('Partial');
    expect(html).toContain('data-streaming=""');
    expect(html).not.toContain('secret');
    expect(html).toContain('Stop'); // busy -> stop button instead of send
  });

  it('shows welcome message and suggestions only before the first message', () => {
    const empty = renderToStaticMarkup(
      <ChatWidget chat={fakeChat()} welcomeMessage="Ask me anything" suggestions={['Track order']} />
    );
    expect(empty).toContain('Ask me anything');
    expect(empty).toContain('Track order');

    const started = renderToStaticMarkup(
      <ChatWidget chat={fakeChat({ messages: [msg('user', 'Hi')] })} welcomeMessage="Ask me anything" suggestions={['Track order']} />
    );
    expect(started).not.toContain('Ask me anything');
    expect(started).not.toContain('Track order');
  });

  it('applies theme as CSS variables', () => {
    const html = renderToStaticMarkup(
      <ChatWidget chat={fakeChat()} theme={{ primary: '#0ea5e9', userBubbleText: 'white' }} />
    );
    expect(html).toContain('--cf-primary:#0ea5e9');
    expect(html).toContain('--cf-user-bubble-text:white');
    expect(themeToCssVars({ bubbleRadius: '4px' })).toEqual({ '--cf-bubble-radius': '4px' });
  });

  it('merges classNames and styles onto slots', () => {
    const html = renderToStaticMarkup(
      <ChatWidget chat={fakeChat()} classNames={{ header: 'my-header' }} styles={{ input: { fontSize: 18 } }} />
    );
    expect(html).toContain('class="cf-header my-header"');
    expect(html).toContain('font-size:18px');
  });

  it('unstyled drops the stylesheet and cf- classes but keeps slots and user classes', () => {
    const html = renderToStaticMarkup(
      <ChatWidget chat={fakeChat()} unstyled classNames={{ header: 'p-4 border-b' }} />
    );
    expect(html).not.toContain('<style');
    expect(html).not.toMatch(/class="[^"]*\bcf-/);
    expect(html).toContain('data-cf-slot="header"');
    expect(html).toContain('class="p-4 border-b"');
  });

  it('lets users replace components', () => {
    const html = renderToStaticMarkup(
      <ChatWidget
        chat={fakeChat({ messages: [msg('user', 'Hi')] })}
        assistantName="Nova"
        components={{
          Header: ({ assistantName }) => <h1>Custom {assistantName}</h1>,
          Message: ({ message, authorName }) => <p className="custom-msg">{authorName}: {message.content}</p>,
        }}
      />
    );
    expect(html).toContain('<h1>Custom Nova</h1>');
    expect(html).toContain('<p class="custom-msg">You: Hi</p>');
  });

  it('uses custom labels and renderContent', () => {
    const html = renderToStaticMarkup(
      <ChatWidget
        chat={fakeChat({ messages: [msg('assistant', '**bold**')] })}
        labels={{ placeholder: 'Escribe…', send: 'Enviar' }}
        renderContent={(c) => <strong>{c.replace(/\*/g, '')}</strong>}
      />
    );
    expect(html).toContain('placeholder="Escribe…"');
    expect(html).toContain('Enviar');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('floating variant renders a launcher and hides the panel until opened', () => {
    const closed = renderToStaticMarkup(<ChatWidget chat={fakeChat()} variant="floating" />);
    expect(closed).toContain('data-cf-slot="launcher"');
    expect(closed).toContain('aria-expanded="false"');
    expect(closed).toMatch(/data-cf-slot="panel"[^>]*hidden/);

    const open = renderToStaticMarkup(<ChatWidget chat={fakeChat()} variant="floating" defaultOpen position="bottom-left" />);
    expect(open).toContain('aria-expanded="true"');
    expect(open).toContain('data-cf-position="bottom-left"');
    expect(open).not.toMatch(/data-cf-slot="panel"[^>]*hidden/);
  });

  it('supports image URL, emoji and initials avatars', () => {
    const html = (avatar?: string) =>
      renderToStaticMarkup(<ChatWidget chat={fakeChat()} assistantName="Nova Bot" assistantAvatar={avatar} showHeader />);
    expect(html('https://x.com/a.png')).toContain('<img src="https://x.com/a.png"');
    expect(html('🤖')).toContain('🤖');
    expect(html()).toContain('>NB</div>');
  });
});

describe('composable primitives', () => {
  it('ChatRoot lets users build their own layout', () => {
    const html = renderToStaticMarkup(
      <ChatRoot chat={fakeChat({ messages: [msg('user', 'Hi')] })} unstyled>
        <section className="my-layout">
          <ChatMessages />
          <ChatInput />
        </section>
      </ChatRoot>
    );
    expect(html).toContain('<section class="my-layout">');
    expect(html).toContain('Hi');
    expect(html).toContain('<textarea');
    expect(html).not.toContain('data-cf-slot="header"');
  });

  it('throws a helpful error without config or chat', () => {
    expect(() => renderToStaticMarkup(<ChatRoot />)).toThrow(/needs either a `config` or a `chat`/);
  });
});

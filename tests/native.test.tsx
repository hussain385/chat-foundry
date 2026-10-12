import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import type { ReactTestInstance } from 'react-test-renderer';
import type { ChatHookReturn, Message } from '../src/types';

// react-native ships Flow source that Node can't load, so render host-component stand-ins
vi.mock('react-native', async () => {
  const { forwardRef } = await import('react');
  const host = (name: string) => (props: { children?: ReactNode }) => createElement(name, props, props.children);
  const FlatList = forwardRef((props: any, _ref) => {
    const items = props.data.length
      ? props.data.map((item: any) => createElement('Item', { key: props.keyExtractor(item) }, props.renderItem({ item })))
      : props.ListEmptyComponent;
    return createElement('FlatList', { style: props.style }, items, props.ListFooterComponent);
  });
  const Modal = (props: any) => (props.visible ? createElement('Modal', props, props.children) : null);
  const animatedValue = () => ({ interpolate: () => 1 });
  return {
    View: host('View'),
    Text: host('Text'),
    TextInput: host('TextInput'),
    Pressable: host('Pressable'),
    ScrollView: host('ScrollView'),
    Image: host('Image'),
    SafeAreaView: host('SafeAreaView'),
    KeyboardAvoidingView: host('KeyboardAvoidingView'),
    FlatList,
    Modal,
    Platform: { OS: 'ios' },
    useColorScheme: () => 'dark',
    Animated: {
      View: host('AnimatedView'),
      Value: function () { return animatedValue(); },
      loop: () => ({ start() {}, stop() {} }),
      timing: () => ({}),
    },
  };
});

const { ChatWidget, ChatRoot, ChatMessages, ChatInput, resolveTheme } = await import('../src/native');

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
    sendMessage: vi.fn(async () => {}),
    clearHistory: vi.fn(),
    abortResponse: vi.fn(),
    setSystemPrompt: () => {},
    setUserContext: () => {},
    ...overrides,
  };
}

function render(el: ReactNode) {
  let r!: TestRenderer.ReactTestRenderer;
  act(() => {
    r = TestRenderer.create(el as any);
  });
  return r;
}

const texts = (r: TestRenderer.ReactTestRenderer) =>
  r.root.findAll((n) => (n.type as unknown) === 'Text').map((n) => n.children.join(''));

const pressableWithText = (r: TestRenderer.ReactTestRenderer, label: string): ReactTestInstance =>
  r.root.find(
    (n) => (n.type as unknown) === 'Pressable' && n.findAll((c) => (c.type as unknown) === 'Text' && c.children.join('') === label).length > 0
  );

describe('native ChatWidget', () => {
  it('shows the assistant name from config or prop, defaulting to "Assistant"', () => {
    expect(texts(render(<ChatWidget config={{ provider: 'openai', assistantName: 'Nova' }} />))).toContain('Nova');
    expect(texts(render(<ChatWidget chat={fakeChat()} assistantName="Atlas" />))).toContain('Atlas');
    expect(texts(render(<ChatWidget chat={fakeChat()} />))).toContain('Assistant');
  });

  it('renders messages and the streaming reply, hides system messages', () => {
    const r = render(
      <ChatWidget
        chat={fakeChat({
          messages: [msg('system', 'secret'), msg('user', 'Hi'), msg('assistant', 'Hello!')],
          isStreaming: true,
          streamingMessage: 'Partial',
        })}
      />
    );
    const t = texts(r);
    expect(t).toEqual(expect.arrayContaining(['Hi', 'Hello!', 'Partial', 'Stop']));
    expect(t).not.toContain('secret');
  });

  it('suggestions send a message and disappear once the chat starts', () => {
    const chat = fakeChat();
    const r = render(<ChatWidget chat={chat} suggestions={['Track order']} welcomeMessage="Ask me anything" />);
    expect(texts(r)).toContain('Ask me anything');
    act(() => {
      pressableWithText(r, 'Track order').props.onPress();
    });
    expect(chat.sendMessage).toHaveBeenCalledWith('Track order');

    const started = render(<ChatWidget chat={fakeChat({ messages: [msg('user', 'Hi')] })} suggestions={['Track order']} />);
    expect(texts(started)).not.toContain('Track order');
  });

  it('input sends trimmed text and clears; stop aborts while busy', () => {
    const chat = fakeChat();
    const r = render(<ChatWidget chat={chat} />);
    const input = r.root.find((n) => (n.type as unknown) === 'TextInput');
    act(() => input.props.onChangeText('  Hello  '));
    act(() => {
      pressableWithText(r, 'Send').props.onPress();
    });
    expect(chat.sendMessage).toHaveBeenCalledWith('  Hello  ');
    expect(r.root.find((n) => (n.type as unknown) === 'TextInput').props.value).toBe('');

    const busy = fakeChat({ isLoading: true });
    const r2 = render(<ChatWidget chat={busy} />);
    act(() => pressableWithText(r2, 'Stop').props.onPress());
    expect(busy.abortResponse).toHaveBeenCalled();
  });

  it('applies theme overrides and follows the device scheme with colorScheme="auto"', () => {
    const t = resolveTheme('auto', 'dark', { primary: '#22c55e' });
    expect(t.background).toBe('#111318');
    expect(t.userBubble).toBe('#22c55e'); // derived from primary
    expect(resolveTheme('light', 'dark', undefined).background).toBe('#ffffff');

    const r = render(<ChatWidget chat={fakeChat({ messages: [msg('user', 'Hi')] })} theme={{ primary: '#22c55e' }} />);
    const userBubbles = r.root.findAll(
      (n) => (n.type as unknown) === 'View' && [n.props.style].flat(Infinity).some((st: any) => st?.backgroundColor === '#22c55e')
    );
    expect(userBubbles.length).toBeGreaterThan(0);
  });

  it('merges per-slot styles, and unstyled keeps only user styles', () => {
    const r = render(<ChatWidget chat={fakeChat()} styles={{ title: { fontSize: 30 } }} assistantName="Nova" />);
    const title = r.root.find((n) => (n.type as unknown) === 'Text' && n.children.join('') === 'Nova' && n.props.accessibilityRole === 'header');
    expect(title.props.style).toContainEqual({ fontSize: 30 });
    expect(title.props.style.length).toBeGreaterThan(1);

    const u = render(<ChatWidget chat={fakeChat()} unstyled styles={{ title: { fontSize: 30 } }} assistantName="Nova" />);
    const uTitle = u.root.find((n) => (n.type as unknown) === 'Text' && n.props.accessibilityRole === 'header');
    expect(uTitle.props.style).toEqual({ fontSize: 30 });
  });

  it('lets users replace components and labels', () => {
    const r = render(
      <ChatWidget
        chat={fakeChat({ messages: [msg('user', 'Hi')] })}
        assistantName="Nova"
        labels={{ send: 'Enviar' }}
        components={{ Message: ({ message, authorName }) => createElement('Custom', null, `${authorName}: ${message.content}`) }}
      />
    );
    expect(r.root.findAll((n) => (n.type as unknown) === 'Custom')[0]!.children).toEqual(['You: Hi']);
    expect(texts(r)).toContain('Enviar');
  });

  it('supports URL, require() and emoji avatars, with initials as fallback', () => {
    const avatarOf = (src?: any) =>
      render(<ChatWidget chat={fakeChat()} assistantName="Nova Bot" assistantAvatar={src} showHeader={false} />);
    expect(avatarOf('https://x.com/a.png').root.find((n) => (n.type as unknown) === 'Image').props.source).toEqual({ uri: 'https://x.com/a.png' });
    expect(avatarOf(42).root.find((n) => (n.type as unknown) === 'Image').props.source).toBe(42);
    expect(texts(avatarOf('🤖'))).toContain('🤖');
    expect(texts(avatarOf())).toContain('NB');
  });

  it('floating variant opens a sheet from the launcher and closes from the header', () => {
    const r = render(<ChatWidget chat={fakeChat()} variant="floating" assistantName="Nova" />);
    expect(r.root.findAll((n) => (n.type as unknown) === 'Modal')).toHaveLength(0);

    const launcher = r.root.find((n) => (n.type as unknown) === 'Pressable' && n.props.accessibilityLabel === 'Open chat');
    act(() => launcher.props.onPress());
    expect(r.root.findAll((n) => (n.type as unknown) === 'Modal')).toHaveLength(1);

    const close = r.root.find((n) => (n.type as unknown) === 'Pressable' && n.props.accessibilityLabel === 'Close chat' && n.findAll((c) => c.children.includes('✕')).length > 0);
    act(() => close.props.onPress());
    expect(r.root.findAll((n) => (n.type as unknown) === 'Modal')).toHaveLength(0);
  });
});

describe('native primitives', () => {
  it('ChatRoot supports custom layouts', () => {
    const r = render(
      <ChatRoot chat={fakeChat({ messages: [msg('assistant', 'Hey')] })}>
        <ChatMessages />
        <ChatInput />
      </ChatRoot>
    );
    expect(texts(r)).toContain('Hey');
    expect(r.root.findAll((n) => (n.type as unknown) === 'TextInput')).toHaveLength(1);
  });
});

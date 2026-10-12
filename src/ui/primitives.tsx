import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { useChat } from '../adapters/react';
import type { ChatConfig, ChatHookReturn, Message } from '../types/index';
import { DEFAULT_LABELS, initials, isImageUrl } from '../shared/uiHelpers';
import { DEFAULT_CSS, themeToCssVars } from './styles';
import type {
    AvatarSource,
    ChatComponents,
    ChatLabels,
    ChatRootProps,
    ChatSlot,
    HeaderRenderProps,
    InputRenderProps,
    MessageRenderProps,
} from './types';

export { DEFAULT_LABELS };

// Layout effects warn during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function cx(...parts: Array<string | false | undefined>): string | undefined {
    const joined = parts.filter(Boolean).join(' ');
    return joined || undefined;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ChatUIContextValue {
    chat: ChatHookReturn;
    assistantName: string;
    assistantAvatar?: AvatarSource;
    userName: string;
    userAvatar?: AvatarSource;
    labels: ChatLabels;
    components: Partial<ChatComponents>;
    renderContent: (content: string, message: Message) => ReactNode;
    showTimestamps: boolean;
    showAvatars: boolean;
    onClose?: () => void;
    unstyled: boolean;
    /** Props for a slot: built-in class (unless unstyled) + user className/style + data attribute */
    slot: (
        name: ChatSlot,
        builtInClass: string,
        extra?: { className?: string; style?: CSSProperties }
    ) => { className?: string; style?: CSSProperties; 'data-cf-slot': ChatSlot };
}

const ChatUIContext = createContext<ChatUIContextValue | null>(null);

/** Access chat state and UI settings from inside any custom component. */
export function useChatUI(): ChatUIContextValue {
    const ctx = useContext(ChatUIContext);
    if (!ctx) throw new Error('[chat-foundry] Chat UI components must be rendered inside <ChatRoot> or <ChatWidget>.');
    return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

/**
 * Provides chat state and UI settings to every chat-foundry UI component inside it.
 * Pass `config` to let it manage state, or `chat={useChat(config)}` to share your own.
 */
export function ChatRoot(props: ChatRootProps) {
    if (props.chat) return <ChatRootInner {...props} chat={props.chat} />;
    if (!props.config) {
        throw new Error('[chat-foundry] <ChatRoot> needs either a `config` or a `chat` prop.');
    }
    return <ChatRootWithConfig {...props} config={props.config} />;
}

function ChatRootWithConfig(props: ChatRootProps & { config: ChatConfig }) {
    const assistantName = props.assistantName ?? props.config.assistantName;
    const chat = useChat({ ...props.config, assistantName });
    return <ChatRootInner {...props} chat={chat} />;
}

function ChatRootInner(props: ChatRootProps & { chat: ChatHookReturn }) {
    const {
        chat,
        config,
        theme,
        colorScheme = 'light',
        classNames,
        styles,
        unstyled = false,
        components = {},
        labels,
        renderContent,
        showTimestamps = false,
        showAvatars = true,
        variant = 'inline',
        position = 'bottom-right',
        onClose,
        className,
        style,
        children,
    } = props;

    const value = useMemo<ChatUIContextValue>(
        () => ({
            chat,
            assistantName: props.assistantName ?? config?.assistantName ?? 'Assistant',
            assistantAvatar: props.assistantAvatar,
            userName: props.userName ?? labels?.you ?? DEFAULT_LABELS.you,
            userAvatar: props.userAvatar,
            labels: { ...DEFAULT_LABELS, ...labels },
            components,
            renderContent: renderContent ?? ((content) => content),
            showTimestamps,
            showAvatars,
            onClose,
            unstyled,
            slot: (name, builtInClass, extra) => ({
                className: cx(!unstyled && builtInClass, classNames?.[name], extra?.className),
                style: styles?.[name] || extra?.style ? { ...styles?.[name], ...extra?.style } : undefined,
                'data-cf-slot': name,
            }),
        }),
        [
            chat, config?.assistantName, props.assistantName, props.assistantAvatar, props.userName,
            props.userAvatar, labels, components, renderContent, showTimestamps, showAvatars,
            onClose, unstyled, classNames, styles,
        ]
    );

    const rootSlot = value.slot('root', 'cf-root', {
        className,
        style: { ...themeToCssVars(theme), ...style },
    });

    return (
        <ChatUIContext.Provider value={value}>
            <div
                {...rootSlot}
                data-cf-variant={variant}
                data-cf-position={position}
                data-cf-scheme={colorScheme}
                data-cf-unstyled={unstyled ? '' : undefined}
            >
                {!unstyled && <style data-chat-foundry="">{DEFAULT_CSS}</style>}
                {children}
            </div>
        </ChatUIContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

export function ChatPanel({ children, hidden, id }: { children?: ReactNode; hidden?: boolean; id?: string }) {
    const { slot, assistantName, onClose } = useChatUI();
    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape' && onClose) onClose();
    };
    return (
        <div
            {...slot('panel', 'cf-panel')}
            id={id}
            hidden={hidden}
            role="region"
            aria-label={`Chat with ${assistantName}`}
            onKeyDown={onKeyDown}
        >
            {children}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

export function ChatAvatar({ src, name, role }: { src: AvatarSource | undefined; name: string; role: Message['role'] }) {
    const { slot, components, unstyled } = useChatUI();
    if (components.Avatar) return <components.Avatar src={src} name={name} role={role} />;
    let content: ReactNode;
    if (isImageUrl(src)) content = <img src={src} alt="" />;
    else if (typeof src === 'string') content = <span className={unstyled ? undefined : 'cf-avatar-glyph'}>{src}</span>; // emoji / text
    else content = src ?? initials(name);
    return (
        <div {...slot('avatar', 'cf-avatar')} data-role={role} aria-hidden="true">
            {content}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

export function ChatHeader({ subtitle, showClearButton = true }: { subtitle?: ReactNode; showClearButton?: boolean }) {
    const { slot, components, chat, assistantName, assistantAvatar, labels, showAvatars, onClose, unstyled } = useChatUI();
    const headerProps: HeaderRenderProps = {
        assistantName,
        subtitle,
        avatar: assistantAvatar,
        onClear: chat.clearHistory,
        onClose,
    };
    if (components.Header) return <components.Header {...headerProps} />;

    return (
        <div {...slot('header', 'cf-header')}>
            {showAvatars && <ChatAvatar src={assistantAvatar} name={assistantName} role="assistant" />}
            <div className={unstyled ? undefined : 'cf-header-text'}>
                <p {...slot('title', 'cf-title')}>{assistantName}</p>
                {subtitle && <span {...slot('subtitle', 'cf-subtitle')}>{subtitle}</span>}
            </div>
            <div {...slot('headerActions', 'cf-header-actions')}>
                {showClearButton && chat.messages.length > 0 && (
                    <button type="button" {...slot('headerButton', 'cf-header-button')} onClick={chat.clearHistory}>
                        {labels.clear}
                    </button>
                )}
                {onClose && (
                    <button
                        type="button"
                        {...slot('headerButton', 'cf-header-button')}
                        onClick={onClose}
                        aria-label={labels.close}
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export function ChatMessage({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
    const ctx = useChatUI();
    const { slot, components, renderContent, showTimestamps, showAvatars } = ctx;
    const isUser = message.role === 'user';
    const props: MessageRenderProps = {
        message,
        isStreaming: !!isStreaming,
        authorName: isUser ? ctx.userName : ctx.assistantName,
        avatar: isUser ? ctx.userAvatar : ctx.assistantAvatar,
    };
    if (components.Message) return <components.Message {...props} />;

    return (
        <div {...slot('message', 'cf-message')} data-role={message.role} data-streaming={isStreaming ? '' : undefined}>
            {/* User avatars only appear when one is provided */}
            {showAvatars && (!isUser || ctx.userAvatar) && (
                <ChatAvatar src={props.avatar} name={props.authorName} role={message.role} />
            )}
            <div className={ctx.unstyled ? undefined : 'cf-message-body'}>
                <div {...slot('bubble', 'cf-bubble')}>{renderContent(message.content, message)}</div>
                {showTimestamps && (
                    <span {...slot('meta', 'cf-meta')}>
                        {props.authorName} · {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
}

export function ChatTypingIndicator() {
    const { slot, components, assistantName, labels } = useChatUI();
    if (components.TypingIndicator) return <components.TypingIndicator assistantName={assistantName} />;
    return (
        <div {...slot('typing', 'cf-typing')} role="status" aria-label={`${assistantName} ${labels.typing}`}>
            <span />
            <span />
            <span />
        </div>
    );
}

export function ChatEmptyState({ welcomeMessage }: { welcomeMessage?: ReactNode }) {
    const { slot, components, assistantName, assistantAvatar, unstyled } = useChatUI();
    if (components.EmptyState) return <components.EmptyState assistantName={assistantName} welcomeMessage={welcomeMessage} />;
    return (
        <div {...slot('emptyState', 'cf-empty')}>
            <ChatAvatar src={assistantAvatar} name={assistantName} role="assistant" />
            <div className={unstyled ? undefined : 'cf-empty-title'}>{assistantName}</div>
            {welcomeMessage && <div>{welcomeMessage}</div>}
        </div>
    );
}

export function ChatMessages({ welcomeMessage }: { welcomeMessage?: ReactNode }) {
    const { slot, chat } = useChatUI();
    const listRef = useRef<HTMLDivElement>(null);
    const stickToBottom = useRef(true);
    const visible = chat.messages.filter((m) => m.role !== 'system');

    // Follow new content only while the user is already at the bottom
    const onScroll = () => {
        const el = listRef.current;
        if (el) stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    };
    useIsomorphicLayoutEffect(() => {
        const el = listRef.current;
        if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
    }, [visible.length, chat.streamingMessage, chat.isLoading]);

    const streaming: Message | null = chat.isStreaming
        ? { id: 'cf-streaming', role: 'assistant', content: chat.streamingMessage, createdAt: new Date() }
        : null;

    return (
        <div {...slot('messages', 'cf-messages')} ref={listRef} onScroll={onScroll} role="log" aria-live="polite">
            {visible.length === 0 && !streaming && !chat.isLoading && <ChatEmptyState welcomeMessage={welcomeMessage} />}
            {visible.map((m) => (
                <ChatMessage key={m.id} message={m} />
            ))}
            {streaming && <ChatMessage message={streaming} isStreaming />}
            {chat.isLoading && <ChatTypingIndicator />}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Suggestions & error
// ---------------------------------------------------------------------------

/** Quick-reply chips. By default only shown before the first message. */
export function ChatSuggestions({ suggestions, alwaysShow = false }: { suggestions: string[]; alwaysShow?: boolean }) {
    const { slot, chat } = useChatUI();
    if (suggestions.length === 0) return null;
    if (!alwaysShow && chat.messages.some((m) => m.role !== 'system')) return null;
    const busy = chat.isLoading || chat.isStreaming;
    return (
        <div {...slot('suggestions', 'cf-suggestions')}>
            {suggestions.map((s) => (
                <button key={s} type="button" {...slot('suggestion', 'cf-suggestion')} disabled={busy} onClick={() => chat.sendMessage(s)}>
                    {s}
                </button>
            ))}
        </div>
    );
}

export function ChatError() {
    const { slot, chat, labels } = useChatUI();
    if (!chat.error) return null;
    return (
        <div {...slot('error', 'cf-error')} role="alert">
            {labels.errorPrefix} {chat.error.message}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export function ChatInput({ autoFocus }: { autoFocus?: boolean }) {
    const { slot, components, chat, labels } = useChatUI();
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isBusy = chat.isLoading || chat.isStreaming;

    const submit = useCallback(() => {
        if (!value.trim() || isBusy) return;
        chat.sendMessage(value);
        setValue('');
    }, [value, isBusy, chat]);

    // Grow the textarea with its content (capped by CSS max-height)
    useIsomorphicLayoutEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    const inputProps: InputRenderProps = {
        value,
        setValue,
        submit,
        stop: chat.abortResponse,
        isBusy,
        placeholder: labels.placeholder,
    };
    if (components.Input) return <components.Input {...inputProps} />;

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter sends, Shift+Enter adds a newline; ignore Enter while an IME is composing
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <form
            {...slot('inputArea', 'cf-input-area')}
            onSubmit={(e) => {
                e.preventDefault();
                submit();
            }}
        >
            <textarea
                {...slot('input', 'cf-input')}
                ref={textareaRef}
                rows={1}
                value={value}
                placeholder={labels.placeholder}
                aria-label={labels.placeholder}
                autoFocus={autoFocus}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
            />
            {isBusy ? (
                <button type="button" {...slot('stopButton', 'cf-stop-button')} onClick={chat.abortResponse}>
                    {labels.stop}
                </button>
            ) : (
                <button type="submit" {...slot('sendButton', 'cf-send-button')} disabled={!value.trim()}>
                    {labels.send}
                </button>
            )}
        </form>
    );
}

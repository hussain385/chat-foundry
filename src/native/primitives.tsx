import { createContext, isValidElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
    Animated,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
    useColorScheme,
} from 'react-native';
import type { ImageSourcePropType, NativeScrollEvent, NativeSyntheticEvent, StyleProp } from 'react-native';
import { useChat } from '../adapters/react';
import type { ChatConfig, ChatHookReturn, Message } from '../types/index';
import { DEFAULT_LABELS, initials, isImageUrl } from '../shared/uiHelpers';
import type { AvatarSource, ChatComponents, ChatLabels, InputRenderProps } from '../shared/uiTypes';
import { makeStyles, resolveTheme } from './theme';
import type { NativeBuiltInStyles } from './theme';
import type { NativeAvatarSource, NativeChatRootProps, NativeChatSlot, NativeChatTheme } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStyle = StyleProp<any>;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface NativeChatUIContextValue {
    chat: ChatHookReturn;
    assistantName: string;
    assistantAvatar?: NativeAvatarSource;
    userName: string;
    userAvatar?: NativeAvatarSource;
    labels: ChatLabels;
    components: Partial<ChatComponents>;
    renderContent: (content: string, message: Message) => ReactNode;
    showTimestamps: boolean;
    showAvatars: boolean;
    onClose?: () => void;
    theme: NativeChatTheme;
    /** Built-in styles derived from the theme (empty when unstyled) */
    base: NativeBuiltInStyles;
    /** Merge built-in styles for a slot with the user's `styles[slot]` */
    s: (name: NativeChatSlot, ...builtIn: AnyStyle[]) => AnyStyle;
}

const NativeChatUIContext = createContext<NativeChatUIContextValue | null>(null);

/** Access chat state, theme and settings from inside any custom component. */
export function useChatUI(): NativeChatUIContextValue {
    const ctx = useContext(NativeChatUIContext);
    if (!ctx) throw new Error('[chat-foundry] Chat UI components must be rendered inside <ChatRoot> or <ChatWidget>.');
    return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

/**
 * Provides chat state, theme and settings to every chat-foundry native component inside it.
 * Pass `config` to let it manage state, or `chat={useChat(config)}` to share your own.
 */
export function ChatRoot(props: NativeChatRootProps) {
    if (props.chat) return <ChatRootInner {...props} chat={props.chat} />;
    if (!props.config) {
        throw new Error('[chat-foundry] <ChatRoot> needs either a `config` or a `chat` prop.');
    }
    return <ChatRootWithConfig {...props} config={props.config} />;
}

function ChatRootWithConfig(props: NativeChatRootProps & { config: ChatConfig }) {
    const assistantName = props.assistantName ?? props.config.assistantName;
    const chat = useChat({ ...props.config, assistantName });
    return <ChatRootInner {...props} chat={chat} />;
}

function ChatRootInner(props: NativeChatRootProps & { chat: ChatHookReturn }) {
    const {
        chat,
        config,
        theme: themeOverrides,
        colorScheme = 'light',
        styles,
        unstyled = false,
        components = {},
        labels,
        renderContent,
        showTimestamps = false,
        showAvatars = true,
        onClose,
        style,
        children,
    } = props;

    const deviceScheme = useColorScheme();
    const theme = useMemo(
        () => resolveTheme(colorScheme, deviceScheme, themeOverrides),
        [colorScheme, deviceScheme, themeOverrides]
    );
    const base = useMemo(() => makeStyles(theme), [theme]);

    const value = useMemo<NativeChatUIContextValue>(
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
            theme,
            base,
            s: (name, ...builtIn) => (unstyled ? styles?.[name] : [...builtIn, styles?.[name]]),
        }),
        [
            chat, config?.assistantName, props.assistantName, props.assistantAvatar, props.userName,
            props.userAvatar, labels, components, renderContent, showTimestamps, showAvatars,
            onClose, theme, base, unstyled, styles,
        ]
    );

    return (
        <NativeChatUIContext.Provider value={value}>
            <View style={value.s('root', base.root, style)}>{children}</View>
        </NativeChatUIContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

export function ChatPanel({ children }: { children?: ReactNode }) {
    const { s, base, assistantName } = useChatUI();
    return (
        <View style={s('panel', base.panel)} accessibilityLabel={`Chat with ${assistantName}`}>
            {children}
        </View>
    );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function toImageSource(src: NativeAvatarSource | undefined): ImageSourcePropType | null {
    if (isImageUrl(src)) return { uri: src };
    if (typeof src === 'number') return src; // require('./avatar.png')
    if (src && typeof src === 'object' && !isValidElement(src) && ('uri' in src || Array.isArray(src))) {
        return src as ImageSourcePropType;
    }
    return null;
}

export function ChatAvatar({ src, name, role }: { src: NativeAvatarSource | undefined; name: string; role: Message['role'] }) {
    const { s, base, components } = useChatUI();
    if (components.Avatar) return <components.Avatar src={src as AvatarSource} name={name} role={role} />;

    const image = toImageSource(src);
    let content: ReactNode;
    if (image) content = <Image source={image} style={{ width: '100%', height: '100%' }} accessibilityIgnoresInvertColors />;
    else if (typeof src === 'string') content = <Text style={s('avatarText', base.avatarText, base.avatarGlyph)}>{src}</Text>; // emoji / text
    else if (src == null) content = <Text style={s('avatarText', base.avatarText)}>{initials(name)}</Text>;
    else content = src as ReactNode;

    return (
        <View style={s('avatar', base.avatar)} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
            {content}
        </View>
    );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

export function ChatHeader({ subtitle, showClearButton = true }: { subtitle?: ReactNode; showClearButton?: boolean }) {
    const { s, base, components, chat, assistantName, assistantAvatar, labels, showAvatars, onClose } = useChatUI();
    if (components.Header) {
        return (
            <components.Header
                assistantName={assistantName}
                subtitle={subtitle}
                avatar={assistantAvatar as AvatarSource}
                onClear={chat.clearHistory}
                onClose={onClose}
            />
        );
    }

    return (
        <View style={s('header', base.header)}>
            {showAvatars && <ChatAvatar src={assistantAvatar} name={assistantName} role="assistant" />}
            <View style={base.headerText}>
                <Text style={s('title', base.title)} accessibilityRole="header" numberOfLines={1}>
                    {assistantName}
                </Text>
                {subtitle != null && (typeof subtitle === 'string'
                    ? <Text style={s('subtitle', base.subtitle)} numberOfLines={1}>{subtitle}</Text>
                    : subtitle)}
            </View>
            {showClearButton && chat.messages.length > 0 && (
                <Pressable style={s('headerButton', base.headerButton)} onPress={chat.clearHistory} accessibilityRole="button">
                    <Text style={s('headerButtonText', base.headerButtonText)}>{labels.clear}</Text>
                </Pressable>
            )}
            {onClose && (
                <Pressable
                    style={s('headerButton', base.headerButton)}
                    onPress={onClose}
                    accessibilityRole="button"
                    accessibilityLabel={labels.close}
                    hitSlop={8}
                >
                    <Text style={s('headerButtonText', base.headerButtonText)}>✕</Text>
                </Pressable>
            )}
        </View>
    );
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export function ChatMessage({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
    const ctx = useChatUI();
    const { s, base, components, renderContent, showTimestamps, showAvatars } = ctx;
    const isUser = message.role === 'user';
    const authorName = isUser ? ctx.userName : ctx.assistantName;
    const avatar = isUser ? ctx.userAvatar : ctx.assistantAvatar;

    if (components.Message) {
        return (
            <components.Message
                message={message}
                isStreaming={!!isStreaming}
                authorName={authorName}
                avatar={avatar as AvatarSource}
            />
        );
    }

    const rendered = renderContent(message.content, message);
    return (
        <View style={s('message', base.message, isUser && base.messageUser)} accessibilityLabel={`${authorName}: ${message.content}`}>
            {/* User avatars only appear when one is provided */}
            {showAvatars && (!isUser || ctx.userAvatar) && <ChatAvatar src={avatar} name={authorName} role={message.role} />}
            <View style={[base.messageBody, isUser && base.messageBodyUser]}>
                <View style={s('bubble', base.bubble, isUser && base.bubbleUser)}>
                    {typeof rendered === 'string' ? (
                        <Text style={s('bubbleText', base.bubbleText, isUser && base.bubbleTextUser)} selectable>
                            {rendered}
                        </Text>
                    ) : (
                        rendered
                    )}
                </View>
                {showTimestamps && (
                    <Text style={s('meta', base.meta)}>
                        {authorName} · {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                )}
            </View>
        </View>
    );
}

export function ChatTypingIndicator() {
    const { s, base, components, assistantName, labels } = useChatUI();
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(Animated.timing(progress, { toValue: 1, duration: 1200, useNativeDriver: true }));
        loop.start();
        return () => loop.stop();
    }, [progress]);

    if (components.TypingIndicator) return <components.TypingIndicator assistantName={assistantName} />;

    // Each dot pulses a little after the previous one
    const dot = (offset: number) => ({
        opacity: progress.interpolate({
            inputRange: [0, offset, offset + 0.2, offset + 0.4, 1],
            outputRange: [0.3, 0.3, 1, 0.3, 0.3],
        }),
    });
    return (
        <View style={s('typing', base.typing)} accessibilityRole="text" accessibilityLabel={`${assistantName} ${labels.typing}`}>
            {[0, 0.15, 0.3].map((o) => (
                <Animated.View key={o} style={[base.typingDot, dot(o)]} />
            ))}
        </View>
    );
}

export function ChatEmptyState({ welcomeMessage }: { welcomeMessage?: ReactNode }) {
    const { s, base, components, assistantName, assistantAvatar } = useChatUI();
    if (components.EmptyState) return <components.EmptyState assistantName={assistantName} welcomeMessage={welcomeMessage} />;
    return (
        <View style={s('emptyState', base.emptyState)}>
            <ChatAvatar src={assistantAvatar} name={assistantName} role="assistant" />
            <Text style={s('emptyTitle', base.emptyTitle)}>{assistantName}</Text>
            {welcomeMessage != null && (typeof welcomeMessage === 'string'
                ? <Text style={s('emptyText', base.emptyText)}>{welcomeMessage}</Text>
                : welcomeMessage)}
        </View>
    );
}

export function ChatMessages({ welcomeMessage }: { welcomeMessage?: ReactNode }) {
    const { s, base, chat } = useChatUI();
    const listRef = useRef<FlatList<Message>>(null);
    const stickToBottom = useRef(true);

    const data = useMemo(() => {
        const visible = chat.messages.filter((m) => m.role !== 'system');
        if (!chat.isStreaming) return visible;
        const streaming: Message = { id: 'cf-streaming', role: 'assistant', content: chat.streamingMessage, createdAt: new Date() };
        return [...visible, streaming];
    }, [chat.messages, chat.isStreaming, chat.streamingMessage]);

    // Follow new content only while the user is already at the bottom
    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
        stickToBottom.current = contentSize.height - contentOffset.y - layoutMeasurement.height < 40;
    };

    return (
        <FlatList
            ref={listRef}
            style={s('messages', base.messages)}
            contentContainerStyle={base.messagesContent}
            data={data}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => <ChatMessage message={item} isStreaming={item.id === 'cf-streaming'} />}
            ListEmptyComponent={chat.isLoading ? null : <ChatEmptyState welcomeMessage={welcomeMessage} />}
            ListFooterComponent={chat.isLoading ? <ChatTypingIndicator /> : null}
            onScroll={onScroll}
            scrollEventThrottle={100}
            onContentSizeChange={() => {
                if (stickToBottom.current) listRef.current?.scrollToEnd({ animated: true });
            }}
            keyboardShouldPersistTaps="handled"
            accessibilityLiveRegion="polite"
        />
    );
}

// ---------------------------------------------------------------------------
// Suggestions & error
// ---------------------------------------------------------------------------

/** Quick-reply chips. By default only shown before the first message. */
export function ChatSuggestions({ suggestions, alwaysShow = false }: { suggestions: string[]; alwaysShow?: boolean }) {
    const { s, base, chat } = useChatUI();
    if (suggestions.length === 0) return null;
    if (!alwaysShow && chat.messages.some((m) => m.role !== 'system')) return null;
    const busy = chat.isLoading || chat.isStreaming;
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={s('suggestions', base.suggestions)}
            keyboardShouldPersistTaps="handled"
        >
            {suggestions.map((text) => (
                <Pressable
                    key={text}
                    style={s('suggestion', base.suggestion, busy && base.disabled)}
                    disabled={busy}
                    onPress={() => chat.sendMessage(text)}
                    accessibilityRole="button"
                >
                    <Text style={s('suggestionText', base.suggestionText)}>{text}</Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}

export function ChatError() {
    const { s, base, chat, labels } = useChatUI();
    if (!chat.error) return null;
    return (
        <View style={s('error', base.error)} accessibilityRole="alert">
            <Text style={s('errorText', base.errorText)}>
                {labels.errorPrefix} {chat.error.message}
            </Text>
        </View>
    );
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export function ChatInput({ autoFocus }: { autoFocus?: boolean }) {
    const { s, base, components, chat, labels, theme } = useChatUI();
    const [value, setValue] = useState('');
    const isBusy = chat.isLoading || chat.isStreaming;

    const submit = useCallback(() => {
        if (!value.trim() || isBusy) return;
        chat.sendMessage(value);
        setValue('');
    }, [value, isBusy, chat]);

    const inputProps: InputRenderProps = {
        value,
        setValue,
        submit,
        stop: chat.abortResponse,
        isBusy,
        placeholder: labels.placeholder,
    };
    if (components.Input) return <components.Input {...inputProps} />;

    const canSend = value.trim().length > 0;
    return (
        <View style={s('inputArea', base.inputArea)}>
            <TextInput
                style={s('input', base.input)}
                value={value}
                onChangeText={setValue}
                placeholder={labels.placeholder}
                placeholderTextColor={theme.mutedText}
                accessibilityLabel={labels.placeholder}
                autoFocus={autoFocus}
                multiline
                textAlignVertical="center"
            />
            {isBusy ? (
                <Pressable
                    style={s('stopButton', base.stopButton)}
                    onPress={chat.abortResponse}
                    accessibilityRole="button"
                >
                    <Text style={s('buttonText', base.buttonText, base.stopButtonText)}>{labels.stop}</Text>
                </Pressable>
            ) : (
                <Pressable
                    style={s('sendButton', base.sendButton, !canSend && base.disabled)}
                    onPress={submit}
                    disabled={!canSend}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !canSend }}
                >
                    <Text style={s('buttonText', base.buttonText)}>{labels.send}</Text>
                </Pressable>
            )}
        </View>
    );
}

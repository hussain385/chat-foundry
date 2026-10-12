import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { ImageSourcePropType, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { C as ChatConfig, a as ChatHookReturn, M as Message } from './index-D6KSVv3r.js';
import { A as AvatarSource, C as ColorScheme, a as ChatComponents, b as ChatLabels } from './uiHelpers-Cnx4pB4t.js';
export { D as DEFAULT_LABELS, H as HeaderRenderProps, I as InputRenderProps, M as MessageRenderProps } from './uiHelpers-Cnx4pB4t.js';

/** Image URL, `require('./avatar.png')`, `{ uri }`, emoji/text, or any React node. */
type NativeAvatarSource = AvatarSource | ImageSourcePropType;
/**
 * Every styleable part of the native UI. Same names as the web UI, plus text parts,
 * because React Native text doesn't inherit styles from its container.
 */
type NativeChatSlot = 'root' | 'launcher' | 'launcherText' | 'panel' | 'header' | 'avatar' | 'avatarText' | 'title' | 'subtitle' | 'headerButton' | 'headerButtonText' | 'messages' | 'message' | 'bubble' | 'bubbleText' | 'meta' | 'emptyState' | 'emptyTitle' | 'emptyText' | 'suggestions' | 'suggestion' | 'suggestionText' | 'typing' | 'error' | 'errorText' | 'inputArea' | 'input' | 'sendButton' | 'stopButton' | 'buttonText';
type NativeChatStyles = Partial<Record<NativeChatSlot, StyleProp<ViewStyle & TextStyle & ImageStyle>>>;
/** Design tokens. Same names as the web theme; sizes are numbers (density-independent pixels). */
interface NativeChatTheme {
    primary: string;
    primaryText: string;
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    border: string;
    danger: string;
    userBubble: string;
    userBubbleText: string;
    assistantBubble: string;
    assistantBubbleText: string;
    radius: number;
    bubbleRadius: number;
    fontSize: number;
    fontFamily?: string;
}
interface NativeChatRootProps {
    /** Config passed to the built-in `useChat`. Ignored when `chat` is provided. */
    config?: ChatConfig;
    /** Bring your own headless state: `chat={useChat(config)}` */
    chat?: ChatHookReturn;
    /** AI display name. Defaults to `config.assistantName`, then 'Assistant'. */
    assistantName?: string;
    assistantAvatar?: NativeAvatarSource;
    userName?: string;
    /** User messages only show an avatar when this is set */
    userAvatar?: NativeAvatarSource;
    theme?: Partial<NativeChatTheme>;
    /** 'auto' follows the device setting. Default: 'light' */
    colorScheme?: ColorScheme;
    styles?: NativeChatStyles;
    /** Drop all built-in styles; only your `styles` apply */
    unstyled?: boolean;
    components?: Partial<ChatComponents>;
    labels?: Partial<ChatLabels>;
    /** Render message content. Return a string to keep the built-in text style, or any node. */
    renderContent?: (content: string, message: Message) => ReactNode;
    showTimestamps?: boolean;
    showAvatars?: boolean;
    /** When set, the header shows a close button */
    onClose?: () => void;
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
}

interface ChatWidgetProps extends Omit<NativeChatRootProps, 'children' | 'onClose'> {
    /** Shown under the assistant name in the header */
    subtitle?: ReactNode;
    /** Shown before the first message */
    welcomeMessage?: ReactNode;
    /** Quick-reply chips shown before the first message */
    suggestions?: string[];
    showHeader?: boolean;
    showClearButton?: boolean;
    /**
     * 'inline' fills its parent (use it as a screen).
     * 'floating' shows a launcher button that opens the chat as a sheet.
     */
    variant?: 'inline' | 'floating';
    position?: 'bottom-right' | 'bottom-left';
    /** Floating variant: start opened (uncontrolled) */
    defaultOpen?: boolean;
    /** Floating variant: controlled open state */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Content of the launcher button. Default: 💬 */
    launcherIcon?: ReactNode;
    /** Inline variant: offset for KeyboardAvoidingView, e.g. your navigation header height */
    keyboardVerticalOffset?: number;
}
/**
 * Drop-in chat UI for React Native. Every part can be themed, restyled or replaced —
 * see `theme`, `styles`, `unstyled`, `components` and `labels`.
 *
 * @example
 * <ChatWidget
 *   config={{ provider: 'anthropic', backendUrl: 'https://api.example.com/chat' }}
 *   assistantName="Nova"
 *   colorScheme="auto"
 * />
 */
declare function ChatWidget(props: ChatWidgetProps): react_jsx_runtime.JSX.Element;
declare function ChatLauncher({ open, toggle, position, icon, }: {
    open: boolean;
    toggle: () => void;
    position?: 'bottom-right' | 'bottom-left';
    icon?: ReactNode;
}): react_jsx_runtime.JSX.Element;

/** Picks the light/dark base, applies overrides, then derives bubble colors from the result. */
declare function resolveTheme(scheme: ColorScheme, deviceScheme: string | null | undefined, overrides: Partial<NativeChatTheme> | undefined): NativeChatTheme;
/** Built-in styles for every slot, derived from the theme. */
declare function makeStyles(t: NativeChatTheme): {
    root: {
        flex: number;
    };
    panel: {
        flex: number;
        backgroundColor: string;
        borderRadius: number;
        overflow: "hidden";
    };
    header: {
        flexDirection: "row";
        alignItems: "center";
        gap: number;
        paddingHorizontal: number;
        paddingVertical: number;
        borderBottomWidth: number;
        borderBottomColor: string;
        backgroundColor: string;
    };
    headerText: {
        flex: number;
        minWidth: number;
    };
    title: {
        fontWeight: "600";
        fontSize: number;
        fontFamily: string;
        color: string;
    } | {
        fontWeight: "600";
        fontSize: number;
        fontFamily?: undefined;
        color: string;
    };
    subtitle: {
        color: string;
        fontSize: number;
        fontFamily: string;
    } | {
        color: string;
        fontSize: number;
        fontFamily?: undefined;
    };
    headerButton: {
        paddingHorizontal: number;
        paddingVertical: number;
        borderRadius: number;
    };
    headerButtonText: {
        color: string;
        fontSize: number;
        fontFamily: string;
    } | {
        color: string;
        fontSize: number;
        fontFamily?: undefined;
    };
    avatar: {
        width: number;
        height: number;
        borderRadius: number;
        overflow: "hidden";
        alignItems: "center";
        justifyContent: "center";
        backgroundColor: string;
    };
    avatarText: {
        fontWeight: "600";
        fontSize: number;
        fontFamily: string;
        color: string;
    } | {
        fontWeight: "600";
        fontSize: number;
        fontFamily?: undefined;
        color: string;
    };
    avatarGlyph: {
        fontSize: number;
        fontWeight: "400";
    };
    messages: {
        flex: number;
    };
    messagesContent: {
        padding: number;
        gap: number;
        flexGrow: number;
    };
    message: {
        flexDirection: "row";
        alignItems: "flex-end";
        gap: number;
    };
    messageUser: {
        flexDirection: "row-reverse";
    };
    messageBody: {
        maxWidth: "80%";
        gap: number;
    };
    messageBodyUser: {
        alignItems: "flex-end";
    };
    bubble: {
        paddingHorizontal: number;
        paddingVertical: number;
        borderRadius: number;
        backgroundColor: string;
    };
    bubbleUser: {
        backgroundColor: string;
    };
    bubbleText: {
        color: string;
        lineHeight: number;
        fontFamily: string;
        fontSize: number;
    } | {
        color: string;
        lineHeight: number;
        fontFamily?: undefined;
        fontSize: number;
    };
    bubbleTextUser: {
        color: string;
    };
    meta: {
        color: string;
        fontSize: number;
        paddingHorizontal: number;
        fontFamily: string;
    } | {
        color: string;
        fontSize: number;
        paddingHorizontal: number;
        fontFamily?: undefined;
    };
    emptyState: {
        flex: number;
        alignItems: "center";
        justifyContent: "center";
        gap: number;
        padding: number;
    };
    emptyTitle: {
        fontWeight: "600";
        fontSize: number;
        fontFamily: string;
        color: string;
    } | {
        fontWeight: "600";
        fontSize: number;
        fontFamily?: undefined;
        color: string;
    };
    emptyText: {
        color: string;
        textAlign: "center";
        fontFamily: string;
        fontSize: number;
    } | {
        color: string;
        textAlign: "center";
        fontFamily?: undefined;
        fontSize: number;
    };
    suggestions: {
        paddingHorizontal: number;
        paddingBottom: number;
        gap: number;
    };
    suggestion: {
        borderWidth: number;
        borderColor: string;
        backgroundColor: string;
        borderRadius: number;
        paddingHorizontal: number;
        paddingVertical: number;
    };
    suggestionText: {
        fontSize: number;
        fontFamily: string;
        color: string;
    } | {
        fontSize: number;
        fontFamily?: undefined;
        color: string;
    };
    typing: {
        flexDirection: "row";
        gap: number;
        paddingHorizontal: number;
        paddingVertical: number;
    };
    typingDot: {
        width: number;
        height: number;
        borderRadius: number;
        backgroundColor: string;
    };
    error: {
        marginHorizontal: number;
        marginBottom: number;
        padding: number;
        borderRadius: number;
        backgroundColor: string;
    };
    errorText: {
        color: string;
        fontSize: number;
        fontFamily: string;
    } | {
        color: string;
        fontSize: number;
        fontFamily?: undefined;
    };
    inputArea: {
        flexDirection: "row";
        alignItems: "flex-end";
        gap: number;
        paddingHorizontal: number;
        paddingVertical: number;
        borderTopWidth: number;
        borderTopColor: string;
        backgroundColor: string;
    };
    input: {
        flex: number;
        minHeight: number;
        maxHeight: number;
        paddingHorizontal: number;
        paddingTop: number;
        paddingBottom: number;
        borderRadius: number;
        borderWidth: number;
        borderColor: string;
        backgroundColor: string;
        fontFamily: string;
        color: string;
        fontSize: number;
    } | {
        flex: number;
        minHeight: number;
        maxHeight: number;
        paddingHorizontal: number;
        paddingTop: number;
        paddingBottom: number;
        borderRadius: number;
        borderWidth: number;
        borderColor: string;
        backgroundColor: string;
        fontFamily?: undefined;
        color: string;
        fontSize: number;
    };
    sendButton: {
        height: number;
        paddingHorizontal: number;
        borderRadius: number;
        alignItems: "center";
        justifyContent: "center";
        backgroundColor: string;
    };
    stopButton: {
        height: number;
        paddingHorizontal: number;
        borderRadius: number;
        alignItems: "center";
        justifyContent: "center";
        backgroundColor: string;
        borderWidth: number;
        borderColor: string;
    };
    buttonText: {
        color: string;
        fontWeight: "600";
        fontFamily: string;
        fontSize: number;
    } | {
        color: string;
        fontWeight: "600";
        fontFamily?: undefined;
        fontSize: number;
    };
    stopButtonText: {
        color: string;
    };
    disabled: {
        opacity: number;
    };
    launcher: {
        position: "absolute";
        bottom: number;
        width: number;
        height: number;
        borderRadius: number;
        alignItems: "center";
        justifyContent: "center";
        backgroundColor: string;
        shadowColor: string;
        shadowOpacity: number;
        shadowRadius: number;
        shadowOffset: {
            width: number;
            height: number;
        };
        elevation: number;
    };
    launcherText: {
        fontSize: number;
        color: string;
    };
};
type NativeBuiltInStyles = ReturnType<typeof makeStyles>;

type AnyStyle = StyleProp<any>;
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
/** Access chat state, theme and settings from inside any custom component. */
declare function useChatUI(): NativeChatUIContextValue;
/**
 * Provides chat state, theme and settings to every chat-foundry native component inside it.
 * Pass `config` to let it manage state, or `chat={useChat(config)}` to share your own.
 */
declare function ChatRoot(props: NativeChatRootProps): react_jsx_runtime.JSX.Element;
declare function ChatPanel({ children }: {
    children?: ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function ChatAvatar({ src, name, role }: {
    src: NativeAvatarSource | undefined;
    name: string;
    role: Message['role'];
}): react_jsx_runtime.JSX.Element;
declare function ChatHeader({ subtitle, showClearButton }: {
    subtitle?: ReactNode;
    showClearButton?: boolean;
}): react_jsx_runtime.JSX.Element;
declare function ChatMessage({ message, isStreaming }: {
    message: Message;
    isStreaming?: boolean;
}): react_jsx_runtime.JSX.Element;
declare function ChatTypingIndicator(): react_jsx_runtime.JSX.Element;
declare function ChatEmptyState({ welcomeMessage }: {
    welcomeMessage?: ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function ChatMessages({ welcomeMessage }: {
    welcomeMessage?: ReactNode;
}): react_jsx_runtime.JSX.Element;
/** Quick-reply chips. By default only shown before the first message. */
declare function ChatSuggestions({ suggestions, alwaysShow }: {
    suggestions: string[];
    alwaysShow?: boolean;
}): react_jsx_runtime.JSX.Element | null;
declare function ChatError(): react_jsx_runtime.JSX.Element | null;
declare function ChatInput({ autoFocus }: {
    autoFocus?: boolean;
}): react_jsx_runtime.JSX.Element;

export { type NativeAvatarSource as AvatarSource, ChatAvatar, ChatComponents, ChatEmptyState, ChatError, ChatHeader, ChatInput, ChatLabels, ChatLauncher, ChatMessage, ChatMessages, ChatPanel, ChatRoot, type NativeChatRootProps as ChatRootProps, type NativeChatSlot as ChatSlot, type NativeChatStyles as ChatStyles, ChatSuggestions, type NativeChatTheme as ChatTheme, ChatTypingIndicator, ChatWidget, type ChatWidgetProps, ColorScheme, resolveTheme, useChatUI };

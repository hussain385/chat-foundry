import type { ReactNode } from 'react';
import type { ImageSourcePropType, ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { ChatConfig, ChatHookReturn, Message } from '../types/index';
import type { AvatarSource, ChatComponents, ChatLabels, ColorScheme } from '../shared/uiTypes';

export type {
    ChatComponents,
    ChatLabels,
    ColorScheme,
    HeaderRenderProps,
    InputRenderProps,
    MessageRenderProps,
} from '../shared/uiTypes';

/** Image URL, `require('./avatar.png')`, `{ uri }`, emoji/text, or any React node. */
export type NativeAvatarSource = AvatarSource | ImageSourcePropType;

/**
 * Every styleable part of the native UI. Same names as the web UI, plus text parts,
 * because React Native text doesn't inherit styles from its container.
 */
export type NativeChatSlot =
    | 'root'
    | 'launcher'
    | 'launcherText'
    | 'panel'
    | 'header'
    | 'avatar'
    | 'avatarText'
    | 'title'
    | 'subtitle'
    | 'headerButton'
    | 'headerButtonText'
    | 'messages'
    | 'message'
    | 'bubble'
    | 'bubbleText'
    | 'meta'
    | 'emptyState'
    | 'emptyTitle'
    | 'emptyText'
    | 'suggestions'
    | 'suggestion'
    | 'suggestionText'
    | 'typing'
    | 'error'
    | 'errorText'
    | 'inputArea'
    | 'input'
    | 'sendButton'
    | 'stopButton'
    | 'buttonText';

export type NativeChatStyles = Partial<Record<NativeChatSlot, StyleProp<ViewStyle & TextStyle & ImageStyle>>>;

/** Design tokens. Same names as the web theme; sizes are numbers (density-independent pixels). */
export interface NativeChatTheme {
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

export interface NativeChatRootProps {
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

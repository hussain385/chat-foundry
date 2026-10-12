import type { CSSProperties, ReactNode } from 'react';
import type { ChatConfig, ChatHookReturn, Message } from '../types/index';
import type { AvatarSource, ChatComponents, ChatLabels, ColorScheme } from '../shared/uiTypes';

export type {
    AvatarSource,
    ChatComponents,
    ChatLabels,
    ColorScheme,
    HeaderRenderProps,
    InputRenderProps,
    MessageRenderProps,
} from '../shared/uiTypes';

/** Every styleable part of the UI. Each renders with `data-cf-slot="<name>"`. */
export type ChatSlot =
    | 'root'
    | 'launcher'
    | 'panel'
    | 'header'
    | 'avatar'
    | 'title'
    | 'subtitle'
    | 'headerActions'
    | 'headerButton'
    | 'messages'
    | 'message'
    | 'bubble'
    | 'meta'
    | 'emptyState'
    | 'suggestions'
    | 'suggestion'
    | 'typing'
    | 'error'
    | 'inputArea'
    | 'input'
    | 'sendButton'
    | 'stopButton';

export type ChatClassNames = Partial<Record<ChatSlot, string>>;
export type ChatStyles = Partial<Record<ChatSlot, CSSProperties>>;

/** Design tokens, applied as `--cf-*` CSS variables. Any CSS value is accepted. */
export interface ChatTheme {
    primary: string;
    primaryText: string;
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    border: string;
    userBubble: string;
    userBubbleText: string;
    assistantBubble: string;
    assistantBubbleText: string;
    radius: string;
    bubbleRadius: string;
    fontFamily: string;
    fontSize: string;
    width: string;
    height: string;
    shadow: string;
    zIndex: string;
}

/** Shared props for ChatRoot and ChatWidget. */
export interface ChatRootProps {
    /** Config passed to the built-in `useChat`. Ignored when `chat` is provided. */
    config?: ChatConfig;
    /** Bring your own headless state: `chat={useChat(config)}` */
    chat?: ChatHookReturn;
    /** AI display name. Defaults to `config.assistantName`, then 'Assistant'. */
    assistantName?: string;
    assistantAvatar?: AvatarSource;
    userName?: string;
    /** User messages only show an avatar when this is set */
    userAvatar?: AvatarSource;
    theme?: Partial<ChatTheme>;
    colorScheme?: ColorScheme;
    classNames?: ChatClassNames;
    styles?: ChatStyles;
    /** Drop all built-in styles and `cf-*` classes. Keeps structure, `data-cf-slot` attributes and your classNames. */
    unstyled?: boolean;
    components?: Partial<ChatComponents>;
    labels?: Partial<ChatLabels>;
    /** Render message content, e.g. with a markdown library. Default: plain text. */
    renderContent?: (content: string, message: Message) => ReactNode;
    showTimestamps?: boolean;
    showAvatars?: boolean;
    /** 'inline' fills its container; 'floating' pins to a screen corner. Default: 'inline' */
    variant?: 'inline' | 'floating';
    position?: 'bottom-right' | 'bottom-left';
    /** When set, the header shows a close button and Escape calls it */
    onClose?: () => void;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

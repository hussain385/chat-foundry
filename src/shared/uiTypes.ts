import type { ComponentType, ReactNode } from 'react';
import type { Message } from '../types/index';

// Types shared by the web UI (chat-foundry/ui) and the React Native UI (chat-foundry/native).

export type ColorScheme = 'light' | 'dark' | 'auto';

/** Every user-facing string, for i18n or tone changes. */
export interface ChatLabels {
    placeholder: string;
    send: string;
    stop: string;
    clear: string;
    open: string;
    close: string;
    typing: string;
    errorPrefix: string;
    you: string;
}

/** An avatar can be an image URL or any React node (emoji, icon, initials). */
export type AvatarSource = string | ReactNode;

export interface MessageRenderProps {
    message: Message;
    /** True for the in-progress assistant message while tokens stream in */
    isStreaming: boolean;
    /** Display name for the message author */
    authorName: string;
    avatar: AvatarSource | undefined;
}

export interface HeaderRenderProps {
    assistantName: string;
    subtitle?: ReactNode;
    avatar: AvatarSource | undefined;
    onClear: () => void;
    onClose?: () => void;
}

export interface InputRenderProps {
    value: string;
    setValue: (value: string) => void;
    submit: () => void;
    stop: () => void;
    isBusy: boolean;
    placeholder: string;
}

/** Swap any built-in piece for your own component. */
export interface ChatComponents {
    Header: ComponentType<HeaderRenderProps>;
    Message: ComponentType<MessageRenderProps>;
    Avatar: ComponentType<{ src: AvatarSource | undefined; name: string; role: Message['role'] }>;
    Input: ComponentType<InputRenderProps>;
    EmptyState: ComponentType<{ assistantName: string; welcomeMessage?: ReactNode }>;
    TypingIndicator: ComponentType<{ assistantName: string }>;
    Launcher: ComponentType<{ open: boolean; toggle: () => void; assistantName: string }>;
}

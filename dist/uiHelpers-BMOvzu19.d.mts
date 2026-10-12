import { ReactNode, ComponentType } from 'react';
import { M as Message } from './index-D6KSVv3r.mjs';

type ColorScheme = 'light' | 'dark' | 'auto';
/** Every user-facing string, for i18n or tone changes. */
interface ChatLabels {
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
type AvatarSource = string | ReactNode;
interface MessageRenderProps {
    message: Message;
    /** True for the in-progress assistant message while tokens stream in */
    isStreaming: boolean;
    /** Display name for the message author */
    authorName: string;
    avatar: AvatarSource | undefined;
}
interface HeaderRenderProps {
    assistantName: string;
    subtitle?: ReactNode;
    avatar: AvatarSource | undefined;
    onClear: () => void;
    onClose?: () => void;
}
interface InputRenderProps {
    value: string;
    setValue: (value: string) => void;
    submit: () => void;
    stop: () => void;
    isBusy: boolean;
    placeholder: string;
}
/** Swap any built-in piece for your own component. */
interface ChatComponents {
    Header: ComponentType<HeaderRenderProps>;
    Message: ComponentType<MessageRenderProps>;
    Avatar: ComponentType<{
        src: AvatarSource | undefined;
        name: string;
        role: Message['role'];
    }>;
    Input: ComponentType<InputRenderProps>;
    EmptyState: ComponentType<{
        assistantName: string;
        welcomeMessage?: ReactNode;
    }>;
    TypingIndicator: ComponentType<{
        assistantName: string;
    }>;
    Launcher: ComponentType<{
        open: boolean;
        toggle: () => void;
        assistantName: string;
    }>;
}

declare const DEFAULT_LABELS: ChatLabels;

export { type AvatarSource as A, type ColorScheme as C, DEFAULT_LABELS as D, type HeaderRenderProps as H, type InputRenderProps as I, type MessageRenderProps as M, type ChatComponents as a, type ChatLabels as b };

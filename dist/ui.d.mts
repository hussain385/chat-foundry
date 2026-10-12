import * as react_jsx_runtime from 'react/jsx-runtime';
import { CSSProperties, ReactNode } from 'react';
import { C as ChatConfig, a as ChatHookReturn, M as Message } from './index-D6KSVv3r.mjs';
import { A as AvatarSource, C as ColorScheme, a as ChatComponents, b as ChatLabels } from './uiHelpers-BMOvzu19.mjs';
export { D as DEFAULT_LABELS, H as HeaderRenderProps, I as InputRenderProps, M as MessageRenderProps } from './uiHelpers-BMOvzu19.mjs';

/** Every styleable part of the UI. Each renders with `data-cf-slot="<name>"`. */
type ChatSlot = 'root' | 'launcher' | 'panel' | 'header' | 'avatar' | 'title' | 'subtitle' | 'headerActions' | 'headerButton' | 'messages' | 'message' | 'bubble' | 'meta' | 'emptyState' | 'suggestions' | 'suggestion' | 'typing' | 'error' | 'inputArea' | 'input' | 'sendButton' | 'stopButton';
type ChatClassNames = Partial<Record<ChatSlot, string>>;
type ChatStyles = Partial<Record<ChatSlot, CSSProperties>>;
/** Design tokens, applied as `--cf-*` CSS variables. Any CSS value is accepted. */
interface ChatTheme {
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
interface ChatRootProps {
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

interface ChatWidgetProps extends Omit<ChatRootProps, 'children' | 'onClose'> {
    /** Shown under the assistant name in the header, e.g. 'Typically replies instantly' */
    subtitle?: ReactNode;
    /** Shown before the first message */
    welcomeMessage?: ReactNode;
    /** Quick-reply chips shown before the first message */
    suggestions?: string[];
    showHeader?: boolean;
    showClearButton?: boolean;
    /** Floating variant: start opened (uncontrolled) */
    defaultOpen?: boolean;
    /** Floating variant: controlled open state */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Content of the launcher button (floating variant). Default: chat icon */
    launcherIcon?: ReactNode;
}
/**
 * Drop-in chat UI. Every part can be themed, restyled or replaced — see
 * `theme`, `classNames`, `styles`, `unstyled`, `components` and `labels`.
 *
 * @example
 * <ChatWidget
 *   config={{ provider: 'anthropic', backendUrl: '/api/chat' }}
 *   assistantName="Nova"
 *   variant="floating"
 *   theme={{ primary: '#0ea5e9' }}
 * />
 */
declare function ChatWidget(props: ChatWidgetProps): react_jsx_runtime.JSX.Element;
declare function ChatLauncher({ open, toggle, panelId, icon, }: {
    open: boolean;
    toggle: () => void;
    panelId?: string;
    icon?: ReactNode;
}): react_jsx_runtime.JSX.Element;

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
    slot: (name: ChatSlot, builtInClass: string, extra?: {
        className?: string;
        style?: CSSProperties;
    }) => {
        className?: string;
        style?: CSSProperties;
        'data-cf-slot': ChatSlot;
    };
}
/** Access chat state and UI settings from inside any custom component. */
declare function useChatUI(): ChatUIContextValue;
/**
 * Provides chat state and UI settings to every chat-foundry UI component inside it.
 * Pass `config` to let it manage state, or `chat={useChat(config)}` to share your own.
 */
declare function ChatRoot(props: ChatRootProps): react_jsx_runtime.JSX.Element;
declare function ChatPanel({ children, hidden, id }: {
    children?: ReactNode;
    hidden?: boolean;
    id?: string;
}): react_jsx_runtime.JSX.Element;
declare function ChatAvatar({ src, name, role }: {
    src: AvatarSource | undefined;
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

/** Converts theme keys to `--cf-*` CSS variables, e.g. userBubble -> --cf-user-bubble */
declare function themeToCssVars(theme: Partial<ChatTheme> | undefined): CSSProperties;
/**
 * Default stylesheet. Everything is driven by CSS variables and low-specificity
 * `:where()` selectors, so user classNames always win without `!important`.
 */
declare const DEFAULT_CSS = "\n:where(.cf-root) {\n  --cf-primary: #4f46e5;\n  --cf-primary-text: #ffffff;\n  --cf-background: #ffffff;\n  --cf-surface: #f6f7f9;\n  --cf-text: #111827;\n  --cf-muted-text: #6b7280;\n  --cf-border: #e5e7eb;\n  --cf-user-bubble: var(--cf-primary);\n  --cf-user-bubble-text: var(--cf-primary-text);\n  --cf-assistant-bubble: var(--cf-surface);\n  --cf-assistant-bubble-text: var(--cf-text);\n  --cf-radius: 16px;\n  --cf-bubble-radius: 14px;\n  --cf-font-family: ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif;\n  --cf-font-size: 14px;\n  --cf-width: 380px;\n  --cf-height: 560px;\n  --cf-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);\n  --cf-z-index: 2147483000;\n  font-family: var(--cf-font-family);\n  font-size: var(--cf-font-size);\n  color: var(--cf-text);\n  line-height: 1.5;\n  box-sizing: border-box;\n}\n:where(.cf-root) *, :where(.cf-root) *::before, :where(.cf-root) *::after { box-sizing: inherit; }\n:where(.cf-root[data-cf-scheme=\"dark\"]) {\n  --cf-primary: #818cf8;\n  --cf-primary-text: #0b1020;\n  --cf-background: #111318;\n  --cf-surface: #1d2028;\n  --cf-text: #e5e7eb;\n  --cf-muted-text: #9ca3af;\n  --cf-border: #2b2f3a;}\n@media (prefers-color-scheme: dark) {\n  :where(.cf-root[data-cf-scheme=\"auto\"]) {\n  --cf-primary: #818cf8;\n  --cf-primary-text: #0b1020;\n  --cf-background: #111318;\n  --cf-surface: #1d2028;\n  --cf-text: #e5e7eb;\n  --cf-muted-text: #9ca3af;\n  --cf-border: #2b2f3a;}\n}\n:where(.cf-panel) {\n  display: flex; flex-direction: column;\n  width: 100%; height: 100%; min-height: 0;\n  background: var(--cf-background);\n  border: 1px solid var(--cf-border);\n  border-radius: var(--cf-radius);\n  overflow: hidden;\n}\n:where(.cf-panel[hidden]) { display: none; }\n:where(.cf-root[data-cf-variant=\"inline\"]) { width: 100%; height: var(--cf-height); }\n:where(.cf-root[data-cf-variant=\"floating\"]) {\n  position: fixed; bottom: 20px; z-index: var(--cf-z-index);\n  display: flex; flex-direction: column; align-items: flex-end; gap: 12px;\n}\n:where(.cf-root[data-cf-variant=\"floating\"][data-cf-position=\"bottom-right\"]) { right: 20px; }\n:where(.cf-root[data-cf-variant=\"floating\"][data-cf-position=\"bottom-left\"]) { left: 20px; align-items: flex-start; }\n:where(.cf-root[data-cf-variant=\"floating\"]) :where(.cf-panel) {\n  width: min(var(--cf-width), calc(100vw - 40px));\n  height: min(var(--cf-height), calc(100vh - 120px));\n  box-shadow: var(--cf-shadow);\n}\n:where(.cf-launcher) {\n  width: 56px; height: 56px; border-radius: 999px; border: 0; cursor: pointer;\n  background: var(--cf-primary); color: var(--cf-primary-text);\n  box-shadow: var(--cf-shadow);\n  display: grid; place-items: center;\n  transition: transform 0.15s ease;\n}\n:where(.cf-launcher):hover { transform: scale(1.05); }\n:where(.cf-header) {\n  display: flex; align-items: center; gap: 10px;\n  padding: 12px 14px; border-bottom: 1px solid var(--cf-border);\n  background: var(--cf-background);\n}\n:where(.cf-header-text) { display: flex; flex-direction: column; min-width: 0; flex: 1; }\n:where(.cf-title) { font-weight: 600; font-size: 1.05em; margin: 0; }\n:where(.cf-subtitle) { color: var(--cf-muted-text); font-size: 0.85em; }\n:where(.cf-header-actions) { display: flex; gap: 4px; }\n:where(.cf-header-button) {\n  border: 0; background: transparent; color: var(--cf-muted-text); cursor: pointer;\n  padding: 6px 8px; border-radius: 8px; font: inherit; font-size: 0.85em;\n}\n:where(.cf-header-button):hover { background: var(--cf-surface); color: var(--cf-text); }\n:where(.cf-avatar) {\n  width: 32px; height: 32px; flex: none; border-radius: 999px; overflow: hidden;\n  display: grid; place-items: center;\n  background: var(--cf-surface); color: var(--cf-text); font-weight: 600; font-size: 0.85em;\n}\n:where(.cf-avatar) img { width: 100%; height: 100%; object-fit: cover; }\n:where(.cf-avatar-glyph) { font-size: 1.6em; font-weight: 400; line-height: 1; }\n:where(.cf-messages) {\n  flex: 1; min-height: 0; overflow-y: auto;\n  padding: 16px 14px; display: flex; flex-direction: column; gap: 12px;\n}\n:where(.cf-message) { display: flex; gap: 8px; align-items: flex-end; max-width: 100%; }\n:where(.cf-message[data-role=\"user\"]) { flex-direction: row-reverse; }\n:where(.cf-message-body) { display: flex; flex-direction: column; gap: 2px; max-width: 80%; min-width: 0; }\n:where(.cf-message[data-role=\"user\"]) :where(.cf-message-body) { align-items: flex-end; }\n:where(.cf-bubble) {\n  padding: 9px 13px; border-radius: var(--cf-bubble-radius);\n  white-space: pre-wrap; overflow-wrap: anywhere;\n  background: var(--cf-assistant-bubble); color: var(--cf-assistant-bubble-text);\n}\n:where(.cf-message[data-role=\"user\"]) :where(.cf-bubble) {\n  background: var(--cf-user-bubble); color: var(--cf-user-bubble-text);\n}\n:where(.cf-meta) { font-size: 0.75em; color: var(--cf-muted-text); padding: 0 4px; }\n:where(.cf-empty) {\n  margin: auto; text-align: center; color: var(--cf-muted-text);\n  display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px;\n}\n:where(.cf-empty-title) { color: var(--cf-text); font-weight: 600; font-size: 1.1em; }\n:where(.cf-suggestions) { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; }\n:where(.cf-suggestion) {\n  border: 1px solid var(--cf-border); background: var(--cf-background); color: var(--cf-text);\n  border-radius: 999px; padding: 6px 12px; cursor: pointer; font: inherit; font-size: 0.85em;\n}\n:where(.cf-suggestion):hover { border-color: var(--cf-primary); color: var(--cf-primary); }\n:where(.cf-typing) { display: inline-flex; gap: 4px; padding: 12px 14px; }\n:where(.cf-typing) span {\n  width: 6px; height: 6px; border-radius: 999px; background: var(--cf-muted-text);\n  animation: cf-bounce 1.2s infinite ease-in-out;\n}\n:where(.cf-typing) span:nth-child(2) { animation-delay: 0.15s; }\n:where(.cf-typing) span:nth-child(3) { animation-delay: 0.3s; }\n@keyframes cf-bounce { 0%, 80%, 100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }\n@media (prefers-reduced-motion: reduce) { :where(.cf-typing) span { animation: none; } }\n:where(.cf-error) {\n  margin: 0 14px 10px; padding: 8px 12px; border-radius: 10px; font-size: 0.85em;\n  background: rgba(220, 38, 38, 0.1); color: #dc2626;\n}\n:where(.cf-input-area) {\n  display: flex; gap: 8px; align-items: flex-end;\n  padding: 10px 12px; border-top: 1px solid var(--cf-border); background: var(--cf-background);\n}\n:where(.cf-input) {\n  flex: 1; resize: none; max-height: 140px; min-height: 40px;\n  padding: 9px 12px; border-radius: 12px; border: 1px solid var(--cf-border);\n  background: var(--cf-surface); color: var(--cf-text); font: inherit; outline: none;\n}\n:where(.cf-input):focus { border-color: var(--cf-primary); }\n:where(.cf-input):focus-visible {\n  outline: none;\n  box-shadow: 0 0 0 3px color-mix(in srgb, var(--cf-primary) 25%, transparent);\n}\n:where(.cf-send-button), :where(.cf-stop-button) {\n  height: 40px; padding: 0 14px; border-radius: 12px; border: 0; cursor: pointer;\n  background: var(--cf-primary); color: var(--cf-primary-text); font: inherit; font-weight: 600;\n}\n:where(.cf-send-button):disabled { opacity: 0.5; cursor: not-allowed; }\n:where(.cf-stop-button) { background: var(--cf-surface); color: var(--cf-text); border: 1px solid var(--cf-border); }\n:where(.cf-root) :focus-visible { outline: 2px solid var(--cf-primary); outline-offset: 2px; }\n";

export { AvatarSource, ChatAvatar, type ChatClassNames, ChatComponents, ChatEmptyState, ChatError, ChatHeader, ChatInput, ChatLabels, ChatLauncher, ChatMessage, ChatMessages, ChatPanel, ChatRoot, type ChatRootProps, type ChatSlot, type ChatStyles, ChatSuggestions, type ChatTheme, ChatTypingIndicator, ChatWidget, type ChatWidgetProps, ColorScheme, DEFAULT_CSS, themeToCssVars, useChatUI };

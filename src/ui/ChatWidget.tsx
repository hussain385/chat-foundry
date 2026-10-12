import { useCallback, useId, useState } from 'react';
import type { ReactNode } from 'react';
import {
    ChatError,
    ChatHeader,
    ChatInput,
    ChatMessages,
    ChatPanel,
    ChatRoot,
    ChatSuggestions,
    useChatUI,
} from './primitives';
import type { ChatRootProps } from './types';

export interface ChatWidgetProps extends Omit<ChatRootProps, 'children' | 'onClose'> {
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

const ChatIcon = (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
const CloseIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

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
export function ChatWidget(props: ChatWidgetProps) {
    const {
        subtitle,
        welcomeMessage,
        suggestions = [],
        showHeader = true,
        showClearButton = true,
        defaultOpen = false,
        open: openProp,
        onOpenChange,
        launcherIcon,
        variant = 'inline',
        ...rootProps
    } = props;

    const [openState, setOpenState] = useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : openState;
    const setOpen = useCallback(
        (next: boolean) => {
            if (!isControlled) setOpenState(next);
            onOpenChange?.(next);
        },
        [isControlled, onOpenChange]
    );

    const isFloating = variant === 'floating';
    const panelId = useId();

    return (
        <ChatRoot {...rootProps} variant={variant} onClose={isFloating ? () => setOpen(false) : undefined}>
            <ChatPanel id={panelId} hidden={isFloating && !open}>
                {showHeader && <ChatHeader subtitle={subtitle} showClearButton={showClearButton} />}
                <ChatMessages welcomeMessage={welcomeMessage} />
                <ChatSuggestions suggestions={suggestions} />
                <ChatError />
                <ChatInput autoFocus={isFloating && open} />
            </ChatPanel>
            {isFloating && (
                <ChatLauncher open={open} toggle={() => setOpen(!open)} panelId={panelId} icon={launcherIcon} />
            )}
        </ChatRoot>
    );
}

export function ChatLauncher({
    open,
    toggle,
    panelId,
    icon,
}: {
    open: boolean;
    toggle: () => void;
    panelId?: string;
    icon?: ReactNode;
}) {
    const { slot, components, assistantName, labels } = useChatUI();
    if (components.Launcher) return <components.Launcher open={open} toggle={toggle} assistantName={assistantName} />;
    return (
        <button
            type="button"
            {...slot('launcher', 'cf-launcher')}
            onClick={toggle}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? labels.close : labels.open}
        >
            {open ? CloseIcon : icon ?? ChatIcon}
        </button>
    );
}

import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, Text } from 'react-native';
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
import type { NativeChatRootProps } from './types';

export interface ChatWidgetProps extends Omit<NativeChatRootProps, 'children' | 'onClose'> {
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
export function ChatWidget(props: ChatWidgetProps) {
    const {
        subtitle,
        welcomeMessage,
        suggestions = [],
        showHeader = true,
        showClearButton = true,
        variant = 'inline',
        position = 'bottom-right',
        defaultOpen = false,
        open: openProp,
        onOpenChange,
        launcherIcon,
        keyboardVerticalOffset = 0,
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
    const body = (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <ChatPanel>
                {showHeader && <ChatHeader subtitle={subtitle} showClearButton={showClearButton} />}
                <ChatMessages welcomeMessage={welcomeMessage} />
                <ChatSuggestions suggestions={suggestions} />
                <ChatError />
                <ChatInput autoFocus={isFloating && open} />
            </ChatPanel>
        </KeyboardAvoidingView>
    );

    if (!isFloating) return <ChatRoot {...rootProps}>{body}</ChatRoot>;

    return (
        <ChatRoot
            {...rootProps}
            onClose={() => setOpen(false)}
            // Floating root overlays the screen without blocking touches
            style={[{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, pointerEvents: 'box-none' }, rootProps.style]}
        >
            <FloatingLayer open={open} setOpen={setOpen} position={position} launcherIcon={launcherIcon}>
                {body}
            </FloatingLayer>
        </ChatRoot>
    );
}

function FloatingLayer({
    open,
    setOpen,
    position,
    launcherIcon,
    children,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    position: 'bottom-right' | 'bottom-left';
    launcherIcon?: ReactNode;
    children: ReactNode;
}) {
    const { theme } = useChatUI();
    return (
        <>
            <ChatLauncher open={open} toggle={() => setOpen(!open)} position={position} icon={launcherIcon} />
            <Modal
                visible={open}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setOpen(false)} // Android back button
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>{children}</SafeAreaView>
            </Modal>
        </>
    );
}

export function ChatLauncher({
    open,
    toggle,
    position = 'bottom-right',
    icon,
}: {
    open: boolean;
    toggle: () => void;
    position?: 'bottom-right' | 'bottom-left';
    icon?: ReactNode;
}) {
    const { s, base, components, assistantName, labels } = useChatUI();
    if (components.Launcher) return <components.Launcher open={open} toggle={toggle} assistantName={assistantName} />;
    return (
        <Pressable
            style={s('launcher', base.launcher, position === 'bottom-left' ? { left: 20 } : { right: 20 })}
            onPress={toggle}
            accessibilityRole="button"
            accessibilityLabel={open ? labels.close : labels.open}
            accessibilityState={{ expanded: open }}
        >
            {icon ?? <Text style={s('launcherText', base.launcherText)}>💬</Text>}
        </Pressable>
    );
}

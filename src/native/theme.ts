import type { ColorScheme } from '../shared/uiTypes';
import type { NativeChatTheme } from './types';

type BaseTheme = Omit<NativeChatTheme, 'userBubble' | 'userBubbleText' | 'assistantBubble' | 'assistantBubbleText'>;

// Same palette as the web UI so both platforms look alike out of the box
const LIGHT: BaseTheme = {
    primary: '#4f46e5',
    primaryText: '#ffffff',
    background: '#ffffff',
    surface: '#f6f7f9',
    text: '#111827',
    mutedText: '#6b7280',
    border: '#e5e7eb',
    danger: '#dc2626',
    radius: 16,
    bubbleRadius: 14,
    fontSize: 15,
};

const DARK: BaseTheme = {
    ...LIGHT,
    primary: '#818cf8',
    primaryText: '#0b1020',
    background: '#111318',
    surface: '#1d2028',
    text: '#e5e7eb',
    mutedText: '#9ca3af',
    border: '#2b2f3a',
    danger: '#f87171',
};

/** Picks the light/dark base, applies overrides, then derives bubble colors from the result. */
export function resolveTheme(
    scheme: ColorScheme,
    deviceScheme: string | null | undefined,
    overrides: Partial<NativeChatTheme> | undefined
): NativeChatTheme {
    const isDark = scheme === 'dark' || (scheme === 'auto' && deviceScheme === 'dark');
    const base = { ...(isDark ? DARK : LIGHT), ...overrides };
    return {
        ...base,
        userBubble: overrides?.userBubble ?? base.primary,
        userBubbleText: overrides?.userBubbleText ?? base.primaryText,
        assistantBubble: overrides?.assistantBubble ?? base.surface,
        assistantBubbleText: overrides?.assistantBubbleText ?? base.text,
    };
}

/** Built-in styles for every slot, derived from the theme. */
export function makeStyles(t: NativeChatTheme) {
    const font = t.fontFamily ? { fontFamily: t.fontFamily } : {};
    const text = { color: t.text, fontSize: t.fontSize, ...font };
    return {
        root: { flex: 1 },
        panel: { flex: 1, backgroundColor: t.background, borderRadius: t.radius, overflow: 'hidden' as const },
        header: {
            flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10,
            paddingHorizontal: 14, paddingVertical: 12,
            borderBottomWidth: 1, borderBottomColor: t.border, backgroundColor: t.background,
        },
        headerText: { flex: 1, minWidth: 0 },
        title: { ...text, fontWeight: '600' as const, fontSize: t.fontSize + 1 },
        subtitle: { ...text, color: t.mutedText, fontSize: t.fontSize - 2 },
        headerButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
        headerButtonText: { ...text, color: t.mutedText, fontSize: t.fontSize - 1 },
        avatar: {
            width: 32, height: 32, borderRadius: 16, overflow: 'hidden' as const,
            alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: t.surface,
        },
        avatarText: { ...text, fontWeight: '600' as const, fontSize: t.fontSize - 2 },
        avatarGlyph: { fontSize: 20, fontWeight: '400' as const },
        messages: { flex: 1 },
        messagesContent: { padding: 14, gap: 12, flexGrow: 1 },
        message: { flexDirection: 'row' as const, alignItems: 'flex-end' as const, gap: 8 },
        messageUser: { flexDirection: 'row-reverse' as const },
        messageBody: { maxWidth: '80%' as const, gap: 2 },
        messageBodyUser: { alignItems: 'flex-end' as const },
        bubble: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: t.bubbleRadius, backgroundColor: t.assistantBubble },
        bubbleUser: { backgroundColor: t.userBubble },
        bubbleText: { ...text, color: t.assistantBubbleText, lineHeight: t.fontSize * 1.4 },
        bubbleTextUser: { color: t.userBubbleText },
        meta: { ...text, color: t.mutedText, fontSize: t.fontSize - 4, paddingHorizontal: 4 },
        emptyState: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 8, padding: 24 },
        emptyTitle: { ...text, fontWeight: '600' as const, fontSize: t.fontSize + 2 },
        emptyText: { ...text, color: t.mutedText, textAlign: 'center' as const },
        suggestions: { paddingHorizontal: 14, paddingBottom: 10, gap: 6 },
        suggestion: {
            borderWidth: 1, borderColor: t.border, backgroundColor: t.background,
            borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7,
        },
        suggestionText: { ...text, fontSize: t.fontSize - 2 },
        typing: { flexDirection: 'row' as const, gap: 4, paddingHorizontal: 14, paddingVertical: 12 },
        typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: t.mutedText },
        error: { marginHorizontal: 14, marginBottom: 10, padding: 10, borderRadius: 10, backgroundColor: `${t.danger}1a` },
        errorText: { ...text, color: t.danger, fontSize: t.fontSize - 2 },
        inputArea: {
            flexDirection: 'row' as const, alignItems: 'flex-end' as const, gap: 8,
            paddingHorizontal: 12, paddingVertical: 10,
            borderTopWidth: 1, borderTopColor: t.border, backgroundColor: t.background,
        },
        input: {
            ...text, flex: 1, minHeight: 40, maxHeight: 120,
            paddingHorizontal: 12, paddingTop: 10, paddingBottom: 10,
            borderRadius: 12, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface,
        },
        sendButton: {
            height: 40, paddingHorizontal: 16, borderRadius: 12,
            alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: t.primary,
        },
        stopButton: {
            height: 40, paddingHorizontal: 16, borderRadius: 12,
            alignItems: 'center' as const, justifyContent: 'center' as const,
            backgroundColor: t.surface, borderWidth: 1, borderColor: t.border,
        },
        buttonText: { ...text, color: t.primaryText, fontWeight: '600' as const },
        stopButtonText: { color: t.text },
        disabled: { opacity: 0.5 },
        launcher: {
            position: 'absolute' as const, bottom: 24, width: 56, height: 56, borderRadius: 28,
            alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: t.primary,
            shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6,
        },
        launcherText: { fontSize: 24, color: t.primaryText },
    };
}

export type NativeBuiltInStyles = ReturnType<typeof makeStyles>;

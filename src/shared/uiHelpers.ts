import type { ChatLabels } from './uiTypes';

// Helpers shared by the web UI (chat-foundry/ui) and the React Native UI (chat-foundry/native).

export const DEFAULT_LABELS: ChatLabels = {
    placeholder: 'Type a message…',
    send: 'Send',
    stop: 'Stop',
    clear: 'Clear',
    open: 'Open chat',
    close: 'Close chat',
    typing: 'is typing',
    errorPrefix: 'Something went wrong:',
    you: 'You',
};

export function isImageUrl(src: unknown): src is string {
    return typeof src === 'string' && /^(https?:|data:|blob:|file:|\/|\.{1,2}\/)/.test(src);
}

export function initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
}

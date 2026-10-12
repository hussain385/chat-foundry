// Optional React Native UI for chat-foundry. Import from 'chat-foundry/native'.

// All-in-one widget
export { ChatWidget, ChatLauncher } from './ChatWidget';
export type { ChatWidgetProps } from './ChatWidget';

// Composable building blocks for custom layouts
export {
    ChatRoot,
    ChatPanel,
    ChatHeader,
    ChatMessages,
    ChatMessage,
    ChatAvatar,
    ChatEmptyState,
    ChatTypingIndicator,
    ChatSuggestions,
    ChatError,
    ChatInput,
    useChatUI,
} from './primitives';

export { DEFAULT_LABELS } from '../shared/uiHelpers';
export { resolveTheme } from './theme';

export type {
    NativeChatRootProps as ChatRootProps,
    NativeChatTheme as ChatTheme,
    NativeChatSlot as ChatSlot,
    NativeChatStyles as ChatStyles,
    NativeAvatarSource as AvatarSource,
    ChatLabels,
    ChatComponents,
    ColorScheme,
    MessageRenderProps,
    HeaderRenderProps,
    InputRenderProps,
} from './types';

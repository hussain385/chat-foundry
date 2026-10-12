// Optional React DOM UI for chat-foundry. Import from 'chat-foundry/ui'.

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
    DEFAULT_LABELS,
} from './primitives';

export { DEFAULT_CSS, themeToCssVars } from './styles';

export type {
    ChatRootProps,
    ChatTheme,
    ChatSlot,
    ChatClassNames,
    ChatStyles,
    ChatLabels,
    ChatComponents,
    ColorScheme,
    AvatarSource,
    MessageRenderProps,
    HeaderRenderProps,
    InputRenderProps,
} from './types';

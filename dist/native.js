"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _chunk3EG5RUY4js = require('./chunk-3EG5RUY4.js');





var _chunkNFLAWMIRjs = require('./chunk-NFLAWMIR.js');

// src/native/ChatWidget.tsx
var _react = require('react');
var _reactnative = require('react-native');

// src/native/primitives.tsx













// src/native/theme.ts
var LIGHT = {
  primary: "#4f46e5",
  primaryText: "#ffffff",
  background: "#ffffff",
  surface: "#f6f7f9",
  text: "#111827",
  mutedText: "#6b7280",
  border: "#e5e7eb",
  danger: "#dc2626",
  radius: 16,
  bubbleRadius: 14,
  fontSize: 15
};
var DARK = _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, LIGHT), {
  primary: "#818cf8",
  primaryText: "#0b1020",
  background: "#111318",
  surface: "#1d2028",
  text: "#e5e7eb",
  mutedText: "#9ca3af",
  border: "#2b2f3a",
  danger: "#f87171"
});
function resolveTheme(scheme, deviceScheme, overrides) {
  var _a, _b, _c, _d;
  const isDark = scheme === "dark" || scheme === "auto" && deviceScheme === "dark";
  const base = _chunkNFLAWMIRjs.__spreadValues.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, isDark ? DARK : LIGHT), overrides);
  return _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, base), {
    userBubble: (_a = overrides == null ? void 0 : overrides.userBubble) != null ? _a : base.primary,
    userBubbleText: (_b = overrides == null ? void 0 : overrides.userBubbleText) != null ? _b : base.primaryText,
    assistantBubble: (_c = overrides == null ? void 0 : overrides.assistantBubble) != null ? _c : base.surface,
    assistantBubbleText: (_d = overrides == null ? void 0 : overrides.assistantBubbleText) != null ? _d : base.text
  });
}
function makeStyles(t) {
  const font = t.fontFamily ? { fontFamily: t.fontFamily } : {};
  const text = _chunkNFLAWMIRjs.__spreadValues.call(void 0, { color: t.text, fontSize: t.fontSize }, font);
  return {
    root: { flex: 1 },
    panel: { flex: 1, backgroundColor: t.background, borderRadius: t.radius, overflow: "hidden" },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: t.border,
      backgroundColor: t.background
    },
    headerText: { flex: 1, minWidth: 0 },
    title: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), { fontWeight: "600", fontSize: t.fontSize + 1 }),
    subtitle: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), { color: t.mutedText, fontSize: t.fontSize - 2 }),
    headerButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    headerButtonText: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), { color: t.mutedText, fontSize: t.fontSize - 1 }),
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.surface
    },
    avatarText: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), { fontWeight: "600", fontSize: t.fontSize - 2 }),
    avatarGlyph: { fontSize: 20, fontWeight: "400" },
    messages: { flex: 1 },
    messagesContent: { padding: 14, gap: 12, flexGrow: 1 },
    message: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
    messageUser: { flexDirection: "row-reverse" },
    messageBody: { maxWidth: "80%", gap: 2 },
    messageBodyUser: { alignItems: "flex-end" },
    bubble: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: t.bubbleRadius, backgroundColor: t.assistantBubble },
    bubbleUser: { backgroundColor: t.userBubble },
    bubbleText: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), { color: t.assistantBubbleText, lineHeight: t.fontSize * 1.4 }),
    bubbleTextUser: { color: t.userBubbleText },
    meta: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), { color: t.mutedText, fontSize: t.fontSize - 4, paddingHorizontal: 4 }),
    emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, padding: 24 },
    emptyTitle: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), { fontWeight: "600", fontSize: t.fontSize + 2 }),
    emptyText: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), { color: t.mutedText, textAlign: "center" }),
    suggestions: { paddingHorizontal: 14, paddingBottom: 10, gap: 6 },
    suggestion: {
      borderWidth: 1,
      borderColor: t.border,
      backgroundColor: t.background,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7
    },
    suggestionText: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), { fontSize: t.fontSize - 2 }),
    typing: { flexDirection: "row", gap: 4, paddingHorizontal: 14, paddingVertical: 12 },
    typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: t.mutedText },
    error: { marginHorizontal: 14, marginBottom: 10, padding: 10, borderRadius: 10, backgroundColor: `${t.danger}1a` },
    errorText: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), { color: t.danger, fontSize: t.fontSize - 2 }),
    inputArea: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: t.border,
      backgroundColor: t.background
    },
    input: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), {
      flex: 1,
      minHeight: 40,
      maxHeight: 120,
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: t.border,
      backgroundColor: t.surface
    }),
    sendButton: {
      height: 40,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.primary
    },
    stopButton: {
      height: 40,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.border
    },
    buttonText: _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, text), { color: t.primaryText, fontWeight: "600" }),
    stopButtonText: { color: t.text },
    disabled: { opacity: 0.5 },
    launcher: {
      position: "absolute",
      bottom: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.primary,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6
    },
    launcherText: { fontSize: 24, color: t.primaryText }
  };
}

// src/native/primitives.tsx
var _jsxruntime = require('react/jsx-runtime');
var NativeChatUIContext = _react.createContext.call(void 0, null);
function useChatUI() {
  const ctx = _react.useContext.call(void 0, NativeChatUIContext);
  if (!ctx) throw new Error("[chat-foundry] Chat UI components must be rendered inside <ChatRoot> or <ChatWidget>.");
  return ctx;
}
function ChatRoot(props) {
  if (props.chat) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatRootInner, _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, props), { chat: props.chat }));
  if (!props.config) {
    throw new Error("[chat-foundry] <ChatRoot> needs either a `config` or a `chat` prop.");
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatRootWithConfig, _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, props), { config: props.config }));
}
function ChatRootWithConfig(props) {
  var _a;
  const assistantName = (_a = props.assistantName) != null ? _a : props.config.assistantName;
  const chat = _chunkNFLAWMIRjs.useChat.call(void 0, _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, props.config), { assistantName }));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatRootInner, _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, props), { chat }));
}
function ChatRootInner(props) {
  const {
    chat,
    config,
    theme: themeOverrides,
    colorScheme = "light",
    styles,
    unstyled = false,
    components = {},
    labels,
    renderContent,
    showTimestamps = false,
    showAvatars = true,
    onClose,
    style,
    children
  } = props;
  const deviceScheme = _reactnative.useColorScheme.call(void 0, );
  const theme = _react.useMemo.call(void 0, 
    () => resolveTheme(colorScheme, deviceScheme, themeOverrides),
    [colorScheme, deviceScheme, themeOverrides]
  );
  const base = _react.useMemo.call(void 0, () => makeStyles(theme), [theme]);
  const value = _react.useMemo.call(void 0, 
    () => {
      var _a, _b, _c, _d;
      return {
        chat,
        assistantName: (_b = (_a = props.assistantName) != null ? _a : config == null ? void 0 : config.assistantName) != null ? _b : "Assistant",
        assistantAvatar: props.assistantAvatar,
        userName: (_d = (_c = props.userName) != null ? _c : labels == null ? void 0 : labels.you) != null ? _d : _chunk3EG5RUY4js.DEFAULT_LABELS.you,
        userAvatar: props.userAvatar,
        labels: _chunkNFLAWMIRjs.__spreadValues.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, _chunk3EG5RUY4js.DEFAULT_LABELS), labels),
        components,
        renderContent: renderContent != null ? renderContent : ((content) => content),
        showTimestamps,
        showAvatars,
        onClose,
        theme,
        base,
        s: (name, ...builtIn) => unstyled ? styles == null ? void 0 : styles[name] : [...builtIn, styles == null ? void 0 : styles[name]]
      };
    },
    [
      chat,
      config == null ? void 0 : config.assistantName,
      props.assistantName,
      props.assistantAvatar,
      props.userName,
      props.userAvatar,
      labels,
      components,
      renderContent,
      showTimestamps,
      showAvatars,
      onClose,
      theme,
      base,
      unstyled,
      styles
    ]
  );
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, NativeChatUIContext.Provider, { value, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.View, { style: value.s("root", base.root, style), children }) });
}
function ChatPanel({ children }) {
  const { s, base, assistantName } = useChatUI();
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.View, { style: s("panel", base.panel), accessibilityLabel: `Chat with ${assistantName}`, children });
}
function toImageSource(src) {
  if (_chunk3EG5RUY4js.isImageUrl.call(void 0, src)) return { uri: src };
  if (typeof src === "number") return src;
  if (src && typeof src === "object" && !_react.isValidElement.call(void 0, src) && ("uri" in src || Array.isArray(src))) {
    return src;
  }
  return null;
}
function ChatAvatar({ src, name, role }) {
  const { s, base, components } = useChatUI();
  if (components.Avatar) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.Avatar, { src, name, role });
  const image = toImageSource(src);
  let content;
  if (image) content = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Image, { source: image, style: { width: "100%", height: "100%" }, accessibilityIgnoresInvertColors: true });
  else if (typeof src === "string") content = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("avatarText", base.avatarText, base.avatarGlyph), children: src });
  else if (src == null) content = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("avatarText", base.avatarText), children: _chunk3EG5RUY4js.initials.call(void 0, name) });
  else content = src;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.View, { style: s("avatar", base.avatar), importantForAccessibility: "no-hide-descendants", accessibilityElementsHidden: true, children: content });
}
function ChatHeader({ subtitle, showClearButton = true }) {
  const { s, base, components, chat, assistantName, assistantAvatar, labels, showAvatars, onClose } = useChatUI();
  if (components.Header) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      components.Header,
      {
        assistantName,
        subtitle,
        avatar: assistantAvatar,
        onClear: chat.clearHistory,
        onClose
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _reactnative.View, { style: s("header", base.header), children: [
    showAvatars && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatAvatar, { src: assistantAvatar, name: assistantName, role: "assistant" }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _reactnative.View, { style: base.headerText, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("title", base.title), accessibilityRole: "header", numberOfLines: 1, children: assistantName }),
      subtitle != null && (typeof subtitle === "string" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("subtitle", base.subtitle), numberOfLines: 1, children: subtitle }) : subtitle)
    ] }),
    showClearButton && chat.messages.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Pressable, { style: s("headerButton", base.headerButton), onPress: chat.clearHistory, accessibilityRole: "button", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("headerButtonText", base.headerButtonText), children: labels.clear }) }),
    onClose && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _reactnative.Pressable,
      {
        style: s("headerButton", base.headerButton),
        onPress: onClose,
        accessibilityRole: "button",
        accessibilityLabel: labels.close,
        hitSlop: 8,
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("headerButtonText", base.headerButtonText), children: "\u2715" })
      }
    )
  ] });
}
function ChatMessage({ message, isStreaming }) {
  const ctx = useChatUI();
  const { s, base, components, renderContent, showTimestamps, showAvatars } = ctx;
  const isUser = message.role === "user";
  const authorName = isUser ? ctx.userName : ctx.assistantName;
  const avatar = isUser ? ctx.userAvatar : ctx.assistantAvatar;
  if (components.Message) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      components.Message,
      {
        message,
        isStreaming: !!isStreaming,
        authorName,
        avatar
      }
    );
  }
  const rendered = renderContent(message.content, message);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _reactnative.View, { style: s("message", base.message, isUser && base.messageUser), accessibilityLabel: `${authorName}: ${message.content}`, children: [
    showAvatars && (!isUser || ctx.userAvatar) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatAvatar, { src: avatar, name: authorName, role: message.role }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _reactnative.View, { style: [base.messageBody, isUser && base.messageBodyUser], children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.View, { style: s("bubble", base.bubble, isUser && base.bubbleUser), children: typeof rendered === "string" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("bubbleText", base.bubbleText, isUser && base.bubbleTextUser), selectable: true, children: rendered }) : rendered }),
      showTimestamps && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _reactnative.Text, { style: s("meta", base.meta), children: [
        authorName,
        " \xB7 ",
        message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      ] })
    ] })
  ] });
}
function ChatTypingIndicator() {
  const { s, base, components, assistantName, labels } = useChatUI();
  const progress = _react.useRef.call(void 0, new _reactnative.Animated.Value(0)).current;
  _react.useEffect.call(void 0, () => {
    const loop = _reactnative.Animated.loop(_reactnative.Animated.timing(progress, { toValue: 1, duration: 1200, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [progress]);
  if (components.TypingIndicator) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.TypingIndicator, { assistantName });
  const dot = (offset) => ({
    opacity: progress.interpolate({
      inputRange: [0, offset, offset + 0.2, offset + 0.4, 1],
      outputRange: [0.3, 0.3, 1, 0.3, 0.3]
    })
  });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.View, { style: s("typing", base.typing), accessibilityRole: "text", accessibilityLabel: `${assistantName} ${labels.typing}`, children: [0, 0.15, 0.3].map((o) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Animated.View, { style: [base.typingDot, dot(o)] }, o)) });
}
function ChatEmptyState({ welcomeMessage }) {
  const { s, base, components, assistantName, assistantAvatar } = useChatUI();
  if (components.EmptyState) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.EmptyState, { assistantName, welcomeMessage });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _reactnative.View, { style: s("emptyState", base.emptyState), children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatAvatar, { src: assistantAvatar, name: assistantName, role: "assistant" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("emptyTitle", base.emptyTitle), children: assistantName }),
    welcomeMessage != null && (typeof welcomeMessage === "string" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("emptyText", base.emptyText), children: welcomeMessage }) : welcomeMessage)
  ] });
}
function ChatMessages({ welcomeMessage }) {
  const { s, base, chat } = useChatUI();
  const listRef = _react.useRef.call(void 0, null);
  const stickToBottom = _react.useRef.call(void 0, true);
  const data = _react.useMemo.call(void 0, () => {
    const visible = chat.messages.filter((m) => m.role !== "system");
    if (!chat.isStreaming) return visible;
    const streaming = { id: "cf-streaming", role: "assistant", content: chat.streamingMessage, createdAt: /* @__PURE__ */ new Date() };
    return [...visible, streaming];
  }, [chat.messages, chat.isStreaming, chat.streamingMessage]);
  const onScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    stickToBottom.current = contentSize.height - contentOffset.y - layoutMeasurement.height < 40;
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _reactnative.FlatList,
    {
      ref: listRef,
      style: s("messages", base.messages),
      contentContainerStyle: base.messagesContent,
      data,
      keyExtractor: (m) => m.id,
      renderItem: ({ item }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatMessage, { message: item, isStreaming: item.id === "cf-streaming" }),
      ListEmptyComponent: chat.isLoading ? null : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatEmptyState, { welcomeMessage }),
      ListFooterComponent: chat.isLoading ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatTypingIndicator, {}) : null,
      onScroll,
      scrollEventThrottle: 100,
      onContentSizeChange: () => {
        var _a;
        if (stickToBottom.current) (_a = listRef.current) == null ? void 0 : _a.scrollToEnd({ animated: true });
      },
      keyboardShouldPersistTaps: "handled",
      accessibilityLiveRegion: "polite"
    }
  );
}
function ChatSuggestions({ suggestions, alwaysShow = false }) {
  const { s, base, chat } = useChatUI();
  if (suggestions.length === 0) return null;
  if (!alwaysShow && chat.messages.some((m) => m.role !== "system")) return null;
  const busy = chat.isLoading || chat.isStreaming;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _reactnative.ScrollView,
    {
      horizontal: true,
      showsHorizontalScrollIndicator: false,
      style: { flexGrow: 0 },
      contentContainerStyle: s("suggestions", base.suggestions),
      keyboardShouldPersistTaps: "handled",
      children: suggestions.map((text) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _reactnative.Pressable,
        {
          style: s("suggestion", base.suggestion, busy && base.disabled),
          disabled: busy,
          onPress: () => chat.sendMessage(text),
          accessibilityRole: "button",
          children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("suggestionText", base.suggestionText), children: text })
        },
        text
      ))
    }
  );
}
function ChatError() {
  const { s, base, chat, labels } = useChatUI();
  if (!chat.error) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.View, { style: s("error", base.error), accessibilityRole: "alert", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _reactnative.Text, { style: s("errorText", base.errorText), children: [
    labels.errorPrefix,
    " ",
    chat.error.message
  ] }) });
}
function ChatInput({ autoFocus }) {
  const { s, base, components, chat, labels, theme } = useChatUI();
  const [value, setValue] = _react.useState.call(void 0, "");
  const isBusy = chat.isLoading || chat.isStreaming;
  const submit = _react.useCallback.call(void 0, () => {
    if (!value.trim() || isBusy) return;
    chat.sendMessage(value);
    setValue("");
  }, [value, isBusy, chat]);
  const inputProps = {
    value,
    setValue,
    submit,
    stop: chat.abortResponse,
    isBusy,
    placeholder: labels.placeholder
  };
  if (components.Input) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.Input, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, inputProps));
  const canSend = value.trim().length > 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _reactnative.View, { style: s("inputArea", base.inputArea), children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _reactnative.TextInput,
      {
        style: s("input", base.input),
        value,
        onChangeText: setValue,
        placeholder: labels.placeholder,
        placeholderTextColor: theme.mutedText,
        accessibilityLabel: labels.placeholder,
        autoFocus,
        multiline: true,
        textAlignVertical: "center"
      }
    ),
    isBusy ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _reactnative.Pressable,
      {
        style: s("stopButton", base.stopButton),
        onPress: chat.abortResponse,
        accessibilityRole: "button",
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("buttonText", base.buttonText, base.stopButtonText), children: labels.stop })
      }
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _reactnative.Pressable,
      {
        style: s("sendButton", base.sendButton, !canSend && base.disabled),
        onPress: submit,
        disabled: !canSend,
        accessibilityRole: "button",
        accessibilityState: { disabled: !canSend },
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("buttonText", base.buttonText), children: labels.send })
      }
    )
  ] });
}

// src/native/ChatWidget.tsx

function ChatWidget(props) {
  const _a = props, {
    subtitle,
    welcomeMessage,
    suggestions = [],
    showHeader = true,
    showClearButton = true,
    variant = "inline",
    position = "bottom-right",
    defaultOpen = false,
    open: openProp,
    onOpenChange,
    launcherIcon,
    keyboardVerticalOffset = 0
  } = _a, rootProps = _chunkNFLAWMIRjs.__objRest.call(void 0, _a, [
    "subtitle",
    "welcomeMessage",
    "suggestions",
    "showHeader",
    "showClearButton",
    "variant",
    "position",
    "defaultOpen",
    "open",
    "onOpenChange",
    "launcherIcon",
    "keyboardVerticalOffset"
  ]);
  const [openState, setOpenState] = _react.useState.call(void 0, defaultOpen);
  const isControlled = openProp !== void 0;
  const open = isControlled ? openProp : openState;
  const setOpen = _react.useCallback.call(void 0, 
    (next) => {
      if (!isControlled) setOpenState(next);
      onOpenChange == null ? void 0 : onOpenChange(next);
    },
    [isControlled, onOpenChange]
  );
  const isFloating = variant === "floating";
  const body = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _reactnative.KeyboardAvoidingView,
    {
      style: { flex: 1 },
      behavior: _reactnative.Platform.OS === "ios" ? "padding" : void 0,
      keyboardVerticalOffset,
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, ChatPanel, { children: [
        showHeader && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatHeader, { subtitle, showClearButton }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatMessages, { welcomeMessage }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatSuggestions, { suggestions }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatError, {}),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatInput, { autoFocus: isFloating && open })
      ] })
    }
  );
  if (!isFloating) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatRoot, _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, rootProps), { children: body }));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    ChatRoot,
    _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, rootProps), {
      onClose: () => setOpen(false),
      style: [{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, pointerEvents: "box-none" }, rootProps.style],
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FloatingLayer, { open, setOpen, position, launcherIcon, children: body })
    })
  );
}
function FloatingLayer({
  open,
  setOpen,
  position,
  launcherIcon,
  children
}) {
  const { theme } = useChatUI();
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatLauncher, { open, toggle: () => setOpen(!open), position, icon: launcherIcon }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _reactnative.Modal,
      {
        visible: open,
        animationType: "slide",
        presentationStyle: "pageSheet",
        onRequestClose: () => setOpen(false),
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.SafeAreaView, { style: { flex: 1, backgroundColor: theme.background }, children })
      }
    )
  ] });
}
function ChatLauncher({
  open,
  toggle,
  position = "bottom-right",
  icon
}) {
  const { s, base, components, assistantName, labels } = useChatUI();
  if (components.Launcher) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.Launcher, { open, toggle, assistantName });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _reactnative.Pressable,
    {
      style: s("launcher", base.launcher, position === "bottom-left" ? { left: 20 } : { right: 20 }),
      onPress: toggle,
      accessibilityRole: "button",
      accessibilityLabel: open ? labels.close : labels.open,
      accessibilityState: { expanded: open },
      children: icon != null ? icon : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _reactnative.Text, { style: s("launcherText", base.launcherText), children: "\u{1F4AC}" })
    }
  );
}

















exports.ChatAvatar = ChatAvatar; exports.ChatEmptyState = ChatEmptyState; exports.ChatError = ChatError; exports.ChatHeader = ChatHeader; exports.ChatInput = ChatInput; exports.ChatLauncher = ChatLauncher; exports.ChatMessage = ChatMessage; exports.ChatMessages = ChatMessages; exports.ChatPanel = ChatPanel; exports.ChatRoot = ChatRoot; exports.ChatSuggestions = ChatSuggestions; exports.ChatTypingIndicator = ChatTypingIndicator; exports.ChatWidget = ChatWidget; exports.DEFAULT_LABELS = _chunk3EG5RUY4js.DEFAULT_LABELS; exports.resolveTheme = resolveTheme; exports.useChatUI = useChatUI;

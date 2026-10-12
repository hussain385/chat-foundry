"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _chunk3EG5RUY4js = require('./chunk-3EG5RUY4.js');





var _chunkNFLAWMIRjs = require('./chunk-NFLAWMIR.js');

// src/ui/ChatWidget.tsx
var _react = require('react');

// src/ui/primitives.tsx











// src/ui/styles.ts
function themeToCssVars(theme) {
  const vars = {};
  if (!theme) return vars;
  for (const [key, value] of Object.entries(theme)) {
    if (value == null) continue;
    const kebab = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    vars[`--cf-${kebab}`] = String(value);
  }
  return vars;
}
var LIGHT = `
  --cf-primary: #4f46e5;
  --cf-primary-text: #ffffff;
  --cf-background: #ffffff;
  --cf-surface: #f6f7f9;
  --cf-text: #111827;
  --cf-muted-text: #6b7280;
  --cf-border: #e5e7eb;
  --cf-user-bubble: var(--cf-primary);
  --cf-user-bubble-text: var(--cf-primary-text);
  --cf-assistant-bubble: var(--cf-surface);
  --cf-assistant-bubble-text: var(--cf-text);`;
var DARK = `
  --cf-primary: #818cf8;
  --cf-primary-text: #0b1020;
  --cf-background: #111318;
  --cf-surface: #1d2028;
  --cf-text: #e5e7eb;
  --cf-muted-text: #9ca3af;
  --cf-border: #2b2f3a;`;
var DEFAULT_CSS = `
:where(.cf-root) {${LIGHT}
  --cf-radius: 16px;
  --cf-bubble-radius: 14px;
  --cf-font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --cf-font-size: 14px;
  --cf-width: 380px;
  --cf-height: 560px;
  --cf-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
  --cf-z-index: 2147483000;
  font-family: var(--cf-font-family);
  font-size: var(--cf-font-size);
  color: var(--cf-text);
  line-height: 1.5;
  box-sizing: border-box;
}
:where(.cf-root) *, :where(.cf-root) *::before, :where(.cf-root) *::after { box-sizing: inherit; }
:where(.cf-root[data-cf-scheme="dark"]) {${DARK}}
@media (prefers-color-scheme: dark) {
  :where(.cf-root[data-cf-scheme="auto"]) {${DARK}}
}
:where(.cf-panel) {
  display: flex; flex-direction: column;
  width: 100%; height: 100%; min-height: 0;
  background: var(--cf-background);
  border: 1px solid var(--cf-border);
  border-radius: var(--cf-radius);
  overflow: hidden;
}
:where(.cf-panel[hidden]) { display: none; }
:where(.cf-root[data-cf-variant="inline"]) { width: 100%; height: var(--cf-height); }
:where(.cf-root[data-cf-variant="floating"]) {
  position: fixed; bottom: 20px; z-index: var(--cf-z-index);
  display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
}
:where(.cf-root[data-cf-variant="floating"][data-cf-position="bottom-right"]) { right: 20px; }
:where(.cf-root[data-cf-variant="floating"][data-cf-position="bottom-left"]) { left: 20px; align-items: flex-start; }
:where(.cf-root[data-cf-variant="floating"]) :where(.cf-panel) {
  width: min(var(--cf-width), calc(100vw - 40px));
  height: min(var(--cf-height), calc(100vh - 120px));
  box-shadow: var(--cf-shadow);
}
:where(.cf-launcher) {
  width: 56px; height: 56px; border-radius: 999px; border: 0; cursor: pointer;
  background: var(--cf-primary); color: var(--cf-primary-text);
  box-shadow: var(--cf-shadow);
  display: grid; place-items: center;
  transition: transform 0.15s ease;
}
:where(.cf-launcher):hover { transform: scale(1.05); }
:where(.cf-header) {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; border-bottom: 1px solid var(--cf-border);
  background: var(--cf-background);
}
:where(.cf-header-text) { display: flex; flex-direction: column; min-width: 0; flex: 1; }
:where(.cf-title) { font-weight: 600; font-size: 1.05em; margin: 0; }
:where(.cf-subtitle) { color: var(--cf-muted-text); font-size: 0.85em; }
:where(.cf-header-actions) { display: flex; gap: 4px; }
:where(.cf-header-button) {
  border: 0; background: transparent; color: var(--cf-muted-text); cursor: pointer;
  padding: 6px 8px; border-radius: 8px; font: inherit; font-size: 0.85em;
}
:where(.cf-header-button):hover { background: var(--cf-surface); color: var(--cf-text); }
:where(.cf-avatar) {
  width: 32px; height: 32px; flex: none; border-radius: 999px; overflow: hidden;
  display: grid; place-items: center;
  background: var(--cf-surface); color: var(--cf-text); font-weight: 600; font-size: 0.85em;
}
:where(.cf-avatar) img { width: 100%; height: 100%; object-fit: cover; }
:where(.cf-avatar-glyph) { font-size: 1.6em; font-weight: 400; line-height: 1; }
:where(.cf-messages) {
  flex: 1; min-height: 0; overflow-y: auto;
  padding: 16px 14px; display: flex; flex-direction: column; gap: 12px;
}
:where(.cf-message) { display: flex; gap: 8px; align-items: flex-end; max-width: 100%; }
:where(.cf-message[data-role="user"]) { flex-direction: row-reverse; }
:where(.cf-message-body) { display: flex; flex-direction: column; gap: 2px; max-width: 80%; min-width: 0; }
:where(.cf-message[data-role="user"]) :where(.cf-message-body) { align-items: flex-end; }
:where(.cf-bubble) {
  padding: 9px 13px; border-radius: var(--cf-bubble-radius);
  white-space: pre-wrap; overflow-wrap: anywhere;
  background: var(--cf-assistant-bubble); color: var(--cf-assistant-bubble-text);
}
:where(.cf-message[data-role="user"]) :where(.cf-bubble) {
  background: var(--cf-user-bubble); color: var(--cf-user-bubble-text);
}
:where(.cf-meta) { font-size: 0.75em; color: var(--cf-muted-text); padding: 0 4px; }
:where(.cf-empty) {
  margin: auto; text-align: center; color: var(--cf-muted-text);
  display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px;
}
:where(.cf-empty-title) { color: var(--cf-text); font-weight: 600; font-size: 1.1em; }
:where(.cf-suggestions) { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; }
:where(.cf-suggestion) {
  border: 1px solid var(--cf-border); background: var(--cf-background); color: var(--cf-text);
  border-radius: 999px; padding: 6px 12px; cursor: pointer; font: inherit; font-size: 0.85em;
}
:where(.cf-suggestion):hover { border-color: var(--cf-primary); color: var(--cf-primary); }
:where(.cf-typing) { display: inline-flex; gap: 4px; padding: 12px 14px; }
:where(.cf-typing) span {
  width: 6px; height: 6px; border-radius: 999px; background: var(--cf-muted-text);
  animation: cf-bounce 1.2s infinite ease-in-out;
}
:where(.cf-typing) span:nth-child(2) { animation-delay: 0.15s; }
:where(.cf-typing) span:nth-child(3) { animation-delay: 0.3s; }
@keyframes cf-bounce { 0%, 80%, 100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
@media (prefers-reduced-motion: reduce) { :where(.cf-typing) span { animation: none; } }
:where(.cf-error) {
  margin: 0 14px 10px; padding: 8px 12px; border-radius: 10px; font-size: 0.85em;
  background: rgba(220, 38, 38, 0.1); color: #dc2626;
}
:where(.cf-input-area) {
  display: flex; gap: 8px; align-items: flex-end;
  padding: 10px 12px; border-top: 1px solid var(--cf-border); background: var(--cf-background);
}
:where(.cf-input) {
  flex: 1; resize: none; max-height: 140px; min-height: 40px;
  padding: 9px 12px; border-radius: 12px; border: 1px solid var(--cf-border);
  background: var(--cf-surface); color: var(--cf-text); font: inherit; outline: none;
}
:where(.cf-input):focus { border-color: var(--cf-primary); }
:where(.cf-input):focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--cf-primary) 25%, transparent);
}
:where(.cf-send-button), :where(.cf-stop-button) {
  height: 40px; padding: 0 14px; border-radius: 12px; border: 0; cursor: pointer;
  background: var(--cf-primary); color: var(--cf-primary-text); font: inherit; font-weight: 600;
}
:where(.cf-send-button):disabled { opacity: 0.5; cursor: not-allowed; }
:where(.cf-stop-button) { background: var(--cf-surface); color: var(--cf-text); border: 1px solid var(--cf-border); }
:where(.cf-root) :focus-visible { outline: 2px solid var(--cf-primary); outline-offset: 2px; }
`;

// src/ui/primitives.tsx
var _jsxruntime = require('react/jsx-runtime');
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? _react.useLayoutEffect : _react.useEffect;
function cx(...parts) {
  const joined = parts.filter(Boolean).join(" ");
  return joined || void 0;
}
var ChatUIContext = _react.createContext.call(void 0, null);
function useChatUI() {
  const ctx = _react.useContext.call(void 0, ChatUIContext);
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
    theme,
    colorScheme = "light",
    classNames,
    styles,
    unstyled = false,
    components = {},
    labels,
    renderContent,
    showTimestamps = false,
    showAvatars = true,
    variant = "inline",
    position = "bottom-right",
    onClose,
    className,
    style,
    children
  } = props;
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
        unstyled,
        slot: (name, builtInClass, extra) => ({
          className: cx(!unstyled && builtInClass, classNames == null ? void 0 : classNames[name], extra == null ? void 0 : extra.className),
          style: (styles == null ? void 0 : styles[name]) || (extra == null ? void 0 : extra.style) ? _chunkNFLAWMIRjs.__spreadValues.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, styles == null ? void 0 : styles[name]), extra == null ? void 0 : extra.style) : void 0,
          "data-cf-slot": name
        })
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
      unstyled,
      classNames,
      styles
    ]
  );
  const rootSlot = value.slot("root", "cf-root", {
    className,
    style: _chunkNFLAWMIRjs.__spreadValues.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, themeToCssVars(theme)), style)
  });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatUIContext.Provider, { value, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, rootSlot), {
      "data-cf-variant": variant,
      "data-cf-position": position,
      "data-cf-scheme": colorScheme,
      "data-cf-unstyled": unstyled ? "" : void 0,
      children: [
        !unstyled && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { "data-chat-foundry": "", children: DEFAULT_CSS }),
        children
      ]
    })
  ) });
}
function ChatPanel({ children, hidden, id }) {
  const { slot, assistantName, onClose } = useChatUI();
  const onKeyDown = (e) => {
    if (e.key === "Escape" && onClose) onClose();
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("panel", "cf-panel")), {
      id,
      hidden,
      role: "region",
      "aria-label": `Chat with ${assistantName}`,
      onKeyDown,
      children
    })
  );
}
function ChatAvatar({ src, name, role }) {
  const { slot, components, unstyled } = useChatUI();
  if (components.Avatar) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.Avatar, { src, name, role });
  let content;
  if (_chunk3EG5RUY4js.isImageUrl.call(void 0, src)) content = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src, alt: "" });
  else if (typeof src === "string") content = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: unstyled ? void 0 : "cf-avatar-glyph", children: src });
  else content = src != null ? src : _chunk3EG5RUY4js.initials.call(void 0, name);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("avatar", "cf-avatar")), { "data-role": role, "aria-hidden": "true", children: content }));
}
function ChatHeader({ subtitle, showClearButton = true }) {
  const { slot, components, chat, assistantName, assistantAvatar, labels, showAvatars, onClose, unstyled } = useChatUI();
  const headerProps = {
    assistantName,
    subtitle,
    avatar: assistantAvatar,
    onClear: chat.clearHistory,
    onClose
  };
  if (components.Header) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.Header, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, headerProps));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("header", "cf-header")), { children: [
    showAvatars && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatAvatar, { src: assistantAvatar, name: assistantName, role: "assistant" }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: unstyled ? void 0 : "cf-header-text", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("title", "cf-title")), { children: assistantName })),
      subtitle && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("subtitle", "cf-subtitle")), { children: subtitle }))
    ] }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("headerActions", "cf-header-actions")), { children: [
      showClearButton && chat.messages.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, { type: "button" }, slot("headerButton", "cf-header-button")), { onClick: chat.clearHistory, children: labels.clear })),
      onClose && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "button",
        _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {
          type: "button"
        }, slot("headerButton", "cf-header-button")), {
          onClick: onClose,
          "aria-label": labels.close,
          children: "\u2715"
        })
      )
    ] }))
  ] }));
}
function ChatMessage({ message, isStreaming }) {
  const ctx = useChatUI();
  const { slot, components, renderContent, showTimestamps, showAvatars } = ctx;
  const isUser = message.role === "user";
  const props = {
    message,
    isStreaming: !!isStreaming,
    authorName: isUser ? ctx.userName : ctx.assistantName,
    avatar: isUser ? ctx.userAvatar : ctx.assistantAvatar
  };
  if (components.Message) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.Message, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, props));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("message", "cf-message")), { "data-role": message.role, "data-streaming": isStreaming ? "" : void 0, children: [
    showAvatars && (!isUser || ctx.userAvatar) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatAvatar, { src: props.avatar, name: props.authorName, role: message.role }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: ctx.unstyled ? void 0 : "cf-message-body", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("bubble", "cf-bubble")), { children: renderContent(message.content, message) })),
      showTimestamps && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("meta", "cf-meta")), { children: [
        props.authorName,
        " \xB7 ",
        message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      ] }))
    ] })
  ] }));
}
function ChatTypingIndicator() {
  const { slot, components, assistantName, labels } = useChatUI();
  if (components.TypingIndicator) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.TypingIndicator, { assistantName });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("typing", "cf-typing")), { role: "status", "aria-label": `${assistantName} ${labels.typing}`, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", {}),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", {}),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", {})
  ] }));
}
function ChatEmptyState({ welcomeMessage }) {
  const { slot, components, assistantName, assistantAvatar, unstyled } = useChatUI();
  if (components.EmptyState) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.EmptyState, { assistantName, welcomeMessage });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("emptyState", "cf-empty")), { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatAvatar, { src: assistantAvatar, name: assistantName, role: "assistant" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: unstyled ? void 0 : "cf-empty-title", children: assistantName }),
    welcomeMessage && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: welcomeMessage })
  ] }));
}
function ChatMessages({ welcomeMessage }) {
  const { slot, chat } = useChatUI();
  const listRef = _react.useRef.call(void 0, null);
  const stickToBottom = _react.useRef.call(void 0, true);
  const visible = chat.messages.filter((m) => m.role !== "system");
  const onScroll = () => {
    const el = listRef.current;
    if (el) stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  };
  useIsomorphicLayoutEffect(() => {
    const el = listRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [visible.length, chat.streamingMessage, chat.isLoading]);
  const streaming = chat.isStreaming ? { id: "cf-streaming", role: "assistant", content: chat.streamingMessage, createdAt: /* @__PURE__ */ new Date() } : null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("messages", "cf-messages")), { ref: listRef, onScroll, role: "log", "aria-live": "polite", children: [
    visible.length === 0 && !streaming && !chat.isLoading && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatEmptyState, { welcomeMessage }),
    visible.map((m) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatMessage, { message: m }, m.id)),
    streaming && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatMessage, { message: streaming, isStreaming: true }),
    chat.isLoading && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatTypingIndicator, {})
  ] }));
}
function ChatSuggestions({ suggestions, alwaysShow = false }) {
  const { slot, chat } = useChatUI();
  if (suggestions.length === 0) return null;
  if (!alwaysShow && chat.messages.some((m) => m.role !== "system")) return null;
  const busy = chat.isLoading || chat.isStreaming;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("suggestions", "cf-suggestions")), { children: suggestions.map((s) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, { type: "button" }, slot("suggestion", "cf-suggestion")), { disabled: busy, onClick: () => chat.sendMessage(s), children: s }), s)) }));
}
function ChatError() {
  const { slot, chat, labels } = useChatUI();
  if (!chat.error) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("error", "cf-error")), { role: "alert", children: [
    labels.errorPrefix,
    " ",
    chat.error.message
  ] }));
}
function ChatInput({ autoFocus }) {
  const { slot, components, chat, labels } = useChatUI();
  const [value, setValue] = _react.useState.call(void 0, "");
  const textareaRef = _react.useRef.call(void 0, null);
  const isBusy = chat.isLoading || chat.isStreaming;
  const submit = _react.useCallback.call(void 0, () => {
    if (!value.trim() || isBusy) return;
    chat.sendMessage(value);
    setValue("");
  }, [value, isBusy, chat]);
  useIsomorphicLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  const inputProps = {
    value,
    setValue,
    submit,
    stop: chat.abortResponse,
    isBusy,
    placeholder: labels.placeholder
  };
  if (components.Input) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.Input, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, inputProps));
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "form",
    _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("inputArea", "cf-input-area")), {
      onSubmit: (e) => {
        e.preventDefault();
        submit();
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "textarea",
          _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, slot("input", "cf-input")), {
            ref: textareaRef,
            rows: 1,
            value,
            placeholder: labels.placeholder,
            "aria-label": labels.placeholder,
            autoFocus,
            onChange: (e) => setValue(e.target.value),
            onKeyDown
          })
        ),
        isBusy ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, { type: "button" }, slot("stopButton", "cf-stop-button")), { onClick: chat.abortResponse, children: labels.stop })) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, { type: "submit" }, slot("sendButton", "cf-send-button")), { disabled: !value.trim(), children: labels.send }))
      ]
    })
  );
}

// src/ui/ChatWidget.tsx

var ChatIcon = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { width: "26", height: "26", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) });
var CloseIcon = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M18 6 6 18M6 6l12 12" }) });
function ChatWidget(props) {
  const _a = props, {
    subtitle,
    welcomeMessage,
    suggestions = [],
    showHeader = true,
    showClearButton = true,
    defaultOpen = false,
    open: openProp,
    onOpenChange,
    launcherIcon,
    variant = "inline"
  } = _a, rootProps = _chunkNFLAWMIRjs.__objRest.call(void 0, _a, [
    "subtitle",
    "welcomeMessage",
    "suggestions",
    "showHeader",
    "showClearButton",
    "defaultOpen",
    "open",
    "onOpenChange",
    "launcherIcon",
    "variant"
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
  const panelId = _react.useId.call(void 0, );
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, ChatRoot, _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, rootProps), { variant, onClose: isFloating ? () => setOpen(false) : void 0, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, ChatPanel, { id: panelId, hidden: isFloating && !open, children: [
      showHeader && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatHeader, { subtitle, showClearButton }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatMessages, { welcomeMessage }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatSuggestions, { suggestions }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatError, {}),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatInput, { autoFocus: isFloating && open })
    ] }),
    isFloating && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChatLauncher, { open, toggle: () => setOpen(!open), panelId, icon: launcherIcon })
  ] }));
}
function ChatLauncher({
  open,
  toggle,
  panelId,
  icon
}) {
  const { slot, components, assistantName, labels } = useChatUI();
  if (components.Launcher) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, components.Launcher, { open, toggle, assistantName });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "button",
    _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {
      type: "button"
    }, slot("launcher", "cf-launcher")), {
      onClick: toggle,
      "aria-expanded": open,
      "aria-controls": panelId,
      "aria-label": open ? labels.close : labels.open,
      children: open ? CloseIcon : icon != null ? icon : ChatIcon
    })
  );
}


















exports.ChatAvatar = ChatAvatar; exports.ChatEmptyState = ChatEmptyState; exports.ChatError = ChatError; exports.ChatHeader = ChatHeader; exports.ChatInput = ChatInput; exports.ChatLauncher = ChatLauncher; exports.ChatMessage = ChatMessage; exports.ChatMessages = ChatMessages; exports.ChatPanel = ChatPanel; exports.ChatRoot = ChatRoot; exports.ChatSuggestions = ChatSuggestions; exports.ChatTypingIndicator = ChatTypingIndicator; exports.ChatWidget = ChatWidget; exports.DEFAULT_CSS = DEFAULT_CSS; exports.DEFAULT_LABELS = _chunk3EG5RUY4js.DEFAULT_LABELS; exports.themeToCssVars = themeToCssVars; exports.useChatUI = useChatUI;

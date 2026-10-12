import {
  __spreadProps,
  __spreadValues,
  anthropicAdapter,
  buildSystemPrompt,
  clearSession,
  generateId,
  getAdapter,
  getSession,
  openaiAdapter,
  setSessionMessages,
  streamCompletion,
  useChat
} from "./chunk-EANEMS5C.mjs";

// src/adapters/vanilla.ts
function createChat(config) {
  var _a, _b;
  const sessionId = (_a = config.sessionId) != null ? _a : generateId();
  const existingMessages = getSession(config.userId, sessionId).messages;
  let state = {
    messages: existingMessages.length > 0 ? existingMessages : config.initialMessages ? [...config.initialMessages] : [],
    isLoading: false,
    isStreaming: false,
    streamingMessage: "",
    error: null,
    sessionId,
    userId: config.userId
  };
  let abortController = null;
  const listeners = /* @__PURE__ */ new Set();
  let systemPrompt = (_b = config.systemPrompt) != null ? _b : "";
  let userContext = config.userContext;
  function setState(partial) {
    state = __spreadValues(__spreadValues({}, state), partial);
    listeners.forEach((l) => l(state));
  }
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  async function sendMessage(content) {
    if (!content.trim() || state.isLoading || state.isStreaming) return;
    const userMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      createdAt: /* @__PURE__ */ new Date()
    };
    const history = [...state.messages, userMessage];
    setState({ messages: history, isLoading: true, error: null });
    setSessionMessages(config.userId, sessionId, history);
    const resolvedSystemPrompt = buildSystemPrompt(systemPrompt, userContext, config.assistantName);
    const mergedConfig = __spreadProps(__spreadValues({}, config), { systemPrompt: resolvedSystemPrompt });
    let streamingStarted = false;
    abortController = streamCompletion(history, mergedConfig, {
      onChunk(text) {
        if (!streamingStarted) {
          streamingStarted = true;
          setState({ isLoading: false, isStreaming: true, streamingMessage: "" });
        }
        setState({ streamingMessage: state.streamingMessage + text });
      },
      onDone(fullText) {
        const assistantMessage = {
          id: generateId(),
          role: "assistant",
          content: fullText,
          createdAt: /* @__PURE__ */ new Date()
        };
        const finalHistory = [...history, assistantMessage];
        setSessionMessages(config.userId, sessionId, finalHistory);
        setState({ messages: finalHistory, isStreaming: false, streamingMessage: "" });
      },
      onError(error) {
        setState({ error, isLoading: false, isStreaming: false, streamingMessage: "" });
      }
    });
  }
  function abortResponse() {
    abortController == null ? void 0 : abortController.abort();
    setState({ isLoading: false, isStreaming: false, streamingMessage: "" });
  }
  function clearHistory() {
    abortController == null ? void 0 : abortController.abort();
    clearSession(config.userId, sessionId);
    setState({ messages: [], isLoading: false, isStreaming: false, streamingMessage: "", error: null });
  }
  function setSystemPrompt(prompt) {
    systemPrompt = prompt;
  }
  function setUserContext(ctx) {
    userContext = ctx;
  }
  return new Proxy(
    { subscribe, sendMessage, abortResponse, clearHistory, setSystemPrompt, setUserContext },
    {
      get(target, prop) {
        if (prop in state) return state[prop];
        return target[prop];
      }
    }
  );
}
export {
  anthropicAdapter,
  buildSystemPrompt,
  createChat,
  generateId,
  getAdapter,
  openaiAdapter,
  streamCompletion,
  useChat
};

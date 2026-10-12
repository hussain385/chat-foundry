"use strict";Object.defineProperty(exports, "__esModule", {value: true});












var _chunkNFLAWMIRjs = require('./chunk-NFLAWMIR.js');

// src/adapters/vanilla.ts
function createChat(config) {
  var _a, _b;
  const sessionId = (_a = config.sessionId) != null ? _a : _chunkNFLAWMIRjs.generateId.call(void 0, );
  const existingMessages = _chunkNFLAWMIRjs.getSession.call(void 0, config.userId, sessionId).messages;
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
    state = _chunkNFLAWMIRjs.__spreadValues.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, state), partial);
    listeners.forEach((l) => l(state));
  }
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  async function sendMessage(content) {
    if (!content.trim() || state.isLoading || state.isStreaming) return;
    const userMessage = {
      id: _chunkNFLAWMIRjs.generateId.call(void 0, ),
      role: "user",
      content: content.trim(),
      createdAt: /* @__PURE__ */ new Date()
    };
    const history = [...state.messages, userMessage];
    setState({ messages: history, isLoading: true, error: null });
    _chunkNFLAWMIRjs.setSessionMessages.call(void 0, config.userId, sessionId, history);
    const resolvedSystemPrompt = _chunkNFLAWMIRjs.buildSystemPrompt.call(void 0, systemPrompt, userContext, config.assistantName);
    const mergedConfig = _chunkNFLAWMIRjs.__spreadProps.call(void 0, _chunkNFLAWMIRjs.__spreadValues.call(void 0, {}, config), { systemPrompt: resolvedSystemPrompt });
    let streamingStarted = false;
    abortController = _chunkNFLAWMIRjs.streamCompletion.call(void 0, history, mergedConfig, {
      onChunk(text) {
        if (!streamingStarted) {
          streamingStarted = true;
          setState({ isLoading: false, isStreaming: true, streamingMessage: "" });
        }
        setState({ streamingMessage: state.streamingMessage + text });
      },
      onDone(fullText) {
        const assistantMessage = {
          id: _chunkNFLAWMIRjs.generateId.call(void 0, ),
          role: "assistant",
          content: fullText,
          createdAt: /* @__PURE__ */ new Date()
        };
        const finalHistory = [...history, assistantMessage];
        _chunkNFLAWMIRjs.setSessionMessages.call(void 0, config.userId, sessionId, finalHistory);
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
    _chunkNFLAWMIRjs.clearSession.call(void 0, config.userId, sessionId);
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









exports.anthropicAdapter = _chunkNFLAWMIRjs.anthropicAdapter; exports.buildSystemPrompt = _chunkNFLAWMIRjs.buildSystemPrompt; exports.createChat = createChat; exports.generateId = _chunkNFLAWMIRjs.generateId; exports.getAdapter = _chunkNFLAWMIRjs.getAdapter; exports.openaiAdapter = _chunkNFLAWMIRjs.openaiAdapter; exports.streamCompletion = _chunkNFLAWMIRjs.streamCompletion; exports.useChat = _chunkNFLAWMIRjs.useChat;

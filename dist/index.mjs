var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/adapters/react.ts
import { useReducer, useRef, useCallback } from "react";

// src/providers/openai.ts
var openaiAdapter = {
  buildRequest(messages, config) {
    var _a, _b, _c, _d;
    const url = (_a = config.backendUrl) != null ? _a : "https://api.openai.com/v1/chat/completions";
    const body = {
      model: (_b = config.model) != null ? _b : "gpt-4o",
      stream: true,
      temperature: (_c = config.temperature) != null ? _c : 0.7,
      max_tokens: (_d = config.maxTokens) != null ? _d : 1024,
      messages: [
        ...config.systemPrompt ? [{ role: "system", content: config.systemPrompt }] : [],
        ...messages.map((m) => ({ role: m.role, content: m.content }))
      ]
    };
    const headers = {
      "Content-Type": "application/json"
    };
    if (config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey}`;
    }
    return {
      url,
      method: "POST",
      headers,
      body: JSON.stringify(body)
    };
  },
  parseChunk(chunk) {
    var _a, _b, _c, _d;
    const line = chunk.trim();
    if (!line.startsWith("data: ")) return null;
    const data = line.slice(6);
    if (data === "[DONE]") return null;
    try {
      const parsed = JSON.parse(data);
      return (_d = (_c = (_b = (_a = parsed.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.delta) == null ? void 0 : _c.content) != null ? _d : null;
    } catch (e) {
      return null;
    }
  },
  isDone(chunk) {
    return chunk.trim() === "data: [DONE]";
  }
};

// src/providers/anthropic.ts
var anthropicAdapter = {
  buildRequest(messages, config) {
    var _a, _b, _c, _d;
    const url = (_a = config.backendUrl) != null ? _a : "https://api.anthropic.com/v1/messages";
    const body = __spreadProps(__spreadValues({
      model: (_b = config.model) != null ? _b : "claude-sonnet-4-20250514",
      stream: true,
      max_tokens: (_c = config.maxTokens) != null ? _c : 1024,
      temperature: (_d = config.temperature) != null ? _d : 0.7
    }, config.systemPrompt ? { system: config.systemPrompt } : {}), {
      messages: messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content }))
    });
    const headers = {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01"
    };
    if (config.apiKey) {
      headers["x-api-key"] = config.apiKey;
    }
    return {
      url,
      method: "POST",
      headers,
      body: JSON.stringify(body)
    };
  },
  parseChunk(chunk) {
    var _a, _b;
    const line = chunk.trim();
    if (!line.startsWith("data: ")) return null;
    const data = line.slice(6);
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === "content_block_delta") {
        return (_b = (_a = parsed.delta) == null ? void 0 : _a.text) != null ? _b : null;
      }
      return null;
    } catch (e) {
      return null;
    }
  },
  isDone(chunk) {
    try {
      const line = chunk.trim();
      if (!line.startsWith("data: ")) return false;
      const parsed = JSON.parse(line.slice(6));
      return parsed.type === "message_stop";
    } catch (e) {
      return false;
    }
  }
};

// src/core/ChatEngine.ts
function generateId() {
  return Math.random().toString(36).slice(2, 11);
}
function getAdapter(config) {
  switch (config.provider) {
    case "openai":
      return openaiAdapter;
    case "anthropic":
      return anthropicAdapter;
    case "custom":
      throw new Error(
        '[headless-chat] For "custom" provider, pass a backendUrl that accepts OpenAI-compatible streaming.'
      );
    default:
      throw new Error(`[headless-chat] Unknown provider: ${config.provider}`);
  }
}
function streamCompletion(messages, config, callbacks) {
  const controller = new AbortController();
  const adapter = getAdapter(config);
  const _a = adapter.buildRequest(messages, config), { url } = _a, requestInit = __objRest(_a, ["url"]);
  let fullText = "";
  (async () => {
    var _a2;
    try {
      const response = await fetch(url, __spreadProps(__spreadValues({}, requestInit), {
        signal: controller.signal
      }));
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `[headless-chat] HTTP ${response.status}: ${errorBody}`
        );
      }
      if (!response.body) {
        throw new Error("[headless-chat] Response body is null.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = (_a2 = lines.pop()) != null ? _a2 : "";
        for (const line of lines) {
          if (!line.trim()) continue;
          if (adapter.isDone(line)) {
            callbacks.onDone(fullText);
            return;
          }
          const text = adapter.parseChunk(line);
          if (text) {
            fullText += text;
            callbacks.onChunk(text);
          }
        }
      }
      if (buffer.trim()) {
        const text = adapter.parseChunk(buffer);
        if (text) {
          fullText += text;
          callbacks.onChunk(text);
        }
      }
      callbacks.onDone(fullText);
    } catch (err) {
      if (err.name === "AbortError") return;
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    }
  })();
  return controller;
}

// src/adapters/react.ts
function reducer(state, action) {
  switch (action.type) {
    case "ADD_USER_MESSAGE":
      return __spreadProps(__spreadValues({}, state), {
        messages: [...state.messages, action.message],
        isLoading: true,
        error: null
      });
    case "START_STREAMING":
      return __spreadProps(__spreadValues({}, state), { isLoading: false, isStreaming: true, streamingMessage: "" });
    case "APPEND_CHUNK":
      return __spreadProps(__spreadValues({}, state), { streamingMessage: state.streamingMessage + action.text });
    case "FINISH_STREAMING":
      return __spreadProps(__spreadValues({}, state), {
        messages: [...state.messages, action.assistantMessage],
        isStreaming: false,
        streamingMessage: ""
      });
    case "SET_ERROR":
      return __spreadProps(__spreadValues({}, state), { error: action.error, isLoading: false, isStreaming: false, streamingMessage: "" });
    case "CLEAR_HISTORY":
      return __spreadValues({}, initialState);
    case "SET_LOADING":
      return __spreadProps(__spreadValues({}, state), { isLoading: action.value });
    default:
      return state;
  }
}
var initialState = {
  messages: [],
  isLoading: false,
  isStreaming: false,
  streamingMessage: "",
  error: null
};
function useChat(config) {
  var _a, _b;
  const [state, dispatch] = useReducer(reducer, __spreadProps(__spreadValues({}, initialState), {
    messages: (_a = config.initialMessages) != null ? _a : []
  }));
  const abortControllerRef = useRef(null);
  const systemPromptRef = useRef((_b = config.systemPrompt) != null ? _b : "");
  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim()) return;
      if (state.isLoading || state.isStreaming) return;
      const userMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        createdAt: /* @__PURE__ */ new Date()
      };
      dispatch({ type: "ADD_USER_MESSAGE", message: userMessage });
      const history = [...state.messages, userMessage];
      const mergedConfig = __spreadProps(__spreadValues({}, config), {
        systemPrompt: systemPromptRef.current || config.systemPrompt
      });
      let streamingStarted = false;
      abortControllerRef.current = streamCompletion(history, mergedConfig, {
        onChunk(text) {
          if (!streamingStarted) {
            streamingStarted = true;
            dispatch({ type: "START_STREAMING" });
          }
          dispatch({ type: "APPEND_CHUNK", text });
        },
        onDone(fullText) {
          const assistantMessage = {
            id: generateId(),
            role: "assistant",
            content: fullText,
            createdAt: /* @__PURE__ */ new Date()
          };
          dispatch({ type: "FINISH_STREAMING", assistantMessage });
        },
        onError(error) {
          dispatch({ type: "SET_ERROR", error });
        }
      });
    },
    [config, state.messages, state.isLoading, state.isStreaming]
  );
  const abortResponse = useCallback(() => {
    var _a2;
    (_a2 = abortControllerRef.current) == null ? void 0 : _a2.abort();
    dispatch({ type: "SET_LOADING", value: false });
  }, []);
  const clearHistory = useCallback(() => {
    var _a2;
    (_a2 = abortControllerRef.current) == null ? void 0 : _a2.abort();
    dispatch({ type: "CLEAR_HISTORY" });
  }, []);
  const setSystemPrompt = useCallback((prompt) => {
    systemPromptRef.current = prompt;
  }, []);
  return __spreadProps(__spreadValues({}, state), {
    sendMessage,
    abortResponse,
    clearHistory,
    setSystemPrompt
  });
}

// src/adapters/vanilla.ts
function createChat(config) {
  var _a;
  let state = {
    messages: config.initialMessages ? [...config.initialMessages] : [],
    isLoading: false,
    isStreaming: false,
    streamingMessage: "",
    error: null
  };
  let abortController = null;
  const listeners = /* @__PURE__ */ new Set();
  let systemPrompt = (_a = config.systemPrompt) != null ? _a : "";
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
    const mergedConfig = __spreadProps(__spreadValues({}, config), { systemPrompt });
    abortController = streamCompletion(history, mergedConfig, {
      onChunk(text) {
        if (!state.isStreaming) {
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
        setState({
          messages: [...state.messages, assistantMessage],
          isStreaming: false,
          streamingMessage: ""
        });
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
    setState({
      messages: [],
      isLoading: false,
      isStreaming: false,
      streamingMessage: "",
      error: null
    });
  }
  function setSystemPrompt(prompt) {
    systemPrompt = prompt;
  }
  return new Proxy(
    { subscribe, sendMessage, abortResponse, clearHistory, setSystemPrompt },
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
  createChat,
  generateId,
  getAdapter,
  openaiAdapter,
  streamCompletion,
  useChat
};

import { useReducer, useRef, useCallback } from 'react';
import type { ChatConfig, ChatHookReturn, Message, ChatState, UserContext } from '../types/index';
import {
    streamCompletion,
    generateId,
    buildSystemPrompt,
    setSessionMessages,
    clearSession,
} from '../core/ChatEngine';

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type Action =
    | { type: 'ADD_USER_MESSAGE'; message: Message }
    | { type: 'START_STREAMING' }
    | { type: 'APPEND_CHUNK'; text: string }
    | { type: 'FINISH_STREAMING'; assistantMessage: Message }
    | { type: 'SET_ERROR'; error: Error }
    | { type: 'CLEAR_HISTORY' }
    | { type: 'SET_LOADING'; value: boolean };

function makeInitialState(config: ChatConfig, sessionId: string): ChatState {
    return {
        messages: config.initialMessages ?? [],
        isLoading: false,
        isStreaming: false,
        streamingMessage: '',
        error: null,
        sessionId,
        userId: config.userId,
    };
}

function reducer(state: ChatState, action: Action): ChatState {
    switch (action.type) {
        case 'ADD_USER_MESSAGE':
            return { ...state, messages: [...state.messages, action.message], isLoading: true, error: null };
        case 'START_STREAMING':
            return { ...state, isLoading: false, isStreaming: true, streamingMessage: '' };
        case 'APPEND_CHUNK':
            return { ...state, streamingMessage: state.streamingMessage + action.text };
        case 'FINISH_STREAMING':
            return {
                ...state,
                messages: [...state.messages, action.assistantMessage],
                isStreaming: false,
                streamingMessage: '',
            };
        case 'SET_ERROR':
            return { ...state, error: action.error, isLoading: false, isStreaming: false, streamingMessage: '' };
        case 'CLEAR_HISTORY':
            return { ...state, messages: [], isLoading: false, isStreaming: false, streamingMessage: '', error: null };
        case 'SET_LOADING':
            return { ...state, isLoading: action.value };
        default:
            return state;
    }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useChat — headless chat hook for React and React Native.
 * Supports per-user isolation via userId + sessionId, and personalised
 * responses via userContext.
 *
 * @example
 * const { messages, sendMessage, isStreaming, sessionId } = useChat({
 *   provider: 'openai',
 *   apiKey: 'sk-...',
 *   userId: currentUser.id,
 *   userContext: {
 *     name: currentUser.name,
 *     plan: currentUser.plan,
 *     recentOrders: currentUser.orders,
 *   },
 * });
 */
export function useChat(config: ChatConfig): ChatHookReturn {
    const sessionIdRef = useRef<string>(config.sessionId ?? generateId());

    const [state, dispatch] = useReducer(
        reducer,
        undefined,
        () => makeInitialState(config, sessionIdRef.current)
    );

    const abortControllerRef = useRef<AbortController | null>(null);
    const systemPromptRef = useRef<string>(config.systemPrompt ?? '');
    const userContextRef = useRef<UserContext | undefined>(config.userContext);

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim() || state.isLoading || state.isStreaming) return;

            const userMessage: Message = {
                id: generateId(),
                role: 'user',
                content: content.trim(),
                createdAt: new Date(),
            };

            dispatch({ type: 'ADD_USER_MESSAGE', message: userMessage });

            const history = [...state.messages, userMessage];
            setSessionMessages(config.userId, sessionIdRef.current, history);

            const resolvedSystemPrompt = buildSystemPrompt(
                systemPromptRef.current || config.systemPrompt,
                userContextRef.current
            );

            const mergedConfig: ChatConfig = { ...config, systemPrompt: resolvedSystemPrompt };

            let streamingStarted = false;

            abortControllerRef.current = streamCompletion(history, mergedConfig, {
                onChunk(text) {
                    if (!streamingStarted) {
                        streamingStarted = true;
                        dispatch({ type: 'START_STREAMING' });
                    }
                    dispatch({ type: 'APPEND_CHUNK', text });
                },
                onDone(fullText) {
                    const assistantMessage: Message = {
                        id: generateId(),
                        role: 'assistant',
                        content: fullText,
                        createdAt: new Date(),
                    };
                    setSessionMessages(config.userId, sessionIdRef.current, [...history, assistantMessage]);
                    dispatch({ type: 'FINISH_STREAMING', assistantMessage });
                },
                onError(error) {
                    dispatch({ type: 'SET_ERROR', error });
                },
            });
        },
        [config, state.messages, state.isLoading, state.isStreaming]
    );

    const abortResponse = useCallback(() => {
        abortControllerRef.current?.abort();
        dispatch({ type: 'SET_LOADING', value: false });
    }, []);

    const clearHistory = useCallback(() => {
        abortControllerRef.current?.abort();
        clearSession(config.userId, sessionIdRef.current);
        dispatch({ type: 'CLEAR_HISTORY' });
    }, [config.userId]);

    const setSystemPrompt = useCallback((prompt: string) => {
        systemPromptRef.current = prompt;
    }, []);

    const setUserContext = useCallback((ctx: UserContext) => {
        userContextRef.current = ctx;
    }, []);

    return {
        ...state,
        sendMessage,
        abortResponse,
        clearHistory,
        setSystemPrompt,
        setUserContext,
    };
}

import { useReducer, useRef, useCallback } from 'react';
import type { ChatConfig, ChatHookReturn, Message, ChatState } from '../types';
import { streamCompletion, generateId } from '../core/ChatEngine';

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type Action =
    | { type: 'ADD_USER_MESSAGE'; message: Message }
    | { type: 'START_STREAMING' }
    | { type: 'APPEND_CHUNK'; text: string }
    | { type: 'FINISH_STREAMING'; assistantMessage: Message }
    | { type: 'SET_ERROR'; error: Error }
    | { type: 'CLEAR_HISTORY'; systemPrompt?: string }
    | { type: 'SET_LOADING'; value: boolean };

function reducer(state: ChatState, action: Action): ChatState {
    switch (action.type) {
        case 'ADD_USER_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.message],
                isLoading: true,
                error: null,
            };
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
            return { ...initialState };
        case 'SET_LOADING':
            return { ...state, isLoading: action.value };
        default:
            return state;
    }
}

const initialState: ChatState = {
    messages: [],
    isLoading: false,
    isStreaming: false,
    streamingMessage: '',
    error: null,
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useChat — headless chat hook for React and React Native.
 *
 * @example
 * const { messages, sendMessage, isStreaming, streamingMessage } = useChat({
 *   provider: 'openai',
 *   apiKey: 'sk-...',
 * });
 */
export function useChat(config: ChatConfig): ChatHookReturn {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        messages: config.initialMessages ?? [],
    });

    const abortControllerRef = useRef<AbortController | null>(null);
    const systemPromptRef = useRef<string>(config.systemPrompt ?? '');

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim()) return;
            if (state.isLoading || state.isStreaming) return;

            const userMessage: Message = {
                id: generateId(),
                role: 'user',
                content: content.trim(),
                createdAt: new Date(),
            };

            dispatch({ type: 'ADD_USER_MESSAGE', message: userMessage });

            // Build message history to send (existing + new user message)
            const history = [...state.messages, userMessage];

            // Merge dynamic systemPrompt override into config
            const mergedConfig: ChatConfig = {
                ...config,
                systemPrompt: systemPromptRef.current || config.systemPrompt,
            };

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
        dispatch({ type: 'CLEAR_HISTORY' });
    }, []);

    const setSystemPrompt = useCallback((prompt: string) => {
        systemPromptRef.current = prompt;
    }, []);

    return {
        ...state,
        sendMessage,
        abortResponse,
        clearHistory,
        setSystemPrompt,
    };
}

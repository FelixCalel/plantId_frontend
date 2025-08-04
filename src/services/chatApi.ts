// src/services/chatApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ChatMessage {
    id: number;
    conversacionId: number;
    role: 'USUARIO' | 'BOT';
    content: string;
    createdAt: string;
}

export interface ChatConversation {
    id: number;
    identificationId: string;
    secret: string;
    createdAt: string;
    creditsUsed: number;
    messages: ChatMessage[];
}

export interface HistoryResponse {
    total: number;
    items: ChatMessage[];
}

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    tagTypes: ['Conversation', 'Message'],
    endpoints: (build) => ({
        startConversation: build.mutation<ChatConversation, { identificationId: string; secret: string }>({
            query: (body) => ({
                url: '/chat/conversaciones',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Conversation'],
        }),
        sendMessage: build.mutation<
            { userMessage: ChatMessage; botMessage: ChatMessage },
            { conversacionId: number; content: string }
        >({
            query: ({ conversacionId, content }) => ({
                url: `/chat/conversaciones/${conversacionId}/mensajes`,
                method: 'POST',
                body: { content },
            }),
            invalidatesTags: (result, error, { conversacionId }) => [
                { type: 'Conversation', id: conversacionId },
            ],
        }),
        getConversation: build.query<ChatConversation, number>({
            query: (id) => `/chat/conversaciones/${id}`,
            providesTags: (result, error, id) =>
                result
                    ? [
                        { type: 'Conversation' as const, id },
                        ...result.messages.map((m) => ({ type: 'Message' as const, id: m.id })),
                    ]
                    : [{ type: 'Conversation' as const, id }],
        }),
        getHistory: build.query<HistoryResponse, { conversacionId: number; page?: number; limit?: number }>({
            query: ({ conversacionId, page = 1, limit = 25 }) =>
                `/chat/conversaciones/${conversacionId}/historial?page=${page}&limit=${limit}`,
            providesTags: (result) =>
                result ? result.items.map((m) => ({ type: 'Message' as const, id: m.id })) : [],
        }),
    }),
});

export const {
    useStartConversationMutation,
    useSendMessageMutation,
    useGetConversationQuery,
    useGetHistoryQuery,
} = chatApi;

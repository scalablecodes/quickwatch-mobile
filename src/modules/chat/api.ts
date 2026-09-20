import { api } from '@/shared/lib/api';

import type { ChatMessage } from './types';

export const chatApi = {
  messages: (bookingId: string) =>
    api.get<{ messages: ChatMessage[] }>(`/chats/booking/${bookingId}`),
  send: (bookingId: string, receiverId: string, chat: string) =>
    api.post<{ message: string; data: ChatMessage; delivery: 'live' | 'email' }>('/chats', {
      bookingId,
      receiverId,
      chat,
    }),
};

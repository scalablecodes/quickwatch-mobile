import { api } from '@/shared/lib/api';

import type { NotificationPreferences } from '@/modules/auth/types';

import type { AppNotification } from './types';

export const notificationsApi = {
  list: (limit = 50) =>
    api.get<{ notifications: AppNotification[]; unreadCount: number }>('/notifications', { limit }),
  unreadCount: () => api.get<{ unreadCount: number }>('/notifications/unread-count'),
  markRead: (id: string) => api.patch<{ message: string }>(`/notifications/${id}/read`),
  markAllRead: () => api.patch<{ message: string }>('/notifications/read-all'),
  remove: (id: string) => api.delete<{ message: string }>(`/notifications/${id}`),
  registerDevice: (token: string, platform: string) =>
    api.post<{ message: string }>('/notifications/devices', { token, platform }),
  removeDevice: (token: string) =>
    api.delete<{ message: string }>(`/notifications/devices/${encodeURIComponent(token)}`),
  preferences: () =>
    api.get<{ preferences: NotificationPreferences }>('/notifications/preferences'),
  updatePreferences: (input: Partial<NotificationPreferences>) =>
    api.patch<{ message: string; preferences: NotificationPreferences }>(
      '/notifications/preferences',
      input
    ),
};

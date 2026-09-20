import { api } from '@/shared/lib/api';

import type { AuthResponse, RegisterInput, User, UserRole } from './types';

export const authApi = {
  login: (Email: string, Password: string) =>
    api.post<AuthResponse>('/users/login', { Email, Password }, { anonymous: true }),

  register: (input: RegisterInput) =>
    api.post<{ message: string; requiresEmailVerification: boolean; user: User }>(
      '/users/register',
      input,
      { anonymous: true }
    ),

  resendVerification: (Email: string) =>
    api.post<{ message: string }>('/users/resend-verification', { Email }, { anonymous: true }),

  forgotPassword: (Email: string) =>
    api.post<{ message: string }>('/users/forgot-password', { Email }, { anonymous: true }),

  resetPassword: (Email: string, Token: string, Password: string) =>
    api.post<{ message: string }>(
      '/users/reset-password',
      { Email, Token, Password },
      { anonymous: true }
    ),

  me: () => api.get<{ user: User }>('/users/me'),

  switchRole: (role: UserRole) => api.post<AuthResponse>('/users/me/switch-role', { role }),

  onboardRole: (role: UserRole, hourlyRate?: number) =>
    api.post<AuthResponse>('/users/me/onboard-role', { role, hourlyRate }),
};

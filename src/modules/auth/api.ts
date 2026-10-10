import { api } from '@/shared/lib/api';

import type { AuthResponse, BiometricDevice, RegisterInput, User, UsState, UserRole } from './types';

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

  /** Completes verification from the link in the welcome email (deep-linked into the app). */
  verifyEmail: (token: string, email: string) =>
    api.get<{ message: string; emailVerified: boolean }>('/users/verify-email', { token, email }),

  /** Reference data for the state picker. */
  states: () => api.get<{ states: UsState[] }>('/users/states'),

  /**
   * Registers this device for biometric sign-in. Requires the password, so it is only
   * offered right after a successful password login or re-authentication.
   */
  registerBiometric: (input: {
    Email: string;
    Password: string;
    deviceId: string;
    deviceName?: string;
  }) =>
    api.post<{ message: string; device: BiometricDevice; biometricToken: string }>(
      '/users/register-biometric',
      input,
      { anonymous: true }
    ),

  loginBiometric: (input: { Email: string; deviceId: string; biometricToken: string }) =>
    api.post<AuthResponse>('/users/login-biometric', input, { anonymous: true }),

  me: () => api.get<{ user: User }>('/users/me'),

  switchRole: (role: UserRole) => api.post<AuthResponse>('/users/me/switch-role', { role }),

  onboardRole: (role: UserRole, hourlyRate?: number) =>
    api.post<AuthResponse>('/users/me/onboard-role', { role, hourlyRate }),
};

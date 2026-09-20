import { api } from '@/shared/lib/api';

import type {
  Booking,
  CreateBookingInput,
  PaymentSummary,
  UpdateBookingDetailsInput,
} from './types';

export const bookingsApi = {
  create: (input: CreateBookingInput) =>
    api.post<{ message: string; booking: Booking }>('/bookings', input),

  mine: () => api.get<{ bookings: Booking[] }>('/bookings/my-bookings'),

  /** Open + directly-assigned requests visible to the signed-in babysitter. */
  requests: () => api.get<{ count: number; requests: Booking[] }>('/bookings/requests'),

  updateDetails: (id: string, input: UpdateBookingDetailsInput) =>
    api.patch<{ message: string; booking: Booking }>(`/bookings/${id}/details`, input),

  accept: (id: string) =>
    api.post<{ message: string; booking: Booking; paymentSummary: PaymentSummary }>(
      `/bookings/${id}/accept`
    ),

  setLifecycle: (
    id: string,
    lifecycleStatus: 'declined' | 'inProgress' | 'completed' | 'cancelled',
    reason?: string
  ) =>
    api.patch<{ message: string; booking: Booking }>(`/bookings/${id}`, {
      lifecycleStatus,
      reason,
    }),

  cancel: (id: string, reason?: string) =>
    api.post<{ message: string; booking: Booking }>(`/bookings/${id}/cancel`, { reason }),

  /** Creates (or reuses) the Stripe PaymentIntent for an accepted booking. */
  createPaymentIntent: (id: string, currency = 'usd') =>
    api.post<{
      message: string;
      clientSecret: string;
      paymentIntentId: string;
      amount: number;
      currency: string;
    }>(`/bookings/${id}/confirm-completion`, { currency }),
};

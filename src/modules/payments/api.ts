import { api } from '@/shared/lib/api';

import type { Booking } from '@/modules/bookings/types';

import type { Payment, PayoutAccount } from './types';

export const paymentsApi = {
  history: () => api.get<{ payments: Payment[] }>('/payments'),

  /** After the PaymentSheet succeeds, tell the API to mark the booking paid. */
  confirm: (bookingId: string, paymentIntentId: string) =>
    api.post<{ message: string; booking: Booking; payment: Payment }>(
      `/payments/bookings/${bookingId}/confirm`,
      {
        paymentIntentId,
      }
    ),

  payoutAccount: () => api.get<PayoutAccount>('/payments/payout-account'),

  createPayoutAccount: (returnUrl: string) =>
    api.post<{ message: string; accountId: string; url: string }>('/payments/payout-account', {
      returnUrl,
      refreshUrl: returnUrl,
    }),

  requestPayout: (bookingId: string) =>
    api.post<{ message: string; booking: Booking }>(
      `/payments/bookings/${bookingId}/request-payout`
    ),

  refund: (bookingId: string) =>
    api.post<{ message: string; booking: Booking }>(`/payments/bookings/${bookingId}/refund`),
};

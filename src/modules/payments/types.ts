import type { Booking } from '@/modules/bookings/types';

export type Payment = {
  _id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  userEmail: string;
  booking: Booking | string | null;
  payoutStatus: 'not_requested' | 'requested' | 'paid';
  refundedAmount: number;
  createdAt: string;
};

export type PayoutAccount = {
  configured: boolean;
  status: 'not_started' | 'pending' | 'enabled';
};

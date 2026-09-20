import type { StatusTone } from '@/shared/components/ui';

import type { Booking, LifecycleStatus, Participant } from '../types';

/** Human label + tone for a booking's lifecycle, with the payment layered on top. */
export function bookingStatus(booking: Booking): { label: string; tone: StatusTone } {
  const s = booking.lifecycleStatus;
  if (s === 'accepted' && booking.paymentStatus === 'paid')
    return { label: 'Confirmed', tone: 'success' };
  if (s === 'accepted') return { label: 'Awaiting payment', tone: 'warning' };
  const map: Record<LifecycleStatus, { label: string; tone: StatusTone }> = {
    requested: { label: 'Requested', tone: 'primary' },
    accepted: { label: 'Accepted', tone: 'success' },
    declined: { label: 'Declined', tone: 'danger' },
    inProgress: { label: 'In progress', tone: 'info' },
    completed: { label: 'Completed', tone: 'success' },
    cancelled: { label: 'Cancelled', tone: 'neutral' },
    refunded: { label: 'Refunded', tone: 'neutral' },
  };
  return map[s] ?? { label: s, tone: 'neutral' };
}

export const isOpen = (b: Booking) =>
  ['requested', 'accepted', 'inProgress'].includes(b.lifecycleStatus);
export const isClosed = (b: Booking) => !isOpen(b);

/** Resolve a populated participant; write responses carry bare ids. */
export function participant(value: Participant | string | null | undefined): Participant | null {
  return value && typeof value === 'object' ? value : null;
}

export function participantId(value: Participant | string | null | undefined): string | null {
  if (!value) return null;
  return typeof value === 'string' ? value : value._id;
}

/** Total the mother pays; before acceptance the quote is the requested amount. */
export function bookingTotal(b: Booking): number {
  return b.totalAmount > 0 ? b.totalAmount : b.requestedAmount;
}

export type BookingFilter = 'upcoming' | 'active' | 'past';

export function matchesFilter(b: Booking, filter: BookingFilter): boolean {
  switch (filter) {
    case 'upcoming':
      return (
        b.lifecycleStatus === 'requested' ||
        (b.lifecycleStatus === 'accepted' && b.paymentStatus !== 'paid')
      );
    case 'active':
      return (
        b.lifecycleStatus === 'inProgress' ||
        (b.lifecycleStatus === 'accepted' && b.paymentStatus === 'paid')
      );
    case 'past':
      return isClosed(b);
  }
}

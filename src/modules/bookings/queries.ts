import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bookingsApi } from './api';
import type { Booking } from './types';

export const bookingKeys = {
  all: ['bookings'] as const,
  mine: () => [...bookingKeys.all, 'mine'] as const,
  requests: () => [...bookingKeys.all, 'requests'] as const,
};

export function useMyBookings() {
  return useQuery({
    queryKey: bookingKeys.mine(),
    queryFn: async () => {
      const { bookings } = await bookingsApi.mine();
      return [...bookings].sort((a, b) => (a.selectedStartDate < b.selectedStartDate ? 1 : -1));
    },
  });
}

/** One booking from the cached list; refetches the list when it's not there yet. */
export function useBooking(id: string | undefined) {
  const query = useMyBookings();
  const booking = query.data?.find((b) => b._id === id) ?? null;
  return { ...query, booking };
}

export function useSitterRequests(enabled = true) {
  return useQuery({
    queryKey: bookingKeys.requests(),
    queryFn: async () => (await bookingsApi.requests()).requests,
    enabled,
    refetchInterval: 60_000,
  });
}

/** Invalidate every booking list after a write. */
export function useInvalidateBookings() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: bookingKeys.all });
}

/** Patch one booking into the `mine` cache so detail screens update instantly. */
export function useUpsertBooking() {
  const queryClient = useQueryClient();
  return (booking: Booking) => {
    queryClient.setQueryData<Booking[]>(bookingKeys.mine(), (current) => {
      if (!current) return current;
      const index = current.findIndex((b) => b._id === booking._id);
      if (index === -1) return [booking, ...current];
      const next = [...current];
      // Write responses aren't populated; keep the participants we already have.
      next[index] = {
        ...current[index],
        ...booking,
        mother: current[index]?.mother ?? booking.mother,
        babysitter: current[index]?.babysitter ?? booking.babysitter,
      };
      return next;
    });
  };
}

export function useBookingMutation<TVars>(fn: (vars: TVars) => Promise<{ booking: Booking }>) {
  const invalidate = useInvalidateBookings();
  const upsert = useUpsertBooking();
  return useMutation({
    mutationFn: fn,
    onSuccess: ({ booking }) => {
      upsert(booking);
      invalidate();
    },
  });
}

import type { User } from '@/modules/auth/types';

export type BookedSlot = {
  bookingId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
};

/** Approved babysitter with availability for the requested window. */
export type Sitter = Omit<User, 'Password'> & {
  availability: 'available' | 'booked';
  available: boolean;
  bookedSlots: BookedSlot[];
};

export type SitterFilters = {
  date?: string;
  startTime?: string;
  endTime?: string;
  city?: string;
  state?: string;
};

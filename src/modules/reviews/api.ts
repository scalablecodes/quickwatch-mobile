import { api } from '@/shared/lib/api';

import type { RatedUser, Review } from './types';

export const reviewsApi = {
  create: (bookingId: string, rating: number, comment: string) =>
    api.post<{ message: string; review: Review; ratingAverage: number; ratingCount: number }>(
      `/reviews/bookings/${bookingId}`,
      { rating, comment }
    ),
  forBabysitter: (id: string) =>
    api.get<{ sitter: RatedUser; count: number; reviews: Review[] }>(`/reviews/babysitters/${id}`),
  forMother: (id: string) =>
    api.get<{ mother: RatedUser; count: number; reviews: Review[] }>(`/reviews/mothers/${id}`),
};

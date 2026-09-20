import { useQuery } from '@tanstack/react-query';

import { reviewsApi } from './api';

export const reviewKeys = {
  sitter: (id: string) => ['reviews', 'sitter', id] as const,
  mother: (id: string) => ['reviews', 'mother', id] as const,
};

export function useSitterReviews(id: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.sitter(id ?? ''),
    queryFn: () => reviewsApi.forBabysitter(id as string),
    enabled: Boolean(id),
  });
}

export function useMotherReviews(id: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.mother(id ?? ''),
    queryFn: () => reviewsApi.forMother(id as string),
    enabled: Boolean(id),
  });
}

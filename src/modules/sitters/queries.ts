import { useQuery } from '@tanstack/react-query';

import { sittersApi } from './api';
import type { Sitter, SitterFilters } from './types';

export const sitterKeys = {
  all: ['sitters'] as const,
  list: (filters: SitterFilters) => [...sitterKeys.all, filters] as const,
};

export function useSitters(filters: SitterFilters = {}, enabled = true) {
  return useQuery({
    queryKey: sitterKeys.list(filters),
    queryFn: async () => (await sittersApi.list(filters)).babysitters,
    enabled,
  });
}

/** Find one sitter across any cached list, or fetch the unfiltered list. */
export function useSitter(id: string | undefined) {
  const query = useSitters({});
  const sitter: Sitter | null = query.data?.find((s) => s._id === id) ?? null;
  return { ...query, sitter };
}

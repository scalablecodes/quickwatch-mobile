import { api } from '@/shared/lib/api';

import type { Sitter, SitterFilters } from './types';

export const sittersApi = {
  list: (filters: SitterFilters = {}) =>
    api.get<{ count: number; babysitters: Sitter[] }>('/users/babysitters', filters),
};

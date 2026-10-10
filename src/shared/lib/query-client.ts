import { QueryClient } from '@tanstack/react-query';

/**
 * The app's single React Query client. Exported (rather than created inline in the root
 * layout) so dev tooling — Reactotron — can observe the same cache.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

import { useQuery } from '@tanstack/react-query';
import { getSummary } from './spending';

export function useSummaryQuery() {
  return useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

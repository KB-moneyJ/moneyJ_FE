import { useMutation } from '@tanstack/react-query';
import { getSummary } from './spending';

export function useSummaryMutation() {
  return useMutation({
    mutationFn: getSummary,
  });
}

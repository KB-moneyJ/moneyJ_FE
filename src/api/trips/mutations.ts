import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTripMembers } from './index';
import { TRIP_KEYS } from './queries';

export function useAddTripMembers(planId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (emails: string[]) => addTripMembers(planId, emails),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRIP_KEYS.all });
      qc.invalidateQueries({ queryKey: TRIP_KEYS.detail(planId) });
    },
  });
}

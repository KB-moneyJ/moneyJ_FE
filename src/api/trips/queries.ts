import { useQuery } from '@tanstack/react-query';
import { fetchTripPlans } from './index';
import { toTripCardModel } from './adapter';
import type { TripCardModel } from './types';

export const TRIP_KEYS = {
  all: ['tripPlans'] as const,
  detail: (id: number | string) => ['tripPlan', id] as const,
};

export function useTripPlans() {
  return useQuery({
    queryKey: TRIP_KEYS.all,
    queryFn: async (): Promise<TripCardModel[]> => {
      const data = await fetchTripPlans();
      return data.map(toTripCardModel);
    },
    staleTime: 60_000,
  });
}

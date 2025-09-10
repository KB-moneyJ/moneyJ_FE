// src/api/trips/queries.ts
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { fetchTripPlans, fetchTripPlanDetail } from './index';
import { toTripCardModel, toTripDetailModel } from './adapter';
import type { TripCardModel, TripDetailModel } from './types';

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
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useTripPlanDetail(id?: number | string) {
  return useQuery({
    queryKey: id ? TRIP_KEYS.detail(id) : ['tripPlan', 'empty'],
    enabled: !!id,
    queryFn: async (): Promise<TripDetailModel> => {
      try {
        const data = await fetchTripPlanDetail(id!);
        return toTripDetailModel(data);
      } catch (e) {
        // 404 또는 백엔드가 500으로 던지지만 메시지가 "저축 플랜이 존재하지 않습니다!"인 경우
        if (axios.isAxiosError(e)) {
          const status = e.response?.status;
          const msg = e.response?.data?.message as string | undefined;
          if (
            status === 404 ||
            (status === 500 && msg?.includes('저축 플랜이 존재하지 않습니다'))
          ) {
            (e as any).code = 'PLAN_NOT_FOUND';
          }
        }
        throw e;
      }
    },
    retry: false, // 존재하지 않으면 재시도 불필요
    staleTime: 60_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

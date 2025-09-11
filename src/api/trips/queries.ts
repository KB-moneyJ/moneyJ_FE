import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTripPlans,
  fetchTripPlanDetail,
  fetchTripPlanBalances,
  deleteTripPlan,
} from './index';
import { toTripCardModel, toTripDetailModel } from './adapter';
import { toBalanceModel } from './adapter';
import type { TripCardModel, TripDetailModel, TripBalanceModel } from './types';

export const TRIP_KEYS = {
  all: ['tripPlans'] as const,
  detail: (id: number | string) => ['tripPlan', id] as const,
  balances: (id: number | string) => ['tripPlan', id, 'balances'] as const,
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
    retry: false,
    staleTime: 60_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useTripPlanBalances(id?: number | string) {
  return useQuery({
    queryKey: id ? TRIP_KEYS.balances(id) : ['tripPlan', 'empty', 'balances'],
    enabled: !!id,
    queryFn: async (): Promise<TripBalanceModel[]> => {
      const data = await fetchTripPlanBalances(id!);
      return data.map(toBalanceModel).sort((a, b) => b.percent - a.percent);
    },
    staleTime: 30_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useDeleteTripPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteTripPlan(id),
    onSuccess: (_res, id) => {
      qc.setQueryData<TripCardModel[] | undefined>(TRIP_KEYS.all, (prev) =>
        prev ? prev.filter((p) => (p.id === undefined ? true : p.id !== String(id))) : prev,
      );
      qc.removeQueries({ queryKey: TRIP_KEYS.detail(id), exact: true });
      qc.removeQueries({ queryKey: TRIP_KEYS.balances(id), exact: true });
    },
  });
}

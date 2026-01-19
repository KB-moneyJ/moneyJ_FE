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
import type { TripCardModel, TripDetailModel, TripBalanceModel, TripBalancesModel } from './types';

export const TRIP_KEYS = {
  all: ['tripPlans'] as const,
  // id를 문자열로 정규화하여 queryKey 일관성 유지 (숫자/문자열 혼용 문제 방지)
  detail: (id: number | string) => ['tripPlan', String(id)] as const,
  balances: (id: number | string) => ['tripPlan', String(id), 'balances'] as const,
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
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useTripPlanBalances(id?: number | string) {
  return useQuery({
    queryKey: id ? TRIP_KEYS.balances(id) : ['tripPlan', 'empty', 'balances'],
    enabled: !!id,
    queryFn: async (): Promise<TripBalancesModel> => {
      const data = await fetchTripPlanBalances(id!);
      const members = data.userBalanceInfoList.map(toBalanceModel).sort((a, b) => b.percent - a.percent);
      return {
        groupProgress: data.tripPlanProgress,
        members,
      };
    },
    staleTime: 30_000,
    refetchOnMount: true, // 'always' → true로 변경하여 stale일 때만 refetch
    refetchOnWindowFocus: false, // 창 포커스 시 불필요한 호출 방지
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

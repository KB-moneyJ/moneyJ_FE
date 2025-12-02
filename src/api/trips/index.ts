import axios from '@/api/core/axiosInstance';
import type { TripPlanApi, TripPlanDetailApi, TripBalanceApi } from './types';

/* 여행 플랜 목록 */
export async function fetchTripPlans(): Promise<TripPlanApi[]> {
  const { data } = await axios.get<TripPlanApi[]>('/trip-plans');
  return data;
}

/* 여행 플랜 상세 */
export async function fetchTripPlanDetail(planId: number | string): Promise<TripPlanDetailApi> {
  const { data } = await axios.get<TripPlanDetailApi>(`/trip-plans/${planId}`);
  return data;
}

/* 여행 플랜 참여 멤버 초대/추가 */
export async function addTripMembers(planId: number, emails: string[]) {
  const { data } = await axios.post(`/trip-plans/${planId}/members`, { email: emails });
  return data;
}

/* 여행 플랜 참여 멤버별 계좌 잔액 및 달성률 조회 (잔액 내림차순) */
export async function fetchTripPlanBalances(planId: number | string): Promise<TripBalanceApi[]> {
  const { data } = await axios.get<TripBalanceApi[]>(`/trip-plans/${planId}/balances`);
  return data;
}

/* 여행 플랜 삭제 */
export async function deleteTripPlan(
  planId: number | string,
): Promise<{ planId: number; message: string }> {
  const { data } = await axios.delete<{ planId: number; message: string }>(`/trip-plans/${planId}`);
  return data;
}

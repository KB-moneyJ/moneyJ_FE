import axios from '@/api/core/axiosInstance';
import type { TripPlanApi, TripPlanDetailApi } from './types';

export async function fetchTripPlans(): Promise<TripPlanApi[]> {
  const { data } = await axios.get<TripPlanApi[]>('/trip-plans');
  return data;
}

export async function fetchTripPlanDetail(planId: number | string): Promise<TripPlanDetailApi> {
  const { data } = await axios.get<TripPlanDetailApi>(`/trip-plans/${planId}`);
  return data;
}

export async function addTripMembers(planId: number, emails: string[]) {
  const { data } = await axios.post(`/trip-plans/${planId}/members`, { email: emails });
  return data;
}

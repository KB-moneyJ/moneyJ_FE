import axios from '@/api/core/axiosInstance';
import type { TripPlanApi } from './types';

export async function fetchTripPlans(): Promise<TripPlanApi[]> {
  const { data } = await axios.get<TripPlanApi[]>('/trip-plans');
  return data;
}

export async function addTripMembers(planId: number, emails: string[]) {
  const { data } = await axios.post(`/trip-plans/${planId}/members`, { email: emails });
  return data;
}

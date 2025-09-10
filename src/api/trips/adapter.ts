import type { TripPlanApi, TripCardModel } from './types';

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const fmt = (d: string) => d.replaceAll('-', '.');

export function toTripCardModel(p: TripPlanApi): TripCardModel {
  const progress =
    p.totalBudget > 0 ? Math.round(clamp01(p.currentSavings / p.totalBudget) * 100) : 0;

  return {
    id: String(p.planId),
    destination: `${p.city}, ${p.country}`,
    countryCode: p.countryCode,
    period: `${fmt(p.tripStartDate)} - ${fmt(p.tripEndDate)}`,
    thumbnailUrl: '/assets/images/trip-placeholder.jpg',
    progressPercent: progress,
    membersCount: 1,
  };
}

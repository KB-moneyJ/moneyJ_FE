// src/api/trips/adapter.ts
import type { TripPlanApi, TripCardModel, TripPlanDetailApi, TripDetailModel } from './types';

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const fmtDate = (d?: string | null) => (d ? d.slice(0, 10).replaceAll('-', '.') : '');

// --- 리스트용 기존 어댑터(그대로 유지) ---
export function toTripCardModel(p: TripPlanApi): TripCardModel {
  const progress =
    p.totalBudget > 0 ? Math.round(clamp01(p.currentSavings / p.totalBudget) * 100) : 0;

  return {
    id: String(p.planId),
    destination: `${(p.city ?? '').trim()}, ${(p.country ?? '').trim()}`.replace(
      /^,\s*|,\s*$/g,
      '',
    ),
    countryCode: p.countryCode,
    period: `${fmtDate(p.tripStartDate)} - ${fmtDate(p.tripEndDate)}`,
    thumbnailUrl: '/assets/images/trip-placeholder.jpg',
    progressPercent: progress,
    membersCount: 1,
  };
}

// --- 상세용 새 어댑터 ---
export function toTripDetailModel(p: TripPlanDetailApi): TripDetailModel {
  const total = typeof p.totalBudget === 'number' ? p.totalBudget : 0;
  const saved = typeof p.currentSavings === 'number' ? p.currentSavings : 0;
  const progress = total > 0 ? Math.round(clamp01(saved / total) * 100) : 0;

  const members =
    p.tripMemberDTOList?.map((m) => ({
      id: String(m.userId),
      name: m.nickname || m.email,
      percent: progress,
      avatarUrl: m.image_url,
    })) ?? [];

  const checklist = p.tripTip ?? [];
  const cautions: string[] = [];

  return {
    id: String(p.planId),
    destination: `${(p.city ?? '').trim()}, ${(p.country ?? '').trim()}`.replace(
      /^,\s*|,\s*$/g,
      '',
    ),
    countryCode: p.countryCode,
    period: `${fmtDate(p.tripStartDate)} - ${fmtDate(p.tripEndDate)}`,
    thumbnailUrl: '/assets/images/trip-placeholder.jpg',
    progressPercent: progress,
    members,
    overviewTip: p.savingsPhrase?.[0] ?? p.tripTip?.[0],
    checklist,
    cautions,
    categories: p.categoryDTOList?.map((c) => ({ name: c.categoryName, amount: c.amount })),
  };
}

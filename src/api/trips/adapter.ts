import axios from '@/api/core/axiosInstance';
import type {
  TripPlanApi,
  TripCardModel,
  TripPlanDetailApi,
  TripDetailModel,
  TripBalanceApi,
  TripBalanceModel,
  TipItem,
} from './types';

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const fmtDate = (d?: string | null) => (d ? d.slice(0, 10).replaceAll('-', '.') : '');
const parseTipsLocal = (raw?: string | null): TipItem[] => {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = Math.max(line.indexOf(':'), line.indexOf('：'));
      if (idx === -1) return { label: '', text: line };
      const label = line
        .slice(0, idx)
        .trim()
        .replace(/[：:]+$/, '');
      const text = line.slice(idx + 1).trim();
      return { label, text };
    });
};

function absolutize(url?: string): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  const base = (axios as any)?.defaults?.baseURL ?? '';
  try {
    return base ? new URL(url, base).toString() : url;
  } catch {
    return url;
  }
}

export function toTripCardModel(p: TripPlanApi): TripCardModel {
  const total = typeof p.totalBudget === 'number' ? p.totalBudget : 0;
  const saved = typeof p.currentSavings === 'number' ? p.currentSavings : 0;

  const ratio = total > 0 ? saved / total : 0;
  const progress = total > 0 ? Math.round(clamp01(saved / total) * 100) : 0;

  return {
    id: String(p.planId),
    destination: `${(p.city ?? '').trim()}, ${(p.country ?? '').trim()}`.replace(
      /^,\s*|,\s*$/g,
      '',
    ),
    countryCode: p.countryCode,
    period: `${(p.tripStartDate ?? '').slice(0, 10).replaceAll('-', '.')} - ${(p.tripEndDate ?? '').slice(0, 10).replaceAll('-', '.')}`,
    thumbnailUrl: '/assets/images/trip-placeholder.jpg',
    progressPercent: progress,
    membersCount: 1,
  };
}

export function toTripDetailModel(p: TripPlanDetailApi): TripDetailModel {
  const total = typeof p.totalBudget === 'number' ? p.totalBudget : 0;
  const saved = typeof p.currentSavings === 'number' ? p.currentSavings : 0;
  const progress = total > 0 ? Math.round(clamp01(saved / total) * 100) : 0;
  const rawTip =
    typeof p.tip === 'string' ? p.tip : Array.isArray(p.tripTip) ? p.tripTip.join('\n') : undefined;
  const tips = parseTipsLocal(rawTip);
  const members =
    p.tripMemberDTOList?.map((m) => ({
      id: String(m.userId),
      name: m.nickname || m.email,
      percent: progress,
      avatarUrl: absolutize(m.image_url),
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
    overviewTip: (p.savingsPhrase?.[0] ?? tips[0]?.text ?? p.tripTip?.[0]) || undefined,
    tips,
    checklist,
    cautions,
    categories: p.categoryDTOList?.map((c) => ({ name: c.categoryName, amount: c.amount })),
    totalBudget: total,
    currentSavings: saved,
  };
}

export function toBalanceModel(api: TripBalanceApi): TripBalanceModel {
  return {
    id: String(api.userId),
    name: api.nickname,
    avatarUrl: absolutize(api.profileImage),
    balance: api.balance,
    percent: Math.round(api.progress * 10) / 10,
  };
}

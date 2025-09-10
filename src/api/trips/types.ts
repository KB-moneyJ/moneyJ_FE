// src/api/trips/types.ts

export type TripPlanApi = {
  planId: number;
  country: string;
  countryCode: string;
  city: string;
  tripStartDate: string;
  tripEndDate: string;
  totalBudget: number;
  currentSavings: number;
};

export type TripCardModel = {
  id: string;
  destination: string;
  countryCode?: string;
  period: string;
  thumbnailUrl: string;
  progressPercent: number;
  membersCount: number;
};

// 상세 조회 응답 (리스트 공통 필드 + 상세 필드)
export type TripMemberApi = {
  userId: number;
  nickname: string;
  email: string;
  image_url?: string;
};

export type CategoryApi = {
  categoryName: string;
  amount: number;
};

export type TripPlanDetailApi = TripPlanApi & {
  duration: number;
  startDate?: string; // 저축 시작일(선택)
  targetDate?: string; // 저축 목표일(선택)
  savingsPhrase?: string[];
  tripTip?: string[]; // 여행 팁
  categoryDTOList?: CategoryApi[];
  tripMemberDTOList?: TripMemberApi[];
};

// UI 모델 (상세 페이지용)
export type TripDetailModel = {
  id: string;
  destination: string;
  countryCode?: string;
  period: string;
  thumbnailUrl: string;
  progressPercent: number;

  // TripOverviewCard
  members: { id: string; name: string; percent: number; avatarUrl?: string }[];
  overviewTip?: string; // TripOverviewCard에 넘길 한 줄 팁

  // BeforeYouGoCard
  checklist: string[];
  cautions: string[];

  // ExpenseCard 등에서 쓸 수 있는 원천 데이터(옵션)
  categories?: { name: string; amount: number }[];
};

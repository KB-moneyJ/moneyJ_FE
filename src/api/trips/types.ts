export type TipItem = { label: string; text: string };

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
  startDate?: string;
  targetDate?: string;
  savingsPhrase?: string[];
  tripTip?: string[];
  tip?: string;
  categoryDTOList?: CategoryApi[];
  tripMemberDTOList?: TripMemberApi[];
};

export type TripDetailModel = {
  id: string;
  destination: string;
  countryCode?: string;
  period: string;
  thumbnailUrl: string;
  progressPercent: number;
  members: { id: string; name: string; percent: number; avatarUrl?: string }[];
  overviewTip?: string;
  tips?: TipItem[];
  checklist: string[];
  cautions: string[];
  categories?: { name: string; amount: number }[];
  totalBudget: number;
  currentSavings: number;
  savingsPhrases?: string[];
};

export type TripBalanceApi = {
  userId: number;
  nickname: string;
  profileImage?: string;
  balance: number;
  progress: number;
};

export type TripBalanceModel = {
  id: string;
  name: string;
  avatarUrl?: string;
  balance: number;
  percent: number;
};

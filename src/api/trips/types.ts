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

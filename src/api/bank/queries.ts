import { useMutation, useQuery } from '@tanstack/react-query';
import {
  addBankCredential,
  createBankConnectedId,
  fetchBankAccounts,
  getCredentialsList,
  linkTripPlanAccount,
  refreshTripPlanBalance,
  changeTripPlanAccount,
  deleteBankCredential,
  type BankOrganizationCode,
} from './bank';

export const BANK_KEYS = {
  credentials: ['codef', 'credentials'] as const,
  accounts: (org: string) => ['bank', 'accounts', org] as const,
  tripAccount: (tripPlanId: number) => ['trip', 'account', tripPlanId] as const,
};

// 연결된 기관 목록
export function useCredentialsList() {
  return useQuery({
    queryKey: BANK_KEYS.credentials,
    queryFn: getCredentialsList,
    staleTime: 60_000,
  });
}

// 특정 은행의 계좌 목록
export function useBankAccounts(org: BankOrganizationCode, enabled = true) {
  return useQuery({
    queryKey: BANK_KEYS.accounts(org),
    queryFn: () => fetchBankAccounts(org),
    enabled,
    staleTime: 60_000,
  });
}

// 모달 제출 → 커넥티드ID 생성(최초), 혹은 계정 추가(이미 있다면) + 계좌 목록 새로고침
export function useConnectBank() {
  return useMutation({
    mutationFn: async (p: { organization: BankOrganizationCode; id: string; password: string }) => {
      // 보통은 첫 연결이라면 connected-id부터. 추가 연결이면 addBankCredential로도 충분.
      // 안전하게: connected-id 먼저 시도 → 실패하면 credentials 추가로 시도하는 방식도 가능.
      try {
        await createBankConnectedId(p.organization, p.id, p.password);
      } catch {
        // 이미 connected-id가 있다면 credentials만 추가해도 됨
        await addBankCredential(p.organization, p.id, p.password);
      }
      return true;
    },
  });
}

// 여행 플랜에 계좌 연결/변경/잔액 조회
export function useLinkTripPlanAccount() {
  return useMutation({
    mutationFn: linkTripPlanAccount,
  });
}
export function useRefreshTripPlanBalance() {
  return useMutation({
    mutationFn: (tripPlanId: number) => refreshTripPlanBalance(tripPlanId),
  });
}
export function useChangeTripPlanAccount() {
  return useMutation({
    mutationFn: changeTripPlanAccount,
  });
}

export function useDeleteBankCredential() {
  return useMutation({
    mutationFn: deleteBankCredential,
  });
}

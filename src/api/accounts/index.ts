import axios from '@/api/core/axiosInstance';

const BASE_URL = import.meta.env.VITE_API_URL as string;

export type AccountLinkResponseDTO = {
  accountName: string;
  accountNumberDisplay: string;
  balance: number;
};

/**
 * 계좌 수동 업데이트 및 조회
 * @param accountId 계좌 ID
 * @returns AccountLinkResponseDTO
 */
export async function manualAccountUpdate(
  accountId: number,
): Promise<AccountLinkResponseDTO> {
  const { data } = await axios.get<AccountLinkResponseDTO>(
    `${BASE_URL}/accounts/${accountId}`,
  );
  return data;
}


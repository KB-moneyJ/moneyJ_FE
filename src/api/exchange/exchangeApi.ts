import axios from 'axios';

const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY; // 환경변수로 관리 (Vite 기준)
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

/**
 * 특정 기준통화(base) → 목표통화(target)의 환율을 가져옴
 * 예: base = "USD", target = "KRW"
 *
 * React Query와 함께 사용할 경우의 장점:
 * - API 호출 자체는 동일하지만, React Query가 요청 결과를 캐싱하고
 *   동일한 요청의 중복 호출을 방지함.
 * - Axios 요청 실패 시 자동 재시도(retry 설정)와 결합되어 안정적인 데이터 fetch 가능.
 */
export const getExchangeRate = async (base: string, target: string) => {
  const { data } = await axios.get(`${BASE_URL}/pair/${base}/${target}`);

  if (data.result !== 'success') {
    throw new Error('환율 정보를 불러오지 못했습니다.');
  }

  return {
    base: data.base_code,
    target: data.target_code,
    rate: data.conversion_rate,
    lastUpdate: data.time_last_update_utc,
  };
};

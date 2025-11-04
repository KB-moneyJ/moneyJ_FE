import { useQuery } from '@tanstack/react-query';
import { getExchangeRate } from './exchangeApi';

/**
 * @param base 기준 통화 (예: 'USD')
 * @param target 대상 통화 (예: 'KRW')
 *
 * [React Query 성능 개선 포인트]
 * 1. 중복 요청 방지
 *    - 동일한 쿼리 키(['exchangeRate', base, target])로 여러 컴포넌트에서 요청하더라도
 *      한 번의 네트워크 호출만 발생하고 결과를 공유함.
 *
 * 2. 자동 캐싱
 *    - 이전에 호출한 환율 데이터는 캐시에 저장되어, 동일 요청 시 즉시 재사용됨.
 *      네트워크 트래픽 감소 및 화면 로딩 속도 개선 효과가 있음.
 *
 * 3. Stale Time 제어
 *    - staleTime(1시간) 동안은 API를 재호출하지 않고 캐시된 데이터를 사용함.
 *      실시간성이 크게 중요하지 않은 환율 데이터에 적합함.
 *
 * 4. 백그라운드 자동 리패치
 *    - 캐시가 오래된 경우 자동으로 최신 데이터를 가져옴.
 *      사용자는 항상 최신 데이터를 볼 수 있음.
 *
 * 5. 상태 자동 관리
 *    - isLoading, isError, isSuccess 등 상태를 수동으로 관리할 필요 없음.
 *      코드가 간결하고 유지보수가 용이함.
 *
 * 결과적으로,
 * React Query는 환율 API 같은 “외부 데이터 조회형 API”의 호출 횟수를 줄이고,
 * 로딩 및 에러 처리와 캐싱을 자동화해 성능과 사용자 경험(UX)을 모두 향상시킨다.
 */
export const useExchangeRate = (base: string, target: string) => {
  return useQuery({
    queryKey: ['exchangeRate', base, target],
    queryFn: () => getExchangeRate(base, target),
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시된 데이터 재사용
    retry: 1, // 실패 시 한 번만 재시도하여 불필요한 네트워크 낭비 방지
  });
};

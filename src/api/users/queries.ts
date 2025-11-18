import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchMe } from './index';
import type { UserMe } from './types';
import { loadMeFromStorage, saveMeToStorage, clearMeStorage } from './userLocalStorage';
import type { AxiosError } from 'axios';

export const USER_KEYS = {
  me: ['user', 'me'] as const,
};

export function useMe() {
  const query = useQuery<UserMe, AxiosError>({
    queryKey: USER_KEYS.me,
    queryFn: fetchMe,
    //  placeholderData: () => {
    //   const cached = loadMeFromStorage();
    //   if (!cached) return undefined;
    //   const placeholder: UserMe = {
    //     id: -1,
    //     nickname: cached.nickname,
    //     email: cached.email,
    //     profileImage: cached.profileImage,
    //   };
    //   return placeholder;
    // },
    initialData: () => {
      const cached = loadMeFromStorage();
      if (!cached) return undefined;

      const initial: UserMe = {
        id: -1, // 로컬에는 id가 없어서 임시 id 부여
        nickname: cached.nickname,
        email: cached.email,
        profileImage: cached.profileImage,
      };
      /**
       * 기존 코드에서는 placeholderData를 사용했기 때문에
       * - UI는 즉시 표시됐지만
       * - React Query는 이것을 "캐시"로 인정하지 않아
       *   staleTime과 관계없이 매번 fetchMe를 실행함
       *
       * initialData로 변경하면 동작이 다음처럼 개선됨:
       *
       * 1) initialData는 정식 캐시로 등록됨
       *    → staleTime 동안 fresh 상태 유지
       *    → 동일 쿼리 재렌더 / 재마운트 시 fetchMe 호출 생략
       *
       * 2) 새로고침 후에도 initialData가 캐싱된 상태로 유지됨
       *    → 페이지 로딩 시 즉시 사용자 정보 렌더
       *    → 불필요한 fetchMe 호출 감소
       *
       * 3) 캐시가 존재하므로 React Query가
       *    background refetch 정책을 안정적으로 적용
       *    → 필요한 시점에만 서버에서 최신 데이터 가져옴
       *
       * 즉, “초기 로딩 최적화 + 불필요한 네트워크 요청 제거” 효과가 동시에 생김.
       */

      return initial;
    },

    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (query.status === 'success' && query.data) {
      saveMeToStorage(query.data);
      return;
    }
    if (query.error?.response?.status === 401) {
      clearMeStorage();
    }
  }, [query.status, query.data, query.error]);

  return query;
}

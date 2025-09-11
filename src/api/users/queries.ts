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
    staleTime: 5 * 60 * 1000,
    retry: false,
    placeholderData: () => {
      const cached = loadMeFromStorage();
      if (!cached) return undefined;
      const placeholder: UserMe = {
        id: -1,
        nickname: cached.nickname,
        email: cached.email,
        profileImage: cached.profileImage,
      };
      return placeholder;
    },
  });

  useEffect(() => {
    if (query.status === 'success' && query.data) {
      saveMeToStorage(query.data);
    }
  }, [query.status, query.data]);

  useEffect(() => {
    if (query.error?.response?.status === 401) {
      clearMeStorage();
    }
  }, [query.error]);

  return query;
}

import axios from '@/api/core/axiosInstance';
import type { UserMe } from './types';

export async function fetchMe(): Promise<UserMe> {
  console.log('%c🔥 fetchMe 실행됨!', 'color: red; font-weight: bold');
  const { data } = await axios.get<UserMe>('/users');
  return data;
}

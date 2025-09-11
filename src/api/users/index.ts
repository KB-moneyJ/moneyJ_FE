import axios from '@/api/core/axiosInstance';
import type { UserMe } from './types';

export async function fetchMe(): Promise<UserMe> {
  const { data } = await axios.get<UserMe>('/users');
  return data;
}

const BASE_URL = import.meta.env.VITE_API_URL as string;
import axios from 'axios';

export function loginWithKakao() {
  window.location.href = `${BASE_URL}/oauth2/authorization/kakao`;
  localStorage.setItem('token', 'dummy-token-1234');
}

export async function logout() {
  try {
    const res = await axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (err) {
    console.error('로그아웃 실패:', err);
    throw err;
  }
}

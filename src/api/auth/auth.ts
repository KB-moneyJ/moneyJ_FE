const BASE_URL = import.meta.env.VITE_API_URL as string;
import axios from 'axios';

export function loginWithKakao() {
  window.location.href = `${BASE_URL}/oauth2/authorization/kakao`;
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isFirstLogin');
    localStorage.removeItem('me.public');

    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    return res.data;
  } catch (err) {
    console.error('로그아웃 실패:', err);
    throw err;
  }
}

export async function isValid() {
  try {
    const res = await axios.get(`${BASE_URL}/auth/validate`, {
      withCredentials: true,
    });
    return res;
  } catch (err) {
    throw err;
  }
}

import axios from 'axios';

let isRedirecting = false;

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10_000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status >= 400 && status < 500 && !isRedirecting) {
      isRedirecting = true;

      localStorage.removeItem('accessToken');

      alert('로그인 만료로 로그아웃 되었습니다.');
      window.location.href = '/login';
    }

    console.error('[API ERROR]', {
      url: error.config?.url,
      status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  },
);

export default instance;

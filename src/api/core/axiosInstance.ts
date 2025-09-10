import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
  timeout: 10_000,
});

instance.interceptors.request.use((config) => {
  // config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    // 디버그용: 서버가 보내준 에러 메시지/스택 확인
    console.error('[API ERROR]', {
      url: err.config?.url,
      status: err.response?.status,
      data: err.response?.data,
    });
    return Promise.reject(err);
  },
);

export default instance;

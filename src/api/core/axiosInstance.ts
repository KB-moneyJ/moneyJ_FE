import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true,
  timeout: 10_000,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API ERROR]', {
      url: err.config?.url,
      status: err.response?.status,
      data: err.response?.data,
    });
    return Promise.reject(err);
  },
);

export default instance;

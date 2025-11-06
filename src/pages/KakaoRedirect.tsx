import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeKakaoCodeForToken } from '@/api/auth/auth';

export default function KakaoRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    console.log('인가 코드:', code);

    if (code) {
      exchangeKakaoCodeForToken(code)
        .then((data) => {
          console.log('토큰 교환 성공:', data);

          localStorage.setItem('accessToken', data.token);
          localStorage.setItem('isFirstLogin', data.firstLogin);

          if (data.firstLogin === false) {
            navigate('/home');
          } else {
            navigate('/agree');
          }
        })
        .catch((err) => {
          console.error('토큰 교환 실패:', err);
        });
    }
  }, [navigate]);

  return <div>Kakao Redirecting...</div>;
}

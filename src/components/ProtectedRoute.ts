import { JSX, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  if (!token) return null;
  return children;
}

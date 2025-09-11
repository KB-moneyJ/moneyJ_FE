import { JSX, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValid } from '@/api/auth/auth';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await isValid();
        if (!res.data.valid) {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return children;
}

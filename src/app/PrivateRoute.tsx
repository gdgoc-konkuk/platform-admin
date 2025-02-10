import MainLayout from '@/features/main-layout/components/MainLayout';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export function PrivateRoute() {
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLogin(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return isLogin ? <MainLayout /> : <Navigate to="/login" />;
}

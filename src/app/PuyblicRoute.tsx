import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function PublicRoute() {
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

  return isLogin ? <Navigate to="/app/attendance" /> : <Outlet />;
}

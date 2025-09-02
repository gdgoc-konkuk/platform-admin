import { Navigate } from 'react-router-dom';
import MainLayout from '@/features/main-layout/components/MainLayout';

export function PrivateRoute() {
  const isLogin = !!localStorage.getItem('token');

  return isLogin ? <MainLayout /> : <Navigate to="/login" />;
}

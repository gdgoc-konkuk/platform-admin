import { Navigate, Outlet } from 'react-router-dom';

export function PublicRoute() {
  const isLogin = !!localStorage.getItem('token');

  return isLogin ? <Navigate to="/app/attendance" /> : <Outlet />;
}

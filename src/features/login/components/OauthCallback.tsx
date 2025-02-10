import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function OauthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hashWithoutHash = location.hash.split('#')[1] || '';

    localStorage.setItem('token', hashWithoutHash);

    navigate('/app/attendance');
  }, [location, navigate]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      Loading...
    </div>
  );
}

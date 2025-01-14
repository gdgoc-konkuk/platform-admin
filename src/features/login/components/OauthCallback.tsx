import { useLocation } from 'react-router-dom';

export function OauthCallback() {
  const location = useLocation();
  const hashWithoutHash = location.hash.split('#')[1] || '';

  console.log(hashWithoutHash);

  return <div>OauthCallback</div>;
}

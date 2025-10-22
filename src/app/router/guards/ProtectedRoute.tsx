import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { routes } from '../config';
import { useIsAuth } from '@app/session/useSession';

export function ProtectedRoute() {
  const isAuth = useIsAuth();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to={routes.auth} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
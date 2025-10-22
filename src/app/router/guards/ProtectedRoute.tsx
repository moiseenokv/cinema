import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { routes } from '../config';

export function ProtectedRoute() {
  const isAuth = true;
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to={routes.auth} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
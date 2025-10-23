import { Suspense, lazy } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuth } from '@/app/session/useSession';
import { routes } from '@/app/router/config';
import styles from './AuthPage.module.scss';
import FormSkeleton from '@/shared/ui/skeletons/FormSkeleton/FormSkeleton';

const AuthForm = lazy(() => import('./ui/AuthForm'));

export function AuthPage() {
  const isAuth = useIsAuth();
  const location = useLocation() as any;
  const cameFrom = location.state?.from?.pathname || routes.home;


  if (isAuth) return <Navigate to={cameFrom} replace />;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Авторизация</h1>
      <Suspense fallback={<FormSkeleton height={280} />}>
        <AuthForm />
      </Suspense>
    </div>
  );
}

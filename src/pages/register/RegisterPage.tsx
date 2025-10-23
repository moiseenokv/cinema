import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuth } from '@/app/session/useSession';
import { routes } from '@/app/router/config';
import s from './RegisterPage.module.scss';
import FormSkeleton from '@/shared/ui/skeletons/FormSkeleton/FormSkeleton';

const RegisterForm = lazy(() => import('./ui/RegisterForm'));

export function RegisterPage() {
  const isAuth = useIsAuth();

  if (isAuth) return <Navigate to={routes.home} replace />;

  return (
    <div className={s.page}>
      <h1 className={s.title}>Регистрация</h1>
      <Suspense fallback={<FormSkeleton height={320} />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}

export default RegisterPage;

import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@/shared/ui/fields/TextField/TextField';
import { FormActions } from '@/shared/ui/forms/FormActions/FormActions';
import { useIsAuth } from '@/app/session/useSession';
import { getAuthService } from '@/shared/api/auth';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { notify } from '@/shared/lib/notify';
import { routes } from '@/app/router/config';
import { emailSchema, passwordSchema, confirmPasswordSchema } from '@/shared/lib/validation';
import s from './RegisterPage.module.scss';

const schema = Yup.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema('password'),
});

export function RegisterPage() {
  const isAuth = useIsAuth();
  const navigate = useNavigate();
  const {
    values, errors, touched, status,
    isSubmitting, isValid, dirty,
    handleChange, handleBlur, handleSubmit,
    setStatus, setSubmitting,
  } = useFormik({
    initialValues: { email: '', password: '', confirmPassword: '' },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      setStatus(undefined);
      setSubmitting(true);
      try {
        await getAuthService().register({ username: email, password: password });
        notify.success('Вы успешно зарегистрировались');
        navigate(routes.auth);
      } catch (e) {
        setStatus(getErrorMessage(e));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldProps = (name: 'email' | 'password' | 'confirmPassword') => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    touched: (touched as any)[name],
    error: (errors as any)[name],
    placeholder:
      name === 'email' ? 'Введите e-mail'
      : name === 'password' ? 'Введите пароль'
      : 'Повторите пароль',
    autoComplete:
      name === 'email' ? 'email'
      : name === 'password' ? 'new-password'
      : 'new-password',
    type: name === 'email' ? 'text' : 'password',
  });

  if (isAuth) return <Navigate to={routes.home} replace />;

  return (
    <div className={s.page}>
      <h1 className={s.title}>Регистрация</h1>

      <form className={s.form} onSubmit={handleSubmit} noValidate>
        <TextField label="E-mail" {...getFieldProps('email')} />
        <TextField label="Пароль" {...getFieldProps('password')} />
        <TextField label="Повтор пароля" {...getFieldProps('confirmPassword')} />

        {status && <div className={s.formStatus}>{status}</div>}

        <FormActions
          submitLabel="Зарегистрироваться"
          loading={isSubmitting}
          disabled={!isValid || !dirty}
          hint={<span>Уже есть аккаунт? <Link to={routes.auth}>Войти</Link></span>}
        />
      </form>
    </div>
  );
}

import { Navigate, useLocation, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { emailSchema, passwordSchema } from '@/shared/lib/validation';
import { notify } from '@/shared/lib/notify';
import { TextField } from '@/shared/ui/fields/TextField/TextField';
import { FormActions } from '@/shared/ui/forms/FormActions/FormActions';
import { useIsAuth, useSession } from '@/app/session/useSession';
import { routes } from '@/app/router/config';
import styles from './AuthPage.module.scss';

const schema = Yup.object({
  email: emailSchema,
  password: passwordSchema,
});


export function AuthPage() {
  const isAuth = useIsAuth();
  const { login } = useSession();
  const location = useLocation() as any;
  const cameFrom = location.state?.from?.pathname || routes.home;

  const {
    values,
    errors,
    touched,
    status,
    isSubmitting,
    isValid,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setStatus,
    setSubmitting,
  }= useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      setStatus(undefined);
      setSubmitting(true);
      try {
        await login(email, password);
        notify.success('Вы успешно вошли');
      } catch (e: any) {
        setStatus(e?.message || 'Неверные учётные данные');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldProps = (name: 'email' | 'password') => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    touched: (touched as any)[name],
    error: (errors as any)[name],
    placeholder: name === 'email' ? 'Введите e-mail' : 'Введите пароль',
    autoComplete: name === 'email' ? 'email' : 'current-password',
    type: name === 'password' ? 'password' : 'text',
  });

  if (isAuth) return <Navigate to={cameFrom} replace />;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Авторизация</h1>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField label="E-mail" {...getFieldProps('email')} />
        <TextField label="Пароль" {...getFieldProps('password')} />

        {status && <div className={styles.formStatus}>{status}</div>}

        <FormActions
          submitLabel="Авторизоваться"
          loading={isSubmitting}
          disabled={!isValid || !dirty}
          hint={<span>Нет аккаунта? <Link to={routes.register}>Зарегистрируйтесь</Link></span>}
        />
      </form>
    </div>
  );
}

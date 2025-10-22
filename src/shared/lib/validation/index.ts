import * as Yup from 'yup';

export const emailSchema = Yup.string()
  .trim()
  .email('Неверный формат e-mail')
  .required('Введите e-mail');

export const passwordSchema = Yup.string()
  .required('Введите пароль')
  .min(8, 'Пароль должен быть не короче 8 символов')
  .matches(/[a-z]/, 'Добавьте строчную букву')
  .matches(/[A-Z]/, 'Добавьте заглавную букву')
  .matches(/\d/,   'Добавьте хотя бы одну цифру');

export const confirmPasswordSchema = (refField = 'password') =>
  Yup.string()
    .required('Подтвердите пароль')
    .oneOf([Yup.ref(refField)], 'Пароли не совпадают');
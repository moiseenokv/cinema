import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@/test/utils';
import { AuthPage } from './AuthPage';
import { setAuthService } from '@/shared/api/auth';
import { mockAuthService } from '@/shared/api/auth/adapters/mockAuthService';
import { useSession } from '@/app/session/useSession';

describe('AuthPage', () => {
  beforeEach(() => {
    setAuthService(mockAuthService);
    useSession.setState({ authenticated: false, token: null });
  });

  it('валидация: пустые поля показывают ошибки', async () => {
    renderWithRouter(<AuthPage />, ['/auth']);

    const email  = await screen.findByLabelText(/E-mail/i);
    const pass   = await screen.findByLabelText(/Пароль/i);
    const submit = await screen.findByRole('button', { name: 'Авторизоваться' });

    // пометим поля как touched, чтобы компонент показал ошибки
    fireEvent.blur(email);
    fireEvent.blur(pass);

    fireEvent.click(submit);

    // ждём тексты ошибок (а не плейсхолдеры)
    await screen.findByText(/Введите e-mail/i);
    await screen.findByText(/Введите пароль/i);
  });

  it('валидные данные → авторизует', async () => {
    renderWithRouter(<AuthPage />, ['/auth']);

    const email  = await screen.findByLabelText(/E-mail/i);
    const pass   = await screen.findByLabelText(/Пароль/i);
    const submit = await screen.findByRole('button', { name: 'Авторизоваться' });

    fireEvent.change(email, { target: { value: 'user@mail.com' } });
    fireEvent.change(pass,  { target: { value: 'Aa123456' } });
    fireEvent.click(submit);

    await waitFor(() => expect(useSession.getState().authenticated).toBe(true));
  });
});

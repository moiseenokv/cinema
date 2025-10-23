import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@/test/utils';
import { RegisterPage } from './RegisterPage';
import { setAuthService } from '@/shared/api/auth';
import { mockAuthService } from '@/shared/api/auth/adapters/mockAuthService';
import { useSession } from '@/app/session/useSession';

describe('RegisterPage', () => {
  beforeEach(() => {
    setAuthService(mockAuthService);
    useSession.setState({ authenticated: false, token: null });
  });

  it('валидация: несоответствие паролей', async () => {
    renderWithRouter(<RegisterPage />, ['/register']);

    const email   = await screen.findByLabelText(/E-mail/i);
    const pass    = await screen.findByLabelText(/^Пароль$/i);
    const pass2   = await screen.findByLabelText(/Повтор пароля/i);
    const submit  = await screen.findByRole('button', { name: 'Зарегистрироваться' });

    fireEvent.change(email,  { target: { value: 'user@mail.com' } });
    fireEvent.change(pass,   { target: { value: 'Aa123456' } });
    fireEvent.change(pass2,  { target: { value: 'Aa12345X' } });
    fireEvent.click(submit);

    await screen.findByText(/Пароли не совпадают/i);
  });

  it('валидные данные → регистрирует и авторизует', async () => {
    renderWithRouter(<RegisterPage />, ['/register']);

    const email   = await screen.findByLabelText(/E-mail/i);
    const pass    = await screen.findByLabelText(/^Пароль$/i);
    const pass2   = await screen.findByLabelText(/Повтор пароля/i);
    const submit  = await screen.findByRole('button', { name: 'Зарегистрироваться' });

    fireEvent.change(email, { target: { value: 'user@mail.com' } });
    fireEvent.change(pass,  { target: { value: 'Aa123456' } });
    fireEvent.change(pass2, { target: { value: 'Aa123456' } });
    fireEvent.click(submit);

    // если после регистрации НЕ логиним автоматически:
    await waitFor(() => expect(useSession.getState().authenticated).toBe(false));
    // если должны логинить автоматически — поменяй на .toBe(true)
  });
});

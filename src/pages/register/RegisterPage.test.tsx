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
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'user@mail.com' } });
    fireEvent.change(screen.getByLabelText(/^Пароль$/i), { target: { value: 'Aa123456' } });
    fireEvent.change(screen.getByLabelText(/Повтор пароля/i), { target: { value: 'Aa12345X' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    await screen.findByText(/Пароли не совпадают/i);
  });

  it('валидные данные → регистрирует и авторизует', async () => {
    renderWithRouter(<RegisterPage />, ['/register']);
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'user@mail.com' } });
    fireEvent.change(screen.getByLabelText(/^Пароль$/i), { target: { value: 'Aa123456' } });
    fireEvent.change(screen.getByLabelText(/Повтор пароля/i), { target: { value: 'Aa123456' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    await waitFor(() => expect(useSession.getState().authenticated).toBe(false));
  });
});

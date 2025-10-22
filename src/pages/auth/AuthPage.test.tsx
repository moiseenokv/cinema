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
    fireEvent.submit(screen.getByRole('button', { name: 'Авторизоваться' }));

    await screen.findByText(/Введите e-mail/i);
    await screen.findByText(/Введите пароль/i);
  });

  it('валидные данные → авторизует', async () => {
    renderWithRouter(<AuthPage />, ['/auth']);

    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'user@mail.com' } });
    fireEvent.change(screen.getByLabelText(/Пароль/i), { target: { value: 'Aa123456' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Авторизоваться' }));

    await waitFor(() => expect(useSession.getState().authenticated).toBe(true));
  });
});

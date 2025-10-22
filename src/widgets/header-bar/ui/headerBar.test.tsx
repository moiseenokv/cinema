import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '@/test/utils';
import { HeaderBar } from './HeaderBar';
import { useSession } from '@/app/session/useSession';

describe('HeaderBar', () => {
  beforeEach(() => {
    useSession.setState({ authenticated: false, token: null });
  });

  it('гость: видит «Фильмы» и «Кинотеатры», скрыт «Мои билеты», кнопка «Войти»', () => {
    renderWithRouter(<HeaderBar />);

    expect(screen.getByRole('link', { name: 'Фильмы' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Кинотеатры' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Мои билеты' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  it('авторизован: видит «Мои билеты», кнопка «Выйти»', () => {
    useSession.setState({ authenticated: true, token: 't' });
    renderWithRouter(<HeaderBar />);

    expect(screen.getByRole('link', { name: 'Мои билеты' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Выйти' })).toBeInTheDocument();
  });
});

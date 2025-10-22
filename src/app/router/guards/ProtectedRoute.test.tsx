import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';
import { useSession } from '@/app/session/useSession';

function App(startPath: string) {
  return (
    <MemoryRouter initialEntries={[startPath]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/my-tickets" element={<div>MyTickets</div>} />
        </Route>
        <Route path="/auth" element={<div>AuthPage</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => useSession.setState({ authenticated: false, token: null }));

  it('гостя редиректит на /auth', () => {
    render(App('/my-tickets'));
    expect(screen.getByText('AuthPage')).toBeInTheDocument();
  });

  it('авторизован — видит контент', () => {
    useSession.setState({ authenticated: true, token: 't' });
    render(App('/my-tickets'));
    expect(screen.getByText('MyTickets')).toBeInTheDocument();
  });
});

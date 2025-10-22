import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { routes } from '@/app/router/config';

function App() {
  return (
    <MemoryRouter initialEntries={['/unknown']}>
      <Routes>
        <Route path={routes.notFound} element={<div>NotFound</div>} />
        <Route path="*" element={<Navigate to={routes.notFound} replace />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('404 redirect', () => {
  it('левый URL → /404', () => {
    render(<App />);
    expect(screen.getByText('NotFound')).toBeInTheDocument();
  });
});

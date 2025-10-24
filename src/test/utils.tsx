import { type ReactNode } from 'react';
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { getRoutes } from '@/app/router/routes';

export function renderWithRouter(ui: ReactNode, initialEntries: string[] = ['/']) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
}

export function renderWithRouterHistory(ui: React.ReactElement, initialEntries: string[] = ['/']) {
  const router = createMemoryRouter(getRoutes(), { initialEntries });

  const utils = render(
    <RouterProvider router={router} />
  );
  return { router, ...utils };
}

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useMemo } from 'react';
import { getRoutes } from './routes';

export function AppRouter() {
  const router = useMemo(() => createBrowserRouter(getRoutes()), []);
  return <RouterProvider router={router} />;
}
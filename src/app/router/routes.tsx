import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { routes } from './config';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './guards/ProtectedRoute';

import { HomePage } from '@/pages/home/HomePage';
import { FilmsPage } from '@/pages/films/FilmsPage';
import { CinemasPage } from '@/pages/cinemas/CinemasPage';
import { MyTicketsPage } from '@/pages/tickets/TicketsPage';
import { AuthPage } from '@/pages/auth/AuthPage';
import { NotFoundPage } from '@/pages/notFound/NotFoundPage';

export function getRoutes(): RouteObject[] {
  return [
    {
      element: <MainLayout />,
      children: [
        { path: routes.home, element: <HomePage /> },
        { path: routes.films, element: <FilmsPage /> },
        { path: routes.cinemas, element: <CinemasPage /> },
        { path: routes.auth, element: <AuthPage /> },

        {
          element: <ProtectedRoute />,
          children: [
            { path: routes.myTickets, element: <MyTicketsPage /> },
          ],
        },

        { path: routes.notFound, element: <NotFoundPage /> },

        { path: routes.wildcard, element: <Navigate to={routes.notFound} replace /> }
      ],
    },
  ];
}
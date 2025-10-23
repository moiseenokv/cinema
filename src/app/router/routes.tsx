import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { routes } from './config';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './guards/ProtectedRoute';

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={null}>{node}</Suspense>
);

const HomePage      = lazy(() => import('@pages/home/HomePage').then(m => ({ default: m.HomePage })));
const FilmsPage     = lazy(() => import('@pages/films/FilmsPage').then(m => ({ default: m.FilmsPage })));
const CinemasPage   = lazy(() => import('@pages/cinemas/CinemasPage').then(m => ({ default: m.CinemasPage })));
const AuthPage      = lazy(() => import('@pages/auth/AuthPage').then(m => ({ default: m.AuthPage })));
const RegisterPage  = lazy(() => import('@pages/register/RegisterPage').then(m => ({ default: m.RegisterPage })));
const MyTicketsPage = lazy(() => import('@pages/tickets/TicketsPage').then(m => ({ default: m.MyTicketsPage })));
const NotFoundPage  = lazy(() => import('@pages/notFound/NotFoundPage').then(m => ({ default: m.NotFoundPage })));


export function getRoutes(): RouteObject[] {
  return [
    {
      element: <MainLayout />,
      children: [
        { path: routes.home, element: withSuspense(<HomePage />) },
        { path: routes.films, element: withSuspense(<FilmsPage />) },
        { path: routes.cinemas, element: withSuspense(<CinemasPage />) },
        { path: routes.auth, element: withSuspense(<AuthPage />) },
        { path: routes.register, element: withSuspense(<RegisterPage />) },

        {
          element: withSuspense(<ProtectedRoute />),
          children: [
            { path: routes.myTickets, element: withSuspense(<MyTicketsPage />) },
          ],
        },

        { path: routes.notFound, element:  withSuspense(<NotFoundPage />) },

        { path: routes.wildcard, element: <Navigate to={routes.notFound} replace /> }
      ],
    },
  ];
}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './router';
import { Notifications } from './providers/notifications/Notifications';
import '@app/styles/reset.scss';
import '@app/styles/common.scss';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Notifications />
    <AppRouter />
  </StrictMode>,
);
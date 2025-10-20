import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@app/styles/reset.scss';
import '@app/styles/common.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
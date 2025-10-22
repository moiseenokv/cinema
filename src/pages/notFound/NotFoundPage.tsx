import { Link } from 'react-router-dom';
import { routes } from '@app/router/config';

export function NotFoundPage() {
  return (
    <div>
      <h1>404 — Страница не найдена</h1>
      <Link to={routes.home}>На главную</Link>
    </div>
  );
}
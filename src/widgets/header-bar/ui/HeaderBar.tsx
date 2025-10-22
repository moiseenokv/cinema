import { NavLink, useNavigate } from 'react-router-dom';
import { routes } from '@/app/router/config';
import { Container } from '@/shared/ui/Container/Container';
import { useIsAuth, useSession } from '@/app/session/useSession';
import s from './HeaderBar.module.scss';
import { Logo } from '@/shared/ui/Logo/Logo';
import LogoSource from '@/shared/assets/logo.jpg';

export function HeaderBar() {
  const isAuth = useIsAuth();
  const { logout } = useSession();
  const navigate = useNavigate();

  const onAuthClick = () => {
    if (isAuth) {
      logout();
      navigate(routes.home);
    } else {
      navigate(routes.films); //should be auth
    }
  };

  return (
    <header className={s.header}>
      <Container>
        <div className={s.headerRow}>
          <Logo to={routes.home} src={LogoSource} alt="Cinema App" imgHeight={64} />
          <div className={s.headerRight}>
            <nav className={s.headerRightNav} aria-label="main">
              <NavLink to={routes.films} className={s.headerRightNavLink}>Фильмы</NavLink>
              <NavLink to={routes.cinemas} className={s.headerRightNavLink}>Кинотеатры</NavLink>

              {isAuth && <span className={s.headerRightNavDivider}>|</span>}
              {isAuth && (
                <NavLink to={routes.myTickets} className={s.headerRightNavLink}>
                  Мои билеты
                </NavLink>
              )}
            </nav>
            <button className={s.headerRightButton} onClick={onAuthClick}>
              {isAuth ? 'Выйти' : 'Войти'}
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
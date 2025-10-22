import { NavLink, Link } from 'react-router-dom';
import styles from './HeaderView.module.scss';

export type MenuItem = { 
    to: string; 
    label: string; 
    hidden?: boolean 
};

type Props = {
  logoTo: string;
  menu: MenuItem[];
  authButtonText: string;
  onAuthClick: () => void;
  className?: string;
};

export function HeaderView({ logoTo, menu, authButtonText, onAuthClick, className }: Props) {
  const rootClass = className ? `${styles.header} ${className}` : styles.header;
  return (
    <div className={rootClass}>
      <Link to={logoTo} className={styles.headerLogo}>
        🎬 CinemaApp
      </Link>

      <nav className={styles.headerNav} aria-label="main">
        {menu.filter(({ hidden }) => !hidden).map(({ to, label }) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
        <button className={styles.headerButton} onClick={onAuthClick}>
          {authButtonText}
        </button>
      </nav>
    </div>
  );
}

import { Link } from 'react-router-dom';
import styles from './Logo.module.scss';

type Props = {
  to: string;
  src?: string;
  alt?: string;
  text?: string;
  imgHeight?: number;
  className?: string;
};

export function Logo({ to, src, alt = 'Logo', text = 'CinemaApp', imgHeight = 32, className }: Props) {
  const root = className ? `${styles.logo} ${className}` : styles.logo;

  return (
    <Link to={to} className={root}>
      {src ? (
        <img src={src} alt={alt} className={styles.logoImg} style={{ height: imgHeight }} />
      ) : (
        <span className={styles.logoText}>{text}</span>
      )}
    </Link>
  );
}
import { memo, useMemo, type ReactNode } from 'react';
import styles from './CinemaItem.module.scss';

export type CinemaItemCinema = {
  id: number;
  name: string;
  address: string;
  network?: string;
};

export type CinemaItemSession = {
  id: number;
  startAt: string;
  format?: string;
  priceMin?: number;
  priceMax?: number;
};

type Props = {
  cinema: CinemaItemCinema;
  sessions?: CinemaItemSession[];
  actions?: ReactNode;
  onViewSessions?: () => void;
};

export const CinemaItem = memo(function CinemaItem({
  cinema,
  sessions = [],
  actions,
  onViewSessions,
}: Props) {
  const formatLabel = useMemo(() => {
    if (!sessions.length) return '2D';
    const normalized = sessions.map(s => (s.format ?? '2D').toUpperCase());
    if (normalized.some(f => f.includes('2D'))) return '2D';
    return (sessions[0].format ?? '2D').toUpperCase();
  }, [sessions]);

  return (
    <section className={styles.container} data-cinema-id={cinema.id}>
      <div className={styles.row}>
        <div className={styles.left}>
          <span className={styles.icon} aria-hidden />
          <div className={styles.main}>
            <div className={styles.titleLine}>
              <h3 className={styles.name}>{cinema.name}</h3>
              {cinema.network && <span className={styles.badge}>{cinema.network}</span>}
              <span className={styles.formatPill}>{formatLabel}</span>
            </div>
            <div className={styles.address}>{cinema.address}</div>
          </div>
        </div>
        <div className={styles.right}>
          {actions ? (
            <div className={styles.actions}>{actions}</div>
          ) : (
            <button type="button" className={styles.viewBtn} onClick={onViewSessions}>
              Сеансы
            </button>
          )}
        </div>
      </div>
    </section>
  );
});

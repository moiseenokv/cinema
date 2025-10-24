import { memo } from 'react';
import styles from './MovieCinemasSessions.module.scss';

type Cinema = {
  id: number;
  name: string;
  address?: string;
  network?: string;
};

type Session = {
  id: number;
  startAt: string;     // ISO
  format?: string;
};

const hhmm = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

type ItemProps = {
  cinema?: Cinema;
  sessions: Session[];
  onPickTime?: (id: number) => void;
};

const Item = memo(function Item({ cinema, sessions, onPickTime }: ItemProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.icon} aria-hidden />
          <h3 className={styles.name}>{cinema?.name ?? 'Кинотеатр'}</h3>
          {cinema?.network && <span className={styles.badge}>{cinema.network}</span>}
        </div>
        {cinema?.address && <div className={styles.address}>{cinema.address}</div>}
      </header>

      <div className={styles.times}>
        {sessions.map((s) => (
          <button
            key={s.id}
            type="button"
            className={styles.timeBtn}
            title={s.format}
            onClick={() => onPickTime?.(s.id)}
          >
            {hhmm(s.startAt)}
          </button>
        ))}
      </div>
    </article>
  );
});

type Props = {
  items: Array<{ cinema?: Cinema; sessions: Session[] }>;
  loading?: boolean;
  empty?: boolean;
  onPickTime?: (id: number) => void;
};

export const MovieCinemasSessions = memo(function MovieCinemasSessions({
  items,
  loading,
  empty,
  onPickTime,
}: Props) {
  if (loading) return <div className={styles.skeleton}>Загрузка сеансов…</div>;
  if (empty) return <div className={styles.empty}>Нет ближайших сеансов</div>;

  return (
    <section className={styles.list}>
      {items.map(({ cinema, sessions }) => (
        <Item
          key={(cinema?.id ?? sessions[0]?.id) as number}
          cinema={cinema}
          sessions={sessions}
          onPickTime={onPickTime}
        />
      ))}
    </section>
  );
});

import { memo, useState } from 'react';
import styles from './MovieCinemasSessions.module.scss';
import { formatShortDateTime } from '@/shared/lib/date';

type Cinema = {
  id: number;
  name: string;
  address?: string;
  network?: string;
};

type Session = {
  id: number;
  startAt: string;
  format?: string;
};
const isPast = (iso: string) => new Date(iso).getTime() <= Date.now();

type ItemProps = {
  cinema?: Cinema;
  sessions: Session[];
  ctaText?: string;
  onGo?: (sessionId: number) => void;
};

const Item = memo(function Item({
  cinema,
  sessions,
  ctaText = 'Перейти к бронированию',
  onGo,
}: ItemProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const radioName = `cinema-${cinema?.id ?? 'na'}-sessions`;
  const hintId = `${radioName}-hint`;

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

      <div className={styles.row}>
        <fieldset className={styles.radioGroup} aria-label="Выберите время сеанса">
          <legend className={styles.srOnly}>Время</legend>
          <div className={styles.radioList}>
            {sessions.map((s) => {
              const disabled = isPast(s.startAt);
              return (
                <label key={s.id} className={styles.radioItem}>
                  <input
                    type="radio"
                    name={radioName}
                    value={s.id}
                    checked={selected === s.id}
                    disabled={disabled}
                    onChange={() => setSelected(s.id)}
                  />
                  <span className={styles.badgeTime} title={s.format}>
                    {formatShortDateTime(s.startAt)}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        {selected && sessions.length > 0 && (
          <button
            type="button"
            className={styles.cta}
            disabled={selected == null}
            aria-describedby={selected == null ? hintId : undefined}
            onClick={() => selected != null && onGo?.(selected)}
          >
            {ctaText}
          </button>
        )}

        {selected == null && sessions.length > 0 && (
          <div id={hintId} className={styles.hint} aria-live="polite">
            Выберите время
          </div>
        )}
      </div>
    </article>
  );
});

type Props = {
  items: Array<{ cinema?: Cinema; sessions: Session[] }>;
  loading?: boolean;
  empty?: boolean;
  onPickTime?: (id: number) => void;
  selectMode?: boolean;
  ctaText?: string;
  onGo?: (sessionId: number) => void;
};

export const MovieCinemasSessions = memo(function MovieCinemasSessions({
  items,
  loading,
  empty,
  ctaText,
  onGo,
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
          ctaText={ctaText}
          onGo={onGo}
        />
      ))}
    </section>
  );
});

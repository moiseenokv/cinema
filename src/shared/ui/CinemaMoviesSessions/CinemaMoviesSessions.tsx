import { useId, useState, memo } from 'react';
import styles from './CinemaMoviesSessions.module.scss';

type Movie = {
  id: number;
  title: string;
  posterUrl?: string | null;
  releaseYear?: number;
  rating?: number;
  durationMin?: number;
  shortDescription?: string;
};
type Session = { id: number; startAt: string; format?: string };

const hhmm = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const isPast = (iso: string) => new Date(iso).getTime() <= Date.now();


type ItemProps = {
  movie?: Movie;
  sessions: Session[];
  selectMode?: boolean;
  ctaText?: string;
  onGo?: (sessionId: number) => void;
};

const Item = memo(function Item({
  movie,
  sessions,
  ctaText = 'Перейти к бронированию',
  onGo,
}: ItemProps) {
  const title = movie?.title ?? 'Фильм';
  const meta = [
    movie?.releaseYear && `${movie.releaseYear}`,
    movie?.durationMin && `${movie.durationMin} мин`,
    movie?.rating && `★ ${movie.rating}`,
  ]
    .filter(Boolean)
    .join(' • ');

  const [selected, setSelected] = useState<number | null>(null);
  const radioName = useId();
  const hintId = `${radioName}-hint`;

  return (
    <article className={styles.card}>
      <div className={styles.posterWrap}>
        {movie?.posterUrl ? (
          <img className={styles.poster} src={movie.posterUrl} alt={title} />
        ) : (
          <div className={styles.posterStub} />
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{title}</h3>
        {meta && <div className={styles.meta}>{meta}</div>}
        {movie?.shortDescription && <p className={styles.desc}>{movie.shortDescription}</p>}

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
                      {hhmm(s.startAt)}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className={styles.ctaCol}>
            {selected && sessions.length > 0 && (
              <button
                type="button"
                className={styles.cta}
                disabled={selected == null}
                aria-describedby={selected == null ? hintId : undefined}
                onClick={() => selected && onGo?.(selected)}
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
        </div>
      </div>
    </article>
  );
});

type Props = {
  items: Array<{ movie?: Movie; sessions: Session[] }>;
  loading?: boolean;
  empty?: boolean;
  ctaText?: string;
  onGo?: (sessionId: number) => void;
};

export function CinemaMoviesSessions({
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
      {items.map(({ movie, sessions }) => (
        <Item
          key={(movie?.id ?? sessions[0]?.id) as number}
          movie={movie}
          sessions={sessions}
          ctaText={ctaText}
          onGo={onGo}
        />
      ))}
    </section>
  );
}

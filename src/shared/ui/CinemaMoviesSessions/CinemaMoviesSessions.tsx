import styles from './CinemaMoviesSessions.module.scss';

type Movie = {
  id: number;
  title: string;
  posterUrl?: string;
  releaseYear?: number;
  rating?: number;
  durationMin?: number;
  shortDescription?: string;
};
type Session = { id: number; startAt: string; format?: string };

const hhmm = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

type ItemProps = { movie?: Movie; sessions: Session[]; onPickTime?: (id:number)=>void };

function Item({ movie, sessions, onPickTime }: ItemProps) {
  const title = movie?.title ?? 'Фильм';
  const meta = [
    movie?.releaseYear && `${movie.releaseYear}`,
    movie?.durationMin && `${movie.durationMin} мин`,
    movie?.rating && `★ ${movie.rating}`,
  ].filter(Boolean).join(' • ');

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
        <div className={styles.times}>
          {sessions.map(s => (
            <button key={s.id} type="button" className={styles.timeBtn} title={s.format} onClick={() => onPickTime?.(s.id)}>
              {hhmm(s.startAt)}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

type Props = {
  items: Array<{ movie?: Movie; sessions: Session[] }>;
  loading?: boolean;
  empty?: boolean;
  onPickTime?: (id:number)=>void;
};

export function CinemaMoviesSessions({ items, loading, empty, onPickTime }: Props) {
  if (loading) return <div className={styles.skeleton}>Загрузка сеансов…</div>;
  if (empty)   return <div className={styles.empty}>Нет ближайших сеансов</div>;
  return (
    <section className={styles.list}>
      {items.map(({ movie, sessions }) => (
        <Item key={(movie?.id ?? sessions[0]?.id) as number} movie={movie} sessions={sessions} onPickTime={onPickTime} />
      ))}
    </section>
  );
}

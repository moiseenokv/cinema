import { memo } from 'react';
import styles from './MovieInfo.module.scss';

type Props = {
  title?: string;
  releaseYear?: number;
  rating?: number;
  durationMin?: number;
  posterUrl?: string;
  shortDescription?: string;
  loading?: boolean;
  error?: string;
};

export const MovieInfo = memo(function MovieInfo({
  title,
  releaseYear,
  rating,
  durationMin,
  posterUrl,
  shortDescription,
  loading,
  error,
}: Props) {
  if (error) return <div className={styles.error}>{error}</div>;
  if (loading) return <div className={styles.skeleton}>Загрузка фильма…</div>;
  if (!title) return null;

  const meta = [
    releaseYear ? String(releaseYear) : null,
    durationMin ? `${durationMin} мин` : null,
    rating ? `★ ${rating}` : null,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <aside className={styles.info}>
      <div className={styles.posterWrap}>
        {posterUrl ? (
          <img className={styles.poster} src={posterUrl} alt={title} />
        ) : (
          <div className={styles.posterStub} />
        )}
      </div>

      <h1 className={styles.title}>{title}</h1>
      {meta && <div className={styles.meta}>{meta}</div>}
      {shortDescription && <p className={styles.desc}>{shortDescription}</p>}
    </aside>
  );
});

import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '@shared/api/movies/types';
import { routes } from '@app/router/config';
import cls from './MovieListItem.module.scss';

type Props = {
  movie: Movie;
  venueName?: string;
  sessionLabel?: string;
  badge?: { text: string; tone?: 'primary' | 'success' | 'danger' | 'muted' };
  ctaText?: string;
};

export const MovieListItem = memo(function MovieListItem({
  movie,
  venueName,
  sessionLabel,
  badge,
  ctaText = 'Сеансы',
}: Props) {
  const meta = useMemo(
    () => `${movie.releaseYear} · ${movie.durationMin} мин`,
    [movie.releaseYear, movie.durationMin]
  );

  return (
    <article className={cls.root} aria-labelledby={`movie-${movie.id}`}>
      <div className={cls.thumb}>
        {movie.posterUrl && (
          <img className={cls.img} src={movie.posterUrl} alt={movie.title} loading="lazy" />
        )}
      </div>

      <div className={cls.body}>
        <h3 id={`movie-${movie.id}`} className={cls.title}>{movie.title}</h3>
        <div className={cls.meta}>
          {meta}
          <span className={cls.dot}>•</span>
          {movie.rating.toFixed(1)}/10
        </div>

        {sessionLabel && <div className={cls.sub}>{sessionLabel}</div>}
        {venueName &&   <div className={cls.sub}>{venueName}</div>}
      </div>

      <div className={cls.right}>
        {badge && (
          <span className={`${cls.badge} ${cls[badge.tone ?? 'primary']}`}>{badge.text}</span>
        )}
        <Link to={routes.film(movie.id)} className={cls.linkButton}>
          {ctaText}
        </Link>
      </div>
    </article>
  );
});

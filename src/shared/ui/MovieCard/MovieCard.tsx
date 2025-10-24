import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '@shared/api/movies/types';
import { routes } from '@app/router/config';
import cls from './MovieCard.module.scss';

type Props = {
  movie: Movie;
};

export const MovieCard = memo(function MovieCard({ movie }: Props) {
  const ratingLabel = useMemo(() => `${movie.rating.toFixed(1)}/10`, [movie.rating]);
  const meta = useMemo(() => `${movie.releaseYear} • ${movie.durationMin} мин`, [movie.releaseYear, movie.durationMin]);

  return (
    <article className={cls.root} aria-labelledby={`movie-${movie.id}`}>
      <div className={cls.thumb}>
        {movie.posterUrl && (
          <img className={cls.img} src={movie.posterUrl} alt={movie.title} loading="lazy" />
        )}
        <span className={cls.badge}>{ratingLabel}</span>
      </div>

      <div className={cls.body}>
        <h3 id={`movie-${movie.id}`} className={cls.title}>{movie.title}</h3>
        <div className={cls.meta}>{meta}</div>
      </div>

      <div className={cls.actions}>
        <Link to={routes.film(String(movie.id))} className={cls.linkButton}>
          Просмотреть сеансы
        </Link>
      </div>
    </article>
  );
});

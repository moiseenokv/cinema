import { useEffect, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { useMoviesStore } from '@/shared/model/movies/useMoviesStore';
import { moviesSelectors } from '@/shared/model/movies/selectors';
import { cinemasSelectors } from '@/shared/model/cinemas/selectors';

import { MovieInfo } from '@/shared/ui/MovieInfo/MovieInfo';
import { MovieCinemasSessions } from '@/shared/ui/MovieCinemasSessions/MovieCinemasSessions';

import styles from './FilmPage.module.scss';
import { routes } from '@/app/router/config';

export function FilmPage() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  if (!Number.isFinite(movieId)) return <Navigate to="/films" replace />;

  useEffect(() => {
    const ms = useMoviesStore.getState();
    if (ms.status !== 'loading' && ms.status !== 'succeeded') void ms.load();

    useMoviesStore.getState().ensureLoaded();
    useMoviesStore.getState().loadMovieSessions(movieId);
  }, [movieId]);

  const moviesById = moviesSelectors.useByIdMap();
  const mStatus    = moviesSelectors.useStatus();
  const movie      = moviesById[movieId];

  const grouped     = moviesSelectors.useSessionsGroupedByCinema(movieId);
  const cinemasById = cinemasSelectors.useByIdMapAuto();

  const items = useMemo(() => {
    const entries = [...grouped.entries()];
    return entries.map(([cinemaId, sessions]) => ({
      cinema: cinemasById[cinemaId],
      sessions,
    }));
  }, [grouped, cinemasById]);

   if (mStatus === 'succeeded' && !movie) {
    return <Navigate to={routes.notFound} replace />;
  }
  
  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <MovieInfo
          title={movie?.title}
          releaseYear={movie?.releaseYear}
          rating={movie?.rating}
          durationMin={movie?.durationMin}
          posterUrl={movie?.posterUrl}
          shortDescription={movie?.shortDescription}
          loading={!movie && (mStatus === 'idle' || mStatus === 'loading')}
        />
      </div>

      <div className={styles.right}>
        <MovieCinemasSessions
          items={items}
          loading={items.length === 0 && (mStatus === 'idle' || mStatus === 'loading')}
          empty={mStatus === 'succeeded' && items.length === 0}
          onPickTime={(sessionId) => {
            // TODO: переход к бронированию конкретного сеанса
            console.log('pick session', sessionId);
          }}
        />
      </div>
    </div>
  );
}

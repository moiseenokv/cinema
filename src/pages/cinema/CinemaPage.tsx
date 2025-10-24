import { useEffect, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { useCinemasStore } from '@/shared/model/cinemas/useCinemasStore';
import { cinemasSelectors } from '@/shared/model/cinemas/selectors';
import { useByIdMapAuto } from '@/shared/model/movies/selectors';
import { CinemaInfo } from '@/shared/ui/CinemaInfo/CinemaInfo';
import { CinemaMoviesSessions } from '@/shared/ui/CinemaMoviesSessions/CinemaMoviesSessions';

import styles from './CinemaPage.module.scss';
import { routes } from '@/app/router/config';

export function CinemaPage() {
  const { id } = useParams<{ id: string }>();
  const cinemaId = Number(id);
  if (!Number.isFinite(cinemaId)) return <Navigate to="/cinemas" replace />;

  useEffect(() => {
    const c = useCinemasStore.getState();
    if (c.status !== 'loading' && c.status !== 'succeeded') void c.load();

    useCinemasStore.getState().ensureLoaded();
    useCinemasStore.getState().loadSessions(cinemaId);
  }, [cinemaId]);

  const cinema  = cinemasSelectors.useById(cinemaId);
  const cStatus = cinemasSelectors.useStatus();
  const cError  = cinemasSelectors.useError();

  const grouped    = cinemasSelectors.useSessionsGroupedByMovie(cinemaId);
  const moviesById = useByIdMapAuto();

  const items = useMemo(() => {
    const entries = [...grouped.entries()];
    return entries.map(([movieId, sessions]) => ({
      movie: moviesById[movieId],
      sessions,
    }));
  }, [grouped, moviesById]);

    if (cStatus === 'succeeded' && !cinema) {
    return <Navigate to={routes.notFound} replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <CinemaInfo
          name={cinema?.name}
          address={cinema?.address}
          network={cinema?.network}
          loading={!cinema && (cStatus === 'idle' || cStatus === 'loading')}
          error={cError}
        />
      </div>

      <div className={styles.right}>
        <CinemaMoviesSessions
          items={items}
          loading={items.length === 0 && (cStatus === 'idle' || cStatus === 'loading')}
          empty={cStatus === 'succeeded' && items.length === 0}
         /*  onPickTime={(sessionId) => {
            // TODO: переход на бронирование конкретной сессии
            console.log('pick session', sessionId);
          }} */
        />
      </div>
    </div>
  );
}

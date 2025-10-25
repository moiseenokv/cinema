import { useEffect, useMemo, useRef } from 'react';
import { MoviesList } from '@widgets/movies-list/MoviesList';
import { useMoviesStore } from '@shared/model/movies/useMoviesStore';

export function FilmsPage() {
  const byId   = useMoviesStore(s => s.byId);
  const status = useMoviesStore(s => s.status);
  const error  = useMoviesStore(s => s.error);

  const movies = useMemo(() => Object.values(byId), [byId]);

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const st = useMoviesStore.getState();
    if (st.status === 'idle') st.load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Фильмы</h1>

      {error && (
        <div style={{ color: 'tomato' }}>{error ?? 'Не удалось загрузить фильмы'}</div>
      )}

      {!error && status === 'loading' && movies.length === 0 && (
        <div>Загрузка фильмов…</div>
      )}

      {!error && status === 'succeeded' && movies.length === 0 && (
        <div data-testid="empty-state">Нет фильмов</div>
      )}

      {!error && movies.length > 0 && <MoviesList movies={movies} />}
    </div>
  );
}

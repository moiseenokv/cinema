// src/shared/model/movies/selectors.ts
import { useEffect, useMemo } from 'react';
import { useMoviesStore } from './useMoviesStore';
import type { MovieSession } from '@/shared/api/movies/types';

type Status = 'idle' | 'loading' | 'succeeded' | 'error';

const EMPTY_SESSIONS: ReadonlyArray<MovieSession> = Object.freeze([]);
// const EMPTY_BY_ID: Readonly<Record<number, unknown>> = Object.freeze({});

export const moviesSelectors = {
  // простые слайсы
  useByIdMap: () => useMoviesStore(s => s.byId),
  useStatus:  () => useMoviesStore(s => s.status as Status),
  useError:   () => useMoviesStore(s => s.error),

  // автозагрузка — хуки всегда вызываются, ранних return нет
  useByIdMapAuto: () => {
    const byId   = useMoviesStore(s => s.byId);
    const status = useMoviesStore(s => s.status as Status);

    useEffect(() => {
      if (status === 'idle' && Object.keys(byId).length === 0) {
        void useMoviesStore.getState().ensureLoaded();
      }
    }, [status, byId]);

    return byId;
  },

  // список сеансов по фильму
  useSessionsByMovieId: (movieId: number) =>
    (useMoviesStore(s => s.sessionsByMovieId[movieId]) ?? EMPTY_SESSIONS),

  // сгруппировано по cinemaId для страницы фильма
  useSessionsGroupedByCinema: (movieId: number) => {
    const sessions = moviesSelectors.useSessionsByMovieId(movieId);
    return useMemo(() => {
      const map = new Map<number, MovieSession[]>();
      for (const s of sessions) {
        const arr = map.get(s.cinemaId) ?? [];
        arr.push(s);
        map.set(s.cinemaId, arr);
      }
      for (const [, arr] of map) {
        arr.sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));
      }
      return map; // Map<cinemaId, MovieSession[]>
    }, [sessions]);
  },
};

// (опц.) хук-обёртка тем, кто импортировал именно useByIdMapAuto из этого файла
export const useByIdMapAuto = moviesSelectors.useByIdMapAuto;

// хелпер без хуков — удобно в тестах
export const groupSessionsByCinema = (sessions: MovieSession[]) => {
  const map = new Map<number, MovieSession[]>();
  for (const s of sessions) {
    const arr = map.get(s.cinemaId) ?? [];
    arr.push(s);
    map.set(s.cinemaId, arr);
  }
  for (const [, arr] of map) {
    arr.sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));
  }
  return map;
};

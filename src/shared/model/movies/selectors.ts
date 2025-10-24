import { useEffect, useMemo } from 'react';
import { useMoviesStore } from './useMoviesStore';
import type { MovieSession } from '@/shared/api/movies/types';

type Status = 'idle' | 'loading' | 'succeeded' | 'error';
const EMPTY: ReadonlyArray<MovieSession> = Object.freeze([]);


export const moviesSelectors = {
  useByIdMap: () => useMoviesStore(s => s.byId),
  useStatus:  () => useMoviesStore(s => s.status),
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

  // сеансы выбранного фильма
  useSessionsByMovieId: (movieId: number) =>
    (useMoviesStore(s => s.sessionsByMovieId[movieId]) ?? EMPTY),

  // группировка по cinemaId (для страницы фильма)
  useSessionsGroupedByCinema: (movieId: number) => {
    const sessions = moviesSelectors.useSessionsByMovieId(movieId);
    return useMemo(() => {
      const map = new Map<number, MovieSession[]>();
      for (const s of sessions) {
        const list = map.get(s.cinemaId) ?? [];
        list.push(s);
        map.set(s.cinemaId, list);
      }
      for (const [, list] of map) {
        list.sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));
      }
      return map; // Map<cinemaId, MovieSession[]>
    }, [sessions]);
  },
};

export const useByIdMapAuto = () => {
    const byId   = useMoviesStore(s => s.byId);
    const status = useMoviesStore(s => s.status);

    useEffect(() => {
      if (status === 'idle' && Object.keys(byId).length === 0) {
        useMoviesStore.getState().ensureLoaded(); 
      }
    }, [status, byId]);

    return byId;
};

export const groupSessionsByCinema = (sessions: MovieSession[]) => {
  const map = new Map<number, MovieSession[]>();
  for (const s of sessions) {
    const list = map.get(s.cinemaId) ?? [];
    list.push(s);
    map.set(s.cinemaId, list);
  }
  for (const [, list] of map) {
    list.sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));
  }
  return map;
};
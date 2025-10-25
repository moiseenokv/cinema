// src/shared/model/cinemas/selectors.ts
import { useEffect, useMemo } from 'react';
import { useCinemasStore } from './useCinemasStore';
import type { CinemaSession } from '@/shared/api/cinemas/types';

type Status = 'idle' | 'loading' | 'succeeded' | 'error';

const EMPTY_SESSIONS: ReadonlyArray<CinemaSession> = Object.freeze([]);
// const EMPTY_BY_ID: Readonly<Record<number, Cinema>> = Object.freeze({} as Record<number, Cinema>);

export const cinemasSelectors = {
  // простые слайсы
  useById:   (id: number) => useCinemasStore(s => s.byId[id]),
  useByIdMap: () => useCinemasStore(s => s.byId),
  useStatus:  () => useCinemasStore(s => s.status as Status),
  useError:   () => useCinemasStore(s => s.error),

  // автозагрузка — хуки всегда вызываются, ранних return нет
  useByIdMapAuto: () => {
    const byId   = useCinemasStore(s => s.byId);
    const status = useCinemasStore(s => s.status as Status);

    useEffect(() => {
      if (status === 'idle' && Object.keys(byId).length === 0) {
        useCinemasStore.getState().ensureLoaded();
      }
    }, [status, byId]);

    return byId;
  },

  // список сеансов по кинотеатру
  useSessionsByCinemaId: (cinemaId: number) =>
    (useCinemasStore(s => s.sessionsByCinemaId[cinemaId]) ?? EMPTY_SESSIONS),

  // сгруппировано по фильму для страницы кинотеатра
  useSessionsGroupedByMovie: (cinemaId: number) => {
    const sessions = cinemasSelectors.useSessionsByCinemaId(cinemaId);
    return useMemo(() => {
      const map = new Map<number, CinemaSession[]>();
      for (const s of sessions) {
        const arr = map.get(s.movieId) ?? [];
        arr.push(s);
        map.set(s.movieId, arr);
      }
      for (const [, arr] of map) {
        arr.sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));
      }
      return map; // Map<movieId, CinemaSession[]>
    }, [sessions]);
  },
};

// хелпер без хуков — удобно в тестах
export function groupSessionsByMovie(sessions: CinemaSession[]) {
  const map = new Map<number, CinemaSession[]>();
  for (const s of sessions) {
    const arr = map.get(s.movieId) ?? [];
    arr.push(s);
    map.set(s.movieId, arr);
  }
  for (const [, arr] of map) {
    arr.sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));
  }
  return map;
}

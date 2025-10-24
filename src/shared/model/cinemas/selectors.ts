import { useEffect, useMemo } from 'react';
import { useCinemasStore } from './useCinemasStore';
import type { CinemaSession } from '@/shared/api/cinemas/types';

const EMPTY: ReadonlyArray<unknown> = Object.freeze([]);

export const cinemasSelectors = {
  useById: (id: number) => useCinemasStore(s => s.byId[id]),
  useStatus: () => useCinemasStore(s => s.status),
  useError:  () => useCinemasStore(s => s.error),

  useByIdMap: () => useCinemasStore(s => s.byId),

  useByIdMapAuto: () => {
    const byId   = useCinemasStore(s => s.byId);
    const status = useCinemasStore(s => s.status);
    useEffect(() => {
      if (status === 'idle' && Object.keys(byId).length === 0) {
        useCinemasStore.getState().ensureLoaded();
      }
    }, [status, byId]);
    return byId;
  },

  useSessionsByCinemaId: (cinemaId: number) =>
    (useCinemasStore(s => s.sessionsByCinemaId[cinemaId]) ?? EMPTY) as any[],

  useSessionsGroupedByMovie: (cinemaId: number) => {
    const sessions = cinemasSelectors.useSessionsByCinemaId(cinemaId);
    return useMemo(() => {
      const map = new Map<number, any[]>();
      for (const s of sessions) {
        const movieId = (s as any).movieId as number;
        const arr = map.get(movieId) ?? [];
        arr.push(s);
        map.set(movieId, arr);
      }
      for (const [, list] of map) {
        list.sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));
      }
      return map; // Map<movieId, sessions[]>
    }, [sessions]);
  },
};

export function groupSessionsByMovie(sessions: CinemaSession[]) {
  const map = new Map<number, CinemaSession[]>();
  for (const s of sessions) {
    const list = map.get(s.movieId) ?? [];
    list.push(s);
    map.set(s.movieId, list);
  }
  for (const [, list] of map) {
    list.sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));
  }
  return map;
}

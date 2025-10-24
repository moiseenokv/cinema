import { create } from 'zustand';
import { getMovies, getMovieSessions } from '@shared/api/movies';
import type { Movie, MovieSession } from '@shared/api/movies/types';

type Status = 'idle' | 'loading' | 'succeeded' | 'error';

type MoviesState = {
  byId: Record<number, Movie>;
  status: Status;
  error?: string;
  load: () => Promise<void>;
  ensureLoaded: () => Promise<void>;

  sessionsByMovieId: Record<number, MovieSession[]>;
  sessionsStatus: Record<number, Status>;
  sessionsError: Record<number, string | undefined>;
  loadMovieSessions: (movieId: number) => Promise<void>;
};

let inflightList: Promise<void> | null = null;
const inflightMovieSessions: Record<number, Promise<void> | null> = {};

export const useMoviesStore = create<MoviesState>()((set, get) => ({
  byId: {},
  status: 'idle',
  error: undefined,

  async load() {
    const s = get();
    /* if (s.status === 'succeeded' && Object.keys(s.byId).length > 0) return;
    if (s.status === 'loading' || inflightList) return inflightList ?? Promise.resolve();
 */

    if (Object.keys(s.byId).length > 0 && s.status === 'succeeded') return;
    if (inflightList) return inflightList;

    set({ status: 'loading', error: undefined });

    inflightList = (async () => {
      try {
        const list = await getMovies();
        const byId: Record<number, Movie> = {};
        for (const m of list) byId[m.id] = m;
        set({ byId, status: 'succeeded' });
      } catch (e: any) {
        set({ status: 'error', error: e?.message ?? 'Не удалось загрузить фильмы' });
      } finally {
        inflightList = null;
      }
    })();

    return inflightList;
  },

  async ensureLoaded() {
    const s = get();

    const hasData = Object.keys(get().byId).length > 0;
    if (hasData) return;

    /* if (s.status === 'succeeded' && Object.keys(s.byId).length > 0) {
      return;
    } */

    if (inflightList) return inflightList;

    if (s.status === 'loading') return s.load();

    return s.load();
  },

  sessionsByMovieId: {},
  sessionsStatus: {},
  sessionsError: {},

  async loadMovieSessions(movieId: number) {
    const s = get();

    if (s.sessionsStatus[movieId] === 'loading' || inflightMovieSessions[movieId]) {
      return inflightMovieSessions[movieId] ?? Promise.resolve();
    }
    if (s.sessionsByMovieId[movieId]?.length && s.sessionsStatus[movieId] === 'succeeded') {
      return;
    }

    set({
      sessionsStatus: { ...s.sessionsStatus, [movieId]: 'loading' },
      sessionsError:  { ...s.sessionsError,  [movieId]: undefined },
    });

    inflightMovieSessions[movieId] = (async () => {
      try {
        const list = await getMovieSessions(movieId);
        set(cur => ({
          sessionsByMovieId: { ...cur.sessionsByMovieId, [movieId]: list },
          sessionsStatus:     { ...cur.sessionsStatus,     [movieId]: 'succeeded' },
        }));
      } catch (e: any) {
        set(cur => ({
          sessionsStatus: { ...cur.sessionsStatus, [movieId]: 'error' },
          sessionsError:  { ...cur.sessionsError,  [movieId]: e?.message ?? 'Не удалось загрузить сеансы' },
        }));
      } finally {
        inflightMovieSessions[movieId] = null;
      }
    })();

    return inflightMovieSessions[movieId]!;
  },
}));

/* export const resetMoviesStore = () => {
  inflightList = null;
  useMoviesStore.setState({ byId: {}, status: 'idle', error: undefined });
}; */

export const resetMoviesStore = () => {
  inflightList = null;
  
  Object.keys(inflightMovieSessions).forEach(k => (inflightMovieSessions[+k] = null));

  useMoviesStore.setState({
    byId: {},
    status: 'idle',
    error: undefined,
    sessionsByMovieId: {},
    sessionsStatus: {},
    sessionsError: {},
  });
};

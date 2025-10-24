import { create } from 'zustand';
import type { Movie } from '@/shared/api/movies/types';
import { getMovies } from '@/shared/api/movies';

type Status = 'idle' | 'loading' | 'succeeded' | 'error';

type MoviesState = {
  byId: Record<number, Movie>;
  status: Status;
  error?: string;
  load: () => Promise<void>;
  clear: () => void;
};

let inflight: Promise<void> | null = null;

export const useMoviesStore = create<MoviesState>()((set, get) => ({
  byId: {},
  status: 'idle',
  error: undefined,

  load: async () => {
    const s = get();

    if (Object.keys(s.byId).length > 0 && s.status === 'succeeded') {
      return; // ничего не делаем
    }

    if (s.status === 'loading' || inflight) return inflight ?? Promise.resolve();

    set({ status: 'loading', error: undefined });

    inflight = (async () => {
      try {
        const list = await getMovies();
        const byId: Record<number, Movie> = {};
        for (const m of list) byId[m.id] = m;
        set({ byId, status: 'succeeded' });
      } catch (e: any) {
        set({ status: 'error', error: e?.message ?? 'Не удалось загрузить фильмы' });
      } finally {
        inflight = null;
      }
    })();

    return inflight;
  },

  clear: () => set({ byId: {}, status: 'idle', error: undefined }),
}));

export const resetMoviesStore = () => {
  inflight = null;
  useMoviesStore.setState({ byId: {}, status: 'idle', error: undefined });
};

import { create } from 'zustand';
import type { Cinema, CinemaSession } from '@/shared/api/cinemas/types';
import { getCinemas, getCinemaSessions } from '@/shared/api/cinemas';

type Status = 'idle' | 'loading' | 'succeeded' | 'error';

type CinemasState = {
  byId: Record<number, Cinema>;
  status: Status;
  error?: string;

  sessionsByCinemaId: Record<number, CinemaSession[]>;
  sessionsStatus: Record<number, Status>;
  sessionsError: Record<number, string | undefined>;

  load: () => Promise<void>;
  ensureLoaded: () => Promise<void>;
  loadSessions: (cinemaId: number) => Promise<void>;
  clear: () => void;
};

let inflightCinemas: Promise<void> | null = null;

const inflightSessions: Record<number, Promise<void> | null> = {};

export const useCinemasStore = create<CinemasState>()((set, get) => ({
  byId: {},
  status: 'idle',
  error: undefined,

  sessionsByCinemaId: {},
  sessionsStatus: {},
  sessionsError: {},

  load: async () => {
    const s = get();
    if (Object.keys(s.byId).length > 0 && s.status === 'succeeded') return;
    if (s.status === 'loading' || inflightCinemas) return inflightCinemas ?? Promise.resolve();

    set({ status: 'loading', error: undefined });
    inflightCinemas = (async () => {
      try {
        const list = await getCinemas();
        const byId: Record<number, Cinema> = {};
        for (const c of list) byId[c.id] = c;
        set({ byId, status: 'succeeded' });
      } catch (e: any) {
        set({ status: 'error', error: e?.message ?? 'Не удалось загрузить кинотеатры' });
      } finally {
        inflightCinemas = null;
      }
    })();
    return inflightCinemas;
  },

  loadSessions: async (cinemaId: number) => {
    const s = get();
    if (s.sessionsByCinemaId[cinemaId]?.length && s.sessionsStatus[cinemaId] === 'succeeded') return;
    if (s.sessionsStatus[cinemaId] === 'loading' || inflightSessions[cinemaId]) {
      return inflightSessions[cinemaId] ?? Promise.resolve();
    }

    set({
      sessionsStatus: { ...s.sessionsStatus, [cinemaId]: 'loading' },
      sessionsError:  { ...s.sessionsError,  [cinemaId]: undefined },
    });

    inflightSessions[cinemaId] = (async () => {
      try {
        const list = await getCinemaSessions(cinemaId);
        set(cur => ({
          sessionsByCinemaId: { ...cur.sessionsByCinemaId, [cinemaId]: list },
          sessionsStatus:     { ...cur.sessionsStatus,     [cinemaId]: 'succeeded' },
        }));
      } catch (e: any) {
        set(cur => ({
          sessionsStatus: { ...cur.sessionsStatus, [cinemaId]: 'error' },
          sessionsError:  { ...cur.sessionsError,  [cinemaId]: e?.message ?? 'Не удалось загрузить сеансы' },
        }));
      } finally {
        inflightSessions[cinemaId] = null;
      }
    })();

    return inflightSessions[cinemaId]!;
  },

  clear: () => set({
    byId: {}, status: 'idle', error: undefined,
    sessionsByCinemaId: {}, sessionsStatus: {}, sessionsError: {},
  }),

  async ensureLoaded() {
    const s = get();
    if (s.status === 'succeeded' && Object.keys(s.byId).length > 0) return;
    if (s.status === 'loading' || inflightCinemas) return inflightCinemas ?? Promise.resolve();
    return s.load();
  },
}));

export const resetCinemasStore = () => {
  inflightCinemas = null;
  Object.keys(inflightSessions).forEach(k => { inflightSessions[+k] = null; });
  useCinemasStore.setState({
    byId: {}, status: 'idle', error: undefined,
    sessionsByCinemaId: {}, sessionsStatus: {}, sessionsError: {},
  });
};

import { create } from 'zustand';
import { getSession, postBooking, type Session, normalizeSession } from '@/shared/api/booking';

type Status = 'idle' | 'loading' | 'succeeded' | 'error';

type BookingState = {
    byId: Record<number, Session>;
    statusById: Record<number, Status>;
    errorById: Record<number, string | undefined>;
    selectedById: Record<number, Set<string>>;
    bookingStatusById: Record<number, Status>;
    bookingErrorById: Record<number, string | undefined>;
    lastFetchedById: Record<number, number>;
    load: (sessionId: number, opts?: { force?: boolean; ttlMs?: number }) => Promise<void>;
    invalidate: (sessionId: number) => void;
    toggleSeat: (sessionId: number, seatId: string) => void;
    clear: (sessionId: number) => void;
    book: (sessionId: number) => Promise<{ ok: boolean; bookingId?: string }>;
};

const inflight: Record<number, Promise<void> | null> = Object.create(null);

export const useBookingStore = create<BookingState>()((set, get) => ({
    byId: {},
    statusById: {},
    errorById: {},
    selectedById: {},
    bookingStatusById: {},
    bookingErrorById: {},
    lastFetchedById: {},

    async load(sessionId, opts) {
        const { force = false, ttlMs = 30_000 } = opts ?? {};
        const state = get();

        const now = Date.now();
        const last = state.lastFetchedById[sessionId] ?? 0;
        const fresh = now - last < ttlMs;

        if (!force && state.statusById[sessionId] === 'succeeded' && state.byId[sessionId] && fresh) {
            return;
        }
        if (inflight[sessionId]) return inflight[sessionId]!;

        set((s) => ({
            statusById: { ...s.statusById, [sessionId]: 'loading' },
            errorById: { ...s.errorById, [sessionId]: undefined },
        }));

        inflight[sessionId] = (async () => {
            try {
                const raw = await getSession(sessionId);
                const data = normalizeSession(raw);

                set((s) => ({
                    byId: { ...s.byId, [sessionId]: data },
                    statusById: { ...s.statusById, [sessionId]: 'succeeded' },
                    lastFetchedById: { ...s.lastFetchedById, [sessionId]: Date.now() },
                }));

                set((s) => {
                    if (s.selectedById[sessionId]) return s;
                    return { selectedById: { ...s.selectedById, [sessionId]: new Set<string>() } };
                });
            } catch (e: any) {
                const statusCode = e?.response?.status ?? e?.status;
                if (statusCode === 404) {
                    set((s) => ({
                        statusById: { ...s.statusById, [sessionId]: 'succeeded' },
                        errorById: { ...s.errorById, [sessionId]: undefined },
                        lastFetchedById: { ...s.lastFetchedById, [sessionId]: Date.now() },
                    }));
                } else {
                    set((s) => ({
                        statusById: { ...s.statusById, [sessionId]: 'error' },
                        errorById: { ...s.errorById, [sessionId]: e?.message ?? 'Не удалось загрузить сеанс' },
                    }));
                }
            } finally {
                inflight[sessionId] = null;
            }
        })();

        return inflight[sessionId]!;
    },

    invalidate(sessionId) {
        set((s) => ({
            statusById: { ...s.statusById, [sessionId]: 'idle' },
            lastFetchedById: { ...s.lastFetchedById, [sessionId]: 0 },
        }));
    },

    toggleSeat(sessionId, seatId) {
        const s = get();
        const session = s.byId[sessionId];
        if (!session) return;
        if (session.booked.includes(seatId)) return;

        const current = s.selectedById[sessionId] ?? new Set<string>();
        const next = new Set(current);
        next.has(seatId) ? next.delete(seatId) : next.add(seatId);

        set((st) => ({
            selectedById: { ...st.selectedById, [sessionId]: next },
        }));
    },

    clear(sessionId) {
        set((s) => ({
            selectedById: { ...s.selectedById, [sessionId]: new Set<string>() },
        }));
    },

    async book(sessionId) {
        set(s => ({
            bookingStatusById: { ...s.bookingStatusById, [sessionId]: 'loading' },
            bookingErrorById: { ...s.bookingErrorById, [sessionId]: undefined },
        }));

        if (!get().byId[sessionId]) {
            await get().load(sessionId, { force: true });
        }

        const selection = Array.from(get().selectedById[sessionId] ?? []);
        if (selection.length === 0) {
            set(s => ({
                bookingStatusById: { ...s.bookingStatusById, [sessionId]: 'idle' },
                bookingErrorById: { ...s.bookingErrorById, [sessionId]: 'Выберите места' },
            }));
            return { ok: false };
        }

        try {
            const resp = await postBooking(sessionId, selection);
            
            set(s => {
                const cur = s.byId[sessionId];
                if (!cur) return s;
                const merged = new Set(cur.booked);
                selection.forEach(id => merged.add(id));
                return {
                    byId: {
                        ...s.byId,
                        [sessionId]: { ...cur, booked: Array.from(merged) },
                    },
                    selectedById: { ...s.selectedById, [sessionId]: new Set<string>() },
                    bookingStatusById: { ...s.bookingStatusById, [sessionId]: 'succeeded' },
                    bookingErrorById: { ...s.bookingErrorById, [sessionId]: undefined },
                };
            });

            get().invalidate(sessionId);

            return { ok: true, bookingId: resp?.bookingId as string | undefined };
        } catch (e: any) {
            try { await get().load(sessionId, { force: true }); } catch { }
            set(s => ({
                bookingStatusById: { ...s.bookingStatusById, [sessionId]: 'error' },
                bookingErrorById: { ...s.bookingErrorById, [sessionId]: e?.message ?? 'Не удалось забронировать' },
            }));
            return { ok: false };
        }
    },
}));

export const resetBookingStore = () => {
    Object.keys(inflight).forEach((k) => (inflight[+k] = null));
    useBookingStore.setState({
        byId: {},
        statusById: {},
        errorById: {},
        selectedById: {},
        bookingStatusById: {},
        bookingErrorById: {},
        lastFetchedById: {},
    });
};

import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';

vi.mock('@/shared/api/booking', () => ({
  getSession: vi.fn(),
  postBooking: vi.fn(),
  normalizeSession: (x: any) => x,
}));

import { getSession, postBooking } from '@/shared/api/booking';
import { useBookingStore, resetBookingStore } from './useBookingStore';

type TestSession = {
  id: number;
  movieId: number;
  cinemaId: number;
  startAt: string;
  hall: { rows: number; cols: number };
  booked: string[];
};

function normalizedSession(partial: Partial<TestSession> = {}): TestSession {
  return {
    id: 1,
    movieId: 10,
    cinemaId: 20,
    startAt: '2025-10-25T10:00:00.000Z',
    hall: { rows: 8, cols: 10 },
    booked: [],
    ...partial,
  };
}

describe('useBookingStore', () => {
  beforeEach(() => {
    resetBookingStore();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetBookingStore();
  });

  it('load: успешная загрузка -> byId[sessionId], status=succeeded + selected сет создан', async () => {
    (getSession as unknown as Mock).mockResolvedValueOnce(
      normalizedSession({ id: 101, booked: ['A1', 'B3'] })
    );

    await useBookingStore.getState().load(101);

    const s = useBookingStore.getState();
    expect(s.statusById[101]).toBe('succeeded');
    expect(s.byId[101]).toBeTruthy();
    expect(s.byId[101].hall.cols).toBe(10);
    expect(s.byId[101].booked).toEqual(['A1', 'B3']);
    expect(s.selectedById[101] instanceof Set).toBe(true);
  });

  it('load: 2 параллельных вызова -> 1 запрос к API (идемпотентность)', async () => {
    (getSession as unknown as Mock).mockResolvedValueOnce(
      normalizedSession({ id: 202 })
    );

    await Promise.all([
      useBookingStore.getState().load(202),
      useBookingStore.getState().load(202),
    ]);

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(useBookingStore.getState().statusById[202]).toBe('succeeded');
  });

  it('load: 404 => статус succeeded, но byId пустой (для UX редиректа на 404)', async () => {
    (getSession as unknown as Mock).mockRejectedValueOnce({ response: { status: 404 } });

    await useBookingStore.getState().load(303);

    const s = useBookingStore.getState();
    expect(s.statusById[303]).toBe('succeeded');
    expect(s.byId[303]).toBeUndefined();
  });

  it('load: кэш свежий (ttl) — повторный load не зовёт API', async () => {
    const now = Date.now();
    useBookingStore.setState({
      byId: { 404: normalizedSession({ id: 404 }) },
      statusById: { 404: 'succeeded' },
      lastFetchedById: { 404: now },
    });

    await useBookingStore.getState().load(404);
    expect(getSession).not.toHaveBeenCalled();
  });

  it('load: force=true — игнорирует кэш и зовёт API', async () => {
    useBookingStore.setState({
      byId: { 505: normalizedSession({ id: 505 }) },
      statusById: { 505: 'succeeded' },
      lastFetchedById: { 505: Date.now() },
    });

    (getSession as unknown as Mock).mockResolvedValueOnce(
      normalizedSession({ id: 505 })
    );

    await useBookingStore.getState().load(505, { force: true });
    expect(getSession).toHaveBeenCalledTimes(1);
  });

  it('toggleSeat: не даёт выбрать забронированное место, свободное — переключает', () => {
    useBookingStore.setState({
      byId: { 606: normalizedSession({ id: 606, booked: ['A1'] }) },
      selectedById: { 606: new Set<string>() },
      statusById: { 606: 'succeeded' },
    });

    useBookingStore.getState().toggleSeat(606, 'A1');
    useBookingStore.getState().toggleSeat(606, 'A2');

    const sel = useBookingStore.getState().selectedById[606];
    expect(sel?.has('A1')).toBe(false);
    expect(sel?.has('A2')).toBe(true);
  });

  it('clear: очищает выбранные места', () => {
    useBookingStore.setState({
      byId: { 707: normalizedSession({ id: 707 }) },
      selectedById: { 707: new Set(['A1', 'B2']) },
      statusById: { 707: 'succeeded' },
    });

    useBookingStore.getState().clear(707);
    const sel = useBookingStore.getState().selectedById[707];
    expect(sel).toBeInstanceOf(Set);
    expect(sel.size).toBe(0);
  });

  it('book: без выбора мест -> ok=false, bookingStatus=idle, bookingError="Выберите места"', async () => {
    useBookingStore.setState({
      byId: { 808: normalizedSession({ id: 808 }) },
      selectedById: { 808: new Set() },
      statusById: { 808: 'succeeded' },
    });

    const res = await useBookingStore.getState().book(808);
    const s = useBookingStore.getState();

    expect(res.ok).toBe(false);
    expect(s.bookingStatusById[808]).toBe('idle');
    expect(s.bookingErrorById[808]).toBe('Выберите места');
  });

  it('book: при успехе чистит выбор, мержит booked, bookingStatus=succeeded, invalidate -> status=idle', async () => {
    useBookingStore.setState({
      byId: { 909: normalizedSession({ id: 909, booked: ['A1'] }) },
      selectedById: { 909: new Set(['A2', 'B1']) },
      statusById: { 909: 'succeeded' },
      lastFetchedById: { 909: Date.now() },
    });

    (postBooking as unknown as Mock).mockResolvedValueOnce({ bookingId: 'uuid-123' });

    const res = await useBookingStore.getState().book(909);

    const s = useBookingStore.getState();
    expect(res.ok).toBe(true);
    expect(res.bookingId).toBe('uuid-123');
    expect(s.byId[909].booked.sort()).toEqual(['A1', 'A2', 'B1'].sort());
    expect(s.selectedById[909]?.size).toBe(0);
    expect(s.bookingStatusById[909]).toBe('succeeded');
    expect(s.bookingErrorById[909]).toBeUndefined();
    expect(s.statusById[909]).toBe('idle');
    expect(s.lastFetchedById[909]).toBe(0);
  });
});

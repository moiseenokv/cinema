import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@/shared/api/cinemas', () => ({
  getCinemas: vi.fn(),
  getCinemaSessions: vi.fn(),
}));

import { getCinemas, getCinemaSessions } from '@/shared/api/cinemas';
import { useCinemasStore, resetCinemasStore } from './useCinemasStore';

const cinema = { id: 2, name: 'IMAX', address: 'Main 1' };
const cs1 = { id: 20, movieId: 1, cinemaId: 2, startAt: '2025-10-22T08:00:00.000Z' };
const cs2 = { id: 21, movieId: 3, cinemaId: 2, startAt: '2025-10-22T10:00:00.000Z' };

describe('useCinemasStore', () => {
  beforeEach(() => { resetCinemasStore?.(); vi.clearAllMocks(); });
  afterEach(() => { resetCinemasStore?.(); });

  it('load() — успех и кэш', async () => {
    (getCinemas as unknown as Mock).mockResolvedValueOnce([cinema]);
    await useCinemasStore.getState().load();
    expect(getCinemas).toHaveBeenCalledTimes(1);
    expect(useCinemasStore.getState().byId[2]).toBeTruthy();
    await useCinemasStore.getState().load();
    expect(getCinemas).toHaveBeenCalledTimes(1);
  });

  it('loadSessions(cinemaId) — success и кэш', async () => {
    (getCinemaSessions as unknown as Mock).mockResolvedValueOnce([cs1, cs2]);
    await useCinemasStore.getState().loadSessions(2);
    expect(getCinemaSessions).toHaveBeenCalledTimes(1);
    await useCinemasStore.getState().loadSessions(2);
    expect(getCinemaSessions).toHaveBeenCalledTimes(1);
    expect(useCinemasStore.getState().sessionsByCinemaId[2]).toHaveLength(2);
  });
});

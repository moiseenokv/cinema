import { describe, it, expect } from 'vitest';
import { groupSessionsByMovie } from './selectors';

describe('cinemasSelectors.groupSessionsByMovie', () => {
  it('группирует по movieId и сортирует по startAt', () => {
    const sessions = [
      { id: 1,  movieId: 10, cinemaId: 2, startAt: '2025-10-22T09:30:00.000Z' },
      { id: 2,  movieId: 10, cinemaId: 2, startAt: '2025-10-22T07:00:00.000Z' },
      { id: 3,  movieId: 11, cinemaId: 2, startAt: '2025-10-22T08:15:00.000Z' },
      { id: 4,  movieId: 10, cinemaId: 2, startAt: '2025-10-22T12:00:00.000Z' },
    ] as any;
    const grouped = groupSessionsByMovie(sessions);
    const arr = Array.from(grouped.entries());

    // movieId=10 → [2,1,4]
    const m10 = arr.find(([mid]) => mid === 10)?.[1].map(s => s.id);
    expect(m10).toEqual([2, 1, 4]);

    // movieId=11 → [3]
    const m11 = arr.find(([mid]) => mid === 11)?.[1].map(s => s.id);
    expect(m11).toEqual([3]);
  });
});

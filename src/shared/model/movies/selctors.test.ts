// src/shared/model/movies/selectors.test.ts
import { describe, it, expect } from 'vitest';
import { groupSessionsByCinema } from './selectors';

describe('moviesSelectors.groupSessionsByCinema', () => {
  it('группирует по cinemaId и сортирует по startAt', () => {
    const sessions = [
      { id: 1,  movieId: 1, cinemaId: 3, startAt: '2025-10-22T09:00:00.000Z' },
      { id: 2,  movieId: 1, cinemaId: 2, startAt: '2025-10-22T08:00:00.000Z' },
      { id: 3,  movieId: 1, cinemaId: 2, startAt: '2025-10-22T11:00:00.000Z' },
      { id: 4,  movieId: 1, cinemaId: 3, startAt: '2025-10-22T07:30:00.000Z' },
    ];

    const grouped = groupSessionsByCinema(sessions);
    const arr = Array.from(grouped.entries());

    // cinemaId=2 → [2,3]
    const c2 = arr.find(([cid]) => cid === 2)?.[1].map(s => s.id);
    expect(c2).toEqual([2, 3]);

    // cinemaId=3 → [4,1]
    const c3 = arr.find(([cid]) => cid === 3)?.[1].map(s => s.id);
    expect(c3).toEqual([4, 1]);
  });
});

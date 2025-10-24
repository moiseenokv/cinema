import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';

vi.mock('@/shared/api/movies', () => ({
  getMovies: vi.fn(),
  getMovieSessions: vi.fn(),
}));

import { getMovies, getMovieSessions } from '@/shared/api/movies';
import { useMoviesStore, resetMoviesStore } from './useMoviesStore';

const movie1 = {
  id: 1,
  title: 'Matrix',
  releaseYear: 1999,
  rating: 8.7,
  durationMin: 136,
  shortDescription: 'Sci-fi classic',
};
const movie2 = {
  id: 2,
  title: 'Inception',
  releaseYear: 2010,
  rating: 8.8,
  durationMin: 148,
  shortDescription: 'Dream heist',
};

describe('useMoviesStore', () => {
  beforeEach(() => {
    resetMoviesStore();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetMoviesStore();
  });

  it('load() успешно наполняет byId и меняет статус на succeeded', async () => {
    (getMovies as unknown as Mock).mockResolvedValueOnce([movie1, movie2]);
    await useMoviesStore.getState().load();

    const { byId, status, error } = useMoviesStore.getState();
    expect(status).toBe('succeeded');
    expect(error).toBeUndefined();
    expect(Object.keys(byId)).toHaveLength(2);
    expect(byId[movie1.id].title).toBe('Matrix');
    expect(getMovies).toHaveBeenCalledTimes(1);
  });

  it('load() ставит статус error при падении API', async () => {
    (getMovies as unknown as Mock).mockRejectedValueOnce(new Error('Server error'));

    await useMoviesStore.getState().load();

    const { status, error } = useMoviesStore.getState();
    expect(status).toBe('error');
    expect(error).toBeTruthy();
    expect(getMovies).toHaveBeenCalledTimes(1);
  });

  it('идемпотентность: два параллельных вызова load() делают один запрос', async () => {
    (getMovies as unknown as Mock).mockResolvedValueOnce([movie1, movie2]);

    await Promise.all([
      useMoviesStore.getState().load(),
      useMoviesStore.getState().load(),
    ]);

    expect(getMovies).toHaveBeenCalledTimes(1);
    expect(useMoviesStore.getState().status).toBe('succeeded');
  });

  it('кэш: если byId уже заполнен и статус succeeded, load() не зовёт API', async () => {
    useMoviesStore.setState({
      byId: { [movie1.id]: movie1, [movie2.id]: movie2 },
      status: 'succeeded',
      error: undefined,
    });

    (getMovies as unknown as Mock).mockRejectedValueOnce(new Error('should not be called'));

    await useMoviesStore.getState().load();

    expect(getMovies).not.toHaveBeenCalled();
    expect(useMoviesStore.getState().status).toBe('succeeded');
  });

  it('loadMovieSessions(movieId): success и кэш', async () => {
    const s1 = { id: 101, movieId: 1, cinemaId: 2, startAt: '2025-10-22T08:00:00.000Z' };
    const s2 = { id: 102, movieId: 1, cinemaId: 3, startAt: '2025-10-22T10:00:00.000Z' };

    (getMovieSessions as unknown as Mock).mockResolvedValueOnce([s1, s2]);

    await useMoviesStore.getState().loadMovieSessions(1);
    expect(getMovieSessions).toHaveBeenCalledTimes(1);
    expect(useMoviesStore.getState().sessionsByMovieId[1]).toEqual([s1, s2]);
    expect(useMoviesStore.getState().sessionsStatus[1]).toBe('succeeded');

    // повторный вызов не должен дёргать API
    await useMoviesStore.getState().loadMovieSessions(1);
    expect(getMovieSessions).toHaveBeenCalledTimes(1);
  });

  it('loadMovieSessions(movieId): идемпотентность при параллельных вызовах', async () => {
    const s = { id: 201, movieId: 2, cinemaId: 5, startAt: '2025-10-23T09:00:00.000Z' };
    (getMovieSessions as unknown as Mock).mockResolvedValueOnce([s]);

    await Promise.all([
      useMoviesStore.getState().loadMovieSessions(2),
      useMoviesStore.getState().loadMovieSessions(2),
    ]);

    expect(getMovieSessions).toHaveBeenCalledTimes(1);
    expect(useMoviesStore.getState().sessionsByMovieId[2]).toEqual([s]);
    expect(useMoviesStore.getState().sessionsStatus[2]).toBe('succeeded');
  });

  it('loadMovieSessions(movieId): ошибка переводит статус в error и пишет message', async () => {
    (getMovieSessions as unknown as Mock).mockRejectedValueOnce(new Error('boom'));

    await useMoviesStore.getState().loadMovieSessions(1);

    expect(useMoviesStore.getState().sessionsStatus[1]).toBe('error');
    expect(useMoviesStore.getState().sessionsError[1]).toBeTruthy();
  });
});

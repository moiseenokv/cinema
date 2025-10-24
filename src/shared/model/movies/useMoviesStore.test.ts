import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';

vi.mock('@/shared/api/movies', () => ({
  getMovies: vi.fn(),
}));

import { getMovies } from '@/shared/api/movies';
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

describe('useMoviesStore (zustand)', () => {
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
});

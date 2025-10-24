import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '@/test/utils';
import { FilmsPage } from './FilmsPage';
import { useMoviesStore, resetMoviesStore } from '@/shared/model/movies/useMoviesStore';

vi.mock('@/shared/api/movies', () => {
  return {
    getMovies: vi.fn(),
  };
});

import { getMovies } from '@/shared/api/movies';

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
  posterUrl: undefined,
  shortDescription: 'Dream heist',
};

describe('FilmsPage', () => {
  beforeEach(() => {
    resetMoviesStore();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetMoviesStore();
  });

  it('показывает "Загрузка…" и затем рендерит список фильмов', async () => {
    (getMovies as unknown as Mock).mockResolvedValueOnce([movie1, movie2]);

    renderWithRouter(<FilmsPage />, ['/films']);

    expect(screen.getByText(/Загрузка фильмов/i)).toBeInTheDocument();

    expect(await screen.findByText('Matrix')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();

    const links = screen.getAllByRole('link', { name: /сеансы/i });
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links[0].getAttribute('href')).toMatch(/^\/film\/\d+$/);

    expect(getMovies).toHaveBeenCalledTimes(1);
  });

  it('отображает сообщение об ошибке при падении API', async () => {
    (getMovies as unknown as Mock).mockRejectedValueOnce(new Error('Server error'));

    renderWithRouter(<FilmsPage />, ['/films']);

    expect(screen.getByText(/Загрузка фильмов/i)).toBeInTheDocument();

    const error = await screen.findByText(/server error/i);
    expect(error).toBeInTheDocument();

    expect(getMovies).toHaveBeenCalledTimes(1);
  });

  it('не делает повторный запрос, если стор уже заполнен', async () => {
    useMoviesStore.setState({
      byId: { [movie1.id]: movie1, [movie2.id]: movie2 },
      status: 'succeeded',
      error: undefined,
    });

    (getMovies as unknown as Mock).mockRejectedValueOnce(new Error('should not be called'));

    renderWithRouter(<FilmsPage />, ['/films']);

    expect(await screen.findByText('Matrix')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();

    expect(getMovies).not.toHaveBeenCalled();
  });

  it('рендерит пустой список без ошибок, если API вернул []', async () => {
    (getMovies as unknown as Mock).mockResolvedValueOnce([]);

    renderWithRouter(<FilmsPage />, ['/films']);
    expect(screen.getByText(/Загрузка фильмов/i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /фильмы/i })).toBeInTheDocument();
  });
});

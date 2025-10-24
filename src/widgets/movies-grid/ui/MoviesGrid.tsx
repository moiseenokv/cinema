import { memo } from 'react';
import type { Movie } from '@shared/api/movies/types';
import { MovieCard } from '@shared/ui/MovieCard/MovieCard';

type Props = { movies: Movie[] };

export const MoviesGrid = memo(function MoviesGrid({ movies }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
      }}
    >
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
});

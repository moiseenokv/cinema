import { memo } from 'react';
import type { Movie } from '@shared/api/movies/types';
import { MovieListItem } from '@shared/ui/MovieListItem/MovieListItem';

type Props = {
  movies: Movie[];
};

export const MoviesList = memo(function MoviesList({ movies }: Props) {
  return (
    <div>
      {movies.map((m) => (
        <MovieListItem key={m.id} movie={m} />
      ))}
    </div>
  );
});

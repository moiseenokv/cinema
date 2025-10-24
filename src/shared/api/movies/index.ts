import { http } from '@shared/api/http';
import { toApiUrl } from '@shared/lib/apiUrl';
import type { MovieDto, Movie, MovieSessionDto, MovieSession } from './types';

const mapMovie = (dto: MovieDto): Movie => ({
  id: dto.id,
  title: dto.title,
  releaseYear: dto.year,
  rating: dto.rating,
  durationMin: dto.lengthMinutes,
  posterUrl: dto.posterImage ? toApiUrl(dto.posterImage) : undefined,
  shortDescription: dto.description ?? undefined,
});

const mapSession = (dto: MovieSessionDto): MovieSession => ({
  id: dto.id,
  cinemaId: dto.cinemaId,
  movieId: dto.movieId,
  startAt: dto.startTime,
});

export async function getMovies(): Promise<Movie[]> {
  const { data } = await http.get<MovieDto[]>('/movies');
  return data.map(mapMovie);
}

export async function getMovieSessions(movieId: number): Promise<MovieSession[]> {
  const { data } = await http.get<MovieSessionDto[]>(`/movies/${movieId}/sessions`);
  return data.map(mapSession);
}

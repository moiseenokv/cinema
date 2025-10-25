import { http } from '@shared/api/http';
import type { MovieSessionCore, SessionDetails } from './types';

type MovieSessionsByMovieDto = {
  id: number; 
  cinemaId: number; 
  cinemaTitle: string; 
  startTime: string; 
  price?: number;
}[];

type MovieSessionsByCinemaDto = {
  id: number; 
  movieId: number; 
  movieTitle: string; 
  startTime: string; 
  price?: number;
}[];

export async function fetchSessionsByMovie(movieId: number): Promise<MovieSessionCore[]> {
  const { data } = await http.get<MovieSessionsByMovieDto>(`/movies/${movieId}/sessions`);
  return data.map(s => ({
    id: s.id,
    movieId,
    cinemaId: s.cinemaId,
    cinemaTitle: s.cinemaTitle,
    startAt: new Date(s.startTime),
    price: s.price,
  }));
}

export async function fetchSessionsByCinema(cinemaId: number): Promise<MovieSessionCore[]> {
  const { data } = await http.get<MovieSessionsByCinemaDto>(`/cinemas/${cinemaId}/session`);
  return data.map(s => ({
    id: s.id,
    movieId: s.movieId,
    cinemaId,
    cinemaTitle: '',
    startAt: new Date(s.startTime),
    price: s.price,
  }));
}

export async function fetchSessionDetails(movieSessionId: number): Promise<SessionDetails> {
  const { data } = await http.get<SessionDetails>(`/movieSessions/${movieSessionId}`);
  return data;
}

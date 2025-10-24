import { http } from '@/shared/api/http';
import type { CinemaDto, CinemaSessionDto, Cinema, CinemaSession } from './types';
import { mapCinema, mapCinemaSession } from './types';

export async function getCinemas(): Promise<Cinema[]> {
  const { data } = await http.get<CinemaDto[]>('/cinemas');
  return data.map(mapCinema);
}

export async function getCinemaSessions(cinemaId: number): Promise<CinemaSession[]> {
  const { data } = await http.get<CinemaSessionDto[]>(`/cinemas/${cinemaId}/sessions`);
  return data.map(mapCinemaSession);
}

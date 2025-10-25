import { http } from '@/shared/api/http';
import type { MovieSessionDto, MovieSession } from './types';
import { toSeatIdHuman } from '@/shared/lib/seats';

const mapDto = (dto: MovieSessionDto): MovieSession => {
  const booked: string[] = dto.bookedSeats.map((s) => {
    if (typeof s === 'string') return s;
    return toSeatIdHuman(s.row, s.col);
  });

  return {
    id: dto.id,
    movieId: dto.movieId,
    cinemaId: dto.cinemaId,
    startAt: dto.startTime,
    hall: { rows: dto.seats.rows, cols: dto.seats.cols },
    booked,
  };
};

export async function getMovieSession(id: number): Promise<MovieSession> {
  const { data } = await http.get<MovieSessionDto>(`/movieSessions/${id}`);
  return mapDto(data);
}

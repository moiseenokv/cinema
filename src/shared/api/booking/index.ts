import { http } from '@/shared/api/http';
import { fromApiSeat, toApiSeat,toSeatIdHuman } from '@/shared/lib/seats';

export type Session = {
  id: number;
  movieId: number;
  cinemaId: number;
  startAt: string;
  hall: { rows: number; cols: number };
  booked: string[];
};

type SessionDto = {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;
  seats: { rows: number; seatsPerRow: number };
  bookedSeats: Array<{ rowNumber: number; seatNumber: number }>;
};

function mapDto(dto: SessionDto): Session {
  const rows = Number(dto.seats?.rows ?? 0);
  const colsRaw = Number(dto.seats?.seatsPerRow ?? 0);
  const cols = colsRaw > 0 ? colsRaw : 1; // 0 -> 1

  const booked =
    Array.isArray(dto.bookedSeats)
      ? dto.bookedSeats
          .map(fromApiSeat)
          .filter((x): x is string => typeof x === 'string')
      : [];

  return {
    id: Number(dto.id),
    movieId: Number(dto.movieId),
    cinemaId: Number(dto.cinemaId),
    startAt: String(dto.startTime ?? ''),
    hall: { rows, cols },
    booked,
  };
}

export function normalizeSession(s: any): Session {
  const rows =
    typeof s?.seats?.rows === 'number' ? s.seats.rows : (typeof s?.hall?.rows === 'number' ? s.hall.rows : 0);
  const cols =
    typeof s?.seats?.seatsPerRow === 'number'
      ? s.seats.seatsPerRow
      : (typeof s?.seats?.cols === 'number'
          ? s.seats.cols
          : (typeof s?.hall?.cols === 'number' ? s.hall.cols : 0));

  let booked: string[] = [];
  if (Array.isArray(s.booked)) {
    booked = s.booked as string[];
  } else if (Array.isArray(s.bookedSeats)) {
    booked = s.bookedSeats.map((x: any) =>
      typeof x === 'string' ? x : toSeatIdHuman(x.rowNumber ?? x.row, x.seatNumber ?? x.col)
    );
  }

  const startAt: string =
    typeof s.startAt === 'string' ? s.startAt : (typeof s.startTime === 'string' ? s.startTime : '');

  return {
    id: Number(s.id),
    movieId: Number(s.movieId),
    cinemaId: Number(s.cinemaId),
    startAt,
    hall: { rows, cols },
    booked,
  };
}

export async function getSession(id: number): Promise<Session> {
  const { data } = await http.get<SessionDto>(`/movieSessions/${id}`);
  return mapDto(data);
}

export async function postBooking(sessionId: number, seatIds: string[]) {
  const seats = seatIds
    .map(toApiSeat)
    .filter((x): x is { rowNumber: number; seatNumber: number } => !!x);

  const { data } = await http.post<{ bookingId: string }>(
    `/movieSessions/${sessionId}/bookings`,
    { seats }
  );
  return data;
}

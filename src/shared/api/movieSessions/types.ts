export type MovieSessionDto = {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string; // ISO
  seats: { rows: number; cols: number };
  // может быть ['A1','B2'] или [{ row: 0, col: 1 }, ...] — подстрахуемся
  bookedSeats: Array<string | { row: number; col: number }>;
};

export type MovieSession = {
  id: number;
  movieId: number;
  cinemaId: number;
  startAt: string;             // ISO (string)
  hall: { rows: number; cols: number };
  booked: string[];            // ['A1','B3', ...]
};

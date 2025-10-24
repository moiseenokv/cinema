export type CinemaDto = {
  id: number;
  name: string;
  address: string;
  network?: string | null;
};

export type CinemaSessionDto = {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;      // ISO
  format?: string | null; // REGULAR 2D / IMAX / ...
  priceMin?: number | null;
  priceMax?: number | null;
};

export type Cinema = {
  id: number;
  name: string;
  address: string;
  network?: string;
};

export type CinemaSession = {
  id: number;
  movieId: number;
  cinemaId: number;
  startAt: string;
  format?: string;
  priceMin?: number;
  priceMax?: number;
};

export const mapCinema = (d: CinemaDto): Cinema => ({
  id: d.id,
  name: d.name,
  address: d.address,
  network: d.network ?? undefined,
});

export const mapCinemaSession = (d: CinemaSessionDto): CinemaSession => ({
  id: d.id,
  movieId: d.movieId,
  cinemaId: d.cinemaId,
  startAt: d.startTime,
  format: d.format ?? undefined,
  priceMin: d.priceMin ?? undefined,
  priceMax: d.priceMax ?? undefined,
});

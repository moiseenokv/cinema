export type MovieDto = {
  id: number;
  title: string;
  year: number;
  rating: number;
  posterImage: string | null;
  lengthMinutes: number;
  description?: string | null;
};

/* export type MovieSessionDto = {
  id: number;
  movieId: number;
  cinemaId: number;
  cinemaTitle: string;
  startTime: string;
  format?: string;
  priceMin?: number;
  priceMax?: number;
}; */

export type Movie = {
  id: number;
  title: string;
  releaseYear: number;
  rating: number;
  durationMin: number;
  posterUrl?: string;
  shortDescription?: string;
};

/* export type MovieSession = {
  id: number;
  movieId: number;
  cinemaId: number;
  cinemaTitle: string;
  startAt: Date;
  price?: number;
}; */



// src/shared/api/movies/types.ts
export type MovieSessionDto = {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;      // с бэка
  format?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
};

export type MovieSession = {
  id: number;
  movieId: number;
  cinemaId: number;
  startAt: string;        // нормализованно
  format?: string;
  priceMin?: number;
  priceMax?: number;
};

export const mapMovieSession = (d: MovieSessionDto): MovieSession => ({
  id: d.id,
  movieId: d.movieId,
  cinemaId: d.cinemaId,
  startAt: d.startTime,
  format: d.format ?? undefined,
  priceMin: d.priceMin ?? undefined,
  priceMax: d.priceMax ?? undefined,
});

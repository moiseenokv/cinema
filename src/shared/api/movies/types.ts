export type MovieDto = {
  id: number;
  title: string;
  year: number;
  rating: number;
  posterImage: string | null;
  lengthMinutes: number;
  description?: string | null;
};

export type MovieSessionDto = {
  id: number;
  cinemaId: number;
  cinemaTitle: string;
  startTime: string;
  price?: number;
};

export type Movie = {
  id: number;
  title: string;
  releaseYear: number;
  rating: number;
  durationMin: number;
  posterUrl?: string;
  shortDescription?: string;
};

export type MovieSession = {
  id: number;
  cinemaId: number;
  cinemaTitle: string;
  startAt: Date;
  price?: number;
};

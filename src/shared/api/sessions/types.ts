export type MovieSessionCore = {
  id: number; 
  movieId: number;
  cinemaId: number;
  cinemaTitle: string;
  startAt: Date;
  price?: number;
};

export type SessionDetails = {
  seats: { rows: number; cols: number };
  bookedSeats: number[];
};

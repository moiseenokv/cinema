import { http } from '@/shared/api/http';

export type SeatRefDto = {
  rowNumber: number;
  seatNumber: number;
};

export type TicketDto = {
  id: string;
  movieSessionId: number;
  userId: number;
  isPaid: boolean;
  seats: SeatRefDto[];
  bookedAt: string;
};

export type PayTicketResponseDto = {
  bookingId: string;
};

export async function getMyTickets(): Promise<TicketDto[]> {
  const { data } = await http.get<TicketDto[]>('/me/bookings');
  return data;
}

export async function payTicket(bookingId: string): Promise<PayTicketResponseDto> {
  const { data } = await http.post<PayTicketResponseDto>(`/bookings/${bookingId}/payments`);
  return data;
}

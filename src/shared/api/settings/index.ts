import { http } from '@/shared/api/http';

export type SettingsDto = {
  bookingPaymentTimeSeconds?: number;
};

export async function getSettings(): Promise<SettingsDto> {
  const { data } = await http.get<SettingsDto>('/settings');
  return data;
}
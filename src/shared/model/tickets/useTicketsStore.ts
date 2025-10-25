import { create } from 'zustand';
import { getMyTickets, payTicket, type TicketDto } from '@/shared/api/tickets';
import { getSettings } from '@/shared/api/settings';

type Status = 'idle' | 'loading' | 'succeeded' | 'error';

type TicketsState = {
  items: TicketDto[];
  status: Status;
  error?: string;
  paymentTtlSec: number | null;
  load: () => Promise<void>;
  pay: (id: string) => Promise<{ ok: boolean }>;
  pruneExpired: (now?: number) => void;
};

export const useTicketsStore = create<TicketsState>()((set, get) => ({
  items: [],
  status: 'idle',
  error: undefined,
  paymentTtlSec: null,

  async load() {
    set({ status: 'loading', error: undefined });
    try {
      const [settings, bookings] = await Promise.all([getSettings(), getMyTickets()]);
      const ttl = settings?.bookingPaymentTimeSeconds || null;

      set({
        items: bookings,
        paymentTtlSec: ttl,
        status: 'succeeded',
      });
    } catch (e: any) {
      set({
        status: 'error',
        error: e?.message ?? 'Не удалось загрузить билеты',
      });
    }
  },

  async pay(id) {
    try {
      await payTicket(id);
      set((s) => ({
        items: s.items.map((t) => (t.id === id ? { ...t, isPaid: true } : t)),
      }));
      return { ok: true };
    } catch {
      return { ok: false };
    }
  },

  pruneExpired(now = Date.now()) {
    const ttl = get().paymentTtlSec ?? 0;
    if (!ttl) return;

    set((s) => ({
      items: s.items.filter((t) => {
        if (t.isPaid) return true;
        const deadline = Date.parse(t.bookedAt) + ttl * 1000;
        return deadline > now;
      }),
    }));
  },
}));

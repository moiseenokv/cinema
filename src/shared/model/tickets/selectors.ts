import { useEffect, useMemo } from 'react';
import { useTicketsStore } from './useTicketsStore';
import { useBookingStore } from '@/shared/model/booking/useBookingStore';
import type { TicketDto } from '@/shared/api/tickets';

export const ticketsSelectors = {
  useBucketsBySessions: () => {
    const items = useTicketsStore(s => s.items);
    const ttlSec = useTicketsStore(s => s.paymentTtlSec ?? 0);

    const sessionsById = useBookingStore(s => s.byId);
    const statusById = useBookingStore(s => s.statusById);
    const loadSession = useBookingStore(s => s.load);

    useEffect(() => {
      const ids = Array.from(new Set(items.map(t => t.movieSessionId)));
      const toLoad = ids.filter(id => !sessionsById[id] && statusById[id] !== 'loading');
      if (toLoad.length === 0) return;
      toLoad.forEach(id => { void loadSession(id); });
    }, [items, sessionsById, statusById, loadSession]);

    return useMemo(() => {
      const now = Date.now();

      const unpaid: TicketDto[] = [];
      const future: TicketDto[] = [];
      const past: TicketDto[] = [];

      for (const t of items) {
        if (!t.isPaid) {
          const okByTtl = ttlSec > 0
            ? (Date.parse(t.bookedAt) + ttlSec * 1000) > now
            : true;
          if (okByTtl) unpaid.push(t);
          continue;
        }

        const startAtIso = sessionsById[t.movieSessionId]?.startAt ?? null;
        const startMs = startAtIso ? Date.parse(startAtIso) : null;

        if (startMs === null || startMs > now) future.push(t);
        else past.push(t);
      }

      unpaid.sort((a, b) => Date.parse(a.bookedAt) - Date.parse(b.bookedAt));
      future.sort((a, b) => {
        const aMs = sessionsById[a.movieSessionId]?.startAt ? Date.parse(sessionsById[a.movieSessionId]!.startAt) : Infinity;
        const bMs = sessionsById[b.movieSessionId]?.startAt ? Date.parse(sessionsById[b.movieSessionId]!.startAt) : Infinity;
        return aMs - bMs;
      });
      past.sort((a, b) => {
        const aMs = sessionsById[a.movieSessionId]?.startAt ? Date.parse(sessionsById[a.movieSessionId]!.startAt) : 0;
        const bMs = sessionsById[b.movieSessionId]?.startAt ? Date.parse(sessionsById[b.movieSessionId]!.startAt) : 0;
        return bMs - aMs;
      });

      return { unpaid, future, past, ttl: ttlSec };
    }, [items, ttlSec, sessionsById]);
  },
};


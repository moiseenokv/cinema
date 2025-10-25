import { useEffect, useRef, useMemo } from 'react';
import { useTicketsStore } from '@/shared/model/tickets/useTicketsStore';
import { TicketsBucket } from '@/shared/ui/TicketsBusket/TicketsBusket';
import { useBookingStore } from '@/shared/model/booking/useBookingStore';
import { moviesSelectors } from '@/shared/model/movies/selectors';
import { cinemasSelectors } from '@/shared/model/cinemas/selectors';
import styles from './TicketsPage.module.scss';

export function MyTicketsPage() {
  const load   = useTicketsStore(s => s.load);
  const status = useTicketsStore(s => s.status);
  const error  = useTicketsStore(s => s.error);
  const items  = useTicketsStore(s => s.items);
  const ttlSec = useTicketsStore(s => s.paymentTtlSec);
  const pay    = useTicketsStore(s => s.pay);

  const sessionsById = useBookingStore(s => s.byId);
  const moviesById   = moviesSelectors.useByIdMapAuto();
  const cinemasById  = cinemasSelectors.useByIdMapAuto();

  const did = useRef(false);
  useEffect(() => {
    if (did.current) return;
    did.current = true;
    void load();
  }, [load]);

  useEffect(() => {
    if (status !== 'succeeded') return;
    const loadSession = useBookingStore.getState().load;
    for (const t of items) {
      if (!sessionsById[t.movieSessionId]) {
        loadSession(t.movieSessionId).catch(() => void 0);
      }
    }
  }, [status, items, sessionsById]);

  const { unpaid, future, past } = useMemo(() => {
    const now = Date.now();
    const unpaid = items.filter(i => !i.isPaid);
    const withStart = (i: typeof items[number]) => sessionsById[i.movieSessionId]?.startAt ?? null;
    const [future, past]: [typeof items, typeof items] = [[], []];
    for (const t of items) {
      if (!t.isPaid) continue;
      const startIso = withStart(t);
      if (startIso == null) { future.push(t); continue; }
      (Date.parse(startIso) > now ? future : past).push(t);
    }
    return { unpaid, future, past };
  }, [items, sessionsById]);

  const resolveMeta = (sessionId: number) => {
    const s = sessionsById[sessionId];
    if (!s) return null;
    return {
      startAt: s.startAt,
      movieTitle: moviesById[s.movieId]?.title,
      cinemaName: cinemasById[s.cinemaId]?.name,
    };
  };

  if (status === 'loading') return <div className={styles.state}>Загрузка билетов…</div>;
  if (error) return <div className={`${styles.state} ${styles.error}`}>{error}</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Мои билеты</h1>

      <TicketsBucket
        kind="unpaid"
        title="Неоплаченные"
        items={unpaid}
        paymentTtlSec={ttlSec ?? 0}
        onPay={(id) => pay(id)}
        emptyText="Нет неоплаченных броней"
        resolveMeta={resolveMeta}
      />

      <TicketsBucket
        kind="future"
        title="Будущие"
        items={future}
        emptyText="Нет будущих билетов"
        resolveMeta={resolveMeta}
      />

      <TicketsBucket
        kind="past"
        title="Прошедшие"
        items={past}
        emptyText="Нет прошедших билетов"
        resolveMeta={resolveMeta}
      />
    </div>
  );
}

export default MyTicketsPage;

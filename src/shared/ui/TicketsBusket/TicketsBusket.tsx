import { memo } from 'react';
import { Countdown } from '@/shared/ui/Countdown/Countdown';
import type { TicketDto } from '@/shared/api/tickets';
import styles from './TicketsBusket.module.scss';

type Kind = 'unpaid' | 'future' | 'past';

type Meta = {
    startAt?: string;
    movieTitle?: string;
    cinemaName?: string;
};

type Props = {
    kind: Kind;
    title: string;
    emptyText: string;
    items: TicketDto[];
    paymentTtlSec?: number;
    onPay?: (id: string) => void;
    resolveMeta?: (movieSessionId: number) => Meta | null | undefined;
};

const fmtDate = (iso?: string) =>
    iso
        ? new Date(iso).toLocaleDateString('ru-RU', {
            weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        })
        : undefined;

const fmtTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined;

export const TicketsBucket = memo(function TicketsBucket({
    kind,
    title,
    emptyText,
    items,
    paymentTtlSec = 0,
    onPay,
    resolveMeta,
}: Props) {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>{title}</h2>

            {items.length === 0 ? (
                <div className={styles.empty}>{emptyText}</div>
            ) : (
                <ul className={styles.list}>
                    {items.map((t) => {
                        const meta = resolveMeta?.(t.movieSessionId) ?? null;
                        const movie = meta?.movieTitle ?? 'Фильм';
                        const cinema = meta?.cinemaName ?? 'Кинотеатр';
                        const date = fmtDate(meta?.startAt) ?? 'Дата уточняется';
                        const time = fmtTime(meta?.startAt);

                        const seats = t.seats
                            .map((s) => `ряд ${s.rowNumber}, место ${s.seatNumber}`)
                            .join(', ');

                        return (
                            <li key={t.id} className={`${styles.card} ${styles[kind]}`}>
                                <div className={styles.topRow}>
                                    <div className={styles.cinema}>{cinema}</div>
                                    {time && <div className={styles.time}>{time}</div>}
                                </div>

                                <div className={styles.subRow}>
                                    <div className={styles.date}>{date}</div>
                                </div>

                                <div className={styles.movieRow}>
                                    <span className={styles.movie}>{movie}</span>
                                </div>

                                <div className={styles.seats}>Места: {seats}</div>

                                {kind === 'unpaid' ? (
                                    <div className={styles.actions}>
                                        <div className={styles.hint}>
                                            Оплата в течение <Countdown until={Date.parse(t.bookedAt) + paymentTtlSec * 1000} />
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.payBtn}
                                            onClick={() => onPay?.(t.id)}
                                        >
                                            Оплатить сейчас
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.statusLine}>
                                        {kind === 'future' ? 'Оплачен' : 'Просмотрен'}
                                        {time && <span className={styles.dot}>•</span>}
                                        {time ? `старт ${time}` : 'время сеанса недоступно'}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
});

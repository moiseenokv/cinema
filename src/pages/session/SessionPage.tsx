// src/pages/session/SessionPage.tsx
import type { JSX } from 'react/jsx-runtime';
import { useEffect, useMemo, useRef } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { routes } from '@/app/router/config';
import { useIsAuth } from '@/app/session/useSession';

import { useBookingStore } from '@/shared/model/booking/useBookingStore';
import { moviesSelectors } from '@/shared/model/movies/selectors';
import { cinemasSelectors } from '@/shared/model/cinemas/selectors';

import { SessionHeader } from '@/widgets/session-header/SessionHeader';
import { SeatMap } from '@/shared/ui/SeatMap/SeatMap';
import { SessionActions } from '@/widgets/session-actions/SessionActions';
import { formatFullDateTime } from '@/shared/lib/date';
import { notify } from '@/shared/lib/notify';
import styles from './SessionPage.module.scss';

const EMPTY_SELECTED = new Set<string>();

export function SessionPage() {
    const { id } = useParams<{ id: string }>();
    const parsed = Number(id);
    const validId = Number.isInteger(parsed) && parsed > 0 ? parsed : null;

    const navigate = useNavigate();
    const location = useLocation();
    const isAuth = useIsAuth();

    const moviesById = moviesSelectors.useByIdMapAuto();
    const cinemasById = cinemasSelectors.useByIdMapAuto();

    const load = useBookingStore(s => s.load);
    const session = useBookingStore(s => (validId ? s.byId[validId] : undefined));
    const status = useBookingStore(s => (validId ? s.statusById[validId] : undefined));
    const error = useBookingStore(s => (validId ? s.errorById[validId] : undefined));
    const selectedRaw = useBookingStore(s => (validId ? s.selectedById[validId] : undefined));
    const toggle = useBookingStore(s => s.toggleSeat);
    const clearSel = useBookingStore(s => s.clear);
    const book = useBookingStore(s => s.book);
    const bookingStatus = useBookingStore(s => (validId ? s.bookingStatusById?.[validId] : undefined));
    const bookingError = useBookingStore(s => (validId ? s.bookingErrorById?.[validId] : undefined));

    const didInitRef = useRef(false);
    useEffect(() => {
        if (validId == null) return;
        if (didInitRef.current) return;
        didInitRef.current = true;
        Promise.resolve().then(() => {
            if (!didInitRef.current) return;
            load(validId, { force: true });
        });
    }, [validId, load]);

    const selectedSet = selectedRaw ?? EMPTY_SELECTED;
    const selectedCount = selectedRaw ? selectedRaw.size : 0;

    const bookedSet = useMemo(
        () => new Set(session?.booked ?? []),
        [session?.booked]
    );

    const movieTitle = session ? (moviesById[session.movieId]?.title ?? 'Фильм') : 'Фильм';
    const cinema = session ? cinemasById[session.cinemaId] : undefined;
    const cinemaName = cinema?.name ?? 'Кинотеатр';
    const cinemaAddr = cinema?.address ?? '—';
    const startHuman = session
        ? formatFullDateTime(session.startAt)
        : '—';

    const onClear = () => {
        if (validId == null) return;
        clearSel(validId);
    };

    const onBook = async () => {
        if (validId == null) return;
        if (!isAuth) {
            navigate(routes.auth, { state: { from: location } });
            return;
        }
        const res = await book(validId);
        if (res.ok) {
            (notify?.success ?? ((m: string) => alert(m)))('Бронь создана');
            navigate(routes.myTickets);
        } else if (bookingError) {
            (notify?.error ?? ((m: string) => alert(m)))(bookingError);
        }
    };

    let content: JSX.Element;

    if (validId == null) {
        content = <Navigate to={routes.notFound} replace />;
    } else if (!session && (status === 'loading' || status === undefined)) {
        content = <div className={styles.state}>Загрузка схемы зала…</div>;
    } else if (error) {
        content = <div className={`${styles.state} ${styles.error}`}>{error}</div>;
    } else if (!session && status === 'succeeded') {
        content = <Navigate to={routes.notFound} replace />;
    } else if (!session) {
        content = <div className={styles.state}>Подготовка данных…</div>;
    } else {
        content = (
            <div className={styles.page}>
                <SessionHeader
                    movieTitle={movieTitle}
                    cinemaName={cinemaName}
                    cinemaAddress={cinemaAddr}
                    startHuman={startHuman}
                />

                <div className={styles.seatArea}>
                    <SeatMap
                        rows={session.hall.rows}
                        cols={session.hall.cols}
                        booked={bookedSet}
                        selected={selectedSet}
                        disabled={!isAuth || bookingStatus === 'loading'}
                        onToggle={(seatId) => validId != null && toggle(validId, seatId)}
                    />

                    <SessionActions
                        isAuth={isAuth}
                        selectedCount={selectedCount}
                        isBusy={bookingStatus === 'loading'}
                        errorText={bookingError}
                        onClear={onClear}
                        onBook={onBook}
                    />
                </div>
            </div>
        );
    }

    return content;
}

export default SessionPage;

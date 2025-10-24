import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Cinema } from '@/shared/api/cinemas/types';
import { useCinemasStore } from '@/shared/model/cinemas/useCinemasStore';
import { CinemaItem } from '@/shared/ui/CinemaItem/CinemaItem';
import { routes } from '@/app/router/config';

const EMPTY: ReadonlyArray<unknown> = Object.freeze([]);

type Props = { cinema: Cinema };

export const CinemaListItem = memo(function CinemaListItem({ cinema }: Props) {
  const sessionsMap = useCinemasStore(s => s.sessionsByCinemaId);
  const sessions = (sessionsMap[cinema.id] ?? EMPTY) as any[];

  const status = useCinemasStore(s => s.sessionsStatus[cinema.id]);
  const error  = useCinemasStore(s => s.sessionsError[cinema.id]);

  const navigate = useNavigate();

  useEffect(() => {
    const st = useCinemasStore.getState();
    void st.loadSessions(cinema.id);
  }, [cinema.id]);

  if (error) return <div style={{ color: 'tomato' }}>{error}</div>;
  if (status === 'loading' && sessions.length === 0) return <div>Загрузка сеансов…</div>;

  return (
    <CinemaItem
      cinema={cinema}
      sessions={sessions}
      onViewSessions={() => {
        navigate(routes.cinema(cinema.id));
        console.log('Pick session', cinema.id);
      }}
    />
  );
});

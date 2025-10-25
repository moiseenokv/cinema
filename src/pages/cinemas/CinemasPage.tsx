import { useEffect, useMemo } from 'react';
import { useCinemasStore } from '@/shared/model/cinemas/useCinemasStore';
import { CinemasList } from '@/widgets/cinema-list/CinemaList';

export function CinemasPage() {
  const byId   = useCinemasStore(s => s.byId);
  const status = useCinemasStore(s => s.status);
  const error  = useCinemasStore(s => s.error);

  useEffect(() => {
    const { status, load } = useCinemasStore.getState();
    if (status !== 'loading' && status !== 'succeeded') load();
  }, []);

  const cinemas = useMemo(() => Object.values(byId), [byId]);

  return (
    <div style={{ padding: 16 }}>
      <h1>Кинотеатры</h1>
      {error && <div style={{ color: 'tomato' }}>{error}</div>}
      {!error && status === 'loading' && cinemas.length === 0 && <div>Загрузка кинотеатров…</div>}
      {!error && cinemas.length > 0 && <CinemasList cinemas={cinemas} />}
    </div>
  );
}

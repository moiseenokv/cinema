import { memo } from 'react';
import type { Cinema } from '@/shared/api/cinemas/types';
import { CinemaListItem } from './CinemaListItem';

type Props = { cinemas: Cinema[] };

export const CinemasList = memo(function CinemasList({ cinemas }: Props) {
  return <div>{cinemas.map(c => <CinemaListItem key={c.id} cinema={c} />)}</div>;
});
import { memo } from 'react';
import styles from './SessionHeader.module.scss';

type Props = {
  movieTitle?: string;
  cinemaName?: string;
  cinemaAddress?: string;
  startHuman?: string;
};

export const SessionHeader = memo(function SessionHeader({
  movieTitle = 'Фильм',
  cinemaName = 'Кинотеатр',
  cinemaAddress = '—',
  startHuman = '—',
}: Props) {
  return (
    <section className={styles.container} aria-label="Информация о сеансе">
      <div className={styles.block}>
        <div className={styles.label}>Фильм</div>
        <div className={styles.title}>{movieTitle}</div>
        <div className={styles.meta}>{startHuman}</div>
      </div>

      <div className={styles.block}>
        <div className={styles.label}>Кинотеатр</div>
        <div className={styles.title}>{cinemaName}</div>
        <div className={styles.meta}>{cinemaAddress}</div>
      </div>
    </section>
  );
});

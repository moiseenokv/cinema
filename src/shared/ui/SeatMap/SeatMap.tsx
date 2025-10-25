import { memo, useCallback, useMemo } from 'react';
import styles from './SeatMap.module.scss';

export type SeatMapProps = {
  rows: number;
  cols: number;
  booked: Set<string>;
  selected: Set<string>;
  disabled?: boolean;
  onToggle: (seatId: string) => void;
};

const rowLabel = (i: number) => String.fromCharCode(65 + i); // 0 -> A
const seatId = (row: number, col: number) => `${rowLabel(row)}${col + 1}`;

export const SeatMap = memo(function SeatMap({
  rows, cols, booked, selected, disabled, onToggle,
}: SeatMapProps) {
  // клампим входные значения: 0 -> 1
  const safeRows = rows > 0 ? rows : 1;
  const safeCols = cols > 0 ? cols : 1;

  const seats = useMemo(() => {
    const out: { id: string }[] = [];
    for (let r = 0; r < safeRows; r++) {
      for (let c = 0; c < safeCols; c++) {
        out.push({ id: seatId(r, c) });
      }
    }
    return out;
  }, [safeRows, safeCols]);

  const handleClick = useCallback((id: string, isBooked: boolean) => {
    if (disabled || isBooked) return;
    onToggle(id);
  }, [disabled, onToggle]);

  return (
    <div className={styles.container}>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${safeCols}, 56px)` }}
        role="grid"
        aria-rowcount={safeRows}
        aria-colcount={safeCols}
      >
        {seats.map(({ id }) => {
          const isBooked   = booked.has(id);
          const isSelected = selected.has(id);
          const cls = [
            styles.seat,
            isBooked ? styles.seatBooked : '',
            isSelected ? styles.seatSelected : '',
            disabled ? styles.seatDisabled : '',
          ].join(' ');
          return (
            <button
              key={id}
              type="button"
              className={cls}
              aria-pressed={isSelected}
              aria-label={`Место ${id}`}
              disabled={isBooked || !!disabled}
              onClick={() => handleClick(id, isBooked)}
              role="gridcell"
            >
              {id}
            </button>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span className={`${styles.legendDot} ${styles.legendFree}`} /> Свободно
        <span className={`${styles.legendDot} ${styles.legendSelected}`} /> Вы выбрали
        <span className={`${styles.legendDot} ${styles.legendBooked}`} /> Занято
      </div>
    </div>
  );
});

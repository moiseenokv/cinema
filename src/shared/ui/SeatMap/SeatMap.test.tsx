import { render, screen, fireEvent } from '@testing-library/react';
import { SeatMap } from './SeatMap';

it('вызывает onToggle для свободного места и дизейблит занятое', () => {
  const onToggle = vi.fn();
  const booked = new Set(['A1']);
  const selected = new Set<string>();

  render(
    <SeatMap rows={2} cols={2} booked={booked} selected={selected} onToggle={onToggle} />
  );

  // занятое A1 — disabled
  expect(screen.getByRole('gridcell', { name: /место A1/i })).toBeDisabled();

  // свободное A2 — кликабельно
  fireEvent.click(screen.getByRole('gridcell', { name: /место A2/i }));
  expect(onToggle).toHaveBeenCalledWith('A2');
});
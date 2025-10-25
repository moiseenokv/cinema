export function toSeatIdHuman(rowNumber: number, seatNumber: number) {
  const rn = Number.isFinite(rowNumber) ? Math.max(1, Math.trunc(rowNumber)) : 1;
  const sn = Number.isFinite(seatNumber) ? Math.max(1, Math.trunc(seatNumber)) : 1;
  const letter = String.fromCharCode(64 + rn);
  return `${letter}${sn}`;
}

export const parseSeatId = (id: string) => {
  const m = /^([A-Z])(\d+)$/.exec(id.trim());
  if (!m) return null;
  const rowIdx0 = m[1].charCodeAt(0) - 65;
  const colIdx0 = Number(m[2]) - 1;
  if (rowIdx0 < 0 || colIdx0 < 0) return null;
  return { rowIdx0, colIdx0 };
};

export const toApiSeat = (seatId: string) => {
  const parsed = parseSeatId(seatId);
  if (!parsed) return null;
  const { rowIdx0, colIdx0 } = parsed;
  return { rowNumber: rowIdx0 + 1, seatNumber: colIdx0 + 1 };
};

export const fromApiSeat = (x: { rowNumber: number; seatNumber: number }) => {
  const r = Number(x?.rowNumber ?? 0);
  const c = Number(x?.seatNumber ?? 0);
  if (r <= 0 || c <= 0) return null;
  return toSeatIdHuman(r, c);
};


export const formatFullDateTime = (iso: string | Date, locale = 'ru-RU') =>
  new Date(iso).toLocaleString(locale, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const RU_MONTHS_SHORT = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
const pad2 = (n: number) => String(n).padStart(2, '0');

export const formatShortDateTime = (iso: string | Date) => {
  const d = new Date(iso);
  const day = d.getDate();
  const mon = RU_MONTHS_SHORT[d.getMonth()];
  const hh = pad2(d.getHours());
  const mm = pad2(d.getMinutes());
  return `${day}-${mon} ${hh}:${mm}`;
};

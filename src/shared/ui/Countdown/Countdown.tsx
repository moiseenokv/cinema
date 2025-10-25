import { memo, useEffect, useState } from 'react';

type Props = {
  until: number;
  tickMs?: number;
  onExpire?: () => void;
};

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export const Countdown = memo(function Countdown({ until, tickMs = 1000, onExpire }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  const left = Math.max(0, until - now);
  const sec = Math.floor(left / 1000);
  const mm = Math.floor(sec / 60);
  const ss = sec % 60;

  useEffect(() => {
    if (left <= 0) onExpire?.();
  }, [left, onExpire]);

  return <span>{pad(mm)}:{pad(ss)}</span>;
});

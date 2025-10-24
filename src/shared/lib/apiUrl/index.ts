export function toApiUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;

  const base = import.meta.env.PROD
    ? (import.meta.env.VITE_API_ORIGIN ?? '').replace(/\/+$/, '')
    : '';

  return `${base}${path}`;
}

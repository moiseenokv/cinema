import axios from 'axios';

type AnyRecord = Record<string, unknown>;

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as AnyRecord | undefined;

    const msg =
      (typeof data?.message === 'string' && data.message) ||
      (typeof data?.error === 'string' && data.error) ||
      (typeof data?.detail === 'string' && data.detail) ||
      (typeof err.response?.statusText === 'string' && err.response?.statusText);

    if (msg) return msg;
    const code = err.response?.status;
    const url = err.config?.url;
    return code ? `Ошибка ${code}${url ? ` (${url})` : ''}` : 'Ошибка запроса';
  }

  if (err instanceof Error && err.message) return err.message;
  return 'Неизвестная ошибка';
}
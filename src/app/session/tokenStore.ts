import Cookies from 'js-cookie';

const COOKIE_NAME = 'token';
const COOKIE_OPTS = { sameSite: 'lax' as const, path: '/' };

export function setToken(token: string) {
  Cookies.set(COOKIE_NAME, token, COOKIE_OPTS);
}
export function getToken(): string | null {
  return Cookies.get(COOKIE_NAME) ?? null;
}
export function clearToken() {
  Cookies.remove(COOKIE_NAME, { path: '/' });
}
export function isAuthenticated(): boolean {
  return Boolean(getToken());
}
import type { AuthService } from './port';
import { httpAuthService } from './adapters/httpAuthService';

let current: AuthService = httpAuthService;
export const setAuthService = (s: AuthService) => { current = s; };
export const getAuthService = () => current;

export * from './port';
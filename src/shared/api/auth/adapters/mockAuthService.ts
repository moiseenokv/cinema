import type { AuthService, LoginPayload, RegisterPayload } from '../port';

let _isAuth = false;

export const mockAuthService: AuthService = {
  async login(_data: LoginPayload) {
    _isAuth = true;
    return { token: 'mock-token' };
  },
  async register(_data: RegisterPayload) {
    _isAuth = true;
    return;
  },
};

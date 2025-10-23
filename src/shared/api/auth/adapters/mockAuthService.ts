import type { AuthService, LoginPayload, RegisterPayload } from '../port';

export const mockAuthService: AuthService = {
  async login(_data: LoginPayload) {
    return { token: 'mock-token' };
  },
  async register(_data: RegisterPayload) {
    return;
  },
};

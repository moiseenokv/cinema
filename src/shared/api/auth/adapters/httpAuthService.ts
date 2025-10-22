import { http } from '@/shared/api/http';
import type { AuthService, LoginPayload, RegisterPayload } from '../port';

export const httpAuthService: AuthService = {
  async login(data: LoginPayload) {
    const res = await http.post('/login', data);
    return res.data as { token: string };
  },
  async register(data: RegisterPayload) {
    await http.post('/register', data);
  },
};
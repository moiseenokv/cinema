import { create } from 'zustand';
import { getAuthService } from '@/shared/api/auth';
import { setToken, clearToken, isAuthenticated, getToken } from './tokenStore';
import { getErrorMessage } from '@/shared/api/getErrorMessage';

type SessionState = {
  authenticated: boolean;
  token: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  refreshFromCookie: () => void;
};

export const useSession = create<SessionState>((set) => ({
  authenticated: isAuthenticated(),
  token: getToken(),

  login: async (username, password) => {
    try {
      const { token } = await getAuthService().login({ username, password });
      setToken(token);
      set({ authenticated: true, token });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
    
  },

  logout: async () => {
    clearToken();
    set({ authenticated: false, token: null });
  },

  refreshFromCookie: () => {
    set({ authenticated: isAuthenticated(), token: getToken() });
  },
}));

export const useIsAuth = () => useSession((s) => s.authenticated);

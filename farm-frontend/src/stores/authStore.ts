import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'farmer' | 'customer';
  } | null;
  setAuth: (token: string, user: AuthState['user']) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'farmdirect-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper for axios interceptor access (non-hook)
export const getAuthToken = (): string | null => {
  try {
    const raw = localStorage.getItem('farmdirect-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
};

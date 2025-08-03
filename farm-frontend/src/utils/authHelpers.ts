import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../stores/authStore";

interface Decoded {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<Decoded>(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

export const setupAutoLogout = () => {
  const token = useAuthStore.getState().token;
  if (!token) return;
  const { exp } = jwtDecode<Decoded>(token);
  const timeout = exp * 1000 - Date.now();
  if (timeout <= 0) {
    useAuthStore.getState().clearAuth();
    return;
  }
  setTimeout(() => {
    useAuthStore.getState().clearAuth();
  }, timeout);
};

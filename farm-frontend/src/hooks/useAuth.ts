import { useMutation } from "@tanstack/react-query";
import { login, register } from "../api/client";
import { type AuthLoginPayload, type AuthRegisterPayload } from "@/types";
import { useAuthStore } from "../stores/authStore";
import { setupAutoLogout } from "@/utils/authHelpers";

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (payload: AuthRegisterPayload) => register(payload),
    onSuccess: (res) => {
      setAuth(res.data.token, res.data.user);
      setupAutoLogout();
    },
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (payload: AuthLoginPayload) => login(payload),
    onSuccess: (res) => {
      setAuth(res.data.token, res.data.user);
      setupAutoLogout();
    },
  });
};

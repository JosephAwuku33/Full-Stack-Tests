import axios from "axios";
import { getAuthToken } from "../stores/authStore.ts";

const api = axios.create({
  baseURL: "http://localhost:5000/api/",
  timeout: 10000,
});

// Attach JWT if present
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: central response error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Could expand: refresh token, global toast, logging
    return Promise.reject(err);
  }
);

export default api;

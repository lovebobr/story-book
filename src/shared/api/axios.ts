import axios from "axios";
import type { AuthResponse } from "../../models/response/AuthResponse";

export const API_URL = `http://localhost:8080`;

export const $api = axios.create({
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("Нет refresh токена");
        }

        const response = await axios.post<AuthResponse>(
          `${API_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          },
        );

        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);

        return $api.request(originalRequest);
      } catch (e) {}
    }

    throw error;
  },
);

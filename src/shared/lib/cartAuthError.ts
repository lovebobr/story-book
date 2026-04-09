import axios from "axios";
import type { NavigateFunction } from "react-router-dom";

const MSG = "Войдите в аккаунт, чтобы пользоваться корзиной.";

/**
 * 401 от /carts обычно значит: нет accessToken или сессия истекла.
 * Возвращает true, если обработали как «нужна авторизация».
 */
export function handleCartUnauthorized(
  err: unknown,
  navigate: NavigateFunction,
  loginPath: string,
): boolean {
  if (!axios.isAxiosError(err)) return false;
  if (err.response?.status !== 401) return false;
  window.alert(MSG);
  navigate(loginPath);
  return true;
}

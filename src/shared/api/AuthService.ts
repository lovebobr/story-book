import { $api } from "./axios";
import type { AxiosResponse } from "axios";
import type { AuthResponse } from "../../models/response/AuthResponse";

export default class AuthService {
  static async login(
    email: string,
    password: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/login", { email, password });
  }

  static async registration(
    email: string,
    password: string,
    name: string,
    surname: string,
    phone: string,
    question: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/auth/signup", {
      email,
      password,
      name,
      surname,
      phone,
      question,
    });
  }

  static async logout(): Promise<void> {
    return $api.post("/logout");
  }
}

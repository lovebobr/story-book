import { makeAutoObservable } from "mobx";
import AuthService from "../../../shared/api/AuthService";
import { AxiosError } from "axios";
import type { IUser } from "../../../entities/user/model/types";
import { userApi } from "../../../entities/user/api";

export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    const token = localStorage.getItem("accessToken");
    if (token) this.isAuth = true;
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log("Login error:", e.response?.data?.message);
      } else if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async registration(
    email: string,
    password: string,
    name: string,
    surname: string,
    phone: string,
    question: string,
  ) {
    try {
      const response = await AuthService.registration(
        email,
        password,
        name,
        surname,
        phone,
        question,
      );
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log("Registration error:", e.response?.data?.message);
      } else if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.response?.data?.message);
      } else if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await userApi.getCurrentUser();
      this.setAuth(true);
      this.setUser(response.data);
    } catch (e) {
      this.setAuth(false);
      this.setUser({} as IUser);
    } finally {
      this.setLoading(false);
    }
  }
}

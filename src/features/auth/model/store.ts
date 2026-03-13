import type { IUser } from "../../../entities/user/model/types";
import { makeAutoObservable } from "mobx";
import AuthService from "../../../shared/api/AuthService";
import axios, { AxiosError } from "axios";
import { API_URL } from "../../../shared/api/axios";

export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);

    const token = localStorage.getItem("accessToken");
    if (token) {
      this.isAuth = true;
    }
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
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        this.setLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      console.log("CheckAuth response:", response.data);

      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);

      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      this.setAuth(false);
      this.setUser({} as IUser);
    } finally {
      this.setLoading(false);
    }
  }
}

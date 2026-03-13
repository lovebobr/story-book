import type { IUser } from "../../entities/user/model/types";

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: IUser;
}

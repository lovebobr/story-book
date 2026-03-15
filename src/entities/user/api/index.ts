import { $api } from "../../../shared/api/axios";
import type { IUser } from "../model/types";

const USER_URL = "/users";

export const userApi = {
  getCurrentUser: () => {
    return $api.get<IUser>(`${USER_URL}/me`);
  },

  updateProfile: (
    data: Partial<Omit<IUser, "id" | "email" | "points" | "role">>,
  ) => {
    return $api.put<IUser>(`${USER_URL}/me`, data);
  },

  deleteAccount: () => {
    return $api.delete<void>(`${USER_URL}/me`);
  },

  changePassword: (data: { oldPassword: string; newPassword: string }) => {
    return $api.patch<void>(`${USER_URL}/me/password`, data);
  },

  getUserById: (id: string) => {
    return $api.get<IUser>(`${USER_URL}/${id}`);
  },
};

import { useContext } from "react";
import { Context } from "../../..";
import type { IUser } from "../model/types";

export interface AuthContextType {
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const { store } = useContext(Context);

  if (!store) {
    throw new Error(
      "useAuth must be used within a Context.Provider that provides store",
    );
  }

  return {
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuth,
    refetchUser: async () => {
      await store.checkAuth();
    },
  };
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favouritesApi } from "../api";
import { favouritesKeys } from "./useFavourites";

export const useRemoveFromFavourites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => favouritesApi.removeFromFavourites(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favouritesKeys.all });
    },
  });
};

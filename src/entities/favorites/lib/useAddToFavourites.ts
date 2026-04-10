import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favouritesApi } from "../api";
import { favouritesKeys } from "./useFavourites";

export const useAddToFavourites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => favouritesApi.addToFavourites(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favouritesKeys.all });
    },
  });
};

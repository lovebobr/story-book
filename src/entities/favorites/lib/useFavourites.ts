import { useQuery } from "@tanstack/react-query";
import { favouritesApi } from "../api";

export const favouritesKeys = {
  all: ["favourites"] as const,
};

export const useFavourites = () => {
  return useQuery({
    queryKey: favouritesKeys.all,
    queryFn: async () => {
      const response = await favouritesApi.getFavourites();
      return response.data.books;
    },
  });
};

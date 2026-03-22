import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { bookApi } from "../api";

export const useGetBooks = () => {
  const queryClient = useQueryClient();

  const getBooks = useCallback(
    (params?: { title?: string; author?: string; genre?: string }) => {
      return queryClient.fetchQuery({
        queryKey: ["books", params],
        queryFn: () => bookApi.getBooks().then((res) => res.data.books),
      });
    },
    [queryClient],
  );
  return getBooks;
};

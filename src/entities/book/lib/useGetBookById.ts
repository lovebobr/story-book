import { useQuery } from "@tanstack/react-query";
import { bookApi } from "../api";

export const useGetBookById = (id?: string | null) => {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => bookApi.getBookById(id!).then((res) => res.data),
    enabled: !!id,
  });
};

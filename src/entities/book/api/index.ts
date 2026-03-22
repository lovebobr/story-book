import { $api } from "../../../shared/api/axios";
import type { IBook, IBookCreateUpdate } from "../model/types";

const BOOKS_URL = "/books";

export const bookApi = {
  getBooks: () => {
    return $api.get<{ books: IBook[] }>(BOOKS_URL);
  },

  createBook: (data: IBookCreateUpdate) => {
    return $api.post<IBook>(BOOKS_URL, data);
  },

  getBookById: (id: string) => {
    return $api.get<IBook>(`${BOOKS_URL}/${id}`);
  },

  updateBook: (id: string, data: IBookCreateUpdate) => {
    return $api.put<IBook>(`${BOOKS_URL}/${id}`, data);
  },

  deleteBook: (id: string) => {
    return $api.delete<void>(`${BOOKS_URL}/${id}`);
  },
};

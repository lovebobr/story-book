import { $api } from "../../../shared/api/axios";
import type { IBook } from "../../book/model/types";

const CART_URL = "/carts";

export const cartApi = {
  getCart: (params?: { limit?: number; offset?: number }) => {
    return $api.get<{ books: IBook[] }>(CART_URL, {
      params: {
        limit: params?.limit ?? 10,
        offset: params?.offset ?? 0,
      },
    });
  },

  addToCart: (body: { book_id: string; amount: number }) => {
    return $api.post(CART_URL, body);
  },

  updateCartItem: (
    bookId: string,
    body: { amount: number; book_id: string },
  ) => {
    return $api.patch(`${CART_URL}/${bookId}`, body);
  },

  removeFromCart: (bookId: string) => {
    return $api.delete(`${CART_URL}/${bookId}`);
  },
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../api";
import type { IBook } from "../../book/model/types";

export const CART_QUERY_KEY = ["cart"] as const;

export function useCartBooks() {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const { data } = await cartApi.getCart({ limit: 100, offset: 0 });
      return data.books;
    },
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { book_id: string; amount?: number }) => {
      const delta = payload.amount ?? 1;
      const books = queryClient.getQueryData<IBook[]>(CART_QUERY_KEY);
      const existing = books?.find((b) => b.id === payload.book_id);

      if (existing) {
        const nextAmount = existing.amount + delta;
        if (nextAmount <= 0) {
          return cartApi.removeFromCart(payload.book_id);
        }
        return cartApi.updateCartItem(payload.book_id, {
          book_id: payload.book_id,
          amount: nextAmount,
        });
      }

      return cartApi.addToCart({ book_id: payload.book_id, amount: delta });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookId,
      amount,
    }: {
      bookId: string;
      amount: number;
    }) => cartApi.updateCartItem(bookId, { book_id: bookId, amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => cartApi.removeFromCart(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function cartTotals(books: IBook[]) {
  let pieces = 0;
  let sumAfter = 0;
  let sumBefore = 0;

  for (const b of books) {
    const amt = Math.max(0, b.amount);
    pieces += amt;
    const unitAfter = b.cost;
    let unitBefore = unitAfter;
    if (b.discount > 0 && b.discount < 100) {
      unitBefore = Math.round(unitAfter / (1 - b.discount / 100));
    }
    sumAfter += unitAfter * amt;
    sumBefore += unitBefore * amt;
  }

  const discountSum = sumBefore - sumAfter;
  return { pieces, sumAfter, sumBefore, discountSum };
}

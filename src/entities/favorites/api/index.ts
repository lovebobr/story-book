import { $api } from "../../../shared/api/axios";
import type { IFavouriteBook } from "../model/types";
const FAVOURITES_URL = '/favourites';

export interface FavouritesResponse {
  books: IFavouriteBook[];
}

export const favouritesApi = {
  getFavourites: () => {
    return $api.get<FavouritesResponse>(FAVOURITES_URL);
  },

  addToFavourites: (bookId: string) => {
    return $api.post(FAVOURITES_URL, { book_id: bookId });
  },

  removeFromFavourites: (bookId: string) => {
    return $api.delete(`${FAVOURITES_URL}/${bookId}`);
  },
};
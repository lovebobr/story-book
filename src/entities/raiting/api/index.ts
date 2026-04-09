import { $api } from "../../../shared/api/axios";

const RATINGS_URL = "/ratings";

export const ratingApi = {
  rateBook: (bookId: string, stars: number) => {
    return $api.post(RATINGS_URL, { book_id: bookId, stars });
  },

  deleteRating: (bookId: string) => {
    return $api.delete(`${RATINGS_URL}/${bookId}`);
  },
};

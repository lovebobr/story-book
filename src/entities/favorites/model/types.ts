export interface IFavouriteBook {
  id: string;
  title: string;
  author: string;
  cost: number;
  description?: string;
  discount?: number;
  genres?: { genre: string }[];
  image?: string;
  publisher?: string;
  rating?: number;
  year?: number;
  amount?: number;
}

export interface IBook {
  id: string;
  title: string;
  author: string;
  cost: number;
  amount: number;
  description: string;
  discount: number;
  image: string;
  publisher: string;
  year: number;
  rating: number;
  genres: { genre: string }[];
}

export type IBookCreateUpdate = Omit<IBook, 'id' | 'rating' | 'genres'>;
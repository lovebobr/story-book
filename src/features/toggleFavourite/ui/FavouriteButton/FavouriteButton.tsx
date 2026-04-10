import React from "react";
import styles from "./FavouriteButton.module.css";
import {
  useAddToFavourites,
  useFavourites,
  useRemoveFromFavourites,
} from "../../../../entities";

interface FavouriteButtonProps {
  bookId: string;
  className?: string;
}

export const FavouriteButton: React.FC<FavouriteButtonProps> = ({
  bookId,
  className,
}) => {
  const { data: books = [], isLoading: isLoadingFavourites } = useFavourites();
  const { mutate: addToFavourites, isPending: isAdding } = useAddToFavourites();
  const { mutate: removeFromFavourites, isPending: isRemoving } =
    useRemoveFromFavourites();

  const isFavourite = books.some((book) => book.id === bookId);
  const isLoading = isLoadingFavourites || isAdding || isRemoving;

  const handleClick = () => {
    if (isLoading) return;
    if (isFavourite) {
      removeFromFavourites(bookId);
    } else {
      addToFavourites(bookId);
    }
  };

  return (
    <button
      className={`${styles.button} ${className || ""}`}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={
        isFavourite ? "Удалить из избранного" : "Добавить в избранное"
      }
    >
      <div className={styles.circle}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35Z"
            fill={isFavourite ? "#380e41" : "transparent"}
            stroke="#380e41"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </button>
  );
};

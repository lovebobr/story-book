import React, { useState } from "react";

import styles from "./InteractiveRating.module.css";
import { ratingApi } from "../../../../../entities/raiting/api";
import { Star } from "../../../../../shared/ui/Star";

export interface InteractiveRatingProps {
  bookId: string;
  initialRating?: number;
  onRateSuccess?: (newRating: number) => void;
}

const MAX_STARS = 5;

export const InteractiveRating: React.FC<InteractiveRatingProps> = ({
  bookId,
  initialRating = 0,
  onRateSuccess,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseEnter = (starIndex: number) => {
    if (isLoading) return;
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (isLoading) return;
    setHoverRating(0);
  };

  const handleClick = async (starIndex: number) => {
    const newRating = starIndex + 1;
    if (newRating === rating) return;
    setIsLoading(true);
    try {
      await ratingApi.rateBook(bookId, newRating);
      setRating(newRating);
      onRateSuccess?.(newRating);
    } catch (error) {
      console.error("Ошибка при оценке книги:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={styles.container}>
      {[...Array(MAX_STARS)].map((_, index) => {
        const isFilled = index + 1 <= displayRating;
        const fillType = isFilled ? "full" : "empty";
        return (
          <div
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          >
            <Star fillType={fillType} interactive={true} />
          </div>
        );
      })}
      {isLoading && <span className={styles.loader}>...</span>}
    </div>
  );
};

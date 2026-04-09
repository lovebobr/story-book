import React from "react";
import { Star } from "../../../../shared/ui/Star";
import { getStarFillType } from "../../lib/getStarFillType";
import styles from "./RatingStars.module.css";

export interface RatingStarsProps {
  value: number;
  size?: number;
}

const MAX_STARS = 5;

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  size = 24,
}) => {
  const clampedValue = Math.min(5, Math.max(0, value));

  return (
    <div className={styles.container} style={{ fontSize: size }}>
      {[...Array(MAX_STARS)].map((_, index) => (
        <Star
          key={index}
          fillType={getStarFillType(clampedValue, index)}
          interactive={false}
        />
      ))}
    </div>
  );
};

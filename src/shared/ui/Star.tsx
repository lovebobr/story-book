// shared/ui/Star/Star.tsx
import React from "react";
import styles from "./Star.module.css";

export type StarFillType = "empty" | "half" | "full";

interface StarProps {
  fillType: StarFillType;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  interactive?: boolean;
}

export const Star: React.FC<StarProps> = ({
  fillType,
  onClick,
  onMouseEnter,
  onMouseLeave,
  interactive = false,
}) => {
  const fullFill = fillType === "full" ? "#F5B342" : "none";
  const halfFill = fillType === "half" ? "#F5B342" : "none";

  return (
    <div
      className={`${styles.star} ${interactive ? styles.interactive : ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <svg
        viewBox="0 0 24 24"
        width="40"
        height="40"
        fill="none"
        stroke="#F5B342"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          {fillType === "half" && (
            <clipPath id="halfClip">
              <rect x="0" y="0" width="12" height="24" />
            </clipPath>
          )}
        </defs>
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill={fullFill}
        />
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill={halfFill}
          clipPath={fillType === "half" ? "url(#halfClip)" : undefined}
        />
      </svg>
    </div>
  );
};

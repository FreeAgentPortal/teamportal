"use client";

import React from "react";
import styles from "./DiamondRating.module.scss";
import { DiamondRatingProps } from "./DiamondRating.types";

const DiamondRating: React.FC<DiamondRatingProps> = ({
  rating,
  maxRating = 5,
  size = "medium",
  showValue = false,
  className = "",
}) => {
  const renderDiamonds = (rating: number, maxRating: number) => {
    // Renders diamonds with support for half-filled diamonds
    // Examples: 3.0 = 3 full, 2 empty | 3.5 = 3 full, 1 half, 1 empty | 4.7 = 4 full, 1 half
    return Array.from({ length: maxRating }, (_, i) => {
      const diamondIndex = i + 1;
      let diamondClass = `${styles.diamond} ${styles[size]}`;

      if (rating >= diamondIndex) {
        // Full diamond
        diamondClass += ` ${styles.filled}`;
      } else if (rating >= diamondIndex - 0.5) {
        // Half diamond
        diamondClass += ` ${styles.halfFilled}`;
      }

      return (
        <span key={i} className={diamondClass}>
          <span className={styles.diamondIcon}>♦</span>
        </span>
      );
    });
  };

  const getRatingColor = (rating: number, maxRating: number) => {
    const percentage = rating / maxRating;
    if (percentage >= 0.8) return styles.excellent;
    if (percentage >= 0.6) return styles.good;
    if (percentage >= 0.4) return styles.average;
    return styles.poor;
  };

  return (
    <div className={`${styles.diamondRating} ${className}`}>
      {showValue && (
        <div className={`${styles.ratingValue} ${styles[size]} ${getRatingColor(rating, maxRating)}`}>
          {rating}/{maxRating}
        </div>
      )}
      <div className={`${styles.diamondsContainer} ${styles[size]}`}>{renderDiamonds(rating, maxRating)}</div>
    </div>
  );
};

export default DiamondRating;

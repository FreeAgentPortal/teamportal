import React from "react";

export interface DiamondRatingProps {
  rating: number;
  maxRating?: number;
  size?: "small" | "medium" | "large";
  showValue?: boolean;
  className?: string;
}

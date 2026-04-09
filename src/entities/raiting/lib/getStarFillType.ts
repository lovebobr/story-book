export type StarFillType = "empty" | "half" | "full";

export const getStarFillType = (
  rating: number,
  starIndex: number,
): StarFillType => {
  const starNumber = starIndex + 1;
  if (rating >= starNumber) return "full";
  if (rating >= starNumber - 0.5) return "half";
  return "empty";
};

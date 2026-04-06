/**
 * SVG path data for a 5-pointed star within a 24x24 viewBox.
 * The path starts at the top center point and traces the star outline.
 */
export const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

/**
 * SVG path data for a half-star (left half only).
 * This path traces only the left half of the star shape.
 * Used as an alternative to clip-path for half-fill rendering.
 */
export const STAR_HALF_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77z';

/**
 * Generates a clipPath element ID for a given star index.
 * Used to create unique clip-path references when rendering multiple stars.
 */
export function clipPathId(index: number): string {
  return `star-clip-${index}`;
}

/**
 * Generates the clipPath rectangle definition for a half-filled star.
 * The clip rect covers the left 50% of a 24x24 viewBox.
 */
export const HALF_CLIP_RECT = {
  x: 0,
  y: 0,
  width: 12,
  height: 24,
};

/**
 * Generates a clipPath rectangle for a fractional fill amount.
 * @param fraction - Fill amount from 0 to 1 (e.g., 0.7 for 70% fill)
 */
export function fractionalClipRect(fraction: number) {
  return {
    x: 0,
    y: 0,
    width: 24 * fraction,
    height: 24,
  };
}

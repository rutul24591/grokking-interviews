/**
 * ARIA attributes for the rating container.
 */
export interface RatingAriaAttributes {
  role: 'slider';
  'aria-valuenow': number;
  'aria-valuemin': number;
  'aria-valuemax': number;
  'aria-valuetext': string;
  'aria-label'?: string;
  'aria-disabled': boolean;
  tabIndex: number;
}

/**
 * Generates ARIA attributes for a rating component using the slider pattern.
 *
 * @param value - Current rating value
 * @param max - Maximum rating value
 * @param label - Optional accessible label (e.g., "Product rating")
 * @param disabled - Whether the rating is read-only
 */
export function useRatingAria(
  value: number,
  max: number,
  label?: string,
  disabled = false
): RatingAriaAttributes {
  const valueText = `${value} out of ${max} star${max !== 1 ? 's' : ''}`;

  return {
    role: 'slider',
    'aria-valuenow': value,
    'aria-valuemin': 0,
    'aria-valuemax': max,
    'aria-valuetext': valueText,
    'aria-label': label,
    'aria-disabled': disabled,
    tabIndex: disabled ? -1 : 0,
  };
}

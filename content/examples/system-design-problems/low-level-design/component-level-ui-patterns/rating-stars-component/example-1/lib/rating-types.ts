/** Size variants mapped to pixel dimensions */
export type RatingSize = 'sm' | 'md' | 'lg';

export const SIZE_MAP: Record<RatingSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

/** Color configuration for star states */
export interface RatingColors {
  filled: string;   // color of filled star
  empty: string;    // color of empty star
  hover: string;    // color on hover
}

export const DEFAULT_COLORS: RatingColors = {
  filled: '#f59e0b',   // amber-500
  empty: '#d1d5db',    // gray-300
  hover: '#fbbf24',    // amber-400
};

/** Complete rating component configuration */
export interface RatingConfig {
  max: number;
  size: RatingSize;
  colors: RatingColors;
  readOnly: boolean;
  label?: string;
  value: number;
}

export const DEFAULT_CONFIG: Omit<RatingConfig, 'value'> = {
  max: 5,
  size: 'md',
  colors: DEFAULT_COLORS,
  readOnly: false,
};

/** Visual fill state of an individual star */
export type StarFillState = 'filled' | 'half' | 'empty';

/** Per-star rendering metadata */
export interface StarRenderInfo {
  index: number;
  fillState: StarFillState;
  /** Fractional fill amount (0-1). Only used when fillState is 'half' in read-only mode. */
  fractionalFill: number;
}

/** Callback signature when rating changes */
export type RatingChangeHandler = (value: number) => void;

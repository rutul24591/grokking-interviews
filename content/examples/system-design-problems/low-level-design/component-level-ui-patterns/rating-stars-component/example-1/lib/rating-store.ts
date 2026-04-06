import { create } from 'zustand';
import type { RatingConfig } from './rating-types';

interface RatingState {
  value: number;
  hoverValue: number | null;
  config: RatingConfig;
  setValue: (value: number) => void;
  setHover: (value: number | null) => void;
  setConfig: (config: Partial<RatingConfig>) => void;
}

/**
 * Clamp a value to the range [0, max].
 */
function clamp(value: number, max: number): number {
  return Math.min(Math.max(0, value), max);
}

/**
 * Round to the nearest 0.5 increment.
 */
function roundHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

/**
 * Create a scoped rating store for a single RatingStars instance.
 * Each rating component on the page should use its own store to avoid state collision.
 */
export function createRatingStore(initialConfig: RatingConfig) {
  return create<RatingState>((set) => ({
    value: initialConfig.value,
    hoverValue: null,
    config: initialConfig,

    setValue: (value: number) => {
      const { max } = initialConfig;
      const clamped = clamp(roundHalf(value), max);
      set({ value: clamped, hoverValue: null });
    },

    setHover: (hoverValue: number | null) => {
      if (hoverValue !== null) {
        const { max } = initialConfig;
        hoverValue = clamp(roundHalf(hoverValue), max);
      }
      set({ hoverValue });
    },

    setConfig: (partial: Partial<RatingConfig>) => {
      set((state) => ({
        config: { ...state.config, ...partial },
      }));
    },
  }));
}

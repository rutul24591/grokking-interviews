'use client';

import type { ButtonSpinnerProps } from '../lib/button-types';

/**
 * Animated SVG spinner for button loading states.
 *
 * Uses CSS animation for rotation (GPU-composited). Supports both
 * indeterminate (continuous spin) and determinate (progress arc) modes.
 * Marked aria-hidden since the button's aria-busy communicates loading.
 */
export function ButtonSpinner({
  size = 16,
  color = 'currentColor',
  determinate = false,
  progress = 0,
}: ButtonSpinnerProps) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;

  if (determinate) {
    // Determinate mode: show progress arc
    const offset = circumference - (progress / 100) * circumference;

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="inline-block"
        aria-hidden="true"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={2}
          opacity={0.2}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-300"
        />
      </svg>
    );
  }

  // Indeterminate mode: spinning arc
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="inline-block animate-spin"
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

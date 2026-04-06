'use client';

import type { ButtonIconProps } from '../lib/button-types';
import { ButtonSpinner } from './button-spinner';
import { iconSlotClass, spinnerSizeMap, spinnerColors } from '../lib/button-styles';

/**
 * Icon slot for the Button component.
 *
 * Renders the provided icon node in a flex-shrink-none container sized
 * according to the button size. When the parent button is loading,
 * crossfades the icon to a spinner.
 */
export function ButtonIcon({
  icon,
  size,
  isLoading,
  spinnerColor,
}: ButtonIconProps) {
  const spinnerSize = spinnerSizeMap[size];

  return (
    <span className={iconSlotClass}>
      {isLoading ? (
        <span className="inline-flex items-center justify-center transition-opacity duration-200">
          <ButtonSpinner
            size={spinnerSize}
            color={spinnerColor || spinnerColors.primary}
          />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center transition-opacity duration-200">
          {icon}
        </span>
      )}
    </span>
  );
}

import { useMemo } from 'react';

interface UseButtonAriaOptions {
  loading: boolean;
  disabled: boolean;
  iconOnly: boolean;
  ariaLabel?: string;
  renderedAs: string; // The resolved element tag name (e.g., 'button', 'a', 'div')
}

interface UseButtonAriaReturn {
  'aria-busy': 'true' | 'false';
  'aria-disabled': 'true' | 'false';
  role?: 'button';
  'aria-label'?: string;
}

/**
 * Computes ARIA attributes based on button state.
 *
 * - `aria-busy`: true when loading (and not disabled) — signals to screen
 *   readers that an operation is in progress.
 * - `aria-disabled`: true when disabled or loading — keeps the element
 *   focusable while indicating non-interactivity.
 * - `role`: only set to "button" if the rendered element is not a native
 *   `<button>` (native buttons have implicit role="button").
 * - `aria-label`: passed through for icon-only buttons. A development
 *   warning fires if iconOnly is true but aria-label is missing.
 */
export function useButtonAria({
  loading,
  disabled,
  iconOnly,
  ariaLabel,
  renderedAs,
}: UseButtonAriaOptions): UseButtonAriaReturn {
  const aria = useMemo<UseButtonAriaReturn>(() => {
    const result: UseButtonAriaReturn = {
      'aria-busy': loading && !disabled ? 'true' : 'false',
      'aria-disabled': disabled || loading ? 'true' : 'false',
    };

    // Only add role="button" for non-native-button elements
    if (renderedAs !== 'button') {
      result.role = 'button';
    }

    // Pass through aria-label for icon-only buttons
    if (iconOnly && ariaLabel) {
      result['aria-label'] = ariaLabel;
    }

    // Development warning for icon-only buttons without aria-label
    if (
      process.env.NODE_ENV !== 'production' &&
      iconOnly &&
      !ariaLabel
    ) {
      console.warn(
        '[Button] Icon-only button requires an aria-label prop for accessibility. ' +
        'Without it, screen reader users cannot identify the button purpose.'
      );
    }

    return result;
  }, [loading, disabled, iconOnly, ariaLabel, renderedAs]);

  return aria;
}

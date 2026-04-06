'use client';

import { useMemo, forwardRef, useEffect, useRef } from 'react';
import type { ElementType, ReactNode } from 'react';
import type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  ButtonPosition,
  PolymorphicRef,
} from '../lib/button-types';
import { DEFAULT_VARIANT, DEFAULT_SIZE, DEFAULT_RIPPLE, DEFAULT_DEBOUNCE_MS } from '../lib/button-types';
import {
  getButtonClasses,
  rippleContainerClass,
  iconSlotClass,
  spinnerSizeMap,
  spinnerColors,
  spinnerColorsDark,
} from '../lib/button-styles';
import { useButtonInteractions, cleanupRipples } from '../hooks/use-button-interactions';
import { useButtonAria } from '../hooks/use-button-aria';
import { ButtonIcon } from './button-icon';
import { ButtonSpinner } from './button-spinner';
import { useButtonGroupContext } from './button-group';

// ── Border-radius classes for ButtonGroup positions ──────────────────────────

const positionBorderRadius: Record<ButtonPosition, string> = {
  only: 'rounded-lg',
  first: 'rounded-l-lg rounded-r-none',
  middle: 'rounded-none',
  last: 'rounded-r-lg rounded-l-none',
};

// For vertical orientation
const positionBorderRadiusVertical: Record<ButtonPosition, string> = {
  only: 'rounded-lg',
  first: 'rounded-t-lg rounded-b-none',
  middle: 'rounded-none',
  last: 'rounded-b-lg rounded-t-none',
};

// ── Href validation (development only) ───────────────────────────────────────

function validateHref(href: string | undefined, env: string) {
  if (env !== 'production' && href !== undefined) {
    const blockedProtocols = ['javascript:', 'vbscript:', 'data:'];
    const lowerHref = href.toLowerCase().trim();
    const isBlocked = blockedProtocols.some((protocol) =>
      lowerHref.startsWith(protocol)
    );
    if (isBlocked) {
      console.warn(
        '[Button] Blocked potentially unsafe href protocol. ' +
        'Only http:, https:, mailto:, tel:, and relative paths are allowed.'
      );
    }
  }
}

// ── Polymorphic Button Component ─────────────────────────────────────────────

type ButtonComponent = <T extends ElementType = 'button'>(
  props: ButtonProps<T> & {
    ref?: PolymorphicRef<T>;
    position?: ButtonPosition;
  }
) => ReactNode;

const Button = forwardRef(function ButtonInner<
  T extends ElementType = 'button',
>(
  props: ButtonProps<T> & { position?: ButtonPosition },
  ref: PolymorphicRef<T>
) {
  const {
    as,
    variant = DEFAULT_VARIANT,
    size = DEFAULT_SIZE,
    loading = false,
    loadingText,
    fullWidth = false,
    ripple = DEFAULT_RIPPLE,
    leadingIcon,
    trailingIcon,
    iconOnly = false,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    children,
    className = '',
    disabled,
    onClick,
    position,
    ...rest
  } = props;

  // Resolve the rendered element type
  const Component = (as || 'button') as ElementType;

  // Check for ButtonGroup context
  const groupContext = useButtonGroupContext();
  const effectiveVariant = variant ?? groupContext?.variant ?? DEFAULT_VARIANT;
  const effectiveSize = size ?? groupContext?.size ?? DEFAULT_SIZE;
  const effectivePosition =
    position ?? (groupContext ? 'middle' : undefined);

  // Determine state for class computation
  const state = disabled ? 'disabled' : loading ? 'loading' : 'default';

  // Compute Tailwind class string
  const computedClasses = useMemo(() => {
    const baseClasses = getButtonClasses(
      effectiveVariant,
      effectiveSize,
      state,
      fullWidth
    );

    const parts = [baseClasses, rippleContainerClass, className];

    // Apply position-based border-radius from ButtonGroup
    if (effectivePosition && groupContext) {
      const borderRadiusMap =
        groupContext.orientation === 'vertical'
          ? positionBorderRadiusVertical
          : positionBorderRadius;
      parts.push(borderRadiusMap[effectivePosition]);
    }

    return parts.join(' ');
  }, [effectiveVariant, effectiveSize, state, fullWidth, className, effectivePosition, groupContext]);

  // Interaction handlers
  const {
    onClick: handleInteraction,
    onMouseDown,
    onKeyDown,
    containerRef,
  } = useButtonInteractions({
    onClick,
    loading,
    disabled: disabled ?? false,
    ripple,
    debounceMs,
  });

  // ARIA attributes
  const renderedAs = typeof Component === 'string' ? Component : 'button';
  const ariaProps = useButtonAria({
    loading,
    disabled: disabled ?? false,
    iconOnly,
    ariaLabel: rest['aria-label'],
    renderedAs,
  });

  // Ref handling: merge forwarded ref with container ref
  const internalRef = useRef<HTMLElement | null>(null);

  const mergedRef = (node: HTMLElement | null) => {
    internalRef.current = node;
    containerRef(node);
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  // Href validation for anchor buttons
  useEffect(() => {
    if (renderedAs === 'a' && rest.href) {
      validateHref(rest.href as string | undefined, process.env.NODE_ENV);
    }
  }, [renderedAs, rest.href]);

  // Development warning for anchor without href
  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      renderedAs === 'a' &&
      !rest.href
    ) {
      console.warn(
        '[Button] Anchor button missing href prop. ' +
        'This creates an inaccessible link for screen readers.'
      );
    }
  }, [renderedAs, rest.href]);

  // Determine text content
  const textContent = loading
    ? loadingText ?? (children || 'Loading...')
    : children;

  // Spinner color (respect dark mode via inline style detection)
  const isDarkMode =
    typeof window !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  const spinnerColor = isDarkMode
    ? spinnerColorsDark[effectiveVariant]
    : spinnerColors[effectiveVariant];

  return (
    <Component
      ref={mergedRef}
      className={computedClasses}
      disabled={disabled}
      onClick={handleInteraction}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      {...ariaProps}
      {...rest}
    >
      {/* Leading icon */}
      {leadingIcon && (
        <ButtonIcon
          icon={leadingIcon}
          size={effectiveSize}
          isLoading={loading}
          spinnerColor={spinnerColor}
        />
      )}

      {/* Loading spinner (when no leading icon) */}
      {loading && !leadingIcon && (
        <span className={iconSlotClass}>
          <ButtonSpinner
            size={spinnerSizeMap[effectiveSize]}
            color={spinnerColor}
          />
        </span>
      )}

      {/* Button text */}
      {textContent && (
        <span className="truncate">{textContent}</span>
      )}

      {/* Trailing icon */}
      {trailingIcon && (
        <span className={iconSlotClass}>{trailingIcon}</span>
      )}
    </Component>
  );
}) as ButtonComponent;

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };

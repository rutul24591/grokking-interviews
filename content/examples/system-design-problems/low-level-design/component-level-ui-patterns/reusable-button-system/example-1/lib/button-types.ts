import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from 'react';

// ── Variant, Size, and State unions ──────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'link';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonState =
  | 'default'
  | 'hover'
  | 'active'
  | 'focus'
  | 'disabled'
  | 'loading';

// ── Polymorphic prop resolution ──────────────────────────────────────────────

/**
 * Extracts the props for a given element type, merging them with the base
 * Button-specific props. When `as` is provided, the resulting props include
 * the native props of the rendered element (e.g., `href` for anchors).
 */
export type ButtonProps<T extends ElementType = 'button'> = {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  ripple?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  iconOnly?: boolean;
  debounceMs?: number;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'onClick'> & {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  };

// ── Polymorphic ref typing ───────────────────────────────────────────────────

/**
 * Correctly types the ref for a polymorphic component. When `as` is provided,
 * the ref type matches the rendered element. Otherwise it defaults to
 * `HTMLButtonElement`.
 */
export type PolymorphicRef<T extends ElementType> =
  T extends 'button'
    ? React.RefObject<HTMLButtonElement>
    : T extends 'a'
      ? React.RefObject<HTMLAnchorElement>
      : React.RefObject<HTMLElement>;

// ── ButtonGroup types ────────────────────────────────────────────────────────

export type ButtonGroupOrientation = 'horizontal' | 'vertical';

export type ButtonPosition = 'first' | 'middle' | 'last' | 'only';

export interface ButtonGroupContextValue {
  orientation: ButtonGroupOrientation;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// ── Spinner types ────────────────────────────────────────────────────────────

export interface ButtonSpinnerProps {
  size?: number;
  color?: string;
  determinate?: boolean;
  progress?: number; // 0-100, only used when determinate=true
}

// ── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_VARIANT: ButtonVariant = 'primary';

export const DEFAULT_SIZE: ButtonSize = 'md';

export const DEFAULT_RIPPLE = false;

export const DEFAULT_DEBOUNCE_MS = 0; // no debounce by default

// ── Button Icon types ────────────────────────────────────────────────────────

export interface ButtonIconProps {
  icon: ReactNode;
  size: ButtonSize;
  isLoading: boolean;
  spinnerColor?: string;
}

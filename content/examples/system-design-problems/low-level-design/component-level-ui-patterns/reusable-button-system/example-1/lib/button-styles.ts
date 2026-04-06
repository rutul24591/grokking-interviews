import type { ButtonSize, ButtonVariant } from './button-types';

// ── Variant style maps ──────────────────────────────────────────────────────
// Each variant maps to Tailwind class strings for every interactive state.
// Classes are composed at runtime: base + state-specific overrides.

interface VariantClasses {
  base: string;
  hover: string;
  active: string;
  focus: string;
  disabled: string;
  loading: string;
}

export const variantStyles: Record<ButtonVariant, VariantClasses> = {
  primary: {
    base: 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white shadow-sm transition-colors duration-150 dark:bg-blue-700',
    hover: 'hover:bg-blue-700 dark:hover:bg-blue-600',
    active: 'active:bg-blue-800 dark:active:bg-blue-500',
    focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    loading: 'opacity-80 cursor-wait',
  },
  secondary: {
    base: 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors duration-150 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200',
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
    active: 'active:bg-gray-100 dark:active:bg-gray-600',
    focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    loading: 'opacity-80 cursor-wait',
  },
  tertiary: {
    base: 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg border border-transparent bg-transparent text-gray-700 transition-colors duration-150 dark:text-gray-200',
    hover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
    active: 'active:bg-gray-200 dark:active:bg-gray-600',
    focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    loading: 'opacity-80 cursor-wait',
  },
  danger: {
    base: 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg border border-transparent bg-red-600 text-white shadow-sm transition-colors duration-150 dark:bg-red-700',
    hover: 'hover:bg-red-700 dark:hover:bg-red-600',
    active: 'active:bg-red-800 dark:active:bg-red-500',
    focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    loading: 'opacity-80 cursor-wait',
  },
  link: {
    base: 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg border border-transparent bg-transparent text-blue-600 underline underline-offset-2 transition-colors duration-150 dark:text-blue-400 shadow-none',
    hover: 'hover:text-blue-800 dark:hover:text-blue-300 hover:no-underline',
    active: 'active:text-blue-900 dark:active:text-blue-200',
    focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none no-underline',
    loading: 'opacity-80 cursor-wait',
  },
};

// ── Size style maps ─────────────────────────────────────────────────────────

interface SizeClasses {
  padding: string;
  fontSize: string;
  minHeight: string;
  iconSize: string;
  gap: string;
}

export const sizeStyles: Record<ButtonSize, SizeClasses> = {
  xs: {
    padding: 'px-2 py-1',
    fontSize: 'text-xs',
    minHeight: 'min-h-[24px]',
    iconSize: 'h-3 w-3',
    gap: 'gap-1',
  },
  sm: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-sm',
    minHeight: 'min-h-[32px]',
    iconSize: 'h-3.5 w-3.5',
    gap: 'gap-1.5',
  },
  md: {
    padding: 'px-4 py-2',
    fontSize: 'text-sm',
    minHeight: 'min-h-[40px]',
    iconSize: 'h-4 w-4',
    gap: 'gap-2',
  },
  lg: {
    padding: 'px-5 py-2.5',
    fontSize: 'text-base',
    minHeight: 'min-h-[48px]',
    iconSize: 'h-5 w-5',
    gap: 'gap-2',
  },
  xl: {
    padding: 'px-6 py-3',
    fontSize: 'text-lg',
    minHeight: 'min-h-[56px]',
    iconSize: 'h-5 w-5',
    gap: 'gap-2.5',
  },
};

// ── Full-width modifier ──────────────────────────────────────────────────────

export const fullWidthClass = 'w-full';

// ── Ripple container class ───────────────────────────────────────────────────

export const rippleContainerClass =
  'relative overflow-hidden';

// ── Icon slot class ──────────────────────────────────────────────────────────

export const iconSlotClass = 'flex-shrink-0';

// ── Helper: compose variant + size + state classes ───────────────────────────

export function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  state: 'disabled' | 'loading' | 'default',
  fullWidth: boolean
): string {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  const parts = [
    v.base,
    v.hover,
    v.active,
    v.focus,
    s.padding,
    s.fontSize,
    s.minHeight,
    s.gap,
  ];

  if (state === 'disabled') {
    parts.push(v.disabled);
  } else if (state === 'loading') {
    parts.push(v.loading);
  }

  if (fullWidth) {
    parts.push(fullWidthClass);
  }

  return parts.join(' ');
}

// ── Spinner colors per variant ───────────────────────────────────────────────

export const spinnerColors: Record<ButtonVariant, string> = {
  primary: '#ffffff',
  secondary: '#374151',
  tertiary: '#374151',
  danger: '#ffffff',
  link: '#2563eb',
};

export const spinnerColorsDark: Record<ButtonVariant, string> = {
  primary: '#ffffff',
  secondary: '#e5e7eb',
  tertiary: '#e5e7eb',
  danger: '#ffffff',
  link: '#60a5fa',
};

// ── Spinner size per button size ─────────────────────────────────────────────

export const spinnerSizeMap: Record<ButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

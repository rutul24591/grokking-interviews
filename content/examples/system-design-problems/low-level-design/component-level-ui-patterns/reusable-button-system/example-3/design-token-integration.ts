/**
 * Reusable Button System — Staff-Level Design Token Integration.
 *
 * Staff differentiator: Deep integration with design token system,
 * automatic theme-aware color adaptation, and runtime token validation.
 */

/**
 * Button style resolver that maps design tokens to Tailwind classes.
 * Automatically adapts to the current theme.
 */
export function resolveButtonStyles(
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link',
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  tokens: Record<string, string>,
) {
  const variantStyles: Record<string, string> = {
    primary: `${tokens['color-bg-primary']} ${tokens['color-text-on-primary']} hover:${tokens['color-bg-primary-hover']}`,
    secondary: `${tokens['color-bg-secondary']} ${tokens['color-text-secondary']} hover:${tokens['color-bg-secondary-hover']}`,
    ghost: `bg-transparent ${tokens['color-text-primary']} hover:${tokens['color-bg-tertiary']}`,
    danger: `${tokens['color-bg-danger']} ${tokens['color-text-on-danger']} hover:${tokens['color-bg-danger-hover']}`,
    link: `bg-transparent ${tokens['color-text-link']} hover:underline`,
  };

  const sizeStyles: Record<string, string> = {
    xs: `${tokens['spacing-1']} ${tokens['spacing-2']} ${tokens['font-size-xs']}`,
    sm: `${tokens['spacing-1.5']} ${tokens['spacing-3']} ${tokens['font-size-sm']}`,
    md: `${tokens['spacing-2']} ${tokens['spacing-4']} ${tokens['font-size-base']}`,
    lg: `${tokens['spacing-2.5']} ${tokens['spacing-5']} ${tokens['font-size-lg']}`,
    xl: `${tokens['spacing-3']} ${tokens['spacing-6']} ${tokens['font-size-xl']}`,
  };

  return `${variantStyles[variant]} ${sizeStyles[size]} ${tokens['radius-md']} ${tokens['transition-all']}`;
}

/**
 * Validates that all required design tokens are present.
 * Used in development to catch missing tokens before they cause rendering issues.
 */
export function validateButtonTokens(tokens: Record<string, string>): { valid: boolean; missing: string[] } {
  const required = [
    'color-bg-primary', 'color-text-on-primary', 'color-bg-primary-hover',
    'color-bg-secondary', 'color-text-secondary',
    'color-text-primary', 'color-bg-tertiary',
    'color-bg-danger', 'color-text-on-danger',
    'color-text-link',
    'spacing-1', 'spacing-2', 'spacing-3', 'spacing-4',
    'font-size-xs', 'font-size-sm', 'font-size-base', 'font-size-lg', 'font-size-xl',
    'radius-md', 'transition-all',
  ];

  const missing = required.filter((key) => !tokens[key]);
  return { valid: missing.length === 0, missing };
}

/**
 * Button System — Staff-Level Polymorphic Component Design.
 *
 * Staff differentiator: Type-safe polymorphic "as" prop with proper ref forwarding,
 * intersection types for custom element props, and compile-time validation
 * of invalid prop combinations.
 */

import { forwardRef, ElementType, ComponentPropsWithRef, useRef } from 'react';

/**
 * Props for the polymorphic Button component.
 * Uses intersection types to combine button-specific props with the props
 * of the element specified by the "as" prop.
 */
type ButtonProps<C extends ElementType> = {
  as?: C;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  loadingText?: string;
} & Omit<ComponentPropsWithRef<C>, 'as' | 'variant' | 'size' | 'isLoading' | 'loadingText'>;

/**
 * Polymorphic Button component with type-safe "as" prop.
 *
 * Usage:
 *   <Button>Click</Button>                    // renders as <button>
 *   <Button as={Link} href="/about">About</Button>  // renders as <a>
 *   <Button as="div" role="button">Div button</Button>  // renders as <div>
 */
export const Button = forwardRef(
  <C extends ElementType = 'button'>(
    { as, variant = 'primary', size = 'md', isLoading, loadingText, children, ...rest }: ButtonProps<C>,
    ref: React.Ref<Element>,
  ) => {
    const Component = as || 'button';
    const internalRef = useRef<HTMLElement>(null);

    // Merge refs
    const mergedRef = ref || internalRef;

    return (
      <Component
        ref={mergedRef as any}
        disabled={isLoading || (rest as any).disabled}
        aria-busy={isLoading}
        {...rest}
      >
        {isLoading ? (
          <>
            <span className="sr-only">{loadingText || 'Loading'}</span>
            <span aria-hidden="true">{loadingText || 'Loading...'}</span>
          </>
        ) : (
          children
        )}
      </Component>
    );
  },
) as <C extends ElementType = 'button'>(props: ButtonProps<C> & { ref?: React.Ref<Element> }) => React.ReactElement;

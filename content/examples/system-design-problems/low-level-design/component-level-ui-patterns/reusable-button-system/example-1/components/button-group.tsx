'use client';

import { createContext, useContext, Children, cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type {
  ButtonGroupOrientation,
  ButtonGroupContextValue,
  ButtonPosition,
  ButtonVariant,
  ButtonSize,
} from '../lib/button-types';

// ── Context ──────────────────────────────────────────────────────────────────

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

export function useButtonGroupContext(): ButtonGroupContextValue | null {
  return useContext(ButtonGroupContext);
}

// ── Props ────────────────────────────────────────────────────────────────────

interface ButtonGroupProps {
  children: ReactNode;
  orientation?: ButtonGroupOrientation;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

// ── Helper: compute position for each child ──────────────────────────────────

function computePositions(childCount: number): ButtonPosition[] {
  if (childCount === 0) return [];
  if (childCount === 1) return ['only'];
  return [
    'first',
    ...Array.from({ length: childCount - 2 }, () => 'middle' as ButtonPosition),
    'last',
  ];
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * ButtonGroup — Compound component for grouped buttons.
 *
 * Renders a flex container with shared borders. Clones each child button,
 * injecting a `position` prop (`first`, `middle`, `last`, or `only`) used
 * for border-radius and shared border styling. The context also propagates
 * the parent's variant and size as defaults for children.
 *
 * Usage:
 *   <ButtonGroup orientation="horizontal">
 *     <Button>Left</Button>
 *     <Button>Middle</Button>
 *     <Button>Right</Button>
 *   </ButtonGroup>
 */
export function ButtonGroup({
  children,
  orientation = 'horizontal',
  variant,
  size,
  className = '',
}: ButtonGroupProps) {
  const validChildren = Children.toArray(children).filter(
    (child) => isValidElement(child)
  ) as ReactElement[];

  const positions = computePositions(validChildren.length);

  const contextValue: ButtonGroupContextValue = {
    orientation,
    variant,
    size,
  };

  const clonedChildren = validChildren.map((child, index) =>
    cloneElement(child, {
      ...child.props,
      position: positions[index],
      // Inherit variant and size from group if not explicitly set on child
      variant: (child.props as { variant?: ButtonVariant }).variant ?? variant,
      size: (child.props as { ButtonSize?: ButtonSize }).size ?? size,
    })
  );

  const baseClasses = 'inline-flex';
  const orientationClass = orientation === 'vertical' ? 'flex-col' : 'flex-row';

  // Shared border classes
  const borderClass =
    orientation === 'vertical'
      ? '[&>button+button]:border-t [&>button+button]:border-t-gray-300 dark:[&>button+button]:border-t-gray-600'
      : '[&>button+button]:border-l [&>button+button]:border-l-gray-300 dark:[&>button+button]:border-l-gray-600';

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div
        className={`${baseClasses} ${orientationClass} ${borderClass} ${className}`}
        role="group"
        aria-orientation={orientation}
      >
        {clonedChildren}
      </div>
    </ButtonGroupContext.Provider>
  );
}

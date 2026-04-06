/**
 * Accordion — Staff-Level Performance Optimization for Large Accordions.
 *
 * Staff differentiator: Content virtualization for accordions with many items,
 * deferred rendering (only render content when expanded), and CSS containment
 * for improved rendering performance.
 */

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Hook that defers content rendering until the accordion item is expanded.
 * Prevents rendering all accordion content upfront, improving initial load time.
 */
export function useDeferredAccordionContent(isExpanded: boolean, children: React.ReactNode) {
  const [hasBeenExpanded, setHasBeenExpanded] = useState(isExpanded);

  useEffect(() => {
    if (isExpanded) setHasBeenExpanded(true);
  }, [isExpanded]);

  // Only render content if it has been expanded at least once
  return hasBeenExpanded ? children : null;
}

/**
 * Hook that measures accordion content height for smooth CSS transitions.
 * Uses ResizeObserver to detect content changes and update the max-height.
 */
export function useAccordionHeight(contentRef: React.RefObject<HTMLElement | null>, isExpanded: boolean) {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, [contentRef]);

  return {
    style: isExpanded ? { maxHeight: `${height}px` } : { maxHeight: '0px' },
  };
}

/**
 * CSS containment for accordion items — improves rendering performance
 * by isolating layout, paint, and style calculations per item.
 */
export const accordionContainmentStyles = {
  contain: 'layout style paint',
  contentVisibility: 'auto' as const,
  containIntrinsicSize: '0 200px', // Estimated size for off-screen rendering
};

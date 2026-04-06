/**
 * Ripple Performance — GPU-composited ripple animation with concurrent ripple cap.
 *
 * Interview edge case: User clicks button rapidly, creating 10+ ripples simultaneously.
 * Each ripple is a DOM element with CSS animation. Too many concurrent ripples cause
 * jank. Solution: cap concurrent ripples at 5, use transform + opacity only
 * (GPU-composited), clean up after animation ends.
 */

import { useRef, useCallback } from 'react';

const MAX_CONCURRENT_RIPPLES = 5;

interface Ripple {
  id: string;
  x: number;
  y: number;
  size: number;
  timestamp: number;
}

/**
 * Manages ripple animations with performance constraints.
 */
export function useRippleAnimation() {
  const ripplesRef = useRef<Ripple[]>([]);
  const containerRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Creates a ripple at the click position. Capped at MAX_CONCURRENT_RIPPLES.
   */
  const createRipple = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;

    // Remove oldest ripples if at capacity
    if (ripplesRef.current.length >= MAX_CONCURRENT_RIPPLES) {
      ripplesRef.current = ripplesRef.current.slice(-MAX_CONCURRENT_RIPPLES + 1);
    }

    const ripple: Ripple = {
      id: `ripple_${Date.now()}_${Math.random()}`,
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
      size,
      timestamp: Date.now(),
    };

    ripplesRef.current.push(ripple);

    // Clean up old ripples after animation completes
    setTimeout(() => {
      ripplesRef.current = ripplesRef.current.filter((r) => r.id !== ripple.id);
    }, 600); // Match animation duration
  }, []);

  return { containerRef, ripples: ripplesRef.current, createRipple };
}

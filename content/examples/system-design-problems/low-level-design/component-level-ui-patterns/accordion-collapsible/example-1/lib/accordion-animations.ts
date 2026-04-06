// Accordion animation configuration and utilities

export interface AnimationConfig {
  duration: number;
  easing: string;
  reducedMotion: boolean;
}

/**
 * Default animation configuration for accordion panels.
 * Uses CSS grid-template-rows transition from 0fr to 1fr for smooth height animation
 * without requiring JavaScript height measurement.
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  duration: 200,
  easing: 'ease-out',
  reducedMotion: false,
};

/**
 * Detects if the user has requested reduced motion via OS preference.
 * Uses matchMedia for reactive detection.
 * Returns false during SSR (typeof window check).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Creates a MediaQueryList listener for reduced-motion changes.
 * Returns a cleanup function to remove the listener.
 */
export function onReducedMotionChange(callback: (matches: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  try {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent | MediaQueryListEventCompat) => {
      callback(e.matches);
    };
    mq.addEventListener('change', handler as EventListener);
    return () => mq.removeEventListener('change', handler as EventListener);
  } catch {
    return () => {};
  }
}

// Compatibility type for older browsers
interface MediaQueryListEventCompat {
  matches: boolean;
  media: string;
  onchange: null;
  addListener: (listener: (e: MediaQueryListEventCompat) => void) => void;
  removeListener: (listener: (e: MediaQueryListEventCompat) => void) => void;
}

/**
 * Generates the CSS transition string for accordion panel animation.
 * Falls back to no transition if reduced motion is preferred.
 */
export function getAnimationTransition(config?: Partial<AnimationConfig>): string {
  const { duration, easing, reducedMotion } = { ...DEFAULT_ANIMATION_CONFIG, ...config };
  if (reducedMotion || prefersReducedMotion()) return 'none';
  return `grid-template-rows ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
}

/**
 * Generates CSS class names for accordion panel animation states.
 * Returns the appropriate class based on open/closed state.
 */
export function getPanelClass(
  isOpen: boolean,
  animated: boolean = true,
  config?: Partial<AnimationConfig>
): string {
  if (!animated) return isOpen ? '' : 'hidden';

  const { reducedMotion } = { ...DEFAULT_ANIMATION_CONFIG, ...config };
  const useAnimation = !reducedMotion && !prefersReducedMotion();

  if (!useAnimation) {
    return isOpen ? '' : 'hidden';
  }

  return isOpen
    ? 'grid-rows-[1fr] opacity-100'
    : 'grid-rows-[0fr] opacity-0';
}

/**
 * Creates a spring-like animation config with overshoot.
 * Useful for more dynamic accordion animations.
 */
export function getSpringConfig(mass: number = 1): AnimationConfig {
  // Simplified spring: duration scales with mass
  const duration = Math.round(200 * Math.sqrt(mass));
  return {
    duration,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    reducedMotion: prefersReducedMotion(),
  };
}

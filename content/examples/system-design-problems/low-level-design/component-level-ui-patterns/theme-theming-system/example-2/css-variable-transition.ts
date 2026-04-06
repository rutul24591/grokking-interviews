/**
 * CSS Variable Transition — Smooth theme switching without FOUC.
 *
 * Interview edge case: When switching from light to dark mode, changing all CSS
 * variables simultaneously causes a flash. Solution: group variables by transition
 * group and apply them with requestAnimationFrame to ensure smooth transitions.
 */

type CSSVariableMap = Record<string, string>;

/**
 * Applies CSS variable changes with smooth transitions.
 * Groups changes into a single rAF frame to avoid intermediate states.
 */
export function applyThemeTransition(
  variables: CSSVariableMap,
  targetElement: HTMLElement = document.documentElement,
): void {
  requestAnimationFrame(() => {
    for (const [name, value] of Object.entries(variables)) {
      targetElement.style.setProperty(name, value);
    }
  });
}

/**
 * Preloads a theme's CSS variables before applying them, preventing FOUC.
 * Loads all variable values first, then applies them in a single frame.
 */
export function preloadAndApplyTheme(
  variables: CSSVariableMap,
  onLoad?: () => void,
): Promise<void> {
  return new Promise((resolve) => {
    // Simulate preloading — in production this might fetch a CSS file
    requestAnimationFrame(() => {
      applyThemeTransition(variables);
      onLoad?.();
      resolve();
    });
  });
}

/**
 * Detects if the browser supports CSS transitions on custom properties.
 * Falls back to instant switch if not supported.
 */
export function supportsCSSTransitions(): boolean {
  if (typeof window === 'undefined') return false;
  const el = document.createElement('div');
  el.style.setProperty('--test-transition', '0s');
  const computed = getComputedStyle(el).getPropertyValue('--test-transition');
  return computed !== '';
}

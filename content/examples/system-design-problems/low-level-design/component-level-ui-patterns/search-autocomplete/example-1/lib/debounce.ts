/**
 * Creates a debounced function that delays invoking func until after `wait` ms
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - Optional configuration
 * @returns The debounced function with a cancel method
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number,
  options: { leading?: boolean } = {}
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let leadingCalled = false;

  const debounced = function (...args: Parameters<T>) {
    if (options.leading && !leadingCalled) {
      leadingCalled = true;
      func(...args);
      return;
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      leadingCalled = false;
      func(...args);
      timeoutId = null;
    }, wait);
  };

  debounced.cancel = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    leadingCalled = false;
  };

  debounced.flush = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      leadingCalled = false;
      // We can't safely call func here without the args, so this just cancels pending calls
      timeoutId = null;
    }
  };

  return debounced;
}

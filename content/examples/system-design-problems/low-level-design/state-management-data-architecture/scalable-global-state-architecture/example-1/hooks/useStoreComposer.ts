import { useMemo, useRef } from 'react';

/**
 * Hook that composes data from multiple stores at query time.
 * Accepts a function that receives store selectors and returns a merged result.
 * Uses useMemo to prevent recalculation unless source data changes.
 *
 * @example
 * const data = useStoreComposer((select) => ({
 *   user: select(useUserStore, (s) => s.profile),
 *   widgets: select(useDashboardStore, (s) => s.widgets),
 * }));
 */
export function useStoreComposer<T>(
  composer: (selectors: StoreSelector) => T,
): T {
  // Track which stores we've subscribed to
  const subscriptions = useRef<Map<string, any>>(new Map());

  const selector = useMemo(() => {
    // Create a proxy that tracks which stores are accessed
    const handlers: StoreSelector = (store: any, selectorFn: (state: any) => any) => {
      const storeName = store.name || 'unknown';
      const result = store(selectorFn);
      subscriptions.current.set(storeName, result);
      return result;
    };

    return composer(handlers);
  }, [composer]);

  return selector;
}

type StoreSelector = (store: any, selectorFn: (state: any) => any) => any;

/**
 * Simplified version: manually compose from specific stores.
 * This is the production approach - explicit store references for clarity.
 *
 * @example
 * const { user, widgets } = useManualComposer({
 *   user: useUserStore.select.profile,
 *   widgets: useDashboardStore.select.widgets,
 * });
 */
export function useManualComposer<T extends Record<string, any>>(selectors: T): T {
  return useMemo(() => {
    const result: Record<string, any> = {};
    for (const [key, selector] of Object.entries(selectors)) {
      result[key] = selector();
    }
    return result as T;
  }, Object.values(selectors));
}

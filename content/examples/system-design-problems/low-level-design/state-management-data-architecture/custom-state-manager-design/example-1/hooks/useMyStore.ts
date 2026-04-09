import { useSyncExternalStore } from 'react';
import type { Store, Selector } from '../lib/store-core';

/**
 * React hook for subscribing to a custom store.
 * Uses useSyncExternalStore for React 18+ concurrent-safe subscriptions.
 *
 * @param store - Store instance from createStore
 * @param selector - Function to extract desired state slice
 * @returns The selected state value
 *
 * @example
 * const count = useMyStore(store, (state) => state.count);
 * const user = useMyStore(store, (state) => state.user);
 */
export function useMyStore<T, S>(
  store: Store<T>,
  selector: Selector<T, S>,
): S {
  // Subscribe to the store and return an unsubscribe function
  const subscribe = (onStoreChange: () => void) => {
    return store.subscribe(selector, () => {
      onStoreChange();
    });
  };

  // Get current state synchronously
  const getSnapshot = () => {
    return selector(store.getState());
  };

  // Get server snapshot (always same as client for SSR compatibility)
  const getServerSnapshot = () => {
    return selector(store.getState());
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

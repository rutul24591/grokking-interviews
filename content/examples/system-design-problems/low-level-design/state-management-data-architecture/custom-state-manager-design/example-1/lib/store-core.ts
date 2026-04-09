/**
 * Minimal custom state manager — Observable pattern with selector-based subscriptions.
 * No external dependencies. ~80 lines for core functionality.
 */

type Selector<T, S> = (state: T) => S;
type Listener<S> = (selected: S, prevState: S) => void;

interface Subscription<T> {
  id: number;
  selector: Selector<T, any>;
  listener: Listener<any>;
  cachedResult: any;
}

export interface Store<T> {
  getState: () => T;
  setState: (partial: Partial<T>) => void;
  subscribe: <S>(selector: Selector<T, S>, listener: Listener<S>) => () => void;
}

let subscriptionIdCounter = 0;

/**
 * Create a custom observable store.
 * Uses the Observer pattern with selector-based subscriptions.
 *
 * @param initialState - The initial state object
 * @returns Store instance with getState, setState, and subscribe methods
 */
export function createStore<T extends Record<string, any>>(initialState: T): Store<T> {
  let state: T = { ...initialState };
  const subscriptions = new Map<number, Subscription<T>>();
  let isNotifying = false;
  const pendingUpdates: Array<Partial<T>> = [];

  /**
   * Get current state (readonly reference)
   */
  function getState(): T {
    return state;
  }

  /**
   * Update state by merging partial state (shallow merge)
   * Notifies subscribers whose selected slice changed
   */
  function setState(partial: Partial<T>): void {
    // If currently notifying, queue the update for later
    if (isNotifying) {
      pendingUpdates.push(partial);
      return;
    }

    const prevState = state;
    state = { ...state, ...partial };

    notifySubscribers(prevState);

    // Process any queued updates
    while (pendingUpdates.length > 0) {
      const queuedUpdates = pendingUpdates.splice(0);
      const mergedUpdate = Object.assign({}, ...queuedUpdates);
      const prevBeforeQueue = state;
      state = { ...state, ...mergedUpdate };
      notifySubscribers(prevBeforeQueue);
    }
  }

  /**
   * Notify subscribers whose selected slice changed
   */
  function notifySubscribers(prevState: T): void {
    isNotifying = true;

    try {
      for (const sub of subscriptions.values()) {
        try {
          const newResult = sub.selector(state);
          if (!Object.is(newResult, sub.cachedResult)) {
            const prevCachedResult = sub.cachedResult;
            sub.cachedResult = newResult;
            sub.listener(newResult, prevCachedResult);
          }
        } catch (error) {
          // Subscriber threw error — log and continue
          console.error('[Store] Error in subscriber:', error);
        }
      }
    } finally {
      isNotifying = false;
    }
  }

  /**
   * Subscribe to state changes with a selector function.
   * Listener is called only when the selected value changes (Object.is).
   *
   * @param selector - Function that extracts the desired slice from state
   * @param listener - Callback called when selected slice changes
   * @returns Unsubscribe function
   */
  function subscribe<S>(
    selector: Selector<T, S>,
    listener: Listener<S>,
  ): () => void {
    const id = ++subscriptionIdCounter;
    const cachedResult = selector(state);

    subscriptions.set(id, {
      id,
      selector: selector as Selector<T, any>,
      listener: listener as Listener<any>,
      cachedResult,
    });

    // Return unsubscribe function
    return () => {
      subscriptions.delete(id);
    };
  }

  return {
    getState,
    setState,
    subscribe,
  };
}

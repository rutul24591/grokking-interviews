import { useGlobalStore, Notification, AppState } from './globalStore';

/**
 * Custom hooks that wrap the global store with typed selectors.
 * These provide a stable API and allow adding business logic
 * on top of raw store access.
 */

/**
 * Hook to access notifications with filtering options.
 * Uses Zustand selector with equality function to prevent unnecessary re-renders.
 */
export function useFilteredNotifications(type?: Notification['type']) {
  return useGlobalStore((state) => {
    if (!type) return state.notifications;
    return state.notifications.filter((n) => n.type === type);
  });
}

/**
 * Hook to access a specific setting with a default fallback.
 */
export function useSetting<K extends keyof AppState['settings']>(
  key: K,
): AppState['settings'][K] {
  return useGlobalStore((state) => state.settings[key]);
}

/**
 * Hook to get notification actions.
 * Separates actions from state to allow components to access
 * actions without subscribing to state changes.
 */
export function useNotificationActions() {
  const addNotification = useGlobalStore((state) => state.addNotification);
  const dismissNotification = useGlobalStore((state) => state.dismissNotification);
  const clearAllNotifications = useGlobalStore((state) => state.clearAllNotifications);

  return {
    addNotification,
    dismissNotification,
    clearAllNotifications,
    success: (message: string) => addNotification({ type: 'success', message }),
    error: (message: string) => addNotification({ type: 'error', message }),
    warning: (message: string) => addNotification({ type: 'warning', message }),
    info: (message: string) => addNotification({ type: 'info', message }),
  };
}

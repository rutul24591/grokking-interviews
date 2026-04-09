import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

interface AppState {
  notifications: Notification[];
  settings: {
    autoSave: boolean;
    notificationsEnabled: boolean;
  };
}

interface AppActions {
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
}

/**
 * Global application store using Zustand.
 * This store manages state that can be accessed from anywhere in the application:
 * - Notifications: can be triggered by any component
 * - App settings: consumed by multiple unrelated features
 *
 * Zustand's selector-based subscriptions ensure components only re-render
 * when their specific slice of state changes.
 */
export const useGlobalStore = create<AppState & AppActions>((set) => ({
  // Initial state
  notifications: [],
  settings: {
    autoSave: true,
    notificationsEnabled: true,
  },

  // Actions
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          timestamp: Date.now(),
        },
      ],
    })),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAllNotifications: () =>
    set({ notifications: [] }),

  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),
}));

// Selector hooks for common state slices
export const useNotifications = () => useGlobalStore((state) => state.notifications);
export const useSettings = () => useGlobalStore((state) => state.settings);

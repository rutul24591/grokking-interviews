import { create } from 'zustand';
import { eventBus } from '../lib/event-bus';

export interface Widget {
  id: string;
  type: 'chart' | 'table' | 'stat' | 'text';
  title: string;
  position: { x: number; y: number };
  size: { w: number; h: number };
  isVisible: boolean;
}

interface DashboardState {
  widgets: Widget[];
  layout: 'grid' | 'list';
  refreshInterval: number;
  lastRefreshed: number | null;
  isRefreshing: boolean;
}

interface DashboardActions {
  addWidget: (widget: Widget) => void;
  removeWidget: (widgetId: string) => void;
  updateWidgetPosition: (widgetId: string, position: { x: number; y: number }) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  setLayout: (layout: 'grid' | 'list') => void;
  refresh: () => Promise<void>;
  handleUserUpdated: (event: { userId: string; displayName: string }) => void;
}

/**
 * DashboardStore manages dashboard widgets and layout.
 * Listens to 'user:updated' events to refresh cached display names.
 */
export const useDashboardStore = create<DashboardState & DashboardActions>(
  (set, get) => ({
    // Initial state
    widgets: [],
    layout: 'grid',
    refreshInterval: 30000,
    lastRefreshed: null,
    isRefreshing: false,
  })
);

// Register event listeners when the module loads
eventBus.on('user:updated', (event) => {
  const store = useDashboardStore.getState();
  store.handleUserUpdated(event as any);
});

// Extend store with actions
useDashboardStore.setState({
  addWidget: (widget) =>
    useDashboardStore.setState((state) => ({
      widgets: [...state.widgets, widget],
    })),

  removeWidget: (widgetId) =>
    useDashboardStore.setState((state) => ({
      widgets: state.widgets.filter((w) => w.id !== widgetId),
    })),

  updateWidgetPosition: (widgetId, position) =>
    useDashboardStore.setState((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === widgetId ? { ...w, position } : w
      ),
    })),

  toggleWidgetVisibility: (widgetId) =>
    useDashboardStore.setState((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === widgetId ? { ...w, isVisible: !w.isVisible } : w
      ),
    })),

  setLayout: (layout) =>
    useDashboardStore.setState({ layout }),

  refresh: async () => {
    useDashboardStore.setState({ isRefreshing: true });
    // Simulate fetching fresh data
    await new Promise((resolve) => setTimeout(resolve, 500));
    useDashboardStore.setState({
      isRefreshing: false,
      lastRefreshed: Date.now(),
    });
  },

  handleUserUpdated: ({ displayName }) => {
    // Update any cached user display data in widgets
    // This is a simplified example
    console.log(`Dashboard refreshing cached data for user: ${displayName}`);
  },
});

// Selector hooks
export const useWidgets = () => useDashboardStore((state) => state.widgets);
export const useVisibleWidgets = () =>
  useDashboardStore((state) => state.widgets.filter((w) => w.isVisible));
export const useDashboardLayout = () => useDashboardStore((state) => state.layout);
export const useIsRefreshing = () => useDashboardStore((state) => state.isRefreshing);

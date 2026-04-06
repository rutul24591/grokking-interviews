/**
 * Dashboard Builder — Staff-Level Widget Communication Pattern.
 *
 * Staff differentiator: Event bus for inter-widget communication, cross-filter
 * support (clicking a chart filters data in other widgets), and shared data
 * context for widgets using the same data source.
 */

export type WidgetEvent =
  | { type: 'filter'; widgetId: string; filter: Record<string, unknown> }
  | { type: 'drilldown'; widgetId: string; dataPoint: Record<string, unknown> }
  | { type: 'refresh'; widgetId: string }
  | { type: 'data-loaded'; widgetId: string; dataSource: string };

/**
 * Event bus for inter-widget communication.
 * Supports filtering, drilldown, and cross-widget data synchronization.
 */
export class DashboardEventBus {
  private listeners: Map<string, Set<(event: WidgetEvent) => void>> = new Map();

  /**
   * Subscribes to events of a specific type.
   */
  on(eventType: WidgetEvent['type'], handler: (event: WidgetEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler);

    return () => this.listeners.get(eventType)?.delete(handler);
  }

  /**
   * Emits an event to all listeners.
   */
  emit(event: WidgetEvent): void {
    const handlers = this.listeners.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (err) {
          console.error(`Error handling event "${event.type}":`, err);
        }
      }
    }
  }

  /**
   * Creates a cross-filter: when widget A is filtered, widget B is automatically filtered.
   */
  setupCrossFilter(sourceWidgetId: string, targetWidgetId: string, fieldMapping: Record<string, string>): () => void {
    return this.on('filter', (event) => {
      if (event.widgetId === sourceWidgetId) {
        const mappedFilter: Record<string, unknown> = {};
        for (const [sourceField, targetField] of Object.entries(fieldMapping)) {
          if (event.filter[sourceField] !== undefined) {
            mappedFilter[targetField] = event.filter[sourceField];
          }
        }
        this.emit({ type: 'filter', widgetId: targetWidgetId, filter: mappedFilter });
      }
    });
  }
}

// Typed event bus for cross-store communication
// Stores emit events through this bus instead of importing each other directly

type EventHandler = (payload: unknown) => void;

interface EventSubscription {
  eventName: string;
  handler: EventHandler;
}

// Event type definitions for type safety
export interface AppEvents {
  'user:ready': { userId: string };
  'user:updated': { userId: string; displayName: string; avatar: string | null };
  'user:preferencesUpdated': { theme?: 'light' | 'dark'; emailNotifications?: boolean };
  'dashboard:refresh': { widgetIds?: string[] };
  'dashboard:layoutChanged': { layout: 'grid' | 'list' };
  'analytics:aggregate': { metric: string; value: number };
  'core:initialized': { timestamp: number };
}

export type EventName = keyof AppEvents;
export type EventPayload<T extends EventName> = AppEvents[T];

class EventBus {
  private subscribers: Map<EventName, Set<EventHandler>> = new Map();
  private emitCount: Map<string, number> = new Map();
  private lastReset: number = Date.now();
  private readonly MAX_EMITS_PER_SECOND = 50;

  /**
   * Subscribe to an event
   */
  on<T extends EventName>(eventName: T, handler: EventHandler): void {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, new Set());
    }
    this.subscribers.get(eventName)!.add(handler);
  }

  /**
   * Unsubscribe from an event
   */
  off<T extends EventName>(eventName: T, handler: EventHandler): void {
    this.subscribers.get(eventName)?.delete(handler);
  }

  /**
   * Emit an event to all subscribers
   * Rate limited to 50 events per second per event type
   */
  emit<T extends EventName>(eventName: T, payload: EventPayload<T>): void {
    // Rate limiting check
    const now = Date.now();
    if (now - this.lastReset > 1000) {
      this.emitCount.clear();
      this.lastReset = now;
    }

    const count = this.emitCount.get(eventName) || 0;
    if (count >= this.MAX_EMITS_PER_SECOND) {
      console.warn(
        `[EventBus] Rate limit exceeded for event: ${eventName}. Event dropped.`
      );
      return;
    }

    this.emitCount.set(eventName, count + 1);

    // Deliver to subscribers asynchronously
    const handlers = this.subscribers.get(eventName);
    if (handlers) {
      Promise.resolve().then(() => {
        handlers.forEach((handler) => {
          try {
            handler(payload);
          } catch (error) {
            console.error(
              `[EventBus] Error in handler for ${eventName}:`,
              error
            );
          }
        });
      });
    }
  }

  /**
   * Get subscriber count for an event (for debugging)
   */
  getSubscriberCount(eventName: EventName): number {
    return this.subscribers.get(eventName)?.size || 0;
  }

  /**
   * Clear all subscriptions (for testing)
   */
  clear(): void {
    this.subscribers.clear();
    this.emitCount.clear();
  }
}

// Singleton instance
export const eventBus = new EventBus();

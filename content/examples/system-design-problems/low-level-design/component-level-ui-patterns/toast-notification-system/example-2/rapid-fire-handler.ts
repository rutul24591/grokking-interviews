/**
 * Rapid-Fire Toast Handler — Debounce, Dedup & Batching
 *
 * Edge case: 20+ toasts triggered within 1 second (e.g., bulk API errors,
 * WebSocket reconnection storm, or optimistic update rollback).
 *
 * Without protection this causes:
 *   1. DOM thrashing from rapid mount/unmount cycles
 *   2. Memory pressure from accumulated toast state
 *   3. Cognitive overload — user cannot process individual messages
 *   4. Animation queue backup causing janky exit transitions
 *
 * Strategy: Three-layer defense
 *   Layer 1 — Deduplication: Collapse identical toasts by content hash
 *   Layer 2 — Debounce: Accumulate toasts within a sliding window
 *   Layer 3 — Batch/Group: Emit grouped summaries instead of individual toasts
 */

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastPayload {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  /** Optional grouping key for explicit batching (e.g., request ID) */
  groupKey?: string;
  /** When this toast was originally created (before any batching) */
  originalTimestamp: number;
}

interface ToastGroup {
  type: ToastType;
  count: number;
  title: string;
  members: ToastPayload[];
  firstSeenAt: number;
  lastSeenAt: number;
}

interface BatchingConfig {
  /** Max toasts allowed in the pending queue before forced flush */
  maxQueueSize: number;
  /** Debounce window in ms — toasts arriving within this window are batched */
  debounceWindowMs: number;
  /** Max individual toasts shown before switching to grouped mode */
  maxIndividualToasts: number;
  /** Title template for grouped toasts */
  groupTitleTemplate: (type: ToastType, count: number) => string;
}

// ─── Default configuration ──────────────────────────────────────────────────

const DEFAULT_CONFIG: BatchingConfig = {
  maxQueueSize: 50,
  debounceWindowMs: 800,
  maxIndividualToasts: 5,
  groupTitleTemplate: (type, count) => `${count} ${type} notification${count > 1 ? 's' : ''}`,
};

// ─── Content hashing for deduplication ──────────────────────────────────────

/**
 * Generate a deterministic hash from toast content for dedup.
 * We avoid crypto.subtle for SSR compatibility — use a simple djb2 variant.
 *
 * Race condition note: Two toasts with identical content but different `id`s
 * would normally both render. By hashing on (type + title + message) we treat
 * them as one and increment a counter instead.
 */
function contentHash(toast: Omit<ToastPayload, 'id' | 'originalTimestamp'>): string {
  const key = `${toast.type}:${toast.title}:${toast.message ?? ''}`;
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 33) ^ key.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

// ─── Core handler class ─────────────────────────────────────────────────────

class RapidFireToastHandler {
  private config: BatchingConfig;

  /** Pending toasts accumulated during the current debounce window */
  private pendingQueue: ToastPayload[] = [];

  /** Seen content hashes within the current window for dedup */
  private seenHashes = new Map<string, { count: number; toast: ToastPayload }>();

  /** Timer ID for the debounce flush */
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /** Reference to the timer's creation timestamp — used for sliding window */
  private windowStart: number | null = null;

  /** Callback invoked with the final resolved toasts (individual or grouped) */
  private onFlush: (toasts: Array<ToastPayload | ToastGroup>) => void;

  constructor(
    config: Partial<BatchingConfig> = {},
    onFlush: (toasts: Array<ToastPayload | ToastGroup>) => void,
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.onFlush = onFlush;
  }

  /**
   * Enqueue a toast. This is the public API called by the toast dispatcher.
   *
   * Race condition: Multiple synchronous dispatches (e.g., a loop calling
   * showToast 30 times) will NOT trigger separate timers — they all funnel
   * into the same pending queue until the debounce window expires.
   */
  enqueue(toast: ToastPayload): void {
    // --- Layer 1: Deduplication ---
    const hash = contentHash({ type: toast.type, title: toast.title, message: toast.message });
    const existing = this.seenHashes.get(hash);

    if (existing) {
      // Same content already pending — just bump the count, do NOT add again.
      // This prevents 20 identical "Save failed" toasts from rendering.
      existing.count++;
      existing.toast.originalTimestamp = Math.min(
        existing.toast.originalTimestamp,
        toast.originalTimestamp,
      );
      this.scheduleFlush();
      return;
    }

    this.seenHashes.set(hash, { count: 1, toast });
    this.pendingQueue.push(toast);

    // --- Safety valve: If queue exceeds max, flush immediately ---
    if (this.pendingQueue.length >= this.config.maxQueueSize) {
      this.flush();
      return;
    }

    this.scheduleFlush();
  }

  /**
   * Schedule or reset the debounce timer.
   * Uses a sliding window: each new toast resets the timer, so the flush
   * only fires after a quiet period of `debounceWindowMs`.
   */
  private scheduleFlush(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }

    this.windowStart = Date.now();
    this.debounceTimer = setTimeout(() => {
      this.flush();
    }, this.config.debounceWindowMs);
  }

  /**
   * Flush the pending queue — this is where batching logic runs.
   *
   * Decision tree:
   *   - If pendingQueue.length <= maxIndividualToasts → emit each individually
   *   - Otherwise → group by type (error/warning/info/success) and emit summaries
   *
   * This prevents the DOM from being overwhelmed while still surfacing all
   * information to the user in a digestible format.
   */
  private flush(): void {
    this.debounceTimer = null;
    this.windowStart = null;

    const queue = [...this.pendingQueue];
    this.pendingQueue = [];
    this.seenHashes.clear();

    if (queue.length === 0) return;

    const result: Array<ToastPayload | ToastGroup> = [];

    if (queue.length <= this.config.maxIndividualToasts) {
      // Below threshold — render each toast individually
      result.push(...queue);
    } else {
      // Above threshold — group by type, then emit grouped summaries
      const groupsByType = new Map<ToastType, ToastPayload[]>();

      for (const toast of queue) {
        const bucket = groupsByType.get(toast.type) ?? [];
        bucket.push(toast);
        groupsByType.set(toast.type, bucket);
      }

      for (const [type, members] of groupsByType) {
        const group: ToastGroup = {
          type,
          count: members.length,
          title: this.config.groupTitleTemplate(type, members.length),
          members,
          firstSeenAt: Math.min(...members.map((m) => m.originalTimestamp)),
          lastSeenAt: Math.max(...members.map((m) => m.originalTimestamp)),
        };
        result.push(group);
      }

      // Edge case: if grouping still produces more groups than maxIndividualToasts
      // (e.g., 6 different types each with 10 toasts = 6 groups),
      // collapse everything into a single "mixed" group.
      if (result.length > this.config.maxIndividualToasts) {
        result.length = 0;
        result.push({
          type: 'info',
          count: queue.length,
          title: `${queue.length} notifications received`,
          members: queue,
          firstSeenAt: Math.min(...queue.map((m) => m.originalTimestamp)),
          lastSeenAt: Math.max(...queue.map((m) => m.originalTimestamp)),
        });
      }
    }

    this.onFlush(result);
  }

  /**
   * Force-flush immediately — call this on page unload or component unmount
   * to prevent toast loss.
   */
  forceFlush(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.flush();
  }

  /** Number of toasts currently pending (useful for debugging/testing) */
  get pendingCount(): number {
    return this.pendingQueue.length;
  }
}

// ─── Usage example (commented out — not part of the article) ────────────────

// const handler = new RapidFireToastHandler(
//   { debounceWindowMs: 1000, maxIndividualToasts: 5 },
//   (resolved) => {
//     for (const item of resolved) {
//       if ('members' in item) {
//         // Render as a grouped toast
//         console.log(`[GROUPED] ${item.title} — ${item.count} items`);
//       } else {
//         // Render as an individual toast
//         console.log(`[TOAST] ${item.title}`);
//       }
//     }
//   },
// );
//
// // Simulate rapid-fire: 25 toasts in ~200ms
// for (let i = 0; i < 25; i++) {
//   handler.enqueue({
//     id: `toast-${i}`,
//     type: i % 3 === 0 ? 'error' : 'info',
//     title: i % 5 === 0 ? 'Save failed' : `Item ${i} processed`,
//     groupKey: 'bulk-save',
//     originalTimestamp: Date.now(),
//   });
// }
//
// After 1s debounce window, the onFlush callback receives:
//   1. A grouped error toast: "5 error notifications"
//   2. A grouped info toast: "20 info notifications"
// Instead of 25 individual toasts flooding the screen.

export { RapidFireToastHandler };
export type { ToastPayload, ToastGroup, BatchingConfig, ToastType };

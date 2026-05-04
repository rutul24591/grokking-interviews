export type SyncMsg<T> = { channel: string; version: number; value: T };

export function chooseChannel(name: string) {
  // In production: prefer BroadcastChannel, fallback to storage events.
  return name;
}

export function applyIfNewer<T>(prev: SyncMsg<T>, next: SyncMsg<T>) {
  return next.version < prev.version ? prev : next;
}

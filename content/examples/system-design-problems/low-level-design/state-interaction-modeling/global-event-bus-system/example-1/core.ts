export type Handler<T> = (evt: T) => void;

export function createEventBus<T extends { type: string }>() {
  const byType = new Map<string, Set<Handler<T>>>();

  return {
    on(type: T["type"], handler: Handler<T>) {
      const s = byType.get(type) ?? new Set();
      s.add(handler);
      byType.set(type, s);
      return () => s.delete(handler);
    },
    emit(evt: T) {
      for (const h of byType.get(evt.type) ?? []) h(evt);
    },
  };
}

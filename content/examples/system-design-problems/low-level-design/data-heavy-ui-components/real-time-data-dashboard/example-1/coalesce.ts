import type { Event } from "./subscription";

export function createCoalescer<T>(apply: (events: Event<T>[]) => void) {
  const queue: Event<T>[] = [];
  let scheduled = false;

  return (e: Event<T>) => {
    queue.push(e);
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const batch = queue.splice(0, queue.length);
      apply(batch);
    });
  };
}


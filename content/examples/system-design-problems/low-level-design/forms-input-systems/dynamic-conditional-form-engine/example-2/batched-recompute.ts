export function createBatcher(recompute: () => void) {
  let scheduled = false;
  return () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      recompute();
    });
  };
}


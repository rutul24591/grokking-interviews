export function createDebouncedScheduler(delayMs: number) {
  const handles = new Map<string, ReturnType<typeof setTimeout>>();
  return (fieldId: string, fn: () => void) => {
    const prev = handles.get(fieldId);
    if (prev) clearTimeout(prev);
    handles.set(
      fieldId,
      setTimeout(() => {
        handles.delete(fieldId);
        fn();
      }, delayMs),
    );
  };
}


export function onStorageKey(key: string, onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === key) onChange();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}


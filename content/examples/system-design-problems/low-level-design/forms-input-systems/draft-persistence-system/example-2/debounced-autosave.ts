export function debounce(fn: () => void, delayMs: number) {
  let handle: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(fn, delayMs);
  };
}

export function flushOnPageHide(flush: () => void) {
  if (typeof window === "undefined") return () => {};
  const onHide = () => flush();
  window.addEventListener("pagehide", onHide);
  return () => window.removeEventListener("pagehide", onHide);
}


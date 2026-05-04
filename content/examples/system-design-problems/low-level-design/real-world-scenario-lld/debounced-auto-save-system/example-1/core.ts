export function debounce(fn: () => void, ms: number) {
  let h: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (h) clearTimeout(h);
    h = setTimeout(fn, ms);
  };
}

export function flushOnPageHide(flush: () => void) {
  if (typeof window === "undefined") return () => {};
  const onHide = () => flush();
  window.addEventListener("pagehide", onHide);
  return () => window.removeEventListener("pagehide", onHide);
}

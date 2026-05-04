export function rememberActiveElement() {
  if (typeof document === "undefined") return null;
  return document.activeElement instanceof HTMLElement ? document.activeElement : null;
}

export function restoreFocus(el: HTMLElement | null) {
  if (!el) return;
  requestAnimationFrame(() => el.focus());
}


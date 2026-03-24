export function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>(
      [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
      ].join(",")
    )
  );
  return nodes.filter((n) => !n.hasAttribute("disabled") && !n.getAttribute("aria-hidden"));
}

export function trapTabKey(e: React.KeyboardEvent, focusables: HTMLElement[]) {
  if (focusables.length === 0) return;
  const first = focusables[0]!;
  const last = focusables[focusables.length - 1]!;
  const active = document.activeElement as HTMLElement | null;
  const isShift = e.shiftKey;

  if (!isShift && active === last) {
    e.preventDefault();
    first.focus();
  } else if (isShift && active === first) {
    e.preventDefault();
    last.focus();
  }
}


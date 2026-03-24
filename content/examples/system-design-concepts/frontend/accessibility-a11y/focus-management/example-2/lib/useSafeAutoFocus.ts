import { useEffect, type RefObject } from "react";

export function useSafeAutoFocus({
  active,
  targetRef
}: {
  active: boolean;
  targetRef: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!active) return;
    const target = targetRef.current;
    if (!target) return;

    // Avoid stealing focus if the user already moved focus within the overlay quickly.
    const t = window.setTimeout(() => {
      const within = target.contains(document.activeElement);
      if (!within) target.focus();
    }, 0);

    return () => window.clearTimeout(t);
  }, [active, targetRef]);
}


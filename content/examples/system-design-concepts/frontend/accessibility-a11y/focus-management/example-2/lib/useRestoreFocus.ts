import { useEffect, type RefObject } from "react";

export function useRestoreFocus({
  active,
  restoreTo
}: {
  active: boolean;
  restoreTo: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!active) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    return () => {
      const explicit = restoreTo.current;
      if (explicit) explicit.focus();
      else previouslyFocused?.focus();
    };
  }, [active, restoreTo]);
}


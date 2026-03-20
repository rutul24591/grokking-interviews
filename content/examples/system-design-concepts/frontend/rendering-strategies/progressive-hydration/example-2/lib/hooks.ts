"use client";

import { useEffect, useRef, useState } from "react";

type IdleCallbackHandle = number;

export function useHydrateOnIdle(params: { timeoutMs?: number; enabled?: boolean } = {}) {
  const { timeoutMs = 1200, enabled = true } = params;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || ready) return;

    let cancelled = false;
    function done() {
      if (cancelled) return;
      setReady(true);
    }

    if (typeof (window as any).requestIdleCallback === "function") {
      const id: IdleCallbackHandle = (window as any).requestIdleCallback(done, { timeout: timeoutMs });
      return () => {
        cancelled = true;
        (window as any).cancelIdleCallback(id);
      };
    }

    const id = window.setTimeout(done, Math.min(650, timeoutMs));
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [enabled, ready, timeoutMs]);

  return ready;
}

export function useHydrateOnVisible(params: { rootMargin?: string; enabled?: boolean } = {}) {
  const { rootMargin = "200px", enabled = true } = params;
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || ready) return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((e) => e.isIntersecting);
        if (!isVisible || cancelled) return;
        observer.disconnect();
        setReady(true);
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [enabled, ready, rootMargin]);

  return { ref, ready };
}


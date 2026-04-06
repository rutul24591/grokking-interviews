// useTooltipVisibility Hook — Determines tooltip visibility based on store state and trigger ref

import { useState, useEffect, useRef, useCallback } from "react";
import { useTooltipStore } from "../lib/tooltip-store";
import type { TooltipPosition } from "../lib/tooltip-types";

export function useTooltipVisibility(triggerRef: React.RefObject<HTMLElement | null>) {
  const activeTooltip = useTooltipStore((state) => state.activeTooltip);
  const isVisible = useTooltipStore((state) => state.isVisible);
  const computedPosition = useTooltipStore((state) => state.activeTooltip?.computedPosition);
  const forceHide = useTooltipStore((state) => state.forceHide);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Check if this trigger is the active tooltip
  const isActive =
    activeTooltip !== null &&
    triggerRef.current !== null;

  // Set up IntersectionObserver on the trigger element
  useEffect(() => {
    if (!triggerRef.current) return;

    const element = triggerRef.current;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (!entry.isIntersecting && isActive) {
          // Dismiss tooltip when trigger scrolls out of view
          forceHide();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [triggerRef, isActive, forceHide]);

  // Also observe trigger removal from DOM via MutationObserver
  useEffect(() => {
    if (!triggerRef.current) return;

    const element = triggerRef.current;
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          // Check if our trigger element is still in the document
          if (!document.contains(element)) {
            forceHide();
            break;
          }
        }
      }
    });

    mutationObserver.observe(element.parentElement ?? document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [triggerRef, forceHide]);

  const shouldRender = isActive && isVisible && isIntersecting;

  return {
    shouldRender,
    position: computedPosition ?? null,
    activeTooltip,
  };
}

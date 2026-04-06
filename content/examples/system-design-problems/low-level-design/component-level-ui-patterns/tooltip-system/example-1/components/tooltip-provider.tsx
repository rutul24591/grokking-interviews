// TooltipProvider Component — App-level provider for global tooltip context

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTooltipStore } from "../lib/tooltip-store";
import { TooltipContent } from "./tooltip-content";

interface TooltipProviderProps {
  children: React.ReactNode;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const forceHide = useTooltipStore((state) => state.forceHide);
  const clearPending = useTooltipStore((state) => state.clearPending);

  // SSR-safe mount detection
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Global event listeners for Escape and outside click
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        forceHide();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Check if click target is not a tooltip trigger element
      const tooltipElement = document.getElementById("tooltip-portal-container");
      if (tooltipElement && !tooltipElement.contains(target)) {
        // Check if the target is not a trigger element
        const trigger = (target as HTMLElement).closest("[aria-describedby]");
        if (!trigger) {
          forceHide();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      clearPending();
    };
  }, [isMounted, forceHide, clearPending]);

  // Handle window resize — dismiss open tooltip
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      forceHide();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMounted, forceHide]);

  return (
    <>
      {children}
      {isMounted && <TooltipContent />}
    </>
  );
}

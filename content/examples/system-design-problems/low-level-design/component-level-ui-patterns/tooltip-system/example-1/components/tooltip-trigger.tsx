// TooltipTrigger Component — Wrapper attaching hover/focus/touch events

"use client";

import React, { cloneElement, isValidElement, Children } from "react";
import { useTooltipTrigger } from "../hooks/use-tooltip-trigger";
import type { TooltipConfig, TooltipContentData } from "../lib/tooltip-types";

interface TooltipTriggerProps {
  id: string;
  content: TooltipContentData;
  config?: Partial<TooltipConfig>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactElement;
}

export function TooltipTrigger({
  id,
  content,
  config,
  open,
  onOpenChange,
  children,
}: TooltipTriggerProps) {
  const { triggerRef, handlers } = useTooltipTrigger({
    id,
    content,
    config,
    open,
    onOpenChange,
  });

  const tooltipId = `tooltip-${id}`;

  if (!isValidElement(children)) {
    return null;
  }

  const childProps = children.props as Record<string, unknown>;

  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      // Merge refs if the child already has a ref
      const existingRef = childProps.ref;
      if (typeof existingRef === "function") {
        existingRef(node);
      } else if (existingRef && typeof existingRef === "object") {
        (existingRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    ...handlers,
    "aria-describedby": tooltipId,
    tabIndex: childProps.tabIndex ?? 0,
  });
}

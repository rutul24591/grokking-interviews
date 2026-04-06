// TooltipContent Component — Tooltip bubble with arrow, rich content, animation

"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTooltipStore } from "../lib/tooltip-store";
import { useTooltipVisibility } from "../hooks/use-tooltip-visibility";
import { useTooltipPortal } from "../hooks/use-tooltip-portal";
import { computeTooltipPosition } from "../lib/tooltip-position-engine";
import type { TooltipRichContent } from "../lib/tooltip-types";

export function TooltipContent() {
  const activeTooltip = useTooltipStore((state) => state.activeTooltip);
  const updatePosition = useTooltipStore((state) => state.updatePosition);
  const contentRef = useRef<HTMLDivElement>(null);
  const { portalNode, isClient } = useTooltipPortal();
  const triggerRef = useRef<HTMLDivElement>(null);

  // Create a dummy trigger ref for visibility hook
  useEffect(() => {
    if (activeTooltip?.triggerRect) {
      // We use the stored triggerRect directly for positioning
    }
  }, [activeTooltip]);

  // Measure tooltip and compute position after render
  const measureAndPosition = useCallback(() => {
    if (!contentRef.current || !activeTooltip?.triggerRect) return;

    const rect = contentRef.current.getBoundingClientRect();
    const position = computeTooltipPosition(
      activeTooltip.triggerRect,
      rect.width,
      rect.height,
      activeTooltip.config.placement
    );

    updatePosition(position);
  }, [activeTooltip, updatePosition]);

  // Use useLayoutEffect-equivalent via useEffect + measure
  useEffect(() => {
    measureAndPosition();
  }, [measureAndPosition]);

  if (!isClient || !portalNode || !activeTooltip) {
    return null;
  }

  const position = activeTooltip.computedPosition;
  if (!position) {
    // Render invisible to measure, then position
    return createPortal(
      <div
        ref={contentRef}
        style={{
          position: "fixed",
          visibility: "hidden",
          top: 0,
          left: 0,
        }}
      >
        {renderContent(activeTooltip.content)}
      </div>,
      portalNode
    );
  }

  const arrowStyle = activeTooltip.config.arrow
    ? {
        position: "absolute" as const,
        width: 10,
        height: 10,
        top: position.arrow.top,
        left: position.arrow.left,
        transform: `rotate(${position.arrow.rotation}deg)`,
        backgroundColor: "hsl(220 13% 18%)",
        clipPath: "polygon(0 0, 100% 100%, 0 100%)",
      }
    : {};

  return createPortal(
    <div
      id={`tooltip-${activeTooltip.id}`}
      role="tooltip"
      ref={contentRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        zIndex: 10000,
        pointerEvents: "none",
        animation: "tooltipFadeIn 150ms ease-out forwards",
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "hsl(220 13% 18%)",
          color: "hsl(0 0% 98%)",
          borderRadius: 6,
          padding: "8px 12px",
          maxWidth: 280,
          fontSize: 13,
          lineHeight: 1.5,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        {renderContent(activeTooltip.content)}
        {activeTooltip.config.arrow && (
          <div
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              top: position.arrow.top - 4,
              left: position.arrow.left - 5,
              transform: `rotate(${position.arrow.rotation}deg)`,
              backgroundColor: "hsl(220 13% 18%)",
              clipPath: "polygon(0 0, 100% 100%, 0 100%)",
            }}
          />
        )}
      </div>
    </div>,
    portalNode
  );
}

function renderContent(content: unknown): React.ReactNode {
  if (typeof content === "string") {
    return <p style={{ margin: 0 }}>{content}</p>;
  }

  if (React.isValidElement(content)) {
    return content;
  }

  if (
    content &&
    typeof content === "object" &&
    "title" in content &&
    "description" in content
  ) {
    const rich = content as TooltipRichContent;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>
          {rich.title}
        </p>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.85 }}>
          {rich.description}
        </p>
        {rich.imageUrl && (
          <img
            src={rich.imageUrl}
            alt=""
            style={{
              width: "100%",
              maxHeight: 80,
              objectFit: "cover",
              borderRadius: 4,
              marginTop: 4,
            }}
          />
        )}
        {rich.keyboardShortcut && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            <kbd
              style={{
                display: "inline-block",
                padding: "2px 6px",
                fontSize: 11,
                fontFamily: "monospace",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              {rich.keyboardShortcut}
            </kbd>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// useTooltipPortal Hook — Portal rendering with SSR safety

import { useState, useEffect, useRef, useCallback } from "react";

const TOOLTIP_PORTAL_ID = "tooltip-portal-container";
const TOOLTIP_Z_INDEX = 9999;

export function useTooltipPortal() {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  // SSR-safe client detection and portal container creation
  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsClient(true);

    let container = document.getElementById(TOOLTIP_PORTAL_ID);
    if (!container) {
      container = document.createElement("div");
      container.id = TOOLTIP_PORTAL_ID;
      container.setAttribute("data-tooltip-portal", "true");
      Object.assign(container.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: TOOLTIP_Z_INDEX,
        pointerEvents: "none",
      });
      document.body.appendChild(container);
    }

    setPortalNode(container);
    containerRef.current = container;

    return () => {
      // Do NOT remove the portal container on unmount — it may be reused
      // by another tooltip instance. Only clean up if no tooltips are active.
    };
  }, []);

  const getPortalNode = useCallback(() => portalNode, [portalNode]);

  return {
    portalNode,
    containerRef,
    isClient,
    getPortalNode,
  };
}

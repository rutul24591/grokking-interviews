"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteHeadingFocus() {
  const pathname = usePathname();

  useEffect(() => {
    const el = document.getElementById("route-title");
    if (!el) return;
    window.setTimeout(() => (el as HTMLElement).focus(), 0);
  }, [pathname]);

  return null;
}


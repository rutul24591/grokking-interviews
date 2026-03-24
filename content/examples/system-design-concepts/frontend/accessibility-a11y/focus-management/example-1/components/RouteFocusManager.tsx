"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function RouteFocusManager() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState("");
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip initial mount.
    if (lastPathRef.current === null) {
      lastPathRef.current = pathname;
      return;
    }

    lastPathRef.current = pathname;
    setAnnouncement(`Navigated to ${pathname}`);

    // Focus the main page heading if present.
    const el = document.getElementById("route-title");
    if (el && "focus" in el) {
      // Defer so the new page has rendered.
      window.setTimeout(() => (el as HTMLElement).focus(), 0);
    }
  }, [pathname]);

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  );
}


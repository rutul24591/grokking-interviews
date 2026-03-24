"use client";

import type { ReactNode } from "react";

export function SkipLink({ targetId, children }: { targetId: string; children: ReactNode }) {
  return (
    <a
      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black"
      href={`#${encodeURIComponent(targetId)}`}
      onClick={(e) => {
        // Ensure focus moves (not only scroll).
        const el = document.getElementById(targetId);
        if (!el) return;
        e.preventDefault();
        history.replaceState(null, "", `#${encodeURIComponent(targetId)}`);
        (el as HTMLElement).focus();
      }}
    >
      {children}
    </a>
  );
}


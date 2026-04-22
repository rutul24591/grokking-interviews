"use client";

import { HIGHLIGHT_TIER_META } from "@/components/articles/highlightMeta";
import { classNames } from "@/lib/classNames";

type HighlightLegendProps = {
  className?: string;
};

export function HighlightLegend({ className }: HighlightLegendProps) {
  return (
    <div
      className={classNames("flex flex-wrap items-center gap-2", className)}
      aria-label="Highlight legend"
    >
      {Object.entries(HIGHLIGHT_TIER_META).map(([tier, meta]) => (
        <span
          key={tier}
          className={classNames(
            "inline-flex items-center rounded-full px-2.5 py-1 font-bold tracking-[0.18em]",
            meta.chipClassName,
          )}
        >
          {meta.label}
        </span>
      ))}
    </div>
  );
}

"use client";

import { type ReactNode } from "react";
import { useHighlights } from "@/components/articles/HighlightsContext";
import {
  type HighlightTier,
  HIGHLIGHT_TIER_META,
} from "@/components/articles/highlightMeta";
import { classNames } from "@/lib/classNames";

type HighlightProps = {
  children: ReactNode;
  tier: HighlightTier;
};

export function Highlight({ children, tier }: HighlightProps) {
  const { highlightsOn } = useHighlights();

  if (!highlightsOn) {
    return <>{children}</>;
  }

  const classes = classNames(
    "rounded px-1.5 py-0.5 transition-colors duration-200",
    HIGHLIGHT_TIER_META[tier].chipClassName,
  );

  return <span className={classes}>{children}</span>;
}

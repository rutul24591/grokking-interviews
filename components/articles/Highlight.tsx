"use client";

import { type ReactNode } from "react";
import { useHighlights } from "@/components/articles/HighlightsContext";
import { classNames } from "@/lib/classNames";

type HighlightProps = {
  children: ReactNode;
  tier: "crucial" | "important";
};

const HIGHLIGHT_CLASSES: Record<
  HighlightProps["tier"],
  { light: string; dark: string }
> = {
  crucial: {
    light: "bg-purple-500/20 border-l-2 border-purple-500",
    dark: "dark:bg-purple-500/30 dark:border-purple-400",
  },
  important: {
    light: "bg-amber-400/20 border-l-2 border-amber-500",
    dark: "dark:bg-amber-400/30 dark:border-amber-400",
  },
};

export function Highlight({ children, tier }: HighlightProps) {
  const { highlightsOn } = useHighlights();

  if (!highlightsOn) {
    return <>{children}</>;
  }

  const classes = classNames(
    "rounded px-1.5 py-0.5 transition-colors duration-200",
    HIGHLIGHT_CLASSES[tier].light,
    HIGHLIGHT_CLASSES[tier].dark,
  );

  return <span className={classes}>{children}</span>;
}

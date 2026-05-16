"use client";

import type { ReactNode } from "react";
import { useHighlights } from "@/components/articles/HighlightsContext";
import type { HighlightTier } from "@/components/articles/highlightMeta";
import { classNames } from "@/lib/classNames";

type HighlightBlockProps = {
  // Keep this intentionally constrained to tags we commonly need in articles,
  // especially for comparison tables.
  as?: "div" | "p" | "li" | "tr" | "td" | "th" | "blockquote";
  children: ReactNode;
  className?: string;
  tier?: HighlightTier;
  type?: HighlightTier | "tip";
};

export function HighlightBlock({
  as = "div",
  children,
  className,
  tier,
  type,
}: HighlightBlockProps) {
  const { highlightsOn } = useHighlights();
  const Tag = as;
  const resolvedTier = tier ?? (type === "tip" ? "important" : type) ?? "important";

  return (
    <Tag
      className={classNames(className, highlightsOn && `highlight-${resolvedTier}`)}
    >
      {children}
    </Tag>
  );
}

"use client";

import type { ReactNode } from "react";
import { useHighlights } from "@/components/articles/HighlightsContext";
import type { HighlightTier } from "@/components/articles/highlightMeta";
import { classNames } from "@/lib/classNames";

type HighlightBlockProps = {
  as?: "div" | "p" | "li";
  children: ReactNode;
  className?: string;
  tier: HighlightTier;
};

export function HighlightBlock({
  as = "div",
  children,
  className,
  tier,
}: HighlightBlockProps) {
  const { highlightsOn } = useHighlights();
  const Tag = as;

  return (
    <Tag
      className={classNames(className, highlightsOn && `highlight-${tier}`)}
    >
      {children}
    </Tag>
  );
}

export type HighlightTier = "crucial" | "important";

export const HIGHLIGHT_TIER_META: Record<
  HighlightTier,
  {
    label: string;
    chipClassName: string;
  }
> = {
  crucial: {
    label: "Crucial",
    chipClassName:
      "bg-pink-500/20 text-pink-900 border border-purple-500/60 dark:bg-pink-400/30 dark:text-white dark:border-purple-300/70",
  },
  important: {
    label: "Important",
    chipClassName:
      "bg-orange-400/20 text-orange-950 border border-orange-600/60 dark:bg-orange-400/30 dark:text-white dark:border-orange-300/70",
  },
};

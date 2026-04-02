console.log(
  JSON.stringify(
    {
      variableHeightChallenges: [
        "you need measurement (ResizeObserver) to know row heights",
        "scroll-to-index requires prefix sums / binary search",
        "content changes invalidate measurements",
        "overscan and fast scroll can cause jank if measurement is slow"
      ],
      mitigationIdeas: [
        "use fixed heights where possible",
        "estimate heights then refine",
        "batch measurements and avoid layout thrash"
      ]
    },
    null,
    2,
  ),
);


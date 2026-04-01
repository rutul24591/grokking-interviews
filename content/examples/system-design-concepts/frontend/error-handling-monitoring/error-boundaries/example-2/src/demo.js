function chooseRecoveryBoundary(boundaries, failurePath) {
  const ordered = [...boundaries].sort((left, right) => right.depth - left.depth);
  const match = ordered.find((boundary) => failurePath.startsWith(boundary.scope));

  return match
    ? {
        boundaryId: match.id,
        resetTarget: match.resetTarget,
        blastRadius: match.depth >= 2 ? "localized" : "page-wide"
      }
    : { boundaryId: "page-root", resetTarget: "full-shell", blastRadius: "page-wide" };
}

const recovery = chooseRecoveryBoundary(
  [
    { id: "page-root", scope: "/article", depth: 0, resetTarget: "full-shell" },
    { id: "feed-shell", scope: "/article/feed", depth: 1, resetTarget: "feed-shell" },
    { id: "widget-boundary", scope: "/article/feed/recommendations", depth: 2, resetTarget: "recommendations-widget" }
  ],
  "/article/feed/recommendations/card-3"
);

console.log(recovery);

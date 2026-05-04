export function computeAnchorDelta(args: {
  prevScrollHeight: number;
  nextScrollHeight: number;
}) {
  // For upward infinite scroll: when prepending items, keep the viewport anchored.
  return args.nextScrollHeight - args.prevScrollHeight;
}


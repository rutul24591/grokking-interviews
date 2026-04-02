function chooseReactionPresentation(contexts) {
  return contexts.map((context) => ({
    id: context.id,
    palette: context.touchDevice ? "compact" : "full",
    longPressHint: context.touchDevice,
    keyboardFallback: context.prefersReducedMotion || context.hasScreenReader
  }));
}

console.log(chooseReactionPresentation([
  { id: "rp-1", touchDevice: true, prefersReducedMotion: false, hasScreenReader: false },
  { id: "rp-2", touchDevice: false, prefersReducedMotion: true, hasScreenReader: true }
]));

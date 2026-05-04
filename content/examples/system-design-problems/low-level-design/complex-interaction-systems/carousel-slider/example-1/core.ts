export type CarouselState = {
  index: number;
  count: number;
  autoplay: boolean;
  intervalMs: number;
  lastAdvanceAt: number;
};

export function next(s: CarouselState) {
  return { ...s, index: (s.index + 1) % s.count, lastAdvanceAt: Date.now() };
}

export function prev(s: CarouselState) {
  return { ...s, index: (s.index - 1 + s.count) % s.count, lastAdvanceAt: Date.now() };
}

export function onSwipe(deltaX: number, thresholdPx = 40) {
  if (deltaX > thresholdPx) return "prev" as const;
  if (deltaX < -thresholdPx) return "next" as const;
  return null;
}

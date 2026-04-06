export function clampPosition(position: number, minFirst: number, minSecond: number, containerSize: number): number {
  return Math.max(minFirst, Math.min(position, containerSize - minSecond));
}

export function computeFlexBasis(position: number, containerSize: number): { first: string; second: string } {
  const pct = (position / containerSize) * 100;
  return { first: `${pct}%`, second: `${100 - pct}%` };
}

export type Size = { w: number; h: number };

export function diffSize(prev: Size, next: Size, eps = 0.5) {
  const dw = Math.abs(prev.w - next.w);
  const dh = Math.abs(prev.h - next.h);
  return dw > eps || dh > eps;
}

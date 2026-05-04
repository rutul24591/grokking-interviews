export function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export type Viewport = { w: number; h: number };
export type Image = { w: number; h: number };

export function clampPan(args: {
  panX: number;
  panY: number;
  zoom: number;
  viewport: Viewport;
  image: Image;
}) {
  const { panX, panY, zoom, viewport, image } = args;
  const scaledW = image.w * zoom;
  const scaledH = image.h * zoom;
  const maxX = Math.max(0, (scaledW - viewport.w) / 2);
  const maxY = Math.max(0, (scaledH - viewport.h) / 2);
  return { panX: clamp(panX, -maxX, maxX), panY: clamp(panY, -maxY, maxY) };
}


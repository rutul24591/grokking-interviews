export type Transform = { scale: number; tx: number; ty: number };

export function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function zoomAt(t: Transform, factor: number, cx: number, cy: number, min = 0.25, max = 4) {
  const nextScale = clamp(t.scale * factor, min, max);
  const k = nextScale / t.scale;
  // keep point (cx,cy) stable
  const tx = cx - (cx - t.tx) * k;
  const ty = cy - (cy - t.ty) * k;
  return { scale: nextScale, tx, ty };
}

export function pan(t: Transform, dx: number, dy: number) {
  return { ...t, tx: t.tx + dx, ty: t.ty + dy };
}

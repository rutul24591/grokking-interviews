export type LayoutPolicy = {
  variant: "mobile" | "tablet" | "desktop";
  columns: number;
  touchTargetPx: number;
  imageQuality: number;
  reducedMotion: boolean;
};

export function computeLayoutPolicy(input: {
  widthPx: number;
  dpr: number;
  reducedMotion: boolean;
}): LayoutPolicy {
  const variant = input.widthPx < 640 ? "mobile" : input.widthPx < 1024 ? "tablet" : "desktop";
  const columns = variant === "mobile" ? 1 : variant === "tablet" ? 2 : 3;
  const touchTargetPx = variant === "mobile" ? 44 : 40;
  const imageQuality = input.dpr >= 2 ? 75 : 60;
  return { variant, columns, touchTargetPx, imageQuality, reducedMotion: input.reducedMotion };
}


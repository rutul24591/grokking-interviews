export type AssetRoute = {
  id: string;
  asset: string;
  cacheScope: "edge" | "regional" | "origin";
  ttlSeconds: number;
  status: "healthy" | "warmup" | "origin-fallback";
};

export const cdnDeliveryState = {
  servingRegion: "ap-south-1",
  failoverEnabled: true,
  routes: [
    { id: "hero-images", asset: "hero-images", cacheScope: "edge" as const, ttlSeconds: 3600, status: "healthy" as const },
    { id: "article-html", asset: "article-html", cacheScope: "regional" as const, ttlSeconds: 120, status: "warmup" as const },
    { id: "video-thumbs", asset: "video-thumbnails", cacheScope: "edge" as const, ttlSeconds: 7200, status: "origin-fallback" as const }
  ],
  lastMessage: "CDN routing keeps static assets at the edge while allowing short-lived article responses to refresh more aggressively."
};

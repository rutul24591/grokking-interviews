export type RouteEntry = { path: string; lastModified: string };

export async function listIndexableRoutes(): Promise<RouteEntry[]> {
  return [
    { path: "/", lastModified: "2026-03-24T00:00:00.000Z" },
    { path: "/posts/edge-cache", lastModified: "2026-03-24T00:00:00.000Z" }
  ];
}


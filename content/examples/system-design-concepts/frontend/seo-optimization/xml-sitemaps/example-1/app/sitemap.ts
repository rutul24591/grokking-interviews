import type { MetadataRoute } from "next";
import { listIndexableRoutes } from "@/lib/registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await listIndexableRoutes();
  return routes.map((r) => ({
    url: `http://localhost:3000${r.path}`,
    lastModified: new Date(r.lastModified)
  }));
}


import type { MetadataRoute } from "next";

const host = "http://localhost:3000";
const locales = ["en", "fr"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ["/posts/edge-cache"];
  const urls = [];
  for (const locale of locales) {
    for (const p of paths) {
      urls.push({
        url: `${host}/${locale}${p}`,
        lastModified: new Date("2026-03-24T00:00:00.000Z")
      });
    }
  }
  return urls;
}


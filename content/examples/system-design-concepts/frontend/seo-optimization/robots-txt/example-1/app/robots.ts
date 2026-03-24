import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const env = process.env.APP_ENV ?? "dev";
  if (env !== "prod") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }]
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "http://localhost:3000/sitemap.xml"
  };
}


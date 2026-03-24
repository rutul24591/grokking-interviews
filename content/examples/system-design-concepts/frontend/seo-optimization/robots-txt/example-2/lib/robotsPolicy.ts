export type Rule = { userAgent: string; allow?: string | string[]; disallow?: string | string[] };

export function buildPolicy(): { rules: Rule[]; sitemap?: string } {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/search", "/drafts", "/api"] }
    ],
    sitemap: "http://localhost:3000/sitemap.xml"
  };
}


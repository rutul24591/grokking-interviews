type Url = { loc: string; lastmod: string };

function sitemapXml(urls: Url[]) {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const body = urls
    .map((u) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${esc(u.lastmod)}</lastmod></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

const urls: Url[] = [
  { loc: "https://example.com/", lastmod: "2026-03-20" },
  { loc: "https://example.com/articles/design-cache-keys", lastmod: "2026-03-20" }
];

console.log(sitemapXml(urls));


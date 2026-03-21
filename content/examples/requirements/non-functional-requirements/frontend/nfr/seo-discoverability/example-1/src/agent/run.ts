import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url()
});

function parseArgs(argv: string[]) {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    out[key] = value;
  }
  return ArgsSchema.parse(out);
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function getJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  const robots = await fetch(baseUrl + "/robots.txt");
  assert(robots.status === 200, "expected robots 200");

  const sitemap = await fetch(baseUrl + "/sitemap.xml");
  assert(sitemap.status === 200, "expected sitemap 200");

  const article = await fetch(baseUrl + "/articles/design-cache-keys");
  assert(article.status === 200, "expected article 200");
  const html = await article.text();
  assert(html.includes("Design cache keys"), "expected title present");
  assert(html.includes("application/ld+json"), "expected JSON-LD present");

  const preview = await getJson(baseUrl + "/api/seo/preview?slug=design-cache-keys");
  assert(preview.status === 200, "expected seo preview 200");
  assert(preview.json && preview.json.canonical, "expected canonical present");
  assert(String(preview.json.canonical).endsWith("/articles/design-cache-keys"), "expected canonical path");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

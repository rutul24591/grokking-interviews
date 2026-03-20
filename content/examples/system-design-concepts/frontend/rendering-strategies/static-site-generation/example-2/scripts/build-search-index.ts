import * as fs from "fs";
import * as path from "path";

type Post = { slug: string; title: string; excerpt: string; body: string };

function tokenize(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);
}

function main() {
  const root = process.cwd();
  const outDir = path.join(root, "content");
  const outFile = path.join(outDir, "search-index.json");

  // In a real system this would come from a CMS export. Keep it local and deterministic here.
  const posts: Post[] = [
    {
      slug: "hello-world",
      title: "Hello World (SSG)",
      excerpt: "A tiny post for search indexing.",
      body: "SSG static generation build pipeline",
    },
    {
      slug: "build-pipelines",
      title: "Build Pipelines",
      excerpt: "SSG shifts complexity to builds.",
      body: "build pipelines observability determinism",
    },
  ];

  const tokens: Record<string, string[]> = {};
  const postsMap: Record<string, { slug: string; title: string; excerpt: string }> = {};

  for (const p of posts) {
    postsMap[p.slug] = { slug: p.slug, title: p.title, excerpt: p.excerpt };
    const uniq = new Set(tokenize(`${p.title} ${p.excerpt} ${p.body}`));
    for (const t of uniq) {
      tokens[t] ??= [];
      tokens[t].push(p.slug);
    }
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify({ tokens, posts: postsMap }, null, 2) + "\\n", "utf8");
  // eslint-disable-next-line no-console
  console.log(`Wrote search index to ${outFile}`);
}

main();


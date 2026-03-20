import * as fs from "fs";
import * as path from "path";

type Post = {
  slug: string;
  title: string;
  updatedAt: string;
  excerpt: string;
  body: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readMarkdownFiles(dir: string) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((f) => path.join(dir, f));
}

function parsePost(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\\r?\\n/);
  const titleLine = lines.find((l) => l.trim().startsWith("# ")) ?? "# Untitled";
  const title = titleLine.replace(/^#\\s+/, "").trim();
  const body = raw.replace(/^#\\s+.*\\n/, "").trim() + "\\n";
  const excerpt = body.split(/\\r?\\n/).find((l) => l.trim().length > 0)?.slice(0, 140) ?? "";
  const slug = slugify(path.basename(filePath, ".md"));
  return {
    slug,
    title,
    updatedAt: new Date().toISOString(),
    excerpt,
    body,
  };
}

function main() {
  const root = process.cwd();
  const srcDir = path.join(root, "content-src", "posts");
  const outDir = path.join(root, "content");
  const outFile = path.join(outDir, "posts.json");

  if (!fs.existsSync(srcDir)) {
    throw new Error(`Missing content source dir: ${srcDir}`);
  }

  const posts = readMarkdownFiles(srcDir).map(parsePost).sort((a, b) => (a.slug < b.slug ? -1 : 1));

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify({ posts }, null, 2) + "\\n", "utf8");
  // eslint-disable-next-line no-console
  console.log(`Wrote ${posts.length} posts to ${outFile}`);
}

main();


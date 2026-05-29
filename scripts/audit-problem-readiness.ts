import fs from "node:fs";
import path from "node:path";

type ReadinessRow = {
  file: string;
  category: string;
  subcategory: string;
  slug: string;
  title: string;
  words: number;
  diagrams: number;
  questions: number;
  hasReferences: boolean;
  hasExamples: boolean;
  score: number;
  level: "needs-work" | "mid" | "senior" | "staff" | "principal";
};

const ROOT = process.cwd();
const ARTICLE_ROOT = path.join(ROOT, "content", "articles", "system-design-problems");
const MANIFEST_PATH = path.join(ROOT, "content", "examples-manifest.json");

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "api",
  "app",
  "based",
  "design",
  "for",
  "frontend",
  "like",
  "style",
  "system",
  "the",
  "ui",
  "ux",
  "with",
]);

const HIGH_LEVEL_ALIASES: Record<string, string[]> = {
  "security-auth-privacy-systems": ["security-auth-and-privacy-systems"],
  "media-rich-content-systems": ["media-and-rich-content-systems"],
  "cross-platform-mobile-systems": ["cross-platform-and-mobile-systems"],
  "knowledge-content-systems": ["knowledge-and-content-systems"],
  "emerging-future-systems": ["emerging-and-future-systems"],
  "ecommerce-marketplace": ["e-commerce-and-marketplace"],
  "social-engagement": ["social-and-engagement"],
  "messaging-communication": ["messaging-and-communication"],
  "realtime-collaboration-systems": ["realtime-and-collaboration-systems"],
  "maps-location-intelligence": ["maps-and-location-intelligence"],
  "payments-fintech-systems": ["payments-and-fintech-systems"],
};

const LOW_LEVEL_ALIASES: Record<string, string[]> = {
  "ai-modern-systems": ["ai-modern-systems-lld"],
  "offline-advanced-ux": ["offline-advanced-ux-systems"],
  "state-management-data-architecture": ["architecture-system-level-lld"],
};

const META_PATTERNS = {
  category: /category:\s*"([^"]+)"/,
  slug: /slug:\s*"([^"]+)"/,
  subcategory: /subcategory:\s*"([^"]+)"/,
  title: /title:\s*"([^"]+)"/,
};

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(fullPath));
    if (entry.isFile() && fullPath.endsWith(".tsx")) out.push(fullPath);
  }
  return out;
}

function readMeta(source: string, key: keyof typeof META_PATTERNS) {
  return META_PATTERNS[key].exec(source)?.[1] ?? "";
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function tokenOverlapScore(targetTokens: Set<string>, candidateTokens: Set<string>) {
  if (!targetTokens.size || !candidateTokens.size) return 0;

  let overlap = 0;
  for (const token of targetTokens) {
    if (candidateTokens.has(token)) overlap += 1;
  }

  return overlap / Math.max(targetTokens.size, candidateTokens.size);
}

function hasManifestExamples(
  manifest: Record<string, unknown>,
  category: string,
  subcategory: string,
  slug: string,
  title: string,
) {
  const aliases =
    category === "high-level-design"
      ? HIGH_LEVEL_ALIASES[subcategory]
      : category === "low-level-design"
        ? LOW_LEVEL_ALIASES[subcategory]
        : undefined;
  const subcategoryCandidates = [subcategory, ...(aliases ?? [])];

  for (const candidate of subcategoryCandidates) {
    if (manifest[`${category}/${candidate}/${slug}`]) return true;
  }

  const slugTokens = new Set(tokenize(slug));
  const titleTokens = new Set(tokenize(title));
  for (const candidate of subcategoryCandidates) {
    const prefix = `${category}/${candidate}/`;
    for (const key of Object.keys(manifest)) {
      if (!key.startsWith(prefix)) continue;
      const candidateTokens = new Set(tokenize(key.slice(prefix.length)));
      const score = Math.max(
        tokenOverlapScore(slugTokens, candidateTokens),
        tokenOverlapScore(titleTokens, candidateTokens),
      );
      if (score >= 0.5) return true;
    }
  }

  return false;
}

function wordScore(words: number) {
  if (words >= 6500) return 2.4;
  if (words >= 5200) return 2.1;
  if (words >= 4000) return 1.6;
  if (words >= 3000) return 1.2;
  if (words >= 2200) return 0.8;
  if (words >= 1500) return 0.5;
  return 0.2;
}

function readinessLevel(score: number): ReadinessRow["level"] {
  if (score >= 8.2) return "principal";
  if (score >= 7.4) return "staff";
  if (score >= 6.4) return "senior";
  if (score >= 5.2) return "mid";
  return "needs-work";
}

function scoreRow(row: Omit<ReadinessRow, "score" | "level">) {
  const score =
    2.4 +
    wordScore(row.words) +
    Math.min(1.25, row.diagrams * 0.3) +
    Math.min(1.4, row.questions * 0.25) +
    (row.hasReferences ? 0.7 : 0) +
    (row.hasExamples ? 0.8 : 0);

  return Math.max(1, Math.min(9.5, Number(score.toFixed(1))));
}

function buildRows(): ReadinessRow[] {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Record<
    string,
    unknown
  >;

  return walk(ARTICLE_ROOT)
    .sort()
    .map((file) => {
      const source = fs.readFileSync(file, "utf8");
      const title = readMeta(source, "title") || path.basename(file, ".tsx");
      const category = readMeta(source, "category");
      const subcategory = readMeta(source, "subcategory");
      const slug = readMeta(source, "slug") || path.basename(file, ".tsx");
      const words =
        source
          .replace(/<[^>]+>/g, " ")
          .match(/[A-Za-z0-9][A-Za-z0-9+\-/]*/g)?.length ?? 0;
      const row = {
        file: path.relative(ROOT, file),
        category,
        subcategory,
        slug,
        title,
        words,
        diagrams: source.match(/<ArticleImage\b/g)?.length ?? 0,
        questions:
          source.match(/<h3[^>]*>\s*(?:Q:|Question)/gi)?.length ?? 0,
        hasReferences: /References|Reference/i.test(source),
        hasExamples: hasManifestExamples(manifest, category, subcategory, slug, title),
      };
      const score = scoreRow(row);
      return { ...row, score, level: readinessLevel(score) };
    });
}

function main() {
  const rows = buildRows();
  const byLevel = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.level] = (acc[row.level] ?? 0) + 1;
    return acc;
  }, {});
  const average =
    rows.reduce((total, row) => total + row.score, 0) / Math.max(1, rows.length);

  console.log(
    JSON.stringify(
      {
        articleCount: rows.length,
        averageScore: Number(average.toFixed(1)),
        byLevel,
        weakest: rows
          .toSorted((a, b) => a.score - b.score)
          .slice(0, 25)
          .map((row) => ({
            score: row.score,
            level: row.level,
            file: row.file,
            words: row.words,
            diagrams: row.diagrams,
            questions: row.questions,
            hasReferences: row.hasReferences,
            hasExamples: row.hasExamples,
          })),
      },
      null,
      2,
    ),
  );
}

main();

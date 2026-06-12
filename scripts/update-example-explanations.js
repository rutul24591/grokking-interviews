#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const ARTICLES_ROOT = path.join(ROOT, "content", "articles");
const EXAMPLES_ROOT = path.join(ROOT, "content", "examples");
const MANIFEST_PATH = path.join(ROOT, "content", "examples-manifest.json");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");

const HIGH_LEVEL_ALIASES = {
  "ads-and-monetization-systems": "ads-monetization-systems",
  "cross-platform-and-mobile-systems": "cross-platform-mobile-systems",
  "e-commerce-and-marketplace": "ecommerce-marketplace",
  "emerging-and-future-systems": "emerging-future-systems",
  "error-handling-and-reliability-systems": "error-handling-reliability-systems",
  "experimentation-and-growth-systems": "experimentation-growth-systems",
  "knowledge-and-content-systems": "knowledge-content-systems",
  "maps-and-location-intelligence": "maps-location-intelligence",
  "media-and-rich-content-systems": "media-rich-content-systems",
  "messaging-and-communication": "messaging-communication",
  "payments-and-fintech-systems": "payments-fintech-systems",
  "realtime-and-collaboration-systems": "realtime-collaboration-systems",
  "scheduling-and-calendar-systems": "scheduling-calendar-systems",
  "search-and-discovery-systems": "search-discovery-systems",
  "security-auth-and-privacy-systems": "security-auth-privacy-systems",
  "social-and-engagement": "social-engagement",
};

const LOW_LEVEL_ALIASES = {
  "ai-modern-systems": "ai-modern-systems-lld",
  "offline-advanced-ux-systems": "offline-advanced-ux",
};

function isDirectory(target) {
  try {
    return fs.statSync(target).isDirectory();
  } catch {
    return false;
  }
}

function isFile(target) {
  try {
    return fs.statSync(target).isFile();
  } catch {
    return false;
  }
}

function listDir(target) {
  if (!isDirectory(target)) return [];
  return fs.readdirSync(target, { withFileTypes: true });
}

function walkFiles(dir, predicate = () => true) {
  const out = [];
  for (const entry of listDir(dir)) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "dist") {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, predicate));
    else if (entry.isFile() && predicate(full)) out.push(full);
  }
  return out;
}

function posixRelative(from, target) {
  return path.relative(from, target).split(path.sep).join(path.posix.sep);
}

function humanizeSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => {
      if (part.length <= 3 && /^[a-z0-9]+$/.test(part)) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/gi, "and")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractString(source, key) {
  // eslint-disable-next-line security/detect-non-literal-regexp -- key is an internal metadata field name.
  const match = source.match(new RegExp(`${key}:\\s*"([^"]+)"|${key}:\\s*'([^']+)'`));
  return match ? match[1] || match[2] : "";
}

function extractArray(source, key) {
  // eslint-disable-next-line security/detect-non-literal-regexp -- key is an internal metadata field name.
  const match = source.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"|'([^']+)'/g)].map((item) =>
    cleanText(item[1] || item[2]),
  );
}

function extractHeadings(source) {
  return [...source.matchAll(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/g)]
    .map((match) => cleanText(match[1]))
    .filter(Boolean)
    .filter((heading) => !/references/i.test(heading))
    .slice(0, 18);
}

function extractParagraphSignals(source) {
  return [...source.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map((match) => cleanText(match[1]))
    .filter((text) => text.length > 80)
    .slice(0, 4);
}

function articleKeysFromPath(file, metadata) {
  const relative = path.relative(ARTICLES_ROOT, file).split(path.sep);
  const slug = metadata.slug || path.basename(file, ".tsx");
  const keys = [];

  if (relative[0] === "system-design") {
    keys.push(`${relative[1]}/${relative[2]}/${slug}`);
  } else if (relative[0] === "requirements") {
    keys.push(`${relative[1]}/${relative[2]}/${slug}`);
  } else if (relative[0] === "system-design-problems") {
    keys.push(`${relative[1]}/${relative[2]}/${slug}`);
  } else if (relative[0] === "other") {
    if (relative[1] === "artificial-intelligence") keys.push(`other/artificial-intelligence/${slug}`);
    if (relative[1] === "data-structures-algorithms") keys.push(`other/${relative[2]}/${slug}`);
    if (relative[1] === "leetcode") keys.push(`other/${relative[2]}/${slug}`);
  }

  if (metadata.category && metadata.subcategory) {
    keys.push(`${metadata.category.replace("-concepts", "")}/${metadata.subcategory}/${slug}`);
  }

  return [...new Set(keys)];
}

function buildArticleIndex() {
  const index = new Map();
  const articles = walkFiles(ARTICLES_ROOT, (file) => file.endsWith(".tsx"));

  for (const file of articles) {
    const source = fs.readFileSync(file, "utf8");
    const metadata = {
      title: cleanText(extractString(source, "title")) || humanizeSlug(path.basename(file, ".tsx")),
      description: cleanText(extractString(source, "description")),
      category: cleanText(extractString(source, "category")),
      subcategory: cleanText(extractString(source, "subcategory")),
      slug: cleanText(extractString(source, "slug")) || path.basename(file, ".tsx"),
      tags: extractArray(source, "tags"),
      headings: extractHeadings(source),
      paragraphs: extractParagraphSignals(source),
      file,
    };

    for (const key of articleKeysFromPath(file, metadata)) {
      if (!index.has(key)) index.set(key, metadata);
    }
  }

  return { index, count: articles.length };
}

function findExampleTopicDirs() {
  const dirs = [];

  function visit(dir) {
    const entries = listDir(dir);
    if (!entries.length) return;
    const exampleDirs = entries
      .filter((entry) => entry.isDirectory() && /^example-\d+$/.test(entry.name))
      .map((entry) => path.join(dir, entry.name));
    if (exampleDirs.length) {
      dirs.push({ topicDir: dir, exampleDirs });
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) visit(path.join(dir, entry.name));
    }
  }

  visit(EXAMPLES_ROOT);
  return dirs.sort((a, b) => a.topicDir.localeCompare(b.topicDir));
}

function manifestKeyForTopicDir(topicDir) {
  const parts = path.relative(EXAMPLES_ROOT, topicDir).split(path.sep);

  if (parts[0] === "system-design-concepts") {
    return `${parts[1]}/${parts[2]}/${parts[3]}`;
  }

  if (parts[0] === "requirements") {
    return `${parts[1]}/${parts[2]}/${parts[3]}`;
  }

  if (parts[0] === "system-design-problems") {
    return `${parts[1]}/${parts[2]}/${parts[3]}`;
  }

  if (parts[0] === "other") {
    if (parts[1] === "artificial-intelligence") return `other/artificial-intelligence/${parts[3]}`;
    if (parts[1] === "data-structures-algorithms") return `other/${parts[2]}/${parts[3]}`;
    if (parts[1] === "leetcode") return `other/${parts[2]}/${parts[3]}`;
  }

  return parts.join("/");
}

function articleLookupKeys(manifestKey) {
  const parts = manifestKey.split("/");
  const keys = [manifestKey];

  if (parts[0] === "high-level-design") {
    const sub = HIGH_LEVEL_ALIASES[parts[1]] ?? parts[1];
    keys.push(`high-level-design/${sub}/${parts[2]}`);
  }

  if (parts[0] === "low-level-design") {
    const sub = LOW_LEVEL_ALIASES[parts[1]] ?? parts[1];
    keys.push(`low-level-design/${sub}/${parts[2]}`);
  }

  return [...new Set(keys)];
}

function resolveArticle(index, manifestKey) {
  for (const key of articleLookupKeys(manifestKey)) {
    const article = index.get(key);
    if (article) return article;
  }
  const slug = manifestKey.split("/").at(-1) ?? "example";
  return {
    title: humanizeSlug(slug),
    description: "",
    tags: [],
    headings: [],
    paragraphs: [],
    file: "",
    slug,
  };
}

function readTextFile(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function summarizeFile(name, content) {
  const lower = name.toLowerCase();
  const text = content.replace(/\s+/g, " ").trim();

  if (lower === "readme.md") return "Documents how to run, inspect, or reason about the example.";
  if (lower === "package.json") return "Declares the runnable package metadata and dependencies for the example.";
  if (lower === "explanation.md") return "";
  if (lower.endsWith(".json")) return "Provides structured configuration, sample data, schema, or expected output used by the example.";
  if (lower.endsWith(".yaml") || lower.endsWith(".yml")) return "Defines operational configuration that controls the example behavior.";
  if (lower.endsWith(".md")) return "Adds supporting notes, runbook detail, or scenario context.";
  if (lower.includes("test") || lower.includes("spec")) return "Exercises behavior and guards important edge cases or invariants.";
  if (lower.includes("api") || lower.includes("route")) return "Models an API boundary, request handling path, or backend contract.";
  if (lower.includes("store") || lower.includes("state")) return "Models client or service state transitions and update behavior.";
  if (lower.includes("policy") || lower.includes("guard")) return "Centralizes business rules, validation, limits, or fallback decisions.";
  if (lower.includes("domain") || lower.includes("model")) return "Defines the domain entities and typed structures used across the example.";
  if (lower.includes("demo") || lower.includes("app") || lower.includes("main") || lower.includes("run")) {
    return "Runs the main scenario and connects the supporting modules into an end-to-end flow.";
  }
  if (/\.(ts|tsx|js|jsx|py)$/.test(lower)) {
    const functions = [...content.matchAll(/(?:function|const|let|var|class)\s+([A-Za-z0-9_]+)/g)]
      .map((match) => match[1])
      .filter(Boolean)
      .slice(0, 5);
    if (functions.length) return `Implements the main logic, including ${functions.join(", ")}.`;
    return "Implements the executable logic or UI behavior for the example.";
  }

  return text ? `Provides supporting example content: ${text.slice(0, 140)}.` : "Provides supporting content for the example.";
}

function detectBehaviors(files) {
  const combined = files.map((file) => `${file.name}\n${file.content}`).join("\n").toLowerCase();
  const checks = [
    [/abortcontroller|cancel|cancellation|signal\.aborted/, "request cancellation and cleanup"],
    [/retry|backoff|jitter/, "retry, backoff, or jitter behavior"],
    [/timeout|deadline/, "timeout and deadline handling"],
    [/cache|etag|stale|ttl/, "cache freshness, staleness, or invalidation"],
    [/pagination|cursor|page/, "pagination or cursor handling"],
    [/rate.?limit|throttle|quota/, "rate limiting or throttling"],
    [/idempot|dedupe|duplicate/, "idempotency or duplicate protection"],
    [/auth|token|permission|role|rbac|oauth|jwt/, "authentication or authorization boundaries"],
    [/validate|validation|schema|sanitize|constraint/, "input validation and schema safety"],
    [/error|fallback|degrade|recover|exception/, "error handling and fallback behavior"],
    [/queue|worker|job|stream|event|topic/, "asynchronous or event-driven flow"],
    [/lock|race|concurrent|conflict|transaction/, "concurrency, conflict, or transaction behavior"],
    [/offline|reconnect|sync|resume/, "offline, reconnect, resume, or sync behavior"],
    [/metric|trace|log|observe|alert|slo|sla/, "observability and operational signals"],
    [/empty|null|undefined|missing/, "empty, missing, or null-state handling"],
  ];

  return checks.filter(([regex]) => regex.test(combined)).map(([, label]) => label).slice(0, 8);
}

function detectEdgeCases(files, article) {
  const behaviors = detectBehaviors(files);
  const edges = new Set();

  for (const behavior of behaviors) {
    if (behavior.includes("cancellation")) edges.add("Requests can be cancelled, abandoned, or completed out of order.");
    else if (behavior.includes("retry")) edges.add("Retries must avoid retry storms and should only repeat safe operations.");
    else if (behavior.includes("timeout")) edges.add("Slow dependencies need explicit timeouts and caller-visible failure semantics.");
    else if (behavior.includes("cache")) edges.add("Cached data can become stale and needs invalidation or freshness checks.");
    else if (behavior.includes("pagination")) edges.add("Large result sets need stable pagination and empty-page behavior.");
    else if (behavior.includes("rate")) edges.add("Burst traffic and abusive callers need fair throttling without blocking critical paths.");
    else if (behavior.includes("idempotency")) edges.add("Duplicate submissions or replayed messages must not create duplicate side effects.");
    else if (behavior.includes("auth")) edges.add("Unauthorized or expired sessions must fail safely without leaking protected data.");
    else if (behavior.includes("validation")) edges.add("Malformed, partial, or schema-incompatible input must be rejected clearly.");
    else if (behavior.includes("fallback")) edges.add("Fallback paths should preserve user trust and avoid hiding persistent failures.");
    else if (behavior.includes("event")) edges.add("Asynchronous work can arrive late, out of order, or more than once.");
    else if (behavior.includes("concurrency")) edges.add("Concurrent updates can race and must protect shared invariants.");
    else if (behavior.includes("offline")) edges.add("Reconnect and resume flows need conflict handling and progress recovery.");
    else if (behavior.includes("observability")) edges.add("Metrics, logs, traces, or alerts must explain production failures.");
    else if (behavior.includes("empty")) edges.add("Empty, missing, or null data should produce intentional UI or service states.");
  }

  const articleText = `${article.title} ${article.description} ${article.tags.join(" ")}`.toLowerCase();
  if (/security|auth|privacy|xss|csrf|token|permission/.test(articleText)) {
    edges.add("Security-sensitive paths need least-privilege checks and safe failure behavior.");
  }
  if (/scale|performance|latency|optimization|cache|cdn/.test(articleText)) {
    edges.add("High load can expose latency, memory, cache, or backpressure issues.");
  }
  if (/real.?time|websocket|stream|collaboration|offline/.test(articleText)) {
    edges.add("Real-time flows need reconnect, ordering, and duplicate-message handling.");
  }
  if (/storage|database|consistency|transaction|replica|shard/.test(articleText)) {
    edges.add("Storage flows need clear consistency, repair, and replay behavior.");
  }

  if (!edges.size) {
    edges.add("Invalid input, empty data, and dependency failures should be tested explicitly.");
    edges.add("Production implementations should add observability around latency, errors, and state transitions.");
  }

  return [...edges].slice(0, 8);
}

function collectExampleFiles(exampleDir) {
  return walkFiles(exampleDir)
    .filter((file) => isFile(file))
    .map((file) => ({
      path: file,
      name: posixRelative(exampleDir, file),
      content: readTextFile(file),
    }))
    .sort((a, b) => {
      if (a.name.toLowerCase() === "explanation.md") return -1;
      if (b.name.toLowerCase() === "explanation.md") return 1;
      return a.name.localeCompare(b.name);
    });
}

function codeFiles(files) {
  return files.filter((file) => !/^explanation\.md$/i.test(file.name));
}

function generateExplanation({ manifestKey, article, exampleId, files }) {
  const visible = codeFiles(files);
  const behaviorList = detectBehaviors(visible);
  const edgeCases = detectEdgeCases(visible, article);
  const headings = article.headings.length
    ? article.headings.slice(0, 10)
    : ["Definition and context", "Core concepts", "Architecture and flow", "Best practices"];
  const fileWalkthrough = visible
    .slice(0, 12)
    .map((file) => `- \`${file.name}\`: ${summarizeFile(file.name, file.content)}`)
    .join("\n");
  const behaviorText = behaviorList.length
    ? behaviorList.map((item) => `- ${item}`).join("\n")
    : "- main happy-path behavior\n- failure and boundary behavior should be inspected through the listed files";

  return `# ${article.title} - ${exampleId} Explanation

## Article context
This example supports the article \`${manifestKey}\`. The article is about ${article.description || article.title}. The most relevant article sections for this example are: ${headings.join("; ")}.

## What this example demonstrates
This example turns the article concept into a concrete implementation artifact. Read it as a small production-style slice rather than an isolated snippet: the files show the domain model, execution path, supporting configuration, tests or demo harness, and operational assumptions that make the article easier to apply in real systems.

## How it supports the article
The example reinforces the article by showing how the concept behaves when data moves through real boundaries: inputs are accepted, state or decisions are derived, outputs are returned, and failures are handled or surfaced. For interview preparation, connect each file back to the article sections above and explain why the implementation choices match the article's trade-offs.

## File-by-file walkthrough
${fileWalkthrough || "- No supporting code files were found besides this explanation."}

## Execution and data flow
Start from the app, demo, server, route, or run file when present. That entrypoint wires together the supporting modules, executes the main scenario, and prints or renders the result. Domain or model files define the entities. API, route, client, store, policy, config, or utility files express the boundaries and rules. README or notes files explain how to run or inspect the example locally.

## Important implementation behavior
${behaviorText}

## Edge cases and failure modes
${edgeCases.map((item) => `- ${item}`).join("\n")}

## How to use this example
Use the README if present, then inspect the entrypoint and supporting modules in order. While reading, ask: what invariant is being protected, what boundary can fail, what state can become stale or inconsistent, and what metric or assertion would prove the example works under load or failure?

## Interview value
This example is useful for mid-level, senior, staff, and principal interviews because it gives concrete language for implementation trade-offs. A strong answer should explain the happy path, the failure path, the operational signals, and the reason the design supports the article's core idea.`;
}

function ensureExplanationFile(exampleDir, content) {
  const target = path.join(exampleDir, "EXPLANATION.md");
  if (!DRY_RUN) fs.writeFileSync(target, `${content.trim()}\n`, "utf8");
  return target;
}

function filePriority(name) {
  const lower = name.toLowerCase();
  if (lower === "explanation.md" || lower === "explanation.txt") return -1000;
  if (lower === "app/page.tsx") return -900;
  if (lower.endsWith("/route.ts") || lower.includes("/api/")) return -850;
  if (lower === "app.ts" || lower === "app.js" || lower === "main.ts" || lower === "main.js") return -800;
  if (lower === "demo.js" || lower === "demo.ts") return -750;
  if (lower === "readme.md") return 900;
  if (lower === "package.json") return 950;
  if (lower === "pnpm-lock.yaml") return 980;
  return 0;
}

function buildExampleGroup(exampleDir, exampleId) {
  const files = collectExampleFiles(exampleDir).map((file) => ({
    name: file.name,
    content: file.content,
  }));

  files.sort((a, b) => {
    const priorityDelta = filePriority(a.name) - filePriority(b.name);
    if (priorityDelta !== 0) return priorityDelta;
    return a.name.localeCompare(b.name);
  });

  const label = exampleId
    .split("-")
    .map((part, index) => (index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ");

  return { id: exampleId, label, files };
}

function updateManifest(topicDirs) {
  const existing = fs.existsSync(MANIFEST_PATH)
    ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"))
    : {};
  const entries = {};

  for (const { topicDir, exampleDirs } of topicDirs) {
    const key = manifestKeyForTopicDir(topicDir);
    entries[key] = exampleDirs
      .sort((a, b) => Number(path.basename(a).split("-")[1]) - Number(path.basename(b).split("-")[1]))
      .map((dir) => buildExampleGroup(dir, path.basename(dir)));
  }

  for (const key of Object.keys(entries).sort()) {
    existing[key] = entries[key];
  }

  if (!DRY_RUN) {
    fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
  }

  return { manifestKeysUpdated: Object.keys(entries).length };
}

function main() {
  const { index, count: articleCount } = buildArticleIndex();
  const topicDirs = findExampleTopicDirs();

  let exampleCount = 0;
  let missingArticleCount = 0;
  let createdExplanationCount = 0;
  let shortestWordCount = Number.POSITIVE_INFINITY;
  let shortestFile = "";

  for (const { topicDir, exampleDirs } of topicDirs) {
    const manifestKey = manifestKeyForTopicDir(topicDir);
    const article = resolveArticle(index, manifestKey);
    if (!article.file) missingArticleCount++;

    for (const exampleDir of exampleDirs) {
      const exampleId = path.basename(exampleDir);
      const beforeFiles = collectExampleFiles(exampleDir);
      const hadExplanation = beforeFiles.some((file) => /^explanation\.md$/i.test(file.name));
      const explanation = generateExplanation({
        manifestKey,
        article,
        exampleId,
        files: beforeFiles,
      });
      const target = ensureExplanationFile(exampleDir, explanation);
      if (!hadExplanation) createdExplanationCount++;
      exampleCount++;

      const wordCount = explanation.split(/\s+/).filter(Boolean).length;
      if (wordCount < shortestWordCount) {
        shortestWordCount = wordCount;
        shortestFile = target;
      }
    }
  }

  const { manifestKeysUpdated } = updateManifest(topicDirs);

  console.log(
    JSON.stringify(
      {
        dryRun: DRY_RUN,
        articlesScanned: articleCount,
        topicDirs: topicDirs.length,
        examplesUpdated: exampleCount,
        explanationsCreated: createdExplanationCount,
        topicDirsWithoutArticleMatch: missingArticleCount,
        manifestKeysUpdated,
        shortestExplanationWords: Number.isFinite(shortestWordCount) ? shortestWordCount : 0,
        shortestExplanationFile: shortestFile ? path.relative(ROOT, shortestFile) : "",
      },
      null,
      2,
    ),
  );
}

main();

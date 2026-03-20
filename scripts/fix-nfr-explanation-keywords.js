#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs/promises");
const path = require("node:path");

const STOP_WORDS = new Set(["and", "or", "the", "a", "an", "of", "to", "for", "in", "on", "with", "vs", "as"]);

const BASES = [
  path.join("content", "examples", "requirements", "backend", "nfr"),
  path.join("content", "examples", "requirements", "frontend", "nfr"),
  path.join("content", "examples", "requirements", "shared-cross-cutting-nfr", "nfr"),
  path.join("content", "examples", "requirements", "advanced-topics", "nfr"),
];

function normalizeAlphaNum(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function slugTokens(slug) {
  return slug
    .toLowerCase()
    .split("-")
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => !STOP_WORDS.has(t));
}

const TOKEN_PRETTY = new Map([
  ["api", "API"],
  ["cicd", "CI/CD"],
  ["dx", "DX"],
  ["rum", "RUM"],
  ["pwa", "PWA"],
  ["ux", "UX"],
  ["seo", "SEO"],
  ["xss", "XSS"],
  ["slo", "SLO"],
  ["sla", "SLA"],
  ["slas", "SLAs"],
  ["i18n", "i18n"],
  ["l10n", "l10n"],
  ["rtl", "RTL"],
]);

function titleCaseWord(word) {
  if (!word) return word;
  const pretty = TOKEN_PRETTY.get(word.toLowerCase());
  if (pretty) return pretty;
  return word[0].toUpperCase() + word.slice(1);
}

function topicFromSlug(slug) {
  // Keep it simple: title-case token words, preserving common acronyms.
  const parts = slug.split("-").filter(Boolean);
  return parts.map(titleCaseWord).join(" ");
}

function explanationMentionsAnyToken(explanationText, tokens) {
  const lower = explanationText.toLowerCase();
  const normalized = normalizeAlphaNum(explanationText);
  return tokens.some((t) => lower.includes(t) || normalized.includes(normalizeAlphaNum(t)));
}

function buildPrefixLine(slug) {
  const topic = topicFromSlug(slug);
  const tokens = slugTokens(slug);
  const tokensList = tokens.join(", ");
  return `In the context of ${topic} (${tokensList}), this example provides a focused implementation of the concept below.`;
}

async function exists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function* listDirectories(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) yield path.join(dir, e.name);
  }
}

function insertPrefix(original, prefixLine) {
  const text = original.replace(/\r\n/g, "\n");
  const lines = text.split("\n");

  if (lines.length === 0) return prefixLine + "\n";

  // If it starts with an H1, insert after the first line.
  if (lines[0].startsWith("# ")) {
    const head = lines[0];
    const rest = lines.slice(1).join("\n").replace(/^\n+/, "\n");
    return `${head}\n\n${prefixLine}\n${rest.startsWith("\n") ? "" : "\n"}${rest}`;
  }

  // Otherwise, insert at the top.
  const trimmed = text.replace(/^\n+/, "");
  return `${prefixLine}\n\n${trimmed}`;
}

async function main() {
  const patched = [];
  let scanned = 0;
  let skipped = 0;

  for (const base of BASES) {
    if (!(await exists(base))) continue;
    for await (const articleDir of listDirectories(base)) {
      const slug = path.basename(articleDir);
      const tokens = slugTokens(slug);
      if (tokens.length === 0) continue;

      for (const exampleNum of [2, 3]) {
        const explanationPath = path.join(articleDir, `example-${exampleNum}`, "EXPLANATION.md");
        if (!(await exists(explanationPath))) continue;
        scanned++;

        const original = await fs.readFile(explanationPath, "utf8");
        if (explanationMentionsAnyToken(original, tokens)) {
          skipped++;
          continue;
        }

        const prefixLine = buildPrefixLine(slug);
        const next = insertPrefix(original, prefixLine);

        // Safety: ensure we actually introduced at least one token.
        if (!explanationMentionsAnyToken(next, tokens)) {
          throw new Error(`Prefix insertion failed token check for ${explanationPath}`);
        }

        await fs.writeFile(explanationPath, next, "utf8");
        patched.push(explanationPath);
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        scanned,
        patched: patched.length,
        skipped,
        patchedFiles: patched,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


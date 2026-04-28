#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Quick audit utility: counts highlight tiers per <h2> section for TSX articles.
 *
 * Usage:
 *   node scripts/audit-highlights.js <file-or-dir> [...]
 *
 * Notes:
 * - This is a lightweight heuristic based on string matching; it's not a TSX parser.
 * - We treat both <HighlightBlock tier="..."> and <ArticleImage captionTier="..."> as highlights.
 * - References are skipped by default.
 */

const fs = require("node:fs");
const path = require("node:path");

function collectTsxFiles(entry) {
  const stat = fs.statSync(entry);
  if (stat.isFile()) return [entry];
  const files = [];
  for (const name of fs.readdirSync(entry)) {
    const full = path.join(entry, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) continue;
    if (full.endsWith(".tsx")) files.push(full);
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function countMatches(haystack, needleRe) {
  const m = haystack.match(needleRe);
  return m ? m.length : 0;
}

function summarizeFile(filePath) {
  const src = fs.readFileSync(filePath, "utf8");

  const h2Re = /<h2>([\s\S]*?)<\/h2>/g;
  const sections = [];
  let match;
  while ((match = h2Re.exec(src))) {
    sections.push({
      title: match[1].replace(/\s+/g, " ").trim(),
      start: match.index + match[0].length,
    });
  }

  if (sections.length === 0) {
    return { filePath, sections: [], ok: true, note: "No <h2> headings found" };
  }

  for (let i = 0; i < sections.length; i++) {
    sections[i].end = i + 1 < sections.length ? sections[i + 1].start - 1 : src.length;
    const block = src.slice(sections[i].start, sections[i].end);

    const crucial =
      countMatches(block, /tier="crucial"/g) +
      countMatches(block, /captionTier="crucial"/g);
    const important =
      countMatches(block, /tier="important"/g) +
      countMatches(block, /captionTier="important"/g);

    sections[i].counts = { crucial, important };
    sections[i].skip = /references/i.test(sections[i].title);
  }

  const failures = sections.filter((s) => !s.skip && (s.counts.crucial < 1 || s.counts.important < 2));
  return { filePath, sections, ok: failures.length === 0, failures };
}

function main(argv) {
  const args = argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: node scripts/audit-highlights.js <file-or-dir> [...]");
    process.exit(2);
  }

  const files = args.flatMap((entry) => collectTsxFiles(entry));
  if (files.length === 0) {
    console.error("No .tsx files found in provided inputs.");
    process.exit(2);
  }

  const results = files.map(summarizeFile);
  const failing = results.filter((r) => !r.ok);

  for (const r of results) {
    const rel = path.relative(process.cwd(), r.filePath);
    if (r.ok) {
      console.log(`OK  ${rel}`);
      continue;
    }
    console.log(`FAIL ${rel}`);
    for (const s of r.failures) {
      console.log(
        `  - ${s.title}: crucial=${s.counts.crucial}, important=${s.counts.important}`,
      );
    }
  }

  console.log("");
  console.log(
    `Summary: ${results.length - failing.length}/${results.length} files meet threshold (>=1 crucial and >=2 important per section, excluding References).`,
  );

  process.exit(failing.length === 0 ? 0 : 1);
}

main(process.argv);


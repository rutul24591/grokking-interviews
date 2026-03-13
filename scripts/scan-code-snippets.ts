#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
const TARGET_DIRS = [
  path.join(ROOT, "content", "articles", "frontend"),
  path.join(ROOT, "content", "articles", "backend"),
];

const FILE_GLOB = /-extensive\.tsx$/;
const CODE_BLOCK_START = "<code>{`";
const CODE_BLOCK_END = "`}</code>";

const args = new Set(process.argv.slice(2));
const shouldFix = args.has("--fix");

function listExtensiveFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listExtensiveFiles(fullPath));
    } else if (FILE_GLOB.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function hasUnescapedBacktick(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    if (value[i] !== "`") continue;
    let backslashes = 0;
    let j = i - 1;
    while (j >= 0 && value[j] === "\\") {
      backslashes += 1;
      j -= 1;
    }
    if (backslashes % 2 === 0) return true;
  }
  return false;
}

function rewriteTemplateLiteral(snippet: string): string {
  // Replace inner template literal sections with string concatenation.
  let out = "";
  let index = 0;
  while (true) {
    const open = snippet.indexOf("{`", index);
    if (open === -1) {
      out += snippet.slice(index);
      break;
    }
    const close = snippet.indexOf("`}", open + 2);
    if (close === -1) {
      out += snippet.slice(index);
      break;
    }

    out += snippet.slice(index, open);
    const inner = snippet.slice(open + 2, close);
    const lines = inner.split("\n");
    const indentMatch = /\n(\s*)$/.exec(out);
    const baseIndent = indentMatch ? indentMatch[1] : "";

    const concatenated = lines
      .map((line, idx) => {
        const escaped = line.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
        const suffix = idx < lines.length - 1 ? "\\n" : "";
        return `${baseIndent}  \"${escaped}${suffix}\"`;
      })
      .join(" +\n");

    out += "{\n" + concatenated + "\n" + baseIndent + "}";
    index = close + 2;
  }
  return out;
}

function processFile(filePath: string): { updated: boolean; issues: number } {
  const original = fs.readFileSync(filePath, "utf-8");
  let content = original;
  let cursor = 0;
  let issues = 0;

  while (true) {
    const start = content.indexOf(CODE_BLOCK_START, cursor);
    if (start === -1) break;
    const end = content.indexOf(CODE_BLOCK_END, start + CODE_BLOCK_START.length);
    if (end === -1) break;

    const snippetStart = start + CODE_BLOCK_START.length;
    const snippet = content.slice(snippetStart, end);

    if (snippet.includes("{`") && snippet.includes("`}")) {
      if (hasUnescapedBacktick(snippet)) {
        issues += 1;
        if (shouldFix) {
          const rewritten = rewriteTemplateLiteral(snippet);
          content = content.slice(0, snippetStart) + rewritten + content.slice(end);
          cursor = snippetStart + rewritten.length;
          continue;
        }
      }
    }

    cursor = end + CODE_BLOCK_END.length;
  }

  if (shouldFix && content !== original) {
    fs.writeFileSync(filePath, content, "utf-8");
    return { updated: true, issues };
  }

  return { updated: false, issues };
}

function main() {
  const files = TARGET_DIRS.flatMap(listExtensiveFiles);
  let totalIssues = 0;
  let updatedFiles = 0;

  for (const file of files) {
    const result = processFile(file);
    if (result.issues > 0) {
      totalIssues += result.issues;
      const relative = path.relative(ROOT, file);
      const status = shouldFix ? "fixed" : "found";
      console.log(`${status}: ${relative} (${result.issues})`);
    }
    if (result.updated) updatedFiles += 1;
  }

  if (totalIssues === 0) {
    console.log("No unsafe nested backticks found in extensive articles.");
    return;
  }

  if (!shouldFix) {
    console.error(`Found ${totalIssues} unsafe nested backticks.`);
    process.exit(1);
  }

  console.log(`Rewrote ${totalIssues} snippet(s) across ${updatedFiles} file(s).`);
}

main();

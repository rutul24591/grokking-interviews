#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "content", "examples-manifest.json");

function isDirectory(targetPath) {
  try {
    return fs.statSync(targetPath).isDirectory();
  } catch {
    return false;
  }
}

function isFile(targetPath) {
  try {
    return fs.statSync(targetPath).isFile();
  } catch {
    return false;
  }
}

function listDirs(dir) {
  if (!isDirectory(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function listFilesRecursive(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFilesRecursive(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

function posixRelative(fromDir, filePath) {
  return path.relative(fromDir, filePath).split(path.sep).join(path.posix.sep);
}

function filePriority(name) {
  const lower = name.toLowerCase();
  if (lower === "explanation.md" || lower === "readme.md") return -1000;
  if (lower === "app.js" || lower === "app.ts" || lower === "app.tsx") return -900;
  if (lower === "demo.js" || lower === "demo.py") return -800;
  return 0;
}

function sortFilesByPriority(files) {
  return [...files].sort((left, right) => {
    const priorityDelta = filePriority(left.name) - filePriority(right.name);
    if (priorityDelta !== 0) return priorityDelta;
    return left.name.localeCompare(right.name);
  });
}

function buildExampleGroup(exampleDir, exampleId) {
  const files = listFilesRecursive(exampleDir)
    .filter((filePath) => isFile(filePath))
    .map((filePath) => ({
      name: posixRelative(exampleDir, filePath),
      content: fs.readFileSync(filePath, "utf-8"),
    }));

  const label = exampleId
    .split("-")
    .map((part, index) =>
      index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part,
    )
    .join(" ");

  return {
    id: exampleId,
    label,
    files: sortFilesByPriority(files),
  };
}

function collectEntries({ rootDir, manifestSubcategory }) {
  if (!isDirectory(rootDir)) return {};

  const entries = {};
  for (const slug of listDirs(rootDir)) {
    const slugDir = path.join(rootDir, slug);
    const examples = listDirs(slugDir)
      .filter((name) => /^example-\d+$/.test(name))
      .sort((left, right) => Number(left.split("-")[1]) - Number(right.split("-")[1]))
      .map((exampleId) => buildExampleGroup(path.join(slugDir, exampleId), exampleId));

    if (examples.length > 0) entries[`other/${manifestSubcategory}/${slug}`] = examples;
  }

  return entries;
}

function main() {
  const existing = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

  const sources = [
    {
      rootDir: path.join(
        ROOT,
        "content",
        "examples",
        "other",
        "artificial-intelligence",
        "core-concepts",
      ),
      manifestSubcategory: "artificial-intelligence",
    },
    {
      rootDir: path.join(
        ROOT,
        "content",
        "examples",
        "other",
        "artificial-intelligence",
        "additional-topics",
      ),
      manifestSubcategory: "artificial-intelligence",
    },
    {
      rootDir: path.join(
        ROOT,
        "content",
        "examples",
        "other",
        "data-structures-algorithms",
        "data-structures",
      ),
      manifestSubcategory: "data-structures",
    },
    {
      rootDir: path.join(
        ROOT,
        "content",
        "examples",
        "other",
        "data-structures-algorithms",
        "algorithms",
      ),
      manifestSubcategory: "algorithms",
    },
  ];

  const nextEntries = Object.assign({}, ...sources.map(collectEntries));
  const updatedKeys = Object.keys(nextEntries).sort();

  for (const key of updatedKeys) existing[key] = nextEntries[key];

  fs.writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify(existing, null, 2)}\n`,
    "utf-8",
  );

  console.log(`Updated examples-manifest.json with ${updatedKeys.length} other-domain key(s).`);
  for (const key of updatedKeys) console.log(`- ${key}`);
}

main();

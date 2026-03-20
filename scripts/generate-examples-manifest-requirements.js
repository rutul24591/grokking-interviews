#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "content", "examples-manifest.json");
const REQUIREMENTS_EXAMPLES_ROOT = path.join(
  ROOT,
  "content",
  "examples",
  "requirements",
);

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function listDirs(p) {
  if (!isDirectory(p)) return [];
  return fs
    .readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function listFilesRecursive(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === "dist"
      ) {
        continue;
      }
      out.push(...listFilesRecursive(full));
      continue;
    }
    if (entry.isFile()) out.push(full);
  }

  return out;
}

function posixRelative(fromDir, filePath) {
  return path.relative(fromDir, filePath).split(path.sep).join(path.posix.sep);
}

function filePriority(name) {
  const lower = name.toLowerCase();
  if (lower === "explanation.md" || lower === "explanation.txt") return -1000;
  if (lower === "app/page.tsx") return -900;
  if (lower.endsWith("/route.ts") || lower.includes("/api/")) return -800;
  if (lower === "src/agent/run.ts" || lower === "agent/run.ts") return -700;
  if (lower === "readme.md") return 900;
  if (lower === "package.json") return 950;
  if (lower === "pnpm-lock.yaml") return 980;
  return 0;
}

function sortFilesByPriority(files) {
  return [...files].sort((a, b) => {
    const pa = filePriority(a.name);
    const pb = filePriority(b.name);
    if (pa !== pb) return pa - pb;
    return a.name.localeCompare(b.name);
  });
}

function buildExampleGroup(exampleDir, exampleId) {
  const filePaths = listFilesRecursive(exampleDir);
  const files = filePaths
    .filter((p) => isFile(p))
    .map((p) => ({
      name: posixRelative(exampleDir, p),
      content: fs.readFileSync(p, "utf-8"),
    }));

  const label = exampleId
    .split("-")
    .map((part, idx) =>
      idx === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part,
    )
    .join(" ");

  return {
    id: exampleId,
    label,
    files: sortFilesByPriority(files),
  };
}

function buildRequirementsEntries() {
  if (!isDirectory(REQUIREMENTS_EXAMPLES_ROOT)) return {};

  const out = {};

  for (const category of listDirs(REQUIREMENTS_EXAMPLES_ROOT)) {
    const categoryDir = path.join(REQUIREMENTS_EXAMPLES_ROOT, category);
    for (const subcategory of listDirs(categoryDir)) {
      const subDir = path.join(categoryDir, subcategory);
      for (const slug of listDirs(subDir)) {
        const slugDir = path.join(subDir, slug);

        const examples = listDirs(slugDir)
          .filter((name) => /^example-\d+$/.test(name))
          .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]))
          .map((exampleId) =>
            buildExampleGroup(path.join(slugDir, exampleId), exampleId),
          );

        if (examples.length > 0) {
          const manifestKey = `${category}/${subcategory}/${slug}`;
          out[manifestKey] = examples;
        }
      }
    }
  }

  return out;
}

function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Manifest not found at ${MANIFEST_PATH}`);
  }

  const existing = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const requirementsEntries = buildRequirementsEntries();

  const updatedKeys = Object.keys(requirementsEntries).sort();
  for (const key of updatedKeys) existing[key] = requirementsEntries[key];

  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(existing, null, 2) + "\n",
    "utf-8",
  );

  console.log(
    `Updated examples-manifest.json with ${updatedKeys.length} requirements key(s).`,
  );
  for (const key of updatedKeys) console.log(`- ${key}`);
}

main();


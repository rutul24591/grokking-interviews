import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const WEB_DIR = path.join(ROOT, "apps", "web");

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full));
    if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx") || entry.name.endsWith(".js"))) out.push(full);
  }
  return out;
}

// This example checks a small fixture tree (not the full repo).
// It expects you to run it from within the example folder where `apps/web` exists.
const files = fs.existsSync(WEB_DIR) ? listFiles(WEB_DIR) : [];
const violations = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf-8");
  const patterns = [
    "from \"../api",
    "from '../api",
    "from \"../../api",
    "from '../../api",
    "apps/api"
  ];
  if (patterns.some((p) => text.includes(p))) violations.push(file);
}

if (violations.length > 0) {
  process.stdout.write("Boundary violations detected (web must not import api internals):\n");
  for (const v of violations) process.stdout.write(`- ${path.relative(ROOT, v)}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("No boundary violations detected.\n");
}

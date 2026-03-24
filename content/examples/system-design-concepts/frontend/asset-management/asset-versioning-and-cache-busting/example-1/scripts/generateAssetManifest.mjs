import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, "public", "assets");
const OUTPUT_DIR = path.join(ROOT, "public", "assets-hashed");
const MANIFEST_PATH = path.join(ROOT, "lib", "generated", "assets-manifest.json");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function listFiles(dir) {
  return fs
    .readdirSync(dir)
    .map((name) => path.join(dir, name))
    .filter((p) => isFile(p));
}

function hashBytes(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex").slice(0, 10);
}

function main() {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  ensureDir(OUTPUT_DIR);
  ensureDir(path.dirname(MANIFEST_PATH));

  const manifest = {};

  for (const filePath of listFiles(INPUT_DIR)) {
    const bytes = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const hash = hashBytes(bytes);

    const outputName = `${base}.${hash}${ext}`;
    const outputPath = path.join(OUTPUT_DIR, outputName);

    fs.writeFileSync(outputPath, bytes);
    manifest[path.basename(filePath)] = `/assets-hashed/${outputName}`;
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  console.log(`Generated ${Object.keys(manifest).length} asset(s).`);
}

main();

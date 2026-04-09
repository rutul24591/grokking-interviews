import * as fs from "fs";
import * as path from "path";

export const REPO_ROOT = process.cwd();
export const ORCHESTRATION_ROOT = path.join(REPO_ROOT, "orchestration");
export const STATE_ROOT = path.join(REPO_ROOT, ".agent-state");

export function nowIso() {
  return new Date().toISOString();
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function readText(filePath: string) {
  return fs.readFileSync(filePath, "utf-8");
}

export function writeText(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}

export function readJson<T>(filePath: string): T {
  return JSON.parse(readText(filePath)) as T;
}

export function writeJson(filePath: string, value: unknown) {
  writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function relativeToRepo(filePath: string) {
  return path.relative(REPO_ROOT, filePath) || ".";
}

export function resolveWithinRepo(...segments: string[]) {
  return path.resolve(REPO_ROOT, ...segments);
}

export function assertWithinRepo(targetPath: string) {
  const resolved = path.resolve(targetPath);

  if (!resolved.startsWith(REPO_ROOT)) {
    throw new Error(`Refusing to access path outside repo: ${targetPath}`);
  }

  return resolved;
}

export function copyFile(sourcePath: string, destinationPath: string) {
  ensureDir(path.dirname(destinationPath));
  fs.copyFileSync(sourcePath, destinationPath);
}

export function fileExists(filePath: string) {
  return fs.existsSync(filePath);
}

export function listFiles(dirPath: string, predicate?: (entryPath: string) => boolean) {
  if (!fileExists(dirPath)) {
    return [];
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath, predicate));
      continue;
    }

    if (!predicate || predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

export function randomId(prefix: string) {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${suffix}`;
}

export function truncate(value: string, maxChars: number) {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, maxChars)}\n...<truncated>`;
}

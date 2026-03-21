import fs from "node:fs";
import path from "node:path";

export type Finding = {
  file: string;
  level: "error" | "warn";
  message: string;
};

function hasSection(md: string, heading: string): boolean {
  const re = new RegExp(`^#\\s+${heading}\\s*$`, "m");
  return re.test(md);
}

function extractFrontmatter(md: string): Record<string, string> {
  const m = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return {};
  const lines = m[1].split("\n");
  const out: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
    out[k] = v;
  }
  return out;
}

function hasCommandBlock(md: string): boolean {
  return /```bash[\s\S]*?```/m.test(md);
}

export function lintDocs(rootDir: string) {
  const docsDir = path.join(rootDir, "docs");
  const files = fs.readdirSync(docsDir).filter((f) => f.endsWith(".md"));
  const findings: Finding[] = [];

  for (const f of files) {
    const full = path.join(docsDir, f);
    const md = fs.readFileSync(full, "utf-8");
    const fm = extractFrontmatter(md);

    if (!fm.lastUpdated) findings.push({ file: f, level: "error", message: "Missing frontmatter:lastUpdated" });
    if (!fm.owner) findings.push({ file: f, level: "warn", message: "Missing frontmatter:owner" });

    if (!hasSection(md, "Overview")) findings.push({ file: f, level: "error", message: "Missing section: Overview" });
    if (!hasSection(md, "Runbook")) findings.push({ file: f, level: "error", message: "Missing section: Runbook" });
    if (!hasSection(md, "Ownership")) findings.push({ file: f, level: "warn", message: "Missing section: Ownership" });

    if (hasSection(md, "Runbook") && !hasCommandBlock(md)) {
      findings.push({ file: f, level: "warn", message: "Runbook has no ```bash``` command block" });
    }
  }

  const errors = findings.filter((x) => x.level === "error").length;
  const warns = findings.filter((x) => x.level === "warn").length;
  return { files, errors, warns, findings };
}


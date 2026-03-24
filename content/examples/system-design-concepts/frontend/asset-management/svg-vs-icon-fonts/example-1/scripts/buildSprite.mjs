import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ICONS_DIR = path.join(ROOT, "icons");
const OUT = path.join(ROOT, "public", "sprite.svg");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function stripOuterSvg(svg) {
  return svg
    .replace(/<\?xml[^>]*>/g, "")
    .replace(/<!doctype[^>]*>/gi, "")
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "")
    .trim();
}

function main() {
  if (!fs.existsSync(ICONS_DIR)) throw new Error(`Missing icons dir: ${ICONS_DIR}`);
  ensureDir(path.dirname(OUT));

  const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith(".svg")).sort();
  const symbols = files.map((file) => {
    const name = path.basename(file, ".svg");
    const raw = fs.readFileSync(path.join(ICONS_DIR, file), "utf-8");
    const inner = stripOuterSvg(raw);
    return `<symbol id="${name}" viewBox="0 0 24 24">${inner}</symbol>`;
  });

  const out = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join(
    "\n",
  )}\n</svg>\n`;

  fs.writeFileSync(OUT, out, "utf-8");
  console.log(`Built sprite with ${files.length} icon(s): ${OUT}`);
}

main();

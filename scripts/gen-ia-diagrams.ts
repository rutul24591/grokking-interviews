#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";

const DIR = "public/diagrams/requirements/functional-requirements/identity-access";
const LIST = "/tmp/ia-diagrams.txt";

if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

const diagrams = fs.readFileSync(LIST, "utf-8").split("\n").filter(l => l.trim());

console.log(`Creating ${diagrams.length} diagrams...\n`);

diagrams.forEach(f => {
  const t = f.replace(".svg", "").replace(/-/g, " ");
  const c = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <rect width="800" height="500" fill="#ffffff"/>
  <text x="400" y="240" text-anchor="middle" font-family="system-ui" font-size="16" font-weight="bold" fill="#0f172a">${t}</text>
  <text x="400" y="270" text-anchor="middle" font-family="system-ui" font-size="12" fill="#475569">Identity Access Diagram</text>
  <text x="400" y="300" text-anchor="middle" font-family="system-ui" font-size="11" fill="#475569">Valid XML</text>
</svg>`;
  fs.writeFileSync(path.join(DIR, f), c);
  console.log(`✓ ${f}`);
});

console.log(`\n✅ Created ${diagrams.length} diagrams in ${DIR}`);

#!/usr/bin/env node

/**
 * Fix SVG CSS Variables
 * 
 * Replaces CSS variables in SVGs with hardcoded color values
 * for better compatibility with VSCode preview and older browsers.
 * 
 * Usage: pnpm tsx scripts/fix-svg-variables.ts
 */

import * as fs from "fs";
import * as path from "path";

const SVG_DIR = path.join(process.cwd(), "public/diagrams/requirements/nfr/backend-nfr");

// Color mappings - replace CSS variables with actual colors
const COLOR_MAP: Record<string, string> = {
  // Background colors
  "var(--bg-primary, #ffffff)": "#ffffff",
  "var(--bg-panel, #f1f5f9)": "#f1f5f9",
  "var(--bg-secondary, #f8fafc)": "#f8fafc",
  "var(--bg-accent, #3b82f6)": "#3b82f6",
  "var(--bg-blue, #3b82f6)": "#3b82f6",
  "var(--bg-purple, #8b5cf6)": "#8b5cf6",
  "var(--bg-red, #ef4444)": "#ef4444",
  "var(--bg-green, #22c55e)": "#22c55e",
  "var(--bg-yellow, #f59e0b)": "#f59e0b",
  "var(--bg-orange, #f97316)": "#f97316",
  "var(--bg-gray, #6b7280)": "#6b7280",
  
  // Text colors
  "var(--text-primary, #0f172a)": "#0f172a",
  "var(--text-secondary, #475569)": "#475569",
  "var(--text-inverse, #ffffff)": "#ffffff",
  "var(--text-muted, #94a3b8)": "#94a3b8",
  "var(--text-blue, #3b82f6)": "#3b82f6",
  "var(--text-green, #22c55e)": "#22c55e",
  "var(--text-red, #ef4444)": "#ef4444",
  "var(--text-purple, #8b5cf6)": "#8b5cf6",
  "var(--text-orange, #f97316)": "#f97316",
  // Fix typos in original SVGs
  "var(--text-secondary, #47556ird)": "#475569",
  
  // Border colors
  "var(--border-accent, #3b82f6)": "#3b82f6",
  "var(--border-primary, #e2e8f0)": "#e2e8f0",
  "var(--border-secondary, #cbd5e1)": "#cbd5e1",
  "var(--border-blue, #3b82f6)": "#3b82f6",
  "var(--border-green, #22c55e)": "#22c55e",
  "var(--border-red, #ef4444)": "#ef4444",
  "var(--border-purple, #8b5cf6)": "#8b5cf6",
  "var(--border-orange, #f97316)": "#f97316",
  "var(--border-yellow, #f59e0b)": "#f59e0b",
  
  // Fallback without defaults
  "var(--border-accent)": "#3b82f6",
  "var(--bg-primary)": "#ffffff",
  "var(--bg-panel)": "#f1f5f9",
  "var(--bg-secondary)": "#f8fafc",
  "var(--text-primary)": "#0f172a",
  "var(--text-secondary)": "#475569",
};

function main() {
  console.log("🔧 Fixing SVG CSS variables...\n");

  const files = fs.readdirSync(SVG_DIR).filter(f => f.endsWith(".svg"));
  let updatedCount = 0;
  let totalReplacements = 0;

  for (const file of files) {
    const filePath = path.join(SVG_DIR, file);
    let content = fs.readFileSync(filePath, "utf-8");
    let fileReplacements = 0;

    for (const [cssVar, color] of Object.entries(COLOR_MAP)) {
      const regex = new RegExp(cssVar.replace(/[()]/g, "\\$&").replace(/,/g, ","), "g");
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, color);
        fileReplacements += matches.length;
      }
    }

    if (fileReplacements > 0) {
      fs.writeFileSync(filePath, content, "utf-8");
      updatedCount++;
      totalReplacements += fileReplacements;
      console.log(`✓ ${file}: ${fileReplacements} replacements`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Files updated:      ${updatedCount}`);
  console.log(`Total replacements: ${totalReplacements}`);
  console.log("\n✅ SVG variables fixed successfully!");
  console.log("\n📝 Images should now work in VSCode preview!");
  console.log("");
}

main();

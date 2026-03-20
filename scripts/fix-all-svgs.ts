#!/usr/bin/env node

/**
 * Master SVG Scan & Fix Script
 * 
 * Scans ALL SVG files in public/diagrams/ and fixes:
 * 1. CSS variables → hardcoded colors
 * 2. Invalid XML → escape entities properly
 * 
 * Usage: pnpm tsx scripts/fix-all-svgs.ts
 */

import * as fs from "fs";
import * as path from "path";

const DIAGRAMS_DIR = path.join(process.cwd(), "public", "diagrams");

// Color mappings - comprehensive list
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
};

function escapeXmlEntities(content: string): string {
  let result = content;

  // Protect existing entities
  const protectedEntities = result.replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, (match) => {
    return match === '&amp;' ? '___AMP___' : match;
  });

  // Escape remaining bare ampersands
  result = protectedEntities.replace(/&/g, '&amp;');

  // Restore protected entities
  result = result.replace(/___AMP___/g, '&amp;');

  return result;
}

function findSvgFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...findSvgFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".svg")) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function main() {
  console.log("🔍 Scanning SVG files...\n");
  
  const svgFiles = findSvgFiles(DIAGRAMS_DIR);
  console.log(`📊 Found ${svgFiles.length} SVG files\n`);
  
  let fixedCount = 0;
  let cssVarCount = 0;
  let xmlEntityCount = 0;
  const invalidFiles: string[] = [];
  const report = {
    total: svgFiles.length,
    fixed: 0,
    cssVariablesReplaced: 0,
    xmlEntitiesEscaped: 0,
    invalid: [] as string[],
    byDirectory: {} as Record<string, { total: number; fixed: number }>,
  };
  
  console.log("🔧 Fixing issues...\n");
  
  for (const filePath of svgFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const dirName = path.dirname(relativePath).split('/')[2] || 'unknown';
    
    if (!report.byDirectory[dirName]) {
      report.byDirectory[dirName] = { total: 0, fixed: 0 };
    }
    report.byDirectory[dirName].total++;
    
    let content = fs.readFileSync(filePath, "utf-8");
    let originalContent = content;
    let fileChanged = false;
    
    // Step 1: Replace CSS variables
    for (const [cssVar, color] of Object.entries(COLOR_MAP)) {
      const regex = new RegExp(cssVar.replace(/[()]/g, "\\$&"), "g");
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, color);
        cssVarCount += matches.length;
        fileChanged = true;
      }
    }
    
    // Step 2: Escape XML entities
    content = escapeXmlEntities(content);
    if (content !== originalContent) {
      xmlEntityCount++;
      fileChanged = true;
    }
    
    // Step 3: Write back if changed
    if (fileChanged) {
      fs.writeFileSync(filePath, content, "utf-8");
      fixedCount++;
      report.fixed++;
      report.byDirectory[dirName].fixed++;
      console.log(`✓ ${relativePath}`);
    }
  }
  
  console.log("\n✅ Validation Results:\n");
  
  // Validate all files
  const { execSync } = require("child_process");
  let validCount = 0;
  
  for (const filePath of svgFiles) {
    try {
      execSync(`xmllint --noout "${filePath}"`, { stdio: 'pipe' });
      validCount++;
    } catch (error) {
      const relativePath = path.relative(process.cwd(), filePath);
      invalidFiles.push(relativePath);
      report.invalid.push(relativePath);
      console.log(`✗ ${relativePath}`);
    }
  }
  
  console.log(`✓ Valid: ${validCount} files`);
  console.log(`✗ Invalid: ${invalidFiles.length} files`);
  
  // Save report
  const reportPath = path.join(process.cwd(), "svg-validation-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total SVG files:     ${svgFiles.length}`);
  console.log(`Files fixed:         ${fixedCount}`);
  console.log(`CSS vars replaced:   ${cssVarCount}`);
  console.log(`XML entities fixed:  ${xmlEntityCount}`);
  console.log(`Valid after fix:     ${validCount}/${svgFiles.length}`);
  console.log(`Invalid files:       ${invalidFiles.length}`);
  console.log(`\n📄 Report saved to: svg-validation-report.json`);
  
  if (invalidFiles.length > 0) {
    console.log("\n⚠️  Invalid files need manual review:");
    invalidFiles.forEach(f => console.log(`   - ${f}`));
  }
  
  console.log("");
}

main();

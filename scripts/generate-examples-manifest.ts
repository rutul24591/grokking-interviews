#!/usr/bin/env node

/**
 * Generate Examples Manifest Script
 * 
 * Scans content/examples/ directory and generates a JSON manifest
 * mapping article paths to their example files.
 * 
 * Usage:
 *   pnpm tsx scripts/generate-examples-manifest.ts
 */

import * as fs from "fs";
import * as path from "path";

const EXAMPLES_DIR = path.join(process.cwd(), "content", "examples", "system-design-concepts");
const OUTPUT_FILE = path.join(process.cwd(), "content", "examples-manifest.json");

type ExampleFile = {
  name: string;
  content: string;
};

type ExampleGroup = {
  id: string;
  label: string;
  files: ExampleFile[];
};

type Manifest = Record<string, ExampleGroup[]>;

/**
 * Recursively find all example directories
 */
function findExampleDirs(dir: string, basePath: string = ""): Array<{ path: string; key: string }> {
  const results: Array<{ path: string; key: string }> = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.startsWith("example-")) {
        // Found an example directory
        results.push({
          path: fullPath,
          key: basePath,
        });
      } else {
        // Recurse into subdirectory
        results.push(...findExampleDirs(fullPath, relativePath));
      }
    }
  }

  return results;
}

/**
 * Load all files from an example directory
 */
function loadExampleFiles(exampleDir: string): ExampleFile[] {
  const files: ExampleFile[] = [];
  
  const entries = fs.readdirSync(exampleDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile()) {
      const filePath = path.join(exampleDir, entry.name);
      const content = fs.readFileSync(filePath, "utf-8");
      
      files.push({
        name: entry.name,
        content,
      });
    }
  }

  return files;
}

/**
 * Normalize path for manifest key
 */
function normalizeKey(key: string): string {
  // Convert filesystem path to manifest key format
  // e.g., "backend/advanced-topics/b-trees-b-trees"
  return key
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean)
    .join("/");
}

/**
 * Main function
 */
function main() {
  console.log("🔍 Scanning examples directory...\n");

  if (!fs.existsSync(EXAMPLES_DIR)) {
    console.error(`❌ Examples directory not found: ${EXAMPLES_DIR}`);
    process.exit(1);
  }

  const manifest: Manifest = {};
  const exampleDirs = findExampleDirs(EXAMPLES_DIR);

  console.log(`Found ${exampleDirs.length} example directories\n`);

  for (const { path: exampleDir, key } of exampleDirs) {
    const normalizedKey = normalizeKey(key);
    const files = loadExampleFiles(exampleDir);
    
    if (files.length === 0) {
      continue;
    }

    // Extract example number from directory name
    const exampleName = path.basename(exampleDir);
    const match = exampleName.match(/example-(\d+)/);
    const exampleNum = match ? match[1] : "1";

    const exampleGroup: ExampleGroup = {
      id: `example-${exampleNum}`,
      label: `Example ${exampleNum}`,
      files,
    };

    // Add to manifest
    if (!manifest[normalizedKey]) {
      manifest[normalizedKey] = [];
    }
    manifest[normalizedKey].push(exampleGroup);
  }

  // Sort examples by id
  for (const key of Object.keys(manifest)) {
    manifest[key].sort((a, b) => {
      const aNum = parseInt(a.id.replace("example-", ""));
      const bNum = parseInt(b.id.replace("example-", ""));
      return aNum - bNum;
    });
  }

  // Write manifest
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), "utf-8");

  console.log("=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Articles with examples: ${Object.keys(manifest).length}`);
  console.log(`Total example groups: ${Object.values(manifest).reduce((sum, ex) => sum + ex.length, 0)}`);
  console.log(`\n✅ Manifest saved to: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
  console.log("");

  // Show sample entries
  const sampleKeys = Object.keys(manifest).slice(0, 5);
  if (sampleKeys.length > 0) {
    console.log("📝 SAMPLE ENTRIES:");
    console.log("-".repeat(60));
    for (const key of sampleKeys) {
      console.log(`\n${key}:`);
      manifest[key].forEach((ex) => {
        console.log(`  - ${ex.label}: ${ex.files.length} files`);
        ex.files.slice(0, 3).forEach((file) => {
          console.log(`    • ${file.name}`);
        });
        if (ex.files.length > 3) {
          console.log(`    ... and ${ex.files.length - 3} more`);
        }
      });
    }
  }
}

main();

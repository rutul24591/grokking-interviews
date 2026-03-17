#!/usr/bin/env node

/**
 * Update Image Paths Script
 * 
 * Scans all article files and updates image/diagram paths to match
 * the actual folder structure in public/diagrams/
 * 
 * Usage:
 *   pnpm tsx scripts/update-image-paths.ts [--dry-run]
 */

import * as fs from "fs";
import * as path from "path";

const DRY_RUN = process.argv.includes("--dry-run");

// Base directories
const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const OUTPUT_FILE = path.join(process.cwd(), "image-paths-update-report.json");

// Path mappings (old prefix -> new prefix)
const PATH_MAPPINGS: Record<string, string> = {
  "/diagrams/backend/": "/diagrams/system-design-concepts/backend/",
  "/diagrams/frontend/": "/diagrams/system-design-concepts/frontend/",
};

// Stats
let filesScanned = 0;
let filesUpdated = 0;
let totalReplacements = 0;
const changesByFile: Record<string, string[]> = {};

/**
 * Recursively find all .tsx files
 */
function findTsxFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findTsxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Update image paths in file content
 */
function updateImagePaths(content: string): { updated: boolean; content: string; changes: string[] } {
  const changes: string[] = [];
  let updatedContent = content;

  for (const [oldPrefix, newPrefix] of Object.entries(PATH_MAPPINGS)) {
    const regex = new RegExp(`src=["']${oldPrefix}([^"']+)["']`, "g");
    const matches = content.matchAll(regex);

    for (const match of matches) {
      const oldPath = match[0];
      const newPath = `src="${newPrefix}${match[1]}"`;
      changes.push(`${oldPath} → ${newPath}`);
    }

    updatedContent = updatedContent.replace(regex, (match, imagePath) => {
      return `src="${newPrefix}${imagePath}"`;
    });
  }

  return {
    updated: content !== updatedContent,
    content: updatedContent,
    changes,
  };
}

/**
 * Main function
 */
function main() {
  console.log("🔍 Scanning article files for image paths...\n");

  if (DRY_RUN) {
    console.log("📝 DRY RUN MODE - No files will be modified\n");
  }

  // Find all TSX files
  const files = findTsxFiles(ARTICLES_DIR);
  filesScanned = files.length;

  console.log(`Found ${files.length} .tsx files in content/articles/\n`);

  // Process each file
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    const { updated, content: updatedContent, changes } = updateImagePaths(content);

    if (updated && changes.length > 0) {
      filesUpdated++;
      totalReplacements += changes.length;
      changesByFile[path.relative(process.cwd(), filePath)] = changes;

      if (!DRY_RUN) {
        fs.writeFileSync(filePath, updatedContent, "utf-8");
      }
    }
  }

  // Print summary
  console.log("=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Files scanned:      ${filesScanned}`);
  console.log(`Files updated:      ${filesUpdated}`);
  console.log(`Total replacements: ${totalReplacements}`);
  console.log("");

  if (DRY_RUN) {
    console.log("ℹ️  This was a dry run. Run without --dry-run to apply changes.");
  } else {
    console.log("✅ Changes applied successfully!");
  }

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    stats: {
      filesScanned,
      filesUpdated,
      totalReplacements,
    },
    changesByFile,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
  console.log("");

  // Show sample changes
  if (Object.keys(changesByFile).length > 0) {
    console.log("📝 SAMPLE CHANGES (first 10 files):");
    console.log("-".repeat(60));
    
    const sampleFiles = Object.entries(changesByFile).slice(0, 10);
    for (const [file, changes] of sampleFiles) {
      console.log(`\n${file}:`);
      changes.slice(0, 3).forEach((change) => {
        console.log(`  - ${change}`);
      });
      if (changes.length > 3) {
        console.log(`  ... and ${changes.length - 3} more`);
      }
    }
  }
}

// Run
main();

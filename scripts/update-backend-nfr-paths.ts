#!/usr/bin/env node

/**
 * Update Backend NFR Diagram Paths
 * 
 * Updates all diagram src paths in backend-nfr articles from:
 *   /diagrams/backend-nfr/...
 * To:
 *   /diagrams/requirements/nfr/backend-nfr/...
 * 
 * Usage: pnpm tsx scripts/update-backend-nfr-paths.ts
 */

import * as fs from "fs";
import * as path from "path";

const BACKEND_NFR_DIR = path.join(
  process.cwd(),
  "content/articles/requirements/non-functional-requirements/backend-nfr"
);

function main() {
  console.log("🔧 Updating backend-nfr diagram paths...\n");

  const files = fs.readdirSync(BACKEND_NFR_DIR)
    .filter(f => f.endsWith(".tsx"));

  let updatedCount = 0;
  let totalReplacements = 0;

  for (const file of files) {
    const filePath = path.join(BACKEND_NFR_DIR, file);
    let content = fs.readFileSync(filePath, "utf-8");
    
    // Replace /diagrams/backend-nfr/ with /diagrams/requirements/nfr/backend-nfr/
    const oldPath = '/diagrams/backend-nfr/';
    const newPath = '/diagrams/requirements/nfr/backend-nfr/';
    
    const regex = new RegExp(oldPath.replace(/\//g, '\\/'), 'g');
    const matches = content.match(regex);
    
    if (matches) {
      const count = matches.length;
      content = content.replace(regex, newPath);
      fs.writeFileSync(filePath, content, "utf-8");
      
      updatedCount++;
      totalReplacements += count;
      
      console.log(`✓ ${file}: ${count} replacements`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Files updated:      ${updatedCount}`);
  console.log(`Total replacements: ${totalReplacements}`);
  console.log("\n✅ Diagram paths updated successfully!");
  console.log("");
}

main();

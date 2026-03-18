#!/usr/bin/env node

/**
 * Generate Hierarchy JSON Script
 * 
 * Reads concepts/hierarchy-data.txt and generates lib/hierarchy-data.json
 * This ensures the sidebar always uses the latest hierarchy data.
 * 
 * Usage:
 *   pnpm tsx scripts/generate-hierarchy-json.ts
 */

import * as fs from "fs";
import * as path from "path";

const INPUT_FILE = path.join(process.cwd(), "concepts", "hierarchy-data.txt");
const OUTPUT_FILE = path.join(process.cwd(), "lib", "hierarchy-data.json");

function main() {
  console.log("📄 Reading hierarchy data...\n");

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  // Read the hierarchy file
  const content = fs.readFileSync(INPUT_FILE, "utf-8");

  // Write to JSON (keeping as raw text for parseHierarchy to process)
  // We store the raw text content, not parsed JSON, to keep the parser logic in one place
  const jsonData = {
    content: content,
    generatedAt: new Date().toISOString(),
    source: "concepts/hierarchy-data.txt",
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jsonData, null, 2), "utf-8");

  console.log("=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Input:  ${path.relative(process.cwd(), INPUT_FILE)}`);
  console.log(`Output: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
  console.log(`Size:   ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
  console.log("\n✅ Hierarchy JSON generated successfully!");
  console.log("\n📝 Next steps:");
  console.log("   - Run 'pnpm build' to rebuild the app");
  console.log("   - Or 'pnpm dev' to start development server");
  console.log("");
}

main();

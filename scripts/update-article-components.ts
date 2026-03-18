#!/usr/bin/env node

/**
 * Update Article Components Script
 * 
 * Updates all article components to:
 * 1. Accept `examples` prop
 * 2. Pass `examples` to ArticleLayout
 * 
 * Usage:
 *   pnpm tsx scripts/update-article-components.ts [--dry-run]
 */

import * as fs from "fs";
import * as path from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

let filesUpdated = 0;

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

function updateArticleContent(content: string): { updated: boolean; content: string } {
  let updated = false;
  let updatedContent = content;

  // Pattern 1: Update function signature to accept examples prop
  // From: export default function ArticleName() {
  // To:   export default function ArticleName({ examples = [] }: { examples?: ExampleGroup[] }) {
  const functionPattern = /export default function (\w+)\(\) \{/g;
  if (functionPattern.test(content)) {
    updatedContent = updatedContent.replace(
      functionPattern,
      "export default function $1({ examples = [] }: { examples?: ExampleGroup[] }) {"
    );
    updated = true;
  }

  // Pattern 2: Add ExampleGroup import if not present
  if (!content.includes('import type { ExampleGroup }')) {
    // Find the last import statement
    const importLines = content.match(/import .*\n/g) || [];
    if (importLines.length > 0) {
      const lastImport = importLines[importLines.length - 1].trim();
      const newImport = '\nimport type { ExampleGroup } from "@/types/examples";';
      updatedContent = updatedContent.replace(lastImport, lastImport + newImport);
      updated = true;
    }
  }

  // Pattern 3: Update ArticleLayout to pass examples prop
  // From: <ArticleLayout metadata={metadata}>
  // To:   <ArticleLayout metadata={metadata} examples={examples}>
  const layoutPattern = /<ArticleLayout metadata=\{metadata\}>/g;
  if (layoutPattern.test(content)) {
    updatedContent = updatedContent.replace(
      layoutPattern,
      "<ArticleLayout metadata={metadata} examples={examples}>"
    );
    updated = true;
  }

  return { updated, content: updatedContent };
}

function main() {
  console.log("🔍 Scanning article components...\n");

  if (DRY_RUN) {
    console.log("📝 DRY RUN MODE - No files will be modified\n");
  }

  const files = findTsxFiles(ARTICLES_DIR);
  console.log(`Found ${files.length} article files\n`);

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    const { updated, content: updatedContent } = updateArticleContent(content);

    if (updated) {
      filesUpdated++;
      
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, updatedContent, "utf-8");
      } else {
        console.log(`Would update: ${path.relative(process.cwd(), filePath)}`);
      }
    }
  }

  console.log("=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Files updated: ${filesUpdated}`);
  console.log("");

  if (DRY_RUN) {
    console.log("ℹ️  This was a dry run. Run without --dry-run to apply changes.");
  } else {
    console.log("✅ Changes applied successfully!");
  }
}

main();

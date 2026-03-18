#!/usr/bin/env node

/**
 * Add Examples Prop to Article Components
 * 
 * Updates article components to:
 * 1. Accept `examples` prop in function signature
 * 2. Pass `examples` to ArticleLayout
 * 
 * Usage:
 *   pnpm tsx scripts/add-examples-prop.ts
 */

import * as fs from "fs";
import * as path from "path";

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

  // Check if already has examples prop
  if (content.includes("examples?: ExampleGroup[]") || content.includes("examples = []")) {
    return { updated: false, content };
  }

  // Pattern 1: Update function signature
  // From: export default function ArticleName() {
  // To:   export default function ArticleName({ examples = [] }: { examples?: ExampleGroup[] }) {
  updatedContent = updatedContent.replace(
    /export default function (\w+)\(\) \{/g,
    "export default function $1({ examples = [] }: { examples?: ExampleGroup[] }) {"
  );

  // Pattern 2: Add ExampleGroup import if not present
  if (!content.includes('import type { ExampleGroup }')) {
    // Find the last import line
    const lines = updatedContent.split("\n");
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex >= 0) {
      lines.splice(
        lastImportIndex + 1,
        0,
        'import type { ExampleGroup } from "@/types/examples";'
      );
      updatedContent = lines.join("\n");
    }
  }

  // Pattern 3: Update ArticleLayout to pass examples
  // From: <ArticleLayout metadata={metadata}>
  // To:   <ArticleLayout metadata={metadata} examples={examples}>
  updatedContent = updatedContent.replace(
    /<ArticleLayout metadata=\{metadata\}>/g,
    "<ArticleLayout metadata={metadata} examples={examples}>"
  );

  updated = content !== updatedContent;
  return { updated, content: updatedContent };
}

function main() {
  console.log("🔧 Adding examples prop to article components...\n");

  const files = findTsxFiles(ARTICLES_DIR);
  console.log(`Found ${files.length} article files\n`);

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    const { updated, content: updatedContent } = updateArticleContent(content);

    if (updated) {
      filesUpdated++;
      fs.writeFileSync(filePath, updatedContent, "utf-8");
    }
  }

  console.log("=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Files updated: ${filesUpdated}`);
  console.log(`Files unchanged: ${files.length - filesUpdated}`);
  console.log("\n✅ Done!");
}

main();

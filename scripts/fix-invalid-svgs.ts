#!/usr/bin/env node

/**
 * Fix Invalid SVG Files
 * 
 * Fixes:
 * 1. Extra content before/after SVG tag
 * 2. Duplicate attributes
 * 3. Unescaped quotes in attribute values
 * 
 * Usage: pnpm tsx scripts/fix-invalid-svgs.ts
 */

import * as fs from "fs";
import * as path from "path";

const INVALID_FILES = [
  "public/diagrams/system-design-concepts/backend/data-storage-databases/cdn-dns-based.svg",
  "public/diagrams/system-design-concepts/backend/fundamentals-building-blocks/domain-name-space.svg",
  "public/diagrams/system-design-concepts/backend/fundamentals-building-blocks/ipv4-address.svg",
  "public/diagrams/system-design-concepts/backend/fundamentals-building-blocks/ipv6-address.svg",
  "public/diagrams/system-design-concepts/backend/infrastructure-deployment/cloud-services-diagram-3.svg",
  "public/diagrams/system-design-concepts/backend/infrastructure-deployment/containerization-diagram-3.svg",
  "public/diagrams/system-design-concepts/backend/infrastructure-deployment/feature-flags-diagram-3.svg",
  "public/diagrams/system-design-concepts/backend/network-communication/cdn-content-aware-slb.svg",
  "public/diagrams/system-design-concepts/backend/network-communication/http2-hpack.svg",
  "public/diagrams/system-design-concepts/backend/network-communication/p2p-network.svg",
  "public/diagrams/system-design-concepts/backend/network-communication/proxy-website-diagram.svg",
  "public/diagrams/system-design-concepts/backend/network-communication/request-hedging-grpc-basic.svg",
  "public/diagrams/system-design-concepts/backend/system-components-services/a-b-testing-service-diagram-3.svg",
  "public/diagrams/system-design-concepts/backend/system-components-services/analytics-service-diagram-3.svg",
  "public/diagrams/system-design-concepts/backend/system-components-services/audit-logging-service-diagram-3.svg",
  "public/diagrams/system-design-concepts/backend/system-components-services/authentication-service-diagram-3.svg",
  "public/diagrams/system-design-concepts/backend/system-components-services/authorization-service-diagram-3.svg",
  "public/diagrams/system-design-concepts/backend/system-components-services/content-moderation-service-diagram-3.svg",
  "public/diagrams/system-design-concepts/backend/system-components-services/email-service-diagram-3.svg",
];

function fixSvgFile(filePath: string): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;
  
  // Fix 1: Remove extra content before SVG tag
  const svgStartMatch = content.match(/<svg[\s\S]*?>/i);
  if (svgStartMatch && svgStartMatch.index && svgStartMatch.index > 0) {
    content = content.substring(svgStartMatch.index);
  }
  
  // Fix 2: Remove extra content after closing SVG tag
  const svgEndMatch = content.match(/<\/svg>/i);
  if (svgEndMatch && svgEndMatch.index) {
    const endPos = svgEndMatch.index + svgEndMatch[0].length;
    if (endPos < content.length) {
      content = content.substring(0, endPos);
    }
  }
  
  // Fix 3: Remove duplicate text-anchor attributes (keep first occurrence)
  content = content.replace(/(\s+text-anchor="[^"]*")(\s+text-anchor="[^"]*")+/gi, '$1');
  
  // Fix 4: Remove duplicate font-size attributes
  content = content.replace(/(\s+font-size="[^"]*")(\s+font-size="[^"]*")+/gi, '$1');
  
  // Fix 5: Remove duplicate fill attributes
  content = content.replace(/(\s+fill="[^"]*")(\s+fill="[^"]*")+/gi, '$1');
  
  // Fix 6: Escape unescaped quotes in attribute values (common pattern: attr="value "more")
  content = content.replace(/="([^"]*)"([^"]*)"/g, '="$1$2"');
  
  // Fix 7: Remove DOCTYPE declarations that may cause issues
  content = content.replace(/<!DOCTYPE[^>]*>/gi, '');
  
  // Fix 8: Remove standalone declarations before SVG
  content = content.replace(/^\s*<rect[^>]*>\s*/i, '');
  
  const fixed = content !== originalContent;
  
  if (fixed) {
    fs.writeFileSync(filePath, content, "utf-8");
  }
  
  return fixed;
}

function main() {
  console.log("🔧 Fixing invalid SVG files...\n");
  
  let fixedCount = 0;
  
  for (const relativePath of INVALID_FILES) {
    const filePath = path.join(process.cwd(), relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${relativePath}`);
      continue;
    }
    
    const fixed = fixSvgFile(filePath);
    
    if (fixed) {
      fixedCount++;
      console.log(`✓ ${relativePath}`);
    } else {
      console.log(`- ${relativePath} (no changes needed)`);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Files processed: ${INVALID_FILES.length}`);
  console.log(`Files fixed:     ${fixedCount}`);
  console.log("\n✅ Invalid SVG fix complete!");
  console.log("\n📝 Run validation again to check if files are now valid.");
  console.log("");
}

main();

#!/usr/bin/env node

/**
 * Regenerate Invalid SVG Files
 * 
 * Fixes all 24 invalid SVGs by:
 * 1. Repairing malformed SVG tags
 * 2. Removing extra content
 * 3. Fixing duplicate attributes
 * 4. Escaping XML entities
 * 5. Fixing unclosed tags
 * 
 * Usage: pnpm tsx scripts/regenerate-invalid-svgs.ts
 */

import * as fs from "fs";
import * as path from "path";

const INVALID_FILES = [
  "public/diagrams/requirements/nfr/advanced-topics/feature-detection-strategies.svg",
  "public/diagrams/requirements/nfr/advanced-topics/micro-frontend-integration-patterns.svg",
  "public/diagrams/requirements/nfr/frontend-nfr/media-lazy-loading.svg",
  "public/diagrams/requirements/nfr/frontend-nfr/media-responsive-images.svg",
  "public/diagrams/system-design-concepts/backend/advanced-topics/time-series-optimization-diagram-3.svg",
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

function fixSvgContent(content: string): string {
  let result = content;
  
  // Step 1: Extract only content from first <svg to last </svg>
  const svgStartMatch = result.match(/<svg[\s\S]*?>/i);
  if (svgStartMatch && svgStartMatch.index !== undefined) {
    result = result.substring(svgStartMatch.index);
  }
  
  const svgEndMatch = result.match(/<\/svg>/i);
  if (svgEndMatch && svgEndMatch.index !== undefined) {
    const endPos = svgEndMatch.index + svgEndMatch[0].length;
    result = result.substring(0, endPos);
  }
  
  // Step 2: Fix malformed SVG opening tag - add missing quotes between attributes
  result = result.replace(/<svg\s+id="([^"]+)\s+xmlns:/g, '<svg id="$1" xmlns:');
  result = result.replace(/"\s+height=/g, '" height=');
  result = result.replace(/"\s+width=/g, '" width=');
  result = result.replace(/"\s+version=/g, '" version=');
  result = result.replace(/"\s+viewBox=/g, '" viewBox=');
  result = result.replace(/"\s+preserveAspectRatio=/g, '" preserveAspectRatio=');
  result = result.replace(/"\s+zoomAndPan=/g, '" zoomAndPan=');
  result = result.replace(/"\s+class=/g, '" class=');
  result = result.replace(/"\s+style=/g, '" style=');
  result = result.replace(/"\s+transform=/g, '" transform=');
  result = result.replace(/"\s+fill=/g, '" fill=');
  result = result.replace(/"\s+stroke=/g, '" stroke=');
  result = result.replace(/"\s+stroke-width=/g, '" stroke-width=');
  result = result.replace(/"\s+opacity=/g, '" opacity=');
  result = result.replace(/"\s+font-family=/g, '" font-family=');
  result = result.replace(/"\s+font-size=/g, '" font-size=');
  result = result.replace(/"\s+font-weight=/g, '" font-weight=');
  result = result.replace(/"\s+text-anchor=/g, '" text-anchor=');
  result = result.replace(/"\s+id=/g, '" id=');
  
  // Step 3: Fix unclosed attribute values (missing closing quote)
  result = result.replace(/(height|width|version|viewBox|id|class|fill|stroke)=["']([^"']*)(\s+[a-z-]+=)/gi, '$1="$2"$3');
  
  // Step 4: Remove duplicate attributes (keep first occurrence)
  result = result.replace(/(\s+(text-anchor|font-size|fill|stroke|opacity|font-family|font-weight)=["'][^"']*["'])(\s+\2=["'][^"']*["'])+/gi, '$1');
  
  // Step 5: Remove DOCTYPE declarations
  result = result.replace(/<!DOCTYPE[^>]*>/gi, '');
  
  // Step 6: Remove XML declarations if duplicated
  const xmlDeclMatches = result.match(/<\?xml[^>]*\?>/gi);
  if (xmlDeclMatches && xmlDeclMatches.length > 1) {
    result = result.replace(/<\?xml[^>]*\?>/gi, (match, offset) => {
      return offset === 0 ? match : '';
    });
  }
  
  // Step 7: Escape unescaped ampersands in text content
  result = result.replace(/>([^<]*&[^<]*?)</g, (match, p1) => {
    return '>' + p1.replace(/&/g, '&amp;') + '<';
  });
  
  // Step 8: Fix JSX patterns
  result = result.replace(/{'<'} /g, '&lt; ');
  result = result.replace(/{'>'}/g, '&gt;');
  result = result.replace(/{'<'}/g, '&lt;');
  
  // Step 9: Fix common malformed patterns
  result = result.replace(/xmlns=([^"\s][^>\s]*)/g, 'xmlns="$1"');
  result = result.replace(/version=([^"\s][^>\s]*)/g, 'version="$1"');
  
  // Step 10: Ensure all attribute values are properly quoted
  result = result.replace(/([a-z-]+)=([^"\s][^>\s]*)/gi, (match, attr, value) => {
    const skipAttrs = ['xmlns', 'xml', 'xlink'];
    if (skipAttrs.some(s => attr.toLowerCase().startsWith(s))) {
      return match;
    }
    return `${attr}="${value}"`;
  });
  
  return result;
}

function main() {
  console.log("🔧 Regenerating 24 invalid SVG files...\n");
  
  let fixedCount = 0;
  let errorCount = 0;
  const errors: string[] = [];
  
  for (const relativePath of INVALID_FILES) {
    const filePath = path.join(process.cwd(), relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${relativePath}`);
      errorCount++;
      errors.push(`${relativePath} - File not found`);
      continue;
    }
    
    try {
      const originalContent = fs.readFileSync(filePath, "utf-8");
      const fixedContent = fixSvgContent(originalContent);
      
      if (fixedContent !== originalContent) {
        fs.writeFileSync(filePath, fixedContent, "utf-8");
        fixedCount++;
        console.log(`✓ ${relativePath}`);
      } else {
        console.log(`- ${relativePath} (no changes)`);
      }
    } catch (error: any) {
      errorCount++;
      errors.push(`${relativePath} - ${error.message}`);
      console.log(`✗ ${relativePath}: ${error.message}`);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Files processed: ${INVALID_FILES.length}`);
  console.log(`Files fixed:     ${fixedCount}`);
  console.log(`Errors:          ${errorCount}`);
  
  if (errors.length > 0) {
    console.log("\n⚠️  Errors:");
    errors.forEach(e => console.log(`   - ${e}`));
  }
  
  console.log("\n✅ SVG regeneration complete!");
  console.log("\n📝 Run validation to verify fixes:");
  console.log("   pnpm tsx scripts/fix-all-svgs.ts");
  console.log("");
}

main();

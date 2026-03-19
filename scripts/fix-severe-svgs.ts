#!/usr/bin/env node

/**
 * Aggressive SVG Fix for Severely Malformed Files
 * 
 * Fixes:
 * 1. Missing quotes between SVG attributes
 * 2. Unescaped code snippets in text content
 * 3. Malformed namespace declarations
 * 
 * Usage: pnpm tsx scripts/fix-severe-svgs.ts
 */

import * as fs from "fs";
import * as path from "path";

const SEVERE_FILES = [
  "public/diagrams/requirements/nfr/advanced-topics/micro-frontend-integration-patterns.svg",
  "public/diagrams/requirements/nfr/frontend-nfr/media-lazy-loading.svg",
  "public/diagrams/requirements/nfr/frontend-nfr/media-responsive-images.svg",
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
  "public/diagrams/system-design-concepts/backend/system-components-services/notification-service-diagram-2.svg",
];

function fixSevereSvg(filePath: string): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  const original = content;
  
  // Fix 1: Escape code snippets in text content
  content = content.replace(/{`([^`]*)`}/g, (match, code) => {
    return code.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/{/g, '&#123;').replace(/}/g, '&#125;');
  });
  
  content = content.replace(/{'([^']*)'}/g, (match, code) => {
    return code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  });
  
  // Fix 2: Fix missing quotes in SVG tag - pattern: attr="value attr2="
  content = content.replace(/(viewBox|height|width|version|role|aria-label)=([^"\s][^>\s]*)\s+([a-z-]+)=/gi, '$1="$2" $3=');
  
  // Fix 3: Fix malformed namespace declarations
  content = content.replace(/xmlns="([^"]+)\s+([a-z-]+)=/gi, 'xmlns="$1" $2=');
  content = content.replace(/xmlns:dc="([^"]+)\s+xmlns:/gi, 'xmlns:dc="$1" xmlns:');
  content = content.replace(/xmlns:cc="([^"]+)\s+xmlns:/gi, 'xmlns:cc="$1" xmlns:');
  
  // Fix 4: Fix stroke-miterlimit missing quote
  content = content.replace(/stroke-miterlimit=([^"\s][^>\s]*)\s+/gi, 'stroke-miterlimit="$1" ');
  
  // Fix 5: Fix svg tag with missing closing quote before viewBox
  content = content.replace(/<svg([^>]*?)viewBox=/gi, '<svg$1" viewBox=');
  
  // Fix 6: Remove extra content after </svg>
  const svgEndIndex = content.indexOf('</svg>');
  if (svgEndIndex !== -1 && svgEndIndex < content.length - 6) {
    content = content.substring(0, svgEndIndex + 6);
  }
  
  const fixed = content !== original;
  
  if (fixed) {
    fs.writeFileSync(filePath, content, "utf-8");
  }
  
  return fixed;
}

function main() {
  console.log("🔧 Fixing severely malformed SVGs...\n");
  
  let fixedCount = 0;
  
  for (const relativePath of SEVERE_FILES) {
    const filePath = path.join(process.cwd(), relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Not found: ${relativePath}`);
      continue;
    }
    
    const fixed = fixSevereSvg(filePath);
    
    if (fixed) {
      fixedCount++;
      console.log(`✓ ${relativePath}`);
    } else {
      console.log(`- ${relativePath}`);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Files processed: ${SEVERE_FILES.length}`);
  console.log(`Files fixed:     ${fixedCount}`);
  console.log("\n✅ Severe SVG fix complete!");
  console.log("");
}

main();

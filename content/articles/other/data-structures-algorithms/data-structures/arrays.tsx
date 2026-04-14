"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-data-structures-arrays",
  title: "Arrays",
  description:
    "Comprehensive guide to arrays: memory layout, access patterns, multidimensional arrays, dynamic arrays, cache-line behavior, and production-scale trade-offs for staff and principal engineer interviews.",
  category: "other",
  subcategory: "data-structures-algorithms/data-structures",
  slug: "arrays",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-14",
  tags: ["data-structures", "arrays", "memory-layout", "performance"],
  relatedTopics: ["hash-tables", "strings", "heaps-priority-queues"],
};

const arrayMemoryLayoutSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .box-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .box-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .accent-light { fill: #3b82f6; }
      .accent-dark { fill: #60a5fa; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .arrow-light { stroke: #475569; stroke-width: 2; fill: none; marker-end: url(#arrowhead-light); }
      .arrow-dark { stroke: #94a3b8; stroke-width: 2; fill: none; marker-end: url(#arrowhead-dark); }
      .line-light { stroke: #94a3b8; stroke-width: 1; stroke-dasharray: 4,4; }
      .line-dark { stroke: #64748b; stroke-width: 1; stroke-dasharray: 4,4; }
    </style>
    <marker id="arrowhead-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#475569"/>
    </marker>
    <marker id="arrowhead-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="320" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="320" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Array Memory Layout — Contiguous Allocation</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Array Memory Layout — Contiguous Allocation</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Base address + (index × element size) = O(1) random access</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Base address + (index × element size) = O(1) random access</text>
  <g transform="translate(100, 80)">
    <rect x="0" y="0" width="80" height="60" class="box-light"/>
    <rect x="0" y="0" width="80" height="60" class="box-dark" style="display:none;"/>
    <text x="40" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">arr[0]</text>
    <text x="40" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">arr[0]</text>
    <text x="40" y="45" text-anchor="middle" font-size="11" class="subtext-light">0x1000</text>
    <text x="40" y="45" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">0x1000</text>
    <rect x="80" y="0" width="80" height="60" class="box-light"/>
    <rect x="80" y="0" width="80" height="60" class="box-dark" style="display:none;"/>
    <text x="120" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">arr[1]</text>
    <text x="120" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">arr[1]</text>
    <text x="120" y="45" text-anchor="middle" font-size="11" class="subtext-light">0x1008</text>
    <text x="120" y="45" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">0x1008</text>
    <rect x="160" y="0" width="80" height="60" class="box-light"/>
    <rect x="160" y="0" width="80" height="60" class="box-dark" style="display:none;"/>
    <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">arr[2]</text>
    <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">arr[2]</text>
    <text x="200" y="45" text-anchor="middle" font-size="11" class="subtext-light">0x1010</text>
    <text x="200" y="45" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">0x1010</text>
    <rect x="240" y="0" width="80" height="60" class="box-light"/>
    <rect x="240" y="0" width="80" height="60" class="box-dark" style="display:none;"/>
    <text x="280" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">arr[3]</text>
    <text x="280" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">arr[3]</text>
    <text x="280" y="45" text-anchor="middle" font-size="11" class="subtext-light">0x1018</text>
    <text x="280" y="45" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">0x1018</text>
    <rect x="320" y="0" width="80" height="60" class="box-light"/>
    <rect x="320" y="0" width="80" height="60" class="box-dark" style="display:none;"/>
    <text x="360" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">arr[4]</text>
    <text x="360" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">arr[4]</text>
    <text x="360" y="45" text-anchor="middle" font-size="11" class="subtext-light">0x1020</text>
    <text x="360" y="45" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">0x1020</text>
    <rect x="400" y="0" width="80" height="60" class="box-light"/>
    <rect x="400" y="0" width="80" height="60" class="box-dark" style="display:none;"/>
    <text x="440" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">arr[5]</text>
    <text x="440" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">arr[5]</text>
    <text x="440" y="45" text-anchor="middle" font-size="11" class="subtext-light">0x1028</text>
    <text x="440" y="45" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">0x1028</text>
    <rect x="480" y="0" width="80" height="60" class="box-light"/>
    <rect x="480" y="0" width="80" height="60" class="box-dark" style="display:none;"/>
    <text x="520" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">arr[6]</text>
    <text x="520" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">arr[6]</text>
    <text x="520" y="45" text-anchor="middle" font-size="11" class="subtext-light">0x1030</text>
    <text x="520" y="45" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">0x1030</text>
    <rect x="560" y="0" width="80" height="60" class="box-light"/>
    <rect x="560" y="0" width="80" height="60" class="box-dark" style="display:none;"/>
    <text x="600" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">arr[7]</text>
    <text x="600" y="25" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">arr[7]</text>
    <text x="600" y="45" text-anchor="middle" font-size="11" class="subtext-light">0x1038</text>
    <text x="600" y="45" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">0x1038</text>
  </g>
  <line x1="100" y1="200" x2="700" y2="200" class="line-light"/>
  <line x1="100" y1="200" x2="700" y2="200" class="line-dark" style="display:none;"/>
  <text x="400" y="230" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Cache Line Boundaries (64 bytes)</text>
  <text x="400" y="230" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Cache Line Boundaries (64 bytes)</text>
  <rect x="100" y="250" width="160" height="40" rx="4" class="accent-light" opacity="0.3"/>
  <rect x="100" y="250" width="160" height="40" rx="4" class="accent-dark" opacity="0.3" style="display:none;"/>
  <text x="180" y="275" text-anchor="middle" font-size="12" class="subtext-light">Cache Line 0: arr[0]–arr[7]</text>
  <text x="180" y="275" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Cache Line 0: arr[0]–arr[7]</text>
  <rect x="260" y="250" width="160" height="40" rx="4" class="accent-light" opacity="0.15"/>
  <rect x="260" y="250" width="160" height="40" rx="4" class="accent-dark" opacity="0.15" style="display:none;"/>
  <text x="340" y="275" text-anchor="middle" font-size="12" class="subtext-light">Cache Line 1: next 8 elements</text>
  <text x="340" y="275" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Cache Line 1: next 8 elements</text>
  <text x="400" y="310" text-anchor="middle" font-size="11" class="subtext-light">Spatial locality: sequential access prefetches adjacent elements automatically</text>
  <text x="400" y="310" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Spatial locality: sequential access prefetches adjacent elements automatically</text>
</svg>
`;

const dynamicArrayGrowthSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .box-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .box-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .new-light { fill: #86efac; stroke: #16a34a; stroke-width: 2; }
      .new-dark { fill: #166534; stroke: #4ade80; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .arrow-light { stroke: #dc2626; stroke-width: 2; fill: none; marker-end: url(#arrow-red-light); }
      .arrow-dark { stroke: #f87171; stroke-width: 2; fill: none; marker-end: url(#arrow-red-dark); }
      .copy-light { stroke: #3b82f6; stroke-width: 2; stroke-dasharray: 6,4; fill: none; marker-end: url(#arrow-blue-light); }
      .copy-dark { stroke: #60a5fa; stroke-width: 2; stroke-dasharray: 6,4; fill: none; marker-end: url(#arrow-blue-dark); }
    </style>
    <marker id="arrow-red-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626"/>
    </marker>
    <marker id="arrow-red-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#f87171"/>
    </marker>
    <marker id="arrow-blue-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
    </marker>
    <marker id="arrow-blue-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="380" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="380" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Dynamic Array Resizing — Amortized O(1) Append</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Dynamic Array Resizing — Amortized O(1) Append</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Capacity doubles: 4 → 8 → 16; old array deallocated after copy</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Capacity doubles: 4 → 8 → 16; old array deallocated after copy</text>
  <text x="120" y="90" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Phase 1: Capacity 4 (full)</text>
  <text x="120" y="90" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Phase 1: Capacity 4 (full)</text>
  <g transform="translate(40, 100)">
    <rect x="0" y="0" width="40" height="40" class="box-light"/>
    <rect x="0" y="0" width="40" height="40" class="box-dark" style="display:none;"/>
    <text x="20" y="25" text-anchor="middle" font-size="12" class="text-light">A</text>
    <text x="20" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A</text>
    <rect x="40" y="0" width="40" height="40" class="box-light"/>
    <rect x="40" y="0" width="40" height="40" class="box-dark" style="display:none;"/>
    <text x="60" y="25" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="60" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <rect x="80" y="0" width="40" height="40" class="box-light"/>
    <rect x="80" y="0" width="40" height="40" class="box-dark" style="display:none;"/>
    <text x="100" y="25" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="100" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <rect x="120" y="0" width="40" height="40" class="box-light"/>
    <rect x="120" y="0" width="40" height="40" class="box-dark" style="display:none;"/>
    <text x="140" y="25" text-anchor="middle" font-size="12" class="text-light">D</text>
    <text x="140" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">D</text>
  </g>
  <path d="M 220 120 Q 260 100 280 120" class="arrow-light"/>
  <path d="M 220 120 Q 260 100 280 120" class="arrow-dark" style="display:none;"/>
  <text x="250" y="95" text-anchor="middle" font-size="11" font-weight="bold" class="subtext-light">Push E</text>
  <text x="250" y="95" text-anchor="middle" font-size="11" font-weight="bold" class="subtext-dark" style="display:none;">Push E</text>
  <text x="400" y="90" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Phase 2: Allocate capacity 8, copy elements</text>
  <text x="400" y="90" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Phase 2: Allocate capacity 8, copy elements</text>
  <g transform="translate(300, 100)">
    <rect x="0" y="0" width="40" height="40" class="new-light"/>
    <rect x="0" y="0" width="40" height="40" class="new-dark" style="display:none;"/>
    <text x="20" y="25" text-anchor="middle" font-size="12" class="text-light">A</text>
    <text x="20" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A</text>
    <rect x="40" y="0" width="40" height="40" class="new-light"/>
    <rect x="40" y="0" width="40" height="40" class="new-dark" style="display:none;"/>
    <text x="60" y="25" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="60" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <rect x="80" y="0" width="40" height="40" class="new-light"/>
    <rect x="80" y="0" width="40" height="40" class="new-dark" style="display:none;"/>
    <text x="100" y="25" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="100" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <rect x="120" y="0" width="40" height="40" class="new-light"/>
    <rect x="120" y="0" width="40" height="40" class="new-dark" style="display:none;"/>
    <text x="140" y="25" text-anchor="middle" font-size="12" class="text-light">D</text>
    <text x="140" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">D</text>
    <rect x="160" y="0" width="40" height="40" class="new-light" opacity="0.6"/>
    <rect x="160" y="0" width="40" height="40" class="new-dark" opacity="0.6" style="display:none;"/>
    <text x="180" y="25" text-anchor="middle" font-size="12" class="text-light">E</text>
    <text x="180" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">E</text>
    <rect x="200" y="0" width="40" height="40" class="new-light" opacity="0.3"/>
    <rect x="200" y="0" width="40" height="40" class="new-dark" opacity="0.3" style="display:none;"/>
    <rect x="240" y="0" width="40" height="40" class="new-light" opacity="0.3"/>
    <rect x="240" y="0" width="40" height="40" class="new-dark" opacity="0.3" style="display:none;"/>
    <rect x="280" y="0" width="40" height="40" class="new-light" opacity="0.3"/>
    <rect x="280" y="0" width="40" height="40" class="new-dark" opacity="0.3" style="display:none;"/>
  </g>
  <path d="M 160 150 Q 200 170 300 150" class="copy-light"/>
  <path d="M 160 150 Q 200 170 300 150" class="copy-dark" style="display:none;"/>
  <text x="230" y="175" text-anchor="middle" font-size="11" class="subtext-light">Copy 4 elements (O(n) operation)</text>
  <text x="230" y="175" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Copy 4 elements (O(n) operation)</text>
  <text x="400" y="230" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Amortized Cost Analysis</text>
  <text x="400" y="230" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Amortized Cost Analysis</text>
  <g transform="translate(100, 250)">
    <rect x="0" y="0" width="600" height="110" rx="6" class="box-light"/>
    <rect x="0" y="0" width="600" height="110" rx="6" class="box-dark" style="display:none;"/>
    <text x="300" y="25" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Insertion costs: 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1, 2, 1, 9 ...</text>
    <text x="300" y="25" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Insertion costs: 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1, 2, 1, 9 ...</text>
    <text x="300" y="50" text-anchor="middle" font-size="12" class="subtext-light">Most insertions cost 1. Resizing at powers of 2 costs n.</text>
    <text x="300" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Most insertions cost 1. Resizing at powers of 2 costs n.</text>
    <text x="300" y="75" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Total cost for n insertions: O(n), therefore amortized O(1) per insertion</text>
    <text x="300" y="75" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Total cost for n insertions: O(n), therefore amortized O(1) per insertion</text>
    <text x="300" y="100" text-anchor="middle" font-size="11" class="subtext-light">Worst-case single insertion: O(n) when resize occurs. Average over sequence: O(1).</text>
    <text x="300" y="100" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Worst-case single insertion: O(n) when resize occurs. Average over sequence: O(1).</text>
  </g>
</svg>
`;

const arrayTradeoffsSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .box-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .box-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .good-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .good-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
      .bad-light { fill: #fef2f2; stroke: #dc2626; stroke-width: 2; }
      .bad-dark { fill: #450a0a; stroke: #f87171; stroke-width: 2; }
      .neutral-light { fill: #fefce8; stroke: #ca8a04; stroke-width: 2; }
      .neutral-dark { fill: #422006; stroke: #facc15; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .heading-light { fill: #1e293b; font-weight: bold; }
      .heading-dark { fill: #f1f5f9; font-weight: bold; }
    </style>
  </defs>
  <rect class="bg-light" width="800" height="420" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="420" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Array Operation Complexity &amp; Trade-offs</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Array Operation Complexity &amp; Trade-offs</text>
  <g transform="translate(50, 60)">
    <rect x="0" y="0" width="170" height="40" class="box-light"/>
    <rect x="0" y="0" width="170" height="40" class="box-dark" style="display:none;"/>
    <text x="85" y="25" text-anchor="middle" font-size="13" class="text-light">Operation</text>
    <text x="85" y="25" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">Operation</text>
    <rect x="170" y="0" width="120" height="40" class="box-light"/>
    <rect x="170" y="0" width="120" height="40" class="box-dark" style="display:none;"/>
    <text x="230" y="25" text-anchor="middle" font-size="13" class="text-light">Time</text>
    <text x="230" y="25" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">Time</text>
    <rect x="290" y="0" width="120" height="40" class="box-light"/>
    <rect x="290" y="0" width="120" height="40" class="box-dark" style="display:none;"/>
    <text x="350" y="25" text-anchor="middle" font-size="13" class="text-light">Space</text>
    <text x="350" y="25" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">Space</text>
    <rect x="410" y="0" width="290" height="40" class="box-light"/>
    <rect x="410" y="0" width="290" height="40" class="box-dark" style="display:none;"/>
    <text x="555" y="25" text-anchor="middle" font-size="13" class="text-light">Trade-off Notes</text>
    <text x="555" y="25" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">Trade-off Notes</text>
  </g>
  <g transform="translate(50, 100)">
    <rect x="0" y="0" width="170" height="35" class="good-light"/>
    <rect x="0" y="0" width="170" height="35" class="good-dark" style="display:none;"/>
    <text x="85" y="22" text-anchor="middle" font-size="12" class="text-light">Access by Index</text>
    <text x="85" y="22" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">Access by Index</text>
    <rect x="170" y="0" width="120" height="35" class="good-light"/>
    <rect x="170" y="0" width="120" height="35" class="good-dark" style="display:none;"/>
    <text x="230" y="22" text-anchor="middle" font-size="12" class="text-light">O(1)</text>
    <text x="230" y="22" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(1)</text>
    <rect x="290" y="0" width="120" height="35" class="good-light"/>
    <rect x="290" y="0" width="120" height="35" class="good-dark" style="display:none;"/>
    <text x="350" y="22" text-anchor="middle" font-size="12" class="text-light">O(n)</text>
    <text x="350" y="22" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n)</text>
    <rect x="410" y="0" width="290" height="35" class="good-light"/>
    <rect x="410" y="0" width="290" height="35" class="good-dark" style="display:none;"/>
    <text x="555" y="22" text-anchor="middle" font-size="11" class="subtext-light">Contiguous memory enables direct address calculation</text>
    <text x="555" y="22" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Contiguous memory enables direct address calculation</text>
    <rect x="0" y="35" width="170" height="35" class="good-light"/>
    <rect x="0" y="35" width="170" height="35" class="good-dark" style="display:none;"/>
    <text x="85" y="57" text-anchor="middle" font-size="12" class="text-light">Search (sorted, binary)</text>
    <text x="85" y="57" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">Search (sorted, binary)</text>
    <rect x="170" y="35" width="120" height="35" class="good-light"/>
    <rect x="170" y="35" width="120" height="35" class="good-dark" style="display:none;"/>
    <text x="230" y="57" text-anchor="middle" font-size="12" class="text-light">O(log n)</text>
    <text x="230" y="57" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(log n)</text>
    <rect x="290" y="35" width="120" height="35" class="good-light"/>
    <rect x="290" y="35" width="120" height="35" class="good-dark" style="display:none;"/>
    <text x="350" y="57" text-anchor="middle" font-size="12" class="text-light">O(n)</text>
    <text x="350" y="57" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n)</text>
    <rect x="410" y="35" width="290" height="35" class="good-light"/>
    <rect x="410" y="35" width="290" height="35" class="good-dark" style="display:none;"/>
    <text x="555" y="57" text-anchor="middle" font-size="11" class="subtext-light">Requires sorted invariant; random access is key</text>
    <text x="555" y="57" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Requires sorted invariant; random access is key</text>
    <rect x="0" y="70" width="170" height="35" class="bad-light"/>
    <rect x="0" y="70" width="170" height="35" class="bad-dark" style="display:none;"/>
    <text x="85" y="92" text-anchor="middle" font-size="12" class="text-light">Insert at Front</text>
    <text x="85" y="92" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">Insert at Front</text>
    <rect x="170" y="70" width="120" height="35" class="bad-light"/>
    <rect x="170" y="70" width="120" height="35" class="bad-dark" style="display:none;"/>
    <text x="230" y="92" text-anchor="middle" font-size="12" class="text-light">O(n)</text>
    <text x="230" y="92" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n)</text>
    <rect x="290" y="70" width="120" height="35" class="bad-light"/>
    <rect x="290" y="70" width="120" height="35" class="bad-dark" style="display:none;"/>
    <text x="350" y="92" text-anchor="middle" font-size="12" class="text-light">O(n)</text>
    <text x="350" y="92" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n)</text>
    <rect x="410" y="70" width="290" height="35" class="bad-light"/>
    <rect x="410" y="70" width="290" height="35" class="bad-dark" style="display:none;"/>
    <text x="555" y="92" text-anchor="middle" font-size="11" class="subtext-light">All elements must shift right; cache line invalidation</text>
    <text x="555" y="92" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">All elements must shift right; cache line invalidation</text>
    <rect x="0" y="105" width="170" height="35" class="bad-light"/>
    <rect x="0" y="105" width="170" height="35" class="bad-dark" style="display:none;"/>
    <text x="85" y="127" text-anchor="middle" font-size="12" class="text-light">Delete at Front</text>
    <text x="85" y="127" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">Delete at Front</text>
    <rect x="170" y="105" width="120" height="35" class="bad-light"/>
    <rect x="170" y="105" width="120" height="35" class="bad-dark" style="display:none;"/>
    <text x="230" y="127" text-anchor="middle" font-size="12" class="text-light">O(n)</text>
    <text x="230" y="127" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n)</text>
    <rect x="290" y="105" width="120" height="35" class="bad-light"/>
    <rect x="290" y="105" width="120" height="35" class="bad-dark" style="display:none;"/>
    <text x="350" y="127" text-anchor="middle" font-size="12" class="text-light">O(1)*</text>
    <text x="350" y="127" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(1)*</text>
    <rect x="410" y="105" width="290" height="35" class="bad-light"/>
    <rect x="410" y="105" width="290" height="35" class="bad-dark" style="display:none;"/>
    <text x="555" y="127" text-anchor="middle" font-size="11" class="subtext-light">Shift left; space stays allocated (*lazy delete)</text>
    <text x="555" y="127" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Shift left; space stays allocated (*lazy delete)</text>
    <rect x="0" y="140" width="170" height="35" class="neutral-light"/>
    <rect x="0" y="140" width="170" height="35" class="neutral-dark" style="display:none;"/>
    <text x="85" y="162" text-anchor="middle" font-size="12" class="text-light">Append (dynamic)</text>
    <text x="85" y="162" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">Append (dynamic)</text>
    <rect x="170" y="140" width="120" height="35" class="neutral-light"/>
    <rect x="170" y="140" width="120" height="35" class="neutral-dark" style="display:none;"/>
    <text x="230" y="162" text-anchor="middle" font-size="12" class="text-light">O(1)* amortized</text>
    <text x="230" y="162" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(1)* amortized</text>
    <rect x="290" y="140" width="120" height="35" class="neutral-light"/>
    <rect x="290" y="140" width="120" height="35" class="neutral-dark" style="display:none;"/>
    <text x="350" y="162" text-anchor="middle" font-size="12" class="text-light">O(n) worst</text>
    <text x="350" y="162" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n) worst</text>
    <rect x="410" y="140" width="290" height="35" class="neutral-light"/>
    <rect x="410" y="140" width="290" height="35" class="neutral-dark" style="display:none;"/>
    <text x="555" y="162" text-anchor="middle" font-size="11" class="subtext-light">Capacity doubling; occasional O(n) resize spike</text>
    <text x="555" y="162" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Capacity doubling; occasional O(n) resize spike</text>
    <rect x="0" y="175" width="170" height="35" class="good-light"/>
    <rect x="0" y="175" width="170" height="35" class="good-dark" style="display:none;"/>
    <text x="85" y="197" text-anchor="middle" font-size="12" class="text-light">Sequential Iteration</text>
    <text x="85" y="197" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">Sequential Iteration</text>
    <rect x="170" y="175" width="120" height="35" class="good-light"/>
    <rect x="170" y="175" width="120" height="35" class="good-dark" style="display:none;"/>
    <text x="230" y="197" text-anchor="middle" font-size="12" class="text-light">O(n)</text>
    <text x="230" y="197" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n)</text>
    <rect x="290" y="175" width="120" height="35" class="good-light"/>
    <rect x="290" y="175" width="120" height="35" class="good-dark" style="display:none;"/>
    <text x="350" y="197" text-anchor="middle" font-size="12" class="text-light">O(n)</text>
    <text x="350" y="197" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n)</text>
    <rect x="410" y="175" width="290" height="35" class="good-light"/>
    <rect x="410" y="175" width="290" height="35" class="good-dark" style="display:none;"/>
    <text x="555" y="197" text-anchor="middle" font-size="11" class="subtext-light">Optimal cache-line utilization; hardware prefetcher friendly</text>
    <text x="555" y="197" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Optimal cache-line utilization; hardware prefetcher friendly</text>
    <rect x="0" y="210" width="170" height="35" class="bad-light"/>
    <rect x="0" y="210" width="170" height="35" class="bad-dark" style="display:none;"/>
    <text x="85" y="232" text-anchor="middle" font-size="12" class="text-light">Search (unsorted)</text>
    <text x="85" y="232" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">Search (unsorted)</text>
    <rect x="170" y="210" width="120" height="35" class="bad-light"/>
    <rect x="170" y="210" width="120" height="35" class="bad-dark" style="display:none;"/>
    <text x="230" y="232" text-anchor="middle" font-size="12" class="text-light">O(n)</text>
    <text x="230" y="232" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n)</text>
    <rect x="290" y="210" width="120" height="35" class="bad-light"/>
    <rect x="290" y="210" width="120" height="35" class="bad-dark" style="display:none;"/>
    <text x="350" y="232" text-anchor="middle" font-size="12" class="text-light">O(n)</text>
    <text x="350" y="232" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n)</text>
    <rect x="410" y="210" width="290" height="35" class="bad-light"/>
    <rect x="410" y="210" width="290" height="35" class="bad-dark" style="display:none;"/>
    <text x="555" y="232" text-anchor="middle" font-size="11" class="subtext-light">Linear scan required; no structural advantage</text>
    <text x="555" y="232" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Linear scan required; no structural advantage</text>
    <rect x="0" y="245" width="170" height="35" class="neutral-light"/>
    <rect x="0" y="245" width="170" height="35" class="neutral-dark" style="display:none;"/>
    <text x="85" y="267" text-anchor="middle" font-size="12" class="text-light">Memory Footprint</text>
    <text x="85" y="267" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">Memory Footprint</text>
    <rect x="170" y="245" width="120" height="35" class="neutral-light"/>
    <rect x="170" y="245" width="120" height="35" class="neutral-dark" style="display:none;"/>
    <text x="230" y="267" text-anchor="middle" font-size="12" class="text-light">O(n) fixed</text>
    <text x="230" y="267" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n) fixed</text>
    <rect x="290" y="245" width="120" height="35" class="neutral-light"/>
    <rect x="290" y="245" width="120" height="35" class="neutral-dark" style="display:none;"/>
    <text x="350" y="267" text-anchor="middle" font-size="12" class="text-light">O(n) worst</text>
    <text x="350" y="267" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">O(n) worst</text>
    <rect x="410" y="245" width="290" height="35" class="neutral-light"/>
    <rect x="410" y="245" width="290" height="35" class="neutral-dark" style="display:none;"/>
    <text x="555" y="267" text-anchor="middle" font-size="11" class="subtext-light">No per-element overhead; but capacity may waste space</text>
    <text x="555" y="267" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">No per-element overhead; but capacity may waste space</text>
  </g>
  <text x="400" y="385" text-anchor="middle" font-size="11" class="subtext-light">Key insight: arrays excel at read-heavy, index-accessed, or sequentially-processed workloads. They struggle with frequent insertions/deletions at arbitrary positions.</text>
  <text x="400" y="385" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Key insight: arrays excel at read-heavy, index-accessed, or sequentially-processed workloads. They struggle with frequent insertions/deletions at arbitrary positions.</text>
  <text x="400" y="410" text-anchor="middle" font-size="11" class="subtext-light">When write frequency at arbitrary positions is high, linked structures or hash-based approaches become preferable despite higher per-element overhead.</text>
  <text x="400" y="410" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">When write frequency at arbitrary positions is high, linked structures or hash-based approaches become preferable despite higher per-element overhead.</text>
</svg>
`;

const multidimensionalArraysSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .box-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .box-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .row-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .row-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .arrow-light { stroke: #475569; stroke-width: 2; fill: none; marker-end: url(#arrow-light); }
      .arrow-dark { stroke: #94a3b8; stroke-width: 2; fill: none; marker-end: url(#arrow-dark); }
    </style>
    <marker id="arrow-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#475569"/>
    </marker>
    <marker id="arrow-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="340" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="340" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Multidimensional Arrays — Layout Strategies</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Multidimensional Arrays — Layout Strategies</text>
  <text x="200" y="70" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Row-Major Order (C, C++)</text>
  <text x="200" y="70" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Row-Major Order (C, C++)</text>
  <text x="600" y="70" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Column-Major Order (Fortran, MATLAB)</text>
  <text x="600" y="70" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Column-Major Order (Fortran, MATLAB)</text>
  <g transform="translate(60, 90)">
    <rect x="0" y="0" width="280" height="120" rx="4" class="box-light"/>
    <rect x="0" y="0" width="280" height="120" rx="4" class="box-dark" style="display:none;"/>
    <rect x="10" y="10" width="35" height="35" class="row-light"/>
    <rect x="10" y="10" width="35" height="35" class="row-dark" style="display:none;"/>
    <text x="27" y="32" text-anchor="middle" font-size="11" class="text-light">0,0</text>
    <text x="27" y="32" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0,0</text>
    <rect x="45" y="10" width="35" height="35" class="row-light"/>
    <rect x="45" y="10" width="35" height="35" class="row-dark" style="display:none;"/>
    <text x="62" y="32" text-anchor="middle" font-size="11" class="text-light">0,1</text>
    <text x="62" y="32" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0,1</text>
    <rect x="80" y="10" width="35" height="35" class="row-light"/>
    <rect x="80" y="10" width="35" height="35" class="row-dark" style="display:none;"/>
    <text x="97" y="32" text-anchor="middle" font-size="11" class="text-light">0,2</text>
    <text x="97" y="32" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0,2</text>
    <rect x="115" y="10" width="35" height="35" class="row-light"/>
    <rect x="115" y="10" width="35" height="35" class="row-dark" style="display:none;"/>
    <text x="132" y="32" text-anchor="middle" font-size="11" class="text-light">0,3</text>
    <text x="132" y="32" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0,3</text>
    <rect x="10" y="45" width="35" height="35" class="row-light" opacity="0.6"/>
    <rect x="10" y="45" width="35" height="35" class="row-dark" opacity="0.6" style="display:none;"/>
    <text x="27" y="67" text-anchor="middle" font-size="11" class="text-light">1,0</text>
    <text x="27" y="67" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1,0</text>
    <rect x="45" y="45" width="35" height="35" class="row-light" opacity="0.6"/>
    <rect x="45" y="45" width="35" height="35" class="row-dark" opacity="0.6" style="display:none;"/>
    <text x="62" y="67" text-anchor="middle" font-size="11" class="text-light">1,1</text>
    <text x="62" y="67" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1,1</text>
    <rect x="80" y="45" width="35" height="35" class="row-light" opacity="0.6"/>
    <rect x="80" y="45" width="35" height="35" class="row-dark" opacity="0.6" style="display:none;"/>
    <text x="97" y="67" text-anchor="middle" font-size="11" class="text-light">1,2</text>
    <text x="97" y="67" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1,2</text>
    <rect x="115" y="45" width="35" height="35" class="row-light" opacity="0.6"/>
    <rect x="115" y="45" width="35" height="35" class="row-dark" opacity="0.6" style="display:none;"/>
    <text x="132" y="67" text-anchor="middle" font-size="11" class="text-light">1,3</text>
    <text x="132" y="67" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1,3</text>
    <rect x="10" y="80" width="35" height="35" class="row-light" opacity="0.3"/>
    <rect x="10" y="80" width="35" height="35" class="row-dark" opacity="0.3" style="display:none;"/>
    <text x="27" y="102" text-anchor="middle" font-size="11" class="text-light">2,0</text>
    <text x="27" y="102" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2,0</text>
    <rect x="45" y="80" width="35" height="35" class="row-light" opacity="0.3"/>
    <rect x="45" y="80" width="35" height="35" class="row-dark" opacity="0.3" style="display:none;"/>
    <text x="62" y="102" text-anchor="middle" font-size="11" class="text-light">2,1</text>
    <text x="62" y="102" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2,1</text>
    <rect x="80" y="80" width="35" height="35" class="row-light" opacity="0.3"/>
    <rect x="80" y="80" width="35" height="35" class="row-dark" opacity="0.3" style="display:none;"/>
    <text x="97" y="102" text-anchor="middle" font-size="11" class="text-light">2,2</text>
    <text x="97" y="102" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2,2</text>
    <rect x="115" y="80" width="35" height="35" class="row-light" opacity="0.3"/>
    <rect x="115" y="80" width="35" height="35" class="row-dark" opacity="0.3" style="display:none;"/>
    <text x="132" y="102" text-anchor="middle" font-size="11" class="text-light">2,3</text>
    <text x="132" y="102" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2,3</text>
    <text x="200" y="115" text-anchor="middle" font-size="10" class="subtext-light">Traversal order: left to right, top to bottom</text>
    <text x="200" y="115" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Traversal order: left to right, top to bottom</text>
  </g>
  <g transform="translate(460, 90)">
    <rect x="0" y="0" width="280" height="120" rx="4" class="box-light"/>
    <rect x="0" y="0" width="280" height="120" rx="4" class="box-dark" style="display:none;"/>
    <rect x="10" y="10" width="35" height="35" class="row-light"/>
    <rect x="10" y="10" width="35" height="35" class="row-dark" style="display:none;"/>
    <text x="27" y="32" text-anchor="middle" font-size="11" class="text-light">0,0</text>
    <text x="27" y="32" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0,0</text>
    <rect x="45" y="10" width="35" height="35" class="row-light" opacity="0.6"/>
    <rect x="45" y="10" width="35" height="35" class="row-dark" opacity="0.6" style="display:none;"/>
    <text x="62" y="32" text-anchor="middle" font-size="11" class="text-light">1,0</text>
    <text x="62" y="32" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1,0</text>
    <rect x="80" y="10" width="35" height="35" class="row-light" opacity="0.3"/>
    <rect x="80" y="10" width="35" height="35" class="row-dark" opacity="0.3" style="display:none;"/>
    <text x="97" y="32" text-anchor="middle" font-size="11" class="text-light">2,0</text>
    <text x="97" y="32" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2,0</text>
    <rect x="10" y="45" width="35" height="35" class="row-light"/>
    <rect x="10" y="45" width="35" height="35" class="row-dark" style="display:none;"/>
    <text x="27" y="67" text-anchor="middle" font-size="11" class="text-light">0,1</text>
    <text x="27" y="67" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0,1</text>
    <rect x="45" y="45" width="35" height="35" class="row-light" opacity="0.6"/>
    <rect x="45" y="45" width="35" height="35" class="row-dark" opacity="0.6" style="display:none;"/>
    <text x="62" y="67" text-anchor="middle" font-size="11" class="text-light">1,1</text>
    <text x="62" y="67" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1,1</text>
    <rect x="80" y="45" width="35" height="35" class="row-light" opacity="0.3"/>
    <rect x="80" y="45" width="35" height="35" class="row-dark" opacity="0.3" style="display:none;"/>
    <text x="97" y="67" text-anchor="middle" font-size="11" class="text-light">2,1</text>
    <text x="97" y="67" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2,1</text>
    <text x="140" y="85" text-anchor="middle" font-size="10" class="subtext-light">Traversal order: top to bottom, left to right</text>
    <text x="140" y="85" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Traversal order: top to bottom, left to right</text>
  </g>
  <text x="400" y="240" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Flattened 1D Representation (Row-Major)</text>
  <text x="400" y="240" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Flattened 1D Representation (Row-Major)</text>
  <g transform="translate(100, 260)">
    <rect x="0" y="0" width="50" height="40" class="box-light"/>
    <rect x="0" y="0" width="50" height="40" class="box-dark" style="display:none;"/>
    <text x="25" y="25" text-anchor="middle" font-size="11" class="text-light">0,0</text>
    <text x="25" y="25" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0,0</text>
    <rect x="50" y="0" width="50" height="40" class="box-light"/>
    <rect x="50" y="0" width="50" height="40" class="box-dark" style="display:none;"/>
    <text x="75" y="25" text-anchor="middle" font-size="11" class="text-light">0,1</text>
    <text x="75" y="25" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0,1</text>
    <rect x="100" y="0" width="50" height="40" class="box-light"/>
    <rect x="100" y="0" width="50" height="40" class="box-dark" style="display:none;"/>
    <text x="125" y="25" text-anchor="middle" font-size="11" class="text-light">0,2</text>
    <text x="125" y="25" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0,2</text>
    <rect x="150" y="0" width="50" height="40" class="box-light"/>
    <rect x="150" y="0" width="50" height="40" class="box-dark" style="display:none;"/>
    <text x="175" y="25" text-anchor="middle" font-size="11" class="text-light">0,3</text>
    <text x="175" y="25" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0,3</text>
    <rect x="200" y="0" width="50" height="40" class="box-light"/>
    <rect x="200" y="0" width="50" height="40" class="box-dark" style="display:none;"/>
    <text x="225" y="25" text-anchor="middle" font-size="11" class="text-light">1,0</text>
    <text x="225" y="25" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1,0</text>
    <rect x="250" y="0" width="50" height="40" class="box-light"/>
    <rect x="250" y="0" width="50" height="40" class="box-dark" style="display:none;"/>
    <text x="275" y="25" text-anchor="middle" font-size="11" class="text-light">1,1</text>
    <text x="275" y="25" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1,1</text>
    <rect x="300" y="0" width="50" height="40" class="box-light"/>
    <rect x="300" y="0" width="50" height="40" class="box-dark" style="display:none;"/>
    <text x="325" y="25" text-anchor="middle" font-size="11" class="text-light">1,2</text>
    <text x="325" y="25" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1,2</text>
    <rect x="350" y="0" width="50" height="40" class="box-light"/>
    <rect x="350" y="0" width="50" height="40" class="box-dark" style="display:none;"/>
    <text x="375" y="25" text-anchor="middle" font-size="11" class="text-light">1,3</text>
    <text x="375" y="25" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1,3</text>
    <rect x="400" y="0" width="50" height="40" class="box-light"/>
    <rect x="400" y="0" width="50" height="40" class="box-dark" style="display:none;"/>
    <text x="425" y="25" text-anchor="middle" font-size="11" class="text-light">2,0</text>
    <text x="425" y="25" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2,0</text>
    <rect x="450" y="0" width="50" height="40" class="box-light"/>
    <rect x="450" y="0" width="50" height="40" class="box-dark" style="display:none;"/>
    <text x="475" y="25" text-anchor="middle" font-size="11" class="text-light">...</text>
    <text x="475" y="25" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">...</text>
    <rect x="500" y="0" width="50" height="40" class="box-light"/>
    <rect x="500" y="0" width="50" height="40" class="box-dark" style="display:none;"/>
    <text x="525" y="25" text-anchor="middle" font-size="11" class="text-light">2,3</text>
    <text x="525" y="25" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2,3</text>
  </g>
  <text x="400" y="330" text-anchor="middle" font-size="11" class="subtext-light">Address formula (row-major): base + (row × numCols + col) × elementSize. Choice of layout affects cache performance for matrix traversal patterns.</text>
  <text x="400" y="330" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Address formula (row-major): base + (row × numCols + col) × elementSize. Choice of layout affects cache performance for matrix traversal patterns.</text>
</svg>
`;

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          An <strong>array</strong> is a fundamental linear data structure that stores a fixed-size sequential collection of elements of the same type in contiguous memory locations. Each element is accessed by its index — a non-negative integer representing its offset from the array&apos;s starting address. The defining characteristic of arrays is <strong>constant-time random access</strong>: given an index <em>i</em>, the memory address of the <em>i</em>-th element is computed in O(1) time via the formula <code>address = baseAddress + (i × elementSize)</code>.
        </p>
        <p>
          Arrays are the foundation upon which nearly all other data structures are built. Operating systems allocate arrays as memory blocks, CPUs optimize their cache hierarchies around array-like access patterns, and database storage engines use arrays as the underlying representation for pages and buffers. For staff and principal engineers, understanding arrays extends far beyond basic indexing — it requires deep knowledge of memory layout, cache-line behavior, multidimensional array representations, dynamic resizing strategies, and the trade-offs that determine when arrays are the optimal choice versus when linked structures or hash-based alternatives are preferable.
        </p>
        <p>
          In production systems, arrays serve as the backbone of column-oriented databases (Apache Parquet, ClickHouse), numerical computing libraries (NumPy, BLAS), real-time analytics pipelines, and any workload where sequential scan throughput or indexed access latency is the primary bottleneck. The decision to use arrays versus alternative structures is often the single most impactful performance decision in a system&apos;s architecture.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <h3>Contiguous Memory Allocation</h3>
        <p>
          Arrays occupy a single, unbroken block of memory. This contiguous allocation is the source of their greatest advantage: it enables direct address calculation for any element without traversing intermediate nodes or following pointers. When an array is allocated, the runtime reserves a block of <code>n × elementSize</code> bytes, and every element sits at a deterministic offset from the base address. This property eliminates the per-element pointer overhead that linked structures require — a 64-bit pointer on a 64-bit system adds 8 bytes per element, which for a billion-element array translates to roughly 8 GB of memory wasted on pointers alone.
        </p>
        <p>
          The contiguous layout also means that arrays benefit from <strong>spatial locality</strong>. When a CPU accesses an element, the entire cache line (typically 64 bytes on modern x86 and ARM processors) is loaded from main memory into the L1 cache. Subsequent accesses to adjacent elements hit in the L1 cache rather than incurring main memory latency. For an array of 8-byte integers, a single 64-byte cache line brings 8 elements into cache simultaneously. Sequential iteration over an array therefore achieves near-optimal memory bandwidth utilization — the hardware prefetcher detects the stride pattern and pre-loads the next cache line before the program even requests it.
        </p>

        <h3>Fixed Size versus Dynamic Arrays</h3>
        <p>
          Static arrays have a size determined at allocation time and cannot grow or shrink. This is a constraint in languages like C, where <code>int arr[100]</code> reserves exactly 400 bytes (assuming 4-byte integers) for the lifetime of the scope. Dynamic arrays, found in virtually every higher-level language (Java&apos;s <code>ArrayList</code>, Python&apos;s <code>list</code>, JavaScript&apos;s native <code>Array</code>, C++&apos;s <code>std::vector</code>), overcome this limitation by allocating a larger underlying buffer than currently needed and tracking a separate <code>size</code> counter alongside the <code>capacity</code>.
        </p>
        <p>
          When the size reaches capacity, the dynamic array allocates a new buffer — typically double the previous capacity — copies all existing elements to the new buffer, inserts the new element, and deallocates the old buffer. This resize operation costs O(n) time, but because it occurs infrequently (only when capacity is exceeded, and capacity grows exponentially), the <strong>amortized cost</strong> of appending remains O(1). The geometric growth strategy (multiplying capacity by a factor of 1.5 or 2) ensures that the total work for <em>n</em> append operations is bounded by O(n), even though individual appends occasionally trigger expensive resizes.
        </p>

        <h3>Cache-Line Alignment and False Sharing</h3>
        <p>
          In multithreaded systems, arrays introduce a subtle performance hazard called <strong>false sharing</strong>. When two threads modify different array elements that happen to reside on the same cache line, the cache coherency protocol forces the cache line to bounce between CPU cores, degrading performance to near-serial speeds despite the threads operating on logically independent data. Mitigation strategies include padding elements to cache-line boundaries (64 bytes), partitioning the array so that each thread owns distinct cache lines, or using array-of-structures-to-structure-of-arrays transformations that separate frequently-co-accessed fields.
        </p>

        <h3>Multidimensional Arrays</h3>
        <p>
          Multidimensional arrays are logically organized as grids or tensors but physically stored as linear 1D arrays. The mapping from logical coordinates to a linear index follows either <strong>row-major order</strong> (used by C, C++, and most mainstream languages) or <strong>column-major order</strong> (used by Fortran, MATLAB, and numerical computing libraries). In row-major order, elements of the same row are stored adjacently; in column-major order, elements of the same column are stored adjacently. The choice of layout has significant performance implications for matrix traversal algorithms: iterating in the native order achieves optimal cache performance, while iterating in the opposite order causes cache-line thrashing because each access potentially lands in a different cache line.
        </p>

        <ArticleImage svgContent={arrayMemoryLayoutSVG} caption="Array memory layout showing contiguous allocation and cache-line boundaries" />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Dynamic Array Growth Strategy</h3>
        <p>
          The architecture of a dynamic array involves three internal components: a pointer to the allocated buffer, a size counter tracking the number of logically present elements, and a capacity counter tracking the total buffer size. Appending an element when size is less than capacity simply writes the element at index <code>size</code> and increments the counter — a true O(1) operation. When size equals capacity, the growth procedure allocates a new buffer (typically 2× the current capacity), copies all existing elements via <code>memcpy</code> or an equivalent block transfer, places the new element, and frees the old buffer.
        </p>
        <p>
          This growth procedure creates a characteristic cost pattern: a sequence of cheap O(1) insertions punctuated by occasional O(n) resize operations. The mathematical proof of amortized O(1) uses aggregate analysis: inserting <em>n</em> elements into an empty dynamic array with doubling costs at most 3n - 2 element assignments (each element is copied at most log₂ n times, and the sum of the geometric series converges to less than 2n). Therefore, the average cost per insertion is constant even though the worst-case single-operation cost is linear.
        </p>

        <h3>Memory Allocator Interaction</h3>
        <p>
          Arrays interact with the system&apos;s memory allocator in ways that affect their real-world performance. The allocator must find a contiguous free block of sufficient size, which becomes increasingly difficult as the heap fragments over time. Large array allocations may require the operating system to map new pages via <code>mmap</code> on Unix or <code>VirtualAlloc</code> on Windows, rather than using the heap allocator. Memory allocators like jemalloc and tcmalloc implement size-class segregation that handles array allocations efficiently, but extremely large arrays (gigabytes) can trigger page faults and transparent huge page allocations that introduce latency spikes.
        </p>

        <ArticleImage svgContent={dynamicArrayGrowthSVG} caption="Dynamic array resizing shows allocation, copying, and amortized cost analysis" />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <h3>Arrays versus Linked Lists</h3>
        <p>
          The choice between arrays and linked lists represents one of the most fundamental trade-offs in system design. Arrays provide O(1) random access and optimal cache-line utilization but require O(n) time to insert or delete at arbitrary positions because elements must be shifted. Linked lists provide O(1) insertion and deletion given a pointer to the position but require O(n) traversal to reach that position and incur per-element pointer overhead (8-16 bytes per element on 64-bit systems, more if the allocator adds metadata). More critically, linked lists exhibit poor cache performance: nodes are scattered across the heap, and traversing a linked list causes a cache miss for nearly every element, making real-world traversal 10-50× slower than array iteration even when the algorithmic complexity is identical.
        </p>

        <h3>Arrays versus Hash Tables</h3>
        <p>
          When the access pattern is key-based rather than index-based, hash tables become the natural comparison point. Arrays provide O(1) access only for integer indices within bounds; hash tables provide O(1) average access for arbitrary keys at the cost of additional memory for the hash function, buckets, and load-factor management. Arrays are preferable when the key space is dense and maps cleanly to integer indices; hash tables are preferable when keys are sparse, non-integer, or when the key space is significantly larger than the active dataset.
        </p>

        <h3>Arrays versus Trees</h3>
        <p>
          For sorted data, arrays support binary search in O(log n) time but require O(n) insertion to maintain the sorted order. Binary search trees (BSTs) and balanced variants (AVL, Red-Black, B-trees) support O(log n) search, insertion, and deletion, making them preferable for workloads with frequent ordered insertions. However, trees incur O(n) space for pointers and suffer worse cache performance due to pointer chasing. Arrays are the right choice when the dataset is static or append-only with periodic batch sorts; trees are better when ordered mutations are continuous.
        </p>

        <ArticleImage svgContent={arrayTradeoffsSVG} caption="Array operation complexity and trade-off analysis across common operations" />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use arrays when your workload is read-heavy with index-based or sequential access patterns. Pre-allocate capacity when the approximate size is known to avoid resizing overhead and memory fragmentation. For multidimensional arrays, choose row-major or column-major layout to match your traversal pattern — traverse rows in the inner loop for row-major arrays, columns for column-major arrays. When building column-oriented databases or analytics engines, store data in arrays of primitive types (structure-of-arrays layout) rather than arrays of objects to maximize vectorization and cache efficiency.
        </p>
        <p>
          For multithreaded access, pad array elements or partition the array to avoid false sharing — ensure that elements modified by different threads fall on different cache lines. Use memory-mapped arrays (via <code>mmap</code> or language-specific equivalents) for datasets larger than available RAM, letting the operating system manage paging. When implementing circular buffers or ring buffers on top of arrays, use power-of-two sizes and bitwise AND for index wrapping to avoid expensive modulo operations.
        </p>
        <p>
          In garbage-collected languages, be aware that arrays of references create GC pressure proportional to array size; consider using primitive arrays or off-heap storage for large datasets. When serializing arrays, prefer binary formats (Protocol Buffers, MessagePack, flat buffers) over text formats (JSON) to avoid parsing overhead and maintain the compactness advantage of the in-memory representation.
        </p>

        <ArticleImage svgContent={multidimensionalArraysSVG} caption="Row-major versus column-major multidimensional array layout strategies" />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall with arrays is <strong>off-by-one errors</strong> and boundary condition mistakes. Arrays are zero-indexed in virtually all modern languages, and accessing index <code>n</code> in an array of size <code>n</code> is an out-of-bounds error that in C/C++ causes undefined behavior (potential security vulnerabilities via buffer overflow) and in managed languages throws a runtime exception. Always validate indices against the array bounds, and prefer range-based or iterator-based traversal patterns that eliminate manual index management.
        </p>
        <p>
          <strong>Unintended quadratic behavior</strong> is another frequent mistake. Appending to an array by creating a new array and copying all elements on every append (a pattern sometimes seen in functional programming or in languages with immutable data structures) results in O(n²) total time for <em>n</em> appends. Use a dynamic array with geometric growth, or accumulate elements in a mutable buffer and convert to an immutable structure once.
        </p>
        <p>
          <strong>Memory waste from over-allocation</strong> occurs when dynamic arrays grow to handle peak load but the working set subsequently shrinks. The array retains its peak capacity, potentially wasting gigabytes of memory. Implement a shrink-to-fit operation or manually reduce capacity when the size falls significantly below capacity (e.g., below 25% utilization). Similarly, pre-allocating an excessively large static array &quot;just in case&quot; wastes memory and can cause allocation failures for very large sizes on memory-constrained systems.
        </p>
        <p>
          <strong>Cache-line false sharing</strong> in concurrent programs is a subtle performance bug that is extremely difficult to diagnose because the program produces correct results but runs orders of magnitude slower than expected. When profiling multithreaded array-processing code and observing unexpectedly poor scaling with core count, investigate whether different threads are writing to elements on the same cache line.
        </p>
        <p>
          <strong>Integer overflow in address calculation</strong> for very large arrays can cause security vulnerabilities. The formula <code>baseAddress + (index × elementSize)</code> can overflow a 32-bit integer when the array is large enough, causing the computed address to wrap around and point to an unrelated memory region. This class of vulnerability has been exploited in numerous real-world security incidents. Always use 64-bit arithmetic for address calculations and validate that the resulting index is within bounds.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Column-oriented databases</strong> like Apache Parquet, ClickHouse, and Amazon Redshift store each column as a compressed array. This structure enables vectorized query execution where a single CPU instruction processes multiple array elements simultaneously (SIMD), achieving scan throughput of billions of rows per second. The array representation is essential for this performance: it allows the query engine to process an entire cache line of column values in a tight loop without pointer chasing.
        </p>
        <p>
          <strong>Numerical computing and machine learning</strong> frameworks (NumPy, TensorFlow, PyTorch) represent tensors as multidimensional arrays with strides. The array layout determines whether matrix multiplication, convolution, and other linear algebra operations achieve peak floating-point throughput. BLAS libraries are hand-tuned to exploit array memory layouts, using cache-blocking and loop-unrolling techniques that are only possible because the underlying data is in contiguous arrays.
        </p>
        <p>
          <strong>Real-time analytics dashboards</strong> use circular buffer arrays to maintain sliding windows of metrics (request rates, error rates, latency percentiles) over fixed time windows. The array&apos;s O(1) append and index-based access enable constant-time updates and lookups regardless of window size. When the buffer fills, the write pointer wraps around, overwriting the oldest data — a pattern that requires zero memory allocation during steady-state operation.
        </p>
        <p>
          <strong>Network packet buffers</strong> in operating systems and high-performance networking frameworks (DPDK, XDP) use pre-allocated arrays of packet buffers to achieve line-rate processing. The array approach eliminates allocation latency during packet processing and enables batch operations on contiguous buffer regions that can be passed to DMA engines for direct memory access.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <h3>1. Explain why dynamic array append is amortized O(1) despite occasional O(n) resize operations. Walk through the mathematical proof.</h3>
        <p>
          The key insight is that amortized analysis considers the <em>total cost of a sequence of operations</em> divided by the number of operations, rather than the worst-case cost of any single operation. For a dynamic array that doubles its capacity when full, let us analyze the total cost of inserting <em>n</em> elements starting from an empty array with capacity 1.
        </p>
        <p>
          The first insertion costs 1 (simple write). The second insertion triggers a resize: we allocate a new array of capacity 2, copy 1 element, and write the new element — total cost 2. The third insertion triggers another resize to capacity 4: we copy 2 elements and write 1 — total cost 3. In general, the <em>i</em>-th resize occurs when the array is full at capacity 2<sup>(i-1)</sup>, and the resize copies 2<sup>(i-1)</sup> elements before writing the new element.
        </p>
        <p>
          The total cost for <em>n</em> insertions is the sum of all individual insertion costs. Most insertions cost 1. The expensive resizes occur at insertions 2, 4, 8, 16, ..., up to the largest power of 2 less than <em>n</em>. The total copy cost is 1 + 2 + 4 + 8 + ... + 2<sup>k</sup> where 2<sup>k</sup> &lt; n, which sums to 2<sup>(k+1)</sup> - 1 &lt; 2n. Adding the n simple writes, the total cost is at most 3n. Dividing by n operations gives an amortized cost of at most 3 per operation, which is O(1).
        </p>
        <p>
          An interviewer will often follow up by asking why we double rather than add a constant amount. If we added a fixed constant (say, 10 elements) on each resize, the total cost for <em>n</em> insertions would be O(n²) because we would resize O(n) times, each copying an increasing number of elements. Geometric growth is essential to achieving amortized O(1).
        </p>

        <h3>2. How does cache-line size affect array performance? What happens when you iterate over an array of structs versus an array of primitive values?</h3>
        <p>
          Cache lines are the unit of data transfer between main memory and CPU caches, typically 64 bytes on modern processors. When the CPU reads any byte from main memory, it loads the entire 64-byte cache line containing that byte. For an array of 8-byte integers, one cache line contains 8 integers. Iterating sequentially, the CPU incurs one cache miss every 8 elements, achieving 8× fewer main memory accesses than if each element required its own cache line.
        </p>
        <p>
          For an array of structs (structure-of-arrays versus array-of-structures), the impact is more nuanced. In an array-of-structures layout (e.g., <code>struct { int x; int y; int z; }</code>), each element might be 12 bytes (plus padding to 16 bytes for alignment). A 64-byte cache line holds 4 elements. If the algorithm only accesses the <code>x</code> field, it still loads <code>y</code> and <code>z</code> into cache — wasting 75% of the cache-line bandwidth on unused data. In a structure-of-arrays layout (three separate arrays: <code>x[]</code>, <code>y[]</code>, <code>z[]</code>), the <code>x[]</code> array packs only <code>x</code> values, fitting 16 values per cache line and achieving 4× better cache utilization for <code>x</code>-only workloads.
        </p>
        <p>
          This is why column-oriented databases and SIMD-optimized libraries use structure-of-arrays: they process one field across many records, and the array layout ensures every cache line contains only the relevant field. In an interview, discussing this distinction demonstrates deep understanding of how data structure layout interacts with hardware architecture.
        </p>

        <h3>3. When would you choose a linked list over an array? Are there any scenarios where linked lists actually outperform arrays in practice?</h3>
        <p>
          The textbook answer is &quot;when you need frequent insertions and deletions at arbitrary positions.&quot; While technically correct, the practical answer is more nuanced. Linked lists outperform arrays only when: (a) the insertion/deletion position is already known (you have a pointer to the node), so no traversal cost is incurred; (b) the list is large enough that shifting array elements is significantly more expensive than following a few pointers; and (c) the access pattern is truly random rather than sequential.
        </p>
        <p>
          In practice, there are specific scenarios where linked lists are genuinely better. When implementing a memory allocator&apos;s free list, the nodes already exist at scattered addresses, and insertion/removal is frequent. When maintaining an LRU cache with a hash map plus doubly linked list, the linked list provides O(1) move-to-front and move-to-back operations that arrays cannot match without shifting. When building a browser&apos;s history stack or a text editor&apos;s undo history where elements are complex objects and insertions occur primarily at the head or tail, a linked structure avoids copying large objects.
        </p>
        <p>
          However, for most workloads, arrays or array-based structures (circular buffers, gap buffers, B-trees) outperform linked lists due to cache effects. A well-known result in systems engineering is that even a binary search on a sorted array is often faster than traversing a binary search tree of the same size, because the array&apos;s cache-line utilization more than compensates for the algorithmic advantage of the tree&apos;s O(log n) pointer-based navigation. An answer that acknowledges this reality — that linked lists are rarely the best choice despite their theoretical advantages — demonstrates senior-level engineering judgment.
        </p>

        <h3>4. How would you design a thread-safe array that supports concurrent reads and writes without locking the entire structure?</h3>
        <p>
          A production-grade concurrent array requires different strategies depending on the access pattern. For append-only workloads (e.g., event logs, time-series data), a lock-free ring buffer or a sharded array works well. The array is partitioned into segments (e.g., one segment per CPU core), and each segment has its own fine-grained lock or uses atomic compare-and-swap (CAS) operations. Writers append to their assigned segment, and readers scan across all segments. This eliminates contention entirely for writes and limits read contention to segment boundary checks.
        </p>
        <p>
          For general concurrent reads and writes at arbitrary positions, a <strong>copy-on-write (COW) array</strong> is appropriate when reads vastly outnumber writes. Each write creates a new copy of the array (or the affected segment) and atomically swaps the pointer. Readers always access the current pointer without locking. This is the approach used by Java&apos;s <code>CopyOnWriteArrayList</code> and is ideal for configuration arrays or routing tables that are updated infrequently but read by thousands of concurrent threads.
        </p>
        <p>
          For high-write-concurrency scenarios, a <strong>lock-free array using hazard pointers or epoch-based reclamation</strong> manages memory safely without garbage collection. Each writer uses CAS to update an element, and the system tracks which array elements are being accessed by which threads to defer deallocation until no thread holds a reference. This is the approach used by high-performance concurrent hash tables (like those in Folly or Crossbeam). The key insight to articulate in an interview is that the challenge is not the concurrent access itself — CAS handles that — but the safe memory reclamation in a language without automatic garbage collection.
        </p>

        <h3>5. Explain the false sharing problem in arrays and how you would detect and mitigate it in a production system.</h3>
        <p>
          False sharing occurs when two or more threads modify different variables that reside on the same cache line. The cache coherency protocol (MESI — Modified, Exclusive, Shared, Invalidated) operates at cache-line granularity, not variable granularity. When Thread A on Core 0 modifies <code>arr[0]</code> and Thread B on Core 1 modifies <code>arr[1]</code>, and both elements sit on the same 64-byte cache line, the cache line continuously transitions between Modified and Invalidated states as the cores compete for ownership. The result is that each write requires a round-trip to main memory or the other core&apos;s cache, degrading performance from nanoseconds to hundreds of nanoseconds per write.
        </p>
        <p>
          Detection in production uses hardware performance counters: the <code>mem_load_retired.l3_hit_miss</code> and <code>lock_cycles</code> events on Intel processors, or the <code>L1D_CACHE_LD_FD</code> event on ARM. Tools like Intel VTune, Linux <code>perf c2c</code> (cache-to-cache), and Valgrind&apos;s DRD can identify false sharing hot spots by tracking cache-line transitions. In a production monitoring context, unexpectedly poor scaling when adding CPU cores to an array-processing workload is a strong indicator of false sharing.
        </p>
        <p>
          Mitigation strategies include padding: declaring each element as a struct with 64 bytes of padding ensures each element occupies its own cache line. In C, this is <code>struct { int64_t value; char padding[56]; }</code> (assuming the element is 8 bytes). In Java, the <code>@sun.misc.Contended</code> annotation (or manual padding with unused fields) achieves the same effect. Another approach is <strong>array partitioning</strong>: dividing the array into chunks aligned to cache-line boundaries and assigning each chunk to a single thread, eliminating cross-thread cache-line sharing entirely. A third approach is <strong>data layout transformation</strong>: converting from array-of-structures to structure-of-arrays so that fields modified by different threads live in separate arrays that never share cache lines.
        </p>

        <h3>6. How do multidimensional array layout choices (row-major vs. column-major) affect the performance of matrix multiplication and image processing?</h3>
        <p>
          Matrix multiplication C = A × B involves computing each element C[i][j] as the dot product of row i of A and column j of B. In row-major layout, accessing row i of A is sequential (optimal), but accessing column j of B is strided — each element of column j is separated by the row width in memory, causing a cache miss for every element of B accessed. This makes the naive algorithm cache-inefficient for large matrices that do not fit in cache.
        </p>
        <p>
          The solution is <strong>cache-oblivious or cache-aware tiling</strong>: divide the matrices into sub-blocks (tiles) that fit in L1 or L2 cache, and compute the multiplication tile by tile. This ensures that each tile of A and B is loaded into cache once and reused for all computations within that tile, dramatically reducing cache misses. BLAS libraries use this technique with hand-tuned tile sizes for each cache level. The optimal tile size is typically determined empirically for each CPU architecture.
        </p>
        <p>
          For image processing, images are typically stored in row-major order (scan lines from top to bottom, pixels left to right within each row). Operations that process pixels row by row (e.g., horizontal blur, row-wise normalization) achieve optimal cache performance. Operations that process column by column (e.g., vertical blur, column-wise statistics) suffer from strided access. Production image processing libraries handle this by transposing the image (or processing it in column-major blocks) when column-oriented operations dominate, or by using blocked algorithms that process small rectangular regions that fit in cache regardless of the operation direction. In an interview, discussing tiling and blocked algorithms demonstrates understanding of how to bridge the gap between algorithmic design and hardware reality.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li>Knuth, D.E. — &quot;The Art of Computer Programming, Volume 1: Fundamental Algorithms&quot; — Addison-Wesley, 3rd Edition</li>
          <li>Cormen, T.H., Leiserson, C.E., Rivest, R.L., Stein, C. — &quot;Introduction to Algorithms&quot; — MIT Press, 4th Edition, Chapters 10-11</li>
          <li>Drepper, U. — &quot;What Every Programmer Should Know About Memory&quot; — Red Hat, Inc., 2007</li>
          <li>Intel Corporation — &quot;Intel 64 and IA-32 Architectures Optimization Reference Manual&quot; — Section 2.3: Cache-Line and False Sharing</li>
          <li>Graefe, G. — &quot;Modern B-Tree Techniques&quot; — Foundations and Trends in Databases, Vol. 3, No. 4, 2011</li>
          <li>Abadi, D.J., Boncz, P., Harizopoulos, S. — &quot;The Design and Implementation of Modern Column-Oriented Database Systems&quot; — Foundations and Trends in Databases, 2013</li>
          <li>Herlihy, M., Shavit, N. — &quot;The Art of Multiprocessor Programming&quot; — Morgan Kaufmann, Revised Edition, Chapters 3-5 (Lock-Free Arrays and Concurrent Data Structures)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-data-structures-doubly-linked-lists",
  title: "Doubly Linked Lists",
  description:
    "Comprehensive guide to doubly linked lists: bidirectional traversal, O(1) deletion, circular lists, Linux kernel implementation, LRU cache design, and production-scale trade-offs for staff and principal engineer interviews.",
  category: "other",
  subcategory: "data-structures-algorithms/data-structures",
  slug: "doubly-linked-lists",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-14",
  tags: ["data-structures", "linked-lists", "bidirectional", "lru-cache"],
  relatedTopics: ["singly-linked-lists", "arrays", "hash-tables"],
};

const doublyLinkedListStructureSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .data-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .data-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .prev-light { fill: #fef3c7; stroke: #d97706; stroke-width: 2; }
      .prev-dark { fill: #451a03; stroke: #fbbf24; stroke-width: 2; }
      .next-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .next-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .fwd-arrow-light { stroke: #16a34a; stroke-width: 2; fill: none; marker-end: url(#fwd-light); }
      .fwd-arrow-dark { stroke: #4ade80; stroke-width: 2; fill: none; marker-end: url(#fwd-dark); }
      .bwd-arrow-light { stroke: #d97706; stroke-width: 2; fill: none; marker-end: url(#bwd-light); }
      .bwd-arrow-dark { stroke: #fbbf24; stroke-width: 2; fill: none; marker-end: url(#bwd-dark); }
    </style>
    <marker id="fwd-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#16a34a"/>
    </marker>
    <marker id="fwd-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#4ade80"/>
    </marker>
    <marker id="bwd-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#d97706"/>
    </marker>
    <marker id="bwd-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="300" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="300" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Doubly Linked List — Bidirectional Node Structure</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Doubly Linked List — Bidirectional Node Structure</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Each node: [Prev Pointer | Data | Next Pointer]. Forward and backward traversal. O(1) deletion given node pointer.</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Each node: [Prev Pointer | Data | Next Pointer]. Forward and backward traversal. O(1) deletion given node pointer.</text>
  <g transform="translate(40, 100)">
    <rect x="0" y="0" width="50" height="60" class="prev-light"/>
    <rect x="0" y="0" width="50" height="60" class="prev-dark" style="display:none;"/>
    <text x="25" y="35" text-anchor="middle" font-size="10" class="text-light">NULL</text>
    <text x="25" y="35" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">NULL</text>
    <rect x="50" y="0" width="60" height="60" class="data-light"/>
    <rect x="50" y="0" width="60" height="60" class="data-dark" style="display:none;"/>
    <text x="80" y="35" text-anchor="middle" font-size="14" class="text-light">A</text>
    <text x="80" y="35" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">A</text>
    <rect x="110" y="0" width="50" height="60" class="next-light"/>
    <rect x="110" y="0" width="50" height="60" class="next-dark" style="display:none;"/>
    <text x="135" y="35" text-anchor="middle" font-size="10" class="text-light">0x2B00</text>
    <text x="135" y="35" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">0x2B00</text>
    <text x="80" y="80" text-anchor="middle" font-size="10" class="subtext-light">Node A (head)</text>
    <text x="80" y="80" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Node A (head)</text>
  </g>
  <path d="M 200 130 L 230 130" class="fwd-arrow-light"/>
  <path d="M 200 130 L 230 130" class="fwd-arrow-dark" style="display:none;"/>
  <path d="M 230 140 L 200 140" class="bwd-arrow-light"/>
  <path d="M 230 140 L 200 140" class="bwd-arrow-dark" style="display:none;"/>
  <g transform="translate(230, 100)">
    <rect x="0" y="0" width="50" height="60" class="prev-light"/>
    <rect x="0" y="0" width="50" height="60" class="prev-dark" style="display:none;"/>
    <text x="25" y="35" text-anchor="middle" font-size="10" class="text-light">0x1A00</text>
    <text x="25" y="35" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">0x1A00</text>
    <rect x="50" y="0" width="60" height="60" class="data-light"/>
    <rect x="50" y="0" width="60" height="60" class="data-dark" style="display:none;"/>
    <text x="80" y="35" text-anchor="middle" font-size="14" class="text-light">B</text>
    <text x="80" y="35" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">B</text>
    <rect x="110" y="0" width="50" height="60" class="next-light"/>
    <rect x="110" y="0" width="50" height="60" class="next-dark" style="display:none;"/>
    <text x="135" y="35" text-anchor="middle" font-size="10" class="text-light">0x3C00</text>
    <text x="135" y="35" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">0x3C00</text>
    <text x="80" y="80" text-anchor="middle" font-size="10" class="subtext-light">Node B</text>
    <text x="80" y="80" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Node B</text>
  </g>
  <path d="M 390 130 L 420 130" class="fwd-arrow-light"/>
  <path d="M 390 130 L 420 130" class="fwd-arrow-dark" style="display:none;"/>
  <path d="M 420 140 L 390 140" class="bwd-arrow-light"/>
  <path d="M 420 140 L 390 140" class="bwd-arrow-dark" style="display:none;"/>
  <g transform="translate(420, 100)">
    <rect x="0" y="0" width="50" height="60" class="prev-light"/>
    <rect x="0" y="0" width="50" height="60" class="prev-dark" style="display:none;"/>
    <text x="25" y="35" text-anchor="middle" font-size="10" class="text-light">0x2B00</text>
    <text x="25" y="35" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">0x2B00</text>
    <rect x="50" y="0" width="60" height="60" class="data-light"/>
    <rect x="50" y="0" width="60" height="60" class="data-dark" style="display:none;"/>
    <text x="80" y="35" text-anchor="middle" font-size="14" class="text-light">C</text>
    <text x="80" y="35" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">C</text>
    <rect x="110" y="0" width="50" height="60" class="next-light"/>
    <rect x="110" y="0" width="50" height="60" class="next-dark" style="display:none;"/>
    <text x="135" y="35" text-anchor="middle" font-size="10" class="text-light">0x4D00</text>
    <text x="135" y="35" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">0x4D00</text>
    <text x="80" y="80" text-anchor="middle" font-size="10" class="subtext-light">Node C</text>
    <text x="80" y="80" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Node C</text>
  </g>
  <path d="M 580 130 L 610 130" class="fwd-arrow-light"/>
  <path d="M 580 130 L 610 130" class="fwd-arrow-dark" style="display:none;"/>
  <path d="M 610 140 L 580 140" class="bwd-arrow-light"/>
  <path d="M 610 140 L 580 140" class="bwd-arrow-dark" style="display:none;"/>
  <g transform="translate(610, 100)">
    <rect x="0" y="0" width="50" height="60" class="prev-light"/>
    <rect x="0" y="0" width="50" height="60" class="prev-dark" style="display:none;"/>
    <text x="25" y="35" text-anchor="middle" font-size="10" class="text-light">0x3C00</text>
    <text x="25" y="35" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">0x3C00</text>
    <rect x="50" y="0" width="60" height="60" class="data-light"/>
    <rect x="50" y="0" width="60" height="60" class="data-dark" style="display:none;"/>
    <text x="80" y="35" text-anchor="middle" font-size="14" class="text-light">D</text>
    <text x="80" y="35" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">D</text>
    <rect x="110" y="0" width="50" height="60" class="next-light"/>
    <rect x="110" y="0" width="50" height="60" class="next-dark" style="display:none;"/>
    <text x="135" y="35" text-anchor="middle" font-size="10" class="text-light">NULL</text>
    <text x="135" y="35" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">NULL</text>
    <text x="80" y="80" text-anchor="middle" font-size="10" class="subtext-light">Node D (tail)</text>
    <text x="80" y="80" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Node D (tail)</text>
  </g>
  <text x="400" y="230" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Key Properties</text>
  <text x="400" y="230" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Key Properties</text>
  <text x="400" y="250" text-anchor="middle" font-size="11" class="subtext-light">Search: O(n) | Insert/Delete at known node: O(1) | Forward traversal: O(n) | Backward traversal: O(n)</text>
  <text x="400" y="250" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Search: O(n) | Insert/Delete at known node: O(1) | Forward traversal: O(n) | Backward traversal: O(n)</text>
  <text x="400" y="270" text-anchor="middle" font-size="11" class="subtext-light">Space: O(n) + 2n pointers (16 bytes/node overhead on 64-bit). No predecessor search needed for deletion.</text>
  <text x="400" y="270" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Space: O(n) + 2n pointers (16 bytes/node overhead on 64-bit). No predecessor search needed for deletion.</text>
  <text x="400" y="290" text-anchor="middle" font-size="11" class="subtext-light">Green = forward (next) pointers | Amber = backward (prev) pointers</text>
  <text x="400" y="290" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Green = forward (next) pointers | Amber = backward (prev) pointers</text>
</svg>
`;

const deletionOperationSVG = `
<svg xmlns="http://www.w3.org/000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .node-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .node-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .del-light { fill: #fee2e2; stroke: #dc2626; stroke-width: 2; opacity: 0.5; }
      .del-dark { fill: #450a0a; stroke: #f87171; stroke-width: 2; opacity: 0.5; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .fwd-arrow-light { stroke: #16a34a; stroke-width: 2; fill: none; marker-end: url(#fwd-light); }
      .fwd-arrow-dark { stroke: #4ade80; stroke-width: 2; fill: none; marker-end: url(#fwd-dark); }
      .bwd-arrow-light { stroke: #d97706; stroke-width: 2; fill: none; marker-end: url(#bwd-light); }
      .bwd-arrow-dark { stroke: #fbbf24; stroke-width: 2; fill: none; marker-end: url(#bwd-dark); }
      .new-fwd-light { stroke: #16a34a; stroke-width: 3; fill: none; marker-end: url(#fwd-light); }
      .new-fwd-dark { stroke: #4ade80; stroke-width: 3; fill: none; marker-end: url(#fwd-dark); }
      .new-bwd-light { stroke: #d97706; stroke-width: 3; fill: none; marker-end: url(#bwd-light); }
      .new-bwd-dark { stroke: #fbbf24; stroke-width: 3; fill: none; marker-end: url(#bwd-dark); }
    </style>
    <marker id="fwd-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#16a34a"/>
    </marker>
    <marker id="fwd-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#4ade80"/>
    </marker>
    <marker id="bwd-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#d97706"/>
    </marker>
    <marker id="bwd-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="380" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="380" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">O(1) Deletion Given Node Pointer — Pointer Rewiring</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">O(1) Deletion Given Node Pointer — Pointer Rewiring</text>
  <text x="200" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Before Deletion (delete node C)</text>
  <text x="200" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Before Deletion (delete node C)</text>
  <text x="600" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">After Deletion — B points to D</text>
  <text x="600" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">After Deletion — B points to D</text>
  <g transform="translate(30, 80)">
    <rect x="0" y="0" width="100" height="50" class="node-light"/>
    <rect x="0" y="0" width="100" height="50" class="node-dark" style="display:none;"/>
    <text x="50" y="30" text-anchor="middle" font-size="13" class="text-light">Node B</text>
    <text x="50" y="30" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">Node B</text>
    <path d="M 100 25 L 140 25" class="fwd-arrow-light"/>
    <path d="M 100 25 L 140 25" class="fwd-arrow-dark" style="display:none;"/>
    <rect x="150" y="0" width="100" height="50" class="del-light"/>
    <rect x="150" y="0" width="100" height="50" class="del-dark" style="display:none;"/>
    <text x="200" y="30" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Node C</text>
    <text x="200" y="30" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Node C</text>
    <path d="M 250 25 L 290 25" class="fwd-arrow-light"/>
    <path d="M 250 25 L 290 25" class="fwd-arrow-dark" style="display:none;"/>
    <rect x="300" y="0" width="100" height="50" class="node-light"/>
    <rect x="300" y="0" width="100" height="50" class="node-dark" style="display:none;"/>
    <text x="350" y="30" text-anchor="middle" font-size="13" class="text-light">Node D</text>
    <text x="350" y="30" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">Node D</text>
    <path d="M 300 35 L 250 35" class="bwd-arrow-light"/>
    <path d="M 300 35 L 250 35" class="bwd-arrow-dark" style="display:none;"/>
    <path d="M 150 35 L 100 35" class="bwd-arrow-light"/>
    <path d="M 150 35 L 100 35" class="bwd-arrow-dark" style="display:none;"/>
  </g>
  <text x="250" y="160" text-anchor="middle" font-size="11" class="subtext-light">B.next → C | C.prev → B | C.next → D | D.prev → C</text>
  <text x="250" y="160" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">B.next → C | C.prev → B | C.next → D | D.prev → C</text>
  <g transform="translate(430, 80)">
    <rect x="0" y="0" width="100" height="50" class="node-light"/>
    <rect x="0" y="0" width="100" height="50" class="node-dark" style="display:none;"/>
    <text x="50" y="30" text-anchor="middle" font-size="13" class="text-light">Node B</text>
    <text x="50" y="30" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">Node B</text>
    <path d="M 100 25 L 400 25" class="new-fwd-light"/>
    <path d="M 100 25 L 400 25" class="new-fwd-dark" style="display:none;"/>
    <rect x="150" y="0" width="100" height="50" class="del-light" stroke-dasharray="8,4"/>
    <rect x="150" y="0" width="100" height="50" class="del-dark" stroke-dasharray="8,4" style="display:none;"/>
    <text x="200" y="30" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Node C</text>
    <text x="200" y="30" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Node C</text>
    <text x="200" y="50" text-anchor="middle" font-size="10" font-weight="bold" class="subtext-light">FREED</text>
    <text x="200" y="50" text-anchor="middle" font-size="10" font-weight="bold" class="subtext-dark" style="display:none;">FREED</text>
    <rect x="400" y="0" width="100" height="50" class="node-light"/>
    <rect x="400" y="0" width="100" height="50" class="node-dark" style="display:none;"/>
    <text x="450" y="30" text-anchor="middle" font-size="13" class="text-light">Node D</text>
    <text x="450" y="30" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">Node D</text>
    <path d="M 400 35 L 100 35" class="new-bwd-light"/>
    <path d="M 400 35 L 100 35" class="new-bwd-dark" style="display:none;"/>
  </g>
  <text x="650" y="160" text-anchor="middle" font-size="11" class="subtext-light">B.next → D (was → C) | D.prev → B (was → C)</text>
  <text x="650" y="160" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">B.next → D (was → C) | D.prev → B (was → C)</text>
  <text x="400" y="210" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Two Pointer Assignments (O(1)):</text>
  <text x="400" y="210" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Two Pointer Assignments (O(1)):</text>
  <g transform="translate(150, 230)">
    <rect x="0" y="0" width="500" height="70" rx="6" class="node-light"/>
    <rect x="0" y="0" width="500" height="70" rx="6" class="node-dark" style="display:none;"/>
    <text x="250" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Step 1: node.prev.next = node.next</text>
    <text x="250" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Step 1: node.prev.next = node.next</text>
    <text x="250" y="48" text-anchor="middle" font-size="12" class="subtext-light">(B.next = D — bypass C in forward direction)</text>
    <text x="250" y="48" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">(B.next = D — bypass C in forward direction)</text>
  </g>
  <g transform="translate(150, 310)">
    <rect x="0" y="0" width="500" height="70" rx="6" class="node-light"/>
    <rect x="0" y="0" width="500" height="70" rx="6" class="node-dark" style="display:none;"/>
    <text x="250" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Step 2: node.next.prev = node.prev</text>
    <text x="250" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Step 2: node.next.prev = node.prev</text>
    <text x="250" y="48" text-anchor="middle" font-size="12" class="subtext-light">(D.prev = B — bypass C in backward direction)</text>
    <text x="250" y="48" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">(D.prev = B — bypass C in backward direction)</text>
  </g>
</svg>
`;

const circularDoublyLinkedListSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .sentinel-light { fill: #fef3c7; stroke: #d97706; stroke-width: 3; }
      .sentinel-dark { fill: #451a03; stroke: #fbbf24; stroke-width: 3; }
      .node-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .node-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .fwd-light { stroke: #16a34a; stroke-width: 2; fill: none; marker-end: url(#fwd-light); }
      .fwd-dark { stroke: #4ade80; stroke-width: 2; fill: none; marker-end: url(#fwd-dark); }
      .bwd-light { stroke: #d97706; stroke-width: 2; fill: none; marker-end: url(#bwd-light); }
      .bwd-dark { stroke: #fbbf24; stroke-width: 2; fill: none; marker-end: url(#bwd-dark); }
    </style>
    <marker id="fwd-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#16a34a"/>
    </marker>
    <marker id="fwd-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#4ade80"/>
    </marker>
    <marker id="bwd-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#d97706"/>
    </marker>
    <marker id="bwd-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="340" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="340" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Circular Doubly Linked List with Sentinel Node</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Circular Doubly Linked List with Sentinel Node</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Sentinel.next = first data node. Sentinel.prev = last data node. Empty list: sentinel points to itself. No NULL pointers.</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Sentinel.next = first data node. Sentinel.prev = last data node. Empty list: sentinel points to itself. No NULL pointers.</text>
  <g transform="translate(250, 80)">
    <ellipse cx="150" cy="120" rx="200" ry="100" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="6,4"/>
    <rect x="100" y="0" width="100" height="50" class="sentinel-light"/>
    <rect x="100" y="0" width="100" height="50" class="sentinel-dark" style="display:none;"/>
    <text x="150" y="30" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">SENTINEL</text>
    <text x="150" y="30" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">SENTINEL</text>
    <rect x="250" y="90" width="80" height="40" class="node-light"/>
    <rect x="250" y="90" width="80" height="40" class="node-dark" style="display:none;"/>
    <text x="290" y="115" text-anchor="middle" font-size="12" class="text-light">Node A</text>
    <text x="290" y="115" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">Node A</text>
    <rect x="200" y="170" width="80" height="40" class="node-light"/>
    <rect x="200" y="170" width="80" height="40" class="node-dark" style="display:none;"/>
    <text x="240" y="195" text-anchor="middle" font-size="12" class="text-light">Node B</text>
    <text x="240" y="195" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">Node B</text>
    <rect x="60" y="170" width="80" height="40" class="node-light"/>
    <rect x="60" y="170" width="80" height="40" class="node-dark" style="display:none;"/>
    <text x="100" y="195" text-anchor="middle" font-size="12" class="text-light">Node C</text>
    <text x="100" y="195" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">Node C</text>
    <path d="M 200 40 Q 260 60 270 90" class="fwd-light"/>
    <path d="M 200 40 Q 260 60 270 90" class="fwd-dark" style="display:none;"/>
    <path d="M 310 130 Q 270 150 250 170" class="fwd-light"/>
    <path d="M 310 130 Q 270 150 250 170" class="fwd-dark" style="display:none;"/>
    <path d="M 200 175 L 160 180 L 140 185" class="fwd-light"/>
    <path d="M 200 175 L 160 180 L 140 185" class="fwd-dark" style="display:none;"/>
    <path d="M 80 170 Q 50 100 120 50" class="fwd-light"/>
    <path d="M 80 170 Q 50 100 120 50" class="fwd-dark" style="display:none;"/>
    <path d="M 120 45 L 200 40" class="fwd-light"/>
    <path d="M 120 45 L 200 40" class="fwd-dark" style="display:none;"/>
  </g>
  <text x="400" y="310" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Key Advantages of Circular + Sentinel</text>
  <text x="400" y="310" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Key Advantages of Circular + Sentinel</text>
  <text x="400" y="330" text-anchor="middle" font-size="11" class="subtext-light">Empty list check: list.next == list (O(1)). Insertion at head/tail: O(1) without NULL checks. No special cases for first/last element.</text>
  <text x="400" y="330" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Empty list check: list.next == list (O(1)). Insertion at head/tail: O(1) without NULL checks. No special cases for first/last element.</text>
</svg>
`;

const lrucacheArchitectureSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .hash-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .hash-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .dll-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .dll-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
      .node-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .node-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .ptr-light { stroke: #475569; stroke-width: 2; fill: none; marker-end: url(#arrow-light); }
      .ptr-dark { stroke: #94a3b8; stroke-width: 2; fill: none; marker-end: url(#arrow-dark); }
      .map-light { stroke: #3b82f6; stroke-width: 2; stroke-dasharray: 6,4; fill: none; marker-end: url(#arrow-blue-light); }
      .map-dark { stroke: #60a5fa; stroke-width: 2; stroke-dasharray: 6,4; fill: none; marker-end: url(#arrow-blue-dark); }
    </style>
    <marker id="arrow-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#475569"/>
    </marker>
    <marker id="arrow-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
    </marker>
    <marker id="arrow-blue-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
    </marker>
    <marker id="arrow-blue-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="420" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="420" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">LRU Cache Architecture — Hash Map + Doubly Linked List</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">LRU Cache Architecture — Hash Map + Doubly Linked List</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Hash map provides O(1) lookup. Doubly linked list maintains LRU ordering. Get/put both O(1).</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Hash map provides O(1) lookup. Doubly linked list maintains LRU ordering. Get/put both O(1).</text>
  <g transform="translate(40, 70)">
    <text x="175" y="20" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Hash Map (key → Node pointer)</text>
    <text x="175" y="20" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Hash Map (key → Node pointer)</text>
    <rect x="0" y="30" width="80" height="40" class="hash-light"/>
    <rect x="0" y="30" width="80" height="40" class="hash-dark" style="display:none;"/>
    <text x="40" y="55" text-anchor="middle" font-size="12" class="text-light">key: "A"</text>
    <text x="40" y="55" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">key: "A"</text>
    <rect x="90" y="30" width="80" height="40" class="hash-light"/>
    <rect x="90" y="30" width="80" height="40" class="hash-dark" style="display:none;"/>
    <text x="130" y="55" text-anchor="middle" font-size="12" class="text-light">key: "B"</text>
    <text x="130" y="55" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">key: "B"</text>
    <rect x="180" y="30" width="80" height="40" class="hash-light"/>
    <rect x="180" y="30" width="80" height="40" class="hash-dark" style="display:none;"/>
    <text x="220" y="55" text-anchor="middle" font-size="12" class="text-light">key: "C"</text>
    <text x="220" y="55" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">key: "C"</text>
    <rect x="270" y="30" width="80" height="40" class="hash-light"/>
    <rect x="270" y="30" width="80" height="40" class="hash-dark" style="display:none;"/>
    <text x="310" y="55" text-anchor="middle" font-size="12" class="text-light">key: "D"</text>
    <text x="310" y="55" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">key: "D"</text>
    <rect x="0" y="80" width="80" height="30" class="hash-light"/>
    <rect x="0" y="80" width="80" height="30" class="hash-dark" style="display:none;"/>
    <text x="40" y="100" text-anchor="middle" font-size="11" class="text-light">ptr → 0xA100</text>
    <text x="40" y="100" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">ptr → 0xA100</text>
    <rect x="90" y="80" width="80" height="30" class="hash-light"/>
    <rect x="90" y="80" width="80" height="30" class="hash-dark" style="display:none;"/>
    <text x="130" y="100" text-anchor="middle" font-size="11" class="text-light">ptr → 0xB200</text>
    <text x="130" y="100" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">ptr → 0xB200</text>
    <rect x="180" y="80" width="80" height="30" class="hash-light"/>
    <rect x="180" y="80" width="80" height="30" class="hash-dark" style="display:none;"/>
    <text x="220" y="100" text-anchor="middle" font-size="11" class="text-light">ptr → 0xC300</text>
    <text x="220" y="100" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">ptr → 0xC300</text>
    <rect x="270" y="80" width="80" height="30" class="hash-light"/>
    <rect x="270" y="80" width="80" height="30" class="hash-dark" style="display:none;"/>
    <text x="310" y="100" text-anchor="middle" font-size="11" class="text-light">ptr → 0xD400</text>
    <text x="310" y="100" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">ptr → 0xD400</text>
  </g>
  <g transform="translate(30, 230)">
    <text x="350" y="20" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Doubly Linked List — LRU Order (MRU ← → LRU)</text>
    <text x="350" y="20" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Doubly Linked List — LRU Order (MRU ← → LRU)</text>
    <rect x="0" y="40" width="60" height="40" class="dll-light"/>
    <rect x="0" y="40" width="60" height="40" class="dll-dark" style="display:none;"/>
    <text x="30" y="65" text-anchor="middle" font-size="11" class="text-light">MRU</text>
    <text x="30" y="65" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">MRU</text>
    <rect x="70" y="40" width="70" height="40" class="node-light"/>
    <rect x="70" y="40" width="70" height="40" class="node-dark" style="display:none;"/>
    <text x="105" y="65" text-anchor="middle" font-size="12" class="text-light">A (3)</text>
    <text x="105" y="65" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A (3)</text>
    <rect x="160" y="40" width="70" height="40" class="node-light"/>
    <rect x="160" y="40" width="70" height="40" class="node-dark" style="display:none;"/>
    <text x="195" y="65" text-anchor="middle" font-size="12" class="text-light">D (1)</text>
    <text x="195" y="65" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">D (1)</text>
    <rect x="250" y="40" width="70" height="40" class="node-light"/>
    <rect x="250" y="40" width="70" height="40" class="node-dark" style="display:none;"/>
    <text x="285" y="65" text-anchor="middle" font-size="12" class="text-light">B (5)</text>
    <text x="285" y="65" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B (5)</text>
    <rect x="340" y="40" width="70" height="40" class="node-light"/>
    <rect x="340" y="40" width="70" height="40" class="node-dark" style="display:none;"/>
    <text x="375" y="65" text-anchor="middle" font-size="12" class="text-light">C (2)</text>
    <text x="375" y="65" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C (2)</text>
    <rect x="430" y="40" width="60" height="40" class="dll-light"/>
    <rect x="430" y="40" width="60" height="40" class="dll-dark" style="display:none;"/>
    <text x="460" y="65" text-anchor="middle" font-size="11" class="text-light">LRU</text>
    <text x="460" y="65" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">LRU</text>
    <path d="M 60 60 L 70 60" class="ptr-light"/>
    <path d="M 60 60 L 70 60" class="ptr-dark" style="display:none;"/>
    <path d="M 140 60 L 160 60" class="ptr-light"/>
    <path d="M 140 60 L 160 60" class="ptr-dark" style="display:none;"/>
    <path d="M 230 60 L 250 60" class="ptr-light"/>
    <path d="M 230 60 L 250 60" class="ptr-dark" style="display:none;"/>
    <path d="M 320 60 L 340 60" class="ptr-light"/>
    <path d="M 320 60 L 340 60" class="ptr-dark" style="display:none;"/>
    <path d="M 410 60 L 430 60" class="ptr-light"/>
    <path d="M 410 60 L 430 60" class="ptr-dark" style="display:none;"/>
  </g>
  <path d="M 80 170 Q 120 190 105 230" class="map-light"/>
  <path d="M 80 170 Q 120 190 105 230" class="map-dark" style="display:none;"/>
  <path d="M 170 170 Q 210 190 375 230" class="map-light"/>
  <path d="M 170 170 Q 210 190 375 230" class="map-dark" style="display:none;"/>
  <path d="M 260 170 Q 290 190 285 230" class="map-light"/>
  <path d="M 260 170 Q 290 190 285 230" class="map-dark" style="display:none;"/>
  <path d="M 350 170 Q 330 190 195 230" class="map-light"/>
  <path d="M 350 170 Q 330 190 195 230" class="map-dark" style="display:none;"/>
  <text x="400" y="340" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Operation Flow</text>
  <text x="400" y="340" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Operation Flow</text>
  <text x="400" y="360" text-anchor="middle" font-size="11" class="subtext-light">GET(key): 1. Lookup in hash map (O(1)). 2. Move node to MRU end of DLL (O(1) via pointer). 3. Return value.</text>
  <text x="400" y="360" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">GET(key): 1. Lookup in hash map (O(1)). 2. Move node to MRU end of DLL (O(1) via pointer). 3. Return value.</text>
  <text x="400" y="380" text-anchor="middle" font-size="11" class="subtext-light">PUT(key, value): 1. If key exists, update value and move to MRU. 2. If new key, create node, add to hash map and DLL head.</text>
  <text x="400" y="380" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">PUT(key, value): 1. If key exists, update value and move to MRU. 2. If new key, create node, add to hash map and DLL head.</text>
  <text x="400" y="400" text-anchor="middle" font-size="11" class="subtext-light">Eviction: When capacity exceeded, remove LRU node from DLL tail (O(1)) and delete from hash map (O(1)).</text>
  <text x="400" y="400" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Eviction: When capacity exceeded, remove LRU node from DLL tail (O(1)) and delete from hash map (O(1)).</text>
</svg>
`;

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>doubly linked list</strong> is a linear data structure composed of nodes, where each node contains three fields: a data element, a pointer to the next node in the sequence, and a pointer to the previous node. The list is typically accessed through a <code>head</code> pointer (referencing the first node) and optionally a <code>tail</code> pointer (referencing the last node). The head node&apos;s previous pointer is <code>NULL</code>, and the tail node&apos;s next pointer is <code>NULL</code>, marking the boundaries of the list.
        </p>
        <p>
          The doubly linked list extends the singly linked list by adding a backward pointer to each node. This seemingly small addition fundamentally changes the operational characteristics of the structure: deletion of a node becomes O(1) when given a pointer to the node itself (no predecessor search required), and backward traversal becomes possible. These capabilities make the doubly linked list the preferred choice for a wide range of production systems, including operating system kernel data structures, LRU caches, browser history implementations, and text editor undo/redo systems.
        </p>
        <p>
          The Linux kernel&apos;s <code>list_head</code> implementation is arguably the most famous production doubly linked list: it provides a circular, sentinel-based doubly linked list that can be embedded into any kernel structure, enabling a single structure to participate in multiple lists simultaneously. This design pattern — embedding list pointers into data structures rather than embedding data into list nodes — is a powerful architectural technique that senior engineers should understand deeply.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <h3>Node Structure and Bidirectional Pointers</h3>
        <p>
          Each node in a doubly linked list contains a data field, a <code>next</code> pointer, and a <code>prev</code> pointer. On a 64-bit system, the two pointers consume 16 bytes per node, doubling the pointer overhead compared to a singly linked list (8 bytes per node). For small data elements, this overhead is significant: a node storing a 4-byte integer consumes 24 bytes of pointer overhead for just 4 bytes of data — a 600% overhead ratio. For larger data elements, the overhead becomes proportionally smaller, but it remains a fixed per-element cost that arrays do not incur.
        </p>
        <p>
          The bidirectional pointer pair must be maintained consistently during every insertion and deletion operation. When inserting a new node between nodes A and B, four pointer assignments are required: the new node&apos;s <code>next</code> points to B, the new node&apos;s <code>prev</code> points to A, A&apos;s <code>next</code> points to the new node, and B&apos;s <code>prev</code> points to the new node. The order of these assignments matters: the new node&apos;s pointers must be set before modifying A&apos;s and B&apos;s pointers, to prevent the list from entering an inconsistent intermediate state (which would cause traversal failures in a concurrent context).
        </p>

        <h3>O(1) Deletion Given Node Pointer</h3>
        <p>
          The doubly linked list&apos;s signature advantage is O(1) deletion when given a pointer to the node being deleted. The procedure requires exactly two pointer assignments: set <code>node.prev.next = node.next</code> (bypassing the node in the forward direction) and set <code>node.next.prev = node.prev</code> (bypassing the node in the backward direction). Then free the node. No predecessor search is needed because the node&apos;s own <code>prev</code> pointer provides direct access to its predecessor.
        </p>
        <p>
          This capability is critical in many production scenarios. In an LRU cache, when a cached item is accessed (a cache hit), it must be moved to the most-recently-used position — which requires removing it from its current position in the list and reinserting it at the head. The doubly linked list enables this removal in O(1) because the cache item holds a pointer to its list node. In a memory allocator tracking allocated blocks, freeing a block requires removing it from the allocated list, and the block&apos;s metadata includes its list node pointer, enabling O(1) removal.
        </p>
        <p>
          Edge cases must be handled: if the node being deleted is the head, the head pointer must be updated to <code>node.next</code>; if it is the tail, the tail pointer must be updated to <code>node.prev</code>. These checks add conditional branching but do not affect the O(1) complexity. Using a sentinel node (see below) eliminates these edge cases entirely.
        </p>

        <h3>Backward Traversal</h3>
        <p>
          The <code>prev</code> pointer enables traversal from tail to head, a capability that singly linked lists lack. Backward traversal is essential for implementing reverse iterators (used in C++ <code>rbegin()</code>/<code>rend()</code>), for navigating browser history&apos;s &quot;back&quot; button, and for any algorithm that processes data in reverse order. The backward traversal loop mirrors the forward loop: initialize a cursor to tail, check for <code>NULL</code>, process the cursor&apos;s data, advance the cursor to cursor.prev.
        </p>
        <p>
          In production systems that process time-series data (e.g., event logs, audit trails), backward traversal enables &quot;most recent N events&quot; queries without scanning the entire list from the head. Starting at the tail and traversing backward N steps retrieves the most recent events directly. This pattern is used in monitoring systems, database transaction logs, and application performance management tools.
        </p>

        <h3>Sentinel Nodes and Circular Doubly Linked Lists</h3>
        <p>
          A sentinel (or dummy) node in a doubly linked list is a pre-allocated node that serves as a permanent anchor point. In a <strong>circular doubly linked list with sentinel</strong>, the sentinel node sits logically before the first data node and after the last data node. The sentinel&apos;s <code>next</code> points to the first data node (or to itself if the list is empty), and the sentinel&apos;s <code>prev</code> points to the last data node (or to itself if empty). This circular structure eliminates <code>NULL</code> pointers entirely: every pointer in the list references a valid node.
        </p>
        <p>
          The sentinel-based circular design simplifies every operation. Insertion at the head becomes: insert between sentinel and sentinel.next. Insertion at the tail becomes: insert between sentinel.prev and sentinel. Deletion of any node (including the first or last data node) uses the same two-assignment procedure without special-case checks for head or tail. Empty list detection becomes: <code>sentinel.next == sentinel</code>. The Linux kernel&apos;s <code>list_head</code> uses exactly this pattern, and its elegance is a key reason why it has remained unchanged in the kernel for over two decades.
        </p>

        <ArticleImage svgContent={doublyLinkedListStructureSVG} caption="Doubly linked list node structure showing prev, data, and next fields with bidirectional pointer chain" />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Deletion Flow — Two Pointer Assignments</h3>
        <p>
          The deletion procedure for a node N in a doubly linked list (assuming N is neither head nor tail, or that sentinel nodes handle edge cases) follows a deterministic two-step sequence. First, assign <code>N.prev.next = N.next</code>: this rewires N&apos;s predecessor to skip over N and point directly to N&apos;s successor. Second, assign <code>N.next.prev = N.prev</code>: this rewires N&apos;s successor to point backward to N&apos;s predecessor, completing the bypass. After these two assignments, N is logically removed from the list — no traversal can reach it from the head or tail. The node can then be safely freed (returned to the allocator, placed in a pool, or marked for deferred reclamation in a concurrent context).
        </p>
        <p>
          In a concurrent context, these two assignments must be performed atomically or under a lock to prevent a concurrent traversal from observing an inconsistent state where one pointer has been updated but the other has not. In the Linux kernel, this is handled by <code>list_del()</code> which uses poison values (setting the freed node&apos;s pointers to <code>LIST_POISON1</code> and <code>LIST_POISON2</code>) to catch use-after-free bugs during development.
        </p>

        <h3>Insertion Flow — Four Pointer Assignments</h3>
        <p>
          Inserting a new node N between existing nodes A and B requires four pointer assignments: <code>N.next = B</code>, <code>N.prev = A</code>, <code>A.next = N</code>, <code>B.prev = N</code>. The first two assignments (setting N&apos;s own pointers) must complete before the last two (rewiring A and B), to ensure that a concurrent traversal starting from A or B never encounters N with incomplete pointers. In a sentinel-based list, inserting at the head means inserting between the sentinel and <code>sentinel.next</code>, and inserting at the tail means inserting between <code>sentinel.prev</code> and the sentinel.
        </p>

        <ArticleImage svgContent={deletionOperationSVG} caption="O(1) deletion of a node given its pointer, showing pointer rewiring in forward and backward directions" />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <h3>Doubly Linked List versus Singly Linked List</h3>
        <p>
          The doubly linked list adds 8 bytes of pointer overhead per node (the <code>prev</code> pointer) compared to the singly linked list, and doubles the number of pointer assignments required for insertion (four instead of two) and deletion (two instead of one, but the singly linked list requires an O(n) predecessor search first). The trade-off is clear: if deletion by node reference or backward traversal is needed, the doubly linked list is strictly superior despite the overhead. If neither capability is needed, the singly linked list saves memory and reduces pointer-maintenance complexity.
        </p>
        <p>
          In practice, the doubly linked list is more commonly used in production systems because its O(1) deletion capability is frequently valuable. The Linux kernel uses doubly linked lists almost exclusively for its internal list management, and the C++ Standard Library&apos;s <code>std::list</code> is a doubly linked list. The additional 8 bytes per node is a worthwhile investment for the operational flexibility it provides.
        </p>

        <h3>Doubly Linked List versus Array</h3>
        <p>
          The comparison mirrors the singly linked list versus array trade-off, with the doubly linked list paying even higher memory overhead (16 bytes per node versus 8 for singly linked). Arrays remain superior for read-heavy, index-accessed, or sequentially processed workloads due to cache-line utilization. Doubly linked lists are superior when frequent insertion and deletion at arbitrary positions (given node references) is the dominant access pattern, and when backward traversal is required.
        </p>
        <p>
          An important nuance: when the use case requires maintaining a sorted collection with frequent insertions and deletions, neither arrays nor linked lists are the optimal choice — balanced binary search trees (AVL, Red-Black, B-trees) or skip lists provide O(log n) search with O(log n) insertion and deletion, dominating both O(n) linked list search and O(n) array insertion.
        </p>

        <h3>Doubly Linked List versus Hash Table</h3>
        <p>
          When the primary operation is key-based lookup, hash tables provide O(1) average-time access while doubly linked lists require O(n) traversal. However, hash tables do not maintain insertion order (in their basic form), and they cannot efficiently support ordered iteration or &quot;most recent N&quot; queries. The combination of a hash table and a doubly linked list (as in an LRU cache) provides O(1) key-based lookup <em>and</em> O(1) maintenance of access-order metadata — a pattern that is foundational in caching systems.
        </p>

        <ArticleImage svgContent={circularDoublyLinkedListSVG} caption="Circular doubly linked list with sentinel node showing bidirectional traversal and self-referencing empty list" />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Always use a sentinel-based circular doubly linked list in production code unless memory constraints are extreme. The sentinel eliminates all edge-case branching for empty lists, head operations, and tail operations, reducing code complexity and bug probability. The Linux kernel&apos;s <code>list_head</code> API is a model: <code>LIST_HEAD()</code> initializes a sentinel, <code>list_add()</code> inserts after the sentinel, <code>list_del()</code> removes and poisons pointers, and <code>list_empty()</code> checks <code>head.next == head</code>.
        </p>
        <p>
          When embedding doubly linked list pointers into application structures (rather than wrapping data in list nodes), use the &quot;intrusive list&quot; pattern: the data structure contains <code>next</code> and <code>prev</code> pointer fields directly, and the list operations manipulate these fields. This avoids the indirection of wrapping data in list node objects and enables a single data structure to participate in multiple lists simultaneously (each with its own pair of pointers). The Linux kernel uses this pattern extensively: a <code>task_struct</code> (process descriptor) can be on the run queue list, the cgroup list, and the wait queue list simultaneously, each through a different embedded <code>list_head</code>.
        </p>
        <p>
          For LRU cache implementations, combine a hash map (key → list node pointer) with a doubly linked list ordered by recency of access. On cache hit, move the accessed node to the MRU (most recently used) end in O(1) using the node&apos;s existing pointers. On cache miss with capacity exceeded, evict the LRU node from the tail in O(1) and remove it from the hash map. This pattern is used in Memcached, Redis (for certain data structures), and HTTP reverse proxy caches.
        </p>
        <p>
          In garbage-collected languages, be aware that doubly linked lists create bidirectional reference cycles between nodes. While modern garbage collectors (generational, tracing) handle cycles correctly, the bidirectional references can delay collection if the GC uses reference counting as a first-pass optimization. In languages with manual memory management, ensure that both <code>next</code> and <code>prev</code> are set to <code>NULL</code> (or poison values) after deletion to prevent dangling pointer dereferences.
        </p>

        <ArticleImage svgContent={lrucacheArchitectureSVG} caption="LRU Cache architecture combining hash map for O(1) lookup with doubly linked list for O(1) LRU ordering maintenance" />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is <strong>inconsistent pointer maintenance during insertion</strong>. Setting only two of the four required pointers during insertion creates a list where forward traversal works but backward traversal fails (or vice versa). This bug is particularly insidious because it may not manifest immediately — forward-only tests pass, and backward traversal failures appear only when the feature is exercised in production. Always set all four pointers during insertion, and consider writing a <code>list_verify()</code> function that traverses both forward and backward, checking that each node&apos;s <code>next.prev</code> equals the node itself and each node&apos;s <code>prev.next</code> equals the node itself.
        </p>
        <p>
          <strong>Forgetting to update the tail pointer</strong> when the tail node is deleted is a frequent bug in non-sentinel implementations. When the tail is deleted, the list&apos;s tail pointer must be updated to the deleted node&apos;s predecessor. Failure to do so leaves the tail pointer referencing a freed node, causing subsequent tail insertions to write to freed memory. Using a sentinel-based circular list eliminates this pitfall entirely because the sentinel&apos;s <code>prev</code> is always the tail.
        </p>
        <p>
          <strong>Use-after-free via stale pointers</strong> is a critical safety issue. After a node is deleted and freed, any other code holding a pointer to that node will dereference freed memory. In C/C++, this causes undefined behavior. The Linux kernel mitigates this by setting deleted nodes&apos; pointers to <code>LIST_POISON1</code> and <code>LIST_POISON2</code> — kernel-space addresses that trigger an immediate page fault (oops) on dereference, making the bug obvious and debuggable. In production systems without kernel-level poison addresses, setting deleted pointers to <code>NULL</code> and using assertion checks before dereferencing is a defensive strategy.
        </p>
        <p>
          <strong>Memory overhead underestimation</strong> leads to systems that consume far more memory than anticipated. A doubly linked list of one million 4-byte integers consumes approximately 20 MB: 4 MB for the data, 16 MB for the two pointers per node, plus allocator overhead (typically 8-16 bytes per allocation for metadata). An equivalent array consumes 4 MB total — 5× less. When memory budgets are tight, consider array-based alternatives, unrolled linked lists (storing multiple elements per node), or the intrusive list pattern (embedding pointers in existing structures rather than allocating separate node objects).
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>LRU caches</strong> are the canonical use case for the hash map plus doubly linked list combination. Every major caching system — Memcached, Varnish, CDN edge caches, database buffer pools — uses this architecture to maintain recency-of-access ordering with O(1) get and put operations. The hash map provides O(1) key lookup, and the doubly linked list provides O(1) movement of accessed nodes to the MRU end and O(1) eviction of the LRU node from the tail. The doubly linked list is essential here: a singly linked list would require O(n) predecessor search to remove a node from an arbitrary position, destroying the O(1) guarantee.
        </p>
        <p>
          <strong>Linux kernel list_head</strong> is the most widely deployed doubly linked list implementation. Every kernel subsystem uses it: process scheduling (run queue), virtual memory (VMA lists), file systems (dentry cache, inode lists), networking (socket lists), and device drivers. The intrusive list pattern (embedding <code>struct list_head</code> fields in kernel structures) enables a single structure to participate in multiple lists, and the <code>container_of()</code> macro recovers the parent structure from the list pointer. This design has been in production in every Linux kernel since version 2.1 (1996).
        </p>
        <p>
          <strong>Browser history and text editor undo/redo</strong> use doubly linked lists to support forward and backward navigation. Each history entry or undo operation is a node in the list. The &quot;back&quot; button follows <code>prev</code> pointers; the &quot;forward&quot; button follows <code>next</code> pointers. When the user navigates to a new page while history exists in the forward direction, all forward nodes are discarded (the list is truncated at the current node) and a new node is appended — an O(1) operation using the current node&apos;s pointer.
        </p>
        <p>
          <strong>Music player playlists and image viewers</strong> use doubly linked lists for &quot;previous&quot; and &quot;next&quot; navigation. Each song or image is a node, and the player maintains a cursor to the currently playing/viewing node. Previous and next operations are O(1) pointer traversals. Insertion of new items into the playlist at arbitrary positions is also O(1) given the insertion point.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <h3>1. How would you implement an LRU cache? Explain the data structures and the O(1) get/put operations.</h3>
        <p>
          An LRU (Least Recently Used) cache supports two operations in O(1) time: <code>get(key)</code> returns the value for the key (or -1 if not present) and moves the key to the most-recently-used position, and <code>put(key, value)</code> inserts or updates the key-value pair, evicting the least recently used item if the cache is at capacity.
        </p>
        <p>
          The architecture combines two data structures: a hash map from keys to node pointers, and a doubly linked list ordered by recency of access (most recently used at the head, least recently used at the tail). The hash map provides O(1) key lookup, returning a pointer to the corresponding node in the doubly linked list. The doubly linked list provides O(1) node removal (given the node pointer) and O(1) insertion at the head.
        </p>
        <p>
          For <code>get(key)</code>: look up the key in the hash map. If absent, return -1. If present, the hash map returns a pointer to the list node. Remove this node from its current position in the doubly linked list (O(1) via the node&apos;s prev and next pointers), and reinsert it at the head of the list (O(1)). Return the node&apos;s value. This moves the accessed key to the MRU position, ensuring it will not be the next eviction candidate.
        </p>
        <p>
          For <code>put(key, value)</code>: first check if the key exists in the hash map. If it does, update the node&apos;s value and move it to the head (same as get). If it does not, create a new node with the key and value, insert it at the head of the doubly linked list, and add the key-to-node mapping to the hash map. Then check if the cache size exceeds capacity: if it does, remove the tail node from the doubly linked list (O(1)), delete its key from the hash map (O(1)), and free the node.
        </p>
        <p>
          Both operations are O(1) because every sub-operation (hash map lookup, list node removal, list head insertion, hash map insertion, list tail removal) is O(1). The doubly linked list is essential: a singly linked list could not remove an arbitrary node in O(1) without a predecessor search.
        </p>

        <h3>2. How does the Linux kernel&apos;s list_head differ from a traditional doubly linked list? What is the intrusive list pattern?</h3>
        <p>
          The Linux kernel&apos;s <code>list_head</code> is an <strong>intrusive</strong> doubly linked list. Instead of the list node containing the data (the traditional approach: list node → data), the data structure contains the list node&apos;s <code>next</code> and <code>prev</code> pointers directly (the intrusive approach: data → list_head → list_head). The <code>list_head</code> struct is simply two pointers (<code>next</code> and <code>prev</code>), and any kernel structure that needs to be on a list embeds a <code>struct list_head</code> field.
        </p>
        <p>
          The key advantage is that a single data structure can participate in multiple lists simultaneously by embedding multiple <code>list_head</code> fields. A <code>task_struct</code> (process descriptor) embeds one <code>list_head</code> for the run queue, another for the cgroup membership list, another for the ptrace list, and so on. Each list manages a different aspect of the process without requiring separate node allocations or copying.
        </p>
        <p>
          The <code>container_of()</code> macro enables recovering the parent structure from a <code>list_head</code> pointer: given a pointer to a <code>list_head</code> field within a structure, <code>container_of()</code> computes the address of the parent structure by subtracting the field&apos;s offset from the field&apos;s address. This is a compile-time computed offset using <code>offsetof()</code>, making it zero-cost at runtime.
        </p>
        <p>
          The <code>list_head</code> is always circular with an implicit sentinel: an initialized <code>list_head</code> has both <code>next</code> and <code>prev</code> pointing to itself. <code>list_empty(head)</code> checks <code>head->next == head</code>. <code>list_add(new, head)</code> inserts <code>new</code> immediately after <code>head</code> (effectively at the logical front of the list). <code>list_del(entry)</code> removes <code>entry</code> by rewiring its neighbors and then sets <code>entry->next</code> and <code>entry->prev</code> to poison values.
        </p>

        <h3>3. How would you reverse a doubly linked list? Compare iterative and in-place approaches.</h3>
        <p>
          The iterative in-place reversal of a doubly linked list is straightforward: traverse the list from head to tail, and at each node, swap its <code>next</code> and <code>prev</code> pointers. After processing all nodes, swap the head and tail pointers. The algorithm runs in O(n) time with O(1) extra space — truly in-place.
        </p>
        <p>
          The procedure: initialize a cursor to head. While cursor is not <code>NULL</code>: save cursor.next in a temporary variable, set cursor.next = cursor.prev, set cursor.prev = the saved temporary variable, advance cursor to cursor.prev (which was the original next). After the loop, swap the list&apos;s head and tail pointers. The swap at each node effectively reverses both the forward and backward chains simultaneously because the <code>prev</code> pointer of each node becomes its new <code>next</code> and vice versa.
        </p>
        <p>
          For a circular doubly linked list with sentinel, the algorithm is the same but operates on all data nodes (skipping the sentinel), and the sentinel&apos;s <code>next</code> and <code>prev</code> are automatically correct after the reversal because the circular invariant is preserved — the former tail (now head) becomes the sentinel&apos;s <code>next</code>, and the former head (now tail) becomes the sentinel&apos;s <code>prev</code>.
        </p>

        <h3>4. What is the memory overhead of a doubly linked list compared to other data structures? When does it become prohibitive?</h3>
        <p>
          A doubly linked list node in a 64-bit system consumes: 8 bytes for the <code>next</code> pointer, 8 bytes for the <code>prev</code> pointer, the size of the data field, and allocator overhead (typically 8-16 bytes for malloc metadata). For a node storing an 8-byte integer, the total is approximately 32-40 bytes per element — 4-5× the data size. For a node storing a 64-byte structure, the total is approximately 88-96 bytes — 1.4-1.5× the data size. The pointer overhead becomes proportionally smaller as the data size increases.
        </p>
        <p>
          Compare this to an array: an array of 8-byte integers consumes exactly 8 bytes per element (no per-element overhead, only the total allocation&apos;s allocator metadata). An array of 64-byte structures consumes 64 bytes per element. The array is always more memory-efficient per element.
        </p>
        <p>
          The overhead becomes prohibitive when: (a) the dataset is large (billions of elements) and memory is constrained — a billion-node doubly linked list of small elements consumes 32-40 GB versus 8 GB for an equivalent array; (b) elements are frequently traversed and cache performance matters — the scattered allocation pattern of linked lists causes cache misses that arrays avoid; (c) the system is memory-bandwidth bound — the additional pointer data that must be loaded into cache for each element traversal consumes bandwidth that could be used for data.
        </p>
        <p>
          Mitigation strategies include: using unrolled linked lists (storing an array of elements in each node, reducing the per-element pointer overhead), using the intrusive list pattern (embedding list pointers in existing structures rather than allocating separate node objects, saving the node allocation overhead), or switching to array-based structures when the operational semantics allow it.
        </p>

        <h3>5. How would you detect and debug a corrupted doubly linked list in a production system?</h3>
        <p>
          A corrupted doubly linked list manifests as crashes (null pointer dereference, segmentation fault, access violation) or infinite loops (cycle detection failure) during traversal. Debugging requires a multi-step approach.
        </p>
        <p>
          First, implement a <strong>list verification function</strong> that runs in debug builds and testing: traverse the list forward from head to tail, verifying at each node that <code>node.next.prev == node</code>. Traverse backward from tail to head, verifying that <code>node.prev.next == node</code>. If either invariant fails, the list is corrupted. Print the addresses of the corrupt node and its neighbors to aid debugging.
        </p>
        <p>
          Second, use <strong>poison values</strong> for freed nodes: after deleting a node, set its <code>next</code> and <code>prev</code> to known poison addresses (e.g., <code>0xDEADBEEFDEADBEEF</code> on 64-bit systems). If any code subsequently dereferences a freed node&apos;s pointer, it will crash immediately on the poison value rather than silently corrupting unrelated memory. The Linux kernel uses this technique with <code>LIST_POISON1</code> and <code>LIST_POISON2</code>.
        </p>
        <p>
          Third, in production, add <strong>periodic integrity checks</strong> that run during idle periods or at operation boundaries. For critical lists (e.g., kernel run queue, database buffer pool), a corrupted list is a catastrophic failure that requires immediate system recovery. Check the list length against an expected counter, verify the sentinel&apos;s invariants (in a circular list), and validate that no node appears twice in a single traversal (cycle detection via visited-set or Floyd&apos;s algorithm).
        </p>
        <p>
          Common root causes of corruption include: use-after-free (code holding a stale pointer to a freed node writes to it, corrupting the list), race conditions (concurrent modification without proper synchronization causes torn writes where one pointer is updated but its counterpart is not), and buffer overflow in adjacent memory (an overflow into the node&apos;s memory corrupts the pointer fields). AddressSanitizer, Valgrind, and kernel KASAN are essential tools for identifying the root cause.
        </p>

        <h3>6. Design a concurrent doubly linked list. What are the synchronization challenges?</h3>
        <p>
          A concurrent doubly linked list is significantly more challenging to implement than a concurrent singly linked list because each insertion or deletion requires updating four pointers atomically (or at least consistently from the perspective of concurrent traversals). A traversal that observes a partially-updated node (where the forward chain has been updated but the backward chain has not) will see an inconsistent list.
        </p>
        <p>
          The simplest approach is <strong>fine-grained locking</strong>: each node has its own mutex, and operations lock the nodes they are modifying. For insertion between A and B: lock A, lock B, perform the four pointer assignments, unlock B, unlock A. For deletion of N: lock N.prev, lock N, lock N.next, perform the two bypass assignments, unlock in reverse order. This approach is correct but suffers from lock-ordering complexity (to prevent deadlocks) and high contention for hot spots in the list.
        </p>
        <p>
          A <strong>lock-free approach</strong> using CAS (compare-and-swap) is theoretically possible but practically very complex. Harris&apos;s non-blocking linked list algorithm (2001) uses a mark bit in the next pointer to logically delete a node before physically removing it, enabling safe concurrent deletion. However, extending this to a doubly linked list requires maintaining both forward and backward invariants atomically, which typically requires double-width CAS (128-bit) or transactional memory (Intel TSX). In practice, concurrent doubly linked lists in production systems (e.g., Java&apos;s <code>ConcurrentLinkedDeque</code>) use a combination of CAS on individual pointers and retry loops, accepting that concurrent traversals may see transiently inconsistent states.
        </p>
        <p>
          For most production systems, the recommended approach is: if concurrent access to a doubly linked list is needed, use a concurrent hash table for key-based access and a separate concurrent singly linked list (using Treiber&apos;s algorithm or Michael-Scott queue) for ordered access, rather than attempting a concurrent doubly linked list. If a doubly linked list is absolutely necessary, use reader-writer locks with preference for readers (since traversals are reads and are far more frequent than insertions/deletions), or use software transactional memory if the language runtime supports it (e.g., Clojure&apos;s STM, Haskell&apos;s STM).
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li>Knuth, D.E. — &quot;The Art of Computer Programming, Volume 1: Fundamental Algorithms&quot; — Addison-Wesley, 3rd Edition, Section 2.2.5</li>
          <li>Cormen, T.H., Leiserson, C.E., Rivest, R.L., Stein, C. — &quot;Introduction to Algorithms&quot; — MIT Press, 4th Edition, Chapter 10</li>
          <li>Bovet, D.P., Cesati, M. — &quot;Understanding the Linux Kernel&quot; — O&apos;Reilly, 3rd Edition, Chapter 7 (List Structures)</li>
          <li>Mozilla Developer Network — &quot;Linux Kernel Linked List Explained&quot; — Comprehensive analysis of list_head implementation patterns</li>
          <li>Harris, T.L. — &quot;A Pragmatic Implementation of Non-Blocking Linked Lists&quot; — DISC 2001 (Lock-Free Linked List Algorithms)</li>
          <li>Jacobson, D. — &quot;LRU Cache Implementation Using Hash Map and Doubly Linked List&quot; — System Design Interview patterns</li>
          <li>Love, R. — &quot;Linux System Programming&quot; — O&apos;Reilly, 2nd Edition, Chapter 6 (Data Structure Integration)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

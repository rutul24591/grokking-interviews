"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-data-structures-singly-linked-lists",
  title: "Singly Linked Lists",
  description:
    "Comprehensive guide to singly linked lists: node structure, pointer semantics, memory allocation patterns, cache performance, lock-free concurrency, and production-scale trade-offs for staff and principal engineer interviews.",
  category: "other",
  subcategory: "data-structures-algorithms/data-structures",
  slug: "singly-linked-lists",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-14",
  tags: ["data-structures", "linked-lists", "pointer-chasing", "memory-allocation"],
  relatedTopics: ["doubly-linked-lists", "arrays", "queues"],
};

const linkedListStructureSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 280" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .node-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .node-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .data-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .data-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .ptr-light { fill: #fef3c7; stroke: #d97706; stroke-width: 2; }
      .ptr-dark { fill: #451a03; stroke: #fbbf24; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .arrow-light { stroke: #475569; stroke-width: 2; fill: none; marker-end: url(#arrow-light); }
      .arrow-dark { stroke: #94a3b8; stroke-width: 2; fill: none; marker-end: url(#arrow-dark); }
      .null-light { stroke: #dc2626; stroke-width: 2; stroke-dasharray: 6,4; fill: none; marker-end: url(#arrow-null-light); }
      .null-dark { stroke: #f87171; stroke-width: 2; stroke-dasharray: 6,4; fill: none; marker-end: url(#arrow-null-dark); }
    </style>
    <marker id="arrow-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#475569"/>
    </marker>
    <marker id="arrow-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
    </marker>
    <marker id="arrow-null-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626"/>
    </marker>
    <marker id="arrow-null-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#f87171"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="280" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="280" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Singly Linked List — Node Structure and Pointer Chain</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Singly Linked List — Node Structure and Pointer Chain</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Each node: [Data | Next Pointer]. Traversal is unidirectional: head to tail.</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Each node: [Data | Next Pointer]. Traversal is unidirectional: head to tail.</text>
  <text x="80" y="100" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">head</text>
  <text x="80" y="100" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">head</text>
  <path d="M 80 108 L 80 130" class="arrow-light"/>
  <path d="M 80 108 L 80 130" class="arrow-dark" style="display:none;"/>
  <g transform="translate(40, 130)">
    <rect x="0" y="0" width="80" height="50" class="data-light"/>
    <rect x="0" y="0" width="80" height="50" class="data-dark" style="display:none;"/>
    <text x="40" y="30" text-anchor="middle" font-size="14" class="text-light">42</text>
    <text x="40" y="30" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">42</text>
    <rect x="80" y="0" width="60" height="50" class="ptr-light"/>
    <rect x="80" y="0" width="60" height="50" class="ptr-dark" style="display:none;"/>
    <text x="110" y="30" text-anchor="middle" font-size="11" class="text-light">0x3A00</text>
    <text x="110" y="30" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0x3A00</text>
    <text x="40" y="-8" text-anchor="middle" font-size="10" class="subtext-light">Node 1</text>
    <text x="40" y="-8" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Node 1</text>
  </g>
  <path d="M 180 155 L 220 155" class="arrow-light"/>
  <path d="M 180 155 L 220 155" class="arrow-dark" style="display:none;"/>
  <g transform="translate(220, 130)">
    <rect x="0" y="0" width="80" height="50" class="data-light"/>
    <rect x="0" y="0" width="80" height="50" class="data-dark" style="display:none;"/>
    <text x="40" y="30" text-anchor="middle" font-size="14" class="text-light">17</text>
    <text x="40" y="30" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">17</text>
    <rect x="80" y="0" width="60" height="50" class="ptr-light"/>
    <rect x="80" y="0" width="60" height="50" class="ptr-dark" style="display:none;"/>
    <text x="110" y="30" text-anchor="middle" font-size="11" class="text-light">0x5B20</text>
    <text x="110" y="30" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0x5B20</text>
    <text x="40" y="-8" text-anchor="middle" font-size="10" class="subtext-light">Node 2</text>
    <text x="40" y="-8" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Node 2</text>
  </g>
  <path d="M 360 155 L 400 155" class="arrow-light"/>
  <path d="M 360 155 L 400 155" class="arrow-dark" style="display:none;"/>
  <g transform="translate(400, 130)">
    <rect x="0" y="0" width="80" height="50" class="data-light"/>
    <rect x="0" y="0" width="80" height="50" class="data-dark" style="display:none;"/>
    <text x="40" y="30" text-anchor="middle" font-size="14" class="text-light">93</text>
    <text x="40" y="30" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">93</text>
    <rect x="80" y="0" width="60" height="50" class="ptr-light"/>
    <rect x="80" y="0" width="60" height="50" class="ptr-dark" style="display:none;"/>
    <text x="110" y="30" text-anchor="middle" font-size="11" class="text-light">0x7C40</text>
    <text x="110" y="30" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0x7C40</text>
    <text x="40" y="-8" text-anchor="middle" font-size="10" class="subtext-light">Node 3</text>
    <text x="40" y="-8" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Node 3</text>
  </g>
  <path d="M 540 155 L 580 155" class="arrow-light"/>
  <path d="M 540 155 L 580 155" class="arrow-dark" style="display:none;"/>
  <g transform="translate(580, 130)">
    <rect x="0" y="0" width="80" height="50" class="data-light"/>
    <rect x="0" y="0" width="80" height="50" class="data-dark" style="display:none;"/>
    <text x="40" y="30" text-anchor="middle" font-size="14" class="text-light">56</text>
    <text x="40" y="30" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">56</text>
    <rect x="80" y="0" width="60" height="50" class="ptr-light"/>
    <rect x="80" y="0" width="60" height="50" class="ptr-dark" style="display:none;"/>
    <text x="110" y="30" text-anchor="middle" font-size="11" class="text-light">NULL</text>
    <text x="110" y="30" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">NULL</text>
    <text x="40" y="-8" text-anchor="middle" font-size="10" class="subtext-light">Node 4 (tail)</text>
    <text x="40" y="-8" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Node 4 (tail)</text>
  </g>
  <path d="M 660 155 L 700 155" class="null-light"/>
  <path d="M 660 155 L 700 155" class="null-dark" style="display:none;"/>
  <text x="720" y="160" text-anchor="middle" font-size="12" font-weight="bold" class="subtext-light">NULL</text>
  <text x="720" y="160" text-anchor="middle" font-size="12" font-weight="bold" class="subtext-dark" style="display:none;">NULL</text>
  <text x="400" y="230" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Key Properties</text>
  <text x="400" y="230" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Key Properties</text>
  <text x="400" y="250" text-anchor="middle" font-size="11" class="subtext-light">Search: O(n) | Insert at Head: O(1) | Delete at Head: O(1) | Delete by Value: O(n) | Space: O(n) + n pointers</text>
  <text x="400" y="250" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Search: O(n) | Insert at Head: O(1) | Delete at Head: O(1) | Delete by Value: O(n) | Space: O(n) + n pointers</text>
  <text x="400" y="270" text-anchor="middle" font-size="11" class="subtext-light">No backward traversal. Each node knows only about its successor. Memory scattered across heap.</text>
  <text x="400" y="270" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">No backward traversal. Each node knows only about its successor. Memory scattered across heap.</text>
</svg>
`;

const insertionOperationSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .node-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .node-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .new-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .new-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .arrow-light { stroke: #475569; stroke-width: 2; fill: none; marker-end: url(#arrow-light); }
      .arrow-dark { stroke: #94a3b8; stroke-width: 2; fill: none; marker-end: url(#arrow-dark); }
      .new-arrow-light { stroke: #16a34a; stroke-width: 3; fill: none; marker-end: url(#arrow-green-light); }
      .new-arrow-dark { stroke: #4ade80; stroke-width: 3; fill: none; marker-end: url(#arrow-green-dark); }
      .old-arrow-light { stroke: #94a3b8; stroke-width: 2; stroke-dasharray: 6,4; fill: none; }
      .old-arrow-dark { stroke: #64748b; stroke-width: 2; stroke-dasharray: 6,4; fill: none; }
    </style>
    <marker id="arrow-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#475569"/>
    </marker>
    <marker id="arrow-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
    </marker>
    <marker id="arrow-green-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#16a34a"/>
    </marker>
    <marker id="arrow-green-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#4ade80"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="400" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="400" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Insertion Operations — Pointer Rewiring</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Insertion Operations — Pointer Rewiring</text>
  <text x="200" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Insert at Head (O(1))</text>
  <text x="200" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Insert at Head (O(1))</text>
  <text x="600" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Insert After Given Node (O(1) if node known)</text>
  <text x="600" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Insert After Given Node (O(1) if node known)</text>
  <g transform="translate(40, 80)">
    <rect x="0" y="0" width="60" height="40" class="new-light"/>
    <rect x="0" y="0" width="60" height="40" class="new-dark" style="display:none;"/>
    <text x="30" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">NEW</text>
    <text x="30" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">NEW</text>
    <path d="M 30 40 Q 30 55 50 55 L 70 55" class="new-arrow-light"/>
    <path d="M 30 40 Q 30 55 50 55 L 70 55" class="new-arrow-dark" style="display:none;"/>
    <rect x="80" y="40" width="60" height="40" class="node-light"/>
    <rect x="80" y="40" width="60" height="40" class="node-dark" style="display:none;"/>
    <text x="110" y="65" text-anchor="middle" font-size="12" class="text-light">A</text>
    <text x="110" y="65" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A</text>
    <path d="M 140 60 L 180 60" class="arrow-light"/>
    <path d="M 140 60 L 180 60" class="arrow-dark" style="display:none;"/>
    <rect x="190" y="40" width="60" height="40" class="node-light"/>
    <rect x="190" y="40" width="60" height="40" class="node-dark" style="display:none;"/>
    <text x="220" y="65" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="220" y="65" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <path d="M 250 60 L 290 60" class="arrow-light"/>
    <path d="M 250 60 L 290 60" class="arrow-dark" style="display:none;"/>
    <rect x="300" y="40" width="60" height="40" class="node-light"/>
    <rect x="300" y="40" width="60" height="40" class="node-dark" style="display:none;"/>
    <text x="330" y="65" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="330" y="65" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <text x="160" y="110" text-anchor="middle" font-size="10" class="subtext-light">1. new.next = head</text>
    <text x="160" y="110" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">1. new.next = head</text>
    <text x="160" y="125" text-anchor="middle" font-size="10" class="subtext-light">2. head = new</text>
    <text x="160" y="125" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">2. head = new</text>
  </g>
  <g transform="translate(440, 80)">
    <rect x="0" y="0" width="60" height="40" class="node-light"/>
    <rect x="0" y="0" width="60" height="40" class="node-dark" style="display:none;"/>
    <text x="30" y="25" text-anchor="middle" font-size="12" class="text-light">A</text>
    <text x="30" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A</text>
    <path d="M 60 20 L 100 20" class="old-arrow-light"/>
    <path d="M 60 20 L 100 20" class="old-arrow-dark" style="display:none;"/>
    <rect x="110" y="0" width="60" height="40" class="node-light"/>
    <rect x="110" y="0" width="60" height="40" class="node-dark" style="display:none;"/>
    <text x="140" y="25" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="140" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <path d="M 170 20 L 210 20" class="arrow-light"/>
    <path d="M 170 20 L 210 20" class="arrow-dark" style="display:none;"/>
    <rect x="220" y="0" width="60" height="40" class="node-light"/>
    <rect x="220" y="0" width="60" height="40" class="node-dark" style="display:none;"/>
    <text x="250" y="25" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="250" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <rect x="60" y="70" width="60" height="40" class="new-light"/>
    <rect x="60" y="70" width="60" height="40" class="new-dark" style="display:none;"/>
    <text x="90" y="95" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">X</text>
    <text x="90" y="95" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">X</text>
    <path d="M 90 70 Q 90 55 110 45" class="new-arrow-light"/>
    <path d="M 90 70 Q 90 55 110 45" class="new-arrow-dark" style="display:none;"/>
    <path d="M 120 70 Q 150 55 170 40" class="new-arrow-light"/>
    <path d="M 120 70 Q 150 55 170 40" class="new-arrow-dark" style="display:none;"/>
    <text x="160" y="140" text-anchor="middle" font-size="10" class="subtext-light">1. X.next = A.next (X points to B)</text>
    <text x="160" y="140" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">1. X.next = A.next (X points to B)</text>
    <text x="160" y="155" text-anchor="middle" font-size="10" class="subtext-light">2. A.next = X (A points to X)</text>
    <text x="160" y="155" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">2. A.next = X (A points to X)</text>
  </g>
  <text x="400" y="260" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Insertion at Tail — Requires Traversal (O(n))</text>
  <text x="400" y="260" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Insertion at Tail — Requires Traversal (O(n))</text>
  <g transform="translate(100, 280)">
    <rect x="0" y="0" width="50" height="35" class="node-light"/>
    <rect x="0" y="0" width="50" height="35" class="node-dark" style="display:none;"/>
    <text x="25" y="22" text-anchor="middle" font-size="11" class="text-light">A</text>
    <text x="25" y="22" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">A</text>
    <path d="M 50 17 L 70 17" class="arrow-light"/>
    <path d="M 50 17 L 70 17" class="arrow-dark" style="display:none;"/>
    <rect x="70" y="0" width="50" height="35" class="node-light"/>
    <rect x="70" y="0" width="50" height="35" class="node-dark" style="display:none;"/>
    <text x="95" y="22" text-anchor="middle" font-size="11" class="text-light">B</text>
    <text x="95" y="22" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">B</text>
    <path d="M 120 17 L 140 17" class="arrow-light"/>
    <path d="M 120 17 L 140 17" class="arrow-dark" style="display:none;"/>
    <rect x="140" y="0" width="50" height="35" class="node-light"/>
    <rect x="140" y="0" width="50" height="35" class="node-dark" style="display:none;"/>
    <text x="165" y="22" text-anchor="middle" font-size="11" class="text-light">C</text>
    <text x="165" y="22" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">C</text>
    <path d="M 190 17 L 210 17" class="old-arrow-light"/>
    <path d="M 190 17 L 210 17" class="old-arrow-dark" style="display:none;"/>
    <text x="215" y="22" text-anchor="middle" font-size="11" class="subtext-light">NULL</text>
    <text x="215" y="22" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">NULL</text>
    <path d="M 165 35 Q 165 55 240 55 L 240 45" class="new-arrow-light"/>
    <path d="M 165 35 Q 165 55 240 55 L 240 45" class="new-arrow-dark" style="display:none;"/>
    <rect x="220" y="0" width="50" height="35" class="new-light"/>
    <rect x="220" y="0" width="50" height="35" class="new-dark" style="display:none;"/>
    <text x="245" y="22" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">D</text>
    <text x="245" y="22" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">D</text>
    <path d="M 270 17 L 290 17" class="null-light" stroke-dasharray="4,3"/>
    <path d="M 270 17 L 290 17" class="null-dark" stroke-dasharray="4,3" style="display:none;"/>
    <text x="300" y="22" text-anchor="middle" font-size="11" class="subtext-light">NULL</text>
    <text x="300" y="22" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">NULL</text>
    <text x="300" y="50" text-anchor="middle" font-size="10" class="subtext-light">Must traverse from head to find tail (O(n)), then update tail.next = new node</text>
    <text x="300" y="50" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Must traverse from head to find tail (O(n)), then update tail.next = new node</text>
  </g>
  <text x="400" y="380" text-anchor="middle" font-size="11" class="subtext-light">Key insight: insertion is O(1) at head or after a known node, but O(n) at tail without a tail pointer. Maintaining a tail pointer reduces tail insertion to O(1) but adds space overhead.</text>
  <text x="400" y="380" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Key insight: insertion is O(1) at head or after a known node, but O(n) at tail without a tail pointer. Maintaining a tail pointer reduces tail insertion to O(1) but adds space overhead.</text>
</svg>
`;

const memoryLayoutComparisonSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .contiguous-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .contiguous-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .scattered-light { fill: #fef3c7; stroke: #d97706; stroke-width: 2; }
      .scattered-dark { fill: #451a03; stroke: #fbbf24; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .ptr-light { stroke: #dc2626; stroke-width: 2; stroke-dasharray: 6,4; fill: none; marker-end: url(#arrow-red-light); }
      .ptr-dark { stroke: #f87171; stroke-width: 2; stroke-dasharray: 6,4; fill: none; marker-end: url(#arrow-red-dark); }
    </style>
    <marker id="arrow-red-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626"/>
    </marker>
    <marker id="arrow-red-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#f87171"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="360" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="360" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Memory Layout: Array vs. Linked List</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Memory Layout: Array vs. Linked List</text>
  <text x="200" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Array — Contiguous Block</text>
  <text x="200" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Array — Contiguous Block</text>
  <text x="600" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Linked List — Scattered Heap Nodes</text>
  <text x="600" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Linked List — Scattered Heap Nodes</text>
  <g transform="translate(50, 80)">
    <rect x="0" y="0" width="300" height="80" rx="4" class="contiguous-light"/>
    <rect x="0" y="0" width="300" height="80" rx="4" class="contiguous-dark" style="display:none;"/>
    <rect x="5" y="5" width="55" height="30" class="contiguous-light" stroke-width="1"/>
    <rect x="5" y="5" width="55" height="30" class="contiguous-dark" stroke-width="1" style="display:none;"/>
    <text x="32" y="24" text-anchor="middle" font-size="11" class="text-light">arr[0]</text>
    <text x="32" y="24" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">arr[0]</text>
    <rect x="60" y="5" width="55" height="30" class="contiguous-light" stroke-width="1"/>
    <rect x="60" y="5" width="55" height="30" class="contiguous-dark" stroke-width="1" style="display:none;"/>
    <text x="87" y="24" text-anchor="middle" font-size="11" class="text-light">arr[1]</text>
    <text x="87" y="24" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">arr[1]</text>
    <rect x="115" y="5" width="55" height="30" class="contiguous-light" stroke-width="1"/>
    <rect x="115" y="5" width="55" height="30" class="contiguous-dark" stroke-width="1" style="display:none;"/>
    <text x="142" y="24" text-anchor="middle" font-size="11" class="text-light">arr[2]</text>
    <text x="142" y="24" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">arr[2]</text>
    <rect x="170" y="5" width="55" height="30" class="contiguous-light" stroke-width="1"/>
    <rect x="170" y="5" width="55" height="30" class="contiguous-dark" stroke-width="1" style="display:none;"/>
    <text x="197" y="24" text-anchor="middle" font-size="11" class="text-light">arr[3]</text>
    <text x="197" y="24" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">arr[3]</text>
    <rect x="225" y="5" width="55" height="30" class="contiguous-light" stroke-width="1"/>
    <rect x="225" y="5" width="55" height="30" class="contiguous-dark" stroke-width="1" style="display:none;"/>
    <text x="252" y="24" text-anchor="middle" font-size="11" class="text-light">arr[4]</text>
    <text x="252" y="24" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">arr[4]</text>
    <text x="150" y="55" text-anchor="middle" font-size="10" class="subtext-light">Single allocation at 0x1000</text>
    <text x="150" y="55" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Single allocation at 0x1000</text>
    <text x="150" y="70" text-anchor="middle" font-size="10" class="subtext-light">Sequential access: cache-line prefetching</text>
    <text x="150" y="70" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Sequential access: cache-line prefetching</text>
  </g>
  <g transform="translate(450, 80)">
    <rect x="0" y="0" width="70" height="50" class="scattered-light"/>
    <rect x="0" y="0" width="70" height="50" class="scattered-dark" style="display:none;"/>
    <text x="35" y="20" text-anchor="middle" font-size="11" class="text-light">Node A</text>
    <text x="35" y="20" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">Node A</text>
    <text x="35" y="38" text-anchor="middle" font-size="9" class="subtext-light">0x3A00</text>
    <text x="35" y="38" text-anchor="middle" font-size="9" class="subtext-dark" style="display:none;">0x3A00</text>
    <rect x="150" y="120" width="70" height="50" class="scattered-light"/>
    <rect x="150" y="120" width="70" height="50" class="scattered-dark" style="display:none;"/>
    <text x="185" y="140" text-anchor="middle" font-size="11" class="text-light">Node B</text>
    <text x="185" y="140" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">Node B</text>
    <text x="185" y="158" text-anchor="middle" font-size="9" class="subtext-light">0x7C40</text>
    <text x="185" y="158" text-anchor="middle" font-size="9" class="subtext-dark" style="display:none;">0x7C40</text>
    <rect x="230" y="10" width="70" height="50" class="scattered-light"/>
    <rect x="230" y="10" width="70" height="50" class="scattered-dark" style="display:none;"/>
    <text x="265" y="30" text-anchor="middle" font-size="11" class="text-light">Node C</text>
    <text x="265" y="30" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">Node C</text>
    <text x="265" y="48" text-anchor="middle" font-size="9" class="subtext-light">0x5B20</text>
    <text x="265" y="48" text-anchor="middle" font-size="9" class="subtext-dark" style="display:none;">0x5B20</text>
    <rect x="80" y="200" width="70" height="50" class="scattered-light"/>
    <rect x="80" y="200" width="70" height="50" class="scattered-dark" style="display:none;"/>
    <text x="115" y="220" text-anchor="middle" font-size="11" class="text-light">Node D</text>
    <text x="115" y="220" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">Node D</text>
    <text x="115" y="238" text-anchor="middle" font-size="9" class="subtext-light">0x9D60</text>
    <text x="115" y="238" text-anchor="middle" font-size="9" class="subtext-dark" style="display:none;">0x9D60</text>
    <path d="M 35 50 Q 80 80 185 120" class="ptr-light"/>
    <path d="M 35 50 Q 80 80 185 120" class="ptr-dark" style="display:none;"/>
    <path d="M 220 145 Q 270 80 265 60" class="ptr-light"/>
    <path d="M 220 145 Q 270 80 265 60" class="ptr-dark" style="display:none;"/>
    <path d="M 300 35 Q 200 180 115 200" class="ptr-light"/>
    <path d="M 300 35 Q 200 180 115 200" class="ptr-dark" style="display:none;"/>
  </g>
  <text x="400" y="310" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Cache Performance Impact</text>
  <text x="400" y="310" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Cache Performance Impact</text>
  <text x="400" y="330" text-anchor="middle" font-size="11" class="subtext-light">Array traversal: 1 cache miss per 8 elements (64B cache line / 8B per element). Linked list: 1 cache miss per element.</text>
  <text x="400" y="330" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Array traversal: 1 cache miss per 8 elements (64B cache line / 8B per element). Linked list: 1 cache miss per element.</text>
  <text x="400" y="350" text-anchor="middle" font-size="11" class="subtext-light">For 1M elements: array iteration ~5ms, linked list iteration ~50-250ms (10-50x slower in practice despite same O(n) complexity).</text>
  <text x="400" y="350" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">For 1M elements: array iteration ~5ms, linked list iteration ~50-250ms (10-50x slower in practice despite same O(n) complexity).</text>
</svg>
`;

const concurrentLinkedListSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .node-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .node-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .cas-light { stroke: #8b5cf6; stroke-width: 2; fill: none; marker-end: url(#arrow-purple-light); }
      .cas-dark { stroke: #a78bfa; stroke-width: 2; fill: none; marker-end: url(#arrow-purple-dark); }
      .thread-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .thread-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
      .fail-light { stroke: #dc2626; stroke-width: 2; stroke-dasharray: 6,4; fill: none; marker-end: url(#arrow-fail-light); }
      .fail-dark { stroke: #f87171; stroke-width: 2; stroke-dasharray: 6,4; fill: none; marker-end: url(#arrow-fail-dark); }
    </style>
    <marker id="arrow-purple-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6"/>
    </marker>
    <marker id="arrow-purple-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#a78bfa"/>
    </marker>
    <marker id="arrow-fail-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626"/>
    </marker>
    <marker id="arrow-fail-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#f87171"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="380" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="380" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Lock-Free Concurrent Singly Linked List</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Lock-Free Concurrent Singly Linked List</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Compare-and-Swap (CAS) on head pointer; retry on contention</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Compare-and-Swap (CAS) on head pointer; retry on contention</text>
  <g transform="translate(200, 80)">
    <rect x="0" y="0" width="60" height="40" class="node-light"/>
    <rect x="0" y="0" width="60" height="40" class="node-dark" style="display:none;"/>
    <text x="30" y="25" text-anchor="middle" font-size="12" class="text-light">A</text>
    <text x="30" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A</text>
    <path d="M 60 20 L 90 20" class="cas-light"/>
    <path d="M 60 20 L 90 20" class="cas-dark" style="display:none;"/>
    <rect x="100" y="0" width="60" height="40" class="node-light"/>
    <rect x="100" y="0" width="60" height="40" class="node-dark" style="display:none;"/>
    <text x="130" y="25" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="130" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <path d="M 160 20 L 190 20" class="cas-light"/>
    <path d="M 160 20 L 190 20" class="cas-dark" style="display:none;"/>
    <rect x="200" y="0" width="60" height="40" class="node-light"/>
    <rect x="200" y="0" width="60" height="40" class="node-dark" style="display:none;"/>
    <text x="230" y="25" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="230" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <path d="M 260 20 L 290 20" class="cas-light"/>
    <path d="M 260 20 L 290 20" class="cas-dark" style="display:none;"/>
    <text x="300" y="25" text-anchor="middle" font-size="11" class="subtext-light">NULL</text>
    <text x="300" y="25" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">NULL</text>
  </g>
  <text x="100" y="100" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">head</text>
  <text x="100" y="100" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">head</text>
  <path d="M 100 108 L 100 115" class="cas-light"/>
  <path d="M 100 108 L 100 115" class="cas-dark" style="display:none;"/>
  <g transform="translate(50, 160)">
    <rect x="0" y="0" width="700" height="80" rx="6" class="thread-light"/>
    <rect x="0" y="0" width="700" height="80" rx="6" class="thread-dark" style="display:none;"/>
    <text x="350" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Thread 1: Push(X) — CAS Operation</text>
    <text x="350" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Thread 1: Push(X) — CAS Operation</text>
    <text x="350" y="50" text-anchor="middle" font-size="11" class="subtext-light">1. Read current head: oldHead = head (points to A)</text>
    <text x="350" y="50" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">1. Read current head: oldHead = head (points to A)</text>
    <text x="350" y="70" text-anchor="middle" font-size="11" class="subtext-light">2. X.next = oldHead</text>
    <text x="350" y="70" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">2. X.next = oldHead</text>
  </g>
  <g transform="translate(50, 260)">
    <rect x="0" y="0" width="700" height="80" rx="6" class="thread-light"/>
    <rect x="0" y="0" width="700" height="80" rx="6" class="thread-dark" style="display:none;"/>
    <text x="350" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Thread 2: Push(Y) — Concurrent CAS Operation</text>
    <text x="350" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Thread 2: Push(Y) — Concurrent CAS Operation</text>
    <text x="350" y="50" text-anchor="middle" font-size="11" class="subtext-light">1. Read current head: oldHead = head (points to A)</text>
    <text x="350" y="50" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">1. Read current head: oldHead = head (points to A)</text>
    <text x="350" y="70" text-anchor="middle" font-size="11" class="subtext-light">2. Y.next = oldHead</text>
    <text x="350" y="70" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">2. Y.next = oldHead</text>
  </g>
  <text x="400" y="370" text-anchor="middle" font-size="11" class="subtext-light">CAS(head, oldHead, newNode): if head == oldHead, set head = newNode, return true; else return false (retry). Both threads read same oldHead; only one CAS succeeds.</text>
  <text x="400" y="370" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">CAS(head, oldHead, newNode): if head == oldHead, set head = newNode, return true; else return false (retry). Both threads read same oldHead; only one CAS succeeds.</text>
</svg>
`;

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>singly linked list</strong> is a linear data structure composed of nodes, where each node contains two fields: a data element (the value being stored) and a pointer (or reference) to the next node in the sequence. The list is accessed through a <code>head</code> pointer that references the first node, and traversal proceeds unidirectionally from head to tail. The final node&apos;s pointer field contains a <code>NULL</code> (or <code>nil</code>) sentinel value, marking the end of the list.
        </p>
        <p>
          Unlike arrays, which store elements in contiguous memory, linked list nodes are allocated individually on the heap and connected through explicit pointers. This fundamental architectural difference defines the entire trade-off space: linked lists sacrifice cache performance and random access capability in exchange for O(1) insertion and deletion at the head (or at any position where the predecessor node is already known). For staff and principal engineers, the singly linked list is not merely an academic data structure — it is the foundation of lock-free concurrent data structures, memory allocator free lists, kernel process lists, and countless production systems where pointer-based manipulation is more natural than index-based access.
        </p>
        <p>
          The singly linked list is the simplest variant of linked structures, distinguished from doubly linked lists by its unidirectional traversal constraint. This constraint reduces per-node memory overhead (one pointer instead of two) and simplifies certain algorithms, but it also means that deletion of a node requires access to its predecessor — a constraint that shapes the design of every algorithm operating on the structure.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <h3>Node Structure and Pointer Semantics</h3>
        <p>
          Each node in a singly linked list is a struct or object containing a data field and a next pointer. The data field holds the element value (or a reference to it), and the next pointer holds the memory address of the subsequent node, or <code>NULL</code> if the node is the tail. In a 64-bit system, the pointer occupies 8 bytes regardless of the data size, meaning that for small data elements (e.g., 4-byte integers), the pointer overhead is 200% of the data size. For larger data elements, the pointer overhead becomes proportionally smaller, but it remains a fixed cost per element that arrays do not incur.
        </p>
        <p>
          Pointer semantics vary by language. In C and C++, the next field is a raw memory address, and dereferencing a <code>NULL</code> or dangling pointer causes undefined behavior (segmentation faults). In managed languages (Java, Python, JavaScript), the next field is a reference managed by the garbage collector, which adds a layer of safety but also introduces GC pressure proportional to the number of live nodes. In Rust, the next field uses <code>Option&lt;Box&lt;Node&gt;&gt;</code> or <code>Option&lt;&amp;&apos;a Node&gt;</code> to enforce borrow-checking guarantees at compile time, eliminating dangling pointers entirely.
        </p>

        <h3>Traversal and Search</h3>
        <p>
          Traversing a singly linked list requires starting at the head and following next pointers sequentially until the target node is found or the <code>NULL</code> terminator is reached. This is inherently an O(n) operation with no algorithmic shortcut — there is no index-based access, no binary search, and no skip-ahead mechanism. The traversal loop is simple: initialize a cursor to head, check if the cursor is <code>NULL</code>, process the cursor&apos;s data, advance the cursor to cursor.next. However, the real-world performance of this loop is dominated by memory latency rather than CPU speed: each pointer dereference potentially causes a cache miss, and for a list of <em>n</em> nodes scattered across the heap, the traversal incurs up to <em>n</em> cache misses.
        </p>
        <p>
          The search problem (finding a node with a specific value) in an unsorted singly linked list is identical to traversal: visit every node and compare its data field against the target. For sorted linked lists, search can terminate early once the traversal encounters a node whose value exceeds the target, but the worst-case complexity remains O(n) because the target might be at the tail or absent entirely.
        </p>

        <h3>Insertion Operations</h3>
        <p>
          Insertion at the head of a singly linked list is the structure&apos;s signature O(1) operation. The procedure allocates a new node, sets its next pointer to the current head, and updates the head pointer to reference the new node. This involves exactly two pointer assignments and one allocation, regardless of list size. Insertion after a given node is also O(1) when the predecessor node is known: allocate the new node, set its next pointer to the predecessor&apos;s current next, and update the predecessor&apos;s next to point to the new node. The order of these assignments is critical — the new node&apos;s next must be set before the predecessor&apos;s next is updated, otherwise the rest of the list becomes unreachable.
        </p>
        <p>
          Insertion at the tail requires O(n) time because the list must be traversed from head to find the current tail node. This can be reduced to O(1) by maintaining a separate <code>tail</code> pointer alongside the <code>head</code> pointer, but this adds 8 bytes of state (the tail pointer itself) and requires updating the tail pointer on every tail insertion. The tail pointer approach is standard in queue implementations built on linked lists, where FIFO semantics require efficient enqueue at tail and dequeue at head.
        </p>

        <h3>Deletion Operations</h3>
        <p>
          Deletion in a singly linked list requires access to the predecessor of the node being deleted, because the predecessor&apos;s next pointer must be rewired to skip over the deleted node and point directly to the deleted node&apos;s successor. Deleting the head node is O(1): simply update the head pointer to head.next. Deleting any other node requires first locating its predecessor, which in the worst case means traversing the list from the head — an O(n) operation.
        </p>
        <p>
          A common technique to avoid the predecessor search is the <strong>copy-and-delete-next</strong> approach: to delete node N (when N is not the tail), copy N.next&apos;s data into N, then delete N.next by setting N.next = N.next.next. This effectively removes the data from N&apos;s position while actually freeing the N.next node. However, this approach fails when N is the tail node (no next node to copy from) and is semantically incorrect when other parts of the program hold pointers to N.next (those pointers now reference a freed node). For these reasons, the standard predecessor-based deletion remains the most widely used approach despite its O(n) predecessor lookup cost.
        </p>

        <h3>Sentinel (Dummy) Nodes</h3>
        <p>
          A sentinel or dummy node is a pre-allocated node placed at the head (or between head and first data node) of a linked list that simplifies edge case handling. With a sentinel, the list is never empty — the sentinel always exists, and the first data node (if any) is sentinel.next. Insertion and deletion algorithms no longer need special-case logic for empty lists or head-node operations, because the sentinel serves as a permanent predecessor for all data nodes. This simplification is particularly valuable in concurrent implementations and in production code where reducing branching logic decreases the probability of bugs.
        </p>

        <ArticleImage svgContent={linkedListStructureSVG} caption="Singly linked list node structure showing data and next pointer chain from head to tail" />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Memory Allocation Pattern and Heap Fragmentation</h3>
        <p>
          Every node in a singly linked list is allocated independently through the memory allocator (malloc, new, or the language-specific equivalent). Over time, as nodes are inserted and deleted, the heap accumulates allocated and freed blocks at scattered addresses. This fragmentation has two consequences. First, newly allocated nodes may be placed at arbitrary heap locations, increasing the average distance between consecutive nodes in the list and worsening cache performance. Second, the allocator must maintain free-list metadata to track available blocks, and frequent small allocations trigger allocator internal fragmentation — the allocator rounds up each allocation to its size class boundary, wasting a few bytes per node.
        </p>
        <p>
          Production systems that use linked lists for long-lived data structures often implement <strong>memory pooling</strong> or <strong>arena allocation</strong> for nodes: a large block of memory is pre-allocated, and nodes are carved out of this block sequentially. When nodes are freed, they are returned to the pool&apos;s free list rather than to the system allocator. This approach keeps node allocations within a confined address range, improving cache locality and eliminating allocator overhead. The Linux kernel&apos;s <code>kmem_cache</code> and high-frequency trading systems use this pattern extensively.
        </p>

        <h3>Insertion and Deletion Flow</h3>
        <p>
          The insertion flow at the head follows a deterministic sequence: allocate the new node, populate its data field, set its next pointer to the current head, and atomically (or non-atomically, depending on concurrency requirements) update the head pointer to reference the new node. In a single-threaded context, this is a straightforward sequence of assignments. In a concurrent context, the head update must be atomic to prevent lost updates when multiple threads push simultaneously.
        </p>
        <p>
          The deletion flow for a non-head node requires a two-pointer traversal: a <code>prev</code> pointer tracking the predecessor and a <code>current</code> pointer tracking the node being examined. When <code>current</code> matches the target, <code>prev.next</code> is set to <code>current.next</code>, and <code>current</code> is freed. The two-pointer traversal is the standard pattern because a singly linked list provides no backward navigation — the predecessor cannot be reached from the node itself.
        </p>

        <ArticleImage svgContent={insertionOperationSVG} caption="Insertion at head, after a known node, and at tail showing pointer rewiring steps" />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <h3>Singly Linked List versus Array</h3>
        <p>
          The comparison between singly linked lists and arrays is the most fundamental data structure trade-off. Arrays provide O(1) random access and optimal cache-line utilization because elements are stored contiguously. Linked lists provide O(1) insertion and deletion at the head but require O(n) traversal for access and suffer from poor cache performance because nodes are scattered across the heap. The critical insight for senior engineers is that the algorithmic complexity (Big-O) tells only half the story: the constant factors driven by cache behavior often dominate real-world performance.
        </p>
        <p>
          For a list of one million 8-byte integers, an array iteration completes in approximately 5 milliseconds on modern hardware, leveraging cache-line prefetching to load 8 elements per cache line. The equivalent linked list iteration, following one pointer per element, incurs a cache miss for nearly every node and takes 50-250 milliseconds — 10 to 50 times slower despite identical O(n) algorithmic complexity. This disparity is why linked lists are rarely the right choice for read-heavy or traversal-heavy workloads, even when their insertion/deletion semantics seem ideal.
        </p>

        <h3>Singly Linked List versus Doubly Linked List</h3>
        <p>
          Doubly linked lists add a prev pointer to each node, enabling backward traversal and O(1) deletion given a pointer to the node itself (no predecessor search needed). The cost is an additional 8 bytes per node (on 64-bit systems) and the need to maintain both pointers during insertion and deletion, doubling the pointer-rewiring complexity. Singly linked lists are preferable when memory is constrained, when traversal is strictly unidirectional, and when the O(1) deletion advantage of doubly linked lists is not needed. Doubly linked lists are preferable when backward traversal is required, when nodes are deleted by reference without predecessor access, and when the memory overhead is acceptable — as in LRU caches, browser history, and text editor undo stacks.
        </p>

        <h3>Singly Linked List versus Hash Table</h3>
        <p>
          When the primary operation is searching by key, hash tables provide O(1) average-time lookup compared to O(n) for linked lists. However, hash tables require the key to be hashable, must handle collisions (via chaining with linked lists or open addressing), and have higher memory overhead for the hash table structure itself. Singly linked lists are preferable when the dataset is small (under a few hundred elements, where O(n) linear scan is faster than hash computation and table lookup), when insertion order must be preserved, and when memory overhead is a primary concern. Hash tables become preferable as the dataset grows and lookup frequency dominates insertion frequency.
        </p>

        <ArticleImage svgContent={memoryLayoutComparisonSVG} caption="Memory layout comparison showing contiguous array allocation versus scattered linked list heap nodes" />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use singly linked lists when your workload involves frequent insertions or deletions at the head (or at known positions) and infrequent random access or traversal. The classic use case is a stack implemented as a linked list: push and pop are both O(1) head operations, and traversal is never required. For queue implementations, use a linked list with both head and tail pointers to achieve O(1) enqueue (at tail) and O(1) dequeue (at head).
        </p>
        <p>
          When building concurrent linked lists, prefer <strong>lock-free algorithms using compare-and-swap (CAS)</strong> operations on the head pointer for push and pop. The Michael-Scott queue algorithm and Treiber&apos;s stack are foundational lock-free patterns built on singly linked lists. For single-producer, single-consumer scenarios, a lock-free singly linked list with a CAS on the head pointer provides wait-free push and amortized wait-free pop, avoiding the overhead of mutex-based synchronization entirely.
        </p>
        <p>
          Use <strong>sentinel nodes</strong> to simplify insertion and deletion logic, especially in production code where reducing conditional branches decreases bug probability. A sentinel at the head eliminates the special case of &quot;inserting into an empty list&quot; and &quot;deleting the head node&quot; because the sentinel always exists and always has a successor (or <code>NULL</code> if the data portion is empty).
        </p>
        <p>
          For long-lived linked lists in high-throughput systems, implement <strong>node pooling</strong> to reduce allocator pressure and improve cache locality. Pre-allocate a large block of nodes, manage them with an internal free list (using the next pointer of freed nodes to chain available nodes), and allocate from the pool rather than the system allocator. This pattern is used in the Linux kernel, database buffer pools, and real-time systems where allocation latency must be bounded.
        </p>
        <p>
          When memory is at a premium, consider <strong>unrolled linked lists</strong>, where each node contains a small array of elements (e.g., 16-64 elements) plus a next pointer. This reduces the per-element pointer overhead from one pointer per element to one pointer per block of elements, and improves cache utilization because iterating through a node&apos;s internal array benefits from spatial locality. Unrolled linked lists are used in text editors (for storing character buffers), B-tree implementations (as leaf nodes), and skip list data structures.
        </p>

        <ArticleImage svgContent={concurrentLinkedListSVG} caption="Lock-free concurrent linked list showing CAS operations from multiple threads" />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most frequent pitfall in linked list programming is <strong>pointer ordering during insertion</strong>. Setting the predecessor&apos;s next pointer before setting the new node&apos;s next pointer causes the remainder of the list to become unreachable — a bug that silently drops data. The correct order is always: set the new node&apos;s next first, then update the predecessor&apos;s next. This ordering requirement is a common interview question topic and a frequent source of production bugs in code written under time pressure.
        </p>
        <p>
          <strong>Dereferencing NULL or freed pointers</strong> is the second most common issue. Traversal loops that fail to check for <code>NULL</code> before accessing the next field cause null pointer exceptions (in managed languages) or segmentation faults (in C/C++). After deletion, failing to set the freed node&apos;s pointer to <code>NULL</code> (or a poison value in debug builds) can lead to use-after-free bugs where the program continues to follow a pointer to deallocated memory, reading garbage data or corrupting unrelated structures.
        </p>
        <p>
          <strong>Memory leaks from orphaned nodes</strong> occur when a node is removed from the list but not freed, or when the entire list is abandoned without freeing its nodes. In garbage-collected languages, orphaned nodes are eventually reclaimed, but in C/C++ they represent permanent memory leaks. The standard pattern is: save the next pointer before freeing the current node, then move to the saved pointer. For whole-list deallocation, iterate from head, saving next and freeing current at each step, until <code>NULL</code> is reached.
        </p>
        <p>
          <strong>Inadvertent cycle creation</strong> can occur during complex pointer rewiring, particularly when implementing list reversal or merge operations. If a pointer assignment creates a cycle (e.g., node A points to node B, and node B points to node A), traversal loops become infinite loops. Debugging this requires careful tracing of pointer assignments and, in production, adding a visited-node counter or cycle-detection mechanism (Floyd&apos;s tortoise-and-hare algorithm) to detect and break cycles.
        </p>
        <p>
          <strong>Ignoring cache performance</strong> is a design-level pitfall. Choosing a linked list because of its O(1) insertion semantics without considering the 10-50× traversal performance penalty compared to arrays leads to systems that perform well in development (with small datasets) but degrade severely in production (with large datasets). Always benchmark linked list performance against array-based alternatives using production-scale data sizes before committing to the structure.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Memory allocator free lists</strong> are perhaps the most fundamental real-world use of singly linked lists. When a memory allocator manages its pool of available blocks, it chains freed blocks together using their own memory as storage for the next pointer — the first 8 bytes of a freed block hold the address of the next free block. This is a zero-overhead linked list: the &quot;nodes&quot; are the freed blocks themselves, and no additional memory is consumed for pointer storage. The allocator&apos;s malloc operation removes the head of the free list (O(1)), and free adds a block to the head (O(1)). This pattern is used by malloc implementations in glibc, jemalloc, and the Windows heap manager.
        </p>
        <p>
          <strong>Lock-free concurrent stacks and queues</strong> in high-performance systems (networking stacks, trading platforms, real-time analytics) use singly linked lists with CAS operations on the head pointer. Treiber&apos;s stack algorithm provides a lock-free concurrent stack where multiple threads can push and pop without mutex contention. The Linux kernel&apos;s lockless list implementation (<code>llist</code>) uses this pattern for deferred work item processing, where interrupt handlers enqueue work items and worker threads dequeue them without any locking overhead.
        </p>
        <p>
          <strong>Kernel process and file descriptor lists</strong> in operating systems use singly linked lists to track active processes, open file descriptors, and pending interrupts. The Linux kernel uses <code>hlist</code> (hash list, a variant of singly linked lists) for hash table buckets, where each bucket is a singly linked list of entries. This choice minimizes memory overhead per bucket (the head pointer is a single pointer rather than a double pointer as in doubly linked lists) while providing adequate traversal performance for typically short bucket chains.
        </p>
        <p>
          <strong>Undo history and browser history</strong> in applications use singly linked lists when backward navigation is not required or when memory is constrained. A text editor&apos;s redo stack, for example, is a singly linked list of operations: when the user undoes an action, it moves from the undo list to the redo list; when the user redoes, it moves from the redo list back to the undo list. Each list is singly linked because operations are only consumed from the head.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <h3>1. How would you reverse a singly linked list in-place? Walk through the iterative and recursive approaches.</h3>
        <p>
          The iterative approach uses three pointers: <code>prev</code> (initially <code>NULL</code>), <code>current</code> (initially head), and <code>next</code> (used to save the next node before rewiring). The algorithm iterates through the list, and at each step: saves <code>current.next</code> into <code>next</code>, sets <code>current.next</code> to <code>prev</code> (reversing the pointer), advances <code>prev</code> to <code>current</code>, and advances <code>current</code> to <code>next</code>. When <code>current</code> becomes <code>NULL</code>, <code>prev</code> points to the new head (the original tail). This runs in O(n) time with O(1) extra space — truly in-place.
        </p>
        <p>
          The recursive approach reverses the rest of the list recursively, then rewires the current node&apos;s next pointer to point backward. The base case is an empty list or a single-node list (already reversed). For a list with head H and rest R: recursively reverse R to get newHead, then set H.next.next = H (making H the successor of what was previously after H), and set H.next = <code>NULL</code>. Return newHead. The recursive approach also runs in O(n) time but uses O(n) stack space, making it unsuitable for very long lists due to stack overflow risk. In an interview, presenting both approaches and discussing the space trade-off demonstrates thoroughness.
        </p>
        <p>
          A common follow-up is to handle partial reversal (reverse nodes from position m to n). This requires locating the (m-1)-th node, reversing the sublist from m to n using the standard three-pointer approach, and then reconnecting the reversed sublist&apos;s new head to the (m-1)-th node and its new tail to the (n+1)-th node. Careful pointer management is essential to avoid losing references to nodes outside the reversal range.
        </p>

        <h3>2. How do you detect a cycle in a singly linked list? Explain Floyd&apos;s cycle-finding algorithm and its mathematical justification.</h3>
        <p>
          Floyd&apos;s cycle-finding algorithm (the tortoise-and-hare algorithm) uses two pointers moving through the list at different speeds: the tortoise advances one node per step, and the hare advances two nodes per step. If the list has no cycle, the hare reaches <code>NULL</code> first and the algorithm terminates. If the list has a cycle, the hare eventually enters the cycle and laps the tortoise — the two pointers meet at some node within the cycle.
        </p>
        <p>
          The mathematical justification relies on modular arithmetic. Let the cycle have length <em>L</em>. If the tortoise is at position <em>p</em> within the cycle (0 ≤ p &lt; L) and the hare is at position <em>q</em>, after one step the tortoise moves to (p + 1) mod L and the hare moves to (q + 2) mod L. The distance between them decreases by 1 each step (modulo L), so they are guaranteed to meet within at most L steps after the tortoise enters the cycle. The algorithm runs in O(n) time (the hare traverses at most 2n nodes) and uses O(1) space (two pointers).
        </p>
        <p>
          A follow-up question often asks how to find the <em>start</em> of the cycle. Once the tortoise and hare meet, reset the tortoise to the head and advance both pointers one step at a time. They will meet again at the cycle&apos;s start node. This works because the distance from the head to the cycle start equals the distance from the meeting point to the cycle start (modulo the cycle length), a result provable through algebraic analysis of the pointer positions.
        </p>

        <h3>3. How would you find the middle element of a singly linked list in a single pass?</h3>
        <p>
          Use the two-pointer technique: initialize a slow pointer and a fast pointer both to the head. Advance the slow pointer by one node per step and the fast pointer by two nodes per step. When the fast pointer reaches the end of the list (<code>NULL</code> or the last node), the slow pointer will be at the middle node. If the list has an even number of nodes, the slow pointer will be at the second of the two middle nodes (this is a design choice; the first middle node can be targeted by adjusting the termination condition).
        </p>
        <p>
          The correctness follows from the speed differential: the fast pointer covers distance at twice the rate of the slow pointer, so when the fast pointer has traversed the entire list (distance <em>n</em>), the slow pointer has traversed exactly <em>n/2</em> nodes. This is the same principle as Floyd&apos;s cycle detection but applied to a linear (non-cyclic) list. The algorithm runs in O(n) time with a single pass and O(1) space.
        </p>
        <p>
          Extensions include finding the k-th element from the end: position a fast pointer k nodes ahead of the head, then advance both pointers together until the fast pointer reaches the end. The slow pointer will be at the k-th-from-end node. This is a common variation that tests whether the candidate can generalize the two-pointer pattern.
        </p>

        <h3>4. Explain how to implement a lock-free concurrent stack using a singly linked list. What are the ABA problem and its solutions?</h3>
        <p>
          A lock-free concurrent stack (Treiber&apos;s stack) uses a singly linked list where the head pointer is an atomic variable. The push operation loops: read the current head atomically, set the new node&apos;s next to the current head, and attempt a CAS (compare-and-swap) on the head from the current head to the new node. If the CAS succeeds, the push is complete; if it fails (another thread modified the head concurrently), the loop retries. The pop operation similarly loops: read the current head, if <code>NULL</code> return empty, read head.next, and attempt a CAS on the head from the current head to head.next. Success means the node is logically removed; failure triggers a retry.
        </p>
        <p>
          The <strong>ABA problem</strong> occurs when a thread reads value A from the head, another thread removes A (popping it) and then pushes A back (or a different node that gets allocated at the same memory address), and the first thread&apos;s CAS succeeds because the head still appears to be A — but the list state has changed in the interim. In a stack context, this can cause data corruption if the popped node was freed and reallocated.
        </p>
        <p>
          Solutions to the ABA problem include: (1) <strong>Hazard pointers</strong>, where each thread publishes the pointers it is currently accessing, and nodes are not freed until no thread holds a hazard pointer to them; (2) <strong>Epoch-based reclamation</strong>, where the system tracks global epochs and defers deallocation until all threads have advanced past the epoch in which the node was removed; (3) <strong>Tagged pointers</strong> (or versioned pointers), where the head pointer is extended with a monotonically increasing version number that changes on every update, making the ABA scenario detectable because the version number will differ even if the address is the same. Tagged pointers require double-width CAS (128-bit on 64-bit systems) and are not universally available, making hazard pointers or epoch-based reclamation the preferred solutions in production systems.
        </p>

        <h3>5. How would you merge two sorted singly linked lists into a single sorted list? Discuss both iterative and recursive approaches.</h3>
        <p>
          The iterative approach uses a sentinel (dummy) node as the starting point of the merged list and a <code>tail</code> pointer that tracks the end of the merged list. Two cursors traverse the input lists simultaneously. At each step, the algorithm compares the data at both cursors, appends the smaller node to the tail, and advances the corresponding cursor. When one list is exhausted, the remaining nodes of the other list are appended directly (since they are already sorted). The merged list starts at sentinel.next. This runs in O(m + n) time where m and n are the lengths of the input lists, and uses O(1) extra space (the sentinel and pointers).
        </p>
        <p>
          The recursive approach is elegant: if either list is empty, return the other; otherwise, compare the heads, and set the smaller head&apos;s next pointer to the result of recursively merging the remainder. The recursive approach has the same O(m + n) time complexity but uses O(m + n) stack space, making it impractical for long lists. In an interview, the iterative approach is preferred for production code, while the recursive approach demonstrates understanding of the problem&apos;s inherent structure.
        </p>
        <p>
          A production consideration is whether to create new nodes or rewire existing pointers. Rewiring (splicing) is O(1) space and preserves the original nodes, but it mutates the input lists — which may be undesirable if the caller expects them to remain unchanged. Creating new nodes is O(m + n) space but preserves the inputs. The choice depends on the contract with the caller and memory constraints.
        </p>

        <h3>6. When is a linked list actually better than an array in practice? Give specific production scenarios.</h3>
        <p>
          Despite the cache-performance advantage of arrays, there are specific production scenarios where linked lists are genuinely superior. First, <strong>memory allocator free lists</strong>: freed memory blocks are inherently scattered, and chaining them with their own memory as pointer storage costs zero additional memory. Arrays cannot represent this structure without a parallel index structure that would itself require allocation.
        </p>
        <p>
          Second, <strong>lock-free concurrent stacks</strong>: the ability to atomically swap the head pointer via CAS enables wait-free push and amortized wait-free pop operations that arrays cannot match without complex synchronization. Arrays would require either locking the entire structure or implementing fine-grained concurrent access control that is far more complex than a CAS on a single pointer.
        </p>
        <p>
          Third, <strong>large-element insertion/deletion at known positions</strong>: when the elements are large objects (e.g., video frames, large structs) and insertion/deletion at arbitrary positions is frequent, a linked list avoids copying the large objects. The list only rearranges pointers, while an array would need to shift the large objects in memory. However, this scenario is better served by an array of pointers (or indices) rather than an array of objects, blurring the distinction.
        </p>
        <p>
          Fourth, <strong>polynomial representation in symbolic algebra systems</strong>: sparse polynomials are naturally represented as linked lists of (coefficient, exponent) pairs, sorted by exponent. Insertion of new terms and merging of polynomials are natural O(n) linked list operations, and the lists are typically short enough that cache performance is not a concern. Similar reasoning applies to big integer representations in arbitrary-precision arithmetic libraries.
        </p>
          <p>
          The honest answer that senior engineers should give is: &quot;Linked lists are rarely the best choice for general-purpose data storage. Their theoretical advantages are almost always outweighed by cache effects in modern hardware. I would use a linked list specifically for memory allocator free lists, lock-free concurrent stacks, or when building other data structures (like hash table chains or skip lists) where the linked structure serves a specific algorithmic purpose.&quot;
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li>Knuth, D.E. — &quot;The Art of Computer Programming, Volume 1: Fundamental Algorithms&quot; — Addison-Wesley, 3rd Edition, Section 2.2.3</li>
          <li>Cormen, T.H., Leiserson, C.E., Rivest, R.L., Stein, C. — &quot;Introduction to Algorithms&quot; — MIT Press, 4th Edition, Chapter 10</li>
          <li>Treiber, R.K. — &quot;Systems Programming: Coping with Parallelism&quot; — Technical Report RJ 5118, IBM Almaden Research Center, 1986</li>
          <li>Michael, M.M., Scott, M.L. — &quot;Simple, Fast, and Practical Non-Blocking and Blocking Concurrent Queue Algorithms&quot; — PODC 1996</li>
          <li>Herlihy, M., Shavit, N. — &quot;The Art of Multiprocessor Programming&quot; — Morgan Kaufmann, Revised Edition, Chapters 11-12 (Concurrent Linked Structures)</li>
          <li>Gorman, M. — &quot;Understanding the Linux Virtual Memory Allocator&quot; — Linux Journal, 2004 (Free List Implementation Details)</li>
          <li>Harris, T.L. — &quot;A Pragmatic Implementation of Non-Blocking Linked Lists&quot; — DISC 2001 (Lock-Free Linked List Algorithms)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

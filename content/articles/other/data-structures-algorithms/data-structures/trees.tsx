"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-data-structures-trees",
  title: "Trees",
  description:
    "Comprehensive guide to tree data structures: binary trees, BST operations, balanced trees (AVL, Red-Black), B-Trees for databases, traversal algorithms, and production-scale trade-offs for staff and principal engineer interviews.",
  category: "other",
  subcategory: "data-structures-algorithms/data-structures",
  slug: "trees",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-14",
  tags: ["data-structures", "trees", "binary-tree", "bst"],
  relatedTopics: ["graphs", "heaps-priority-queues", "hash-tables"],
};

const binaryTreeStructureSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .node-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .node-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .root-light { fill: #fef3c7; stroke: #d97706; stroke-width: 3; }
      .root-dark { fill: #451a03; stroke: #fbbf24; stroke-width: 3; }
      .leaf-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .leaf-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .edge-light { stroke: #475569; stroke-width: 2; fill: none; }
      .edge-dark { stroke: #94a3b8; stroke-width: 2; fill: none; }
    </style>
  </defs>
  <rect class="bg-light" width="800" height="400" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="400" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Binary Tree Structure — Root, Internal Nodes, and Leaves</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Binary Tree Structure — Root, Internal Nodes, and Leaves</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Height = 3 | Depth of leaves = 2,3 | Each node has at most 2 children (left, right)</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Height = 3 | Depth of leaves = 2,3 | Each node has at most 2 children (left, right)</text>
  <path d="M 400 90 L 250 170" class="edge-light"/>
  <path d="M 400 90 L 250 170" class="edge-dark" style="display:none;"/>
  <path d="M 400 90 L 550 170" class="edge-light"/>
  <path d="M 400 90 L 550 170" class="edge-dark" style="display:none;"/>
  <path d="M 250 210 L 150 290" class="edge-light"/>
  <path d="M 250 210 L 150 290" class="edge-dark" style="display:none;"/>
  <path d="M 250 210 L 350 290" class="edge-light"/>
  <path d="M 250 210 L 350 290" class="edge-dark" style="display:none;"/>
  <path d="M 550 210 L 500 290" class="edge-light"/>
  <path d="M 550 210 L 500 290" class="edge-dark" style="display:none;"/>
  <path d="M 550 210 L 650 290" class="edge-light"/>
  <path d="M 550 210 L 650 290" class="edge-dark" style="display:none;"/>
  <path d="M 150 330 L 120 370" class="edge-light"/>
  <path d="M 150 330 L 120 370" class="edge-dark" style="display:none;"/>
  <path d="M 150 330 L 180 370" class="edge-light"/>
  <path d="M 150 330 L 180 370" class="edge-dark" style="display:none;"/>
  <rect x="370" y="70" width="60" height="40" rx="20" class="root-light"/>
  <rect x="370" y="70" width="60" height="40" rx="20" class="root-dark" style="display:none;"/>
  <text x="400" y="95" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">10</text>
  <text x="400" y="95" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">10</text>
  <text x="400" y="65" text-anchor="middle" font-size="10" font-weight="bold" class="subtext-light">root (depth 0)</text>
  <text x="400" y="65" text-anchor="middle" font-size="10" font-weight="bold" class="subtext-dark" style="display:none;">root (depth 0)</text>
  <rect x="220" y="170" width="60" height="40" rx="20" class="node-light"/>
  <rect x="220" y="170" width="60" height="40" rx="20" class="node-dark" style="display:none;"/>
  <text x="250" y="195" text-anchor="middle" font-size="14" class="text-light">5</text>
  <text x="250" y="195" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">5</text>
  <rect x="520" y="170" width="60" height="40" rx="20" class="node-light"/>
  <rect x="520" y="170" width="60" height="40" rx="20" class="node-dark" style="display:none;"/>
  <text x="550" y="195" text-anchor="middle" font-size="14" class="text-light">15</text>
  <text x="550" y="195" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">15</text>
  <rect x="120" y="290" width="60" height="40" rx="20" class="node-light"/>
  <rect x="120" y="290" width="60" height="40" rx="20" class="node-dark" style="display:none;"/>
  <text x="150" y="315" text-anchor="middle" font-size="14" class="text-light">3</text>
  <text x="150" y="315" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">3</text>
  <rect x="320" y="290" width="60" height="40" rx="20" class="leaf-light"/>
  <rect x="320" y="290" width="60" height="40" rx="20" class="leaf-dark" style="display:none;"/>
  <text x="350" y="315" text-anchor="middle" font-size="14" class="text-light">7</text>
  <text x="350" y="315" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">7</text>
  <rect x="470" y="290" width="60" height="40" rx="20" class="leaf-light"/>
  <rect x="470" y="290" width="60" height="40" rx="20" class="leaf-dark" style="display:none;"/>
  <text x="500" y="315" text-anchor="middle" font-size="14" class="text-light">12</text>
  <text x="500" y="315" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">12</text>
  <rect x="620" y="290" width="60" height="40" rx="20" class="leaf-light"/>
  <rect x="620" y="290" width="60" height="40" rx="20" class="leaf-dark" style="display:none;"/>
  <text x="650" y="315" text-anchor="middle" font-size="14" class="text-light">18</text>
  <text x="650" y="315" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">18</text>
  <rect x="90" y="370" width="60" height="40" rx="20" class="leaf-light"/>
  <rect x="90" y="370" width="60" height="40" rx="20" class="leaf-dark" style="display:none;"/>
  <text x="120" y="395" text-anchor="middle" font-size="14" class="text-light">1</text>
  <text x="120" y="395" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">1</text>
  <rect x="150" y="370" width="60" height="40" rx="20" class="leaf-light"/>
  <rect x="150" y="370" width="60" height="40" rx="20" class="leaf-dark" style="display:none;"/>
  <text x="180" y="395" text-anchor="middle" font-size="14" class="text-light">4</text>
  <text x="180" y="395" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">4</text>
  <text x="400" y="380" text-anchor="middle" font-size="11" class="subtext-light">Yellow = root | Blue = internal nodes | Green = leaf nodes (no children)</text>
  <text x="400" y="380" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Yellow = root | Blue = internal nodes | Green = leaf nodes (no children)</text>
  <text x="400" y="395" text-anchor="middle" font-size="11" class="subtext-light">Max nodes at depth d: 2^d | Max nodes in tree of height h: 2^(h+1) - 1 | Min height for n nodes: floor(log2(n))</text>
  <text x="400" y="395" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Max nodes at depth d: 2^d | Max nodes in tree of height h: 2^(h+1) - 1 | Min height for n nodes: floor(log2(n))</text>
</svg>
`;

const bstOperationsSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .node-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .node-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .search-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 3; }
      .search-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 3; }
      .insert-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 3; }
      .insert-dark { fill: #14532d; stroke: #4ade80; stroke-width: 3; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .edge-light { stroke: #475569; stroke-width: 2; fill: none; }
      .edge-dark { stroke: #94a3b8; stroke-width: 2; fill: none; }
      .path-light { stroke: #3b82f6; stroke-width: 3; fill: none; }
      .path-dark { stroke: #60a5fa; stroke-width: 3; fill: none; }
    </style>
  </defs>
  <rect class="bg-light" width="800" height="340" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="340" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Binary Search Tree — Search and Insert Operations</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Binary Search Tree — Search and Insert Operations</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">BST Invariant: left subtree < node < right subtree. Search/Insert: O(h) where h = tree height.</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">BST Invariant: left subtree &lt; node &lt; right subtree. Search/Insert: O(h) where h = tree height.</text>
  <text x="200" y="85" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Search(7) — O(log n) balanced</text>
  <text x="200" y="85" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Search(7) — O(log n) balanced</text>
  <text x="600" y="85" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Insert(9) — O(log n) balanced</text>
  <text x="600" y="85" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Insert(9) — O(log n) balanced</text>
  <g transform="translate(50, 100)">
    <path d="M 150 30 L 80 90" class="edge-light"/>
    <path d="M 150 30 L 80 90" class="edge-dark" style="display:none;"/>
    <path d="M 150 30 L 220 90" class="path-light"/>
    <path d="M 150 30 L 220 90" class="path-dark" style="display:none;"/>
    <path d="M 80 130 L 50 170" class="edge-light"/>
    <path d="M 80 130 L 50 170" class="edge-dark" style="display:none;"/>
    <path d="M 80 130 L 110 170" class="path-light"/>
    <path d="M 80 130 L 110 170" class="path-dark" style="display:none;"/>
    <path d="M 220 130 L 190 170" class="edge-light"/>
    <path d="M 220 130 L 190 170" class="edge-dark" style="display:none;"/>
    <path d="M 220 130 L 250 170" class="edge-light"/>
    <path d="M 220 130 L 250 170" class="edge-dark" style="display:none;"/>
    <rect x="130" y="10" width="40" height="40" rx="20" class="node-light"/>
    <rect x="130" y="10" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="150" y="35" text-anchor="middle" font-size="13" class="text-light">10</text>
    <text x="150" y="35" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">10</text>
    <rect x="60" y="90" width="40" height="40" rx="20" class="node-light"/>
    <rect x="60" y="90" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="80" y="115" text-anchor="middle" font-size="13" class="text-light">5</text>
    <text x="80" y="115" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">5</text>
    <rect x="200" y="90" width="40" height="40" rx="20" class="search-light"/>
    <rect x="200" y="90" width="40" height="40" rx="20" class="search-dark" style="display:none;"/>
    <text x="220" y="115" text-anchor="middle" font-size="13" class="text-light">15</text>
    <text x="220" y="115" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">15</text>
    <rect x="30" y="170" width="40" height="40" rx="20" class="node-light"/>
    <rect x="30" y="170" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="50" y="195" text-anchor="middle" font-size="13" class="text-light">3</text>
    <text x="50" y="195" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">3</text>
    <rect x="90" y="170" width="40" height="40" rx="20" class="search-light"/>
    <rect x="90" y="170" width="40" height="40" rx="20" class="search-dark" style="display:none;"/>
    <text x="110" y="195" text-anchor="middle" font-size="13" class="text-light">7</text>
    <text x="110" y="195" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">7</text>
    <rect x="170" y="170" width="40" height="40" rx="20" class="node-light"/>
    <rect x="170" y="170" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="190" y="195" text-anchor="middle" font-size="13" class="text-light">12</text>
    <text x="190" y="195" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">12</text>
    <rect x="230" y="170" width="40" height="40" rx="20" class="node-light"/>
    <rect x="230" y="170" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="250" y="195" text-anchor="middle" font-size="13" class="text-light">18</text>
    <text x="250" y="195" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">18</text>
    <text x="150" y="230" text-anchor="middle" font-size="10" class="subtext-light">Path: 10 → 15 → 7 (found)</text>
    <text x="150" y="230" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Path: 10 → 15 → 7 (found)</text>
  </g>
  <g transform="translate(450, 100)">
    <path d="M 150 30 L 80 90" class="edge-light"/>
    <path d="M 150 30 L 80 90" class="edge-dark" style="display:none;"/>
    <path d="M 150 30 L 220 90" class="edge-light"/>
    <path d="M 150 30 L 220 90" class="edge-dark" style="display:none;"/>
    <path d="M 80 130 L 50 170" class="edge-light"/>
    <path d="M 80 130 L 50 170" class="edge-dark" style="display:none;"/>
    <path d="M 80 130 L 110 170" class="edge-light"/>
    <path d="M 80 130 L 110 170" class="edge-dark" style="display:none;"/>
    <path d="M 220 130 L 190 170" class="edge-light"/>
    <path d="M 220 130 L 190 170" class="edge-dark" style="display:none;"/>
    <path d="M 220 130 L 250 170" class="path-light"/>
    <path d="M 220 130 L 250 170" class="path-dark" style="display:none;"/>
    <path d="M 250 210 L 235 240" class="path-light"/>
    <path d="M 250 210 L 235 240" class="path-dark" style="display:none;"/>
    <rect x="130" y="10" width="40" height="40" rx="20" class="node-light"/>
    <rect x="130" y="10" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="150" y="35" text-anchor="middle" font-size="13" class="text-light">10</text>
    <text x="150" y="35" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">10</text>
    <rect x="60" y="90" width="40" height="40" rx="20" class="node-light"/>
    <rect x="60" y="90" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="80" y="115" text-anchor="middle" font-size="13" class="text-light">5</text>
    <text x="80" y="115" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">5</text>
    <rect x="200" y="90" width="40" height="40" rx="20" class="node-light"/>
    <rect x="200" y="90" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="220" y="115" text-anchor="middle" font-size="13" class="text-light">15</text>
    <text x="220" y="115" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">15</text>
    <rect x="30" y="170" width="40" height="40" rx="20" class="node-light"/>
    <rect x="30" y="170" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="50" y="195" text-anchor="middle" font-size="13" class="text-light">3</text>
    <text x="50" y="195" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">3</text>
    <rect x="90" y="170" width="40" height="40" rx="20" class="node-light"/>
    <rect x="90" y="170" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="110" y="195" text-anchor="middle" font-size="13" class="text-light">7</text>
    <text x="110" y="195" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">7</text>
    <rect x="170" y="170" width="40" height="40" rx="20" class="node-light"/>
    <rect x="170" y="170" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="190" y="195" text-anchor="middle" font-size="13" class="text-light">12</text>
    <text x="190" y="195" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">12</text>
    <rect x="230" y="170" width="40" height="40" rx="20" class="node-light"/>
    <rect x="230" y="170" width="40" height="40" rx="20" class="node-dark" style="display:none;"/>
    <text x="250" y="195" text-anchor="middle" font-size="13" class="text-light">18</text>
    <text x="250" y="195" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">18</text>
    <rect x="220" y="240" width="40" height="40" rx="20" class="insert-light"/>
    <rect x="220" y="240" width="40" height="40" rx="20" class="insert-dark" style="display:none;"/>
    <text x="240" y="265" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">9</text>
    <text x="240" y="265" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">9</text>
    <text x="150" y="300" text-anchor="middle" font-size="10" class="subtext-light">Path: 10 → 15 → 18 → insert 9 as left child of 18</text>
    <text x="150" y="300" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Path: 10 → 15 → 18 → insert 9 as left child of 18</text>
  </g>
  <text x="400" y="335" text-anchor="middle" font-size="11" class="subtext-light">Balanced BST: O(log n) search/insert/delete. Degenerate BST (linked list shape): O(n). Self-balancing trees (AVL, Red-Black) guarantee O(log n).</text>
  <text x="400" y="335" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Balanced BST: O(log n) search/insert/delete. Degenerate BST (linked list shape): O(n). Self-balancing trees (AVL, Red-Black) guarantee O(log n).</text>
</svg>
`;

const avlVsRedBlackSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .panel-light { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 2; }
      .panel-dark { fill: #1e293b; stroke: #475569; stroke-width: 2; }
      .node-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .node-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .edge-light { stroke: #475569; stroke-width: 2; fill: none; }
      .edge-dark { stroke: #94a3b8; stroke-width: 2; fill: none; }
    </style>
  </defs>
  <rect class="bg-light" width="800" height="380" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="380" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">AVL Tree vs. Red-Black Tree — Balancing Trade-offs</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">AVL Tree vs. Red-Black Tree — Balancing Trade-offs</text>
  <text x="200" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">AVL Tree — Strictly Balanced</text>
  <text x="200" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">AVL Tree — Strictly Balanced</text>
  <text x="600" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Red-Black Tree — Approximately Balanced</text>
  <text x="600" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Red-Black Tree — Approximately Balanced</text>
  <g transform="translate(50, 80)">
    <rect x="0" y="0" width="300" height="180" rx="6" class="panel-light"/>
    <rect x="0" y="0" width="300" height="180" rx="6" class="panel-dark" style="display:none;"/>
    <path d="M 150 30 L 80 80" class="edge-light"/>
    <path d="M 150 30 L 80 80" class="edge-dark" style="display:none;"/>
    <path d="M 150 30 L 220 80" class="edge-light"/>
    <path d="M 150 30 L 220 80" class="edge-dark" style="display:none;"/>
    <path d="M 80 120 L 50 160" class="edge-light"/>
    <path d="M 80 120 L 50 160" class="edge-dark" style="display:none;"/>
    <path d="M 80 120 L 110 160" class="edge-light"/>
    <path d="M 80 120 L 110 160" class="edge-dark" style="display:none;"/>
    <path d="M 220 120 L 190 160" class="edge-light"/>
    <path d="M 220 120 L 190 160" class="edge-dark" style="display:none;"/>
    <path d="M 220 120 L 250 160" class="edge-light"/>
    <path d="M 220 120 L 250 160" class="edge-dark" style="display:none;"/>
    <rect x="135" y="15" width="30" height="30" rx="15" class="node-light"/>
    <rect x="135" y="15" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="150" y="35" text-anchor="middle" font-size="12" class="text-light">30</text>
    <text x="150" y="35" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">30</text>
    <rect x="65" y="80" width="30" height="30" rx="15" class="node-light"/>
    <rect x="65" y="80" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="80" y="100" text-anchor="middle" font-size="12" class="text-light">15</text>
    <text x="80" y="100" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">15</text>
    <rect x="205" y="80" width="30" height="30" rx="15" class="node-light"/>
    <rect x="205" y="80" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="220" y="100" text-anchor="middle" font-size="12" class="text-light">45</text>
    <text x="220" y="100" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">45</text>
    <rect x="35" y="160" width="30" height="30" rx="15" class="node-light"/>
    <rect x="35" y="160" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="50" y="180" text-anchor="middle" font-size="12" class="text-light">10</text>
    <text x="50" y="180" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">10</text>
    <rect x="95" y="160" width="30" height="30" rx="15" class="node-light"/>
    <rect x="95" y="160" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="110" y="180" text-anchor="middle" font-size="12" class="text-light">20</text>
    <text x="110" y="180" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">20</text>
    <rect x="175" y="160" width="30" height="30" rx="15" class="node-light"/>
    <rect x="175" y="160" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="190" y="180" text-anchor="middle" font-size="12" class="text-light">35</text>
    <text x="190" y="180" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">35</text>
    <rect x="235" y="160" width="30" height="30" rx="15" class="node-light"/>
    <rect x="235" y="160" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="250" y="180" text-anchor="middle" font-size="12" class="text-light">50</text>
    <text x="250" y="180" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">50</text>
    <text x="150" y="210" text-anchor="middle" font-size="10" class="subtext-light">Balance factor: |left_h - right_h| ≤ 1</text>
    <text x="150" y="210" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Balance factor: |left_h - right_h| ≤ 1</text>
  </g>
  <g transform="translate(450, 80)">
    <rect x="0" y="0" width="300" height="180" rx="6" class="panel-light"/>
    <rect x="0" y="0" width="300" height="180" rx="6" class="panel-dark" style="display:none;"/>
    <path d="M 150 30 L 80 80" class="edge-light"/>
    <path d="M 150 30 L 80 80" class="edge-dark" style="display:none;"/>
    <path d="M 150 30 L 220 80" class="edge-light"/>
    <path d="M 150 30 L 220 80" class="edge-dark" style="display:none;"/>
    <path d="M 80 120 L 50 160" class="edge-light"/>
    <path d="M 80 120 L 50 160" class="edge-dark" style="display:none;"/>
    <path d="M 220 120 L 190 160" class="edge-light"/>
    <path d="M 220 120 L 190 160" class="edge-dark" style="display:none;"/>
    <path d="M 220 120 L 250 160" class="edge-light"/>
    <path d="M 220 120 L 250 160" class="edge-dark" style="display:none;"/>
    <rect x="135" y="15" width="30" height="30" rx="15" class="node-light"/>
    <rect x="135" y="15" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="150" y="35" text-anchor="middle" font-size="12" class="text-light">30</text>
    <text x="150" y="35" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">30</text>
    <rect x="65" y="80" width="30" height="30" rx="15" class="node-light"/>
    <rect x="65" y="80" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="80" y="100" text-anchor="middle" font-size="12" class="text-light">15</text>
    <text x="80" y="100" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">15</text>
    <rect x="205" y="80" width="30" height="30" rx="15" class="node-light"/>
    <rect x="205" y="80" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="220" y="100" text-anchor="middle" font-size="12" class="text-light">45</text>
    <text x="220" y="100" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">45</text>
    <rect x="35" y="160" width="30" height="30" rx="15" class="node-light"/>
    <rect x="35" y="160" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="50" y="180" text-anchor="middle" font-size="12" class="text-light">10</text>
    <text x="50" y="180" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">10</text>
    <rect x="175" y="160" width="30" height="30" rx="15" class="node-light"/>
    <rect x="175" y="160" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="190" y="180" text-anchor="middle" font-size="12" class="text-light">40</text>
    <text x="190" y="180" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">40</text>
    <rect x="235" y="160" width="30" height="30" rx="15" class="node-light"/>
    <rect x="235" y="160" width="30" height="30" rx="15" class="node-dark" style="display:none;"/>
    <text x="250" y="180" text-anchor="middle" font-size="12" class="text-light">50</text>
    <text x="250" y="180" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">50</text>
    <text x="150" y="210" text-anchor="middle" font-size="10" class="subtext-light">Black-height invariant: all paths from node to leaves have same # of black nodes</text>
    <text x="150" y="210" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Black-height invariant: all paths from node to leaves have same # of black nodes</text>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Comparison</text>
  <text x="400" y="300" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Comparison</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-light">AVL: stricter balance → faster lookups (shorter height), more rotations on insert/delete. Best for read-heavy workloads.</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">AVL: stricter balance → faster lookups (shorter height), more rotations on insert/delete. Best for read-heavy workloads.</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-light">Red-Black: looser balance → fewer rotations, slightly taller tree. Best for write-heavy workloads. Used in Linux kernel (rbtree), Java TreeMap, C++ std::map.</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Red-Black: looser balance → fewer rotations, slightly taller tree. Best for write-heavy workloads. Used in Linux kernel (rbtree), Java TreeMap, C++ std::map.</text>
  <text x="400" y="360" text-anchor="middle" font-size="11" class="subtext-light">Both guarantee O(log n) search/insert/delete. AVL height ≤ 1.44 log2(n+2). Red-Black height ≤ 2 log2(n+1).</text>
  <text x="400" y="360" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Both guarantee O(log n) search/insert/delete. AVL height ≤ 1.44 log2(n+2). Red-Black height ≤ 2 log2(n+1).</text>
  <text x="400" y="375" text-anchor="middle" font-size="11" class="subtext-light">Interview choice: "AVL for lookup-heavy, Red-Black for mixed workloads. In practice, Red-Black is more widely used in standard libraries."</text>
  <text x="400" y="375" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Interview choice: "AVL for lookup-heavy, Red-Black for mixed workloads. In practice, Red-Black is more widely used in standard libraries."</text>
</svg>
`;

const btreeStructureSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .node-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .node-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .leaf-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .leaf-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .edge-light { stroke: #475569; stroke-width: 2; fill: none; }
      .edge-dark { stroke: #94a3b8; stroke-width: 2; fill: none; }
      .link-light { stroke: #3b82f6; stroke-width: 1; stroke-dasharray: 4,3; fill: none; }
      .link-dark { stroke: #60a5fa; stroke-width: 1; stroke-dasharray: 4,3; fill: none; }
    </style>
  </defs>
  <rect class="bg-light" width="800" height="360" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="360" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">B-Tree and B+ Tree — Database Index Structure</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">B-Tree and B+ Tree — Database Index Structure</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">High branching factor (100-1000) → shallow height (3-4 levels for billions of keys). Optimized for disk I/O (page-sized nodes).</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">High branching factor (100-1000) → shallow height (3-4 levels for billions of keys). Optimized for disk I/O (page-sized nodes).</text>
  <text x="200" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">B-Tree (order 3)</text>
  <text x="200" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">B-Tree (order 3)</text>
  <text x="600" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">B+ Tree (order 3)</text>
  <text x="600" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">B+ Tree (order 3)</text>
  <g transform="translate(50, 100)">
    <rect x="50" y="0" width="100" height="35" class="node-light"/>
    <rect x="50" y="0" width="100" height="35" class="node-dark" style="display:none;"/>
    <text x="100" y="22" text-anchor="middle" font-size="12" class="text-light">15 | 30</text>
    <text x="100" y="22" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">15 | 30</text>
    <path d="M 70 35 L 30 80" class="edge-light"/>
    <path d="M 70 35 L 30 80" class="edge-dark" style="display:none;"/>
    <path d="M 100 35 L 100 80" class="edge-light"/>
    <path d="M 100 35 L 100 80" class="edge-dark" style="display:none;"/>
    <path d="M 130 35 L 170 80" class="edge-light"/>
    <path d="M 130 35 L 170 80" class="edge-dark" style="display:none;"/>
    <rect x="0" y="80" width="60" height="35" class="node-light"/>
    <rect x="0" y="80" width="60" height="35" class="node-dark" style="display:none;"/>
    <text x="30" y="102" text-anchor="middle" font-size="12" class="text-light">5,10</text>
    <text x="30" y="102" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">5,10</text>
    <rect x="70" y="80" width="60" height="35" class="node-light"/>
    <rect x="70" y="80" width="60" height="35" class="node-dark" style="display:none;"/>
    <text x="100" y="102" text-anchor="middle" font-size="12" class="text-light">20,25</text>
    <text x="100" y="102" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">20,25</text>
    <rect x="140" y="80" width="60" height="35" class="node-light"/>
    <rect x="140" y="80" width="60" height="35" class="node-dark" style="display:none;"/>
    <text x="170" y="102" text-anchor="middle" font-size="12" class="text-light">35,40</text>
    <text x="170" y="102" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">35,40</text>
    <text x="100" y="140" text-anchor="middle" font-size="10" class="subtext-light">Data in internal + leaf nodes</text>
    <text x="100" y="140" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Data in internal + leaf nodes</text>
  </g>
  <g transform="translate(450, 100)">
    <rect x="50" y="0" width="100" height="35" class="node-light"/>
    <rect x="50" y="0" width="100" height="35" class="node-dark" style="display:none;"/>
    <text x="100" y="22" text-anchor="middle" font-size="12" class="text-light">15 | 30</text>
    <text x="100" y="22" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">15 | 30</text>
    <path d="M 70 35 L 30 80" class="edge-light"/>
    <path d="M 70 35 L 30 80" class="edge-dark" style="display:none;"/>
    <path d="M 100 35 L 100 80" class="edge-light"/>
    <path d="M 100 35 L 100 80" class="edge-dark" style="display:none;"/>
    <path d="M 130 35 L 170 80" class="edge-light"/>
    <path d="M 130 35 L 170 80" class="edge-dark" style="display:none;"/>
    <rect x="0" y="80" width="60" height="35" class="leaf-light"/>
    <rect x="0" y="80" width="60" height="35" class="leaf-dark" style="display:none;"/>
    <text x="30" y="102" text-anchor="middle" font-size="12" class="text-light">5,10</text>
    <text x="30" y="102" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">5,10</text>
    <rect x="70" y="80" width="60" height="35" class="leaf-light"/>
    <rect x="70" y="80" width="60" height="35" class="leaf-dark" style="display:none;"/>
    <text x="100" y="102" text-anchor="middle" font-size="12" class="text-light">20,25</text>
    <text x="100" y="102" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">20,25</text>
    <rect x="140" y="80" width="60" height="35" class="leaf-light"/>
    <rect x="140" y="80" width="60" height="35" class="leaf-dark" style="display:none;"/>
    <text x="170" y="102" text-anchor="middle" font-size="12" class="text-light">35,40</text>
    <text x="170" y="102" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">35,40</text>
    <path d="M 60 100 L 70 100" class="link-light"/>
    <path d="M 60 100 L 70 100" class="link-dark" style="display:none;"/>
    <path d="M 130 100 L 140 100" class="link-light"/>
    <path d="M 130 100 L 140 100" class="link-dark" style="display:none;"/>
    <text x="100" y="140" text-anchor="middle" font-size="10" class="subtext-light">Data only in leaves. Leaves linked for range scan.</text>
    <text x="100" y="140" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Data only in leaves. Leaves linked for range scan.</text>
  </g>
  <text x="400" y="280" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Why B+ Trees Dominate Database Indexing</text>
  <text x="400" y="280" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Why B+ Trees Dominate Database Indexing</text>
  <text x="400" y="300" text-anchor="middle" font-size="11" class="subtext-light">1. All data in leaves → uniform lookup cost (every key takes same # of I/O operations)</text>
  <text x="400" y="300" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">1. All data in leaves → uniform lookup cost (every key takes same # of I/O operations)</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-light">2. Linked leaves → efficient range scans (SELECT * WHERE key BETWEEN a AND b) without tree traversal</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">2. Linked leaves → efficient range scans (SELECT * WHERE key BETWEEN a AND b) without tree traversal</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-light">3. Internal nodes are smaller (keys only, no data) → more keys per page → lower tree height → fewer I/O operations</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">3. Internal nodes are smaller (keys only, no data) → more keys per page → lower tree height → fewer I/O operations</text>
  <text x="400" y="355" text-anchor="middle" font-size="11" class="subtext-light">Used by: MySQL (InnoDB), PostgreSQL, Oracle, MongoDB, SQLite. B-Trees (without +) are used in some file systems (NTFS, HFS+).</text>
  <text x="400" y="355" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Used by: MySQL (InnoDB), PostgreSQL, Oracle, MongoDB, SQLite. B-Trees (without +) are used in some file systems (NTFS, HFS+).</text>
</svg>
`;

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>tree</strong> is a hierarchical, non-linear data structure composed of nodes connected by edges, with the defining property that there is exactly one path between any two nodes (i.e., the structure is connected and acyclic). Trees generalize the concept of linked lists by allowing each node to have multiple children rather than a single successor. The most fundamental variant is the <strong>binary tree</strong>, where each node has at most two children — designated as the <em>left</em> child and the <em>right</em> child — which imposes an ordering that enables efficient search, insertion, and deletion.
        </p>
        <p>
          Trees are ubiquitous in computer science because they model hierarchical relationships naturally: file systems (directories and files), organizational charts (manager-employee relationships), DOM trees in web browsers (parent-child element relationships), and abstract syntax trees in compilers (expression hierarchies). For staff and principal engineers, trees extend far beyond the academic binary search tree — B-Trees and B+ Trees form the backbone of every relational database index, Red-Black trees power standard library ordered maps, trie trees enable efficient string prefix matching, and segment trees support range query processing in analytics systems.
        </p>
        <p>
          The critical architectural insight about trees is that their performance is governed by their <strong>height</strong>: operations that traverse from root to leaf (search, insert, delete) take time proportional to the height. A balanced tree with <em>n</em> nodes has height O(log n), enabling efficient operations on large datasets. A degenerate (unbalanced) tree can have height O(n) — effectively becoming a linked list — destroying the performance advantage. Self-balancing trees (AVL, Red-Black, B-Trees) maintain the height invariant through restructuring operations (rotations, splits, merges) after insertions and deletions, ensuring O(log n) worst-case performance.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <h3>Tree Terminology and Structural Properties</h3>
        <p>
          The <strong>root</strong> is the topmost node in the tree — the unique node with no parent. Every other node has exactly one parent, creating a hierarchical parent-child relationship. The <strong>depth</strong> of a node is the number of edges from the root to that node (root has depth 0). The <strong>height</strong> of a node is the number of edges on the longest path from that node to a leaf (leaves have height 0). The height of the tree is the height of the root. The <strong>degree</strong> of a node is the number of children it has. A <strong>leaf</strong> (or external node) has degree 0; an <strong>internal node</strong> has degree greater than 0.
        </p>
        <p>
          For binary trees specifically: the maximum number of nodes at depth <em>d</em> is 2<sup>d</sup>, and the maximum number of nodes in a tree of height <em>h</em> is 2<sup>(h+1)</sup> - 1 (a perfect binary tree). Conversely, the minimum height of a binary tree with <em>n</em> nodes is floor(log₂ n), achieved by a complete binary tree. These bounds define the best-case and worst-case performance envelopes for tree operations.
        </p>

        <h3>Binary Search Trees and the BST Invariant</h3>
        <p>
          A <strong>Binary Search Tree (BST)</strong> is a binary tree that maintains the BST invariant: for every node <em>N</em>, all values in <em>N</em>&apos;s left subtree are less than <em>N</em>&apos;s value, and all values in <em>N</em>&apos;s right subtree are greater than <em>N</em>&apos;s value. This invariant enables efficient search: to find a value <em>k</em>, compare <em>k</em> with the current node; if <em>k</em> is smaller, recurse into the left subtree; if larger, recurse into the right subtree; if equal, the search succeeds. Each comparison eliminates half of the remaining tree (in a balanced tree), giving O(log n) search time.
        </p>
        <p>
          Insertion follows the same search path: traverse the tree as if searching for the value, and when a <code>NULL</code> child pointer is reached, insert the new node at that position. The inserted node is always a leaf. Deletion is more complex and has three cases: deleting a leaf (simply remove it), deleting a node with one child (replace the node with its child), and deleting a node with two children (replace the node&apos;s value with its in-order successor — the minimum value in the right subtree — then delete the successor node, which has at most one child).
        </p>

        <h3>Self-Balancing Trees: AVL and Red-Black Trees</h3>
        <p>
          The BST invariant alone does not guarantee balance. Inserting values in sorted order (1, 2, 3, 4, 5) creates a degenerate tree shaped like a linked list, with height <em>n</em> and O(n) operations. <strong>Self-balancing trees</strong> augment the BST with an additional invariant that constrains the height, and perform restructuring operations (rotations) after insertions and deletions to restore the invariant.
        </p>
        <p>
          <strong>AVL trees</strong> (Adelson-Velsky and Landis, 1962) maintain the balance factor invariant: for every node, the heights of the left and right subtrees differ by at most 1. After insertion or deletion, the tree is rebalanced by performing one or two rotations (single rotation for LL or RR cases, double rotation for LR or RL cases) along the path from the modified node to the root. AVL trees are strictly balanced, providing the shortest possible height among balanced BSTs, which makes lookups extremely fast. However, the strict balance requirement means that insertions and deletions trigger rotations more frequently, making write operations slower.
        </p>
        <p>
          <strong>Red-Black trees</strong> (Guibas and Sedgewick, 1978) maintain a looser balance through a coloring invariant: each node is colored red or black, the root is black, no red node has a red child (no two consecutive red nodes on any path), and every path from a node to its descendant leaves contains the same number of black nodes (the black-height invariant). This ensures that the longest path from root to leaf is at most twice the shortest path, guaranteeing height ≤ 2 log₂(n + 1). Red-Black trees require fewer rotations on average than AVL trees, making them faster for write-heavy workloads. They are used in the Linux kernel (<code>rbtree</code>), Java&apos;s <code>TreeMap</code> and <code>TreeSet</code>, C++&apos;s <code>std::map</code> and <code>std::set</code>, and many other standard library implementations.
        </p>

        <h3>B-Trees and B+ Trees for Database Indexing</h3>
        <p>
          <strong>B-Trees</strong> (Bayer and McCreight, 1972) are multi-way search trees designed for disk-based storage. Unlike binary trees where each node has at most 2 children, B-Tree nodes can have hundreds or thousands of children (the <strong>branching factor</strong> or <strong>order</strong> of the tree). Each node is sized to match the disk page size (typically 4-16 KB), so reading a node from disk requires exactly one I/O operation. The high branching factor ensures that even for billions of keys, the tree height is only 3-4 levels, meaning any lookup requires only 3-4 disk I/O operations.
        </p>
        <p>
          <strong>B+ Trees</strong> are a variant where all data (or data pointers) are stored exclusively in leaf nodes, internal nodes store only keys for routing, and leaf nodes are linked together in a doubly linked list. This design provides three advantages for database workloads: uniform lookup cost (every key requires traversing to a leaf), efficient range scans (traverse the linked leaves rather than performing repeated tree traversals), and smaller internal nodes (more keys per page, reducing tree height). B+ Trees are the dominant index structure in relational databases: MySQL InnoDB, PostgreSQL, Oracle, MongoDB, and SQLite all use B+ Trees as their primary index type.
        </p>

        <ArticleImage svgContent={binaryTreeStructureSVG} caption="Binary tree structure showing root node, internal nodes, and leaf nodes with height and depth annotations" />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Tree Traversal Algorithms</h3>
        <p>
          Tree traversal visits every node in a specific order. There are four fundamental traversal strategies, each with distinct use cases. <strong>Inorder traversal</strong> (left, root, right) visits nodes of a BST in sorted ascending order — this is the defining property that makes BSTs useful for ordered data. <strong>Preorder traversal</strong> (root, left, right) visits the root before its subtrees, producing a copy-friendly ordering that can reconstruct the tree structure (used in serialization). <strong>Postorder traversal</strong> (left, right, root) visits children before the parent, which is essential for deletion (delete subtrees before the parent) and expression tree evaluation (evaluate operands before operators). <strong>Level-order traversal</strong> (breadth-first) visits nodes level by level from left to right, using a queue to track the frontier — this is used in breadth-first search, tree serialization, and finding the shortest path in unweighted trees.
        </p>
        <p>
          All four traversals run in O(n) time (each node is visited exactly once) and O(h) space for recursive traversals (call stack depth equals tree height) or O(w) space for level-order traversal (queue size equals maximum width of the tree). For balanced trees, h = O(log n) and w = O(n/2) at the widest level; for degenerate trees, h = O(n) and w = O(1).
        </p>

        <h3>Self-Balancing Mechanisms</h3>
        <p>
          AVL tree rebalancing uses four rotation patterns triggered when a node&apos;s balance factor becomes +2 or -2 after insertion or deletion. A <strong>right rotation</strong> (LL case) is performed when the left child&apos;s left subtree is heavier; a <strong>left rotation</strong> (RR case) when the right child&apos;s right subtree is heavier; a <strong>left-right rotation</strong> (LR case) when the left child&apos;s right subtree is heavier (left rotate the left child, then right rotate the node); and a <strong>right-left rotation</strong> (RL case) when the right child&apos;s left subtree is heavier (right rotate the right child, then left rotate the node). Each rotation is O(1) — a constant number of pointer reassignments — and at most O(log n) nodes on the insertion/deletion path need their balance factors updated, giving O(log n) total rebalancing cost.
        </p>
        <p>
          Red-Black tree rebalancing uses recoloring and rotations. After insertion, the new node is colored red (to preserve the black-height invariant). If the parent is also red (violating the no-consecutive-red rule), the tree is rebalanced by examining the uncle node: if the uncle is red, recolor the parent and uncle to black and the grandparent to red (propagating the violation upward); if the uncle is black, perform the appropriate rotation (LL, RR, LR, or RL) and recolor. After deletion, the rebalancing is more complex because removing a black node reduces the black-height of its subtree, requiring a cascade of recoloring and rotations up to the root. Despite this complexity, the amortized cost of rebalancing is O(1) per operation — most insertions and deletions require only constant work, and expensive rebalancing is rare.
        </p>

        <ArticleImage svgContent={bstOperationsSVG} caption="Binary Search Tree search and insert operations showing the comparison-based path from root to insertion point" />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <h3>AVL versus Red-Black Trees</h3>
        <p>
          The choice between AVL and Red-Black trees is a classic read-versus-write trade-off. AVL trees are more strictly balanced (height ≤ 1.44 log₂(n+2) vs. ≤ 2 log₂(n+1) for Red-Black), giving faster lookups — roughly 5-15% faster for large datasets. However, AVL trees require more frequent rebalancing: an insertion may trigger O(log n) balance factor updates and up to 2 rotations, while a Red-Black tree insertion requires at most 2 rotations and O(1) recoloring on average. For write-heavy workloads (frequent insertions and deletions), Red-Black trees are the better choice. For read-heavy workloads (frequent lookups, rare mutations), AVL trees provide superior lookup performance.
        </p>
        <p>
          In practice, Red-Black trees are far more widely used in production systems because most workloads are mixed (reads and writes) and the standard library implementations of choice (Linux kernel, Java, C++) have standardized on Red-Black. The marginal lookup speed advantage of AVL is rarely worth the implementation complexity and write performance penalty.
        </p>

        <h3>Trees versus Hash Tables</h3>
        <p>
          When the primary operation is key-based lookup, hash tables provide O(1) average-time access compared to O(log n) for balanced trees. However, trees provide ordered iteration (inorder traversal yields sorted keys), range queries (find all keys between k1 and k2), and order-statistic operations (find the k-th smallest key, find the rank of a key) that hash tables cannot support efficiently. Trees also have deterministic O(log n) worst-case performance, while hash tables have O(n) worst-case (when all keys collide into the same bucket, though this is extremely unlikely with a good hash function).
        </p>
        <p>
          The choice is dictated by the access pattern: use hash tables for unordered key-value storage with point lookups; use trees when ordering, range queries, or worst-case guarantees are needed. Many production systems use both: a hash table for O(1) point lookups and a tree for ordered iteration and range queries (e.g., database indexes use B+ Trees for both point lookups and range scans).
        </p>

        <ArticleImage svgContent={avlVsRedBlackSVG} caption="AVL tree versus Red-Black tree comparison showing balancing strategies and use case trade-offs" />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use balanced binary search trees (Red-Black or AVL) for in-memory ordered data with frequent lookups, insertions, and deletions. Choose Red-Black trees for write-heavy workloads and when using standard library implementations (std::map, TreeMap); choose AVL trees for read-heavy workloads where lookup latency is the primary concern. Avoid unbalanced BSTs in production — the O(n) worst-case for degenerate trees is a reliability risk that is easily eliminated by using a self-balancing variant.
        </p>
        <p>
          Use B+ Trees for disk-based storage and database indexing. The high branching factor (typically 100-1000 for 4-16 KB pages) minimizes tree height, reducing the number of expensive disk I/O operations per lookup. B+ Trees are the default index type in virtually every relational database, and understanding their structure is essential for database performance tuning: index selectivity, covering indexes, index-only scans, and range scan efficiency are all determined by B+ Tree properties.
        </p>
        <p>
          For range query workloads on ordered data (e.g., &quot;find all users with age between 25 and 35&quot;), B+ Trees are optimal because the linked leaf nodes enable a single sequential scan of the relevant range. In contrast, a hash table would require a full table scan, and a BST would require an inorder traversal with pruning. The B+ Tree range scan reads each relevant leaf page exactly once, achieving optimal I/O efficiency.
        </p>
        <p>
          For prefix matching on strings (autocomplete, IP routing, dictionary lookups), use <strong>tries</strong> (prefix trees) rather than BSTs or hash tables. A trie stores strings character by character along paths from root to leaf, enabling O(m) prefix search where m is the prefix length — independent of the number of stored strings. Hash tables require O(m) hash computation plus O(1) lookup but cannot efficiently answer &quot;all strings starting with prefix P&quot; queries; tries support both point lookup and prefix enumeration naturally.
        </p>
        <p>
          When implementing trees in garbage-collected languages, be aware that deep trees create deep reference chains that can delay garbage collection. When a subtree is no longer needed, setting the root reference to <code>null</code> allows the entire subtree to be reclaimed, but the GC may not immediately collect it if other references exist. For very large trees, consider using array-based representations (heap-indexed complete binary trees) to improve cache locality and reduce GC pressure.
        </p>

        <ArticleImage svgContent={btreeStructureSVG} caption="B-Tree and B+ Tree node structure showing why B+ Trees dominate database indexing" />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most critical pitfall is <strong>using an unbalanced BST in production</strong>. Inserting sorted or nearly-sorted data creates a degenerate tree with O(n) height, destroying performance guarantees. This commonly occurs when using a BST as a set or map implementation without self-balancing — a mistake that passes unit tests with small random inputs but fails catastrophically in production with large sorted or partially-sorted datasets. Always use a self-balancing tree (Red-Black or AVL) or a library-provided ordered map/set implementation.
        </p>
        <p>
          <strong>Stack overflow in recursive traversals</strong> occurs when traversing very deep trees (degenerate trees with O(n) height) using recursive algorithms. The call stack depth equals the tree height, and for a million-node degenerate tree, the recursion exceeds the default stack size limit (typically 1-8 MB), causing a stack overflow. Use iterative traversal with an explicit stack (for preorder/inorder/postorder) or a queue (for level-order) to avoid this risk. This is particularly important for tree processing in production systems where input data shapes are not controlled.
        </p>
        <p>
          <strong>Incorrect deletion in BSTs</strong> is a common implementation error. The two-children case (deleting a node with both left and right children) requires replacing the node&apos;s value with its in-order successor (minimum in the right subtree) or in-order predecessor (maximum in the left subtree), then deleting the successor/predecessor. A common mistake is to attempt to directly restructure the subtree rather than using the value-replacement approach, leading to complex and buggy code. The value-replacement approach reduces the two-children case to the simpler one-child or zero-child case, keeping the implementation clean and correct.
        </p>
        <p>
          <strong>B-Tree page size mismatch</strong> occurs when the B-Tree node size does not align with the disk page size. If a B-Tree node is smaller than the page size, each node read wastes I/O bandwidth (reading unused page space). If a node is larger than the page size, a single node read requires multiple I/O operations, increasing lookup cost. The optimal B-Tree node size matches the filesystem page size (typically 4 KB or 16 KB), ensuring that each tree level traversal requires exactly one I/O operation.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Database indexes</strong> are the most impactful real-world use of trees. Every relational database uses B+ Trees as the primary index structure: MySQL InnoDB stores the entire table as a B+ Tree clustered on the primary key (the &quot;clustered index&quot;), and secondary indexes are separate B+ Trees mapping indexed column values to primary key values. PostgreSQL uses B+ Trees for its default index type, supporting equality and range queries efficiently. Understanding B+ Tree structure is essential for database performance: a covering index (where all columns needed by the query are present in the index) avoids table lookups entirely, and an index-only scan reads only the B+ Tree leaf pages without accessing the table data.
        </p>
        <p>
          <strong>Standard library ordered maps and sets</strong> use Red-Black trees: C++ <code>std::map</code> and <code>std::set</code>, Java <code>TreeMap</code> and <code>TreeSet</code>, Go <code>container/list</code> (augmented), and Rust <code>BTreeMap</code> (a B-Tree variant). These provide ordered iteration, range queries, and order-statistic operations that hash-based alternatives cannot support. The choice of Red-Black trees reflects the mixed read-write workload typical of general-purpose programming.
        </p>
        <p>
          <strong>File systems</strong> use tree structures extensively. The Linux VFS (Virtual File System) uses a dentry cache organized as a tree (dentry cache tree) for fast pathname resolution. NTFS uses B+ Trees for its Master File Table (MFT), and HFS+ uses B-Trees for its catalog file. The tree structure enables efficient directory traversal, file lookup, and range scans (listing directory contents) with predictable I/O patterns.
        </p>
        <p>
          <strong>Compilers and interpreters</strong> use abstract syntax trees (ASTs) to represent the syntactic structure of source code. The AST is a tree where internal nodes represent operators or control structures and leaf nodes represent operands (variables, literals). The tree structure enables recursive descent evaluation, optimization passes (constant folding, dead code elimination via tree transformation), and code generation (tree traversal produces target instructions). The tree shape reflects the grammar of the language — expression trees are binary (binary operators have two children), and statement trees are multi-way (blocks have multiple child statements).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <h3>1. How would you serialize and deserialize a binary tree? Discuss multiple approaches and their trade-offs.</h3>
        <p>
          Serializing a binary tree means converting it into a linear representation (string, byte array) that can be stored or transmitted, and deserializing means reconstructing the exact same tree from that representation. The challenge is that a linear representation must capture both the node values and the tree structure (which node is the left child of which, which positions are null).
        </p>
        <p>
          The <strong>preorder with null markers</strong> approach is the most common: traverse the tree in preorder, outputting each node&apos;s value, and outputting a special marker (e.g., &quot;#&quot; or &quot;null&quot;) for null children. For the tree with root 1, left child 2, right child 3, where 2 has left child 4 and no right child, the serialization is &quot;1,2,4,#,#,#,3,#,#&quot;. Deserialization reads values in preorder: create the root, recursively create the left subtree, then the right subtree; when a null marker is read, return null. This approach is O(n) time and O(n) space (for the serialization string and the recursion stack).
        </p>
        <p>
          The <strong>level-order (BFS) serialization</strong> approach outputs nodes level by level, including null markers for missing children. For the same tree: &quot;1,2,3,4,#,#,#&quot;. Deserialization uses a queue: create the root, enqueue it, then dequeue a node, read two values from the serialization for its left and right children, create them (or null), enqueue non-null children, and repeat. This approach is also O(n) time and O(n) space, but it produces a more compact representation for wide trees (fewer null markers) and is more intuitive for human readers.
        </p>
        <p>
          A <strong>space-optimized approach</strong> for BSTs uses the fact that inorder traversal of a BST yields sorted values. Storing only the preorder traversal (without null markers) is sufficient: the preorder gives the root-first ordering, and the sorted inorder (derived by sorting the preorder values) allows reconstructing the tree by identifying the root (first preorder value), partitioning the inorder into left and right subtrees, and recursively building. This approach saves space (no null markers) but only works for BSTs.
        </p>

        <h3>2. How would you find the lowest common ancestor (LCA) of two nodes in a BST? Extend to a general binary tree.</h3>
        <p>
          For a BST, the LCA of nodes p and q exploits the BST invariant. Starting from the root, if both p and q are less than the root, the LCA is in the left subtree; if both are greater, the LCA is in the right subtree; if one is less and one is greater (or one equals the root), the current root is the LCA (it is the deepest node that is an ancestor of both). This runs in O(h) time where h is the tree height, and O(1) space iteratively or O(h) space recursively.
        </p>
        <p>
          For a general binary tree (no BST invariant), the LCA requires a different approach. The recursive solution: if the current node is null, return null; if the current node is p or q, return the current node; recursively search the left and right subtrees. If both recursive calls return non-null, the current node is the LCA (p is in one subtree and q is in the other). If only one returns non-null, return that result (both p and q are in the same subtree). If both return null, return null (neither p nor q is in this subtree). This runs in O(n) time (visiting every node in the worst case) and O(h) space (recursion stack).
        </p>
        <p>
          An iterative approach for general binary trees uses parent pointers: traverse from p to the root, recording the path; then traverse from q to the root, and the first node on q&apos;s path that appears in p&apos;s path is the LCA. This runs in O(h) time and O(h) space (for storing the paths). If parent pointers are not available, a postorder traversal with path tracking achieves the same result.
        </p>

        <h3>3. What is the difference between a B-Tree and a B+ Tree? Why do databases prefer B+ Trees?</h3>
        <p>
          In a B-Tree, data (key-value pairs) can be stored in both internal nodes and leaf nodes. In a B+ Tree, data is stored exclusively in leaf nodes; internal nodes store only keys for routing searches. Additionally, B+ Tree leaf nodes are linked together in a doubly linked list, while B-Tree leaves are not linked.
        </p>
        <p>
          Databases prefer B+ Trees for three reasons. First, <strong>uniform lookup cost</strong>: in a B-Tree, a key might be found at any level (root, internal node, or leaf), so lookup times vary; in a B+ Tree, every key is found at a leaf, so every lookup traverses the same number of levels, providing predictable performance. Second, <strong>efficient range scans</strong>: in a B+ Tree, a range query (e.g., SELECT * WHERE key BETWEEN 100 AND 200) starts at the leaf containing 100 and follows the leaf links sequentially until reaching 200, requiring exactly one I/O per leaf page in the range. In a B-Tree, a range scan requires an inorder traversal of a subtree, which involves jumping between internal nodes and leaves — a less sequential, more I/O-intensive pattern.
        </p>
        <p>
          Third, <strong>higher fan-out</strong>: B+ Tree internal nodes store only keys (no data pointers), so more keys fit in each page, increasing the branching factor and reducing tree height. A B+ Tree of order 100 (100 children per internal node) can store 100³ = 1,000,000 keys in just 3 levels, while a B-Tree of the same order storing data in internal nodes might have fewer keys per internal node (because space is shared between keys and data), increasing height. Lower height means fewer I/O operations per lookup.
        </p>

        <h3>4. How would you implement an iterator for a BST that returns values in sorted order with O(1) amortized time and O(h) space?</h3>
        <p>
          A BST iterator that yields values in inorder (sorted) order can be implemented using an explicit stack that simulates the recursive inorder traversal lazily. The constructor pushes all left descendants of the root onto the stack (from root down to the leftmost leaf). The <code>hasNext()</code> method checks if the stack is non-empty. The <code>next()</code> method pops the top node (the next inorder element), and if that node has a right child, pushes all left descendants of the right child onto the stack.
        </p>
        <p>
          The correctness follows from the inorder traversal pattern: visit left subtree, then root, then right subtree. The stack maintains the &quot;path to the next node to visit&quot; — the top of the stack is always the next inorder node. When a node is popped, its right subtree becomes the next subtree to traverse, and pushing all left descendants of the right subtree positions the stack correctly for the next call.
        </p>
        <p>
          The space complexity is O(h) because the stack contains at most h nodes (the path from root to the current node). The amortized time complexity of <code>next()</code> is O(1) because each node is pushed onto the stack exactly once (during initialization or during a <code>next()</code> call) and popped exactly once, so the total work for n calls to <code>next()</code> is O(n), giving O(1) amortized per call. The worst-case time for a single <code>next()</code> call is O(h) (when a node has a deep right subtree), but this is rare — most calls are O(1) because most nodes do not have right children.
        </p>

        <h3>5. How would you convert a sorted array into a height-balanced BST? What is the time and space complexity?</h3>
        <p>
          A sorted array can be converted into a height-balanced BST by recursively choosing the middle element as the root, the middle of the left half as the left child, and the middle of the right half as the right child. The algorithm: given a subarray from index <em>left</em> to <em>right</em>, compute <em>mid = (left + right) / 2</em>, create a node with value <em>arr[mid]</em>, recursively build the left subtree from <em>arr[left...mid-1]</em>, and recursively build the right subtree from <em>arr[mid+1...right]</em>. The base case is <em>left &gt; right</em>, which returns null.
        </p>
        <p>
          The resulting tree is height-balanced because at each step, the left and right subarrays differ in size by at most 1 (because we choose the middle element), so the left and right subtrees differ in height by at most 1. The height of the resulting tree is O(log n), and the tree satisfies the BST invariant because the array is sorted (all elements in the left subarray are less than the middle element, and all elements in the right subarray are greater).
        </p>
        <p>
          The time complexity is O(n) because each element is visited exactly once (creating one node per element). The space complexity is O(log n) for the recursion stack (balanced tree height) plus O(n) for the output tree structure. If the output tree is not counted, the auxiliary space is O(log n) for the recursion stack.
        </p>

        <h3>6. What is a segment tree and when would you use it in a production system?</h3>
        <p>
          A <strong>segment tree</strong> is a binary tree that stores information about intervals (segments) of an array. The root represents the entire array range [0, n-1], and each internal node represents the union of its children&apos;s ranges. Leaf nodes represent individual array elements. Each node stores an aggregate value (sum, minimum, maximum, GCD, etc.) of the elements in its range. The segment tree enables efficient range queries and point updates in O(log n) time.
        </p>
        <p>
          In production systems, segment trees are used for real-time analytics dashboards that need to answer range aggregate queries on time-series data (e.g., &quot;what was the average response time between 2 PM and 4 PM?&quot;). A segment tree storing range sums enables answering any range sum query in O(log n) time, and updating a single element (e.g., adding a new data point) in O(log n) time. This is far more efficient than recomputing the aggregate from scratch (O(n) per query) or maintaining a prefix sum array (O(1) query but O(n) update).
        </p>
        <p>
          Segment trees are also used in computational geometry (range intersection queries), database query optimization (histogram maintenance for query planning), and gaming (leaderboard rank computation with a segment tree storing player counts at each score value). The key advantage of segment trees over simpler approaches is that they support both efficient range queries and efficient updates simultaneously — a trade-off that prefix sums (fast queries, slow updates) and raw arrays (slow queries, fast updates) cannot achieve.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li>Knuth, D.E. — &quot;The Art of Computer Programming, Volume 3: Sorting and Searching&quot; — Addison-Wesley, 2nd Edition, Chapters 5-6</li>
          <li>Cormen, T.H., Leiserson, C.E., Rivest, R.L., Stein, C. — &quot;Introduction to Algorithms&quot; — MIT Press, 4th Edition, Chapters 12-14 (BSTs, AVL, Red-Black Trees)</li>
          <li>Bayer, R., McCreight, E. — &quot;Organization and Maintenance of Large Ordered Indices&quot; — Acta Informatica, Vol. 1, 1972 (B-Tree introduction)</li>
          <li>Comer, D.E. — &quot;The Ubiquitous B-Tree&quot; — ACM Computing Surveys, Vol. 11, No. 2, 1979</li>
          <li>Guibas, L.J., Sedgewick, R. — &quot;A Dichromatic Framework for Balanced Trees&quot; — FOCS 1978 (Red-Black Trees)</li>
          <li>Graefe, G. — &quot;Modern B-Tree Techniques&quot; — Foundations and Trends in Databases, Vol. 3, No. 4, 2011</li>
          <li>Silberschatz, A., Korth, H.F., Sudarshan, S. — &quot;Database System Concepts&quot; — McGraw-Hill, 7th Edition, Chapter 11 (Indexing and Hashing)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

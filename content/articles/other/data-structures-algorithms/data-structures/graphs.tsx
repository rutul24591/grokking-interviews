"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-data-structures-graphs",
  title: "Graphs",
  description:
    "Comprehensive guide to graph data structures: representations (adjacency matrix, adjacency list), traversals (BFS, DFS), shortest path algorithms, minimum spanning trees, and production-scale trade-offs for staff and principal engineer interviews.",
  category: "other",
  subcategory: "data-structures-algorithms/data-structures",
  slug: "graphs",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-14",
  tags: ["data-structures", "graphs", "adjacency-matrix", "adjacency-list"],
  relatedTopics: ["trees", "hash-tables", "arrays"],
};

const graphTypesSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .node-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .node-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .edge-light { stroke: #475569; stroke-width: 2; fill: none; }
      .edge-dark { stroke: #94a3b8; stroke-width: 2; fill: none; }
      .arrow-light { stroke: #475569; stroke-width: 2; fill: none; marker-end: url(#arrow-light); }
      .arrow-dark { stroke: #94a3b8; stroke-width: 2; fill: none; marker-end: url(#arrow-dark); }
      .wedge-light { stroke: #dc2626; stroke-width: 2; fill: none; }
      .wedge-dark { stroke: #f87171; stroke-width: 2; fill: none; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
    </style>
    <marker id="arrow-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#475569"/>
    </marker>
    <marker id="arrow-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="360" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="360" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Graph Types — Undirected, Directed, and Weighted</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Graph Types — Undirected, Directed, and Weighted</text>
  <text x="170" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Undirected Graph</text>
  <text x="170" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Undirected Graph</text>
  <text x="400" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Directed Graph (Digraph)</text>
  <text x="400" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Directed Graph (Digraph)</text>
  <text x="630" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Weighted Graph</text>
  <text x="630" y="65" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Weighted Graph</text>
  <g transform="translate(50, 90)">
    <circle cx="60" cy="40" r="20" class="node-light"/>
    <circle cx="60" cy="40" r="20" class="node-dark" style="display:none;"/>
    <text x="60" y="45" text-anchor="middle" font-size="13" class="text-light">A</text>
    <text x="60" y="45" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">A</text>
    <circle cx="180" cy="40" r="20" class="node-light"/>
    <circle cx="180" cy="40" r="20" class="node-dark" style="display:none;"/>
    <text x="180" y="45" text-anchor="middle" font-size="13" class="text-light">B</text>
    <text x="180" y="45" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">B</text>
    <circle cx="120" cy="140" r="20" class="node-light"/>
    <circle cx="120" cy="140" r="20" class="node-dark" style="display:none;"/>
    <text x="120" y="145" text-anchor="middle" font-size="13" class="text-light">C</text>
    <text x="120" y="145" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">C</text>
    <circle cx="240" cy="140" r="20" class="node-light"/>
    <circle cx="240" cy="140" r="20" class="node-dark" style="display:none;"/>
    <text x="240" y="145" text-anchor="middle" font-size="13" class="text-light">D</text>
    <text x="240" y="145" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">D</text>
    <line x1="78" y1="50" x2="162" y2="50" class="edge-light"/>
    <line x1="78" y1="50" x2="162" y2="50" class="edge-dark" style="display:none;"/>
    <line x1="68" y1="58" x2="112" y2="122" class="edge-light"/>
    <line x1="68" y1="58" x2="112" y2="122" class="edge-dark" style="display:none;"/>
    <line x1="172" y1="58" x2="128" y2="122" class="edge-light"/>
    <line x1="172" y1="58" x2="128" y2="122" class="edge-dark" style="display:none;"/>
    <line x1="180" y1="60" x2="230" y2="122" class="edge-light"/>
    <line x1="180" y1="60" x2="230" y2="122" class="edge-dark" style="display:none;"/>
    <line x1="140" y1="140" x2="220" y2="140" class="edge-light"/>
    <line x1="140" y1="140" x2="220" y2="140" class="edge-dark" style="display:none;"/>
    <text x="120" y="185" text-anchor="middle" font-size="10" class="subtext-light">E = {(A,B), (A,C), (B,C), (B,D), (C,D)}</text>
    <text x="120" y="185" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">E = {(A,B), (A,C), (B,C), (B,D), (C,D)}</text>
    <text x="120" y="205" text-anchor="middle" font-size="10" class="subtext-light">Edges are unordered pairs. A-B = B-A.</text>
    <text x="120" y="205" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Edges are unordered pairs. A-B = B-A.</text>
  </g>
  <g transform="translate(280, 90)">
    <circle cx="60" cy="40" r="20" class="node-light"/>
    <circle cx="60" cy="40" r="20" class="node-dark" style="display:none;"/>
    <text x="60" y="45" text-anchor="middle" font-size="13" class="text-light">A</text>
    <text x="60" y="45" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">A</text>
    <circle cx="180" cy="40" r="20" class="node-light"/>
    <circle cx="180" cy="40" r="20" class="node-dark" style="display:none;"/>
    <text x="180" y="45" text-anchor="middle" font-size="13" class="text-light">B</text>
    <text x="180" y="45" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">B</text>
    <circle cx="120" cy="140" r="20" class="node-light"/>
    <circle cx="120" cy="140" r="20" class="node-dark" style="display:none;"/>
    <text x="120" y="145" text-anchor="middle" font-size="13" class="text-light">C</text>
    <text x="120" y="145" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">C</text>
    <circle cx="240" cy="140" r="20" class="node-light"/>
    <circle cx="240" cy="140" r="20" class="node-dark" style="display:none;"/>
    <text x="240" y="145" text-anchor="middle" font-size="13" class="text-light">D</text>
    <text x="240" y="145" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">D</text>
    <path d="M 78 45 L 162 45" class="arrow-light"/>
    <path d="M 78 45 L 162 45" class="arrow-dark" style="display:none;"/>
    <path d="M 162 55 L 78 55" class="arrow-light"/>
    <path d="M 162 55 L 78 55" class="arrow-dark" style="display:none;"/>
    <path d="M 68 58 L 112 122" class="arrow-light"/>
    <path d="M 68 58 L 112 122" class="arrow-dark" style="display:none;"/>
    <path d="M 172 58 L 128 122" class="arrow-light"/>
    <path d="M 172 58 L 128 122" class="arrow-dark" style="display:none;"/>
    <path d="M 180 60 L 230 122" class="arrow-light"/>
    <path d="M 180 60 L 230 122" class="arrow-dark" style="display:none;"/>
    <path d="M 220 140 L 140 140" class="arrow-light"/>
    <path d="M 220 140 L 140 140" class="arrow-dark" style="display:none;"/>
    <text x="120" y="185" text-anchor="middle" font-size="10" class="subtext-light">E = {(A,B), (A,C), (B,C), (B,D), (D,C)}</text>
    <text x="120" y="185" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">E = {(A,B), (A,C), (B,C), (B,D), (D,C)}</text>
    <text x="120" y="205" text-anchor="middle" font-size="10" class="subtext-light">Edges are ordered pairs. A-B != B-A.</text>
    <text x="120" y="205" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Edges are ordered pairs. A-B != B-A.</text>
  </g>
  <g transform="translate(510, 90)">
    <circle cx="60" cy="40" r="20" class="node-light"/>
    <circle cx="60" cy="40" r="20" class="node-dark" style="display:none;"/>
    <text x="60" y="45" text-anchor="middle" font-size="13" class="text-light">A</text>
    <text x="60" y="45" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">A</text>
    <circle cx="180" cy="40" r="20" class="node-light"/>
    <circle cx="180" cy="40" r="20" class="node-dark" style="display:none;"/>
    <text x="180" y="45" text-anchor="middle" font-size="13" class="text-light">B</text>
    <text x="180" y="45" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">B</text>
    <circle cx="120" cy="140" r="20" class="node-light"/>
    <circle cx="120" cy="140" r="20" class="node-dark" style="display:none;"/>
    <text x="120" y="145" text-anchor="middle" font-size="13" class="text-light">C</text>
    <text x="120" y="145" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">C</text>
    <circle cx="240" cy="140" r="20" class="node-light"/>
    <circle cx="240" cy="140" r="20" class="node-dark" style="display:none;"/>
    <text x="240" y="145" text-anchor="middle" font-size="13" class="text-light">D</text>
    <text x="240" y="145" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">D</text>
    <line x1="78" y1="50" x2="162" y2="50" class="wedge-light"/>
    <line x1="78" y1="50" x2="162" y2="50" class="wedge-dark" style="display:none;"/>
    <text x="120" y="38" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">3</text>
    <text x="120" y="38" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">3</text>
    <line x1="68" y1="58" x2="112" y2="122" class="wedge-light"/>
    <line x1="68" y1="58" x2="112" y2="122" class="wedge-dark" style="display:none;"/>
    <text x="82" y="100" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">1</text>
    <text x="82" y="100" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <line x1="172" y1="58" x2="128" y2="122" class="wedge-light"/>
    <line x1="172" y1="58" x2="128" y2="122" class="wedge-dark" style="display:none;"/>
    <text x="158" y="100" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">4</text>
    <text x="158" y="100" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">4</text>
    <line x1="180" y1="60" x2="230" y2="122" class="wedge-light"/>
    <line x1="180" y1="60" x2="230" y2="122" class="wedge-dark" style="display:none;"/>
    <text x="215" y="100" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">2</text>
    <text x="215" y="100" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">2</text>
    <line x1="140" y1="140" x2="220" y2="140" class="wedge-light"/>
    <line x1="140" y1="140" x2="220" y2="140" class="wedge-dark" style="display:none;"/>
    <text x="180" y="155" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">5</text>
    <text x="180" y="155" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">5</text>
    <text x="120" y="185" text-anchor="middle" font-size="10" class="subtext-light">Each edge has a weight (cost, distance).</text>
    <text x="120" y="185" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Each edge has a weight (cost, distance).</text>
    <text x="120" y="205" text-anchor="middle" font-size="10" class="subtext-light">Shortest path: minimize sum of weights.</text>
    <text x="120" y="205" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Shortest path: minimize sum of weights.</text>
  </g>
  <text x="400" y="330" text-anchor="middle" font-size="11" class="subtext-light">V = vertices (nodes) | E = edges (connections) | |V| = n vertices, |E| = m edges</text>
  <text x="400" y="330" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">V = vertices (nodes) | E = edges (connections) | |V| = n vertices, |E| = m edges</text>
  <text x="400" y="350" text-anchor="middle" font-size="11" class="subtext-light">Dense graph: m = O(n^2) | Sparse graph: m = O(n) | Most real-world graphs are sparse (social networks, road networks, web graphs).</text>
  <text x="400" y="350" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Dense graph: m = O(n^2) | Sparse graph: m = O(n) | Most real-world graphs are sparse (social networks, road networks, web graphs).</text>
</svg>
`;

const adjacencyRepresentationSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .cell-light { fill: #e2e8f0; stroke: #475569; stroke-width: 1; }
      .cell-dark { fill: #334155; stroke: #94a3b8; stroke-width: 1; }
      .filled-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 1; }
      .filled-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 1; }
      .list-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 1; }
      .list-dark { fill: #14532d; stroke: #4ade80; stroke-width: 1; }
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
  <rect class="bg-light" width="800" height="380" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="380" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Graph Representations — Adjacency Matrix vs. Adjacency List</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Graph Representations — Adjacency Matrix vs. Adjacency List</text>
  <text x="200" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Adjacency Matrix — O(1) edge lookup</text>
  <text x="200" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Adjacency Matrix — O(1) edge lookup</text>
  <text x="600" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Adjacency List — O(degree) neighbor iteration</text>
  <text x="600" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Adjacency List — O(degree) neighbor iteration</text>
  <g transform="translate(60, 80)">
    <rect x="40" y="0" width="40" height="40" class="cell-light"/>
    <rect x="40" y="0" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="60" y="25" text-anchor="middle" font-size="12" class="text-light">A</text>
    <text x="60" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A</text>
    <rect x="80" y="0" width="40" height="40" class="cell-light"/>
    <rect x="80" y="0" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="100" y="25" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="100" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <rect x="120" y="0" width="40" height="40" class="cell-light"/>
    <rect x="120" y="0" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="140" y="25" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="140" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <rect x="160" y="0" width="40" height="40" class="cell-light"/>
    <rect x="160" y="0" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="180" y="25" text-anchor="middle" font-size="12" class="text-light">D</text>
    <text x="180" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">D</text>
    <rect x="0" y="40" width="40" height="40" class="cell-light"/>
    <rect x="0" y="40" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="20" y="65" text-anchor="middle" font-size="12" class="text-light">A</text>
    <text x="20" y="65" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A</text>
    <rect x="0" y="80" width="40" height="40" class="cell-light"/>
    <rect x="0" y="80" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="20" y="105" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="20" y="105" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <rect x="0" y="120" width="40" height="40" class="cell-light"/>
    <rect x="0" y="120" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="20" y="145" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="20" y="145" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <rect x="0" y="160" width="40" height="40" class="cell-light"/>
    <rect x="0" y="160" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="20" y="185" text-anchor="middle" font-size="12" class="text-light">D</text>
    <text x="20" y="185" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">D</text>
    <rect x="40" y="40" width="40" height="40" class="cell-light"/>
    <rect x="40" y="40" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="60" y="65" text-anchor="middle" font-size="14" class="text-light">0</text>
    <text x="60" y="65" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">0</text>
    <rect x="80" y="40" width="40" height="40" class="filled-light"/>
    <rect x="80" y="40" width="40" height="40" class="filled-dark" style="display:none;"/>
    <text x="100" y="65" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">1</text>
    <text x="100" y="65" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <rect x="120" y="40" width="40" height="40" class="filled-light"/>
    <rect x="120" y="40" width="40" height="40" class="filled-dark" style="display:none;"/>
    <text x="140" y="65" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">1</text>
    <text x="140" y="65" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <rect x="160" y="40" width="40" height="40" class="cell-light"/>
    <rect x="160" y="40" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="180" y="65" text-anchor="middle" font-size="14" class="text-light">0</text>
    <text x="180" y="65" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">0</text>
    <rect x="40" y="80" width="40" height="40" class="filled-light"/>
    <rect x="40" y="80" width="40" height="40" class="filled-dark" style="display:none;"/>
    <text x="60" y="105" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">1</text>
    <text x="60" y="105" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <rect x="80" y="80" width="40" height="40" class="cell-light"/>
    <rect x="80" y="80" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="100" y="105" text-anchor="middle" font-size="14" class="text-light">0</text>
    <text x="100" y="105" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">0</text>
    <rect x="120" y="80" width="40" height="40" class="filled-light"/>
    <rect x="120" y="80" width="40" height="40" class="filled-dark" style="display:none;"/>
    <text x="140" y="105" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">1</text>
    <text x="140" y="105" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <rect x="160" y="80" width="40" height="40" class="filled-light"/>
    <rect x="160" y="80" width="40" height="40" class="filled-dark" style="display:none;"/>
    <text x="180" y="105" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">1</text>
    <text x="180" y="105" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <rect x="40" y="120" width="40" height="40" class="filled-light"/>
    <rect x="40" y="120" width="40" height="40" class="filled-dark" style="display:none;"/>
    <text x="60" y="145" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">1</text>
    <text x="60" y="145" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <rect x="80" y="120" width="40" height="40" class="filled-light"/>
    <rect x="80" y="120" width="40" height="40" class="filled-dark" style="display:none;"/>
    <text x="100" y="145" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">1</text>
    <text x="100" y="145" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <rect x="120" y="120" width="40" height="40" class="cell-light"/>
    <rect x="120" y="120" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="140" y="145" text-anchor="middle" font-size="14" class="text-light">0</text>
    <text x="140" y="145" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">0</text>
    <rect x="160" y="120" width="40" height="40" class="filled-light"/>
    <rect x="160" y="120" width="40" height="40" class="filled-dark" style="display:none;"/>
    <text x="180" y="145" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">1</text>
    <text x="180" y="145" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <rect x="40" y="160" width="40" height="40" class="cell-light"/>
    <rect x="40" y="160" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="60" y="185" text-anchor="middle" font-size="14" class="text-light">0</text>
    <text x="60" y="185" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">0</text>
    <rect x="80" y="160" width="40" height="40" class="filled-light"/>
    <rect x="80" y="160" width="40" height="40" class="filled-dark" style="display:none;"/>
    <text x="100" y="185" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">1</text>
    <text x="100" y="185" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <rect x="120" y="160" width="40" height="40" class="filled-light"/>
    <rect x="120" y="160" width="40" height="40" class="filled-dark" style="display:none;"/>
    <text x="140" y="185" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">1</text>
    <text x="140" y="185" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <rect x="160" y="160" width="40" height="40" class="cell-light"/>
    <rect x="160" y="160" width="40" height="40" class="cell-dark" style="display:none;"/>
    <text x="180" y="185" text-anchor="middle" font-size="14" class="text-light">0</text>
    <text x="180" y="185" text-anchor="middle" font-size="14" class="text-dark" style="display:none;">0</text>
    <text x="100" y="220" text-anchor="middle" font-size="10" class="subtext-light">Space: O(n^2) | Edge lookup: O(1)</text>
    <text x="100" y="220" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Space: O(n^2) | Edge lookup: O(1)</text>
    <text x="100" y="240" text-anchor="middle" font-size="10" class="subtext-light">Neighbor iteration: O(n) | Dense graphs only</text>
    <text x="100" y="240" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Neighbor iteration: O(n) | Dense graphs only</text>
  </g>
  <g transform="translate(460, 80)">
    <rect x="0" y="0" width="60" height="35" class="list-light"/>
    <rect x="0" y="0" width="60" height="35" class="list-dark" style="display:none;"/>
    <text x="30" y="22" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">A:</text>
    <text x="30" y="22" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">A:</text>
    <rect x="60" y="0" width="45" height="35" class="list-light"/>
    <rect x="60" y="0" width="45" height="35" class="list-dark" style="display:none;"/>
    <text x="82" y="22" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="82" y="22" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <rect x="105" y="0" width="45" height="35" class="list-light"/>
    <rect x="105" y="0" width="45" height="35" class="list-dark" style="display:none;"/>
    <text x="127" y="22" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="127" y="22" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <rect x="0" y="40" width="60" height="35" class="list-light"/>
    <rect x="0" y="40" width="60" height="35" class="list-dark" style="display:none;"/>
    <text x="30" y="62" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">B:</text>
    <text x="30" y="62" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">B:</text>
    <rect x="60" y="40" width="45" height="35" class="list-light"/>
    <rect x="60" y="40" width="45" height="35" class="list-dark" style="display:none;"/>
    <text x="82" y="62" text-anchor="middle" font-size="12" class="text-light">A</text>
    <text x="82" y="62" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A</text>
    <rect x="105" y="40" width="45" height="35" class="list-light"/>
    <rect x="105" y="40" width="45" height="35" class="list-dark" style="display:none;"/>
    <text x="127" y="62" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="127" y="62" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <rect x="150" y="40" width="45" height="35" class="list-light"/>
    <rect x="150" y="40" width="45" height="35" class="list-dark" style="display:none;"/>
    <text x="172" y="62" text-anchor="middle" font-size="12" class="text-light">D</text>
    <text x="172" y="62" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">D</text>
    <rect x="0" y="80" width="60" height="35" class="list-light"/>
    <rect x="0" y="80" width="60" height="35" class="list-dark" style="display:none;"/>
    <text x="30" y="102" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">C:</text>
    <text x="30" y="102" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">C:</text>
    <rect x="60" y="80" width="45" height="35" class="list-light"/>
    <rect x="60" y="80" width="45" height="35" class="list-dark" style="display:none;"/>
    <text x="82" y="102" text-anchor="middle" font-size="12" class="text-light">A</text>
    <text x="82" y="102" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A</text>
    <rect x="105" y="80" width="45" height="35" class="list-light"/>
    <rect x="105" y="80" width="45" height="35" class="list-dark" style="display:none;"/>
    <text x="127" y="102" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="127" y="102" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <rect x="150" y="80" width="45" height="35" class="list-light"/>
    <rect x="150" y="80" width="45" height="35" class="list-dark" style="display:none;"/>
    <text x="172" y="102" text-anchor="middle" font-size="12" class="text-light">D</text>
    <text x="172" y="102" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">D</text>
    <rect x="0" y="120" width="60" height="35" class="list-light"/>
    <rect x="0" y="120" width="60" height="35" class="list-dark" style="display:none;"/>
    <text x="30" y="142" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">D:</text>
    <text x="30" y="142" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">D:</text>
    <rect x="60" y="120" width="45" height="35" class="list-light"/>
    <rect x="60" y="120" width="45" height="35" class="list-dark" style="display:none;"/>
    <text x="82" y="142" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="82" y="142" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <rect x="105" y="120" width="45" height="35" class="list-light"/>
    <rect x="105" y="120" width="45" height="35" class="list-dark" style="display:none;"/>
    <text x="127" y="142" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="127" y="142" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <text x="100" y="180" text-anchor="middle" font-size="10" class="subtext-light">Space: O(n + m) | Neighbor iteration: O(degree)</text>
    <text x="100" y="180" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Space: O(n + m) | Neighbor iteration: O(degree)</text>
    <text x="100" y="200" text-anchor="middle" font-size="10" class="subtext-light">Edge lookup: O(degree) | Sparse graphs preferred</text>
    <text x="100" y="200" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Edge lookup: O(degree) | Sparse graphs preferred</text>
    <text x="100" y="220" text-anchor="middle" font-size="10" class="subtext-light">Used by: virtually all graph libraries, databases, social networks</text>
    <text x="100" y="220" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Used by: virtually all graph libraries, databases, social networks</text>
  </g>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-light">Choice depends on graph density: dense (m ~ n^2) = matrix, sparse (m ~ n) = list. Real-world graphs are almost always sparse.</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Choice depends on graph density: dense (m ~ n^2) = matrix, sparse (m ~ n) = list. Real-world graphs are almost always sparse.</text>
  <text x="400" y="360" text-anchor="middle" font-size="11" class="subtext-light">Blue cells = edges present (value 1) | White cells = no edge (value 0) | For weighted graphs, matrix stores weights instead of 0/1.</text>
  <text x="400" y="360" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Blue cells = edges present (value 1) | White cells = no edge (value 0) | For weighted graphs, matrix stores weights instead of 0/1.</text>
  <text x="400" y="375" text-anchor="middle" font-size="11" class="subtext-light">For directed graphs, matrix is asymmetric. For undirected graphs, matrix is symmetric about the diagonal.</text>
  <text x="400" y="375" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">For directed graphs, matrix is asymmetric. For undirected graphs, matrix is symmetric about the diagonal.</text>
</svg>
`;

const bfsVsDfsSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .node-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .node-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .bfs-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 3; }
      .bfs-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 3; }
      .dfs-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 3; }
      .dfs-dark { fill: #14532d; stroke: #4ade80; stroke-width: 3; }
      .edge-light { stroke: #475569; stroke-width: 2; fill: none; }
      .edge-dark { stroke: #94a3b8; stroke-width: 2; fill: none; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
    </style>
  </defs>
  <rect class="bg-light" width="800" height="340" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="340" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">BFS vs. DFS — Traversal Order Comparison</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">BFS vs. DFS — Traversal Order Comparison</text>
  <text x="200" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">BFS — Level by Level (Queue)</text>
  <text x="200" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">BFS — Level by Level (Queue)</text>
  <text x="600" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">DFS — Deep First, Then Backtrack (Stack)</text>
  <text x="600" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">DFS — Deep First, Then Backtrack (Stack)</text>
  <g transform="translate(50, 80)">
    <circle cx="150" cy="30" r="18" class="bfs-light"/>
    <circle cx="150" cy="30" r="18" class="bfs-dark" style="display:none;"/>
    <text x="150" y="35" text-anchor="middle" font-size="12" class="text-light">A</text>
    <text x="150" y="35" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A</text>
    <text x="150" y="12" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">1</text>
    <text x="150" y="12" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <circle cx="60" cy="100" r="18" class="bfs-light"/>
    <circle cx="60" cy="100" r="18" class="bfs-dark" style="display:none;"/>
    <text x="60" y="105" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="60" y="105" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <text x="60" y="82" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">2</text>
    <text x="60" y="82" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">2</text>
    <circle cx="240" cy="100" r="18" class="bfs-light"/>
    <circle cx="240" cy="100" r="18" class="bfs-dark" style="display:none;"/>
    <text x="240" y="105" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="240" y="105" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <text x="240" y="82" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">3</text>
    <text x="240" y="82" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">3</text>
    <circle cx="30" cy="180" r="18" class="node-light"/>
    <circle cx="30" cy="180" r="18" class="node-dark" style="display:none;"/>
    <text x="30" y="185" text-anchor="middle" font-size="12" class="text-light">D</text>
    <text x="30" y="185" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">D</text>
    <text x="30" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">4</text>
    <text x="30" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">4</text>
    <circle cx="120" cy="180" r="18" class="node-light"/>
    <circle cx="120" cy="180" r="18" class="node-dark" style="display:none;"/>
    <text x="120" y="185" text-anchor="middle" font-size="12" class="text-light">E</text>
    <text x="120" y="185" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">E</text>
    <text x="120" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">5</text>
    <text x="120" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">5</text>
    <circle cx="210" cy="180" r="18" class="node-light"/>
    <circle cx="210" cy="180" r="18" class="node-dark" style="display:none;"/>
    <text x="210" y="185" text-anchor="middle" font-size="12" class="text-light">F</text>
    <text x="210" y="185" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">F</text>
    <text x="210" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">6</text>
    <text x="210" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">6</text>
    <circle cx="300" cy="180" r="18" class="node-light"/>
    <circle cx="300" cy="180" r="18" class="node-dark" style="display:none;"/>
    <text x="300" y="185" text-anchor="middle" font-size="12" class="text-light">G</text>
    <text x="300" y="185" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">G</text>
    <text x="300" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">7</text>
    <text x="300" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">7</text>
    <line x1="140" y1="46" x2="70" y2="84" class="edge-light"/>
    <line x1="140" y1="46" x2="70" y2="84" class="edge-dark" style="display:none;"/>
    <line x1="160" y1="46" x2="230" y2="84" class="edge-light"/>
    <line x1="160" y1="46" x2="230" y2="84" class="edge-dark" style="display:none;"/>
    <line x1="50" y1="118" x2="35" y2="162" class="edge-light"/>
    <line x1="50" y1="118" x2="35" y2="162" class="edge-dark" style="display:none;"/>
    <line x1="70" y1="118" x2="110" y2="162" class="edge-light"/>
    <line x1="70" y1="118" x2="110" y2="162" class="edge-dark" style="display:none;"/>
    <line x1="230" y1="118" x2="215" y2="162" class="edge-light"/>
    <line x1="230" y1="118" x2="215" y2="162" class="edge-dark" style="display:none;"/>
    <line x1="250" y1="118" x2="290" y2="162" class="edge-light"/>
    <line x1="250" y1="118" x2="290" y2="162" class="edge-dark" style="display:none;"/>
    <text x="150" y="220" text-anchor="middle" font-size="10" class="subtext-light">Order: A, B, C, D, E, F, G</text>
    <text x="150" y="220" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Order: A, B, C, D, E, F, G</text>
    <text x="150" y="240" text-anchor="middle" font-size="10" class="subtext-light">Shortest path in unweighted graphs</text>
    <text x="150" y="240" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Shortest path in unweighted graphs</text>
  </g>
  <g transform="translate(450, 80)">
    <circle cx="150" cy="30" r="18" class="dfs-light"/>
    <circle cx="150" cy="30" r="18" class="dfs-dark" style="display:none;"/>
    <text x="150" y="35" text-anchor="middle" font-size="12" class="text-light">A</text>
    <text x="150" y="35" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">A</text>
    <text x="150" y="12" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">1</text>
    <text x="150" y="12" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">1</text>
    <circle cx="60" cy="100" r="18" class="dfs-light"/>
    <circle cx="60" cy="100" r="18" class="dfs-dark" style="display:none;"/>
    <text x="60" y="105" text-anchor="middle" font-size="12" class="text-light">B</text>
    <text x="60" y="105" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">B</text>
    <text x="60" y="82" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">2</text>
    <text x="60" y="82" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">2</text>
    <circle cx="30" cy="180" r="18" class="dfs-light"/>
    <circle cx="30" cy="180" r="18" class="dfs-dark" style="display:none;"/>
    <text x="30" y="185" text-anchor="middle" font-size="12" class="text-light">D</text>
    <text x="30" y="185" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">D</text>
    <text x="30" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">3</text>
    <text x="30" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">3</text>
    <circle cx="120" cy="180" r="18" class="node-light"/>
    <circle cx="120" cy="180" r="18" class="node-dark" style="display:none;"/>
    <text x="120" y="185" text-anchor="middle" font-size="12" class="text-light">E</text>
    <text x="120" y="185" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">E</text>
    <text x="120" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">6</text>
    <text x="120" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">6</text>
    <circle cx="240" cy="100" r="18" class="dfs-light"/>
    <circle cx="240" cy="100" r="18" class="dfs-dark" style="display:none;"/>
    <text x="240" y="105" text-anchor="middle" font-size="12" class="text-light">C</text>
    <text x="240" y="105" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">C</text>
    <text x="240" y="82" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">4</text>
    <text x="240" y="82" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">4</text>
    <circle cx="210" cy="180" r="18" class="dfs-light"/>
    <circle cx="210" cy="180" r="18" class="dfs-dark" style="display:none;"/>
    <text x="210" y="185" text-anchor="middle" font-size="12" class="text-light">F</text>
    <text x="210" y="185" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">F</text>
    <text x="210" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">5</text>
    <text x="210" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">5</text>
    <circle cx="300" cy="180" r="18" class="node-light"/>
    <circle cx="300" cy="180" r="18" class="node-dark" style="display:none;"/>
    <text x="300" y="185" text-anchor="middle" font-size="12" class="text-light">G</text>
    <text x="300" y="185" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">G</text>
    <text x="300" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-light">7</text>
    <text x="300" y="162" text-anchor="middle" font-size="10" font-weight="bold" class="text-dark" style="display:none;">7</text>
    <line x1="140" y1="46" x2="70" y2="84" class="edge-light"/>
    <line x1="140" y1="46" x2="70" y2="84" class="edge-dark" style="display:none;"/>
    <line x1="160" y1="46" x2="230" y2="84" class="edge-light"/>
    <line x1="160" y1="46" x2="230" y2="84" class="edge-dark" style="display:none;"/>
    <line x1="50" y1="118" x2="35" y2="162" class="edge-light"/>
    <line x1="50" y1="118" x2="35" y2="162" class="edge-dark" style="display:none;"/>
    <line x1="70" y1="118" x2="110" y2="162" class="edge-light"/>
    <line x1="70" y1="118" x2="110" y2="162" class="edge-dark" style="display:none;"/>
    <line x1="230" y1="118" x2="215" y2="162" class="edge-light"/>
    <line x1="230" y1="118" x2="215" y2="162" class="edge-dark" style="display:none;"/>
    <line x1="250" y1="118" x2="290" y2="162" class="edge-light"/>
    <line x1="250" y1="118" x2="290" y2="162" class="edge-dark" style="display:none;"/>
    <text x="150" y="220" text-anchor="middle" font-size="10" class="subtext-light">Order: A, B, D, E, C, F, G</text>
    <text x="150" y="220" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Order: A, B, D, E, C, F, G</text>
    <text x="150" y="240" text-anchor="middle" font-size="10" class="subtext-light">Topological sort, cycle detection, SCCs</text>
    <text x="150" y="240" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Topological sort, cycle detection, SCCs</text>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="11" class="subtext-light">BFS: O(V + E) time, O(V) space (queue). Finds shortest path in unweighted graphs. Guarantees minimum depth to any reachable node.</text>
  <text x="400" y="300" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">BFS: O(V + E) time, O(V) space (queue). Finds shortest path in unweighted graphs. Guarantees minimum depth to any reachable node.</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-light">DFS: O(V + E) time, O(V) space (stack/recursion). Lower memory for deep narrow trees. Essential for topological sort, cycle detection, strongly connected components.</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">DFS: O(V + E) time, O(V) space (stack/recursion). Lower memory for deep narrow trees. Essential for topological sort, cycle detection, strongly connected components.</text>
  <text x="400" y="335" text-anchor="middle" font-size="11" class="subtext-light">Numbers inside circles = visitation order. Blue = BFS visited first | Green = DFS visited first</text>
  <text x="400" y="335" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Numbers inside circles = visitation order. Blue = BFS visited first | Green = DFS visited first</text>
</svg>
`;

const shortestPathSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .node-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .node-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .path-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 3; }
      .path-dark { fill: #14532d; stroke: #4ade80; stroke-width: 3; }
      .edge-light { stroke: #475569; stroke-width: 2; fill: none; }
      .edge-dark { stroke: #94a3b8; stroke-width: 2; fill: none; }
      .spath-light { stroke: #16a34a; stroke-width: 4; fill: none; }
      .spath-dark { stroke: #4ade80; stroke-width: 4; fill: none; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
    </style>
  </defs>
  <rect class="bg-light" width="800" height="300" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="300" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Shortest Path Algorithms — Dijkstra with Highlighted Path</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Shortest Path Algorithms — Dijkstra with Highlighted Path</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Green path = shortest path from S to G (total weight: 7). Dijkstra explores nodes in order of distance from source.</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Green path = shortest path from S to G (total weight: 7). Dijkstra explores nodes in order of distance from source.</text>
  <g transform="translate(50, 70)">
    <line x1="80" y1="40" x2="200" y2="20" class="edge-light"/>
    <line x1="80" y1="40" x2="200" y2="20" class="edge-dark" style="display:none;"/>
    <text x="135" y="22" text-anchor="middle" font-size="11" class="text-light">4</text>
    <text x="135" y="22" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">4</text>
    <line x1="80" y1="60" x2="180" y2="100" class="edge-light"/>
    <line x1="80" y1="60" x2="180" y2="100" class="edge-dark" style="display:none;"/>
    <text x="120" y="90" text-anchor="middle" font-size="11" class="text-light">2</text>
    <text x="120" y="90" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2</text>
    <line x1="200" y1="35" x2="320" y2="60" class="edge-light"/>
    <line x1="200" y1="35" x2="320" y2="60" class="edge-dark" style="display:none;"/>
    <text x="265" y="38" text-anchor="middle" font-size="11" class="text-light">3</text>
    <text x="265" y="38" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">3</text>
    <line x1="200" y1="100" x2="320" y2="60" class="edge-light"/>
    <line x1="200" y1="100" x2="320" y2="60" class="edge-dark" style="display:none;"/>
    <text x="268" y="88" text-anchor="middle" font-size="11" class="text-light">1</text>
    <text x="268" y="88" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1</text>
    <line x1="200" y1="120" x2="320" y2="140" class="edge-light"/>
    <line x1="200" y1="120" x2="320" y2="140" class="edge-dark" style="display:none;"/>
    <text x="268" y="140" text-anchor="middle" font-size="11" class="text-light">5</text>
    <text x="268" y="140" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">5</text>
    <line x1="340" y1="60" x2="460" y2="40" class="edge-light"/>
    <line x1="340" y1="60" x2="460" y2="40" class="edge-dark" style="display:none;"/>
    <text x="405" y="42" text-anchor="middle" font-size="11" class="text-light">2</text>
    <text x="405" y="42" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2</text>
    <line x1="340" y1="75" x2="440" y2="120" class="edge-light"/>
    <line x1="340" y1="75" x2="440" y2="120" class="edge-dark" style="display:none;"/>
    <text x="398" y="106" text-anchor="middle" font-size="11" class="text-light">3</text>
    <text x="398" y="106" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">3</text>
    <line x1="340" y1="140" x2="440" y2="120" class="edge-light"/>
    <line x1="340" y1="140" x2="440" y2="120" class="edge-dark" style="display:none;"/>
    <text x="398" y="140" text-anchor="middle" font-size="11" class="text-light">1</text>
    <text x="398" y="140" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1</text>
    <line x1="460" y1="55" x2="560" y2="100" class="edge-light"/>
    <line x1="460" y1="55" x2="560" y2="100" class="edge-dark" style="display:none;"/>
    <text x="518" y="68" text-anchor="middle" font-size="11" class="text-light">6</text>
    <text x="518" y="68" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">6</text>
    <line x1="460" y1="135" x2="560" y2="100" class="edge-light"/>
    <line x1="460" y1="135" x2="560" y2="100" class="edge-dark" style="display:none;"/>
    <text x="518" y="128" text-anchor="middle" font-size="11" class="text-light">2</text>
    <text x="518" y="128" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2</text>
    <line x1="80" y1="40" x2="200" y2="20" class="spath-light" opacity="0.3"/>
    <line x1="80" y1="40" x2="200" y2="20" class="spath-dark" opacity="0.3" style="display:none;"/>
    <path d="M 80 60 L 200 100 L 320 140 L 440 120 L 560 100" class="spath-light"/>
    <path d="M 80 60 L 200 100 L 320 140 L 440 120 L 560 100" class="spath-dark" style="display:none;"/>
    <circle cx="80" cy="50" r="22" class="path-light"/>
    <circle cx="80" cy="50" r="22" class="path-dark" style="display:none;"/>
    <text x="80" y="55" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">S</text>
    <text x="80" y="55" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">S</text>
    <text x="80" y="82" text-anchor="middle" font-size="10" class="subtext-light">dist=0</text>
    <text x="80" y="82" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">dist=0</text>
    <circle cx="200" cy="110" r="22" class="path-light"/>
    <circle cx="200" cy="110" r="22" class="path-dark" style="display:none;"/>
    <text x="200" y="115" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">B</text>
    <text x="200" y="115" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">B</text>
    <text x="200" y="142" text-anchor="middle" font-size="10" class="subtext-light">dist=2</text>
    <text x="200" y="142" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">dist=2</text>
    <circle cx="200" cy="20" r="22" class="node-light"/>
    <circle cx="200" cy="20" r="22" class="node-dark" style="display:none;"/>
    <text x="200" y="25" text-anchor="middle" font-size="13" class="text-light">A</text>
    <text x="200" y="25" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">A</text>
    <text x="200" y="8" text-anchor="middle" font-size="10" class="subtext-light">dist=4</text>
    <text x="200" y="8" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">dist=4</text>
    <circle cx="320" cy="140" r="22" class="path-light"/>
    <circle cx="320" cy="140" r="22" class="path-dark" style="display:none;"/>
    <text x="320" y="145" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">D</text>
    <text x="320" y="145" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">D</text>
    <text x="320" y="172" text-anchor="middle" font-size="10" class="subtext-light">dist=7</text>
    <text x="320" y="172" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">dist=7</text>
    <circle cx="320" cy="60" r="22" class="node-light"/>
    <circle cx="320" cy="60" r="22" class="node-dark" style="display:none;"/>
    <text x="320" y="65" text-anchor="middle" font-size="13" class="text-light">C</text>
    <text x="320" y="65" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">C</text>
    <text x="320" y="40" text-anchor="middle" font-size="10" class="subtext-light">dist=3</text>
    <text x="320" y="40" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">dist=3</text>
    <circle cx="440" cy="120" r="22" class="path-light"/>
    <circle cx="440" cy="120" r="22" class="path-dark" style="display:none;"/>
    <text x="440" y="125" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">E</text>
    <text x="440" y="125" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">E</text>
    <text x="440" y="152" text-anchor="middle" font-size="10" class="subtext-light">dist=8</text>
    <text x="440" y="152" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">dist=8</text>
    <circle cx="460" cy="40" r="22" class="node-light"/>
    <circle cx="460" cy="40" r="22" class="node-dark" style="display:none;"/>
    <text x="460" y="45" text-anchor="middle" font-size="13" class="text-light">F</text>
    <text x="460" y="45" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">F</text>
    <text x="460" y="20" text-anchor="middle" font-size="10" class="subtext-light">dist=5</text>
    <text x="460" y="20" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">dist=5</text>
    <circle cx="560" cy="100" r="22" class="path-light"/>
    <circle cx="560" cy="100" r="22" class="path-dark" style="display:none;"/>
    <text x="560" y="105" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">G</text>
    <text x="560" y="105" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">G</text>
    <text x="560" y="132" text-anchor="middle" font-size="10" class="subtext-light">dist=10</text>
    <text x="560" y="132" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">dist=10</text>
  </g>
  <text x="400" y="250" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Algorithm Comparison</text>
  <text x="400" y="250" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Algorithm Comparison</text>
  <text x="400" y="270" text-anchor="middle" font-size="11" class="subtext-light">Dijkstra: O((V+E) log V) with priority queue. No negative weights. Single-source shortest path. Greedy.</text>
  <text x="400" y="270" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Dijkstra: O((V+E) log V) with priority queue. No negative weights. Single-source shortest path. Greedy.</text>
  <text x="400" y="288" text-anchor="middle" font-size="11" class="subtext-light">Bellman-Ford: O(VE). Handles negative weights. Detects negative cycles. Slower but more general.</text>
  <text x="400" y="288" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Bellman-Ford: O(VE). Handles negative weights. Detects negative cycles. Slower but more general.</text>
  <text x="400" y="295" text-anchor="middle" font-size="11" class="subtext-light">Floyd-Warshall: O(V^3). All-pairs shortest path. Handles negative weights (no negative cycles). Simple triple-nested loop.</text>
  <text x="400" y="295" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Floyd-Warshall: O(V^3). All-pairs shortest path. Handles negative weights (no negative cycles). Simple triple-nested loop.</text>
</svg>
`;

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>graph</strong> is a mathematical structure consisting of a set of <strong>vertices</strong> (also called nodes) and a set of <strong>edges</strong> (connections between pairs of vertices). Formally, a graph G = (V, E) where V is the vertex set and E is the edge set. Each edge is a pair of vertices: for undirected graphs, the pair is unordered (the edge {u, v} is the same as {v, u}); for directed graphs (digraphs), the pair is ordered (the edge (u, v) goes from u to v but not necessarily from v to u). Edges may carry <strong>weights</strong> (costs, distances, capacities) that quantify the relationship between connected vertices.
        </p>
        <p>
          Graphs are the most general and expressive data structure in computer science. They model virtually every relational system: social networks (people as vertices, friendships as edges), transportation networks (intersections as vertices, roads as edges), the web (web pages as vertices, hyperlinks as edges), dependency graphs (software packages as vertices, dependencies as edges), knowledge graphs (entities as vertices, relationships as edges), and state machines (states as vertices, transitions as edges). For staff and principal engineers, graphs are not merely an academic topic — they are the fundamental abstraction for understanding system relationships, network topology, dependency resolution, and distributed system communication patterns.
        </p>
        <p>
          The algorithmic landscape of graphs is vast: traversal (BFS, DFS), shortest path (Dijkstra, Bellman-Ford, Floyd-Warshall, A*), minimum spanning tree (Prim, Kruskal), maximum flow (Ford-Fulkerson, Edmonds-Karp), topological sorting, strongly connected components, bipartite matching, and graph coloring. The choice of graph representation (adjacency matrix, adjacency list, edge list, compressed sparse row) fundamentally determines the time and space complexity of every algorithm operating on the graph, making the representation choice one of the most impactful architectural decisions in graph-based systems.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <h3>Graph Terminology and Properties</h3>
        <p>
          The <strong>degree</strong> of a vertex in an undirected graph is the number of edges incident to it. In a directed graph, the <strong>in-degree</strong> is the number of incoming edges and the <strong>out-degree</strong> is the number of outgoing edges. The sum of all degrees in an undirected graph equals 2|E| (the Handshaking Lemma), because each edge contributes to the degree of two vertices. A <strong>path</strong> is a sequence of vertices where consecutive vertices are connected by edges. The <strong>length</strong> of a path is the number of edges (or the sum of edge weights in a weighted graph). A <strong>cycle</strong> is a path that starts and ends at the same vertex. A graph with no cycles is <strong>acyclic</strong>; a directed acyclic graph (DAG) is a fundamental structure used in scheduling, dependency resolution, and version control systems.
        </p>
        <p>
          A graph is <strong>connected</strong> (undirected) if there is a path between every pair of vertices. A directed graph is <strong>strongly connected</strong> if there is a directed path from every vertex to every other vertex, and <strong>weakly connected</strong> if it is connected when edge directions are ignored. A <strong>connected component</strong> is a maximal connected subgraph — a subset of vertices where every pair is reachable, and no vertex in the subset can reach any vertex outside it. Finding connected components is a foundational graph operation used in network analysis, image segmentation, and clustering.
        </p>
        <p>
          Graphs are classified by their <strong>density</strong>: a <strong>dense</strong> graph has |E| close to |V|² (the maximum possible number of edges), while a <strong>sparse</strong> graph has |E| close to |V|. Most real-world graphs are sparse: social networks have average degree ~200 despite billions of users (sparse), road networks have average degree ~4 (very sparse), and the web graph has average degree ~10 (sparse). This sparsity determines the optimal graph representation and algorithm choice.
        </p>

        <h3>Graph Representations</h3>
        <p>
          The <strong>adjacency matrix</strong> is a |V| × |V| matrix where entry (i, j) is 1 (or the edge weight) if there is an edge from vertex i to vertex j, and 0 otherwise. For undirected graphs, the matrix is symmetric about the diagonal. Adjacency matrices provide O(1) edge lookup (is there an edge between u and v?) and O(1) edge insertion/deletion. However, they consume O(|V|²) space regardless of the number of edges, making them impractical for large sparse graphs. They are optimal for dense graphs (|E| ≈ |V|²) and for algorithms that need to iterate over all possible edges (e.g., Floyd-Warshall all-pairs shortest path).
        </p>
        <p>
          The <strong>adjacency list</strong> stores, for each vertex, a list (or array, or linked list) of its neighboring vertices. This representation consumes O(|V| + |E|) space — proportional to the actual number of edges — making it optimal for sparse graphs. Iterating over the neighbors of a vertex takes O(degree(v)) time, which is efficient for sparse graphs where average degree is small. Edge lookup takes O(degree(v)) time (search the neighbor list), which is O(|V|) in the worst case. The adjacency list is the dominant representation in practice: virtually every graph library, database system, and social network uses it because real-world graphs are almost always sparse.
        </p>
        <p>
          The <strong>compressed sparse row (CSR)</strong> format is a space-optimized array-based representation used in high-performance graph processing. It stores all neighbor lists concatenated into a single array, with an auxiliary index array marking the start position of each vertex&apos;s neighbor list. CSR eliminates the pointer overhead of linked-list-based adjacency lists, providing excellent cache locality for graph traversal and enabling SIMD-optimized processing. It is the representation of choice for GPU graph processing (Gunrock, CuSPARSE) and CPU graph analytics libraries (Ligra, GBBS).
        </p>

        <h3>Graph Traversal: BFS and DFS</h3>
        <p>
          <strong>Breadth-First Search (BFS)</strong> explores the graph level by level, visiting all vertices at distance k from the source before visiting any vertex at distance k+1. It uses a queue to track the frontier: enqueue the source, then repeatedly dequeue a vertex, process it, and enqueue all its unvisited neighbors. BFS runs in O(|V| + |E|) time and O(|V|) space. Its defining property is that it finds the <strong>shortest path</strong> (minimum number of edges) from the source to every reachable vertex in an unweighted graph. This makes BFS the algorithm of choice for shortest-path problems in unweighted graphs, peer discovery in P2P networks, and level-order tree traversal.
        </p>
        <p>
          <strong>Depth-First Search (DFS)</strong> explores the graph by going as deep as possible along each branch before backtracking. It uses a stack (explicitly or via recursion) to track the current path: push the source, then repeatedly process the top of the stack and push an unvisited neighbor; when a vertex has no unvisited neighbors, pop it and backtrack. DFS also runs in O(|V| + |E|) time and O(|V|) space. DFS is the foundation for many advanced graph algorithms: topological sorting (DFS post-order gives the reverse topological order), cycle detection (a back edge in the DFS tree indicates a cycle), strongly connected components (Kosaraju&apos;s and Tarjan&apos;s algorithms), and articulation point/bridge detection.
        </p>

        <ArticleImage svgContent={graphTypesSVG} caption="Graph types showing undirected, directed, and weighted graphs with their structural properties" />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Shortest Path Algorithms</h3>
        <p>
          <strong>Dijkstra&apos;s algorithm</strong> finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights. It maintains a priority queue of vertices ordered by their current shortest distance from the source, initially containing only the source with distance 0. At each step, it extracts the vertex with the minimum distance, marks it as finalized, and relaxes all its outgoing edges: for each neighbor, if the distance through the current vertex is shorter than the neighbor&apos;s known distance, update the neighbor&apos;s distance and add it to the priority queue. With a binary heap priority queue, Dijkstra runs in O((|V| + |E|) log |V|) time; with a Fibonacci heap, it runs in O(|E| + |V| log |V|) time.
        </p>
        <p>
          <strong>Bellman-Ford algorithm</strong> extends shortest path computation to graphs with negative edge weights (but no negative cycles). It relaxes all |E| edges |V|-1 times, ensuring that after k iterations, the shortest path of at most k edges is found. If after |V|-1 iterations any distance can still be improved, the graph contains a negative cycle. Bellman-Ford runs in O(|V| × |E|) time, making it slower than Dijkstra but more general. It is used in routing protocols (RIP — Routing Information Protocol) and in financial arbitrage detection (negative cycles represent profitable arbitrage opportunities).
        </p>
        <p>
          <strong>Floyd-Warshall algorithm</strong> computes the shortest path between all pairs of vertices in O(|V|³) time using a dynamic programming approach: for each intermediate vertex k, update the distance between every pair (i, j) if going through k is shorter. The algorithm is a triple-nested loop of remarkable simplicity, and it handles negative weights (but not negative cycles). Floyd-Warshall is practical for small graphs (|V| ≤ 500) and is used in transitive closure computation, network routing table initialization, and all-pairs distance precomputation for real-time path queries.
        </p>

        <h3>Minimum Spanning Trees</h3>
        <p>
          A <strong>minimum spanning tree (MST)</strong> of a weighted, connected, undirected graph is a spanning tree (a subgraph that includes all vertices and is a tree) with the minimum possible total edge weight. MSTs are used in network design (connecting all nodes with minimum cable cost), clustering (hierarchical clustering via MST edges), and approximation algorithms (the MST provides a 2-approximation for the Traveling Salesperson Problem).
        </p>
        <p>
          <strong>Prim&apos;s algorithm</strong> grows the MST from an arbitrary starting vertex by repeatedly adding the minimum-weight edge that connects a vertex in the MST to a vertex outside it. It uses a priority queue to track the minimum-weight edge to each unvisited vertex, running in O((|V| + |E|) log |V|) time with a binary heap. Prim&apos;s algorithm is essentially Dijkstra&apos;s algorithm with the priority keyed on edge weight rather than path distance.
        </p>
        <p>
          <strong>Kruskal&apos;s algorithm</strong> sorts all edges by weight and processes them in increasing order, adding each edge to the MST if it does not create a cycle (checked using a Union-Find data structure). Kruskal&apos;s runs in O(|E| log |E|) time (dominated by sorting) and is simpler to implement than Prim&apos;s. It is preferable for sparse graphs where |E| is close to |V|, while Prim&apos;s is preferable for dense graphs where |E| is close to |V|².
        </p>

        <ArticleImage svgContent={adjacencyRepresentationSVG} caption="Adjacency matrix versus adjacency list comparison showing space and time complexity trade-offs" />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <h3>Adjacency Matrix versus Adjacency List</h3>
        <p>
          The choice between adjacency matrix and adjacency list is determined by graph density and the dominant operations. Adjacency matrices provide O(1) edge lookup and are cache-friendly for dense graphs (sequential access to matrix rows), but waste O(|V|² - |E|) space on absent edges. For a graph with 1 million vertices and 5 million edges (sparse: average degree 10), an adjacency matrix requires 10¹² entries (1 TB for boolean entries), while an adjacency list requires only O(|V| + |E|) = 6 million entries (~24 MB). The space difference is four orders of magnitude.
        </p>
        <p>
          Adjacency lists are the default choice for virtually all production graph systems because real-world graphs are sparse. The only scenarios where adjacency matrices are preferable are: very small graphs (|V| ≤ 1000), very dense graphs (|E| ≥ 0.5 × |V|²), and algorithms that need to check all possible edges (e.g., checking if a graph is complete, Floyd-Warshall). In all other cases, adjacency lists dominate in space efficiency and are competitive in time efficiency for the operations that matter (neighbor iteration, BFS, DFS).
        </p>

        <h3>BFS versus DFS</h3>
        <p>
          BFS and DFS have identical asymptotic complexity (O(|V| + |E|) time, O(|V|) space) but serve fundamentally different purposes. BFS is the algorithm of choice when you need the shortest path in an unweighted graph, when you need to find all vertices within k hops of a source (e.g., &quot;friends of friends&quot; in social networks), or when you need to minimize the maximum depth explored (useful when the target is expected to be near the source). DFS is the algorithm of choice when you need to explore the entire graph deeply (e.g., finding all connected components), when you need topological ordering (dependency resolution), when you need cycle detection, or when memory is constrained and the graph is deep but narrow (DFS uses O(h) stack space where h is the maximum depth, while BFS uses O(w) queue space where w is the maximum width — and for deep narrow graphs, h is much smaller than w).
        </p>

        <ArticleImage svgContent={bfsVsDfsSVG} caption="BFS versus DFS traversal order comparison showing visitation sequence and use cases" />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use adjacency lists for all sparse graphs (which is virtually all real-world graphs). Store neighbor lists as dynamic arrays (std::vector in C++, ArrayList in Java) rather than linked lists for better cache locality during traversal. When the graph is static (no edge insertions or deletions after construction), use the CSR format for maximum space efficiency and traversal performance. When edge weights are needed, store them in a parallel array aligned with the neighbor list (neighbors[i] has weight weights[i]).
        </p>
        <p>
          For shortest path computation in road networks and geographic graphs, use <strong>A* (A-star)</strong> with a heuristic function (e.g., Euclidean or Manhattan distance to the goal) rather than Dijkstra&apos;s algorithm. A* directs the search toward the goal, often exploring far fewer vertices than Dijkstra while producing the same optimal result. The heuristic must be admissible (never overestimate the true cost) to guarantee optimality. For very large road networks (continental scale), use <strong>Contraction Hierarchies</strong> or <strong>Hub Labeling</strong> for sub-millisecond query times after a preprocessing phase.
        </p>
        <p>
          For graph processing at scale (billions of vertices, trillions of edges), use distributed graph processing frameworks: Pregel/BSP model (Google Pregel, Apache Giraph) for iterative algorithms, GraphX (Apache Spark) for graph-parallel computation, or specialized engines like Neo4j for graph database queries. The key challenge in distributed graph processing is communication cost: graph algorithms have irregular memory access patterns that cause high network traffic between partitions. Graph partitioning (minimizing edge cuts between partitions) is the critical optimization that determines distributed graph processing performance.
        </p>
        <p>
          For cycle detection in directed graphs (e.g., dependency cycle detection in build systems, package managers, or microservice architectures), use DFS with a three-color marking scheme: white (unvisited), gray (currently being processed), black (fully processed). A back edge to a gray vertex indicates a cycle. This runs in O(|V| + |E|) time and is the algorithm used by Maven, Gradle, and npm to detect circular dependencies.
        </p>
        <p>
          For topological sorting (linear ordering of vertices in a DAG such that for every directed edge (u, v), u comes before v), use Kahn&apos;s algorithm (BFS-based with in-degree tracking) or DFS-based post-order reversal. Kahn&apos;s algorithm is preferable when you need to detect cycles (if the result does not contain all vertices, the graph has a cycle) and when you need to process vertices in &quot;ready&quot; order (all dependencies satisfied). This is the algorithm used by make, Bazel, and CI/CD pipelines for build ordering.
        </p>

        <ArticleImage svgContent={shortestPathSVG} caption="Shortest path computation showing Dijkstra algorithm result with highlighted optimal path" />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most critical pitfall is <strong>choosing the wrong graph representation</strong>. Using an adjacency matrix for a large sparse graph wastes enormous amounts of memory and causes cache misses during neighbor iteration (scanning through mostly-zero rows). Using an adjacency list for a very dense graph wastes time on edge lookups (searching long neighbor lists instead of O(1) matrix access). Always compute the graph density (|E| / |V|²) before choosing: if density &lt; 0.1, use adjacency lists; if density &gt; 0.5, consider adjacency matrices.
        </p>
        <p>
          <strong>Negative weight cycles</strong> in shortest path computation cause Dijkstra&apos;s algorithm to produce incorrect results (it assumes non-negative weights and greedily finalizes vertices). If negative weights are possible, use Bellman-Ford and check for negative cycles. In financial arbitrage detection, negative cycles in the logarithm-transformed exchange rate graph represent profitable arbitrage opportunities — but in routing and navigation, they indicate an error in the cost model.
        </p>
        <p>
          <strong>Disconnected graphs</strong> cause BFS and DFS from a single source to miss vertices in other connected components. Always iterate over all vertices and start a BFS/DFS from each unvisited vertex to ensure full graph coverage. This is especially important in production systems where the graph may have isolated vertices or disconnected subgraphs (e.g., orphaned user accounts in a social network, unreachable services in a microservice dependency graph).
        </p>
        <p>
          <strong>Stack overflow in recursive DFS</strong> occurs for deep graphs (e.g., a linear chain of 100,000 vertices). The recursion depth equals the path length, exceeding the default stack size limit. Use iterative DFS with an explicit stack to avoid this risk. This is particularly important for production systems processing user-generated graphs (e.g., file system hierarchies, organizational charts) where the depth is not bounded.
        </p>
        <p>
          <strong>Modifying the graph during traversal</strong> causes undefined behavior in both BFS and DFS. Adding or removing edges while iterating over neighbor lists can cause missed vertices, duplicate processing, or infinite loops. If the graph must be modified during traversal, collect the modifications in a buffer and apply them after the traversal completes, or use a concurrent graph data structure with appropriate synchronization.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Social network analysis</strong> uses graphs extensively: vertices represent users, edges represent relationships (friendships, follows, interactions). BFS computes &quot;degrees of separation&quot; (the number of hops between two users), friend recommendations (friends of friends who are not yet friends — a 2-hop BFS query), and community detection (connected components, clustering coefficients). Facebook&apos;s Social Graph has billions of vertices and trillions of edges, processed using distributed graph processing frameworks (TAO — Facebook&apos;s graph storage system).
        </p>
        <p>
          <strong>Navigation and routing systems</strong> (Google Maps, Waze, Uber) model road networks as weighted graphs where intersections are vertices, road segments are edges, and weights represent travel time (distance / speed limit + real-time traffic). Dijkstra&apos;s algorithm with A* heuristic computes the fastest route, and Contraction Hierarchies enable sub-millisecond query times on continental-scale road networks. Uber&apos;s ETA prediction system uses graph-based shortest path computation combined with machine learning models for traffic-aware weight estimation.
        </p>
        <p>
          <strong>Dependency resolution</strong> in package managers (npm, pip, Maven, apt) uses DAGs where packages are vertices and dependencies are directed edges. Topological sorting determines the installation order (dependencies installed before dependents), and cycle detection identifies incompatible dependency specifications. When a cycle is detected, the package manager reports an error because no valid installation order exists. This is a daily use of graph algorithms that affects every software developer.
        </p>
        <p>
          <strong>Web search and PageRank</strong> models the web as a directed graph where web pages are vertices and hyperlinks are directed edges. Google&apos;s PageRank algorithm computes the importance of each page based on the number and quality of incoming links — essentially a random walk on the web graph. The web graph has billions of vertices (pages) and hundreds of billions of edges (links), making it one of the largest graphs processed in production. The graph structure is essential for understanding web connectivity, authority detection, and spam identification.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <h3>1. How would you detect a cycle in a directed graph? Extend to an undirected graph.</h3>
        <p>
          For a directed graph, use DFS with a three-color marking scheme: white (unvisited), gray (currently in the recursion stack), and black (fully processed). When DFS visits a vertex, mark it gray. For each neighbor: if the neighbor is gray, a back edge exists and the graph has a cycle; if the neighbor is white, recursively visit it; if the neighbor is black, ignore it (the edge goes to an already-completed subtree). After processing all neighbors, mark the vertex black. If DFS completes without finding a gray neighbor, the graph is acyclic. This runs in O(|V| + |E|) time and O(|V|) space.
        </p>
        <p>
          Alternatively, use Kahn&apos;s algorithm (BFS-based topological sort): compute in-degrees for all vertices, enqueue all vertices with in-degree 0, and repeatedly dequeue a vertex, decrement the in-degree of its neighbors, and enqueue any neighbor whose in-degree becomes 0. If the number of processed vertices equals |V|, the graph is acyclic (a valid topological order exists); if fewer than |V| vertices are processed, the graph has a cycle (the remaining vertices form a strongly connected component with no incoming edges from processed vertices).
        </p>
        <p>
          For an undirected graph, use DFS with parent tracking: when visiting a vertex u, for each neighbor v, if v is not the parent of u and v has already been visited, a cycle exists (the edge (u, v) creates a back edge to an already-visited vertex that is not u&apos;s parent). The parent tracking is essential because in an undirected graph, the edge (u, v) is bidirectional, and without parent tracking, the DFS would immediately detect a &quot;cycle&quot; when it traverses back from v to u (which is just the reverse of the edge it just took). This also runs in O(|V| + |E|) time.
        </p>

        <h3>2. How would you find all connected components in an undirected graph?</h3>
        <p>
          The simplest approach is to iterate over all vertices and start a BFS or DFS from each unvisited vertex. Each BFS/DFS traversal discovers one connected component: all vertices reachable from the starting vertex. Mark each visited vertex to avoid reprocessing. The number of BFS/DFS invocations equals the number of connected components. This runs in O(|V| + |E|) time because each vertex and edge is processed exactly once.
        </p>
        <p>
          An alternative approach uses the <strong>Union-Find</strong> (Disjoint Set Union, DSU) data structure: initialize each vertex as its own set, then for each edge (u, v), union the sets containing u and v. After processing all edges, the number of distinct set representatives equals the number of connected components. Union-Find with path compression and union by rank runs in nearly O(|V| + |E|) time (specifically, O((|V| + |E|) × α(|V|)) where α is the inverse Ackermann function, which is ≤ 4 for all practical input sizes). Union-Find is preferable when edges are streamed (processed one at a time) rather than available as a complete graph, because it incrementally maintains the connected components without needing to store the full graph.
        </p>
        <p>
          In production systems with very large graphs (billions of vertices), connected components are computed using distributed algorithms: the Label Propagation Algorithm (LPA) assigns each vertex a label and iteratively updates each vertex&apos;s label to the most common label among its neighbors, converging to connected components after O(log |V|) iterations. This is used in graph databases (Neo4j Graph Data Science Library) and distributed graph processing (Apache Spark GraphX).
        </p>

        <h3>3. How does Dijkstra&apos;s algorithm work? Why can&apos;t it handle negative edge weights?</h3>
        <p>
          Dijkstra&apos;s algorithm maintains a priority queue of vertices ordered by their current shortest distance from the source. Initially, only the source is in the queue with distance 0, and all other vertices have distance infinity. At each step, the algorithm extracts the vertex u with the minimum distance from the queue, marks u as finalized (its shortest distance is now known), and relaxes all of u&apos;s outgoing edges: for each neighbor v of u, if dist(u) + weight(u, v) &lt; dist(v), update dist(v) to dist(u) + weight(u, v) and insert or update v in the priority queue.
        </p>
        <p>
          The correctness of Dijkstra relies on the <strong>greedy choice property</strong>: when a vertex u is extracted from the priority queue with the minimum distance, no shorter path to u can exist through any other vertex, because any other path would have to go through a vertex with distance ≥ dist(u), and adding non-negative edge weights can only increase the distance. This property fails when negative edge weights exist: a vertex with a currently large distance might be reached through a negative-weight edge from a vertex with an even larger distance, producing a shorter path than the one already finalized. Dijkstra would have already finalized the vertex and would not revisit it, producing an incorrect result.
        </p>
        <p>
          For graphs with negative weights, use Bellman-Ford, which relaxes all edges |V|-1 times (guaranteeing that the shortest path of at most |V|-1 edges is found) and then checks for negative cycles (a |V|-th relaxation that improves any distance indicates a negative cycle). Bellman-Ford handles negative weights correctly but runs in O(|V| × |E|) time, making it significantly slower than Dijkstra for large graphs.
        </p>

        <h3>4. How would you implement topological sorting? What are its real-world applications?</h3>
        <p>
          Topological sorting produces a linear ordering of vertices in a DAG such that for every directed edge (u, v), u appears before v in the ordering. There are two standard approaches.
        </p>
        <p>
          The <strong>DFS-based approach</strong>: perform DFS on the graph, and after fully processing a vertex (after all its descendants have been processed), prepend it to the result list. The result list, read in reverse order of completion (post-order), gives the topological order. This works because if there is an edge (u, v), DFS will fully process v before u (since v is a descendant of u in the DFS tree), so v will be prepended before u, placing u before v in the final order.
        </p>
        <p>
          <strong>Kahn&apos;s algorithm</strong> (BFS-based): compute the in-degree of every vertex, enqueue all vertices with in-degree 0 (these have no dependencies and can be processed first), then repeatedly dequeue a vertex u, append it to the result, decrement the in-degree of each of u&apos;s neighbors, and enqueue any neighbor whose in-degree becomes 0. If the result contains all |V| vertices, it is a valid topological order; if fewer, the graph has a cycle.
        </p>
        <p>
          Real-world applications include: build system ordering (compile dependencies before dependents — make, Bazel, CMake), package installation order (install libraries before applications that use them — apt, npm, pip), course scheduling (take prerequisites before advanced courses), task scheduling in CI/CD pipelines (run tests before deployment), and database migration ordering (create referenced tables before tables with foreign keys).
        </p>

        <h3>5. What is the Union-Find data structure and how is it used in graph algorithms?</h3>
        <p>
          Union-Find (Disjoint Set Union, DSU) maintains a partition of elements into disjoint sets and supports two operations: <strong>find(x)</strong> returns the representative of the set containing x, and <strong>union(x, y)</strong> merges the sets containing x and y. The data structure is implemented as a forest of trees, where each tree represents a set and the root of the tree is the set representative. Each element stores a pointer to its parent, and the root points to itself.
        </p>
        <p>
          Two optimizations make Union-Find nearly O(1) per operation: <strong>path compression</strong> (during find(x), make every node on the path from x to the root point directly to the root, flattening the tree for future finds) and <strong>union by rank</strong> (when merging two trees, attach the shorter tree under the root of the taller tree, keeping the tree height minimal). With both optimizations, the amortized time per operation is O(α(n)) where α is the inverse Ackermann function, which grows so slowly that it is ≤ 4 for any n that can be written in the observable universe.
        </p>
        <p>
          In graph algorithms, Union-Find is used in Kruskal&apos;s MST algorithm (union vertices connected by each edge, skip edges that connect vertices already in the same set — i.e., would create a cycle), connected component computation (union endpoints of each edge, then count distinct representatives), and dynamic connectivity (maintain connected components under edge insertions and connectivity queries). Union-Find is the right choice when the graph is being built incrementally (edges added one at a time) and connectivity queries are interspersed with edge additions.
        </p>

        <h3>6. How would you find the shortest path in a grid (2D matrix) with obstacles?</h3>
        <p>
          A grid with obstacles is an unweighted graph where each cell is a vertex, and edges connect adjacent cells (4-directional or 8-directional movement). Obstacles are vertices with no edges. The shortest path from a start cell to a goal cell in an unweighted graph is found by BFS.
        </p>
        <p>
          The BFS implementation: create a queue and enqueue the start cell with distance 0, mark the start cell as visited, and maintain a 2D visited array. At each step, dequeue a cell (r, c) with distance d, and for each valid neighbor (within grid bounds, not an obstacle, not visited), mark it visited, enqueue it with distance d+1, and record the predecessor (for path reconstruction). When the goal cell is dequeued, its distance is the shortest path length, and the path is reconstructed by following predecessors from the goal back to the start.
        </p>
        <p>
          This runs in O(R × C) time where R and C are the grid dimensions (each cell is visited at most once, and each cell has at most 4 neighbors). The space complexity is O(R × C) for the visited array and the queue. For weighted grids (different cells have different traversal costs), use Dijkstra&apos;s algorithm with a priority queue instead of BFS. For grids with a known goal position and a reasonable heuristic (e.g., Manhattan distance), use A* for faster average-case performance.
        </p>
        <p>
          A common follow-up asks for the shortest path allowing k obstacle removals (i.e., you can pass through up to k obstacle cells). This is solved by augmenting the BFS state to (row, col, obstacles_removed) and running BFS on this augmented state space. The state space size is R × C × (k+1), and the time complexity is O(R × C × k).
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li>Cormen, T.H., Leiserson, C.E., Rivest, R.L., Stein, C. — &quot;Introduction to Algorithms&quot; — MIT Press, 4th Edition, Chapters 20-24 (Graph Algorithms)</li>
          <li>Even, S. — &quot;Graph Algorithms&quot; — Cambridge University Press, 2nd Edition</li>
          <li>West, D.B. — &quot;Introduction to Graph Theory&quot; — Prentice Hall, 2nd Edition</li>
          <li>Dijkstra, E.W. — &quot;A Note on Two Problems in Connexion with Graphs&quot; — Numerische Mathematik, Vol. 1, 1959</li>
          <li>Kruskal, J.B. — &quot;On the Shortest Spanning Subtree of a Graph and the Traveling Salesman Problem&quot; — Proceedings of the AMS, Vol. 7, 1956</li>
          <li>Tarjan, R.E. — &quot;Depth-First Search and Linear Graph Algorithms&quot; — SIAM Journal on Computing, Vol. 1, No. 2, 1972</li>
          <li>Gonzalez, J.E. et al. — &quot;PowerGraph: Distributed Graph-Parallel Computation on Natural Graphs&quot; — OSDI 2012 (Large-Scale Graph Processing)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-data-structures-hash-tables",
  title: "Hash Tables",
  description:
    "Comprehensive guide to hash tables: hash functions, collision resolution (chaining, open addressing), load factor, resizing, universal hashing, concurrent hash tables, and production-scale trade-offs for staff and principal engineer interviews.",
  category: "other",
  subcategory: "data-structures-algorithms/data-structures",
  slug: "hash-tables",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-14",
  tags: ["data-structures", "hash-tables", "hashing", "collision-resolution"],
  relatedTopics: ["arrays", "trees", "bloom-filters"],
};

const hashFunctionMappingSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .key-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .key-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .bucket-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .bucket-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .filled-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .filled-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .arrow-light { stroke: #8b5cf6; stroke-width: 2; fill: none; marker-end: url(#arrow-light); }
      .arrow-dark { stroke: #a78bfa; stroke-width: 2; fill: none; marker-end: url(#arrow-dark); }
    </style>
    <marker id="arrow-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6"/>
    </marker>
    <marker id="arrow-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#a78bfa"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="360" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="360" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Hash Function — Mapping Keys to Bucket Indices</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Hash Function — Mapping Keys to Bucket Indices</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">hash(key) % capacity = bucket index. Good hash: uniform distribution, minimal collisions.</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">hash(key) % capacity = bucket index. Good hash: uniform distribution, minimal collisions.</text>
  <g transform="translate(60, 70)">
    <text x="120" y="0" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Keys</text>
    <text x="120" y="0" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Keys</text>
    <rect x="40" y="10" width="160" height="35" class="key-light"/>
    <rect x="40" y="10" width="160" height="35" class="key-dark" style="display:none;"/>
    <text x="120" y="32" text-anchor="middle" font-size="13" class="text-light">"Alice" → h=3847291</text>
    <text x="120" y="32" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">"Alice" → h=3847291</text>
    <rect x="40" y="50" width="160" height="35" class="key-light"/>
    <rect x="40" y="50" width="160" height="35" class="key-dark" style="display:none;"/>
    <text x="120" y="72" text-anchor="middle" font-size="13" class="text-light">"Bob" → h=1293847</text>
    <text x="120" y="72" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">"Bob" → h=1293847</text>
    <rect x="40" y="90" width="160" height="35" class="key-light"/>
    <rect x="40" y="90" width="160" height="35" class="key-dark" style="display:none;"/>
    <text x="120" y="112" text-anchor="middle" font-size="13" class="text-light">"Charlie" → h=5729184</text>
    <text x="120" y="112" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">"Charlie" → h=5729184</text>
    <rect x="40" y="130" width="160" height="35" class="key-light"/>
    <rect x="40" y="130" width="160" height="35" class="key-dark" style="display:none;"/>
    <text x="120" y="152" text-anchor="middle" font-size="13" class="text-light">"Diana" → h=3847291</text>
    <text x="120" y="152" text-anchor="middle" font-size="13" class="text-dark" style="display:none;">"Diana" → h=3847291</text>
    <text x="120" y="180" text-anchor="middle" font-size="11" class="subtext-light">Note: Alice and Diana have</text>
    <text x="120" y="180" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Note: Alice and Diana have</text>
    <text x="120" y="195" text-anchor="middle" font-size="11" class="subtext-light">the same hash (collision!)</text>
    <text x="120" y="195" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">the same hash (collision!)</text>
  </g>
  <g transform="translate(320, 80)">
    <text x="80" y="0" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Hash Function</text>
    <text x="80" y="0" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Hash Function</text>
    <rect x="0" y="10" width="160" height="100" rx="8" class="bucket-light"/>
    <rect x="0" y="10" width="160" height="100" rx="8" class="bucket-dark" style="display:none;"/>
    <text x="80" y="40" text-anchor="middle" font-size="14" font-weight="bold" class="text-light">h(key)</text>
    <text x="80" y="40" text-anchor="middle" font-size="14" font-weight="bold" class="text-dark" style="display:none;">h(key)</text>
    <text x="80" y="60" text-anchor="middle" font-size="11" class="subtext-light">1. Compute hash code</text>
    <text x="80" y="60" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">1. Compute hash code</text>
    <text x="80" y="75" text-anchor="middle" font-size="11" class="subtext-light">2. Compress: h % m</text>
    <text x="80" y="75" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">2. Compress: h % m</text>
    <text x="80" y="90" text-anchor="middle" font-size="11" class="subtext-light">3. Return bucket index</text>
    <text x="80" y="90" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">3. Return bucket index</text>
  </g>
  <g transform="translate(560, 70)">
    <text x="100" y="0" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Buckets (capacity = 8)</text>
    <text x="100" y="0" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Buckets (capacity = 8)</text>
    <rect x="20" y="10" width="40" height="30" class="bucket-light"/>
    <rect x="20" y="10" width="40" height="30" class="bucket-dark" style="display:none;"/>
    <text x="40" y="30" text-anchor="middle" font-size="11" class="text-light">0</text>
    <text x="40" y="30" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">0</text>
    <rect x="20" y="40" width="40" height="30" class="bucket-light"/>
    <rect x="20" y="40" width="40" height="30" class="bucket-dark" style="display:none;"/>
    <text x="40" y="60" text-anchor="middle" font-size="11" class="text-light">1</text>
    <text x="40" y="60" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">1</text>
    <rect x="20" y="70" width="40" height="30" class="filled-light"/>
    <rect x="20" y="70" width="40" height="30" class="filled-dark" style="display:none;"/>
    <text x="40" y="90" text-anchor="middle" font-size="11" class="text-light">2</text>
    <text x="40" y="90" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">2</text>
    <rect x="20" y="100" width="40" height="30" class="bucket-light"/>
    <rect x="20" y="100" width="40" height="30" class="bucket-dark" style="display:none;"/>
    <text x="40" y="120" text-anchor="middle" font-size="11" class="text-light">3</text>
    <text x="40" y="120" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">3</text>
    <rect x="60" y="10" width="40" height="30" class="filled-light"/>
    <rect x="60" y="10" width="40" height="30" class="filled-dark" style="display:none;"/>
    <text x="80" y="30" text-anchor="middle" font-size="11" class="text-light">4</text>
    <text x="80" y="30" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">4</text>
    <rect x="60" y="40" width="40" height="30" class="bucket-light"/>
    <rect x="60" y="40" width="40" height="30" class="bucket-dark" style="display:none;"/>
    <text x="80" y="60" text-anchor="middle" font-size="11" class="text-light">5</text>
    <text x="80" y="60" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">5</text>
    <rect x="60" y="70" width="40" height="30" class="bucket-light"/>
    <rect x="60" y="70" width="40" height="30" class="bucket-dark" style="display:none;"/>
    <text x="80" y="90" text-anchor="middle" font-size="11" class="text-light">6</text>
    <text x="80" y="90" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">6</text>
    <rect x="60" y="100" width="40" height="30" class="bucket-light"/>
    <rect x="60" y="100" width="40" height="30" class="bucket-dark" style="display:none;"/>
    <text x="80" y="120" text-anchor="middle" font-size="11" class="text-light">7</text>
    <text x="80" y="120" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">7</text>
    <rect x="100" y="10" width="80" height="30" class="key-light"/>
    <rect x="100" y="10" width="80" height="30" class="key-dark" style="display:none;"/>
    <text x="140" y="30" text-anchor="middle" font-size="10" class="text-light">Alice, Diana</text>
    <text x="140" y="30" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">Alice, Diana</text>
    <rect x="100" y="70" width="80" height="30" class="key-light"/>
    <rect x="100" y="70" width="80" height="30" class="key-dark" style="display:none;"/>
    <text x="140" y="90" text-anchor="middle" font-size="10" class="text-light">Bob</text>
    <text x="140" y="90" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">Bob</text>
    <rect x="100" y="100" width="80" height="30" class="key-light"/>
    <rect x="100" y="100" width="80" height="30" class="key-dark" style="display:none;"/>
    <text x="140" y="120" text-anchor="middle" font-size="10" class="text-light">Charlie</text>
    <text x="140" y="120" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">Charlie</text>
    <text x="100" y="155" text-anchor="middle" font-size="10" class="subtext-light">Green = occupied</text>
    <text x="100" y="155" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Green = occupied</text>
    <text x="100" y="170" text-anchor="middle" font-size="10" class="subtext-light">Gray = empty</text>
    <text x="100" y="170" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Gray = empty</text>
  </g>
  <path d="M 220 85 L 310 85" class="arrow-light"/>
  <path d="M 220 85 L 310 85" class="arrow-dark" style="display:none;"/>
  <path d="M 220 125 L 310 125" class="arrow-light"/>
  <path d="M 220 125 L 310 125" class="arrow-dark" style="display:none;"/>
  <path d="M 220 165 L 310 165" class="arrow-light"/>
  <path d="M 220 165 L 310 165" class="arrow-dark" style="display:none;"/>
  <path d="M 490 85 L 550 25" class="arrow-light"/>
  <path d="M 490 85 L 550 25" class="arrow-dark" style="display:none;"/>
  <path d="M 490 125 L 550 125" class="arrow-light"/>
  <path d="M 490 125 L 550 125" class="arrow-dark" style="display:none;"/>
  <path d="M 490 165 L 550 85" class="arrow-light"/>
  <path d="M 490 165 L 550 85" class="arrow-dark" style="display:none;"/>
  <text x="400" y="300" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Hash Function Properties</text>
  <text x="400" y="300" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Hash Function Properties</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-light">Deterministic: same key always produces same hash. Uniform: keys distribute evenly across buckets. Fast: O(key_length) computation.</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Deterministic: same key always produces same hash. Uniform: keys distribute evenly across buckets. Fast: O(key_length) computation.</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-light">Collision: two different keys map to the same bucket. Inevitable when |keys| > |buckets|. Resolved via chaining or open addressing.</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Collision: two different keys map to the same bucket. Inevitable when |keys| > |buckets|. Resolved via chaining or open addressing.</text>
  <text x="400" y="355" text-anchor="middle" font-size="11" class="subtext-light">Alice and Diana collide at bucket 4 despite different keys — same hash code modulo 8.</text>
  <text x="400" y="355" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Alice and Diana collide at bucket 4 despite different keys — same hash code modulo 8.</text>
</svg>
`;

const chainingCollisionSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .bucket-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .bucket-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .node-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .node-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .ptr-light { stroke: #475569; stroke-width: 2; fill: none; marker-end: url(#arrow-light); }
      .ptr-dark { stroke: #94a3b8; stroke-width: 2; fill: none; marker-end: url(#arrow-dark); }
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
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Chaining — Collision Resolution via Linked Lists</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Chaining — Collision Resolution via Linked Lists</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Each bucket points to a linked list of entries that hash to that bucket. Load factor α = n/m.</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Each bucket points to a linked list of entries that hash to that bucket. Load factor α = n/m.</text>
  <g transform="translate(60, 70)">
    <rect x="0" y="0" width="60" height="35" class="bucket-light"/>
    <rect x="0" y="0" width="60" height="35" class="bucket-dark" style="display:none;"/>
    <text x="30" y="22" text-anchor="middle" font-size="12" class="text-light">0</text>
    <text x="30" y="22" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">0</text>
    <rect x="0" y="35" width="60" height="35" class="bucket-light"/>
    <rect x="0" y="35" width="60" height="35" class="bucket-dark" style="display:none;"/>
    <text x="30" y="57" text-anchor="middle" font-size="12" class="text-light">1</text>
    <text x="30" y="57" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">1</text>
    <rect x="0" y="70" width="60" height="35" class="bucket-light"/>
    <rect x="0" y="70" width="60" height="35" class="bucket-dark" style="display:none;"/>
    <text x="30" y="92" text-anchor="middle" font-size="12" class="text-light">2</text>
    <text x="30" y="92" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">2</text>
    <rect x="0" y="105" width="60" height="35" class="bucket-light"/>
    <rect x="0" y="105" width="60" height="35" class="bucket-dark" style="display:none;"/>
    <text x="30" y="127" text-anchor="middle" font-size="12" class="text-light">3</text>
    <text x="30" y="127" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">3</text>
    <rect x="0" y="140" width="60" height="35" class="bucket-light"/>
    <rect x="0" y="140" width="60" height="35" class="bucket-dark" style="display:none;"/>
    <text x="30" y="162" text-anchor="middle" font-size="12" class="text-light">4</text>
    <text x="30" y="162" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">4</text>
    <rect x="0" y="175" width="60" height="35" class="bucket-light"/>
    <rect x="0" y="175" width="60" height="35" class="bucket-dark" style="display:none;"/>
    <text x="30" y="197" text-anchor="middle" font-size="12" class="text-light">5</text>
    <text x="30" y="197" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">5</text>
    <rect x="0" y="210" width="60" height="35" class="bucket-light"/>
    <rect x="0" y="210" width="60" height="35" class="bucket-dark" style="display:none;"/>
    <text x="30" y="232" text-anchor="middle" font-size="12" class="text-light">6</text>
    <text x="30" y="232" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">6</text>
    <rect x="0" y="245" width="60" height="35" class="bucket-light"/>
    <rect x="0" y="245" width="60" height="35" class="bucket-dark" style="display:none;"/>
    <text x="30" y="267" text-anchor="middle" font-size="12" class="text-light">7</text>
    <text x="30" y="267" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">7</text>
    <path d="M 60 157 L 100 110" class="ptr-light"/>
    <path d="M 60 157 L 100 110" class="ptr-dark" style="display:none;"/>
    <path d="M 60 92 L 100 70" class="ptr-light"/>
    <path d="M 60 92 L 100 70" class="ptr-dark" style="display:none;"/>
    <path d="M 60 127 L 100 180" class="ptr-light"/>
    <path d="M 60 127 L 100 180" class="ptr-dark" style="display:none;"/>
  </g>
  <g transform="translate(120, 70)">
    <rect x="0" y="0" width="100" height="30" class="node-light"/>
    <rect x="0" y="0" width="100" height="30" class="node-dark" style="display:none;"/>
    <text x="50" y="20" text-anchor="middle" font-size="11" class="text-light">Alice → val1</text>
    <text x="50" y="20" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">Alice → val1</text>
    <rect x="100" y="0" width="40" height="30" class="node-light"/>
    <rect x="100" y="0" width="40" height="30" class="node-dark" style="display:none;"/>
    <text x="120" y="20" text-anchor="middle" font-size="10" class="text-light">→</text>
    <text x="120" y="20" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">→</text>
    <rect x="160" y="0" width="100" height="30" class="node-light"/>
    <rect x="160" y="0" width="100" height="30" class="node-dark" style="display:none;"/>
    <text x="210" y="20" text-anchor="middle" font-size="11" class="text-light">Diana → val2</text>
    <text x="210" y="20" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">Diana → val2</text>
    <rect x="260" y="0" width="40" height="30" class="node-light"/>
    <rect x="260" y="0" width="40" height="30" class="node-dark" style="display:none;"/>
    <text x="280" y="20" text-anchor="middle" font-size="10" class="text-light">NULL</text>
    <text x="280" y="20" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">NULL</text>
    <text x="180" y="45" text-anchor="middle" font-size="10" class="subtext-light">Bucket 4: chain of length 2 (collision)</text>
    <text x="180" y="45" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Bucket 4: chain of length 2 (collision)</text>
    <rect x="0" y="60" width="100" height="30" class="node-light"/>
    <rect x="0" y="60" width="100" height="30" class="node-dark" style="display:none;"/>
    <text x="50" y="80" text-anchor="middle" font-size="11" class="text-light">Eve → val3</text>
    <text x="50" y="80" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">Eve → val3</text>
    <rect x="100" y="60" width="40" height="30" class="node-light"/>
    <rect x="100" y="60" width="40" height="30" class="node-dark" style="display:none;"/>
    <text x="120" y="80" text-anchor="middle" font-size="10" class="text-light">→</text>
    <text x="120" y="80" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">→</text>
    <rect x="160" y="60" width="100" height="30" class="node-light"/>
    <rect x="160" y="60" width="100" height="30" class="node-dark" style="display:none;"/>
    <text x="210" y="80" text-anchor="middle" font-size="11" class="text-light">Frank → val4</text>
    <text x="210" y="80" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">Frank → val4</text>
    <rect x="260" y="60" width="40" height="30" class="node-light"/>
    <rect x="260" y="60" width="40" height="30" class="node-dark" style="display:none;"/>
    <text x="280" y="80" text-anchor="middle" font-size="10" class="text-light">→</text>
    <text x="280" y="80" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">→</text>
    <rect x="320" y="60" width="100" height="30" class="node-light"/>
    <rect x="320" y="60" width="100" height="30" class="node-dark" style="display:none;"/>
    <text x="370" y="80" text-anchor="middle" font-size="11" class="text-light">Grace → val5</text>
    <text x="370" y="80" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">Grace → val5</text>
    <rect x="420" y="60" width="40" height="30" class="node-light"/>
    <rect x="420" y="60" width="40" height="30" class="node-dark" style="display:none;"/>
    <text x="440" y="80" text-anchor="middle" font-size="10" class="text-light">NULL</text>
    <text x="440" y="80" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">NULL</text>
    <text x="250" y="110" text-anchor="middle" font-size="10" class="subtext-light">Bucket 2: chain of length 3 (heavy collision)</text>
    <text x="250" y="110" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Bucket 2: chain of length 3 (heavy collision)</text>
    <rect x="0" y="120" width="100" height="30" class="node-light"/>
    <rect x="0" y="120" width="100" height="30" class="node-dark" style="display:none;"/>
    <text x="50" y="140" text-anchor="middle" font-size="11" class="text-light">Bob → val6</text>
    <text x="50" y="140" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">Bob → val6</text>
    <rect x="100" y="120" width="40" height="30" class="node-light"/>
    <rect x="100" y="120" width="40" height="30" class="node-dark" style="display:none;"/>
    <text x="120" y="140" text-anchor="middle" font-size="10" class="text-light">NULL</text>
    <text x="120" y="140" text-anchor="middle" font-size="10" class="text-dark" style="display:none;">NULL</text>
    <text x="80" y="165" text-anchor="middle" font-size="10" class="subtext-light">Bucket 6: chain of length 1</text>
    <text x="80" y="165" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Bucket 6: chain of length 1</text>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Chaining Complexity Analysis</text>
  <text x="400" y="300" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Chaining Complexity Analysis</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-light">Average case (uniform hash): insert O(1), search O(1 + α), delete O(1 + α) where α = n/m (load factor).</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Average case (uniform hash): insert O(1), search O(1 + α), delete O(1 + α) where α = n/m (load factor).</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-light">Worst case (all keys collide): O(n) for all operations. Mitigated by good hash function and resizing.</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Worst case (all keys collide): O(n) for all operations. Mitigated by good hash function and resizing.</text>
  <text x="400" y="360" text-anchor="middle" font-size="11" class="subtext-light">Space: O(n + m) for n entries and m buckets. Each entry has key, value, and next pointer overhead.</text>
  <text x="400" y="360" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Space: O(n + m) for n entries and m buckets. Each entry has key, value, and next pointer overhead.</text>
  <text x="400" y="375" text-anchor="middle" font-size="11" class="subtext-light">When α > 1 (more entries than buckets), average chain length > 1. Resize when α exceeds threshold (typically 0.75).</text>
  <text x="400" y="375" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">When α > 1 (more entries than buckets), average chain length > 1. Resize when α exceeds threshold (typically 0.75).</text>
</svg>
`;

const openAddressingSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .slot-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .slot-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .occ-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .occ-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
      .probe-light { fill: #fef3c7; stroke: #d97706; stroke-width: 2; }
      .probe-dark { fill: #451a03; stroke: #fbbf24; stroke-width: 2; }
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
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Open Addressing — Linear Probing, Quadratic Probing, Double Hashing</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Open Addressing — Linear Probing, Quadratic Probing, Double Hashing</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">All entries stored in the table. On collision, probe sequence finds next available slot. No external chains.</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">All entries stored in the table. On collision, probe sequence finds next available slot. No external chains.</text>
  <g transform="translate(50, 70)">
    <text x="120" y="0" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Linear Probing: h(k, i) = (h(k) + i) % m</text>
    <text x="120" y="0" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Linear Probing: h(k, i) = (h(k) + i) % m</text>
    <rect x="0" y="10" width="240" height="35" class="occ-light"/>
    <rect x="0" y="10" width="240" height="35" class="occ-dark" style="display:none;"/>
    <text x="120" y="32" text-anchor="middle" font-size="11" class="text-light">[0] Alice → val1  (h=4, placed at 0 via wrap)</text>
    <text x="120" y="32" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[0] Alice → val1  (h=4, placed at 0 via wrap)</text>
    <rect x="0" y="45" width="240" height="35" class="probe-light"/>
    <rect x="0" y="45" width="240" height="35" class="probe-dark" style="display:none;"/>
    <text x="120" y="67" text-anchor="middle" font-size="11" class="text-light">[1] Diana → val2  (h=4, probed 4,5,6,7,0)</text>
    <text x="120" y="67" text-anchor="middle" font-size="11" class="text-light">[1] Diana → val2  (h=4, probed 4,5,6,7,0)</text>
    <rect x="0" y="80" width="240" height="35" class="slot-light"/>
    <rect x="0" y="80" width="240" height="35" class="slot-dark" style="display:none;"/>
    <text x="120" y="102" text-anchor="middle" font-size="11" class="text-light">[2] empty</text>
    <text x="120" y="102" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[2] empty</text>
    <rect x="0" y="115" width="240" height="35" class="occ-light"/>
    <rect x="0" y="115" width="240" height="35" class="occ-dark" style="display:none;"/>
    <text x="120" y="137" text-anchor="middle" font-size="11" class="text-light">[3] Bob → val3  (h=3, direct)</text>
    <text x="120" y="137" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[3] Bob → val3  (h=3, direct)</text>
    <rect x="0" y="150" width="240" height="35" class="occ-light"/>
    <rect x="0" y="150" width="240" height="35" class="occ-dark" style="display:none;"/>
    <text x="120" y="172" text-anchor="middle" font-size="11" class="text-light">[4] Eve → val4  (h=4, direct)</text>
    <text x="120" y="172" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[4] Eve → val4  (h=4, direct)</text>
    <rect x="0" y="185" width="240" height="35" class="occ-light"/>
    <rect x="0" y="185" width="240" height="35" class="occ-dark" style="display:none;"/>
    <text x="120" y="207" text-anchor="middle" font-size="11" class="text-light">[5] Frank → val5  (h=6, probed 6→5)</text>
    <text x="120" y="207" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[5] Frank → val5  (h=6, probed 6→5)</text>
    <rect x="0" y="220" width="240" height="35" class="occ-light"/>
    <rect x="0" y="220" width="240" height="35" class="occ-dark" style="display:none;"/>
    <text x="120" y="242" text-anchor="middle" font-size="11" class="text-light">[6] Charlie → val6  (h=6, direct)</text>
    <text x="120" y="242" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[6] Charlie → val6  (h=6, direct)</text>
    <rect x="0" y="255" width="240" height="35" class="slot-light"/>
    <rect x="0" y="255" width="240" height="35" class="slot-dark" style="display:none;"/>
    <text x="120" y="277" text-anchor="middle" font-size="11" class="text-light">[7] empty</text>
    <text x="120" y="277" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[7] empty</text>
    <text x="120" y="310" text-anchor="middle" font-size="10" class="subtext-light">Primary clustering: consecutive occupied</text>
    <text x="120" y="310" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Primary clustering: consecutive occupied</text>
    <text x="120" y="325" text-anchor="middle" font-size="10" class="subtext-light">slots grow longer, worsening probe length.</text>
    <text x="120" y="325" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">slots grow longer, worsening probe length.</text>
  </g>
  <g transform="translate(370, 70)">
    <text x="150" y="0" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Double Hashing: h(k, i) = (h1(k) + i × h2(k)) % m</text>
    <text x="150" y="0" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Double Hashing: h(k, i) = (h1(k) + i × h2(k)) % m</text>
    <rect x="0" y="10" width="300" height="35" class="occ-light"/>
    <rect x="0" y="10" width="300" height="35" class="occ-dark" style="display:none;"/>
    <text x="150" y="32" text-anchor="middle" font-size="11" class="text-light">[0] Alice (h1=4, h2=3 → step 3)</text>
    <text x="150" y="32" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[0] Alice (h1=4, h2=3 → step 3)</text>
    <rect x="0" y="45" width="300" height="35" class="slot-light"/>
    <rect x="0" y="45" width="300" height="35" class="slot-dark" style="display:none;"/>
    <text x="150" y="67" text-anchor="middle" font-size="11" class="text-light">[1] empty</text>
    <text x="150" y="67" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[1] empty</text>
    <rect x="0" y="80" width="300" height="35" class="occ-light"/>
    <rect x="0" y="80" width="300" height="35" class="occ-dark" style="display:none;"/>
    <text x="150" y="102" text-anchor="middle" font-size="11" class="text-light">[2] Diana (h1=4, h2=5 → 4,1,6,3,0,5,2)</text>
    <text x="150" y="102" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[2] Diana (h1=4, h2=5 → 4,1,6,3,0,5,2)</text>
    <rect x="0" y="115" width="300" height="35" class="occ-light"/>
    <rect x="0" y="115" width="300" height="35" class="occ-dark" style="display:none;"/>
    <text x="150" y="137" text-anchor="middle" font-size="11" class="text-light">[3] Bob (h1=3, h2=2 → direct)</text>
    <text x="150" y="137" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[3] Bob (h1=3, h2=2 → direct)</text>
    <rect x="0" y="150" width="300" height="35" class="occ-light"/>
    <rect x="0" y="150" width="300" height="35" class="occ-dark" style="display:none;"/>
    <text x="150" y="172" text-anchor="middle" font-size="11" class="text-light">[4] Eve (h1=4, h2=1 → direct)</text>
    <text x="150" y="172" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[4] Eve (h1=4, h2=1 → direct)</text>
    <rect x="0" y="185" width="300" height="35" class="occ-light"/>
    <rect x="0" y="185" width="300" height="35" class="occ-dark" style="display:none;"/>
    <text x="150" y="207" text-anchor="middle" font-size="11" class="text-light">[5] Frank (h1=6, h2=4 → probed 6→5)</text>
    <text x="150" y="207" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[5] Frank (h1=6, h2=4 → probed 6→5)</text>
    <rect x="0" y="220" width="300" height="35" class="occ-light"/>
    <rect x="0" y="220" width="300" height="35" class="occ-dark" style="display:none;"/>
    <text x="150" y="242" text-anchor="middle" font-size="11" class="text-light">[6] Charlie (h1=6, h2=7 → direct)</text>
    <text x="150" y="242" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[6] Charlie (h1=6, h2=7 → direct)</text>
    <rect x="0" y="255" width="300" height="35" class="slot-light"/>
    <rect x="0" y="255" width="300" height="35" class="slot-dark" style="display:none;"/>
    <text x="150" y="277" text-anchor="middle" font-size="11" class="text-light">[7] empty</text>
    <text x="150" y="277" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[7] empty</text>
    <text x="150" y="310" text-anchor="middle" font-size="10" class="subtext-light">Double hashing eliminates clustering. Each key</text>
    <text x="150" y="310" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Double hashing eliminates clustering. Each key</text>
    <text x="150" y="325" text-anchor="middle" font-size="10" class="subtext-light">has a unique probe sequence. Requires h2(k) ≠ 0.</text>
    <text x="150" y="325" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">has a unique probe sequence. Requires h2(k) ≠ 0.</text>
  </g>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-light">Linear probing: simplest, best cache performance, suffers primary clustering. Quadratic: h(k,i)=(h(k)+i²)%m, secondary clustering. Double hashing: best distribution, two hash computations.</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Linear probing: simplest, best cache performance, suffers primary clustering. Quadratic: h(k,i)=(h(k)+i²)%m, secondary clustering. Double hashing: best distribution, two hash computations.</text>
</svg>
`;

const hashTableResizingSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .old-light { fill: #fee2e2; stroke: #dc2626; stroke-width: 2; }
      .old-dark { fill: #450a0a; stroke: #f87171; stroke-width: 2; }
      .new-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .new-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .arrow-light { stroke: #8b5cf6; stroke-width: 2; fill: none; marker-end: url(#arrow-light); }
      .arrow-dark { stroke: #a78bfa; stroke-width: 2; fill: none; marker-end: url(#arrow-dark); }
    </style>
    <marker id="arrow-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6"/>
    </marker>
    <marker id="arrow-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#a78bfa"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="360" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="360" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Hash Table Resizing — Rehashing All Entries</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Hash Table Resizing — Rehashing All Entries</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">When load factor α exceeds threshold (e.g., 0.75), allocate new table (2× capacity), rehash all entries into new table.</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">When load factor α exceeds threshold (e.g., 0.75), allocate new table (2× capacity), rehash all entries into new table.</text>
  <text x="200" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Old Table (capacity=4, α=1.0 → TRIGGER)</text>
  <text x="200" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Old Table (capacity=4, α=1.0 → TRIGGER)</text>
  <text x="600" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">New Table (capacity=8, α=0.5)</text>
  <text x="600" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">New Table (capacity=8, α=0.5)</text>
  <g transform="translate(60, 100)">
    <rect x="0" y="0" width="120" height="30" class="old-light"/>
    <rect x="0" y="0" width="120" height="30" class="old-dark" style="display:none;"/>
    <text x="60" y="20" text-anchor="middle" font-size="11" class="text-light">[0] Alice</text>
    <text x="60" y="20" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[0] Alice</text>
    <rect x="0" y="30" width="120" height="30" class="old-light"/>
    <rect x="0" y="30" width="120" height="30" class="old-dark" style="display:none;"/>
    <text x="60" y="50" text-anchor="middle" font-size="11" class="text-light">[1] Bob</text>
    <text x="60" y="50" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[1] Bob</text>
    <rect x="0" y="60" width="120" height="30" class="old-light"/>
    <rect x="0" y="60" width="120" height="30" class="old-dark" style="display:none;"/>
    <text x="60" y="80" text-anchor="middle" font-size="11" class="text-light">[2] Charlie</text>
    <text x="60" y="80" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[2] Charlie</text>
    <rect x="0" y="90" width="120" height="30" class="old-light"/>
    <rect x="0" y="90" width="120" height="30" class="old-dark" style="display:none;"/>
    <text x="60" y="110" text-anchor="middle" font-size="11" class="text-light">[3] Diana</text>
    <text x="60" y="110" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[3] Diana</text>
    <text x="60" y="135" text-anchor="middle" font-size="10" class="subtext-light">4 entries / 4 buckets = 100% full</text>
    <text x="60" y="135" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">4 entries / 4 buckets = 100% full</text>
  </g>
  <text x="340" y="170" text-anchor="middle" font-size="14" font-weight="bold" class="subtext-light">Rehash each entry →</text>
  <text x="340" y="170" text-anchor="middle" font-size="14" font-weight="bold" class="subtext-dark" style="display:none;">Rehash each entry →</text>
  <g transform="translate(440, 100)">
    <rect x="0" y="0" width="120" height="30" class="new-light"/>
    <rect x="0" y="0" width="120" height="30" class="new-dark" style="display:none;"/>
    <text x="60" y="20" text-anchor="middle" font-size="11" class="text-light">[0] Alice</text>
    <text x="60" y="20" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[0] Alice</text>
    <rect x="0" y="30" width="120" height="30" class="slot-light"/>
    <rect x="0" y="30" width="120" height="30" class="slot-dark" style="display:none;"/>
    <text x="60" y="50" text-anchor="middle" font-size="11" class="text-light">[1] empty</text>
    <text x="60" y="50" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[1] empty</text>
    <rect x="0" y="60" width="120" height="30" class="new-light"/>
    <rect x="0" y="60" width="120" height="30" class="new-dark" style="display:none;"/>
    <text x="60" y="80" text-anchor="middle" font-size="11" class="text-light">[2] Charlie</text>
    <text x="60" y="80" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[2] Charlie</text>
    <rect x="0" y="90" width="120" height="30" class="new-light"/>
    <rect x="0" y="90" width="120" height="30" class="new-dark" style="display:none;"/>
    <text x="60" y="110" text-anchor="middle" font-size="11" class="text-light">[3] Bob</text>
    <text x="60" y="110" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[3] Bob</text>
    <rect x="0" y="120" width="120" height="30" class="new-light"/>
    <rect x="0" y="120" width="120" height="30" class="new-dark" style="display:none;"/>
    <text x="60" y="140" text-anchor="middle" font-size="11" class="text-light">[4] Diana</text>
    <text x="60" y="140" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[4] Diana</text>
    <rect x="0" y="150" width="120" height="30" class="slot-light"/>
    <rect x="0" y="150" width="120" height="30" class="slot-dark" style="display:none;"/>
    <text x="60" y="170" text-anchor="middle" font-size="11" class="text-light">[5] empty</text>
    <text x="60" y="170" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[5] empty</text>
    <rect x="0" y="180" width="120" height="30" class="slot-light"/>
    <rect x="0" y="180" width="120" height="30" class="slot-dark" style="display:none;"/>
    <text x="60" y="200" text-anchor="middle" font-size="11" class="text-light">[6] empty</text>
    <text x="60" y="200" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[6] empty</text>
    <rect x="0" y="210" width="120" height="30" class="slot-light"/>
    <rect x="0" y="210" width="120" height="30" class="slot-dark" style="display:none;"/>
    <text x="60" y="230" text-anchor="middle" font-size="11" class="text-light">[7] empty</text>
    <text x="60" y="230" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">[7] empty</text>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Resize Cost Analysis</text>
  <text x="400" y="300" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Resize Cost Analysis</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-light">Single resize: O(n) to rehash all n entries. Triggered when α > threshold (e.g., 0.75). Table size doubles each time.</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Single resize: O(n) to rehash all n entries. Triggered when α > threshold (e.g., 0.75). Table size doubles each time.</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-light">Amortized: O(1) per insert (same analysis as dynamic array). Total cost for n inserts: O(n). Latency spike on resize.</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Amortized: O(1) per insert (same analysis as dynamic array). Total cost for n inserts: O(n). Latency spike on resize.</text>
  <text x="400" y="355" text-anchor="middle" font-size="11" class="subtext-light">Mitigation: incremental resizing (rehash a few entries per operation) eliminates latency spikes for real-time systems.</text>
  <text x="400" y="355" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Mitigation: incremental resizing (rehash a few entries per operation) eliminates latency spikes for real-time systems.</text>
</svg>
`;

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>hash table</strong> is a data structure that implements an associative array (a mapping from keys to values) by computing an index into an array of buckets (or slots) from a key using a <strong>hash function</strong>. The hash function transforms an arbitrary key (string, number, object, etc.) into an integer, which is then compressed via the modulo operation to produce a bucket index within the table bounds. The ideal hash table provides O(1) average-case time complexity for insertion, deletion, and lookup — making it one of the most efficient and widely used data structures in computer science.
        </p>
        <p>
          The fundamental challenge of hash tables is the <strong>collision problem</strong>: when two different keys produce the same bucket index (an inevitable outcome when the key space is larger than the bucket space), the hash table must resolve the conflict without losing data or degrading performance excessively. Two primary collision resolution strategies dominate: <strong>chaining</strong> (each bucket stores a linked list of entries that collide at that index) and <strong>open addressing</strong> (all entries are stored within the table itself, and collisions are resolved by probing for the next available slot using a deterministic sequence).
        </p>
        <p>
          For staff and principal engineers, hash tables extend far beyond the basic textbook implementation. Understanding hash function design (cryptographic vs. non-cryptographic, universal hashing, murmur hash, xxHash), collision resolution trade-offs (chaining&apos;s pointer overhead vs. open addressing&apos;s cache friendliness), load factor management (when to resize, how to resize incrementally without latency spikes), concurrent hash table design (lock-free, striped locks, epoch-based reclamation), and the interaction between hash table structure and modern CPU cache hierarchies is essential for building high-performance systems. Hash tables are the backbone of database indexes, compiler symbol tables, distributed caching systems (Memcached, Redis), language runtime dictionaries (Python dict, JavaScript object), and network routing tables.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <h3>Hash Functions and Their Properties</h3>
        <p>
          A hash function maps an arbitrary key to a fixed-size integer (the hash code). A good hash function for hash tables must satisfy three critical properties: it must be <strong>deterministic</strong> (the same key always produces the same hash code), it must distribute keys <strong>uniformly</strong> across the bucket space (minimizing collisions for typical input distributions), and it must be <strong>fast to compute</strong> (ideally O(key length) with a small constant factor). Additionally, for some applications, the hash function should be <strong>avalanche</strong> — a small change in the input key (even a single bit) should produce a drastically different hash code, ensuring that similar keys do not cluster in adjacent buckets.
        </p>
        <p>
          The hash code is then compressed to a bucket index via the modulo operation: <code>index = hash(key) % capacity</code>. When the capacity is a power of two, this can be optimized to a bitwise AND: <code>index = hash(key) &amp; (capacity - 1)</code>, which is faster than integer division. However, this optimization requires the hash function itself to provide good distribution across all bit positions — a poorly designed hash function may produce hash codes that differ only in the high-order bits, causing all keys to cluster in a few buckets when the mask is applied.
        </p>
        <p>
          Common non-cryptographic hash functions used in production include MurmurHash3 (excellent distribution, fast, used in many hash table implementations), xxHash (extremely fast, good distribution, used in databases and file systems), and CityHash/FarmHash (Google&apos;s family of hash functions optimized for string keys). Cryptographic hash functions (SHA-256, MD5) are too slow for hash table use and are reserved for security applications where collision resistance against adversarial input is required.
        </p>

        <h3>Chaining: Collision Resolution via Linked Lists</h3>
        <p>
          In the chaining approach, each bucket in the hash table points to the head of a linked list (or, in optimized implementations, a balanced tree or sorted array) containing all entries that hash to that bucket. When inserting a new entry, the hash function determines the bucket index, and the entry is prepended to the chain at that bucket (O(1) insertion). When looking up a key, the hash function determines the bucket index, and the chain at that bucket is traversed sequentially, comparing each entry&apos;s key against the target key.
        </p>
        <p>
          The average chain length is the <strong>load factor</strong> α = n/m, where n is the number of entries and m is the number of buckets. When α ≤ 1, the average chain length is at most 1, and lookups are effectively O(1). As α increases beyond 1, average chain length increases linearly, degrading lookup performance to O(1 + α). The worst-case scenario — all n keys colliding at the same bucket — produces a chain of length n, degrading all operations to O(n). This worst case is mitigated by using a good hash function that distributes keys uniformly and by resizing the table (increasing m) when α exceeds a threshold (typically 0.75 for open addressing, or higher for chaining since chains can grow without reallocating the table).
        </p>
        <p>
          Java 8+ HashMap optimizes chaining by converting a chain to a balanced red-black tree when the chain length exceeds a threshold (TREEIFY_THRESHOLD = 8). This bounds the worst-case lookup time for a heavily-collided bucket to O(log n) instead of O(n), providing protection against adversarial inputs that deliberately create hash collisions (a denial-of-service attack vector).
        </p>

        <h3>Open Addressing: All Entries in the Table</h3>
        <p>
          In open addressing, all entries are stored directly in the hash table array — there are no external chains. When inserting a key and its target bucket is occupied, the algorithm follows a <strong>probe sequence</strong> to find the next available slot. The probe sequence is a deterministic function of the key and the probe number: <code>h(k, i)</code> gives the bucket to check at the i-th probe. The three main probe sequences are:
        </p>
        <p>
          <strong>Linear probing</strong> uses <code>h(k, i) = (h(k) + i) % m</code>. It checks consecutive slots (h(k), h(k)+1, h(k)+2, ...) until an empty slot is found. Linear probing has excellent cache performance (sequential memory access pattern) and is the simplest to implement. However, it suffers from <strong>primary clustering</strong>: consecutive blocks of occupied slots grow longer over time, increasing the average probe length for keys that hash into the cluster. When the load factor exceeds ~0.7, performance degrades rapidly.
        </p>
        <p>
          <strong>Quadratic probing</strong> uses <code>h(k, i) = (h(k) + c₁i + c₂i²) % m</code>. The quadratic step size spreads out the probe sequence, reducing primary clustering. However, it can suffer from <strong>secondary clustering</strong>: two keys that hash to the same initial bucket follow the same probe sequence. Quadratic probing also has a limitation: it may not find an empty slot even if one exists (it does not guarantee a full permutation of the table), unless the table size is prime and the quadratic constants are carefully chosen.
        </p>
        <p>
          <strong>Double hashing</strong> uses <code>h(k, i) = (h₁(k) + i × h₂(k)) % m</code>. It employs a second hash function to determine the step size, giving each key a unique probe sequence (eliminating both primary and secondary clustering). Double hashing provides the best distribution among open addressing strategies but requires two hash computations per lookup. The second hash function must never return 0 (to avoid a zero step size) and should be chosen to be relatively prime to the table size (ensuring all slots are reachable).
        </p>

        <ArticleImage svgContent={hashFunctionMappingSVG} caption="Hash function mapping arbitrary keys to bucket indices, showing collision when two keys produce the same index" />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Load Factor and Resizing</h3>
        <p>
          The <strong>load factor</strong> α = n/m (entries divided by buckets) is the primary metric that determines when a hash table should resize. As α increases, the probability of collisions increases, degrading operation performance. Most hash table implementations set a maximum load factor threshold (commonly 0.75 for open addressing, 0.75-1.0 for chaining) and trigger a resize when this threshold is exceeded.
        </p>
        <p>
          Resizing involves allocating a new table (typically doubling the capacity), rehashing every entry from the old table into the new table, and replacing the old table reference with the new one. The rehash step is O(n) because every entry must be rehashed (the bucket index changes when the modulo divisor changes). However, using amortized analysis (identical to dynamic array resizing), the amortized cost per insertion remains O(1) because resizes occur infrequently (only when the table is half-full, then quarter-full, etc.).
        </p>
        <p>
          In latency-sensitive systems (real-time trading, interactive applications, network packet processing), the O(n) resize operation causes a latency spike that is unacceptable. These systems use <strong>incremental resizing</strong>: instead of rehashing all entries at once, the table maintains both old and new tables simultaneously, and each insert/delete/lookup operation migrates a small number of entries from the old table to the new table. Over the course of many operations, all entries are migrated, and the old table is discarded. This approach eliminates the resize latency spike at the cost of increased space usage (both tables coexist during migration) and algorithmic complexity.
        </p>

        <h3>Deletion in Open Addressing</h3>
        <p>
          Deletion in open addressing is more complex than in chaining. Simply removing an entry and marking its slot as empty breaks the probe sequence for other entries: a lookup for a key that was inserted after the deleted entry (and whose probe sequence passed through the deleted entry&apos;s slot) would terminate prematurely at the now-empty slot, incorrectly concluding that the key does not exist.
        </p>
        <p>
          The solution is to mark deleted slots as <strong>tombstones</strong> (a special marker indicating &quot;this slot was deleted&quot;) rather than truly empty. During lookup, tombstones are treated as occupied (the probe continues past them), but during insertion, tombstones are treated as available slots (the new entry can be placed there). Over time, tombstones accumulate and degrade performance (increasing the effective load factor). Periodic rehashing (building a fresh table without tombstones) is needed to reclaim space.
        </p>
        <p>
          Alternatively, some implementations use <strong>Robin Hood hashing</strong>, which rebalances probe lengths during insertion by swapping entries so that all entries have approximately equal probe distances from their home buckets. Robin Hood hashing reduces the variance in probe lengths, improving lookup performance and making deletion simpler (standard deletion with backward shift deletion can be used without tombstones).
        </p>

        <ArticleImage svgContent={chainingCollisionSVG} caption="Chaining collision resolution showing linked lists at each bucket for entries that hash to the same index" />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <h3>Chaining versus Open Addressing</h3>
        <p>
          Chaining and open addressing represent a fundamental trade-off between space efficiency, cache performance, and implementation complexity. Chaining uses O(n + m) space (n entries plus m bucket pointers, plus n linked list node allocations) and handles high load factors gracefully (chains simply grow longer). Open addressing uses O(m) space (entries stored directly in the table, no external allocations) and has better cache performance (sequential access during probing) but degrades rapidly when the load factor exceeds ~0.7 (probe lengths grow exponentially due to clustering).
        </p>
        <p>
          Chaining is the default choice for general-purpose hash tables (Java HashMap, Python dict, Ruby Hash) because it handles arbitrary load factors, supports deletion without tombstones, and is simpler to implement correctly. Open addressing is preferred for high-performance, low-latency systems (CPU caches, database indexes, compiler symbol tables) where cache performance is paramount and the load factor can be kept below 0.7 through proactive resizing.
        </p>
        <p>
          In terms of worst-case performance, chaining with tree-based chains (Java 8+ HashMap) guarantees O(log n) lookup even under adversarial collision, while open addressing with Robin Hood hashing guarantees O(log n) average lookup with bounded probe lengths. Neither approach guarantees O(1) worst-case — that requires perfect hashing (a hash function with zero collisions for a known key set), which is only practical for static key sets.
        </p>

        <h3>Hash Tables versus Balanced BSTs</h3>
        <p>
          Hash tables provide O(1) average-case operations but O(n) worst-case (all keys collide). Balanced BSTs (Red-Black trees, AVL trees) provide O(log n) guaranteed worst-case operations but are slower on average due to pointer chasing and tree traversal overhead. Hash tables do not maintain key ordering (iteration order is arbitrary), while BSTs support ordered iteration, range queries, and order-statistic operations.
        </p>
        <p>
          The choice is dictated by requirements: use hash tables when O(1) average-case performance and unordered key-value storage are acceptable; use BSTs when ordered iteration, range queries, or guaranteed O(log n) worst-case performance are needed. Many production systems use hybrid approaches: Java 8+ HashMap uses chaining with tree-based fallback (BST for collided chains), and database indexes use B+ Trees (a BST variant) for ordered access with range scan support.
        </p>

        <ArticleImage svgContent={openAddressingSVG} caption="Open addressing collision resolution strategies: linear probing, quadratic probing, and double hashing" />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Choose the hash table implementation based on your workload: chaining for general-purpose use with unpredictable key distributions and mixed read/write operations; open addressing (linear probing) for read-heavy workloads where cache performance is critical and the load factor can be kept below 0.7; double hashing for write-heavy workloads with open addressing where clustering must be minimized. For latency-sensitive applications, use incremental resizing to eliminate resize-induced latency spikes.
        </p>
        <p>
          Use a high-quality non-cryptographic hash function (MurmurHash3, xxHash, CityHash) for general-purpose hashing. Avoid using the identity hash function (key itself as hash code) for integer keys, as it causes predictable clustering when the key space has patterns (e.g., sequential IDs, page-aligned addresses). Instead, apply a mixing function (e.g., MurmurHash3 finalizer: x ^= x >> 16; x *= 0x85ebca6b; x ^= x >> 13; x *= 0xc2b2ae35; x ^= x >> 16) to spread bits uniformly.
        </p>
        <p>
          Set the initial capacity based on the expected number of entries to avoid unnecessary resizing. If you know the hash table will hold approximately 10,000 entries and the load factor threshold is 0.75, set the initial capacity to 10,000 / 0.75 ≈ 13,333 (rounded up to the next power of two: 16,384). This single sizing decision eliminates 2-3 resize operations during the table&apos;s growth, saving O(n) rehashing work and reducing memory fragmentation.
        </p>
        <p>
          For concurrent hash tables in high-throughput systems, avoid a single global lock. Use <strong>lock striping</strong> (Java ConcurrentHashMap): divide the table into segments (e.g., 16 segments), each with its own lock, and route operations to the appropriate segment based on the key&apos;s hash. This allows up to 16 concurrent operations on different segments. For maximum throughput, use a lock-free concurrent hash table (e.g., Cliff Click&apos;s NonBlockingHashMap) that uses CAS operations on individual buckets, enabling true wait-free concurrent access.
        </p>
        <p>
          When using open addressing, prefer <strong>Robin Hood hashing</strong> over linear probing for production systems. Robin Hood hashing reduces probe length variance by swapping entries during insertion so that all entries are approximately equidistant from their home buckets. This results in faster average lookups (shorter probe sequences) and simpler deletion (backward shift deletion without tombstones). Robin Hood hashing is used in Rust&apos;s hashbrown (the default HashMap implementation) and in several high-performance database engines.
        </p>

        <ArticleImage svgContent={hashTableResizingSVG} caption="Hash table resizing showing rehashing of all entries from old table to new table with doubled capacity" />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most critical pitfall is <strong>using a poor hash function that causes excessive collisions</strong>. A common mistake is using a hash function that only considers the first few characters of a string key (e.g., the first 4 bytes), causing keys with common prefixes (URLs, file paths, database column names) to collide heavily. This degrades lookup performance from O(1) to O(n) for the collided bucket, which in production manifests as intermittent latency spikes that are extremely difficult to diagnose because they occur only for specific key patterns.
        </p>
        <p>
          <strong>Hash DoS attacks</strong> exploit predictable hash functions to create deliberate collisions. If an attacker can determine the hash function used by a web application, they can craft thousands of keys that all hash to the same bucket, degrading the application&apos;s hash table from O(1) to O(n) per operation, causing a denial of service through CPU exhaustion. This attack was demonstrated against multiple web frameworks (Ruby on Rails, Python Django, Java Servlet containers) in 2011-2012. Mitigations include randomizing the hash function&apos;s seed at application startup (so the attacker cannot predict hash codes), using universal hashing (a family of hash functions with a random choice at runtime), and limiting chain lengths (converting long chains to trees).
        </p>
        <p>
          <strong>Resizing-induced latency spikes</strong> are a common operational issue. When a hash table grows beyond its load factor threshold and triggers a resize, the O(n) rehash operation blocks all other operations (in a single-threaded implementation) or holds a global lock (in a concurrent implementation), causing a latency spike that can be orders of magnitude higher than normal operations. In a system handling 100,000 requests per second, a resize of a 1-million-entry hash table can cause a 100ms+ pause that cascades through the system as request timeouts and retry storms. Incremental resizing or pre-sizing the table eliminates this issue.
        </p>
        <p>
          <strong>Memory fragmentation in chaining implementations</strong> occurs because each chain node is allocated separately on the heap, scattering nodes across memory and increasing the memory allocator&apos;s internal fragmentation. For hash tables with millions of entries, the per-node allocation overhead (8-16 bytes per malloc metadata) can add up to significant memory waste. Mitigation strategies include using array-based chains (storing chain entries in a pre-allocated array rather than individually allocated nodes) or switching to open addressing to eliminate external allocations entirely.
        </p>
        <p>
          <strong>Tombstone accumulation in open addressing</strong> degrades performance over time. Each deleted entry leaves a tombstone that must be skipped during lookup, increasing the effective probe length. In a write-heavy workload with frequent deletions, the table can become filled with tombstones, causing probe lengths to grow even though the number of live entries is small. Periodic rehashing (building a fresh table without tombstones) is required to reclaim performance, but this introduces the same O(n) latency spike as resizing. Robin Hood hashing with backward shift deletion eliminates tombstones entirely.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Language runtime dictionaries</strong> are among the most heavily optimized hash table implementations. Python&apos;s <code>dict</code> uses a hash table with open addressing (pseudo-random probing) and has been extensively optimized for memory efficiency and lookup speed. The dict implementation stores keys and values in separate arrays (improving cache locality for value-only access), uses a sparse index array for the probe table (reducing memory for small dicts), and implements a compact representation for dicts created from keyword arguments (sharing a common key structure across instances). JavaScript engines (V8, SpiderMonkey, JavaScriptCore) use similar optimizations for object property storage, where hash tables handle dynamic property access and hidden classes (maps) handle predictable property layouts.
        </p>
        <p>
          <strong>Distributed caching systems</strong> (Memcached, Redis) use hash tables as their core data structure for key-value storage. Memcached uses a hash table with chaining to store cached objects, and uses a slab allocator to manage memory efficiently (pre-allocating memory in fixed-size chunks to avoid fragmentation). Redis uses a hash table with chaining (and rehashing using incremental resizing) as the underlying structure for its dictionary type, and implements a two-table incremental resize scheme to avoid blocking the event loop during resize operations.
        </p>
        <p>
          <strong>Database query execution</strong> uses hash tables extensively for hash joins and hash aggregation. In a hash join, the smaller relation is loaded into a hash table keyed on the join column, and the larger relation is probed against this hash table — achieving O(n + m) join time instead of O(n × m) for a nested-loop join. In hash aggregation, groups are tracked in a hash table keyed on the grouping columns, and aggregate values (sum, count, average) are updated incrementally as each row is processed. These hash table operations are the performance bottleneck in analytical query processing, and database engines use specialized hash table implementations (e.g., partitioned hash tables for cache-conscious processing) to maximize throughput.
        </p>
        <p>
          <strong>Compiler symbol tables</strong> use hash tables to track variable names, function names, and type definitions during compilation. The hash table maps identifier names (strings) to their associated metadata (type, scope, memory location). During parsing, each identifier is looked up in the symbol table to resolve its declaration and check for type consistency. Hash tables are ideal for this use case because identifier lookups are extremely frequent (every variable reference, every function call) and O(1) lookup time is critical for compilation speed.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <h3>1. How does a hash table handle collisions? Compare chaining and open addressing in detail.</h3>
        <p>
          A hash table handles collisions (two different keys producing the same bucket index) through one of two primary strategies: chaining or open addressing. In chaining, each bucket points to a linked list (or similar structure) containing all entries that hash to that bucket. Insertion prepends the new entry to the chain (O(1)), lookup traverses the chain comparing keys (O(1 + α) average, O(n) worst case), and deletion removes the entry from the chain (O(1 + α) average). Chaining handles arbitrary load factors gracefully and supports deletion without special markers. Its space overhead is O(n + m) for n entries and m buckets, plus per-node allocation overhead.
        </p>
        <p>
          In open addressing, all entries are stored directly in the table array. When a collision occurs, the algorithm probes for the next available slot using a deterministic sequence (linear probing: consecutive slots; quadratic probing: quadratically increasing step sizes; double hashing: a second hash function determines the step size). Insertion probes until an empty slot is found (O(1/(1-α)) average), lookup probes until the key is found or an empty slot is encountered (O(1/(1-α)) average), and deletion marks the slot as a tombstone (to preserve probe sequences for other entries). Open addressing has better cache performance (sequential memory access) but degrades rapidly when the load factor exceeds ~0.7 due to clustering effects.
        </p>
        <p>
          The choice depends on the workload: chaining for general-purpose use with unpredictable key distributions; open addressing for read-heavy, latency-sensitive workloads where cache performance is critical. Modern implementations often use hybrid approaches: Java 8+ HashMap uses chaining with tree-based fallback for collided chains, and Rust&apos;s hashbrown uses open addressing with Robin Hood hashing for optimal cache performance and bounded probe lengths.
        </p>

        <h3>2. What makes a good hash function? Discuss universal hashing and its role in preventing Hash DoS attacks.</h3>
        <p>
          A good hash function for hash tables must be deterministic, uniformly distributing keys across the bucket space, fast to compute, and exhibiting the avalanche property (small input changes produce drastically different outputs). The hash function should also be resistant to adversarial inputs — an attacker should not be able to craft keys that all collide at the same bucket.
        </p>
        <p>
          <strong>Universal hashing</strong> is a family of hash functions where, for any two distinct keys, the probability that they collide (hash to the same bucket) is at most 1/m (the same as if the keys were assigned to buckets uniformly at random). The hash function is chosen randomly from this family at application startup (using a random seed), making it impossible for an attacker to predict which keys will collide. Even if the attacker knows the family of hash functions, the random seed determines which specific function is used, and without knowing the seed, the attacker cannot craft colliding keys.
        </p>
        <p>
          A simple universal hash function for integer keys is <code>h(k) = ((a × k + b) % p) % m</code> where p is a prime larger than the key space, and a and b are randomly chosen from {1, ..., p-1} and {0, ..., p-1} respectively. For string keys, the seed is incorporated into the hash computation (e.g., as the initial value of the hash state or as an XOR mask applied to the final hash code). Python, Java, and Ruby all randomize their string hash functions at startup to prevent Hash DoS attacks.
        </p>
        <p>
          Additional mitigations against Hash DoS include: limiting chain lengths (converting chains longer than a threshold to balanced trees, as in Java 8+ HashMap), rate-limiting requests with many hash collisions, and using cryptographic hash functions (HMAC with a secret key) for hash tables exposed to untrusted input. The combination of universal hashing and chain-length limiting provides strong protection against both accidental and adversarial collision patterns.
        </p>

        <h3>3. How would you design a concurrent hash table that supports high-throughput reads and writes?</h3>
        <p>
          Designing a concurrent hash table requires balancing concurrency, correctness, and performance. The simplest approach is a global mutex protecting the entire table — correct but not scalable (only one operation at a time). A better approach is <strong>lock striping</strong> (used in Java ConcurrentHashMap): divide the hash table into N segments (e.g., 16), each with its own lock, and route operations to the appropriate segment based on the key&apos;s hash code. This allows up to N concurrent operations on different segments, providing N× throughput improvement over a global lock. Lock striping is simple to implement and works well for moderate concurrency levels.
        </p>
        <p>
          For maximum throughput, use a <strong>lock-free hash table</strong> that relies on CAS (compare-and-swap) operations for bucket-level synchronization. Cliff Click&apos;s NonBlockingHashMap is the canonical implementation: each bucket is an atomic reference, and insert/update/delete operations use CAS to modify bucket contents without acquiring locks. Reads are completely lock-free (they traverse the chain or probe sequence without synchronization), and writes use retry loops with CAS to resolve conflicts. This design provides wait-free reads and lock-free writes, achieving near-linear scalability with core count.
        </p>
        <p>
          The most challenging aspect of concurrent hash table design is resizing: migrating entries from the old table to the new table without blocking concurrent operations. Solutions include: (a) helping protocol — any thread that encounters a resize in progress helps migrate entries before proceeding with its own operation; (b) epoch-based reclamation — old tables are not freed until all threads that might reference them have completed their operations; (c) incremental resizing — each operation migrates a small number of entries, spreading the resize cost across many operations. The helping protocol ensures that resize completes quickly (all threads contribute to the work) without blocking any individual operation for more than O(1) time.
        </p>

        <h3>4. Explain how incremental resizing works and why it is needed in real-time systems.</h3>
        <p>
          Incremental resizing eliminates the O(n) latency spike caused by traditional hash table resizing (which rehashes all entries at once). Instead of blocking all operations during the resize, the table maintains both the old table and the new table simultaneously, and each operation (insert, delete, lookup) migrates a small batch of entries (e.g., 2-4) from the old table to the new table as part of its normal processing. Over the course of many operations, all entries are gradually migrated, and the old table is eventually discarded.
        </p>
        <p>
          The implementation tracks a <code>migrateIndex</code> pointing to the next bucket in the old table that needs migration. Each operation first checks if the old table still has entries to migrate; if so, it migrates the batch of entries starting at <code>migrateIndex</code> and advances the index. Lookups check both the new table and the old table (starting from <code>migrateIndex</code>, since entries before that index have already been migrated). Inserts always go into the new table (since the old table is being phased out). Deletions check both tables and remove from whichever table contains the entry.
        </p>
        <p>
          The key invariant is: an entry is always found in either the new table or the old table (but not both). This ensures that lookups always find the correct entry regardless of the migration state. The migration cost per operation is O(batch_size), which is a small constant, eliminating the latency spike. The total migration cost is still O(n) (all entries must be rehashed), but it is amortized across O(n/batch_size) operations rather than concentrated in a single operation.
        </p>
        <p>
          Incremental resizing is essential in real-time systems (network packet processing, trading platforms, interactive applications) where a 100ms pause caused by a resize operation would cause packet drops, missed trade opportunities, or UI freezes. Redis uses incremental resizing for this reason: its single-threaded event loop cannot afford to block for rehashing, so it migrates entries gradually across multiple event loop iterations.
        </p>

        <h3>5. How would you implement an LRU cache using a hash table? What is the time complexity of each operation?</h3>
        <p>
          An LRU (Least Recently Used) cache combines a hash table with a doubly linked list to achieve O(1) get and put operations while maintaining access-order eviction. The hash table maps keys to node pointers in the doubly linked list. The doubly linked list is ordered by recency of access: the most recently accessed item is at the head (MRU), and the least recently accessed item is at the tail (LRU).
        </p>
        <p>
          For <code>get(key)</code>: look up the key in the hash table. If absent, return -1. If present, the hash table returns a pointer to the corresponding node in the doubly linked list. Remove this node from its current position (O(1) in a doubly linked list given the node pointer) and reinsert it at the head of the list (O(1)). Return the node&apos;s value. This moves the accessed key to the MRU position, ensuring it will not be the next eviction candidate.
        </p>
        <p>
          For <code>put(key, value)</code>: if the key exists, update its value and move it to the head (same as get). If it is a new key and the cache is at capacity, remove the tail node (the LRU entry) from the doubly linked list (O(1)) and delete its key from the hash table (O(1)). Then create a new node with the key and value, insert it at the head of the list (O(1)), and add the key-to-node mapping to the hash table (O(1)).
        </p>
        <p>
          Both operations are O(1) because every sub-operation is O(1): hash table lookup/insert/delete is O(1) average, doubly linked list insertion/removal at a known position is O(1). The doubly linked list is essential: a singly linked list could not remove an arbitrary node in O(1) without a predecessor search, which would degrade the operation to O(n). The hash table is essential: without it, finding a key in the linked list would require O(n) traversal.
        </p>

        <h3>6. What is Robin Hood hashing and how does it improve upon linear probing?</h3>
        <p>
          Robin Hood hashing is an open addressing variant that reduces the variance in probe lengths across all entries in the hash table. In standard linear probing, entries inserted early (when the table is empty) have short probe lengths (often 0), while entries inserted later (when the table is partially full) may have long probe lengths due to clustering. This variance in probe lengths means that some lookups are very fast while others are very slow, increasing the tail latency of the hash table.
        </p>
        <p>
          Robin Hood hashing addresses this by &quot;stealing&quot; slots from entries that are close to their home buckets and giving them to entries that are far from their home buckets. During insertion, if the algorithm encounters an entry whose probe distance from its home bucket is less than the current entry&apos;s probe distance, the two entries are swapped: the current entry takes the slot, and the displaced entry continues probing for a new slot. This ensures that all entries have approximately equal probe distances, minimizing the maximum probe length and making lookup times more predictable.
        </p>
        <p>
          The benefits of Robin Hood hashing are: (a) reduced variance in probe lengths, which improves tail latency (the 99th percentile lookup time is closer to the median); (b) simpler deletion using backward shift deletion (no tombstones needed): when an entry is deleted, entries after it in the probe sequence are shifted backward to fill the gap, maintaining the invariant that all entries are as close to their home buckets as possible; (c) better performance at high load factors (up to 0.9) compared to linear probing (which degrades rapidly above 0.7).
        </p>
        <p>
          Robin Hood hashing is used in production systems where predictable latency is critical: Rust&apos;s hashbrown (the default HashMap implementation), several database engines, and high-performance networking libraries. The trade-off is slightly more complex insertion logic (the swap-and-continue probing loop) and slightly higher average insertion cost (due to swaps), but the improvement in lookup predictability and high-load-factor performance makes it the preferred choice for production hash tables.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li>Cormen, T.H., Leiserson, C.E., Rivest, R.L., Stein, C. — &quot;Introduction to Algorithms&quot; — MIT Press, 4th Edition, Chapter 11 (Hash Tables)</li>
          <li>Knuth, D.E. — &quot;The Art of Computer Programming, Volume 3: Sorting and Searching&quot; — Addison-Wesley, 2nd Edition, Section 6.4</li>
          <li>Carter, J.L., Wegman, M.N. — &quot;Universal Classes of Hash Functions&quot; — Journal of Computer and System Sciences, Vol. 18, 1979</li>
          <li>Celise, P. — &quot;Robin Hood Hashing&quot; — Technical Report, 2015 (analysis of probe length variance reduction)</li>
          <li>Click, C. — &quot;NonBlocking HashMap&quot; — Azulus Systems, 2007 (lock-free concurrent hash table design)</li>
          <li>Leis, M., Kemper, A., Neumann, T. — &quot;The Adaptive Radix Tree: ARTful Indexing for Main-Memory Databases&quot; — ICDE 2013 (hash table alternatives for database indexing)</li>
          <li>Facebook Engineering Blog — &quot;F14: Facebook&apos;s Next-Generation Hash Table&quot; — 2019 (production hash table optimizations at scale)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

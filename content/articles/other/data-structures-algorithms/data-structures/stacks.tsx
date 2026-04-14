"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-data-structures-stacks",
  title: "Stacks",
  description:
    "Comprehensive guide to stacks: LIFO semantics, call stack mechanics, monotonic stacks, lock-free concurrent stacks, bounded vs unbounded trade-offs, stack canaries, and production-scale patterns for staff and principal engineer interviews.",
  category: "other",
  subcategory: "data-structures-algorithms/data-structures",
  slug: "stacks",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-14",
  tags: ["data-structures", "stacks", "lifo", "call-stack"],
  relatedTopics: ["queues", "singly-linked-lists", "arrays"],
};

const stackOperationsSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .elem-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .elem-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .new-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .new-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
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
  <rect class="bg-light" width="800" height="320" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="320" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Stack Operations — Push, Pop, Peek (LIFO)</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Stack Operations — Push, Pop, Peek (LIFO)</text>
  <text x="200" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Push(50) — O(1)</text>
  <text x="200" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Push(50) — O(1)</text>
  <text x="400" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Pop() → 50 — O(1)</text>
  <text x="400" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Pop() → 50 — O(1)</text>
  <text x="600" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Peek() → 30 — O(1)</text>
  <text x="600" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Peek() → 30 — O(1)</text>
  <g transform="translate(120, 80)">
    <rect x="0" y="120" width="80" height="30" class="elem-light"/>
    <rect x="0" y="120" width="80" height="30" class="elem-dark" style="display:none;"/>
    <text x="40" y="140" text-anchor="middle" font-size="12" class="text-light">10</text>
    <text x="40" y="140" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">10</text>
    <rect x="0" y="90" width="80" height="30" class="elem-light"/>
    <rect x="0" y="90" width="80" height="30" class="elem-dark" style="display:none;"/>
    <text x="40" y="110" text-anchor="middle" font-size="12" class="text-light">20</text>
    <text x="40" y="110" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">20</text>
    <rect x="0" y="60" width="80" height="30" class="elem-light"/>
    <rect x="0" y="60" width="80" height="30" class="elem-dark" style="display:none;"/>
    <text x="40" y="80" text-anchor="middle" font-size="12" class="text-light">30</text>
    <text x="40" y="80" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">30</text>
    <rect x="0" y="30" width="80" height="30" class="new-light"/>
    <rect x="0" y="30" width="80" height="30" class="new-dark" style="display:none;"/>
    <text x="40" y="50" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">50</text>
    <text x="40" y="50" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">50</text>
    <text x="40" y="10" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">top</text>
    <text x="40" y="10" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">top</text>
    <path d="M 40 15 L 40 28" class="arrow-light"/>
    <path d="M 40 15 L 40 28" class="arrow-dark" style="display:none;"/>
  </g>
  <g transform="translate(320, 80)">
    <rect x="0" y="120" width="80" height="30" class="elem-light"/>
    <rect x="0" y="120" width="80" height="30" class="elem-dark" style="display:none;"/>
    <text x="40" y="140" text-anchor="middle" font-size="12" class="text-light">10</text>
    <text x="40" y="140" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">10</text>
    <rect x="0" y="90" width="80" height="30" class="elem-light"/>
    <rect x="0" y="90" width="80" height="30" class="elem-dark" style="display:none;"/>
    <text x="40" y="110" text-anchor="middle" font-size="12" class="text-light">20</text>
    <text x="40" y="110" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">20</text>
    <rect x="0" y="60" width="80" height="30" class="elem-light"/>
    <rect x="0" y="60" width="80" height="30" class="elem-dark" style="display:none;"/>
    <text x="40" y="80" text-anchor="middle" font-size="12" class="text-light">30</text>
    <text x="40" y="80" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">30</text>
    <text x="40" y="35" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">top</text>
    <text x="40" y="35" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">top</text>
    <path d="M 40 40 L 40 58" class="arrow-light"/>
    <path d="M 40 40 L 40 58" class="arrow-dark" style="display:none;"/>
    <text x="120" y="35" text-anchor="middle" font-size="14" font-weight="bold" class="subtext-light">returns 50</text>
    <text x="120" y="35" text-anchor="middle" font-size="14" font-weight="bold" class="subtext-dark" style="display:none;">returns 50</text>
  </g>
  <g transform="translate(520, 80)">
    <rect x="0" y="120" width="80" height="30" class="elem-light"/>
    <rect x="0" y="120" width="80" height="30" class="elem-dark" style="display:none;"/>
    <text x="40" y="140" text-anchor="middle" font-size="12" class="text-light">10</text>
    <text x="40" y="140" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">10</text>
    <rect x="0" y="90" width="80" height="30" class="elem-light"/>
    <rect x="0" y="90" width="80" height="30" class="elem-dark" style="display:none;"/>
    <text x="40" y="110" text-anchor="middle" font-size="12" class="text-light">20</text>
    <text x="40" y="110" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">20</text>
    <rect x="0" y="60" width="80" height="30" class="elem-light"/>
    <rect x="0" y="60" width="80" height="30" class="elem-dark" style="display:none;"/>
    <text x="40" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">30</text>
    <text x="40" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">30</text>
    <text x="40" y="35" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">top</text>
    <text x="40" y="35" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">top</text>
    <path d="M 40 40 L 40 58" class="arrow-light"/>
    <path d="M 40 40 L 40 58" class="arrow-dark" style="display:none;"/>
    <text x="120" y="80" text-anchor="middle" font-size="14" font-weight="bold" class="subtext-light">returns 30</text>
    <text x="120" y="80" text-anchor="middle" font-size="14" font-weight="bold" class="subtext-dark" style="display:none;">returns 30</text>
  </g>
  <text x="400" y="250" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">LIFO Invariant: Last element pushed is always the first element popped</text>
  <text x="400" y="250" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">LIFO Invariant: Last element pushed is always the first element popped</text>
  <text x="400" y="270" text-anchor="middle" font-size="11" class="subtext-light">Push: top++ then write | Pop: read then top-- | Peek: read stack[top] without modifying top</text>
  <text x="400" y="270" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Push: top++ then write | Pop: read then top-- | Peek: read stack[top] without modifying top</text>
  <text x="400" y="290" text-anchor="middle" font-size="11" class="subtext-light">All operations access only the top element — no traversal, no indexing, no search. O(1) guaranteed.</text>
  <text x="400" y="290" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">All operations access only the top element — no traversal, no indexing, no search. O(1) guaranteed.</text>
  <text x="400" y="310" text-anchor="middle" font-size="11" class="subtext-light">Green = newly pushed element | Blue = existing elements | Arrow = top pointer</text>
  <text x="400" y="310" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Green = newly pushed element | Blue = existing elements | Arrow = top pointer</text>
</svg>
`;

const callStackSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .frame-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .frame-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .active-light { fill: #fef3c7; stroke: #d97706; stroke-width: 3; }
      .active-dark { fill: #451a03; stroke: #fbbf24; stroke-width: 3; }
      .text-light { fill: #1e293b; }
      .text-dark { fill: #f1f5f9; }
      .subtext-light { fill: #475569; }
      .subtext-dark { fill: #94a3b8; }
      .arrow-light { stroke: #dc2626; stroke-width: 2; fill: none; marker-end: url(#arrow-light); }
      .arrow-dark { stroke: #f87171; stroke-width: 2; fill: none; marker-end: url(#arrow-dark); }
    </style>
    <marker id="arrow-light" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626"/>
    </marker>
    <marker id="arrow-dark" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#f87171"/>
    </marker>
  </defs>
  <rect class="bg-light" width="800" height="400" rx="8" style="display:none;"/>
  <rect class="bg-dark" width="800" height="400" rx="8" style="display:none;"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Call Stack — Function Call Frames and Return Addresses</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Call Stack — Function Call Frames and Return Addresses</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Each function call pushes a frame onto the stack. Return pops the frame. Stack overflow when limit exceeded.</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Each function call pushes a frame onto the stack. Return pops the frame. Stack overflow when limit exceeded.</text>
  <g transform="translate(100, 70)">
    <rect x="0" y="0" width="250" height="50" class="frame-light"/>
    <rect x="0" y="0" width="250" height="50" class="frame-dark" style="display:none;"/>
    <text x="125" y="20" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Frame: main()</text>
    <text x="125" y="20" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Frame: main()</text>
    <text x="125" y="38" text-anchor="middle" font-size="10" class="subtext-light">Return: program entry | Locals: x=5</text>
    <text x="125" y="38" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Return: program entry | Locals: x=5</text>
    <rect x="0" y="50" width="250" height="50" class="frame-light"/>
    <rect x="0" y="50" width="250" height="50" class="frame-dark" style="display:none;"/>
    <text x="125" y="70" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Frame: compute(n=3)</text>
    <text x="125" y="70" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Frame: compute(n=3)</text>
    <text x="125" y="88" text-anchor="middle" font-size="10" class="subtext-light">Return: line 42 in main | Locals: n=3, result=0</text>
    <text x="125" y="88" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Return: line 42 in main | Locals: n=3, result=0</text>
    <rect x="0" y="100" width="250" height="50" class="frame-light"/>
    <rect x="0" y="100" width="250" height="50" class="frame-dark" style="display:none;"/>
    <text x="125" y="120" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Frame: helper(n=2)</text>
    <text x="125" y="120" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Frame: helper(n=2)</text>
    <text x="125" y="138" text-anchor="middle" font-size="10" class="subtext-light">Return: line 15 in compute | Locals: n=2</text>
    <text x="125" y="138" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Return: line 15 in compute | Locals: n=2</text>
    <rect x="0" y="150" width="250" height="50" class="active-light"/>
    <rect x="0" y="150" width="250" height="50" class="active-dark" style="display:none;"/>
    <text x="125" y="170" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Frame: base_case(n=1) ← ACTIVE</text>
    <text x="125" y="170" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Frame: base_case(n=1) ← ACTIVE</text>
    <text x="125" y="188" text-anchor="middle" font-size="10" class="subtext-light">Return: line 8 in helper | Locals: n=1</text>
    <text x="125" y="188" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Return: line 8 in helper | Locals: n=1</text>
  </g>
  <text x="370" y="175" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">top</text>
  <text x="370" y="175" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">top</text>
  <path d="M 365 175 L 355 175" class="arrow-light"/>
  <path d="M 365 175 L 355 175" class="arrow-dark" style="display:none;"/>
  <g transform="translate(450, 70)">
    <rect x="0" y="0" width="300" height="200" rx="6" class="frame-light"/>
    <rect x="0" y="0" width="300" height="200" rx="6" class="frame-dark" style="display:none;"/>
    <text x="150" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Stack Frame Layout (per call)</text>
    <text x="150" y="25" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Stack Frame Layout (per call)</text>
    <text x="150" y="55" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">1. Return Address (8 bytes)</text>
    <text x="150" y="55" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">1. Return Address (8 bytes)</text>
    <text x="150" y="75" text-anchor="middle" font-size="11" class="subtext-light">Instruction pointer to resume after return</text>
    <text x="150" y="75" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Instruction pointer to resume after return</text>
    <text x="150" y="100" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">2. Saved Registers (callee-saved)</text>
    <text x="150" y="100" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">2. Saved Registers (callee-saved)</text>
    <text x="150" y="120" text-anchor="middle" font-size="11" class="subtext-light">RBX, RBP, R12-R15 on x86-64</text>
    <text x="150" y="120" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">RBX, RBP, R12-R15 on x86-64</text>
    <text x="150" y="145" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">3. Local Variables</text>
    <text x="150" y="145" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">3. Local Variables</text>
    <text x="150" y="165" text-anchor="middle" font-size="11" class="subtext-light">Function-scoped variables, temp storage</text>
    <text x="150" y="165" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Function-scoped variables, temp storage</text>
    <text x="150" y="190" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">4. Function Parameters (if spilled)</text>
    <text x="150" y="190" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">4. Function Parameters (if spilled)</text>
  </g>
  <text x="400" y="320" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Stack Overflow</text>
  <text x="400" y="320" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Stack Overflow</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-light">Occurs when call depth exceeds stack size limit (typically 1-8 MB). Causes: unbounded recursion, deep call chains, large stack-allocated arrays.</text>
  <text x="400" y="340" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Occurs when call depth exceeds stack size limit (typically 1-8 MB). Causes: unbounded recursion, deep call chains, large stack-allocated arrays.</text>
  <text x="400" y="360" text-anchor="middle" font-size="11" class="subtext-light">Prevention: convert recursion to iteration, use heap allocation for large data, increase stack size (ulimit), use tail-call optimization.</text>
  <text x="400" y="360" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Prevention: convert recursion to iteration, use heap allocation for large data, increase stack size (ulimit), use tail-call optimization.</text>
  <text x="400" y="385" text-anchor="middle" font-size="11" class="subtext-light">Each frame grows downward from high to low addresses on most architectures (x86-64, ARM). Stack pointer (RSP/SP) tracks the current top.</text>
  <text x="400" y="385" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Each frame grows downward from high to low addresses on most architectures (x86-64, ARM). Stack pointer (RSP/SP) tracks the current top.</text>
</svg>
`;

const monotonicStackSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .stack-light { fill: #e2e8f0; stroke: #475569; stroke-width: 2; }
      .stack-dark { fill: #334155; stroke: #94a3b8; stroke-width: 2; }
      .pop-light { fill: #fee2e2; stroke: #dc2626; stroke-width: 2; opacity: 0.5; }
      .pop-dark { fill: #450a0a; stroke: #f87171; stroke-width: 2; opacity: 0.5; }
      .push-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .push-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
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
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Monotonic Stack Pattern — Next Greater Element</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Monotonic Stack Pattern — Next Greater Element</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-light">Maintain decreasing order in stack. When current element > stack top, pop and record current as NGE for popped.</text>
  <text x="400" y="50" text-anchor="middle" font-size="12" class="subtext-dark" style="display:none;">Maintain decreasing order in stack. When current element > stack top, pop and record current as NGE for popped.</text>
  <text x="100" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Input: [4, 3, 2, 5, 1, 6]</text>
  <text x="100" y="80" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Input: [4, 3, 2, 5, 1, 6]</text>
  <text x="100" y="100" text-anchor="middle" font-size="11" class="subtext-light">Output: [5, 5, 5, 6, 6, -1]</text>
  <text x="100" y="100" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Output: [5, 5, 5, 6, 6, -1]</text>
  <g transform="translate(30, 120)">
    <text x="80" y="0" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">Processing: 4</text>
    <text x="80" y="0" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">Processing: 4</text>
    <rect x="40" y="60" width="80" height="30" class="push-light"/>
    <rect x="40" y="60" width="80" height="30" class="push-dark" style="display:none;"/>
    <text x="80" y="80" text-anchor="middle" font-size="12" class="text-light">4</text>
    <text x="80" y="80" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">4</text>
    <text x="80" y="105" text-anchor="middle" font-size="10" class="subtext-light">Push (stack empty)</text>
    <text x="80" y="105" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Push (stack empty)</text>
    <text x="240" y="0" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">Processing: 3</text>
    <text x="240" y="0" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">Processing: 3</text>
    <rect x="200" y="60" width="80" height="30" class="stack-light"/>
    <rect x="200" y="60" width="80" height="30" class="stack-dark" style="display:none;"/>
    <text x="240" y="80" text-anchor="middle" font-size="12" class="text-light">4</text>
    <text x="240" y="80" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">4</text>
    <rect x="200" y="30" width="80" height="30" class="push-light"/>
    <rect x="200" y="30" width="80" height="30" class="push-dark" style="display:none;"/>
    <text x="240" y="50" text-anchor="middle" font-size="12" class="text-light">3</text>
    <text x="240" y="50" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">3</text>
    <text x="240" y="105" text-anchor="middle" font-size="10" class="subtext-light">Push (3 &lt; 4, decreasing)</text>
    <text x="240" y="105" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Push (3 &lt; 4, decreasing)</text>
    <text x="400" y="0" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">Processing: 5</text>
    <text x="400" y="0" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">Processing: 5</text>
    <rect x="360" y="60" width="80" height="30" class="pop-light"/>
    <rect x="360" y="60" width="80" height="30" class="pop-dark" style="display:none;"/>
    <text x="400" y="80" text-anchor="middle" font-size="12" class="text-light">2 ✗</text>
    <text x="400" y="80" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">2 ✗</text>
    <rect x="360" y="30" width="80" height="30" class="pop-light"/>
    <rect x="360" y="30" width="80" height="30" class="pop-dark" style="display:none;"/>
    <text x="400" y="50" text-anchor="middle" font-size="12" class="text-light">3 ✗</text>
    <text x="400" y="50" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">3 ✗</text>
    <rect x="360" y="0" width="80" height="30" class="pop-light"/>
    <rect x="360" y="0" width="80" height="30" class="pop-dark" style="display:none;"/>
    <text x="400" y="20" text-anchor="middle" font-size="12" class="text-light">4 ✗</text>
    <text x="400" y="20" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">4 ✗</text>
    <rect x="360" y="90" width="80" height="30" class="push-light"/>
    <rect x="360" y="90" width="80" height="30" class="push-dark" style="display:none;"/>
    <text x="400" y="110" text-anchor="middle" font-size="12" class="text-light">5</text>
    <text x="400" y="110" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">5</text>
    <text x="400" y="135" text-anchor="middle" font-size="10" class="subtext-light">Pop 2,3,4 (all &lt; 5). NGE found.</text>
    <text x="400" y="135" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Pop 2,3,4 (all &lt; 5). NGE found.</text>
    <text x="560" y="0" text-anchor="middle" font-size="11" font-weight="bold" class="text-light">Processing: 6</text>
    <text x="560" y="0" text-anchor="middle" font-size="11" font-weight="bold" class="text-dark" style="display:none;">Processing: 6</text>
    <rect x="520" y="60" width="80" height="30" class="pop-light"/>
    <rect x="520" y="60" width="80" height="30" class="pop-dark" style="display:none;"/>
    <text x="560" y="80" text-anchor="middle" font-size="12" class="text-light">1 ✗</text>
    <text x="560" y="80" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">1 ✗</text>
    <rect x="520" y="30" width="80" height="30" class="pop-light"/>
    <rect x="520" y="30" width="80" height="30" class="pop-dark" style="display:none;"/>
    <text x="560" y="50" text-anchor="middle" font-size="12" class="text-light">5 ✗</text>
    <text x="560" y="50" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">5 ✗</text>
    <rect x="520" y="90" width="80" height="30" class="push-light"/>
    <rect x="520" y="90" width="80" height="30" class="push-dark" style="display:none;"/>
    <text x="560" y="110" text-anchor="middle" font-size="12" class="text-light">6</text>
    <text x="560" y="110" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">6</text>
    <text x="560" y="135" text-anchor="middle" font-size="10" class="subtext-light">Pop 1,5 (both &lt; 6). Push 6.</text>
    <text x="560" y="135" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Pop 1,5 (both &lt; 6). Push 6.</text>
  </g>
  <text x="400" y="280" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Algorithm Complexity: O(n) Time, O(n) Space</text>
  <text x="400" y="280" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Algorithm Complexity: O(n) Time, O(n) Space</text>
  <text x="400" y="300" text-anchor="middle" font-size="11" class="subtext-light">Each element is pushed exactly once and popped at most once. Total operations: 2n. Amortized O(1) per element.</text>
  <text x="400" y="300" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Each element is pushed exactly once and popped at most once. Total operations: 2n. Amortized O(1) per element.</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-light">Applications: Next Greater Element, Largest Rectangle in Histogram, Daily Temperatures, Sliding Window Maximum.</text>
  <text x="400" y="320" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Applications: Next Greater Element, Largest Rectangle in Histogram, Daily Temperatures, Sliding Window Maximum.</text>
  <text x="400" y="335" text-anchor="middle" font-size="11" class="subtext-light">Green = push | Red strikethrough = pop (NGE resolved)</text>
  <text x="400" y="335" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Green = push | Red strikethrough = pop (NGE resolved)</text>
</svg>
`;

const stackImplementationComparisonSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340" width="100%" height="100%">
  <defs>
    <style>
      .bg-light { fill: #ffffff; }
      .bg-dark { fill: #1e293b; }
      .array-light { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
      .array-dark { fill: #1e3a5f; stroke: #60a5fa; stroke-width: 2; }
      .linked-light { fill: #dcfce7; stroke: #16a34a; stroke-width: 2; }
      .linked-dark { fill: #14532d; stroke: #4ade80; stroke-width: 2; }
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
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-light">Stack Implementation Comparison — Array vs. Linked List</text>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="bold" class="text-dark" style="display:none;">Stack Implementation Comparison — Array vs. Linked List</text>
  <text x="200" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Array-Based Stack (Bounded)</text>
  <text x="200" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Array-Based Stack (Bounded)</text>
  <text x="600" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-light">Linked List-Based Stack (Unbounded)</text>
  <text x="600" y="60" text-anchor="middle" font-size="13" font-weight="bold" class="text-dark" style="display:none;">Linked List-Based Stack (Unbounded)</text>
  <g transform="translate(60, 80)">
    <rect x="0" y="0" width="280" height="130" class="array-light"/>
    <rect x="0" y="0" width="280" height="130" class="array-dark" style="display:none;"/>
    <rect x="10" y="10" width="60" height="25" class="array-light" stroke-width="1"/>
    <rect x="10" y="10" width="60" height="25" class="array-dark" stroke-width="1" style="display:none;"/>
    <text x="40" y="27" text-anchor="middle" font-size="11" class="text-light">10</text>
    <text x="40" y="27" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">10</text>
    <rect x="70" y="10" width="60" height="25" class="array-light" stroke-width="1"/>
    <rect x="70" y="10" width="60" height="25" class="array-dark" stroke-width="1" style="display:none;"/>
    <text x="100" y="27" text-anchor="middle" font-size="11" class="text-light">20</text>
    <text x="100" y="27" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">20</text>
    <rect x="130" y="10" width="60" height="25" class="array-light" stroke-width="1"/>
    <rect x="130" y="10" width="60" height="25" class="array-dark" stroke-width="1" style="display:none;"/>
    <text x="160" y="27" text-anchor="middle" font-size="11" class="text-light">30</text>
    <text x="160" y="27" text-anchor="middle" font-size="11" class="text-dark" style="display:none;">30</text>
    <rect x="190" y="10" width="60" height="25" class="array-light" stroke-width="1" opacity="0.3"/>
    <rect x="190" y="10" width="60" height="25" class="array-dark" stroke-width="1" opacity="0.3" style="display:none;"/>
    <text x="220" y="27" text-anchor="middle" font-size="11" class="subtext-light">...</text>
    <text x="220" y="27" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">...</text>
    <text x="140" y="55" text-anchor="middle" font-size="10" class="subtext-light">Capacity: fixed (e.g., 1024)</text>
    <text x="140" y="55" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Capacity: fixed (e.g., 1024)</text>
    <text x="140" y="75" text-anchor="middle" font-size="10" class="subtext-light">Top index: 2 (points to 30)</text>
    <text x="140" y="75" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Top index: 2 (points to 30)</text>
    <text x="140" y="95" text-anchor="middle" font-size="10" class="subtext-light">Push: arr[++top] = val</text>
    <text x="140" y="95" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Push: arr[++top] = val</text>
    <text x="140" y="115" text-anchor="middle" font-size="10" class="subtext-light">Pop: return arr[top--]</text>
    <text x="140" y="115" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Pop: return arr[top--]</text>
  </g>
  <g transform="translate(460, 80)">
    <rect x="0" y="0" width="60" height="40" class="linked-light"/>
    <rect x="0" y="0" width="60" height="40" class="linked-dark" style="display:none;"/>
    <text x="30" y="25" text-anchor="middle" font-size="12" class="text-light">30</text>
    <text x="30" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">30</text>
    <path d="M 60 20 L 90 20" class="arrow-light"/>
    <path d="M 60 20 L 90 20" class="arrow-dark" style="display:none;"/>
    <rect x="90" y="0" width="60" height="40" class="linked-light"/>
    <rect x="90" y="0" width="60" height="40" class="linked-dark" style="display:none;"/>
    <text x="120" y="25" text-anchor="middle" font-size="12" class="text-light">20</text>
    <text x="120" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">20</text>
    <path d="M 150 20 L 180 20" class="arrow-light"/>
    <path d="M 150 20 L 180 20" class="arrow-dark" style="display:none;"/>
    <rect x="180" y="0" width="60" height="40" class="linked-light"/>
    <rect x="180" y="0" width="60" height="40" class="linked-dark" style="display:none;"/>
    <text x="210" y="25" text-anchor="middle" font-size="12" class="text-light">10</text>
    <text x="210" y="25" text-anchor="middle" font-size="12" class="text-dark" style="display:none;">10</text>
    <path d="M 240 20 L 260 20" class="arrow-light"/>
    <path d="M 240 20 L 260 20" class="arrow-dark" style="display:none;"/>
    <text x="270" y="25" text-anchor="middle" font-size="11" class="subtext-light">NULL</text>
    <text x="270" y="25" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">NULL</text>
    <text x="140" y="60" text-anchor="middle" font-size="10" class="subtext-light">Capacity: unlimited (bounded by heap)</text>
    <text x="140" y="60" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Capacity: unlimited (bounded by heap)</text>
    <text x="140" y="80" text-anchor="middle" font-size="10" class="subtext-light">Head pointer = top of stack</text>
    <text x="140" y="80" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Head pointer = top of stack</text>
    <text x="140" y="100" text-anchor="middle" font-size="10" class="subtext-light">Push: new.next = head; head = new</text>
    <text x="140" y="100" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Push: new.next = head; head = new</text>
    <text x="140" y="120" text-anchor="middle" font-size="10" class="subtext-light">Pop: val = head.val; head = head.next</text>
    <text x="140" y="120" text-anchor="middle" font-size="10" class="subtext-dark" style="display:none;">Pop: val = head.val; head = head.next</text>
  </g>
  <g transform="translate(50, 240)">
    <rect x="0" y="0" width="700" height="80" rx="6" class="array-light"/>
    <rect x="0" y="0" width="700" height="80" rx="6" class="array-dark" style="display:none;"/>
    <text x="350" y="20" text-anchor="middle" font-size="12" font-weight="bold" class="text-light">Trade-off Summary</text>
    <text x="350" y="20" text-anchor="middle" font-size="12" font-weight="bold" class="text-dark" style="display:none;">Trade-off Summary</text>
    <text x="350" y="40" text-anchor="middle" font-size="11" class="subtext-light">Array: O(1) push/pop, cache-friendly, zero per-element overhead, but bounded capacity. Stack overflow if full.</text>
    <text x="350" y="40" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Array: O(1) push/pop, cache-friendly, zero per-element overhead, but bounded capacity. Stack overflow if full.</text>
    <text x="350" y="60" text-anchor="middle" font-size="11" class="subtext-light">Linked List: O(1) push/pop, unbounded, but 8 bytes/node pointer overhead, poor cache locality, allocator pressure.</text>
    <text x="350" y="60" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Linked List: O(1) push/pop, unbounded, but 8 bytes/node pointer overhead, poor cache locality, allocator pressure.</text>
    <text x="350" y="78" text-anchor="middle" font-size="11" class="subtext-light">Production default: array-based for known bounds (call stacks, expression evaluation). Linked list for unbounded (undo history, event buffers).</text>
    <text x="350" y="78" text-anchor="middle" font-size="11" class="subtext-dark" style="display:none;">Production default: array-based for known bounds (call stacks, expression evaluation). Linked list for unbounded (undo history, event buffers).</text>
  </g>
</svg>
`;

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>stack</strong> is a linear data structure that follows the Last-In-First-Out (LIFO) access discipline: the most recently inserted element is the first one to be removed. This simple ordering constraint underpins some of the most critical mechanisms in computing, from function call management in every running program to expression evaluation in compilers, from undo systems in interactive applications to depth-first search in graph traversal algorithms. The stack is not merely an abstract data type taught in introductory computer science courses; it is a foundational execution model that hardware, operating systems, language runtimes, and application frameworks all rely on.
        </p>
        <p>
          The stack interface surface is minimal: <strong>push</strong> inserts an element at the top, <strong>pop</strong> removes and returns the top element, and <strong>peek</strong> (or <strong>top</strong>) reads the top element without removing it. All three operations execute in O(1) time because they operate exclusively on the top element — there is no searching, no indexing, no traversal. This restricted access pattern is both the stack&apos;s greatest strength (guaranteed constant-time operations) and its defining limitation (no random access to interior elements).
        </p>
        <p>
          For staff and principal engineers, understanding stacks extends far beyond the basic push/pop abstraction. The call stack governs function execution in every process; stack overflow vulnerabilities are a top security concern; monotonic stack patterns enable O(n) solutions to problems that naively appear to require O(n²); lock-free concurrent stacks enable high-throughput work distribution without mutex contention; and stack canaries provide runtime protection against buffer overflow attacks. The stack is simultaneously the simplest and the most architecturally significant data structure in computing.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <h3>LIFO Semantics and the Top Pointer</h3>
        <p>
          The LIFO ordering invariant means that elements can only be accessed in reverse order of their insertion. If elements A, B, C are pushed in that order, they must be popped in the order C, B, A. This is not a design choice or an implementation detail — it is a mathematical property of the stack&apos;s definition. Any data structure that allows accessing non-top elements without first popping the elements above it is, by definition, not a stack.
        </p>
        <p>
          The stack is managed by a single mutable state variable: the <strong>top pointer</strong>. In an array-based implementation, top is an integer index indicating the position of the top element (or -1 for an empty stack). In a linked-list-based implementation, top is a pointer to the head node of the list. Every operation reads or modifies top: push increments top and writes the new element; pop reads the element at top and decrements top; peek reads the element at top without modifying it. The top pointer is the entire state of the stack — a single integer or a single pointer.
        </p>

        <h3>Array-Based versus Linked-List-Based Implementation</h3>
        <p>
          An array-based stack allocates a fixed-size buffer (e.g., 1024 elements) and maintains a top index. Push writes to <code>arr[++top]</code> and pop reads from <code>arr[top--]</code>. This implementation is extremely efficient: zero per-element overhead (no pointers), optimal cache-line utilization (elements are contiguous), and branchless operations (the push/pop logic is two instructions). The limitation is capacity: when top reaches the array bound, the stack is full. A dynamic array stack (doubling capacity on overflow) provides amortized O(1) push but introduces the occasional O(n) resize spike, which is unacceptable in real-time systems.
        </p>
        <p>
          A linked-list-based stack allocates a new node for each push and frees a node for each pop. Push allocates a node, sets its next pointer to the current head, and updates head to the new node. Pop saves the head&apos;s value, updates head to head.next, and frees the old head. This implementation is unbounded (limited only by available heap memory) and has true O(1) push and pop (no amortization). The costs are: 8 bytes per element for the next pointer on 64-bit systems, poor cache performance (nodes scattered across the heap), and allocator pressure (every push triggers a malloc, every pop triggers a free).
        </p>

        <h3>Call Stack and Function Execution</h3>
        <p>
          The call stack (also known as the execution stack or program stack) is a hardware-managed stack that tracks active function calls. When function A calls function B, the CPU pushes a <strong>stack frame</strong> containing the return address (the instruction pointer to resume at when B returns), saved registers (callee-saved registers per the calling convention), local variables of B, and any spilled parameters. When B returns, its frame is popped, registers are restored, and execution resumes at the saved return address in A.
        </p>
        <p>
          The call stack grows downward from high to low addresses on most architectures (x86-64, ARM). The stack pointer register (RSP on x86-64, SP on ARM) always points to the top of the stack. The base pointer register (RBP/FP) provides a stable reference point within the current frame for accessing local variables and parameters. Recursive function calls create nested frames on the call stack — each recursive invocation gets its own frame with its own copy of local variables, which is why recursion &quot;just works&quot; without explicit state management.
        </p>

        <h3>Monotonic Stacks</h3>
        <p>
          A <strong>monotonic stack</strong> is a stack that maintains its elements in a specific order (monotonically increasing or decreasing). When a new element is pushed, elements that violate the ordering invariant are popped first. This pattern enables elegant O(n) solutions to a class of problems that involve finding the next element satisfying a condition (next greater element, next smaller element, nearest warmer temperature, etc.).
        </p>
        <p>
          The algorithmic insight is that each element is pushed exactly once and popped at most once, giving O(n) total time regardless of the number of pops triggered by any single element. This amortization is possible because the monotonic invariant guarantees that once an element is popped, it is never needed again — the element that caused its pop is a &quot;better&quot; answer for all future queries than the popped element could ever be.
        </p>

        <ArticleImage svgContent={stackOperationsSVG} caption="Stack operations showing push, pop, and peek all operating exclusively on the top element in O(1) time" />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Push/Pop/Peek Execution Flow</h3>
        <p>
          The push operation follows a deterministic sequence: validate that the stack is not full (for bounded implementations), increment the top pointer, and write the new element at the top position. In an array-based stack with capacity C and current top index t (where t ranges from -1 for empty to C-1 for full), push checks that t + 1 &lt; C, sets t = t + 1, and writes arr[t] = value. The entire operation is two integer additions and one memory write — typically 3-4 CPU cycles on modern hardware.
        </p>
        <p>
          The pop operation reverses this: validate that the stack is not empty (t ≥ 0), read the value at arr[t], decrement t, and return the value. The validation check is critical — popping from an empty stack is undefined behavior in C/C++ (reading arr[-1]) and throws a runtime exception in managed languages. Production implementations either assert the precondition (debug builds) or return an error code/option type (release builds) rather than failing silently.
        </p>
        <p>
          The peek operation reads arr[t] without modifying t. It is the only stack operation that is purely observational — it has no side effects. Peek is essential for algorithms that need to inspect the top element before deciding whether to pop (e.g., expression evaluation, where the operator precedence of the top-of-stack operator determines whether to reduce or shift).
        </p>

        <h3>Call Stack Frame Management</h3>
        <p>
          Each function call creates a stack frame through a prologue sequence: the caller pushes the return address (via the call instruction), the callee saves the old base pointer (push RBP), sets the new base pointer to the current stack pointer (mov RBP, RSP), and allocates space for local variables by subtracting from the stack pointer (sub RSP, N). The frame is a contiguous region of the stack between the old RBP and the current RSP.
        </p>
        <p>
          On function return, the epilogue sequence reverses this: deallocate local variables (mov RSP, RBP), restore the old base pointer (pop RBP), and return to the caller (ret, which pops the return address into the instruction pointer). The entire frame creation and destruction is handled by hardware instructions (call, ret) and a few register manipulations — no heap allocation, no pointer chasing, no garbage collection. This is why function calls are fast (typically 5-15 cycles for the call/return pair) and why the call stack is the default execution model for virtually all programming languages.
        </p>

        <ArticleImage svgContent={callStackSVG} caption="Call stack showing nested function call frames with return addresses, saved registers, and local variables" />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <h3>Array-Based versus Linked-List-Based Trade-offs</h3>
        <p>
          The choice between array-based and linked-list-based stack implementations involves a fundamental trade-off between memory efficiency and capacity flexibility. Array-based stacks are more memory-efficient (no per-element pointer overhead), more cache-friendly (contiguous element layout enables hardware prefetching), and faster (push/pop are index arithmetic rather than pointer dereferencing and allocation). However, they have a fixed capacity that, if exceeded, causes stack overflow — either a controlled error (for application-level stacks) or a segmentation fault (for the call stack).
        </p>
        <p>
          Linked-list-based stacks have unbounded capacity (limited only by available heap memory) and true O(1) push/pop without amortization concerns. However, they pay 8 bytes per element for the next pointer on 64-bit systems, suffer from poor cache performance (each node allocation may land in a different cache line), and generate allocator traffic (every push calls malloc, every pop calls free). In high-throughput systems pushing millions of elements per second, the allocator overhead becomes the performance bottleneck, not the stack operations themselves.
        </p>

        <h3>Stack versus Queue</h3>
        <p>
          Stacks and queues are duals: stacks are LIFO, queues are FIFO. The choice between them is dictated by the processing semantics of the problem. Stacks are appropriate when the most recent element is the most relevant (undo history, function calls, depth-first search, expression parsing). Queues are appropriate when the oldest element is the most relevant (task scheduling, breadth-first search, message buffering, rate limiting).
        </p>
        <p>
          Both support O(1) insertion and deletion, but at opposite ends: stacks insert and delete at the same end (top), while queues insert at one end (tail) and delete from the other (head). This difference has architectural implications: a concurrent stack requires synchronization on a single pointer (the top), while a concurrent queue requires synchronization on two pointers (head and tail), making the concurrent stack simpler to implement correctly.
        </p>

        <ArticleImage svgContent={monotonicStackSVG} caption="Monotonic stack pattern for Next Greater Element problem showing push and pop operations with amortized O(1) per element" />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use array-based stacks when the maximum stack depth is known or bounded. This is the case for expression evaluation (stack depth bounded by expression nesting), depth-first search (bounded by graph depth), and most algorithmic uses. Pre-allocate the array to the known bound to avoid resize overhead and the risk of stack overflow. For the call stack, the bound is determined by the operating system (typically 1-8 MB per thread on Linux, 1 MB on Windows), and recursive algorithms should be converted to iterative with an explicit heap-allocated stack when the recursion depth is unbounded or data-dependent.
        </p>
        <p>
          Use linked-list-based stacks when the depth is truly unbounded and memory is not a primary constraint. This is appropriate for undo history systems (the user may perform an arbitrary number of operations), event buffers in GUI frameworks, and any scenario where capping the depth would result in data loss. Mitigate allocator overhead by using a memory pool for stack nodes: pre-allocate a large block of nodes, manage them with an internal free list, and allocate from the pool rather than the system allocator.
        </p>
        <p>
          For concurrent stacks in high-throughput systems, implement a <strong>lock-free stack using CAS</strong> (compare-and-swap) on the top pointer. Treiber&apos;s stack algorithm (1986) provides a lock-free concurrent stack where multiple threads can push and pop without mutex contention: each push loops by reading the current top, setting the new node&apos;s next to the current top, and attempting a CAS on the top from the old value to the new node. If the CAS fails (another thread modified the top concurrently), the loop retries. This provides wait-free push and amortized wait-free pop.
        </p>
        <p>
          For expression evaluation and parsing, use the <strong>two-stack algorithm</strong> (Dijkstra&apos;s Shunting Yard): one stack for operands and one for operators. When an operator is encountered, compare its precedence with the top of the operator stack; if the top has higher or equal precedence, pop the operator and two operands, compute the result, and push it back onto the operand stack. This algorithm correctly handles operator precedence, associativity, and parentheses in a single left-to-right pass.
        </p>
        <p>
          For monotonic stack problems, recognize the pattern: if the problem asks for &quot;the next element that is larger/smaller than the current element,&quot; a monotonic stack is likely the optimal solution. Maintain the stack in decreasing order for &quot;next greater&quot; problems (pop elements smaller than the current element, recording the current as their NGE) and in increasing order for &quot;next smaller&quot; problems. The key invariant is that the stack always contains candidates that have not yet found their answer.
        </p>

        <ArticleImage svgContent={stackImplementationComparisonSVG} caption="Array-based versus linked-list-based stack implementation comparison showing memory layout and performance trade-offs" />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          <strong>Stack overflow</strong> is the most critical pitfall. In array-based stacks, pushing beyond capacity causes an out-of-bounds write (in C/C++) or a runtime exception (in managed languages). In the call stack, exceeding the OS-imposed stack size limit causes a segmentation fault (stack overflow attack). This commonly occurs with unbounded recursion (e.g., recursive DFS on a graph with a long path, recursive factorial on large inputs, recursive tree traversal on degenerate trees). Always convert deep or unbounded recursion to iteration with an explicit stack.
        </p>
        <p>
          <strong>Underflow</strong> (popping from an empty stack) is the second most common error. It occurs when the algorithm assumes the stack contains elements but the invariant has been violated — typically due to a logic error in the push/pop balance. In expression evaluation, mismatched parentheses cause underflow when the algorithm attempts to pop an operand that was never pushed. In depth-first search, underflow indicates a bug in the traversal logic (e.g., popping more nodes than were pushed). Always check <code>isEmpty()</code> before popping, or design the algorithm to guarantee the push/pop balance.
        </p>
        <p>
          <strong>Memory leaks in linked-list-based stacks</strong> occur when nodes are popped but not freed, or when the entire stack is abandoned without freeing remaining nodes. In C/C++, this is a permanent leak. In garbage-collected languages, abandoned stacks delay GC because all nodes remain reachable from the head reference. Always implement a <code>clear()</code> or <code>destroy()</code> method that iterates through the stack, freeing each node (or releasing references) until the stack is empty.
        </p>
        <p>
          <strong>Thread safety</strong> is a critical concern. A non-synchronized stack accessed by multiple threads will produce corrupted state: concurrent pushes may overwrite the same array slot, concurrent pops may return the same element twice, and a concurrent push and pop may cause a lost update (one operation&apos;s result is silently discarded). Use a lock-free CAS-based stack for high-concurrency scenarios, or a mutex-protected stack for lower-concurrency scenarios where simplicity is preferred over throughput.
        </p>
        <p>
          <strong>Buffer overflow attacks via call stack manipulation</strong> are a top security concern. When a function writes beyond the bounds of a stack-allocated buffer, it overwrites the saved return address in the stack frame, redirecting execution to attacker-controlled code when the function returns. Stack canaries (random values placed between the buffer and the return address, checked before return) and ASLR (Address Space Layout Randomization) mitigate but do not eliminate this risk. The definitive defense is bounds checking: never write to a stack-allocated buffer without verifying that the write is within bounds.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Call stack management</strong> is the most universal use of stacks. Every running program — from embedded firmware to cloud microservices — uses a call stack to track function invocations. The call stack enables recursion (each recursive call gets its own frame with independent local variables), exception handling (stack unwinding walks the stack frames to find a catch block), and debugging (stack traces show the call chain at the point of failure). The call stack is managed by hardware (the stack pointer register) and the calling convention (the ABI), requiring no explicit management from the programmer.
        </p>
        <p>
          <strong>Expression evaluation and parsing</strong> uses stacks extensively. Compilers and interpreters use the Shunting Yard algorithm to convert infix expressions to postfix (Reverse Polish Notation) for evaluation, using a stack to manage operator precedence. HTML and XML parsers use a stack to track open tags: when an opening tag is encountered, it is pushed onto the stack; when a closing tag is encountered, it must match the top of the stack (the most recently opened tag), which is then popped. Mismatched tags are detected as parsing errors. This pattern ensures well-formedness of nested structures.
        </p>
        <p>
          <strong>Undo/redo systems</strong> in text editors, IDEs, and design tools use two stacks: an undo stack and a redo stack. Each user action is pushed onto the undo stack. When the user presses Undo, the top action is popped from the undo stack, reversed, and pushed onto the redo stack. When the user presses Redo, the top action is popped from the redo stack, re-applied, and pushed back onto the undo stack. If the user makes a new edit after undoing, the redo stack is cleared (the redo history is invalidated). This two-stack pattern is elegant and efficient.
        </p>
        <p>
          <strong>Depth-first search (DFS)</strong> in graph traversal uses an explicit stack (or the call stack via recursion) to track the frontier of unexplored nodes. DFS pushes a starting node, then repeatedly pops a node, processes it, and pushes all unvisited neighbors. The LIFO ordering ensures that DFS explores as deep as possible along each branch before backtracking — the defining characteristic of DFS that distinguishes it from BFS (which uses a queue). DFS is used in topological sorting, cycle detection, connected component analysis, and maze solving.
        </p>
        <p>
          <strong>Browser back/forward navigation</strong> uses two stacks: a back stack and a forward stack. When the user navigates to a new page, it is pushed onto the back stack and the forward stack is cleared. When the user presses Back, the current page is pushed onto the forward stack and the top of the back stack is popped and displayed. When the user presses Forward, the current page is pushed onto the back stack and the top of the forward stack is popped and displayed. This is the same two-stack pattern as undo/redo, applied to web navigation.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <h3>1. How would you implement a min stack that supports push, pop, top, and getMin — all in O(1) time?</h3>
        <p>
          A min stack is a stack that additionally supports a getMin operation returning the minimum element in the stack in O(1) time. The challenge is that the minimum element may not be at the top, and after popping the current minimum, the new minimum must be available instantly.
        </p>
        <p>
          The optimal approach uses <strong>two stacks in parallel</strong>: a main stack that stores all elements (supporting standard push, pop, top), and a min stack that stores the minimum element at each level. On push(value): push value onto the main stack, and push min(value, minStack.top()) onto the min stack (or push value if the min stack is empty). On pop(): pop from both stacks simultaneously. On getMin(): return minStack.top(). On top(): return mainStack.top().
        </p>
        <p>
          The correctness follows from the invariant: at any point, the min stack&apos;s top is the minimum of all elements currently in the main stack. When a new element is pushed, it becomes the new minimum if it is smaller than the current minimum; otherwise, the current minimum remains the minimum (and is re-pushed onto the min stack to maintain the invariant). When an element is popped, the min stack is popped in tandem, revealing the previous minimum.
        </p>
        <p>
          Space complexity is O(n) for both stacks — the min stack may contain duplicate values (if the same minimum is pushed multiple times, it is duplicated on the min stack). An optimization is to push onto the min stack only when the new value is less than or equal to the current minimum, and pop from the min stack only when the popped value equals the current minimum. This reduces space for the min stack in the average case (to O(k) where k is the number of times the minimum changes), but the worst-case space remains O(n) (when elements are pushed in decreasing order).
        </p>

        <h3>2. How would you validate whether a string of parentheses is balanced? Extend to multiple bracket types.</h3>
        <p>
          For a string containing only parentheses characters, balance validation checks that every opening bracket has a matching closing bracket in the correct order. The stack-based algorithm processes the string left to right: when an opening bracket is encountered, push it onto the stack; when a closing bracket is encountered, check if the stack is empty (if so, the string is unbalanced — there is no matching opening bracket), pop the top of the stack, and verify that the popped bracket matches the current closing bracket (e.g., &apos;(&apos; matches &apos;)&apos;, &apos;[&apos; matches &apos;]&apos;, &apos;{&apos; matches &apos;}&apos;). After processing the entire string, the stack must be empty (no unmatched opening brackets).
        </p>
        <p>
          The algorithm runs in O(n) time (one pass through the string) and O(n) space (the stack may contain up to n/2 opening brackets in the worst case, e.g., &quot;((((&quot;). The correctness follows from the nesting property of brackets: the most recently opened bracket must be the first one closed, which is exactly the LIFO property of a stack.
        </p>
        <p>
          For multiple bracket types, use a hash map from closing brackets to their corresponding opening brackets: <code>{&apos;)&apos;: &apos;(&apos;, &apos;]&apos;: &apos;[&apos;, &apos;}&apos;: &apos;{&apos;}</code>. When a closing bracket is encountered, look up its expected opening bracket in the map and compare it with the popped value. This generalizes to any number of bracket types and keeps the algorithm at O(n) time regardless of the number of bracket types.
        </p>
        <p>
          A follow-up question often asks about the longest valid (well-formed) parentheses substring. This requires a more sophisticated approach: use a stack to track indices of opening brackets, and maintain a variable tracking the start of the current valid substring. When a closing bracket matches an opening bracket, compute the length of the valid substring from the current index to the last unmatched index. This runs in O(n) time and is a common hard interview problem.
        </p>

        <h3>3. Explain how the Shunting Yard algorithm converts infix to postfix notation. Why is a stack the right data structure for this?</h3>
        <p>
          The Shunting Yard algorithm (Dijkstra, 1961) converts an infix expression (e.g., <code>3 + 4 × 2 - 1</code>) to postfix notation (Reverse Polish Notation, e.g., <code>3 4 2 × + 1 -</code>) where operators follow their operands and no parentheses are needed. The algorithm processes tokens left to right, maintaining an operator stack and an output queue.
        </p>
        <p>
          For each token: if it is a number, append it to the output. If it is an operator, while the operator stack is non-empty and the top operator has higher or equal precedence, pop the top operator and append it to the output, then push the current operator onto the stack. If it is a left parenthesis, push it onto the stack. If it is a right parenthesis, pop operators from the stack and append them to the output until a left parenthesis is encountered (which is popped but not appended). After processing all tokens, pop any remaining operators from the stack and append them to the output.
        </p>
        <p>
          A stack is the right data structure because operator precedence creates a nesting structure: operators with higher precedence must be processed (output) before operators with lower precedence, regardless of their position in the input. When a lower-precedence operator is encountered, higher-precedence operators that were pushed earlier must be popped first — exactly the LIFO pattern. The operator stack temporarily holds operators that are waiting for their right operand to be fully processed.
        </p>
        <p>
          The algorithm handles operator associativity (left-associative operators like + and - are popped when the stack top has equal precedence; right-associative operators like ^ are not) and parentheses (which override the default precedence by forcing all operators within them to be processed before the closing parenthesis is handled). The result is a correct postfix expression that can be evaluated by a simple stack-based evaluator in a single left-to-right pass.
        </p>

        <h3>4. How would you design a lock-free concurrent stack? What is the ABA problem and how does it apply?</h3>
        <p>
          A lock-free concurrent stack (Treiber&apos;s stack, 1986) uses a singly linked list with an atomic head pointer and CAS (compare-and-swap) operations for push and pop. The push operation loops: read the current head atomically, set the new node&apos;s next to the current head, and attempt a CAS on the head from the old value to the new node. If the CAS succeeds, the push is complete; if it fails, the loop retries. The pop operation similarly loops: read the current head, if NULL return empty, read head.next, and attempt a CAS on the head from the current head to head.next.
        </p>
        <p>
          The <strong>ABA problem</strong> occurs when a thread reads value A from the head, another thread removes A (popping it) and then pushes A back (or a different node allocated at the same memory address), and the first thread&apos;s CAS succeeds because the head still appears to be A — but the list state has changed in the interim. In a stack context, this can cause data corruption if the popped node was freed and reallocated: the first thread thinks it is operating on the original list, but the node it is manipulating has been reused.
        </p>
        <p>
          Solutions include: (1) <strong>Hazard pointers</strong>, where each thread publishes the pointers it is currently accessing, and nodes are not freed until no thread holds a hazard pointer to them; (2) <strong>Epoch-based reclamation</strong>, where the system tracks global epochs and defers deallocation until all threads have advanced past the epoch in which the node was removed; (3) <strong>Tagged pointers</strong> (versioned pointers), where the head pointer is extended with a monotonically increasing version number that changes on every update, making the ABA scenario detectable because the version number will differ even if the address is the same.
        </p>
        <p>
          In production systems, epoch-based reclamation is the preferred solution because it does not require per-thread hazard pointer lists (reducing complexity) and does not require double-width CAS (which is not universally available). The Rust crossbeam library and the C++ folly library both use epoch-based reclamation for their lock-free concurrent data structures.
        </p>

        <h3>5. What are stack canaries and how do they protect against buffer overflow attacks?</h3>
        <p>
          A <strong>stack canary</strong> (also known as a stack cookie) is a random value placed on the stack between a function&apos;s local variables (buffers) and its control data (saved return address and saved base pointer). The canary is initialized to a random value at program startup (or per-thread) and is checked before the function returns. If a buffer overflow writes past the end of a local buffer, it overwrites the canary before it reaches the return address. The function&apos;s epilogue checks the canary against its expected value; if it has been modified, the program aborts immediately (typically calling <code>__stack_chk_fail</code>) rather than returning to a potentially attacker-controlled address.
        </p>
        <p>
          Stack canaries are implemented by the compiler (GCC&apos;s <code>-fstack-protector</code>, Clang&apos;s equivalent) and are enabled by default in modern distributions. The canary value is chosen to be hard to guess: on Linux, it is derived from a kernel-provided random value (fs:0x28 on x86-64), and it contains a null byte to prevent string-based overflow from skipping over it (since string operations stop at null bytes).
        </p>
        <p>
          Stack canaries are a mitigation, not a defense. They can be bypassed by: (a) reading the canary value via an information leak and using it in the overflow payload; (b) overwriting the Global Offset Table (GOT) entry for <code>__stack_chk_fail</code> to redirect the abort to attacker code; (c) using format string vulnerabilities to bypass the canary check entirely. The definitive defense against buffer overflow is bounds checking (e.g., using <code>strncpy</code> instead of <code>strcpy</code>, using <code>std::vector</code> instead of raw arrays in C++), combined with ASLR and DEP/NX (Data Execution Prevention) for defense in depth.
        </p>

        <h3>6. How would you implement a stack using two queues? What is the time complexity of each operation?</h3>
        <p>
          Implementing a stack (LIFO) using two queues (FIFO) requires simulating the LIFO behavior through careful queue manipulation. There are two approaches: making push expensive (O(n)) and pop cheap (O(1)), or making push cheap (O(1)) and pop expensive (O(n)).
        </p>
        <p>
          In the <strong>push-expensive approach</strong>: to push a value, enqueue it into queue2, then dequeue all elements from queue1 and enqueue them into queue2 (this reverses the order, putting the new element at the front of the effective stack), then swap the names of queue1 and queue2. To pop, simply dequeue from queue1 (the front element is the most recently pushed). To peek, dequeue from queue1, save the value, enqueue it back into queue1, and return the saved value. Push is O(n) because all elements are transferred between queues; pop and peek are O(1).
        </p>
        <p>
          In the <strong>pop-expensive approach</strong>: to push, simply enqueue into queue1 (O(1)). To pop, dequeue all but the last element from queue1 and enqueue them into queue2, save the last element (the stack top), swap queue names, and return the saved element (O(n)). To peek, perform the same operation but enqueue the last element back into queue2 before returning it (O(n)).
        </p>
        <p>
          Both approaches have the same amortized cost: n pushes and n pops cost O(n²) total regardless of the approach. The push-expensive approach is preferable when pop/peek are more frequent than push, and the pop-expensive approach is preferable when push is more frequent. This problem tests understanding of how to compose data structures to achieve different access patterns — a skill relevant to system design when the available infrastructure does not directly support the required semantics.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li>Knuth, D.E. — &quot;The Art of Computer Programming, Volume 1: Fundamental Algorithms&quot; — Addison-Wesley, 3rd Edition, Section 2.2.1</li>
          <li>Cormen, T.H., Leiserson, C.E., Rivest, R.L., Stein, C. — &quot;Introduction to Algorithms&quot; — MIT Press, 4th Edition, Chapter 10</li>
          <li>Dijkstra, E.W. — &quot;Shunting Yard Algorithm&quot; — EWD-226, Eindhoven University of Technology, 1961</li>
          <li>Treiber, R.K. — &quot;Systems Programming: Coping with Parallelism&quot; — Technical Report RJ 5118, IBM Almaden Research Center, 1986</li>
          <li>Seacord, R.C. — &quot;Secure Coding in C and C++&quot; — Addison-Wesley, 2nd Edition, Chapter 4 (Stack Buffer Overflows and Canaries)</li>
          <li>Herlihy, M., Shavit, N. — &quot;The Art of Multiprocessor Programming&quot; — Morgan Kaufmann, Revised Edition, Chapter 11 (Concurrent Stacks)</li>
          <li>Intel Corporation — &quot;Intel 64 and IA-32 Architectures Software Developer&apos;s Manual&quot; — Volume 1, Chapter 6 (Procedure Calls and Stack Frames)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

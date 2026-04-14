"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-data-structures-queues",
  title: "Queues",
  description:
    "Staff-level deep dive into queue data structures covering FIFO semantics, circular buffers, linked-list implementations, Michael-Scott concurrent queues, blocking queues, ring buffers, and work-stealing architectures.",
  category: "other",
  subcategory: "data-structures-algorithms/data-structures",
  slug: "queues",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-14",
  tags: ["data-structures", "queues", "fifo", "circular-buffer"],
  relatedTopics: ["stacks", "priority-queues", "singly-linked-lists"],
};

const svgFifoOperations = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 340" width="100%" height="100%">
  <g class="svg-light">
    <rect width="700" height="340" fill="#ffffff"/>
    <text x="350" y="30" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1a1a2e">FIFO Queue Operations &mdash; Head and Tail Pointers</text>
    <rect x="120" y="80" width="460" height="80" rx="6" fill="none" stroke="#3b82f6" stroke-width="2"/>
    <line x1="212" y1="80" x2="212" y2="160" stroke="#3b82f6" stroke-width="1"/>
    <line x1="304" y1="80" x2="304" y2="160" stroke="#3b82f6" stroke-width="1"/>
    <line x1="396" y1="80" x2="396" y2="160" stroke="#3b82f6" stroke-width="1"/>
    <line x1="488" y1="80" x2="488" y2="160" stroke="#3b82f6" stroke-width="1"/>
    <rect x="120" y="80" width="92" height="80" fill="#e0e7ff" rx="4"/>
    <rect x="212" y="80" width="92" height="80" fill="#e0e7ff" rx="4"/>
    <rect x="304" y="80" width="92" height="80" fill="#e0e7ff" rx="4"/>
    <rect x="396" y="80" width="92" height="80" fill="#e0e7ff" rx="4"/>
    <text x="166" y="125" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#1e40af">A</text>
    <text x="258" y="125" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#1e40af">B</text>
    <text x="350" y="125" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#1e40af">C</text>
    <text x="442" y="125" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#1e40af">D</text>
    <text x="534" y="125" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="14" fill="#6b7280">empty</text>
    <polygon points="166,170 160,185 172,185" fill="#ef4444"/>
    <text x="166" y="205" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#ef4444">HEAD</text>
    <text x="166" y="222" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#6b7280">dequeue from here</text>
    <polygon points="488,65 482,50 494,50" fill="#10b981"/>
    <text x="488" y="42" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#10b981">TAIL</text>
    <text x="488" y="28" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#6b7280">enqueue at here</text>
    <line x1="600" y1="120" x2="580" y2="120" stroke="#10b981" stroke-width="2"/>
    <polygon points="580,115 580,125 570,120" fill="#10b981"/>
    <text x="620" y="115" font-family="sans-serif" font-weight="normal" font-size="12" fill="#10b981">enqueue(E)</text>
    <line x1="70" y1="120" x2="110" y2="120" stroke="#ef4444" stroke-width="2"/>
    <polygon points="110,115 110,125 120,120" fill="#ef4444"/>
    <text x="30" y="115" font-family="sans-serif" font-weight="normal" font-size="12" fill="#ef4444">dequeue() = A</text>
    <rect x="120" y="250" width="200" height="70" rx="6" fill="#f9fafb" stroke="#d1d5db" stroke-width="1"/>
    <text x="220" y="275" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#1a1a2e">enqueue(item) &mdash; O(1)</text>
    <text x="220" y="295" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#4b5563">Insert at tail, advance tail</text>
    <text x="220" y="312" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#4b5563">pointer, check capacity</text>
    <rect x="380" y="250" width="200" height="70" rx="6" fill="#f9fafb" stroke="#d1d5db" stroke-width="1"/>
    <text x="480" y="275" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#1a1a2e">dequeue() &mdash; O(1)</text>
    <text x="480" y="295" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#4b5563">Remove from head, advance</text>
    <text x="480" y="312" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#4b5563">head pointer, check empty</text>
  </g>
  <g class="svg-dark" style="display:none;">
    <rect width="700" height="340" fill="#0f172a"/>
    <text x="350" y="30" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#e2e8f0">FIFO Queue Operations &mdash; Head and Tail Pointers</text>
    <rect x="120" y="80" width="460" height="80" rx="6" fill="none" stroke="#60a5fa" stroke-width="2"/>
    <line x1="212" y1="80" x2="212" y2="160" stroke="#60a5fa" stroke-width="1"/>
    <line x1="304" y1="80" x2="304" y2="160" stroke="#60a5fa" stroke-width="1"/>
    <line x1="396" y1="80" x2="396" y2="160" stroke="#60a5fa" stroke-width="1"/>
    <line x1="488" y1="80" x2="488" y2="160" stroke="#60a5fa" stroke-width="1"/>
    <rect x="120" y="80" width="92" height="80" fill="#1e3a5f" rx="4"/>
    <rect x="212" y="80" width="92" height="80" fill="#1e3a5f" rx="4"/>
    <rect x="304" y="80" width="92" height="80" fill="#1e3a5f" rx="4"/>
    <rect x="396" y="80" width="92" height="80" fill="#1e3a5f" rx="4"/>
    <text x="166" y="125" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#93c5fd">A</text>
    <text x="258" y="125" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#93c5fd">B</text>
    <text x="350" y="125" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#93c5fd">C</text>
    <text x="442" y="125" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#93c5fd">D</text>
    <text x="534" y="125" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="14" fill="#94a3b8">empty</text>
    <polygon points="166,170 160,185 172,185" fill="#f87171"/>
    <text x="166" y="205" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#f87171">HEAD</text>
    <text x="166" y="222" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#94a3b8">dequeue from here</text>
    <polygon points="488,65 482,50 494,50" fill="#34d399"/>
    <text x="488" y="42" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#34d399">TAIL</text>
    <text x="488" y="28" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#94a3b8">enqueue at here</text>
    <line x1="600" y1="120" x2="580" y2="120" stroke="#34d399" stroke-width="2"/>
    <polygon points="580,115 580,125 570,120" fill="#34d399"/>
    <text x="620" y="115" font-family="sans-serif" font-weight="normal" font-size="12" fill="#34d399">enqueue(E)</text>
    <line x1="70" y1="120" x2="110" y2="120" stroke="#f87171" stroke-width="2"/>
    <polygon points="110,115 110,125 120,120" fill="#f87171"/>
    <text x="30" y="115" font-family="sans-serif" font-weight="normal" font-size="12" fill="#f87171">dequeue() = A</text>
    <rect x="120" y="250" width="200" height="70" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>
    <text x="220" y="275" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#e2e8f0">enqueue(item) &mdash; O(1)</text>
    <text x="220" y="295" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#cbd5e1">Insert at tail, advance tail</text>
    <text x="220" y="312" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#cbd5e1">pointer, check capacity</text>
    <rect x="380" y="250" width="200" height="70" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>
    <text x="480" y="275" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#e2e8f0">dequeue() &mdash; O(1)</text>
    <text x="480" y="295" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#cbd5e1">Remove from head, advance</text>
    <text x="480" y="312" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#cbd5e1">head pointer, check empty</text>
  </g>
</svg>`;

const svgCircularBuffer = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 380" width="100%" height="100%">
  <g class="svg-light">
    <rect width="700" height="380" fill="#ffffff"/>
    <text x="350" y="30" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1a1a2e">Circular Buffer Wrap-Around Behavior</text>
    <circle cx="350" cy="200" r="120" fill="none" stroke="#3b82f6" stroke-width="3" stroke-dasharray="8,4"/>
    <path d="M 350 80 A 120 120 0 0 1 470 200" fill="none" stroke="#e0e7ff" stroke-width="40"/>
    <path d="M 470 200 A 120 120 0 0 1 350 320" fill="none" stroke="#e0e7ff" stroke-width="40"/>
    <path d="M 350 320 A 120 120 0 0 1 230 200" fill="none" stroke="#bfdbfe" stroke-width="40"/>
    <path d="M 230 200 A 120 120 0 0 1 350 80" fill="none" stroke="#93c5fd" stroke-width="40"/>
    <text x="415" y="140" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#1e40af">idx 0: 42</text>
    <text x="415" y="260" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#1e40af">idx 1: 17</text>
    <text x="285" y="260" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#1e40af">idx 2: 93</text>
    <text x="285" y="140" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#1e40af">idx 3: 58</text>
    <line x1="350" y1="200" x2="415" y2="140" stroke="#ef4444" stroke-width="3"/>
    <circle cx="415" cy="140" r="8" fill="#ef4444"/>
    <text x="430" y="105" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ef4444">HEAD=0</text>
    <line x1="350" y1="200" x2="285" y2="260" stroke="#10b981" stroke-width="3"/>
    <circle cx="285" cy="260" r="8" fill="#10b981"/>
    <text x="240" y="305" font-family="sans-serif" font-weight="bold" font-size="13" fill="#10b981">TAIL=3</text>
    <path d="M 350 80 Q 350 40 400 50 Q 430 55 440 75" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="445" y="50" font-family="sans-serif" font-weight="normal" font-size="11" fill="#f59e0b">wrap-around:</text>
    <text x="445" y="65" font-family="sans-serif" font-weight="normal" font-size="11" fill="#f59e0b">idx = (tail + 1) % 4</text>
    <rect x="30" y="340" width="300" height="30" rx="4" fill="#f3f4f6"/>
    <text x="180" y="360" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#374151">Linear array: elements shift = O(n) per dequeue</text>
    <rect x="370" y="340" width="300" height="30" rx="4" fill="#dbeafe"/>
    <text x="520" y="360" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#1e40af">Circular buffer: head/tail move = O(1) per dequeue</text>
  </g>
  <g class="svg-dark" style="display:none;">
    <rect width="700" height="380" fill="#0f172a"/>
    <text x="350" y="30" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#e2e8f0">Circular Buffer Wrap-Around Behavior</text>
    <circle cx="350" cy="200" r="120" fill="none" stroke="#60a5fa" stroke-width="3" stroke-dasharray="8,4"/>
    <path d="M 350 80 A 120 120 0 0 1 470 200" fill="none" stroke="#1e3a5f" stroke-width="40"/>
    <path d="M 470 200 A 120 120 0 0 1 350 320" fill="none" stroke="#1e3a5f" stroke-width="40"/>
    <path d="M 350 320 A 120 120 0 0 1 230 200" fill="none" stroke="#1e4059" stroke-width="40"/>
    <path d="M 230 200 A 120 120 0 0 1 350 80" fill="none" stroke="#2563eb" stroke-width="40"/>
    <text x="415" y="140" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#93c5fd">idx 0: 42</text>
    <text x="415" y="260" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#93c5fd">idx 1: 17</text>
    <text x="285" y="260" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#93c5fd">idx 2: 93</text>
    <text x="285" y="140" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#93c5fd">idx 3: 58</text>
    <line x1="350" y1="200" x2="415" y2="140" stroke="#f87171" stroke-width="3"/>
    <circle cx="415" cy="140" r="8" fill="#f87171"/>
    <text x="430" y="105" font-family="sans-serif" font-weight="bold" font-size="13" fill="#f87171">HEAD=0</text>
    <line x1="350" y1="200" x2="285" y2="260" stroke="#34d399" stroke-width="3"/>
    <circle cx="285" cy="260" r="8" fill="#34d399"/>
    <text x="240" y="305" font-family="sans-serif" font-weight="bold" font-size="13" fill="#34d399">TAIL=3</text>
    <path d="M 350 80 Q 350 40 400 50 Q 430 55 440 75" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="445" y="50" font-family="sans-serif" font-weight="normal" font-size="11" fill="#fbbf24">wrap-around:</text>
    <text x="445" y="65" font-family="sans-serif" font-weight="normal" font-size="11" fill="#fbbf24">idx = (tail + 1) % 4</text>
    <rect x="30" y="340" width="300" height="30" rx="4" fill="#1e293b"/>
    <text x="180" y="360" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#cbd5e1">Linear array: elements shift = O(n) per dequeue</text>
    <rect x="370" y="340" width="300" height="30" rx="4" fill="#1e3a5f"/>
    <text x="520" y="360" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#93c5fd">Circular buffer: head/tail move = O(1) per dequeue</text>
  </g>
</svg>`;

const svgConcurrentQueue = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%">
  <g class="svg-light">
    <rect width="700" height="420" fill="#ffffff"/>
    <text x="350" y="30" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1a1a2e">Michael-Scott Concurrent Queue &mdash; CAS on Head and Tail</text>
    <rect x="60" y="80" width="100" height="60" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
    <text x="110" y="105" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#92400e">Dummy</text>
    <text x="110" y="125" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#92400e">sentinel node</text>
    <line x1="160" y1="110" x2="210" y2="110" stroke="#374151" stroke-width="2"/>
    <polygon points="210,105 210,115 220,110" fill="#374151"/>
    <rect x="220" y="80" width="100" height="60" rx="6" fill="#e0e7ff" stroke="#3b82f6" stroke-width="2"/>
    <text x="270" y="115" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1e40af">Node A</text>
    <line x1="320" y1="110" x2="370" y2="110" stroke="#374151" stroke-width="2"/>
    <polygon points="370,105 370,115 380,110" fill="#374151"/>
    <rect x="380" y="80" width="100" height="60" rx="6" fill="#e0e7ff" stroke="#3b82f6" stroke-width="2"/>
    <text x="430" y="115" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1e40af">Node B</text>
    <line x1="480" y1="110" x2="530" y2="110" stroke="#374151" stroke-width="2"/>
    <polygon points="530,105 530,115 540,110" fill="#374151"/>
    <rect x="540" y="80" width="100" height="60" rx="6" fill="#e0e7ff" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="590" y="105" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1e40af">Node C</text>
    <text x="590" y="125" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#1e40af">tail.next</text>
    <text x="110" y="170" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ef4444">HEAD</text>
    <line x1="110" y1="150" x2="110" y2="162" stroke="#ef4444" stroke-width="2"/>
    <text x="590" y="65" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#10b981">TAIL</text>
    <line x1="590" y1="72" x2="590" y2="80" stroke="#10b981" stroke-width="2"/>
    <rect x="50" y="200" width="290" height="100" rx="8" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.5"/>
    <text x="195" y="225" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#166534">Thread 1: enqueue(Node D)</text>
    <text x="65" y="250" font-family="sans-serif" font-weight="normal" font-size="12" fill="#374151">1. newNode = Node(D)</text>
    <text x="65" y="270" font-family="sans-serif" font-weight="normal" font-size="12" fill="#374151">2. CAS(tail.next, null, newNode)</text>
    <text x="65" y="290" font-family="sans-serif" font-weight="normal" font-size="12" fill="#374151">3. CAS(tail, old_tail, newNode)</text>
    <rect x="370" y="200" width="280" height="100" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
    <text x="510" y="225" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#991b1b">Thread 2: dequeue()</text>
    <text x="385" y="250" font-family="sans-serif" font-weight="normal" font-size="12" fill="#374151">1. p = head.next (skip sentinel)</text>
    <text x="385" y="270" font-family="sans-serif" font-weight="normal" font-size="12" fill="#374151">2. CAS(head, old_head, p)</text>
    <text x="385" y="290" font-family="sans-serif" font-weight="normal" font-size="12" fill="#374151">3. return p.value, free old_head</text>
    <rect x="150" y="330" width="400" height="70" rx="8" fill="#fefce8" stroke="#eab308" stroke-width="1.5"/>
    <text x="350" y="355" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#854d0e">Key Insight: Two-Phase CAS</text>
    <text x="350" y="375" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#a16207">Enqueue links node via CAS, then advances tail (relaxed). If tail lags, enqueue()</text>
    <text x="350" y="392" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#a16207">helps advance tail for other threads. Dequeue CASes head past the sentinel.</text>
  </g>
  <g class="svg-dark" style="display:none;">
    <rect width="700" height="420" fill="#0f172a"/>
    <text x="350" y="30" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#e2e8f0">Michael-Scott Concurrent Queue &mdash; CAS on Head and Tail</text>
    <rect x="60" y="80" width="100" height="60" rx="6" fill="#422006" stroke="#f59e0b" stroke-width="2"/>
    <text x="110" y="105" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#fbbf24">Dummy</text>
    <text x="110" y="125" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#fbbf24">sentinel node</text>
    <line x1="160" y1="110" x2="210" y2="110" stroke="#9ca3af" stroke-width="2"/>
    <polygon points="210,105 210,115 220,110" fill="#9ca3af"/>
    <rect x="220" y="80" width="100" height="60" rx="6" fill="#1e3a5f" stroke="#60a5fa" stroke-width="2"/>
    <text x="270" y="115" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#93c5fd">Node A</text>
    <line x1="320" y1="110" x2="370" y2="110" stroke="#9ca3af" stroke-width="2"/>
    <polygon points="370,105 370,115 380,110" fill="#9ca3af"/>
    <rect x="380" y="80" width="100" height="60" rx="6" fill="#1e3a5f" stroke="#60a5fa" stroke-width="2"/>
    <text x="430" y="115" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#93c5fd">Node B</text>
    <line x1="480" y1="110" x2="530" y2="110" stroke="#9ca3af" stroke-width="2"/>
    <polygon points="530,105 530,115 540,110" fill="#9ca3af"/>
    <rect x="540" y="80" width="100" height="60" rx="6" fill="#1e3a5f" stroke="#60a5fa" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="590" y="105" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#93c5fd">Node C</text>
    <text x="590" y="125" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#93c5fd">tail.next</text>
    <text x="110" y="170" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#f87171">HEAD</text>
    <line x1="110" y1="150" x2="110" y2="162" stroke="#f87171" stroke-width="2"/>
    <text x="590" y="65" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#34d399">TAIL</text>
    <line x1="590" y1="72" x2="590" y2="80" stroke="#34d399" stroke-width="2"/>
    <rect x="50" y="200" width="290" height="100" rx="8" fill="#052e16" stroke="#22c55e" stroke-width="1.5"/>
    <text x="195" y="225" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#4ade80">Thread 1: enqueue(Node D)</text>
    <text x="65" y="250" font-family="sans-serif" font-weight="normal" font-size="12" fill="#cbd5e1">1. newNode = Node(D)</text>
    <text x="65" y="270" font-family="sans-serif" font-weight="normal" font-size="12" fill="#cbd5e1">2. CAS(tail.next, null, newNode)</text>
    <text x="65" y="290" font-family="sans-serif" font-weight="normal" font-size="12" fill="#cbd5e1">3. CAS(tail, old_tail, newNode)</text>
    <rect x="370" y="200" width="280" height="100" rx="8" fill="#450a0a" stroke="#ef4444" stroke-width="1.5"/>
    <text x="510" y="225" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#fca5a5">Thread 2: dequeue()</text>
    <text x="385" y="250" font-family="sans-serif" font-weight="normal" font-size="12" fill="#cbd5e1">1. p = head.next (skip sentinel)</text>
    <text x="385" y="270" font-family="sans-serif" font-weight="normal" font-size="12" fill="#cbd5e1">2. CAS(head, old_head, p)</text>
    <text x="385" y="290" font-family="sans-serif" font-weight="normal" font-size="12" fill="#cbd5e1">3. return p.value, free old_head</text>
    <rect x="150" y="330" width="400" height="70" rx="8" fill="#422006" stroke="#eab308" stroke-width="1.5"/>
    <text x="350" y="355" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#fbbf24">Key Insight: Two-Phase CAS</text>
    <text x="350" y="375" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#fcd34d">Enqueue links node via CAS, then advances tail (relaxed). If tail lags, enqueue()</text>
    <text x="350" y="392" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#fcd34d">helps advance tail for other threads. Dequeue CASes head past the sentinel.</text>
  </g>
</svg>`;

const svgBoundedVsUnbounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" width="100%" height="100%">
  <g class="svg-light">
    <rect width="700" height="400" fill="#ffffff"/>
    <text x="350" y="30" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1a1a2e">Bounded vs Unbounded Queue &mdash; Production Trade-offs</text>
    <rect x="40" y="70" width="300" height="300" rx="10" fill="#f9fafb" stroke="#d1d5db" stroke-width="1.5"/>
    <text x="190" y="100" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1a1a2e">Bounded Queue</text>
    <rect x="70" y="120" width="240" height="50" rx="6" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
    <text x="190" y="140" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#1e40af">Fixed capacity = N slots</text>
    <text x="190" y="158" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#1e40af">circular buffer / array-backed</text>
    <rect x="70" y="185" width="240" height="50" rx="6" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
    <text x="190" y="205" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#166534">Full: block or reject</text>
    <text x="190" y="223" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#166534">producer waits / drops items</text>
    <rect x="70" y="250" width="240" height="50" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
    <text x="190" y="270" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#92400e">Memory: predictable</text>
    <text x="190" y="288" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#92400e">O(capacity), cache-friendly</text>
    <rect x="70" y="315" width="240" height="40" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
    <text x="190" y="340" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#991b1b">Risk: backpressure, data loss</text>
    <rect x="360" y="70" width="300" height="300" rx="10" fill="#f9fafb" stroke="#d1d5db" stroke-width="1.5"/>
    <text x="510" y="100" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1a1a2e">Unbounded Queue</text>
    <rect x="390" y="120" width="240" height="50" rx="6" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
    <text x="510" y="140" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#1e40af">Dynamic capacity</text>
    <text x="510" y="158" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#1e40af">linked-list / growable array</text>
    <rect x="390" y="185" width="240" height="50" rx="6" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
    <text x="510" y="205" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#166534">Full: never blocks producer</text>
    <text x="510" y="223" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#166534">allocates new nodes freely</text>
    <rect x="390" y="250" width="240" height="50" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
    <text x="510" y="270" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#92400e">Memory: unbounded growth</text>
    <text x="510" y="288" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#92400e">O(items), potential OOM</text>
    <rect x="390" y="315" width="240" height="40" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
    <text x="510" y="340" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#991b1b">Risk: OOM, GC pressure, latency</text>
  </g>
  <g class="svg-dark" style="display:none;">
    <rect width="700" height="400" fill="#0f172a"/>
    <text x="350" y="30" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#e2e8f0">Bounded vs Unbounded Queue &mdash; Production Trade-offs</text>
    <rect x="40" y="70" width="300" height="300" rx="10" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <text x="190" y="100" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#e2e8f0">Bounded Queue</text>
    <rect x="70" y="120" width="240" height="50" rx="6" fill="#1e3a5f" stroke="#60a5fa" stroke-width="2"/>
    <text x="190" y="140" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#93c5fd">Fixed capacity = N slots</text>
    <text x="190" y="158" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#93c5fd">circular buffer / array-backed</text>
    <rect x="70" y="185" width="240" height="50" rx="6" fill="#052e16" stroke="#22c55e" stroke-width="2"/>
    <text x="190" y="205" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#4ade80">Full: block or reject</text>
    <text x="190" y="223" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#4ade80">producer waits / drops items</text>
    <rect x="70" y="250" width="240" height="50" rx="6" fill="#422006" stroke="#f59e0b" stroke-width="2"/>
    <text x="190" y="270" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#fbbf24">Memory: predictable</text>
    <text x="190" y="288" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#fbbf24">O(capacity), cache-friendly</text>
    <rect x="70" y="315" width="240" height="40" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="2"/>
    <text x="190" y="340" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#fca5a5">Risk: backpressure, data loss</text>
    <rect x="360" y="70" width="300" height="300" rx="10" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <text x="510" y="100" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#e2e8f0">Unbounded Queue</text>
    <rect x="390" y="120" width="240" height="50" rx="6" fill="#1e3a5f" stroke="#60a5fa" stroke-width="2"/>
    <text x="510" y="140" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#93c5fd">Dynamic capacity</text>
    <text x="510" y="158" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#93c5fd">linked-list / growable array</text>
    <rect x="390" y="185" width="240" height="50" rx="6" fill="#052e16" stroke="#22c55e" stroke-width="2"/>
    <text x="510" y="205" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#4ade80">Full: never blocks producer</text>
    <text x="510" y="223" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#4ade80">allocates new nodes freely</text>
    <rect x="390" y="250" width="240" height="50" rx="6" fill="#422006" stroke="#f59e0b" stroke-width="2"/>
    <text x="510" y="270" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#fbbf24">Memory: unbounded growth</text>
    <text x="510" y="288" text-anchor="middle" font-family="sans-serif" font-weight="normal" font-size="11" fill="#fbbf24">O(items), potential OOM</text>
    <rect x="390" y="315" width="240" height="40" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="2"/>
    <text x="510" y="340" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#fca5a5">Risk: OOM, GC pressure, latency</text>
  </g>
</svg>`;

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ========== Definition & Context ========== */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>queue</strong> is a linear data structure that enforces
          <strong> first-in, first-out (FIFO)</strong> ordering: the element
          inserted earliest is the one removed earliest. This simple invariant
          underpins virtually every system that must manage ordered access to a
          shared resource, decouple producers from consumers, or impose a
          temporal sequence on discrete events. In operating systems, the
          ready-queue determines which process runs next on a CPU core. In
          networking, packet queues at each router hop govern throughput and
          latency. In distributed systems, message queues like Kafka, RabbitMQ,
          and Amazon SQS are the backbone of event-driven architectures. Even
          at the hardware level, instruction pipelines, cache replacement
          policies, and memory controllers rely on queue semantics.
        </p>
        <p>
          The fundamental operations are <strong>enqueue</strong> (insert an
          element at the tail) and <strong>dequeue</strong> (remove and return
          the element at the head), each designed to execute in constant time
          O(1). Two additional operations &mdash; <strong>peek</strong> (inspect
          the head without removing) and <strong>isEmpty</strong> (check whether
          the queue contains any elements) &mdash; complete the minimal API
          surface. Despite this simplicity, the implementation space is
          surprisingly rich. The choice between a circular buffer (array-backed),
          a singly linked list, a doubly linked list, or a lock-free concurrent
          structure has cascading effects on cache behavior, memory allocation
          patterns, garbage-collection pressure, thread-safety guarantees, and
          ultimately the performance characteristics of every system built on
          top of the queue.
        </p>
        <p>
          At the staff-engineer level, the question is never &ldquo;how do I
          implement a queue?&rdquo; but rather &ldquo;which queue
          implementation is the right foundation for this system, and what are
          the failure modes when the abstraction leaks?&rdquo; A bounded
          circular buffer used in a high-throughput event loop will exhibit
          dramatically different behavior under burst load compared to an
          unbounded linked-list queue. A Michael-Scott concurrent queue
          eliminates lock contention but introduces CAS retry loops and
          sentinel-node management. A work-stealing deque (a double-ended queue
          variant) enables lock-free task distribution across worker threads
          but requires careful attention to the race between steal and pop
          operations. Understanding these trade-offs is essential for
          architecting systems where queues are not incidental data structures
          but critical-path infrastructure.
        </p>
      </section>

      {/* ========== Core Concepts ========== */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The <strong>FIFO invariant</strong> is the defining property of every
          queue. Unlike a stack (LIFO), where the most recently inserted
          element is removed first, or a priority queue, where removal order
          depends on a comparison key, a queue guarantees that elements emerge
          in exactly the order they entered. This property is essential for
          fairness (no element is starved indefinitely), ordering guarantees
          (message processing respects arrival order), and causal consistency
          (effects appear in the order their causes were enqueued). When a
          system violates FIFO ordering on a queue that callers assume is FIFO,
          the bugs are subtle and often non-deterministic.
        </p>
        <p>
          The <strong>enqueue operation</strong> appends an element at the tail
          of the queue. In a well-implemented queue, enqueue is O(1): it does
          not traverse the structure, does not allocate more than one node (for
          linked-list implementations), and does not copy existing elements.
          The tail pointer advances, and the new element becomes accessible for
          future dequeue operations. The critical invariant is that no
          subsequent enqueue can overtake a prior one &mdash; if Thread A
          enqueues item X before Thread B enqueues item Y, then X must be
          dequeued before Y in any single-consumer scenario. Multi-producer
          queues must enforce this ordering across threads, which requires
          synchronization (locks, CAS, or memory barriers).
        </p>
        <p>
          The <strong>dequeue operation</strong> removes and returns the element
          at the head. Like enqueue, dequeue must be O(1) in a proper queue
          implementation. The head pointer advances to the next element, and
          the former head node is either reclaimed (in a linked list) or
          logically invalidated (in a circular buffer). An empty-queue dequeue
          either blocks (in a blocking queue), returns a sentinel value or
          error (in a non-blocking queue), or returns a special &ldquo;empty&rdquo;
          result (as in Java&apos;s <code>poll()</code> versus
          <code>remove()</code>). The choice of empty-queue behavior has
          significant API-design implications: blocking semantics simplify
          consumer code but require a thread or coroutine to wait, while
          non-blocking semantics force the caller to implement retry loops or
          error handling.
        </p>
        <p>
          <strong>Bounded versus unbounded capacity</strong> is the first
          architectural decision when choosing a queue implementation. A
          bounded queue has a fixed maximum capacity established at
          construction time. When the queue is full, enqueue operations must
          either block the producer, reject the new item (returning an error or
          dropping the item), or overwrite the oldest item (a ring-buffer
          overwrite policy). An unbounded queue has no fixed limit &mdash; it
          grows dynamically as items are enqueued, limited only by available
          memory. The bounded choice provides backpressure (producers slow down
          when consumers cannot keep up) and predictable memory usage, but
          risks data loss or producer starvation. The unbounded choice never
          blocks producers and never drops items, but risks unbounded memory
          growth, garbage-collection storms, and eventual out-of-memory crashes
          if consumers fall behind persistently.
        </p>
        <p>
          <strong>Blocking queues</strong> extend the basic queue API with
          synchronization primitives that cause enqueue to block when the queue
          is full (bounded case) and dequeue to block when the queue is empty.
          Blocking is typically implemented with condition variables, semaphores,
          or OS-level synchronization (futexes on Linux, events on Windows). A
          blocking queue is the fundamental building block of the
          producer-consumer pattern: producers generate work and enqueue it,
          consumers dequeue and process it, and the queue absorbs bursts while
          keeping both sides decoupled. Thread pools use blocking queues as
          their task store: worker threads block on dequeue until a task
          arrives, eliminating busy-waiting and ensuring that CPU cycles are
          consumed only when there is actual work.
        </p>
      </section>

      {/* ========== Architecture & Flow ========== */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <figure className="my-8">
          <div className="flex justify-center rounded-lg border border-theme bg-panel p-4 overflow-x-auto">
            <ArticleImage svgContent={svgFifoOperations} caption="FIFO queue operations showing head (dequeue) and tail (enqueue) pointers with O(1) complexity" />
          </div>
          <figcaption className="mt-3 text-center text-sm text-muted">
            FIFO queue operations showing head (dequeue) and tail (enqueue) pointers &mdash; both operations execute in O(1) time
          </figcaption>
        </figure>

        <p>
          The diagram above illustrates the fundamental pointer mechanics of a
          queue. The head pointer always indicates the next element to be
          dequeued, and the tail pointer always indicates the position where
          the next element will be enqueued. In an array-backed queue, these
          are integer indices; in a linked-list queue, they are node
          references. The critical insight is that both pointers move in only
          one direction &mdash; head advances toward tail during dequeue, and
          tail advances away from head during enqueue. In a linear array
          implementation, this unidirectional movement eventually causes both
          pointers to reach the end of the array, at which point no more
          elements can be enqueued even though earlier array positions are
          logically empty (they were dequeued). This is the motivation for the
          circular buffer.
        </p>

        <figure className="my-8">
          <div className="flex justify-center rounded-lg border border-theme bg-panel p-4 overflow-x-auto">
            <ArticleImage svgContent={svgCircularBuffer} caption="Circular buffer wrap-around showing head and tail indices wrapping modulo capacity" />
          </div>
          <figcaption className="mt-3 text-center text-sm text-muted">
            Circular buffer wrap-around &mdash; head and tail indices wrap modulo capacity, maintaining O(1) operations without element shifting
          </figcaption>
        </figure>

        <p>
          The circular buffer solves the linear array&apos;s drift problem by
          treating the underlying array as a ring. When the head or tail
          pointer reaches the end of the array, it wraps around to index zero
          using modular arithmetic: <code>index = (index + 1) % capacity</code>.
          This means that dequeued slots are immediately available for reuse
          by future enqueues, and the buffer can sustain infinite enqueue-dequeue
          cycles without any element copying or pointer reset logic. The
          condition for &ldquo;queue full&rdquo; is
          <code>(tail + 1) % capacity == head</code> (one slot is intentionally
          left empty to distinguish full from empty), and the condition for
          &ldquo;queue empty&rdquo; is <code>head == tail</code>. Circular
          buffers are exceptionally cache-friendly: sequential memory access
          patterns exploit hardware prefetching, and the fixed-size allocation
          eliminates per-element memory allocation overhead. This is why
          high-performance systems &mdash; the Linux kernel&apos;s ring buffer
          for kernel logging, LMAX Disruptor for low-latency messaging, and
          FFmpeg&apos;s audio/video sample buffers &mdash; all use circular
          buffer variants as their core queue structure.
        </p>

        <figure className="my-8">
          <div className="flex justify-center rounded-lg border border-theme bg-panel p-4 overflow-x-auto">
            <ArticleImage svgContent={svgConcurrentQueue} caption="Michael-Scott concurrent queue showing CAS operations on head and tail pointers" />
          </div>
          <figcaption className="mt-3 text-center text-sm text-muted">
            Michael-Scott concurrent queue &mdash; two threads performing enqueue and dequeue simultaneously using CAS on shared head and tail pointers
          </figcaption>
        </figure>

        <p>
          The Michael-Scott queue (1996) is the canonical lock-free concurrent
          queue implementation. It uses a singly linked list with a dummy
          sentinel node and two shared pointers (head and tail) that are
          updated via compare-and-swap (CAS) operations. The sentinel node
          simplifies the empty-queue case: the queue is empty when
          <code>head.next == null</code>, and the sentinel is the only node.
          Enqueue performs two CAS operations: first, it CASes the current
          tail&apos;s next pointer from null to the new node (linking the node
          into the list); second, it CASes the tail pointer itself from the old
          tail to the new node. The second CAS is technically not required for
          correctness &mdash; the first CAS makes the node visible to
          consumers &mdash; but it is essential for performance because it
          keeps the tail pointer close to the actual end of the list. If a
          thread crashes between the two CAS operations, the queue remains
          consistent, and subsequent threads will help advance the tail pointer
          before proceeding with their own enqueue. Dequeue performs a single
          CAS on the head pointer: it CASes head from the current sentinel to
          the sentinel&apos;s next node, thereby removing the old sentinel and
          promoting the next node to sentinel status. The value stored in the
          old sentinel&apos;s next node (the dequeued element) is returned to
          the caller. The lock-free guarantee means that at least one thread
          will make progress in a finite number of steps, regardless of
          scheduling delays or thread failures. Under high contention, however,
          CAS failures cause retry loops that can degrade to livelock-like
          behavior if many threads compete for the same CAS target.
        </p>

        <figure className="my-8">
          <div className="flex justify-center rounded-lg border border-theme bg-panel p-4 overflow-x-auto">
            <ArticleImage svgContent={svgBoundedVsUnbounded} caption="Bounded versus unbounded queue comparison showing capacity constraints and memory characteristics" />
          </div>
          <figcaption className="mt-3 text-center text-sm text-muted">
            Bounded queues offer predictable memory and backpressure at the cost of potential data loss; unbounded queues guarantee no data loss but risk OOM
          </figcaption>
        </figure>

        <p>
          The bounded-versus-unbounded decision cascades through every aspect
          of system design. A bounded circular buffer provides O(1) enqueue and
          dequeue, predictable memory usage, and excellent cache locality, but
          when the buffer fills, producers must either block (introducing
          latency), drop items (introducing data loss), or overwrite the oldest
          items (introducing staleness). An unbounded linked-list queue never
          blocks producers and never drops items, but each enqueue allocates a
          new node (creating GC pressure in managed languages), the linked-list
          traversal pattern is cache-unfriendly (nodes are scattered across the
          heap), and under sustained producer-consumer imbalance the queue grows
          until the process runs out of memory. Production systems often use
          bounded queues with explicit backpressure protocols (the producer is
          notified when the queue is full and can slow down or shed load)
          rather than silently dropping items.
        </p>
      </section>

      {/* ========== Trade-offs & Comparison ========== */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Circular Buffer (Bounded)</th>
              <th className="p-3 text-left">Linked-List (Unbounded)</th>
              <th className="p-3 text-left">Michael-Scott (Concurrent)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Enqueue complexity</strong>
              </td>
              <td className="p-3">O(1) amortized, no allocation</td>
              <td className="p-3">O(1), requires heap allocation per item</td>
              <td className="p-3">O(1) expected, CAS retry on contention</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Dequeue complexity</strong>
              </td>
              <td className="p-3">O(1) amortized, no deallocation</td>
              <td className="p-3">O(1), node freed after dequeue</td>
              <td className="p-3">O(1) expected, CAS retry on contention</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Memory behavior</strong>
              </td>
              <td className="p-3">
                Pre-allocated, cache-friendly sequential access, spatial
                locality
              </td>
              <td className="p-3">
                Per-node allocation, scattered heap references, cache-unfriendly
              </td>
              <td className="p-3">
                Per-node allocation like linked list, plus sentinel nodes that
                persist until dequeued
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Thread safety</strong>
              </td>
              <td className="p-3">
                Requires external synchronization (mutex or lock-free
                atomics)
              </td>
              <td className="p-3">
                Requires external synchronization (mutex or lock-free atomics)
              </td>
              <td className="p-3">
                Lock-free by design, multiple producers and consumers safe
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Capacity limits</strong>
              </td>
              <td className="p-3">
                Fixed at construction, backpressure or data loss when full
              </td>
              <td className="p-3">
                Unbounded growth, potential OOM under sustained imbalance
              </td>
              <td className="p-3">
                Unbounded growth like linked list, limited only by memory
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Best use case</strong>
              </td>
              <td className="p-3">
                High-throughput single-threaded or low-contention event loops,
                ring buffers, IPC
              </td>
              <td className="p-3">
                General-purpose queues where capacity is unknown and memory is
                plentiful
              </td>
              <td className="p-3">
                Lock-free multi-producer multi-consumer scenarios, low-latency
                trading systems
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ========== Best Practices ========== */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Prefer bounded circular buffers for high-throughput,
            latency-sensitive paths:</strong> When you know the maximum
            reasonable queue depth (or can enforce it via backpressure), a
            circular buffer eliminates per-element allocation, provides
            excellent cache locality through sequential memory access, and
            avoids garbage-collection pauses. This is the dominant choice in
            network packet processing, audio/video buffering, and kernel-level
            IPC. Pre-allocate the buffer at initialization to avoid
            initialization-time allocation spikes.
          </li>
          <li>
            <strong>Use blocking queues for producer-consumer decoupling:</strong>
            When producers and consumers operate at different rates and you
            need the queue to absorb bursts while preventing busy-waiting, a
            blocking queue with condition variables is the right abstraction.
            Worker threads block on dequeue when idle and wake via condition
            variable signal when items arrive. Set appropriate timeouts on
            blocking operations to detect consumer starvation and trigger
            alerting.
          </li>
          <li>
            <strong>Choose lock-free concurrent queues only when lock contention
            is the proven bottleneck:</strong> The Michael-Scott queue and its
            variants eliminate lock overhead but introduce CAS retry loops that
            can degrade to livelock under high contention. Profile first: if
            mutex contention is less than five percent of total CPU time, a
            mutex-protected queue may outperform a lock-free one due to lower
            per-operation overhead. Reserve lock-free queues for low-latency
            trading systems, real-time audio processing, and other domains where
            tail latency matters more than throughput.
          </li>
          <li>
            <strong>Implement ring-buffer overwrite for telemetry and logging:</strong>
            When the queue stores diagnostic data (log entries, metrics samples,
            trace spans) and losing old data is acceptable, a ring buffer with
            overwrite policy is ideal. When the buffer is full, the next enqueue
            overwrites the oldest element. This guarantees bounded memory usage
            while always retaining the most recent data. This pattern is used in
            the Linux kernel ring buffer for <code>dmesg</code> output, in
            circular logging for APM agents, and in flight-data recorders for
            aircraft.
          </li>
          <li>
            <strong>Use work-stealing deques for parallel task scheduling:</strong>
            When distributing work across multiple worker threads, a
            work-stealing architecture gives each thread its own deque (double-ended
            queue). The thread pushes and pops from the tail of its own deque
            (no synchronization needed), and idle threads steal from the head of
            other threads&apos; deques (requiring a CAS on the head pointer).
            This minimizes contention because threads primarily operate on their
            own deque and only synchronize when stealing. This is the scheduling
            model used by Go&apos;s goroutine scheduler, Java&apos;s
            ForkJoinPool, and Rust&apos;s Tokio runtime.
          </li>
          <li>
            <strong>Monitor queue depth and latency as first-class metrics:</strong>
            Queue depth (number of items currently enqueued) and queue latency
            (time from enqueue to dequeue) are critical system-health indicators.
            A growing queue depth signals a consumer bottleneck; increasing queue
            latency signals either consumer slowdown or producer burstiness.
            Alert on sustained queue depth above a threshold (e.g., eighty percent
            of capacity for bounded queues) and on queue latency exceeding the
            service-level objective. These metrics are often more actionable
            than CPU or memory utilization for diagnosing system degradation.
          </li>
        </ol>
      </section>

      {/* ========== Common Pitfalls ========== */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Full/empty ambiguity in circular buffers:</strong> In a
            circular buffer using head and tail indices, the condition
            <code>head == tail</code> indicates an empty queue. But if the
            buffer is completely filled, tail wraps around and
            <code>head == tail</code> also becomes true. The standard solution
            is to leave one slot intentionally unused: the queue is full when
            <code>(tail + 1) % capacity == head</code>. An alternative is to
            maintain a separate size counter or a boolean flag, but these add
            complexity and potential for inconsistency. Engineers who forget
            the sentinel-slot convention produce queues that either report
            empty when full (losing data) or report full when one slot remains
            (wasting capacity).
          </li>
          <li>
            <strong>ABA problem in lock-free queues:</strong> In the
            Michael-Scott queue, if a thread reads the head pointer as value A,
            another thread dequeues A and enqueues a new node that happens to
            reuse A&apos;s memory address (in languages with manual memory
            management), and the first thread&apos;s CAS compares the head
            against A and succeeds, the CAS operates on a different logical node
            than intended. This is the ABA problem. Java and Go avoid it through
            garbage collection (nodes are not reclaimed while references exist),
            but C and C++ implementations must use hazard pointers, epoch-based
            reclamation, or tagged pointers (adding a version counter to the
            pointer) to prevent ABA. Interviewers frequently probe for
            understanding of this issue.
          </li>
          <li>
            <strong>Unbounded queue growth causing cascading failures:</strong>
            An unbounded queue with a fast producer and slow consumer will grow
            indefinitely. In managed languages, this triggers garbage-collection
            storms as the GC tries to keep up with the allocation rate.
            Eventually, the process runs out of memory and crashes, potentially
            taking dependent services down. The fix is to impose a bounded
            capacity with backpressure: when the queue is full, the producer
            either blocks, returns an error, or sheds load (drops low-priority
            items). Systems like Kafka use a combination of bounded in-memory
            buffers and disk-backed persistence to handle this gracefully.
          </li>
          <li>
            <strong>False sharing in concurrent queue head/tail pointers:</strong>
            When head and tail pointers reside on the same cache line,
            concurrent enqueue and dequeue operations cause false sharing: each
            core invalidates the other&apos;s cache line even though they are
            modifying different variables. The fix is to pad the head and tail
            variables so that they occupy separate cache lines (typically
            sixty-four bytes apart on x86). Java&apos;s
            <code>Striped64</code> and the LMAX Disruptor both use
            <code>@Contended</code> or manual padding to prevent false sharing.
            Engineers who miss this subtlety see concurrent queue throughput
            that is an order of magnitude below theoretical expectations.
          </li>
          <li>
            <strong>Blocking queue deadlock with single-threaded consumers:</strong>
            If a single consumer thread processes items from a blocking queue
            and enqueues results into the same queue (or a queue that the same
            consumer reads from), a deadlock occurs: the consumer blocks on
            dequeue waiting for items that it itself must produce. This pattern
            arises in recursive task processing and graph traversal. The
            solution is to ensure that the consumption graph is acyclic: a
            consumer must never block on a queue whose items depend on its own
            output.
          </li>
          <li>
            <strong>Sentinel node leaks in Michael-Scott queue:</strong> Each
            dequeue operation promotes the next node to sentinel and discards
            the old sentinel. If memory reclamation is not handled correctly
            (e.g., the old sentinel is not freed, or it is freed while another
            thread still holds a reference), the queue leaks memory or
            experiences use-after-free crashes. In garbage-collected languages,
            the old sentinel is naturally reclaimed when no longer reachable,
            but in C/C++ implementations, epoch-based reclamation or hazard
            pointers are required to ensure safe deferred reclamation.
          </li>
        </ul>
      </section>

      {/* ========== Real-World Use Cases ========== */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Linux Kernel Ring Buffer (dmesg):</strong> The Linux
            kernel maintains a fixed-size circular buffer for kernel log
            messages. When the buffer is full, new messages overwrite the
            oldest ones. The <code>dmesg</code> command reads from this buffer.
            The ring buffer design ensures that the kernel never allocates
            memory for logging (which could itself trigger more log messages
            and cause a recursive allocation loop) and that memory usage is
            strictly bounded. The buffer size is configurable at boot time,
            typically ranging from sixty-four kilobytes to several megabytes.
          </li>
          <li>
            <strong>Apache Kafka Partition Log:</strong> Each Kafka partition
            is a sequential, append-only log that functions as a bounded
            queue with persistence. Producers append messages to the end of the
            log (enqueue), and consumers read from an offset position (dequeue
            without removal). The log is bounded by retention policy (time-based
            or size-based), not by a fixed buffer capacity. Kafka&apos;s design
            separates the ordering guarantee (sequential append) from the
            consumption model (offset-based reads), enabling multiple consumer
            groups to independently consume from the same log at different
            rates. The sequential write pattern exploits the underlying
            filesystem&apos;s sequential-write optimization, achieving
            throughput of hundreds of megabytes per second per partition.
          </li>
          <li>
            <strong>LMAX Disruptor:</strong> The LMAX Disruptor is a
            lock-free ring buffer designed for ultra-low-latency messaging
            between threads in a single JVM. It uses a pre-allocated circular
            buffer with sequence numbers instead of head/tail pointers,
            eliminating CAS contention through a strategy where each producer
            claims a sequence number via a single CAS and then writes
            independently to its claimed slot. Consumers track sequence numbers
            to determine which slots are ready for consumption. The Disruptor
            achieves sub-microsecond latencies by eliminating locks, minimizing
            cache-line bouncing (through careful slot layout and padding), and
            using memory barriers only where necessary. It is used in financial
            trading platforms where every microsecond of latency translates to
            measurable revenue impact.
          </li>
          <li>
            <strong>Go Runtime Goroutine Scheduler:</strong> Go&apos;s
            scheduler uses a work-stealing deque architecture. Each
            operating-system thread (called a P in Go&apos;s terminology)
            maintains a local deque of runnable goroutines. The thread pushes
            and pops from the tail of its own deque without synchronization.
            When a thread runs out of local work, it attempts to steal from the
            head of another thread&apos;s deque using a CAS operation on the
            head pointer. If the steal succeeds (the CAS wins the race against
            the owning thread&apos;s pop), the stolen goroutine is moved to the
            thief&apos;s deque. This architecture achieves near-linear scaling
            across CPU cores because contention is limited to steal operations,
            which are infrequent when work is evenly distributed.
          </li>
          <li>
            <strong>Network Packet Queues (Traffic Shaping):</strong> Routers
            and network interfaces maintain packet queues at every hop. These
            queues are bounded (hardware buffers are finite) and use various
            drop policies when full: drop-tail (drop the newest packet), RED
            (Random Early Detection, drop packets probabilistically before the
            queue is full to signal congestion), and CoDel (Controlled Delay,
            drop packets when queuing delay exceeds a threshold). The choice of
            queue management algorithm directly affects TCP&apos;s congestion
            control behavior and, consequently, the end-to-end throughput and
            latency of every network flow. Bufferbloat &mdash; the phenomenon
            where oversized network queues cause excessive latency &mdash; is
            essentially a queue management failure where the bounded queue is
            too large and the drop policy too lenient.
          </li>
        </ul>
      </section>

      {/* ========== Common Interview Questions ========== */}
      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 1: How would you implement a thread-safe bounded queue
            without using a mutex? What are the trade-offs compared to a
            mutex-based implementation?
          </h3>
          <p>
            A thread-safe bounded queue without a mutex can be implemented
            using a circular buffer with atomic head and tail indices. The
            enqueue operation atomically reads the tail index, checks whether
            the queue is full by comparing <code>(tail + 1) % capacity</code>{" "}
            against the head index, and if not full, writes the element at the
            tail position and advances tail using an atomic
            compare-and-swap. The dequeue operation atomically reads the head
            index, checks whether the queue is empty by comparing head against
            tail, and if not empty, reads the element at the head position and
            advances head using CAS. This is essentially a single-producer
            single-consumer lock-free queue. For multi-producer or
            multi-consumer scenarios, the CAS operations must handle retry
            loops: if the CAS fails (another thread advanced the pointer
            concurrently), the thread re-reads the pointer and retries. The
            critical optimization is to ensure false sharing does not occur by
            padding the head and tail variables to separate cache lines. The
            trade-off compared to a mutex-based queue is that the lock-free
            version eliminates lock acquisition overhead and prevents
            priority-inversion problems (a high-priority thread is never blocked
            waiting for a low-priority thread to release a lock), but it
            introduces CAS retry overhead under contention and is more complex
            to implement correctly. Under low contention, the lock-free version
            is faster; under high contention, the mutex version may be faster
            because the OS scheduler batches waiting threads efficiently and
            the lock acquisition is a single atomic operation rather than a
            CAS-retry loop.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 2: Explain the ABA problem in the context of a lock-free
            queue. How do you prevent it in a language without garbage
            collection?
          </h3>
          <p>
            The ABA problem occurs in lock-free algorithms that use
            compare-and-swap when a value read from memory (call it A) is
            subsequently modified by another thread to a different value (B)
            and then back to A before the first thread performs its CAS. In a
            lock-free queue, this manifests as follows: Thread 1 reads the
            head pointer as pointing to node X at address 0x1000. Thread 2
            dequeues X, freeing node 0x1000. Thread 3 allocates a new node,
            and the allocator happens to reuse address 0x1000 for the new node.
            Thread 1 now performs its CAS: &ldquo;if head is still 0x1000,
            advance it.&rdquo; The CAS succeeds because head is indeed 0x1000,
            but the node at that address is a completely different logical node
            than the one Thread 1 originally read. Thread 1 operates on the
            wrong node, corrupting the queue. In garbage-collected languages
            like Java and Go, the ABA problem does not occur because the old
            node X at 0x1000 cannot be reclaimed while Thread 1 still holds a
            reference to it &mdash; the GC keeps it alive. In languages without
            GC (C, C++, Rust), prevention techniques include: tagged pointers
            (appending a monotonically increasing version counter to the
            pointer so that even if the address is reused, the version changes
            and the CAS fails), hazard pointers (each thread publishes the
            pointers it is currently reading, and memory reclamation is
            deferred until no thread holds a hazard pointer to the node), or
            epoch-based reclamation (memory is reclaimed only after all
            threads have advanced past the epoch in which the node was
            unlinked, ensuring no thread can hold a stale reference). Tagged
            pointers are the simplest solution but require pointer bits that
            are unused due to alignment (on sixty-four-bit systems, the lower
            bits of aligned pointers are always zero and can hold the version
            counter).
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 3: What is a work-stealing deque, and why is it more
            efficient than a shared queue for task scheduling across multiple
            worker threads?
          </h3>
          <p>
            A work-stealing deque (or work-stealing queue) is a double-ended
            queue used in parallel task scheduling where each worker thread
            owns a private deque. The thread pushes new tasks onto the tail of
            its own deque and pops tasks from the tail for execution &mdash;
            both operations are lock-free because only the owning thread
            accesses the tail. When a thread exhausts its local work and
            becomes idle, it attempts to &ldquo;steal&rdquo; tasks from the
            head of another thread&apos;s deque. The steal operation uses a CAS
            on the head pointer: the thief reads the head, reads the task at
            that position, and CASes the head to the next position. If the CAS
            succeeds, the task is stolen; if it fails (the owning thread
            concurrently popped from the tail and the deque became empty), the
            thief retries with another victim. The efficiency advantage over a
            shared queue is dramatic: a shared queue requires synchronization
            (a lock or CAS) on every push and every pop from every thread,
            creating a serialization point that limits throughput as thread
            count increases. A work-stealing deque requires synchronization
            only during steal operations, which are infrequent when work is
            reasonably balanced across threads. In the common case where each
            thread has sufficient local work, all push and pop operations are
            entirely lock-free. This is why work-stealing is the scheduling
            model of choice for Go&apos;s goroutine scheduler, Java&apos;s
            ForkJoinPool, and Rust&apos;s Tokio: it achieves near-linear
            scaling across cores with minimal contention.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 4: In a producer-consumer system with a bounded blocking
            queue, what happens when the producer is significantly faster than
            the consumer? How would you design the system to handle this
            scenario gracefully?
          </h3>
          <p>
            When the producer significantly outpaces the consumer in a bounded
            blocking queue system, the queue fills to capacity and the producer
            blocks on the next enqueue operation. The producer thread is parked
            on a condition variable (or semaphore) waiting for the consumer to
            dequeue an item and signal the &ldquo;not full&rdquo; condition.
            This creates natural backpressure: the producer&apos;s throughput
            is throttled to match the consumer&apos;s processing rate. While
            this prevents memory exhaustion and data loss, it can cause
            problems upstream: if the producer is itself consuming items from
            another source (e.g., reading from a network socket), the blocking
            propagates backward, potentially causing TCP receive buffers to
            fill, TCP windows to shrink, and the remote sender to slow down.
            To handle this gracefully, several design strategies apply. First,
            implement adaptive backpressure: when the queue reaches a
            high-water mark (e.g., eighty percent full), signal the producer
            to slow down before the queue is completely full, providing a
            buffer zone. Second, implement priority-based shedding: if the
            queue is full and the producer cannot block (e.g., it is reading
            from a network socket where blocking would cause a timeout), drop
            the lowest-priority items and log the shedding event. Third, scale
            the consumer side: if the queue is persistently near capacity,
            spawn additional consumer threads or route excess items to a
            secondary processing pipeline. Fourth, persist excess items to
            disk: systems like Kafka handle producer-consumer imbalance by
            writing messages to a disk-backed log, trading disk I/O for memory
            safety. The choice among these strategies depends on whether data
            loss is acceptable, whether latency or throughput is the primary
            concern, and whether the imbalance is transient (a burst) or
            persistent (a capacity mismatch).
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 5: Compare the Michael-Scott concurrent queue with a
            mutex-protected queue. Under what workload conditions would each
            outperform the other, and why?
          </h3>
          <p>
            The Michael-Scott lock-free queue and a mutex-protected queue
            represent fundamentally different approaches to concurrent access.
            The mutex-protected queue serializes all operations: every enqueue
            and dequeue acquires the mutex, performs the operation, and
            releases the mutex. This means that at any instant, only one thread
            can be in the critical section. The Michael-Scott queue allows
            multiple threads to make progress concurrently through CAS
            operations: threads that lose a CAS race retry rather than blocking,
            and at least one thread is guaranteed to succeed in a finite number
            of steps (the lock-free guarantee). The Michael-Scott queue
            outperforms the mutex-protected queue under low to moderate
            contention when the cost of mutex acquisition (which involves a
            fast-path atomic CAS followed by a slow-path OS syscall if the
            mutex is held) exceeds the cost of the CAS retry loop. This is
            typical in low-latency systems with a small number of threads and
            short critical sections, such as a trading system with four threads
            performing enqueue and dequeue on a hot path. The mutex-protected
            queue outperforms the Michael-Scott queue under high contention
            when many threads compete for the same CAS target. In this scenario,
            the Michael-Scott queue experiences frequent CAS failures, causing
            threads to spin in retry loops that waste CPU cycles without
            making progress. The mutex, by contrast, batches waiting threads
            and grants the lock to one at a time, eliminating the spin waste.
            Additionally, the mutex-protected queue has simpler implementation
            (no sentinel nodes, no ABA concerns, no hazard pointer management)
            and is easier to reason about for correctness. The practical
            guidance is: benchmark both under your target workload, but default
            to a mutex-protected queue unless profiling demonstrates that mutex
            contention is a bottleneck, in which case switch to a lock-free
            implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 6: How does the Linux kernel prevent recursive memory
            allocation when writing to the kernel log buffer? Why is a circular
            buffer the only viable choice for this use case?
          </h3>
          <p>
            The Linux kernel log buffer (<code>printk</code> buffer) is a
            fixed-size circular buffer allocated at boot time. When kernel code
            calls <code>printk</code> to write a log message, the message is
            written directly into the pre-allocated circular buffer at the
            current tail position. The tail index advances using modular
            arithmetic, wrapping around when it reaches the buffer end. The
            critical property is that no dynamic memory allocation occurs during
            a <code>printk</code> write: the buffer capacity was pre-allocated,
            and the write is a simple memory copy into a known address. This
            prevents recursive memory allocation because the memory allocator
            itself may call <code>printk</code> to log allocation events
            (e.g., out-of-memory conditions, allocation failures). If the
            <code>printk</code> implementation required dynamic memory
            allocation, an allocation failure could trigger a <code>printk</code>
            call, which would trigger another allocation, which could fail and
            trigger another <code>printk</code>, ad infinitum. The circular
            buffer is the only viable choice because it provides bounded memory
            usage (the buffer cannot grow), zero allocation during write (all
            memory is pre-allocated), and natural overwrite behavior (when the
            buffer is full, old messages are overwritten by new ones, ensuring
            that the kernel always has room for the most recent log entries). A
            linked-list or dynamically-growing queue would require per-message
            allocation, reintroducing the recursive allocation problem. A
            blocking queue would be inappropriate because <code>printk</code>
            can be called from interrupt context and other atomic contexts where
            blocking is forbidden.
          </p>
        </div>
      </section>

      {/* ========== References ========== */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            Michael, M. M., &amp; Scott, M. L. (1996). &ldquo;Simple, Fast, and
            Practical Non-Blocking and Blocking Concurrent Queue
            Algorithms.&rdquo; Proceedings of the 15th ACM Symposium on
            Principles of Distributed Computing (PODC).
          </li>
          <li>
            LMAX Exchange. (2011). &ldquo;The LMAX Disruptor: High-Performance
            Inter-Thread Messaging Library.&rdquo; LMAX Technology Blog.
          </li>
          <li>
            Linux Kernel Documentation. &ldquo;Ring Buffer
            Implementation.&rdquo; kernel.org &mdash; kernel/trace/ring_buffer.c
            source and accompanying documentation.
          </li>
          <li>
            Go Project. &ldquo;Go Scheduler: Implementation of Work-Stealing
            Deques.&rdquo; runtime/proc.go source code and design
            documentation, golang.org.
          </li>
          <li>
            Van Jacobson &amp; others. &ldquo;Random Early Detection (RED):
            Congestion Avoidance in Packet Queues.&rdquo; IEEE/ACM Transactions
            on Networking.
          </li>
          <li>
            Nichols, K., &amp; Jacobson, V. (2012). &ldquo;Controlling Queue
            Delay.&rdquo; Queue magazine, ACM &mdash; introduction to CoDel
            active queue management algorithm.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

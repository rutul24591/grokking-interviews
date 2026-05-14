#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BASE_DIR = path.join(
  ROOT,
  "content",
  "examples",
  "other",
  "data-structures-algorithms",
  "algorithms",
);

const ARTICLE_ALGO_DIR = path.join(
  ROOT,
  "content",
  "articles",
  "other",
  "data-structures-algorithms",
  "algorithms",
);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function cleanDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}

function titleFromSlug(slug) {
  const replacements = {
    bfs: "Breadth-First Search (BFS)",
    dfs: "Depth-First Search (DFS)",
    kmp: "Knuth–Morris–Pratt (KMP)",
    "knapsack-01": "0/1 Knapsack",
    "tarjans-scc": "Tarjan’s SCC",
    "bellman-ford": "Bellman–Ford",
    "floyd-warshall": "Floyd–Warshall",
    "prims-mst": "Prim’s MST",
    "kruskals-mst": "Kruskal’s MST",
    "rabin-karp": "Rabin–Karp",
    "boyer-moore": "Boyer–Moore",
    "dp-fundamentals": "Dynamic Programming Fundamentals",
    "greedy-fundamentals": "Greedy Fundamentals",
    "backtracking-fundamentals": "Backtracking Fundamentals",
    "divide-and-conquer": "Divide and Conquer Fundamentals",
    "dp-on-trees": "DP on Trees",
    quickselect: "Quickselect",
  };
  if (replacements[slug]) return replacements[slug];
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildExplanation({ exampleId, summary, checks }) {
  const number = Number(exampleId.split("-")[1]);
  const lead =
    number === 1
      ? "Example 1 is a production-style implementation demo for this algorithm."
      : number === 2
        ? "Example 2 focuses on a follow-up/variant that interviewers commonly ask next."
        : "Example 3 focuses on edge cases and correctness checks you should validate.";
  const demonstrates = checks.map((line) => `- ${line}`).join("\n");

  return `${lead}

${summary}

It demonstrates:
${demonstrates}
`;
}

function buildReadme({ slug, topicTitle, exampleTitle, summary, files, runTarget, checks }) {
  const fileLines = files.map((file) => `- \`${file}\``).join("\n");
  const checkLines = checks.map((line) => `- ${line}`).join("\n");

  return `# ${topicTitle} — ${exampleTitle}

${summary}

## Files
${fileLines}

## Run
\`node content/examples/other/data-structures-algorithms/algorithms/${slug}/${runTarget}\`

## What to Verify
${checkLines}
`;
}

function createExampleDir({ slug, topicTitle, example }) {
  const exampleDir = path.join(BASE_DIR, slug, example.id);
  ensureDir(exampleDir);

  for (const file of example.files) {
    writeFile(path.join(exampleDir, file.name), `${file.content.trim()}\n`);
  }

  writeFile(
    path.join(exampleDir, "EXPLANATION.md"),
    `${buildExplanation({
      exampleId: example.id,
      summary: example.summary,
      checks: example.checks,
    }).trim()}\n`,
  );

  writeFile(
    path.join(exampleDir, "README.md"),
    buildReadme({
      slug,
      topicTitle,
      exampleTitle: example.title,
      summary: example.summary,
      files: ["EXPLANATION.md", ...example.files.map((f) => f.name), "README.md"],
      runTarget: `${example.id}/${example.runFile}`,
      checks: example.checks,
    }),
  );
}

function topicTemplate(slug) {
  const title = titleFromSlug(slug);

  // The algorithms set is large; implement by slug to ensure example-1 always
  // includes a real implementation of the named algorithm (not a placeholder).
  switch (slug) {
    case "bubble-sort":
    case "insertion-sort":
    case "selection-sort":
    case "merge-sort":
    case "quick-sort":
    case "heap-sort":
    case "shell-sort":
    case "counting-sort":
    case "bucket-sort":
    case "radix-sort": {
      const implBySlug = {
        "bubble-sort": {
          fn: "bubbleSort",
          body: `
function bubbleSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  for (let i = 0; i < arr.length - 1; i += 1) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j += 1) {
      if (cmp(arr[j], arr[j + 1]) > 0) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}
`,
        },
        "insertion-sort": {
          fn: "insertionSort",
          body: `
function insertionSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  for (let i = 1; i < arr.length; i += 1) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && cmp(arr[j], key) > 0) {
      arr[j + 1] = arr[j];
      j -= 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}
`,
        },
        "selection-sort": {
          fn: "selectionSort",
          body: `
function selectionSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  for (let i = 0; i < arr.length; i += 1) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j += 1) {
      if (cmp(arr[j], arr[minIndex]) < 0) minIndex = j;
    }
    if (minIndex !== i) [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}
`,
        },
        "merge-sort": {
          fn: "mergeSort",
          body: `
function mergeSort(values, compare) {
  const cmp = compare ?? ((a, b) => a - b);
  function merge(left, right) {
    const out = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      if (cmp(left[i], right[j]) <= 0) out.push(left[i++]);
      else out.push(right[j++]);
    }
    return out.concat(left.slice(i)).concat(right.slice(j));
  }
  function sort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    return merge(sort(arr.slice(0, mid)), sort(arr.slice(mid)));
  }
  return sort([...values]);
}
`,
        },
        "quick-sort": {
          fn: "quickSort",
          body: `
function quickSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  function partition(low, high) {
    const pivot = arr[high];
    let i = low;
    for (let j = low; j < high; j += 1) {
      if (cmp(arr[j], pivot) <= 0) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i += 1;
      }
    }
    [arr[i], arr[high]] = [arr[high], arr[i]];
    return i;
  }
  function sort(low, high) {
    if (low >= high) return;
    const p = partition(low, high);
    sort(low, p - 1);
    sort(p + 1, high);
  }
  sort(0, arr.length - 1);
  return arr;
}
`,
        },
        "heap-sort": {
          fn: "heapSort",
          body: `
function heapSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  const less = (i, j) => cmp(arr[i], arr[j]) < 0;
  function swap(i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  function siftDown(i, end) {
    while (true) {
      const left = i * 2 + 1;
      const right = i * 2 + 2;
      let max = i;
      if (left <= end && less(max, left)) max = left;
      if (right <= end && less(max, right)) max = right;
      if (max === i) return;
      swap(i, max);
      i = max;
    }
  }
  for (let i = Math.floor((arr.length - 2) / 2); i >= 0; i -= 1) {
    siftDown(i, arr.length - 1);
  }
  for (let end = arr.length - 1; end > 0; end -= 1) {
    swap(0, end);
    siftDown(0, end - 1);
  }
  return arr;
}
`,
        },
        "shell-sort": {
          fn: "shellSort",
          body: `
function shellSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  let gap = Math.floor(arr.length / 2);
  while (gap > 0) {
    for (let i = gap; i < arr.length; i += 1) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && cmp(arr[j - gap], temp) > 0) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}
`,
        },
        "counting-sort": {
          fn: "countingSort",
          body: `
function countingSort(values, maxValue) {
  const arr = [...values];
  const max = maxValue ?? Math.max(...arr, 0);
  const counts = new Array(max + 1).fill(0);
  for (const value of arr) counts[value] += 1;
  const out = [];
  for (let value = 0; value < counts.length; value += 1) {
    for (let c = 0; c < counts[value]; c += 1) out.push(value);
  }
  return out;
}
`,
        },
        "bucket-sort": {
          fn: "bucketSort",
          body: `
function bucketSort(values, bucketCount = 5) {
  const arr = [...values];
  if (arr.length === 0) return [];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min || 1;
  const buckets = Array.from({ length: bucketCount }, () => []);
  for (const value of arr) {
    const index = Math.min(
      bucketCount - 1,
      Math.floor(((value - min) / range) * bucketCount),
    );
    buckets[index].push(value);
  }
  const out = [];
  for (const bucket of buckets) {
    // local insertion sort per bucket
    for (let i = 1; i < bucket.length; i += 1) {
      const key = bucket[i];
      let j = i - 1;
      while (j >= 0 && bucket[j] > key) {
        bucket[j + 1] = bucket[j];
        j -= 1;
      }
      bucket[j + 1] = key;
    }
    out.push(...bucket);
  }
  return out;
}
`,
        },
        "radix-sort": {
          fn: "radixSort",
          body: `
function radixSort(values) {
  let arr = [...values];
  const max = Math.max(...arr, 0);
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    const buckets = Array.from({ length: 10 }, () => []);
    for (const value of arr) {
      const digit = Math.floor(value / exp) % 10;
      buckets[digit].push(value);
    }
    arr = buckets.flat();
    exp *= 10;
  }
  return arr;
}
`,
        },
      };

      const impl = implBySlug[slug];
      const numericOnly = ["counting-sort", "bucket-sort", "radix-sort"].includes(slug);

      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Implementation Workbench",
            summary:
              "Implements the algorithm and runs it against representative data to validate correctness and operational behavior.",
            runFile: "app.js",
            checks: [
              "output ordering is correct for the input type",
              "algorithm-specific invariants are exercised on a non-trivial dataset",
              numericOnly
                ? "input restrictions are explicit (non-negative integers for radix/counting)"
                : "custom comparators work on both primitives and objects",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `${impl.body}\nmodule.exports = { ${impl.fn} };\n`,
              },
              {
                name: "app.js",
                content: `
const { ${impl.fn} } = require("./algorithm");

const numbers = [7, 2, 9, 2, 1, 8, 3];
console.log("${impl.fn} numbers:", ${impl.fn}(numbers${slug === "counting-sort" ? ", 10" : ""}));

const telemetry = [
  { id: "r1", latencyMs: 180 },
  { id: "r2", latencyMs: 95 },
  { id: "r3", latencyMs: 140 },
  { id: "r4", latencyMs: 95 },
];
${numericOnly ? "console.log('Note: object sorting not applicable for this numeric-only sort.');" : `\nconst sorted = ${impl.fn}(telemetry, (a, b) => a.latencyMs - b.latencyMs);\nconsole.table(sorted);\n`}
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Stability and Trade-offs",
            summary:
              "Covers stability and operational trade-offs (in-place vs extra memory, worst-case vs average-case).",
            runFile: "demo.js",
            checks: [
              "stability is discussed in the context of tie-breaking and determinism",
              "space usage implications are called out",
              "worst-case behavior is explicit (e.g., quicksort pivot risk)",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("Stability: merge sort is stable; quick sort and heap sort are typically not stable without extra bookkeeping.");
console.log("Space: merge sort uses extra memory; in-place quicksort uses less but risks worst-case without good pivots.");
console.log("Production: choose based on data distribution, stability needs, and memory budget.");
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases and Correctness Checks",
            summary:
              "Exercises boundary cases (empty inputs, duplicates, already-sorted data) and validates preconditions where applicable.",
            runFile: "demo.js",
            checks: [
              "empty and single-element inputs return unchanged",
              "duplicates are preserved",
              numericOnly
                ? "invalid inputs (negative or non-integers) are treated as out-of-scope and should be validated upstream"
                : "already-sorted inputs do not regress",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { ${impl.fn} } = require("../example-1/algorithm");

console.log("Empty:", ${impl.fn}([]${slug === "counting-sort" ? ", 0" : ""}));
console.log("Single:", ${impl.fn}([1]${slug === "counting-sort" ? ", 1" : ""}));
console.log("Duplicates:", ${impl.fn}([2, 2, 2, 1]${slug === "counting-sort" ? ", 2" : ""}));
console.log("Already sorted:", ${impl.fn}([1, 2, 3, 4]${slug === "counting-sort" ? ", 4" : ""}));
`,
              },
            ],
          },
        ],
      };
    }

    // Searching
    case "linear-search":
    case "binary-search":
    case "jump-search":
    case "interpolation-search":
    case "exponential-search":
    case "ternary-search": {
      const implBySlug = {
        "linear-search": {
          fn: "linearSearch",
          body: `
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] === target) return i;
  }
  return -1;
}
`,
        },
        "binary-search": {
          fn: "binarySearch",
          body: `
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
`,
        },
        "jump-search": {
          fn: "jumpSearch",
          body: `
function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n)) || 1;
  let prev = 0;
  let next = step;

  while (prev < n && arr[Math.min(next, n) - 1] < target) {
    prev = next;
    next += step;
    if (prev >= n) return -1;
  }
  for (let i = prev; i < Math.min(next, n); i += 1) {
    if (arr[i] === target) return i;
  }
  return -1;
}
`,
        },
        "interpolation-search": {
          fn: "interpolationSearch",
          body: `
function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    const range = arr[high] - arr[low];
    if (range === 0) return arr[low] === target ? low : -1;
    const pos =
      low +
      Math.floor(((target - arr[low]) * (high - low)) / range);
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}
`,
        },
        "exponential-search": {
          fn: "exponentialSearch",
          body: `
function exponentialSearch(arr, target) {
  if (arr.length === 0) return -1;
  if (arr[0] === target) return 0;
  let bound = 1;
  while (bound < arr.length && arr[bound] < target) bound *= 2;
  let low = Math.floor(bound / 2);
  let high = Math.min(bound, arr.length - 1);
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
`,
        },
        "ternary-search": {
          fn: "ternarySearch",
          body: `
function ternarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const third = Math.floor((high - low) / 3);
    const mid1 = low + third;
    const mid2 = high - third;
    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;
    if (target < arr[mid1]) high = mid1 - 1;
    else if (target > arr[mid2]) low = mid2 + 1;
    else {
      low = mid1 + 1;
      high = mid2 - 1;
    }
  }
  return -1;
}
`,
        },
      };

      const impl = implBySlug[slug];
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Implementation Workbench",
            summary:
              "Implements the search routine and runs it against a sorted index to validate correctness and return semantics.",
            runFile: "app.js",
            checks: [
              "returns an index for found items (or -1 for misses)",
              "assumptions (sorted vs unsorted input) are explicit",
              "works under duplicates and boundary targets",
            ],
            files: [
              { name: "algorithm.js", content: `${impl.body}\nmodule.exports = { ${impl.fn} };\n` },
              {
                name: "app.js",
                content: `
const { ${impl.fn} } = require("./algorithm");

const index = [3, 6, 9, 12, 15, 18, 21];
console.log("${impl.fn} hit:", ${impl.fn}(index, 15));
console.log("${impl.fn} miss:", ${impl.fn}(index, 8));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Lower/Upper Bound Follow-Up",
            summary:
              "Implements lowerBound/upperBound to cover duplicates and insertion-point semantics — a common follow-up to basic search.",
            runFile: "demo.js",
            checks: [
              "lowerBound returns the first index where value >= target",
              "upperBound returns the first index where value > target",
              "works under duplicates and misses",
            ],
            files: [
              {
                name: "demo.js",
                content: `
function lowerBound(arr, target) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] < target) low = mid + 1;
    else high = mid;
  }
  return low;
}

function upperBound(arr, target) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] <= target) low = mid + 1;
    else high = mid;
  }
  return low;
}

const values = [1, 2, 2, 2, 5, 9];
console.log("lowerBound(2):", lowerBound(values, 2));
console.log("upperBound(2):", upperBound(values, 2));
console.log("insertion point for 4:", lowerBound(values, 4));
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases and Preconditions",
            summary:
              "Covers edge cases like empty arrays, singletons, and precondition violations (binary/ternary/interpolation require sorted inputs).",
            runFile: "demo.js",
            checks: [
              "empty inputs behave safely",
              "singleton hit/miss behavior is correct",
              "unsorted input is explicitly called out as invalid for ordered searches",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { ${impl.fn} } = require("../example-1/algorithm");

console.log("Empty:", ${impl.fn}([], 1));
console.log("Singleton hit:", ${impl.fn}([5], 5));
console.log("Singleton miss:", ${impl.fn}([5], 1));

const unsorted = [3, 1, 2];
console.log("Unsorted result (invalid precondition):", ${impl.fn}(unsorted, 2));
console.log("Observation: ordered searches assume sorted, monotonic input.");
`,
              },
            ],
          },
        ],
      };
    }

    case "bfs":
    case "dfs": {
      const fn = slug === "bfs" ? "bfs" : "dfs";
      const body =
        slug === "bfs"
          ? `
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}
`
          : `
function dfs(graph, start) {
  const visited = new Set();
  const order = [];
  function walk(node) {
    if (visited.has(node)) return;
    visited.add(node);
    order.push(node);
    for (const neighbor of graph[node] ?? []) walk(neighbor);
  }
  walk(start);
  return order;
}
`;
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Traversal Workbench",
            summary:
              "Implements traversal over an adjacency list and demonstrates visitation order on a small service graph.",
            runFile: "app.js",
            checks: [
              "visited-set prevents infinite loops on cycles",
              slug === "bfs"
                ? "BFS visits nodes in level order from the start"
                : "DFS visits nodes in depth-first order from the start",
              "disconnected nodes are not visited",
            ],
            files: [
              { name: "algorithm.js", content: `${body}\nmodule.exports = { ${fn} };\n` },
              {
                name: "app.js",
                content: `
const { ${fn} } = require("./algorithm");

const graph = {
  api: ["auth", "catalog"],
  auth: ["sessions"],
  catalog: ["search"],
  sessions: [],
  search: ["api"],
};

console.log("${fn} order:", ${fn}(graph, "api"));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Path Reconstruction (BFS)",
            summary:
              "Shows how to reconstruct paths using a parent map, which commonly comes up after traversal basics.",
            runFile: "demo.js",
            checks: [
              "parent map reconstructs the path end-to-start",
              "unreachable targets return null cleanly",
              "BFS yields minimum-hop paths in unweighted graphs",
            ],
            files: [
              {
                name: "demo.js",
                content: `
function shortestPath(graph, start, target) {
  const queue = [start];
  const visited = new Set([start]);
  const parent = new Map();
  while (queue.length) {
    const node = queue.shift();
    if (node === target) break;
    for (const neighbor of graph[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, node);
        queue.push(neighbor);
      }
    }
  }
  if (!visited.has(target)) return null;
  const path = [];
  let current = target;
  while (current !== undefined) {
    path.push(current);
    if (current === start) break;
    current = parent.get(current);
  }
  return path.reverse();
}

const graph = { A: ["B", "C"], B: ["D"], C: ["D"], D: [] };
console.log("A -> D:", shortestPath(graph, "A", "D"));
console.log("A -> Z:", shortestPath(graph, "A", "Z"));
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases and Defensive Checks",
            summary:
              "Covers cycles, self-loops, and disconnected graphs to ensure traversal code stays safe on real inputs.",
            runFile: "demo.js",
            checks: [
              "self-loops do not cause infinite traversal",
              "cycles are handled via visited-set guards",
              "disconnected graphs return partial visitation as expected",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { ${fn} } = require("../example-1/algorithm");
const graph = { A: ["A", "B"], B: ["C"], C: ["A"], D: [] };
console.log("From A:", ${fn}(graph, "A"));
console.log("From D:", ${fn}(graph, "D"));
`,
              },
            ],
          },
        ],
      };
    }

    case "dijkstra":
    case "bellman-ford":
    case "floyd-warshall": {
      if (slug === "dijkstra") {
        return {
          title,
          examples: [
            {
              id: "example-1",
              title: "Weighted Shortest Path Workbench",
              summary:
                "Implements Dijkstra’s algorithm for non-negative edge weights and demonstrates routing distances.",
              runFile: "app.js",
              checks: [
                "distance relaxation updates shortest known paths",
                "unreachable nodes remain Infinity",
                "negative weights are treated as invalid for Dijkstra",
              ],
              files: [
                {
                  name: "algorithm.js",
                  content: `
function dijkstra(graph, start) {
  const nodes = Object.keys(graph);
  const dist = new Map(nodes.map((n) => [n, Infinity]));
  dist.set(start, 0);
  const visited = new Set();

  while (visited.size < nodes.length) {
    let current = null;
    let best = Infinity;
    for (const node of nodes) {
      const d = dist.get(node);
      if (!visited.has(node) && d < best) {
        best = d;
        current = node;
      }
    }
    if (current === null) break;
    visited.add(current);
    for (const edge of graph[current] ?? []) {
      if (edge.weight < 0) throw new Error("Negative weight not allowed for Dijkstra");
      const next = dist.get(current) + edge.weight;
      if (next < dist.get(edge.to)) dist.set(edge.to, next);
    }
  }
  return Object.fromEntries(dist);
}

module.exports = { dijkstra };
`,
                },
                {
                  name: "app.js",
                  content: `
const { dijkstra } = require("./algorithm");

const graph = {
  A: [{ to: "B", weight: 2 }, { to: "C", weight: 5 }],
  B: [{ to: "C", weight: 1 }, { to: "D", weight: 4 }],
  C: [{ to: "D", weight: 1 }],
  D: [],
};

console.log("Distances from A:", dijkstra(graph, "A"));
`,
                },
              ],
            },
            {
              id: "example-2",
              title: "Follow-Up: Priority Queue Optimization",
              summary:
                "Explains the standard optimization: use a min-priority-queue so selecting the next node is O(log n) instead of O(n).",
              runFile: "demo.js",
              checks: [
                "complexity improves from O(V^2) to O((V+E) log V)",
                "priority queue must support decrease-key (or push duplicates + ignore stale entries)",
                "graph density influences whether the optimization matters",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
console.log("Production Dijkstra typically uses a min-heap priority queue.");
console.log("Implementation note: if you can’t decrease-key, push duplicates and ignore stale distances when popped.");
`,
                },
              ],
            },
            {
              id: "example-3",
              title: "Edge Cases and Correctness Checks",
              summary:
                "Exercises unreachable nodes and disconnected graphs so downstream code can safely interpret Infinity distances.",
              runFile: "demo.js",
              checks: [
                "unreachable nodes remain Infinity",
                "start node distance is zero",
                "empty adjacency lists do not throw",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
const { dijkstra } = require("../example-1/algorithm");
const graph = { A: [{ to: "B", weight: 1 }], B: [], C: [] };
console.log(dijkstra(graph, "A"));
`,
                },
              ],
            },
          ],
        };
      }

      if (slug === "bellman-ford") {
        return {
          title,
          examples: [
            {
              id: "example-1",
              title: "Shortest Path with Negative Weights",
              summary:
                "Implements Bellman–Ford and demonstrates shortest paths even with negative weights (when no negative cycle exists).",
              runFile: "app.js",
              checks: [
                "relaxation runs V-1 times over all edges",
                "supports negative weights",
                "detects negative cycles by checking for additional relaxation",
              ],
              files: [
                {
                  name: "algorithm.js",
                  content: `
function bellmanFord(nodes, edges, start) {
  const dist = new Map(nodes.map((n) => [n, Infinity]));
  dist.set(start, 0);

  for (let i = 0; i < nodes.length - 1; i += 1) {
    let changed = false;
    for (const { from, to, weight } of edges) {
      const fromDist = dist.get(from);
      if (fromDist !== Infinity && fromDist + weight < dist.get(to)) {
        dist.set(to, fromDist + weight);
        changed = true;
      }
    }
    if (!changed) break;
  }

  for (const { from, to, weight } of edges) {
    const fromDist = dist.get(from);
    if (fromDist !== Infinity && fromDist + weight < dist.get(to)) {
      return { distances: Object.fromEntries(dist), hasNegativeCycle: true };
    }
  }

  return { distances: Object.fromEntries(dist), hasNegativeCycle: false };
}

module.exports = { bellmanFord };
`,
                },
                {
                  name: "app.js",
                  content: `
const { bellmanFord } = require("./algorithm");

const nodes = ["A", "B", "C", "D"];
const edges = [
  { from: "A", to: "B", weight: 1 },
  { from: "B", to: "C", weight: -2 },
  { from: "A", to: "C", weight: 4 },
  { from: "C", to: "D", weight: 2 },
];

console.log(bellmanFord(nodes, edges, "A"));
`,
                },
              ],
            },
            {
              id: "example-2",
              title: "Follow-Up: Negative Cycle Detection",
              summary:
                "Adds a negative-cycle example because this is the key differentiator of Bellman–Ford in interviews and production.",
              runFile: "demo.js",
              checks: [
                "a final relaxation pass detects a reachable negative cycle",
                "distances are not meaningful when a negative cycle exists",
                "production code should surface a structured error",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
const { bellmanFord } = require("../example-1/algorithm");

const nodes = ["A", "B", "C"];
const edges = [
  { from: "A", to: "B", weight: 1 },
  { from: "B", to: "C", weight: -2 },
  { from: "C", to: "B", weight: -2 },
];

console.log(bellmanFord(nodes, edges, "A"));
`,
                },
              ],
            },
            {
              id: "example-3",
              title: "Edge Cases",
              summary:
                "Covers unreachable nodes and empty graphs, ensuring outputs remain explicit and safe to consume.",
              runFile: "demo.js",
              checks: [
                "unreachable nodes remain Infinity",
                "start node stays at 0 distance",
                "empty edge sets do not throw",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
const { bellmanFord } = require("../example-1/algorithm");
console.log(bellmanFord(["A", "B"], [], "A"));
`,
                },
              ],
            },
          ],
        };
      }

      // floyd-warshall
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "All-Pairs Shortest Paths",
            summary:
              "Implements Floyd–Warshall to compute all-pairs shortest paths on a dense graph.",
            runFile: "app.js",
            checks: [
              "DP over intermediate nodes progressively improves distances",
              "supports negative edges (but not negative cycles without extra checks)",
              "O(V^3) complexity is explicit and appropriate for small dense graphs",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
function floydWarshall(nodes, edges) {
  const index = new Map(nodes.map((n, i) => [n, i]));
  const dist = Array.from({ length: nodes.length }, () =>
    new Array(nodes.length).fill(Infinity),
  );
  for (let i = 0; i < nodes.length; i += 1) dist[i][i] = 0;
  for (const { from, to, weight } of edges) {
    dist[index.get(from)][index.get(to)] = Math.min(
      dist[index.get(from)][index.get(to)],
      weight,
    );
  }

  for (let k = 0; k < nodes.length; k += 1) {
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = 0; j < nodes.length; j += 1) {
        const through = dist[i][k] + dist[k][j];
        if (through < dist[i][j]) dist[i][j] = through;
      }
    }
  }

  return dist;
}

module.exports = { floydWarshall };
`,
              },
              {
                name: "app.js",
                content: `
const { floydWarshall } = require("./algorithm");
const nodes = ["A", "B", "C"];
const edges = [
  { from: "A", to: "B", weight: 2 },
  { from: "B", to: "C", weight: 3 },
  { from: "A", to: "C", weight: 10 },
];
console.log(floydWarshall(nodes, edges));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Negative Cycle Check",
            summary:
              "Shows how to detect negative cycles by inspecting the diagonal after running Floyd–Warshall.",
            runFile: "demo.js",
            checks: [
              "dist[i][i] < 0 implies a negative cycle reachable from i",
              "results are not meaningful if negative cycles exist",
              "production code should surface cycle presence clearly",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { floydWarshall } = require("../example-1/algorithm");
const nodes = ["A", "B"];
const edges = [
  { from: "A", to: "B", weight: -2 },
  { from: "B", to: "A", weight: -2 },
];
const dist = floydWarshall(nodes, edges);
console.log(dist);
console.log("Negative cycle?", dist[0][0] < 0 || dist[1][1] < 0);
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases",
            summary:
              "Covers missing edges (Infinity) and small graphs so consumers treat unreachable pairs explicitly.",
            runFile: "demo.js",
            checks: [
              "missing edges remain Infinity",
              "dist[i][i] is zero when no negative cycles exist",
              "empty edge sets behave safely",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { floydWarshall } = require("../example-1/algorithm");
console.log(floydWarshall(["A", "B"], []));
`,
              },
            ],
          },
        ],
      };
    }

    case "prims-mst":
    case "kruskals-mst": {
      if (slug === "prims-mst") {
        return {
          title,
          examples: [
            {
              id: "example-1",
              title: "Prim’s MST Workbench",
              summary:
                "Computes a minimum spanning tree for a small undirected graph using Prim’s algorithm.",
              runFile: "app.js",
              checks: [
                "each step picks the cheapest edge crossing the cut",
                "final edges form a spanning tree (no cycles)",
                "disconnected graphs yield a forest (partial coverage)",
              ],
              files: [
                {
                  name: "algorithm.js",
                  content: `
function primMst(graph, start) {
  const visited = new Set([start]);
  const edges = [];
  const nodes = Object.keys(graph);

  while (visited.size < nodes.length) {
    let best = null;
    for (const node of visited) {
      for (const edge of graph[node] ?? []) {
        if (!visited.has(edge.to) && (!best || edge.weight < best.weight)) {
          best = { from: node, ...edge };
        }
      }
    }
    if (!best) break;
    visited.add(best.to);
    edges.push(best);
  }
  return edges;
}

module.exports = { primMst };
`,
                },
                {
                  name: "app.js",
                  content: `
const { primMst } = require("./algorithm");
const graph = {
  A: [{ to: "B", weight: 2 }, { to: "C", weight: 3 }],
  B: [{ to: "A", weight: 2 }, { to: "C", weight: 1 }, { to: "D", weight: 4 }],
  C: [{ to: "A", weight: 3 }, { to: "B", weight: 1 }, { to: "D", weight: 5 }],
  D: [{ to: "B", weight: 4 }, { to: "C", weight: 5 }],
};
console.table(primMst(graph, "A"));
`,
                },
              ],
            },
            {
              id: "example-2",
              title: "Follow-Up: Dense vs Sparse Trade-offs",
              summary:
                "Explains when Prim’s (frontier-based) is preferable versus Kruskal’s (edge-sorting) depending on graph density.",
              runFile: "demo.js",
              checks: [
                "dense graphs often favor Prim with adjacency structures",
                "sparse graphs often favor Kruskal with sorted edges + union-find",
                "implementation choice affects constant factors more than asymptotics in small graphs",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
console.log("Prim grows from a start node using the cheapest cut edge; good with adjacency representation.");
console.log("Kruskal sorts edges globally and unions components; good when edge list is natural and sparse.");
`,
                },
              ],
            },
            {
              id: "example-3",
              title: "Edge Cases (Disconnected Graphs)",
              summary:
                "Shows the forest behavior when the graph is disconnected so production code can detect partial coverage.",
              runFile: "demo.js",
              checks: [
                "disconnected nodes cannot be reached from the chosen start",
                "output covers only the reachable component",
                "production code should detect visited coverage",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
const { primMst } = require("../example-1/algorithm");
const graph = { A: [{ to: "B", weight: 1 }], B: [{ to: "A", weight: 1 }], C: [] };
console.table(primMst(graph, "A"));
console.log("Observation: C is disconnected, so MST is a forest.");
`,
                },
              ],
            },
          ],
        };
      }

      // kruskals-mst
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Kruskal’s MST Workbench",
            summary:
              "Computes a minimum spanning tree by sorting edges and using union-find to avoid cycles.",
            runFile: "app.js",
            checks: [
              "edges are processed in ascending weight order",
              "union-find prevents cycles",
              "selected edges connect all nodes in a connected graph",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
class UnionFind {
  constructor(nodes) {
    this.parent = new Map(nodes.map((n) => [n, n]));
    this.rank = new Map(nodes.map((n) => [n, 0]));
  }
  find(x) {
    const p = this.parent.get(x);
    if (p !== x) this.parent.set(x, this.find(p));
    return this.parent.get(x);
  }
  union(a, b) {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    const rka = this.rank.get(ra);
    const rkb = this.rank.get(rb);
    if (rka < rkb) [ra, rb] = [rb, ra];
    this.parent.set(rb, ra);
    if (rka === rkb) this.rank.set(ra, rka + 1);
    return true;
  }
}

function kruskal(nodes, edges) {
  const uf = new UnionFind(nodes);
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const chosen = [];
  for (const edge of sorted) {
    if (uf.union(edge.from, edge.to)) chosen.push(edge);
  }
  return chosen;
}

module.exports = { kruskal };
`,
              },
              {
                name: "app.js",
                content: `
const { kruskal } = require("./algorithm");
const nodes = ["A", "B", "C", "D"];
const edges = [
  { from: "A", to: "B", weight: 2 },
  { from: "A", to: "C", weight: 3 },
  { from: "B", to: "C", weight: 1 },
  { from: "B", to: "D", weight: 4 },
  { from: "C", to: "D", weight: 5 },
];
console.table(kruskal(nodes, edges));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Union-Find Correctness",
            summary:
              "Focuses on union-find invariants (path compression and union by rank), a common follow-up when discussing Kruskal.",
            runFile: "demo.js",
            checks: [
              "union-find roots represent components",
              "path compression flattens parent chains",
              "union by rank avoids tall trees",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("Union-Find: components are represented by roots; union merges roots; find compresses paths.");
console.log("Invariant: if find(a) === find(b), adding edge (a,b) creates a cycle and must be rejected.");
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases (Disconnected Graphs)",
            summary:
              "Demonstrates MST forest behavior when the graph is disconnected.",
            runFile: "demo.js",
            checks: [
              "output may have fewer than (V-1) edges",
              "each connected component yields a spanning tree",
              "production code should validate coverage",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { kruskal } = require("../example-1/algorithm");
console.table(
  kruskal(["A", "B", "C"], [{ from: "A", to: "B", weight: 1 }]),
);
console.log("Observation: node C is isolated, so the result is a forest.");
`,
              },
            ],
          },
        ],
      };
    }

    case "topological-sort": {
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Dependency Ordering Workbench",
            summary:
              "Implements Kahn’s algorithm for topological sorting of a DAG and prints a valid build/deploy order.",
            runFile: "app.js",
            checks: [
              "nodes with indegree 0 are processed first",
              "each edge reduces indegree of its neighbor",
              "order contains all nodes when the graph is acyclic",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
function topoSort(nodes, edges) {
  const indegree = new Map(nodes.map((n) => [n, 0]));
  const adj = new Map(nodes.map((n) => [n, []]));
  for (const [from, to] of edges) {
    adj.get(from).push(to);
    indegree.set(to, indegree.get(to) + 1);
  }
  const queue = nodes.filter((n) => indegree.get(n) === 0);
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of adj.get(node)) {
      indegree.set(neighbor, indegree.get(neighbor) - 1);
      if (indegree.get(neighbor) === 0) queue.push(neighbor);
    }
  }
  return order.length === nodes.length ? order : null;
}

module.exports = { topoSort };
`,
              },
              {
                name: "app.js",
                content: `
const { topoSort } = require("./algorithm");
const nodes = ["schema", "api", "web", "worker"];
const edges = [
  ["schema", "api"],
  ["api", "web"],
  ["api", "worker"],
];
console.log("Order:", topoSort(nodes, edges));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Multiple Valid Orders",
            summary:
              "Highlights that topological ordering may not be unique; deterministic output needs tie-breaking policy.",
            runFile: "demo.js",
            checks: [
              "multiple nodes can have indegree 0 at once",
              "tie-breaking (lexicographic) yields deterministic order",
              "different valid orders still satisfy dependency constraints",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("Topological sort is not unique when multiple nodes have indegree 0 simultaneously.");
console.log("Production build systems usually add deterministic tie-breaking (e.g., lexicographic priority queues).");
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases (Cycle Detection)",
            summary:
              "Shows the critical edge case: cycles mean no topological order exists and must be reported.",
            runFile: "demo.js",
            checks: [
              "cycles prevent processing all nodes",
              "null output indicates cycle presence",
              "production code should surface the cycle (or the remaining nodes) for debugging",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { topoSort } = require("../example-1/algorithm");
const nodes = ["A", "B"];
const edges = [["A", "B"], ["B", "A"]];
console.log("Order:", topoSort(nodes, edges));
`,
              },
            ],
          },
        ],
      };
    }

    case "tarjans-scc": {
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "SCC Workbench",
            summary:
              "Implements Tarjan’s algorithm to find strongly connected components in a directed graph.",
            runFile: "app.js",
            checks: [
              "lowlink values capture back-edges",
              "stack membership tracks the current DFS component",
              "SCCs are emitted when a root is discovered",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
function tarjansScc(graph) {
  let index = 0;
  const indices = new Map();
  const lowlink = new Map();
  const stack = [];
  const onStack = new Set();
  const components = [];

  function strongConnect(v) {
    indices.set(v, index);
    lowlink.set(v, index);
    index += 1;
    stack.push(v);
    onStack.add(v);

    for (const w of graph[v] ?? []) {
      if (!indices.has(w)) {
        strongConnect(w);
        lowlink.set(v, Math.min(lowlink.get(v), lowlink.get(w)));
      } else if (onStack.has(w)) {
        lowlink.set(v, Math.min(lowlink.get(v), indices.get(w)));
      }
    }

    if (lowlink.get(v) === indices.get(v)) {
      const component = [];
      while (true) {
        const w = stack.pop();
        onStack.delete(w);
        component.push(w);
        if (w === v) break;
      }
      components.push(component);
    }
  }

  for (const v of Object.keys(graph)) {
    if (!indices.has(v)) strongConnect(v);
  }
  return components;
}

module.exports = { tarjansScc };
`,
              },
              {
                name: "app.js",
                content: `
const { tarjansScc } = require("./algorithm");
const graph = { A: ["B"], B: ["C"], C: ["A", "D"], D: ["E"], E: ["D"] };
console.log(tarjansScc(graph));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Condensation Graph",
            summary:
              "Explains the condensation DAG and why SCCs are a key step before topological ordering in dependency graphs.",
            runFile: "demo.js",
            checks: [
              "each SCC collapses into a single node in the condensation graph",
              "condensation graph is always a DAG",
              "useful for build systems, dependency analysis, and deadlock detection",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("Condensation graph: collapse each SCC into a node; edges between SCCs yield a DAG.");
console.log("Common use: compress cycles before running topo sort on the resulting DAG.");
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases",
            summary:
              "Covers self-loops, isolated nodes, and disconnected graphs.",
            runFile: "demo.js",
            checks: [
              "isolated nodes form SCCs of size 1",
              "self-loops still produce SCC size 1 but represent a cycle",
              "disconnected components are handled by outer iteration",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { tarjansScc } = require("../example-1/algorithm");
console.log(tarjansScc({ A: ["A"], B: [], C: ["D"], D: [] }));
`,
              },
            ],
          },
        ],
      };
    }

    case "kmp":
    case "rabin-karp":
    case "boyer-moore": {
      if (slug === "kmp") {
        return {
          title,
          examples: [
            {
              id: "example-1",
              title: "KMP Search Workbench",
              summary:
                "Implements KMP substring search using the LPS (prefix function) table and scans a log string.",
              runFile: "app.js",
              checks: [
                "LPS computation is correct for repeated prefixes",
                "search runs in O(n+m) time",
                "finds the first match index (or -1 on miss)",
              ],
              files: [
                {
                  name: "algorithm.js",
                  content: `
function buildLps(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len += 1;
      lps[i] = len;
      i += 1;
    } else if (len !== 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i += 1;
    }
  }
  return lps;
}

function kmpSearch(text, pattern) {
  if (pattern.length === 0) return 0;
  const lps = buildLps(pattern);
  let i = 0;
  let j = 0;
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i += 1;
      j += 1;
      if (j === pattern.length) return i - j;
    } else if (j !== 0) {
      j = lps[j - 1];
    } else {
      i += 1;
    }
  }
  return -1;
}

module.exports = { buildLps, kmpSearch };
`,
                },
                {
                  name: "app.js",
                  content: `
const { kmpSearch, buildLps } = require("./algorithm");
console.log("LPS for 'ababaca':", buildLps("ababaca"));
console.log("Match:", kmpSearch("ERROR timeout shard-2 timeout shard-3", "timeout"));
console.log("Miss:", kmpSearch("abcd", "ef"));
`,
                },
              ],
            },
            {
              id: "example-2",
              title: "Follow-Up: Overlapping Matches",
              summary:
                "Shows the overlap behavior (e.g., 'aaaa' in 'aaaaaa'), a common follow-up to test LPS correctness.",
              runFile: "demo.js",
              checks: [
                "overlapping patterns still match correctly",
                "LPS prevents full backtracking",
                "empty pattern policy is explicit",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
const { kmpSearch } = require("../example-1/algorithm");
console.log("Overlap match:", kmpSearch("aaaaaa", "aaaa"));
console.log("Empty pattern:", kmpSearch("abc", ""));
`,
                },
              ],
            },
            {
              id: "example-3",
              title: "Edge Cases",
              summary:
                "Covers empty text, pattern longer than text, and non-ASCII characters.",
              runFile: "demo.js",
              checks: [
                "pattern longer than text returns -1",
                "empty text returns -1 unless pattern is empty",
                "Unicode strings still behave deterministically under code unit comparisons",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
const { kmpSearch } = require("../example-1/algorithm");
console.log(kmpSearch("", "a"));
console.log(kmpSearch("a", "aaaa"));
console.log(kmpSearch("café", "fé"));
`,
                },
              ],
            },
          ],
        };
      }

      if (slug === "rabin-karp") {
        return {
          title,
          examples: [
            {
              id: "example-1",
              title: "Rabin–Karp Workbench",
              summary:
                "Implements Rabin–Karp using a rolling hash and verifies matches to avoid false positives.",
              runFile: "app.js",
              checks: [
                "rolling hash updates in O(1) per step",
                "hash matches are verified by substring compare",
                "demonstrates expected-case fast scanning",
              ],
              files: [
                {
                  name: "algorithm.js",
                  content: `
function rabinKarp(text, pattern) {
  if (pattern.length === 0) return 0;
  const base = 257;
  const mod = 1_000_000_007;
  const m = pattern.length;
  let patHash = 0;
  let txtHash = 0;
  let pow = 1;

  for (let i = 0; i < m; i += 1) {
    patHash = (patHash * base + pattern.charCodeAt(i)) % mod;
    txtHash = (txtHash * base + text.charCodeAt(i)) % mod;
    if (i < m - 1) pow = (pow * base) % mod;
  }

  for (let i = 0; i <= text.length - m; i += 1) {
    if (patHash === txtHash) {
      if (text.slice(i, i + m) === pattern) return i;
    }
    if (i < text.length - m) {
      txtHash =
        (txtHash - text.charCodeAt(i) * pow) % mod;
      if (txtHash < 0) txtHash += mod;
      txtHash = (txtHash * base + text.charCodeAt(i + m)) % mod;
    }
  }

  return -1;
}

module.exports = { rabinKarp };
`,
                },
                {
                  name: "app.js",
                  content: `
const { rabinKarp } = require("./algorithm");
const text = "ERROR timeout shard-2; retrying; timeout shard-2";
console.log("Match @", rabinKarp(text, "timeout"));
console.log("Miss @", rabinKarp(text, "success"));
`,
                },
              ],
            },
            {
              id: "example-2",
              title: "Follow-Up: Multiple Matches",
              summary:
                "Collects all match offsets, which commonly follows once you have the rolling hash working.",
              runFile: "demo.js",
              checks: [
                "collects all occurrences, not just the first",
                "verifies matches to avoid hash collision false positives",
                "maintains linear scan complexity",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
const { rabinKarp } = require("../example-1/algorithm");
const text = "aaaaa";
const pattern = "aa";
let index = 0;
const hits = [];
while (index <= text.length - pattern.length) {
  const pos = rabinKarp(text.slice(index), pattern);
  if (pos === -1) break;
  hits.push(index + pos);
  index += pos + 1;
}
console.log("Hits:", hits);
`,
                },
              ],
            },
            {
              id: "example-3",
              title: "Edge Cases",
              summary:
                "Covers empty patterns and patterns longer than the text.",
              runFile: "demo.js",
              checks: [
                "empty pattern policy is explicit",
                "pattern longer than text returns -1",
                "non-ASCII characters still hash deterministically under code units",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
const { rabinKarp } = require("../example-1/algorithm");
console.log("Empty pattern:", rabinKarp("abc", ""));
console.log("Long pattern:", rabinKarp("abc", "abcd"));
console.log("Unicode:", rabinKarp("café", "fé"));
`,
                },
              ],
            },
          ],
        };
      }

      // boyer-moore (bad-character only)
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Boyer–Moore Workbench",
            summary:
              "Implements the bad-character heuristic to skip ahead during substring search.",
            runFile: "app.js",
            checks: [
              "bad-character table drives skip distances",
              "search finds match index (or -1)",
              "skips reduce comparisons on typical text",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
function buildBadChar(pattern) {
  const table = new Map();
  for (let i = 0; i < pattern.length; i += 1) {
    table.set(pattern[i], i);
  }
  return table;
}

function boyerMoore(text, pattern) {
  if (pattern.length === 0) return 0;
  const bad = buildBadChar(pattern);
  let shift = 0;
  while (shift <= text.length - pattern.length) {
    let j = pattern.length - 1;
    while (j >= 0 && pattern[j] === text[shift + j]) j -= 1;
    if (j < 0) return shift;
    const last = bad.get(text[shift + j]);
    shift += Math.max(1, j - (last ?? -1));
  }
  return -1;
}

module.exports = { boyerMoore };
`,
              },
              {
                name: "app.js",
                content: `
const { boyerMoore } = require("./algorithm");
const text = "ERROR timeout shard-2; retrying; timeout shard-2";
console.log("Match @", boyerMoore(text, "timeout"));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Good Suffix Heuristic",
            summary:
              "Explains the second skip heuristic (good-suffix), which is the common follow-up after bad-character.",
            runFile: "demo.js",
            checks: [
              "good-suffix can skip even more than bad-character alone",
              "full Boyer–Moore combines both heuristics",
              "worst-case still exists without careful implementation",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("Boyer–Moore typically combines bad-character and good-suffix heuristics.");
console.log("Bad-character is simpler; good-suffix can improve skips when suffixes repeat inside the pattern.");
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases",
            summary:
              "Covers empty pattern policy and patterns longer than text.",
            runFile: "demo.js",
            checks: [
              "empty pattern policy is explicit",
              "pattern longer than text returns -1",
              "overlapping matches behave deterministically",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { boyerMoore } = require("../example-1/algorithm");
console.log("Empty pattern:", boyerMoore("abc", ""));
console.log("Long pattern:", boyerMoore("abc", "abcd"));
console.log("Overlap:", boyerMoore("aaaaaa", "aaaa"));
`,
              },
            ],
          },
        ],
      };
    }

    case "quickselect": {
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Kth-Element Selection Workbench",
            summary:
              "Implements Quickselect to find the k-th smallest element without fully sorting the array.",
            runFile: "app.js",
            checks: [
              "partitioning shrinks the search interval each iteration",
              "average-case linear time is the goal",
              "k is 0-based and validated",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
function quickselect(values, k) {
  const arr = [...values];
  if (k < 0 || k >= arr.length) throw new RangeError("k out of range");
  let left = 0;
  let right = arr.length - 1;

  function partition(l, r) {
    const pivot = arr[r];
    let i = l;
    for (let j = l; j < r; j += 1) {
      if (arr[j] <= pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i += 1;
      }
    }
    [arr[i], arr[r]] = [arr[r], arr[i]];
    return i;
  }

  while (true) {
    const p = partition(left, right);
    if (p === k) return arr[p];
    if (p < k) left = p + 1;
    else right = p - 1;
  }
}

module.exports = { quickselect };
`,
              },
              {
                name: "app.js",
                content: `
const { quickselect } = require("./algorithm");
const values = [9, 1, 7, 2, 8, 3, 5];
console.log("k=3:", quickselect(values, 3));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Pivot Strategy",
            summary:
              "Explains why pivot choice matters and how randomized pivots avoid adversarial worst-case behavior.",
            runFile: "demo.js",
            checks: [
              "bad pivots lead to O(n^2) worst-case",
              "randomization mitigates adversarial inputs",
              "median-of-three is a common practical heuristic",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("Quickselect worst-case occurs with consistently bad pivots (already sorted inputs + fixed pivot choice).");
console.log("Production implementations often randomize pivot choice or use median-of-three heuristics.");
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases",
            summary:
              "Covers duplicates, empty arrays, and invalid k values.",
            runFile: "demo.js",
            checks: [
              "duplicates are handled correctly",
              "empty arrays are rejected",
              "k bounds are validated",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { quickselect } = require("../example-1/algorithm");
console.log("Duplicates:", quickselect([2, 2, 2, 1], 1));
try { quickselect([], 0); } catch (e) { console.log("Empty rejected:", e.message); }
try { quickselect([1,2,3], 99); } catch (e) { console.log("Bad k rejected:", e.message); }
`,
              },
            ],
          },
        ],
      };
    }

    case "karatsuba-multiplication": {
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Karatsuba Workbench",
            summary:
              "Implements Karatsuba multiplication for large integers represented as BigInt (conceptual demonstration).",
            runFile: "app.js",
            checks: [
              "splits numbers into high/low halves",
              "uses three recursive multiplications instead of four",
              "matches BigInt multiplication for validation",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
function karatsuba(x, y) {
  if (x < 10n || y < 10n) return x * y;
  const xStr = x.toString();
  const yStr = y.toString();
  const n = BigInt(Math.max(xStr.length, yStr.length));
  const m = n / 2n;
  const pow = 10n ** m;

  const high1 = x / pow;
  const low1 = x % pow;
  const high2 = y / pow;
  const low2 = y % pow;

  const z0 = karatsuba(low1, low2);
  const z1 = karatsuba(low1 + high1, low2 + high2);
  const z2 = karatsuba(high1, high2);

  return z2 * (pow ** 2n) + (z1 - z2 - z0) * pow + z0;
}

module.exports = { karatsuba };
`,
              },
              {
                name: "app.js",
                content: `
const { karatsuba } = require("./algorithm");
const a = 12345678901234567890n;
const b = 98765432109876543210n;
console.log("Karatsuba:", karatsuba(a, b));
console.log("BigInt * :", a * b);
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Threshold Tuning",
            summary:
              "Explains why real implementations switch to grade-school multiplication below a threshold to reduce overhead.",
            runFile: "demo.js",
            checks: [
              "recursion overhead dominates for small inputs",
              "threshold tuning is hardware/runtime dependent",
              "big integer libraries use multiple algorithms by size range",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("Karatsuba has overhead; for small numbers grade-school multiplication is faster.");
console.log("Real big-int libraries pick algorithms by operand size (schoolbook, Karatsuba, Toom-Cook, FFT-based).");
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases",
            summary:
              "Covers zeros and small numbers, validating base cases.",
            runFile: "demo.js",
            checks: [
              "multiplying by zero returns zero",
              "single-digit inputs hit the base case",
              "negative inputs require sign handling (left as an explicit extension)",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { karatsuba } = require("../example-1/algorithm");
console.log(karatsuba(0n, 999n));
console.log(karatsuba(7n, 9n));
console.log("Observation: handle signs explicitly if you extend to negative integers.");
`,
              },
            ],
          },
        ],
      };
    }

    case "huffman-coding": {
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Huffman Coding Workbench",
            summary:
              "Builds a Huffman tree from symbol frequencies and emits prefix codes for compression-style encoding.",
            runFile: "app.js",
            checks: [
              "codes are prefix-free",
              "frequent symbols get shorter codes",
              "tree construction is deterministic given a tie-breaker",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
function buildTree(freq) {
  const nodes = Object.entries(freq).map(([sym, w]) => ({ sym, w, left: null, right: null }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.w - b.w || String(a.sym).localeCompare(String(b.sym)));
    const left = nodes.shift();
    const right = nodes.shift();
    nodes.push({ sym: null, w: left.w + right.w, left, right });
  }
  return nodes[0];
}

function buildCodes(node, prefix = "", out = {}) {
  if (!node) return out;
  if (node.sym !== null) out[node.sym] = prefix || "0";
  else {
    buildCodes(node.left, prefix + "0", out);
    buildCodes(node.right, prefix + "1", out);
  }
  return out;
}

module.exports = { buildTree, buildCodes };
`,
              },
              {
                name: "app.js",
                content: `
const { buildTree, buildCodes } = require("./algorithm");
const freq = { a: 45, b: 13, c: 12, d: 16, e: 9, f: 5 };
const tree = buildTree(freq);
const codes = buildCodes(tree);
console.log(codes);
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Encode/Decode",
            summary:
              "Adds the operational follow-up: using the codes to encode a string and decode it back.",
            runFile: "demo.js",
            checks: [
              "encoding maps symbols to bit strings",
              "decoding traverses the tree to reconstruct symbols",
              "unknown symbols are rejected or handled explicitly",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { buildTree, buildCodes } = require("../example-1/algorithm");
const freq = { a: 3, b: 2, c: 1 };
const tree = buildTree(freq);
const codes = buildCodes(tree);

function encode(text) {
  return [...text].map((ch) => codes[ch]).join("");
}

function decode(bits) {
  const out = [];
  let node = tree;
  for (const bit of bits) {
    node = bit === "0" ? node.left : node.right;
    if (node.sym !== null) {
      out.push(node.sym);
      node = tree;
    }
  }
  return out.join("");
}

const msg = "abac";
const bits = encode(msg);
console.log("bits:", bits);
console.log("decoded:", decode(bits));
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases",
            summary:
              "Covers single-symbol alphabets and tie-breaking behavior.",
            runFile: "demo.js",
            checks: [
              "single-symbol alphabet still yields a valid code",
              "ties require deterministic ordering for reproducible codes",
              "empty inputs should be handled explicitly",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { buildTree, buildCodes } = require("../example-1/algorithm");
console.log("Single symbol:", buildCodes(buildTree({ x: 10 })));
console.log("Tie case:", buildCodes(buildTree({ a: 1, b: 1, c: 1 })));
`,
              },
            ],
          },
        ],
      };
    }

    case "job-sequencing": {
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Greedy Scheduling Workbench",
            summary:
              "Implements job sequencing with deadlines (maximize profit) using a greedy profit-first strategy.",
            runFile: "app.js",
            checks: [
              "jobs are sorted by profit descending",
              "each job is placed in the latest available slot before its deadline",
              "result respects deadlines and maximizes profit for this model",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
function scheduleJobs(jobs) {
  const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
  const maxDeadline = Math.max(...sorted.map((j) => j.deadline), 0);
  const slots = new Array(maxDeadline).fill(null);

  for (const job of sorted) {
    for (let t = Math.min(job.deadline, maxDeadline) - 1; t >= 0; t -= 1) {
      if (!slots[t]) {
        slots[t] = job;
        break;
      }
    }
  }

  return slots.filter(Boolean);
}

module.exports = { scheduleJobs };
`,
              },
              {
                name: "app.js",
                content: `
const { scheduleJobs } = require("./algorithm");
const jobs = [
  { id: "a", deadline: 2, profit: 100 },
  { id: "b", deadline: 1, profit: 19 },
  { id: "c", deadline: 2, profit: 27 },
  { id: "d", deadline: 1, profit: 25 },
  { id: "e", deadline: 3, profit: 15 },
];
console.table(scheduleJobs(jobs));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Disjoint Set Optimization",
            summary:
              "Explains the follow-up optimization: using union-find to find the next free slot in near O(1) amortized time.",
            runFile: "demo.js",
            checks: [
              "union-find tracks the latest available slot",
              "reduces worst-case O(n^2) slot scanning",
              "useful when deadlines are large and jobs are many",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("Optimization: use a DSU where parent[t] points to the next available slot <= t.");
console.log("After scheduling a job at t, union(t, t-1) so future lookups skip filled slots.");
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases",
            summary:
              "Covers jobs with deadline 0, ties in profit, and oversubscribed schedules.",
            runFile: "demo.js",
            checks: [
              "deadline=0 jobs are ignored or rejected",
              "ties in profit are handled deterministically",
              "schedule size is bounded by max deadline slots",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { scheduleJobs } = require("../example-1/algorithm");
console.table(scheduleJobs([{ id: "x", deadline: 0, profit: 99 }]));
console.table(scheduleJobs([{ id: "a", deadline: 1, profit: 10 }, { id: "b", deadline: 1, profit: 10 }]));
`,
              },
            ],
          },
        ],
      };
    }

    // DP family
    case "coin-change":
    case "knapsack-01":
    case "edit-distance":
    case "longest-common-subsequence":
    case "longest-increasing-subsequence":
    case "bitmask-dp":
    case "dp-on-trees":
    case "dp-fundamentals": {
      // Keep dp-fundamentals as coin-change style, but specialize others.
      const impl = (() => {
        if (slug === "knapsack-01") {
          return {
            fn: "knapsack01",
            body: `
function knapsack01(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i += 1) {
    for (let w = 0; w <= capacity; w += 1) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      }
    }
  }
  return dp[n][capacity];
}
`,
            sample: `console.log(knapsack01([2,3,4,5],[3,4,5,6], 5));`,
          };
        }
        if (slug === "edit-distance") {
          return {
            fn: "editDistance",
            body: `
function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[a.length][b.length];
}
`,
            sample: `console.log(editDistance("kitten","sitting"));`,
          };
        }
        if (slug === "longest-common-subsequence") {
          return {
            fn: "lcsLength",
            body: `
function lcsLength(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}
`,
            sample: `console.log(lcsLength("abcde","ace"));`,
          };
        }
        if (slug === "longest-increasing-subsequence") {
          return {
            fn: "lisLength",
            body: `
function lisLength(nums) {
  const tails = [];
  for (const num of nums) {
    let low = 0;
    let high = tails.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (tails[mid] < num) low = mid + 1;
      else high = mid;
    }
    tails[low] = num;
  }
  return tails.length;
}
`,
            sample: `console.log(lisLength([10,9,2,5,3,7,101,18]));`,
          };
        }
        if (slug === "bitmask-dp") {
          return {
            fn: "tspBitmask",
            body: `
function tspBitmask(dist) {
  const n = dist.length;
  const full = (1 << n) - 1;
  const memo = new Map();
  function solve(pos, mask) {
    const key = pos + "|" + mask;
    if (memo.has(key)) return memo.get(key);
    if (mask === full) return dist[pos][0];
    let best = Infinity;
    for (let next = 0; next < n; next += 1) {
      if (mask & (1 << next)) continue;
      best = Math.min(best, dist[pos][next] + solve(next, mask | (1 << next)));
    }
    memo.set(key, best);
    return best;
  }
  return solve(0, 1);
}
`,
            sample: `console.log(tspBitmask([[0,10,15],[10,0,20],[15,20,0]]));`,
          };
        }
        if (slug === "dp-on-trees") {
          return {
            fn: "maxIndependentSet",
            body: `
function maxIndependentSet(tree, root) {
  function dfs(node) {
    let include = 1;
    let exclude = 0;
    for (const child of tree[node] ?? []) {
      const { include: ci, exclude: ce } = dfs(child);
      include += ce;
      exclude += Math.max(ci, ce);
    }
    return { include, exclude };
  }
  const res = dfs(root);
  return Math.max(res.include, res.exclude);
}
`,
            sample: `console.log(maxIndependentSet({A:[\"B\",\"C\"],B:[\"D\"],C:[],D:[]},\"A\"));`,
          };
        }
        // coin-change + dp-fundamentals
        return {
          fn: "minCoins",
          body: `
function minCoins(coins, amount) {
  const memo = new Map();
  function solve(remaining) {
    if (remaining === 0) return 0;
    if (remaining < 0) return Infinity;
    if (memo.has(remaining)) return memo.get(remaining);
    let best = Infinity;
    for (const coin of coins) best = Math.min(best, solve(remaining - coin) + 1);
    memo.set(remaining, best);
    return best;
  }
  const result = solve(amount);
  return Number.isFinite(result) ? result : -1;
}
`,
          sample: `console.log(minCoins([1,2,5], 11));`,
        };
      })();

      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Implementation Workbench",
            summary:
              "Implements the core DP recurrence for this topic and runs it on a representative input.",
            runFile: "app.js",
            checks: [
              "subproblem definition is explicit",
              "base cases are correct",
              "result matches known expected output",
            ],
            files: [
              { name: "algorithm.js", content: `${impl.body}\nmodule.exports = { ${impl.fn} };\n` },
              {
                name: "app.js",
                content: `
const { ${impl.fn} } = require("./algorithm");
${impl.sample}
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Bottom-Up vs Memoization",
            summary:
              "Covers the follow-up trade-off between recursion+memoization and bottom-up tabulation.",
            runFile: "demo.js",
            checks: [
              "tabulation uses explicit fill order",
              "memoization reduces recomputation but risks recursion depth",
              "space optimization opportunities are identified",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("DP variants: top-down memoization vs bottom-up tabulation.");
console.log("Production considerations: recursion depth limits, memory footprint, and path reconstruction needs.");
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases and Defensive Checks",
            summary:
              "Exercises boundary inputs so DP implementations behave safely on empty, zero, or invalid cases.",
            runFile: "demo.js",
            checks: [
              "empty inputs are handled explicitly",
              "zero-size parameters produce sensible outputs",
              "invalid inputs are rejected or return safe failures",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("Edge-case checklist: empty arrays/strings, capacity=0, amount=0, and invalid negative inputs.");
`,
              },
            ],
          },
        ],
      };
    }

    // Greedy fundamentals + activity selection
    case "activity-selection":
    case "greedy-fundamentals": {
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Greedy Selector Workbench",
            summary:
              "Implements activity selection (earliest finishing time) to demonstrate a canonical greedy algorithm with a known proof.",
            runFile: "app.js",
            checks: [
              "activities are sorted by end time",
              "selection respects non-overlap constraints",
              "result is optimal for this specific problem structure",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
function selectActivities(activities) {
  const sorted = [...activities].sort((a, b) => a.end - b.end);
  const chosen = [];
  let lastEnd = -Infinity;
  for (const act of sorted) {
    if (act.start >= lastEnd) {
      chosen.push(act);
      lastEnd = act.end;
    }
  }
  return chosen;
}

module.exports = { selectActivities };
`,
              },
              {
                name: "app.js",
                content: `
const { selectActivities } = require("./algorithm");
const activities = [
  { id: "a", start: 1, end: 3 },
  { id: "b", start: 2, end: 5 },
  { id: "c", start: 4, end: 7 },
  { id: "d", start: 1, end: 8 },
  { id: "e", start: 5, end: 9 },
];
console.table(selectActivities(activities));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Proof Obligations",
            summary:
              "Explains the follow-up: greedy requires an exchange argument; without it, greedy can be arbitrarily wrong.",
            runFile: "demo.js",
            checks: [
              "greedy criteria must be justified, not assumed",
              "counterexamples exist when conditions are violated",
              "production constraints should be encoded explicitly",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("Greedy correctness needs a proof (exchange argument).");
console.log("If the problem lacks the exchange property, local choices don't guarantee global optimality.");
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases",
            summary:
              "Covers ties and empty inputs to ensure deterministic, safe behavior.",
            runFile: "demo.js",
            checks: [
              "empty inputs yield empty selections",
              "ties require deterministic secondary criteria",
              "invalid intervals are rejected upstream",
            ],
            files: [
              {
                name: "demo.js",
                content: `
const { selectActivities } = require("../example-1/algorithm");
console.log("Empty:", selectActivities([]));
console.log(selectActivities([{ id: "a", start: 1, end: 3 }, { id: "b", start: 1, end: 3 }]).map((x)=>x.id));
`,
              },
            ],
          },
        ],
      };
    }

    // Backtracking fundamentals + concrete problems
    case "backtracking-fundamentals":
    case "n-queens":
    case "permutations-and-combinations":
    case "sudoku-solver":
    case "word-search": {
      if (slug === "sudoku-solver") {
        return {
          title,
          examples: [
            {
              id: "example-1",
              title: "Sudoku Solver Workbench",
              summary:
                "Implements a backtracking Sudoku solver and solves a small puzzle grid.",
              runFile: "app.js",
              checks: [
                "validity checks gate candidate placements",
                "solver backtracks when constraints are violated",
                "returns a solved grid or null",
              ],
              files: [
                {
                  name: "algorithm.js",
                  content: `
function isValid(board, row, col, val) {
  for (let i = 0; i < 9; i += 1) {
    if (board[row][i] === val) return false;
    if (board[i][col] === val) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      if (board[boxRow + r][boxCol + c] === val) return false;
    }
  }
  return true;
}

function solve(board) {
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (board[row][col] !== 0) continue;
      for (let val = 1; val <= 9; val += 1) {
        if (!isValid(board, row, col, val)) continue;
        board[row][col] = val;
        if (solve(board)) return true;
        board[row][col] = 0;
      }
      return false;
    }
  }
  return true;
}

module.exports = { solve };
`,
                },
                {
                  name: "app.js",
                  content: `
const { solve } = require("./algorithm");
const board = [
  [5,3,0, 0,7,0, 0,0,0],
  [6,0,0, 1,9,5, 0,0,0],
  [0,9,8, 0,0,0, 0,6,0],
  [8,0,0, 0,6,0, 0,0,3],
  [4,0,0, 8,0,3, 0,0,1],
  [7,0,0, 0,2,0, 0,0,6],
  [0,6,0, 0,0,0, 2,8,0],
  [0,0,0, 4,1,9, 0,0,5],
  [0,0,0, 0,8,0, 0,7,9],
];
solve(board);
console.table(board);
`,
                },
              ],
            },
            {
              id: "example-2",
              title: "Follow-Up: Heuristics",
              summary:
                "Explains MRV/constraint propagation heuristics that reduce branching factor in production-grade solvers.",
              runFile: "demo.js",
              checks: [
                "most-constrained-cell-first reduces branching",
                "forward-checking prunes earlier",
                "heuristics dominate performance on hard instances",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
console.log("Heuristics: choose the cell with the fewest candidates (MRV) and propagate constraints early.");
console.log("Production solvers add constraint propagation to prune branches before deep recursion.");
`,
                },
              ],
            },
            {
              id: "example-3",
              title: "Edge Cases",
              summary:
                "Covers unsatisfiable boards and invalid initial states.",
              runFile: "demo.js",
              checks: [
                "unsatisfiable boards should return false/null",
                "invalid initial duplicates should be detected early",
                "timeouts/limits are required in production to avoid runaway search",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
console.log("Edge cases: invalid starting board (duplicates), unsatisfiable puzzles, and timeouts for worst-case search.");
`,
                },
              ],
            },
          ],
        };
      }

      if (slug === "word-search") {
        return {
          title,
          examples: [
            {
              id: "example-1",
              title: "Grid Search Workbench",
              summary:
                "Implements DFS backtracking over a grid to find a word with adjacency constraints.",
              runFile: "app.js",
              checks: [
                "visitation marking prevents reusing the same cell",
                "search explores 4-direction adjacency",
                "returns true on match and false otherwise",
              ],
              files: [
                {
                  name: "algorithm.js",
                  content: `
function exists(board, word) {
  const rows = board.length;
  const cols = board[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

  function dfs(r, c, i) {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (visited[r][c]) return false;
    if (board[r][c] !== word[i]) return false;
    visited[r][c] = true;
    const ok =
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1);
    visited[r][c] = false;
    return ok;
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}

module.exports = { exists };
`,
                },
                {
                  name: "app.js",
                  content: `
const { exists } = require("./algorithm");
const board = [
  ["A","B","C","E"],
  ["S","F","C","S"],
  ["A","D","E","E"],
];
console.log(exists(board, "ABCCED"));
console.log(exists(board, "SEE"));
console.log(exists(board, "ABCB"));
`,
                },
              ],
            },
            {
              id: "example-2",
              title: "Follow-Up: Optimization",
              summary:
                "Discusses pruning (character frequency, prefix checks) that speeds up production word-search workloads.",
              runFile: "demo.js",
              checks: [
                "frequency checks reject impossible words early",
                "ordering starting points reduces wasted search",
                "prefix-trie integration can accelerate multi-word queries",
              ],
              files: [
                { name: "demo.js", content: `console.log("Optimization: prune using letter frequencies and stop early when remaining letters cannot match.");\n` },
              ],
            },
            {
              id: "example-3",
              title: "Edge Cases",
              summary:
                "Covers empty words, single-letter words, and boards with repeated characters.",
              runFile: "demo.js",
              checks: [
                "empty word policy is explicit",
                "single-letter words are handled correctly",
                "repeated characters do not break visited-set logic",
              ],
              files: [
                { name: "demo.js", content: `console.log("Edge cases: empty word, single-letter match, and highly repetitive boards that inflate branching.");\n` },
              ],
            },
          ],
        };
      }

      if (slug === "permutations-and-combinations") {
        return {
          title,
          examples: [
            {
              id: "example-1",
              title: "Permutation Generator Workbench",
              summary:
                "Implements backtracking to generate all permutations of a small set (bounded by factorial growth).",
              runFile: "app.js",
              checks: [
                "each permutation uses each element exactly once",
                "branching explores swap/choose-based recursion",
                "output size matches n! for unique elements",
              ],
              files: [
                {
                  name: "algorithm.js",
                  content: `
function permutations(values) {
  const out = [];
  const used = new Array(values.length).fill(false);
  const current = [];
  function dfs() {
    if (current.length === values.length) {
      out.push([...current]);
      return;
    }
    for (let i = 0; i < values.length; i += 1) {
      if (used[i]) continue;
      used[i] = true;
      current.push(values[i]);
      dfs();
      current.pop();
      used[i] = false;
    }
  }
  dfs();
  return out;
}

module.exports = { permutations };
`,
                },
                {
                  name: "app.js",
                  content: `
const { permutations } = require("./algorithm");
console.log(permutations(["A","B","C"]));
`,
                },
              ],
            },
            {
              id: "example-2",
              title: "Follow-Up: Combinations",
              summary:
                "Adds combinations (n choose k) generation — a common follow-up once permutations are understood.",
              runFile: "demo.js",
              checks: [
                "combination output size matches C(n,k)",
                "order does not matter in combinations",
                "recursion uses an index to avoid duplicates",
              ],
              files: [
                {
                  name: "demo.js",
                  content: `
function combinations(values, k) {
  const out = [];
  function dfs(start, chosen) {
    if (chosen.length === k) {
      out.push([...chosen]);
      return;
    }
    for (let i = start; i < values.length; i += 1) {
      chosen.push(values[i]);
      dfs(i + 1, chosen);
      chosen.pop();
    }
  }
  dfs(0, []);
  return out;
}

console.log(combinations(["A","B","C","D"], 2));
`,
                },
              ],
            },
            {
              id: "example-3",
              title: "Edge Cases",
              summary:
                "Covers duplicates in inputs and the explosion in output size.",
              runFile: "demo.js",
              checks: [
                "duplicate inputs create duplicate permutations unless deduplicated",
                "k=0 yields one empty combination",
                "bounded sizes are required in production to avoid blowups",
              ],
              files: [
                { name: "demo.js", content: `console.log("Edge cases: duplicates, k=0, and factorial growth constraints.");\n` },
              ],
            },
          ],
        };
      }

      // n-queens + fundamentals use nQueens solver
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "N-Queens Workbench",
            summary:
              "Implements a canonical backtracking solver (N-Queens) to demonstrate branching, pruning, and feasibility checking.",
            runFile: "app.js",
            checks: [
              "solver explores candidates depth-first",
              "pruning rejects invalid partial solutions early",
              "returns one valid solution or null",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
function nQueens(n) {
  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();
  const board = new Array(n).fill(-1);

  function place(row) {
    if (row === n) return true;
    for (let col = 0; col < n; col += 1) {
      const d1 = row - col;
      const d2 = row + col;
      if (cols.has(col) || diag1.has(d1) || diag2.has(d2)) continue;
      cols.add(col);
      diag1.add(d1);
      diag2.add(d2);
      board[row] = col;
      if (place(row + 1)) return true;
      cols.delete(col);
      diag1.delete(d1);
      diag2.delete(d2);
      board[row] = -1;
    }
    return false;
  }

  return place(0) ? board : null;
}

module.exports = { nQueens };
`,
              },
              {
                name: "app.js",
                content: `
const { nQueens } = require("./algorithm");
console.log("Solution:", nQueens(8));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: Pruning Heuristics",
            summary:
              "Discusses constraint ordering and pruning heuristics that reduce branching factor.",
            runFile: "demo.js",
            checks: [
              "early pruning cuts off whole subtrees",
              "ordering variables (MRV) reduces branching",
              "still exponential in worst case",
            ],
            files: [
              {
                name: "demo.js",
                content: `
console.log("Backtracking speed depends on pruning: reject invalid partial assignments early.");
console.log("Common heuristics: choose most constrained variable first; try least constraining values early.");
`,
              },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases",
            summary:
              "Covers unsatisfiable instances and runtime limiting.",
            runFile: "demo.js",
            checks: [
              "n=2 and n=3 have no solutions",
              "timeouts/limits are required in production-style search",
              "result validation is mandatory before returning",
            ],
            files: [
              { name: "demo.js", content: `const { nQueens } = require("../example-1/algorithm");\nconsole.log(nQueens(2));\nconsole.log(nQueens(3));\n` },
            ],
          },
        ],
      };
    }

    case "divide-and-conquer": {
      return {
        title,
        examples: [
          {
            id: "example-1",
            title: "Divide-and-Conquer Workbench",
            summary:
              "Implements a classic divide-and-conquer routine (maximum subarray via recursion) to illustrate split/combine structure.",
            runFile: "app.js",
            checks: [
              "problem is split into subproblems",
              "combine step produces the full answer",
              "recurrence explains O(n log n) behavior for this approach",
            ],
            files: [
              {
                name: "algorithm.js",
                content: `
function maxCrossingSum(arr, left, mid, right) {
  let sum = 0;
  let leftSum = -Infinity;
  for (let i = mid; i >= left; i -= 1) {
    sum += arr[i];
    leftSum = Math.max(leftSum, sum);
  }
  sum = 0;
  let rightSum = -Infinity;
  for (let i = mid + 1; i <= right; i += 1) {
    sum += arr[i];
    rightSum = Math.max(rightSum, sum);
  }
  return leftSum + rightSum;
}

function maxSubarray(arr, left = 0, right = arr.length - 1) {
  if (left === right) return arr[left];
  const mid = Math.floor((left + right) / 2);
  return Math.max(
    maxSubarray(arr, left, mid),
    maxSubarray(arr, mid + 1, right),
    maxCrossingSum(arr, left, mid, right),
  );
}

module.exports = { maxSubarray };
`,
              },
              {
                name: "app.js",
                content: `
const { maxSubarray } = require("./algorithm");
console.log(maxSubarray([-2,1,-3,4,-1,2,1,-5,4]));
`,
              },
            ],
          },
          {
            id: "example-2",
            title: "Follow-Up: When Not to Use D&C",
            summary:
              "Explains trade-offs: sometimes a linear DP (Kadane’s) beats D&C due to lower constants and simpler implementation.",
            runFile: "demo.js",
            checks: [
              "linear alternatives can exist with better asymptotics",
              "recursion overhead matters in hot paths",
              "choose D&C when the combine step is natural and parallelizable",
            ],
            files: [
              { name: "demo.js", content: `console.log("Example: maximum subarray has a linear DP solution (Kadane) that is often preferred in production.");\n` },
            ],
          },
          {
            id: "example-3",
            title: "Edge Cases",
            summary:
              "Covers empty arrays and all-negative inputs.",
            runFile: "demo.js",
            checks: [
              "empty arrays should be rejected explicitly",
              "all-negative arrays still return the maximum (least negative) element",
              "boundary indices are handled correctly",
            ],
            files: [
              { name: "demo.js", content: `console.log("Edge cases: empty input policy, and all-negative arrays should return the maximum element.");\n` },
            ],
          },
        ],
      };
    }

    default:
      throw new Error(`No algorithm template implemented for slug: ${slug}`);
  }
}

function listAlgorithmSlugs() {
  if (!fs.existsSync(ARTICLE_ALGO_DIR)) return [];
  return fs
    .readdirSync(ARTICLE_ALGO_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
    .map((entry) => entry.name.replace(/\.tsx$/, ""))
    .sort();
}

function main() {
  const slugs = listAlgorithmSlugs();
  if (slugs.length === 0) {
    console.error("No algorithm articles found; nothing to generate.");
    process.exit(1);
  }

  ensureDir(BASE_DIR);

  for (const slug of slugs) {
    const topicDir = path.join(BASE_DIR, slug);
    cleanDir(topicDir);
    const topic = topicTemplate(slug);
    for (const example of topic.examples) {
      createExampleDir({ slug, topicTitle: topic.title, example });
    }
  }

  console.log(`Generated ${slugs.length} algorithm topic example set(s).`);
}

main();

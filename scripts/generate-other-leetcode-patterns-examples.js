#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BASE_DIR = path.join(
  ROOT,
  "content",
  "examples",
  "other",
  "leetcode",
  "patterns",
);

const ARTICLE_DIR = path.join(ROOT, "content", "articles", "other", "leetcode", "patterns");

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
    "in-place-linked-list-reversal": "In-Place Linked List Reversal",
    "k-way-merge": "K-Way Merge",
    "top-k-elements": "Top-K Elements",
    "fast-slow-pointers": "Fast & Slow Pointers",
    "merge-intervals": "Merge Intervals",
    "prefix-sum": "Prefix Sum",
    "monotonic-stack": "Monotonic Stack",
    "monotonic-queue": "Monotonic Queue",
    "two-pointer": "Two Pointers",
    "union-find": "Union-Find",
    "hash-table": "Hash Table",
    "binary-search": "Binary Search",
    "dynamic-programming": "Dynamic Programming",
    "divide-and-conquer": "Divide and Conquer",
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
      ? "Example 1 is a production-style implementation demo for this Leetcode pattern."
      : number === 2
        ? "Example 2 focuses on a common follow-up variant that changes constraints or output requirements."
        : "Example 3 focuses on edge cases and correctness checks that typically break naive implementations.";

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
\`node content/examples/other/leetcode/patterns/${slug}/${runTarget}\`

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

  const impl = (spec) => ({
    title,
    examples: [
      {
        id: "example-1",
        title: spec.example1.title,
        summary: spec.example1.summary,
        runFile: "app.js",
        checks: spec.example1.checks,
        files: [
          { name: "pattern.js", content: spec.patternImpl },
          { name: "app.js", content: spec.example1.app },
        ],
      },
      {
        id: "example-2",
        title: spec.example2.title,
        summary: spec.example2.summary,
        runFile: "demo.js",
        checks: spec.example2.checks,
        files: [{ name: "demo.js", content: spec.example2.demo }],
      },
      {
        id: "example-3",
        title: spec.example3.title,
        summary: spec.example3.summary,
        runFile: "demo.js",
        checks: spec.example3.checks,
        files: [{ name: "demo.js", content: spec.example3.demo }],
      },
    ],
  });

  switch (slug) {
    case "backtracking":
      return impl({
        patternImpl: `
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
        example1: {
          title: "Constraint Search Workbench (N-Queens)",
          summary:
            "Implements backtracking with pruning to solve N-Queens and returns one valid placement vector.",
          checks: [
            "search explores candidates depth-first",
            "pruning rejects invalid partial placements early",
            "returns null when no solution exists",
          ],
          app: `
const { nQueens } = require("./pattern");
console.log("n=8 solution:", nQueens(8));
console.log("n=3 no solution:", nQueens(3));
`,
        },
        example2: {
          title: "Follow-Up: Pruning Heuristics",
          summary:
            "Follow-up: explain how heuristics (MRV, ordering) reduce branching factor in production-grade backtracking.",
          checks: [
            "choose most constrained variable first (MRV)",
            "forward-checking prunes early",
            "timeouts/limits are required for worst-case instances",
          ],
          demo: `
function nQueensWithCount(n) {
  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();
  const board = new Array(n).fill(-1);
  let calls = 0;

  function place(row) {
    calls += 1;
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

  return { solution: place(0) ? board : null, calls };
}

console.log("n=8 naive row-order calls:", nQueensWithCount(8).calls);
console.log("note: MRV/ordering heuristics reduce branching by picking the next variable with fewer valid candidates.");
`,
        },
        example3: {
          title: "Edge Cases and Limits",
          summary:
            "Covers unsatisfiable instances and policies around returning one vs all solutions.",
          checks: [
            "unsatisfiable inputs return null/false",
            "enumerating all solutions can be exponential",
            "define limits and output policies up front",
          ],
          demo: `
const { nQueens } = require("../example-1/pattern");
console.log("n=2:", nQueens(2));
console.log("note: decide whether you return first solution, count solutions, or list all solutions (can explode).");
`,
        },
      });

    case "binary-search":
      return impl({
        patternImpl: `
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

module.exports = { binarySearch };
`,
        example1: {
          title: "Implementation Workbench",
          summary:
            "Implements binary search on a sorted array and demonstrates hit/miss behavior with deterministic mid calculation.",
          checks: [
            "sorted-input precondition is explicit",
            "returns an index for hits and -1 for misses",
            "runs in O(log n) time with monotonic bounds",
          ],
          app: `
const { binarySearch } = require("./pattern");
console.log(binarySearch([1,3,5,7,9], 7));
console.log(binarySearch([1,3,5,7,9], 2));
`,
        },
        example2: {
          title: "Follow-Up: Lower Bound / First Occurrence",
          summary:
            "Follow-up: implement lowerBound to find the first index where value >= target, which handles duplicates cleanly.",
          checks: [
            "lowerBound returns insertion point",
            "works correctly under duplicates",
            "enables range queries (first/last occurrence)",
          ],
          demo: `
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

const arr = [1,2,2,2,5,9];
console.log("lb(2):", lowerBound(arr, 2));
console.log("lb(4):", lowerBound(arr, 4));
`,
        },
        example3: {
          title: "Edge Cases and Preconditions",
          summary:
            "Covers empty arrays, singletons, and unsorted inputs (binary search semantics do not hold).",
          checks: [
            "empty arrays return -1 safely",
            "singleton hit/miss are correct",
            "unsorted input must be validated or sorted upstream",
          ],
          demo: `
const { binarySearch } = require("../example-1/pattern");
console.log("empty:", binarySearch([], 1));
console.log("single hit:", binarySearch([5], 5));
console.log("unsorted (invalid):", binarySearch([3,1,2], 2));
`,
        },
      });

    case "bit-manipulation":
      return impl({
        patternImpl: `
function singleNumber(nums) {
  let x = 0;
  for (const n of nums) x ^= n;
  return x;
}

module.exports = { singleNumber };
`,
        example1: {
          title: "XOR Cancellation Workbench",
          summary:
            "Implements XOR cancellation to find the unique element when every other element appears twice.",
          checks: [
            "XOR cancels pairs (a^a = 0)",
            "assumes exactly one unique element and all others appear twice",
            "runs in O(n) time and O(1) space",
          ],
          app: `
const { singleNumber } = require("./pattern");
console.log(singleNumber([2, 1, 4, 2, 1]));
console.log(singleNumber([7, 3, 7]));
`,
        },
        example2: {
          title: "Follow-Up: Submask Enumeration",
          summary:
            "Follow-up: enumerate all submasks of a bitmask — a common building block for bitmask DP and combinatorics.",
          checks: [
            "iterates all submasks efficiently",
            "order is descending by construction",
            "terminates at 0",
          ],
          demo: `
function submasks(mask) {
  const out = [];
  let sub = mask;
  while (true) {
    out.push(sub);
    if (sub === 0) break;
    sub = (sub - 1) & mask;
  }
  return out;
}

console.log(submasks(0b1011).map((v) => v.toString(2)));
`,
        },
        example3: {
          title: "Edge Cases: JS 32-bit Bitwise Semantics",
          summary:
            "Covers the practical pitfall that JS bitwise operators operate on signed 32-bit integers.",
          checks: [
            "right shift preserves sign (>>), unsigned shift (>>>) does not",
            "values are truncated to 32-bit for bitwise ops",
            "use BigInt for wider-than-32-bit bitwise work",
          ],
          demo: `
const negative = -8;
console.log(">> 1:", negative >> 1);
console.log(">>> 1:", negative >>> 1);
console.log("note: JS bitwise ops coerce to signed 32-bit.");
`,
        },
      });

    case "cyclic-sort":
      return impl({
        patternImpl: `
function findMissingNumber(nums) {
  const arr = [...nums];
  let i = 0;
  while (i < arr.length) {
    const j = arr[i];
    if (j < arr.length && arr[i] !== arr[j]) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    } else {
      i += 1;
    }
  }
  for (let k = 0; k < arr.length; k += 1) {
    if (arr[k] !== k) return k;
  }
  return arr.length;
}

module.exports = { findMissingNumber };
`,
        example1: {
          title: "Missing Number Workbench",
          summary:
            "Implements cyclic sort placement to find a missing number in 0..n with O(1) extra space.",
          checks: [
            "each value is swapped into its index position when possible",
            "final scan finds the first index mismatch",
            "runs in O(n) time with bounded swaps",
          ],
          app: `
const { findMissingNumber } = require("./pattern");
console.log(findMissingNumber([4, 0, 3, 1]));
console.log(findMissingNumber([0, 1, 2, 3]));
`,
        },
        example2: {
          title: "Follow-Up: Find All Duplicates",
          summary:
            "Follow-up: use cyclic placement to detect duplicates in 1..n arrays (common Leetcode extension).",
          checks: [
            "misplaced values after placement indicate duplicates",
            "returns all duplicate values",
            "keeps O(1) extra space besides output",
          ],
          demo: `
function findDuplicates(nums) {
  const arr = [...nums];
  let i = 0;
  while (i < arr.length) {
    const correct = arr[i] - 1;
    if (arr[i] !== arr[correct]) [arr[i], arr[correct]] = [arr[correct], arr[i]];
    else i += 1;
  }
  const dupes = [];
  for (let idx = 0; idx < arr.length; idx += 1) {
    if (arr[idx] !== idx + 1) dupes.push(arr[idx]);
  }
  return [...new Set(dupes)];
}

console.log(findDuplicates([4,3,2,7,8,2,3,1]));
`,
        },
        example3: {
          title: "Edge Cases and Input Validation",
          summary:
            "Covers out-of-range values and constraints: cyclic sort requires values to map into index range.",
          checks: [
            "values outside expected range break the placement invariant",
            "defensive guards are required in production code",
            "empty arrays behave safely",
          ],
          demo: `
const { findMissingNumber } = require("../example-1/pattern");
console.log("empty:", findMissingNumber([]));
console.log("note: for cyclic sort problems, validate value ranges (0..n or 1..n) before applying swaps.");
`,
        },
      });

    case "dynamic-programming":
      return impl({
        patternImpl: `
function minCoins(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a += 1) {
    for (const coin of coins) {
      if (a - coin >= 0) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  return Number.isFinite(dp[amount]) ? dp[amount] : -1;
}

module.exports = { minCoins };
`,
        example1: {
          title: "Tabulation Workbench",
          summary:
            "Implements bottom-up DP tabulation for coin change (min coins) to show table fill order and subproblem reuse.",
          checks: [
            "dp[0]=0 base case anchors the recurrence",
            "fill order ensures dp[a-coin] is available when computing dp[a]",
            "returns -1 when no solution exists",
          ],
          app: `
const { minCoins } = require("./pattern");
console.log(minCoins([1,2,5], 11));
console.log(minCoins([2,4], 7));
`,
        },
        example2: {
          title: "Follow-Up: Memoization vs Tabulation",
          summary:
            "Follow-up: compare top-down memoization and bottom-up tabulation trade-offs (recursion depth vs table size).",
          checks: [
            "memoization can be simpler but risks deep recursion",
            "tabulation is iterative and avoids stack growth",
            "space optimizations depend on dependency shape",
          ],
          demo: `
const { minCoins } = require("../example-1/pattern");

function minCoinsMemo(coins, amount) {
  const memo = new Map();
  let calls = 0;
  function solve(remaining) {
    calls += 1;
    if (remaining === 0) return 0;
    if (remaining < 0) return Infinity;
    if (memo.has(remaining)) return memo.get(remaining);
    let best = Infinity;
    for (const coin of coins) best = Math.min(best, solve(remaining - coin) + 1);
    memo.set(remaining, best);
    return best;
  }
  const result = solve(amount);
  return { answer: Number.isFinite(result) ? result : -1, calls, memoStates: memo.size };
}

const coins = [1, 2, 5];
const amount = 27;
console.log("tabulation answer:", minCoins(coins, amount));
console.log("memoization stats:", minCoinsMemo(coins, amount));
console.log("note: memoization may compute fewer states; tabulation avoids recursion depth risks in JS.");
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers amount=0, empty coin sets, and negative/invalid inputs.",
          checks: [
            "amount=0 returns 0",
            "empty coins => -1 for amount>0",
            "negative amounts should be rejected by policy",
          ],
          demo: `
const { minCoins } = require("../example-1/pattern");
console.log("amount=0:", minCoins([1,2], 0));
console.log("no coins:", minCoins([], 3));
console.log("note: reject negative amounts upstream to avoid invalid dp sizing.");
`,
        },
      });

    case "greedy":
      return impl({
        patternImpl: `
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
        example1: {
          title: "Activity Selection Workbench",
          summary:
            "Implements the canonical greedy pattern (activity selection) where earliest finish time yields an optimal schedule.",
          checks: [
            "sort by end time",
            "pick the next compatible activity greedily",
            "output is a maximum-size compatible set for this problem class",
          ],
          app: `
const { selectActivities } = require("./pattern");
console.table(selectActivities([
  { id: "a", start: 1, end: 3 },
  { id: "b", start: 2, end: 5 },
  { id: "c", start: 4, end: 7 },
  { id: "d", start: 1, end: 8 },
  { id: "e", start: 5, end: 9 },
]));
`,
        },
        example2: {
          title: "Follow-Up: Proof Obligations",
          summary:
            "Explains the key follow-up: greedy is correct only when an exchange argument / problem structure supports it.",
          checks: [
            "greedy criterion must be justified",
            "counterexamples exist when conditions fail",
            "tie-breaking should be deterministic in production",
          ],
          demo: `
function greedyCoinChange(coins, amount) {
  const sorted = [...coins].sort((a, b) => b - a);
  const used = [];
  let remaining = amount;
  for (const coin of sorted) {
    while (remaining >= coin) {
      remaining -= coin;
      used.push(coin);
    }
  }
  return remaining === 0 ? used : null;
}

function dpMinCoins(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a += 1) {
    for (const coin of coins) if (a - coin >= 0) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
  }
  return Number.isFinite(dp[amount]) ? dp[amount] : -1;
}

const coins = [1, 3, 4];
const amount = 6;
console.log("greedy picks:", greedyCoinChange(coins, amount));
console.log("optimal #coins:", dpMinCoins(coins, amount));
console.log("observation: greedy fails here (4+1+1) vs optimal (3+3). Greedy needs a proof for the problem class.");
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers empty input, ties, and invalid intervals.",
          checks: [
            "empty list returns empty schedule",
            "ties require deterministic policy",
            "invalid intervals should be rejected upstream",
          ],
          demo: `
const { selectActivities } = require("../example-1/pattern");
console.log(selectActivities([]));
console.log(selectActivities([{ id: "x", start: 5, end: 1 }]));
`,
        },
      });

    case "hash-table":
      return impl({
        patternImpl: `
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}

module.exports = { twoSum };
`,
        example1: {
          title: "Two Sum Workbench",
          summary:
            "Implements the hash-table lookup pattern to find a pair in one pass (classic Leetcode map pattern).",
          checks: [
            "stores complements in a map for O(1) expected lookups",
            "returns indices for the first valid pair",
            "runs in O(n) time with O(n) extra space",
          ],
          app: `
const { twoSum } = require("./pattern");
console.log(twoSum([2,7,11,15], 9));
console.log(twoSum([3,2,4], 6));
`,
        },
        example2: {
          title: "Follow-Up: Group Anagrams",
          summary:
            "Follow-up: group items by a canonical hash key (sorted letters) — another common hash-table pattern question.",
          checks: [
            "canonical key groups equivalent items",
            "order within groups is stable by insertion",
            "key choice affects runtime and collisions",
          ],
          demo: `
function groupAnagrams(words) {
  const map = new Map();
  for (const word of words) {
    const key = [...word].sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
  }
  return [...map.values()];
}

console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers duplicates, missing solutions, and key-canonicalization pitfalls (Unicode normalization).",
          checks: [
            "no-solution returns null",
            "duplicates are handled deterministically",
            "Unicode normalization is an application-level decision",
          ],
          demo: `
const { twoSum } = require("../example-1/pattern");
console.log("no solution:", twoSum([1,2,3], 100));
console.log("dupes:", twoSum([3,3], 6));
console.log("note: normalize Unicode upstream before building canonical keys for grouping problems.");
`,
        },
      });

    case "heap":
      return impl({
        patternImpl: `
class MinHeap {
  constructor(compare) {
    this.compare = compare;
    this.items = [];
  }

  push(value) {
    this.items.push(value);
    this.#siftUp(this.items.length - 1);
  }

  pop() {
    if (this.items.length === 0) throw new Error("heap underflow");
    const min = this.items[0];
    const last = this.items.pop();
    if (this.items.length) {
      this.items[0] = last;
      this.#siftDown(0);
    }
    return min;
  }

  peek() {
    return this.items[0] ?? null;
  }

  #siftUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.compare(this.items[idx], this.items[parent]) >= 0) break;
      [this.items[idx], this.items[parent]] = [this.items[parent], this.items[idx]];
      idx = parent;
    }
  }

  #siftDown(idx) {
    while (true) {
      let best = idx;
      const left = idx * 2 + 1;
      const right = idx * 2 + 2;
      if (left < this.items.length && this.compare(this.items[left], this.items[best]) < 0) best = left;
      if (right < this.items.length && this.compare(this.items[right], this.items[best]) < 0) best = right;
      if (best === idx) return;
      [this.items[idx], this.items[best]] = [this.items[best], this.items[idx]];
      idx = best;
    }
  }
}

function kthLargest(nums, k) {
  const heap = new MinHeap((a, b) => a - b);
  for (const n of nums) {
    heap.push(n);
    if (heap.items.length > k) heap.pop();
  }
  return heap.peek();
}

module.exports = { MinHeap, kthLargest };
`,
        example1: {
          title: "Top-K Workbench",
          summary:
            "Implements a heap-based top-k pattern (kth largest) using a bounded min-heap.",
          checks: [
            "heap holds only k elements (bounded memory)",
            "peek tracks the current kth-largest threshold",
            "works for streaming inputs (process incrementally)",
          ],
          app: `
const { kthLargest } = require("./pattern");
console.log(kthLargest([3,2,1,5,6,4], 2));
console.log(kthLargest([3,2,3,1,2,4,5,5,6], 4));
`,
        },
        example2: {
          title: "Follow-Up: Merge K Sorted Lists/Arrays",
          summary:
            "Follow-up: use a heap to merge k sorted sources efficiently (k-way merge pattern).",
          checks: [
            "heap stores the next candidate from each source",
            "each pop/push advances one source",
            "runs in O(n log k) where n is total elements",
          ],
          demo: `
const { MinHeap } = require("../example-1/pattern");

function mergeKSorted(arrays) {
  const heap = new MinHeap((a, b) => a.value - b.value);
  for (let i = 0; i < arrays.length; i += 1) {
    if (arrays[i].length) heap.push({ value: arrays[i][0], i, j: 0 });
  }
  const out = [];
  while (heap.items.length) {
    const { value, i, j } = heap.pop();
    out.push(value);
    const nextJ = j + 1;
    if (nextJ < arrays[i].length) heap.push({ value: arrays[i][nextJ], i, j: nextJ });
  }
  return out;
}

console.log(mergeKSorted([[1,4,5],[1,3,4],[2,6]]));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers k out of range, empty arrays, and duplicates/ties.",
          checks: [
            "k must be between 1 and n (policy: reject or return null)",
            "empty input behaves safely",
            "duplicates do not break ordering",
          ],
          demo: `
const { kthLargest } = require("../example-1/pattern");
console.log("empty:", kthLargest([], 1));
console.log("ties:", kthLargest([5,5,5], 2));
console.log("note: validate k upfront; kthLargest([],k) should return null or throw per policy.");
`,
        },
      });

    case "in-place-linked-list-reversal":
      return impl({
        patternImpl: `
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

module.exports = { reverseList };
`,
        example1: {
          title: "Pointer Reversal Workbench",
          summary:
            "Implements iterative in-place linked list reversal with explicit prev/curr/next pointer choreography.",
          checks: [
            "reverses links without allocating new nodes",
            "returns new head",
            "runs in O(n) time, O(1) extra space",
          ],
          app: `
const { reverseList } = require("./pattern");

function build(values) {
  const nodes = values.map((v) => ({ v, next: null }));
  for (let i = 0; i < nodes.length - 1; i += 1) nodes[i].next = nodes[i + 1];
  return nodes[0] ?? null;
}
function toArray(head) {
  const out = [];
  let curr = head;
  while (curr) { out.push(curr.v); curr = curr.next; }
  return out;
}

const head = build([1,2,3,4]);
console.log(toArray(reverseList(head)));
`,
        },
        example2: {
          title: "Follow-Up: Reverse Sublist",
          summary:
            "Follow-up: reverse a sublist between positions m..n (common extension).",
          checks: [
            "relinks only the sublist segment",
            "keeps the rest of the list intact",
            "handles m=1 and n=length boundary cases",
          ],
          demo: `
function reverseBetween(head, m, n) {
  if (!head || m === n) return head;
  const dummy = { next: head };
  let prev = dummy;
  for (let i = 1; i < m; i += 1) prev = prev.next;
  let curr = prev.next;
  for (let i = 0; i < n - m; i += 1) {
    const move = curr.next;
    curr.next = move.next;
    move.next = prev.next;
    prev.next = move;
  }
  return dummy.next;
}

function build(values) { const nodes = values.map(v=>({v,next:null})); for(let i=0;i<nodes.length-1;i++) nodes[i].next=nodes[i+1]; return nodes[0]??null; }
function toArray(h){ const o=[]; while(h){o.push(h.v); h=h.next;} return o; }

console.log(toArray(reverseBetween(build([1,2,3,4,5]), 2, 4)));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers null head, single element, and invalid m/n policies.",
          checks: [
            "null inputs handled safely",
            "single element reversal is a no-op",
            "m/n bounds should be validated upstream",
          ],
          demo: `
const { reverseList } = require("../example-1/pattern");
console.log(reverseList(null));
console.log(reverseList({ v: 1, next: null }));
console.log("note: validate m/n in reverseBetween; out-of-range should be rejected or handled explicitly.");
`,
        },
      });

    case "k-way-merge":
      return impl({
        patternImpl: `
class MinHeap {
  constructor(compare) { this.compare = compare; this.items = []; }
  push(x){ this.items.push(x); this.#up(this.items.length-1); }
  pop(){ if(!this.items.length) throw new Error("underflow"); const min=this.items[0]; const last=this.items.pop(); if(this.items.length){ this.items[0]=last; this.#down(0);} return min; }
  #up(i){ while(i>0){ const p=Math.floor((i-1)/2); if(this.compare(this.items[i],this.items[p])>=0) break; [this.items[i],this.items[p]]=[this.items[p],this.items[i]]; i=p; } }
  #down(i){ while(true){ let b=i; const l=i*2+1, r=i*2+2; if(l<this.items.length && this.compare(this.items[l],this.items[b])<0) b=l; if(r<this.items.length && this.compare(this.items[r],this.items[b])<0) b=r; if(b===i) return; [this.items[i],this.items[b]]=[this.items[b],this.items[i]]; i=b; } }
}

function mergeKSorted(arrays) {
  const heap = new MinHeap((a,b)=>a.value-b.value);
  for (let i=0;i<arrays.length;i+=1) if (arrays[i].length) heap.push({value:arrays[i][0], i, j:0});
  const out=[];
  while (heap.items.length) {
    const {value,i,j} = heap.pop();
    out.push(value);
    const nextJ = j+1;
    if (nextJ < arrays[i].length) heap.push({value:arrays[i][nextJ], i, j:nextJ});
  }
  return out;
}

module.exports = { mergeKSorted };
`,
        example1: {
          title: "Merge K Sorted Arrays",
          summary:
            "Implements the k-way merge pattern using a min-heap to merge multiple sorted arrays efficiently.",
          checks: [
            "heap always exposes the smallest next candidate",
            "runs in O(n log k) for n total elements",
            "handles empty sources gracefully",
          ],
          app: `
const { mergeKSorted } = require("./pattern");
console.log(mergeKSorted([[1,4,5],[1,3,4],[2,6]]));
console.log(mergeKSorted([[],[1],[0,9]]));
`,
        },
        example2: {
          title: "Follow-Up: Kth Smallest in Sorted Matrix",
          summary:
            "Follow-up: use k-way merge idea to get kth smallest from row-sorted sources by pushing next candidates.",
          checks: [
            "stops after k pops (doesn’t merge everything)",
            "heap size is bounded by number of rows",
            "works when each row is individually sorted",
          ],
          demo: `
function kthSmallest(rows, k) {
  const heap = [];
  const push = (item) => { heap.push(item); heap.sort((a,b)=>a.value-b.value); };
  const pop = () => heap.shift();
  for (let r=0;r<rows.length;r+=1) if (rows[r].length) push({value:rows[r][0], r, c:0});
  let current=null;
  for (let i=0;i<k && heap.length;i+=1) {
    current = pop();
    const nextC = current.c+1;
    if (nextC < rows[current.r].length) push({value:rows[current.r][nextC], r:current.r, c:nextC});
  }
  return current?.value ?? null;
}

console.log(kthSmallest([[1,5,9],[10,11,13],[12,13,15]], 8));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers k out of range, all-empty inputs, and duplicate values across sources.",
          checks: [
            "k out of range returns null/throws per policy",
            "all-empty sources return empty output",
            "duplicates are preserved in merged output",
          ],
          demo: `
const { mergeKSorted } = require("../example-1/pattern");
console.log("all empty:", mergeKSorted([[],[]]));
console.log("dupes:", mergeKSorted([[1,1],[1]]));
console.log("note: define policy for kth queries when k > total elements.");
`,
        },
      });

    case "linked-list":
      return impl({
        patternImpl: `
function removeNthFromEnd(head, n) {
  if (!head) return null;
  const dummy = { next: head };
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i < n; i += 1) {
    if (!fast.next) return head;
    fast = fast.next;
  }
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}

module.exports = { removeNthFromEnd };
`,
        example1: {
          title: "Two-Pointer on Linked List",
          summary:
            "Implements the linked-list pattern of removing the Nth node from the end using a fast/slow gap.",
          checks: [
            "fast advances n steps ahead of slow",
            "single pass removal without computing length",
            "dummy head simplifies head deletion",
          ],
          app: `
const { removeNthFromEnd } = require("./pattern");
function build(vals){const nodes=vals.map(v=>({v,next:null})); for(let i=0;i<nodes.length-1;i++) nodes[i].next=nodes[i+1]; return nodes[0]??null;}
function toArray(h){const o=[]; while(h){o.push(h.v); h=h.next;} return o;}
console.log(toArray(removeNthFromEnd(build([1,2,3,4,5]), 2)));
console.log(toArray(removeNthFromEnd(build([1]), 1)));
`,
        },
        example2: {
          title: "Follow-Up: Detect Cycle",
          summary:
            "Follow-up: cycle detection (ties into fast/slow pointers) because it often appears alongside linked-list patterns.",
          checks: [
            "meeting pointers indicates a cycle",
            "null termination indicates acyclic list",
            "uses O(1) extra space",
          ],
          demo: `
function hasCycle(head) {
  let slow=head, fast=head;
  while(fast && fast.next){
    slow=slow.next; fast=fast.next.next;
    if(slow===fast) return true;
  }
  return false;
}
const a={v:"A",next:null}, b={v:"B",next:null}, c={v:"C",next:null};
a.next=b; b.next=c;
console.log(hasCycle(a));
c.next=b;
console.log(hasCycle(a));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers n out of range, null head, and list length 1 boundaries.",
          checks: [
            "null head is handled safely",
            "n out of range must be validated upstream",
            "removing head uses dummy node correctly",
          ],
          demo: `
const { removeNthFromEnd } = require("../example-1/pattern");
console.log(removeNthFromEnd(null, 1));
console.log("note: validate n (1..length) upstream; this implementation assumes valid n.");
`,
        },
      });

    case "math":
      return impl({
        patternImpl: `
function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x;
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a / gcd(a, b) * b);
}

module.exports = { gcd, lcm };
`,
        example1: {
          title: "GCD/LCM Workbench",
          summary:
            "Implements Euclid’s algorithm for gcd and derives lcm — common math primitives used in many Leetcode problems.",
          checks: [
            "gcd handles negatives via abs()",
            "lcm uses gcd to avoid overflow patterns where possible",
            "gcd(a,0)=|a| behavior is correct",
          ],
          app: `
const { gcd, lcm } = require("./pattern");
console.log(gcd(54, 24), lcm(6, 15));
console.log(gcd(-10, 5), lcm(0, 5));
`,
        },
        example2: {
          title: "Follow-Up: Modular Exponentiation",
          summary:
            "Follow-up: fast power (binary exponentiation) — a frequent extension in modular arithmetic problems.",
          checks: [
            "reduces exponent by squaring (O(log n))",
            "mod applied at each multiplication",
            "supports large exponents safely",
          ],
          demo: `
function modPow(base, exp, mod) {
  let result = 1n;
  let b = BigInt(base) % BigInt(mod);
  let e = BigInt(exp);
  const m = BigInt(mod);
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return result;
}

console.log(modPow(2, 10, 1000).toString());
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers zero inputs and negative handling expectations in gcd/lcm and modular arithmetic.",
          checks: [
            "gcd(0,0) policy should be defined (commonly 0)",
            "lcm with zeros is 0",
            "modPow requires mod>0 (policy)",
          ],
          demo: `
const { gcd, lcm } = require("../example-1/pattern");
console.log("gcd(0,0):", gcd(0, 0));
console.log("lcm(0,7):", lcm(0, 7));
console.log("note: define explicit policy for gcd(0,0) and validate mod>0 for modular exponentiation.");
`,
        },
      });

    case "monotonic-queue":
      return impl({
        patternImpl: `
function maxSlidingWindow(nums, k) {
  if (k <= 0) throw new Error("k must be positive");
  const deque = []; // indices, values decreasing
  const out = [];
  for (let i = 0; i < nums.length; i += 1) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[i] >= nums[deque[deque.length - 1]]) deque.pop();
    deque.push(i);
    if (i >= k - 1) out.push(nums[deque[0]]);
  }
  return out;
}

module.exports = { maxSlidingWindow };
`,
        example1: {
          title: "Max Sliding Window Workbench",
          summary:
            "Implements the monotonic queue pattern (deque of indices) for O(n) sliding window maximum.",
          checks: [
            "deque maintains decreasing values",
            "front is always the max for current window",
            "expired indices are evicted as window advances",
          ],
          app: `
const { maxSlidingWindow } = require("./pattern");
console.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3));
`,
        },
        example2: {
          title: "Follow-Up: Min Sliding Window",
          summary:
            "Follow-up: invert the comparator to compute sliding window minimum (same pattern, reversed monotonicity).",
          checks: [
            "deque maintains increasing values for min",
            "same eviction rules apply",
            "duplicates are handled deterministically (>= vs >)",
          ],
          demo: `
function minSlidingWindow(nums, k) {
  const deque = [];
  const out = [];
  for (let i = 0; i < nums.length; i += 1) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[i] <= nums[deque[deque.length - 1]]) deque.pop();
    deque.push(i);
    if (i >= k - 1) out.push(nums[deque[0]]);
  }
  return out;
}

console.log(minSlidingWindow([1,3,-1,-3,5,3,6,7], 3));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers k=1, k>n, empty arrays, and duplicates.",
          checks: [
            "k=1 returns the input itself",
            "k>n should return [] or null per policy",
            "empty input is handled safely",
          ],
          demo: `
const { maxSlidingWindow } = require("../example-1/pattern");
console.log("k=1:", maxSlidingWindow([2,1,2], 1));
console.log("dupes:", maxSlidingWindow([2,2,2], 2));
try { console.log(maxSlidingWindow([], 3)); } catch (e) { console.log("empty:", e.message); }
`,
        },
      });

    case "queues":
      return impl({
        patternImpl: `
class Queue {
  constructor() { this.items = []; this.head = 0; }
  enqueue(x) { this.items.push(x); }
  dequeue() {
    if (this.head >= this.items.length) return null;
    const value = this.items[this.head++];
    if (this.head > 64 && this.head * 2 > this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }
    return value;
  }
  size() { return this.items.length - this.head; }
}

module.exports = { Queue };
`,
        example1: {
          title: "BFS Queue Workbench",
          summary:
            "Implements a simple queue abstraction and uses it to run BFS on a graph (queue is the core primitive).",
          checks: [
            "FIFO ordering is preserved",
            "dequeue returns null when empty",
            "queue supports sustained enqueue/dequeue without O(n) shift costs",
          ],
          app: `
const { Queue } = require("./pattern");
const graph = { A: ["B","C"], B: ["D"], C: ["D"], D: [] };
const q = new Queue();
const visited = new Set(["A"]);
q.enqueue("A");
const order = [];
while (q.size()) {
  const node = q.dequeue();
  order.push(node);
  for (const n of graph[node]) if (!visited.has(n)) { visited.add(n); q.enqueue(n); }
}
console.log(order);
`,
        },
        example2: {
          title: "Follow-Up: Level Order Traversal",
          summary:
            "Follow-up: BFS level-order traversal using queue length snapshots per layer.",
          checks: [
            "captures layers without mixing levels",
            "supports trees and graphs (with visited set)",
            "helps answer shortest path / minimum depth questions",
          ],
          demo: `
function levelOrder(root) {
  if (!root) return [];
  const q = [root];
  const levels = [];
  while (q.length) {
    const size = q.length;
    const level = [];
    for (let i = 0; i < size; i += 1) {
      const node = q.shift();
      level.push(node.value);
      for (const child of node.children ?? []) q.push(child);
    }
    levels.push(level);
  }
  return levels;
}

const tree = { value: 1, children: [{ value: 2, children: [] }, { value: 3, children: [{ value: 4, children: [] }] }] };
console.log(levelOrder(tree));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers empty queue behavior and memory compaction guardrails.",
          checks: [
            "dequeue on empty returns null",
            "head index compaction avoids unbounded array growth",
            "works under long-running workloads",
          ],
          demo: `
const { Queue } = require("../example-1/pattern");
const q = new Queue();
console.log(q.dequeue());
for (let i = 0; i < 200; i += 1) q.enqueue(i);
for (let i = 0; i < 180; i += 1) q.dequeue();
console.log("size:", q.size());
`,
        },
      });

    case "recursion":
      return impl({
        patternImpl: `
function factorial(n) {
  if (n < 0) throw new Error("n must be non-negative");
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

module.exports = { factorial };
`,
        example1: {
          title: "Recursion Workbench",
          summary:
            "Implements a recursive function with clear base cases (factorial) to highlight recursion structure and termination.",
          checks: [
            "base case prevents infinite recursion",
            "input validation is explicit",
            "stack depth grows with n",
          ],
          app: `
const { factorial } = require("./pattern");
console.log(factorial(5));
`,
        },
        example2: {
          title: "Follow-Up: Convert to Iteration",
          summary:
            "Follow-up: show how to convert recursion to iteration to avoid call stack growth in production.",
          checks: [
            "iterative version matches recursive output",
            "avoids recursion depth limits",
            "tail recursion elimination is not guaranteed in JS",
          ],
          demo: `
function factorialIter(n) {
  if (n < 0) throw new Error("n must be non-negative");
  let out = 1;
  for (let i = 2; i <= n; i += 1) out *= i;
  return out;
}
console.log(factorialIter(5));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers n=0/1, negative inputs, and recursion depth limits.",
          checks: [
            "0! is 1",
            "negative inputs are rejected",
            "deep recursion can overflow call stack",
          ],
          demo: `
const { factorial } = require("../example-1/pattern");
console.log("0!:", factorial(0));
try { factorial(-1); } catch (e) { console.log("negative:", e.message); }
console.log("note: avoid deep recursion in JS for large n.");
`,
        },
      });

    case "stack":
      return impl({
        patternImpl: `
class Stack {
  constructor() { this.items = []; }
  push(x) { this.items.push(x); }
  pop() { if (!this.items.length) throw new Error("underflow"); return this.items.pop(); }
  peek() { return this.items[this.items.length - 1] ?? null; }
}

module.exports = { Stack };
`,
        example1: {
          title: "Stack Workbench (Balanced Parentheses)",
          summary:
            "Uses a stack to validate balanced parentheses — canonical stack pattern with push/pop invariants.",
          checks: [
            "open tokens push onto stack",
            "closing tokens must match the top",
            "stack is empty at the end for valid strings",
          ],
          app: `
const { Stack } = require("./pattern");
function isBalanced(s) {
  const match = { ")":"(", "]":"[", "}":"{" };
  const st = new Stack();
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") st.push(ch);
    else if (match[ch]) { if (st.pop() !== match[ch]) return false; }
  }
  return st.peek() === null;
}
console.log(isBalanced("({[]})"));
console.log(isBalanced("([)]"));
`,
        },
        example2: {
          title: "Follow-Up: Min Stack",
          summary:
            "Follow-up: maintain stack minimum in O(1) using an auxiliary stack.",
          checks: [
            "min stack updates on pushes and pops",
            "duplicate minima are handled correctly",
            "underflow is explicit",
          ],
          demo: `
class MinStack {
  constructor() { this.values=[]; this.mins=[]; }
  push(x){ this.values.push(x); if(!this.mins.length || x<=this.mins[this.mins.length-1]) this.mins.push(x); }
  pop(){ if(!this.values.length) throw new Error("underflow"); const v=this.values.pop(); if(v===this.mins[this.mins.length-1]) this.mins.pop(); return v; }
  min(){ return this.mins[this.mins.length-1] ?? null; }
}
const s=new MinStack();
s.push(5); s.push(3); s.push(3); s.push(8);
console.log(s.min()); s.pop(); s.pop(); console.log(s.min());
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers stack underflow and empty input behavior.",
          checks: [
            "pop on empty throws",
            "empty strings are balanced",
            "invalid characters policy is explicit",
          ],
          demo: `
const { Stack } = require("../example-1/pattern");
try { new Stack().pop(); } catch (e) { console.log("underflow:", e.message); }
console.log("empty balanced:", true);
`,
        },
      });

    case "string":
      return impl({
        patternImpl: `
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    while (left < right && !/[a-z0-9]/i.test(s[left])) left += 1;
    while (left < right && !/[a-z0-9]/i.test(s[right])) right -= 1;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left += 1;
    right -= 1;
  }
  return true;
}

module.exports = { isPalindrome };
`,
        example1: {
          title: "Two-Pointer Palindrome Workbench",
          summary:
            "Implements a two-pointer scan over a string to validate palindromes with normalization (common string pattern).",
          checks: [
            "skips non-alphanumeric characters",
            "compares case-insensitively",
            "runs in O(n) time, O(1) extra space",
          ],
          app: `
const { isPalindrome } = require("./pattern");
console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("race a car"));
`,
        },
        example2: {
          title: "Follow-Up: Anagram Check",
          summary:
            "Follow-up: frequency counting for anagram checks (hash-map string pattern).",
          checks: [
            "character frequency counts are balanced",
            "supports Unicode/codepoint policy decisions explicitly",
            "rejects differing lengths early",
          ],
          demo: `
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const count = new Map();
  for (const ch of a) count.set(ch, (count.get(ch) ?? 0) + 1);
  for (const ch of b) {
    const v = (count.get(ch) ?? 0) - 1;
    if (v < 0) return false;
    count.set(ch, v);
  }
  return true;
}
console.log(isAnagram("anagram","nagaram"));
console.log(isAnagram("rat","car"));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers Unicode normalization pitfalls and empty string policies.",
          checks: [
            "empty strings are palindromes/anagrams by definition",
            "Unicode normalization (NFC/NFKC) can change matching results",
            "regex-based filters can differ across locales",
          ],
          demo: `
const { isPalindrome } = require("../example-1/pattern");
console.log(isPalindrome(""));
console.log("note: normalize Unicode (NFC/NFKC) upstream if your matching is user-facing across locales.");
`,
        },
      });

    case "top-k-elements":
      return impl({
        patternImpl: `
class MinHeap {
  constructor(compare) { this.compare = compare; this.items = []; }
  push(x){ this.items.push(x); this.#up(this.items.length-1); }
  pop(){ if(!this.items.length) throw new Error("underflow"); const min=this.items[0]; const last=this.items.pop(); if(this.items.length){ this.items[0]=last; this.#down(0);} return min; }
  peek(){ return this.items[0] ?? null; }
  #up(i){ while(i>0){ const p=Math.floor((i-1)/2); if(this.compare(this.items[i],this.items[p])>=0) break; [this.items[i],this.items[p]]=[this.items[p],this.items[i]]; i=p;} }
  #down(i){ while(true){ let b=i; const l=i*2+1, r=i*2+2; if(l<this.items.length && this.compare(this.items[l],this.items[b])<0) b=l; if(r<this.items.length && this.compare(this.items[r],this.items[b])<0) b=r; if(b===i) return; [this.items[i],this.items[b]]=[this.items[b],this.items[i]]; i=b;} }
}

function topK(nums, k) {
  const heap = new MinHeap((a,b)=>a-b);
  for (const n of nums) {
    heap.push(n);
    if (heap.items.length > k) heap.pop();
  }
  return heap.items.slice().sort((a,b)=>b-a);
}

module.exports = { topK };
`,
        example1: {
          title: "Bounded-Heap Top-K Workbench",
          summary:
            "Implements the top-k elements pattern using a bounded min-heap for streaming-friendly ranking.",
          checks: [
            "heap holds at most k items",
            "final items represent top-k (order not guaranteed without sorting)",
            "memory is bounded regardless of input size",
          ],
          app: `
const { topK } = require("./pattern");
console.log(topK([3,2,1,5,6,4], 2));
console.log(topK([1], 1));
`,
        },
        example2: {
          title: "Follow-Up: Quickselect Alternative",
          summary:
            "Follow-up: discuss Quickselect as an O(n) average alternative when you only need the kth element once.",
          checks: [
            "heap is better for streaming / multiple queries",
            "quickselect is better for one-shot selection",
            "both require careful edge handling for ties",
          ],
          demo: `
console.log("Top-K follow-up:");
console.log("- heap: O(n log k), streaming-friendly, supports continuous updates");
console.log("- quickselect: O(n) average, good for one-shot kth element selection");
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers k<=0, k>n, duplicates, and empty inputs.",
          checks: [
            "k<=0 should be rejected explicitly",
            "k>n returns all items or throws per policy",
            "duplicates are preserved",
          ],
          demo: `
const { topK } = require("../example-1/pattern");
console.log("dupes:", topK([5,5,5], 2));
console.log("k>n:", topK([1,2], 5));
console.log("note: validate k upstream; define policy for k>n.");
`,
        },
      });

    case "tree":
      return impl({
        patternImpl: `
function bfsLevels(root) {
  if (!root) return [];
  const q = [root];
  const levels = [];
  while (q.length) {
    const size = q.length;
    const level = [];
    for (let i = 0; i < size; i += 1) {
      const node = q.shift();
      level.push(node.value);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    levels.push(level);
  }
  return levels;
}

module.exports = { bfsLevels };
`,
        example1: {
          title: "Level-Order Traversal Workbench",
          summary:
            "Implements BFS level-order traversal for binary trees — a canonical tree pattern using a queue.",
          checks: [
            "produces level-by-level arrays",
            "handles missing children",
            "works in O(n) time",
          ],
          app: `
const { bfsLevels } = require("./pattern");
const tree = { value: 1, left: { value: 2, left: null, right: null }, right: { value: 3, left: { value: 4, left: null, right: null }, right: null } };
console.log(bfsLevels(tree));
`,
        },
        example2: {
          title: "Follow-Up: DFS Traversals",
          summary:
            "Follow-up: implement preorder/inorder/postorder DFS to discuss recursion vs iterative stack trade-offs.",
          checks: [
            "preorder visits node before children",
            "inorder is sorted for BSTs",
            "postorder is useful for deletions/aggregation",
          ],
          demo: `
function inorder(root, out=[]) { if(!root) return out; inorder(root.left,out); out.push(root.value); inorder(root.right,out); return out; }
const tree = { value: 2, left: { value: 1 }, right: { value: 3 } };
console.log(inorder(tree));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers null root, skewed trees (degenerates), and recursion depth concerns.",
          checks: [
            "null root returns []",
            "skewed trees behave like linked lists",
            "deep recursion risks stack overflow in JS",
          ],
          demo: `
const { bfsLevels } = require("../example-1/pattern");
console.log(bfsLevels(null));
console.log("note: for deep trees, consider iterative DFS to avoid recursion depth issues.");
`,
        },
      });

    case "graph":
      return impl({
        patternImpl: `
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
  let curr = target;
  while (curr !== undefined) {
    path.push(curr);
    if (curr === start) break;
    curr = parent.get(curr);
  }
  return path.reverse();
}

module.exports = { shortestPath };
`,
        example1: {
          title: "BFS Shortest Path Workbench",
          summary:
            "Implements BFS on an unweighted graph to find a minimum-hop path and reconstructs it via a parent map.",
          checks: [
            "BFS guarantees minimum hops in unweighted graphs",
            "parent map reconstructs a valid path",
            "visited set prevents infinite loops on cycles",
          ],
          app: `
const { shortestPath } = require("./pattern");
const graph = { A: ["B", "C"], B: ["D"], C: ["D"], D: ["E"], E: [] };
console.log(shortestPath(graph, "A", "E"));
console.log(shortestPath(graph, "A", "Z"));
`,
        },
        example2: {
          title: "Follow-Up: Weighted Graphs",
          summary:
            "Follow-up: explain when BFS is invalid (weighted edges) and why Dijkstra/Bellman–Ford are needed.",
          checks: [
            "BFS is correct only when all edges have equal weight",
            "Dijkstra requires non-negative weights",
            "Bellman–Ford handles negative weights (and detects negative cycles)",
          ],
          demo: `
console.log("Follow-up: if edges have weights, BFS no longer guarantees shortest total cost.");
console.log("- Dijkstra: non-negative weights");
console.log("- Bellman–Ford: allows negative weights and detects negative cycles");
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers disconnected components, self-loops, and missing adjacency lists.",
          checks: [
            "disconnected targets return null",
            "self-loops don’t break traversal",
            "missing keys default to empty adjacency",
          ],
          demo: `
const { shortestPath } = require("../example-1/pattern");
console.log(shortestPath({ A: ["A"], B: [] }, "A", "B"));
console.log(shortestPath({ A: ["A"] }, "A", "A"));
`,
        },
      });

    case "divide-and-conquer":
      return impl({
        patternImpl: `
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
  if (arr.length === 0) return null;
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
        example1: {
          title: "Max Subarray Workbench",
          summary:
            "Implements a divide-and-conquer solution for maximum subarray to show split/combine structure.",
          checks: [
            "problem splits into left/right subproblems",
            "crossing sum combines across the midpoint",
            "returns null on empty input (policy)",
          ],
          app: `
const { maxSubarray } = require("./pattern");
console.log(maxSubarray([-2,1,-3,4,-1,2,1,-5,4]));
console.log(maxSubarray([]));
`,
        },
        example2: {
          title: "Follow-Up: Linear DP Alternative (Kadane)",
          summary:
            "Follow-up: show that some divide-and-conquer problems have linear-time DP solutions preferred in production.",
          checks: [
            "Kadane runs in O(n) time",
            "often simpler and faster in practice",
            "still requires clear empty-input policy",
          ],
          demo: `
function kadane(arr) {
  if (arr.length === 0) return null;
  let best = arr[0];
  let current = arr[0];
  for (let i = 1; i < arr.length; i += 1) {
    current = Math.max(arr[i], current + arr[i]);
    best = Math.max(best, current);
  }
  return best;
}
console.log(kadane([-2,1,-3,4,-1,2,1,-5,4]));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers all-negative arrays and singletons (should return the maximum element).",
          checks: [
            "all-negative input returns the least-negative value",
            "singleton returns itself",
            "empty input policy is explicit",
          ],
          demo: `
const { maxSubarray } = require("../example-1/pattern");
console.log(maxSubarray([-5,-2,-9]));
console.log(maxSubarray([7]));
`,
        },
      });

    case "sliding-window":
      return impl({
        patternImpl: `
function maxSumSubarrayK(nums, k) {
  if (k <= 0) throw new Error("k must be positive");
  if (nums.length < k) return null;

  let windowSum = 0;
  for (let i = 0; i < k; i += 1) windowSum += nums[i];
  let best = windowSum;

  for (let right = k; right < nums.length; right += 1) {
    windowSum += nums[right] - nums[right - k];
    best = Math.max(best, windowSum);
  }

  return best;
}

module.exports = { maxSumSubarrayK };
`,
        example1: {
          title: "Implementation Workbench",
          summary:
            "Implements a fixed-size sliding window to compute max k-length subarray sums (representative for throughput/latency windowing).",
          checks: [
            "window updates are O(1) per step (add right, remove left)",
            "returns null when k exceeds array length",
            "works with mixed positive/negative values",
          ],
          app: `
const { maxSumSubarrayK } = require("./pattern");
console.log(maxSumSubarrayK([2, 1, 5, 1, 3, 2], 3));
console.log(maxSumSubarrayK([2, -1, 2, 1, -3, 4], 2));
`,
        },
        example2: {
          title: "Follow-Up: Variable-Size Window",
          summary:
            "Implements the common follow-up: smallest subarray length with sum >= target (variable-size window).",
          checks: [
            "left pointer shrinks only when the constraint is satisfied",
            "returns 0 when no window meets the target",
            "monotonic left advancement keeps O(n) time",
          ],
          demo: `
function minSubarrayLen(target, nums) {
  let left = 0;
  let sum = 0;
  let best = Infinity;
  for (let right = 0; right < nums.length; right += 1) {
    sum += nums[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left++];
    }
  }
  return Number.isFinite(best) ? best : 0;
}

console.log(minSubarrayLen(7, [2, 1, 5, 2, 3, 2]));
console.log(minSubarrayLen(100, [1, 2, 3]));
`,
        },
        example3: {
          title: "Edge Cases and Guardrails",
          summary:
            "Covers boundary cases: k<=0, empty arrays, and k>n, plus input validation expectations.",
          checks: [
            "k<=0 is rejected explicitly",
            "empty inputs return null/0 per policy",
            "implementation does not read out of bounds",
          ],
          demo: `
const { maxSumSubarrayK } = require("../example-1/pattern");

try { console.log(maxSumSubarrayK([], 3)); } catch (e) { console.log("empty:", e.message); }
try { console.log(maxSumSubarrayK([1,2,3], 0)); } catch (e) { console.log("k=0:", e.message); }
console.log("k>n:", maxSumSubarrayK([1, 2], 3));
`,
        },
      });

    case "two-pointer":
      return impl({
        patternImpl: `
function pairWithTargetSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left += 1;
    else right -= 1;
  }
  return null;
}

module.exports = { pairWithTargetSum };
`,
        example1: {
          title: "Implementation Workbench",
          summary:
            "Implements the canonical sorted-array two-pointer pattern for pair sum, emphasizing monotonic pointer movement.",
          checks: [
            "precondition is sorted input (or you must sort/copy upstream)",
            "left/right pointers move monotonically (O(n))",
            "returns null when no pair exists",
          ],
          app: `
const { pairWithTargetSum } = require("./pattern");
console.log(pairWithTargetSum([1, 2, 3, 4, 6], 6));
console.log(pairWithTargetSum([2, 5, 9, 11], 11));
`,
        },
        example2: {
          title: "Follow-Up: Remove Duplicates In-Place",
          summary:
            "Follow-up scenario: compress duplicates in a sorted array in-place (fast/slow pointer variant).",
          checks: [
            "writes only when a new unique value is found",
            "returns the new logical length",
            "preserves relative order of uniques",
          ],
          demo: `
function removeDuplicates(arr) {
  if (arr.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < arr.length; read += 1) {
    if (arr[read] !== arr[read - 1]) arr[write++] = arr[read];
  }
  return write;
}

const arr = [2, 3, 3, 3, 6, 9, 9];
const len = removeDuplicates(arr);
console.log(len, arr.slice(0, len));
`,
        },
        example3: {
          title: "Edge Cases and Preconditions",
          summary:
            "Covers edge cases: empty array, single element, and unsorted input (two-pointer sum semantics break).",
          checks: [
            "empty arrays return null/0 safely",
            "single-element arrays cannot form pairs",
            "unsorted inputs must be validated or sorted first",
          ],
          demo: `
const { pairWithTargetSum } = require("../example-1/pattern");
console.log("empty:", pairWithTargetSum([], 10));
console.log("single:", pairWithTargetSum([5], 10));
console.log("unsorted (invalid):", pairWithTargetSum([3, 1, 2, 4], 5));
`,
        },
      });

    case "fast-slow-pointers":
      return impl({
        patternImpl: `
function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

module.exports = { hasCycle };
`,
        example1: {
          title: "Cycle Detection Workbench",
          summary:
            "Implements Floyd’s cycle detection on a linked list — the core fast/slow pointer pattern.",
          checks: [
            "fast advances 2 steps, slow advances 1 step",
            "meeting implies a cycle; reaching null implies acyclic",
            "uses O(1) extra memory",
          ],
          app: `
const { hasCycle } = require("./pattern");

function node(value) { return { value, next: null }; }
const a = node("A"); const b = node("B"); const c = node("C");
a.next = b; b.next = c;
console.log("acyclic:", hasCycle(a));
c.next = b;
console.log("cyclic:", hasCycle(a));
`,
        },
        example2: {
          title: "Follow-Up: Find Middle",
          summary:
            "Follow-up: use fast/slow pointers to find the middle of a linked list in one pass.",
          checks: [
            "slow points to middle when fast hits end",
            "even-length policy is explicit (choose upper/lower middle)",
            "does not modify the list",
          ],
          demo: `
function middle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

function build(values) {
  const nodes = values.map((v) => ({ v, next: null }));
  for (let i = 0; i < nodes.length - 1; i += 1) nodes[i].next = nodes[i + 1];
  return nodes[0] ?? null;
}

console.log("odd middle:", middle(build([1,2,3,4,5])).v);
console.log("even middle:", middle(build([1,2,3,4])).v);
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers null head, single-node lists, and self-cycles.",
          checks: [
            "null head returns false for cycle detection",
            "single-node list is handled safely",
            "self-cycle is detected",
          ],
          demo: `
const { hasCycle } = require("../example-1/pattern");
console.log("null:", hasCycle(null));
const one = { value: 1, next: null };
console.log("single:", hasCycle(one));
one.next = one;
console.log("self-cycle:", hasCycle(one));
`,
        },
      });

    case "merge-intervals":
      return impl({
        patternImpl: `
function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const interval of sorted) {
    if (!merged.length || interval[0] > merged[merged.length - 1][1]) {
      merged.push([...interval]);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
    }
  }
  return merged;
}

module.exports = { mergeIntervals };
`,
        example1: {
          title: "Implementation Workbench",
          summary:
            "Implements interval merging by sorting start times and coalescing overlaps — the canonical merge-intervals pattern.",
          checks: [
            "input is sorted before merging",
            "overlaps are merged by extending the current end",
            "non-overlapping intervals remain separate",
          ],
          app: `
const { mergeIntervals } = require("./pattern");
console.log(mergeIntervals([[1,4],[2,5],[7,9]]));
console.log(mergeIntervals([[6,7],[2,4],[5,9]]));
`,
        },
        example2: {
          title: "Follow-Up: Insert Interval",
          summary:
            "Follow-up: insert a new interval and merge in one pass (common in scheduling systems).",
          checks: [
            "keeps intervals sorted as it processes",
            "merges only where overlaps occur",
            "handles insertion before/after all intervals",
          ],
          demo: `
function insertInterval(intervals, newInterval) {
  const out = [];
  let i = 0;
  while (i < intervals.length && intervals[i][1] < newInterval[0]) out.push(intervals[i++]);
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval = [Math.min(newInterval[0], intervals[i][0]), Math.max(newInterval[1], intervals[i][1])];
    i += 1;
  }
  out.push(newInterval);
  while (i < intervals.length) out.push(intervals[i++]);
  return out;
}

console.log(insertInterval([[1,3],[6,9]], [2,5]));
console.log(insertInterval([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers touching endpoints, nested intervals, and empty inputs.",
          checks: [
            "touching intervals policy is explicit (e.g., [1,2] and [2,3] merge or not)",
            "nested intervals collapse correctly",
            "empty inputs behave safely",
          ],
          demo: `
const { mergeIntervals } = require("../example-1/pattern");
console.log("empty:", mergeIntervals([]));
console.log("nested:", mergeIntervals([[1,10],[2,3],[4,5]]));
console.log("touching:", mergeIntervals([[1,2],[2,3]]));
`,
        },
      });

    case "prefix-sum":
      return impl({
        patternImpl: `
function buildPrefix(nums) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i += 1) prefix[i + 1] = prefix[i] + nums[i];
  return prefix;
}

function rangeSum(prefix, left, rightInclusive) {
  return prefix[rightInclusive + 1] - prefix[left];
}

module.exports = { buildPrefix, rangeSum };
`,
        example1: {
          title: "Implementation Workbench",
          summary:
            "Builds a prefix sum array to answer range sum queries in O(1) after O(n) preprocessing.",
          checks: [
            "prefix array is length n+1 with prefix[0]=0",
            "range sum is computed by subtraction",
            "multiple queries avoid repeated scanning",
          ],
          app: `
const { buildPrefix, rangeSum } = require("./pattern");
const nums = [3, -2, 5, 1, 6];
const prefix = buildPrefix(nums);
console.log("sum 0..2:", rangeSum(prefix, 0, 2));
console.log("sum 2..4:", rangeSum(prefix, 2, 4));
`,
        },
        example2: {
          title: "Follow-Up: Subarray Sum Equals K",
          summary:
            "Follow-up: count subarrays that sum to k using prefix sums + a hashmap of seen prefix totals.",
          checks: [
            "counts all subarrays (including overlapping)",
            "supports negatives unlike two-pointer window",
            "uses O(n) time with hash map",
          ],
          demo: `
function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);
  let sum = 0;
  let count = 0;
  for (const num of nums) {
    sum += num;
    count += seen.get(sum - k) ?? 0;
    seen.set(sum, (seen.get(sum) ?? 0) + 1);
  }
  return count;
}

console.log(subarraySum([1,1,1], 2));
console.log(subarraySum([3,4,7,2,-3,1,4,2], 7));
`,
        },
        example3: {
          title: "Edge Cases and Overflow Policy",
          summary:
            "Covers empty arrays, single element ranges, and numeric overflow considerations (in non-JS languages).",
          checks: [
            "empty array queries are rejected or return 0 per policy",
            "range boundaries are validated",
            "use 64-bit types in languages with overflow risk",
          ],
          demo: `
const { buildPrefix, rangeSum } = require("../example-1/pattern");
const prefix = buildPrefix([]);
try { console.log(rangeSum(prefix, 0, 0)); } catch (e) { console.log("bad range"); }
console.log("note: use 64-bit prefix sums in languages with integer overflow.");
`,
        },
      });

    case "monotonic-stack":
      return impl({
        patternImpl: `
function nextGreaterElements(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // indices, nums decreasing
  for (let i = 0; i < nums.length; i += 1) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}

module.exports = { nextGreaterElements };
`,
        example1: {
          title: "Next Greater Element Workbench",
          summary:
            "Implements a monotonic decreasing stack to compute next-greater elements in O(n).",
          checks: [
            "stack holds indices in decreasing value order",
            "each index is pushed and popped at most once",
            "unresolved items stay -1",
          ],
          app: `
const { nextGreaterElements } = require("./pattern");
console.log(nextGreaterElements([2,1,2,4,3]));
`,
        },
        example2: {
          title: "Follow-Up: Largest Rectangle in Histogram",
          summary:
            "Follow-up: compute largest rectangle in a histogram (monotonic stack boundaries).",
          checks: [
            "uses stack to find previous/next smaller bars",
            "handles equal heights consistently",
            "runs in O(n) time",
          ],
          demo: `
function largestRectangleArea(heights) {
  const stack = [];
  let best = 0;
  for (let i = 0; i <= heights.length; i += 1) {
    const current = i === heights.length ? 0 : heights[i];
    while (stack.length && current < heights[stack[stack.length - 1]]) {
      const h = heights[stack.pop()];
      const left = stack.length ? stack[stack.length - 1] + 1 : 0;
      best = Math.max(best, h * (i - left));
    }
    stack.push(i);
  }
  return best;
}

console.log(largestRectangleArea([2,1,5,6,2,3]));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers strictly increasing/decreasing arrays, duplicates, and empty inputs.",
          checks: [
            "empty inputs return empty outputs safely",
            "duplicates have deterministic handling (>= vs > in comparisons)",
            "stack does not underflow on boundary conditions",
          ],
          demo: `
const { nextGreaterElements } = require("../example-1/pattern");
console.log("empty:", nextGreaterElements([]));
console.log("inc:", nextGreaterElements([1,2,3]));
console.log("dec:", nextGreaterElements([3,2,1]));
console.log("dupes:", nextGreaterElements([2,2,2]));
`,
        },
      });

    case "union-find":
      return impl({
        patternImpl: `
class UnionFind {
  constructor(items) {
    this.parent = new Map(items.map((x) => [x, x]));
    this.rank = new Map(items.map((x) => [x, 0]));
  }

  find(x) {
    const p = this.parent.get(x);
    if (p === undefined) throw new Error("unknown item");
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

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}

module.exports = { UnionFind };
`,
        example1: {
          title: "Connectivity Workbench",
          summary:
            "Implements union-find with path compression and union by rank for connectivity queries.",
          checks: [
            "union merges components only when roots differ",
            "find compresses paths to flatten trees",
            "connected queries become near O(1) amortized",
          ],
          app: `
const { UnionFind } = require("./pattern");
const uf = new UnionFind(["a","b","c","d"]);
uf.union("a","b");
uf.union("c","d");
console.log(uf.connected("a","b"), uf.connected("a","c"));
uf.union("b","c");
console.log(uf.connected("a","d"));
`,
        },
        example2: {
          title: "Follow-Up: Cycle Detection in Graph",
          summary:
            "Follow-up: detect cycles in an undirected graph by unioning edges and rejecting edges that connect already-connected nodes.",
          checks: [
            "detects a cycle when an edge connects nodes in the same component",
            "works in streaming fashion over edges",
            "requires nodes to be known/registered",
          ],
          demo: `
const { UnionFind } = require("../example-1/pattern");
const nodes = ["A","B","C","D"];
const edges = [["A","B"],["B","C"],["C","A"],["C","D"]];
const uf = new UnionFind(nodes);
let hasCycle = false;
for (const [u,v] of edges) {
  if (!uf.union(u,v)) { hasCycle = true; break; }
}
console.log("cycle?", hasCycle);
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers unknown items, redundant unions, and singleton components.",
          checks: [
            "unknown items are rejected explicitly",
            "redundant unions are no-ops",
            "singleton components remain connected only to themselves",
          ],
          demo: `
const { UnionFind } = require("../example-1/pattern");
const uf = new UnionFind(["x"]);
console.log("x~x:", uf.connected("x","x"));
console.log("redundant union:", uf.union("x","x"));
try { uf.connected("x","y"); } catch (e) { console.log("unknown:", e.message); }
`,
        },
      });

    case "trie":
      return impl({
        patternImpl: `
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isWord = true;
  }

  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  collect(prefix) {
    const node = this.startsWith(prefix);
    if (!node) return [];
    const out = [];
    const dfs = (n, path) => {
      if (n.isWord) out.push(path);
      for (const [ch, child] of n.children) dfs(child, path + ch);
    };
    dfs(node, prefix);
    return out;
  }
}

module.exports = { Trie };
`,
        example1: {
          title: "Autocomplete Workbench",
          summary:
            "Implements a trie and demonstrates prefix-based autocomplete suggestions.",
          checks: [
            "common prefixes share nodes",
            "prefix traversal reaches sub-tree directly",
            "enumeration returns all words under a prefix",
          ],
          app: `
const { Trie } = require("./pattern");
const trie = new Trie();
["apple","app","apply","apt","bat"].forEach((w) => trie.insert(w));
console.log(trie.collect("ap"));
console.log(trie.collect("bat"));
`,
        },
        example2: {
          title: "Follow-Up: Word Deletion",
          summary:
            "Follow-up: delete a word and prune nodes without breaking other words sharing a prefix.",
          checks: [
            "deleting one word does not delete shared prefix nodes",
            "unused nodes are pruned on unwind",
            "missing words return false",
          ],
          demo: `
const { Trie } = require("../example-1/pattern");

function removeWord(trie, word) {
  const stack = [];
  let node = trie.root;
  for (const ch of word) {
    if (!node.children.has(ch)) return false;
    stack.push([node, ch]);
    node = node.children.get(ch);
  }
  if (!node.isWord) return false;
  node.isWord = false;
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const [parent, ch] = stack[i];
    const child = parent.children.get(ch);
    if (child.isWord || child.children.size) break;
    parent.children.delete(ch);
  }
  return true;
}

const trie = new Trie();
["cache","caching","catalog"].forEach((w) => trie.insert(w));
console.log("before:", trie.collect("ca"));
removeWord(trie, "cache");
console.log("after:", trie.collect("ca"));
`,
        },
        example3: {
          title: "Edge Cases",
          summary:
            "Covers empty prefix enumeration, duplicates, and Unicode behavior assumptions.",
          checks: [
            "empty prefix enumerates all words (policy)",
            "duplicate inserts are idempotent",
            "Unicode normalization is an application-level decision",
          ],
          demo: `
const { Trie } = require("../example-1/pattern");
const trie = new Trie();
["go","go","gone","guild"].forEach((w) => trie.insert(w));
console.log("all:", trie.collect(""));
console.log("missing:", trie.collect("z"));
console.log("note: normalize Unicode (NFC/NFKC) upstream if you need canonical matching.");
`,
        },
      });

    default:
      throw new Error(`No pattern template implemented for slug: ${slug}`);
  }
}

function listPatternSlugs() {
  if (!fs.existsSync(ARTICLE_DIR)) return [];
  return fs
    .readdirSync(ARTICLE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
    .map((entry) => entry.name.replace(/\.tsx$/, ""))
    .sort();
}

function main() {
  const slugs = listPatternSlugs();
  if (slugs.length === 0) {
    console.error("No Leetcode pattern articles found; nothing to generate.");
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

  console.log(`Generated ${slugs.length} leetcode pattern topic example set(s).`);
}

main();

const assert = require("node:assert/strict");
const { topK } = require("../example-1/pattern");

function validateK(k) {
  if (!Number.isInteger(k) || k <= 0) {
    throw new Error(`k must be a positive integer (got: ${k})`);
  }
}

function partition(arr, left, right, pivotIndex) {
  const pivotValue = arr[pivotIndex];
  [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
  let storeIndex = left;
  for (let i = left; i < right; i += 1) {
    if (arr[i] < pivotValue) {
      [arr[storeIndex], arr[i]] = [arr[i], arr[storeIndex]];
      storeIndex += 1;
    }
  }
  [arr[right], arr[storeIndex]] = [arr[storeIndex], arr[right]];
  return storeIndex;
}

function quickselect(arr, kSmallest, rng = Math.random) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const pivotIndex = left + Math.floor(rng() * (right - left + 1));
    const pivotFinal = partition(arr, left, right, pivotIndex);
    if (pivotFinal === kSmallest) return arr[pivotFinal];
    if (pivotFinal < kSmallest) left = pivotFinal + 1;
    else right = pivotFinal - 1;
  }
  return arr[kSmallest];
}

function kthLargestQuickselect(nums, k) {
  validateK(k);
  if (nums.length === 0) throw new Error("nums must be non-empty");
  if (k > nums.length) throw new Error(`k cannot exceed n (k=${k}, n=${nums.length})`);
  const copy = nums.slice();
  const kSmallest = copy.length - k;
  return quickselect(copy, kSmallest);
}

function normalizeTopK(result) {
  return result.slice().sort((a, b) => b - a);
}

// Demo: compare heap Top-K vs Quickselect kth-largest (one-shot)
const nums = [9, 1, 9, 2, 7, 7, 3, 5];
const k = 3;
const heapTopK = normalizeTopK(topK(nums, k));
const kth = kthLargestQuickselect(nums, k);

console.log("nums:", nums);
console.log(`k=${k}`);
console.log("heap topK:", heapTopK);
console.log("quickselect kth largest:", kth);

// The kth-largest should be the smallest element in the Top-K set.
assert.equal(kth, heapTopK[heapTopK.length - 1]);

// Edge checks: duplicates, invalid k
assert.equal(kthLargestQuickselect([5, 5, 5], 2), 5);
assert.throws(() => kthLargestQuickselect([], 1), /non-empty/);
assert.throws(() => kthLargestQuickselect([1, 2], 0), /positive integer/);
assert.throws(() => kthLargestQuickselect([1, 2], 3), /cannot exceed/);

console.log("OK: quickselect vs heap behavior + edge checks passed.");

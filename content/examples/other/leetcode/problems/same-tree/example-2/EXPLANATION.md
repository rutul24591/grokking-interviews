# Same Tree — Example 2 (More Optimized: Iterative Stack)

LeetCode: https://leetcode.com/problems/same-tree/

## Approach
Iteratively traverse both trees in lockstep using an explicit stack of node pairs.
This avoids recursion depth issues while doing the same comparisons.

## Complexity (step-by-step)
1. Push/pop each node pair once: O(n).
2. Constant-time checks per pair.

## Overall Complexity
- Time: O(n)
- Space: O(h) explicit stack (worst-case O(n))

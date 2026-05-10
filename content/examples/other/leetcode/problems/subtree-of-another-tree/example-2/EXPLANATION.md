# Subtree of Another Tree — Example 2 (More Optimized: Preorder Serialization)

LeetCode: https://leetcode.com/problems/subtree-of-another-tree/

## Approach
Serialize both trees with preorder traversal including null markers (`#`). Then check if `subRoot` serialization is a substring of `root` serialization.

Null markers are required to avoid false matches (shape differences).

## Complexity (step-by-step)
1. Serialize `root`: O(N).
2. Serialize `subRoot`: O(M).
3. Substring search: typically O(N+M) with efficient algorithms; using `includes`/`contains` may be O(N*M) worst-case.

## Overall Complexity
- Time: O(N + M) expected; worst-case depends on substring search
- Space: O(N + M) for strings

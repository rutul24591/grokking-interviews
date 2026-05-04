# Number of Islands — Example 1 (Less Optimized: DFS Mutating Grid)

LeetCode: https://leetcode.com/problems/number-of-islands/

## Approach
Scan every cell. When we find land `'1'`, increment island count and DFS-flood-fill to mark the whole island as water `'0'`.

## Complexity (step-by-step)
1. Scan all `R*C` cells once: O(RC).
2. Each cell is visited/marked at most once by DFS: total O(RC).

## Overall Complexity
- Time: O(RC)
- Space: O(RC) worst-case recursion stack (or O(RC) if the island is one big blob)

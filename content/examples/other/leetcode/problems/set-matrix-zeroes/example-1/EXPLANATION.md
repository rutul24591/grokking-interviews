# Set Matrix Zeroes — Example 1 (Less Optimized: Track Zero Rows/Cols with Sets)

LeetCode: https://leetcode.com/problems/set-matrix-zeroes/

## Approach
First pass: record which rows and columns contain a zero.
Second pass: set a cell to zero if its row or column is marked.

## Complexity (step-by-step)
1. Scan matrix and fill sets: O(RC).
2. Second scan to zero cells: O(RC).

## Overall Complexity
- Time: O(RC)
- Space: O(R + C)

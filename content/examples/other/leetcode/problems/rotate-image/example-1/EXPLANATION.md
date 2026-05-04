# Rotate Image — Example 1 (Less Optimized: Extra Matrix Copy)

LeetCode: https://leetcode.com/problems/rotate-image/

## Approach
Compute rotated coordinates into a new matrix `out`, then copy `out` back into `matrix`.
Mapping for 90° clockwise: `out[c][n-1-r] = matrix[r][c]`.

## Complexity (step-by-step)
1. Allocate `n x n` output matrix: O(n^2) space.
2. Fill `out` by scanning all cells: O(n^2).
3. Copy back into input: O(n^2).

## Overall Complexity
- Time: O(n^2)
- Space: O(n^2)

# Set Matrix Zeroes — Example 2 (More Optimized: Use First Row/Col as Markers)

LeetCode: https://leetcode.com/problems/set-matrix-zeroes/

## Approach
Use first row and first column as marker storage:
- if `matrix[r][c] == 0`, set `matrix[r][0] = 0` and `matrix[0][c] = 0`
Then zero out cells based on markers.
Track whether first row/col originally had zeros with two booleans to avoid losing that information.

## Complexity (step-by-step)
1. Determine `firstRowZero` and `firstColZero`: O(R + C).
2. Marker pass over inner cells: O(RC).
3. Zeroing pass over inner cells: O(RC).
4. Zero first row/col if needed: O(R + C).

## Overall Complexity
- Time: O(RC)
- Space: O(1)

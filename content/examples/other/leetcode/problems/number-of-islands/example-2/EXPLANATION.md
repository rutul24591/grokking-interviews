# Number of Islands — Example 2 (More Optimized: Union-Find)

LeetCode: https://leetcode.com/problems/number-of-islands/

## Approach
Union adjacent land cells. Start with `islands = 0`.
When we see a land cell, increment `islands`. When we successfully union it with an adjacent land cell (meaning they were separate components), decrement `islands`.

## Complexity (step-by-step)
1. Scan grid once: O(RC).
2. For each land cell, attempt up to 2 unions (top/left): O(α(N)) amortized each, where `N=R*C`.

## Overall Complexity
- Time: O(RC * α(RC)) ~ O(RC)
- Space: O(RC) DSU arrays

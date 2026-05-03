Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements bottom-up DP tabulation for coin change (min coins) to show table fill order and subproblem reuse.

It demonstrates:
- dp[0]=0 base case anchors the recurrence
- fill order ensures dp[a-coin] is available when computing dp[a]
- returns -1 when no solution exists

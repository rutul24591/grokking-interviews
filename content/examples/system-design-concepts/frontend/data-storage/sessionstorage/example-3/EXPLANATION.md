# SessionStorage Example 3

The important edge case is that sessionStorage is per-tab, not global across the browser profile. That makes it safer for short-lived workflow state, but unsuitable for cross-tab coordination.


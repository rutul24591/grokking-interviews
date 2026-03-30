# Periodic Background Sync — Example 2

Choosing a refresh interval is a policy problem, not just an API call.

Signals that often matter:
- network quality
- `saveData`
- battery level
- recent user engagement
- content churn

This script makes those trade-offs explicit.


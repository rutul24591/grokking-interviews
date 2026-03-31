This app now simulates a fuller integration cycle:

- the host requests a strategy-specific script plan from the backend
- the browser waits until the strategy’s boot point
- the UI records which script actually became available and when

That makes the example closer to a real script-orchestration surface instead of just printing strategy names.

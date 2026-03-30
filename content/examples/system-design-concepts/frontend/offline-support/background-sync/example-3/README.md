## Background Sync — Example 3: Replay safety, idempotency windows, and tab coordination (Node)

### Run
```bash
node run.js
```

### What it covers
- duplicate delivery inside the idempotency window
- partial success where the server commits but the client retries
- out-of-order queue replay detection
- single-leader drain coordination across tabs
- expired dedupe state that reintroduces duplicate-write risk

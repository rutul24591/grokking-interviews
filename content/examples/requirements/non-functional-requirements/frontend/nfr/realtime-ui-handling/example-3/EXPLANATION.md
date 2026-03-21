# Edge case: duplicates and out-of-order delivery

Realtime transports can deliver:
- duplicates (retries),
- out-of-order messages (multi-path),
- partial snapshots.

Use an ordering key (cursor/sequence) and merge deterministically.


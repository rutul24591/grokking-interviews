This example focuses on a reusable primitive in incident response: **fingerprinting + dedup windows**.

Good alerting systems:
- compute stable fingerprints from key dimensions
- deduplicate within a window to prevent paging storms
- preserve per-alert details for debugging


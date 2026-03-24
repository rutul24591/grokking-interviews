## Event-Driven Architecture — Example 3: Versioned events + schema evolution

This example shows a practical pattern for evolving event payloads without breaking consumers:
- a stable envelope (`id`, `ts`, `type`, `v`)
- per-version schemas
- a “normalization” layer that converts older versions to the newest internal model

### Run
```bash
pnpm i
pnpm start
```


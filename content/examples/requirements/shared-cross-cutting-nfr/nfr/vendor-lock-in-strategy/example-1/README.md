# Example 1 — Portable Object Store (adapters + mock S3-compatible API)

## What it shows
- A vendor-neutral `ObjectStore` interface with two implementations:
  - **local** filesystem adapter (dev-friendly baseline)
  - **s3mock** adapter (speaks a portable “S3-like” HTTP surface)
- Capability flags (`presignedGet`, `multipartUpload`) to avoid leaking vendor details into core flows.
- A Node agent that runs the same behavioral suite against both providers (via `x-object-store` override).

## Prereqs
- Node.js 20+ recommended (Node 18+ should work).
- `pnpm` installed.

## Run
### 1) Start the app
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000`.

### 2) Run the agent (new terminal)
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Switch providers (optional)
By default, `/api/objects` uses `OBJECT_STORE_PROVIDER`:
- `local` (default)
- `s3mock`

Example:
```bash
OBJECT_STORE_PROVIDER=s3mock pnpm dev
```

## Files to start with
- `lib/objectStore.ts` and `lib/objectStores/*` (adapter boundary)
- `app/api/objects/*` (domain endpoints; provider selection is a config decision)
- `app/api/mock-s3/*` (mock portable protocol surface)
- `src/agent/run.ts` (behavioral suite against both adapters)


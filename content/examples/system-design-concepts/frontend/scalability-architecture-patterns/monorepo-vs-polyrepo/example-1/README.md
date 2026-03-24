## Monorepo vs Polyrepo — Example 1: Monorepo with shared API contracts

This example is a small **pnpm workspace monorepo**:
- `apps/api`: Node.js API server
- `apps/web`: Next.js app consuming the API
- `packages/contracts`: shared Zod schemas + TypeScript types

It demonstrates a key monorepo advantage: **single-source-of-truth contracts** that can be updated atomically.

### Run

Install + build contracts:
```bash
pnpm i
pnpm --filter @acme/contracts build
```

Start API:
```bash
pnpm --filter @acme/api dev
```

Start web:
```bash
pnpm --filter @acme/web dev
```

Open `http://localhost:3000`.


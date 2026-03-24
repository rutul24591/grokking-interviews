## Monorepo vs Polyrepo — Example 3: Enforce boundaries (avoid “big ball of mud”)

Monorepos can devolve into tight coupling if package boundaries aren’t enforced.

This example shows a tiny “boundary check” script that fails if:
- `apps/web` imports from `apps/api`

### Run
```bash
pnpm i
pnpm start
```

### Expected output
This example ships with an intentional violation in `apps/web/bad.ts` so you can see the detector fire.
Remove the import to see the check pass.

## Why boundaries matter

Monorepo benefits only hold if teams keep clear boundaries:
- shared code goes into `packages/*`
- apps depend on packages, not on each other’s internals

Without enforcement:
- refactors become risky (everything depends on everything)
- deploy independence erodes
- build times explode

In production, you’d use:
- ESLint import rules
- TS project references
- tools like Nx/Turborepo constraints


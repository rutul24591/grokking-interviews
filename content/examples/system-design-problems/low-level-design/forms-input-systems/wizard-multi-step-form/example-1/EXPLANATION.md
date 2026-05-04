# Wizard / Multi-step Form — Full Implementation

Example 1 is a production-style **wizard / multi-step form** design.

What interviews typically probe:
- Per-step vs whole-form validation.
- Preserving state across steps and refreshes.
- Branching steps and “skip” logic.
- Async step transitions (e.g., server-side address validation) without double-submits.
- Back/forward navigation rules and idempotent persistence.

## Architecture

- `wizard-store.ts` is the single source of truth (values, current step, visited, submission state).
- Steps are declared as data (`step-definition.ts`) so routing/branching is deterministic.
- Validation is treated as an interface: each step provides `validate(values)` returning field issues.

## File Structure

```
example-1/
  lib/
    step-definition.ts
    wizard-store.ts
    validation.ts
  components/
    wizard.tsx
  EXPLANATION.md
  README.md
```


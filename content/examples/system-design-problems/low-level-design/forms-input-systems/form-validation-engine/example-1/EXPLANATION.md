# Form Validation Engine — Production-Style Implementation

Example 1 is a production-style, reusable **form validation engine** you can plug into many UI components (forms, wizards, inline editors).

It focuses on what interviewers probe at mid/senior/staff levels:

- A validator model that supports **sync + async** rules.
- **Race-cancellation** so stale async results do not overwrite newer input.
- A predictable **error shape** that can power both UI and analytics.
- A store-driven design (Zustand) with selector-friendly updates to reduce re-renders.

## Architecture Overview

The core idea: treat validation as a small “subsystem” with explicit inputs/outputs.

- `validation-engine.ts` evaluates rules and returns a normalized `ValidationResult`.
- `form-store.ts` holds values/touched/errors and coordinates async validation via tokens.
- `use-form.ts` provides the component-friendly API.

## File Structure

```
example-1/
  lib/
    types.ts
    validation-engine.ts
    form-store.ts
  hooks/
    use-form.ts
  components/
    example-form.tsx
  index.ts
  EXPLANATION.md
  README.md
```

## What to Look For

1) **Async validator cancellation**

When the user types quickly, async validators can return out-of-order (slow response for “a”, fast response for “ab”). The store assigns a monotonically increasing token per field. Only the latest token is allowed to write errors.

2) **Error normalization**

Rules can emit multiple messages (or structured codes). The engine normalizes to `{ fieldErrors, formErrors, isValid }`.

3) **Policy vs mechanism**

The engine is intentionally policy-light:

- It doesn’t decide when to validate (onChange vs onBlur). The caller/store decides.
- It doesn’t “render” errors. It only returns normalized data.

This separation keeps it reusable across UI patterns.


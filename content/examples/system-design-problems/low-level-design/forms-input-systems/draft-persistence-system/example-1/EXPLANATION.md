# Draft Persistence System — Full Implementation

Example 1 implements a draft persistence subsystem for forms/wizards.

Interview focus:
- When to persist (debounce, onBlur, background sync).
- Versioning + migration (schema changes).
- Conflict handling (multi-tab edits) and last-write-wins vs per-field merge.
- Privacy: encrypt-at-rest (at least optional), redaction, TTL.

## Approach

- `draft-store.ts` tracks `values`, `dirtyFields`, and an `etag`-like `revision`.
- `storage-adapter.ts` provides an SSR-safe localStorage adapter with TTL and versioning.
- `merge.ts` implements a conservative merge policy suitable for interview discussion.


# AI-assisted Form Fill System — Full Implementation

Example 1 sketches a production-minded AI-assisted form fill subsystem.

Interview focus:
- Where AI suggestions live in the architecture (sidecar service vs client-only).
- Privacy: redaction, least-privilege, “never send secrets”.
- Explainability + audit logs (“why was this suggested?”).
- Human-in-the-loop: suggestions must be reviewable and reversible.

## Approach

- `suggestion-engine.ts` defines an interface that supports streaming suggestions.
- `redaction.ts` prevents accidental leakage of sensitive inputs.
- `apply-suggestions.ts` applies suggestions with provenance metadata for auditability.


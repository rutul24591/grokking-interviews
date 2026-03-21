# A pragmatic frontend testing strategy

This example encodes a small but real rule set (pricing + promo + tax) behind an API route and a form.

## What “good” looks like
- **Most tests are deterministic and fast** (pure logic + component tests with mocked network).
- **A few high-value E2E tests** catch wiring issues (routing, bundling, runtime differences).
- **Shared schemas/contracts** (e.g., `zod`) reduce drift between UI and API.

## Common staff-level trade-offs
- Prefer testing **business invariants** over pixel-perfect snapshots.
- Make async UIs testable by asserting **states** (loading, error, success).
- Keep E2E focused: one or two “must never break” flows, not a full regression suite.


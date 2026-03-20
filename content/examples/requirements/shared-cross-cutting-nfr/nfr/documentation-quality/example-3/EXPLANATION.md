This example covers an advanced documentation quality check: **compile TypeScript code snippets**.

In production, broken snippets are a common failure mode:
- docs drift faster than code
- copy/paste becomes unreliable

This demo extracts ```ts blocks and uses the TypeScript compiler API in `noEmit` mode.


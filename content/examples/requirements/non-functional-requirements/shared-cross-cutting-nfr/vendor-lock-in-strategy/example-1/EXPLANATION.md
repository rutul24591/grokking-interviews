# Vendor Lock-in Strategy — what to do *in code*

Vendor lock-in typically happens when:
- business logic depends directly on a specific vendor SDK,
- vendor-specific semantics leak into your core data model,
- migrations are treated as “future problems” with no plan or tests.

This example demonstrates a pragmatic approach:

## 1) Put a hard boundary around vendor dependencies

Your domain code depends on `ObjectStore` (a small interface), not AWS/GCP/Azure libraries.
Adapters live behind that interface.

Benefits:
- “swap provider” becomes a contained refactor
- contract tests can validate behavior across providers
- you can run local/dev without cloud dependencies

## 2) Prefer portable protocols where possible

The `s3mock` adapter talks to a mock **S3-compatible** HTTP surface. In practice, this makes it easier to:
- use MinIO in dev,
- run multi-cloud,
- or migrate from AWS S3 to another compatible store.

## 3) Capabilities, not vendor leakage

Providers differ. You still need a way to express “this backend can do X”.
Instead of letting vendor features leak everywhere, expose *capabilities*:
- `presignedGet`
- `multipartUpload`

Then, keep vendor-specific flows in isolated code paths that are easy to audit.

## 4) Contract tests prevent accidental lock-in

The agent (`src/agent/run.ts`) runs the same suite against both adapters by overriding the provider via a request header.
In production, you would not allow header overrides; you would run the suite in CI with a real provider + a local provider.

## Trade-offs / production notes
- Local FS is great for dev, but not for multi-instance production (shared storage needed).
- Real S3 implementations must handle retries, backoff, timeouts, and idempotency.
- Migrations require a plan (dual-write, backfill, verification, cutover). See Example 3 for a runnable simulation.


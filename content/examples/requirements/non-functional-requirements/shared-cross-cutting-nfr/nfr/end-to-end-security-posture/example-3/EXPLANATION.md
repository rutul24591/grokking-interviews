# Why key rotation is part of security posture

Real incidents happen: keys leak, engineers leave, systems are migrated, cryptographic policy changes.
If you can’t rotate keys safely, your “security posture” is fragile.

This example demonstrates a common, production-friendly pattern:
- Tokens carry a `kid` (key identifier).
- The verifier maintains a **key set**.
- Rotation is a *process*, not an atomic switch:
  - **Overlap** prevents breaking existing sessions.
  - **TTL-aware removal** ensures old tokens naturally expire.

In production you typically combine this with:
- key management (KMS/HSM),
- strict TTLs and refresh flows,
- audit logging for key usage,
- and emergency kill-switches (revocation lists / session stores).


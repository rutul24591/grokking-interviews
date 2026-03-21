# What this example covers

Secrets management is about:

- storing secrets securely
- limiting blast radius (least privilege)
- rotating secrets without downtime
- preventing accidental leakage (logs, errors, APIs)

This example demonstrates **rotation-safe token signing**:

- keep a small key ring of active keys
- embed a `kid` (key id) in the token so verifiers can pick the right key
- rotate by adding a new key and keeping old keys for a grace window

In production you’d use KMS/HSM, secret managers, and strict audit logging.


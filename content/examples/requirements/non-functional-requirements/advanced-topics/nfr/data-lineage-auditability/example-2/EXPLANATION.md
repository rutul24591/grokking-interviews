This example focuses on the core primitive behind many auditability systems: an **append-only log** with a **hash chain**.

If someone deletes or mutates an event, verification fails because the chain no longer matches.

In production you typically combine this with:
- Write-once storage (WORM), immutable object storage, or database immutability features
- Periodic checkpoints to an external system (e.g., signed digest to a separate trust domain)
- Access controls and monitoring (tamper *resistance*), not only tamper *evidence*


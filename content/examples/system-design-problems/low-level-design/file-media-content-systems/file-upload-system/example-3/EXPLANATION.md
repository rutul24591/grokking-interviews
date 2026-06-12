# FileUploadSystem: recovery scenario

This example models the failure case where the resumed server ledger omitted a chunk that the browser previously marked complete. The recovery plan is explicit: treat the server ledger as authoritative, requeue the missing chunk, verify its checksum, and complete idempotently.

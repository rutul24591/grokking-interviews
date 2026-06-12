# FileUploadSystem: protocol scenario

This example implements the normal multipart upload transition flow. It rejects out-of-order commands, ignores duplicate revisions idempotently, and records an audit trail. The central invariant is: Complete only after the server ledger confirms every chunk checksum exactly once.

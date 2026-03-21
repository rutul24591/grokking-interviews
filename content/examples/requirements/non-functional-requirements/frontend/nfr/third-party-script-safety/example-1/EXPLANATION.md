# Third-party script safety as an NFR

Third-party code can:
- leak data,
- degrade performance,
- and break your UI.

This example uses:
- CSP (restrict script sources),
- sandboxed iframe isolation (no same-origin),
- and schema-validated postMessage communication.

The parent page forwards validated messages to `POST /api/metrics/ingest` so the server can apply its own schema/rate controls without exposing internal APIs to third-party JS.

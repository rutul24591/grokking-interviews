# Centralized logging as a backend NFR

Centralized logging makes incidents debuggable by:
- using structured (JSON) logs,
- propagating correlation ids (requestId/traceId),
- and redacting sensitive data.

This example shows correlation + redaction + query-by-requestId.


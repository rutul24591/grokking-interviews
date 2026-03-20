This example covers an advanced boundary: **log correlation + redaction**.

Observability data often includes sensitive fields (tokens, emails, IPs).
A production logger should:
- attach correlation IDs (`traceId`, `requestId`)
- redact known sensitive keys
- avoid accidentally logging large payloads


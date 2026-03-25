## Focused sub-problem: choosing a TLS policy

In production you typically decide:
- minimum TLS version
- allowed cipher suites
- whether to enable client cert auth (mTLS)

Your policy depends on:
- client fleet compatibility
- compliance requirements
- performance considerations (handshake cost)


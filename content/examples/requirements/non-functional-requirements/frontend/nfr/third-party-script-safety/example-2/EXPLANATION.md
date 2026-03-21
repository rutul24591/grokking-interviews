# Treat postMessage as untrusted input

Third-party contexts can send arbitrary messages. Validate:
- origin/source,
- schema,
- and apply strict allowlists of actions.


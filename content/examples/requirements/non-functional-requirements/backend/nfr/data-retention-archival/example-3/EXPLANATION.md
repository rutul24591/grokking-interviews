# Focus

Retention is never “just delete old data”.

Edge cases:

- **Legal holds**: keep data past TTL for investigations/litigation.
- **RTBF / deletion requests**: delete a specific user’s data even if it’s new.
- **Derived data**: delete or anonymize indexes, caches, and replicas too.

This example models hold-vs-delete precedence.


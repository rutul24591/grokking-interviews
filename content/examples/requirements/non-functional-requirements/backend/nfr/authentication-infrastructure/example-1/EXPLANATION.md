# Authentication infrastructure as a backend NFR

Auth impacts availability and latency. Typical designs:
- JWT (self-contained) for fewer dependencies, harder revocation.
- Opaque tokens + introspection for better control, more dependency and caching complexity.

This example models opaque tokens with cached introspection and explicit revocation.


## Why fallback is required in production

Federation introduces runtime dependencies:
- if `remoteEntry.js` fails to load, the UI can break

Mitigations:
- circuit breakers + cached last-known-good remoteEntry
- local fallbacks for critical UX paths
- health checks and gradual rollouts

This example is a simplified “loader” that tries remote first and falls back.


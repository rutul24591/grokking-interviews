# Explanation

This example supports Design Geolocation Permissions UX. It demonstrates the privacy-aware permission and location runtime, protects the invariant "Location access must be purpose-bound, revocable, and degraded safely when precision or permission is unavailable.", and covers the edge case where a user grants location once, moves to background, and later expects the app not to keep tracking silently. Use it to discuss browser support, permissions, cleanup, fallback UX, and observability.

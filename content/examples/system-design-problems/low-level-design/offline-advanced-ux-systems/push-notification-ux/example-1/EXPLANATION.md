# Explanation

This example supports Design Push Notification UX. It demonstrates permission and notification preference coordinator, the invariant "Notification prompts must respect user intent, privacy, and channel relevance instead of maximizing opt-in rate.", and the production edge case where a user denies permission on one device, grants it later on another, and expects account preferences to stay consistent. Use it to discuss API shape, state transitions, retry behavior, conflict handling, privacy scoping, and observability.

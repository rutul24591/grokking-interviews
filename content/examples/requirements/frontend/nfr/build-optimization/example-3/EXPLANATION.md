Build optimization often starts with product decisions:
- should this feature ship to everyone, or only some users?
- can it be isolated behind a dynamic import boundary?

This demo shows the decision boundary explicitly: when the feature is disabled, the “heavy module” is never loaded.


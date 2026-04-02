Three-way merge uses a common base to decide whether changes are compatible.

This demo implements a minimal merge:
- if one side didn’t change relative to base, take the other,
- otherwise emit conflict markers.


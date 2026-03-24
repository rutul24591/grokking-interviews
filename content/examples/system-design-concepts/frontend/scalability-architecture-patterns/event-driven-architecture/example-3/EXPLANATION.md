## Why event versioning is non-optional

In EDA, producers and consumers are decoupled, which means:
- you cannot upgrade all consumers instantly
- some clients will lag behind
- events may be replayed months later

Versioning rules of thumb:
- **Never** mutate events in place (append-only).
- Add new fields as optional first; only later enforce.
- Prefer “normalize-to-latest” at the edge of your consumer.
- Make incompatible changes by introducing a new `v` and supporting both.


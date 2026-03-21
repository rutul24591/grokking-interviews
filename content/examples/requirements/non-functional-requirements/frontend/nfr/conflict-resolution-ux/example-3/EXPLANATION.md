A common pragmatic approach is **field-level** conflict resolution:
- treat each field independently,
- pick the value with the newest timestamp (LWW),
- and show UX when fields conflict in meaningful ways.

This is not as strong as CRDT/OT, but it’s often sufficient for forms and settings.


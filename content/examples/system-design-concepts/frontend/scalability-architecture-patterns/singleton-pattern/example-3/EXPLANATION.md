## Implication for system design

Singleton works for:
- caches local to a process
- per-process connection pools

It does *not* guarantee global uniqueness across:
- multiple Node workers
- multiple containers/pods
- multiple regions

If you need global uniqueness, use:
- a database constraint
- distributed locks
- globally unique ids (UUID/ULID) with dedupe


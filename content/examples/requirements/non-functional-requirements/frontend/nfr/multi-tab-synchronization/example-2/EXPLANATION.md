# Why a TTL lease beats “last writer wins”

In the context of Multi Tab Synchronization (multi, tab, synchronization), this example provides a focused implementation of the concept below.

If you rely on a static “I am leader” flag, crashes create stuck states.

Leases with expirations provide:
- bounded time to recover from crashes,
- a natural heartbeat mechanism,
- and a way to reason about leadership without permanent locks.


## When to avoid Singleton

Avoid singleton when:
- you need deterministic tests
- you run multiple “tenants” in one process
- you need per-request scoping (auth context, locale)

Dependency injection can be simple in JS/TS: pass a `services` object.


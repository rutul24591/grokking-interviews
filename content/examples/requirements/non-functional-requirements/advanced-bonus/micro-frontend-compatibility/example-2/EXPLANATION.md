This example focuses on a common compatibility technique: a **versioned event bus** with schema validation.

Micro-frontends fail in subtle ways when:
- event names drift
- payload shapes change
- fields become optional/required

Validating events at the boundary gives you:
- early detection (fail fast)
- safe fallbacks (shims)
- a way to build a compatibility matrix


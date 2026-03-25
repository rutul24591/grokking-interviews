## Why this matters

Many systems “merge config” objects coming from:
- JSON payloads
- query params
- feature flag systems

If merges don’t filter keys like `__proto__`, you can change the prototype of objects and bypass logic.

Mitigation:
- validate input shape with a strict schema
- explicitly block dangerous keys
- avoid deep merges of untrusted data


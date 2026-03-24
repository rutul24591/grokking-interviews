## When registry-based factories help

Registry-based factories are common in:
- plugin architectures
- micro-frontends sharing extension points
- “capability” systems (payments providers, auth providers, exporters)

They trade compile-time safety for extensibility:
- you need runtime validation
- you need stable contracts + versioning


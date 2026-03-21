# What this example covers

Schema governance prevents “silent breaking changes” when multiple producers/consumers evolve independently.

This example implements a tiny schema registry with a simple compatibility rule:

- **backward compatible**: you may add optional fields, but you may not remove fields or make optional fields required

This maps to a common requirement:

> New producers must not break existing consumers.

In production, you’ll typically use a dedicated schema registry (Avro/Protobuf/JSON schema) and CI checks.


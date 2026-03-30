# LocalStorage Example 3

Production localStorage data eventually changes shape. This example shows:

- schema upgrade from v1 to v2
- fallback when persisted JSON is corrupted

The safest posture is to recover to a valid default instead of crashing app startup.


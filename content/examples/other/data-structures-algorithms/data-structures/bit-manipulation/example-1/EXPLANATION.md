Example 1 is a production-style implementation demo for this data structure.

Represents feature and permission flags as bit masks so multiple booleans fit in one compact integer.

It demonstrates:
- each flag occupies a stable bit position
- bitwise OR enables permissions and bitwise AND checks them
- compact packing is useful for hot paths and wire efficiency

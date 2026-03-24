## Why this is an advanced facade use-case

Facades frequently act as:
- a **compatibility layer** during migrations
- an **anti-corruption layer** when integrating third-party APIs

The facade can:
- accept multiple upstream versions
- map them to a stable internal contract
- enforce invariants and defaults in one place


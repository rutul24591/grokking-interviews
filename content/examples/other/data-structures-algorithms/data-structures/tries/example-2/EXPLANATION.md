Example 2 focuses on a follow-up scenario that’s commonly asked after the main implementation.

Adds prefix fan-out inspection as a follow-up so the trie example covers more than raw autocomplete lookups.

It demonstrates:
- prefix counts reflect how many words share a branch
- high fan-out prefixes can guide caching decisions
- branching structure reveals more than flat string storage

Example 1 is a production-style implementation demo for this data structure.

Implements a trie to back prefix-based autocomplete over a small dictionary of search suggestions.

It demonstrates:
- common prefixes share nodes instead of duplicating storage
- prefix traversal reaches the candidate sub-tree directly
- autocomplete is faster than scanning every whole string

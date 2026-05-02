Example 2 focuses on a follow-up scenario that’s commonly asked after the main implementation.

Shows how false positives appear once the bitset becomes crowded, which is the core operational trade-off of Bloom filters.

It demonstrates:
- more inserted keys increase collision pressure
- a positive result may still be wrong
- bitset size and hash count determine practical error rates

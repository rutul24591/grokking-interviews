In the context of Caching Consistency Strategy (caching, consistency, strategy), this example provides a focused implementation of the concept below.

This example focuses on the “versioned key” idea:
- instead of deleting cache entries, you move forward by changing the key
- avoids races where invalidation messages are lost
- trades off extra storage and “lookup needs version”


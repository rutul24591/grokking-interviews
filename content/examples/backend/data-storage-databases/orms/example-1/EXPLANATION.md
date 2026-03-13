ORMs simplify data access but can hide inefficient query patterns.
The N+1 issue happens when related data is fetched per row.
Eager loading fetches related rows in a single batch.
The demo logs query counts to show the difference.

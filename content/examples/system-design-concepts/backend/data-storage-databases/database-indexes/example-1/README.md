# Database Indexes Example

This example shows how indexes change query plans and why they speed up lookups.

## Files
- `schema.sql`: Table and indexes.
- `queries.sql`: Queries with and without index usage.
- `explain.sql`: EXPLAIN plans.

## Run
`psql -f schema.sql -f queries.sql -f explain.sql`

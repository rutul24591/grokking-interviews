# SQL Queries & Optimization Example

This example compares naive queries with optimized versions using indexes and proper filtering.

## Files
- `schema.sql`: Tables and indexes.
- `sample-data.sql`: Seed data.
- `queries.sql`: Slow vs optimized queries.
- `explain.sql`: EXPLAIN statements.

## Run
`psql -f schema.sql -f sample-data.sql -f queries.sql -f explain.sql`

# Database Partitioning Example

This example shows range and hash partitioning strategies with SQL DDL.

## Files
- `range-partition.sql`: Range partitioning by date.
- `hash-partition.sql`: Hash partitioning by tenant.
- `queries.sql`: Example queries.

## Run
`psql -f range-partition.sql -f hash-partition.sql -f queries.sql`

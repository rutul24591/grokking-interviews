# Relational Database Design Example

This example models a simple commerce domain and shows normalized tables plus a denormalized reporting view.

## Files
- `schema.sql`: 3NF schema with foreign keys.
- `sample-data.sql`: Seed data.
- `queries.sql`: Common joins and aggregations.
- `denormalized.sql`: Reporting table and sync strategy.

## Run
Use any PostgreSQL-compatible environment:
- `psql -f schema.sql`
- `psql -f sample-data.sql`
- `psql -f queries.sql`

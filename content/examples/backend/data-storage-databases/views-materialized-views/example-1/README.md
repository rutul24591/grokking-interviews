# Views & Materialized Views Example

This example contrasts a standard view with a materialized view for reporting.

## Files
- `schema.sql`: Base tables.
- `views.sql`: View and materialized view.
- `refresh.sql`: Refresh commands.

## Run
`psql -f schema.sql -f views.sql -f refresh.sql`

# Triggers Example

This example uses a trigger to keep an audit table in sync.

## Files
- `schema.sql`: Tables.
- `trigger.sql`: Trigger function and trigger.
- `usage.sql`: Example insert.

## Run
`psql -f schema.sql -f trigger.sql -f usage.sql`

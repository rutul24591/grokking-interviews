# API Design Best Practices Example

This mini API showcases pagination, filtering, sorting, and a consistent error model on a realistic collection endpoint.

## Files
- `server.js`: API server with query handling.
- `pagination.js`: Cursor-based pagination helpers.
- `filters.js`: Filter and sort utilities.
- `errors.js`: Standard error envelope.
- `client.js`: Example requests.

## Run
1. `node content/examples/backend/fundamentals-building-blocks/api-design-best-practices/example-1/server.js`
2. `node content/examples/backend/fundamentals-building-blocks/api-design-best-practices/example-1/client.js`

## Example Queries
- `GET /orders?limit=3`
- `GET /orders?limit=3&cursor=3`
- `GET /orders?status=shipped&minTotal=100&sort=total:desc`

# REST API Design Example

This example provides a small REST API for books. It highlights resource naming, HTTP verbs, status codes, and a consistent error envelope.

## Files
- `server.js`: HTTP server wiring and route table.
- `router.js`: Simple router with path params.
- `handlers.js`: CRUD handlers for the `books` resource.
- `validation.js`: Input validation for request payloads.
- `client.js`: Example client calls.

## Run
1. `node content/examples/backend/fundamentals-building-blocks/rest-api-design/example-1/server.js`
2. `node content/examples/backend/fundamentals-building-blocks/rest-api-design/example-1/client.js`

## What to look for
- `GET /books` returns a collection.
- `POST /books` creates a resource and returns `201` with a Location header.
- `GET /books/:id` returns a single resource or `404`.
- Errors always follow `{ error: { code, message, details } }`.

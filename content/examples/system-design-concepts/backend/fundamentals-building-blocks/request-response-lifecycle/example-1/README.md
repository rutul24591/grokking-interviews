# Request/Response Lifecycle Example

This example traces a request through middleware, validation, handler, and response serialization. It shows timing and error handling in the pipeline.

## Files
- `server.js`: HTTP server with middleware pipeline.
- `middleware.js`: Logging, auth, validation.
- `handler.js`: Core business logic.
- `client.js`: Sends requests.

## Run
1. `node content/examples/backend/fundamentals-building-blocks/request-response-lifecycle/example-1/server.js`
2. `node content/examples/backend/fundamentals-building-blocks/request-response-lifecycle/example-1/client.js`

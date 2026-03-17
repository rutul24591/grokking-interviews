# Stateless vs Stateful Services Example

This example compares a stateful session server with a stateless token-based server. It highlights scaling implications and failure behavior.

## Files
- `stateful-server.js`: In-memory sessions (stateful).
- `stateless-server.js`: Signed token sessions (stateless).
- `client.js`: Exercises both servers.

## Run
1. `node content/examples/backend/fundamentals-building-blocks/stateless-vs-stateful-services/example-1/stateful-server.js`
2. `node content/examples/backend/fundamentals-building-blocks/stateless-vs-stateful-services/example-1/stateless-server.js`
3. `node content/examples/backend/fundamentals-building-blocks/stateless-vs-stateful-services/example-1/client.js`

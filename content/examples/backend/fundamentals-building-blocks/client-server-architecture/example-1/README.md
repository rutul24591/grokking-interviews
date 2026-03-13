# Client-Server Architecture Example

This mini app shows a clear client/server boundary with a small service layer and repository. It highlights the request/response contract and shows the difference between stateless and stateful behavior.

## Files
- `server.js`: HTTP server exposing the API contract.
- `protocol.js`: shared response helpers and error shape.
- `service.js`: business logic layer.
- `repository.js`: in-memory data store abstraction.
- `client.js`: example client calls.

## Run
1. `node content/examples/backend/fundamentals-building-blocks/client-server-architecture/example-1/server.js`
2. In another terminal: `node content/examples/backend/fundamentals-building-blocks/client-server-architecture/example-1/client.js`

## What to look for
- The client only talks through HTTP. It never reaches internal service/repository code.
- The server stays mostly stateless for item operations, but exposes a stateful session endpoint to show the tradeoff.
- Error responses follow a consistent shape.

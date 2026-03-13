# HTTP/HTTPS Protocol Example

This example contrasts a plain HTTP server with an HTTPS server using a self-signed certificate. It also shows the raw request/response flow from a small client.

## Files
- `http-server.js`: Basic HTTP server and route handling.
- `https-server.js`: HTTPS server using TLS certificates.
- `client.js`: Makes HTTP and HTTPS requests and prints responses.
- `generate-cert.sh`: Helper to create a local self-signed cert.

## Run (HTTP)
1. `node content/examples/backend/fundamentals-building-blocks/http-https-protocol/example-1/http-server.js`
2. `node content/examples/backend/fundamentals-building-blocks/http-https-protocol/example-1/client.js`

## Run (HTTPS)
1. Generate a local cert:
   `sh content/examples/backend/fundamentals-building-blocks/http-https-protocol/example-1/generate-cert.sh`
2. Start HTTPS server:
   `node content/examples/backend/fundamentals-building-blocks/http-https-protocol/example-1/https-server.js`
3. Re-run the client to call the HTTPS endpoint.

## Notes
- The HTTPS client disables certificate verification for local testing only.
- In real systems, never disable TLS verification in production.

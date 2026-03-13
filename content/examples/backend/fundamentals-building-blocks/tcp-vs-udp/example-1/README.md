# TCP vs UDP Example

This example compares a reliable TCP echo server with a UDP message listener. It highlights connection setup, ordering, and delivery guarantees.

## Files
- `tcp-server.js`: TCP server with connection lifecycle.
- `udp-server.js`: UDP server receiving datagrams.
- `client.js`: Sends messages over both protocols.

## Run
1. `node content/examples/backend/fundamentals-building-blocks/tcp-vs-udp/example-1/tcp-server.js`
2. `node content/examples/backend/fundamentals-building-blocks/tcp-vs-udp/example-1/udp-server.js`
3. `node content/examples/backend/fundamentals-building-blocks/tcp-vs-udp/example-1/client.js`

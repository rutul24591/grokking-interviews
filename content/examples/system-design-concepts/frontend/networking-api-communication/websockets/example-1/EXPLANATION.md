# What this example shows

This app demonstrates the standard WebSocket model:

- the browser upgrades an HTTP connection
- the server keeps a full-duplex channel open
- both sides can exchange messages without request-response pairing

This is the right fit for collaborative editing, chat, and presence systems.

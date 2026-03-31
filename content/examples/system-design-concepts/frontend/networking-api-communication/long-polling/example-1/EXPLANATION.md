# What this example shows

This app demonstrates long polling for frontend notification delivery:

- the client keeps exactly one request open
- the server waits until a new event arrives or a timeout expires
- the client immediately opens the next request

This is the typical fallback when you want near-real-time updates but do not want the operational cost of WebSockets.

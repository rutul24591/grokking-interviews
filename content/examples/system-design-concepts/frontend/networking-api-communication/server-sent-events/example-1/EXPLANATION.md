# What this example shows

This app demonstrates the standard SSE path:

- browser opens an `EventSource`
- server keeps the HTTP connection open
- updates arrive as newline-delimited events

It is a good fit for one-way streams like notifications or status updates.

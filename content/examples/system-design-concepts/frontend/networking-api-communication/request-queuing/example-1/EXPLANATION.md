# What this example shows

This app demonstrates the main request-queuing pattern:

- the client emits work items quickly
- the server enforces bounded concurrency
- backlog is visible instead of hidden behind timeouts

This is the pattern used when bursts must be absorbed without overloading upstream services.

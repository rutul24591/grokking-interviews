# Consent UX is only half the problem

The UI banner is necessary, but it’s not sufficient. You need enforcement at the “data boundary”:

- analytics collection endpoints must reject events without consent,
- third-party scripts must not load unless allowed,
- and you need deterministic state (versioned cookie) for caching and experiments.

This example sets a versioned consent cookie and uses middleware to surface consent as request headers for API routes.


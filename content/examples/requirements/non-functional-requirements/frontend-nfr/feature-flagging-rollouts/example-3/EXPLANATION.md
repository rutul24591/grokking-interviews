In the context of Feature Flagging Rollouts (feature, flagging, rollouts), this example provides a focused implementation of the concept below.

When flags are distributed to clients, integrity matters. A common pattern is:
- serialize a config payload,
- sign with HMAC,
- enforce a TTL to limit replay/staleness.

This demo implements a minimal signed payload flow.


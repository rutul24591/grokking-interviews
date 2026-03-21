# Key rotation

In the context of Authentication Infrastructure (authentication, infrastructure), this example provides a focused implementation of the concept below.

Rotation requires:
- tokens carry a key id (`kid`),
- verifiers keep a set of active + previous keys,
- and you retire old keys after max token TTL.

This is foundational for JWT/JWS style systems.


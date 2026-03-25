## Why JWT validation needs more than “decode”

Common mistakes:
- decoding without verifying signature
- skipping `iss` / `aud` checks
- accepting expired tokens

This demo uses an HMAC-signed JWT-like structure to focus on the logic. Production JWTs often use asymmetric keys (RS256/ES256).


## Focused sub-problem: canonical forms

Without normalization, two strings can look identical to users but compare differently.
This causes bugs in:
- auth/ACL checks
- dedupe keys
- caching

Canonicalization strategy depends on your domain; don’t normalize blindly for all inputs.


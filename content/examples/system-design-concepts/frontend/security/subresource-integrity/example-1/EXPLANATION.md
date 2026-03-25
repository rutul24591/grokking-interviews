## What SRI does

SRI allows you to pin a subresource to an expected hash:
- if the content changes (tampered CDN, compromised third-party), the browser refuses to execute it.

SRI is commonly used for:
- third-party scripts/styles from CDNs
- critical assets where integrity matters

Trade-offs:
- upgrades require updating the hash
- dynamic content (runtime generated) doesn’t fit well
- needs disciplined build/release workflows


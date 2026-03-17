This DNS simulator models zones and records without external network calls.
The resolver checks a TTL cache before walking the zone hierarchy.
CNAME records redirect the resolver to another name until an A record is found.
TXT records demonstrate how DNS is used for configuration and verification.
Caching illustrates why TTL matters for performance and update propagation.

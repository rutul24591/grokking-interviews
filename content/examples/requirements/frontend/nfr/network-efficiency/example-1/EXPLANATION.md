# Network efficiency: avoid bytes and avoid amplification

The biggest wins tend to be:

- **Don’t download unchanged data:** ETags allow revalidation with `304 Not Modified`.
- **Don’t multiply identical work:** in-flight request dedupe prevents UI waterfalls turning into backend load.
- **Don’t amplify incidents:** bounded timeouts and retry budgets (see Example 3) prevent retry storms.

This example keeps the server simple and pushes efficiency to the client + cache headers.


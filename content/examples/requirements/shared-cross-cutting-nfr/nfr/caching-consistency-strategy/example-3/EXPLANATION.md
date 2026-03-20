This example covers an advanced cache scaling issue: **stampedes**.

Many concurrent requests missing the cache can overload the DB.
Singleflight (request coalescing) ensures only one request populates the cache.


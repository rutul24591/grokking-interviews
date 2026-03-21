In the context of Client Edge Caching (client, edge, caching), this example provides a focused implementation of the concept below.

If responses vary by request headers (language, encoding, device), caches must incorporate those dimensions into their cache key and emit correct `Vary` headers. Otherwise, you can serve the wrong variant to users.


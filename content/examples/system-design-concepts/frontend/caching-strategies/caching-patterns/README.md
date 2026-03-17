# Caching Patterns Examples (Cache-First, Network-First, Network-Only)

## Example 1: Workbox Strategies Configuration

```javascript
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
  CacheOnly,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Cache-First: fonts, images, static assets
registerRoute(
  ({ request }) =>
    request.destination === 'font' ||
    request.destination === 'image',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Network-First: API calls, dynamic content
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3, // Fallback to cache after 3s
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 5 * 60 }),
    ],
  })
);

// Stale-While-Revalidate: CSS, JS bundles
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'dynamic-assets',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// Network-Only: POST requests, auth endpoints
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/auth/'),
  new NetworkOnly()
);

// Cache-Only: precached app shell
registerRoute(
  ({ url }) => url.pathname === '/app-shell',
  new CacheOnly({
    cacheName: 'precache',
  })
);
```

## Example 2: Manual Cache-First Implementation

```javascript
async function cacheFirst(request, cacheName = 'default') {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached; // Cache hit - return immediately
  }

  // Cache miss - fetch from network
  const response = await fetch(request);

  if (response.ok) {
    cache.put(request, response.clone());
  }

  return response;
}
```

## Example 3: Network-First with Timeout Fallback

```javascript
async function networkFirst(request, cacheName = 'default', timeout = 3000) {
  const cache = await caches.open(cacheName);

  try {
    // Race between network and timeout
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), timeout)
      ),
    ]);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch {
    // Network failed or timed out - try cache
    const cached = await cache.match(request);
    if (cached) return cached;

    // No cache either - return offline page
    return caches.match('/offline.html');
  }
}
```

## Example 4: Strategy Selection Helper

```javascript
function getStrategy(request) {
  const url = new URL(request.url);

  // Static assets with hash → Cache-First (immutable)
  if (/\.[a-f0-9]{8,}\.(js|css|woff2?)$/.test(url.pathname)) {
    return 'cache-first';
  }

  // API data → Network-First
  if (url.pathname.startsWith('/api/')) {
    return 'network-first';
  }

  // Auth/payment → Network-Only
  if (url.pathname.startsWith('/auth/') || url.pathname.startsWith('/checkout/')) {
    return 'network-only';
  }

  // Everything else → Stale-While-Revalidate
  return 'stale-while-revalidate';
}
```

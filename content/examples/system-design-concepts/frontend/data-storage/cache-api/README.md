# Cache API Examples

## Example 1: Basic Cache Operations

```javascript
// Open a named cache
const cache = await caches.open('my-app-v1');

// Cache a response
await cache.put('/api/data', new Response(JSON.stringify({ items: [] }), {
  headers: { 'Content-Type': 'application/json' },
}));

// Cache from network
await cache.add('/styles/main.css');
await cache.addAll(['/app.js', '/offline.html', '/manifest.json']);

// Retrieve from cache
const response = await cache.match('/api/data');
if (response) {
  const data = await response.json();
}

// Delete from cache
await cache.delete('/api/data');

// List all cached URLs
const keys = await cache.keys();
keys.forEach(request => console.log(request.url));
```

## Example 2: Cache Versioning and Cleanup

```javascript
const CACHE_VERSION = 'v3';
const CACHES = {
  static: `static-${CACHE_VERSION}`,
  api: `api-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`,
};

// In Service Worker activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      const validCaches = Object.values(CACHES);
      return Promise.all(
        cacheNames
          .filter(name => !validCaches.includes(name))
          .map(name => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
});
```

## Example 3: Runtime Caching with Fallback

```javascript
async function fetchWithCache(request, cacheName, maxAge = 3600000) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    const dateHeader = cached.headers.get('sw-cache-date');
    const cacheAge = Date.now() - new Date(dateHeader).getTime();

    if (cacheAge < maxAge) {
      return cached; // Fresh enough
    }
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const clone = response.clone();
      const headers = new Headers(clone.headers);
      headers.set('sw-cache-date', new Date().toISOString());

      const cachedResponse = new Response(await clone.blob(), {
        status: clone.status,
        statusText: clone.statusText,
        headers,
      });
      await cache.put(request, cachedResponse);
    }
    return response;
  } catch {
    return cached || new Response('Offline', { status: 503 });
  }
}
```

## Example 4: Precaching App Shell

```javascript
const APP_SHELL = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/offline.html',
  '/icons/icon-192.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHES.static).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});
```

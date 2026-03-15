# Service Workers Examples

## Example 1: Basic Registration and Lifecycle

```javascript
// main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(reg => {
      console.log('SW registered, scope:', reg.scope);

      // Check for updates every 60 seconds
      setInterval(() => reg.update(), 60000);
    })
    .catch(err => console.error('SW registration failed:', err));
}

// sw.js
self.addEventListener('install', (event) => {
  console.log('SW installing...');
  event.waitUntil(
    caches.open('static-v1').then(cache =>
      cache.addAll(['/app.js', '/styles.css', '/offline.html'])
    )
  );
});

self.addEventListener('activate', (event) => {
  console.log('SW activating...');
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.filter(n => n !== 'static-v1').map(n => caches.delete(n))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
```

## Example 2: Cache-First with Network Fallback

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached, but also update cache in background
        event.waitUntil(
          fetch(event.request).then(networkResponse => {
            if (networkResponse.ok) {
              caches.open('dynamic-v1').then(cache =>
                cache.put(event.request, networkResponse)
              );
            }
          }).catch(() => {})
        );
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        if (networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open('dynamic-v1').then(cache =>
            cache.put(event.request, clone)
          );
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});
```

## Example 3: Network-First Strategy

```javascript
async function networkFirst(request, cacheName, timeout = 3000) {
  const cache = await caches.open(cacheName);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const networkResponse = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirst(event.request, 'api-cache'));
  }
});
```

## Example 4: Message Passing Between Page and SW

```javascript
// main.js — send message to SW
async function sendToSW(message) {
  const registration = await navigator.serviceWorker.ready;
  registration.active.postMessage(message);
}

// Listen for messages from SW
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_UPDATED') {
    console.log('Cache updated for:', event.data.url);
  }
});

// sw.js — receive and respond
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'GET_CACHE_SIZE') {
    caches.keys().then(async names => {
      let total = 0;
      for (const name of names) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        total += keys.length;
      }
      event.source.postMessage({ type: 'CACHE_SIZE', count: total });
    });
  }
});
```

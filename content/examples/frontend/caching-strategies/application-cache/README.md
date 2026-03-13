# Application Cache (AppCache) Examples

## Example 1: AppCache Manifest File (Deprecated)

```
CACHE MANIFEST
# v1.0.0 - 2015-03-15

# Explicitly cached resources
CACHE:
/index.html
/styles/main.css
/scripts/app.js
/images/logo.png
/fonts/roboto.woff2

# Resources that require network
NETWORK:
/api/
https://analytics.example.com/

# Fallback pages for offline
FALLBACK:
/ /offline.html
/images/ /images/placeholder.png
```

## Example 2: HTML with AppCache (Deprecated)

```html
<!-- The manifest attribute triggers AppCache -->
<!DOCTYPE html>
<html manifest="app.appcache">
<head>
  <title>My App</title>
</head>
<body>
  <script>
    // Check for updates
    if (window.applicationCache) {
      const appCache = window.applicationCache;

      appCache.addEventListener('updateready', () => {
        if (appCache.status === appCache.UPDATEREADY) {
          appCache.swapCache();
          if (confirm('New version available. Reload?')) {
            window.location.reload();
          }
        }
      });

      // Force update check
      try {
        appCache.update();
      } catch (e) {
        console.log('AppCache not supported or failed');
      }
    }
  </script>
</body>
</html>
```

## Example 3: Migration from AppCache to Service Worker

```javascript
// Step 1: Detect AppCache usage
function hasAppCache() {
  return document.documentElement.hasAttribute('manifest');
}

// Step 2: Register Service Worker alongside AppCache
if ('serviceWorker' in navigator) {
  // Service Worker takes precedence over AppCache when both present
  navigator.serviceWorker.register('/sw.js').then((reg) => {
    console.log('SW registered, AppCache will be ignored');
  });
}

// Step 3: Service Worker equivalent of the manifest above
// sw.js
const CACHE_NAME = 'app-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/images/logo.png',
  '/fonts/roboto.woff2',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first for API calls (replaces NETWORK section)
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // Cache-first for static assets (replaces CACHE section)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => {
        // Fallback (replaces FALLBACK section)
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

// Step 4: Remove manifest attribute after migration
// Remove: <html manifest="app.appcache">
// Change to: <html>
```

## Example 4: AppCache Status Detection

```javascript
function getAppCacheStatus() {
  if (!window.applicationCache) return 'unsupported';

  const statusMap = {
    0: 'UNCACHED',
    1: 'IDLE',
    2: 'CHECKING',
    3: 'DOWNLOADING',
    4: 'UPDATEREADY',
    5: 'OBSOLETE',
  };

  return statusMap[window.applicationCache.status] || 'unknown';
}

// Monitor all AppCache events
const events = [
  'cached', 'checking', 'downloading',
  'error', 'noupdate', 'obsolete',
  'progress', 'updateready',
];

events.forEach((event) => {
  window.applicationCache?.addEventListener(event, (e) => {
    console.log(`AppCache event: ${event}`, e);
  });
});
```

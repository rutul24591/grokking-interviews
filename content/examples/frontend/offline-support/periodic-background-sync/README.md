# Periodic Background Sync Examples

## Example 1: Register Periodic Sync

```javascript
async function registerPeriodicSync() {
  const registration = await navigator.serviceWorker.ready;

  // Check if periodic sync is supported
  if (!('periodicSync' in registration)) {
    console.log('Periodic Sync not supported — falling back to polling');
    return startPollingFallback();
  }

  // Check permission
  const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
  if (status.state !== 'granted') {
    console.log('Periodic Sync permission not granted');
    return startPollingFallback();
  }

  try {
    await registration.periodicSync.register('refresh-news', {
      minInterval: 12 * 60 * 60 * 1000, // 12 hours
    });
    console.log('Periodic sync registered');
  } catch (err) {
    console.error('Periodic sync registration failed:', err);
    startPollingFallback();
  }
}

// List and manage registrations
async function listPeriodicSyncs() {
  const registration = await navigator.serviceWorker.ready;
  const tags = await registration.periodicSync.getTags();
  console.log('Active periodic syncs:', tags);
  return tags;
}

async function unregisterPeriodicSync(tag) {
  const registration = await navigator.serviceWorker.ready;
  await registration.periodicSync.unregister(tag);
}
```

## Example 2: Handle Periodic Sync in Service Worker

```javascript
// sw.js
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'refresh-news') {
    event.waitUntil(refreshNewsContent());
  }

  if (event.tag === 'update-weather') {
    event.waitUntil(refreshWeatherData());
  }
});

async function refreshNewsContent() {
  try {
    const response = await fetch('/api/news/latest');
    if (!response.ok) return;

    const articles = await response.json();

    // Cache the API response
    const cache = await caches.open('news-content');
    await cache.put('/api/news/latest', new Response(JSON.stringify(articles), {
      headers: {
        'Content-Type': 'application/json',
        'X-Cached-At': new Date().toISOString(),
      },
    }));

    // Also cache individual article pages
    for (const article of articles.slice(0, 5)) {
      const articleResponse = await fetch(`/articles/${article.slug}`);
      if (articleResponse.ok) {
        await cache.put(`/articles/${article.slug}`, articleResponse);
      }
    }
  } catch {
    // Sync failed — browser will retry at next interval
  }
}
```

## Example 3: Polling Fallback for Unsupported Browsers

```javascript
function startPollingFallback() {
  // Only poll when the page is visible
  let intervalId = null;

  function startPolling() {
    if (intervalId) return;
    intervalId = setInterval(async () => {
      try {
        const response = await fetch('/api/news/latest');
        if (response.ok) {
          const data = await response.json();
          updateNewsUI(data);
        }
      } catch {
        // Offline — skip this interval
      }
    }, 5 * 60 * 1000); // 5 minutes when visible
  }

  function stopPolling() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      startPolling();
    } else {
      stopPolling();
    }
  });

  if (document.visibilityState === 'visible') {
    startPolling();
  }
}

// React hook version
function usePeriodicRefresh(url, interval = 300000) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function refresh() {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (res.ok) setData(await res.json());
      } catch {}
    }

    refresh(); // Initial fetch
    const id = setInterval(refresh, interval);

    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, [url, interval]);

  return data;
}
```

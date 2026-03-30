const VERSION = 'cache-demo-v1';
const RUNTIME = `runtime-${VERSION}`;
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(RUNTIME));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== RUNTIME).map((key) => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  if (new URL(event.request.url).pathname !== '/api/time') return;
  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME);
    try {
      const network = await fetch(event.request);
      const clone = network.clone();
      await cache.put(event.request, clone);
      const headers = new Headers(network.headers);
      headers.set('x-cache-source', 'network');
      return new Response(await network.text(), { status: network.status, headers });
    } catch {
      const cached = await cache.match(event.request);
      if (!cached) return new Response('offline-miss', { status: 503, headers: { 'x-cache-source': 'miss' } });
      const headers = new Headers(cached.headers);
      headers.set('x-cache-source', 'cache');
      return new Response(await cached.text(), { status: cached.status, headers });
    }
  })());
});

/* eslint-disable no-restricted-globals */

const VERSION = "v1";
const STATIC_CACHE = `static-${VERSION}`;
const API_CACHE = `api-${VERSION}`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(["/offline"]);
      self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== API_CACHE)
          .map((k) => caches.delete(k)),
      );
      self.clients.claim();
    })(),
  );
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((res) => {
      if (res && res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);
  return cached || (await fetchPromise) || new Response(JSON.stringify({ notes: [], version: 0 }), { status: 200 });
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Offline fallback for navigations.
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(event.request);
        } catch {
          const cache = await caches.open(STATIC_CACHE);
          return (await cache.match("/offline")) || new Response("offline", { status: 200 });
        }
      })(),
    );
    return;
  }

  // Cache API reads; never cache writes.
  if (url.pathname === "/api/notes" && event.request.method === "GET") {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }
});


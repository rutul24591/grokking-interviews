/* eslint-disable no-restricted-globals */
const VERSION = "sw-demo-v1";
const APP_SHELL_CACHE = `sw-shell-${VERSION}`;
const RUNTIME_CACHE = `sw-runtime-${VERSION}`;

const APP_SHELL_URLS = ["/", "/offline"];

async function withSource(res, source) {
  const clone = res.clone();
  const body = await clone.arrayBuffer();
  const headers = new Headers(clone.headers);
  headers.set("x-sw-source", source);
  return new Response(body, { status: clone.status, statusText: clone.statusText, headers });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_SHELL_CACHE);
      await cache.addAll(APP_SHELL_URLS);
      // Don’t skipWaiting automatically in production: keep "waiting" until safe.
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith("sw-") && !k.endsWith(VERSION)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (data.type === "CLEAR_CACHES") {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => k.startsWith("sw-")).map((k) => caches.delete(k)));
      })(),
    );
    return;
  }
  if (data.type === "GET_CACHE_STATS" && event.ports?.[0]) {
    event.waitUntil(
      (async () => {
        const names = await caches.keys();
        let totalEntries = 0;
        for (const name of names) {
          if (!name.startsWith("sw-")) continue;
          const cache = await caches.open(name);
          const keys = await cache.keys();
          totalEntries += keys.length;
        }
        event.ports[0].postMessage({ cacheNames: names.filter((n) => n.startsWith("sw-")), totalEntries });
      })(),
    );
  }
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((res) => {
      if (res && res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);

  return cached ? withSource(cached, "cache") : (await networkPromise) ? withSource(await networkPromise, "network") : new Response("Offline", { status: 503 });
}

async function networkFirstApi(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const res = await fetch(request);
    if (res && res.ok) cache.put(request, res.clone());
    return withSource(res, "network");
  } catch {
    const cached = await cache.match(request);
    if (cached) return withSource(cached, "cache");
    return new Response("Offline", { status: 503, headers: { "x-sw-source": "miss" } });
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          const cache = await caches.open(APP_SHELL_CACHE);
          return (await cache.match("/offline")) || new Response("Offline", { status: 503 });
        }
      })(),
    );
    return;
  }

  if (url.pathname.startsWith("/api/time")) {
    event.respondWith(networkFirstApi(request));
    return;
  }

  if (["style", "script", "image", "font"].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});


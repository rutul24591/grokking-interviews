/* eslint-disable no-restricted-globals */
const VERSION = "pwa-v1";
const APP_SHELL_CACHE = `app-shell-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const APP_SHELL_URLS = ["/", "/offline", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_SHELL_CACHE);
      await cache.addAll(APP_SHELL_URLS);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(k)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
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

  return cached || (await networkPromise) || new Response("Offline", { status: 503 });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  if (!isSameOrigin) return;

  // Navigation requests: network-first with offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(request);
          return res;
        } catch {
          const cache = await caches.open(APP_SHELL_CACHE);
          const offline = await cache.match("/offline");
          return offline || new Response("Offline", { status: 503 });
        }
      })(),
    );
    return;
  }

  // Static assets: SWR.
  if (["style", "script", "image", "font"].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});


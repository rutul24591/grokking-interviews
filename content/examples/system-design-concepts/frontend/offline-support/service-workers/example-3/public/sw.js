/* eslint-disable no-restricted-globals */
const VERSION = "tabs-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      // Wait until a tab decides it is safe to activate.
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SKIP_WAITING") self.skipWaiting();
  if (data.type === "GET_VERSION" && event.ports?.[0]) event.ports[0].postMessage({ version: VERSION });
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});


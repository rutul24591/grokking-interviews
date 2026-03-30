/* eslint-disable no-restricted-globals */
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "refresh-feed") {
    event.waitUntil(fetch("/api/feed?reason=periodic-sync", { cache: "no-store" }).catch(() => null));
  }
});

self.addEventListener("fetch", () => {
  // No fetch override needed; this SW exists to demonstrate registration + periodicsync handling.
});


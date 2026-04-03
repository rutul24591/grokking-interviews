"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-service-workers",
  title: "Service Workers",
  description:
    "Comprehensive guide to Service Workers covering offline support, caching strategies, background sync, push notifications, lifecycle management, and production-scale PWA implementation patterns.",
  category: "frontend",
  subcategory: "browser-apis",
  slug: "service-workers",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "browser API",
    "service workers",
    "PWA",
    "offline",
    "caching",
  ],
  relatedTopics: [
    "web-workers",
    "app-like-experience-pwa",
    "mobile-performance-optimization",
  ],
};

export default function ServiceWorkersArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Service Workers</strong> are a type of Web Worker that acts as a network proxy between the web application and the network. They run in the background, separate from the web page, and can intercept network requests, cache responses, and enable offline functionality. Service Workers are the foundation of Progressive Web Apps (PWAs), enabling offline support, background sync, push notifications, and reliable performance even on unreliable networks.
        </p>
        <p>
          For staff-level engineers, Service Workers represent a shift from online-only web apps to reliable, offline-capable applications. Before Service Workers, web apps required network connectivity — if the network was unavailable or unreliable, the app was unusable. Service Workers enable caching strategies (cache-first, network-first, stale-while-revalidate) that allow apps to work offline or on unreliable networks. Background sync enables actions to complete when the network returns (e.g., form submission, data sync). Push notifications enable re-engagement even when the app is closed.
        </p>
        <p>
          Service Workers involve several technical considerations. Lifecycle includes install (first install or update), activate (old Service Worker removed, new one takes control), fetch (intercept requests), with careful update handling (new Service Worker waits until all tabs closed before activating). Scope determines which URLs the Service Worker controls (path where registered, e.g., /sw.js controls all URLs under /). HTTPS requirement — Service Workers require secure context (HTTPS or localhost), cannot be used on HTTP sites. Caching uses Cache API for storing Request/Response pairs, IndexedDB for structured data.
        </p>
        <p>
          The business case for Service Workers is reliability and engagement. Offline support means users can access content without network (critical for users on unreliable networks, traveling, or in areas with poor connectivity). Background sync means actions complete when network returns (users can submit forms offline, sync when online). Push notifications re-engage users (bring users back to app with timely notifications). Fast loading from cache improves retention (users leave if page takes more than 3 seconds to load). For content sites, e-commerce, news apps — Service Workers are essential for modern web experience.
        </p>
        <p>
          However, Service Workers add complexity (lifecycle management, cache invalidation, update handling) and require careful implementation to avoid common pitfalls (serving stale content, broken updates, cache bloat). Service Workers are not a silver bullet — they require thoughtful caching strategies, careful update handling, and proper error handling to provide a good user experience.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Lifecycle:</strong> Service Workers have a specific lifecycle: install (first install or update — cache static assets, prepare for activation), activate (old Service Worker removed, new one takes control — clean old caches, take control of pages), fetch (intercept requests — serve from cache or network). Careful update handling is essential — new Service Worker waits until all tabs using old Service Worker are closed before activating, to avoid breaking pages mid-session. Use skipWaiting() to force immediate activation (use with caution, may break pages mid-session).
          </li>
          <li>
            <strong>Registration:</strong> navigator.serviceWorker.register(&apos;/sw.js&apos;) registers the Service Worker. Scope determines which URLs the Service Worker controls (path where registered, e.g., /sw.js controls all URLs under /, /app/sw.js controls all URLs under /app/). Register on page load (Service Worker installs in background, does not block page load). Registration returns a promise that resolves when Service Worker is registered (not when it is active — activation happens later, after install and activate phases).
          </li>
          <li>
            <strong>Fetch Interception:</strong> Service Worker listens to fetch events (every network request from pages under its scope). Can respond from cache (cache-first), network (network-first), or combination (stale-while-revalidate). Enables offline support (serve cached content when network is unavailable), custom caching strategies (different strategies for different resource types), performance optimization (serve from cache for fast loading). Fetch event handler receives FetchEvent object with request property (the Request object being fetched), respondWith method (to provide custom response).
          </li>
          <li>
            <strong>Cache API:</strong> Store Request/Response pairs in named caches. caches.open(&apos;v1&apos;) opens or creates a cache. cache.put(request, response) stores a response for a request. cache.match(request) retrieves a cached response for a request. cache.delete(request) deletes a cached response. caches.delete(&apos;v1&apos;) deletes an entire cache. Cache API is separate from HTTP cache (browser&apos;s built-in cache) — Cache API gives you full control over what is cached and for how long.
          </li>
          <li>
            <strong>Background Sync:</strong> Queue requests when offline, replay when online. registration.sync.register(&apos;sync-tag&apos;) registers a sync event with a tag. Service Worker receives sync event when network is available (even if app is closed). Sync event handler can replay queued requests (e.g., submit form data, sync local changes). This pattern enables offline-first apps — users can submit forms offline, sync when online.
          </li>
          <li>
            <strong>Push Notifications:</strong> Receive push messages even when app is closed. registration.pushManager.subscribe() subscribes to push notifications (requires user permission). Service Worker receives push event (even when app is closed), shows notification with self.registration.showNotification(). This pattern enables re-engagement — bring users back to app with timely notifications (messages, alerts, updates).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/service-worker-lifecycle.svg"
          alt="Service Worker Lifecycle showing install, activate, and fetch phases with update handling"
          caption="Service Worker lifecycle — install (cache assets), activate (clean old caches), fetch (intercept requests); new Service Worker waits until tabs closed before activating"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Service Workers architecture consists of registration (page registers Service Worker), lifecycle (install, activate), and fetch handling (intercept requests, serve from cache or network). The architecture must handle updates carefully (new Service Worker waits until all tabs closed before activating), cache management (version caches, clean old caches on activate), and offline fallbacks (serve fallback page when network is unavailable and content is not cached).
        </p>
        <p>
          The Service Worker runs in a separate thread from the main JavaScript thread, which means it does not block the main thread. The Service Worker can intercept network requests and serve responses from cache or network, enabling offline support and performance optimization. The Service Worker can also receive push notifications and background sync events, enabling re-engagement and offline-first functionality.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/caching-strategies.svg"
          alt="Caching Strategies showing cache-first, network-first, stale-while-revalidate, and cache-only patterns"
          caption="Caching strategies — cache-first (offline-first), network-first (fresh when online), stale-while-revalidate (fast + fresh), cache-only (offline only)"
          width={900}
          height={500}
        />

        <h3>Caching Strategies</h3>
        <p>
          <strong>Cache-First (Cache Falling Back to Network):</strong> Try cache first, fall back to network if not in cache. Best for: static assets (JS, CSS, images) that do not change frequently. Offline-first — works offline if content is cached. Fast loading — serves from cache instantly. Limitations: may serve stale content (if content changes but is not updated in cache). Use for assets that are versioned (e.g., app.js?v=1.0, so new version gets new URL and is cached separately).
        </p>
        <p>
          <strong>Network-First (Network Falling Back to Cache):</strong> Try network first, fall back to cache if network fails. Best for: dynamic content (API responses, HTML pages) that changes frequently. Fresh when online — always serves latest content from network. Works offline — falls back to cache if network is unavailable. Limitations: slower loading when online (must wait for network before falling back to cache). Use for content that must be fresh (e.g., API responses, HTML pages).
        </p>
        <p>
          <strong>Stale-While-Revalidate:</strong> Serve cache immediately, update cache in background. Best for: frequently updated content (news feeds, social media feeds) where users want fast loading but also want fresh content. Fast — serves from cache instantly. Eventually fresh — updates cache in background, next request gets fresh content. Limitations: serves stale content on first request (content may be slightly outdated). Use for content where slight staleness is acceptable (e.g., news feeds, social media feeds).
        </p>
        <p>
          <strong>Cache-Only:</strong> Serve from cache only. Best for: offline-only resources (app shell, icons, fonts), precached assets (assets cached during install phase). Fails if not in cache (no network fallback). Use for assets that are precached during install phase and do not change (e.g., app shell, icons, fonts).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/service-worker-use-cases.svg"
          alt="Service Worker Use Cases showing offline support, background sync, push notifications, and performance caching"
          caption="Service Worker use cases — offline support (cached content), background sync (queue requests), push notifications (re-engage users), performance (cached assets)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Service Workers involve trade-offs between reliability, complexity, cache freshness, and browser support. Understanding these trade-offs is essential for making informed decisions about when to use Service Workers and how to configure caching strategies.
        </p>

        <h3>Service Workers vs. HTTP Cache</h3>
        <p>
          <strong>HTTP Cache:</strong> Browser&apos;s built-in cache. Advantages: simple (no code required, browser handles caching automatically), works everywhere (all browsers support HTTP cache). Limitations: limited control (browser decides what to cache and for how long, based on HTTP headers), no offline support (browser may not serve from cache when offline), no custom logic (cannot implement custom caching strategies). Best for: simple caching needs, static assets with long cache lifetimes.
        </p>
        <p>
          <strong>Service Workers:</strong> Custom caching with full control. Advantages: full control over what is cached and for how long (implement custom caching strategies), offline support (serve cached content when network is unavailable), custom logic (implement different strategies for different resource types). Limitations: complex (lifecycle management, cache invalidation, update handling), requires HTTPS (cannot be used on HTTP sites), browser support (not supported in all browsers, requires fallback). Best for: complex caching needs, offline support, performance optimization.
        </p>

        <h3>Update Handling Trade-offs</h3>
        <p>
          <strong>Wait Until Tabs Closed:</strong> New Service Worker waits until all tabs using old Service Worker are closed before activating. Advantages: safe (no breaking pages mid-session, old Service Worker continues serving pages until all tabs are closed). Limitations: users may never close all tabs (new Service Worker may never activate, users continue using old version). Best for: most applications (safe update handling).
        </p>
        <p>
          <strong>Skip Waiting:</strong> Use skipWaiting() to force immediate activation. Advantages: users get new version immediately (no wait for tabs to close). Limitations: may break pages mid-session (old pages may expect old Service Worker behavior, new Service Worker may have different behavior). Best for: critical updates (security fixes, critical bug fixes) where users must get new version immediately.
        </p>
        <p>
          <strong>User Prompt:</strong> Notify user when new Service Worker is ready, let user choose when to update. Advantages: user control (user chooses when to update, no breaking pages mid-session, user can finish current task before updating). Limitations: user may never update (users may ignore prompt, continue using old version). Best for: most applications (user-friendly update handling).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/service-worker-use-cases.svg"
          alt="Service Worker Trade-offs showing HTTP cache vs Service Worker, wait vs skip waiting, cache strategies"
          caption="Service Worker trade-offs — HTTP cache (simple, limited control) vs Service Worker (complex, full control), wait until tabs closed (safe) vs skip waiting (immediate), cache-first vs network-first vs stale-while-revalidate"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Version Caches:</strong> Use versioned cache names (e.g., &apos;v1-static&apos;, &apos;v2-static&apos;) to manage cache updates. When Service Worker updates, change cache version (e.g., from &apos;v1&apos; to &apos;v2&apos;). In activate phase, delete old caches (caches.delete(&apos;v1&apos;) to free up space). This pattern ensures that old caches are cleaned up and do not consume disk space indefinitely.
          </li>
          <li>
            <strong>Precache Static Assets:</strong> Cache static assets (JS, CSS, images, fonts) during install phase. Use precaching tools (Workbox precaching) to generate precache manifest (list of assets to cache with hashes). Precached assets are served from cache instantly (fast loading, offline support). This pattern ensures that core app assets are available offline and load fast.
          </li>
          <li>
            <strong>Use Different Strategies for Different Resources:</strong> Use cache-first for static assets (JS, CSS, images), network-first for dynamic content (API responses, HTML), stale-while-revalidate for frequently updated content (news feeds, social media feeds). This pattern ensures that each resource type is cached optimally (static assets are fast, dynamic content is fresh, frequently updated content is fast and eventually fresh).
          </li>
          <li>
            <strong>Handle Updates Carefully:</strong> New Service Worker waits until all tabs using old Service Worker are closed before activating. Use skipWaiting() to force immediate activation (use with caution, may break pages mid-session). Notify user when new Service Worker is ready (show prompt: &quot;New version available. Reload to update?&quot;). This pattern ensures that users get updates safely (no breaking pages mid-session).
          </li>
          <li>
            <strong>Provide Offline Fallback:</strong> Serve fallback page when network is unavailable and content is not cached (e.g., &quot;You are offline. Please check your connection.&quot;). This pattern provides user feedback when offline (user knows why content is not loading, can take action to fix connection).
          </li>
          <li>
            <strong>Monitor Cache Size:</strong> Service Workers can consume significant disk space (cached assets, responses). Monitor cache size (caches.keys() to list caches, cache.match() to check cache entries). Limit cache size (delete old entries when cache exceeds limit, use LRU eviction). This pattern ensures that Service Workers do not consume excessive disk space (users may run out of disk space, app may be evicted by browser).
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Serving Stale Content:</strong> Cache-first strategy serves stale content if content changes but is not updated in cache. Users see outdated content (e.g., old JS, CSS, images). Use versioned URLs (e.g., app.js?v=1.0, so new version gets new URL and is cached separately) or network-first for dynamic content. Use stale-while-revalidate for frequently updated content. This pattern ensures that users get fresh content while still benefiting from cache.
          </li>
          <li>
            <strong>Broken Updates:</strong> New Service Worker has different behavior than old Service Worker (e.g., new Service Worker expects different API responses, old pages expect old behavior). If new Service Worker activates mid-session, old pages may break (e.g., old pages send requests that new Service Worker does not handle correctly). Wait until all tabs closed before activating (safe update handling) or notify user and reload (user-friendly update handling).
          </li>
          <li>
            <strong>Cache Bloat:</strong> Caching everything without limits consumes disk space (cached assets, responses accumulate over time). Users run out of disk space, app is evicted by browser (browser may delete Service Worker and caches to free up space). Limit cache size (delete old entries when cache exceeds limit, use LRU eviction). Use versioned caches (delete old caches on activate).
          </li>
          <li>
            <strong>No Offline Fallback:</strong> When network is unavailable and content is not cached, app shows blank page or error (no user feedback). Users do not know why content is not loading (may think app is broken). Provide offline fallback (serve fallback page: &quot;You are offline. Please check your connection.&quot;). This pattern provides user feedback when offline.
          </li>
          <li>
            <strong>Not Handling Fetch Errors:</strong> Network requests may fail (network error, timeout, server error). If Service Worker does not handle fetch errors (e.g., does not fall back to cache), users see errors. Always handle fetch errors (fall back to cache, serve fallback page, retry). This pattern ensures that users get a graceful experience when network is unavailable or server is down.
          </li>
          <li>
            <strong>HTTP Instead of HTTPS:</strong> Service Workers require HTTPS (except localhost). HTTP requests fail silently or throw error (Service Worker does not register on HTTP sites). Always use HTTPS for production. For development, localhost works without HTTPS. If you must support HTTP (legacy), Service Worker features will not work (no offline support, no push notifications, no background sync).
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Offline Support</h3>
        <p>
          E-commerce sites (Amazon, Shopify stores) use Service Workers for offline support. Precache app shell (HTML, CSS, JS, icons) during install phase. Cache product images and pages (cache-first strategy). When user is offline, show cached product pages (user can browse products offline). When user is online, fetch fresh content (network-first for product data, stale-while-revalidate for product images). Background sync for cart (user adds items to cart offline, sync when online). This pattern improves user experience (users can browse products offline, cart syncs when online) and increases conversion (users can complete purchase even on unreliable networks).
        </p>

        <h3>News App Offline Reading</h3>
        <p>
          News apps (Washington Post, New York Times) use Service Workers for offline reading. Precache app shell during install phase. Cache articles when user reads (network-first for articles, cache responses). When user is offline, show cached articles (user can read articles offline). Stale-while-revalidate for article feeds (serve cached feed instantly, update in background). Push notifications for breaking news (re-engage users with timely notifications). This pattern improves user experience (users can read articles offline, get breaking news notifications) and increases engagement (users return to app for offline reading and notifications).
        </p>

        <h3>Social Media Background Sync</h3>
        <p>
          Social media apps (Twitter, Facebook, Instagram) use Service Workers for background sync. User posts tweet offline (tweet is queued in IndexedDB). Background sync event fires when network is available (even if app is closed). Service Worker replays queued requests (posts tweet, syncs feed). Push notifications for mentions, messages (re-engage users with timely notifications). This pattern improves user experience (users can post offline, syncs when online, get notifications) and increases engagement (users return to app for notifications and synced content).
        </p>

        <h3>Travel App Unreliable Networks</h3>
        <p>
          Travel apps (airline apps, hotel apps, ride-sharing apps) use Service Workers for unreliable networks. Precache app shell, boarding passes, reservation details (cache-first strategy). When user is on unreliable network (airport, hotel, foreign country), show cached content (user can access boarding passes, reservations offline). Network-first for real-time data (flight status, driver location), falls back to cache when network is unavailable. Push notifications for flight updates, driver arrival (re-engage users with timely notifications). This pattern improves user experience (users can access critical information offline, get real-time updates when online) and reduces customer support inquiries (users have boarding passes, reservations offline, get flight updates).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do Service Workers enable offline support?
            </p>
            <p className="mt-2 text-sm">
              A: Service Workers intercept fetch requests (every network request from pages under their scope). In fetch handler, check cache first (caches.match(request)). If cached response exists, return it. If not, fetch from network (fetch(request)), cache response (cache.put(request, response.clone())), return response. Precache critical assets during install phase (app shell, JS, CSS, icons). Result: app works offline with cached content (user can access cached assets, pages, data even when network is unavailable). For offline fallback, serve fallback page when network is unavailable and content is not cached (user sees &quot;You are offline&quot; message instead of blank page or error).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle Service Worker updates?
            </p>
            <p className="mt-2 text-sm">
              A: New Service Worker installs alongside old one (new Service Worker downloads, installs, but does not activate). Waits in &quot;waiting&quot; state until all tabs using old Service Worker close. Then activates (old Service Worker is removed, new Service Worker takes control). To force update: skipWaiting() in install phase (forces immediate activation, use with caution — may break pages mid-session), clients.claim() in activate phase (takes control of all pages immediately, use with caution). For gradual rollout: postMessage to tabs (notify user when new Service Worker is ready, let user choose when to reload). This pattern ensures that users get updates safely (no breaking pages mid-session) and can choose when to update.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What caching strategy should you use?
            </p>
            <p className="mt-2 text-sm">
              A: Depends on content type: (1) Static assets (JS, CSS, images) — cache-first (offline-first, fast loading, use versioned URLs to avoid stale content). (2) API responses — network-first (fresh when online, cache fallback when offline). (3) Frequently updated content (news feeds, social media feeds) — stale-while-revalidate (fast + eventually fresh, serve cached content instantly, update cache in background). (4) Offline-only (app shell, icons, fonts) — cache-only (serve from cache only, precache during install). Use different strategies for different request types (e.g., cache-first for images, network-first for API, stale-while-revalidate for feeds). This pattern ensures that each resource type is cached optimally.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle background sync?
            </p>
            <p className="mt-2 text-sm">
              A: When user submits form offline, queue request in IndexedDB (store form data, method, URL, headers in IndexedDB). Register sync: registration.sync.register(&apos;sync-tag&apos;) (registers sync event with tag, Service Worker receives sync event when network is available). Service Worker receives sync event (even if app is closed), replays queued requests (reads queued requests from IndexedDB, sends requests to server, handles responses, updates IndexedDB). Handle failures (retry failed requests, notify user if retry limit exceeded, store failed requests for manual retry). User sees immediate UI update (optimistic UI — show success message immediately, sync happens in background). This pattern enables offline-first apps — users can submit forms offline, sync when online.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle push notifications with Service Workers?
            </p>
            <p className="mt-2 text-sm">
              A: User subscribes to push notifications through the pushManager subscribe method, which requires user permission and returns a subscription object. Send the subscription to the server for storage. The server sends push messages via a push service such as Firebase Cloud Messaging. The Service Worker receives the push event even when the app is closed, extracts the message data, and shows a notification with title, body, icon, and badge. When the user clicks the notification, the Service Worker receives a notificationclick event and opens the app or page with the relevant deep link. This pattern enables re-engagement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should you NOT use Service Workers?
            </p>
            <p className="mt-2 text-sm">
              A: Avoid Service Workers when: (1) Simple static site — HTTP cache is sufficient (no need for custom caching strategies, offline support). (2) HTTP-only site — Service Workers require HTTPS (cannot be used on HTTP sites). (3) No offline needs — if app requires network for all functionality, Service Workers add complexity without benefit. (4) Limited browser support required — Service Workers not supported in all browsers (requires fallback for unsupported browsers). Service Workers add complexity (lifecycle management, cache invalidation, update handling) — use only when offline support, background sync, push notifications, or performance optimization are needed.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Service Worker API
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/service-workers/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Service Workers Guide
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/web/fundamentals/primers/service-workers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google — Service Workers Primer
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/service-workers/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C — Service Workers Specification
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/web/tools/workbox"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google — Workbox (Service Worker Library)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );

}

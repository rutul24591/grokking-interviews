"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-service-workers-concise",
  title: "Service Workers",
  description:
    "Deep dive into Service Workers covering lifecycle, fetch interception, caching strategies, push notifications, background processing, and debugging techniques.",
  category: "frontend",
  subcategory: "offline-support",
  slug: "service-workers",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: [
    "frontend",
    "service-worker",
    "offline",
    "caching",
    "push-notifications",
    "PWA",
  ],
  relatedTopics: [
    "progressive-web-apps",
    "offline-first-architecture",
    "background-sync",
    "network-status-detection",
  ],
};

export default function ServiceWorkersConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>A Service Worker</strong> is a programmable network proxy that
          runs in a separate browser thread, sitting between web pages and the
          network to intercept, modify, and respond to fetch requests. It is a
          JavaScript file registered by a web page that, once installed,
          persists independently of the page that registered it. Service Workers
          form the technical backbone of Progressive Web Apps, enabling offline
          functionality, push notifications, and background synchronization.
        </p>
        <p>
          Service Workers were introduced in Chrome 40 (January 2015) as a
          replacement for the deeply flawed Application Cache (AppCache) API.
          AppCache suffered from an opaque, declarative model that made cache
          invalidation nearly impossible to control and led to countless bugs in
          production applications. The W3C Service Worker specification (now
          maintained under the WHATWG umbrella) was designed to give developers
          full programmatic control over the network layer, moving from a
          declarative manifest to an imperative, event-driven JavaScript API.
        </p>
        <p>
          The mental model is straightforward: a Service Worker is a JavaScript
          file that the browser runs in the background, separate from any web
          page, acting as a middleware layer between the application and the
          network. Every fetch request made by pages within its scope passes
          through the Service Worker, which can respond from cache, forward to
          the network, synthesize a response, or combine strategies. This
          architecture is sometimes described as an "in-browser reverse proxy."
        </p>
        <p>
          At a staff/principal engineer level, several architectural decisions
          in the specification are worth understanding. Service Workers require
          HTTPS (with localhost as the sole exception) because they can
          intercept and modify every network request within their scope, making
          them a potent attack vector if served over insecure connections. They
          run on a separate thread with no DOM access, which prevents them from
          blocking the main thread and ensures that cache operations, push
          handling, and background sync never cause UI jank. The specification
          also mandates same-origin restrictions: a Service Worker can only
          intercept requests originating from pages served from the same origin
          as the worker itself.
        </p>
        <p>
          The W3C specification has evolved significantly since its initial
          draft. Major additions include the Navigation Preload API (allowing
          the browser to start network requests in parallel with SW boot time),
          the Background Sync API, the Periodic Background Sync API, and
          improvements to the Cache API. Browser support is now universal across
          modern browsers, though iOS Safari has historically lagged behind with
          notable quirks around storage eviction and push notification support.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Six fundamental concepts define how Service Workers operate and how
          engineers should reason about them:
        </p>
        <ul>
          <li>
            <strong>Lifecycle Phases:</strong> A Service Worker transitions
            through well-defined states: installing (triggered after download,
            where precaching occurs), waiting (parked if an older SW still
            controls pages), activating (clean-up phase where old caches are
            purged), activated (fully in control, handling fetch and push
            events), and redundant (replaced by a newer SW or failed
            installation). Understanding this lifecycle is essential because it
            governs when new code takes effect and how updates propagate to
            users.
          </li>
          <li>
            <strong>Scope and Registration:</strong> A Service Worker's scope is
            determined by the URL path of the worker script and an optional
            scope parameter during registration. It can only intercept requests
            from pages whose URL falls within that scope. Placing the worker at
            the root ("/sw.js") gives it maximum scope. A common mistake is
            placing the worker in a subdirectory ("/scripts/sw.js") and
            wondering why it cannot intercept requests from other paths.
          </li>
          <li>
            <strong>Fetch Event Interception:</strong> The fetch event fires for
            every network request made by controlled pages, including
            navigations, scripts, stylesheets, images, and API calls. Inside the
            handler, event.respondWith() lets the worker provide a custom
            Response. If respondWith() is not called, the request falls through
            to the browser's default network handling.
          </li>
          <li>
            <strong>Cache API Integration:</strong> The Cache API (caches.open,
            cache.put, cache.match) provides programmatic, versioned cache
            management entirely separate from the HTTP cache. Engineers can
            create named caches (e.g., "assets-v2", "api-v1"), store
            request-response pairs, and delete old cache versions during the
            activate phase. Unlike the HTTP cache, the Cache API gives full
            control over what is stored, when it expires, and how it is evicted.
          </li>
          <li>
            <strong>Message Passing:</strong> Service Workers communicate with
            pages via postMessage. A page can send messages to its controlling
            Service Worker via navigator.serviceWorker.controller.postMessage(),
            and the SW can broadcast to all clients via self.clients.matchAll()
            followed by client.postMessage(). The BroadcastChannel API offers an
            alternative for one-to-many communication. This channel is critical
            for coordinating cache updates, notifying users of new content, and
            synchronizing state.
          </li>
          <li>
            <strong>Update Mechanism:</strong> Browsers perform a byte-for-byte
            comparison of the Service Worker file on every navigation (or at
            least every 24 hours, per specification). If even a single byte
            differs, the browser downloads and installs the new worker, which
            then enters the "waiting" state until all tabs controlled by the old
            worker are closed. The skipWaiting() method bypasses the waiting
            phase, and clients.claim() allows the new worker to immediately take
            control of existing pages.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The Service Worker lifecycle is a carefully orchestrated sequence
          designed to ensure reliability and prevent breaking existing user
          sessions during updates.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Lifecycle Flow</h3>
          <ol className="space-y-3">
            <li>
              <strong>1. Registration:</strong> The page calls
              navigator.serviceWorker.register('/sw.js'). The browser downloads
              the script.
            </li>
            <li>
              <strong>2. Install Event:</strong> Fires once after download. This
              is where precaching happens: the worker opens a named cache and
              adds critical assets (HTML shells, CSS, JS bundles, fonts, key
              images). If any asset fails to cache, the installation fails and
              the worker becomes redundant.
            </li>
            <li>
              <strong>3. Waiting Phase:</strong> If an existing Service Worker
              is controlling pages, the new worker enters the waiting state. It
              will not activate until every tab and window controlled by the old
              worker is closed. This phase exists to prevent version skew:
              imagine tab A running code that expects cache format v1 while a
              new SW has already migrated caches to v2.
            </li>
            <li>
              <strong>4. Activate Event:</strong> Fires when the old worker is
              gone (or skipWaiting was called). This is where cache cleanup
              belongs: iterate over cache names, delete any that are not in the
              current whitelist. Calling clients.claim() here takes immediate
              control of uncontrolled pages.
            </li>
            <li>
              <strong>5. Fetch Handling:</strong> The activated worker
              intercepts all fetch requests from controlled pages. It applies
              caching strategies (cache-first, network-first,
              stale-while-revalidate) based on request type and URL patterns.
            </li>
            <li>
              <strong>6. Idle & Termination:</strong> The browser may terminate
              an idle Service Worker at any time to conserve memory. It will be
              restarted when the next event (fetch, push, sync) arrives. This
              means workers must not rely on in-memory state persisting between
              events.
            </li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/offline-support/sw-lifecycle.svg"
          alt="Service Worker Lifecycle State Diagram"
          caption="Service Worker Lifecycle - States from registration through activation to redundancy, including the critical waiting phase"
        />

        <p>
          The "waiting" phase deserves deeper examination because it is the most
          misunderstood part of the lifecycle. Without it, a new Service Worker
          could activate while existing tabs are still running code that depends
          on the old worker's cache structure or behavior. Consider a scenario
          where v1 of your worker caches API responses as JSON and v2 switches
          to a normalized format. If v2 activates while v1 tabs are open, those
          tabs would receive responses in the wrong format. The waiting phase
          prevents this by ensuring a clean handoff.
        </p>
        <p>
          Calling skipWaiting() bypasses this safety mechanism. It is useful
          during development and for non-critical updates (e.g., adding a new
          cached asset) but dangerous for updates that change cache structure or
          response handling. A common production pattern is to use skipWaiting()
          selectively: the new worker sends a message to clients asking "is it
          safe to skip waiting?", and clients respond based on their current
          state.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/offline-support/sw-fetch-interception.svg"
          alt="Service Worker Fetch Interception Flow"
          caption="Fetch Interception - How Service Workers intercept requests and apply different caching strategies"
        />

        <p>
          The fetch interception flow is where caching strategies come into
          play. When a fetch event fires, the worker examines the request (URL,
          method, headers) and decides how to respond. For navigation requests,
          a network-first strategy ensures users get fresh HTML. For static
          assets with hashed filenames, cache-first is optimal since the content
          never changes for a given URL. For API responses,
          stale-while-revalidate provides a balance: return the cached version
          instantly while fetching a fresh copy in the background for next time.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Performance</strong>
              </td>
              <td className="p-3">
                {"•"} Precaching eliminates network latency for critical assets
                <br />
                {"•"} Sub-millisecond cache responses vs 50-500ms network
                <br />
                {"•"} Navigation preload parallelizes SW boot and network fetch
              </td>
              <td className="p-3">
                {"•"} SW boot time adds 50-100ms to first request after idle
                <br />
                {"•"} Precaching increases initial install time and bandwidth
                <br />
                {"•"} Cache storage has browser-imposed quota limits
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Complexity</strong>
              </td>
              <td className="p-3">
                {"•"} Full programmatic control over caching behavior
                <br />
                {"•"} Workbox abstracts common patterns into simple config
                <br />
                {"•"} Chrome DevTools provides excellent debugging tools
              </td>
              <td className="p-3">
                {"•"} Lifecycle is unintuitive for most developers
                <br />
                {"•"} Debugging stale cache issues is notoriously difficult
                <br />
                {"•"} Race conditions between SW updates and page code
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Security</strong>
              </td>
              <td className="p-3">
                {"•"} HTTPS requirement ensures integrity of intercepted
                requests
                <br />
                {"•"} Same-origin policy prevents cross-site interception
                <br />
                {"•"} Runs in isolated thread with no DOM access
              </td>
              <td className="p-3">
                {"•"} A compromised SW can intercept all requests indefinitely
                <br />
                {"•"} Stale SW can serve outdated security patches
                <br />
                {"•"} Cache poisoning if responses are not validated
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Reliability</strong>
              </td>
              <td className="p-3">
                {"•"} Enables full offline functionality
                <br />
                {"•"} Graceful degradation on flaky networks
                <br />
                {"•"} Background sync retries failed requests automatically
              </td>
              <td className="p-3">
                {"•"} iOS Safari evicts SW storage after 14 days of non-use
                <br />
                {"•"} Browser may terminate idle workers unpredictably
                <br />
                {"•"} No guarantee of persistent storage without explicit API
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Browser Support</strong>
              </td>
              <td className="p-3">
                {"•"} Supported in all modern browsers (Chrome, Firefox, Safari,
                Edge)
                <br />
                {"•"} Progressive enhancement: apps work without SW
                <br />
                {"•"} Feature detection is straightforward
              </td>
              <td className="p-3">
                {"•"} iOS Safari has limited push notification support
                <br />
                {"•"} Periodic Background Sync is Chrome-only
                <br />
                {"•"} Inconsistent quota limits across browsers
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/offline-support/sw-caching-strategies.svg"
          alt="Service Worker Caching Strategies Comparison"
          caption="Comparison of five caching strategies: Cache First, Network First, Stale-While-Revalidate, Cache Only, and Network Only"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Production-grade Service Worker implementations should follow these
          practices:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Version Your Caches:</strong> Use cache names that include a
            version identifier (e.g., "static-v3", "api-v2"). During the
            activate event, iterate over all cache names and delete any that do
            not match the current version set. This prevents unbounded cache
            growth and ensures stale data is purged on update.
          </li>
          <li>
            <strong>Use Workbox for Production:</strong> Google's Workbox
            library abstracts caching strategies, precaching, routing, and
            background sync into a well-tested, production-ready toolkit. It
            handles edge cases (opaque responses, quota management, retry logic)
            that are easy to get wrong in hand-rolled implementations. Workbox's
            build-time integration with webpack, Rollup, and Vite makes precache
            manifest generation automatic.
          </li>
          <li>
            <strong>Handle Updates Gracefully:</strong> When a new Service
            Worker is waiting, notify the user with an "Update available"
            banner. On user confirmation, send a SKIP_WAITING message to the new
            worker, which calls skipWaiting() and then clients.claim(). Reload
            the page to ensure all code is consistent with the new worker. Never
            auto-refresh without user consent.
          </li>
          <li>
            <strong>Limit Precache Size:</strong> Keep precached assets under
            5MB. Precaching every asset in your application wastes bandwidth and
            slows installation. Focus on the app shell (HTML, critical CSS, core
            JS bundles, key fonts) and use runtime caching for everything else.
            Audit precache size regularly as your application grows.
          </li>
          <li>
            <strong>Use Navigation Preload:</strong> Enable navigation preload
            in the activate event to eliminate the performance penalty of SW
            boot time on navigation requests. Without it, the browser waits for
            the SW to start before making the navigation request. With it, the
            network request starts in parallel, shaving 50-100ms off navigation
            time.
          </li>
          <li>
            <strong>Implement Appropriate Runtime Caching Strategies:</strong>{" "}
            Match strategies to content types: cache-first for fingerprinted
            static assets (they never change), network-first for HTML and API
            responses (freshness matters), stale-while-revalidate for
            non-critical resources like avatars or third-party scripts. Avoid a
            one-size-fits-all approach.
          </li>
          <li>
            <strong>Clean Up Old Caches in Activate:</strong> The activate event
            is the designated cleanup phase. Maintain a whitelist of current
            cache names and delete everything else. Failing to clean up old
            caches leads to storage bloat and eventual quota exceeded errors,
            particularly on storage-constrained mobile devices.
          </li>
          <li>
            <strong>Test with Chrome DevTools Application Panel:</strong> Use
            the Application tab to inspect registered workers, view cache
            contents, simulate offline mode, trigger push events, and force SW
            updates. The "Update on reload" checkbox is invaluable during
            development. Also test with Lighthouse PWA audits to verify offline
            readiness.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These mistakes cause the majority of Service Worker bugs in
          production:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Not Understanding the Waiting Phase:</strong> The most
            common complaint is "I deployed a new Service Worker but users still
            see old content." This happens because the new worker enters the
            waiting state while the old one controls existing tabs. Developers
            must either implement a proper update flow (notify user, skipWaiting
            on confirmation, reload) or understand that users need to close all
            tabs and reopen the site.
          </li>
          <li>
            <strong>Caching Too Aggressively:</strong> Caching HTML pages with a
            cache-first strategy means users never see updated content unless
            they force-refresh or the SW updates. This is the Service Worker
            equivalent of shipping a broken build with no rollback. Always use
            network-first or stale-while-revalidate for content that changes,
            and reserve cache-first for immutable, fingerprinted assets only.
          </li>
          <li>
            <strong>Treating Navigation Requests Like Asset Requests:</strong>{" "}
            Navigation requests (document fetches when the user navigates to a
            URL) need different handling than subresource requests. Serving a
            stale HTML shell for navigations while the app expects fresh data
            can cause hydration mismatches, broken authentication flows, and
            incorrect routing. Always route navigation requests through a
            network-first strategy with a fallback offline page.
          </li>
          <li>
            <strong>Not Accounting for Opaque Responses:</strong> Cross-origin
            requests made without CORS headers produce opaque responses (status
            0, empty headers). These responses can be cached but consume
            significantly more storage (padded to 7MB per response in some
            browsers as a privacy measure). Caching many opaque responses can
            quickly exhaust storage quota. Always request CORS where possible,
            and set strict limits on opaque response caching.
          </li>
          <li>
            <strong>Memory Leaks from Unbounded Caches:</strong> Without
            explicit cache eviction, cached entries accumulate indefinitely.
            Over weeks or months, runtime caches for API responses or images can
            grow to hundreds of megabytes. Implement a maximum entry count
            (e.g., 50 items) or time-based expiration (e.g., 7 days) for every
            runtime cache. Workbox's ExpirationPlugin handles this
            automatically.
          </li>
          <li>
            <strong>Attempting to Cache POST/PUT Requests:</strong> The Cache
            API only supports GET requests. Attempting to cache POST responses
            silently fails or throws errors. If you need offline support for
            mutations, use Background Sync to queue requests in IndexedDB and
            replay them when connectivity returns. Do not try to hack the Cache
            API to store non-GET responses.
          </li>
          <li>
            <strong>iOS Safari's Aggressive SW Eviction:</strong> WebKit evicts
            Service Worker registrations and cached data after approximately 14
            days of user inactivity with the site. This means iOS users who
            return after two weeks will lose all cached data and need to
            re-download everything. There is no workaround beyond encouraging
            regular engagement or using the Storage API's persist() method,
            which Safari only partially honors. Design your offline strategy to
            degrade gracefully when caches are evicted.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Service Workers excel in specific scenarios and are counterproductive
          in others:
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">When to Use Service Workers</h3>
            <ul className="space-y-3">
              <li>
                <strong>Offline-Capable Applications:</strong> Apps like Google
                Docs, Notion, or Figma that must function without a network
                connection. The SW caches the app shell and critical data, while
                IndexedDB stores user content. Changes sync when connectivity
                returns via Background Sync.
              </li>
              <li>
                <strong>Push Notifications:</strong> News apps, messaging
                platforms, and e-commerce sites that send time-sensitive
                notifications. The SW receives push events even when no tab is
                open, displays a notification, and handles the click to open the
                appropriate page.
              </li>
              <li>
                <strong>Background Sync:</strong> Forms, chat applications, or
                any app where users submit data that must eventually reach the
                server. The SW queues failed requests and retries them when the
                network is available, preventing data loss on flaky connections.
              </li>
              <li>
                <strong>Performance Optimization via Precaching:</strong> Any
                application that benefits from instant repeat visits. By
                precaching the app shell and critical assets, subsequent visits
                load in under 100ms from cache, rivaling native app performance.
                Twitter Lite famously used this approach to achieve a 65%
                increase in pages per session.
              </li>
            </ul>
          </div>

          <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
            <h3 className="mb-3 font-semibold">
              When NOT to Use Service Workers
            </h3>
            <ul className="mt-2 space-y-2">
              <li>
                {"•"} Simple static sites with no offline requirement (the
                complexity outweighs the benefit)
              </li>
              <li>
                {"•"} Server-rendered applications where content changes on
                every request and freshness is paramount (news feeds, stock
                tickers)
              </li>
              <li>
                {"•"} Applications requiring real-time data freshness where
                stale data could cause harm (financial trading, healthcare
                monitoring)
              </li>
              <li>
                {"•"} Internal tools with guaranteed network connectivity where
                offline support adds unnecessary complexity
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Explain the Service Worker lifecycle and why the "waiting"
              phase exists.
            </p>
            <p className="mt-2 text-sm">
              A: A Service Worker progresses through five states: installing,
              waiting, activating, activated, and redundant. After installation,
              if an existing SW controls open pages, the new worker enters the
              waiting state. The waiting phase exists to prevent version skew:
              if the new worker activated immediately, existing tabs would be
              controlled by a worker whose cache structure or response format
              might be incompatible with the code already running in those tabs.
              For example, if v1 caches API responses as raw JSON and v2
              normalizes them, active v1 tabs would receive v2-formatted
              responses and break. The waiting phase ensures all tabs close
              before the new worker takes control, guaranteeing consistency.
              Engineers can bypass this with skipWaiting(), but should only do
              so when the update is backward-compatible.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement a cache-first strategy with network
              fallback?
            </p>
            <p className="mt-2 text-sm">
              A: In the fetch event handler, first attempt to match the request
              against the cache using caches.match(event.request). If a cached
              response exists, return it immediately for sub-millisecond
              performance. If no cache hit, fall through to fetch(event.request)
              to get the response from the network, then clone the response
              (since Response bodies are one-time-use streams), store the clone
              in the cache for future requests, and return the original response
              to the page. This strategy is ideal for fingerprinted static
              assets (main.a1b2c3.js, styles.d4e5f6.css) where the content never
              changes for a given URL. For non-fingerprinted resources, prefer
              stale-while-revalidate to avoid serving permanently stale content.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the security implications of Service Workers and why
              do they require HTTPS?
            </p>
            <p className="mt-2 text-sm">
              A: Service Workers can intercept, modify, and fabricate responses
              for every request within their scope. On an insecure HTTP
              connection, a man-in-the-middle attacker could inject a malicious
              Service Worker that persists indefinitely, intercepting all future
              requests even after the MITM attack ends. The HTTPS requirement
              ensures the SW script is delivered with integrity and
              authenticity. Additional security considerations include: the
              same-origin policy (a SW can only control pages from its own
              origin), the fact that browsers refuse to cache SW scripts for
              longer than 24 hours (preventing permanent hijacking from a
              briefly compromised server), and the isolated execution context
              (no DOM access, no shared memory with the page) which limits the
              blast radius of any vulnerability in the SW code itself.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/learn/pwa/service-workers/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn PWA: Service Workers - web.dev
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Service Worker API - MDN Web Docs
            </a>
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/workbox/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Workbox Documentation - Chrome Developers
            </a>
          </li>
          <li>
            <a
              href="https://jakearchibald.com/2014/offline-cookbook/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              The Offline Cookbook - Jake Archibald
            </a>
          </li>
          <li>
            <a
              href="https://w3c.github.io/ServiceWorker/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Service Workers Specification - W3C
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

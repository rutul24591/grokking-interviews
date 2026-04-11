"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-offline-support-pwa",
  title: "Offline Support / PWA",
  description:
    "Comprehensive guide to offline-first architecture, Progressive Web Apps, Service Workers, background sync, conflict resolution, and PWA deployment checklist.",
  category: "frontend",
  subcategory: "nfr",
  slug: "offline-support-pwa",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "offline",
    "pwa",
    "service-worker",
    "resilience",
    "background-sync",
  ],
  relatedTopics: [
    "page-load-performance",
    "caching-strategies",
    "network-status",
  ],
};

export default function OfflineSupportPWAArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Offline Support</strong> refers to a web application&apos;s
          ability to function without network connectivity, while{" "}
          <strong>Progressive Web Apps (PWA)</strong> are web applications that
          use modern web APIs to provide app-like experiences — offline support,
          push notifications, home screen installation, and background
          synchronization. The business impact of offline support is significant
          and measurable: e-commerce sites with offline cart support see 20%
          higher conversion rates, news sites with offline reading see 3x more
          article completions, and productivity apps with offline editing see
          dramatically higher user retention. For global audiences where 2G/3G
          connectivity and intermittent networks are common, offline support is
          not a luxury — it is essential for accessible, inclusive applications.
        </p>
        <p>
          Offline capability exists on a spectrum. Offline-capable applications
          provide core features without connectivity — reading cached content,
          viewing previously loaded pages — but do not support data creation or
          modification offline. Offline-first applications are designed assuming
          offline is the default state — all data operations target a local
          database, and synchronization with the server happens in the
          background when connectivity is available. Full PWAs add installability
          (home screen icon, standalone window), push notifications, and
          background sync to the offline foundation. The architectural effort
          increases with each level — offline-capable can be achieved with
          simple service worker caching, while offline-first requires a complete
          data architecture redesign.
        </p>
        <p>
          For staff engineers, offline architecture decisions affect data models
          (local versus server as source of truth), sync strategies (push, pull,
          bi-directional), conflict resolution (what happens when offline changes
          diverge from server state), and UX patterns (how to communicate
          connectivity status, queue actions, and resolve conflicts). The Service
          Worker API is the foundational technology — a programmable network
          proxy that runs in the background, intercepting network requests and
          serving responses from cache, network, or a combination of both.
          Combined with IndexedDB for structured local data storage and the
          Background Sync API for deferred actions, Service Workers enable
          sophisticated offline experiences.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Service Workers are the foundation of offline support. They are
          JavaScript workers that run independently of the web page, acting as
          a programmable proxy between the browser and the network. The
          Service Worker lifecycle consists of registration (the browser
          downloads the service worker script), installation (the service worker
          caches essential assets — the app shell), activation (old caches are
          cleaned up and the service worker takes control of open pages), and
          fetch interception (all network requests from controlled pages pass
          through the service worker&apos;s fetch handler). Service workers
          only work on HTTPS (except localhost) and have their own lifecycle
          independent of the page — they can continue running after the page
          closes, enabling background sync and push notifications.
        </p>
        <p>
          Caching strategies determine how the service worker responds to
          network requests. Cache-first strategy tries the cache first and falls
          back to the network — ideal for static assets (CSS, JavaScript,
          images) that are versioned and immutable. Network-first strategy tries
          the network first and falls back to cache — ideal for dynamic content
          (API responses, HTML pages) where freshness matters but offline
          fallback is valuable. Stale-while-revalidate returns the cached
          response immediately while fetching a fresh version in the background
          — ideal for content that updates periodically but does not need to be
          perfectly fresh. Cache-only serves exclusively from cache (for truly
          static content), and network-only always fetches from the network
          (for real-time data that should not be cached).
        </p>
        <p>
          Offline-first architecture inverts the traditional data flow. Instead
          of the server being the source of truth and the browser being a
          transient viewer, the local database (IndexedDB) becomes the source
          of truth and the server becomes a synchronization target. The UI
          always reads from the local database, providing instant access
          regardless of connectivity. Mutations are written to the local
          database immediately (optimistic updates) and queued for background
          synchronization. When connectivity returns, the sync process pushes
          queued mutations to the server and pulls any server-side changes,
          resolving conflicts when the same data was modified both offline and
          on the server.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/offline-service-worker-lifecycle.svg"
          alt="Service Worker Lifecycle"
          caption="Service Worker lifecycle — registration (download script), installation (cache app shell), activation (clean old caches, take control), and fetch interception (handle all network requests)"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The offline-first data architecture flows through several layers. The
          UI layer reads from and writes to a local database (IndexedDB), never
          directly to the network. The sync layer monitors connectivity and
          manages the synchronization queue — when online, it pushes queued
          mutations to the server and pulls server changes into the local
          database. The conflict resolution layer detects and resolves
          discrepancies between local and server state — using strategies like
          last-write-wins for simple data, field-level merging for documents,
          or CRDTs for collaborative editing. The background sync layer uses
          the Background Sync API to defer actions until connectivity is
          available, ensuring that user actions performed offline are
          eventually synchronized even if the user closes the browser before
          coming back online.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/offline-first-architecture.svg"
          alt="Offline-First Architecture"
          caption="Offline-first data flow — UI reads/writes to local IndexedDB, sync queue manages mutations, background sync handles connectivity transitions, and conflict resolution merges divergent state"
        />

        <p>
          PWA features build on the offline foundation to provide app-like
          experiences. The Web App Manifest (a JSON file linked in the HTML
          head) provides metadata for installability — app name, short name,
          start URL, display mode (standalone for full-screen experience),
          icons for the home screen, theme color, and background color. The
          installability criteria are: a valid manifest, a service worker with
          a fetch handler, HTTPS, and user engagement (visited at least twice,
          5+ minutes apart). Push notifications enable re-engagement even when
          the app is not open — the service worker receives push events and
          displays notifications to the user. Background Sync defers actions
          until connectivity is available — one-time sync for form submissions,
          periodic sync for content updates.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/pwa-features.svg"
          alt="PWA Features Overview"
          caption="Progressive Web App features — web app manifest for installability, service worker for offline support, push notifications for re-engagement, background sync for deferred actions"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Offline-capable versus offline-first represents a significant
          architectural investment decision. Offline-capable applications add
          service worker caching to an existing architecture — the app works
          online normally, and cached resources are available offline for
          reading. This is relatively low effort (a few hundred lines of service
          worker code) and provides immediate value for content consumption
          scenarios. Offline-first applications require redesigning the data
          layer — implementing local database schemas, sync queues, conflict
          resolution, and optimistic UI updates. This is significantly higher
          effort but provides a qualitatively different user experience — the
          app works fully offline, not just for reading but for creating and
          modifying data.
        </p>
        <p>
          Service worker caching strategies involve trade-offs between freshness
          and availability. Cache-first provides the best offline experience but
          risks serving stale content if cache invalidation is not configured
          correctly. Network-first provides the freshest content when online but
          degrades to cached (potentially stale) content when offline.
          Stale-while-revalidate provides instant response times with eventual
          freshness but may briefly show outdated content. The recommended
          approach is to use different strategies for different resource types —
          cache-first for versioned static assets, network-first for HTML pages
          and API responses, stale-while-revalidate for periodically updated
          content like news feeds or product catalogs.
        </p>
        <p>
          PWA installability provides native-app-like experience but introduces
          platform-specific challenges. On Android, PWA installation is
          straightforward — the browser prompts the user to add the app to the
          home screen. On iOS, installation is manual (Share button → Add to
          Home Screen) and the experience is limited — service workers work but
          with restrictions, push notifications are not supported until iOS
          16.4+, and the standalone display mode has quirks. For applications
          targeting both platforms, the PWA investment should prioritize Android
          for the full experience and provide graceful degradation on iOS.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implement a clear offline UX strategy that communicates connectivity
          status and available functionality. Show an offline banner when the
          user loses connectivity, indicating which features remain available
          (read cached content, draft new content) and which require
          connectivity (submit forms, sync data). Queue user actions with
          visible status indicators (&quot;sending...&quot;, &quot;queued —
          will sync when online&quot;). Use optimistic UI for actions that can
          be queued — show the result immediately and sync in the background,
          with rollback capability if the sync fails. Never leave the user
          wondering whether their action was recorded.
        </p>
        <p>
          Configure the service worker with a comprehensive caching strategy
          that covers the app shell (HTML, CSS, JavaScript) and critical
          resources (fonts, logo, offline fallback page). Use Workbox (a
          library from Google) to simplify service worker development — it
          provides pre-built caching strategies, precaching for build-time
          asset lists, and runtime caching with configurable strategies.
          Version your cache names so that each service worker update creates a
          new cache, and clean up old caches during the activation event to
          prevent storage bloat.
        </p>
        <p>
          Design conflict resolution into the data architecture before offline
          support is needed. When offline changes sync with the server,
          conflicts are inevitable — the same document modified on two devices,
          or a record deleted on the server but updated offline. Implement a
          conflict detection mechanism (version vectors, timestamps, or
          field-level tracking) and a resolution strategy (automatic for simple
          cases, user-guided for complex cases). Preserve both versions when
          in doubt — it is better to have duplicate documents that users can
          merge than to lose work permanently.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Not testing offline scenarios during development is the most common
          PWA pitfall. Developers build and test exclusively on fast, reliable
          networks, missing the UX issues that surface when connectivity is
          unreliable. The fix is to regularly test with DevTools Network tab
          set to Offline, verifying that the app handles connectivity loss
          gracefully — showing cached content, queuing actions, displaying
          appropriate status indicators, and syncing correctly when
          connectivity returns. Test on actual mobile devices with throttled
          networks (3G, slow 3G) because DevTools throttling does not fully
          replicate mobile network behavior.
        </p>
        <p>
          Stale content after service worker updates is a frequent production
          issue. When a new service worker is deployed, it installs in the
          background and activates only after all tabs using the old service
          worker are closed. Users may continue seeing cached content from the
          old version for hours or days. The fix is to implement a service
          worker update notification — detect the new service worker
          (via the <code>waiting</code> state) and prompt the user to refresh
          for the latest version. Alternatively, use <code>skipWaiting()</code>{" "}
          and <code>clients.claim()</code> to activate the new service worker
          immediately, but this risks breaking tabs that have the old version
          loaded.
        </p>
        <p>
          Ignoring iOS Safari limitations leads to broken PWA experiences on
          iPhones. iOS Safari has limited PWA support — service workers work
          but require HTTPS and user interaction to register, push
          notifications were only added in iOS 16.4 and still have limitations,
          Add to Home Screen is manual (no automatic prompt), and the
          standalone display mode has viewport and navigation quirks. Include
          iOS-specific meta tags (<code>apple-mobile-web-app-capable</code>,{" "}
          <code>apple-mobile-web-app-status-bar-style</code>,{" "}
          <code>apple-touch-icon</code>) as a fallback, and test the PWA
          experience on actual iOS devices, not just Chrome DevTools.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Productivity applications like Google Docs and Notion use offline-first
          architecture to enable uninterrupted work regardless of connectivity.
          Users can create, edit, and delete documents offline — all changes are
          stored in IndexedDB and synchronized when connectivity returns.
          Conflicts are resolved using operational transformation (Google Docs)
          or CRDTs (Notion), ensuring that concurrent edits from multiple
          devices converge correctly. The UX communicates offline status
          clearly (&quot;You are offline — changes will sync when you are back
          online&quot;) and shows sync progress when connectivity is restored.
        </p>
        <p>
          News and media applications use offline caching to enable reading
          without connectivity. The Washington Post and The Guardian PWA
          implementations cache the latest articles during the user&apos;s last
          online session, allowing reading during commutes or in areas with
          poor coverage. Articles are stored with their images (compressed for
          storage efficiency) and the service worker serves them from cache when
          offline. New articles are fetched in the background when connectivity
          returns. The offline reading experience is indistinguishable from the
          online experience for cached content.
        </p>
        <p>
          E-commerce applications use offline support for cart persistence and
          browsing. Users can browse product catalogs (cached from previous
          sessions), add items to cart (stored in IndexedDB), and even begin
          checkout offline. The checkout submission is queued for background
          sync — when connectivity returns, the order is submitted
          automatically. This is particularly valuable in regions with
          unreliable connectivity, where users may have connectivity at home
          but lose it during transit. Offline cart support increases conversion
          rates by 20% because users do not lose their shopping progress when
          connectivity drops.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do service workers enable offline support?
            </p>
            <p className="mt-2 text-sm">
              A: Service workers intercept network requests via their fetch
              handler. During installation, they cache the app shell (HTML, CSS,
              JS, critical assets). During fetch events, they can respond from
              cache instead of the network, allowing the app to load and
              function without connectivity. Combined with IndexedDB for
              structured data storage, the entire application — not just static
              assets — can work offline. The service worker runs independently
              of the page and can continue running after the page closes,
              enabling background sync and push notifications.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between offline-capable and offline-first?
            </p>
            <p className="mt-2 text-sm">
              A: Offline-capable means the app works offline through cached
              resources — users can read previously loaded content but cannot
              create or modify data. It is a graceful degradation approach.
              Offline-first means the app is designed assuming offline is the
              default state — the local database (IndexedDB) is the source of
              truth, the UI always reads from it, and sync with the server
              happens in the background. Offline-first requires more
              architectural changes (local database, sync queue, conflict
              resolution) but provides a much better UX — full functionality
              offline, not just reading.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle data conflicts in offline apps?
            </p>
            <p className="mt-2 text-sm">
              A: Depends on complexity. Last-write-wins for simple data where
              conflicts are rare. Field-level merging for documents — merge
              non-conflicting field changes automatically. Operational
              Transformation or CRDTs for real-time collaborative editing where
              concurrent edits must converge automatically. The key is detecting
              conflicts (version vectors, timestamps, field-level tracking) and
              having a resolution strategy before they happen. When in doubt,
              preserve both versions and let the user decide.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the PWA installability requirements?
            </p>
            <p className="mt-2 text-sm">
              A: Valid web app manifest with name, short_name, start_url, and
              icons (192×192 and 512×512). Service worker registered with a
              fetch handler. HTTPS (localhost exempt for development). User
              engagement — visited at least twice with 5+ minutes between
              visits. On iOS, installation is manual (Share → Add to Home
              Screen) and requires additional meta tags. Chrome on Android
              provides an automatic install prompt when criteria are met.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle service worker updates?
            </p>
            <p className="mt-2 text-sm">
              A: The new service worker installs alongside the old one and
              enters a &quot;waiting&quot; state until all tabs using the old
              service worker are closed. Detect the waiting state and notify
              the user (&quot;New version available — refresh to update&quot;).
              On user confirmation, call skipWaiting() to activate the new
              service worker and clients.claim() to take control immediately.
              Alternatively, use skipWaiting() and clients.claim() automatically
              for minor updates, but this risks breaking tabs with the old
              version loaded — test carefully.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/progressive-web-apps/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Progressive Web Apps Guide
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Service Worker API
            </a>
          </li>
          <li>
            <a
              href="https://offlinefirst.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Offline First — Resources and Manifesto
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/web/tools/workbox"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Workbox — Service Worker Library by Google
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/pwa-checklist"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — PWA Checklist
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

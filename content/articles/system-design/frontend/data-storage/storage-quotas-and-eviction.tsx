"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-storage-quotas-and-eviction-concise",
  title: "Storage Quotas and Eviction",
  description:
    "Comprehensive guide to browser storage quotas, eviction policies, StorageManager API, persistent storage, and strategies for managing client-side storage limits.",
  category: "frontend",
  subcategory: "data-storage",
  slug: "storage-quotas-and-eviction",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: [
    "frontend",
    "storage",
    "quotas",
    "eviction",
    "StorageManager",
    "persistent storage",
  ],
  relatedTopics: ["localstorage", "indexeddb", "cache-api"],
};

export default function StorageQuotasAndEvictionConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          Every browser enforces <strong>storage quotas</strong> that limit how
          much data a single origin can persist on disk. These quotas exist
          because browsers share a finite disk with the operating system, other
          applications, and other origins. When the available pool is exhausted
          or the device runs low on space, the browser triggers an{" "}
          <strong>eviction</strong> process that removes entire origins' data to
          reclaim disk space. Understanding these limits and their enforcement
          mechanisms is critical for any engineer building offline-capable,
          data-intensive, or media-rich web applications.
        </p>
        <p>
          The quotas apply to the pool of storage shared by IndexedDB, the Cache
          API, and the Origin Private File System (OPFS). Notably,{" "}
          <code>localStorage</code> and <code>sessionStorage</code> operate
          under a separate, much smaller fixed limit (typically 5-10 MB per
          origin) and are not part of this shared quota pool. This distinction
          is important: a large IndexedDB database does not reduce your
          localStorage capacity, and vice versa.
        </p>
        <p>
          Modern browsers expose the <code>navigator.storage</code> API (the
          StorageManager interface) for querying current usage and quota, and
          for requesting persistent storage that survives eviction. Before this
          API existed, developers had no reliable way to know how much space was
          available or whether their data might be silently deleted. At the
          staff/principal engineer level, you are expected to design storage
          architectures that respect these limits, handle{" "}
          <code>QuotaExceededError</code> gracefully, implement cleanup
          strategies proactively, and choose the right persistence guarantees
          for different classes of data.
        </p>
        <p>
          The eviction model follows a <strong>best-effort</strong> default: the
          browser may delete your origin's data at any time without warning when
          under storage pressure. This is not hypothetical. Safari is known for
          aggressively evicting data after 7 days of inactivity in some
          configurations, and all browsers will evict best-effort origins when
          the device runs low on disk. The only defense is requesting{" "}
          <strong>persistent storage</strong> via{" "}
          <code>navigator.storage.persist()</code>, which tells the browser to
          exempt your origin from automatic eviction.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <h3 className="mt-6 mb-3 font-semibold">StorageManager API</h3>
        <p>
          The <code>StorageManager</code> interface, accessed via{" "}
          <code>navigator.storage</code>, provides two essential methods for
          quota management:
        </p>
        <ul>
          <li>
            <strong>navigator.storage.estimate():</strong> Returns a Promise
            resolving to an object with <code>usage</code> (bytes currently
            consumed) and <code>quota</code> (maximum bytes available to this
            origin). These are estimates, not exact values. Browsers may round
            or pad the numbers to prevent fingerprinting. In Chrome, the quota
            is approximately 60% of total disk space, divided among origins. In
            Firefox, it is approximately 50% of disk, with a per-origin cap of 2
            GB (10 GB for persistent origins). Safari starts with roughly 1 GB
            and prompts the user for more. The <code>usageDetails</code>{" "}
            property (Chrome-specific, non-standard) breaks down usage by
            storage system (indexedDB, caches, serviceWorkerRegistrations).
          </li>
          <li>
            <strong>navigator.storage.persist():</strong> Requests that the
            browser grant persistent storage to this origin. Returns a Promise
            resolving to a boolean indicating whether persistent storage was
            granted. The decision criteria vary: Chrome auto-grants for
            installed PWAs, sites with high engagement, bookmarked sites, or
            sites with push notification permissions. Firefox prompts the user
            with a permission dialog. Safari does not support this API. Once
            granted, persistent storage means the browser will <em>not</em>{" "}
            evict this origin's data under storage pressure (the user can still
            manually clear it).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-semibold">
          Best-Effort vs. Persistent Buckets
        </h3>
        <p>
          All origin storage starts as <strong>best-effort</strong> by default.
          Best-effort data can be evicted by the browser at any time when under
          storage pressure, without user interaction or notification.
          <strong> Persistent</strong> storage (requested via{" "}
          <code>persist()</code>) is protected from automatic eviction. You can
          check current persistence status with{" "}
          <code>navigator.storage.persisted()</code>, which returns a boolean.
        </p>
        <p>
          The distinction is critical for application architecture.
          User-generated content (documents, drafts, photos) should be in
          persistent storage. Cached API responses and precached assets can
          remain best-effort since they can be re-fetched from the network.
        </p>

        <h3 className="mt-6 mb-3 font-semibold">
          Per-Origin and Global Limits
        </h3>
        <p>
          Browser quotas operate at two levels. The{" "}
          <strong>global limit</strong> caps the total disk space all origins
          can use collectively (Chrome: ~60% of disk, Firefox: ~50%). The{" "}
          <strong>per-origin limit</strong> caps what any single origin can
          consume from that global pool. In Chrome, a single origin can use up
          to approximately 60% of the total storage pool (so roughly 36% of
          total disk). In Firefox, the per-origin cap is 2 GB in best-effort
          mode, raised to 10 GB for persistent origins. These numbers shift with
          browser versions and should be queried dynamically via{" "}
          <code>estimate()</code>.
        </p>

        <h3 className="mt-6 mb-3 font-semibold">LRU Eviction Order</h3>
        <p>
          When eviction is triggered, browsers sort best-effort origins by{" "}
          <strong>least recently used</strong> (LRU). The origin that has gone
          the longest without user interaction is evicted first. Eviction is{" "}
          <strong>all-or-nothing per origin</strong>: the browser deletes all
          IndexedDB databases, all Cache API caches, all OPFS files, and the
          Service Worker registration for that origin in a single atomic
          operation. It never partially evicts (e.g., deleting one IndexedDB
          database but keeping another). This all-or-nothing model simplifies
          the browser's implementation but means applications cannot protect
          individual databases from eviction independently.
        </p>

        <h3 className="mt-6 mb-3 font-semibold">
          localStorage's Separate Limit
        </h3>
        <p>
          The <code>localStorage</code> API has a fixed per-origin limit of
          approximately 5 MB in most browsers (10 MB in some). This is entirely
          separate from the shared quota pool. localStorage stores strings only,
          uses a synchronous API that blocks the main thread, and throws a{" "}
          <code>QuotaExceededError</code> when full. It is not subject to the
          LRU eviction process (except in Safari, which may clear it under
          certain conditions like 7-day inactivity in private browsing or ITP
          enforcement).
        </p>

        <h3 className="mt-6 mb-3 font-semibold">Opaque Response Padding</h3>
        <p>
          When the Cache API stores an opaque response (a cross-origin response
          fetched without CORS), browsers add <strong>padding</strong> to the
          reported size. This prevents attackers from using storage quotas as an
          oracle to determine the size of cross-origin resources. Chrome adds a
          fixed padding of approximately 7 MB per opaque response. This means
          caching 50 opaque responses could consume 350 MB of quota even if the
          actual response bodies total only a few MB. This is a common source of
          unexpected
          <code>QuotaExceededError</code> in applications that cache third-party
          assets.
        </p>

        <h3 className="mt-6 mb-3 font-semibold">
          Storage Buckets API (Emerging)
        </h3>
        <p>
          The <strong>Storage Buckets API</strong> is a proposal (Chrome 122+
          behind a flag) that allows origins to create named buckets with
          individual persistence and quota policies. Instead of a single
          per-origin bucket, you could create{" "}
          <code>
            navigator.storageBuckets.open('media', {"{"} persisted: true {"}"})
          </code>{" "}
          for important media and a separate best-effort bucket for temporary
          caches. Each bucket gets its own IndexedDB, Cache API, and OPFS
          instances. This would replace the current all-or-nothing eviction
          model with fine-grained control, but as of early 2026, it is not yet
          widely available.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Understanding how disk space flows from the hardware level down to
          individual storage APIs is essential for designing applications that
          respect browser limits. The following diagram illustrates how the
          browser carves out its storage pool and allocates it per origin.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/storage-quota-breakdown.svg"
          alt="Browser Storage Quota Breakdown"
          caption="Disk space allocation: total disk to browser pool to per-origin quota. IndexedDB, Cache API, and OPFS share a single pool, while localStorage has a separate fixed limit."
        />

        <p>
          When the browser detects storage pressure (either the global pool is
          nearing capacity or the device itself is low on disk), it initiates
          the eviction process. The following diagram shows how eviction
          decisions are made and why persistent storage is the key defense
          mechanism.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/eviction-policy.svg"
          alt="Browser Storage Eviction Policy"
          caption="Eviction flow: storage pressure triggers LRU sorting, persistent origins are skipped, best-effort origins are evicted atomically (all storage for that origin deleted together)."
        />

        <p>
          The architecture has several implications for application design.
          First, your application cannot predict <em>when</em> eviction will
          occur because it depends on other origins' behavior and the user's
          overall disk usage. Second, because eviction is atomic per origin,
          there is no way to prioritize one IndexedDB database over another
          within the same origin. Third, the only reliable way to survive
          eviction is to either request persistent storage or design your
          application to gracefully re-hydrate from the server when local data
          is missing.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <p>
          Browser quota policies differ significantly. Understanding these
          differences is essential for building cross-browser applications:
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Chrome / Edge</th>
              <th className="p-3 text-left">Firefox</th>
              <th className="p-3 text-left">Safari</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Global Pool</strong>
              </td>
              <td className="p-3">~60% of total disk</td>
              <td className="p-3">~50% of total disk</td>
              <td className="p-3">~1 GB initial, prompts for more</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Per-Origin Limit</strong>
              </td>
              <td className="p-3">~60% of pool (~36% of disk)</td>
              <td className="p-3">2 GB (best-effort), 10 GB (persistent)</td>
              <td className="p-3">~1 GB, user-prompted increases</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>persist() Behavior</strong>
              </td>
              <td className="p-3">
                Auto-granted (heuristics: PWA install, engagement, bookmarks)
              </td>
              <td className="p-3">User permission prompt</td>
              <td className="p-3">Not supported</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Eviction Trigger</strong>
              </td>
              <td className="p-3">Storage pressure (global pool full)</td>
              <td className="p-3">Storage pressure (global pool full)</td>
              <td className="p-3">7-day inactivity (ITP), storage pressure</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Opaque Response Padding</strong>
              </td>
              <td className="p-3">~7 MB per response</td>
              <td className="p-3">Variable padding</td>
              <td className="p-3">Variable padding</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>localStorage Limit</strong>
              </td>
              <td className="p-3">~5 MB</td>
              <td className="p-3">~5 MB (10 MB for persistent)</td>
              <td className="p-3">~5 MB</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>StorageManager API</strong>
              </td>
              <td className="p-3">
                Full support (estimate, persist, persisted)
              </td>
              <td className="p-3">Full support</td>
              <td className="p-3">estimate() only (partial)</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4">
          The most significant trade-off is between <strong>persistent</strong>{" "}
          and <strong>best-effort</strong> storage. Persistent storage
          guarantees data survival but requires user trust (and in Firefox,
          explicit permission). Best-effort storage is available immediately but
          can be silently deleted. For most applications, the right strategy is
          a hybrid: request persistent storage for user-critical data
          (documents, settings, offline drafts) while keeping caches and
          prefetched data as best-effort. If persistence is denied, design the
          application to re-sync from the server gracefully.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          These practices come from production experience building PWAs and
          offline-first applications at scale:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Always Check Quota Before Large Writes:</strong> Before
            storing a large asset (video, image set, offline dataset), call{" "}
            <code>navigator.storage.estimate()</code> and verify that{" "}
            <code>quota - usage</code> exceeds the size of the write with a
            safety margin (at least 10%). This prevents{" "}
            <code>QuotaExceededError</code> and allows you to present the user
            with a meaningful message or trigger a cleanup before the write
            attempt.
          </li>
          <li>
            <strong>Request Persistent Storage for Critical Apps:</strong> If
            your application stores user-generated content (documents, media,
            form drafts) or must work offline reliably (field service apps,
            healthcare), call <code>navigator.storage.persist()</code> early in
            the application lifecycle, ideally after a user interaction that
            signals engagement (e.g., after the user saves their first
            document). Check the result and inform the user of the storage
            guarantee level.
          </li>
          <li>
            <strong>Implement Proactive Cache Cleanup:</strong> Do not wait for{" "}
            <code>QuotaExceededError</code>. Implement a periodic cleanup
            routine that deletes old Service Worker caches (using versioned
            cache names), removes expired IndexedDB records (using a timestamp
            index), and prunes least-recently-used items. Run this during idle
            time using <code>requestIdleCallback</code>.
          </li>
          <li>
            <strong>Handle QuotaExceededError at Every Write:</strong> Wrap
            every IndexedDB transaction, <code>cache.put()</code>, and{" "}
            <code>localStorage.setItem()</code> in error handling that catches{" "}
            <code>QuotaExceededError</code> specifically. When caught, trigger
            cleanup, notify the user, and retry or degrade gracefully. Never let
            an unhandled quota error crash the application.
          </li>
          <li>
            <strong>Design for Data Loss:</strong> Assume that best-effort
            storage can vanish at any time. Always have a server-side source of
            truth. When the application starts, check if expected local data
            exists. If not, re-sync from the server rather than showing an
            error. This makes eviction invisible to the user.
          </li>
          <li>
            <strong>Avoid Caching Opaque Responses Unnecessarily:</strong> Due
            to the 7 MB padding per opaque response in Chrome, be selective
            about which cross-origin resources you cache. If you must cache
            cross-origin assets, configure CORS headers on the origin server so
            responses are not opaque. Monitor your Cache API usage via{" "}
            <code>estimate()</code> to detect unexpected quota consumption.
          </li>
          <li>
            <strong>Monitor Storage Usage in Production:</strong> Log{" "}
            <code>navigator.storage.estimate()</code> results to your analytics
            pipeline. Track quota utilization percentages across your user base.
            Set alerts for when the p90 usage exceeds 50% of quota. This gives
            you early warning before users start hitting quota limits.
          </li>
          <li>
            <strong>Use Storage Buckets API When Available:</strong> As browser
            support matures, adopt the Storage Buckets API to create separate
            buckets with distinct persistence policies. This eliminates the
            all-or-nothing eviction problem by letting you mark critical data
            buckets as persistent while keeping cache buckets as best-effort.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These pitfalls have caused real production issues in data-heavy web
          applications:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Safari Aggressive Eviction in Private Browsing:</strong> In
            Safari's private browsing mode, IndexedDB and Cache API storage may
            be capped at extremely low limits or cleared when the tab closes.
            Even in normal mode, Safari's Intelligent Tracking Prevention (ITP)
            can clear all client-side storage for origins that have not been
            visited in 7 days. Applications that rely on persistent local data
            must account for Safari's behavior by always having a server
            fallback and checking for data existence on every page load.
          </li>
          <li>
            <strong>Assuming Unlimited Storage:</strong> Developers who test on
            desktop Chrome with 500 GB disks rarely encounter quota limits. But
            mobile devices often have 16-64 GB of total storage, shared with
            apps, photos, and the OS. A 60% Chrome quota on a 32 GB phone with 8
            GB free gives you roughly 4.8 GB total, shared across all origins.
            Your application may only get a fraction of that in practice.
          </li>
          <li>
            <strong>Not Handling QuotaExceededError:</strong> The most common
            failure mode. Developers wrap IndexedDB writes in try/catch but
            forget that <code>cache.put()</code> and <code>cache.addAll()</code>{" "}
            in Service Workers also throw <code>QuotaExceededError</code>. An
            unhandled error in the SW install event causes the entire Service
            Worker installation to fail, leaving users stuck on the old version
            indefinitely.
          </li>
          <li>
            <strong>Opaque Response Inflation:</strong> Caching third-party
            fonts, analytics scripts, or CDN images without CORS results in
            opaque responses. Each padded at 7 MB in Chrome, 100 such responses
            consume 700 MB of quota. The actual network data might be only 5 MB
            total. The fix is to add CORS headers (
            <code>Access-Control-Allow-Origin</code>) to third-party resources,
            or use <code>crossorigin</code> attributes on {"<"}link{">"} and{" "}
            {"<"}script{">"} tags.
          </li>
          <li>
            <strong>Ignoring estimate() Inaccuracy:</strong> The values from{" "}
            <code>estimate()</code> are intentionally imprecise. Browsers may
            report rounded values to prevent storage-based fingerprinting. Do
            not use <code>estimate()</code> to calculate exact available bytes.
            Instead, use it as an approximate gauge and always handle write
            failures regardless of what the estimate reported.
          </li>
          <li>
            <strong>Not Testing Eviction Scenarios:</strong> Most test
            environments never trigger eviction because they have ample disk
            space. Use Chrome DevTools {">"} Application {">"} Storage to
            simulate quota limits. Test what happens when your application
            starts with empty storage after an eviction. If it crashes or shows
            a blank screen, your eviction resilience is insufficient.
          </li>
          <li>
            <strong>Conflating Persistence with Durability:</strong> Persistent
            storage prevents automatic browser eviction, but it does not protect
            against the user manually clearing site data, browser updates that
            reset storage, or OS-level storage cleanup tools. Never treat
            client-side storage as the sole copy of important data. Always sync
            to a server.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Storage quota management is critical in several classes of
          applications:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Progressive Web Applications (PWAs):</strong> PWAs like
            Spotify Web, Twitter/X, and Pinterest rely heavily on Service Worker
            caches and IndexedDB for offline functionality and instant loading.
            These applications request persistent storage to protect cached
            assets and user data from eviction. They implement tiered storage
            strategies: core app shell in persistent cache, media content in
            best-effort cache with LRU cleanup.
          </li>
          <li>
            <strong>Media-Heavy Applications:</strong> Video editing tools
            (Clipchamp), photo editors (Photopea), and music production apps
            (BandLab) store large binary assets locally for performance. These
            applications must actively manage quota: pre-checking available
            space before imports, streaming large files through OPFS rather than
            loading them entirely into memory, and implementing export-and-purge
            workflows to keep usage within limits.
          </li>
          <li>
            <strong>Offline-First Field Applications:</strong> Applications used
            in areas with unreliable connectivity (construction sites, rural
            healthcare, warehouse management) cache entire datasets locally in
            IndexedDB. These applications request persistent storage as a
            critical requirement, implement background sync for data upload when
            connectivity returns, and maintain detailed storage usage dashboards
            so field workers can manage their device space.
          </li>
          <li>
            <strong>E-commerce with Offline Browse:</strong> Some e-commerce
            PWAs cache product catalogs (images, descriptions, prices) for
            offline browsing. A catalog of 10,000 products with thumbnail images
            can easily consume 500 MB+. These applications implement smart
            caching that prioritizes recently viewed and wishlisted products,
            evicts least-viewed products first, and uses <code>estimate()</code>{" "}
            to decide how deep to prefetch.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            When NOT to Worry About Storage Quotas
          </h3>
          <p>Not every application needs quota management:</p>
          <ul className="mt-2 space-y-2">
            <li>
              &bull; <strong>Small localStorage-only apps:</strong> If you only
              store preferences, tokens, and small JSON in localStorage (under 1
              MB), quota management is unnecessary. The 5 MB limit is more than
              sufficient.
            </li>
            <li>
              &bull;{" "}
              <strong>
                Server-rendered applications with no offline mode:
              </strong>{" "}
              Traditional server-side applications that do not cache data
              locally have no quota concerns. HTTP caching is managed by the
              browser automatically.
            </li>
            <li>
              &bull; <strong>Short-session applications:</strong> Applications
              like online exams or survey tools where sessions last minutes to
              hours rarely accumulate enough data to approach quotas. Use{" "}
              <code>sessionStorage</code> which is cleared when the tab closes.
            </li>
            <li>
              &bull;{" "}
              <strong>Applications already behind authentication:</strong> If
              users must be online to authenticate, you can re-fetch all data
              post-login. Eviction just means a slightly slower first load after
              re-authentication.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: A user reports that your PWA lost all its offline data after
              not using it for a week. The user is on Safari. What happened and
              how would you prevent it?
            </p>
            <p className="mt-2 text-sm">
              A: Safari's Intelligent Tracking Prevention (ITP) enforces a 7-day
              cap on client-side storage for origins that the user has not
              interacted with. After 7 days of inactivity, Safari may delete all
              IndexedDB databases, Cache API caches, and Service Worker
              registrations for that origin. This is Safari's anti-tracking
              measure, not standard eviction behavior. Unlike Chrome and
              Firefox, Safari does not support navigator.storage.persist(), so
              there is no API-level defense. Mitigation strategies: (1)
              implement background sync or periodic push notifications that
              count as "interaction" to reset the 7-day timer; (2) ensure the
              server is always the source of truth and the application
              gracefully re-syncs when local data is missing; (3) add the PWA to
              the home screen, which in some Safari versions exempts the origin
              from ITP restrictions; (4) inform users on Safari about the
              limitation and recommend adding to home screen for reliable
              offline access.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: You are building an application that needs to cache 2 GB of map
              tiles for offline use. How would you design the storage
              architecture to handle quota limits across browsers?
            </p>
            <p className="mt-2 text-sm">
              A: First, query available space with navigator.storage.estimate()
              and verify 2 GB fits within the quota (on Firefox best-effort, the
              per-origin cap is 2 GB so you would be at the limit). Request
              persistent storage via persist() to prevent eviction and
              potentially raise the limit (Firefox raises to 10 GB for
              persistent origins). Store tiles in IndexedDB or OPFS rather than
              the Cache API to avoid opaque response padding issues. Implement a
              tile priority system: cache the user's home region and frequently
              visited areas first, using a spatial index to determine which
              tiles to prefetch. For Safari (which has a ~1 GB initial limit and
              no persist() support), implement a reduced offline mode with lower
              zoom levels only, and show users how much space is available.
              Implement an LRU eviction policy for tiles: when approaching 80%
              quota, remove the least recently accessed tile regions. Add a
              settings UI where users can manage their offline regions and see
              storage consumption. Always handle QuotaExceededError by removing
              the oldest tiles and retrying the write.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Explain the difference between storage eviction and the user
              clearing site data. How does persistent storage protect against
              each?
            </p>
            <p className="mt-2 text-sm">
              A: Storage eviction is an automatic browser process triggered by
              storage pressure. The browser selects best-effort origins sorted
              by LRU and deletes all their data (IndexedDB, Cache API, OPFS, SW
              registration) atomically. Persistent storage (via persist())
              protects against this: persistent origins are skipped during
              automatic eviction. However, persistent storage does not protect
              against the user manually clearing site data via browser settings
              &gt; "Clear browsing data" or site-specific &gt; "Clear data."
              When the user explicitly clears data, all storage is deleted
              regardless of persistence status. Additionally, persistent storage
              does not protect against browser uninstallation, device factory
              reset, or OS-level storage cleanup tools. The architectural
              takeaway is that persistent storage is a defense against
              browser-automated eviction only. For true durability, you must
              sync data to a server. Design the client as a performance cache
              layer, not the canonical data store.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the key differences between best-effort and persistent
              storage? When would you request persistent storage?
            </p>
            <p className="mt-2 text-sm">
              A: Best-effort storage is the default: the browser can evict data
              at any time when storage pressure occurs. Persistent storage is
              granted via navigator.storage.persist() and protects against
              automatic eviction. Persistent storage is ideal for: PWAs with
              critical offline data, applications with large user-generated
              content, databases that would be expensive to re-sync, and apps
              where data loss would significantly impact user experience.
              Request persistent storage after the user has demonstrated
              engagement (e.g., added to home screen, used the app multiple
              times). Don't request it on first visit — browsers may deny the
              request for untrusted origins. Check storage.estimate() before
              requesting to ensure you actually need it.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/articles/storage-for-the-web"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Storage for the Web - web.dev
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/StorageManager"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              StorageManager API - MDN Web Docs
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Storage Quotas and Eviction Criteria - MDN Web Docs
            </a>
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/web-platform/storage-buckets"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Storage Buckets API - Chrome Developers
            </a>
          </li>
          <li>
            <a
              href="https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Full Third-Party Cookie Blocking and More - WebKit Blog (Safari
              ITP storage implications)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

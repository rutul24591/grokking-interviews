"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-application-cache-concise",
  title: "Application Cache (AppCache)",
  description: "Guide to the deprecated Application Cache API covering its history, why it failed, manifest format, and migration path to Service Workers.",
  category: "frontend",
  subcategory: "caching-strategies",
  slug: "application-cache",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "caching", "AppCache", "deprecated", "service-worker", "migration"],
  relatedTopics: ["service-worker-caching", "browser-caching", "caching-patterns"],
};

export default function ApplicationCacheConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Application Cache (AppCache)</strong> was an HTML5 API introduced around 2009 that promised simple
          offline support for web applications through a declarative manifest file. The idea was compelling: add a
          single <code>manifest</code> attribute to your <code>{'&lt;'}html{'&gt;'}</code> tag, point it at a plain-text
          manifest file listing the resources you wanted cached, and the browser would handle the rest. No JavaScript
          required for basic offline functionality.
        </p>
        <p>
          AppCache arrived during the early wave of HTML5 excitement alongside localStorage, the History API, and Web
          Workers. The W3C standardized it in the HTML5 specification, and by 2010-2011 all major browsers had shipped
          implementations. For a brief period it was the only standards-based mechanism for building offline-capable
          web applications, predating Service Workers by several years.
        </p>
        <p>
          The honeymoon was short-lived. Developers quickly discovered a series of deeply unintuitive behaviors and
          architectural constraints that made AppCache nearly impossible to use correctly in production. Jake
          Archibald&apos;s landmark 2012 article &quot;Application Cache is a Douchebag&quot; catalogued these issues
          and became the rallying point for the community&apos;s frustration. By 2015, the WHATWG had deprecated
          AppCache from the HTML Living Standard. Chrome removed it from non-secure contexts in Chrome 50 (2016),
          Firefox removed it entirely in Firefox 85 (January 2021), and Chrome followed suit in Chrome 93 (August 2021).
          Today, no modern browser supports AppCache in its full form.
        </p>
        <p>
          Despite being dead technology, AppCache remains interview-relevant for staff and principal engineers because
          it illustrates a critical lesson in API design: <strong>implicit behavior and declarative-only APIs with
          opaque semantics create systems that are easy to start with but impossible to debug or extend.</strong> It
          also provides essential context for understanding why Service Workers were designed the way they were &mdash;
          nearly every Service Worker design decision is a direct reaction to an AppCache failure.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          AppCache revolved around a <strong>cache manifest file</strong>, a plain-text document served with the MIME
          type <code>text/cache-manifest</code>. The manifest declared three categories of resources:
        </p>

        <ul>
          <li>
            <strong>CACHE (Explicit Section):</strong> Resources listed here were downloaded and cached on the first
            visit. Once cached, the browser would always serve them from the AppCache, even when online, until the
            manifest itself changed. This was the default section &mdash; any URL listed before the first section
            header was implicitly in the CACHE section.
          </li>
          <li>
            <strong>NETWORK (Online Whitelist):</strong> URLs or patterns listed here were never cached and always
            fetched from the network. The wildcard <code>*</code> meant &quot;allow any URL not explicitly cached to
            go to the network.&quot; Without this wildcard, any resource not in CACHE or FALLBACK would fail when
            fetched, even if the user was online.
          </li>
          <li>
            <strong>FALLBACK (Fallback Entries):</strong> Pairs of URL patterns and fallback resources. If a network
            request matching the pattern failed (offline or server error), the browser would serve the fallback
            resource instead. This was how you provided offline fallback pages.
          </li>
        </ul>

        <h3>Implicit Master Entries</h3>
        <p>
          One of AppCache&apos;s most problematic features was the <strong>master entry</strong> concept. Any HTML page
          that referenced a manifest file via the <code>manifest</code> attribute was automatically added to the cache
          as a &quot;master entry,&quot; even if it was not listed in the manifest&apos;s CACHE section. This meant
          that simply visiting a page with a manifest attribute would cache that page&apos;s HTML &mdash; permanently,
          until the manifest changed. Developers who didn&apos;t understand this would find that their pages were being
          served stale forever.
        </p>

        <h3>Update Mechanism</h3>
        <p>
          AppCache updated through a specific lifecycle. On each page load, the browser checked if the manifest file
          had changed (byte-for-byte comparison of the manifest content, not its resources). If the manifest was
          unchanged, the browser fired a <code>noupdate</code> event and served everything from cache. If the manifest
          had changed, the browser downloaded all resources listed in the manifest again (not just the changed ones),
          stored them in a new version of the cache, and fired the <code>updateready</code> event. Critically, the
          page continued to use the old cache until the next full page load, creating the infamous
          &quot;double-reload&quot; problem.
        </p>

        <h3>applicationCache API Events</h3>
        <p>The <code>window.applicationCache</code> object exposed a state machine with these events:</p>
        <ul>
          <li><strong>checking:</strong> Browser is checking the manifest for updates</li>
          <li><strong>downloading:</strong> Browser is downloading resources listed in the manifest</li>
          <li><strong>progress:</strong> Fired for each resource downloaded (with index and total counts)</li>
          <li><strong>cached:</strong> All resources successfully cached for the first time</li>
          <li><strong>updateready:</strong> A new version of the cache is available (after manifest change)</li>
          <li><strong>noupdate:</strong> Manifest has not changed since last check</li>
          <li><strong>error:</strong> Manifest fetch failed, or a resource in the manifest could not be fetched</li>
          <li><strong>obsolete:</strong> Manifest returned a 404 or 410, signaling the cache should be deleted</li>
        </ul>
        <p>
          Developers could call <code>applicationCache.update()</code> to programmatically trigger a manifest check,
          and <code>applicationCache.swapCache()</code> to activate a newly downloaded cache version. However,
          <code>swapCache()</code> only affected future resource loads &mdash; it did not update any already-loaded
          resources on the current page, which still required a full page reload.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Understanding AppCache&apos;s architecture requires tracing two distinct scenarios: the first visit (when no
          cache exists) and subsequent visits (when the cache is populated). The flow reveals the &quot;cache-first&quot;
          design that was both AppCache&apos;s defining feature and its fatal flaw.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">First Visit Flow</h3>
          <ol className="space-y-3">
            <li><strong>1. Browser Request:</strong> User navigates to a page with <code>{'&lt;'}html manifest=&quot;app.appcache&quot;{'&gt;'}</code></li>
            <li><strong>2. Normal Load:</strong> Browser loads the page and its resources normally from the network</li>
            <li><strong>3. Manifest Download:</strong> Browser fetches the manifest file after the page loads</li>
            <li><strong>4. Resource Caching:</strong> Browser downloads and caches all resources listed in the CACHE section</li>
            <li><strong>5. Master Entry:</strong> The current page&apos;s HTML is implicitly added to the cache as a master entry</li>
            <li><strong>6. Cached Event:</strong> Browser fires the <code>cached</code> event on <code>window.applicationCache</code></li>
          </ol>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Subsequent Visit Flow (The Problem)</h3>
          <ol className="space-y-3">
            <li><strong>1. Cache-First Load:</strong> Browser serves the page HTML from AppCache immediately (not from network)</li>
            <li><strong>2. All Resources from Cache:</strong> All cached resources are served from AppCache &mdash; no network requests</li>
            <li><strong>3. Background Check:</strong> Browser checks if the manifest file has changed (byte comparison)</li>
            <li><strong>4a. If Unchanged:</strong> Fires <code>noupdate</code>. Page remains on current cache version. Done.</li>
            <li><strong>4b. If Changed:</strong> Downloads ALL resources listed in manifest (not just changed ones)</li>
            <li><strong>5. Update Ready:</strong> Fires <code>updateready</code>. New cache is stored but NOT active</li>
            <li><strong>6. Double Reload:</strong> User must reload the page AGAIN to see the new version</li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/manifest-flow.svg"
          alt="AppCache Manifest Update Flow Diagram"
          caption="AppCache update flow showing the problematic double-reload cycle and implicit master entry caching"
        />

        <p>
          The key architectural insight is that AppCache always served from cache first, then checked for updates in
          the background. There was no way to bypass this behavior. You could not say &quot;check the network first
          and fall back to cache.&quot; You could not selectively update one resource. You could not invalidate a
          single cached entry. The cache was all-or-nothing, and the update was always one load cycle behind.
        </p>
        <p>
          This architecture was acceptable for truly static applications (e.g., a calculator app or a simple game)
          where the content rarely changed. But for any application with dynamic content, user-generated data, or
          frequent deployments, it was a disaster. Developers would push an update, users would visit the site, see
          the old version, and have to reload to see the new one &mdash; if they even knew to do so.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <p>
          The comparison between AppCache and Service Workers is central to understanding why the migration happened
          and why Service Workers are designed as they are.
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">AppCache (Deprecated)</th>
              <th className="p-3 text-left">Service Workers (Modern)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Flexibility</strong></td>
              <td className="p-3">
                Declarative only. Cache behavior defined in static manifest file. No conditional logic possible.
              </td>
              <td className="p-3">
                Fully programmatic. Write arbitrary JavaScript to handle fetch events with any caching strategy.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Debugging</strong></td>
              <td className="p-3">
                Opaque. No visibility into what&apos;s cached or why. Errors were silent or cryptic. Chrome&apos;s
                chrome://appcache-internals was the only inspection tool.
              </td>
              <td className="p-3">
                Full DevTools support. Cache Storage inspector, Network panel shows SW interception, source debugging,
                console logging within the worker.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Update Control</strong></td>
              <td className="p-3">
                All-or-nothing. Any manifest change re-downloads everything. Double-reload required to see new version.
              </td>
              <td className="p-3">
                Granular. Update individual cache entries. skipWaiting() for immediate activation. Clients.claim()
                for taking control of existing pages.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Fallback Pages</strong></td>
              <td className="p-3">
                Built-in FALLBACK section with URL prefix matching. Simple but inflexible &mdash; could not vary
                fallback by request type or headers.
              </td>
              <td className="p-3">
                Programmatic fallback in fetch handler. Can inspect request method, headers, URL, and respond with
                any cached or generated response.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Cache Strategies</strong></td>
              <td className="p-3">
                Cache-first only. No stale-while-revalidate, network-first, or cache-only-if-offline options.
              </td>
              <td className="p-3">
                Any strategy: cache-first, network-first, stale-while-revalidate, cache-only, network-only, or
                custom combinations. Libraries like Workbox provide prebuilt strategies.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Browser Support (2026)</strong></td>
              <td className="p-3">
                Removed from all major browsers. Chrome 93+, Firefox 85+, Safari 16+ have dropped support.
              </td>
              <td className="p-3">
                Universal support across all modern browsers including iOS Safari (since 11.3).
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Scope of Control</strong></td>
              <td className="p-3">
                Only caches GET requests. Cannot intercept POST, PUT, or other methods. Cannot modify requests
                or responses.
              </td>
              <td className="p-3">
                Intercepts all fetch events. Can modify requests, forge responses, handle navigation, manage
                background sync, push notifications.
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/appcache-vs-sw.svg"
          alt="AppCache vs Service Workers Comparison Diagram"
          caption="Side-by-side comparison highlighting why Service Workers replaced the declarative, inflexible AppCache model"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Since AppCache is deprecated and removed, best practices focus entirely on <strong>detection and migration</strong>.
          If you encounter AppCache in a legacy codebase, here is the recommended migration path.
        </p>

        <ol className="space-y-3">
          <li>
            <strong>Audit for AppCache Usage:</strong> Search your codebase for <code>manifest=</code> attributes on
            <code>{'&lt;'}html{'&gt;'}</code> tags and any <code>.appcache</code> or <code>.manifest</code> files. Check
            for references to <code>window.applicationCache</code> in JavaScript. Run Lighthouse audits which flag
            AppCache usage as an error.
          </li>
          <li>
            <strong>Inventory Cached Resources:</strong> Parse the existing manifest file to understand which resources
            are cached, which are network-only, and which have fallbacks. This becomes your requirements document for
            the Service Worker migration.
          </li>
          <li>
            <strong>Implement Service Worker Equivalent:</strong> For each CACHE entry, add it to a precache list in
            your Service Worker (Workbox&apos;s <code>precacheAndRoute()</code> is ideal). For each NETWORK entry,
            configure a network-only strategy. For each FALLBACK pair, implement a fetch handler that catches network
            errors and returns the fallback response.
          </li>
          <li>
            <strong>Run Both in Parallel (Briefly):</strong> During migration, you can temporarily have both the
            manifest attribute and a Service Worker registered. The Service Worker takes precedence for fetch
            interception when both are present. This gives you a safety net during testing.
          </li>
          <li>
            <strong>Remove AppCache Artifacts:</strong> Delete the manifest file, remove the <code>manifest</code>
            attribute from HTML, and remove any <code>applicationCache</code> JavaScript code. Ensure your server
            stops serving the manifest file &mdash; or returns a 404/410 to trigger the <code>obsolete</code> event,
            which clears existing AppCaches on clients that still have them.
          </li>
          <li>
            <strong>Adopt Workbox for Maintainability:</strong> Rather than writing raw Service Worker caching logic,
            use Google&apos;s Workbox library. It provides declarative-like configuration (solving the simplicity
            problem AppCache tried to address) without sacrificing programmatic flexibility. Workbox strategies map
            cleanly to former AppCache behaviors.
          </li>
          <li>
            <strong>Test Offline Scenarios:</strong> Use Chrome DevTools Application panel to simulate offline mode.
            Verify that the Service Worker correctly serves cached resources and fallbacks. Test the update flow to
            ensure users get new versions without the double-reload problem.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Understanding <em>why</em> AppCache failed is the most valuable part of studying it. These are the specific
          design flaws that led to its deprecation, and each one informed how Service Workers were built differently.
        </p>

        <ul className="space-y-3">
          <li>
            <strong>Master Entry Caching Bug:</strong> Every page that referenced the manifest was implicitly cached.
            If you had a multi-page site and only wanted to cache static assets, too bad &mdash; every HTML page the
            user visited was cached and would be served stale on subsequent visits. Developers had no way to opt out
            of this behavior. Service Workers solve this by giving developers explicit control over what enters the
            cache through the <code>cache.put()</code> and <code>cache.addAll()</code> APIs.
          </li>
          <li>
            <strong>No Partial Updates:</strong> Changing even one byte of the manifest triggered a re-download of
            every resource listed in it. For applications with megabytes of cached assets, this meant users
            re-downloaded everything on every deployment. Service Workers allow granular cache management &mdash; you
            can update, add, or delete individual cache entries independently.
          </li>
          <li>
            <strong>Opaque Update Cycle:</strong> The update check was a byte comparison of the manifest file itself,
            not its referenced resources. If you updated a CSS file but forgot to change the manifest (e.g., bump
            a version comment), the browser would never notice. Conversely, changing the manifest re-downloaded
            everything even if no actual resources had changed.
          </li>
          <li>
            <strong>The Double-Reload Problem:</strong> On the visit where an update was detected, the user still saw
            the old cached version. The new resources were downloaded in the background and only became active on the
            next page load. This meant users were always one visit behind the current version. The only workaround was
            <code>swapCache()</code> followed by <code>location.reload()</code>, which was jarring and unreliable.
          </li>
          <li>
            <strong>No Programmatic Control:</strong> You could not dynamically decide what to cache based on runtime
            conditions (user role, network speed, device capabilities). The manifest was static and applied uniformly.
            Service Workers run arbitrary JavaScript in response to fetch events, enabling strategies like caching only
            images on slow connections, or varying cache behavior by user preference.
          </li>
          <li>
            <strong>HTTPS-Only Enforcement (Late):</strong> Initially, AppCache worked over HTTP. When browsers began
            enforcing HTTPS-only for AppCache (Chrome 50, 2016), many existing deployments broke. This was a necessary
            security measure &mdash; cache poisoning over HTTP is trivial &mdash; but it disrupted the ecosystem.
            Service Workers were designed from the start to require HTTPS (except on localhost).
          </li>
          <li>
            <strong>Cannot Cache POST Responses:</strong> AppCache could only cache GET requests. Any API call using
            POST, PUT, PATCH, or DELETE bypassed the cache entirely. For applications that used POST for data
            retrieval (a common pattern in legacy apps and GraphQL), this was a significant limitation.
          </li>
          <li>
            <strong>Silent Failures:</strong> If any single resource in the manifest failed to download, the entire
            cache update failed silently. The browser might fire an <code>error</code> event, but there was no
            information about which resource failed or why. Debugging required manually checking each URL &mdash;
            a process that could take hours for large manifest files.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          While AppCache is deprecated, understanding where it was used provides context for its design goals and
          explains why you might still encounter it in legacy systems.
        </p>

        <ul className="space-y-3">
          <li>
            <strong>Early Mobile Web Apps (2010-2014):</strong> Before native app stores dominated, companies like
            the Financial Times built web apps using AppCache for offline reading. The FT&apos;s web app was one of
            the most prominent AppCache users, eventually migrating to Service Workers. Mobile Safari&apos;s early
            support for AppCache (before Service Workers) made it the only option for iOS web app offline support.
          </li>
          <li>
            <strong>Simple Offline Tools:</strong> Calculator apps, unit converters, reference guides, and single-page
            utilities were good fits for AppCache because they had static content that rarely changed. The all-or-nothing
            caching model was acceptable when &quot;all&quot; was a small set of files.
          </li>
          <li>
            <strong>Progressive Web Apps (Early Era):</strong> Before Service Workers were standardized, AppCache was
            the foundation for early PWA-like experiences. Google promoted it as part of the &quot;mobile web
            app&quot; story circa 2011-2013.
          </li>
          <li>
            <strong>Interview Relevance Today:</strong> AppCache is frequently asked about in staff/principal engineer
            interviews not because you need to use it, but because it demonstrates understanding of: why APIs get
            deprecated, the tension between simplicity and flexibility in API design, the evolution of web platform
            capabilities, and how community feedback shapes standards (the Service Worker spec was directly informed
            by AppCache failures).
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use AppCache</h3>
          <p>
            <strong>Never.</strong> AppCache is removed from all modern browsers. There is no scenario in 2026 where
            AppCache is the correct choice. If you encounter it in a codebase, the only correct action is to migrate
            to Service Workers. If you need offline support, use the Cache API with a Service Worker. If you need
            simple offline caching without writing much code, use Workbox, which provides declarative configuration
            on top of Service Workers.
          </p>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why was Application Cache deprecated, and what specific design flaws led to its removal?</p>
            <p className="mt-2 text-sm">
              A: AppCache was deprecated because its declarative-only model created deeply unintuitive behaviors that
              could not be worked around. The three most critical flaws were: (1) implicit master entry caching, where
              every page referencing the manifest was automatically cached and served stale on return visits, with no
              opt-out mechanism; (2) the all-or-nothing update model, where any manifest change re-downloaded every
              listed resource and the new version only became active on the <em>next</em> page load (the
              double-reload problem); and (3) no programmatic control, meaning developers could not implement
              cache-first-for-some, network-first-for-others strategies, could not conditionally cache based on
              runtime state, and could not invalidate individual entries. Additionally, debugging was nearly
              impossible due to opaque error handling and lack of tooling. The community consensus, led by Jake
              Archibald&apos;s influential critique, was that the API&apos;s simplicity was deceptive &mdash; it
              was easy to set up but created production-breaking behaviors that developers could not diagnose or fix.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do Service Workers solve the problems that AppCache introduced?</p>
            <p className="mt-2 text-sm">
              A: Service Workers were designed as a direct response to AppCache&apos;s failures, addressing each
              flaw systematically. Instead of a declarative manifest, Service Workers provide a programmable network
              proxy that intercepts fetch events and lets developers write arbitrary JavaScript to decide how to
              handle each request. This enables multiple cache strategies (cache-first, network-first,
              stale-while-revalidate) applied granularly per request type or URL pattern. The Cache API provides
              explicit control over cache entries &mdash; nothing is implicitly cached, and individual entries can
              be added, updated, or deleted independently. The lifecycle model (install, activate, fetch) provides
              transparent state transitions with events at each stage, and <code>skipWaiting()</code> plus
              <code>Clients.claim()</code> solve the double-reload problem by allowing immediate activation. DevTools
              provide full visibility into registered workers, cached resources, and network interception. The only
              deliberate constraint carried over from AppCache lessons is requiring HTTPS, which was a security fix
              AppCache adopted too late.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: If you inherited a legacy application still using AppCache, how would you plan the migration to Service Workers?</p>
            <p className="mt-2 text-sm">
              A: I would approach the migration in four phases. <strong>Phase 1 (Audit):</strong> Parse the existing
              manifest file to inventory all CACHE, NETWORK, and FALLBACK entries. Identify any JavaScript using
              <code>window.applicationCache</code> events. Test the current offline behavior to establish baseline
              requirements. <strong>Phase 2 (Parallel Implementation):</strong> Register a Service Worker alongside
              the existing AppCache. The SW takes precedence for fetch interception when both are present, so this
              acts as a progressive rollout. Implement precaching for former CACHE entries using Workbox&apos;s
              <code>precacheAndRoute()</code>, network-only handlers for former NETWORK entries, and catch-based
              fallback handlers for former FALLBACK entries. <strong>Phase 3 (Validation):</strong> Test offline
              behavior, update flows, and cache invalidation in staging. Verify no double-reload issues exist.
              Confirm Lighthouse scores improve. <strong>Phase 4 (Cleanup):</strong> Remove the <code>manifest</code>
              attribute from HTML, delete the .appcache file (or return 404/410 to trigger the <code>obsolete</code>
              event on remaining clients), and remove all <code>applicationCache</code> JavaScript. Monitor error
              rates post-deployment to catch any edge cases.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://alistapart.com/article/application-cache-is-a-douchebag/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Application Cache is a Douchebag - Jake Archibald (A List Apart)
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/applicationCache" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: Window.applicationCache (Deprecated)
            </a>
          </li>
          <li>
            <a href="https://web.dev/service-worker-lifecycle/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              The Service Worker Lifecycle - web.dev
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/blog/appcache-removal/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Preparing for AppCache Removal - Chrome Developers Blog
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/workbox/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Workbox: Production-Ready Service Worker Libraries - Google
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

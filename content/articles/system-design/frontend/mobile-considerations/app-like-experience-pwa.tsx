"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-app-like-experience-pwa",
  title: "App-like Experience (PWA)",
  description:
    "Comprehensive guide to App-like Experience with Progressive Web Apps covering service workers, add to home screen, offline support, and native-like interactions.",
  category: "frontend",
  subcategory: "mobile-considerations",
  slug: "app-like-experience-pwa",
  wordCount: 5100,
  readingTime: 20,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "PWA",
    "service worker",
    "offline",
    "mobile",
    "app-like",
  ],
  relatedTopics: [
    "mobile-performance-optimization",
    "viewport-configuration",
    "offline-support",
  ],
};

export default function AppLikeExperiencePWAArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Progressive Web Apps (PWA)</strong> are web applications that
          provide app-like experiences on mobile devices. PWAs use modern web
          capabilities (service workers, web app manifests, push notifications)
          to deliver native app features: offline support, home screen icon,
          full-screen mode, push notifications, and fast loading. For
          staff-level engineers, PWAs represent a convergence of web and native
          — write once, deploy everywhere, with capabilities approaching native
          apps.
        </p>
        <p>
          PWA architecture involves several technical components.{" "}
          <strong>Service Workers</strong> — background scripts enabling offline
          support, background sync, push notifications. <strong>Web App
          Manifest</strong> — JSON file defining app metadata (name, icon,
          display mode). <strong>HTTPS</strong> — required for service workers
          (security). <strong>App Shell</strong> — cached UI shell for instant
          load.
        </p>
        <p>
          The business case for PWAs is compelling: Twitter Lite (PWA) reduced
          data usage by 70%, increased engagement by 65%. Pinterest (PWA)
          increased time spent by 40%, ad revenue by 44%. PWAs eliminate app
          store friction (no download required), work across platforms (iOS,
          Android, desktop), and update instantly (no app store review).
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Service Worker:</strong> Background script that acts as
            proxy between browser and network. Enables offline support,
            background sync, push notifications. Lifecycle: install → activate →
            fetch handling.
          </li>
          <li>
            <strong>Web App Manifest:</strong> JSON file defining app metadata.
            Properties: <code>name</code>, <code>short_name</code>,{" "}
            <code>icons</code>, <code>start_url</code>, <code>display</code>{" "}
            (standalone, fullscreen). Enables &quot;Add to Home Screen&quot;.
          </li>
          <li>
            <strong>App Shell Architecture:</strong> Cache UI shell (header,
            navigation, footer) separately from content. Shell loads instantly
            from cache, content loads dynamically. Provides app-like instant
            load.
          </li>
          <li>
            <strong>Offline Support:</strong> Service worker intercepts network
            requests, serves cached responses when offline. Strategies:
            cache-first (static assets), network-first (dynamic content),
            stale-while-revalidate.
          </li>
          <li>
            <strong>Add to Home Screen:</strong> User can install PWA to home
            screen. Triggers when manifest + service worker present, user has
            engaged with site. Shows app icon, launches in standalone mode (no
            browser UI).
          </li>
          <li>
            <strong>Push Notifications:</strong> Service workers receive push
            messages even when app is closed. Requires user permission. Enables
            re-engagement, real-time updates.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/pwa-architecture.svg"
          alt="PWA Architecture showing service worker, manifest, app shell, and offline support"
          caption="PWA architecture — service worker proxies network requests, manifest enables home screen install, app shell provides instant load"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          PWA architecture consists of a service worker (network proxy), web app
          manifest (app metadata), and caching strategies (offline support). The
          architecture must handle online/offline transitions, background sync,
          and push notifications.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/service-worker-lifecycle.svg"
          alt="Service Worker Lifecycle showing install, activate, and fetch handling phases"
          caption="Service worker lifecycle — install (cache app shell), activate (clean old caches), fetch (intercept requests, serve cached or network)"
          width={900}
          height={500}
        />

        <h3>Caching Strategies</h3>
        <p>
          <strong>Cache-First:</strong> Try cache first, fall back to network.
          Best for: static assets (CSS, JS, images). Fast, works offline.
        </p>
        <p>
          <strong>Network-First:</strong> Try network first, fall back to cache.
          Best for: dynamic content (API responses). Fresh when online, works
          offline.
        </p>
        <p>
          <strong>Stale-While-Revalidate:</strong> Serve cache immediately,
          update cache in background. Best for: frequently updated content
          (news feeds). Fast + eventually fresh.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/pwa-offline-strategies.svg"
          alt="PWA Offline Strategies showing cache-first, network-first, and stale-while-revalidate patterns"
          caption="Offline strategies — cache-first for static assets, network-first for dynamic content, stale-while-revalidate for frequently updated content"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          PWA involves trade-offs between capabilities, compatibility, and
          complexity.
        </p>

        <h3>PWA vs. Native App</h3>
        <p>
          <strong>PWA Advantages:</strong> No app store required, instant
          updates, cross-platform, smaller size, discoverable via search.
          <strong>Native Advantages:</strong> Full device API access, better
          performance, app store distribution, monetization.
        </p>
        <p>
          Best for: PWA for content apps, e-commerce, tools. Native for
          graphics-intensive apps, heavy device integration.
        </p>

        <h3>iOS vs. Android PWA Support</h3>
        <p>
          <strong>Android:</strong> Full PWA support (Chrome). Service workers,
          push notifications, add to home screen, standalone mode.
          <strong>iOS:</strong> Limited support (Safari). Service workers work,
          but no push notifications, limited background sync. Add to home screen
          works but manual (no prompt).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Implement App Shell:</strong> Cache UI shell for instant
            load. Shell includes header, navigation, footer. Content loads
            dynamically. Provides app-like instant load experience.
          </li>
          <li>
            <strong>Offline Page:</strong> Provide custom offline page when
            content not cached. Better than browser&apos;s default offline
            dinosaur. Explain what&apos;s available offline.
          </li>
          <li>
            <strong>Prompt for Install:</strong> Don&apos;t rely on browser
            prompt alone. Show custom &quot;Add to Home Screen&quot; prompt
            after user engagement. Explain benefits.
          </li>
          <li>
            <strong>Handle Updates:</strong> Service worker updates silently.
            Notify users when new version available, prompt to refresh. Use{" "}
            <code>skipWaiting()</code> carefully.
          </li>
          <li>
            <strong>Test Offline:</strong> Test PWA offline functionality.
            Disable network in DevTools, verify cached content loads. Test
            background sync, push notifications.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Caching Everything:</strong> Don&apos;t cache everything —
            storage is limited. Cache app shell, critical content. Use cache
            expiration, size limits.
          </li>
          <li>
            <strong>Not Handling Updates:</strong> Service worker updates
            silently. Users may never get new version. Implement update
            notification, prompt to refresh.
          </li>
          <li>
            <strong>Ignoring iOS Limitations:</strong> iOS Safari doesn&apos;t
            support push notifications, limited background sync. Design
            accordingly — don&apos;t rely on features iOS doesn&apos;t support.
          </li>
          <li>
            <strong>Prompting Too Early:</strong> Don&apos;t show &quot;Add to
            Home Screen&quot; prompt on first visit. Wait for user engagement
            (multiple visits, time on site).
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Twitter Lite</h3>
        <p>
          Twitter Lite (PWA) serves 98% of users globally. Features: offline
          timeline, push notifications, home screen icon. Results: 70% less
          data, 65% more engagement, 75% more tweets. PWA enabled Twitter to
          reach users in emerging markets with slow networks.
        </p>

        <h3>Starbucks PWA</h3>
        <p>
          Starbucks PWA enables offline menu browsing, order building. Results:
          2x daily active users, orders comparable to native app. PWA works on
          any device, no download required.
        </p>

        <h3>Pinterest PWA</h3>
        <p>
          Pinterest rebuilt as PWA for emerging markets. Results: 40% increase
          in time spent, 44% increase in ad revenue, 60% increase in core
          engagement. PWA load time 3x faster than previous mobile web.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is a service worker and how does it enable offline
              support?
            </p>
            <p className="mt-2 text-sm">
              A: Service worker is a background script that acts as proxy
              between browser and network. It intercepts all network requests,
              can serve cached responses when offline. Lifecycle: install
              (cache app shell), activate (clean old caches), fetch (intercept
              requests). Offline support: cache-first strategy for static
              assets, network-first with cache fallback for dynamic content.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does &quot;Add to Home Screen&quot; work for PWAs?
            </p>
            <p className="mt-2 text-sm">
              A: Requirements: (1) Valid web app manifest with name, icons,
              start_url. (2) Service worker registered. (3) HTTPS. (4) User
              engagement (multiple visits). Browser shows install prompt
              automatically when criteria met. Custom prompt can enhance
              discovery. On install: app icon added to home screen, launches in
              standalone mode (no browser UI).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the limitations of PWAs on iOS?
            </p>
            <p className="mt-2 text-sm">
              A: iOS Safari limitations: (1) No push notifications. (2) Limited
              background sync. (3) No install prompt (manual add only). (4)
              Service worker has 7-day cache limit. (5) No Face ID/Touch ID
              integration. Design PWAs to work within these constraints — don&apos;t
              rely on unsupported features.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle service worker updates?
            </p>
            <p className="mt-2 text-sm">
              A: Service worker updates silently in background. New version
              waits until all tabs closed. Strategies: (1) skipWaiting() —
              activate immediately (may break in-progress requests). (2)
              Message user — notify when update available, prompt to refresh.
              (3) Auto-update on next visit. Best: notify user, let them choose
              when to refresh.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What caching strategy should you use for PWAs?
            </p>
            <p className="mt-2 text-sm">
              A: Depends on content type: (1) Cache-first for static assets
              (CSS, JS, images) — fast, works offline. (2) Network-first for
              dynamic content (API responses) — fresh when online, cache
              fallback. (3) Stale-while-revalidate for frequently updated
              content (news feeds) — fast + eventually fresh. Use different
              strategies for different resource types. Service worker gives you
              full control over caching — choose strategy per resource type
              based on freshness requirements and offline needs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you measure PWA success?
            </p>
            <p className="mt-2 text-sm">
              A: Metrics: (1) Install rate — % of users who add to home screen.
              (2) Offline usage — % of sessions offline. (3) Load time — time
              to interactive (should be &lt;3s on 3G). (4) Engagement — time
              spent, pages per session. (5) Conversion — for e-commerce,
              compare PWA vs. mobile web conversion rates. Use Lighthouse PWA
              audit, analytics for tracking. Twitter Lite saw 65% increase in
              engagement, Pinterest 40% increase in time spent after PWA
              launch — track similar metrics to measure PWA impact.
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
              href="https://web.dev/progressive-web-apps/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Progressive Web Apps
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Progressive Web Apps Guide
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
              href="https://twitter.com/TwitterLite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Twitter Lite Case Study
            </a>
          </li>
          <li>
            <a
              href="https://www.pinterest.com/pwa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Pinterest PWA Case Study
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/pwa-checklist/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              PWA Checklist
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

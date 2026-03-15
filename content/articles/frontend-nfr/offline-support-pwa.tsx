"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-offline-support-pwa",
  title: "Offline Support / PWA",
  description: "Comprehensive guide to offline-first architecture, Progressive Web Apps, Service Workers, background sync, conflict resolution, and PWA deployment checklist.",
  category: "frontend",
  subcategory: "nfr",
  slug: "offline-support-pwa",
  version: "extensive",
  wordCount: 14500,
  readingTime: 58,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "offline", "pwa", "service-worker", "resilience", "background-sync"],
  relatedTopics: ["page-load-performance", "caching-strategies", "network-status"],
};

export default function OfflineSupportPWAArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Offline Support</strong> refers to a web application&apos;s ability to function without network
          connectivity. <strong>Progressive Web Apps (PWA)</strong> are web applications that use modern APIs to
          provide app-like experiences including offline support, push notifications, and home screen installation.
        </p>
        <p>
          The business impact is significant. Users abandon sites that don&apos;t work on unreliable connections.
          E-commerce sites with offline cart support see 20% higher conversion rates. News sites with offline
          reading see 3x more article completions. For global audiences where 2G/3G is common, offline support
          isn&apos;t optional—it&apos;s essential.
        </p>
        <p>
          Offline support exists on a spectrum:
        </p>
        <ul>
          <li><strong>Offline-capable:</strong> Core features work offline (reading cached content)</li>
          <li><strong>Offline-first:</strong> App is designed assuming offline is the default state</li>
          <li><strong>Full PWA:</strong> Installable, push notifications, background sync</li>
        </ul>
        <p>
          For staff engineers, offline architecture decisions affect data models, sync strategies, conflict
          resolution, and UX patterns. This guide covers the full spectrum from basic caching to CRDTs.
        </p>
      </section>

      <section>
        <h2>Service Workers: The Foundation</h2>
        <p>
          <strong>Service Workers</strong> are programmable network proxies that run in the background, enabling
          offline support, push notifications, and background sync. They intercept network requests and can respond
          from cache, fetch from network, or combine both.
        </p>

        <ArticleImage
          src="/diagrams/frontend-nfr/offline-service-worker-lifecycle.svg"
          alt="Service Worker Lifecycle"
          caption="Service Worker lifecycle — registration, installation, activation, and fetch interception phases"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Service Worker Lifecycle</h3>
        <ol className="space-y-3">
          <li>
            <strong>Registration:</strong> Browser downloads service worker script
          </li>
          <li>
            <strong>Installation:</strong> Cache essential assets (app shell)
          </li>
          <li>
            <strong>Activation:</strong> Clean old caches, take control of pages
          </li>
          <li>
            <strong>Fetch Interception:</strong> Handle all network requests
          </li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Caching Strategies</h3>
        <ul className="space-y-3">
          <li>
            <strong>Cache-First:</strong> Try cache, fallback to network. Best for static assets.
          </li>
          <li>
            <strong>Network-First:</strong> Try network, fallback to cache. Best for dynamic content.
          </li>
          <li>
            <strong>Stale-While-Revalidate:</strong> Return cache immediately, update in background.
          </li>
          <li>
            <strong>Cache-Only:</strong> Only serve from cache. For truly static content.
          </li>
          <li>
            <strong>Network-Only:</strong> Always fetch from network. For real-time data.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight</h3>
          <p>
            Service workers only work on HTTPS (except localhost). They have their own lifecycle independent of
            the page. A service worker can keep running after the page closes, enabling background sync and push
            notifications.
          </p>
        </div>
      </section>

      <section>
        <h2>Offline-First Architecture</h2>
        <p>
          <strong>Offline-first</strong> means designing your app assuming users will be offline. Connectivity
          is a bonus, not a requirement.
        </p>

        <ArticleImage
          src="/diagrams/frontend-nfr/offline-first-architecture.svg"
          alt="Offline-First Architecture"
          caption="Offline-first data flow — local database as source of truth, sync queue for mutations, background reconciliation"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Core Principles</h3>
        <ul className="space-y-3">
          <li>
            <strong>Local database is source of truth:</strong> UI always reads from local storage (IndexedDB)
          </li>
          <li>
            <strong>Optimistic mutations:</strong> Write to local DB immediately, sync to server later
          </li>
          <li>
            <strong>Sync queue:</strong> Queue all mutations for background synchronization
          </li>
          <li>
            <strong>Conflict resolution:</strong> Handle cases where server and local data diverge
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Synchronization Patterns</h3>
        <ul className="space-y-3">
          <li>
            <strong>Pull sync:</strong> Periodically fetch changes from server
          </li>
          <li>
            <strong>Push sync:</strong> Queue local changes, push when online
          </li>
          <li>
            <strong>Bi-directional:</strong> Both pull and push, with conflict resolution
          </li>
          <li>
            <strong>Real-time:</strong> WebSocket for live sync (when connectivity allows)
          </li>
        </ul>
      </section>

      <section>
        <h2>PWA Features</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Web App Manifest</h3>
        <p>
          JSON file that makes your app installable:
        </p>
        <ul className="space-y-2">
          <li><code>name</code>: Full app name</li>
          <li><code>short_name</code>: Home screen name</li>
          <li><code>start_url</code>: Launch URL</li>
          <li><code>display</code>: standalone, fullscreen, minimal-ui, browser</li>
          <li><code>icons</code>: Home screen icons (multiple sizes)</li>
          <li><code>theme_color</code>: Browser UI color</li>
          <li><code>background_color</code>: Splash screen color</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Installability Criteria</h3>
        <ul className="space-y-2">
          <li>✅ Valid web app manifest</li>
          <li>✅ Service worker with fetch handler</li>
          <li>✅ HTTPS (except localhost)</li>
          <li>✅ Visited at least twice, 5+ minutes apart</li>
          <li>✅ Engaged (user interaction)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Push Notifications</h3>
        <p>
          Enable re-engagement even when app isn&apos;t open:
        </p>
        <ul className="space-y-2">
          <li>Request permission from user</li>
          <li>Subscribe to push service</li>
          <li>Send subscription to server</li>
          <li>Server sends push messages via VAPID</li>
          <li>Service worker receives and displays notification</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/pwa-features.svg"
          alt="PWA Features Overview"
          caption="Progressive Web App features — manifest, service worker, push notifications, background sync, and installability"
        />
      </section>

      <section>
        <h2>Background Sync</h2>
        <p>
          <strong>Background Sync API</strong> defers actions until the user has stable connectivity.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">One-Time Sync</h3>
        <p>
          Register sync when user submits form. Use
          <code>registration.sync.register('send-message')</code> after service worker is ready.
          The service worker's sync event fires when connectivity returns.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Periodic Sync</h3>
        <p>
          Register periodic sync for content updates. Use
          <code>{`registration.periodicSync.register('fetch-news', { minInterval: 86400000 })`}</code>
          for daily sync (24 hours in milliseconds). Requires user engagement and site added to home screen.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Use Cases</h3>
        <ul className="space-y-2">
          <li>Sending messages/emails when connectivity returns</li>
          <li>Syncing form submissions</li>
          <li>Updating news feeds in background</li>
          <li>Backing up user data</li>
        </ul>
      </section>

      <section>
        <h2>Conflict Resolution</h2>
        <p>
          When offline changes sync with server, conflicts occur. Resolution strategies:
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Last-Write-Wins</h3>
        <p>
          Simplest approach: most recent timestamp wins. Easy to implement but can lose user data.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Field-Level Merging</h3>
        <p>
          Merge changes at field level. If user A changes title and user B changes content, both changes are kept.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Operational Transformation (OT)</h3>
        <p>
          Transform operations to maintain consistency. Used by Google Docs. Complex but enables real-time
          collaboration.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">CRDTs (Conflict-Free Replicated Data Types)</h3>
        <p>
          Data structures designed for distributed systems. Automatically converge to same state. Best for
          collaborative apps.
        </p>

        <ArticleImage
          src="/diagrams/frontend-nfr/offline-conflict-resolution.svg"
          alt="Conflict Resolution Strategies"
          caption="Conflict resolution approaches — last-write-wins, field-level merging, operational transformation, and CRDTs"
        />
      </section>

      <section>
        <h2>UX Patterns for Offline</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">When to Use</th>
              <th className="p-3 text-left">Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Offline indicator</strong></td>
              <td className="p-3">Always show connectivity status</td>
              <td className="p-3">Gmail offline banner</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Optimistic UI</strong></td>
              <td className="p-3">Actions that can be queued</td>
              <td className="p-3">Twitter likes, Instagram posts</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Read-only mode</strong></td>
              <td className="p-3">Viewing cached content</td>
              <td className="p-3">Pocket, Instapaper</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Queue with status</strong></td>
              <td className="p-3">Actions pending sync</td>
              <td className="p-3">Slack message &quot;sending...&quot;</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Retry on reconnect</strong></td>
              <td className="p-3">Automatic recovery</td>
              <td className="p-3">Email apps, messaging apps</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>PWA Deployment Checklist</h2>
        <p>
          Before deploying a Progressive Web App to production, verify all requirements for installability
          and offline functionality.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Core Requirements</h3>
        <ul className="space-y-2">
          <li><strong>HTTPS:</strong> Required for production (localhost exempt for development)</li>
          <li><strong>Service Worker:</strong> Registered and active with fetch handler</li>
          <li><strong>Web App Manifest:</strong> Valid manifest.json linked in HTML head</li>
          <li><strong>Icons:</strong> 192×192 and 512×512 PNG icons in manifest</li>
          <li><strong>Start URL:</strong> Valid start_url in manifest (same origin as page)</li>
          <li><strong>Name:</strong> Both name and short_name in manifest</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Service Worker Checklist</h3>
        <ul className="space-y-2">
          <li>Service worker file served from root (not subdirectory)</li>
          <li>Scope covers all pages that need offline support</li>
          <li>Install event caches app shell (HTML, CSS, JS, critical assets)</li>
          <li>Fetch event intercepts requests and serves from cache</li>
          <li>Activate event cleans up old caches</li>
          <li>Offline fallback page configured</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Manifest Checklist</h3>
        <ul className="space-y-2">
          <li>Manifest linked with <code>&lt;link rel="manifest" href="/manifest.json"&gt;</code></li>
          <li>display set to standalone, fullscreen, or minimal-ui</li>
          <li>theme_color and background_color defined</li>
          <li>Icons in multiple sizes (72×72 to 512×512)</li>
          <li>Manifest served with correct Content-Type (application/manifest+json)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing Checklist</h3>
        <ul className="space-y-2">
          <li>Lighthouse PWA audit passes (score 90+)</li>
          <li>Chrome DevTools Application panel shows service worker active</li>
          <li>Offline mode works (DevTools Network tab → Offline)</li>
          <li>Add to Home Screen prompt appears (Chrome: three-dot menu → Install)</li>
          <li>App launches from home screen without browser UI</li>
          <li>Push notifications work (if implemented)</li>
          <li>Background sync triggers when connectivity returns</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Issues</h3>
        <ul className="space-y-2">
          <li><strong>Service worker not registering:</strong> Check scope, HTTPS, browser support</li>
          <li><strong>Install prompt not showing:</strong> Verify manifest validity, user engagement</li>
          <li><strong>Offline not working:</strong> Check cache strategy, cached asset URLs</li>
          <li><strong>Stale content:</strong> Implement cache invalidation, versioning</li>
          <li><strong>iOS issues:</strong> iOS requires additional meta tags, limited service worker support</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">iOS Safari Considerations</h3>
          <p>
            iOS Safari has limited PWA support. Service workers work but require HTTPS and user interaction
            to register. Add to Home Screen is manual (share button → Add to Home Screen). Include iOS-specific
            meta tags: apple-mobile-web-app-capable, apple-mobile-web-app-status-bar-style, apple-touch-icon.
          </p>
        </div>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do service workers enable offline support?</p>
            <p className="mt-2 text-sm">
              A: Service workers intercept network requests. During installation, they cache the app shell.
              During fetch events, they can respond from cache instead of network. This allows the app to load
              and function without connectivity. Combined with IndexedDB for data, the entire app can work offline.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between offline-capable and offline-first?</p>
            <p className="mt-2 text-sm">
              A: Offline-capable means the app works offline but is designed for online use (graceful degradation).
              Offline-first means the app is designed assuming offline is the default—local DB is source of truth,
              sync happens in background. Offline-first requires more architectural changes but provides better UX.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle data conflicts in offline apps?</p>
            <p className="mt-2 text-sm">
              A: Depends on complexity. Last-write-wins for simple apps. Field-level merging for documents.
              Operational Transformation or CRDTs for real-time collaboration. The key is detecting conflicts
              (version vectors, timestamps) and having a resolution strategy before they happen.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the PWA installability requirements?</p>
            <p className="mt-2 text-sm">
              A: Valid manifest with name/icons/start_url, service worker with fetch handler, HTTPS, and user
              engagement (visited twice, 5+ min apart). Chrome also requires the app to be &quot;installable&quot;
              which means it provides value beyond what a bookmark offers.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/progressive-web-apps/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Progressive Web Apps
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Service Worker API
            </a>
          </li>
          <li>
            <a href="https://offlinefirst.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Offline First Manifesto
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-pwa-offline-sync",
  title: "Design a PWA with Offline Sync",
  description:
    "Principal-level design of a Progressive Web App with service workers, offline reads and writes, IndexedDB local source of truth, mutation replay, conflict resolution, Web Push, installability, and service worker update governance.",
  category: "high-level-design",
  subcategory: "cross-platform-mobile-systems",
  slug: "pwa-offline-sync",
  wordCount: 5700,
  readingTime: 33,
  lastUpdated: "2026-05-22",
  tags: ["hld", "pwa", "service-worker", "offline-sync", "indexeddb", "background-sync", "web-push", "cache-strategies", "conflict-resolution"],
  relatedTopics: ["responsive-cross-device-architecture", "hybrid-app-webview-native-bridge"],
};

export default function PwaOfflineSyncArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A Progressive Web App with offline sync is a browser-delivered application that remains usable when the network is slow, intermittent, captive, or completely unavailable. It uses a service worker to control caching and background work, IndexedDB as the local durable data store, a mutation queue for offline writes, and a synchronization protocol to reconcile local changes with the server when connectivity returns.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The principal-level design challenge is not making a page load offline. It is preserving user intent safely across unreliable networks, multiple tabs, device storage pressure, browser capability gaps, server validation changes, concurrent edits, and service worker updates. Offline must be modeled as a first-class operating mode, not as a generic error state.
        </HighlightBlock>
        <p>
          Good candidates for this architecture include task management, field-service workflows, note taking, inspection apps, dashboards, learning platforms, and enterprise tools where users may work on trains, warehouses, hospitals, retail stores, construction sites, or customer locations. Poor candidates include payment submission, high-risk medical orders, real-time collaboration without stronger merge semantics, and flows where server authorization must happen synchronously before the user can proceed.
        </p>
        <p>
          The server remains authoritative, but the local app must be useful while disconnected. That creates unavoidable trade-offs. The design must decide which data can be cached, which writes can be queued, which conflicts can be resolved automatically, which conflicts require user intervention, and when the product should block the user because local completion would create false confidence.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The service worker is a programmable network proxy scoped to the origin. It can precache the app shell, intercept fetches, serve cached responses, update caches in the background, receive push events, and process browser-managed sync events where supported. It does not have direct access to the DOM, so it coordinates with windows through messages, IndexedDB, and browser events.
        </p>
        <p>
          Cache strategies must be chosen per resource type. The app shell can be cache-first with background revalidation because serving a slightly old shell is better than failing to open. Public images and fonts can be cache-first with long retention. API reads are usually network-first with a bounded stale fallback. Auth, payments, destructive administrative actions, and authorization-sensitive endpoints should be network-only or explicitly disabled offline.
        </p>
        <HighlightBlock as="p" tier="important">
          IndexedDB should be the client-side source of truth for offline-capable entities. The UI reads from IndexedDB, not directly from transient network responses. Network responses, sync results, and conflict decisions write into IndexedDB, and the UI reacts to those durable state changes. This avoids two competing states: one in memory and one in storage.
        </HighlightBlock>
        <p>
          The mutation queue captures offline user intent. Each write stores the operation type, entity id, payload, base server version, user id, timestamp, retry count, dependency metadata, idempotency key, and current sync state. The app can optimistically update the local entity while marking it pending. When connectivity returns, the queue replays mutations in dependency-aware order and updates local records based on server responses.
        </p>
        <p>
          Conflict resolution depends on the domain. Last-write-wins is simple but can lose work. Server-authoritative rejection is safe but frustrating. Field-level merge works when fields are independent. Three-way merge uses the base version, local change, and server version to detect non-overlapping edits. CRDTs or operational transforms are appropriate only when real-time collaborative editing is central to the product and the team accepts the added complexity.
        </p>
        <p>
          Browser support is uneven. Background Sync is strong in Chromium-based browsers and weaker or absent elsewhere. iOS and Android differ on PWA install prompts, push support, background execution, storage eviction, and notification behavior. A principal answer should include capability detection and graceful fallbacks instead of assuming every browser behaves like desktop Chrome.
        </p>
        <p>
          Multi-tab coordination is a core production concern. Two open tabs can both detect connectivity, both replay the same queue, or both show stale conflict state unless the app uses a coordination mechanism such as BroadcastChannel, IndexedDB leases, Web Locks where available, or server idempotency as the final guard. The local coordinator should elect one active replay owner, publish progress to other tabs, and release the lease on visibility changes, crashes, or timeout.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The architecture has four planes. The presentation plane renders the UI and subscribes to local data. The local data plane stores entities, mutation queue entries, sync metadata, and user-visible failure state in IndexedDB. The service worker plane owns cache strategy, fetch interception, update lifecycle, push events, and sync triggers. The server plane remains authoritative for validation, authorization, version assignment, conflict detection, and event delivery.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/cross-platform-mobile-systems/pwa-offline-sync.svg"
          alt="PWA offline sync architecture with browser UI, service worker, IndexedDB, Cache API, API server, push service, cache strategies, mutation queue, background sync, conflicts, push, and updates."
          caption="A PWA with offline sync uses the service worker for cache and background events, IndexedDB for local durable state, and the server as the source of authority for validation and conflict decisions."
        />
        <p>
          On first install or first visit, the service worker downloads the app shell and selected static assets into a versioned cache. On later launches, the shell can render immediately from cache while the service worker checks whether a new version exists. API data then hydrates from IndexedDB first, giving the user a useful screen even before network freshness is known. If the network succeeds, the server response updates IndexedDB and refreshes the UI.
        </p>
        <p>
          An offline write starts in the window context. The app validates what it can locally, writes the optimistic entity state to IndexedDB, records a mutation queue entry with the base version and idempotency key, marks the affected entity as pending, and notifies the service worker that work is available. The UI should visibly distinguish pending, synced, failed, and conflicted state. Users should not have to guess whether their work has actually reached the server.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/cross-platform-mobile-systems/pwa-offline-sync-replay.svg"
          alt="Offline mutation replay flow from UI action to IndexedDB optimistic state, mutation queue, service worker replay, server validation, success, retry, failed, and conflict states."
          caption="Offline writes are durable user intent. Replay needs idempotency, dependency ordering, bounded retries, explicit failed state, and clear conflict handling."
        />
        <p>
          Queue processing should be triggered from several places: foreground network recovery, periodic app focus checks, manual user retry, and Background Sync where available. The service worker or foreground coordinator reads pending mutations in order, respects dependencies, sends each mutation with its idempotency key and base version, and classifies the response. Success removes or completes the queue entry and applies the server version. A validation error becomes a user-visible failed state. A transient server or network error is retried with backoff. A version conflict moves the entity into a conflict-resolution state.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/cross-platform-mobile-systems/pwa-offline-sync-conflicts.svg"
          alt="Conflict resolution decision tree for offline sync using base version, local mutation, server version, last-write-wins, server-authoritative, field merge, and manual resolution."
          caption="Conflict strategy should be selected by domain risk: automatic merge for independent fields, server-authoritative for shared critical records, and manual resolution when user work may be lost."
        />
        <p>
          Service worker updates require careful choreography. A new service worker may download while old pages are still controlled by the previous worker. If the new worker activates immediately, pages can mix old JavaScript with new cached assets. If activation waits too long, critical fixes may be delayed. The common production pattern is to detect an available update, show a reload prompt, and activate on user confirmation or at a safe workflow boundary. Security fixes may use a stronger forced-reload policy.
        </p>
        <p>
          Attachment sync needs a separate path from small JSON mutations. Photos, PDFs, audio notes, and scanned documents should be staged with upload state, content hash, size, MIME type, retry policy, and user-visible progress. The mutation that references the attachment should not be committed server-side until the attachment is accepted or a domain-specific placeholder is allowed. Large uploads also need quota handling and cancellation because mobile browsers can evict storage or terminate background work before a long upload completes.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          Cache-first improves perceived availability but risks stale behavior. Network-first improves freshness but makes the app feel slow or broken on weak networks. Stale-while-revalidate gives fast loads with eventual freshness but can surprise users if data changes after the screen appears. Principal-level design means assigning these strategies by business risk, not applying one caching pattern to every request.
        </p>
        <p>
          Optimistic writes create a responsive product, but they can overpromise. If the server later rejects a mutation because permissions changed, validation rules changed, or another user modified the same entity, the UI must explain what happened and preserve user input where possible. A system that silently drops queued mutations is worse than an online-only system because it teaches users not to trust the app.
        </p>
        <HighlightBlock as="p" tier="important">
          Conflict handling is the major interview discriminator. Last-write-wins is acceptable for private, low-risk, user-owned records. Server-authoritative behavior is safer for shared or regulated records. Three-way merge is useful when changes are field-independent. Manual resolution is needed when automatic merge could hide meaningful user intent. The architecture should support multiple strategies per entity type.
        </HighlightBlock>
        <p>
          Background Sync improves reliability after the tab closes, but support is not universal and execution is not guaranteed at a precise time. Foreground sync is more portable but requires the user to reopen the app. For low-risk productivity workflows, delayed sync is acceptable. For high-stakes workflows, the product should warn users that items remain unsent and may require the app to stay open until confirmation.
        </p>
        <p>
          IndexedDB provides durable local storage, but it is not unlimited or immune to browser eviction. Persistent storage requests can reduce eviction risk, but users and browsers still control disk pressure behavior. A production design needs storage estimation, retention policies, cache compaction, and user-facing messaging when large offline datasets cannot be fully retained.
        </p>
        <p>
          Offline reads trade completeness for bounded local footprint. A field-service app may preload only assigned work orders, nearby inventory, and lookup tables rather than an entire account. A dashboard may cache summary cards but require network for raw exports. This boundary should be explicit in the UI and API design: cached data needs freshness labels, scope labels, and deletion behavior when assignments, permissions, or tenant context changes.
        </p>
        <p>
          PWAs reduce app-store friction and work across platforms, but they do not get identical platform privileges. Native apps have stronger background execution, richer OS integration, and more predictable storage and notification behavior. PWAs are compelling when reach, linkability, install-light onboarding, and web velocity matter more than deep native integration.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Start with an offline contract for every product action. Label actions as read-only offline, write-queueable offline, blocked offline, or local-only. This contract should be visible in product requirements and backend API design. It prevents late ambiguity where a designer assumes an action works offline but the backend cannot reconcile it safely.
        </p>
        <p>
          Make queued writes idempotent. Each mutation should carry a stable client-generated idempotency key so replay after browser restart, sync retry, or duplicated service worker execution does not create duplicate server records. The server should store processed keys for a bounded window and return the original result when it sees the same key again.
        </p>
        <p>
          Store base versions with mutations. A mutation without the server version it was based on cannot reliably detect conflicts. The server should compare the base version with the current version and either apply the change, reject it with a conflict payload, or perform a domain-approved merge. The client should keep enough local context to explain the conflict to the user.
        </p>
        <p>
          Separate data cache from HTTP response cache. Cache API is good for static assets and some response caching. IndexedDB is better for queryable application entities, mutation queue state, and sync metadata. Mixing the two carelessly makes it hard to reason about freshness, deletion, and user-visible pending states.
        </p>
        <p>
          Treat service worker rollout as a release process. Version cache names, delete obsolete caches on activation, avoid mixing incompatible app shells and assets, monitor activation errors, and provide a safe reload path. For critical fixes, use a stronger update prompt and server-side feature flags to disable broken offline behavior before the new service worker reaches every client.
        </p>
        <p>
          Ask for notification permission only after demonstrated intent. Use an in-app explanation first, call the browser permission prompt only after the user explicitly opts in, and respect dismissal cooldowns. Push permission is difficult to recover after a block, so aggressive prompting can permanently reduce the value of notifications.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          A common pitfall is calling the app offline-capable because the shell loads offline while real user actions still fail. Interviewers will push past shell caching quickly. The meaningful question is whether the user can read relevant data, create or update records, understand pending state, and trust that their work will eventually be reconciled.
        </p>
        <p>
          Another pitfall is relying on browser online and offline events as proof of reachability. A device can be connected to Wi-Fi behind a captive portal, have DNS failure, lose API reachability while still appearing online, or receive partial responses. Sync should use real request outcomes and health checks, not only browser connectivity hints.
        </p>
        <p>
          Teams often underdesign dependency handling. If a user creates a parent record offline and then creates child records under it, replay must preserve that dependency and map temporary client ids to server ids. If the parent fails validation, children should become blocked instead of replaying against missing server state.
        </p>
        <p>
          Silent conflict resolution is risky. Last-write-wins may be acceptable for private notes, but it is unacceptable for shared task assignment, inventory count, financial approval, or healthcare workflow without clear domain approval. If user work may be overwritten, the system should show a conflict state and help users choose or merge values.
        </p>
        <p>
          Service worker cache bugs can persist longer than normal frontend bugs. A broken service worker can continue serving stale or bad assets until caches are cleared or a new worker activates. Production PWAs need a tested recovery path, cache version cleanup, and a server-controlled way to disable affected app behavior.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Field-service applications use offline sync when technicians inspect equipment in basements, factories, ships, or remote sites with poor connectivity. Work orders, photos, checklist answers, and signatures can be captured locally, then uploaded when the device reconnects. The design must handle large attachments and make unsent state obvious before the technician leaves the job.
        </p>
        <p>
          Task and project management tools use offline sync for creating tasks, changing status, writing comments, and editing personal notes. Conflicts are often manageable because many records are user-owned or field-independent. Shared assignment, due-date, and permissions changes need stricter conflict policies.
        </p>
        <p>
          Education and content platforms use PWA caching to let learners continue courses, quizzes, and reading on weak networks. Progress events can be queued, while final assessment submission may require online confirmation. Offline availability improves retention, but certification and grading paths should remain server-authoritative.
        </p>
        <p>
          Retail and warehouse apps use offline behavior for inventory counts, shelf checks, barcode scans, and pickup workflows. These domains need careful conflict handling because quantities and reservations can change while devices are offline. The product may allow local capture but require online reconciliation before committing business-critical state.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. What is the core architecture of a PWA with offline sync?</h3>
        <p>
          I would use a service worker for cache control, push events, and sync triggers; IndexedDB as the durable local source of truth; a mutation queue for offline writes; and backend APIs that support idempotency, version checks, and conflict responses. The UI reads from IndexedDB first so it can render offline. Network responses and sync results update IndexedDB, which then updates the UI. The server remains authoritative for validation, permissions, canonical ids, and version assignment.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. How would you decide which cache strategy to use?</h3>
        <p>
          I would choose by resource risk. Static app shell assets can be cache-first or stale-while-revalidate for fast startup. Static media can be cache-first with retention limits. Normal API reads can be network-first with bounded stale fallback. Auth, payments, permissions, and destructive operations should be network-only or blocked offline. The important principle is that cache strategy is part of product correctness, not just performance tuning.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. How do you replay offline writes safely?</h3>
        <p>
          Each write becomes a durable mutation with operation type, payload, base version, dependency metadata, idempotency key, retry count, and sync state. The app applies an optimistic local update and marks the entity pending. Replay processes mutations in dependency-aware order. Success applies the server response and clears pending state. Validation errors become user-visible failed state. Transient failures retry with bounded backoff. Conflicts become conflict-resolution state rather than being overwritten silently.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How would you handle conflicts from two users editing offline?</h3>
        <p>
          I would store the base version with each mutation and have the server compare it with the current version. If changes are independent fields, the server or client can perform a field-level merge. For private low-risk records, last-write-wins may be acceptable. For shared critical records, server-authoritative rejection or manual resolution is safer. For collaborative editing, I would consider CRDTs or operational transforms only if the product truly needs continuous multi-user editing, because they add significant complexity.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. What are the biggest browser and platform risks?</h3>
        <p>
          Background Sync support is uneven, background execution is not guaranteed, storage can be evicted under pressure, install prompts differ by platform, and Web Push behavior varies across browsers. I would use capability detection, foreground sync fallback, storage usage monitoring, persistent storage requests where appropriate, and user-visible unsent state. A design that assumes desktop Chrome behavior everywhere will fail on real mobile devices.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. How do you ship service worker updates safely?</h3>
        <p>
          I would version caches by build, precache the shell, delete obsolete caches on activation, and avoid mixing incompatible shell and asset versions. When a new worker is available, the app should notify the user and reload at a safe boundary, with forced reload reserved for critical fixes. I would monitor activation failures, cache errors, and crash or blank-screen signals by service worker version. A server-side kill switch should disable risky offline features if a bad worker or bundle is already installed.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" target="_blank" rel="noreferrer">MDN: Progressive Web Apps</a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API" target="_blank" rel="noreferrer">MDN: Service Worker API</a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" target="_blank" rel="noreferrer">MDN: IndexedDB API</a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API" target="_blank" rel="noreferrer">MDN: Background Synchronization API</a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Push_API" target="_blank" rel="noreferrer">MDN: Push API</a>
          </li>
          <li>
            <a href="https://web.dev/learn/pwa/" target="_blank" rel="noreferrer">web.dev: Learn PWA</a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

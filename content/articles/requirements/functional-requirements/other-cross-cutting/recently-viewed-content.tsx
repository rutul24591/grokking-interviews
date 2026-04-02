"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-functional-recently-viewed-content",
  title: "Recently Viewed Content",
  description:
    "Comprehensive guide to implementing recently viewed content covering view tracking, view history, view persistence, view sync, view management, and view privacy for user content discovery.",
  category: "functional-requirements",
  subcategory: "other-cross-cutting-functional-requirements",
  slug: "recently-viewed-content",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "cross-cutting",
    "recently-viewed",
    "view-history",
    "content-discovery",
    "user-experience",
  ],
  relatedTopics: ["personalized-recommendations", "bookmarks", "watch-history", "browse-history"],
};

export default function RecentlyViewedContentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Recently Viewed Content enables users to track and access content they have recently viewed. Users can view history (see viewed content), manage history (manage view history), clear history (clear view history), and control tracking (control view tracking). Recently viewed content is fundamental to content discovery (help users discover content), user experience (users can find viewed content), and user satisfaction (users appreciate view history). For platforms with content consumption, effective recently viewed content is essential for content discovery, user experience, and satisfaction.
        </p>
        <p>
          For staff and principal engineers, recently viewed content architecture involves view tracking (track viewed content), view history (manage view history), view persistence (persist view history), view sync (sync across devices), and view management (manage view history). The implementation must balance tracking (track viewed content) with privacy (respect user privacy) and performance (fast view tracking). Poor recently viewed content leads to poor discovery, user frustration, and privacy concerns.
        </p>
        <p>
          The complexity of recently viewed content extends beyond simple view tracking. View tracking (track viewed content). View history (manage view history). View persistence (persist view history). View sync (sync across devices). View privacy (respect user privacy). For staff engineers, recently viewed content is a user experience infrastructure decision affecting content discovery, user experience, and satisfaction.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>View Tracking</h3>
        <p>
          Automatic tracking tracks views automatically. View detection (detect views). View recording (record views). View update (update views). Automatic tracking enables automatic view tracking. Benefits include no user burden (no user burden), comprehensive tracking (comprehensive tracking). Drawbacks includes privacy concern (privacy concern), tracking overhead (tracking overhead).
        </p>
        <p>
          Manual tracking tracks views manually. View marking (mark views). View recording (record views). View update (update views). Manual tracking enables manual view tracking. Benefits include user control (user control), privacy (privacy respected). Drawbacks includes user burden (user burden), incomplete tracking (incomplete tracking).
        </p>
        <p>
          Selective tracking tracks views selectively. View selection (select what to track). View recording (record views). View update (update views). Selective tracking enables selective view tracking. Benefits include user control (user control), privacy (privacy respected). Drawbacks includes complexity (complex implementation), incomplete tracking (incomplete tracking).
        </p>

        <h3 className="mt-6">View History</h3>
        <p>
          View storage stores view history. View database (store views). View files (store in files). View service (store in service). View storage enables view history storage. Benefits include persistence (persist views), access (access views). Drawbacks includes storage usage (storage usage), complexity (complexity).
        </p>
        <p>
          View retrieval retrieves view history. View query (query views). View filtering (filter views). View sorting (sort views). View retrieval enables view history retrieval. Benefits include access (access views), filtering (filter views). Drawbacks includes query overhead (query overhead), complexity (complexity).
        </p>
        <p>
          View management manages view history. View deletion (delete views). View clearing (clear views). View export (export views). View management enables view history management. Benefits include control (control views), privacy (privacy respected). Drawbacks includes management overhead (management overhead), complexity (complexity).
        </p>

        <h3 className="mt-6">View Persistence</h3>
        <p>
          Local persistence persists views locally. Local storage (store locally). Device storage (store on device). App storage (store in app). Local persistence enables local view persistence. Benefits include fast access (fast view access), offline access (access without network). Drawbacks includes device limitation (views only on device), data loss risk (device failure loses views).
        </p>
        <p>
          Cloud persistence persists views in cloud. Cloud storage (store in cloud). Account storage (store with account). Server storage (store on server). Cloud persistence enables cloud view persistence. Benefits include device independence (access from any device), data protection (protect from device failure). Drawbacks includes network dependency (need network for access), privacy concern (views in cloud).
        </p>
        <p>
          Hybrid persistence persists views locally and in cloud. Local storage (store locally). Cloud sync (sync to cloud). Hybrid persistence enables local and cloud persistence. Benefits include fast access (fast local access), device independence (sync to cloud). Drawbacks includes complexity (manage local and cloud), sync issues (sync conflicts).
        </p>

        <h3 className="mt-6">View Sync</h3>
        <p>
          Real-time sync syncs views in real-time. Real-time delivery (deliver immediately). No delay (no delay). Real-time sync enables instant sync. Benefits include immediacy (instant sync), consistency (consistent across devices). Drawbacks includes network usage (uses network), battery drain (drains battery).
        </p>
        <p>
          Batched sync syncs views in batches. Batch delivery (deliver in batches). Batch frequency (sync daily, weekly). Batch content (sync changed views). Batched sync reduces network usage. Benefits include reduced usage (less network usage), battery saving (saves battery). Drawbacks includes delay (not instant sync), inconsistency (inconsistent across devices).
        </p>
        <p>
          Manual sync syncs views manually. Manual trigger (manually trigger sync). Manual selection (manually select what to sync). Manual sync enables manual sync. Benefits include user control (users control sync), network saving (save network). Drawbacks includes user burden (must manually sync), may forget (may forget to sync).
        </p>

        <h3 className="mt-6">View Privacy</h3>
        <p>
          Private viewing enables private viewing. Private mode (enable private mode). No tracking (don&apos;t track views). Private viewing enables private view. Benefits include privacy (privacy respected), user control (user control). Drawbacks includes no history (no view history), no sync (no sync).
        </p>
        <p>
          View deletion enables view deletion. View delete (delete views). History clear (clear history). View deletion enables view deletion. Benefits include privacy (privacy respected), user control (user control). Drawbacks includes no history (no view history), no discovery (no discovery).
        </p>
        <p>
          View control enables view control. Tracking control (control tracking). History control (control history). Sync control (control sync). View control enables view control. Benefits include user control (user control), privacy (privacy respected). Drawbacks includes complexity (complex implementation), may be confusing (may be confusing).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Recently viewed content architecture spans view service, tracking service, persistence service, and sync service. View service manages views. Tracking service manages view tracking. Persistence service manages view persistence. Sync service manages view sync. Each layer has specific responsibilities and integration requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/recently-viewed-content/viewed-architecture.svg"
          alt="Recently Viewed Content Architecture"
          caption="Figure 1: Recently Viewed Content Architecture — View service, tracking service, persistence service, and sync service"
          width={1000}
          height={500}
        />

        <h3>View Service</h3>
        <p>
          View service manages user views. View storage (store views). View retrieval (retrieve views). View update (update views). View service is the core of recently viewed content. Benefits include centralization (one place for views), consistency (same views everywhere). Drawbacks includes complexity (manage views), coupling (services depend on view service).
        </p>
        <p>
          View policies define view rules. Default views (default views). View validation (validate views). View sync (sync views). View policies automate view management. Benefits include automation (automatic management), consistency (same rules for all). Drawbacks includes complexity (define policies), may not fit all cases.
        </p>

        <h3 className="mt-6">Tracking Service</h3>
        <p>
          Tracking service manages view tracking. Tracking registration (register tracking). Tracking delivery (deliver by tracking). Tracking preferences (configure tracking). Tracking service enables tracking management. Benefits include tracking management (manage tracking), delivery (deliver by tracking). Drawbacks includes complexity (manage tracking), tracking failures (may not track correctly).
        </p>
        <p>
          Tracking preferences define tracking rules. Tracking selection (select tracking). Tracking frequency (configure tracking frequency). Tracking priority (configure tracking priority). Tracking preferences enable tracking customization. Benefits include customization (customize tracking), user control (users control tracking). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/recently-viewed-content/view-tracking.svg"
          alt="View Tracking"
          caption="Figure 2: View Tracking — Automatic, manual, and selective tracking"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Persistence Service</h3>
        <p>
          Persistence service manages view persistence. Local persistence (persist locally). Cloud persistence (persist in cloud). Hybrid persistence (persist locally and in cloud). Persistence service enables view persistence. Benefits include persistence management (manage persistence), persistence (persist views). Drawbacks includes complexity (manage persistence), persistence failures (may not persist correctly).
        </p>
        <p>
          Persistence preferences define persistence rules. Persistence selection (select persistence). Persistence frequency (configure persistence frequency). Persistence priority (configure persistence priority). Persistence preferences enable persistence customization. Benefits include customization (customize persistence), user control (users control persistence). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/recently-viewed-content/view-history.svg"
          alt="View History"
          caption="Figure 3: View History — View storage, retrieval, and management"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Recently viewed content design involves trade-offs between automatic and manual tracking, local and cloud persistence, and comprehensive and limited view history. Understanding these trade-offs enables informed decisions aligned with user needs and business requirements.
        </p>

        <h3>Tracking: Automatic vs. Manual</h3>
        <p>
          Automatic tracking (automatically track views). Pros: No user burden (no user burden), comprehensive tracking (comprehensive tracking), immediate (immediate tracking). Cons: Privacy concern (privacy concern), tracking overhead (tracking overhead), may be unwanted (may be unwanted). Best for: User convenience, comprehensive tracking.
        </p>
        <p>
          Manual tracking (manually track views). Pros: User control (user control), privacy (privacy respected), no tracking overhead (no tracking overhead). Cons: User burden (user burden), incomplete tracking (incomplete tracking), may be forgotten (may be forgotten). Best for: User control, privacy.
        </p>
        <p>
          Hybrid: automatic with manual override. Pros: Best of both (automatic for convenience, manual for override). Cons: Complexity (automatic and manual), may confuse users. Best for: Most platforms—automatic with manual override.
        </p>

        <h3>Persistence: Local vs. Cloud</h3>
        <p>
          Local persistence (persist locally). Pros: Fast access (fast view access), offline access (access without network), privacy (views local). Cons: Device limitation (views only on device), data loss risk (device failure loses views), no sync (no sync across devices). Best for: Fast access, offline access, privacy-focused.
        </p>
        <p>
          Cloud persistence (persist in cloud). Pros: Device independence (access from any device), data protection (protect from device failure), sync (sync across devices). Cons: Network dependency (need network for access), privacy concern (views in cloud), slower access (slower than local). Best for: Device independence, data protection, sync.
        </p>
        <p>
          Hybrid: local with cloud sync. Pros: Best of both (fast local access, cloud sync). Cons: Complexity (manage local and cloud), sync issues (sync conflicts). Best for: Most platforms—local with cloud sync.
        </p>

        <h3>History: Comprehensive vs. Limited</h3>
        <p>
          Comprehensive history (comprehensive view history). Pros: Complete history (complete view history), discovery (discover viewed content), user satisfaction (user satisfaction). Cons: Storage usage (storage usage), privacy concern (privacy concern), management overhead (management overhead). Best for: Complete history, discovery.
        </p>
        <p>
          Limited history (limited view history). Pros: Lower storage (lower storage usage), less privacy concern (less privacy concern), easier management (easier management). Cons: Incomplete history (incomplete view history), limited discovery (limited discovery), user dissatisfaction (user dissatisfaction). Best for: Lower storage, privacy.
        </p>
        <p>
          Hybrid: comprehensive with limit. Pros: Best of both (comprehensive with limit). Cons: Complexity (comprehensive and limit), may still use storage. Best for: Most platforms—comprehensive with limit.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/recently-viewed-content/viewed-comparison.svg"
          alt="Viewed Content Approaches Comparison"
          caption="Figure 4: Viewed Content Approaches Comparison — Tracking, persistence, and history trade-offs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Provide view tracking:</strong> Automatic tracking. Manual tracking. Selective tracking. Let users choose.
          </li>
          <li>
            <strong>Enable view history:</strong> View storage. View retrieval. View management. Let users choose.
          </li>
          <li>
            <strong>Persist views:</strong> Local persistence. Cloud persistence. Hybrid persistence. Let users choose.
          </li>
          <li>
            <strong>Sync views:</strong> Real-time sync. Batched sync. Manual sync. Let users choose.
          </li>
          <li>
            <strong>Ensure view privacy:</strong> Private viewing. View deletion. View control.
          </li>
          <li>
            <strong>Manage views:</strong> View center. Show view history. Enable view editing. Enable view deletion.
          </li>
          <li>
            <strong>Notify of views:</strong> Notify when views saved. Notify of view sync. Notify of view changes.
          </li>
          <li>
            <strong>Monitor views:</strong> Monitor view usage. Monitor view sync. Monitor view privacy.
          </li>
          <li>
            <strong>Test views:</strong> Test view tracking. Test view persistence. Test view sync.
          </li>
          <li>
            <strong>Ensure privacy:</strong> Respect user privacy. Provide control. Enable deletion.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No view tracking:</strong> Can&apos;t track views. <strong>Solution:</strong> Provide view tracking.
          </li>
          <li>
            <strong>No view history:</strong> Can&apos;t view history. <strong>Solution:</strong> Enable view history.
          </li>
          <li>
            <strong>No view persistence:</strong> Views not saved. <strong>Solution:</strong> Persist views.
          </li>
          <li>
            <strong>No view sync:</strong> Views not synced. <strong>Solution:</strong> Sync views.
          </li>
          <li>
            <strong>Poor privacy:</strong> No privacy respect. <strong>Solution:</strong> Respect privacy.
          </li>
          <li>
            <strong>No view management:</strong> Can&apos;t manage views. <strong>Solution:</strong> Provide view management.
          </li>
          <li>
            <strong>No notification:</strong> Don&apos;t notify of views. <strong>Solution:</strong> Notify when saved.
          </li>
          <li>
            <strong>No monitoring:</strong> Don&apos;t know view usage. <strong>Solution:</strong> Monitor views.
          </li>
          <li>
            <strong>No control:</strong> Can&apos;t control views. <strong>Solution:</strong> Provide control.
          </li>
          <li>
            <strong>No testing:</strong> Don&apos;t test views. <strong>Solution:</strong> Test view tracking and persistence.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>E-commerce Recently Viewed</h3>
        <p>
          E-commerce platforms provide recently viewed. Product views (track product views). View history (show view history). View management (manage view history). Users control e-commerce recently viewed.
        </p>

        <h3 className="mt-6">Streaming Service Recently Viewed</h3>
        <p>
          Streaming services provide recently viewed. Content views (track content views). View history (show view history). View management (manage view history). Users control streaming service recently viewed.
        </p>

        <h3 className="mt-6">Browser Recently Viewed</h3>
        <p>
          Browsers provide recently viewed. Page views (track page views). View history (show view history). View management (manage view history). Users control browser recently viewed.
        </p>

        <h3 className="mt-6">Social Media Recently Viewed</h3>
        <p>
          Social media platforms provide recently viewed. Content views (track content views). View history (show view history). View management (manage view history). Users control social media recently viewed.
        </p>

        <h3 className="mt-6">News Platform Recently Viewed</h3>
        <p>
          News platforms provide recently viewed. Article views (track article views). View history (show view history). View management (manage view history). Users control news platform recently viewed.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design recently viewed content that balances tracking with privacy?</p>
            <p className="mt-2 text-sm">
              Implement view tracking with privacy because users want tracking (find content they viewed, continue where left off) but want privacy (sensitive views not tracked, control over history). Track views: track viewed content (automatic tracking, timestamp, content ID, session info)—enables history, recommendations, continue watching. Provide control: let users control (pause tracking, delete specific views, clear all history, private mode)—user agency, privacy control. Enable deletion: let users delete (delete individual views, delete by date range, delete all, auto-delete after period)—users can remove sensitive views. Respect privacy: respect user privacy (private browsing mode, incognito views not tracked, sensitive content excluded)—respect privacy choices, don&apos;t track when user requests privacy. The privacy insight: users want tracking but want privacy—provide tracking (automatic, timestamp, content) with control (pause, delete, clear, private), deletion (individual, range, all, auto), respect (private mode, incognito, sensitive excluded), and balance utility with privacy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement view tracking?</p>
            <p className="mt-2 text-sm">
              Implement view tracking because users expect recently viewed to work automatically. Automatic tracking: track automatically (on view, on play, on scroll into view, after threshold time)—no user action needed, seamless tracking. Manual tracking: track manually (user marks as viewed, save for later, add to history)—user control, intentional tracking. Selective tracking: track selectively (track certain content types, exclude certain categories, user-defined rules)—flexible tracking, privacy-conscious. Tracking enforcement: enforce tracking (verify tracking works, check all views tracked, fix tracking gaps)—ensure tracking reliable, no missing views. The tracking insight: views need tracking—provide automatic (on view, play, scroll, threshold), manual (mark, save, add), selective (content types, exclude, rules), enforce (verify, check, fix), and ensure tracking works reliably.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle view history?</p>
            <p className="mt-2 text-sm">
              Implement view history because users expect to see and manage their view history. View storage: store views (database storage, local storage, cloud storage, hybrid)—persistent storage, survives restarts. View retrieval: retrieve views (query history, filter by date, filter by type, search history)—easy access to history, find specific views. View management: manage views (delete views, organize views, export views, hide views)—user control over history. View enforcement: enforce views (verify history accurate, check for duplicates, fix inconsistencies)—ensure history reliable, accurate. The history insight: views need history—store (database, local, cloud, hybrid), retrieve (query, filter, search), manage (delete, organize, export, hide), enforce (verify, check, fix), and ensure history accurate and manageable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure view privacy?</p>
            <p className="mt-2 text-sm">
              Implement view privacy because view history can reveal sensitive information about user interests, health, finances. Private viewing: enable private viewing (incognito mode, private session, temporary views not saved)—sensitive views not tracked, privacy preserved. View deletion: enable view deletion (delete individual views, bulk delete, auto-delete after period)—users can remove sensitive views. View control: enable view control (pause tracking, exclude categories, set retention period)—user control over what&apos;s tracked. Privacy enforcement: enforce privacy (verify private mode works, check deletion complete, audit privacy compliance)—ensure privacy actually enforced, not just promised. The privacy insight: privacy is important—enable private viewing (incognito, private session, temporary), deletion (individual, bulk, auto-delete), control (pause, exclude, retention), enforce (verify, check, audit), and respect user privacy choices.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you sync views across devices?</p>
            <p className="mt-2 text-sm">
              Implement view sync because users expect view history to follow them across devices. Sync selection: select what to sync (all views, specific content types, exclude sensitive)—user control, sensitive views can stay local. Sync scheduling: schedule sync (sync on view, sync on app launch, sync periodically)—balance freshness with bandwidth, battery. Sync conflict resolution: resolve conflicts (merge views from multiple devices, deduplicate, handle concurrent views)—conflicts inevitable when viewing on multiple devices. Sync enforcement: enforce sync (sync required for cloud views, verify sync complete, retry on failure)—ensure consistency across devices. The sync insight: users want sync across devices—provide selection (what syncs), scheduling (when to sync), conflict resolution (merge, deduplicate, concurrent), enforcement (verify, retry), and make sync seamless and reliable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you manage view storage?</p>
            <p className="mt-2 text-sm">
              Implement view storage management because view history consumes storage and needs management. Local storage: store locally (localStorage, IndexedDB, local files)—fast access, works offline, privacy (data stays on device). Cloud storage: store in cloud (user account, encrypted storage, synced)—survives device loss, available across devices, requires network. Hybrid storage: store locally and in cloud (local for speed, cloud for backup/sync)—best of both, local first with cloud backup. Storage enforcement: enforce storage (storage limits, cleanup old views, compress storage)—prevent unlimited storage growth, manage storage efficiently. The storage insight: views need storage—provide local (fast, offline, privacy), cloud (backup, sync, across devices), hybrid (best of both), enforce (limits, cleanup, compress), and manage storage efficiently.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.nngroup.com/articles/recently-viewed/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Recently Viewed
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — LocalStorage API
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/storage/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — Storage Specification
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/browser-history/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Browser History
            </a>
          </li>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95582"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Chrome — View History
            </a>
          </li>
          <li>
            <a
              href="https://www.privacytools.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Tools — Privacy Protection
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

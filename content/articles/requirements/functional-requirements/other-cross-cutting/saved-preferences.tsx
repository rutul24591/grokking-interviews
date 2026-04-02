"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-functional-saved-preferences",
  title: "Saved Preferences",
  description:
    "Comprehensive guide to implementing saved preferences covering preference storage, preference sync, preference backup, preference restoration, and preference management for user preference persistence.",
  category: "functional-requirements",
  subcategory: "other-cross-cutting-functional-requirements",
  slug: "saved-preferences",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "cross-cutting",
    "saved-preferences",
    "user-preferences",
    "preference-storage",
    "preference-sync",
  ],
  relatedTopics: ["notification-preferences", "theme-settings", "language-settings", "user-settings"],
};

export default function SavedPreferencesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Saved Preferences enable users to save and persist their preferences across sessions and devices. Users can save preferences (save their settings), sync preferences (sync across devices), backup preferences (backup preferences), restore preferences (restore from backup), and manage preferences (view and edit saved preferences). Saved preferences are fundamental to user experience (consistent experience across sessions), user convenience (don&apos;t have to reconfigure), and user satisfaction (preferences are remembered). For platforms with user preferences, effective saved preferences are essential for user experience, convenience, and satisfaction.
        </p>
        <p>
          For staff and principal engineers, saved preferences architecture involves preference storage (store preferences), preference sync (sync across devices), preference backup (backup preferences), preference restoration (restore preferences), and preference management (manage saved preferences). The implementation must balance persistence (preferences are saved) with privacy (preferences are private) and performance (fast preference access). Poor saved preferences lead to lost preferences, user frustration, and reconfiguration burden.
        </p>
        <p>
          The complexity of saved preferences extends beyond simple save/load. Preference storage (where to store preferences). Preference sync (how to sync across devices). Preference backup (how to backup preferences). Preference restoration (how to restore preferences). Preference management (how to manage saved preferences). For staff engineers, saved preferences are a user preference infrastructure decision affecting user experience, convenience, and satisfaction.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Preference Storage</h3>
        <p>
          Local storage stores preferences locally. Device storage (store on device). Browser storage (store in browser). App storage (store in app). Local storage enables local preference persistence. Benefits include fast access (fast preference access), offline access (access without network). Drawbacks includes device limitation (preferences only on device), data loss risk (device failure loses preferences).
        </p>
        <p>
          Cloud storage stores preferences in cloud. Cloud storage (store in cloud). Account storage (store with account). Server storage (store on server). Cloud storage enables cloud preference persistence. Benefits include device independence (access from any device), data protection (protect from device failure). Drawbacks includes network dependency (need network for access), privacy concern (preferences in cloud).
        </p>
        <p>
          Hybrid storage stores preferences locally and in cloud. Local storage (store locally). Cloud sync (sync to cloud). Hybrid storage enables local and cloud persistence. Benefits include fast access (fast local access), device independence (sync to cloud). Drawbacks includes complexity (manage local and cloud), sync issues (sync conflicts).
        </p>

        <h3 className="mt-6">Preference Sync</h3>
        <p>
          Real-time sync syncs preferences in real-time. Real-time delivery (deliver immediately). No delay (no delay). Real-time sync enables instant sync. Benefits include immediacy (instant sync), consistency (consistent across devices). Drawbacks includes network usage (uses network), battery drain (drains battery).
        </p>
        <p>
          Batched sync syncs preferences in batches. Batch delivery (deliver in batches). Batch frequency (sync daily, weekly). Batch content (sync changed preferences). Batched sync reduces network usage. Benefits include reduced usage (less network usage), battery saving (saves battery). Drawbacks includes delay (not instant sync), may miss urgent (urgent sync delayed).
        </p>
        <p>
          Manual sync syncs preferences manually. Manual trigger (manually trigger sync). Manual selection (manually select what to sync). Manual sync enables manual sync. Benefits include user control (users control sync), network saving (save network). Drawbacks includes user burden (must manually sync), may forget (may forget to sync).
        </p>

        <h3 className="mt-6">Preference Backup</h3>
        <p>
          Automatic backup backs up preferences automatically. Scheduled backup (backup on schedule). Event-based backup (backup on events). Automatic backup enables automatic backup. Benefits include automation (automatically backup), user convenience (don&apos;t have to backup). Drawbacks includes storage usage (uses storage), may backup unnecessarily (may backup unnecessarily).
        </p>
        <p>
          Manual backup backs up preferences manually. Manual trigger (manually trigger backup). Manual selection (manually select what to backup). Manual backup enables manual backup. Benefits include user control (users control backup), storage saving (save storage). Drawbacks includes user burden (must manually backup), may forget (may forget to backup).
        </p>
        <p>
          Incremental backup backs up changed preferences. Change detection (detect changed preferences). Incremental backup (backup only changed). Incremental backup enables efficient backup. Benefits include efficiency (efficient backup), storage saving (save storage). Drawbacks includes complexity (detect changes), may miss changes (may miss changes).
        </p>

        <h3 className="mt-6">Preference Restoration</h3>
        <p>
          Full restoration restores all preferences. Full restore (restore all preferences). No selection (restore everything). Full restoration enables complete restoration. Benefits include completeness (restore everything), simplicity (simple restoration). Drawbacks includes may restore unwanted (may restore unwanted), storage usage (uses storage).
        </p>
        <p>
          Selective restoration restores selected preferences. Selective restore (restore selected preferences). Selection (select what to restore). Selective restoration enables selective restoration. Benefits include user control (users control restoration), storage saving (save storage). Drawbacks includes complexity (select preferences), may miss important (may miss important).
        </p>
        <p>
          Versioned restoration restores preferences from version. Version selection (select version to restore). Version restore (restore from version). Versioned restoration enables version restoration. Benefits include version control (restore from version), rollback (rollback to version). Drawbacks includes complexity (manage versions), storage usage (store versions).
        </p>

        <h3 className="mt-6">Preference Management</h3>
        <p>
          Preference UI provides interface for managing preferences. Preference center (central place for preferences). Preference view (view preferences). Preference edit (edit preferences). Preference UI enables managing preferences. Benefits include user control (users control preferences), clarity (clear preferences). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>
        <p>
          Preference export exports preferences. Export format (export in format). Export selection (select what to export). Export enables preference export. Benefits include portability (portable preferences), backup (backup preferences). Drawbacks includes format compatibility (may not be compatible), security concern (export may be insecure).
        </p>
        <p>
          Preference import imports preferences. Import format (import from format). Import selection (select what to import). Import enables preference import. Benefits include portability (portable preferences), restoration (restore preferences). Drawbacks includes format compatibility (may not be compatible), security concern (import may be insecure).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Saved preferences architecture spans preference service, storage service, sync service, and backup service. Preference service manages preferences. Storage service manages preference storage. Sync service manages preference sync. Backup service manages preference backup. Each layer has specific responsibilities and integration requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/saved-preferences/preferences-architecture.svg"
          alt="Saved Preferences Architecture"
          caption="Figure 1: Saved Preferences Architecture — Preference service, storage service, sync service, and backup service"
          width={1000}
          height={500}
        />

        <h3>Preference Service</h3>
        <p>
          Preference service manages user preferences. Preference storage (store preferences). Preference retrieval (retrieve preferences). Preference update (update preferences). Preference service is the core of saved preferences. Benefits include centralization (one place for preferences), consistency (same preferences everywhere). Drawbacks includes complexity (manage preferences), coupling (services depend on preference service).
        </p>
        <p>
          Preference policies define preference rules. Default preferences (default preferences). Preference validation (validate preferences). Preference sync (sync preferences). Preference policies automate preference management. Benefits include automation (automatic management), consistency (same rules for all). Drawbacks includes complexity (define policies), may not fit all cases.
        </p>

        <h3 className="mt-6">Storage Service</h3>
        <p>
          Storage service manages preference storage. Local storage (store locally). Cloud storage (store in cloud). Hybrid storage (store locally and in cloud). Storage service enables preference storage. Benefits include storage management (manage storage), persistence (persist preferences). Drawbacks includes complexity (manage storage), storage failures (may not store correctly).
        </p>
        <p>
          Storage preferences define storage rules. Storage selection (select storage). Storage frequency (configure storage frequency). Storage priority (configure storage priority). Storage preferences enable storage customization. Benefits include customization (customize storage), user control (users control storage). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/saved-preferences/preference-sync.svg"
          alt="Preference Sync"
          caption="Figure 2: Preference Sync — Real-time, batched, and manual sync"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Sync Service</h3>
        <p>
          Sync service manages preference sync. Sync registration (register sync). Sync delivery (deliver by sync). Sync preferences (configure sync). Sync service enables sync management. Benefits include sync management (manage sync), delivery (deliver by sync). Drawbacks includes complexity (manage sync), sync failures (may not sync correctly).
        </p>
        <p>
          Sync preferences define sync rules. Sync selection (select sync). Sync frequency (configure sync frequency). Sync priority (configure sync priority). Sync preferences enable sync customization. Benefits include customization (customize sync), user control (users control sync). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/saved-preferences/preference-backup.svg"
          alt="Preference Backup"
          caption="Figure 3: Preference Backup — Automatic, manual, and incremental backup"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Saved preferences design involves trade-offs between local and cloud storage, real-time and batched sync, and automatic and manual backup. Understanding these trade-offs enables informed decisions aligned with user needs and business requirements.
        </p>

        <h3>Storage: Local vs. Cloud</h3>
        <p>
          Local storage (store locally). Pros: Fast access (fast preference access), offline access (access without network), privacy (preferences local). Cons: Device limitation (preferences only on device), data loss risk (device failure loses preferences), no sync (no sync across devices). Best for: Fast access, offline access, privacy-focused.
        </p>
        <p>
          Cloud storage (store in cloud). Pros: Device independence (access from any device), data protection (protect from device failure), sync (sync across devices). Cons: Network dependency (need network for access), privacy concern (preferences in cloud), slower access (slower than local). Best for: Device independence, data protection, sync.
        </p>
        <p>
          Hybrid: local with cloud sync. Pros: Best of both (fast local access, cloud sync). Cons: Complexity (manage local and cloud), sync issues (sync conflicts). Best for: Most platforms—local with cloud sync.
        </p>

        <h3>Sync: Real-time vs. Batched</h3>
        <p>
          Real-time sync (sync immediately). Pros: Immediacy (instant sync), consistency (consistent across devices), user convenience (don&apos;t have to wait). Cons: Network usage (uses network), battery drain (drains battery), may be unnecessary (may sync unnecessarily). Best for: Important preferences, frequent changes.
        </p>
        <p>
          Batched sync (sync in batches). Pros: Reduced usage (less network usage), battery saving (saves battery), efficient (efficient sync). Cons: Delay (not instant sync), may miss urgent (urgent sync delayed), inconsistency (inconsistent across devices). Best for: Non-urgent preferences, infrequent changes.
        </p>
        <p>
          Hybrid: real-time for important, batched for routine. Pros: Best of both (real-time for important, batched for routine). Cons: Complexity (two sync types), may confuse users. Best for: Most platforms—real-time for important, batched for routine.
        </p>

        <h3>Backup: Automatic vs. Manual</h3>
        <p>
          Automatic backup (backup automatically). Pros: Automation (automatically backup), user convenience (don&apos;t have to backup), consistency (consistently backup). Cons: Storage usage (uses storage), may backup unnecessarily (may backup unnecessarily), less control (less user control). Best for: Regular backup, user convenience.
        </p>
        <p>
          Manual backup (backup manually). Pros: User control (users control backup), storage saving (save storage), selective backup (backup what wanted). Cons: User burden (must manually backup), may forget (may forget to backup), inconsistency (inconsistently backup). Best for: User control, selective backup.
        </p>
        <p>
          Hybrid: automatic with manual option. Pros: Best of both (automatic for regular, manual for selective). Cons: Complexity (automatic and manual), may confuse users. Best for: Most platforms—automatic with manual option.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/saved-preferences/preferences-comparison.svg"
          alt="Preferences Approaches Comparison"
          caption="Figure 4: Preferences Approaches Comparison — Storage, sync, and backup trade-offs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Provide preference storage:</strong> Local storage. Cloud storage. Hybrid storage. Let users choose.
          </li>
          <li>
            <strong>Enable preference sync:</strong> Real-time sync. Batched sync. Manual sync. Let users choose.
          </li>
          <li>
            <strong>Provide preference backup:</strong> Automatic backup. Manual backup. Incremental backup. Let users choose.
          </li>
          <li>
            <strong>Enable preference restoration:</strong> Full restoration. Selective restoration. Versioned restoration.
          </li>
          <li>
            <strong>Manage preferences:</strong> Preference center. Show saved preferences. Enable preference editing. Enable preference deletion.
          </li>
          <li>
            <strong>Enable preference export:</strong> Export format. Export selection. Enable preference export.
          </li>
          <li>
            <strong>Enable preference import:</strong> Import format. Import selection. Enable preference import.
          </li>
          <li>
            <strong>Notify of preferences:</strong> Notify when preferences saved. Notify of preference sync. Notify of preference backup.
          </li>
          <li>
            <strong>Monitor preferences:</strong> Monitor preference usage. Monitor preference sync. Monitor preference backup.
          </li>
          <li>
            <strong>Test preferences:</strong> Test preference storage. Test preference sync. Test preference backup and restoration.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No preference storage:</strong> Preferences not saved. <strong>Solution:</strong> Provide preference storage.
          </li>
          <li>
            <strong>No preference sync:</strong> Preferences not synced. <strong>Solution:</strong> Enable preference sync.
          </li>
          <li>
            <strong>No preference backup:</strong> No preference backup. <strong>Solution:</strong> Provide preference backup.
          </li>
          <li>
            <strong>No preference restoration:</strong> Can&apos;t restore preferences. <strong>Solution:</strong> Enable preference restoration.
          </li>
          <li>
            <strong>Poor defaults:</strong> Poor default preferences. <strong>Solution:</strong> Sensible defaults.
          </li>
          <li>
            <strong>No preference management:</strong> Can&apos;t manage preferences. <strong>Solution:</strong> Provide preference center.
          </li>
          <li>
            <strong>No notification:</strong> Don&apos;t notify of preferences. <strong>Solution:</strong> Notify when saved.
          </li>
          <li>
            <strong>No monitoring:</strong> Don&apos;t know preference usage. <strong>Solution:</strong> Monitor preferences.
          </li>
          <li>
            <strong>Too many options:</strong> Overwhelming preference options. <strong>Solution:</strong> Sensible defaults, optional customization.
          </li>
          <li>
            <strong>No testing:</strong> Don&apos;t test preferences. <strong>Solution:</strong> Test preference storage and sync.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Browser Saved Preferences</h3>
        <p>
          Browsers provide saved preferences. Preference storage (store locally and in cloud). Preference sync (sync across devices). Preference backup (backup preferences). Users control browser preferences.
        </p>

        <h3 className="mt-6">OS Saved Preferences</h3>
        <p>
          Operating systems provide saved preferences. Preference storage (store locally). Preference sync (sync across devices). Preference backup (backup preferences). Users control OS preferences.
        </p>

        <h3 className="mt-6">App Saved Preferences</h3>
        <p>
          Apps provide saved preferences. Preference storage (store locally and in cloud). Preference sync (sync across devices). Preference backup (backup preferences). Users control app preferences.
        </p>

        <h3 className="mt-6">Cloud Service Saved Preferences</h3>
        <p>
          Cloud services provide saved preferences. Preference storage (store in cloud). Preference sync (sync across devices). Preference backup (backup preferences). Users control cloud service preferences.
        </p>

        <h3 className="mt-6">Gaming Platform Saved Preferences</h3>
        <p>
          Gaming platforms provide saved preferences. Preference storage (store locally and in cloud). Preference sync (sync across devices). Preference backup (backup preferences). Users control gaming preferences.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design saved preferences that balance persistence with privacy?</p>
            <p className="mt-2 text-sm">
              Implement secure preference storage because users want persistence (preferences available across sessions/devices) but don&apos;t want to compromise privacy (preferences shouldn&apos;t be exposed). Local storage for privacy: store locally (localStorage, IndexedDB, local config files)—preferences never leave device, maximum privacy, works offline. Cloud sync for persistence: sync to cloud (encrypted sync, user-controlled sync, selective sync)—preferences available across devices, survives device loss, requires network. Encryption for security: encrypt preferences (encrypt at rest, encrypt in transit, end-to-end encryption for sensitive preferences)—protects from unauthorized access, data breaches, insider threats. User control for privacy: users control preferences (choose what to sync, what to store locally, what to encrypt)—granular control, privacy-conscious users can keep sensitive preferences local only. The privacy insight: users want persistence but don&apos;t want to compromise privacy—provide local storage (maximum privacy), cloud sync (persistence across devices), encryption (security), user control (granular privacy choices), and let users choose their privacy/persistence balance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement preference sync?</p>
            <p className="mt-2 text-sm">
              Implement sync management because users expect preferences to follow them across devices seamlessly. Sync selection: select what to sync (all preferences, specific categories, exclude sensitive)—user control over what syncs, sensitive preferences can stay local. Sync scheduling: schedule sync (sync on change, sync on app launch, sync periodically, manual sync)—balance freshness with bandwidth, battery, user control. Sync conflict resolution: resolve conflicts (last-write-wins, manual resolution, merge non-conflicting changes)—conflicts inevitable when editing on multiple devices, clear resolution strategy. Sync enforcement: enforce sync (sync required for cloud preferences, sync before device switch, verify sync complete)—ensure consistency, prevent data loss. The sync insight: users want sync across devices—provide selection (what syncs), scheduling (when to sync), conflict resolution (handle conflicts), enforcement (ensure consistency), and make sync seamless and reliable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle preference conflicts?</p>
            <p className="mt-2 text-sm">
              Implement conflict resolution because conflicts happen when same preference edited on multiple devices before sync completes. Conflict detection: detect conflicts (compare timestamps, compare content hashes, detect concurrent edits)—identify conflicts before they cause data loss. Conflict resolution: resolve conflicts (last-write-wins for simple preferences, manual resolution for complex, merge non-conflicting changes)—clear strategy, minimize data loss. User override: override conflicts (user chooses which version, merge manually, keep both)—user control for important preferences, automatic for trivial. Conflict logging: log conflicts (record conflict details, resolution chosen, user actions)—audit trail, debug sync issues, improve conflict resolution. The conflict insight: conflicts happen—detect early (timestamps, hashes), resolve clearly (last-write-wins, manual, merge), allow user override (user chooses), log everything (audit, debug), and make conflict resolution transparent to users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you backup and restore preferences?</p>
            <p className="mt-2 text-sm">
              Implement backup and restoration because users want to recover preferences after device loss, reset, or migration. Automatic backup: backup automatically (backup on change, daily backup, backup before major updates)—no user action needed, always current backup. Manual backup: backup manually (user-initiated backup, backup before risky operations, export backup)—user control, backup on demand. Full restoration: restore all (restore all preferences from backup, complete restore)—recover everything, simple restore. Selective restoration: restore selected (restore specific categories, restore individual preferences, merge with existing)—flexible restore, keep some current preferences. The backup insight: users want backup and restoration—provide automatic (always current), manual (on demand), full (complete restore), selective (flexible restore), and make backup/restore simple and reliable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you export and import preferences?</p>
            <p className="mt-2 text-sm">
              Implement export and import because users want portability (move preferences between devices, platforms, accounts). Export format: export in format (JSON for portability, XML for compatibility, proprietary for platform-specific)—choose format based on use case, JSON most portable. Export selection: select what to export (all preferences, specific categories, exclude sensitive)—user control, export only what needed. Import format: import from format (JSON, XML, proprietary, auto-detect format)—support multiple formats, auto-detect simplifies import. Import selection: select what to import (all, specific categories, merge with existing)—flexible import, don&apos;t overwrite unwanted. The export/import insight: users want portability—provide export (multiple formats), import (multiple formats, auto-detect), selection (what to export/import), and make preferences portable across devices, platforms, accounts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you secure saved preferences?</p>
            <p className="mt-2 text-sm">
              Implement preference security because preferences can be sensitive (authentication settings, privacy choices, payment preferences). Encryption: encrypt preferences (encrypt at rest, encrypt in transit, end-to-end for sensitive)—protect from unauthorized access, data breaches. Access control: control access (user-only access, app-only access, role-based access)—limit who can read/write preferences. Secure storage: store securely (secure enclave, encrypted storage, keychain/credential manager)—use platform security features, protect from malware. Secure sync: sync securely (encrypted sync, authenticated sync, verified sync)—protect preferences during sync, verify sync integrity. The security insight: preferences are sensitive—encrypt (at rest, in transit), control access (user, app, role-based), store securely (platform security features), sync securely (encrypted, authenticated, verified), and treat preferences as sensitive data requiring protection.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Storage_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Storage API
            </a>
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/extensions/reference/storage/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome — Storage API
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/user-preferences/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — User Preferences
            </a>
          </li>
          <li>
            <a
              href="https://support.google.com/accounts/answer/32050"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google — Sync Preferences
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/en-us/HT204011"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple — iCloud Preferences Sync
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/webstorage/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — Web Storage Specification
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

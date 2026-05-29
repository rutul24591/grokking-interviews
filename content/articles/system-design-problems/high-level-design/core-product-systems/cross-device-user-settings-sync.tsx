"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-cross-device-user-settings-sync",
  title: "Design Cross-Device User Settings Sync",
  description:
    "Architecture for syncing user preferences across devices: conflict resolution, partial sync, offline support, schema versioning, and privacy controls.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "cross-device-user-settings-sync",
  wordCount: 6100,
  readingTime: 36,
  lastUpdated: "2026-05-20",
  tags: ["hld", "settings-sync", "conflict-resolution", "offline", "CRDT", "schema-versioning"],
  relatedTopics: ["settings-page-system", "offline-form-sync-system"],
};

export default function CrossDeviceUserSettingsSyncArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Cross-device settings sync is the system that keeps a user's preferences consistent across phones,
          tablets, desktop browsers, native desktop apps, TVs, and sometimes embedded devices. The product
          expectation is simple: if a user disables marketing notifications on their phone, the web app should
          stop showing those notifications as well. The engineering problem is harder because every device has
          local state, intermittent connectivity, different app versions, different storage limits, and different
          privacy rules.
        </HighlightBlock>
        <p>
          A production design should treat this as a distributed state replication problem, not as a basic profile
          update endpoint. Devices must support read-your-writes locally, work while offline, upload queued changes
          later, accept changes from other devices, and avoid losing newer settings when an old client comes back
          after weeks. The system also needs clear product semantics for conflicts because settings are not
          automatically mergeable. If one device enables dark mode while another disables it, the platform needs a
          deterministic rule. If two devices add different items to a muted-words list, overwriting one list with the
          other is poor user experience.
        </p>
        <p>
          In an interview, clarify the scope before drawing components. A strong baseline is 50 to 200 settings per
          user, 10 active devices, less than 100 KB of total settings payload, less than five seconds cross-device
          propagation when online, and local reads that always work even when the sync service is unavailable. The
          design should handle full restore on a new device, incremental delta sync during normal use, device-class
          partial sync, per-setting privacy opt-out, and schema evolution across old and new app versions.
        </p>
        <p>
          It is also useful to separate "settings" from other user data during requirement clarification. Preferences
          are small, frequently read, and usually user-owned. They differ from activity history, content drafts,
          shopping carts, or collaborative documents because the consistency model can be simpler and the product
          surface is often less tolerant of visible conflict prompts. That does not mean the system is trivial. A bad
          settings sync design can silently re-enable notifications, lose accessibility preferences, apply an unsafe
          default on a shared TV, or resurrect deleted personalization choices after an old device reconnects.
        </p>
        <p>
          The design target is eventual consistency with strong local UX. Users should not wait for a global consensus
          write before a toggle moves, and they should not lose their local preference just because an airplane mode
          session lasted longer than expected. The server is authoritative for cross-device convergence, audit, schema
          validation, and privacy enforcement. The client is authoritative for immediate interaction and offline reads
          until the server returns a newer or policy-corrected value.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Per-Key State Instead of One Large Settings Document</h3>
        <p>
          The most important modeling choice is sync granularity. A single settings document is easy to fetch and
          cache, but every concurrent edit conflicts with every other concurrent edit. Per-key state reduces false
          conflicts: a mobile edit to push notification preferences should not block a laptop edit to theme
          preferences. Each setting record should carry the key, value, logical timestamp, source device, schema
          version, sync eligibility, and merge strategy. Tightly coupled settings can still be grouped into small
          atomic families when partial updates would create invalid state.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Hybrid Logical Clocks and Idempotent Mutations</h3>
        <p>
          Device wall clocks are not trustworthy enough to be the only source of ordering. A hybrid logical clock
          combines physical time with a logical counter so a device can generate sortable timestamps offline while
          preserving causality after it observes server or peer state. Every mutation should also carry a stable
          mutation identifier, allowing retries after network timeouts without double-applying the same change. The
          server should advance a device's sync watermark only after it has durably accepted the mutation batch and
          prepared the response delta.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Merge Policies Are Product Semantics</h3>
        <p>
          Last-write-wins is acceptable for many scalar preferences, but it is not a universal correctness rule.
          Boolean toggles, enum choices, and numeric thresholds often use last-write-wins. Sets, muted keywords,
          pinned items, and shortcut lists may need union, remove-wins, or domain-specific merge policies. Sensitive
          controls such as security preferences may require server-side validation and explicit user confirmation
          instead of silent conflict resolution. Principal-level interview answers should name these differences
          because the hardest failures are usually semantic data-loss bugs, not raw transport errors.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Schema Compatibility and Unknown-Key Preservation</h3>
        <p>
          Settings outlive individual client versions. A new app may introduce a key that an older app cannot render,
          or rename a setting into a nested namespace. Older clients must preserve unknown keys rather than deleting
          them during sync. Newer clients must provide defaults for missing keys and run migrations safely. The server
          becomes the schema authority: it validates known keys, translates deprecated keys when needed, and refuses
          malformed values while leaving unrelated settings untouched.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Watermarks, Tombstones, and Device Identity</h3>
        <p>
          A watermark represents the newest server state a device has fully incorporated. The device sends this value
          on every sync so the server can return only changes after that point. Watermarks should be server-issued,
          opaque, and monotonic from the client's perspective. They should not be guessed from local timestamps because
          the server may compact logs, migrate schema, or withhold some keys due to privacy and device profile rules.
          If the local cache is restored from backup or suspected corrupt, the device should discard the watermark and
          perform a full sync.
        </p>
        <p>
          Tombstones are required because deletion is state. If a user removes a pinned shortcut on a laptop while a
          phone is offline, the phone may later upload an older list that still contains the shortcut. Without a
          deletion marker, the server cannot distinguish "the phone intentionally re-added the shortcut" from "the
          phone had stale state." Tombstones should include the key or list item, deletion timestamp, source device,
          and compaction eligibility. Device identity also matters: every device needs a stable server-registered
          device ID so sync behavior can be debugged, stale clients can be quarantined, and users can revoke lost
          devices from the settings surface.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/cross-device-user-settings-sync-architecture.svg"
          alt="Cross-device settings sync architecture showing local cache, delta queue, settings API, authoritative store, conflict resolver, schema registry, privacy filter, and push fanout"
          caption="Architecture: local-first reads, durable delta upload, authoritative server merge, privacy filtering, and push-triggered catch-up on other devices."
        />
        <p>
          The client uses a local settings store as the primary read path. Browser clients commonly use IndexedDB
          for structured state and localStorage only for tiny bootstrap flags. Native clients use SQLite or platform
          key-value storage. When the user changes a setting, the UI updates the local store immediately, appends a
          mutation to an outbox, and schedules a sync. This provides read-your-writes even when the network is down
          and avoids blocking interactive UI on a remote write.
        </p>
        <p>
          Normal sync is delta-based. The client sends unsynced mutations and its last known server watermark. The
          Settings API authenticates the user and device, verifies the schema version, filters out device-local or
          privacy-disabled keys, and forwards the batch to the merge layer. The merge layer compares incoming records
          with the authoritative per-key state, applies the configured merge policy, stores accepted results, records
          rejected or superseded mutations, and returns both acknowledgements and any server-side changes the device
          has not yet seen.
        </p>
        <p>
          The authoritative store can be implemented in a relational database or distributed key-value store. A common
          layout is partitioned by user ID with rows keyed by setting key. A separate append-only mutation log is
          useful for auditability, replay, debugging conflict behavior, and feeding push fanout. The current-value
          table serves reads and full restore. The mutation log serves delta catch-up and operational investigations.
          For very large consumer systems, the current table may live in a strongly consistent regional store while
          derived read caches and fanout queues handle low-latency propagation.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/cross-device-user-settings-sync-workflow.svg"
          alt="Cross-device settings sync workflow from local edit to outbox, delta upload, server merge, acknowledgement, push signal, and peer device catch-up"
          caption="Delta workflow: local edit is durable first, server merge is idempotent, and other devices catch up through push-triggered delta pulls."
        />
        <p>
          Online peers should receive changes quickly, but push should be treated as a hint rather than the source of
          truth. Web and desktop clients can maintain Server-Sent Events or WebSocket subscriptions while foregrounded.
          Mobile clients typically receive APNs or FCM notifications that say "settings changed" and then perform a
          delta pull. The push payload should not contain sensitive setting values because third-party push
          infrastructure and lock-screen displays are not appropriate places for preference data.
        </p>
        <p>
          Full sync is reserved for new devices, factory resets, local database corruption, or server-directed
          recovery. The device requests all settings for its device profile, receives the current values plus schema
          metadata, rebuilds its local cache, and stores a new watermark. Restricted devices such as TVs may subscribe
          only to playback, subtitle, and household profile settings. A laptop may subscribe to the full profile.
          Partial sync reduces storage, bandwidth, and accidental privacy exposure.
        </p>
        <p>
          The sync API should be explicit about outcomes. A batch response should not be just "200 OK." It should tell
          the client which mutations were accepted, which were already seen, which were superseded by newer server
          state, which were rejected by schema validation, and which require user-visible follow-up. This response
          contract lets clients clear only the correct outbox entries. It also prevents a common failure where a
          partially processed request times out and the client either drops unsynced changes or retries changes that
          already produced a conflict.
        </p>
        <p>
          At large scale, the fanout path should be decoupled from the write path. The server can commit the merged
          setting and append a mutation-log event in the same transaction, then let a fanout worker publish invalidation
          hints to active channels and mobile push systems. If fanout is down, the write still succeeds and other
          devices catch up on foreground pull or periodic sync. If the store is down, the write fails and the client
          keeps the mutation in its outbox. This separation keeps correctness tied to durable storage rather than to
          best-effort real-time delivery.
        </p>
        <p>
          Multi-region deployments introduce another design choice. If settings are tied to a user's home region, all
          writes can route to that region and reads from other regions can use cached or replicated state. This keeps
          conflict logic simple but adds cross-region latency for traveling users. Active-active writes reduce latency
          but require globally ordered mutation streams or deterministic conflict resolution across regions. For most
          preference systems, home-region writes plus edge-cached reads are the simpler and more reliable answer.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/cross-device-user-settings-sync-conflicts.svg"
          alt="Conflict resolution comparison showing last-write-wins, set union, custom merge, and schema migration with unknown-key preservation"
          caption="Conflict handling: choose merge policy per setting family, not one global rule for every preference."
        />
        <p>
          Last-write-wins is operationally simple and cheap. It works well for independent scalar values where the
          latest user intent should replace previous state. Its weakness is that timestamp ordering is only an
          approximation of human intent. If two offline devices edit the same setting, the winner may surprise the
          user. Hybrid logical clocks reduce clock-skew damage but do not answer semantic questions such as whether a
          list should be replaced or merged. A mature system makes the default simple while giving high-value setting
          families explicit policies.
        </p>
        <p>
          CRDT-style structures can remove some conflict classes, especially for sets, counters, and ordered
          collections, but they add storage overhead, tombstones, and mental complexity. They are valuable when
          concurrent independent edits are common and losing either edit is unacceptable. They are usually unnecessary
          for every preference key. A practical design uses last-write-wins for most scalar settings, set semantics
          for additive collections, and custom server-side logic for security, billing, or notification preferences.
        </p>
        <p>
          Per-key sync minimizes conflict blast radius, but it can expose inconsistent intermediate states for related
          keys. For example, a custom theme selection and a custom color palette should not arrive independently if
          one without the other renders a broken UI. Grouping related settings into atomic families solves that issue
          at the cost of higher conflict probability. The correct boundary is a product invariant: settings that must
          be interpreted together should sync together.
        </p>
        <p>
          Immediate sync offers the best propagation latency but can create unnecessary write amplification when users
          drag sliders, toggle settings repeatedly, or edit multi-field preference forms. Debounced sync reduces load
          and fanout churn, but it increases the window where another device is stale. For most settings, a short
          debounce plus foreground flush is the right trade-off. Critical settings such as security or notification
          consent should flush immediately and show clear state if the server rejects the update.
        </p>
        <p>
          Strong consistency is tempting but usually unnecessary. A design that synchronously writes every toggle to a
          strongly consistent global database before updating the UI creates latency and availability problems for a
          feature that should feel instant. The stronger guarantee that matters is local read-your-writes, not global
          linearizability for every setting. However, some settings deserve stronger treatment. Account security,
          consent, billing notification routing, and enterprise policy overrides may need server confirmation before
          the UI can claim the final effective state.
        </p>
        <p>
          Event sourcing is valuable for auditing and replay, but it is not a substitute for a compact current-value
          store. Serving every settings page by replaying all historical mutations is unnecessary overhead and makes
          tail latency depend on account age. A common compromise is to store current per-key state for reads and
          maintain a bounded or archived mutation log for sync, audit, and debugging. The log can be compacted by
          watermark once devices are known to have caught up, while compliance-relevant events can be retained longer
          in a separate audit store.
        </p>
        <p>
          Client-side encryption changes the trade-off space. If values are encrypted so the server cannot inspect
          them, the server can still sync opaque blobs but loses the ability to validate schema, apply semantic merge
          policies, or filter some keys by value. That may be required for highly sensitive preferences, but it pushes
          conflict handling to clients and can make old-client preservation harder. A practical system may encrypt
          selected sensitive values while leaving non-sensitive metadata such as key name, version, device profile,
          and tombstone state available for safe synchronization.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-level decision frame</h3>
        <p>
          The principal-level choice is not "strong consistency or eventual consistency"; it is which settings are
          product preferences, which are policy decisions, and which are regulated consent or security controls. Visual
          preferences can be local-first and eventually synced. Enterprise policy and parental controls may need
          server-confirmed effective state. Consent, notification routing, and account security settings may need audit
          retention, stricter ordering, and immediate fanout. Splitting settings by criticality avoids overengineering
          theme sync while underprotecting sensitive controls.
        </p>
        <p>
          Operability should be designed around reconciliation. Support and privacy teams need to answer which device
          changed a value, which merge policy won, whether an old client preserved an unknown key, whether a deletion
          was propagated, and whether a device is behind a sync watermark. A settings sync system without replay,
          compaction, device watermarks, and per-key policy visibility becomes difficult to debug once users own many
          devices and versions.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Design the client as local-first but not server-blind. Local state should update immediately, yet every
          pending mutation needs a visible lifecycle internally: queued, syncing, accepted, superseded, rejected, or
          requires user action. The UI does not need to show all of these states for every preference, but the
          telemetry and debug tooling do. Without mutation lifecycle tracking, support teams cannot explain why a
          setting reverted after a device reconnected.
        </p>
        <p>
          Make sync idempotent and replayable. The server should safely handle duplicate mutation batches, out-of-order
          arrivals, and a client retrying after receiving no response. Store enough information to answer: which
          device changed this setting, what policy was applied, what value won, which devices have acknowledged the
          result, and whether a schema migration touched the value. This is especially important when privacy,
          accessibility, notification consent, or security settings are involved.
        </p>
        <p>
          Separate privacy eligibility from transport mechanics. A key marked device-local should not enter the
          upload outbox. A key that was previously synced and is later opted out should be deleted or tombstoned on
          the server according to retention policy, while remaining locally available on the device. Privacy decisions
          should be enforced on both client and server because old clients, compromised clients, and bugs can bypass
          client-only rules.
        </p>
        <p>
          Build operational controls early. Track sync success rate, average staleness by device class, conflict rate
          by setting family, push-to-pull delay, schema rejection rate, outbox age, and full-sync frequency. High
          conflict rate may indicate a bad merge policy. Rising full-sync frequency may indicate local storage
          corruption or clients incorrectly resetting watermarks. Long outbox age on mobile may indicate background
          execution limits or battery optimization issues.
        </p>
        <p>
          Make rollout safety part of the schema process. New settings should launch behind server-recognized schema
          definitions before clients start writing them at scale. Renames should go through a dual-read or dual-write
          period where both old and new keys are understood, metrics confirm old-client behavior, and only then can
          the deprecated key be compacted. This is especially important for products with long-lived mobile versions
          because a meaningful percentage of users may run old clients for months.
        </p>
        <p>
          Give users and support teams recovery controls. A user should be able to see active devices, revoke a lost
          device, and reset device-local settings where appropriate. Support tooling should show recent setting
          changes without leaking sensitive values unnecessarily. Engineering tooling should be able to force a full
          sync for a device, quarantine a broken client version, and inspect merge decisions by mutation ID. These
          controls are often the difference between a theoretically correct design and an operable production system.
        </p>
        <p>
          Keep the effective-settings model explicit. The value used by the product may be a combination of user
          preference, tenant policy, device capability, parental control, locale default, and experiment assignment.
          Sync should store user intent, while the product layer computes effective value. Mixing these together leads
          to bugs where an enterprise policy appears to overwrite a user preference, or a temporary experiment changes
          the stored preference permanently.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          A common mistake is letting old clients overwrite unknown new keys. This happens when a client downloads
          settings, drops keys it does not recognize, and later uploads its local document as the full truth. The fix
          is to use patch-style deltas, preserve unknown keys, and have the server own canonical schema migrations.
          Full document replacement should be rare and guarded by schema version checks.
        </p>
        <p>
          Another pitfall is using local device time as a silent authority. Users travel across time zones, manually
          change clocks, restore devices from backups, and run old app versions. If the merge system blindly trusts
          wall-clock timestamps, stale devices can resurrect old settings. Use hybrid logical clocks, server-observed
          timestamps for auditing, stale-device detection, and policy-specific safeguards for high-risk keys.
        </p>
        <p>
          Teams also underestimate deletion semantics. Deleting a setting, resetting to default, and omitting an
          unknown key are different events. The system needs tombstones with retention windows so an offline device
          does not reintroduce a deleted value when it reconnects. Tombstones should be compacted only after all
          active devices have advanced beyond the deletion watermark or after an explicit retention period.
        </p>
        <p>
          Finally, push fanout is often over-trusted. Push delivery can be delayed, dropped, coalesced, or blocked by
          OS policy. Correctness must come from pull-based delta sync using durable watermarks. Push exists to improve
          freshness, not to guarantee consistency.
        </p>
        <p>
          A subtler pitfall is allowing every client to define its own default values. If default theme, locale,
          notification cadence, or privacy choices differ between app versions, a user may observe settings flipping
          even though no explicit mutation happened. Defaults should be versioned and ideally server-described for
          settings that affect cross-device behavior. Clients can still render locally, but they should know whether a
          value is explicit, inherited from default, enforced by policy, or unavailable on that device.
        </p>
        <p>
          Teams can also break sync by making outbox writes non-durable. If the UI changes local state but the outbox
          append fails, the user sees the new preference until the app restarts, then the change disappears. The local
          mutation and visible local value should be committed atomically. If that cannot be guaranteed, the client
          should fail closed by keeping the old value visible and surfacing that the change could not be saved.
        </p>
        <p>
          Another production failure is uncontrolled sync storms. A backend incident, push replay, or schema rejection
          can make millions of clients perform full sync simultaneously. Clients need backoff, jitter, server-directed
          retry-after hints, and guardrails that prevent repeated full sync loops. The server needs rate limits by
          user, tenant, device class, and client version so one bad release does not consume the entire settings
          platform.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Consumer productivity suites use cross-device sync for editor preferences, sidebar layout, notification
          routing, keyboard shortcuts, and recently selected workspaces. These settings are small, but the user impact
          is high because inconsistency makes the product feel unreliable. Enterprise suites add tenant policies that
          can override user preferences, so the sync layer must distinguish user-owned settings from admin-enforced
          effective settings.
        </p>
        <p>
          Media products sync playback preferences, subtitle language, parental controls, household profile settings,
          and download policies across phones, TVs, and browsers. Device-class partial sync matters because TVs do
          not need every web preference and mobile clients may have offline downloads governed by local-only storage
          rules. Privacy-sensitive items such as personalization signals may require opt-out and server deletion.
        </p>
        <p>
          Financial, healthcare, and collaboration products treat some settings as compliance artifacts. Notification
          consent, accessibility preferences, data-sharing choices, and security controls require audit trails and
          conservative merge behavior. A principal-level design should state which keys are ordinary preferences and
          which keys require stronger validation, audit retention, or explicit user confirmation after conflicts.
        </p>
        <p>
          Enterprise SaaS products add another layer: organization policy may disable user control for selected
          settings. The sync service should not overwrite user intent with policy; it should store user intent and let
          an effective-settings resolver apply policy at read time. That allows the user's original preference to take
          effect automatically if an admin later removes the override. It also makes audit trails clearer because the
          system can explain whether a value came from user choice, admin policy, device limitation, or default.
        </p>
        <p>
          Developer tools and IDE-like products often sync keyboard shortcuts, layout, theme, plugin preferences, and
          workspace-specific overrides. These systems need namespacing because global settings, organization settings,
          project settings, and device-local settings can all exist for the same conceptual feature. A strong design
          defines precedence and sync boundaries rather than treating every key as a flat global preference.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you handle a user changing the same setting on two offline devices?
        </h3>
        <p>
          I would first classify the setting. For scalar preferences such as theme or default landing page, I would
          use last-write-wins ordered by a hybrid logical clock and return the winning value to the losing device in
          the sync response. For set-like preferences such as muted keywords, I would use a merge policy that
          preserves independent additions and applies explicit tombstones for removals. For high-risk settings such
          as security controls or consent, I would avoid silent resolution and either require server validation or
          surface a conflict that asks the user to confirm the final state.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Why not store all settings as one JSON document and replace it on every sync?
        </h3>
        <p>
          A single document is simple for a prototype but weak for concurrent editing and schema evolution. It
          creates false conflicts because unrelated changes overwrite each other, and it lets old clients accidentally
          delete unknown keys. Per-key or per-family records allow independent merge policies, smaller payloads,
          partial sync by device class, and safer migration. I would still group tightly coupled fields into atomic
          families when product invariants require them to move together.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you make the sync protocol reliable when network requests time out?
        </h3>
        <p>
          Each mutation batch should be idempotent. The client assigns stable mutation identifiers and does not advance
          its watermark until the server confirms durable acceptance. If a request times out, the client retries the
          same batch. The server deduplicates already-seen mutation identifiers and compares per-key timestamps before
          applying values, so retries do not corrupt state. The response should include accepted mutations, superseded
          mutations, rejected mutations, server-side deltas since the client's watermark, and the new watermark to
          persist locally.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you support older app versions when the settings schema changes?
        </h3>
        <p>
          The server should maintain a schema registry with canonical keys, deprecated aliases, value validators, and
          migration rules. Clients include their schema version in sync requests. Unknown keys are preserved locally
          and round-tripped, not dropped. When a key is renamed, the server can translate between old and new forms for
          older clients while storing the canonical representation internally. Dangerous migrations should be
          one-way, observable, and guarded by rollout metrics so a bad client version cannot corrupt settings at
          scale.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          What metrics would you use to operate this system at scale?
        </h3>
        <p>
          I would track sync success rate, p95 and p99 sync latency, average device staleness, outbox age, conflict
          rate by setting family, schema validation failures, rejected mutation rate, full-sync frequency, push
          delivery-to-delta-pull time, and server merge latency. I would alert on sustained outbox age, spikes in
          conflicts after client releases, schema rejection increases, and unusual full-sync volume. These metrics
          distinguish transport problems from schema problems and merge-policy problems.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do privacy controls change the architecture?
        </h3>
        <p>
          Privacy controls require filtering before upload, enforcement on the server, and deletion semantics for
          previously synced keys. A device-local key should never enter the upload outbox. If a synced key becomes
          private, the server should remove or tombstone it according to retention policy and stop returning it to
          other devices. Push payloads should contain only invalidation hints, not sensitive values. The audit log
          should record policy decisions without exposing unnecessary preference data to operators.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://cse.buffalo.edu/tech-reports/2014-04.pdf" target="_blank" rel="noreferrer">
              Hybrid Logical Clocks
            </a>
            , Kulkarni, Demirbas, Madappa, Avva, and Leone.
          </li>
          <li>
            <a href="https://martin.kleppmann.com/papers/local-first.pdf" target="_blank" rel="noreferrer">
              Local-first software: You own your data, in spite of the cloud
            </a>
            , Kleppmann et al.
          </li>
          <li>
            <a href="https://martin.kleppmann.com/papers/behind-the-scenes.pdf" target="_blank" rel="noreferrer">
              A Conflict-Free Replicated JSON Datatype
            </a>
            , Kleppmann and Beresford.
          </li>
          <li>
            <a href="https://developer.apple.com/documentation/usernotifications" target="_blank" rel="noreferrer">
              Apple UserNotifications Framework
            </a>
            , platform constraints relevant to push-triggered sync.
          </li>
          <li>
            <a href="https://firebase.google.com/docs/cloud-messaging" target="_blank" rel="noreferrer">
              Firebase Cloud Messaging documentation
            </a>
            , mobile push notification delivery model.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

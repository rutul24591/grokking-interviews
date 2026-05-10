"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-cross-device-user-settings-sync",
  title: "Design Cross-Device User Settings Sync",
  description:
    "Architecture for syncing user preferences across devices: conflict resolution, partial sync, offline support, schema versioning, and privacy controls.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "cross-device-user-settings-sync",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-10",
  tags: ["hld", "settings-sync", "conflict-resolution", "offline", "CRDT", "schema-versioning"],
  relatedTopics: ["settings-page-system", "offline-form-sync-system"],
};

export default function CrossDeviceUserSettingsSyncArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>User settings synchronization is deceptively complex for a feature that appears simple on the surface. A user who changes their notification preferences on their phone expects those preferences to be reflected when they open the app on their laptop. The synchronization must handle a device that has been offline for two weeks (returning with settings changes that conflict with changes made on other devices in the interim), a factory reset that wipes local settings (requiring full restoration from the server), and a schema migration when the application adds a new settings category that older app versions do not understand.</p>
        <p>The problem is a distributed system coordination problem: multiple clients (devices), each with local state, must remain eventually consistent with a central server while supporting offline operation and graceful conflict resolution. Settings are not a CRDT (conflict-free replicated data type) by nature—two conflicting changes to the same setting (device A sets dark mode on, device B sets dark mode off, while both were offline) cannot be automatically merged without a semantic understanding of the user's intent.</p>
        <p><strong>Explicit assumptions:</strong> Settings are a flat or shallow-nested key-value structure (not deeply nested documents). Values are primitive types or small enums (booleans, strings, numbers). A typical user has 50–200 settings keys. The user has up to 10 devices (phone, tablet, laptop, work computer, smart TV). Settings must be available offline (last-synced values cached locally). The sync protocol must be efficient (not re-transmitting all settings on every sync, only deltas since the last successful sync).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Bidirectional sync:</strong> Changes on any device propagate to all other devices. Sync is bidirectional: local changes upload to the server, server changes download to the local device.</li>
          <li><strong>Conflict resolution:</strong> When two devices modify the same setting while offline, the conflict is resolved deterministically. Last-write-wins (by logical timestamp) is the default; user-preference-priority settings (like "preferred device" markers) use a different resolution strategy.</li>
          <li><strong>Offline support:</strong> Settings are readable and modifiable when offline. Changes made offline queue and sync when connectivity is restored.</li>
          <li><strong>Partial sync:</strong> Devices with restricted storage (smart TV, IoT) can sync a subset of settings (only the settings relevant to that device class).</li>
          <li><strong>Schema versioning:</strong> When new settings are added or existing settings renamed, older app versions must handle the new schema gracefully (ignoring unknown keys) and newer app versions must handle old schema (providing defaults for missing keys).</li>
          <li><strong>Privacy controls:</strong> Certain settings (browsing history, personalization signals) can be opted out of cross-device sync by the user.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Sync latency:</strong> A settings change on one device should be visible on another device within 5 seconds when both are online.</li>
          <li><strong>Data volume:</strong> A full sync download (new device or after factory reset) must complete within 2 seconds on a 4G connection. This constrains total settings data to under 100KB.</li>
          <li><strong>Availability:</strong> Local settings are always available (read from local cache). Sync failures are silent to the user unless they persist for more than 24 hours.</li>
          <li><strong>Correctness:</strong> A setting changed and immediately read on the same device must return the changed value (read-your-writes consistency), even before the change has synced to the server.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The settings sync system uses a client-local cache as the primary read path (for offline support and read-your-writes) with a server-side authoritative store as the sync target. Each settings change is written to the local cache immediately (for instant UI response) and queued for upload. The upload is a delta of changes since the last successful sync, identified by a vector clock or a per-device logical timestamp. The server merges incoming deltas from all devices, resolves conflicts using last-write-wins semantics, and notifies other devices of changes via Server-Sent Events or push notifications. Other devices pull the changes on next foreground activation or via the push notification trigger.</p>
        <p>The data model treats each setting as an independent key-value pair with an associated logical timestamp and deviceId. This granularity (per-key, not per-settings-document) means a conflict on notification_email does not block syncing of dark_mode_enabled. Two devices can independently change different settings while offline and sync both changes successfully without conflict.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/cross-device-user-settings-sync-architecture.svg"
          alt="Cross-device settings sync architecture showing local settings cache (IndexedDB/localStorage) as primary read path, delta upload queue, server-side settings store with per-key logical timestamps, conflict resolution via last-write-wins, SSE push to other devices, and full sync bootstrap for new devices. Privacy opt-out filter and schema version negotiation shown."
          caption="Settings sync architecture: local cache for reads, delta upload queue, server-side LWW conflict resolution, SSE delivery to other devices"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Settings Data Model and Logical Timestamps</h3>
        <p>Each setting entry in the settings store is a tuple of (userId, key, value, logicalTimestamp, deviceId, syncedAt). The logicalTimestamp is a hybrid logical clock (HLC) value: a combination of the physical timestamp and a logical counter, formatted as a single 64-bit integer that is monotonically increasing and comparable across devices even when physical clocks are skewed. HLC values are generated locally on the device at the moment of change and are not dependent on server time, enabling offline timestamp generation that remains globally orderable.</p>
        <p>When the server receives a delta from a device, it compares each incoming (key, logicalTimestamp) pair to the current value in the store. If the incoming logicalTimestamp is greater (more recent) than the stored value's timestamp, the server applies the update. If the stored value's timestamp is greater (another device submitted a more recent change), the server rejects the incoming change for that key and returns the stored value. This is last-write-wins (LWW) conflict resolution at the key level. The losing device receives the winning value in the sync response and updates its local cache.</p>
        <p>LWW is not ideal for all settings. Consider "active device" or "favorite items list" settings where both devices' values are meaningful and should be merged, not overwritten. For these settings, the data model supports per-key merge strategies: the key is annotated with a merge_strategy field (lww, set-union, custom). Set-union merge is appropriate for list-valued settings: both devices' lists are merged and deduplicated. Custom merge strategies are functions registered by the settings schema that receive the two conflicting values and return a merged value—for example, merging two partial tab restoration states by taking the union of open tabs from both devices.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Delta Sync Protocol</h3>
        <p>A full settings sync (used only for new devices or after data loss) transmits all settings for the user. A delta sync (the common case) transmits only the settings that have changed since the device's last successful sync. The device tracks its "sync watermark": the highest logicalTimestamp of any setting that has been successfully confirmed synced by the server. On next sync, the device sends only settings with logicalTimestamp &gt; syncWatermark and requests from the server any settings with logicalTimestamp &gt; syncWatermark on the server side (settings changed by other devices since the last sync).</p>
        <p>This delta protocol is efficient: a device that was offline for two weeks but only changed 3 settings will upload 3 settings and download whatever other devices changed (potentially more if other devices were active, but still a bounded payload). The protocol uses a single PATCH request to the Settings API with the delta payload (a JSON array of (key, value, timestamp) tuples). The response contains the server-resolved values for all conflicted keys and the list of all settings changed by other devices since the device's watermark. The device applies these changes to its local cache and advances its watermark to the highest timestamp in the response.</p>
        <p>Network failures during sync are handled by retrying the same delta (the upload is idempotent: sending the same (key, value, timestamp) tuple twice produces the same result as sending it once). The watermark is not advanced until the server has confirmed receipt. A device that fails mid-sync retries the entire delta on the next sync attempt, producing no data loss but potentially re-uploading already-received changes (which the server deduplicates by timestamp comparison).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-Time Push to Other Devices</h3>
        <p>After the server applies a settings update, it notifies all other active devices of the change via Server-Sent Events (SSE). Each device maintains an SSE connection to the server while the application is in the foreground. The SSE event payload is a minimal delta with fields like key, value, logicalTimestamp, and sourceDeviceId. Receiving devices apply the update to their local cache immediately and update the UI if the changed setting is currently displayed.</p>
        <p>For mobile devices where maintaining a persistent SSE connection is battery-inefficient, the server sends a push notification (APNs/FCM) when the settings store is updated. The push notification triggers a background app fetch, which performs a delta sync. The push notification payload is minimal (it just signals "sync needed," not the actual changes) to stay within push payload size limits and for privacy (settings changes should not be transmitted in plaintext in push notification payloads, which transit third-party infrastructure).</p>
        <p>When a device comes back online (network reconnects, app comes to foreground), it proactively initiates a delta sync to catch up on any changes it missed while offline. The SSE connection is re-established and the first event the server sends is a "you may be behind, sync now" signal, prompting an immediate delta sync. This ensures that a device that was offline for hours catches up completely within seconds of coming back online.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Schema Versioning and Backward Compatibility</h3>
        <p>Settings schemas evolve: new settings are added, existing settings are renamed, value types change (a string setting becomes an enum). The sync protocol must handle devices running different app versions with different schema versions. The approach: unknown keys are always preserved and round-tripped. When device A (running app version 2.0 with a new "notifications_digest" setting) syncs with device B (running app version 1.5 that does not have this setting), device B stores the unknown "notifications_digest" key in its local settings cache under an "unknown_keys" namespace, does not apply it to the UI, but does include it in future delta uploads back to the server. This prevents newer settings from being deleted by older devices that sync and overwrite server state with an older schema.</p>
        <p>Renamed settings require a migration mapping. When the app is upgraded from a version where the setting was "email_notifications: true" to a version where it becomes "notifications.email.enabled: true," the app upgrade migration reads the old key, writes the new key (with the transformed value), and marks the old key as deprecated. On next sync, the server receives both the deprecated old key (from old-format devices) and the new key (from upgraded devices) and applies the migration mapping server-side, storing the canonical new key format. Old devices that sync after a server-side migration receive the values in their expected old format through a server-side schema translation layer.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privacy Controls and Selective Sync</h3>
        <p>The sync opt-out system allows users to mark specific settings categories as "this device only" (not synced to other devices). The settings store has a per-key sync_enabled flag, toggled by the user through a "Sync settings" preferences panel. Settings with sync_enabled: false are stored only in the local device's cache and never uploaded to the server. On sync, the delta upload filters out non-sync-enabled keys. If a previously synced key is marked as no longer synced, the server removes that key from the user's settings store but preserves it on the device.</p>
        <p>Partial sync for restricted devices (smart TV, IoT) is implemented through device profiles: each device class has a defined set of settings keys it subscribes to. When a restricted device syncs, the server returns only the keys in the device's profile, not all settings. The device stores only these relevant keys locally, keeping storage minimal. When a mobile phone syncs, the server returns all keys. The device profile is stored in the settings schema and is matched to the device's reported device_class field in the sync request.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/cross-device-user-settings-sync-conflicts.svg"
          alt="Settings conflict resolution scenarios showing last-write-wins by logical timestamp (offline edit on device A vs device B resolved by HLC comparison), set-union merge for list settings (open tabs merged across devices), custom merge strategy for complex settings, and schema migration mapping (old key name to new key name) with backward-compatible round-tripping of unknown keys"
          caption="Conflict resolution: LWW by HLC timestamp, set-union for list settings, custom merge strategies, and schema migration with backward-compatible unknown-key preservation"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Last-write-wins versus CRDT: LWW is simple to implement and understand, and works correctly when clock skew is managed (HLC addresses this). The failure mode is subtle: if two devices make what they believe are sequential changes (user changes setting on phone at 10:00, then changes it on laptop at 10:01, but the laptop's clock is 5 minutes behind), LWW will apply the phone's change as "more recent" even though the user intended the laptop's change to win. HLC mitigates this by incorporating a logical counter that is monotonically increasing, but does not completely eliminate clock-based anomalies when clocks are significantly skewed. CRDT-based approaches (operation-based CRDTs) are immune to clock skew for supported data types but require more complex server-side implementation.</p>
        <p>Per-key granularity versus per-document: storing settings as a flat key-value store with per-key timestamps allows independent resolution of independent settings changes. The trade-off is that settings with semantic dependencies (e.g., "theme: custom" and "custom_theme_color: #ff0000" are dependent—changing theme to "custom" without the color is an incomplete state) can be in inconsistent intermediate states during sync. Grouping semantically related settings into a document (with a single document-level timestamp) ensures atomic consistency for related settings but increases conflict rates (any change to any setting in the document conflicts with any concurrent change to the document). The right approach is to group tightly coupled settings into a document while treating independent settings as independent keys.</p>
        <p>Sync frequency: syncing immediately on every settings change provides the best cross-device latency but generates more server requests. Batching changes and syncing on a 5-second timer (similar to the debounced auto-save approach) reduces server load while maintaining acceptable cross-device latency. For settings that are high-frequency during active adjustment (like a volume slider being dragged), debouncing to the final value before upload is essential—syncing every intermediate drag value would flood the server and other devices with meaningless intermediate updates.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Cross-device settings sync is a distributed consistency problem with the constraint that local reads must always succeed (offline support) and cross-device sync latency must be under 5 seconds when online. The architecture uses a local cache (IndexedDB) as the primary read/write path with a server-side settings store as the sync target. The sync protocol is delta-based (only changed settings, identified by logical timestamp watermark), using hybrid logical clocks for timestamp ordering across devices without global clock synchronization. Conflict resolution defaults to last-write-wins at the per-key level, with configurable merge strategies for list settings (set-union) and domain-specific settings (custom merge functions). Push notifications trigger background delta syncs on mobile when other devices change settings. Schema versioning preserves unknown keys for backward compatibility. Privacy controls allow per-key sync opt-out, and partial sync reduces storage on resource-constrained devices.</p>
      </section>
    </ArticleLayout>
  );
}

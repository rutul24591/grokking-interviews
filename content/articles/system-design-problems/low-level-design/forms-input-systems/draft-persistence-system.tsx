"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-draft-persistence-system",
  title: "Design a Draft Persistence System",
  description:
    "LLD for autosaving form drafts, hybrid local + server storage, conflict resolution on resume, and resilient sync in React/Next.js.",
  category: "low-level-design",
  subcategory: "forms-input-systems",
  slug: "draft-persistence-system",
  wordCount: 7300,
  readingTime: 39,
  lastUpdated: "2026-04-29",
  tags: ["lld", "drafts", "autosave", "indexeddb", "offline", "react"],
  relatedTopics: [
    "form-builder",
    "wizard-multi-step-form",
    "offline-form-sync-system",
  ],
};

export default function DraftPersistenceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a draft persistence system that
          guarantees users never lose in-progress form work.
          Drafts must survive accidental navigation, tab close,
          browser crash, device sleep, network drop, and the
          occasional user interruption that turns a five-minute
          form into a three-day affair. Beyond preserving values,
          the system must reconcile drafts across multiple tabs
          of the same browser, multiple devices for the same
          user, and across schema changes that occur between when
          the draft was written and when it is resumed. The
          deceptively simple promise — &ldquo;your work is
          never lost&rdquo; — turns out to be the result of
          getting many small details right, and getting any one
          of them wrong is enough to undermine user trust in the
          entire experience.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: making writes invisible to
          typing users (debounce + offload from the input
          critical path); dealing gracefully with quota limits
          and storage failures so a degraded environment
          doesn&rsquo;t break the form; handling cross-device
          conflicts without silently overwriting work; treating
          sensitive fields specially so PII does not linger in
          local storage; surviving schema migrations so a draft
          from a week ago still loads against today&rsquo;s
          form; and coordinating multiple tabs so a submission
          in one doesn&rsquo;t produce a phantom second
          submission in another. Done well, this becomes a
          quiet background service that turns &ldquo;I lost
          everything&rdquo; into a non-event; done poorly it
          becomes a source of subtle data corruption that
          erodes trust faster than it builds resumability.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users on mobile and desktop, frequently
          interrupted, sometimes offline, occasionally switching
          devices mid-task. They expect their work to survive
          anything that doesn&rsquo;t involve them deliberately
          discarding it. Internal stakeholders care about
          telemetry on draft recovery rates (a low recovery rate
          may indicate that drafts are being lost or that
          users don&rsquo;t trust them enough to come back),
          conversion lift from resumability, and compliance
          posture for sensitive forms. Engineers consume the
          system through a small set of hooks integrated into
          the form runtime; they should not need to think about
          IndexedDB transactions, BroadcastChannel coordination,
          or schema migration semantics.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The most demanding edge cases come from real-world
          interruption patterns: a user fills two-thirds of a
          form, switches to another tab to look up information,
          comes back hours later to a session that has timed
          out and been re-authenticated; a user starts a form
          on their phone in a coffee shop with spotty WiFi,
          finishes it on their laptop at the office; a user
          opens the same form in two tabs to compare options,
          then submits in one and continues editing in the
          other. The system has to handle all of these
          coherently or it doesn&rsquo;t deliver on its
          promise.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Drafts are user-scoped and bind to a stable form id
          (and optional record id for editing existing
          entities). Forms range from a few fields to large
          multi-step wizards (a few hundred KB at most). The
          application has an authenticated session; we can
          identify the user. The backend offers an idempotent
          upsert endpoint (<code>PUT /drafts/:draftId</code>)
          keyed by client-generated IDs and returns server
          timestamps. Some forms hold sensitive data and require
          special handling; the schema declares which fields
          are sensitive. Quota limits on IndexedDB vary across
          browsers but typically allow tens of MB. Modern
          browsers; we use <code>IndexedDB</code>,
          <code> BroadcastChannel</code>, and
          <code> WebCrypto.subtle</code>.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          Real-time collaborative editing of a single draft is
          out of scope (different problem; CRDTs apply).
          General-purpose offline action queue (for any
          mutation, not just form drafts) is a separate system
          that this one consumes if available. We do not
          implement the form runtime itself; we attach to it via
          hooks. We also don&rsquo;t implement the authentication
          system; we consume an authentication context provided
          by the host application.
        </HighlightBlock>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Autosave on change, debounced (1–2 seconds,
          configurable), plus immediate save on visibility
          change and best-effort flush on tab close. Local
          persistence to IndexedDB, with a localStorage fallback
          for environments where IndexedDB is unavailable.
          Optional server sync with retries and exponential
          backoff. Conflict detection on resume that compares
          local and server timestamps and surfaces an explicit
          decision when both have changed since last sync.
          Cross-tab consistency via
          <code> BroadcastChannel</code> so multiple open tabs
          converge on the same state. Manual &ldquo;Save
          now&rdquo; and &ldquo;Discard draft&rdquo; controls.
          Drafts auto-deleted on submission success and on TTL
          expiry so user storage doesn&rsquo;t fill up with
          stale entries.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Patch-based persistence (only changed fields) to
          reduce payload size for large forms. Encrypted local
          storage for PII drafts using a session-derived key
          via <code>WebCrypto.subtle</code>. Compression (gzip
          via <code>CompressionStream</code>) for very large
          drafts before sending. A sidecar that periodically
          reconciles client and server drafts when both clocks
          drift. Telemetry on resume rates, conflict
          frequencies, and quota errors so the platform can be
          tuned over time based on real usage.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Generic offline mutation queue, push notifications
          for draft activity, dashboards on draft usage, and
          end-to-end encryption with client-managed keys are
          all separate concerns. End-to-end encryption is
          interesting and worth doing eventually for the most
          sensitive forms, but it&rsquo;s a substantial
          subsystem in its own right.
        </HighlightBlock>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Writes must be off the input critical path.
          Debouncing keeps the average write rate to roughly
          one per second-of-typing; writes happen in microtasks
          via IndexedDB&rsquo;s async API so they never block
          paint. Snapshot serialization for typical forms is
          sub-millisecond; large forms benefit from patch-based
          diffs to keep payload size proportional to actual
          changes. The user&rsquo;s typing must feel
          instantaneous regardless of what the persistence
          layer is doing in the background.
        </HighlightBlock>

        <h3>Scalability</h3>
        <HighlightBlock as="p" tier="important">
          The system handles drafts up to a few MB without UI
          jank. Storage cost scales linearly with form size; we
          cap per-user draft count and TTL to prevent unbounded
          growth. Server sync is per-user and per-form;
          backend dimension is (user × form), which scales with
          the application. We don&rsquo;t architect for forms
          beyond a few MB because at that point the form itself
          is probably mis-architected.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="crucial">
          At-least-once server delivery, idempotent server
          upsert via client-generated draft IDs (UUID v7). The
          local store is authoritative for the current device;
          the server is authoritative for cross-device.
          Failures degrade gracefully — a server unreachable
          does not lose local work; a local quota exceeded does
          not break the form, it just degrades to memory-only
          mode with a warning.
        </HighlightBlock>

        <h3>Security</h3>
        <p>
          PII fields excluded from local persistence by default;
          if required, encrypted with a key derived from the
          session via <code>WebCrypto.subtle</code>. Drafts
          cleared on logout. Drafts bound to user id; we
          ignore drafts whose user id mismatches the current
          session — defends against shared-device leakage where
          another user might inadvertently see a draft from a
          previous session.
        </p>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Save status updates announce via polite live region
          without stealing focus. Resume banners are
          keyboard-focusable; Restore and Discard are reachable
          via Tab. Conflict dialogs trap focus while open and
          return it on close. Status indicators are
          perceivable without color alone — text labels and
          iconography both convey state.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Clean separation: form store ↔ draft store ↔ adapter
          ↔ syncer. Each layer is unit-testable in isolation.
          Adapters are swappable (IndexedDB, OPFS, memory for
          tests). The contract between draft store and form
          runtime is a small subscribe/restore pair, so the
          draft system attaches to any form runtime that
          conforms.
        </HighlightBlock>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/draft-persistence-system-architecture.svg"
        alt="Draft Persistence System Architecture"
        caption="Form Runtime → DraftStore (debounce + ConflictResolver + SchemaMigrator) → LocalAdapter (IndexedDB) [local-first] + RemoteAdapter (PUT /drafts/:draftId, idempotent, retry/backoff) → BroadcastChannel for cross-tab convergence."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The system is built on three architectural choices that
          reinforce each other: <strong>local-first writes</strong>{" "}
          for instant durability and offline resilience,
          <strong> eventual server sync</strong> for cross-device
          continuity, and <strong>explicit conflict surfacing</strong>{" "}
          for the rare cases where last-write-wins is the wrong
          answer. The design treats drafts as an outbox-style
          queue: writes go local immediately, and a syncer
          asynchronously delivers them to the server with retries.
          This pattern is well-known in distributed systems; we
          apply it carefully to the browser environment with all
          its peculiarities (quota errors, multiple tabs,
          beforeunload non-guarantees).
        </p>
        <p>
          On <strong>form mount</strong>, the runtime asks the
          draft store for any existing draft for this (user,
          form, recordId) tuple. The draft store reads both
          local and server snapshots in parallel: local from
          IndexedDB via a small read transaction, server from
          the upserts endpoint with the latest known
          updatedAt. The draft store compares timestamps to
          decide how to surface the result. If only one exists,
          use it. If both exist and one is newer, prefer the
          newer; if both have changed since the last successful
          sync (we track this via a per-draft
          <code> lastSyncedAt</code> column), we surface a
          conflict UI: side-by-side or merged view with
          explicit Restore-from-A vs Restore-from-B controls.
          Silent last-write-wins is wrong here; the user&rsquo;s
          work matters more than algorithmic simplicity, and
          surfacing the conflict gives them the dignity of
          choice.
        </p>
        <HighlightBlock as="p" tier="crucial">
          On every form change, the form runtime emits a
          <code> change</code> event. The draft store collects
          changes, debounces them (default 1.5 seconds,
          configurable), and writes a snapshot to IndexedDB.
          The snapshot shape is
          <code>{` { formId, draftId, schemaVersion, values, updatedAt, deviceId, userId } `}</code>.
          The local write is the durability barrier — at this
          point the user&rsquo;s work is safe across reload.
          The syncer runs separately: after each local write, it
          enqueues a server upsert. Upsert is idempotent: same
          draftId means update, not duplicate. The server
          returns its own updatedAt timestamp, which the
          client persists as <code>lastSyncedAt</code> for
          future conflict detection.
        </HighlightBlock>
        <p>
          On <strong>visibility change</strong> (tab hidden), the
          draft store flushes any pending debounced write
          immediately, because the user might be navigating
          away. On <strong>beforeunload</strong>, we attempt a
          best-effort flush via
          <code> navigator.sendBeacon</code> or a
          <code> fetch</code> with
          <code> keepalive: true</code>; neither is guaranteed,
          but together they catch the common cases. The local
          write is already durable, so the worst case is that
          the server lags by one debounce cycle —
          recoverable on next mount when the syncer notices
          the local-but-not-synced state and pushes it.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Cross-tab consistency</strong> uses a
          <code> BroadcastChannel</code> named after the form id.
          When tab A writes, it broadcasts the snapshot. Tab B
          receives it and merges only if its own local snapshot
          is older. We use the deviceId to avoid feedback loops
          where tab A&rsquo;s broadcast triggers tab A&rsquo;s
          own listener. On submission success, the originating
          tab broadcasts a <code>submitted</code> event so other
          tabs lock the form into a read-only state with a
          link to view the submission. This avoids the failure
          mode where a user submits in tab A and continues
          editing in tab B, then submits again with stale
          values; the broadcast turns it from a silent data
          corruption into an explicit user-visible state.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Schema migration</strong> is handled at restore
          time. The snapshot includes <code>schemaVersion</code>;
          if it matches the current version, restore is a
          direct merge with current defaults. If it doesn&rsquo;t,
          the draft store runs a registered upgrade chain
          (<code>v1 → v2 → v3</code>) that transforms field
          shapes. Each migration is a pure function vendored
          with the form. If no migration is registered for a
          gap, the draft store surfaces a banner explaining
          that the saved draft is from an older form version
          and offering to start fresh — silent migration is
          too risky for breaking changes, where guessing wrong
          could submit nonsense to the backend.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Sensitive fields</strong> are marked in the
          form schema with a <code>sensitive: true</code> flag.
          The draft store excludes them from local snapshots by
          default; if local persistence is required, the values
          are encrypted with a key derived from the session
          via <code>WebCrypto.subtle</code>. The server-side
          draft stores them encrypted at rest. On logout, the
          draft store listens for the session-end event and
          clears all drafts associated with the user, including
          their server counterparts via a delete endpoint. This
          tiered approach — exclude by default, encrypt if
          opted in, server-only if highly sensitive — gives
          products the right tools to handle PII responsibly
          without forcing one policy on every form.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Quota handling</strong>: writes catch
          <code> QuotaExceededError</code> from IndexedDB and
          respond by deleting the oldest drafts (LRU eviction
          based on <code>updatedAt</code>) and retrying. If
          still failing, the store surfaces a non-blocking
          warning to the user and keeps drafts in memory only
          — a degraded but functional state, better than a
          crash. We also track quota usage proactively and warn
          the user when they&rsquo;re approaching the limit so
          they can clean up before hitting the failure mode.
        </HighlightBlock>
        <p>
          <strong>Authentication transitions</strong> deserve
          explicit handling because they&rsquo;re a real source
          of subtle bugs. When a session expires mid-form, the
          syncer&rsquo;s next upsert returns 401; the syncer
          pauses, surfaces a re-auth prompt to the user, and
          on successful re-auth retries the queued writes with
          the new credentials. The local draft remains intact
          throughout — the user&rsquo;s work is never at risk
          because of an auth issue. When the user logs out,
          the draft store clears local drafts for that user
          and triggers server-side deletion via the delete
          endpoint.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="important">
          <strong>DraftStore</strong> is the public facade. It
          subscribes to the form&rsquo;s change stream,
          debounces, and writes. It exposes
          <code> restore()</code>, <code>save()</code>,
          <code> discard()</code>, and <code>status</code> as a
          small surface, plus an event stream that consumers can
          subscribe to for status indicator UIs.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>LocalAdapter</strong> implements the
          IndexedDB-backed read/write/delete. It uses a single
          object store keyed by
          <code> (userId, formId, draftId)</code> and indexes
          <code> updatedAt</code> for LRU eviction. A
          localStorage fallback exists for environments without
          IndexedDB, with the caveat that it&rsquo;s
          synchronous and small; we degrade to it only when
          forced. The adapter handles transaction boundaries
          carefully — a write is one transaction so partial
          writes aren&rsquo;t observable from concurrent reads.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>RemoteAdapter</strong> wraps fetch with
          retry-with-exponential-backoff and abort signals. It
          attaches CSRF tokens (from the host) and idempotency
          keys (the draft&rsquo;s
          <code> draftId</code>). It handles transient network
          failures by re-queueing the write; permanent failures
          (4xx authentication errors) surface to the user. The
          retry budget is bounded to avoid pathological retry
          loops on persistent server errors.
        </HighlightBlock>
        <p>
          <strong>Syncer</strong> orchestrates the local-first
          flow. After every local write, it enqueues a server
          upsert. The queue is a priority queue keyed by draftId
          (one in flight per draft) with the most recent
          snapshot taking precedence over older ones — a
          fast-typing user shouldn&rsquo;t cause N HTTP requests
          for N intermediate states. The syncer also
          subscribes to <code>online</code> and
          <code> offline</code> events so it can pause and
          resume cleanly. When online resumes, it drains the
          queue with priority on the most recent snapshot per
          draft.
        </p>
        <p>
          <strong>ConflictResolver</strong> handles the case
          where both local and server have changed since last
          sync. It implements a small policy engine —
          last-write-wins, server-wins, prompt-user —
          configurable per form. The default is prompt-user
          with a UI that shows both versions diffed at the
          field level so users can see exactly what differs.
          For some products (e.g. a draft that&rsquo;s mostly
          read-only with occasional edits), last-write-wins is
          the right policy; for high-stakes forms, prompt-user
          is non-negotiable.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>BroadcastBridge</strong> wraps
          <code> BroadcastChannel</code> for cross-tab
          consistency and provides a small event bus
          (<code>change</code>, <code>saved</code>,
          <code> submitted</code>, <code>discarded</code>). It
          handles the initial-state-on-mount problem by asking
          existing tabs for their state on join, so a newly
          opened tab gets immediate convergence rather than
          waiting for the next change broadcast.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>SchemaMigrator</strong> holds the registered
          version-to-version migration chain and applies it on
          restore. Each migration is a pure function that takes
          a snapshot of the old version and returns a snapshot
          of the next version. The migrator runs them in
          sequence to upgrade an old draft all the way to
          current, or surfaces an error if any link in the
          chain is missing.
        </HighlightBlock>
        <p>
          <strong>StatusIndicator</strong> is the UI component
          that consumes the DraftStore&rsquo;s status (saving,
          saved, error, offline, conflict) and renders a subtle
          inline indicator. It&rsquo;s a presentational
          component; it doesn&rsquo;t own state, it just
          renders what the DraftStore exposes.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="crucial">
          State splits naturally into per-form draft state and
          a per-user session/quota state. Per-form draft state
          lives in the DraftStore: <code>values</code>,
          <code> lastSavedLocal</code>,
          <code> lastSyncedRemote</code>, <code>status</code>,
          <code> error</code>, and <code>conflict</code> when
          present. The form&rsquo;s own value store is the
          source of truth for current UI; the draft store
          mirrors a debounced snapshot for autosave purposes.
          They are deliberately separate sources because
          conflating them would make the form runtime depend on
          the draft system, which we want to avoid for clean
          separation of concerns.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">Cross-tab consistency: when tab A writes and
          broadcasts, tab B&rsquo;s DraftStore receives the
          snapshot and compares timestamps; if it&rsquo;s
          newer than tab B&rsquo;s own snapshot, tab B&rsquo;s
          form runtime is asked to merge the values. If tab B
          has unsaved local changes newer than the broadcast,
          those are preserved (the broadcast loses; the
          local-newer value wins).</HighlightBlock>
<HighlightBlock as="p" tier="important">This asymmetric merge
          prevents the surprising case where a background tab
          silently overwrites work in the foreground tab — we
          err on the side of preserving the most recent user
          input rather than the most recent timestamp,
          because timestamps can be misleading in the face of
          concurrent edits.</HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="important">Snapshot shape:
          <code>{` { formId, draftId, schemaVersion, values, updatedAt, deviceId, userId, lastSyncedAt? } `}</code>.
          Server contract:
          <code> PUT /drafts/:draftId</code> with a snapshot
          body, idempotent by <code>draftId</code>; server
          returns its own <code>updatedAt</code> for clock
          synchronization.</HighlightBlock>
<HighlightBlock as="p" tier="important">Resume contract: on form mount,
          fetch latest server draft and read local; combine
          via the conflict policy. Submission contract: on
          success, both client and server delete the draft to
          prevent zombie drafts hanging around forever.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The integration with the form runtime is via two
          hooks: <code>useDraftRestore(formId, recordId)</code>{" "}
          which the form provider calls to seed initial values
          before the form renders, and
          <code> useDraftSync(formStore)</code> which subscribes
          the draft store to the form&rsquo;s change events.
          These hooks are the only public surface the form
          runtime needs to wire up — everything else is
          internal to the draft system.
        </HighlightBlock>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance Strategy</h2>
        <HighlightBlock as="p" tier="important">Debouncing keeps write rates low; visibility-change
          and best-effort beforeunload flushes catch the
          near-navigation cases. IndexedDB writes happen in
          microtasks via the async API; we don&rsquo;t block
          paint. Patch-based payloads for server sync reduce
          bandwidth on large forms — we send only changed
          fields most of the time, with periodic full
          snapshots (every N writes or every minute, whichever
          first) as a safety net for cases where a patch chain
          might desync.</HighlightBlock>
<HighlightBlock as="p" tier="important">The full-snapshot interval is tunable
          per form; products with heavily-changing forms
          benefit from less frequent full snapshots, while
          products with mostly-stable forms benefit from more
          frequent ones to keep the patch chain short.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          For very large forms, we compress payloads via
          <code> CompressionStream</code> (gzip) before
          sending. The compression cost is small (sub-ms for
          typical payloads), and bandwidth savings are
          meaningful when users are on cellular. Reads are
          read-once on mount and cached in memory until the
          form unmounts. Writes don&rsquo;t need to read first
          (we know what we&rsquo;re writing), so the read-write
          asymmetry doesn&rsquo;t cost us anything.
        </HighlightBlock>
      </section>

      <section>
        <h2>🎨 UI/UX Considerations</h2>
        <HighlightBlock as="p" tier="important">The save status is rendered as a subtle indicator —
          &ldquo;Saving&hellip;&rdquo;, &ldquo;Saved 12s
          ago&rdquo;, &ldquo;Offline, will retry&rdquo; —
          never modal, never alarming. Modal dialogs for save
          status would be insulting; users care about the
          status but they don&rsquo;t want to be interrupted
          by it.</HighlightBlock>
<HighlightBlock as="p" tier="important">On resume, a banner at the top of the form
          announces &ldquo;Restored from 2 hours ago&rdquo;
          with a Discard control; the banner dismisses on
          first edit so it doesn&rsquo;t linger past the
          point of usefulness. Conflict UI shows both versions
          side-by-side with field-level diff highlights and
          explicit Use This / Use That controls; we don&rsquo;t
          force a merge because field-level merging of
          arbitrary forms is ambiguous and would produce
          worse outcomes than letting users choose.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The Discard control requires a confirmation step the
          first time it&rsquo;s used — an accidental Discard
          would be catastrophic in a form the user has spent
          twenty minutes on. Keyboard shortcuts (Cmd-S for
          save now) are wired up and announced via the
          form&rsquo;s help surface. Status indicators are
          accessible — the announcement uses a polite live
          region so screen reader users hear the same
          information visual users see.
        </HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">The conflict dialog is a modal with focus trap; tab order goes Restore-A → Restore-B → Cancel; Escape closes</HighlightBlock>
<HighlightBlock as="p" tier="important">(returning to a safe default of taking no action, because closing the conflict dialog without choosing should not</HighlightBlock>
<HighlightBlock as="p" tier="important">commit either version). Status indicators use both color and text/icon so they&rsquo;re perceivable without color.</HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security Considerations</h2>
        <HighlightBlock as="p" tier="important">Sensitive fields are excluded from local persistence
          by default; opt-in encryption uses a session-derived
          key via <code>WebCrypto.subtle</code>. The key is
          derived from a server-issued session secret; logging
          out invalidates the session and the key, so the
          encrypted local data is unreadable thereafter.</HighlightBlock>
<HighlightBlock as="p" tier="important">Drafts
          are bound to user id; on mount we ignore drafts whose
          userId doesn&rsquo;t match the current session —
          defends against shared-device scenarios where another
          user might inadvertently see a draft from a previous
          session.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The server-side draft store is encrypted at rest; we
          treat draft contents with the same care as the
          submitted form. On logout, both client and server
          drafts are deleted via the session-end event. Schema
          version mismatches that fail migration trigger a
          discard prompt rather than silent acceptance — better
          to lose a draft than corrupt a payload. CSRF tokens
          are attached to every server request, and the server
          re-validates draft ownership on every PUT to defend
          against tampering with the draftId.
        </HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing Strategy</h2>
        <HighlightBlock as="p" tier="important">Unit tests cover debounce, diff/snapshot construction, schema version migration, and conflict resolution</HighlightBlock>
<HighlightBlock as="p" tier="important">policies in isolation. Integration tests exercise: offline → online sync, multi-tab convergence (two test tabs</HighlightBlock>
<HighlightBlock as="p" tier="important">sharing a BroadcastChannel mock), reload mid-form with successful restore, schema upgrade across a real migration.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">End-to-end tests in
          Playwright run reload-during-typing and observe that
          no characters are lost — this is the headline
          guarantee, and we test it explicitly. We also test
          the failure modes deliberately: simulate
          <code> QuotaExceededError</code>, simulate server
          5xx for retries, simulate clock skew, simulate
          session expiry mid-flow, simulate concurrent edits
          across tabs. Each failure mode has an expected
          recovery behavior; the tests pin those behaviors.</HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases &amp; Failure Handling</h2>
        <HighlightBlock as="p" tier="important">Quota exceeded in IndexedDB: catch the error, evict
          the oldest drafts (LRU on
          <code> updatedAt</code>), retry. If still failing,
          fall back to memory-only mode with a non-blocking
          warning. Two devices edit the same draft: if both
          have changed since last sync, surface conflict UI;
          we never silently overwrite. Schema migration: run
          the registered upgrade chain; if no path exists,
          prompt to discard and start fresh.</HighlightBlock>
<HighlightBlock as="p" tier="important">Submission
          completes in tab A while tab B is editing: tab B
          receives the <code>submitted</code> broadcast and
          locks itself into a read-only state with a link to
          view the submission. Clock skew between client and
          server: trust the server timestamp for ordering, not
          the client&rsquo;s <code>Date.now()</code>. Beacon
          flush fails on unload: rely on next mount to
          re-sync from local — the syncer notices that
          local has newer data than server and pushes it.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The backend returns 401 (session expired): pause the
          syncer, surface a re-auth prompt; on success, retry
          the queued writes. The local snapshot becomes
          corrupt (very rare, usually IndexedDB version
          conflict from a major schema change): we detect the
          corruption on read and discard the local, falling
          back to the server&rsquo;s version with a banner
          explaining what happened. User opens form in
          incognito where IndexedDB is restricted: fall back
          to memory-only with a banner suggesting they sign in
          to the regular session for resumability. None of
          these are individually exotic; the system earns its
          keep by handling all of them coherently in one
          place.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability &amp; Extensibility</h2>
        <HighlightBlock as="p" tier="crucial">The system attaches to any form runtime that exposes a change-event subscribe and a</HighlightBlock>
<HighlightBlock as="p" tier="important">values-restore method, so it&rsquo;s not coupled to our specific Form Builder. This decoupling is</HighlightBlock>
<HighlightBlock as="p" tier="important">important because the form runtime evolves on a different cadence than the persistence layer.</HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="crucial">Status messages and resume banners use the
          host&rsquo;s i18n function. Timestamps localize via
          <code> Intl.RelativeTimeFormat</code> (&ldquo;2 hours
          ago&rdquo;), which produces locale-correct output
          across all supported languages and degrades to
          absolute timestamps when relative isn&rsquo;t
          appropriate.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Conflict dialog labels go through the
          same i18n stack. Numerical sizes (&ldquo;12 KB&rdquo;)
          format via </Highlight><code>Intl.NumberFormat</code> with
          locale-correct unit display.</HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs &amp; Design Decisions</h2>

        <h3>Local-only vs hybrid sync</h3>
        <HighlightBlock as="p" tier="important">
          Local-only is simple, has no server cost, works
          offline by definition, and is sufficient for many
          consumer apps. Hybrid local+server enables
          cross-device continuity and survives local storage
          clearing (browser data wipes, profile resets), at
          the cost of more architecture and a backend
          endpoint. For enterprise apps where users routinely
          switch devices, hybrid is worth it. The
          architecture is local-first either way; server is
          opt-in per form. This split lets products choose the
          right model without forcing one on everyone.
        </HighlightBlock>

        <h3>Diff vs full snapshot for server payloads</h3>
        <p>
          Diffs save bandwidth and reduce server cost; full
          snapshots are robust to packet loss and patch chain
          desyncs. We use a hybrid: diffs for most writes,
          full snapshots periodically. The full snapshot acts
          as an implicit checkpoint that re-bases the diff
          chain. This is more code than either pure approach,
          but the combination is the right balance — diffs
          for cost, periodic snapshots for safety.
        </p>

        <h3>Last-write-wins vs prompt-user on conflict</h3>
        <p>
          Last-write-wins is silent and simple but loses real
          conflicts as a class. Prompt-user respects user
          intent but adds UI complexity. We default to
          prompt-user for the case where both local and
          server have changed since last sync — those are
          real conflicts. For the common case where only one
          has changed, the engine uses it directly without
          prompting. The default balances safety and friction
          appropriately.
        </p>

        <h3>IndexedDB vs localStorage</h3>
        <HighlightBlock as="p" tier="important">
          IndexedDB is async (no main thread blocking),
          structured (no JSON.stringify on every write), and
          larger (typically tens of MB). localStorage is
          synchronous (blocks paint), small (5–10 MB), and
          only stores strings. We prefer IndexedDB by a wide
          margin; localStorage is a legacy fallback only for
          environments where IndexedDB is unavailable.
        </HighlightBlock>

        <h3>Outbox queue vs synchronous server-first</h3>
        <HighlightBlock as="p" tier="crucial">
          Synchronous server-first writes give the strongest
          consistency guarantees but block the user&rsquo;s
          typing on network latency — terrible UX. The outbox
          (local-first, async server sync) gives instant local
          durability and tolerates network blips at the cost
          of eventual consistency. For drafts (which are
          recoverable and not transactional), eventual
          consistency is the right contract; we&rsquo;re not
          coordinating financial transactions, we&rsquo;re
          backing up form state.
        </HighlightBlock>

        <h3>Encryption opt-in vs default</h3>
        <HighlightBlock as="p" tier="important">
          Default encryption sounds appealing but adds CPU
          cost on every write and complicates testing. Opt-in
          encryption per form via the
          <code> sensitive: true</code> flag lets products
          pay the cost only when they need to, and gives a
          natural place to surface the policy decision in the
          schema. The form authoring tool can default
          schemas to encrypted for sensitive form types and
          let authors override.
        </HighlightBlock>

        <h3>Per-form draft vs single global draft store</h3>
        <HighlightBlock as="p" tier="important">
          Per-form scoping makes nested and modal forms work
          without conflict, supports multiple-record editing
          flows, and isolates failure modes (a corrupted
          draft for one form doesn&rsquo;t break others). A
          single global store would be simpler but couldn&rsquo;t
          handle multi-record use cases without ad-hoc
          extensions. We accept the per-form complexity
          because it scales with product needs.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important">CRDT-based merge for concurrent edits across devices would let us handle multi-device editing without surfacing conflicts to users; the per-field</HighlightBlock>
<HighlightBlock as="p" tier="important">merge semantics are tractable for many form types (last-writer-per-field) and harder for nested structures. Service-Worker-driven background</HighlightBlock>
<HighlightBlock as="p" tier="important">sync (using the Background Sync API where available) would let drafts sync even after a tab closes, addressing the beacon-isn&rsquo;t-guaranteed gap.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">End-to-end encrypted server storage (the server
          stores ciphertext only, key managed by client) would
          tighten the security posture for highly sensitive
          forms. Telemetry-driven tuning of debounce intervals
          and TTLs based on real usage patterns. A draft
          history view that lets users see and restore prior
          versions of their work for forms where iteration is
          common.</HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why IndexedDB over localStorage?</strong>{" "}
          IndexedDB is async, structured, transactional, and
          larger. localStorage is synchronous (blocks the main
          thread), JSON-string-only, and limited to a few MB.
          For drafts written on every keystroke, async writes
          are non-negotiable.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>2. How do you flush a pending save when the user
          closes the tab?</strong> Two-layer best-effort:
          visibility-change fires before tab close in most
          cases, and we flush there with a regular IndexedDB
          write. For beforeunload (the worst case), we use
          <code> sendBeacon</code> or
          <code> fetch keepalive</code> to send the snapshot
          to the server. Neither is guaranteed, so the local
          write done at debounce time is the actual
          durability barrier; the worst case is the server
          lags by one debounce cycle.
        </HighlightBlock>

        <p>
          <strong>3. How do you detect and resolve cross-device
          conflicts?</strong> Each snapshot carries
          <code> updatedAt</code> and we track per-draft
          <code> lastSyncedAt</code>. On mount, we compare. If
          both local and server changed since
          <code> lastSyncedAt</code>, that&rsquo;s a real
          conflict; we surface a UI showing both versions
          with field-level diff and let the user choose.
          Silent last-write-wins would be wrong here.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>4. What ensures server upsert is idempotent?</strong>{" "}
          Client-generated <code>draftId</code> (UUID v7);
          server treats <code>PUT /drafts/:draftId</code> as
          an upsert keyed by id. Same id → update; new id →
          create. Retries reuse the same id, so they never
          duplicate.
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          <strong>5. How do you make autosave invisible to the
          typing user?</strong> Debounce on every change
          (default 1.5s), run writes via async IndexedDB API
          in microtasks, render save status as a subtle inline
          indicator (never modal). The user&rsquo;s typing is
          never blocked by a write.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>6. How are sensitive fields handled?</strong>{" "}
          Marked in the form schema with
          <code> sensitive: true</code>. By default
          they&rsquo;re excluded from local persistence;
          opt-in encryption uses a session-derived key via
          <code> WebCrypto.subtle</code>. On logout, the
          session ends, the key is invalidated, and the
          encrypted data becomes unreadable. Server-side
          drafts of sensitive forms are encrypted at rest.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>7. How do you survive a schema breaking change in
          a stored draft?</strong> Snapshot includes
          <code> schemaVersion</code>. On restore, we run a
          registered version-to-version migration chain. If
          no chain exists for the gap, we prompt the user to
          discard rather than load a broken state — silent
          migration of unknown changes is too risky.
        </HighlightBlock>

        <p>
          <strong>8. How does cross-tab consistency work?</strong>{" "}
          A <code>BroadcastChannel</code> named after the form
          id. Each write broadcasts the snapshot. Listeners
          merge only if their local snapshot is older. The
          deviceId in each snapshot prevents feedback loops
          on the originating tab. On submission, the
          originating tab broadcasts <code>submitted</code>{" "}
          so others lock themselves into read-only mode.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="important">A solid draft system is local-first, eventually synced , with an idempotent server contract, versioned</HighlightBlock>
<HighlightBlock as="p" tier="important">schemas, and explicit conflict UX. Treat persistence as a separate concern from form state, isolate adapters per</HighlightBlock>
<HighlightBlock as="p" tier="important">backend, surface conflicts rather than silently overwriting, and handle sensitive fields with the care they deserve.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">The user-facing promise is
          simple: nothing they type is ever lost, and they
          always know what state their work is in. That
          promise is delivered by getting the small details
          right — debouncing, idempotency, schema versioning,
          cross-tab coordination, quota handling, conflict
          surfacing — none of which are individually hard, but
          all of which need to compose correctly. The
          architecture exists to make that composition
          tractable rather than ad-hoc.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

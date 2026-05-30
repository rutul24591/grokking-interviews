"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-saved-views-filters-system",
  title: "Design a Saved Views / Filters System",
  description:
    "LLD for saved views: capture filter+sort+columns+density into named presets, share with team, default per role, URL-sync, and graceful schema migration.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "saved-views-filters-system",
  wordCount: 6300,
  readingTime: 33,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "saved-views",
    "filters",
    "presets",
    "url-sync",
    "react",
  ],
  relatedTopics: [
    "data-table",
    "column-configuration-system",
    "search-page",
  ],
};

export default function SavedViewsFiltersSystemArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Saved Views and Filters System</h1><h2>Definition &amp; Context</h2><p>Design a Saved Views and Filters System is an implementation-heavy low-level design problem covering filter AST, URL serialization, saved-view persistence, schema migration, permission filtering, sharing, defaults, and conflict handling. A principal-level answer must define state ownership, consistency, lifecycle cleanup, scale limits, rollback, privacy, cost, and observability.</p><p>Represent filters as a typed AST rather than ad hoc query strings. Saved views reference stable field ids and must reconcile against the current schema and authorization policy. The core structures are filter AST, operator registry, URL codec, saved-view id, schema version, allowed-field set, migration result, default-view pointer, and dirty state.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/saved-views-filters-system-runtime.svg" alt="Design a Saved Views and Filters System runtime" caption="Topic-specific data flow from input or payload through guarded projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a saved-views system — the layer
          that lets users capture a combination of filters,
          sort, column configuration, and density into a
          named preset and restore it later. Saved views
          are the workflow primitive that turns ad-hoc
          table use into repeatable processes. Power users
          maintain their preset library; teams share
          common views; admins set role-default views that
          new users start from. The system sits on top of
          the Data Table&rsquo;s filter and sort state and
          the Column Configuration system, gathering them
          into a serializable preset.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: a serializable view
          schema that captures everything that affects
          presentation; sharing semantics (private,
          team-shared, role-default); URL synchronization
          so the active view is reflected in the URL;
          graceful migration when the underlying table
          schema evolves; conflict resolution when a
          shared view is edited concurrently; and
          accessibility for the view-management UI.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          Power users (analysts, ops, customer success)
          curate dozens of saved views to fit different
          workflows. Team leads share team-relevant views.
          New users benefit from role defaults
          (&ldquo;Customer Success view&rdquo; that comes
          pre-configured). Engineering teams plug in:
          declare the view schema (which dimensions are
          captured), point to a persistence endpoint, and
          the system handles the rest.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          The Data Table&rsquo;s filter and sort state and
          the Column Configuration are accessible via
          stable APIs. Backend provides per-user view
          storage plus shared-view storage. Modern
          browsers; we use the URL for sharing and
          localStorage as a write-through cache.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the Data Table itself or
          its filter editors. We do not implement
          dashboard saved-views (different concern). We
          do not implement cross-table saved views (each
          view is per-table).
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Capture current state into a named preset:
          filters, sort, column config, density. Restore a
          preset: apply all captured state to the table.
          List presets for the current table; switch
          between them via a picker. Edit a preset:
          rename, update, delete. Mark a preset as the
          user&rsquo;s default (loads on table mount).
          URL sync: the active preset (or its
          ad-hoc-overridden state) reflects in the URL
          for sharing. Schema migration: views referencing
          removed filters or columns gracefully drop them.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Sharing: team-shared views (visible to all team
          members); org-shared. Role defaults: admin sets
          a default view per role for new users. Pinned
          views in the picker (most common at top).
          Suggested views based on common patterns. Audit
          log for shared views (who edited what).
          Conflict resolution: warn when a shared view is
          modified by another user.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Cross-table views, dashboard views (separate
          subsystems). Real-time collaborative editing of
          a single view. Server-side execution of views
          (saving the rendered data, not just the
          definition).
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          View load on table mount under 100 ms (using
          cache). Switching presets feels instant (under
          200 ms including data fetch). Save debounced.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="crucial">
          Views serialize and deserialize round-trip
          cleanly. Schema migration handles missing
          referenced fields without breaking views.
          Concurrent edits to shared views detected and
          surfaced.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Per-user views scope by user id. Shared views
          scope by team or org with proper access checks.
          Server enforces ownership and sharing
          permissions.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          View picker is keyboard-navigable. Save and
          rename dialogs are accessible. State changes
          announce.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          View schema is versioned; migrations bridge
          versions. The capture logic is centralized
          (one place that knows what dimensions a view
          contains). Adding a new dimension is a schema
          extension plus a migration.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        
        <HighlightBlock as="p" tier="important">
          The system is structured as a <strong>view
          schema</strong> (declares what dimensions a view
          captures), a <strong>view store</strong> (per-user
          and shared lists), a <strong>capture/apply
          system</strong> (gathers current table state into
          a view, applies a view to the table), and a
          <strong> URL bridge</strong> (synchronizes active
          view with URL).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>view schema</strong> is a versioned
          JSON shape. Each view has{" "}
          <code>{` { id, name, version, filters, sort, columnConfig, density, owner, sharing? } `}</code>.
          The capture logic (a single function per
          version) knows how to gather these dimensions
          from the current table state. The apply logic
          (a single function per version) knows how to
          push them back into the table.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>view store</strong> holds the user&rsquo;s
          presets plus shared presets they have access to.
          On mount, we fetch both lists in parallel.
          Cached lists serve instant first paint while
          server fetches refresh in background. The
          active view is part of the store; switching
          views updates the active view id and applies
          the captured state to the table.
        </HighlightBlock>
        <p>
          On <strong>capture</strong> (user clicks Save
          View), the system gathers the current filter,
          sort, column config, and density via the
          subsystems&rsquo; APIs. The result is a view
          payload; we save it to the server with a name
          the user provides. On save success, the new
          view appears in the picker.
        </p>
        <p>
          On <strong>apply</strong> (user picks a view), the
          system reads the view payload and pushes it
          into the table&rsquo;s subsystems: filter
          state to the filter system, sort state to the
          sort system, column config to the column
          configuration system, density to the
          presentation. The table re-renders with the
          new state. The URL updates to reference the
          view.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>URL sync</strong>: the active view&rsquo;s
          id is in the URL. When the user makes ad-hoc
          changes (e.g. adds an additional filter
          without saving), the URL transitions to a
          &ldquo;view + overrides&rdquo; state that&rsquo;s
          still shareable. When they save the changes
          back to the view, the URL is just the view id
          again. Sharing the URL takes recipients to the
          same state.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Schema migration</strong>: views are
          versioned. If the table schema changes (a
          filter dimension is removed), views referring
          to that dimension drop the dead reference on
          load. If a column is renamed, a migration step
          updates view payloads to use the new id. If
          the version gap is too large, we surface a
          warning that the view may not apply correctly
          and let the user choose to apply anyway or
          delete.
        </HighlightBlock>
        <p>
          <strong>Sharing</strong>: views can be marked
          private (default), team-shared (visible to a
          named team), or org-shared. The owner can
          edit; non-owner viewers can apply and clone.
          Cloning takes a shared view and saves it as
          private to the cloning user, who can then
          edit freely. Audit log records edit history
          for shared views.
        </p>
        <p>
          <strong>Role defaults</strong>: org admins set a
          default view per role. New users in that role
          start with that view applied on first table
          mount. The default is overridden by any
          per-user default the user later sets.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="important"><strong>ViewProvider</strong></Highlight> instantiates the
          view store, capture/apply logic, and URL bridge.
          <strong> ViewStore</strong> holds the user&rsquo;s
          views and shared views.
          <strong> ViewCapture</strong> gathers state from
          subsystems.</HighlightBlock>
<HighlightBlock as="p" tier="crucial"><strong>ViewApply</strong> pushes
          state to subsystems.
          <strong> ViewMigrator</strong> handles schema
          migration on load.
          <strong> ViewPicker</strong> is the UI for
          listing, selecting, saving, editing.
          <strong> URLBridge</strong> synchronizes active
          view with URL.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">View list and active view live in an external
          store. Active view&rsquo;s ad-hoc overrides
          (changes</HighlightBlock>
<HighlightBlock as="p" tier="important">since last save) are tracked separately
          so we can compute &ldquo;has this view been
          modified&rdquo;</HighlightBlock>
<HighlightBlock as="p" tier="important">for the Save badge. URL is the
          source of truth for the active view id and
          override state.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">
          The contract must be versioned and migratable: a saved view payload should carry a schema
          version so older clients can still render and newer clients can repair/migrate safely.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A typical server contract includes listing views per table and CRUD operations, for example:
          <code>GET /tables/:id/views</code>, <code>POST /views</code>, <code>PUT /views/:id</code>,
          <code>DELETE /views/:id</code>.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Concurrency should be explicit: use an <code>etag</code>/<code>version</code> to detect concurrent edits
          and surface a conflict instead of silently overwriting another user&rsquo;s updates.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Rendering &amp; Performance</h3>
        <HighlightBlock as="p" tier="crucial">View list is small (typically dozens of views);
          loading is fast. Apply</HighlightBlock>
<HighlightBlock as="p" tier="important">happens in one
          transaction across subsystems so the table
          re-renders</HighlightBlock>
<HighlightBlock as="p" tier="important">once. Caching of view list
          eliminates per-mount network dependency.</HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">The view picker is a dropdown or sidebar
          listing views, with a Save button to capture
          current state. Active view shows a checkmark.
          Modified state shows a &ldquo;modified&rdquo;
          indicator next to the active view name; a Save
          action commits changes back.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Save As clones the
          view under a new name. Sharing is a
          right-click or settings option per view.
          Search input filters the picker for users with
          many views.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">View picker is keyboard-navigable
          (arrow keys, Enter to select). Save</HighlightBlock>
<HighlightBlock as="p" tier="important">dialog has
          proper labels. Modified-state indicator is
          accessible</HighlightBlock>
<HighlightBlock as="p" tier="important">(text equivalent, not just a
          dot). Schema migration warnings announce.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="crucial">
          Saved views are data with access control: the server must enforce who can read/write/share a view,
          and scopes must match the underlying dataset permissions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          View payloads can contain PII in filter values (for example an email); treat them as sensitive in
          logging, analytics, and support tooling.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          When sharing, prefer server-side share tokens/ACLs over URL-only secrets, and rotate/revoke shares
          as part of incident response.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">
          Capture/apply must be round-trip safe: applying a saved view and then capturing should produce an
          equivalent payload (modulo versioning/normalization).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Integration tests cover save, switch, edit, share, and clone flows, including URL sync across navigation.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Concurrency tests verify conflict detection on shared views (etag/version mismatch) and validate that
          migrations repair older payloads without breaking rendering.
        </HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="important">A view references a filter dimension that no longer exists: migrator drops it;</HighlightBlock>
<HighlightBlock as="p" tier="important">user is informed via a banner. A shared view is edited concurrently by two users:</HighlightBlock>
<HighlightBlock as="p" tier="important">optimistic locking surfaces a conflict; the second saver chooses to merge or overwrite.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">A view is
          deleted while a user has it active: graceful
          fallback to default; banner explains. URL
          carries an unknown view id: fall back to
          default with a banner. Role default and user
          default conflict: user default wins. Many
          views (hundreds): picker virtualizes the list
          and adds search.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="crucial">The system is generic over the captured
          dimensions. Adding a new dimension</HighlightBlock>
<HighlightBlock as="p" tier="important">(e.g.
          group-by) is a schema extension plus updates
          to capture/apply.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The same pattern works for dashboard views,
          search views, and any presentation-state-as-data UI.</HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">
          All UI strings (Save, Save As, Modified, Sharing scopes) come from i18n and must be consistent across
          surfaces (table header, picker, dialogs).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          View names are user-supplied content: render as text, don&rsquo;t auto-translate, and ensure sorting/search
          uses locale-aware collation.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          RTL impacts picker layout and icons; use logical properties so the same view model renders correctly in RTL
          without changing payload semantics.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Versioned schema vs free-form</h3>
        <HighlightBlock as="p" tier="crucial">
          Versioned + migrations gracefully handles
          evolution; free-form requires manual fix-up
          per change. Versioned is the right architecture
          for any non-trivial product.
        </HighlightBlock>

        <h3>Server-shared vs URL-only sharing</h3>
        <HighlightBlock as="p" tier="important">
          URL-only sharing works for ad-hoc; server-
          shared views are persistent and discoverable
          by team members. Both are useful; we support
          both.
        </HighlightBlock>

        <h3>Role defaults vs per-user only</h3>
        <HighlightBlock as="p" tier="important">
          Role defaults reduce onboarding friction (new
          user lands on a sensible view rather than
          empty). Per-user-only is simpler but worse UX
          for new joiners.
        </HighlightBlock>

        <h3>Modified-state tracking</h3>
        <HighlightBlock as="p" tier="important">
          Tracking ad-hoc overrides and surfacing the
          modified indicator costs some implementation
          but is essential UX — without it, users
          don&rsquo;t know whether their changes are
          saved.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">AI-suggested views based on observed usage
          patterns. View templates marketplace where
          teams share well-curated views.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Cross-tool
          views (apply the same filter set to multiple
          tables). Real-time collaborative editing of
          shared views. Versioning of views with rollback.</Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate canonical data, user intent, transient projection, remote effects, and bounded telemetry. Every cursor, subscription, cache entry, request, timer, observer, and worker requires an explicit owner and cleanup path. Stable ids are mandatory because indexes and DOM nodes are disposable views.</p><p>Represent filters as a typed AST rather than ad hoc query strings. Saved views reference stable field ids and must reconcile against the current schema and authorization policy. Commit durable changes only after applying the current policy and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/saved-views-filters-system-recovery.svg" alt="Design a Saved Views and Filters System recovery" caption="Recovery flow: validate versions, contain scale pressure, preserve stable truth, and explain the result." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Raw query parameters are simple; a typed AST is justified for composable filters, sharing, migrations, and secure server translation.</p><p>Server policy determines allowed fields and persisted shared views. URL state is a portable local projection that must be parsed defensively and migrated. Scale pressure comes from complex filters, stale shared URLs, removed fields, permission drift, incompatible operators, large payloads, and concurrent view edits. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic projection only where rollback is deterministic and visible. Keep authorization and conflict-sensitive truth server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed events, explicit versions, cursor validation, generation guards, bounded caches, semantic HTML, and idempotent cleanup. Test keyboard use, accessibility output, stale responses, reconnects, retries, scroll restoration, and large datasets.</p><p>Measure interaction latency, render cost, cache pressure, stale drops, conflicts, retries, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include confusing visible data with complete data, trusting arrival order, leaking subscriptions, accepting stale completion, using indexes as identity, and hiding rollback.</p><p>For this topic, drop forbidden clauses, validate operators, preserve valid filters during migration, surface removed conditions, version saved views, and avoid silently broadening queries. Validate untrusted inputs, authorize durable actions server-side, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to operational interfaces where users manipulate large, changing datasets under partial failure. Reuse the controller shape while injecting query, authorization, persistence, and fallback policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Represent filters as a typed AST rather than ad hoc query strings. Saved views reference stable field ids and must reconcile against the current schema and authorization policy.</p><h3>What breaks at scale?</h3><p>complex filters, stale shared URLs, removed fields, permission drift, incompatible operators, large payloads, and concurrent view edits. I would bound expensive work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>Server policy determines allowed fields and persisted shared views. URL state is a portable local projection that must be parsed defensively and migrated.</p><h3>How do you recover?</h3><p>I would drop forbidden clauses, validate operators, preserve valid filters during migration, surface removed conditions, version saved views, and avoid silently broadening queries.</p><h3>Why this architecture?</h3><p>Raw query parameters are simple; a typed AST is justified for composable filters, sharing, migrations, and secure server translation.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}

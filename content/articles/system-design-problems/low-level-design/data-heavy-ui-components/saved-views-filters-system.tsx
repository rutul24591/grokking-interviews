"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
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

export default function SavedViewsFiltersSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
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
        </p>
        <p>
          The hard problems are: a serializable view
          schema that captures everything that affects
          presentation; sharing semantics (private,
          team-shared, role-default); URL synchronization
          so the active view is reflected in the URL;
          graceful migration when the underlying table
          schema evolves; conflict resolution when a
          shared view is edited concurrently; and
          accessibility for the view-management UI.
        </p>

        <h3>User Context</h3>
        <p>
          Power users (analysts, ops, customer success)
          curate dozens of saved views to fit different
          workflows. Team leads share team-relevant views.
          New users benefit from role defaults
          (&ldquo;Customer Success view&rdquo; that comes
          pre-configured). Engineering teams plug in:
          declare the view schema (which dimensions are
          captured), point to a persistence endpoint, and
          the system handles the rest.
        </p>

        <h3>Assumptions</h3>
        <p>
          The Data Table&rsquo;s filter and sort state and
          the Column Configuration are accessible via
          stable APIs. Backend provides per-user view
          storage plus shared-view storage. Modern
          browsers; we use the URL for sharing and
          localStorage as a write-through cache.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the Data Table itself or
          its filter editors. We do not implement
          dashboard saved-views (different concern). We
          do not implement cross-table saved views (each
          view is per-table).
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
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
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Sharing: team-shared views (visible to all team
          members); org-shared. Role defaults: admin sets
          a default view per role for new users. Pinned
          views in the picker (most common at top).
          Suggested views based on common patterns. Audit
          log for shared views (who edited what).
          Conflict resolution: warn when a shared view is
          modified by another user.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Cross-table views, dashboard views (separate
          subsystems). Real-time collaborative editing of
          a single view. Server-side execution of views
          (saving the rendered data, not just the
          definition).
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          View load on table mount under 100 ms (using
          cache). Switching presets feels instant (under
          200 ms including data fetch). Save debounced.
        </p>

        <h3>Reliability</h3>
        <p>
          Views serialize and deserialize round-trip
          cleanly. Schema migration handles missing
          referenced fields without breaking views.
          Concurrent edits to shared views detected and
          surfaced.
        </p>

        <h3>Security</h3>
        <p>
          Per-user views scope by user id. Shared views
          scope by team or org with proper access checks.
          Server enforces ownership and sharing
          permissions.
        </p>

        <h3>Accessibility</h3>
        <p>
          View picker is keyboard-navigable. Save and
          rename dialogs are accessible. State changes
          announce.
        </p>

        <h3>Maintainability</h3>
        <p>
          View schema is versioned; migrations bridge
          versions. The capture logic is centralized
          (one place that knows what dimensions a view
          contains). Adding a new dimension is a schema
          extension plus a migration.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The system is structured as a <strong>view
          schema</strong> (declares what dimensions a view
          captures), a <strong>view store</strong> (per-user
          and shared lists), a <strong>capture/apply
          system</strong> (gathers current table state into
          a view, applies a view to the table), and a
          <strong> URL bridge</strong> (synchronizes active
          view with URL).
        </p>
        <p>
          The <strong>view schema</strong> is a versioned
          JSON shape. Each view has{" "}
          <code>{` { id, name, version, filters, sort, columnConfig, density, owner, sharing? } `}</code>.
          The capture logic (a single function per
          version) knows how to gather these dimensions
          from the current table state. The apply logic
          (a single function per version) knows how to
          push them back into the table.
        </p>
        <p>
          The <strong>view store</strong> holds the user&rsquo;s
          presets plus shared presets they have access to.
          On mount, we fetch both lists in parallel.
          Cached lists serve instant first paint while
          server fetches refresh in background. The
          active view is part of the store; switching
          views updates the active view id and applies
          the captured state to the table.
        </p>
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
        <p>
          <strong>URL sync</strong>: the active view&rsquo;s
          id is in the URL. When the user makes ad-hoc
          changes (e.g. adds an additional filter
          without saving), the URL transitions to a
          &ldquo;view + overrides&rdquo; state that&rsquo;s
          still shareable. When they save the changes
          back to the view, the URL is just the view id
          again. Sharing the URL takes recipients to the
          same state.
        </p>
        <p>
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
        </p>
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
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>ViewProvider</strong> instantiates the
          view store, capture/apply logic, and URL bridge.
          <strong> ViewStore</strong> holds the user&rsquo;s
          views and shared views.
          <strong> ViewCapture</strong> gathers state from
          subsystems. <strong>ViewApply</strong> pushes
          state to subsystems.
          <strong> ViewMigrator</strong> handles schema
          migration on load.
          <strong> ViewPicker</strong> is the UI for
          listing, selecting, saving, editing.
          <strong> URLBridge</strong> synchronizes active
          view with URL.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          View list and active view live in an external
          store. Active view&rsquo;s ad-hoc overrides
          (changes since last save) are tracked separately
          so we can compute &ldquo;has this view been
          modified&rdquo; for the Save badge. URL is the
          source of truth for the active view id and
          override state.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          View shape:{" "}
          <code>{` { id, name, version, filters, sort, columnConfig, density, owner, sharing? } `}</code>.
          Server contract:{" "}
          <code>{` GET /tables/:id/views, POST /views, PUT /views/:id, DELETE /views/:id `}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance</h2>
        <p>
          View list is small (typically dozens of views);
          loading is fast. Apply happens in one
          transaction across subsystems so the table
          re-renders once. Caching of view list
          eliminates per-mount network dependency.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          The view picker is a dropdown or sidebar
          listing views, with a Save button to capture
          current state. Active view shows a checkmark.
          Modified state shows a &ldquo;modified&rdquo;
          indicator next to the active view name; a Save
          action commits changes back. Save As clones the
          view under a new name. Sharing is a
          right-click or settings option per view.
          Search input filters the picker for users with
          many views.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          View picker is keyboard-navigable
          (arrow keys, Enter to select). Save dialog has
          proper labels. Modified-state indicator is
          accessible (text equivalent, not just a
          dot). Schema migration warnings announce.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Per-user views scope by user id. Shared views
          have explicit access lists; server enforces.
          Audit log records edits for shared views. View
          payloads contain filter values which may
          contain PII (e.g. a user&rsquo;s email in a
          filter); we treat them as sensitive in
          logging and access controls.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for capture/apply round-trips,
          schema migration scenarios. Integration tests:
          save, switch, edit, share, clone. Concurrent
          edit detection on shared views. URL sync
          across navigation.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          A view references a filter dimension that no
          longer exists: migrator drops it; user is
          informed via a banner. A shared view is
          edited concurrently by two users: optimistic
          locking surfaces a conflict; the second saver
          chooses to merge or overwrite. A view is
          deleted while a user has it active: graceful
          fallback to default; banner explains. URL
          carries an unknown view id: fall back to
          default with a banner. Role default and user
          default conflict: user default wins. Many
          views (hundreds): picker virtualizes the list
          and adds search.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          The system is generic over the captured
          dimensions. Adding a new dimension (e.g.
          group-by) is a schema extension plus updates
          to capture/apply. The same pattern works for
          dashboard views, search views, and any
          presentation-state-as-data UI.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          UI strings via i18n. View names are
          user-supplied content; we render them as
          text. Sharing labels (Private, Team) translate.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Versioned schema vs free-form</h3>
        <p>
          Versioned + migrations gracefully handles
          evolution; free-form requires manual fix-up
          per change. Versioned is the right architecture
          for any non-trivial product.
        </p>

        <h3>Server-shared vs URL-only sharing</h3>
        <p>
          URL-only sharing works for ad-hoc; server-
          shared views are persistent and discoverable
          by team members. Both are useful; we support
          both.
        </p>

        <h3>Role defaults vs per-user only</h3>
        <p>
          Role defaults reduce onboarding friction (new
          user lands on a sensible view rather than
          empty). Per-user-only is simpler but worse UX
          for new joiners.
        </p>

        <h3>Modified-state tracking</h3>
        <p>
          Tracking ad-hoc overrides and surfacing the
          modified indicator costs some implementation
          but is essential UX — without it, users
          don&rsquo;t know whether their changes are
          saved.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          AI-suggested views based on observed usage
          patterns. View templates marketplace where
          teams share well-curated views. Cross-tool
          views (apply the same filter set to multiple
          tables). Real-time collaborative editing of
          shared views. Versioning of views with rollback.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. What does a view capture?</strong>{" "}
          Filters, sort, column configuration, density —
          everything that affects presentation. Captured
          via subsystem APIs into a single serializable
          payload.
        </p>

        <p>
          <strong>2. How do you handle schema
          evolution?</strong> Versioned views with
          migrations. On load, migrators upgrade old
          versions to current; orphan references (filters
          for removed dimensions) drop gracefully with
          user notification.
        </p>

        <p>
          <strong>3. How is sharing implemented?</strong>{" "}
          Per-view sharing flag (private, team, org).
          Server enforces access on read. Shared views
          show a &ldquo;Shared&rdquo; badge. Non-owners
          can apply and clone but not edit unless
          permissions allow.
        </p>

        <p>
          <strong>4. How is the active view
          URL-synced?</strong> View id in URL; ad-hoc
          overrides since last save also serialize.
          Sharing the URL takes recipients to the same
          state. Saving overrides back to the view
          simplifies the URL to just the id.
        </p>

        <p>
          <strong>5. What happens with concurrent edits
          to a shared view?</strong> Optimistic locking
          with version checks; the second saver gets a
          conflict and chooses to merge or overwrite.
        </p>

        <p>
          <strong>6. How do role defaults fit in?</strong>{" "}
          Admins set a default per role. New users in
          that role mount the table with that view.
          User can change and save their own default,
          which then takes precedence.
        </p>

        <p>
          <strong>7. How is the modified state
          tracked?</strong> Compare current subsystem
          state to the captured view state. Differences
          → modified. Subscribers re-render the
          modified indicator.
        </p>

        <p>
          <strong>8. How does this integrate with the
          Data Table?</strong> Through stable APIs on the
          subsystems (filters, sort, column config). The
          views system reads via getter, writes via
          setter; subsystems don&rsquo;t know about views.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A saved-views system is a{" "}
          <strong>versioned, capturable preset model</strong>{" "}
          for presentation state. Capture and apply
          gather and push state through stable subsystem
          APIs; URL sync makes views shareable; schema
          migration keeps views resilient to evolution;
          sharing semantics support private, team, and
          role-default views. The result turns ad-hoc
          table use into repeatable workflows — power
          users curate their library; new users land on
          sensible defaults; teams share what works.
        </p>
      </section>
    </ArticleLayout>
  );
}

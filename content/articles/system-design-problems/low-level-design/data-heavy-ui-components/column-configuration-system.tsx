"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-column-configuration-system",
  title: "Design a Column Configuration System",
  description:
    "LLD for a column configuration system: per-user visibility, order, width, pinning; persistence across sessions; per-table presets; admin defaults.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "column-configuration-system",
  wordCount: 6200,
  readingTime: 33,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "column-config",
    "user-preferences",
    "persistence",
    "react",
  ],
  relatedTopics: [
    "data-table",
    "saved-views-filters-system",
    "dashboard-builder",
  ],
};

export default function ColumnConfigurationSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a column configuration system —
          the layer that lets users customize which
          columns are visible in a table, their order,
          width, pinning, and grouping, and persists those
          preferences across sessions. Admin users can set
          organization-wide defaults that propagate to
          new users. The system sits on top of the Data
          Table&rsquo;s column model and turns a static
          schema into a per-user customizable view.
        </p>
        <p>
          The hard problems are: a layered configuration
          model (system defaults → org defaults → per-user
          preferences); merging with conflict resolution
          when defaults change but users have customized;
          validation that user configs reference real
          columns even after schema evolution; persistence
          that scales (per-user × per-table); and
          accessible UI for editing the configuration.
        </p>

        <h3>User Context</h3>
        <p>
          End users customize columns to match their
          workflow — &ldquo;I never look at column X, hide
          it; I always need column Y first&rdquo;. Admin
          users set org defaults that match team norms.
          Engineering teams plug in: declare the column
          schema, point to a persistence endpoint, and the
          system handles the rest.
        </p>

        <h3>Assumptions</h3>
        <p>
          The Data Table&rsquo;s column model is the source
          of truth for available columns. The backend
          provides a per-user-per-table preferences
          endpoint. Org defaults are fetched once per
          session. Modern browsers; we use localStorage as
          a write-through cache and the server as the
          authoritative store.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the Data Table&rsquo;s
          rendering — we configure it. We do not implement
          a separate filter/saved-views system (related but
          distinct). We do not implement column reordering
          via drag-and-drop UI in this article — that&rsquo;s
          a Data Table interaction; we provide the
          configuration model.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Per-column visibility (show/hide). Column order.
          Column width (per user, persisted). Column
          pinning (sticky-left, sticky-right). Layered
          defaults: system → org → user. User can
          customize on top of org defaults; resetting a
          column reverts to org default. Org admins can
          set defaults that propagate. Configuration
          persists across sessions per (user, table).
          Schema evolution: when a new column is added to
          the underlying schema, it appears in user
          configs at a default position; when a column is
          removed, user configs gracefully drop the
          missing column. Validation that user configs
          conform to the schema (no orphan column ids).
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Multiple presets per user (named configurations
          like &ldquo;Daily review&rdquo;,
          &ldquo;Reporting&rdquo;). Sharing presets with
          team members. Column groups (collapse/expand
          groups). Conditional column visibility based
          on role or context. Audit log of configuration
          changes for org admins.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Filter configuration (separate Saved Views
          system). Sort configuration (Data Table&rsquo;s
          own state). Column drag-and-drop UI mechanics
          (Data Table&rsquo;s interaction layer).
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Configuration load on table mount under 50 ms
          (using localStorage cache; server fetch in
          background). Configuration apply (re-render with
          new columns) under 100 ms. Save debounced (1
          second after edits) so rapid changes don&rsquo;t
          spam the server.
        </p>

        <h3>Reliability</h3>
        <p>
          Configurations validated before apply; invalid
          configs (referring to nonexistent columns) are
          repaired gracefully. Save failures don&rsquo;t
          lose local edits — local state remains updated;
          retry happens in the background.
        </p>

        <h3>Security</h3>
        <p>
          Per-user configs scoped by user id. Org defaults
          accessible only to authorized roles. Server
          enforces ownership on save.
        </p>

        <h3>Accessibility</h3>
        <p>
          Configuration UI is fully keyboard-accessible.
          Column visibility toggles are real checkboxes.
          Drag-to-reorder is paired with keyboard
          alternatives.
        </p>

        <h3>Maintainability</h3>
        <p>
          Configuration is declarative JSON. Adding a new
          configurable property (e.g. column color) is a
          schema extension plus a UI control.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The system is structured as a <strong>layered
          configuration model</strong> with three layers:
          <strong> system defaults</strong> (declared in
          code with the column schema),
          <strong> org defaults</strong> (set by admins),
          and <strong>user preferences</strong> (set by
          end users). The merged effective configuration
          is what the table renders.
        </p>
        <p>
          Each layer is a partial configuration: it can
          override any of the configurable properties
          (visible, order, width, pinned). When two layers
          set the same property, the higher layer wins
          (user &gt; org &gt; system). This gives users full
          customization without losing the safety net of
          a sensible default they can fall back to via
          Reset.
        </p>
        <p>
          On <strong>load</strong>, the system fetches the
          three layers in parallel: system defaults are
          static (compiled into the schema), org
          defaults from a session-scoped endpoint, user
          preferences from a per-table endpoint. The
          local cache (localStorage) holds the most
          recent user preferences for instant first
          paint while the server fetch completes in
          background. The merged config drives the
          table&rsquo;s column rendering.
        </p>
        <p>
          On <strong>edit</strong>, user changes update the
          local config and queue a server save. Saves
          debounce so rapid edits (e.g. dragging a column
          width) result in one save per second of
          activity rather than one per pixel of drag.
          Saves are idempotent (the full user config
          replaces the prior version). On save success,
          the local cache updates with the server&rsquo;s
          confirmed state. On failure, the local state
          retains the user&rsquo;s changes; we retry with
          backoff.
        </p>
        <p>
          On <strong>schema evolution</strong>: a new column
          appears in the schema. The system detects that
          user configs don&rsquo;t mention it. We insert
          it at a sensible position (right after the
          column it&rsquo;s declared near in the schema)
          with default visibility. Removed columns are
          dropped from user configs silently — they no
          longer exist. Renamed columns require a
          migration step (the schema declares the rename;
          we update user configs to use the new id).
        </p>
        <p>
          <strong>Reset to default</strong>: the user can
          reset any individual property (revert the
          column&rsquo;s width to org default), or reset
          everything (revert to org defaults entirely).
          The org admin can similarly reset to system
          defaults. Reset is just &ldquo;remove the
          override at this layer&rdquo;.
        </p>
        <p>
          The <strong>UI</strong> is a column chooser
          panel: a list of all columns with visibility
          toggles, a drag handle for reordering, width
          input and pin toggle. The panel is opened from
          the table&rsquo;s settings affordance. It
          surfaces the current effective configuration
          and lets users edit any layer (typically just
          their own user preferences; admins can edit
          org defaults from a separate admin UI).
          Changes preview live in the table; explicit
          Save commits to the server.
        </p>
        <p>
          <strong>Validation</strong> happens at multiple
          points. On schema evolution: drop or rename
          orphan column ids. On load: ensure all
          referenced ids exist in the current schema; if
          not, repair by dropping orphans. On save: the
          server validates against the schema and
          rejects malformed configs.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>ConfigStore</strong> holds the three
          layers and the merged effective config.
          <strong> DefaultsLoader</strong> fetches system,
          org, and user layers.
          <strong> ConfigMerger</strong> computes the
          effective config from the three layers.
          <strong> ConfigPersister</strong> handles
          debounced server saves.
          <strong> ConfigRepairer</strong> validates and
          repairs configs on schema evolution.
          <strong> ColumnChooser</strong> is the UI
          component for editing.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Configuration state lives in an external store
          per table. The table&rsquo;s rendering reads the
          merged effective config via selector hooks.
          Save status (saving/saved/error) is a separate
          slice for the UI status indicator.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Config shape:{" "}
          <code>{` { columns: { id: { visible?, width?, pinned?, order? } } } `}</code>.
          Server contract:{" "}
          <code> PUT /tables/:tableId/preferences</code>{" "}
          with the user config body, returns confirmed
          state.
        </p>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance</h2>
        <p>
          Merging is O(columns) once on load and on
          edit. The merged config is memoized; subsequent
          renders reuse it via referential equality. The
          table re-renders only the columns whose effective
          config changed (memoized cells). LocalStorage
          cache provides instant first paint.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          The Column Chooser shows columns grouped by
          their schema-declared groups, each row with
          visibility toggle, drag handle, width input.
          Drag-to-reorder works via mouse and keyboard.
          Pin toggle for sticky left/right. A &ldquo;Reset
          to default&rdquo; button per column and an
          &ldquo;Reset all&rdquo; at the top. Save status
          indicator. Live preview as users edit.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Visibility toggles are checkboxes. Drag-to-
          reorder has keyboard alternative (Up/Down arrows
          when handle is focused). Width input is a
          numeric field with proper labels. Reset
          buttons are real buttons with accessible names
          (&ldquo;Reset width to default for [Column
          Name]&rdquo;). Save status announces.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Per-user configs scope by user id. Org admin
          changes audit-logged. Server enforces ownership.
          Configurations contain no PII; just column ids
          and properties.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for the merger (layered overrides,
          conflict resolution), repairer (schema
          evolution scenarios), debounced save. Integration
          tests with mock server: edit, save, reload,
          verify persistence. Schema evolution tests: add
          a column, verify user configs incorporate it
          gracefully.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          User had hidden column X; admin removes column
          X from schema. Config repairer drops the entry
          on next load. User had column Y first; admin
          renames Y to Z in schema. Migration step in the
          repairer updates the user config to use Z.
          Concurrent admin and user edits: server handles
          via optimistic locking (last-write-wins with
          version check), or surfaces a conflict if both
          versions diverge significantly. Save failure
          on slow network: local edits remain; retry in
          background; user sees a subtle indicator. New
          user with no preferences: org defaults apply
          immediately. Org with no defaults: system
          defaults apply.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          The configuration system is generic over schema.
          Any table can integrate by registering its
          schema and a persistence endpoint. The same
          pattern extends to other configurable UIs
          (dashboards, sidebars, navigation).
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Column names from the schema are typically
          translated by the consumer (the schema declares
          a label key, not a literal string). UI strings
          (Reset, Save) via i18n. RTL flips visual layout
          via CSS logical properties.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Layered defaults vs flat config</h3>
        <p>
          Layered (system → org → user) gives admins a
          way to set norms while letting users customize,
          plus a clean Reset semantic. Flat config makes
          everything user-only, simpler but losing the
          admin-defaults feature that&rsquo;s often
          valuable in enterprise products.
        </p>

        <h3>Server + local cache vs server-only</h3>
        <p>
          Server + cache gives instant first paint and
          works offline-first; server-only adds latency
          and breaks under network blips. Cache is
          worth the complexity.
        </p>

        <h3>Per-table config vs global config</h3>
        <p>
          Per-table (each table has its own preferences)
          fits user mental models — different tables have
          different appropriate columns. Global would
          force one config across all tables, awkward.
          Per-table is the right scope.
        </p>

        <h3>Repair vs reject on schema evolution</h3>
        <p>
          Repair (gracefully drop orphan ids, insert
          new columns at sensible positions) keeps users&rsquo;
          customizations working across deployments.
          Rejecting forces users to re-customize after
          every schema change, which is awful UX.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Multiple presets per user (named
          configurations). Sharing presets with team
          members. Column groups with collapse/expand.
          Role-based conditional visibility. Audit log
          UI for org admins. Smart suggestions
          (&ldquo;you never look at column X — hide
          it?&rdquo;). Sync configurations across devices
          beyond just localStorage.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why a layered configuration
          model?</strong> Admins set norms; users
          customize on top; system defaults are the
          fallback. Layering gives Reset semantics
          (revert to the layer below) and supports
          enterprise needs without losing user agency.
        </p>

        <p>
          <strong>2. How do you handle schema
          evolution?</strong> A repairer step on load:
          drop orphan ids, insert new columns at
          sensible positions, run migrations for
          renamed ids. Users don&rsquo;t lose their
          customizations across schema changes.
        </p>

        <p>
          <strong>3. How does persistence work?</strong>{" "}
          Server is authoritative; localStorage is a
          write-through cache for instant first paint.
          Saves are debounced and idempotent. Save
          failures retain local edits with background
          retry.
        </p>

        <p>
          <strong>4. How do concurrent admin and user
          edits resolve?</strong> Server optimistic
          locking with version checks. If a user&rsquo;s
          save is based on stale org defaults, the
          server can either accept (last-write-wins)
          or surface a conflict; we configure per
          product.
        </p>

        <p>
          <strong>5. What&rsquo;s in a configuration
          payload?</strong> Per-column overrides:
          visible, width, pinned, order. The full user
          config replaces prior versions on save (no
          partial diffs). Schema-derived data is not
          duplicated — only overrides are stored.
        </p>

        <p>
          <strong>6. How does Reset work?</strong> Remove
          the user&rsquo;s override at the layer being
          reset. Reset width → user&rsquo;s width
          override is removed; org default applies.
          Reset all → user&rsquo;s entire override is
          removed.
        </p>

        <p>
          <strong>7. How is the UI accessible?</strong>{" "}
          Real checkboxes for visibility, keyboard
          alternative for drag-reorder, labeled inputs
          for width, accessible Reset buttons. Save
          status announces.
        </p>

        <p>
          <strong>8. How does this scale to many
          tables?</strong> Per-table preferences; the
          server stores them keyed by (user id, table
          id). Loads happen in parallel with table
          mount. Cache prevents per-mount network
          dependency.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A column configuration system is a{" "}
          <strong>layered defaults model</strong> (system
          → org → user) with debounced persistence,
          schema-evolution-safe repair, and an
          accessible UI. The merged effective config
          drives the table; reset semantics flow from the
          layering. The result is a customization
          experience that respects both individual
          workflow and organizational norms — neither at
          the expense of the other.
        </p>
      </section>
    </ArticleLayout>
  );
}

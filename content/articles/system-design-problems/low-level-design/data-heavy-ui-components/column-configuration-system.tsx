"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
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

export default function ColumnConfigurationSystemArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Column Configuration System</h1><h2>Definition &amp; Context</h2><p>Design a Column Configuration System is an implementation-heavy low-level design problem covering column schema, visibility, ordering, resizing, pinning, type-aware rendering, persistence, migration, and permission filtering. A principal-level answer must define state ownership, consistency, lifecycle cleanup, scale limits, rollback, privacy, cost, and observability.</p><p>Keep canonical server-allowed columns separate from user preferences. Preferences reference stable column ids and are reconciled whenever schema or permission policy changes. The core structures are column registry, allowed-id set, display order, visibility set, width map, pinned groups, renderer registry, storage version, and migration result.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/column-configuration-system-runtime.svg" alt="Design a Column Configuration System runtime" caption="Topic-specific data flow from input or payload through guarded projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a column configuration system —
          the layer that lets users customize which
          columns are visible in a table, their order,
          width, pinning, and grouping, and persists those
          preferences across sessions. Admin users can set
          organization-wide defaults that propagate to
          new users. The system sits on top of the Data
          Table&rsquo;s column model and turns a static
          schema into a per-user customizable view.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: a layered configuration
          model (system defaults → org defaults → per-user
          preferences); merging with conflict resolution
          when defaults change but users have customized;
          validation that user configs reference real
          columns even after schema evolution; persistence
          that scales (per-user × per-table); and
          accessible UI for editing the configuration.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users customize columns to match their
          workflow — &ldquo;I never look at column X, hide
          it; I always need column Y first&rdquo;. Admin
          users set org defaults that match team norms.
          Engineering teams plug in: declare the column
          schema, point to a persistence endpoint, and the
          system handles the rest.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          The Data Table&rsquo;s column model is the source
          of truth for available columns. The backend
          provides a per-user-per-table preferences
          endpoint. Org defaults are fetched once per
          session. Modern browsers; we use localStorage as
          a write-through cache and the server as the
          authoritative store.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the Data Table&rsquo;s
          rendering — we configure it. We do not implement
          a separate filter/saved-views system (related but
          distinct). We do not implement column reordering
          via drag-and-drop UI in this article — that&rsquo;s
          a Data Table interaction; we provide the
          configuration model.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Multiple presets per user (named configurations
          like &ldquo;Daily review&rdquo;,
          &ldquo;Reporting&rdquo;). Sharing presets with
          team members. Column groups (collapse/expand
          groups). Conditional column visibility based
          on role or context. Audit log of configuration
          changes for org admins.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Filter configuration (separate Saved Views
          system). Sort configuration (Data Table&rsquo;s
          own state). Column drag-and-drop UI mechanics
          (Data Table&rsquo;s interaction layer).
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="crucial">
          Configuration load on table mount under 50 ms
          (using localStorage cache; server fetch in
          background). Configuration apply (re-render with
          new columns) under 100 ms. Save debounced (1
          second after edits) so rapid changes don&rsquo;t
          spam the server.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Configurations validated before apply; invalid
          configs (referring to nonexistent columns) are
          repaired gracefully. Save failures don&rsquo;t
          lose local edits — local state remains updated;
          retry happens in the background.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Per-user configs scoped by user id. Org defaults
          accessible only to authorized roles. Server
          enforces ownership on save.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Configuration UI is fully keyboard-accessible.
          Column visibility toggles are real checkboxes.
          Drag-to-reorder is paired with keyboard
          alternatives.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Configuration is declarative JSON. Adding a new
          configurable property (e.g. column color) is a
          schema extension plus a UI control.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        
        <HighlightBlock as="p" tier="important">
          The system is structured as a <strong>layered
          configuration model</strong> with three layers:
          <strong> system defaults</strong> (declared in
          code with the column schema),
          <strong> org defaults</strong> (set by admins),
          and <strong>user preferences</strong> (set by
          end users). The merged effective configuration
          is what the table renders.
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
          <strong>Validation</strong> happens at multiple
          points. On schema evolution: drop or rename
          orphan column ids. On load: ensure all
          referenced ids exist in the current schema; if
          not, repair by dropping orphans. On save: the
          server validates against the schema and
          rejects malformed configs.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong>ConfigStore</strong> holds the three
          layers and the merged effective config.
          <strong> DefaultsLoader</strong> fetches system,
          org, and user layers.
          <strong> ConfigMerger</strong> computes the
          effective config from the three layers.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important"><strong> ConfigPersister</strong></Highlight> handles
          debounced server saves.
          <strong> ConfigRepairer</strong> validates and
          repairs configs on schema evolution.
          <strong> ColumnChooser</strong> is the UI
          component for editing.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">Configuration state lives in an external store
          per table. The table&rsquo;s rendering reads the
          merged effective config via selector hooks.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Save status (saving/saved/error) is a separate
          slice for the UI status indicator.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">The config is keyed by column ID and stores
          presentation preferences such as visibility, width,
          pinning, and relative order.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">A typical server contract is
          </Highlight><code> PUT /tables/:tableId/preferences</code> with
          the user config body; the response returns the
          confirmed state after validation and normalization.</HighlightBlock>
      </section>

      <section>
        <h3>⚡ Rendering &amp; Performance</h3>
        <HighlightBlock as="p" tier="crucial">Merging is O(columns) once on load and on
          edit. The merged config is memoized; subsequent
          renders reuse it via referential equality.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">The
          table re-renders only the columns whose effective
          config changed (memoized cells). LocalStorage
          cache provides instant first paint.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">The Column Chooser shows columns grouped by
          their schema-declared groups, each row with
          visibility toggle, drag handle, width input.
          Drag-to-reorder works via mouse and keyboard.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Pin toggle for sticky left/right. A &ldquo;Reset
          to default&rdquo; button per column and an
          &ldquo;Reset all&rdquo; at the top. Save status
          indicator. Live preview as users edit.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="important">Visibility toggles are checkboxes. Drag-to-
          reorder has keyboard alternative (Up/Down</HighlightBlock>
<HighlightBlock as="p" tier="important">arrows
          when handle is focused). Width input is a
          numeric field with proper labels.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">Reset
          buttons are real buttons with accessible names
          (&ldquo;Reset width to default for [Column
          Name]&rdquo;). Save status announces.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="crucial">
          The server enforces ownership and scope: per-user configs are keyed by user
          id, and org defaults are guarded by org admin permissions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Treat saved views/configs as potentially sensitive: filter values can contain
          PII even if the schema looks harmless. Avoid logging payloads, and apply the
          same access controls as the underlying dataset.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Use optimistic locking (version/etag) to prevent silent overwrites, and
          audit-log admin changes so you can explain why defaults shifted for many users.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">
          Golden-path integration: edit config, save, reload, and verify persistence and
          config repair behavior under schema evolution.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Schema evolution tests: add/remove/rename a column and verify user configs
          migrate (or drop invalid entries) without breaking rendering.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Concurrency tests: two clients saving with a stale version should surface a
          conflict rather than last-write-wins silently.
        </HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="important">User had hidden column X; admin removes column X from schema. Config</HighlightBlock>
<HighlightBlock as="p" tier="important">repairer drops the entry on next load. User had column Y first; admin renames Y to</HighlightBlock>
<HighlightBlock as="p" tier="important">Z in schema. Migration step in the repairer updates the user config to use Z.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">Concurrent admin and user edits: server handles
          via optimistic locking (last-write-wins with
          version check), or surfaces a conflict if both
          versions diverge significantly. Save failure
          on slow network: local edits remain; retry in
          background; user sees a subtle indicator. New
          user with no preferences: org defaults apply
          immediately. Org with no defaults: system
          defaults apply.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="crucial">
          The configuration system is generic over schema: any table integrates by
          registering its schema and a persistence endpoint.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The same contract works beyond tables: dashboard layouts, sidebar navigation,
          and any presentation-state-as-data surface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Keeping schema/versioning explicit is what preserves reuse: the runtime can
          repair and migrate configs without knowing the domain semantics.
        </HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">Column names from the schema are typically
          translated by the consumer (the</HighlightBlock>
<HighlightBlock as="p" tier="important">schema declares
          a label key, not a literal string). UI strings</HighlightBlock>
<HighlightBlock as="p" tier="important">(Reset, Save) via i18n. RTL flips visual layout
          via CSS logical properties.</HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Layered defaults vs flat config</h3>
        <HighlightBlock as="p" tier="important">
          Layered (system → org → user) gives admins a
          way to set norms while letting users customize,
          plus a clean Reset semantic. Flat config makes
          everything user-only, simpler but losing the
          admin-defaults feature that&rsquo;s often
          valuable in enterprise products.
        </HighlightBlock>

        <h3>Server + local cache vs server-only</h3>
        <HighlightBlock as="p" tier="crucial">
          Server + cache gives instant first paint and
          works offline-first; server-only adds latency
          and breaks under network blips. Cache is
          worth the complexity.
        </HighlightBlock>

        <h3>Per-table config vs global config</h3>
        <HighlightBlock as="p" tier="important">
          Per-table (each table has its own preferences)
          fits user mental models — different tables have
          different appropriate columns. Global would
          force one config across all tables, awkward.
          Per-table is the right scope.
        </HighlightBlock>

        <h3>Repair vs reject on schema evolution</h3>
        <HighlightBlock as="p" tier="important">
          Repair (gracefully drop orphan ids, insert
          new columns at sensible positions) keeps users&rsquo;
          customizations working across deployments.
          Rejecting forces users to re-customize after
          every schema change, which is awful UX.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">Multiple presets per user (named
          configurations). Sharing presets with team
          members. Column groups with collapse/expand.
          Role-based conditional visibility.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Audit log
          UI for org admins. Smart suggestions
          (&ldquo;you never look at column X — hide
          it?&rdquo;). Sync configurations across devices
          beyond just localStorage.</Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate canonical data, user intent, transient projection, remote effects, and bounded telemetry. Every cursor, subscription, cache entry, request, timer, observer, and worker requires an explicit owner and cleanup path. Stable ids are mandatory because indexes and DOM nodes are disposable views.</p><p>Keep canonical server-allowed columns separate from user preferences. Preferences reference stable column ids and are reconciled whenever schema or permission policy changes. Commit durable changes only after applying the current policy and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/column-configuration-system-recovery.svg" alt="Design a Column Configuration System recovery" caption="Recovery flow: validate versions, contain scale pressure, preserve stable truth, and explain the result." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Hard-coded columns are simplest; configuration is justified when users need durable personalized views without bypassing data-access policy.</p><p>Server policy determines allowed columns. User preferences are local or remotely persisted projections that must drop inaccessible ids and migrate versioned defaults. Scale pressure comes from hundreds of columns, schema evolution, permission changes, stale preferences, responsive layouts, and expensive custom renderers. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic projection only where rollback is deterministic and visible. Keep authorization and conflict-sensitive truth server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed events, explicit versions, cursor validation, generation guards, bounded caches, semantic HTML, and idempotent cleanup. Test keyboard use, accessibility output, stale responses, reconnects, retries, scroll restoration, and large datasets.</p><p>Measure interaction latency, render cost, cache pressure, stale drops, conflicts, retries, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include confusing visible data with complete data, trusting arrival order, leaking subscriptions, accepting stale completion, using indexes as identity, and hiding rollback.</p><p>For this topic, filter forbidden columns, clamp widths, migrate stored preferences, restore defaults on invalid state, isolate renderer failure, and preserve a usable table. Validate untrusted inputs, authorize durable actions server-side, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to operational interfaces where users manipulate large, changing datasets under partial failure. Reuse the controller shape while injecting query, authorization, persistence, and fallback policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep canonical server-allowed columns separate from user preferences. Preferences reference stable column ids and are reconciled whenever schema or permission policy changes.</p><h3>What breaks at scale?</h3><p>hundreds of columns, schema evolution, permission changes, stale preferences, responsive layouts, and expensive custom renderers. I would bound expensive work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>Server policy determines allowed columns. User preferences are local or remotely persisted projections that must drop inaccessible ids and migrate versioned defaults.</p><h3>How do you recover?</h3><p>I would filter forbidden columns, clamp widths, migrate stored preferences, restore defaults on invalid state, isolate renderer failure, and preserve a usable table.</p><h3>Why this architecture?</h3><p>Hard-coded columns are simplest; configuration is justified when users need durable personalized views without bypassing data-access policy.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}

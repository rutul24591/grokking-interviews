"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-calendar-scheduler",
  title: "Design a Calendar / Scheduler",
  description:
    "LLD for a calendar/scheduler: event drag/drop, collision detection, recurring events, multi-view (day/week/month), time zones, and accessibility.",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "calendar-scheduler",
  wordCount: 6700,
  readingTime: 35,
  lastUpdated: "2026-05-04",
  tags: ["lld", "calendar", "scheduler", "drag-and-drop", "timezones", "react"],
  relatedTopics: [
    "date-time-picker",
    "drag-drop-list",
    "kanban-board",
  ],
};

export default function CalendarSchedulerArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Calendar Scheduler</h1><h2>Definition &amp; Context</h2><p>Design a Calendar Scheduler is an implementation-heavy interaction design covering timezone projection, interval layout, recurrence expansion, drag-resize previews, overlap policy, optimistic writes, and rollback. A principal-level answer must explain state ownership, geometry, browser events, cancellation, accessibility, persistence, scale, and observability.</p><p>Persist canonical instants and timezone ids. Keep committed events separate from drag projections and visible-range recurrence expansion. Core structures: event map, interval index, recurrence rules, exception set, visible range, projected mutation, overlap columns, timezone policy, and version journal.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/calendar-scheduler-runtime.svg" alt="Design a Calendar Scheduler runtime" caption="Interaction flow from input through projection, policy, commit, and render." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a calendar / scheduler —
          the Google Calendar / Outlook-style UI
          where users see events on a day, week,
          or month grid and can create, edit, and
          drag events to reschedule. The component
          is the foundation of any product with
          time-based scheduling: meeting tools,
          appointment systems, project timelines,
          time-tracking. Done well it feels like
          GCal; done poorly it&rsquo;s a janky time-
          zone-confused mess.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: time-zone
          correctness across DST, locale, and
          users in different zones; recurring
          events that expand to instances; event
          collision rendering (overlapping events
          show side-by-side); drag to reschedule
          and resize to change duration; multi-day
          events; multi-view rendering (day, week,
          month); virtualization for long
          calendars; accessibility for the grid.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users schedule events, view their
          calendar, drag to reschedule. Power
          users (e.g. ops scheduling) work in
          dense calendars all day. Engineering
          teams provide an event source; runtime
          handles UI.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend exposes events with
          start/end (ISO with offset),
          recurrence rules (RRULE), title,
          metadata. Modern browsers; we use
          Temporal (or date-fns) for date math,
          Pointer Events for drag.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement RRULE parsing
          (use a library). We do not implement
          server-side conflict detection.
          End-to-end calendar sync (CalDAV) is
          out of scope; we consume a service&rsquo;s
          API.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="important">
          Three views: day, week, month. Events
          rendered with title, time, duration.
          Multi-day events span columns
          appropriately. Recurring events expand
          to instances within the visible range.
          Click to create event; drag a duration
          on the time grid to create. Click an
          event to view/edit. Drag event to
          reschedule. Resize event to change
          duration. Time zone per user; events
          render in user&rsquo;s zone. Today
          highlight. Navigate previous/next view
          (day/week/month). Empty state.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Multi-calendar (overlay multiple
          calendars with different colors).
          Free/busy view (others&rsquo;
          availability). Mini calendar for
          quick navigation. Today button.
          Search events. Keyboard navigation.
          Accept/decline RSVP. Working hours
          shading.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          RRULE editor, advanced recurrence,
          calendar provider integration
          backends.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="crucial">
          View change under 200 ms. Drag at 60
          fps. Recurring expansion cached for
          the visible range. Many events on
          one day virtualized if needed.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Time zone correctness across DST.
          Recurring expansion accurate.
          Optimistic rescheduling rolls back on
          failure.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Server enforces event access.
          Cross-user calendar visibility
          configured server-side.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Time grid as a proper grid. Events
          focusable. Keyboard navigation.
          Times announced clearly.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Date library via adapter (Temporal
          preferred). Renderers per view.
          Plugins for additional features.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="important">
          The system has four parts: <strong>event
          source + recurring expander</strong>,
          <strong> view renderer</strong> (day/
          week/month with collision layout),
          <strong> drag/resize controller</strong>{" "}
          for events, and
          <strong> time-zone-aware date math</strong>{" "}
          via Temporal.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>event source</strong>{" "}
          provides events with optional RRULE
          for recurring. On view change, we
          query the visible range and expand
          recurring events to concrete instances
          within that range. Expansion is
          cached per (event, range). RRULE
          parsing via a library (rrule.js).
        </HighlightBlock>
        <p>
          The <strong>day view</strong>: a
          vertical time grid (typically hours
          on the left) with events positioned
          by their start time and height
          proportional to duration.
        </p>
        <p>
          The <strong>week view</strong>: seven
          day columns each like a day view,
          with all-day events at the top.
        </p>
        <p>
          The <strong>month view</strong>: a
          calendar grid (rows of weeks);
          events render as small bars on
          their day or span multiple days
          for multi-day events.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Collision rendering</strong>:
          when two events overlap in time on
          the same day, they render side by
          side with reduced width. The
          algorithm: group overlapping events;
          within a group, allocate columns
          such that no two events in the same
          column overlap; render each event
          at its column position.
        </HighlightBlock>
        <p>
          <strong>Time zone handling</strong>:
          events store ISO with offset.
          Display formats via{" "}
          <code>Intl.DateTimeFormat</code> with
          the user&rsquo;s configured zone.
          DST-correct via Temporal&rsquo;s
          ZonedDateTime.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>create</strong>: click on
          an empty slot to create an event at
          that time. Drag from a slot to set
          duration. A modal opens for title
          and additional fields.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          On <strong>drag to reschedule</strong>:
          pointer-down on an event, drag,
          drop on a new slot. Optimistic
          update; persistence ships; rollback
          on failure. Cross-day drag works
          in week view.
        </HighlightBlock>
        <p>
          On <strong>resize</strong>: drag the
          event&rsquo;s top or bottom edge.
          Duration updates; persistence
          ships.
        </p>
        <p>
          <strong>Recurring event editing</strong>:
          when editing a recurring instance,
          ask: this instance only? this and
          following? all? Server applies the
          change accordingly. UI surfaces this
          choice clearly.
        </p>
        <p>
          <strong>View navigation</strong>: previous/
          next buttons; Today button. URL
          encodes view + date so links are
          shareable. Browser back/forward
          works.
        </p>
        <p>
          <strong>Working hours</strong>: shaded
          background indicates user&rsquo;s
          working hours. Outside-working-hours
          events still render but visually
          distinct.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong> EventBlock</strong> renders
          one event with drag/resize
          handles. <strong>CollisionLayouter</strong>{" "}
          computes column allocation for</HighlightBlock>
<HighlightBlock as="p" tier="important">overlapping events.
          <Highlight tier="important"><strong> ViewToolbar</strong></Highlight> for
          navigation. <strong>RecurringExpander</strong>{" "}
          expands RRULE to instances.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Events in external store (per
          calendar). View state <Highlight tier="important">(current view,
          current date) URL-synced. Drag</Highlight>
          state ephemeral. Selected event for
          editing in component state.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Event shape:</Highlight>{" "}
          <Highlight tier="important">
            <code>{` { id, title, start, end, allDay, rrule?, color?, ... } `}</code>
          </Highlight>
          . View state: <code>{` { view: "day" | "week" | "month", date } `}</code>.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Recurring expansion cached. Events
          rendered <Highlight tier="important">only for visible range.
          Memoized event</Highlight> blocks. Drag uses CSS
          transforms.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Familiar GCal-style layouts. Today
          highlighted. Current time line on</HighlightBlock>
<HighlightBlock as="p" tier="important">day/week views. Drag preview shows
          target time. Events colored by</HighlightBlock>
<HighlightBlock as="p" tier="important">calendar. Multi-day events span
          visually. Click empty slot to
          create.</HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Time grid as
          <code> role=&quot;grid&quot;</code> for
          day/week (each cell a half-hour</HighlightBlock>
<HighlightBlock as="p" tier="important">slot). Events as focusable items
          with title + time announced. Arrow
          keys</HighlightBlock>
<HighlightBlock as="p" tier="important">navigate cells. Enter to
          create or open. Time announcements
          locale- and zone-aware.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server enforces event access.
          <Highlight tier="important">Multi-calendar visibility per user.
          Sensitive event</Highlight> content rendered
          per permission.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Unit tests for collision layout,
          recurring expansion, time-zone
          <Highlight tier="important">math (DST corner cases).
          Integration tests</Highlight> for create,
          drag, resize, recurring edit.
          Time zone scenarios.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Event ends
          before it starts (data corruption):
          render as zero-duration; surface
          warning. Many overlapping events
          (10+ at the same time):</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">collision
          layout caps columns; overflow
          events show as &ldquo;+N more&rdquo;.
          Time zone change mid-session:
          re-render with new zone.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Pattern reuses <Highlight tier="important">for any time-grid UI.
          Date adapter</Highlight> swappable. Views
          customizable.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Date and time via
          </Highlight><code> Intl.DateTimeFormat</code>.
          Week start <Highlight tier="important">per locale. Month names,
          weekday names</Highlight> from Intl. RTL flips
          week direction.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Day/week/month vs single view</h3>
        <HighlightBlock as="p" tier="important">
          Multi-view matches user expectations
          (GCal). Single view is simpler but
          loses the macro perspective.
          Multi-view is essential for any
          serious calendar.
        </HighlightBlock>

        <h3>Temporal vs date-fns</h3>
        <HighlightBlock as="p" tier="important">
          Temporal is correct by construction
          for time zones; date-fns is mature
          and lightweight. We use Temporal
          where supported with date-fns
          fallback.
        </HighlightBlock>

        <h3>Server-side vs client-side recurrence
        expansion</h3>
        <HighlightBlock as="p" tier="important">
          Client-side expansion gives instant
          feedback in views. Server-side keeps
          recurrence logic in one place.
          Hybrid: server provides RRULE; client
          expands for views.
        </HighlightBlock>

        <h3>Optimistic vs confirmed reschedule</h3>
        <HighlightBlock as="p" tier="crucial">
          Optimistic feels instant. Confirmed-
          first feels slow. Optimistic with
          rollback.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          AI scheduling suggestions. Free/busy
          across <Highlight tier="important">multiple users. Cross-zone
          meeting helper. Smart</Highlight> conflict
          detection. Shared calendar real-time
          edits.
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Normalize pointer, touch, keyboard, resize, and async events before applying transitions. Separate raw intent, transient projection, committed state, derived geometry, and telemetry. Release pointer capture, listeners, observers, timers, and animation handles idempotently.</p><p>Persist canonical instants and timezone ids. Keep committed events separate from drag projections and visible-range recurrence expansion.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/calendar-scheduler-recovery.svg" alt="Design a Calendar Scheduler recovery" caption="Recovery flow: cancel safely, retain committed truth, recalculate projection, and restore UI." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Server versions are authoritative for writes. Visible range expansion is a deterministic projection. Scale pressure comes from dense calendars, DST boundaries, recurring series, multi-resource views, concurrent edits, and drag conflicts. Bound measurement, batch rendering, and degrade predictably.</p><p>Prefer native semantics where they meet requirements. Custom interaction earns its cost only when product behavior needs explicit gesture, geometry, or workflow policy.</p></section>
<section><h2>Best practices</h2><p>Use typed sessions, stable ids, pointer capture, keyboard alternatives, reduced-motion policy, clamped geometry, idempotent cleanup, and deterministic tests. Measure latency, dropped frames, cancellation, rollback, and accessibility regressions.</p><h3>Operational implementation: timezone-safe interval projection</h3><p>Persist canonical instants with timezone ids, expand recurrence only for the visible range, index overlaps, and keep drag-resize preview separate from the committed event. Conditional writes reject stale edits; rollback restores the server version while preserving a clear conflict explanation.</p><p>Define a typed interaction session with owner, generation, start geometry, latest projection, committed snapshot, cancellation reason, and cleanup handles. Instrument pointer-to-paint latency, dropped frames, measurement cost, projection count, cancellation, rollback, constraint violations, and accessibility fallback usage. Test pointer loss, resize during interaction, keyboard-only flow, reduced motion, hidden tabs, unmount cleanup, stale persistence response, and extreme geometry.</p></section>
<h3>Principal defense: scale, privacy, and rollback</h3><p>Keep committed domain state separate from transient geometry, pointer samples, animations, and derived guides. Under large collections, index only visible or nearby geometry, batch pointer updates to animation frames, cancel stale measurements, and degrade visual fidelity before interaction correctness. Persistence uses stable ids and versions; a rejected write restores the last committed snapshot and preserves an actionable retry state.</p><p>Even local interactions need abuse and privacy boundaries when they persist or collaborate. Validate dimensions, coordinates, payload sizes, and mutation frequency before accepting expensive work. Do not leak hidden objects, restricted calendar details, or cross-tenant geometry through previews, presence, or telemetry. Observe cancellation reason, long tasks, frame drops, rejected transitions, rollback outcome, and cleanup leaks.</p><section><h2>Common Pitfalls</h2><p>Common failures include mixing raw and committed state, leaking listeners, failing to handle pointer cancellation, ignoring keyboard users, and persisting invalid geometry.</p><p>For this topic, bound recurrence expansion, retain exceptions, rollback rejected drag, refresh conflicts, and explain timezone ambiguity.</p><h3>Interval layout and recurrence limits</h3><p>Expand recurring rules only for the visible range plus a small prefetch margin. Keep the rule and exception set authoritative; rendered occurrences are derived instances with stable composite ids. For overlapping events, sort by start time then duration, allocate the first available column, and compute width from the maximum simultaneous column count in the overlap group. Recompute only affected groups after edits.</p><p>Timezone behavior must be explicit around daylight-saving transitions. Store canonical instants and the intended timezone. When a local wall-clock time is ambiguous or nonexistent, ask for policy or surface the adjustment. Dragging an event across a DST boundary should preserve either elapsed duration or wall-clock semantics according to product requirements, not whichever behavior the date library happens to produce.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to repeated direct-manipulation workflows where responsive projection and safe cancellation matter as much as durable persistence.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Persist canonical instants and timezone ids. Keep committed events separate from drag projections and visible-range recurrence expansion.</p><h3>What breaks at scale?</h3><p>dense calendars, DST boundaries, recurring series, multi-resource views, concurrent edits, and drag conflicts.</p><h3>What consistency applies?</h3><p>Server versions are authoritative for writes. Visible range expansion is a deterministic projection.</p><h3>How do you recover?</h3><p>bound recurrence expansion, retain exceptions, rollback rejected drag, refresh conflicts, and explain timezone ambiguity.</p><h3>How do you defend the architecture?</h3><p>I would prefer native behavior until the required geometry, gesture, or workflow policy justifies a custom controller.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer Events</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li></ul></section>
</ArticleLayout>}
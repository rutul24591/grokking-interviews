"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

export default function CalendarSchedulerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
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
        </p>
        <p>
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
        </p>

        <h3>User Context</h3>
        <p>
          End users schedule events, view their
          calendar, drag to reschedule. Power
          users (e.g. ops scheduling) work in
          dense calendars all day. Engineering
          teams provide an event source; runtime
          handles UI.
        </p>

        <h3>Assumptions</h3>
        <p>
          Backend exposes events with
          start/end (ISO with offset),
          recurrence rules (RRULE), title,
          metadata. Modern browsers; we use
          Temporal (or date-fns) for date math,
          Pointer Events for drag.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement RRULE parsing
          (use a library). We do not implement
          server-side conflict detection.
          End-to-end calendar sync (CalDAV) is
          out of scope; we consume a service&rsquo;s
          API.
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
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
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Multi-calendar (overlay multiple
          calendars with different colors).
          Free/busy view (others&rsquo;
          availability). Mini calendar for
          quick navigation. Today button.
          Search events. Keyboard navigation.
          Accept/decline RSVP. Working hours
          shading.
        </p>

        <h3>Out of Scope</h3>
        <p>
          RRULE editor, advanced recurrence,
          calendar provider integration
          backends.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          View change under 200 ms. Drag at 60
          fps. Recurring expansion cached for
          the visible range. Many events on
          one day virtualized if needed.
        </p>

        <h3>Reliability</h3>
        <p>
          Time zone correctness across DST.
          Recurring expansion accurate.
          Optimistic rescheduling rolls back on
          failure.
        </p>

        <h3>Security</h3>
        <p>
          Server enforces event access.
          Cross-user calendar visibility
          configured server-side.
        </p>

        <h3>Accessibility</h3>
        <p>
          Time grid as a proper grid. Events
          focusable. Keyboard navigation.
          Times announced clearly.
        </p>

        <h3>Maintainability</h3>
        <p>
          Date library via adapter (Temporal
          preferred). Renderers per view.
          Plugins for additional features.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/calendar-scheduler-architecture.svg"
        alt="Calendar / Scheduler Architecture"
        caption="Event source → Recurring expander (RRULE → instances within view) → View renderer (day/week/month grid) → Drag/resize for events → Time zone-aware display via Temporal/Intl. Optimistic reschedule with rollback."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The system has four parts: <strong>event
          source + recurring expander</strong>,
          <strong> view renderer</strong> (day/
          week/month with collision layout),
          <strong> drag/resize controller</strong>{" "}
          for events, and
          <strong> time-zone-aware date math</strong>{" "}
          via Temporal.
        </p>
        <p>
          The <strong>event source</strong>{" "}
          provides events with optional RRULE
          for recurring. On view change, we
          query the visible range and expand
          recurring events to concrete instances
          within that range. Expansion is
          cached per (event, range). RRULE
          parsing via a library (rrule.js).
        </p>
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
        <p>
          <strong>Collision rendering</strong>:
          when two events overlap in time on
          the same day, they render side by
          side with reduced width. The
          algorithm: group overlapping events;
          within a group, allocate columns
          such that no two events in the same
          column overlap; render each event
          at its column position.
        </p>
        <p>
          <strong>Time zone handling</strong>:
          events store ISO with offset.
          Display formats via{" "}
          <code>Intl.DateTimeFormat</code> with
          the user&rsquo;s configured zone.
          DST-correct via Temporal&rsquo;s
          ZonedDateTime.
        </p>
        <p>
          On <strong>create</strong>: click on
          an empty slot to create an event at
          that time. Drag from a slot to set
          duration. A modal opens for title
          and additional fields.
        </p>
        <p>
          On <strong>drag to reschedule</strong>:
          pointer-down on an event, drag,
          drop on a new slot. Optimistic
          update; persistence ships; rollback
          on failure. Cross-day drag works
          in week view.
        </p>
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
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>CalendarProvider</strong>{" "}
          instantiates source, expander, view
          state. <strong>DayView</strong>,
          <strong> WeekView</strong>,
          <strong> MonthView</strong> render
          their respective layouts.
          <strong> EventBlock</strong> renders
          one event with drag/resize
          handles. <strong>CollisionLayouter</strong>{" "}
          computes column allocation for
          overlapping events.
          <strong> ViewToolbar</strong> for
          navigation. <strong>RecurringExpander</strong>{" "}
          expands RRULE to instances.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Events in external store (per
          calendar). View state (current view,
          current date) URL-synced. Drag
          state ephemeral. Selected event for
          editing in component state.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Event shape:{" "}
          <code>{` { id, title, start, end, allDay, rrule?, color?, ... } `}</code>.
          View state:{" "}
          <code>{` { view: "day" | "week" | "month", date } `}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Recurring expansion cached. Events
          rendered only for visible range.
          Memoized event blocks. Drag uses CSS
          transforms.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Familiar GCal-style layouts. Today
          highlighted. Current time line on
          day/week views. Drag preview shows
          target time. Events colored by
          calendar. Multi-day events span
          visually. Click empty slot to
          create.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Time grid as
          <code> role=&quot;grid&quot;</code> for
          day/week (each cell a half-hour
          slot). Events as focusable items
          with title + time announced. Arrow
          keys navigate cells. Enter to
          create or open. Time announcements
          locale- and zone-aware.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Server enforces event access.
          Multi-calendar visibility per user.
          Sensitive event content rendered
          per permission.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for collision layout,
          recurring expansion, time-zone
          math (DST corner cases).
          Integration tests for create,
          drag, resize, recurring edit.
          Time zone scenarios.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          DST spring-forward: a 2:30 AM event
          may not exist; round to next valid.
          DST fall-back: ambiguous wall time;
          use offset to distinguish. Multi-day
          event spanning weekends: render
          across week boundaries. Recurring
          edit &ldquo;this and following&rdquo;:
          server splits the rule. Event ends
          before it starts (data corruption):
          render as zero-duration; surface
          warning. Many overlapping events
          (10+ at the same time): collision
          layout caps columns; overflow
          events show as &ldquo;+N more&rdquo;.
          Time zone change mid-session:
          re-render with new zone.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Pattern reuses for any time-grid UI.
          Date adapter swappable. Views
          customizable.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Date and time via
          <code> Intl.DateTimeFormat</code>.
          Week start per locale. Month names,
          weekday names from Intl. RTL flips
          week direction.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Day/week/month vs single view</h3>
        <p>
          Multi-view matches user expectations
          (GCal). Single view is simpler but
          loses the macro perspective.
          Multi-view is essential for any
          serious calendar.
        </p>

        <h3>Temporal vs date-fns</h3>
        <p>
          Temporal is correct by construction
          for time zones; date-fns is mature
          and lightweight. We use Temporal
          where supported with date-fns
          fallback.
        </p>

        <h3>Server-side vs client-side recurrence
        expansion</h3>
        <p>
          Client-side expansion gives instant
          feedback in views. Server-side keeps
          recurrence logic in one place.
          Hybrid: server provides RRULE; client
          expands for views.
        </p>

        <h3>Optimistic vs confirmed reschedule</h3>
        <p>
          Optimistic feels instant. Confirmed-
          first feels slow. Optimistic with
          rollback.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          AI scheduling suggestions. Free/busy
          across multiple users. Cross-zone
          meeting helper. Smart conflict
          detection. Shared calendar real-time
          edits.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How are recurring events
          expanded?</strong> RRULE library
          expands to concrete instances within
          the visible range. Cached per
          (event, range).
        </p>

        <p>
          <strong>2. How is collision rendering
          done?</strong> Group overlapping
          events; allocate columns within
          each group; render side by side
          with proportional width.
        </p>

        <p>
          <strong>3. How are time zones
          handled?</strong> Store ISO with
          offset; display via{" "}
          <code>Intl</code> in user&rsquo;s
          zone. DST-correct via Temporal.
        </p>

        <p>
          <strong>4. How does drag-reschedule
          work?</strong> Pointer drag with
          optimistic update; ship to server;
          rollback on failure. Cross-day in
          week view.
        </p>

        <p>
          <strong>5. How does recurring edit
          work?</strong> User chooses: this
          instance, this and following, or
          all. Server applies the chosen
          scope.
        </p>

        <p>
          <strong>6. How is the view URL-
          synced?</strong> View + date in URL;
          on mount parse and seed; on
          navigation push URL. Browser back/
          forward works.
        </p>

        <p>
          <strong>7. How is performance
          maintained?</strong> Visible-range
          query plus expansion cache. Memoized
          event blocks. CSS transforms for
          drag.
        </p>

        <p>
          <strong>8. How is this
          accessible?</strong> Grid role on
          day/week; events focusable; keyboard
          navigation; locale-aware time
          announcements.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A calendar/scheduler is{" "}
          <strong>event source + recurring
          expander + multi-view renderer with
          collision layout + drag/resize +
          time-zone-aware display</strong>.
          Temporal handles DST; RRULE library
          handles recurrence; views match
          user expectations from GCal.
          The result is a familiar,
          time-zone-correct, accessible
          scheduling UI.
        </p>
      </section>
    </ArticleLayout>
  );
}

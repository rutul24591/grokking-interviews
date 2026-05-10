"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-history-timeline-ui",
  title: "Design a History Timeline UI",
  description: "Timeline visualization for version history, activity logs, and event sequences.",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "history-timeline-ui",
  wordCount: 4200,
  readingTime: 25,
  lastUpdated: "2026-05-06",
  tags: ["lld", "timeline", "history", "visualization", "ui"],
  relatedTopics: ["activity-feed-system", "version-history-system", "stepper-progress-tracker"],
};

export default function HistoryTimelineUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Applications need to show event sequences chronologically (git commits, document changes, activity logs). Key challenges: organizing events clearly, handling different timescales, and supporting filtering/search. Naive approach: simple list (unorganized). Better: visual timeline with grouping, filtering, and details.
        </p>
        <p><strong>Assumptions:</strong></p>
        <ul className="space-y-2">
          <li>Events have timestamps.</li>
          <li>Event count grows (100s to 1000s).</li>
          <li>Timescale varies (seconds to years).</li>
          <li>Filtering/search required.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Timeline Display:</strong> Chronological event visualization.</li>
          <li><strong>Event Details:</strong> Click to expand event info.</li>
          <li><strong>Grouping:</strong> By day, hour, or custom.</li>
          <li><strong>Filtering:</strong> By type, user, date range.</li>
          <li><strong>Search:</strong> Find events by keyword.</li>
          <li><strong>Scrolling:</strong> Efficient handling of many events.</li>
          <li><strong>Zoom:</strong> Change timescale (day → week → month).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> Virtualization for 1000+ events.</li>
          <li><strong>Load Time:</strong> Initial render under 1s.</li>
          <li><strong>Memory:</strong> Efficient for large histories.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>Fetch events ordered by timestamp. Group by time interval (day/hour). Render grouped timeline. On scroll, lazy-load more events. Virtualize for performance. Support filtering and search.
        </p>
      </section>

      <section>
        <h2>Detailed Design</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/history-timeline-architecture.svg"
          alt="History Timeline UI architecture showing timeline layout with grouped events, data architecture with flat events array and grouped map, cursor pagination, filter system, and virtualization"
          caption="History Timeline: timeline layout with date groups, flat-to-grouped data transformation, cursor pagination, and virtualization for large event sets"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Timeline Structure</h3>
        <p>Organizing events.</p>
        <ul className="space-y-2">
          <li><strong>Events:</strong> Array with id, timestamp, type, author, description.</li>
          <li><strong>Grouping:</strong> Organize by date (today, yesterday, last week, etc).</li>
          <li><strong>Sections:</strong> Group header + events in section.</li>
          <li><strong>Timeline Line:</strong> Vertical line connecting events.</li>
          <li><strong>Event Markers:</strong> Dots on timeline, colored by type.</li>
        </ul>
        <p><strong>Data Structure and Render Optimization:</strong> Store events as a flat array sorted by timestamp (descending for reverse chronological). During grouping, transform into a nested structure mapping group keys to event arrays (e.g., "2026-05-05" maps to event1, event2, event3). This enables efficient rendering: iterate groups, render group header, then render events in group. For large histories (10k+ events), don't load all upfront. Use cursor-based pagination: fetch first 100 events, display. On scroll to bottom, fetch next 100 with cursor pointing to last seen timestamp. Additionally, cache the transformed structure to avoid regrouping on every re-render.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Time Grouping</h3>
        <p>Grouping by interval.</p>
        <ul className="space-y-2">
          <li><strong>Today:</strong> Events from last 24h.</li>
          <li><strong>This Week:</strong> Last 7 days.</li>
          <li><strong>This Month:</strong> Last 30 days.</li>
          <li><strong>Custom:</strong> User-selected date range.</li>
          <li><strong>Grouping Logic:</strong> Calculate interval start, group events by it.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Event Details</h3>
        <p>Showing event information.</p>
        <ul className="space-y-2">
          <li><strong>Expanded View:</strong> Click event to expand details.</li>
          <li><strong>Metadata:</strong> Timestamp, author, action type.</li>
          <li><strong>Changes:</strong> For edits, show what changed (diff).</li>
          <li><strong>Actions:</strong> Revert, view full details, etc.</li>
          <li><strong>Animations:</strong> Smooth expand/collapse.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Filtering & Search</h3>
        <p>Finding events.</p>
        <ul className="space-y-2">
          <li><strong>Filter Types:</strong> By event type (create, edit, delete).</li>
          <li><strong>Filter Users:</strong> By author/user.</li>
          <li><strong>Date Range:</strong> Start and end date picker.</li>
          <li><strong>Keyword Search:</strong> Full-text search in descriptions.</li>
          <li><strong>Combined:</strong> Multiple filters (AND logic).</li>
        </ul>
        <p><strong>Filter Implementation and Client-Side vs Server-Side Processing:</strong> For small event sets (under 1000), filter client-side: fetch all events, filter in memory. For large sets, filter server-side: send filter params to API, server returns filtered results. Client-side filtering is instant but expensive in memory. Server-side filtering reduces bandwidth but adds latency. Hybrid approach: cache recent 1000 events client-side and filter locally. For filters not in cache (e.g., date range beyond cached events), fetch from server. Implement filter persistence: save active filters to URL query parameters so timeline is shareable and bookmarkable.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Virtualization</h3>
        <p>Handling large event counts.</p>
        <ul className="space-y-2">
          <li><strong>Viewport:</strong> Only render visible events.</li>
          <li><strong>Overscan:</strong> Render buffer above/below (smooth scrolling).</li>
          <li><strong>Dynamic Height:</strong> Events may have different heights.</li>
          <li><strong>Lazy Load:</strong> Load more events as user scrolls to end.</li>
          <li><strong>Performance:</strong> Render 1000+ events without lag.</li>
        </ul>
        <p><strong>Virtual Scrolling Implementation and Fixed vs Dynamic Heights:</strong> Use a windowing library (react-window, react-virtualized) to render only visible timeline items. For fixed-height events (all events same height), simple index-based calculation suffices. For variable-height events (some expanded with details, some collapsed), maintain a height cache: after first render of an event, store its height. Use this cache to compute scroll offset accurately. Implement dynamic height measurement: use ResizeObserver to detect height changes (event expansion/collapse) and update cache. The overscan buffer (render 5 items above/below viewport) prevents flashing blank spaces during fast scrolling.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Visual Styling</h3>
        <p>Timeline appearance.</p>
        <ul className="space-y-2">
          <li><strong>Timeline Line:</strong> Vertical line (left or center).</li>
          <li><strong>Event Icons:</strong> Colored dots by type (create=green, edit=blue, delete=red).</li>
          <li><strong>Connector:</strong> Line from dot to event card.</li>
          <li><strong>Cards:</strong> Event details in card/container.</li>
          <li><strong>Spacing:</strong> Consistent padding and margins.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Timescale Zoom</h3>
        <p>Changing time granularity.</p>
        <ul className="space-y-2">
          <li><strong>Zoom Levels:</strong> Hour, day, week, month, year.</li>
          <li><strong>Regrouping:</strong> Re-group events on zoom level change.</li>
          <li><strong>Collapse/Expand:</strong> Show/hide group contents.</li>
          <li><strong>Context:</strong> Show relevant details at each zoom level.</li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Vertical vs Horizontal</h3>
        <p>Vertical: natural scrolling, mobile-friendly. Horizontal: shows time progression, less common.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Details vs Summary</h3>
        <p>Expanded: complete info, takes space. Collapsed: clean, require clicks.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Timeline UIs visualize event sequences chronologically. Essential aspects include timeline structure with grouping, time intervals (today, week, month), event details on expansion, filtering by type/user/date, search capability, virtualization for performance, visual styling with icons and connectors, and zoom for different timescales. Real-world systems use virtualized lists for scale, smooth animations, and color-coded event types.
        </p>
      </section>
    </ArticleLayout>
  );
}

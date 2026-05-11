"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-saved-views-persistence-system",
  title: "Design Saved Views Persistence System",
  description:
    "Production-grade saved views with filter and sort state, URL sync, CRUD management, and cross-device synchronization.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "saved-views-persistence-system",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-06",
  tags: ["lld", "saved-views", "filters", "url-state", "persistence"],
  relatedTopics: ["settings-page-system", "bulk-editing-ui"],
};

export default function SavedViewsPersistenceSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">Power users of data-dense applications (project management tools, CRMs, analytics dashboards, issue trackers) repeatedly apply the same sets of filters, sort orders, and column configurations to navigate to their specific slice of data. Without saved views, every session starts from a default view and the user must re-apply their usual filters manually—tedious and error-prone. With saved views, the user configures their view once ("My Open Tasks, sorted by due date, showing priority and assignee columns") and recalls it with one click thereafter.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The design challenge involves: representing view state completely enough to reproduce the exact view on recall (all active filters, sort direction, visible columns, grouping), synchronizing view state to the URL for shareability (a saved view can be a shareable link), providing CRUD operations for named views, handling view state that becomes invalid (a filter references a status that has been deleted), and deciding the visibility scope of views (private to the user, shared with the team, default for everyone).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial"><strong>Explicit assumptions:</strong> Saved views persist server-side for cross-device consistency. View state is also reflected in the URL for shareability. The URL is the single source of truth for the current view state; saved views are named snapshots of URL state. Views can be private (user-only), shared (visible to team members), or default (the view shown to all team members who haven't created their own). CRUD operations for views are provided in the view selector UI.</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>URL state sync:</strong> All view state (filters, sort, columns, grouping) is encoded in URL query parameters. Sharing the URL shares the exact view.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Save current view:</strong> User names and saves the current URL state as a view. View is persisted server-side.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Load saved view:</strong> Selecting a saved view applies its stored state to the URL, changing the current view without a page reload.</HighlightBlock>
          <li><strong>View management:</strong> Rename, delete, update, and set-as-default operations for saved views via a view manager modal.</li>
          <HighlightBlock as="li" tier="crucial"><strong>Visibility scopes:</strong> Private (only the creating user sees it), Shared (team members can see and load it), Default (replaces the system default for all team members who haven't customized).</HighlightBlock>
          <li><strong>View selector UI:</strong> A dropdown or sidebar section showing saved views organized by scope (My Views, Team Views, Default).</li>
          <HighlightBlock as="li" tier="important"><strong>Invalid state handling:</strong> If a saved view references deleted entities (a filter for status "In Review" which was deleted), the view loads with the invalid filter highlighted and an error message prompting the user to update the view.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>URL state completeness:</strong> The URL must encode the complete view state so that pasting it in a new browser tab reproduces the exact same view.</li>
          <li><strong>Load speed:</strong> Applying a saved view (URL state change) must feel instantaneous; data refetch for the new filter set should complete within 1 second.</li>
          <li><strong>Cross-device:</strong> Saved views are available on any device the user logs in from.</li>
          <li><strong>Conflict handling:</strong> If two users edit the same shared view simultaneously, the last-write-wins (views are not collaborative documents).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">View state lives in the URL as query parameters: ?status=open&assignee=alice,bob&sort=dueDate:asc&columns=title,assignee,dueDate,priority&groupBy=status. This is the single source of truth. The URL is parsed on mount and whenever the URL changes; the data table renders based on the parsed view state. Filters, sort, and column changes update the URL (via history.pushState or Next.js router.replace) which triggers a re-render.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Saving a view captures the current URL's query string and sends it to the server with a name: POST /views {"{"}name: "My Open Tasks", state: "status=open&assignee=alice...", scope: "private"{"}"}.</HighlightBlock>
<HighlightBlock as="p" tier="important">Loading a view applies the stored state string to the URL: router.replace(currentPath + "?" + view.state). The URL update triggers the view state to update, which triggers data refetch. This architecture means saving and loading views are simple URL manipulation operations.</HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/saved-views-persistence-system.svg"
          alt="Saved views persistence system showing URL as source of truth for filter and sort state, view schema with scope levels, CRUD operations, URL state sync with useSearchParams, and cross-device server-side storage"
          caption="Saved views persistence system showing URL as source of truth for filter and sort state, view schema with scope levels, CRUD operations, URL state sync with useSearchParams, and cross-device server-side storage"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Design Saved Views Persistence System</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Look for the &ldquo;control points&rdquo; where correctness is enforced: idempotency keys, monotonic request/version tokens, single-flight coordination, and durable persistence boundaries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In interviews, call out observability and operability: what you log/measure (p95 latency, error rates, retries/queue depth) and how you keep degraded modes user-safe (read-only, queued, or cached fallbacks).
        </HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">URL State Schema</h3>
        <HighlightBlock as="p" tier="crucial">The URL encodes view state as structured query parameters. The schema must be stable (changing the parameter names breaks existing saved views and shared links) and legible (the URL should be readable by a technical user for debugging). Common parameters: filters (multiple key:value pairs, one per active filter), sort (field:direction, e.g., sort=dueDate:asc), columns (comma-separated list of visible column IDs), groupBy (field ID for grouping), page (current page for pagination), and viewId (the ID of the currently active saved view, if any—helps the selector UI highlight the active view).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Multi-value filters (multiple selected values for one filter, e.g., status=open&status=in-progress) use repeated parameters. Some URL parsers handle repeated parameters as arrays natively; others require the application to parse them explicitly. Using a library like URLSearchParams consistently across the application ensures correct multi-value handling. The parser and serializer must be implemented as a pure pair: serialize(parse(urlString)) === urlString for all valid states.</HighlightBlock>
        <p>The viewId parameter in the URL links the current view state to a named saved view. If the user modifies any filter while a saved view is active, the viewId is removed from the URL—the user is now in an "unsaved modifications" state. The view selector shows a "(modified)" indicator and a "Save changes" prompt. This matches the UX pattern from Google Sheets filters or GitHub project views.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">View Data Model</h3>
        <p>Each saved view record contains: viewId (UUID), name (display name), state (the full URL query string for this view, excluding viewId itself), scope (private | shared | default), ownerId (who created it), resourceType (what type of resource this view applies to: issues, orders, contacts), resourceId (optional: a view scoped to a specific board or project, null for global views), organizationId (for multi-tenant isolation), createdAt, updatedAt, and sortOrder (for ordering in the selector UI).</p>
        <HighlightBlock as="p" tier="important">The state field stores the raw query string because it's the most compact representation and the application already knows how to parse it (the same URL parser used for the live view). Storing it as parsed JSON would require a schema for every possible filter type and would need updating whenever new filter types are added. The raw query string is future-proof: new filter types appear in the state without schema changes, and old state strings with new filter types simply produce additional filters the old code doesn't recognize (which can be handled gracefully).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">View Selector UI</h3>
        <p>The view selector is a dropdown or sidebar section, typically above the data table. It shows: an "All Items" default option (the application's unfiltered state), a "My Views" section (private views created by the current user, sorted by most recently used), a "Team Views" section (shared views, sorted by most used by the team), and a "Default" indicator if a default view is set. Clicking a view applies it. An ellipsis menu on each view provides rename, edit, share, set-as-default, and delete options.</p>
        <HighlightBlock as="p" tier="important">The active view is highlighted in the selector. If the current URL state matches a saved view exactly (same query string, excluding viewId), that view is highlighted and viewId is added to the URL. If the state has been modified from the saved view's state, the view is highlighted with a "(modified)" indicator. This matching requires comparing the current URL state against each saved view's stored state—a O(n×m) comparison where n is the number of views and m is the number of URL parameters, but in practice n is small (under 50 views for most users) and m is under 10 parameters, making this comparison negligible.</HighlightBlock>
        <p>The "Save current view" action captures the current URL query string (minus the viewId parameter to avoid self-referential saved views) and opens a form to name the view and select its scope. After saving, the new view appears in the selector and the viewId parameter is added to the URL (the saved view is now the active view).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Invalid State Handling</h3>
        <HighlightBlock as="p" tier="important">View state can become invalid when the data model changes: a filter references a status, user, or project that has been deleted. Loading an invalid view should not silently fail (showing no results because the filter matches nothing) or crash (the filter parser throws because the referenced entity doesn't exist). Instead, the application validates each filter when applying view state: for each filter that references an entity (e.g., assignee=user-123), check if the entity exists in the currently available options. If not, mark the filter as invalid and display an inline error in the filter UI: "Assignee 'Alice (deleted)' is no longer available. [Remove filter]"</HighlightBlock>
        <p>The view is still loaded with valid filters applied and invalid filters surfaced; the user is not blocked from using the view. This graceful degradation is better than either silently applying the view (confusing results) or refusing to load it (forcing the user to delete and recreate the view). The user can remove invalid filters and save the updated view to clean it up.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Default Views and Team-Level Configuration</h3>
        <p>A "default view" is the view shown to users who haven't created their own view. It's set by an admin and applies to all team members who visit the resource for the first time. When an admin sets a default view, the server updates the team's default view record and broadcasts a change notification to active sessions (via WebSocket or on next page load). Users who have already customized their personal default view are not affected—the team default only applies to users without a personal preference.</p>
        <p>The priority order for determining the initial view is: (1) the viewId in the URL (highest priority—explicit navigation); (2) the user's personally saved default view (they set one explicitly); (3) the team's default view (set by admin); (4) the system default (all items, unfiltered). This priority chain means users always have control over their default experience while admins can set sensible defaults for new users.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="crucial">URL state versus localStorage for view state: URL state is shareable, bookmarkable, and doesn't require additional persistence code—it's free from using the router. localStorage is more opaque (the user can't see or share the state easily) and requires explicit serialization and deserialization. URL state is the clear winner for any view state the user might want to share or bookmark. The trade-off is URL length: deeply complex view states with many filters can produce long URLs (over 2000 characters starts to cause issues with some servers and tools). Compression (base64-encoded gzip) of the URL state mitigates length while preserving shareability, at the cost of legibility.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Server-side versus client-side saved views: server-side (the approach described here) provides cross-device consistency and allows team-shared views. Client-side (localStorage) is simpler and works offline but is device-specific and lost when localStorage is cleared. For a feature used by power users who work across devices, server-side is necessary. For a quick-win implementation, localStorage is acceptable as a starting point that can be migrated to server-side without breaking the UX.</HighlightBlock>
        <HighlightBlock as="p" tier="important">View state completeness: should the URL encode all possible view state (pagination, current sort, all filters, column widths) or only the "meaningful" state (filters, sort, column visibility)? Column widths and scroll position are ephemeral preferences that clutter the URL without adding shareability value. The principle: encode state that is meaningful to reproduce the view (filters, sort, columns, grouping), not purely UI state (scroll position, column widths). The latter belongs in localStorage or React state.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Invalid views (filters referencing deleted entities) load with valid filters and surface invalid ones with inline errors and removal options. Team</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">default views are set by admins and apply to users without personal defaults. The architecture is simple because URL manipulation is the core operation: both save and load are transformations on the URL's query string, using the same parser and serializer the application already uses for live filter changes.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

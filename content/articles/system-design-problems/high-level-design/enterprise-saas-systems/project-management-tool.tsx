"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-project-management-tool",
  title: "Design a Project Management Tool (Jira/Asana)",
  description:
    "Architecture for a project management tool: issue tracker with hierarchical tasks (epic > story > task > subtask), multiple view modes (board, list, timeline/Gantt), real-time collaborative editing of issue descriptions, sprint planning with capacity tracking, drag-and-drop prioritization, assignee workload visualization, dependency tracking with cycle detection, @mention and comment threading, webhook integrations for CI/CD status, and offline-capable task updates.",
  category: "high-level-design",
  subcategory: "enterprise-saas-systems",
  slug: "project-management-tool",
  wordCount: 5000,
  readingTime: 31,
  lastUpdated: "2026-05-11",
  tags: ["hld", "project-management", "jira", "asana", "kanban", "gantt", "sprint", "collaboration"],
  relatedTopics: ["crm-dashboard", "workflow-automation-system"],
};

export default function ProjectManagementToolArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A project management tool is a collaborative workspace where teams plan, track, and complete work. Unlike a CRM (where data is primarily read-heavy with occasional updates), a project management tool is continuously written to by multiple concurrent users: team members update issue statuses, add comments, reassign tasks, and adjust priorities simultaneously throughout the workday. The real-time consistency challenge is more acute than in a CRM — when Alice moves a task from "In Progress" to "Done" in the kanban board, Bob (who has the same board open) must see the change immediately without refreshing.</p>
        <p>The multi-view challenge is central to the product: the same underlying task data must be presented coherently across at least three different views — board view (kanban grouped by status), list view (flat or grouped table), and timeline view (Gantt chart with dependencies and date ranges). State changes made in one view (e.g., changing a task's due date in the timeline) must be immediately reflected in all other views. This cross-view consistency with real-time updates is the defining engineering challenge of project management tooling.</p>
        <p><strong>Explicit scope:</strong> Issue hierarchy, board/list/timeline views, real-time updates, sprint planning, and dependency tracking. Not in scope: time tracking, billing integration, or AI-assisted backlog prioritization.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Issue hierarchy:</strong> Four-level hierarchy: Epic &gt; Story &gt; Task &gt; Subtask. Each level has: title, description (rich text), status, assignee, priority, labels, due date, estimate (story points or hours), and custom fields. Parent-child relationships shown as breadcrumb in issue detail.</li>
          <li><strong>Views:</strong> Board view (kanban by status), List view (table with sortable columns, inline edit), Timeline view (Gantt chart showing tasks on a date axis with dependency arrows). View state (filters, grouping, sort) persisted per user per project.</li>
          <li><strong>Real-time collaboration:</strong> Board and list updates from any user visible to all viewers within 2 seconds. Issue detail page shows "X is editing" when another user is typing in the description. Comment threads with @mentions, emoji reactions, and threaded replies.</li>
          <li><strong>Sprint planning:</strong> Create sprint (name, start/end date, goal). Drag unplanned backlog items into sprint. Sprint capacity shows total estimate vs. team member capacity (hours available). Start sprint moves all items to the active sprint board.</li>
          <li><strong>Dependencies:</strong> Link tasks with dependency types: blocks, is blocked by, relates to. Cycle detection prevents A blocks B, B blocks A. Timeline view renders dependency arrows. Blocked items highlighted when their blocker is overdue.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Board update latency:</strong> Status changes visible to all board viewers within 2 seconds via WebSocket or SSE push.</li>
          <li><strong>Timeline render:</strong> Gantt chart with 500 tasks renders within 1 second. Horizontal scroll is smooth at 60 fps.</li>
          <li><strong>Offline tolerance:</strong> Task status updates and comment additions work offline and sync when connectivity is restored (using service worker + IndexedDB queue).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The project management frontend is a React SPA. All project data for the current view is loaded on route entry and cached in a Zustand store. Real-time updates from other users arrive via WebSocket and are merged into the Zustand store — all views read from the same store, so a status change received via WebSocket is immediately reflected in the board, list, and timeline without any view-specific fetching. The Issue Service is the authoritative data source with a CQRS pattern: writes go through the Command Handler (which validates, applies, and publishes IssueUpdated events to Kafka), and reads come from the Query Handler (which reads from the read-optimized PostgreSQL replica with denormalized view models). The real-time push layer subscribes to Kafka events and pushes relevant updates to connected WebSocket clients filtered by project membership.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/enterprise-saas-systems/project-management-tool.svg"
          alt="Project management tool architecture showing issue data model and hierarchy (Epic > Story > Task > Subtask; each: id title description status assignee priority dueDate estimate; parent_id foreign key; path-based breadcrumb), multi-view shared Zustand store (single issues Map store; board view: filter by status group; list view: sortable table; timeline view: Gantt bars; all views read same store → WebSocket update to store → all views re-render automatically), real-time update flow (WebSocket /ws/projects/{id}; on status change: POST /api/issues/{id} {status:done}; Command Handler: validate → write DB → publish Kafka issue.updated; WS push server: subscribe project:{id} → fanout to all connected clients; Zustand store update → all views), sprint planning UI (create sprint {name start end goal}; drag backlog item to sprint → PATCH issue sprintId; capacity bar: sum estimates vs team availability hours; start sprint: POST /api/sprints/{id}/start → all sprint items visible on active board; sprint velocity chart from completed sprints), dependency tracking (POST /api/dependencies {fromId toId type:blocks}; cycle detection: BFS from toId checking if fromId reachable; reject if cycle; timeline: draw arrows between task bars; blocked badge: task.blockedBy any overdue → highlight red), Gantt timeline rendering (horizontal scroll container; date axis top; task bars: x=startDate width=duration; group by assignee or epic; dependency arrows SVG lines between bars; expand/collapse epic rows; today line vertical; resize handles: drag right edge to extend dueDate; drag bar to move date range), offline support (service worker: cache assets; IndexedDB outbox: queue mutations when offline; on reconnect: replay outbox in order; conflict: server last-write-wins with notification), CI/CD webhook integration (GitHub PR status → POST /api/webhooks/github; auto-link PR to issue via branch name; issue shows CI status badge: failing passing; click → GitHub PR link)."
          caption="Shared Zustand store across board/list/timeline views (WebSocket update → all views re-render), CQRS Command Handler (validate → DB → Kafka → WS fanout), sprint planning with capacity bars, dependency BFS cycle detection, SVG Gantt timeline (resize/drag handles), offline IndexedDB outbox with reconnect replay, and GitHub CI status badge integration"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Multi-View Shared State Architecture</h3>
        <p>The key insight for cross-view consistency is that all views (board, list, timeline) are different presentations of the same underlying data — the issues Map in the Zustand store. When the app loads a project, it fetches all issues for the current project context (GET /api/projects/&#123;id&#125;/issues returns all issues with fields needed by all views). These are stored in a Zustand store as a Map&lt;issueId, Issue&gt;. Each view is a pure function of this store: the board view groups issues by status, the list view sorts by priority, the timeline view renders issues as Gantt bars based on dueDate and estimate. When a WebSocket event arrives (e.g., issue X status changed from "In Progress" to "Done"), the Zustand store is updated in place: issues.set(x.id, &#123; ...issues.get(x.id), status: "done" &#125;). All three views re-render automatically via their Zustand subscriptions — no view-specific refresh logic needed.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Gantt Timeline Rendering</h3>
        <p>The Gantt chart renders 500 task bars on a scrollable date axis. A naive DOM-based approach (one div per task bar) creates 500 DOM elements for the bars alone, plus the date axis, dependency arrows, and labels. This is manageable but becomes slow for scroll and zoom operations. The timeline uses a hybrid approach: task rows are virtually windowed (only visible rows are in the DOM), but each visible row&apos;s bar is a positioned div element (not canvas). The date axis (day/week/month headers) is a fixed-position element that scrolls horizontally with the content. Dependency arrows are rendered as SVG &lt;line&gt; or &lt;path&gt; elements overlaid on the task area, SVG handles the arrows cleanly without requiring canvas, and only arrows for visible tasks are rendered. Drag handles on bar edges allow resizing (changing dueDate) and the bar itself is draggable (changing startDate). These interactions use mouse event handlers that compute the new date from the pixel delta and column width (pixels per day), then fire PATCH /api/issues/&#123;id&#125; &#123; dueDate, startDate &#125; optimistically.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Sprint Planning with Capacity Tracking</h3>
        <p>Sprint planning involves two tasks: selecting which issues go into the sprint, and verifying the team has enough capacity to complete them. The sprint planning view shows: a backlog panel (unplanned issues) on the left, the sprint backlog on the right, and a capacity bar per team member at the top. Dragging an issue from backlog to sprint fires PATCH /api/issues/&#123;id&#125; &#123; sprintId: currentSprintId &#125; optimistically. The capacity bar recalculates: for each team member, their total sprint estimate (sum of estimates for issues assigned to them in the sprint) is shown against their sprint capacity (working days × hours per day × velocity factor). The capacity bar colors: green (below 80%), yellow (80–100%), red (over 100%). Over-capacity is a warning, not a hard block, sprint planning decisions are the team&apos;s responsibility. Sprint velocity data (from previous completed sprints) is shown as a reference chart: &quot;Last 5 sprints: 42, 38, 45, 40, 43 story points.&quot; This guides the team&apos;s planning without being prescriptive.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Dependency Tracking with Cycle Detection</h3>
        <p>Dependencies between tasks create a directed graph. Cycle detection is required to prevent invalid dependency chains (A blocks B, B blocks C, C blocks A — which would mean nothing can be done). When a user creates a dependency (POST /api/dependencies &#123; fromId: A, toId: B, type: "blocks" &#125;), the server performs a BFS traversal from B's node in the dependency graph, checking if A is reachable. If A is reachable from B through existing dependencies, adding A blocks B would create a cycle, and the request is rejected with a 422 error explaining the cycle path. The client shows the error: "Cannot add dependency: A → B → C → A would create a circular dependency." The dependency graph is stored in a PostgreSQL adjacency list table (from_id, to_id, type). For BFS performance, the adjacency list is cached in Redis (HSET deps:&#123;issueId&#125; field:toId for each outgoing dependency) and invalidated when dependencies change.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Offline Support with IndexedDB Outbox</h3>
        <p>Field workers (construction project management, event management) often work in areas with intermittent connectivity. The service worker caches the app shell and last-fetched project data in the Cache API. When the user is offline, mutations (status updates, new comments, time logs) are written to an IndexedDB outbox queue: &#123; mutationId, endpoint, method, body, timestamp &#125;. A useNetworkStatus hook monitors navigator.onLine and the service worker's sync events. On reconnect, the outbox is drained in chronological order: each mutation is retried with its original idempotency key. Conflicts (another user changed the same field while offline) are resolved with last-write-wins with a notification: "Bob updated this task's status while you were offline. Your change has been applied." This is acceptable for project management tools because the data is not financial and conflict rates are low.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>WebSocket versus SSE for real-time updates: project management tools need bidirectional communication (the client must send subscription requests — "subscribe me to updates for project X") as well as receive updates. SSE is strictly server-to-client, which means subscriptions would need to be managed via HTTP (POST /api/subscribe &#123; projectId &#125;) separately from the SSE stream. WebSocket handles both in one connection. For this use case, WebSocket is the more natural choice. However, if the product uses HTTP/2, SSE multiplexes efficiently over a single connection, while WebSocket requires a separate TCP connection per tab.</p>
        <p>Real-time granularity: pushing every keystroke to all collaborators (as Google Docs does for collaborative editing) requires operational transformation (OT) or CRDT algorithms to maintain consistency. For issue descriptions in a project management tool, the standard approach is a simpler "typing indicator" (show "Alice is editing" while Alice is typing, without sharing keystrokes) combined with a conflict detection mechanism (if Alice and Bob both edit the same field and their edits conflict, show a merge dialog). Full real-time collaborative editing of issue descriptions (OT/CRDT) is a significant engineering investment — most project management tools implement it for the description field only, not for all fields.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A project management tool (Jira/Asana-like) is built around a shared Zustand store that all views (board, list, timeline) read from — WebSocket updates to the store are automatically reflected in all views without view-specific refresh logic. The CQRS backend validates and publishes IssueUpdated events to Kafka; the WS push server fans these out to connected clients filtered by project membership. The Gantt timeline uses virtual row windowing with positioned div bars and SVG dependency arrows, supporting drag-resize for date changes. Sprint planning shows per-assignee capacity bars (sum of estimates vs. availability) with velocity charts from historical sprints. Dependency creation runs BFS cycle detection on the server (Redis-cached adjacency list) before accepting. Offline support uses service worker + IndexedDB outbox for queued mutations, replayed on reconnect with idempotency keys. The core design principle: all views are projections of a single shared data model — this normalizes cross-view consistency from a hard real-time synchronization problem into a simple Zustand store subscription.</p>
      </section>
    </ArticleLayout>
  );
}

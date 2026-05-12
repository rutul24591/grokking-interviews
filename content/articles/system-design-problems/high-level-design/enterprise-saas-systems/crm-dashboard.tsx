"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-crm-dashboard",
  title: "Design a CRM Dashboard (Salesforce-like)",
  description:
    "Architecture for a CRM dashboard: contact and account record pages with inline editing, pipeline kanban board with drag-and-drop stage updates, activity timeline with multi-entity feed, global search with entity-type filtering, report builder with saved views, real-time collaboration indicators (who else is viewing this record), bulk record operations, custom field definitions, role-based field visibility, and webhook-driven sync with external tools.",
  category: "high-level-design",
  subcategory: "enterprise-saas-systems",
  slug: "crm-dashboard",
  wordCount: 5100,
  readingTime: 31,
  lastUpdated: "2026-05-11",
  tags: ["hld", "crm", "dashboard", "enterprise", "salesforce", "pipeline", "inline-edit", "search"],
  relatedTopics: ["project-management-tool", "rbac-dashboard"],
};

export default function CRMDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A CRM (Customer Relationship Management) dashboard is the operational hub for sales and customer success teams. It aggregates data from multiple sources (email, phone calls, meetings, product usage, support tickets) into a unified view of each customer relationship. The defining characteristic of CRM UI is density: a contact record page may show 50+ fields, an activity timeline with hundreds of entries, related accounts, opportunities, and tasks, all while remaining navigable and actionable. The UI must present this density without overwhelming the user, using progressive disclosure (collapsed sections, filtered views) to surface the most relevant information.</p>
        <p>The pipeline view (kanban board showing deals by stage) is the most performance-sensitive surface: it may show 200+ deal cards across 6–8 stages, each card requiring data from multiple entities (deal, contact, account, assigned rep). Drag-and-drop stage updates must be atomic and reflected for all users viewing the same pipeline simultaneously. The activity timeline (a reverse-chronological feed of emails sent, calls logged, meetings held, notes added) is an append-heavy workload that must paginate efficiently without losing the user's position.</p>
        <p><strong>Explicit scope:</strong> Contact/account record pages, pipeline kanban, activity timeline, global search, and bulk operations. Not in scope: email sending infrastructure, telephony integration, or AI-assisted content generation.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Record pages:</strong> Contact, Company, and Deal records with inline editing (click a field to edit, blur to save). Custom fields defined by org admins. Field-level visibility controlled by role (e.g., deal amount hidden from SDRs). Related records listed (e.g., all deals for a company, all contacts at a company).</li>
          <li><strong>Pipeline kanban:</strong> Deals grouped by stage in horizontally scrollable columns. Drag-and-drop to move deals between stages. Stage change triggers: update deal.stage, log activity event, trigger automation rules. Filters (by owner, deal size, close date) applied client-side for speed.</li>
          <li><strong>Activity timeline:</strong> Unified chronological feed of all touchpoints for a record: emails, calls, meetings, notes, status changes. Logged manually (add note, log call) or synced automatically (Gmail integration, Zoom integration). Paginated with virtual scroll.</li>
          <li><strong>Global search:</strong> Unified search across contacts, companies, deals, activities. Fuzzy match on name, email, company name. Results grouped by entity type. Recent searches and pinned records for fast access.</li>
          <li><strong>Bulk operations:</strong> Select multiple records → apply action: assign owner, add tag, update field, export to CSV, add to sequence. Bulk operations run asynchronously with progress indicator.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Record load time:</strong> Contact/Deal record page renders within 800ms including all related records and recent activity.</li>
          <li><strong>Pipeline load:</strong> Pipeline kanban with 200 deals loads within 1.5 seconds. Drag-and-drop stage update reflected within 200ms (optimistic).</li>
          <li><strong>Search latency:</strong> Search results appear within 300ms of keystroke (debounced 150ms). Fuzzy match on 1M+ contact records.</li>
          <li><strong>Collaboration:</strong> &gt;1 user editing the same record simultaneously must not cause silent data loss (last-write-wins with conflict notification).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The CRM frontend is a Next.js SPA with server-side rendering for record pages (enabling SEO for public-facing contact pages and fast initial load). The Record Service provides a single enriched endpoint per entity type (GET /api/contacts/&#123;id&#125;/full returns contact + related companies + recent deals + last 10 activities in one response). The Pipeline Service serves the kanban data as a single batch query (all deals in the pipeline with minimal fields: id, title, stage, owner, value, closeDate). Search is powered by Elasticsearch with fuzzy matching and faceted results, queried via the Search Service. Collaboration indicators (who else is viewing this record) use SSE: when a user opens a record, they subscribe to a presence channel; other users viewing the same record appear as avatar chips in the record header.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/enterprise-saas-systems/crm-dashboard.svg"
          alt="CRM dashboard architecture showing record page rendering (SSR GET /contacts/{id}/full → enriched response: contact fields + related companies + recent deals + last 10 activities; inline edit: click field → input; blur → PATCH /api/contacts/{id} {fieldName value}; optimistic update local state; server confirms; conflict: 409 → toast merge dialog), pipeline kanban (GET /api/pipeline → all deals minimal fields {id title stage owner value closeDate}; client groups by stage; virtual scroll within columns for large pipelines; drag: onDragEnd → optimistic move card → POST /api/deals/{id}/stage {newStage}; Kafka deal.stage_changed → automations; all viewers SSE updated within 2s), activity timeline (GET /api/contacts/{id}/activities?cursor=null limit=20; append-only chronological log; virtual scroll; log types: email call meeting note task status_change; POST /api/activities: add manual entry; Gmail/Zoom sync via webhook → write activity → SSE push to open records), global search (keystroke → debounce 150ms → POST /api/search {q entity_types filters}; Elasticsearch fuzzy: contacts.name companies.name deals.title; results grouped: Contacts(3) Companies(1) Deals(5); recent searches localStorage; cmd+K shortcut), bulk operations (checkbox select → bulk action bar: assign reassign tag export; POST /api/bulk {action recordIds payload}; async job → progress bar SSE; export: CSV stream via chunked response), role-based field visibility (field config: {fieldId roles:[admin sales]}; UI: filter fields by current user role; server: validate on write; custom fields: org admin defines {fieldId label type options required}; stored in field_definitions table), collaboration presence (SSE /api/presence/records/{id}/stream; on open: SADD viewers:{recordId} userId TTL 60s; heartbeat 30s; other viewers: avatar chips header; on edit: lock indicator 'Being edited by Alice')."
          caption="Record SSR with enriched join response, inline edit (PATCH + optimistic), pipeline kanban (batch load, drag-to-stage with Kafka automation trigger), activity timeline (cursor-paginated virtual scroll), global Elasticsearch search (debounced 150ms, entity-grouped), bulk async operations with SSE progress, role-based field visibility, and SSE presence indicators"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Record Page Inline Editing</h3>
        <p>CRM records have many fields (contact records typically have 20–50 fields: name, email, phone, title, company, location, custom fields). Inline editing — click a field to edit it in place, blur or press Enter to save — is the standard UX pattern for CRM tools because it minimizes context switching. Implementation: each field renders as a display component (text, badge, date) by default. On click, the field enters edit mode: the display is replaced with an appropriate input (text input, dropdown, date picker). On blur, an optimistic update is applied (the displayed value changes immediately) and PATCH /api/contacts/&#123;id&#125; &#123; fieldName, value &#125; is fired. If the server returns a conflict (409 — another user changed the field since the current user loaded the page), a merge dialog appears showing the current user's pending value and the other user's committed value, asking which to keep. This prevents silent last-write-wins data loss on concurrent edits.</p>
        <p>Custom fields are defined by org admins in the field_definitions table (orgId, fieldId, label, fieldType, options, required). The frontend fetches the field definition schema for each entity type on session init and caches it in Zustand. The record form renders fields dynamically based on the schema. New custom fields defined by admins appear in all users' record pages after the next session init (or immediately if the schema is invalidated via a server-sent event on field_definitions.updated).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Pipeline Kanban Performance</h3>
        <p>A pipeline with 200 deals across 8 stages has 200 deal cards to render. Each card needs: deal title, owner avatar, deal value, close date, and a health indicator. Loading all deal data in the full record format (with all custom fields, all related records) would result in a multi-second load. The pipeline endpoint is optimized to return only the fields needed for card rendering: GET /api/pipeline returns an array of minimal deal objects &#123; id, title, stage, ownerId, ownerName, ownerAvatar, value, closeDate, healthScore &#125;. This typically fits in &lt;50 KB of JSON for 200 deals. The client groups deals by stage into a Map&lt;stage, Deal[]&gt; and renders the kanban columns. Filters (by owner, value range, close date range) are applied client-side on this in-memory map — no additional API calls needed, and filter application is instant.</p>
        <p>Within each column, if a stage has &gt;20 deals, virtual scrolling is applied (only the visible cards within the column are in the DOM). The column height is fixed; cards outside the viewport are unmounted and replaced with height-preserving spacers. Drag-and-drop is implemented with the react-dnd library or a native HTML5 DnD implementation. On drag end, an optimistic move is applied immediately (the card appears in the new stage column), and POST /api/deals/&#123;id&#125;/stage &#123; newStage &#125; is fired. If the move fails (e.g., stage transition not allowed by the workflow rules), the card snaps back to its original stage and an error toast explains why.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Activity Timeline with Virtual Scroll</h3>
        <p>The activity timeline is an append-heavy workload: a high-value enterprise contact may have thousands of activity entries over years. The timeline must paginate efficiently without losing the user's reading position. Implementation: the timeline loads the first 20 activities (most recent first) on record page load. Virtual scrolling is applied: only the visible entries are in the DOM. As the user scrolls down (towards older entries), the next page is fetched and appended. As the user scrolls up past fetched content, older entries already in the items array are re-rendered from the virtual window — no re-fetching needed. Each activity entry shows: type icon, actor, timestamp (relative: "2 hours ago"), and a summary. Clicking an entry expands it to show full detail (email body, call transcript, note content). Activity log entries are immutable (they are historical records); only notes and tasks can be edited after creation.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Global Search with Fuzzy Matching</h3>
        <p>Global search (triggered by ⌘K or clicking the search bar) must match across 1M+ contact records with fuzzy matching (typo tolerance: "Jhon Smith" should match "John Smith"). Elasticsearch handles the fuzzy matching via its fuzziness parameter (AUTO: uses edit distance based on term length). The search request: POST /api/search &#123; q: "jhon smi", entityTypes: ["contact", "company", "deal"], limit: 5 per type &#125;. Results are returned grouped by entity type. The search results panel renders a grouped list: Contacts (3), Companies (1), Deals (5), each with a click-through to the record page. Keyboard navigation within the search panel uses the combobox pattern (arrow keys, Enter to select). Recent searches are stored in localStorage (last 10 queries) and shown below the search input before typing begins. Pinned records (starred by the user) appear above recent searches for instant access to frequently visited records.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bulk Operations with Async Processing</h3>
        <p>Bulk operations on 1000+ records (e.g., "reassign all deals owned by Alice to Bob after she leaves the company") are too slow to run synchronously in an HTTP request. The bulk operation API is async: POST /api/bulk &#123; action: "reassign_owner", recordIds: [...], payload: &#123; newOwnerId: bobId &#125; &#125; returns immediately with &#123; jobId: "job_123" &#125;. The UI subscribes to SSE endpoint /api/bulk/jobs/job_123/stream for progress updates. The server processes records in batches of 100, publishing progress events: &#123; processed: 150, total: 1000, status: "running" &#125;. The UI shows a progress bar. On completion, a success notification appears: "1,000 deals reassigned to Bob." Failed records (if any) are listed in a downloadable error report. The SSE connection is maintained for up to 30 minutes (the maximum bulk job duration); if the user navigates away, the job continues running and the result is surfaced as an in-app notification on return.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Server-side rendering versus client-side rendering for CRM record pages: SSR provides faster initial paint (the record content is in the HTML, not fetched after hydration) and better performance for users who navigate directly to record URLs (e.g., from email links or bookmarks). However, CRM record pages require user authentication and are user-specific (role-based field visibility, personalized activity feeds), making CDN caching impossible. SSR with auth-aware data fetching (on the Next.js server, using the user's session token) is the right approach — the SSR render happens on the application server (not cached by CDN), fetching all data in parallel and returning a fully-rendered page in 200–400ms.</p>
        <p>Optimistic updates versus pessimistic updates for field edits: optimistic updates (show the new value immediately, confirm in background) make inline editing feel instant but require rollback logic if the save fails. In a CRM context, field saves rarely fail (the data is well-structured and the server is reliable), so the optimistic approach is appropriate. The exception is formula fields (fields whose value is computed from other fields by the server) — these must update pessimistically because the client cannot compute the server-side formula result. Formula fields show a spinner on save and update only when the server response returns the computed value.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A CRM dashboard is built around three core surfaces: record pages (SSR-rendered, inline edit with optimistic PATCH, conflict detection, custom field schema driven), pipeline kanban (minimal-field batch load, client-side filtering, drag-to-stage with Kafka automation trigger, virtual scroll within columns), and activity timeline (cursor-paginated, virtual scroll, append-only entries). Global search uses Elasticsearch fuzzy matching (debounced 150ms, grouped by entity type) with localStorage recent searches. Bulk operations run asynchronously with SSE progress tracking. Role-based field visibility is enforced on both client (field rendering) and server (write validation). Collaboration presence uses SSE (SADD to Redis set on record open, heartbeat TTL, SSE-pushed avatar chips). The defining design constraint: CRM users are power users who spend 6–8 hours per day in the tool — every 100ms of unnecessary latency compounds into significant lost productivity, making performance optimization (minimal API payload for pipeline, SSR for records, client-side filter application) a first-class requirement rather than a nice-to-have.</p>
      </section>
    </ArticleLayout>
  );
}

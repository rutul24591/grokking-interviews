"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-bulk-editing-ui",
  title: "Design Bulk Editing UI",
  description:
    "Production-grade bulk editing with selection management, batch operations, progress tracking, and rollback.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "bulk-editing-ui",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "bulk-editing", "batch-operations", "ui-patterns", "state-management"],
  relatedTopics: ["export-system", "audit-log-viewer-ui"],
};

export default function BulkEditingUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">Bulk editing allows users to select multiple items from a list and apply a single operation to all of them: archive 50 emails, change the status of 200 orders to "shipped," delete 30 outdated records, or reassign 100 tasks to a different team member. Without bulk operations, users must repeat the same action N times, which is both tedious and error-prone (they may miss items or accidentally apply the action to the wrong records).</HighlightBlock>
        <HighlightBlock as="p" tier="important">The UI challenge is selection state management at scale. A list with 10,000 items cannot have 10,000 checkboxes in memory simultaneously (virtual scrolling means many rows are unmounted). "Select all" on a paginated list must select all 10,000 records, not just the 50 currently visible. Range selection (click a checkbox, shift-click another) must work correctly across page boundaries. Partial selection state (some but not all items selected) must be reflected in the header checkbox ("indeterminate" state). After the operation, items may disappear from the list (archived items hidden), requiring list re-render without losing the user's context.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial"><strong>Explicit assumptions:</strong> Items are displayed in a virtualized list with cursor pagination. Selection is managed client-side as a Set of IDs. "Select all" uses a virtual select-all flag plus an excluded IDs set, not by loading all IDs into memory. Bulk operations are async (server processes in a background job for large batches). Undo is supported for a 5-second window after the operation completes.</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Individual selection:</strong> Click a checkbox on any row to add/remove it from the selection set.</HighlightBlock>
          <li><strong>Range selection:</strong> Shift-click a second checkbox to select all rows between the first and second click.</li>
          <li><strong>Select all on page:</strong> Check the header checkbox to select all currently visible rows.</li>
          <li><strong>Select all across pages:</strong> After selecting all on page, offer "Select all N items" to select all matching items across the entire dataset.</li>
          <li><strong>Available bulk actions:</strong> A context action bar appears when one or more items are selected, showing available operations (archive, delete, change status, assign, export).</li>
          <li><strong>Progress feedback:</strong> For large batches, show a progress indicator while the server processes items.</li>
          <HighlightBlock as="li" tier="important"><strong>Partial success handling:</strong> When some items succeed and others fail, show a summary and allow retry of failed items.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Undo:</strong> Show a toast with an "Undo" action for 5 seconds after a destructive bulk operation. Undo reverses the operation for all affected items.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Selection performance:</strong> Selecting/deselecting individual items must be O(1). Toggling "select all" must not require iterating all items client-side.</HighlightBlock>
          <HighlightBlock as="li" tier="crucial"><strong>Memory efficiency:</strong> Selection state for 100,000 items must not require 100,000 objects in memory; use the virtual select-all pattern.</HighlightBlock>
          <li><strong>Progress accuracy:</strong> Progress indicator reflects actual server processing state, not a fake animation.</li>
          <li><strong>Undo reliability:</strong> Undo must be server-side (not just a local state revert); if the page refreshes during the undo window, undo must still work.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Selection state uses a two-mode model: "explicit selection" (a Set of selected IDs, used when the user picks individual items) and "virtual select-all" (a flag indicating all items are selected plus a Set of explicitly excluded IDs, used when the user clicks "Select all N items"). This two-mode approach allows "select all 100,000 items" to be represented as a single boolean plus a small exclusion set—rather than 100,000 IDs in memory.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The context action bar appears (slides up from the bottom or replaces the header) when the selection count is greater than zero. It shows the count of selected items and the available bulk actions for the current content type.</HighlightBlock>
<HighlightBlock as="p" tier="important">On action confirmation, the application sends the action to the server with either the explicit list of IDs or the "select all with exclusions" criteria. The server processes items asynchronously and returns a jobId. The client polls the jobId endpoint for progress until the job completes.</HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/bulk-editing-ui.svg"
          alt="Bulk editing UI showing selection model with Set and virtual select-all, async batch job processing with progress polling, partial success summary, and undo toast with server-side reversal"
          caption="Bulk editing UI showing selection model with Set and virtual select-all, async batch job processing with progress polling, partial success summary, and undo toast with server-side reversal"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Design Bulk Editing UI</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
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

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Selection State Management</h3>
        <HighlightBlock as="p" tier="crucial">The selection state is a union type with two modes. Explicit selection mode: {"{"}mode: "explicit", selectedIds: Set&lt;string&gt;{"}" }. Virtual select-all mode: {"{"}mode: "all", excludedIds: Set&lt;string&gt;{"}"} (the total count is fetched from the server or known from the pagination response). The selection count displayed in the action bar is: explicit mode → selectedIds.size; all mode → totalCount - excludedIds.size.</HighlightBlock>
        <p>Transitioning between modes: clicking individual checkboxes stays in explicit mode. Clicking the "Select all on page" header checkbox selects all visible IDs in explicit mode. After that, showing "Select all 10,000 items" link—clicking it transitions to all mode with an empty excludedIds set. Unchecking a row in all mode adds its ID to excludedIds (rather than maintaining a full selected set). Deselecting enough rows that only a small number remain selected (e.g., fewer than the page size) transitions back to explicit mode to avoid the overhead of tracking many exclusions.</p>
        <HighlightBlock as="p" tier="important">Range selection is implemented by tracking the "anchor" item (the first item checked without shift) and applying the range on shift-click. The range covers all items between anchor and target in the current sorted order. For virtual lists where items between anchor and target are not in the DOM, the range must be computed from the server-side sorted order (either by fetching the IDs in the range or by using the item's sort key to determine range membership). The simpler approach: range selection only works within the currently loaded items; items not yet loaded are not selected by range. This is documented to the user ("Range selection applies to loaded items only").</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Context Action Bar</h3>
        <p>The action bar appears when selection count is greater than zero. It should not overlap with list content; common patterns are a fixed bottom bar (like Gmail's bottom toolbar when emails are selected) or replacing the list header with the action bar. The action bar contains: the selected count ("47 items selected"), action buttons (Archive, Delete, Change Status, Export), and a "Deselect all" option.</p>
        <p>Destructive actions (Delete, Archive) require confirmation. The confirmation dialog should state the count and action clearly: "Permanently delete 47 items? This cannot be undone." For actions that support undo (soft delete, status change), skip the confirmation dialog—the undo toast is the correction mechanism, which is less disruptive than a confirmation dialog and still provides recoverability.</p>
        <p>Action availability varies by selection composition. If some selected items are in state A and others in state B, certain actions may not apply uniformly. The system should indicate this: "Archive is not available for 3 selected items (already archived). Archive the remaining 44?" Or: only enable actions that are valid for all selected items, graying out actions that are blocked for any item in the selection. The former (partial application with notification) is better UX for heterogeneous selections; the latter is simpler to implement.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Async Batch Processing and Progress</h3>
        <HighlightBlock as="p" tier="important">For batches above a threshold (e.g., 100 items), the server processes asynchronously: it immediately returns a jobId and a 202 Accepted status, then processes items in the background. The client polls GET /jobs/:jobId every 2 seconds for status. The job response contains: status (pending, processing, completed, failed), processedCount, totalCount, failedCount, and an optional failedItems array (for small failure sets) or a failedItemsExportUrl (for large failure sets).</HighlightBlock>
        <p>The progress UI shows a progress bar with processedCount/totalCount and a percentage label. When the job completes, the progress bar is replaced with a summary: "47 items archived successfully. 3 items failed (permissions error)." Failed items are listed with their IDs and error reasons; the user can click "Retry failed items" to select only the failed items and re-apply the action (which may succeed after fixing the underlying issue, e.g., correcting permissions).</p>
        <p>For small batches (under 100 items), the server may process synchronously and return the full result in the initial response (202 → 200 with results). The client should handle both patterns: if the initial response is 200 with results, display the summary immediately. If 202, begin polling. This avoids unnecessary polling for small batches that complete quickly.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Undo Implementation</h3>
        <p>Undo for bulk operations requires server-side state reversal, not just a local state update. When the server confirms a bulk archive operation, it returns a batchId. The undo toast shows for 5 seconds: "47 items archived. Undo." Clicking Undo sends DELETE /batches/:batchId to the server, which reverses the operation (sets all items in that batch back to their pre-operation state). The batchId is stored server-side alongside the batch's before-state (the previous status of each affected item), enabling precise reversal.</p>
        <HighlightBlock as="p" tier="important">After 5 seconds without clicking Undo, the toast fades and the server may garbage-collect the before-state snapshot (though it's good practice to keep it for 24 hours for recovery purposes). If the user navigates away during the 5-second window, the batchId should be stored in sessionStorage so the undo action is still available on the next page (or on return to the same page). The undo action should be idempotent—calling it twice for the same batchId should have no effect on the second call.</HighlightBlock>
        <p>For operations that genuinely cannot be undone (hard delete from a system with no recycle bin, or operations that trigger external side effects like sending emails), the undo pattern cannot be used. These require an explicit confirmation dialog before proceeding, and the action bar should indicate "This action cannot be undone" in the confirmation step.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">List State After Operation</h3>
        <p>After a bulk operation completes, the list must be updated to reflect the changes. Items that no longer match the current view's filters (e.g., archived items in a "active items" view) should be removed from the list. This requires either: (1) removing the affected IDs from the local list state immediately (optimistic, no refetch needed); or (2) triggering a full list refetch (accurate but slower and loses scroll position).</p>
        <HighlightBlock as="p" tier="important">Optimistic removal is preferred: after the operation confirms, remove the processed IDs from the local list state. The virtual scroll re-renders with the items removed and adjusts scroll position. The selection set is cleared. If the operation partially failed, only the successfully processed IDs are removed; failed items remain in the list with an error indicator. If the user undoes the operation, the removed items are re-inserted at their original positions (this is the hardest part of undo—restoring scroll position and list order after removal requires tracking the original positions or triggering a refetch).</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="crucial">Virtual select-all versus loading all IDs: the virtual select-all (all mode with exclusions) avoids loading all IDs into memory but adds complexity to the action request format (the server must accept criteria, not just an ID list). For applications with datasets in the thousands (not millions), loading all IDs into memory (a simple string array of 10,000 UUIDs is about 400KB) is simpler and avoids the complexity. For truly large datasets, the virtual pattern is necessary.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Synchronous versus asynchronous batch processing: synchronous processing (the client waits for the response) is simpler for small batches and avoids polling complexity. Asynchronous processing (202 + jobId + polling) is necessary for large batches to avoid timeouts and gives the user a progress view. The threshold between synchronous and async should be set conservatively (100 items or 5 seconds estimated processing time) because synchronous requests that timeout are worse UX than polling.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Undo window duration: 5 seconds is the standard toast duration. Extending undo to 30 seconds or more gives users more recovery time but increases the server burden (storing before-state snapshots longer). The undo window should match the stakes: 5 seconds for routine operations, longer windows (or no undo, just a confirmation dialog) for high-stakes operations.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Partial failures are surfaced with per-item error details and a "retry failed" option. Undo uses server-side before-state snapshots tied to batchIds,</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">displayed as a 5-second dismissible toast. List state is updated optimistically by removing processed IDs after the operation completes. The defining complexity is the selection state model and its interaction with virtual scrolling—ensuring checkbox state is correct even for rows not currently in the DOM.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

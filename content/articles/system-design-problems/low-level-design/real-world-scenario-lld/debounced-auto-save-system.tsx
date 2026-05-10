"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-debounced-auto-save-system",
  title: "Design Debounced Auto-Save System",
  description:
    "Production-grade auto-save with debouncing, optimistic updates, conflict resolution, and user feedback.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "debounced-auto-save-system",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "auto-save", "debouncing", "persistence", "conflict-resolution"],
  relatedTopics: ["offline-form-sync-system", "version-history-system"],
};

export default function DebouncedAutoSaveSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Auto-save is the feature that eliminates the anxiety of document editing: the user types, the system silently persists, and no content is ever lost to a browser crash or network blip. Implementing it incorrectly introduces its own problems: saving on every keystroke hammers the server (100 requests per second from an active typist), saving on an interval fires regardless of whether anything changed (wasted requests), and saving too infrequently creates windows where content loss is still possible.</p>
        <p>Beyond the basic debouncing problem, a production auto-save system must handle: concurrent editing from multiple devices (user switches from phone to desktop mid-document; both have unsaved changes), save failures with retry and user notification, a "saving" / "saved" / "error" status indicator that accurately reflects the persistence state, and an emergency flush on page unload (save immediately when the user closes the tab, without waiting for the debounce timer).</p>
        <p><strong>Explicit assumptions:</strong> The document is a single structured entity (a JSON document, rich text content, or a form). Edits are captured as full document snapshots (not incremental diffs—those require a more complex CRDT or OT system). Auto-save targets under 2 seconds of data loss risk; the debounce timer is 2 seconds of idle. Conflict detection uses optimistic concurrency control (OCC) with the document's server-side version as the conflict key.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Debounced save:</strong> Trigger a save 2 seconds after the user stops typing. Do not save on every keystroke.</li>
          <li><strong>Maximum save interval:</strong> Even if the user never pauses, force a save every 30 seconds to bound data loss risk.</li>
          <li><strong>Save-on-unload:</strong> Flush pending changes synchronously when the user closes or navigates away from the page.</li>
          <li><strong>Status indicator:</strong> Show "Unsaved changes," "Saving...," "All changes saved," or "Save failed. Retrying..." in real-time.</li>
          <li><strong>Conflict detection:</strong> If the document was edited on another device since the last successful save, detect the conflict and present a resolution UI rather than silently overwriting.</li>
          <li><strong>Retry on failure:</strong> On save failure (network error, server error), retry with exponential backoff. Notify the user if retries are exhausted.</li>
          <li><strong>Local draft:</strong> Store unsaved changes in localStorage as a draft; restore on next page load if a server save never completed.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Data loss risk:</strong> Maximum 2 seconds of edits can be lost (bounded by debounce + max interval strategy).</li>
          <li><strong>Server load:</strong> Save requests bounded to at most 1 per 2 seconds per document per user, regardless of typing speed.</li>
          <li><strong>UI responsiveness:</strong> Auto-save must never block the editing experience; all save operations run asynchronously.</li>
          <li><strong>Unload reliability:</strong> Page close must attempt a synchronous save; at minimum, commit to localStorage before the page terminates.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The auto-save system is a state machine layered on top of the document editor. The states are: idle (no unsaved changes), unsaved (changes pending, debounce timer running), saving (server request in flight), saved (server confirmed), and error (save failed, retry scheduled). Transitions are driven by user edits (idle → unsaved), debounce timer fire (unsaved → saving), server success (saving → saved), and server failure (saving → error).</p>
        <p>The debounce timer uses a trailing approach: every edit resets the timer to T+2s. If edits are continuous, the timer keeps resetting. After 2 seconds of idle, the timer fires and the save begins. A parallel maximum-interval timer fires every 30 seconds unconditionally, flushing any pending changes regardless of typing state. This combination provides responsive saves (within 2 seconds of the last edit in a pause) and bounded worst-case loss (30 seconds of continuous typing).</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/debounced-auto-save-system.svg"
          alt="Debounced auto-save system showing state machine transitions, 2s trailing debounce combined with 30s max interval, beforeunload flush, optimistic concurrency control conflict detection, and retry with exponential backoff"
          caption="Debounced auto-save system showing state machine transitions, 2s trailing debounce combined with 30s max interval, beforeunload flush, optimistic concurrency control conflict detection, and retry with exponential backoff"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Debounce and Maximum Interval Strategy</h3>
        <p>A trailing debounce (setTimeout that is cleared and reset on every input event) ensures saves happen after typing pauses. The debounce function should be created once on component mount and cleaned up on unmount—creating a new debounce on every render would not work because each new debounce function has its own timer state. The debounce function captures the latest document state via a ref (not a closure over state, which would capture the state at the time of debounce creation). On fire, it reads the current document from the ref and initiates the save.</p>
        <p>The maximum interval timer is a setInterval that runs independently of the debounce. Every 30 seconds, if there are unsaved changes (tracked in an isUnsaved ref), it calls the same save function. If no changes are pending (the debounce already fired a save within the window), the interval no-ops. Both timers must be cleared in the useEffect cleanup function to prevent memory leaks and spurious saves after the component unmounts.</p>
        <p>The save function is idempotent: calling it multiple times with the same document state should produce at most one server request. This is enforced by checking whether a save is already in flight (isSaving flag) and by comparing the current document's content hash to the last-saved hash—if they're identical, the save is skipped. This prevents the maximum-interval timer from triggering a redundant save when the debounce has already saved the current state.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Save Status Indicator</h3>
        <p>The status indicator is driven directly by the auto-save state machine. Transitions: user types → state = unsaved → show "Unsaved changes" with a dot indicator. Debounce fires → state = saving → show "Saving..." with a spinner. Server returns 200 → state = saved → show "All changes saved" with a checkmark (fade out after 3 seconds). Server returns error → state = error → show "Save failed. Retrying in 5s..." with a warning icon and retry countdown.</p>
        <p>The "saved" state should have a brief display window (3 seconds) before fading back to idle (no indicator). Showing "saved" persistently is noisy. However, the transition must never go from "saved" to nothing while the user has unsaved changes—the state must correctly reflect that edits after the last save are unsaved. This is why the state machine is essential: a simpler boolean "isSaved" is insufficient because it doesn't capture the transitions correctly.</p>
        <p>Accessibility: the status indicator should be an ARIA live region (aria-live="polite") so screen reader users hear state changes without focusing the indicator. The text content is the primary indicator—icons and colors are supplementary. "Save failed" should describe the recovery action: "Save failed. Changes stored locally. Retrying automatically." This tells the user their work is not lost even if the server save failed.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conflict Detection via Optimistic Concurrency Control</h3>
        <p>When the user saves, the request includes the If-Unmodified-Since header set to the server-side updatedAt timestamp of the document as it was when the client last loaded it. The server checks: if the document's current updatedAt matches the header value, no conflict—apply the save and update updatedAt. If the document's current updatedAt is newer than the header value, another client saved a newer version—return HTTP 412 Precondition Failed.</p>
        <p>On receiving a 412, the client does not silently overwrite. It fetches the server's current version, compares it to the user's local version, and presents a conflict resolution UI: side-by-side diff (or a simpler "Your version" / "Server version" toggle) with options to keep the local version, keep the server version, or attempt a manual merge. This is the same conflict resolution pattern used by Google Docs (though Google uses OT for continuous resolution without user intervention; OCC requires user intervention for conflicts).</p>
        <p>Most auto-save conflicts arise from multi-device editing. The conflict resolution UI should contextualize this: "Your changes on another device were saved. Do you want to use that version or continue with your current edits?" rather than technical language about versions and conflicts.</p>

	        <h3 className="mt-6 mb-3 text-lg font-semibuild">Local Draft as Safety Net</h3>
	        <p>Before sending each save request, the client writes the current document state to localStorage under a deterministic key that includes the document identifier and the user identifier. This local draft is the last-resort fallback: if the server save fails and retries are exhausted, the user's work is still in localStorage. If the browser crashes between debounce fires, the localStorage draft captures the last checkpoint.</p>
        <p>On page load, if a localStorage draft exists for the current document and its timestamp is newer than the server version, the client shows a restoration prompt: "You have unsaved changes from [timestamp]. Restore them?" Accepting restores the draft into the editor; declining clears the draft and loads the server version. The draft should include a version hash of the server document at the time of the draft (to detect stale drafts that are older than the server version, which should be automatically discarded without prompting).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Save-on-Unload</h3>
        <p>The beforeunload event fires when the user closes the tab or navigates away. By this time, the debounce timer has been cleared (the component may be unmounting). Any pending unsaved changes must be saved immediately. The beforeunload handler has two options: synchronous XMLHttpRequest (deprecated but still synchronous) or navigator.sendBeacon(), which sends a small payload asynchronously but is guaranteed to complete even after the page unloads.</p>
        <p>navigator.sendBeacon() is the correct modern choice for unload saves: it sends the data in a fire-and-forget manner, survives page close, and doesn't block navigation. The limitation: Beacon payloads are limited to 64KB and cannot include custom headers like If-Unmodified-Since. The server endpoint for Beacon saves should accept the document state and apply it with last-write-wins semantics (no conflict checking) because there is no way to handle a 412 response from a Beacon request.</p>
        <p>As a belt-and-suspenders approach: the beforeunload handler first writes to localStorage (synchronous, instant), then fires a Beacon. Even if the Beacon fails (server down), the localStorage draft captures the state. The next page load will offer restoration. For documents where every character matters (legal, financial), a synchronous unload save using the deprecated XMLHttpRequest sync mode may be justified—the blocking behavior is acceptable for this critical path.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Retry Logic on Save Failure</h3>
        <p>On save failure (network error, server 5xx), the auto-save system enters a retry loop with exponential backoff: retry after 5 seconds, then 10, then 20, capping at 60 seconds. The status indicator shows the next retry time. The user can click "Retry now" to skip the backoff and retry immediately. After 5 consecutive failures over 10+ minutes, the system stops automatic retries and shows a persistent "Unable to save. Your changes are stored locally and will sync when connectivity is restored." This is the offline-tolerant posture: accept that saves will fail during outages, preserve the draft in localStorage, and resume syncing automatically when the server is reachable again.</p>
        <p>Note that retries must include the same If-Unmodified-Since value as the original attempt. If the server has been updated between the original attempt and the retry (another device saved), the retry will receive a 412. This is correct behavior—the conflict must be resolved before the retry can succeed. Retrying with an outdated header value should not silently overwrite concurrent changes.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Debounce delay versus data loss risk: a shorter debounce (500ms) saves more frequently but generates more server load. A longer debounce (5 seconds) reduces load but increases data loss risk. The 2-second default is calibrated to the typical writing pause between sentences—fast enough to feel safe, slow enough not to spam the server. For code editors or spreadsheets where changes are more discrete, a shorter debounce may be appropriate.</p>
        <p>Full document save versus patch-based: saving the entire document on every auto-save is simple but wasteful for large documents (sending 100KB JSON when only one sentence changed). Patch-based saves (compute a diff and send only the delta) reduce payload size but require the server to apply patches correctly and handle out-of-order patch delivery. For most documents under 50KB, full saves are the right choice. For larger documents (multi-thousand-word articles, complex data), the engineering cost of patch-based saves is justified.</p>
        <p>OCC versus last-write-wins for conflicts: OCC (return 412 on conflict, require user resolution) is correct for documents where precision matters (legal, configuration). Last-write-wins is simpler and appropriate for lower-stakes content (personal notes, drafts) where the user is the only editor and conflicts are rare. The choice should be explicit—defaulting to last-write-wins silently drops changes when concurrent editing occurs.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A production auto-save system is a state machine (idle → unsaved → saving → saved/error) driven by a trailing debounce (2 seconds) combined with a maximum-interval timer (30 seconds). The save function is idempotent and skipped when no changes are detected. localStorage drafts provide a safety net for server failures and browser crashes. Page unload is handled via navigator.sendBeacon() for fire-and-forget persistence plus a synchronous localStorage write. Conflict detection uses If-Unmodified-Since headers with server-side version tracking; conflicts surface a resolution UI rather than silently overwriting. The status indicator is an ARIA live region driven by state machine transitions. Retry logic with exponential backoff handles transient server failures without losing the user's work. The system's defining constraint is that the editing experience must never be blocked—all save operations are asynchronous, and all failure states degrade gracefully to local draft preservation.</p>
      </section>
    </ArticleLayout>
  );
}

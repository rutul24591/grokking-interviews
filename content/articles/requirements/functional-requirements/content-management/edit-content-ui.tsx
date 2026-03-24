"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-edit-content",
  title: "Edit Content UI",
  description:
    "Comprehensive guide to implementing content editing interfaces covering editor types, version management, change tracking, collaborative editing, conflict resolution, auto-save patterns, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "edit-content-ui",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "edit",
    "frontend",
    "versioning",
    "collaboration",
  ],
  relatedTopics: ["create-content-ui", "content-versioning", "collaborative-editing"],
};

export default function EditContentUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Edit Content UI</strong> allows users to modify existing content while maintaining
          version history, tracking changes, and preventing conflicts with concurrent editors. Edit
          UI is distinct from create UI — it loads existing content with full version metadata,
          shows comprehensive version history, enables detailed change tracking with audit trails,
          and handles collaborative editing with real-time synchronization. The edit UI must balance
          editing flexibility with content integrity and collaboration support.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/edit-content-flow.svg"
          alt="Edit Content Flow"
          caption="Edit Content Flow — showing load existing content, edit with change tracking, version management, collaborative editing, conflict resolution, and save with auto-save"
        />

        <p>
          For staff and principal engineers, implementing edit UI requires deep understanding of
          editor architecture with version management integration, change tracking with visual diff
          rendering, collaborative editing with operational transforms or CRDTs for conflict-free
          merging, conflict resolution strategies for concurrent edits, auto-save patterns with
          offline support, and the psychological aspects of editing including user confidence
          through save status visibility and non-destructive editing patterns. The implementation
          must balance editing flexibility with content integrity and collaboration support while
          maintaining performance and accessibility.
        </p>

        <p>
          Modern edit UIs have evolved from simple text areas to sophisticated collaborative
          editing experiences with real-time sync, comprehensive change tracking, and full version
          history. Platforms like Google Docs pioneered real-time collaboration with operational
          transforms, Notion introduced block-based editing with real-time sync, and GitHub
          established code editing with full version control integration. Editor choice depends on
          content type, collaboration needs ranging from single user to real-time multi-user
          editing, and version requirements from simple history to full version control with
          branching and merging capabilities.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Content editing is built on fundamental concepts that determine how users modify, track,
          and collaborate on content effectively. Understanding these concepts is essential for
          designing edit interfaces that balance flexibility with integrity.
        </p>

        <p>
          <strong>Editor Architecture:</strong> The editor forms the foundation of edit UI with
          three primary types serving different user needs. WYSIWYG editors like TinyMCE and
          CKEditor provide visual editing with immediate formatting feedback ideal for non-technical
          users creating articles and documents. Markdown editors popular with developers offer fast
          typing with version-control friendly plain text output used by platforms like Stack
          Overflow and GitHub. Block editors like Gutenberg and Notion treat content as modular
          blocks that can be rearranged and transformed enabling flexible layout creation. Edit UI
          typically uses the same editor type as create UI for consistency but adds version
          management and change tracking capabilities.
        </p>

        <p>
          <strong>Version Management:</strong> Every edit operation creates a new version rather
          than overwriting existing content. Loading existing content includes full version metadata
          with version number, author identity, and timestamp. Version comparison uses diff
          algorithms like Myers diff to compute and visualize changes between any two versions with
          additions highlighted in green, deletions in red, and modifications in yellow. Version
          restore creates a new version with content from a previous version while maintaining the
          continuous version chain never overwriting history. This approach enables users to track
          content evolution over time, understand what changed and why, and recover from mistakes
          without losing any version history.
        </p>

        <p>
          <strong>Change Tracking:</strong> Visual diff highlighting shows changes as users edit or
          when comparing versions providing immediate feedback on modifications. The undo/redo
          system uses the command pattern where each edit operation is a command with a
          corresponding undo operation maintaining a stack that persists across auto-save cycles.
          Edit history tracks comprehensive metadata including user identity, timestamp, version
          number, and change description creating an audit trail essential for compliance
          requirements in regulated industries. Change tracking provides transparency so users see
          what changed, accountability showing who changed it, and recoverability enabling mistake
          correction.
        </p>

        <p>
          <strong>Collaborative Editing:</strong> Real-time synchronization via WebSocket pushes
          edits to other users immediately with sub-100ms latency creating the feeling of
          simultaneous editing. Presence indicators show who is currently editing with avatars,
          named cursors, and selection highlights so users see where others are working. Operational
          transforms used by Google Docs transform concurrent edits to maintain consistency across
          all clients while CRDTs provide mathematical guarantees of eventual consistency through
          conflict-free replicated data types. Conflict resolution detects when the same section is
          edited concurrently, merges automatically when changes are non-conflicting in different
          sections, and prompts users to resolve conflicts when the same lines are changed
          differently.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Edit UI architecture separates editor, version management, change tracking, and
          collaboration into modular components enabling maintainable implementation with clear
          boundaries. This architecture is critical for user experience, reliability, and the
          ability to evolve features independently.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/edit-content-flow.svg"
          alt="Edit Content Flow"
          caption="Edit Content Flow — showing load existing content, edit with change tracking, version management, collaborative editing, conflict resolution, and save with auto-save"
        />

        <p>
          The edit flow begins when a user clicks Edit on existing content. The backend loads
          content from the database including full version metadata with version number, author
          identity, and timestamp. The editor loads based on content type and user preference
          supporting WYSIWYG, Markdown, or Block editors. As the user edits content, change tracking
          highlights modifications with additions in green and deletions in red. Auto-save runs
          every thirty seconds saving to local storage for offline support and syncing to the
          server when online. In collaborative scenarios, presence indicators show other active
          editors, edits synchronize in real-time via WebSocket, and conflicts are handled with
          operational transforms or CRDTs. When the user clicks Save or auto-save triggers, the
          backend creates a new version in the content_versions table without overwriting history,
          maintains the continuous version chain, and notifies collaborators of the save event.
          Users can view version history at any time to compare versions or restore previous states.
        </p>

        <p>
          Version management architecture provides load operations fetching specific versions by
          version number or timestamp, compare operations loading two versions and computing diff
          with the Myers diff algorithm to highlight additions, deletions, and modifications, and
          restore operations creating new versions with restored content while maintaining the
          continuous version chain. This architecture enables users to track content evolution over
          time, understand what changed between versions, and recover from mistakes without losing
          any version history.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/collaborative-editing.svg"
          alt="Collaborative Editing"
          caption="Collaborative Editing — showing real-time sync, presence indicators, OT/CRDTs for conflict-free merging, and conflict resolution"
        />

        <p>
          Collaborative editing architecture establishes WebSocket connections on edit open to push
          edits to the server, broadcast to other editors, and receive edits from others with
          sub-100ms latency creating instant synchronization. Presence indicators send heartbeats
          every five seconds to show active editors with avatars, cursors displaying names, and
          selection highlights showing where others are editing. Operational transforms transform
          concurrent edits to maintain consistency across all clients while CRDTs provide
          mathematical guarantees of eventual consistency. Conflict resolution detects conflicts
          when the same section is edited concurrently, merges automatically when changes are in
          different sections, and prompts users to resolve conflicts when the same lines are changed
          differently. This architecture enables seamless real-time collaboration without conflicts
          or data loss.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing edit UI involves fundamental trade-offs between flexibility, control, and
          collaboration that shape the user experience and system architecture. Understanding these
          trade-offs is essential for making informed architecture decisions aligned with product
          requirements.
        </p>

        <p>
          Real-time collaboration as implemented by Google Docs shows others edits immediately with
          sub-100ms latency enabling multiple users to edit simultaneously with operational
          transforms or CRDTs handling conflicts automatically. This approach provides the most
          collaborative experience but requires complex implementation with WebSocket infrastructure
          and operational transform or CRDT logic plus higher infrastructure costs for persistent
          connections. Async collaboration as used by GitHub enables users to edit independently
          and merge changes later through pull requests with explicit conflict resolution. This
          approach is simpler to implement and works well for code review workflows but edits are
          not immediate and users do not see changes until merge occurs with conflicts resolved
          manually. The recommendation is real-time for documents like articles and notes where
          users expect Google Docs-like experiences, async for code with pull requests and explicit
          review processes, and hybrid for wikis with real-time editing but async review before
          publishing.
        </p>

        <p>
          Locking edit as used in checkout/checkin systems has users lock content before editing
          preventing others from editing, enabling exclusive editing, and requiring checkin to
          release the lock. This approach prevents conflicts entirely but blocks other users from
          collaborating and forgotten locks can leave content locked indefinitely preventing any
          edits. Non-locking edit allows anyone to edit with concurrent edits detected and resolved
          through merge or user prompts. This approach enables collaboration but requires conflict
          resolution logic and users may encounter conflicts requiring manual resolution. The
          recommendation is non-locking for most content like articles and wikis to enable
          collaboration, locking for sensitive content like legal documents and financial records to
          prevent conflicting edits, and showing presence indicators to warn users when others are
          editing the same content.
        </p>

        <p>
          Track changes mode shows all changes with additions in green and deletions in red,
          enables users to accept or reject individual changes, and maintains full audit trails of
          all modifications. This approach provides complete transparency and is essential for
          review workflows but creates visually cluttered interfaces when many changes exist and
          requires a review workflow for accepting or rejecting changes. Clean edit mode shows only
          current content with changes saved silently without visual indicators. This approach
          provides a clean reading experience but users cannot see what changed and there is no
          review workflow for managing changes. The recommendation is track changes for review
          workflows in legal documents and published content where changes require approval, clean
          edit for personal editing in notes and drafts where users edit freely, and hybrid
          approaches that track changes internally for version diff while showing clean edit by
          default with a toggle to see changes.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing edit content UI requires following established best practices to ensure
          usability, version integrity, and collaboration support while maintaining performance and
          accessibility.
        </p>

        <p>
          Editor selection should match the create UI editor for consistency so if content was
          created with WYSIWYG it should be edited with WYSIWYG. Support multiple editors and let
          users choose their preference remembering it for next time. Ensure feature parity so the
          edit UI has the same formatting options as create UI. Preserve formatting when loading
          content so styles are not lost on load.
        </p>

        <p>
          Version management should show version info including version number, author, and
          timestamp displayed as Version 5 by John 2 hours ago. Enable compare with side-by-side
          diff highlighting additions in green and deletions in red. Enable restore to create new
          versions with restored content without overwriting history. Provide version history
          listing all versions with pagination if many exist showing metadata including author,
          timestamp, and change description.
        </p>

        <p>
          Change tracking should provide visual diff highlighting changes as users edit with subtle
          highlights or showing diff on save. Implement full undo/redo stacks with Ctrl+Z and
          Ctrl+Y support that maintain across auto-save cycles. Track edit history with user
          identity, timestamp, and change description to enable audit and compliance. Show save
          status with messages like Saved 5 seconds ago, Saving, or Offline saved locally to
          reassure users their work is safe.
        </p>

        <p>
          Collaborative editing should show presence indicators with avatars, cursors with names,
          and selection highlights so users see where others are editing. Implement real-time sync
          via WebSocket pushing edits immediately with sub-100ms latency so it feels instant.
          Provide conflict resolution detecting conflicts when the same section is edited, merging
          automatically if non-conflicting, and prompting users if conflicting. Enable comments on
          changes with inline comments to discuss specific changes before accepting.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing edit content UI to ensure usability, version
          integrity, and collaboration support while maintaining user trust and data safety.
        </p>

        <p>
          Missing version history prevents users from seeing what changed or restoring previous
          versions. Fix this by saving versions on every edit, showing comprehensive version
          history, and enabling compare and restore operations. Overwriting on save destroys history
          and prevents recovery. Fix this by creating new versions on save, maintaining continuous
          version chains, and never overwriting existing versions.
        </p>

        <p>
          Missing change tracking leaves users unaware of what changed during their session. Fix
          this by highlighting changes as users edit, showing diff on save, and enabling undo/redo
          operations. Missing collaborative editing prevents users from editing together. Fix this
          with real-time sync via WebSocket, presence indicators showing who is editing, and
          conflict handling with operational transforms or CRDTs.
        </p>

        <p>
          Locking without timeout allows users to lock content and forget leaving it locked
          indefinitely. Fix this with auto-release locks after thirty minutes, showing lock status
          visibly, and allowing admin override. Missing conflict resolution causes concurrent edits
          to cause data loss. Fix this by detecting conflicts, merging automatically if
          non-conflicting, and prompting users if conflicting changes require manual resolution.
        </p>

        <p>
          Missing auto-save causes users to lose work from browser crashes or accidental closes.
          Fix this with auto-save every thirty seconds, local storage for offline support, and
          server sync when online. Missing save status leaves users uncertain if their work is
          saved. Fix this by showing Saved 5 seconds ago, Saving, or Offline status messages to
          reassure users. Poor mobile editors have keyboards covering the editing area making edits
          difficult. Fix this with mobile-optimized editors, sticky toolbars, and responsive
          layouts. Missing accessibility prevents keyboard users from navigating. Fix this with
          keyboard navigation, ARIA labels, and screen reader testing.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Edit content UI is critical for content maintenance across different domains. Here are
          real-world implementations from production systems demonstrating different approaches to
          editing challenges.
        </p>

        <p>
          Document collaboration at Google Docs addresses real-time collaborative editing with
          multiple users on the same document, no lost edits, and comprehensive version history.
          The solution uses real-time sync via WebSocket so edits appear instantly for all users,
          presence indicators with cursors showing names so users see where others are editing,
          operational transforms to merge concurrent edits without conflicts, version history with
          named versions users can name or auto-named like Edited 2 hours ago, and suggesting mode
          for track changes where users accept or reject suggestions. The result is seamless
          collaboration with multiple users editing simultaneously, no lost edits from real-time
          sync plus auto-save, comprehensive version history, and suggesting mode enabling review
          workflows.
        </p>

        <p>
          Code editing at GitHub addresses code editing with version control, multiple
          contributors, review before merge, and conflict resolution. The solution uses branch
          editing so edits happen in branches not affecting main, pull requests to propose changes
          with review before merge, inline comments to discuss specific lines, conflict detection
          prompting users to resolve conflicting changes, and full git history with every commit
          tracked and revert capability. The result is collaborative code editing with multiple
          contributors, review workflow with changes reviewed before merge, complete version history
          from git, and explicitly resolved conflicts.
        </p>

        <p>
          Wiki editing at Confluence addresses wiki pages edited by multiple users with change
          tracking, version comparison, and restore capability. The solution uses rich text editors
          for familiar WYSIWYG editing, version history listing all versions with author timestamp
          and comment, version comparison with side-by-side diff highlighting changes, restore to
          any version creating new versions, and watch pages notifying on changes tracking who
          changed what. The result is collaborative wiki editing with tracked changes, recoverable
          mistakes through restore, and compliance from audit trails of all changes.
        </p>

        <p>
          Note taking at Notion addresses block-based editing, real-time collaboration, version
          history, and templates. The solution uses block editors where each paragraph is a block
          that can be dragged to reorder and transformed, real-time sync so edits appear instantly
          for collaborators, version history with page history to restore any previous version,
          templates with pre-built structures for meeting notes and project plans, and comments as
          inline comments on blocks to discuss before finalizing. The result is flexible editing
          with blocks enabling any layout, seamless collaboration, version history enabling
          recovery, and templates accelerating creation.
        </p>

        <p>
          Legal documents at DocuSign address version tracking, compliance audit trails, multiple
          parties reviewing and editing, and tamper-proof history. The solution uses track changes
          showing all additions and deletions with parties accepting or rejecting, version history
          with full audit trails of who changed what when, digital signatures on specific versions
          where signatures become invalid if documents change, compliance reporting exporting audit
          trails for auditors in PDF or CSV, and locking documents during review to prevent
          conflicting edits. The result is compliance met with audit trails, tamper-proof history
          preventing modification of signed versions, legal validity from digital signatures, and
          review workflows for accepting or rejecting changes.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of edit content UI design, implementation, and
          operational concerns for staff and principal engineer interviews.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement version management?</p>
            <p className="mt-2 text-sm">
              A: Load version by fetching specific version by version number or timestamp (SELECT *
              FROM content_versions WHERE content_id = ? AND version_number = ?). Compare versions
              by loading two versions and computing diff with Myers diff algorithm highlighting
              additions in green, deletions in red, and modifications in yellow. Restore version by
              creating new version with restored content (INSERT INTO content_versions with version
              number as MAX(version_number) + 1), maintaining continuous version chain without
              overwriting history.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement change tracking?</p>
            <p className="mt-2 text-sm">
              A: Visual diff highlights changes as users edit by storing original content on load,
              comparing current with original, and highlighting differences. Undo/redo uses command
              pattern where each edit is a command with undo operation, maintaining undo/redo stack
              (push on edit, pop on undo/redo). Edit history tracks every change with user identity,
              timestamp, version number, and change description storing in audit table for
              compliance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement real-time collaboration?</p>
            <p className="mt-2 text-sm">
              A: WebSocket connection connects on edit open, pushing edits to server, broadcasting
              to other editors, and receiving edits from others with sub-100ms latency. Presence
              indicators show who is editing by sending heartbeat every 5 seconds, showing
              avatars/cursors with names, and highlighting selections. Operational transforms
              transform concurrent edits to maintain consistency (if user A inserts at position 5,
              user B inserts at position 10, transform user B edit to position 11). Conflict
              resolution detects conflicts when same section is edited concurrently, merging
              automatically if non-conflicting (different sections), and prompting user if
              conflicting (same lines changed differently).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle edit conflicts?</p>
            <p className="mt-2 text-sm">
              A: Detect conflicts by comparing timestamps (if server version newer than loaded
              version, conflict exists). Last-write-wins automatically uses latest version (simple,
              but may lose work). Three-way merge uses base version plus local changes plus server
              changes, automatically merging non-conflicting changes and prompting for conflicts.
              Prompt user by showing both versions with side-by-side diff, letting user choose which
              to keep or manually merge. Log conflicts with audit trail of who resolved and how for
              compliance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement auto-save for edit?</p>
            <p className="mt-2 text-sm">
              A: Timer-based every 30 seconds (setInterval) to save content to server. Event-based
              on blur and before unload, saving if content changed. Local storage saves to IndexedDB
              (works offline, large capacity). Sync when online pushes local edits to server,
              handling conflicts with last-write-wins or prompting user. Show save status ("Saved 5
              seconds ago", "Saving...", "Offline — saved locally") to reassure users. Debounce
              saves (wait 1 second after typing stops) to avoid saving on every keystroke.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement locking?</p>
            <p className="mt-2 text-sm">
              A: Acquire lock atomically (UPDATE content SET locked_by = ? WHERE id = ? AND locked_by
              IS NULL, returns success/failure). Show lock status displaying who locked with
              timestamp and countdown to auto-release. Auto-release after timeout of 30 minutes
              (UPDATE content SET locked_by = NULL WHERE locked_by = ? AND locked_at &lt; NOW() -
              INTERVAL '30 minutes'). Admin override allows admin to release others' locks with
              audit log of who released. Prevent edit if locked by other user by showing message,
              disabling edit, and offering to notify lock holder.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement suggesting mode?</p>
            <p className="mt-2 text-sm">
              A: Toggle mode switches between edit and suggest with user choosing. In suggest mode,
              edits create suggestions (not direct changes), highlighting suggestions in different
              color (yellow for pending). Store suggestions in separate table (content_id,
              suggestion_id, original_text, suggested_text, author_id, status: pending/accepted/
              rejected). Accept or reject by user with permission (accepting applies suggestion,
              rejecting discards suggestion). Notify author when suggestion accepted/rejected with
              email or push notification.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure edit UI accessibility?</p>
            <p className="mt-2 text-sm">
              A: Keyboard navigation enables Tab through toolbar buttons, Enter to activate, Escape
              to close dropdowns, and Ctrl+Z for undo. ARIA labels describe buttons ("Bold button",
              "Insert image") for screen readers. Focus management returns focus to editor after
              toolbar action. High contrast mode makes toolbar visible in high contrast. Screen
              reader testing with NVDA and VoiceOver ensures usability. Announce changes so screen
              reader announces when content changes ("Content saved", "Conflict detected").
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize edit UI performance?</p>
            <p className="mt-2 text-sm">
              A: Lazy load editor (not loading until user clicks edit) to reduce initial bundle.
              Virtualize long content (render only visible portion) for very long documents. Debounce
              heavy operations (diff computation, auto-save) waiting after typing stops. Incremental
              diff computes diff only for changed sections, not entire document. Code split editor
              (load editor code separately) so main app loads faster. Memoize expensive calculations
              (diff, word count) caching until content changes.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/06/building-accessible-rich-text-editors/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Building Accessible Rich Text Editors
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Operational_transformation"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Operational Transformation (Google Docs)
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Input Validation Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - WebSockets API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Storage_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Storage API
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Logging Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

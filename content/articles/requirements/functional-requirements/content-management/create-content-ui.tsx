"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-create-content",
  title: "Create Content UI",
  description:
    "Comprehensive guide to implementing content creation interfaces covering editor types (WYSIWYG, Markdown, block), editor architecture, media upload (drag-drop, progress, validation), draft management (auto-save, local storage, sync), content validation (real-time, policy, quality), templates, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "create-content-ui",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "create",
    "frontend",
    "editor",
    "drafts",
  ],
  relatedTopics: ["edit-content-ui", "rich-text-editor", "media-upload"],
};

export default function CreateContentUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Create Content UI</strong> is the primary interface for users to generate new
          content on the platform. It must provide an intuitive, powerful editing experience while
          enforcing content policies and guiding users toward quality submissions. The create UI is
          often the first meaningful interaction users have with a platform — a poor experience
          leads to abandonment, while a great experience encourages creation and retention. Create
          UI encompasses the editor (WYSIWYG, Markdown, block), media upload (images, videos,
          attachments), draft management (auto-save, local storage, sync), content validation
          (real-time feedback, policy enforcement, quality checks), and templates (pre-filled
          structures for common content types).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/create-content-flow.svg"
          alt="Create Content Flow"
          caption="Create Content Flow — showing editor selection (WYSIWYG, Markdown, block), media upload (drag-drop, progress, validation), draft auto-save, content validation (real-time feedback), and publish workflow"
        />

        <p>
          For staff and principal engineers, implementing create UI requires deep understanding of
          editor architecture (WYSIWYG — TinyMCE, CKEditor, Quill for visual editing, Markdown —
          for developer/technical content, Block — Gutenberg, Notion-style for modular content),
          media handling (drag-drop upload, progress indicators, client-side validation, image
          optimization before upload), draft management (auto-save every 30 seconds, local storage
          for offline editing, sync when online, conflict resolution), content validation
          (real-time feedback — character count, required fields, policy checks, quality scoring),
          templates (pre-filled structures for common content types — blog post, product listing,
          job posting), and the psychological aspects of content creation (writer's block —
          provide prompts, motivation — show progress, completion — clear publish flow). The
          implementation must balance creative freedom (flexible editing) with content quality
          (validation, guidance) and policy compliance (enforce rules without frustrating users).
        </p>
        <p>
          Modern create UIs have evolved from simple text areas to sophisticated editing
          experiences with real-time collaboration, AI assistance, and rich media support.
          Platforms like Medium, Notion, and Substack provide distraction-free editors with
          auto-save, rich formatting, and seamless publishing. Editor choice depends on audience
          (technical users prefer Markdown, general users prefer WYSIWYG), content type (articles
          vs documentation vs social posts), and platform goals (speed vs flexibility).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Content creation is built on fundamental concepts that determine how users create, edit,
          and publish content. Understanding these concepts is essential for designing effective
          create interfaces.
        </p>
        <p>
          <strong>Editor Types:</strong> WYSIWYG (What You See Is What You Get — visual editing
          with formatting toolbar, immediate visual feedback, user-friendly for non-technical users
          — TinyMCE, CKEditor, Quill), Markdown (plain text with markdown syntax — fast typing,
          version-control friendly, popular with developers — Stack Overflow, GitHub, Reddit),
          Block (content as modular blocks — paragraph, image, embed blocks, flexible layout,
          Notion-style — Gutenberg, Notion, Craft). Choose based on audience and content type.
        </p>
        <p>
          <strong>Media Upload:</strong> Drag-drop (drag files to upload area — intuitive, fast),
          file picker (click to open file dialog — standard fallback), progress indicators (show
          upload progress per file — percentage, time remaining), client-side validation (validate
          file type by magic bytes, size limits, dimensions before upload — reject early, save
          bandwidth), image optimization (resize, compress before upload — reduce upload time,
          storage). Media upload must be fast, reliable, and forgiving (retry on failure).
        </p>
        <p>
          <strong>Draft Management:</strong> Auto-save (every 30 seconds — no lost work, save on
          blur, before unload), local storage (save to IndexedDB/LocalStorage — works offline,
          sync when online), sync (when online, sync local drafts to server — handle conflicts if
          edited from multiple devices), version history (save drafts as versions — restore any
          draft, compare drafts). Draft management prevents data loss and enables offline editing.
        </p>
        <p>
          <strong>Content Validation:</strong> Real-time feedback (character count — "50/5000
          characters", required fields — highlight missing fields as user types, word count,
          reading time), policy checks (prohibited content — scan as user types, warn before
          publish, spam detection — detect patterns), quality scoring (readability score,
          completeness — "Add a cover image to improve engagement", suggestions — "Add tags for
          better discovery"). Validation guides users to quality content without blocking creation.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Create UI architecture separates editor (content input), media upload (file handling),
          draft management (auto-save, sync), and validation (real-time feedback), enabling
          modular, maintainable implementation. This architecture is critical for user experience
          and reliability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/editor-architecture.svg"
          alt="Editor Architecture"
          caption="Editor Architecture — showing WYSIWYG editor (TinyMCE, CKEditor), Markdown editor (with preview), Block editor (modular blocks), and shared services (auto-save, validation, media upload)"
        />

        <p>
          Create flow: User clicks "Create". User selects content type (blog post, product, job —
          or default). Editor loads (WYSIWYG, Markdown, or Block based on user preference/content
          type). User types content (editor handles formatting, media embeds). Media upload (user
          drrops image — client validates, uploads, inserts into content). Auto-save (every 30
          seconds — save to local storage, sync to server when online). Real-time validation
          (character count updates, required fields highlight, policy checks run in background).
          User clicks "Publish" (or "Save Draft"). Final validation (block if critical issues —
          empty title, policy violation). Content published (or saved as draft).
        </p>
        <p>
          Editor architecture includes: editor core (content editable area — handle input,
          selection, cursor), toolbar (formatting buttons — bold, italic, headings, lists — apply
          to selection), media handler (insert image/video — upload, embed, resize), plugin system
          (extend functionality — embeds, mentions, tables — modular architecture). Shared services
          (auto-save — saves all editor types, validation — shared rules, media upload — shared
          service). This architecture enables consistent editing experience across content types.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/draft-management.svg"
          alt="Draft Management"
          caption="Draft Management — showing auto-save (every 30 seconds), local storage (offline editing), sync (when online), conflict resolution (multiple devices), and version history"
        />

        <p>
          Draft management architecture includes: auto-save (timer-based — every 30 seconds,
          event-based — on blur, before unload, after significant changes), local storage
          (IndexedDB for large drafts, LocalStorage for small — store content, metadata,
          timestamp), sync (when online — push local drafts to server, pull server drafts — handle
          conflicts with last-write-wins or prompt user), version history (save periodic snapshots
          — every 5 minutes, on publish — enable restore, compare). This architecture ensures no
          lost work, offline editing, and seamless multi-device experience.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing create UI involves trade-offs between flexibility, ease of use, and control.
          Understanding these trade-offs is essential for making informed architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">WYSIWYG vs Markdown vs Block Editor</h3>
          <ul className="space-y-3">
            <li>
              <strong>WYSIWYG:</strong> Visual editing (what you see is what you get),
              user-friendly (no markup knowledge), immediate feedback. Limitation: HTML bloat
              (extra markup), cross-browser issues (different rendering), harder to version control.
            </li>
            <li>
              <strong>Markdown:</strong> Plain text (fast typing, clean), version-control friendly
              (diffs are clean), portable (any text editor). Limitation: learning curve (syntax to
              learn), no visual feedback (need preview pane), less discoverable (users don't know
              syntax).
            </li>
            <li>
              <strong>Block:</strong> Modular (content as blocks — flexible), visual (see layout as
              you build), structured (enforces consistency). Limitation: complex implementation,
              learning curve (block concepts), may feel restrictive.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Auto-Save Frequency: Frequent vs Infrequent</h3>
          <ul className="space-y-3">
            <li>
              <strong>Frequent (every 10-30 seconds):</strong> No lost work (minimal data loss),
              users feel safe. Limitation: more server requests (cost, load), may be distracting
              (save indicator flashes often).
            </li>
            <li>
              <strong>Infrequent (every 2-5 minutes):</strong> Fewer server requests (lower cost),
              less distracting. Limitation: more data loss (up to 5 minutes), users anxious.
            </li>
            <li>
              <strong>Recommendation:</strong> Hybrid — local auto-save every 10 seconds (no
              server cost), server sync every 30 seconds (balance safety with cost). Show save
              status ("Saved 5 seconds ago" — reassure users).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Real-time vs Post-Validation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Real-time:</strong> Feedback as user types (catch issues early, guide user),
              prevents frustration (fix before publish). Limitation: can be distracting (errors
              flash as user types), performance cost (validate on every keystroke).
            </li>
            <li>
              <strong>Post-Validation:</strong> Validate on publish (no distraction, better
              performance). Limitation: user frustrated (errors at end, must fix all at once), may
              abandon if too many errors.
            </li>
            <li>
              <strong>Recommendation:</strong> Hybrid — real-time for non-blocking (character
              count, word count, reading time), post-validation for blocking (policy checks,
              required fields — warn as user types, block on publish). Best of both — guidance
              without distraction.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing create content UI requires following established best practices to ensure
          usability, reliability, and content quality.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Editor Selection</h3>
        <p>
          Choose based on audience (technical users — Markdown, general users — WYSIWYG, structured
          content — Block). Support multiple editors (let users choose preference — remember for
          next time). Provide toolbar customization (users hide unused buttons — reduce clutter).
          Ensure accessibility (keyboard navigation, screen reader support, high contrast mode).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Media Upload</h3>
        <p>
          Drag-drop support (intuitive — drag files to upload area, visual feedback on drag over).
          Progress indicators (per-file progress — percentage, time remaining, overall progress for
          multiple files). Client-side validation (validate file type by magic bytes, size limits,
          image dimensions — reject before upload). Image optimization (resize large images,
          compress — reduce upload time, storage). Retry on failure (automatic retry — exponential
          backoff, resume interrupted uploads).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Draft Management</h3>
        <p>
          Auto-save every 30 seconds (timer-based — save even if user doesn't click save). Local
          storage (save to IndexedDB — works offline, large capacity). Sync when online (push local
          drafts to server, pull server drafts — handle conflicts). Show save status ("Saved 5
          seconds ago", "Saving...", "Offline — saved locally" — reassure users). Version history
          (save periodic snapshots — enable restore, compare versions).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Content Validation</h3>
        <p>
          Real-time feedback (character count — "50/5000 characters", word count, reading time —
          "3 min read"). Required fields (highlight as user types — red border, helper text).
          Policy checks (scan as user types — warn before publish, don't block creation). Quality
          scoring (readability score, completeness — "Add a cover image to improve engagement",
          suggestions — "Add tags for better discovery"). Clear error messages ("Title is required
          — please add a title", not "Validation failed").
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing create content UI to ensure usability,
          reliability, and content quality.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No auto-save:</strong> Users lose work (browser crash, accidental close),
            frustration, abandonment. <strong>Fix:</strong> Auto-save every 30 seconds. Save to
            local storage. Sync to server.
          </li>
          <li>
            <strong>No draft recovery:</strong> Users can't recover lost drafts.{" "}
            <strong>Fix:</strong> Store drafts locally. Show "Recover draft?" on return. List
            drafts for selection.
          </li>
          <li>
            <strong>Slow media upload:</strong> No progress indicator, users don't know status.{" "}
            <strong>Fix:</strong> Show progress per file. Enable retry. Optimize images before
            upload.
          </li>
          <li>
            <strong>No client-side validation:</strong> Server rejects after long wait, user
            frustrated. <strong>Fix:</strong> Validate client-side first (file type, size). Show
            errors immediately.
          </li>
          <li>
            <strong>Blocking validation:</strong> Can't continue typing, errors block creation.{" "}
            <strong>Fix:</strong> Warn as user types, block only on publish. Non-blocking feedback.
          </li>
          <li>
            <strong>No offline support:</strong> Can't create without internet.{" "}
            <strong>Fix:</strong> Save to local storage. Queue sync for when online. Show offline
            status.
          </li>
          <li>
            <strong>Poor mobile editor:</strong> Keyboard covers editor, hard to format.{" "}
            <strong>Fix:</strong> Mobile-optimized editor. Sticky toolbar. Responsive layout.
          </li>
          <li>
            <strong>No templates:</strong> Users don't know where to start. <strong>Fix:</strong>
            Provide templates (blog post, product, job). Pre-filled structures.
          </li>
          <li>
            <strong>No accessibility:</strong> Keyboard users can't navigate, screen readers fail.{" "}
            <strong>Fix:</strong> Keyboard navigation. ARIA labels. Screen reader testing.
          </li>
          <li>
            <strong>No save status:</strong> Users don't know if saved. <strong>Fix:</strong> Show
            "Saved 5 seconds ago", "Saving...", "Offline". Reassure users.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Create content UI is critical for user engagement. Here are real-world implementations
          from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Blogging Platform (Medium)</h3>
        <p>
          <strong>Challenge:</strong> Distraction-free writing. Rich formatting. Image embeds.
          Auto-save. Publishing flow.
        </p>
        <p>
          <strong>Solution:</strong> Minimalist editor (focus on content — hide UI until needed).
          Rich text formatting (bold, italic, headings — via slash commands). Image embeds (drag-drop,
          captions, full-width options). Auto-save (every few seconds — "Saved" indicator).
          Publishing flow (preview, add tags, choose license — then publish).
        </p>
        <p>
          <strong>Result:</strong> Writing experience praised (distraction-free). No lost drafts
          (auto-save). High-quality content (publishing flow encourages review).
        </p>
        <p>
          <strong>UX:</strong> Minimalist editor, slash commands, drag-drop images, auto-save,
          publishing flow.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Documentation Platform (Notion)</h3>
        <p>
          <strong>Challenge:</strong> Block-based editing. Rich embeds. Collaboration. Templates.
        </p>
        <p>
          <strong>Solution:</strong> Block editor (each paragraph is a block — drag to reorder,
          transform blocks). Rich embeds (type "/" to embed — code, image, video, database).
          Collaboration (real-time editing — see others' cursors, comments). Templates (pre-built
          structures — meeting notes, project plan, wiki). Auto-save (every change saved
          instantly).
        </p>
        <p>
          <strong>Result:</strong> Flexible content creation (blocks enable any layout).
          Collaboration seamless. Templates accelerate creation.
        </p>
        <p>
          <strong>UX:</strong> Block editor, slash commands, real-time collaboration, templates,
          instant auto-save.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Q&A Platform (Stack Overflow)</h3>
        <p>
          <strong>Challenge:</strong> Technical content (code blocks, formatting). Markdown editor.
          Quality guidance. Preview.
        </p>
        <p>
          <strong>Solution:</strong> Markdown editor (technical users prefer — fast, clean).
          Live preview (side-by-side — see rendered output). Code blocks (syntax highlighting,
          language selection). Quality guidance (character minimum, title guidance, tag
          suggestions). Draft auto-save (recover if browser crashes).
        </p>
        <p>
          <strong>Result:</strong> High-quality technical content (Markdown, code blocks). Quality
          guidance improves posts. No lost drafts.
        </p>
        <p>
          <strong>UX:</strong> Markdown editor, live preview, code highlighting, quality guidance,
          draft recovery.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Shopify)</h3>
        <p>
          <strong>Challenge:</strong> Product creation. Multiple images. Variants. SEO fields.
          Templates.
        </p>
        <p>
          <strong>Solution:</strong> Structured form (title, description, price, inventory —
          organized sections). Media upload (multiple images — drag-drop, reorder, edit). Variants
          (size, color — generate combinations). SEO fields (meta title, description — preview how
          appears in search). Templates (product type templates — pre-filled fields).
        </p>
        <p>
          <strong>Result:</strong> Product creation streamlined. High-quality listings (structured
          fields, SEO guidance). No lost data (auto-save).
        </p>
        <p>
          <strong>UX:</strong> Structured form, drag-drop media, variant generator, SEO preview,
          templates.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Newsletter Platform (Substack)</h3>
        <p>
          <strong>Challenge:</strong> Newsletter creation. Rich formatting. Email preview.
          Scheduling. Subscribers preview.
        </p>
        <p>
          <strong>Solution:</strong> Rich text editor (familiar — like email, Word). Email preview
          (see how appears in inbox — desktop, mobile). Scheduling (write now, send later —
          timezone-aware). Subscriber preview (see how appears to free vs paid subscribers).
          Auto-save (every few seconds — draft recovery).
        </p>
        <p>
          <strong>Result:</strong> Newsletter creation easy (familiar editor). Email rendering
          verified (preview). Scheduling enables planning.
        </p>
        <p>
          <strong>UX:</strong> Rich text editor, email preview, scheduling, subscriber preview,
          auto-save.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of create content UI design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose between WYSIWYG, Markdown, and Block
            editor?</p>
            <p className="mt-2 text-sm">
              A: Based on audience and content type. Technical users (developers, engineers) —
              Markdown (fast, clean, version-control friendly). General users (bloggers, writers) —
              WYSIWYG (visual, no markup learning). Structured content (products, job postings) —
              Block or structured form (enforces consistency). Support multiple (let users choose
              preference — remember for next time). Consider content type (articles — WYSIWYG,
              documentation — Markdown, landing pages — Block).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement auto-save?</p>
            <p className="mt-2 text-sm">
              A: Timer-based (every 30 seconds — setInterval, save content to server). Event-based
              (on blur, before unload — save if content changed). Local storage (save to IndexedDB
              — works offline, large capacity). Sync when online (push local drafts to server —
              handle conflicts with last-write-wins or prompt user). Show save status ("Saved 5
              seconds ago", "Saving...", "Offline — saved locally" — reassure users). Debounce
              saves (wait 1 second after typing stops — don't save on every keystroke).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle media upload?</p>
            <p className="mt-2 text-sm">
              A: Drag-drop (drag files to upload area — visual feedback on drag over, drop to
              upload). File picker (click to open dialog — standard fallback). Progress indicators
              (per-file progress — percentage, time remaining, overall progress for multiple
              files). Client-side validation (validate file type by magic bytes — not extension,
              size limits, image dimensions — reject before upload). Image optimization (resize
              large images, compress — reduce upload time, storage). Retry on failure (automatic
              retry — exponential backoff, resume interrupted uploads).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement real-time validation?</p>
            <p className="mt-2 text-sm">
              A: Character count (update on every keystroke — "50/5000 characters"). Required
              fields (highlight as user types — red border, helper text — "Title is required").
              Word count, reading time (calculate as user types — "3 min read"). Policy checks
              (scan as user types — warn before publish, don't block creation). Quality scoring
              (readability score, completeness — "Add a cover image to improve engagement",
              suggestions — "Add tags for better discovery"). Debounce heavy validation (run
              expensive checks 1 second after typing stops — don't block input).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle offline editing?</p>
            <p className="mt-2 text-sm">
              A: Detect offline (navigator.onLine — false when offline). Save to local storage
              (IndexedDB — large capacity, works offline). Queue sync (when online — push local
              drafts to server, pull server drafts). Show offline status ("Offline — saved
              locally" — reassure users). Handle conflicts (if edited from multiple devices —
              last-write-wins or prompt user to choose). Enable full editing (all features work
              offline — sync when back online).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement templates?</p>
            <p className="mt-2 text-sm">
              A: Template library (pre-built structures — blog post, product listing, job posting —
              user selects). Pre-filled fields (title placeholder, body structure, suggested tags).
              Customizable (user edits template content — make it their own). Category templates
              (different templates per content type — blog vs product vs job). Template preview
              (show how template looks — before selecting). Save user templates (users create
              custom templates — reuse later).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure editor accessibility?</p>
            <p className="mt-2 text-sm">
              A: Keyboard navigation (Tab through toolbar buttons, Enter to activate, Escape to
              close dropdowns). ARIA labels (describe buttons — "Bold button", "Insert image" —
              for screen readers). Focus management (focus returns to editor after toolbar action).
              High contrast mode (toolbar visible in high contrast). Screen reader testing (test
              with NVDA, VoiceOver — ensure usable). Skip links (skip to content — bypass toolbar
              for keyboard users).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle draft conflicts?</p>
            <p className="mt-2 text-sm">
              A: Detect conflicts (local draft timestamp vs server draft timestamp — if server
              newer, conflict). Last-write-wins (automatically use latest version — simple, but
              may lose work). Prompt user (show both versions — let user choose which to keep, or
              merge manually). Three-way merge (base version + local changes + server changes —
              automatically merge non-conflicting, prompt for conflicts). Show diff (highlight
              differences — user sees what changed, decides).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize editor performance?</p>
            <p className="mt-2 text-sm">
              A: Lazy load editor (don't load until user clicks create — reduce initial bundle).
              Virtualize long content (render only visible portion — for very long documents).
              Debounce heavy operations (validation, auto-save — wait after typing stops). Use
              efficient data structures (content as tree — efficient updates). Code split editor
              (load editor code separately — main app loads faster). Memoize expensive calculations
              (word count, reading time — cache until content changes).
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
              href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Toolbar Pattern
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
              href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - IndexedDB API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Storage_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Storage API (LocalStorage)
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
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
        </ul>
      </section>
    </ArticleLayout>
  );
}

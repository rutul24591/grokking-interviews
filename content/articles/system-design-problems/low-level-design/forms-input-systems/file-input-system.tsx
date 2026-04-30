"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-file-input-system",
  title: "Design a File Input System",
  description:
    "LLD for an accessible file input supporting drag-and-drop, multi-file, MIME/size validation, previews, and progress as a form-friendly control.",
  category: "low-level-design",
  subcategory: "forms-input-systems",
  slug: "file-input-system",
  wordCount: 5800,
  readingTime: 30,
  lastUpdated: "2026-04-28",
  tags: ["lld", "file-input", "upload", "drag-and-drop", "accessibility"],
  relatedTopics: ["form-builder", "form-validation-engine"],
};

export default function FileInputArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a File Input control: a form-friendly
          component that accepts files via picker, drag-and-drop,
          paste, or camera capture; validates type, size, and count;
          shows previews and per-file status; integrates with a form
          runtime as a normal field; and degrades gracefully for
          keyboard and screen-reader users. The component is the
          ingestion surface — it turns user intent (pick, drop,
          paste, capture) into a clean, validated list of file
          references that downstream subsystems (an upload pipeline,
          an image editor, a form submission) can consume.
        </p>
        <p>
          The hard problems are accessibility (drag-drop is famously
          hostile to keyboard and assistive tech), preview
          generation without freezing the main thread, deduplication
          across paths, large-folder traversal without DoS-ing the
          browser, and a clean handoff to the upload subsystem so
          the file input doesn&rsquo;t become a god-component
          juggling network state. Done well, the control is a
          dependable, accessible, fast widget that drops into any
          form. Done poorly, it becomes the place where forms feel
          broken.
        </p>

        <h3>User Context</h3>
        <p>
          End users upload documents (passports, receipts), photos
          (profile, evidence), and bulk attachments (claim
          packets). They use mobile and desktop, with vastly
          different interaction patterns: desktop users drag and
          drop; mobile users prefer the native picker with camera
          fallback. Internal users include accessibility specialists
          who require keyboard parity, and engineers who consume
          this control inside a Form Builder via a registered
          field type.
        </p>

        <h3>Assumptions</h3>
        <p>
          The network upload pipeline is a separate system
          (chunked, resumable, queue-based) that the file input
          hands off to. The control surfaces a clean list of
          ingested files; the uploader mutates per-file status as
          it makes progress. Forms range from one allowed file to
          several dozen; per-file size limits typically 10–100 MB.
          MIME / extension allowlists and dimension constraints are
          configurable per instance. Modern browsers (Chromium,
          Firefox, Safari) are supported; older IE-era APIs are
          not.
        </p>

        <h3>Non-Goals</h3>
        <p>
          Server-side storage, CDN strategy, virus scanning, and
          chunked transport are not concerns of this control.
          Image editing, cropping, and rotation are delegated to
          specialized components that consume the file list as
          input. We do not implement an explicit upload queue or
          retry logic here — that lives in the uploader.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Native file picker (click and keyboard activation),
          drag-and-drop zone, paste-from-clipboard. MIME, extension,
          max-size, min-count, and max-count validation, with
          per-file rejection reasons. Per-file previews — image
          thumbnails for raster images, a generic file icon for
          others — and basic metadata (name, size, type). Add /
          remove individual files; reorder via drag handle and
          keyboard. Deduplication of identical files across paths
          (e.g. user drops the same file twice). Per-file status
          and progress indicator when integrated with an
          uploader.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Camera capture on mobile via the
          <code> capture</code> attribute. Folder upload with
          nested directory traversal via
          <code> DataTransferItem.webkitGetAsEntry</code>. Image
          dimension and aspect ratio validation. Hash-based
          deduplication so files renamed but identical are
          recognized.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Background upload, resume after disconnect, and
          bandwidth throttling are concerns of the uploader. PDF
          page preview, video first-frame extraction, and rich
          editing UI are concerns of specialized field types
          built on top of this one.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Previews must generate without freezing the main thread.
          Image thumbnails go through
          <code> createImageBitmap</code> and are resized off-main
          via a worker for files larger than a threshold. The list
          virtualizes when count exceeds ~50. Hash-based dedup
          runs in a Web Worker so even large files don&rsquo;t
          block input.
        </p>

        <h3>Reliability</h3>
        <p>
          Invalid files are rejected with clear reasons and never
          break the form. Object URLs created for previews are
          revoked promptly to avoid memory leaks. Adding a file
          while a previous file is still being previewed must not
          desync the UI.
        </p>

        <h3>Security</h3>
        <p>
          Client validation is UX, not authorization — the server
          re-validates everything. Filename and metadata render as
          text, never as HTML; we treat user-supplied filenames as
          potentially hostile (a filename like
          <code> {`<img onerror=...>.png`}</code> must not execute).
          Object URLs are session-scoped and revoked on unmount.
        </p>

        <h3>Accessibility</h3>
        <p>
          Drop zone fully keyboard-operable. Drag-drop status
          announces only meaningful changes (drag entered, drag
          left, drop accepted/rejected). Per-file remove buttons
          carry descriptive labels including the filename. The
          file list is rendered as a real list with structural
          markup. Errors associate with the offending file via
          <code> aria-describedby</code>.
        </p>

        <h3>Maintainability</h3>
        <p>
          Validation logic is decoupled from UI: pure validator
          functions emit per-file issues. Preview generators are a
          registry keyed by MIME, so adding a PDF or video
          preview is a one-file addition.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The control is structured around four phases:
          <strong> ingest</strong>, <strong>validate</strong>,
          <strong> preview</strong>, and
          <strong> handoff</strong>. Each phase has clean
          responsibilities and clear inputs/outputs, so the control
          remains testable and the UI stays predictable even when
          one phase is in progress.
        </p>
        <p>
          On <strong>ingest</strong>, a unified pipeline accepts
          files from any source — picker, drop, paste,
          capture, folder traversal — and normalizes them into
          <code> File</code> objects with a stable client-generated
          id. The unified ingestion lets us apply the same
          validation and preview pipeline regardless of source. For
          drop events, we use
          <code> DataTransferItemList</code> with
          <code> webkitGetAsEntry</code> when folder upload is
          enabled, traversing the entry tree with a cap on depth
          and total file count to prevent a malicious or
          accidentally large folder from DoS-ing the browser. For
          paste events, we read
          <code> ClipboardEvent.clipboardData.files</code> for raw
          files and
          <code> ClipboardEvent.clipboardData.items</code> for
          image data URIs that we materialize into Blobs.
        </p>
        <p>
          On <strong>validate</strong>, the control runs each file
          through a chain of pure validators: size, MIME, extension,
          count, custom predicates (e.g. minimum image dimensions,
          allowed signature types). Validators emit
          <code> Issue</code> objects with stable keys and parameter
          bags, the same shape used by the form validation engine,
          so downstream rendering can treat them uniformly. Files
          split into <code>accepted</code> and
          <code> rejected</code> lists; rejected files appear in a
          dismissible list with their reasons rather than silently
          disappearing, so users understand what happened.
          Deduplication runs here: the control checks whether an
          incoming file matches any already-accepted file by
          (name, size) for cheap dedup or by content hash when
          enabled.
        </p>
        <p>
          On <strong>preview</strong>, accepted files get a
          preview generated lazily. Image previews use
          <code> createImageBitmap</code> off-main when possible
          and <code>URL.createObjectURL</code> for direct
          rendering otherwise. We cap thumbnail dimensions
          (typically 200&times;200) and decode at the requested
          size to avoid loading huge originals into memory.
          Object URLs are tracked and revoked when the file is
          removed or when the component unmounts. For non-image
          files, the registry returns a generic icon component
          keyed by MIME (PDF icon, document icon, etc.).
          PDF first-page rendering, video first-frame, and other
          rich previews are pluggable: a registered generator
          for the MIME runs in a worker and produces a
          thumbnail.
        </p>
        <p>
          On <strong>handoff</strong>, the form value emitted is a
          list of <code>FileEntry</code> objects, not raw
          <code> File</code> bytes. Each entry carries
          <code> {`{ id, file, previewUrl?, hash?, status, progress?, error? }`}</code>;
          the <code>file</code> field is the actual blob. The
          uploader (or any downstream consumer) takes this list
          and mutates per-entry status as it works; the file
          input subscribes to those mutations and updates UI
          accordingly. This split — file input owns ingestion;
          uploader owns transport — keeps each component coherent.
        </p>
        <p>
          <strong>Drag-and-drop accessibility</strong> deserves
          explicit attention because it&rsquo;s the most common
          place to get wrong. The drop zone is rendered as a
          button (<code>role=&quot;button&quot;</code>) reachable
          via Tab; Enter or Space invokes a hidden native
          <code> {`<input type="file">`}</code> via
          <code> ref.current.click()</code>. This pattern gives
          us native file picker accessibility while letting us
          style the drop zone freely. Drag enter / leave events
          update a visual state but do not rely on
          <code> dragover</code> announcements (which would spam
          the accessibility tree); we announce drop accepted /
          rejected with a single live region update. The hidden
          native input pattern is what makes the drop zone
          actually accessible without reinventing assistive
          technology integration.
        </p>
        <p>
          <strong>Folder traversal</strong> uses
          <code> DataTransferItem.webkitGetAsEntry</code> recursively.
          We cap depth (typically 3–5 levels) and total file count
          (typically a few hundred) before bailing. Without these
          caps, a user could drop their entire home directory and
          freeze the tab. We surface a polite warning when the cap
          triggers so users understand why some files were
          ignored.
        </p>
        <p>
          <strong>Hash-based deduplication</strong> uses the
          SubtleCrypto API in a Web Worker. The cost is real
          (hashing a 100 MB file takes a few seconds), so we make
          it opt-in per form. When enabled, hashing happens after
          validation and before preview; an entry is replaced if
          its hash matches an already-accepted entry. For most
          forms, name+size dedup is sufficient; hash dedup is for
          flows where users genuinely re-upload identical files
          and the noise matters.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/file-input-system-architecture.svg"
        alt="File Input System Architecture"
        caption="Four-phase pipeline: Ingest (drop / picker / paste / capture / folder) → Validate → Preview (off-main workers) → Handoff to uploader. The control owns ingestion; transport is a separate subsystem."
      />

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>FileInput</strong> is the outer control,
          responsible for label/error association, integration with
          the form runtime, and rendering DropZone + FileList.
        </p>
        <p>
          <strong>DropZone</strong> handles drag/drop UI states and
          click-to-open. It hosts the visible interactive surface
          and renders empty-state messaging including the active
          constraint set (&ldquo;PNG, JPG, up to 10 MB&rdquo;).
        </p>
        <p>
          <strong>FilePicker</strong> is a hidden native
          <code> {`<input type="file">`}</code> with the
          appropriate <code>accept</code>,
          <code> multiple</code>, and
          <code> capture</code> attributes. It&rsquo;s triggered
          imperatively from the DropZone&rsquo;s click handler. The
          native input is what gives us platform-correct picker
          UX (file system on desktop, photo library / camera /
          documents on mobile).
        </p>
        <p>
          <strong>FileList</strong> renders accepted files as a
          virtualized list (when count exceeds ~50). Each row is a
          <strong> FileTile</strong> showing thumbnail or icon,
          name, size, status, and per-file actions.
        </p>
        <p>
          <strong>Validators</strong> are pure functions composed
          into a chain: size, MIME, extension, count, custom. Each
          emits Issue objects keyed for i18n.
        </p>
        <p>
          <strong>PreviewRegistry</strong> maps MIME to preview
          generator. Built-in generators handle images
          (<code> createImageBitmap</code> off-main) and a
          fallback icon set; PDF, video, audio generators plug in.
        </p>
        <p>
          <strong>HashWorker</strong> handles SubtleCrypto-based
          dedup off the main thread. It&rsquo;s an optional
          dependency, only loaded when hash dedup is enabled for
          the form.
        </p>
        <p>
          <strong>FolderTraverser</strong> walks dropped entries
          with depth and count caps when folder upload is
          enabled.
        </p>
        <p>
          The architectural patterns are <strong>headless control
          with skinnable UI</strong> (the control emits state and
          events; the UI is replaceable),
          <strong> hidden native input pattern</strong> (best a11y +
          custom styling), <strong>strategy</strong> (pluggable
          preview generators per MIME), and <strong>off-main
          processing</strong> (workers for hashing and large-image
          decoding).
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Local state in the FileInput owns:
          <code> {`{ files: FileEntry[], rejected: RejectedEntry[], isDragOver, isHashing }`}</code>.
          Each entry carries its lifecycle: ingested → validated →
          previewing → ready → uploading → uploaded / failed.
          State transitions are explicit; the FileTile renders a
          variant based on the current state. The form value
          emitted to the form runtime is the
          <code> files</code> list (just IDs and metadata + the
          File blob); status mutations from the uploader flow
          through the form runtime back into the FileInput via
          subscription.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs to the control:
          <code> accept</code>, <code>maxSize</code>,
          <code> minCount</code>, <code>maxCount</code>,
          <code> multiple</code>, <code>capture</code>,
          <code> allowFolders</code>, <code>hashDedup</code>,
          <code> previewGenerators</code>,
          <code> value</code>, <code>onChange</code>.
          Outputs: <code>onChange(files, issues)</code>,
          <code> onError(issues)</code>,
          <code> onRemove(id)</code>,
          <code> onReorder(ids)</code>. The form contract is
          that the field value is an array of
          <code> FileEntry</code>, not raw bytes; downstream
          submission serializes by extracting
          <code> entry.file</code> and uploading via the
          uploader.
        </p>
      </section>

      <section>
        <h2>⚡ Performance Strategy</h2>
        <p>
          Image previews use <code>createObjectURL</code> for
          immediate display; for files above a threshold (say,
          5 MB), we generate a smaller bitmap via
          <code> createImageBitmap</code> with explicit
          <code> resizeWidth</code> and
          <code> resizeHeight</code> options so the browser
          decodes at thumbnail size, never at full size. Decoding
          happens off-main when supported via a worker that
          fetches the file, decodes it, transfers an
          <code> ImageBitmap</code> back to the main thread via
          structured clone. Hashing runs in a worker. The
          FileList virtualizes when count exceeds 50, keeping
          DOM size bounded. Object URLs are tracked in a Map
          keyed by entry id and revoked when the entry is
          removed or the component unmounts; without this we
          accumulate URL leaks proportional to file count.
        </p>
      </section>

      <section>
        <h2>🎨 UI/UX Considerations</h2>
        <p>
          The DropZone has distinct visual states for
          drag-over, drag-rejecting (e.g. wrong file type),
          drop-active. Empty state lists active constraints
          (&ldquo;PNG, JPG, up to 10 MB&rdquo;) so users know
          what&rsquo;s allowed before they try. Per-file remove
          buttons are reachable by Tab and labeled
          &ldquo;Remove [filename]&rdquo;. Bulk actions (clear all,
          accept all rejected if remediable) are available when
          file count exceeds a threshold. Errors per file
          render inline; a top-level summary appears when many
          files fail at once. On mobile, the picker offers
          &ldquo;Take Photo&rdquo; and &ldquo;Photo Library&rdquo;
          via the <code>capture</code> attribute and large tap
          targets for the drop zone.
        </p>
        <p>
          Reorder uses a drag handle on each FileTile plus
          keyboard shortcuts (Ctrl+Shift+Up/Down) for users who
          can&rsquo;t drag. Reorder updates the form value
          immediately so submitted order matches displayed
          order.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          The drop zone is a button reachable by Tab; Enter or
          Space invokes the native picker via
          <code> ref.current.click()</code>. Drag-over visual state
          is decorative; the live announcement happens only on
          drop with a summary (&ldquo;3 files added; 1 rejected:
          file too large&rdquo;). The file list uses
          <code> {`<ul>`}</code> with each item as
          <code> {`<li>`}</code>; remove buttons are explicitly
          labeled with the filename so screen reader users know
          what they&rsquo;re removing. Errors are associated with
          their FileTile via <code>aria-describedby</code>;
          screen readers announce them when the file is
          focused. Reorder is operable via keyboard with
          announced position changes.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Client validation is UX; the server is the security
          boundary. We do not trust extension or MIME from the
          client. Filenames render as text — a filename
          containing HTML or script characters cannot execute.
          Object URLs are session-scoped (created with
          <code> URL.createObjectURL</code>) and revoked on
          remove or unmount; we never persist them across
          sessions, which would create dangling reference
          leaks. We cap the total bytes ingested in memory and
          warn the user if the cap is approached, so a malicious
          or accidentally huge drop doesn&rsquo;t exhaust browser
          memory. Folder traversal caps depth and count.
        </p>
        <p>
          For especially security-sensitive flows (signing PDFs,
          uploading to financial systems), we recommend
          server-side virus scanning before storage and
          presigned-URL upload directly to the storage backend
          to keep file bytes off the application server. The
          file input is agnostic to those choices; it just
          surfaces the bytes.
        </p>
      </section>

      <section>
        <h2>🧪 Testing Strategy</h2>
        <p>
          Unit tests cover validators (size, MIME, extension,
          count) against canonical inputs, the folder traverser
          against nested test fixtures, and the dedup logic for
          name+size and hash modes. Integration tests exercise
          the full pipeline: drop a mix of valid and invalid
          files; assert accepted and rejected lists, preview
          generation, and removed entries. We run keyboard-only
          flows: Tab to drop zone, Enter to open picker,
          select files, verify focus returns appropriately.
          We test the worker code paths (hash, preview) in
          isolation. End-to-end tests in real browsers verify
          drag-and-drop correctness because synthetic drag
          events in jsdom are notoriously unfaithful.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases &amp; Failure Handling</h2>
        <p>
          User drops a folder: traverse with depth and file count
          caps; surface a warning if the cap triggers. Same file
          dropped twice: dedup by name+size (or hash if enabled);
          mark the duplicate with a soft note rather than
          silently dropping it. Mixed valid and invalid drop:
          accept valid, list rejected with reasons; never reject
          the entire batch. Browser autofill into a file
          input: rare but possible (some accessibility tools
          do this); treat as a normal user action. iOS Safari
          quirks with <code>capture</code> attribute: test
          camera vs library paths explicitly. Very large image
          previews exhaust memory: cap thumbnail dimension and
          release the original blob from JS reference once the
          thumbnail is generated. User removes a file mid-upload:
          notify the uploader to abort that file&rsquo;s in-flight
          request. Drag-leave fires when entering a child
          element of the drop zone (the
          <code> dragenter/dragleave</code> bubbling quirk):
          track entered targets in a Set to determine real
          leave. Pasting an image from a screenshot (no
          filename): synthesize a name from the timestamp and
          MIME.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability &amp; Extensibility</h2>
        <p>
          The PreviewRegistry is the primary extension point —
          new MIME types plug in with a single registration.
          Custom validators add via the validator chain. The
          FileInput exposes a headless mode (renders nothing,
          exposes refs and state) so teams can build entirely
          custom UIs while reusing the ingestion and validation
          logic. Theming is design-token-driven; each subcomponent
          accepts <code>className</code> overrides for surgical
          customization. The control plugs into any form
          runtime that supports a custom field type
          contract.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Constraint messages and error text resolve through the
          host&rsquo;s i18n function. File sizes format via
          <code> Intl.NumberFormat</code> with byte units
          appropriate to the locale. Reorder position
          announcements (&ldquo;Moved file to position 3 of 7&rdquo;)
          go through i18n with parameter bags. RTL layout flips
          via CSS logical properties; the file tile alignment
          adapts naturally without separate code paths.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs &amp; Design Decisions</h2>

        <h3>Hidden native input vs fully custom drop zone</h3>
        <p>
          Hidden native input plus a styled button is the right
          balance. The native input gives us platform-correct
          picker UX (file system, camera, photo library) and
          accessibility for free; the styled button lets us
          design a drop zone that fits the product. A fully
          custom drop zone without a native input is harder to
          make accessible and loses platform integration; we
          avoid it.
        </p>

        <h3>Hash dedup vs name+size dedup</h3>
        <p>
          Name+size dedup is essentially free and catches the
          common case (same file dropped twice). Hash dedup is
          accurate but costs CPU (seconds for large files). We
          default to name+size and gate hash dedup behind an
          opt-in for forms that genuinely need it. The cost
          model matters: spending 5 seconds hashing a 1 GB file
          before the user can do anything is a worse experience
          than occasionally accepting two files that turn out
          to be identical.
        </p>

        <h3>Folder upload vs files only</h3>
        <p>
          Folder upload is powerful for legitimate use cases
          (uploading a project, a media library) but cross-browser
          support varies and accidental drops can be
          enormous. We gate folder upload behind a flag with
          aggressive depth and count caps. The default is
          files-only; folder upload is opt-in with explicit UX
          (&ldquo;Drop a folder or files&rdquo;).
        </p>

        <h3>Upload here vs upload elsewhere</h3>
        <p>
          We deliberately do not implement upload in this
          control. The uploader is a separate system with its
          own concerns (chunking, resume, retry, queue
          management); folding it into the file input would
          create a god component that&rsquo;s hard to reason
          about. The clean handoff via FileEntry list is the
          architectural seam that keeps both components
          coherent.
        </p>

        <h3>Strict client validation vs permissive</h3>
        <p>
          Strict validation reduces wasted upload bandwidth and
          gives immediate feedback. Permissive validation (let
          the server reject) is simpler but makes for a
          frustrating UX on slow connections. We default to
          strict — every constraint declared in the schema is
          enforced client-side — while always re-validating on
          the server because client validation is UX, not
          authorization.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          OPFS-backed staging would let us write incoming files
          to a private origin file system before upload,
          handling truly massive files (multi-GB) without
          memory pressure. Service-Worker-driven background
          processing would let hashing and preview generation
          continue even after a tab is backgrounded. Direct-to-S3
          presigned-URL upload integration via the uploader
          would close the loop on common cloud storage
          patterns. Server-side image preview generation (via a
          thumbnail service the client requests on demand)
          would offload preview cost for very large images.
          Better OS-level integration on mobile (selecting from
          a cloud drive directly) would close the gap with
          native apps.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How is the drop zone made keyboard accessible?</strong>{" "}
          Render it as a button reachable by Tab; Enter or
          Space activates it; activation invokes a hidden
          native <code>{`<input type="file">`}</code> via
          <code> ref.current.click()</code>. The native input
          provides platform-correct picker accessibility for
          free; the visible button is just a styled trigger.
        </p>

        <p>
          <strong>2. Why hide the native input but keep it in the
          DOM?</strong> Hiding (via <code>display:none</code> or
          <code> visibility:hidden</code>) is fine because we
          activate it imperatively. Keeping it in the DOM gives
          us the platform&rsquo;s file picker dialog and all its
          accessibility integration, which would be very hard to
          re-implement. Removing it and rebuilding the picker
          UX is a common mistake.
        </p>

        <p>
          <strong>3. How do you generate previews without freezing the
          main thread?</strong>
          <code> createImageBitmap</code> with explicit
          resizeWidth / resizeHeight off-main via a worker for
          large images. For small images, we use
          <code> URL.createObjectURL</code> directly. We cap
          thumbnail dimensions and release original blob
          references once the thumbnail is in hand.
        </p>

        <p>
          <strong>4. How do you dedupe files that the user drops
          twice?</strong> Name+size is the default — cheap and
          catches the common case. Hash-based dedup is opt-in
          for forms that genuinely need it; it runs in a worker
          using SubtleCrypto. Hash dedup costs CPU for large
          files, so it&rsquo;s not the default.
        </p>

        <p>
          <strong>5. What client validation do you trust, and what do
          you defer to server?</strong> Trust nothing
          authoritatively from the client. Client validation is
          UX — fast feedback, save bandwidth — but the server
          re-validates everything. Files passing client
          validation may still be rejected server-side after
          virus scan or content inspection.
        </p>

        <p>
          <strong>6. How do you handle folder drops?</strong>{" "}
          Use <code>DataTransferItem.webkitGetAsEntry</code>
          recursively with depth and total file count caps to
          prevent DoS. Surface a polite warning when the cap
          triggers so users understand why some files were
          ignored. Gate folder upload behind a feature flag
          because cross-browser support varies.
        </p>

        <p>
          <strong>7. How is memory leak prevented with object URLs?</strong>{" "}
          Track URLs in a Map keyed by file entry id; revoke on
          remove or unmount. Without explicit revocation, object
          URLs persist for the lifetime of the document, which
          accumulates leaks proportional to file count. The
          control owns this lifecycle so consumers
          don&rsquo;t have to remember.
        </p>

        <p>
          <strong>8. How does this integrate into a Form Builder&rsquo;s
          value model?</strong> The control registers as a custom
          field type. Its emitted value is an array of
          <code> FileEntry</code>; the form runtime carries this
          value in its store. The uploader (separately) reads
          the entries, transports the bytes, and writes status
          back through the form runtime; the file input
          subscribes to status changes and renders accordingly.
          The clean separation between ingestion and transport
          is what keeps both components coherent.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          The file input is a <strong>headless ingestion control</strong>{" "}
          that turns user intent (pick, drop, paste, capture)
          into a clean, validated list of file references. The
          four-phase pipeline — ingest, validate, preview,
          handoff — keeps responsibilities sharp and the UI
          predictable. The hidden native input pattern delivers
          accessibility for free; off-main preview and hash
          generation keep the main thread free; clean handoff to
          a separate upload subsystem keeps both components
          coherent. The control should feel boring and reliable
          in any form, leaving the interesting work to whichever
          subsystem actually does something with the bytes.
        </p>
      </section>
    </ArticleLayout>
  );
}

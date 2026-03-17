"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-file-system-access-api-concise",
  title: "File System Access API",
  description:
    "Deep dive into the File System Access API covering file handles, directory access, OPFS (Origin Private File System), and native-like file operations in the browser.",
  category: "frontend",
  subcategory: "data-storage",
  slug: "file-system-access-api",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: [
    "frontend",
    "storage",
    "File System Access",
    "OPFS",
    "file handles",
    "browser API",
  ],
  relatedTopics: ["indexeddb", "cache-api", "storage-quotas-and-eviction"],
};

export default function FileSystemAccessApiConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>File System Access API</strong> (formerly known as the Native File System API) is a web platform
          interface shipped in Chrome 86 (October 2020) that gives web applications the ability to read from and write
          to files and directories on the user&apos;s local device. Before this API, browser-based applications were
          limited to the read-only <code>{'<'}input type=&quot;file&quot;{'>'}
          </code> element and the one-shot download anchor trick for saving — neither of which supports the open-edit-save
          workflow that native desktop applications take for granted.
        </p>
        <p>
          The API addresses two fundamentally different storage scenarios. First, the <strong>picker-based APIs</strong> (
          <code>showOpenFilePicker</code>, <code>showSaveFilePicker</code>, <code>showDirectoryPicker</code>) let users
          grant a web app permission to interact with real files on their disk. The user stays in control: every access
          begins with an explicit gesture and a native OS file picker dialog. Second, the{" "}
          <strong>Origin Private File System (OPFS)</strong> provides a sandboxed, origin-scoped virtual file system
          that requires no user prompts at all. OPFS is invisible in the OS file explorer, managed entirely by the
          browser, and is designed for high-performance storage needs — think SQLite databases, application caches, and
          binary blobs that have no reason to live in the user&apos;s Documents folder.
        </p>
        <p>
          Together these two surfaces enable a class of web applications that was previously impractical: code editors
          that save directly to disk, image editors that handle multi-gigabyte files, and offline-first apps that persist
          structured data via OPFS-backed SQLite — all without installing a single native binary.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <h3>Picker APIs and File Handles</h3>
        <p>
          The three picker methods — <code>showOpenFilePicker()</code>, <code>showSaveFilePicker()</code>, and{" "}
          <code>showDirectoryPicker()</code> — are the primary entry points for interacting with the user&apos;s real
          file system. All three <strong>require a transient user activation</strong> (a click, tap, or keydown event)
          and return <code>Promise</code>-based results.
        </p>
        <p>
          <code>showOpenFilePicker()</code> returns an array of <code>FileSystemFileHandle</code> objects. Each handle
          is a persistent reference to a specific file; it does not hold the file data itself. You call{" "}
          <code>handle.getFile()</code> to obtain a standard <code>File</code> blob for reading, and{" "}
          <code>handle.createWritable()</code> to get a <code>FileSystemWritableFileStream</code> for writing.
          <code>showSaveFilePicker()</code> works similarly but opens a save dialog, creating a new file or overwriting
          an existing one. <code>showDirectoryPicker()</code> returns a <code>FileSystemDirectoryHandle</code> that
          provides methods to iterate entries, create subdirectories, and resolve paths within the tree.
        </p>
        <p>
          File type filters narrow what the picker displays. You pass an <code>accept</code> object mapping a
          human-readable description to an array of MIME types and/or extensions:{" "}
          <code>{'{'} description: &quot;Images&quot;, accept: {'{'} &quot;image/*&quot;: [&quot;.png&quot;, &quot;.jpg&quot;] {'}'} {'}'}</code>.
          The <code>multiple</code> option on <code>showOpenFilePicker</code> controls whether the user can select
          more than one file.
        </p>

        <h3>Permissions and User Gestures</h3>
        <p>
          Every picker call implicitly requests <strong>read permission</strong>. Write permission is separate: after
          obtaining a handle, you call <code>handle.requestPermission({'{'} mode: &quot;readwrite&quot; {'}'})</code>,
          which may trigger a second browser prompt asking the user to confirm edit access. You can check the current
          state with <code>handle.queryPermission()</code>, which returns <code>&quot;granted&quot;</code>,{" "}
          <code>&quot;denied&quot;</code>, or <code>&quot;prompt&quot;</code>.
        </p>
        <p>
          Permissions persist for the lifetime of the page session. On reload, the handle remains valid (if serialized
          to IndexedDB), but permission resets to <code>&quot;prompt&quot;</code> — the user must re-grant via a gesture.
          Chrome 122 introduced an experimental <strong>persistent permissions</strong> feature that allows trusted
          installed PWAs to retain permissions across sessions, though this is still behind a flag for most sites.
        </p>

        <h3>Origin Private File System (OPFS)</h3>
        <p>
          OPFS is accessed via <code>navigator.storage.getDirectory()</code>, which returns a{" "}
          <code>FileSystemDirectoryHandle</code> representing the root of a per-origin sandbox. Unlike the picker APIs,
          OPFS does not require user interaction, does not surface files to the operating system, and is subject to the
          same quota management as IndexedDB and Cache API (typically a percentage of available disk space, evicted under
          storage pressure unless the origin has requested <code>navigator.storage.persist()</code>).
        </p>
        <p>
          OPFS truly shines in <strong>Web Workers</strong>, where you can obtain a{" "}
          <code>FileSystemSyncAccessHandle</code> via <code>fileHandle.createSyncAccessHandle()</code>. This
          synchronous handle exposes <code>read()</code>, <code>write()</code>, <code>truncate()</code>, and{" "}
          <code>flush()</code> methods that operate on an <code>ArrayBuffer</code> — there are no promises, no
          streams, and no async overhead. This is the mechanism that makes running <strong>SQLite compiled to
          Wasm</strong> in the browser practical: the SQLite VFS (Virtual File System) layer maps directly onto
          these synchronous I/O calls, achieving near-native read/write throughput.
        </p>

        <h3>FileSystemWritableFileStream</h3>
        <p>
          For the async (main-thread-compatible) path, writing goes through a{" "}
          <code>FileSystemWritableFileStream</code>. This is a <code>WritableStream</code> with three key methods:{" "}
          <code>write()</code> accepts a <code>Blob</code>, <code>ArrayBuffer</code>, <code>TypedArray</code>, or
          string; <code>seek()</code> moves the cursor; and <code>truncate()</code> resizes the file. Changes are
          written to a temporary swap file and are only committed atomically when you call <code>close()</code>. If
          the tab crashes or you call <code>abort()</code>, the original file is untouched — a critical safety
          guarantee for editor-style applications.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The following diagram contrasts the two access paths. On the left, the picker-based flow requires explicit
          user gestures and permission grants to access real files on disk. On the right, OPFS provides a sandboxed
          virtual file system with no prompts, optimized for application-internal data.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/file-system-api-architecture.svg"
          alt="File System Access API architecture showing the two paths: picker-based access to user's real files and OPFS sandboxed storage"
          caption="Figure 1: Two access paths — Picker APIs for user files vs. OPFS for application data"
        />
        <p>
          The permission model is layered and session-scoped by default. Read access is granted implicitly when the
          user selects a file through a picker. Write access requires an explicit second grant. The diagram below
          shows the full permission lifecycle including what happens on page reload.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/file-system-permissions.svg"
          alt="File System Access API permission flow showing read access, write access escalation, and session lifecycle"
          caption="Figure 2: Permission flow — read vs. write access and session lifecycle"
        />
      </section>

      {/* ============================================================
          SECTION 4: Implementation Examples
          ============================================================ */}
      <section>
        <h2>Implementation Examples</h2>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">
          Example code moved to the Example tab.
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Trade-offs Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs Comparison</h2>
        <p>
          Choosing the right storage surface depends on whether you need user-visible files, high-throughput binary I/O,
          structured queries, or simple key-value persistence. The table below compares the four most relevant options.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="px-4 py-2 text-left font-semibold">Criteria</th>
                <th className="px-4 py-2 text-left font-semibold">File System Access (Picker)</th>
                <th className="px-4 py-2 text-left font-semibold">OPFS</th>
                <th className="px-4 py-2 text-left font-semibold">IndexedDB</th>
                <th className="px-4 py-2 text-left font-semibold">input[type=file]</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">User visible files</td>
                <td className="px-4 py-2">Yes — real disk files</td>
                <td className="px-4 py-2">No — browser sandbox</td>
                <td className="px-4 py-2">No</td>
                <td className="px-4 py-2">Read-only snapshot</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Write support</td>
                <td className="px-4 py-2">Full read/write with permission</td>
                <td className="px-4 py-2">Full read/write, no prompt</td>
                <td className="px-4 py-2">Full (structured data)</td>
                <td className="px-4 py-2">None (read-only)</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Sync I/O</td>
                <td className="px-4 py-2">No</td>
                <td className="px-4 py-2">Yes (Workers only)</td>
                <td className="px-4 py-2">No</td>
                <td className="px-4 py-2">No</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Performance</td>
                <td className="px-4 py-2">OS-level I/O</td>
                <td className="px-4 py-2">Near-native throughput</td>
                <td className="px-4 py-2">Good for structured data</td>
                <td className="px-4 py-2">Single read only</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Browser support</td>
                <td className="px-4 py-2">Chromium only</td>
                <td className="px-4 py-2">Chrome, Firefox, Safari*</td>
                <td className="px-4 py-2">All browsers</td>
                <td className="px-4 py-2">All browsers</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Permission model</td>
                <td className="px-4 py-2">User gesture + prompt</td>
                <td className="px-4 py-2">Automatic (origin-scoped)</td>
                <td className="px-4 py-2">Automatic</td>
                <td className="px-4 py-2">User selects file</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Best for</td>
                <td className="px-4 py-2">Editors, save-to-disk workflows</td>
                <td className="px-4 py-2">SQLite/Wasm, app caches, binary data</td>
                <td className="px-4 py-2">Structured app state, offline data</td>
                <td className="px-4 py-2">Simple file uploads</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-muted">
          *Safari supports OPFS but only the asynchronous methods — <code>createSyncAccessHandle</code> is not
          available in Safari as of early 2026. Firefox supports OPFS sync access in Workers.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <ol>
          <li>
            <strong>Always initiate pickers from user gestures.</strong> The API requires transient activation. Calling{" "}
            <code>showOpenFilePicker()</code> from a <code>setTimeout</code> or a promise chain that has lost its
            activation context will throw a <code>SecurityError</code>. Wire pickers directly to{" "}
            <code>onClick</code> handlers.
          </li>
          <li>
            <strong>Use OPFS for application-internal data.</strong> If the user does not need to see, rename, or move
            the files, OPFS is faster, simpler (no permissions), and available cross-browser. Reserve the picker APIs
            for workflows where the user explicitly chooses a file location.
          </li>
          <li>
            <strong>Handle permission denial gracefully.</strong> Users can deny the permission prompt or revoke access
            at any time. Always wrap <code>requestPermission()</code> and <code>createWritable()</code> calls in
            try/catch blocks and provide clear UI feedback when access is lost. Do not retry prompts in a loop —
            browsers will suppress repeated requests.
          </li>
          <li>
            <strong>Persist handles in IndexedDB for returning sessions.</strong> <code>FileSystemFileHandle</code> and{" "}
            <code>FileSystemDirectoryHandle</code> are structured-cloneable and can be stored in IndexedDB. On the next
            visit, retrieve the handle and call <code>queryPermission()</code> — if the user re-grants via a gesture, you
            skip the file picker entirely. This enables &quot;recent files&quot; lists.
          </li>
          <li>
            <strong>Move heavy I/O to Web Workers.</strong> OPFS synchronous access handles are only available off the
            main thread. Even for picker-based files, reading large blobs in a Worker prevents UI jank. Transfer{" "}
            <code>ArrayBuffer</code> data between threads using <code>postMessage</code> with transferables.
          </li>
          <li>
            <strong>Always close writable streams.</strong> Forgetting to call <code>close()</code> on a{" "}
            <code>FileSystemWritableFileStream</code> means changes are never committed to disk. Use try/finally or
            the <code>using</code> keyword (TC39 Explicit Resource Management) where supported.
          </li>
          <li>
            <strong>Implement feature detection, not browser detection.</strong> Check for the existence of{" "}
            <code>window.showOpenFilePicker</code> rather than sniffing the user agent. For OPFS, check{" "}
            <code>navigator.storage?.getDirectory</code>. Provide fallbacks — <code>{'<'}input type=&quot;file&quot;{'>'}
            </code> for reading, download anchors for saving.
          </li>
          <li>
            <strong>Respect storage quotas for OPFS.</strong> OPFS shares the origin&apos;s storage quota with
            IndexedDB and Cache API. Call <code>navigator.storage.estimate()</code> before large writes and request
            persistent storage (<code>navigator.storage.persist()</code>) for critical data that should survive
            eviction.
          </li>
        </ol>
      </section>

      {/* ============================================================
          SECTION 7: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <ol>
          <li>
            <strong>Assuming picker APIs work cross-browser.</strong> <code>showOpenFilePicker</code>,{" "}
            <code>showSaveFilePicker</code>, and <code>showDirectoryPicker</code> are Chromium-only (Chrome, Edge,
            Opera). Firefox and Safari have explicitly declined to implement these APIs, citing security and
            philosophical concerns about granting web apps persistent disk access. You must always provide a fallback
            path using <code>{'<'}input type=&quot;file&quot;{'>'}</code> and download anchors.
          </li>
          <li>
            <strong>Confusing OPFS browser support with picker support.</strong> OPFS (
            <code>navigator.storage.getDirectory()</code>) has broader support — Chrome, Firefox, and Safari all
            implement the async surface. However, <code>createSyncAccessHandle()</code> is not available in Safari,
            which breaks Wasm-based SQLite in that browser. Test each capability independently.
          </li>
          <li>
            <strong>Expecting permissions to survive page reload.</strong> By default, permissions reset when the page
            is unloaded. Developers who persist handles in IndexedDB often forget that the next session requires a
            fresh <code>requestPermission()</code> call gated behind a user gesture. Without this, the handle is
            usable for <code>queryPermission()</code> only.
          </li>
          <li>
            <strong>Serializing handles incorrectly.</strong> File handles are structured-cloneable but not
            JSON-serializable. You cannot <code>JSON.stringify()</code> a handle. You must store them in IndexedDB
            (which uses the structured clone algorithm) or transfer them via <code>postMessage</code> to Workers.
          </li>
          <li>
            <strong>Blocking the main thread with large file operations.</strong> Even though{" "}
            <code>FileSystemWritableFileStream</code> is async, writing multi-gigabyte files on the main thread still
            causes GC pressure and jank. Offload large reads and writes to a Worker using OPFS sync access handles
            or by transferring buffers.
          </li>
          <li>
            <strong>Not handling the AbortError from cancelled pickers.</strong> When a user dismisses the file picker
            without selecting a file, the promise rejects with an <code>AbortError</code>. This is not an exceptional
            case — it is normal user behavior. Catch it explicitly and do nothing rather than surfacing an error toast.
          </li>
          <li>
            <strong>Leaving writable streams open across navigations.</strong> If a user navigates away while a{" "}
            <code>FileSystemWritableFileStream</code> is open, the swap file is abandoned and the original file is
            unchanged (which is safe), but any unsaved edits are silently lost. Use the <code>beforeunload</code>{" "}
            event to warn users about uncommitted writes.
          </li>
        </ol>
      </section>

      {/* ============================================================
          SECTION 8: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Code Editors</h3>
        <p>
          VS Code for the Web (<code>vscode.dev</code>) uses the File System Access API to open local folders, edit
          files, and save changes directly — replicating the desktop experience. The directory handle provides a
          complete view of the project tree, and write-back happens through <code>createWritable()</code>. For
          browsers that lack picker support, it falls back to a virtual file system backed by IndexedDB.
        </p>

        <h3>Image and Design Editors</h3>
        <p>
          Applications like Photopea and Figma leverage the API to open PSD, SVG, and proprietary design files
          from disk, edit them in a canvas-based editor, and save-as back to the original location or a new file.
          The ability to overwrite in place (rather than forcing a download) is the key UX improvement over the
          traditional download-anchor approach.
        </p>

        <h3>Document and Spreadsheet Apps</h3>
        <p>
          Google Docs and Sheets can open local <code>.docx</code> and <code>.xlsx</code> files via the picker,
          provide a web-based editing experience, and export changes back to the same file. This &quot;round-trip
          editing&quot; flow eliminates the friction of manually importing and exporting files.
        </p>

        <h3>SQLite on OPFS</h3>
        <p>
          The <code>sqlite3</code> Wasm build from the official SQLite project uses OPFS synchronous access handles
          as its VFS backend. This enables full SQL databases in the browser with ACID transactions, achieving
          read throughput within 2x of native SQLite. Projects like <code>wa-sqlite</code>,{" "}
          <code>sql.js-httpvfs</code>, and Absurd SQL also target OPFS. This pattern is rapidly becoming the
          standard for complex offline-first web applications that outgrow IndexedDB&apos;s key-value model.
        </p>

        <div className="mt-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-200">When NOT to Use the File System Access API</p>
          <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300">
            <li>
              <strong>Simple file uploads</strong> — <code>{'<'}input type=&quot;file&quot;{'>'}</code> is sufficient,
              universally supported, and requires no feature detection.
            </li>
            <li>
              <strong>Small key-value data</strong> — <code>localStorage</code> or IndexedDB are simpler and
              cross-browser.
            </li>
            <li>
              <strong>Cache/offline assets</strong> — Use the Cache API with a Service Worker. It is purpose-built
              for HTTP responses and integrates with the fetch pipeline.
            </li>
            <li>
              <strong>Cross-browser requirement with no fallback budget</strong> — If you cannot afford to build
              and maintain a fallback path, avoid the picker APIs entirely.
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References</h2>
        <ul>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_API"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs — File System API
            </a>{" "}
            — Comprehensive reference for all interfaces including OPFS.
          </li>
          <li>
            <a
              href="https://web.dev/articles/file-system-access"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — The File System Access API: simplifying access to local files
            </a>{" "}
            — Google&apos;s guide with interactive demos and code samples.
          </li>
          <li>
            <a
              href="https://sqlite.org/wasm/doc/trunk/persistence.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              SQLite Wasm — Persistence via OPFS
            </a>{" "}
            — Official SQLite documentation on OPFS-backed persistence for the Wasm build.
          </li>
          <li>
            <a
              href="https://fs.spec.whatwg.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              WHATWG File System Standard
            </a>{" "}
            — The living specification for the File System API and Origin Private File System.
          </li>
          <li>
            <a
              href="https://web.dev/articles/origin-private-file-system"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Origin Private File System
            </a>{" "}
            — Deep dive into OPFS, sync access handles, and performance benchmarks.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 10: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <h3>
          Q1: How would you architect a web-based code editor that supports opening, editing, and saving local project
          directories — and what happens on browsers that don&apos;t support the File System Access picker APIs?
        </h3>
        <p>
          On Chromium browsers, use <code>showDirectoryPicker()</code> to obtain a{" "}
          <code>FileSystemDirectoryHandle</code> for the project root. Recursively iterate the directory with{" "}
          <code>handle.entries()</code> to build a file tree in memory. When the user opens a file, call{" "}
          <code>fileHandle.getFile()</code> to read its contents into the editor buffer. On save, call{" "}
          <code>fileHandle.createWritable()</code>, write the buffer, and <code>close()</code> to commit atomically.
          Store the directory handle in IndexedDB so the user can reopen the project on the next visit (after
          re-granting permission via a gesture). For Firefox and Safari, fall back to a virtual in-memory file system
          backed by IndexedDB or OPFS. Users import a folder by selecting a zip or using{" "}
          <code>{'<'}input type=&quot;file&quot; webkitdirectory{'>'}</code> (which is widely supported for reading).
          Writes go to the virtual FS, and exports are offered as zip downloads. The key architectural insight is to
          abstract the file system behind an interface — a <code>FileSystemProvider</code> — so the editor code never
          directly calls browser APIs. This lets you swap implementations (native FS, OPFS, IndexedDB, even a remote
          backend) without changing the editor core.
        </p>

        <h3>
          Q2: Explain the difference between OPFS async methods and <code>createSyncAccessHandle()</code>. When would
          you choose one over the other?
        </h3>
        <p>
          OPFS async methods (<code>getFile()</code>, <code>createWritable()</code>) work on the main thread and return
          promises. They are fine for occasional reads/writes of moderate-sized data. However, every await introduces
          microtask scheduling overhead and you cannot perform random-access reads (seek to offset, read N bytes)
          without reading the entire file into memory.{" "}
          <code>createSyncAccessHandle()</code> is available only in Web Workers and provides synchronous{" "}
          <code>read(buffer, options)</code> and <code>write(buffer, options)</code> with byte-level offset control.
          There is no promise overhead per operation — this matters enormously for workloads like SQLite, which may
          issue thousands of small reads per query. The synchronous handle also exclusively locks the file, preventing
          concurrent access — which is actually desirable for database engines that need exclusive write access. Choose
          async methods for simple UI-driven file operations on the main thread. Choose sync handles whenever you need
          high-throughput, low-latency, random-access I/O — and move that work to a dedicated Worker.
        </p>

        <h3>
          Q3: A product team wants to build a browser-based Photoshop competitor that can open and save PSD files up
          to 2 GB. What storage strategy would you recommend, and how would you handle the write-back flow?
        </h3>
        <p>
          For files of this size, you need to avoid loading the entire file into main-thread memory. Use{" "}
          <code>showOpenFilePicker()</code> to get a handle, then transfer that handle to a Web Worker via{" "}
          <code>postMessage</code>. In the Worker, use <code>handle.getFile()</code> to obtain a <code>File</code>{" "}
          object and read it in chunks using <code>file.slice(start, end).arrayBuffer()</code> — this keeps memory
          usage bounded. For intermediate state (undo history, layer data), use OPFS as a scratch space: write layer
          bitmaps to OPFS files using sync access handles in a Worker, which gives you fast random-access I/O without
          holding everything in RAM. When the user saves, open a <code>FileSystemWritableFileStream</code> on the
          original handle, stream the composed output in chunks, and <code>close()</code> to commit. The atomic
          write-to-swap-file behavior means a crash mid-save won&apos;t corrupt the original. For browsers without
          picker support, fall back to loading the file via <code>{'<'}input type=&quot;file&quot;{'>'}</code> and
          saving via a download — but warn the user that the save experience will be degraded (no in-place overwrite).
          The OPFS scratch space still works cross-browser, so undo/redo and layer persistence remain functional
          regardless of picker availability.
        </p>
      </section>
    </ArticleLayout>
  );
}

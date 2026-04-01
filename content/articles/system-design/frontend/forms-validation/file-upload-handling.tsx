"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-file-upload-handling",
  title: "File Upload Handling",
  description:
    "Comprehensive guide to File Upload Handling covering file input patterns, progress tracking, chunked uploads, multipart forms, validation, and production-scale upload architectures.",
  category: "frontend",
  subcategory: "forms-validation",
  slug: "file-upload-handling",
  wordCount: 5400,
  readingTime: 21,
  lastUpdated: "2026-04-01",
  tags: [
    "frontend",
    "file upload",
    "multipart form",
    "progress tracking",
    "chunked upload",
    "file validation",
  ],
  relatedTopics: [
    "form-serialization",
    "form-state-management",
    "client-side-validation",
  ],
};

export default function FileUploadHandlingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>File upload handling</strong> encompasses the complete
          lifecycle of uploading files from a user&apos;s device to a server or
          cloud storage: file selection via input elements or drag-and-drop,
          client-side validation (file type, size, dimensions), progress
          tracking during upload, error handling for failed uploads, and
          integration with form submission workflows. File uploads introduce
          unique challenges compared to standard form data — files are binary,
          potentially large (megabytes to gigabytes), and require special
          encoding (multipart/form-data) for transmission.
        </p>
        <p>
          The architecture of file upload handling has evolved significantly.
          Early web applications uploaded files directly to the application
          server, which stored them on disk or in a database. This approach
          doesn&apos;t scale — application servers become bloated with files,
          backup strategies become complex, and serving files from application
          servers wastes resources better dedicated to computation. Modern
          architectures upload files directly to object storage (Amazon S3,
          Google Cloud Storage, Azure Blob Storage) or specialized file hosting
          services (Cloudinary, Imgix for images), then reference files by URL
          in the application database.
        </p>
        <p>
          File upload handling involves multiple stages, each with specific
          concerns. <strong>File selection</strong> provides the UI for users to
          choose files (input type=&quot;file&quot;, drag-and-drop zones,
          clipboard paste). <strong>Client-side validation</strong> checks file
          type (MIME type, extension), size limits, and for images, dimensions
          and aspect ratio. <strong>Upload execution</strong> transmits the file
          to the server, either as a single request or in chunks for large
          files. <strong>Progress tracking</strong> provides visual feedback
          during upload. <strong>Error handling</strong> manages failed uploads
          (network issues, server errors, validation failures).{" "}
          <strong>Post-upload processing</strong> handles tasks like generating
          thumbnails, extracting metadata, or triggering downstream workflows.
        </p>
        <p>
          For staff-level engineers, file upload architecture requires thinking
          about system-wide concerns: How do we handle large files without
          timing out? How do we resume interrupted uploads? How do we prevent
          malicious file uploads (executable files disguised as images)? How do
          we scale to thousands of concurrent uploads? How do we handle file
          uploads in a serverless architecture where request duration is
          limited? These questions require holistic thinking about uploads as
          part of a broader system architecture.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>File Input Element:</strong> The HTML{" "}
            <code>&lt;input type=&quot;file&quot; /&gt;</code> element provides
            native file selection. Attributes control behavior:{" "}
            <code>accept</code> restricts file types (accept=&quot;image/*&quot;,
            accept=&quot;.pdf,.docx&quot;), <code>multiple</code> allows
            selecting multiple files, <code>capture</code> hints at camera
            access on mobile devices. The <code>files</code> property provides a
            FileList object containing File objects with metadata (name, size,
            type, lastModified).
          </li>
          <li>
            <strong>Drag-and-Drop:</strong> The HTML5 Drag and Drop API enables
            users to drag files from their filesystem and drop them onto a
            designated zone. Key events: <code>dragenter</code> (file enters
            drop zone), <code>dragover</code> (file is dragged over — must call
            preventDefault to allow drop), <code>dragleave</code> (file leaves
            zone), <code>drop</code> (file is dropped — access via
            event.dataTransfer.files). Drag-and-drop provides a more intuitive
            UX than file pickers, especially for multiple files.
          </li>
          <li>
            <strong>Multipart Form Data:</strong> The{" "}
            <code>multipart/form-data</code> encoding is required for file
            uploads. Each form field (including files) becomes a separate
            &quot;part&quot; with headers (Content-Disposition, Content-Type for
            files). Parts are separated by boundary markers. The browser
            automatically sets the correct Content-Type header with boundary
            when you pass a FormData object to fetch. Multipart encoding is
            larger than base64-in-JSON but is the standard for file uploads.
          </li>
          <li>
            <strong>Upload Progress:</strong> The XMLHttpRequest API provides
            upload progress events via <code>xhr.upload.onprogress</code>,
            giving bytes loaded and total. The fetch API doesn&apos;t natively
            support upload progress, but you can use XHR or implement progress
            tracking via ReadableStream. Progress feedback is critical for large
            files — users need to know upload is proceeding and estimate
            remaining time.
          </li>
          <li>
            <strong>Chunked Uploads:</strong> Large files (hundreds of MB or GB)
            should be uploaded in chunks rather than a single request. Chunking
            enables: resumable uploads (resume from last successful chunk if
            connection fails), parallel uploads (multiple chunks simultaneously
            for speed), progress accuracy (each chunk completion is a
            checkpoint), and server-side streaming (process chunks as they
            arrive). The client splits the file into chunks (typically 1-5 MB
            each), uploads them sequentially or in parallel, and the server
            reassembles them.
          </li>
          <li>
            <strong>Client-Side File Validation:</strong> Validate files before
            upload to avoid wasting bandwidth. Check file size (File.size in
            bytes), file type (File.type MIME type, but verify server-side as
            MIME types can be spoofed), and for images, dimensions (load image
            in Image object, check naturalWidth/naturalHeight). Show clear error
            messages: &quot;File too large (max 10MB)&quot;, &quot;Invalid file
            type (only PNG, JPG allowed)&quot;.
          </li>
          <li>
            <strong>Direct-to-Cloud Upload:</strong> Instead of uploading to
            your application server (which then forwards to storage), upload
            directly from the browser to object storage. This reduces server
            load and latency. The flow: (1) Request a signed upload URL from
            your server (with authentication/authorization), (2) Upload file
            directly to the signed URL (S3 presigned URL, GCS signed URL), (3)
            Notify your server of completion with the file URL. Services like
            Uploadcare, Filestack, and AWS S3 Browser Upload simplify this
            pattern.
          </li>
          <li>
            <strong>File Preview:</strong> For images and some file types, show
            a preview before upload. Use <code>URL.createObjectURL(file)</code>{" "}
            to create a blob URL that can be used as an image src. Revoke the
            URL with <code>URL.revokeObjectURL()</code> after use to free
            memory. For images, also show dimensions and file size. For PDFs,
            show the first page as a thumbnail (requires a library like
            pdf.js).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/forms-validation/file-upload-handling/upload-progress-flow.svg"
          alt="Upload Progress Flow showing progress tracking from file selection to completion"
          caption="Upload progress flow — file selection through validation, upload with progress tracking, to completion; multiple file upload with per-file and overall progress"
          width={900}
          height={500}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          File upload architecture consists of several components working
          together: the file selection UI (input or drop zone), client-side
          validation, the upload mechanism (XHR, fetch, or specialized library),
          progress tracking, error handling, and integration with form
          submission. For direct-to-cloud uploads, there&apos;s also the
          signed URL generation and callback flow.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/forms-validation/file-upload-handling/upload-architecture.svg"
          alt="File Upload Architecture showing file selection, validation, upload mechanism, and storage integration"
          caption="Upload architecture patterns — server-mediated (file→server→storage) vs direct-to-cloud (browser→storage via presigned URL); pros/cons comparison table"
          width={900}
          height={600}
        />

        <p>
          The architecture diagram shows two upload patterns. In the{" "}
          <strong>server-mediated pattern</strong>, files upload to your
          application server, which then stores them in object storage. This is
          simpler but adds server load. In the <strong>direct-to-cloud
          pattern</strong>, the browser uploads directly to object storage using
          a presigned URL from your server. This scales better but requires more
          complex client-side logic.
        </p>

        <h3>Upload Progress Flow</h3>
        <p>
          Progress tracking provides critical feedback during uploads. For
          XMLHttpRequest, the <code>upload.onprogress</code> event provides
          bytes loaded and total bytes. Calculate percentage as{" "}
          <code>(loaded / total) * 100</code>. For chunked uploads, track
          progress per chunk and aggregate. Show both percentage and estimated
          time remaining (based on current upload speed).
        </p>

        <h3>Chunked Upload Architecture</h3>
        <p>
          For large files, chunked uploads provide resilience and better user
          experience. The client splits the file into chunks (1-5 MB each),
          uploads them with retry logic, and the server reassembles them. If an
          upload fails, only the failed chunk needs retry, not the entire file.
          Services like AWS S3 Multipart Upload, Google Cloud Storage Compose,
          and Azure Block Blob provide native chunked upload support.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/forms-validation/file-upload-handling/chunked-upload-flow.svg"
          alt="Chunked Upload Flow showing file splitting, parallel chunk upload, and server reassembly"
          caption="Chunked upload architecture — file split into 5MB chunks, parallel upload with 3-5 concurrent streams, server reassembly; retry logic with exponential backoff"
          width={900}
          height={550}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          File upload decisions involve trade-offs between simplicity,
          scalability, and user experience.
        </p>

        <h3>Server-Mediated vs Direct-to-Cloud Upload</h3>
        <p>
          <strong>Server-mediated upload</strong> (file → your server → cloud
          storage) is simpler to implement — your server handles authentication,
          validation, and storage. The downside is server load (your server
          becomes a file proxy), bandwidth costs (you pay for ingress and
          egress), and scalability limits (server resources constrain upload
          capacity).
        </p>
        <p>
          <strong>Direct-to-cloud upload</strong> (file → cloud storage via
          presigned URL) scales better — your server only generates signed URLs,
          and the heavy lifting happens between the browser and cloud storage.
          The complexity is higher: client-side code handles upload logic,
          progress tracking, and error recovery. You also need to handle
          post-upload callbacks (notify your server when upload completes).
        </p>

        <h3>Single Request vs Chunked Upload</h3>
        <p>
          <strong>Single request upload</strong> is simple — one POST with the
          file in the body. This works well for small files (&lt;10 MB) and
          reliable networks. The downside is no resume capability — if the
          upload fails at 99%, you start over. Large files may timeout or fail
          on unstable connections.
        </p>
        <p>
          <strong>Chunked upload</strong> splits files into chunks uploaded
          independently. Benefits include: resumability (resume from last
          successful chunk), parallel uploads (faster for large files), progress
          accuracy (each chunk is a checkpoint), and server-side streaming
          (process as chunks arrive). The complexity is higher — chunk
          management, reassembly logic, and handling out-of-order chunk
          arrivals.
        </p>

        <h3>Upload Libraries</h3>
        <ul className="space-y-2">
          <li>
            <strong>Native (XMLHttpRequest/fetch):</strong> No dependencies,
            full control. XMLHttpRequest provides progress events; fetch
            requires workarounds. Best for simple use cases.
          </li>
          <li>
            <strong>Axios:</strong> Popular HTTP client with progress callback
            support via onUploadProgress. Cleaner API than XHR. Good middle
            ground.
          </li>
          <li>
            <strong>Dropzone:</strong> Full-featured drag-and-drop library with
            preview, progress, and upload management. Larger bundle size but
            feature-complete.
          </li>
          <li>
            <strong>React Dropzone:</strong> React-specific hook for
            drag-and-drop. Flexible, well-maintained, but requires building
            upload logic yourself.
          </li>
          <li>
            <strong>Uploadcare/Filestack:</strong> Managed upload services with
            CDN, transformations, and UI components. Highest level of
            abstraction, paid services, but minimal implementation effort.
          </li>
        </ul>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Validate Before Upload:</strong> Check file size, type, and
            dimensions client-side before initiating upload. Reject obviously
            invalid files immediately to save bandwidth and user time. Always
            re-validate server-side — client validation can be bypassed.
          </li>
          <li>
            <strong>Show Clear Progress:</strong> For files larger than 1 MB,
            show upload progress with percentage and estimated time remaining.
            Update progress smoothly (throttle updates to avoid excessive
            re-renders). For multiple files, show both per-file and overall
            progress.
          </li>
          <li>
            <strong>Implement Retry Logic:</strong> Network failures happen.
            Implement automatic retry with exponential backoff (retry after 1s,
            then 2s, then 5s). For chunked uploads, retry only failed chunks.
            Show retry status to users (&quot;Retrying... attempt 2 of 3&quot;).
          </li>
          <li>
            <strong>Handle Large Files:</strong> For files over 50-100 MB, use
            chunked uploads. Set appropriate chunk sizes (1-5 MB — larger chunks
            mean fewer requests but more data to retry on failure). Implement
            pause/resume functionality for very large files.
          </li>
          <li>
            <strong>Secure Upload URLs:</strong> For direct-to-cloud uploads,
            generate presigned URLs server-side with appropriate permissions
            (write-only, specific bucket/path, short expiration). Never expose
            cloud storage credentials to the client. Validate file metadata
            server-side before generating the signed URL.
          </li>
          <li>
            <strong>Provide Visual Feedback:</strong> Show file previews for
            images, icons for other file types, file names, sizes, and upload
            status (pending, uploading, complete, error). Allow users to remove
            files before upload starts. For completed uploads, show a thumbnail
            or file icon with a remove/replace option.
          </li>
          <li>
            <strong>Handle Errors Gracefully:</strong> Show specific error
            messages: &quot;Network error — please check your connection&quot;,
            &quot;File too large — maximum is 10MB&quot;, &quot;Invalid file
            type — only PNG and JPG allowed&quot;. Provide retry options where
            appropriate. Don&apos;t lose already-uploaded files on error — let
            users retry just the failed files.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Trusting Client MIME Types:</strong> File.type can be
            spoofed — a malicious user can rename an executable to .jpg and the
            browser will report it as an image. Always verify file types
            server-side by inspecting file magic numbers (file signature bytes)
            or using a file type detection library.
          </li>
          <li>
            <strong>Not Revoking Object URLs:</strong>{" "}
            <code>URL.createObjectURL(file)</code> creates a reference that
            consumes memory. Always call <code>URL.revokeObjectURL()</code>{" "}
            after you&apos;re done with the preview (e.g., after upload
            completes or component unmounts). Memory leaks from unrevoke URLs
            can crash the browser for applications with many file previews.
          </li>
          <li>
            <strong>Ignoring Mobile Considerations:</strong> Mobile users may
            upload photos directly from camera. These can be very large (5-20
            MB for modern phones). Consider client-side image compression before
            upload. Use the <code>capture</code> attribute appropriately
            (capture=&quot;user&quot; for front camera, capture=&quot;environment&quot;{" "}
            for rear camera).
          </li>
          <li>
            <strong>No Upload Timeout:</strong> Large uploads on slow networks
            can hang indefinitely. Implement upload timeouts and show clear
            error messages when exceeded. For chunked uploads, timeout per
            chunk, not for the entire file.
          </li>
          <li>
            <strong>Blocking Form Submission:</strong> Don&apos;t block the
            entire form until all files upload. Upload files first (in parallel
            if multiple), collect the resulting URLs, then submit the form with
            URLs included. This allows showing file-specific errors without
            losing other form data.
          </li>
          <li>
            <strong>Poor Error Recovery:</strong> When an upload fails, don&apos;t
            force the user to re-select the file. Keep the file in the UI, show
            the error, and provide a retry button. For chunked uploads, resume
            from the last successful chunk.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Social Media Image Upload</h3>
        <p>
          Social platforms handle massive image upload volumes. Users select
          images via drag-drop or file picker, client validates size and type,
          shows a preview with cropping/editing tools, then uploads directly to
          CDN (S3 + CloudFront). Progress is shown with a spinner or progress
          bar. After upload, the server generates thumbnails at multiple sizes,
          runs image optimization, and stores metadata. Failed uploads retry
          automatically.
        </p>

        <h3>Document Submission Portal</h3>
        <p>
          Legal or financial portals require document uploads (PDFs, Word docs)
          with strict validation. File type is verified by magic number, not
          extension. Files are encrypted client-side before upload (for
          sensitive documents). Upload uses chunked transfer for large
          documents. After upload, server-side virus scanning runs before the
          document is accepted. Users see detailed status: &quot;Scanning for
          viruses...&quot;, &quot;Processing...&quot;, &quot;Complete&quot;.
        </p>

        <h3>Video Upload Platform</h3>
        <p>
          Video uploads are large (hundreds of MB to GB) and require chunked
          upload with resume capability. The client splits video into 5 MB
          chunks, uploads in parallel (5-10 concurrent chunks), and tracks
          progress per chunk. If upload fails, only failed chunks retry. After
          upload completes, the server transcodes the video into multiple
          resolutions (1080p, 720p, 480p) for adaptive streaming. Users can
          continue using the app while upload proceeds in the background.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Common Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement upload progress tracking with the Fetch
              API?
            </p>
            <p className="mt-2 text-sm">
              A: The Fetch API doesn&apos;t natively support upload progress,
              but you have several options.
            </p>
            <p className="mt-2 text-sm">
              XMLHttpRequest approach: Use XHR instead of Fetch. XHR provides an
              upload.onprogress event that gives bytes loaded and total bytes.
              Calculate percentage as (loaded / total) * 100. Wrap the XHR in a
              Promise for cleaner async/await syntax.
            </p>
            <p className="mt-2 text-sm">
              Alternatively, use Axios which has built-in progress callbacks via
              onUploadProgress. For pure Fetch, you need to implement a custom
              body with progress tracking using ReadableStream, which is more
              complex.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Describe how you would implement resumable file uploads.
            </p>
            <p className="mt-2 text-sm">
              A: Resumable uploads require chunked upload with server-side
              tracking of received chunks.
            </p>
            <p className="mt-2 text-sm">
              Client-side: Split file into chunks (e.g., 5 MB each). Generate a
              unique upload ID for the file. Before uploading, query the server
              for already-received chunks. Upload only missing chunks.
            </p>
            <p className="mt-2 text-sm">
              Server-side: Store received chunks temporarily (S3 with upload ID,
              or local temp storage). Track chunk receipts in a database or
              cache (Redis). When all chunks arrive, reassemble them into the
              final file.
            </p>
            <p className="mt-2 text-sm">
              Resume logic: If upload fails, the client retries. Before
              retrying, it queries the server for received chunks and only
              uploads what&apos;s missing. AWS S3 Multipart Upload provides this
              natively — you initiate an upload (get upload ID), upload parts in
              any order, then complete the upload (server assembles parts).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you validate file types securely?
            </p>
            <p className="mt-2 text-sm">
              A: Client-side validation is for UX only — always validate
              server-side for security.
            </p>
            <p className="mt-2 text-sm">
              Client-side: Check File.type (MIME type) and file extension. This
              is easily bypassed but provides immediate feedback to honest users.
            </p>
            <p className="mt-2 text-sm">
              Server-side: Never trust the MIME type sent by the client. Read
              the file&apos;s magic numbers (first few bytes that identify file
              format). Use libraries like file-type (Node.js) or the Unix file
              command. For images, you can also try to load the image and check
              if it decodes successfully.
            </p>
            <p className="mt-2 text-sm">
              Additionally, scan uploaded files for malware (ClamAV, VirusTotal
              API), especially for user-generated content that will be downloaded
              by other users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the considerations for uploading files in a serverless
              architecture?
            </p>
            <p className="mt-2 text-sm">
              A: Serverless functions (AWS Lambda, Vercel Functions) have
              constraints that affect file uploads:
            </p>
            <p className="mt-2 text-sm">
              Timeout limits: Lambda has a 15-minute maximum execution time.
              Large uploads may exceed this. Use direct-to-S3 uploads with
              presigned URLs instead of proxying through Lambda.
            </p>
            <p className="mt-2 text-sm">
              Memory limits: Lambda memory is limited (up to 10 GB, but costly).
              Don&apos;t load entire files into memory. Stream files directly to
              S3.
            </p>
            <p className="mt-2 text-sm">
              Payload limits: API Gateway has a 10 MB payload limit. For larger
              files, use S3 presigned URLs and bypass API Gateway entirely for
              the upload.
            </p>
            <p className="mt-2 text-sm">
              Recommended pattern: Lambda generates a presigned S3 upload URL.
              Client uploads directly to S3. S3 triggers a Lambda (via S3 event
              notification) for post-processing (thumbnail generation, metadata
              extraction). This keeps Lambda execution time short and avoids
              payload limits.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle multiple file uploads with individual
              progress tracking?
            </p>
            <p className="mt-2 text-sm">
              A: Track progress per file and aggregate for overall progress.
            </p>
            <p className="mt-2 text-sm">
              Per-file state: Maintain a state object where each key is a file
              ID and the value contains progress percentage and status (pending,
              uploading, complete, error). Update this state as each file&apos;s
              upload progresses.
            </p>
            <p className="mt-2 text-sm">
              Overall progress: Calculate the average of all per-file progress
              values to show an overall progress bar. This gives users a sense
              of total completion even when files upload at different speeds.
            </p>
            <p className="mt-2 text-sm">
              Upload files in parallel (with concurrency limits — 3-5 concurrent
              uploads is typical to avoid overwhelming the network). Show both
              per-file progress bars and an overall progress indicator. Allow
              canceling individual uploads without affecting others.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle image optimization and resizing before upload
              to reduce bandwidth and storage costs?
            </p>
            <p className="mt-2 text-sm">
              A: Client-side image optimization reduces upload time, bandwidth
              costs, and storage requirements.
            </p>
            <p className="mt-2 text-sm">
              Canvas-based resizing: Load the image into an HTML5 Canvas
              element, then use canvas.toBlob() or canvas.toDataURL() to export
              at a smaller size. Specify quality (0.7-0.8 is usually good) and
              max dimensions (e.g., 1920x1080 for photos, 400x400 for avatars).
            </p>
            <p className="mt-2 text-sm">
              EXIF orientation: Mobile photos often have EXIF orientation
              metadata. When resizing, read the orientation and apply the
              correct rotation before exporting, otherwise images may appear
              rotated after upload.
            </p>
            <p className="mt-2 text-sm">
              Format conversion: Convert to modern formats like WebP or AVIF for
              better compression. Provide fallback to JPEG for browsers that
              don&apos;t support newer formats. Consider offering users a choice
              between &quot;Original&quot; and &quot;Optimized&quot; upload
              options.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN - Using Files from Web Applications
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuUploadObject.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              AWS S3 Multipart Upload
            </a>
          </li>
          <li>
            <a
              href="https://react-dropzone.js.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              React Dropzone Documentation
            </a>
          </li>
          <li>
            <a
              href="https://axios-http.com/docs/req_config"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Axios - Upload Progress Configuration
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

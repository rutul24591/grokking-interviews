"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-pdf-viewer-annotation-system",
  title: "Design a PDF Viewer Annotation System",
  description: "Principal-level media-rich system design covering page tiling, text extraction, annotation anchoring, offline notes, permissions, redaction, and search.",
  category: "high-level-design",
  subcategory: "media-rich-content-systems",
  slug: "pdf-viewer-annotation-system",
  wordCount: 3500,
  readingTime: 21,
  lastUpdated: "2026-05-29",
  tags: ["hld", "media", "frontend", "performance", "reliability"],
  relatedTopics: [],
};

const definition = [
  "Design a PDF Viewer Annotation System is a media-rich product system, not just a visual component. It must coordinate browser capabilities, large binary assets, local editing state, background jobs, CDN or storage behavior, permissions, abuse policy, and user-facing recovery. The main challenge is that media work is expensive: bytes are large, decoding is CPU-intensive, rendering can block interaction, and failures are often visible immediately.",
  "The goal is to design a PDF viewer annotation system around page tiling, text extraction, annotation anchoring, offline notes, permissions, redaction, and search. A principal-ready answer should explain the client runtime, backend control plane, asynchronous processing, storage and CDN strategy, consistency model, failure handling, cost controls, and observability.",
  "Media systems differ from ordinary CRUD systems because derived artifacts are first-class. Thumbnails, transcripts, waveforms, previews, tiles, manifests, captions, encodes, annotations, and exports are projections. They can lag or be regenerated, while original assets, permissions, and user edits need stronger durability.",
  "The product should define which state must survive refresh, which can be recomputed, which is private, which can be cached publicly, and which requires moderation or entitlement checks. Without this classification, media systems leak private assets, lose drafts, overrun device memory, or create inconsistent playback and editing experiences.",
  "A staff/principal answer should also cover operational ownership. Playback teams own QoE and buffer behavior; creation teams own draft recovery and export correctness; platform teams own storage, CDN, transcoding, and abuse controls; product teams decide when to degrade rich media to simpler experiences."
];
const concepts = [
  "The first concept is asset lifecycle. Raw uploads, derived previews, published artifacts, and deleted or redacted versions have different durability, cacheability, and privacy rules. page tile cache and text layer should never be treated as one generic blob path.",
  "The second concept is bounded client resources. Media-rich pages must manage memory, GPU, CPU, and network budgets. Large canvases, long documents, video buffers, waveforms, and image grids need virtualization, eviction, and adaptive quality.",
  "The third concept is asynchronous processing. Many operations cannot complete during the request: transcoding, scanning, rendering, exporting, OCR, waveform generation, and moderation. The UI needs job state, retry, cancellation where safe, and clear user messaging.",
  "The fourth concept is consistency. Original assets and permissions are authoritative. Derived media and previews can be eventually consistent, but must carry version identifiers so stale thumbnails, captions, annotations, or manifests do not appear as current truth.",
  "The fifth concept is abuse and safety. Media can contain malware, copyrighted material, unsafe content, personal data, or policy-violating streams. Scanning, moderation, rate limits, reporting, and takedown propagation are part of the system design, not add-ons.",
  "The sixth concept is observability. Track startup time, decode time, render frame drops, upload retry rate, processing queue age, export success, CDN hit ratio, moderation delay, permission-denied rate, and client memory pressure."
];
const architecture = [
  "The recommended architecture has five surfaces: page tile cache, text layer, annotation CRDT, permission service, search index. The client owns responsive interaction and local recovery. The API layer owns permissions, idempotency, and job creation. The processing plane owns expensive asynchronous work. Storage and CDN own asset distribution. Observability ties user symptoms to asset version, job ID, route, release, and device cohort.",
  "A user action should create durable intent before expensive processing begins. Uploads create sessions and chunk manifests. Edits update a draft log or document model. Playback records manifest and entitlement state. Exports create jobs with immutable input versions. This lets the system retry safely after browser refresh, worker failure, or regional outage.",
  "Derived artifacts should be keyed by source version and transformation parameters. If a video is re-encoded, a PDF is redacted, or a design file changes, old previews must not be confused with new ones. CDN invalidation should be precise and, where possible, replaced by versioned URLs.",
  "The client should render progressive states: placeholder, partial preview, processing, ready, failed, retryable, permission blocked, or policy blocked. These states are product semantics, not generic spinners. They tell users whether to wait, retry, change input, or contact support.",
  "The system should separate interactive paths from batch-heavy paths. Playback controls, editing cursor, annotation placement, and draft typing need low latency. Transcoding, full export, OCR, deep scanning, and global indexing can run asynchronously with backpressure.",
  "The diagrams show architecture, flow, and operations: the architecture view explains ownership boundaries, the flow view explains user intent through processing and delivery, and the operations view explains queue pressure, recovery, moderation, and QoE control loops."
];
const tradeoffs = [
  "Client-heavy processing can feel instant and reduce server cost, but it is limited by device capability, browser support, battery, and memory. Server-heavy processing is more predictable and easier to moderate, but adds queue latency and infrastructure cost. Mature systems usually use a hybrid.",
  "Eagerly generating every derivative gives fast later reads but wastes compute for assets that are never viewed. Lazy generation saves cost but can make first access slow. Principal designs choose by product criticality: thumbnails and safety scans are often eager; rare export formats can be lazy.",
  "Public CDN caching is excellent for published media but dangerous for private, permissioned, or recently revoked assets. Permissioned media needs signed URLs, short TTLs, versioned keys, and takedown propagation. The cache key is a security boundary.",
  "Optimistic editing improves flow, but edits need durable logs, conflict resolution, and recovery. For collaborative or offline editing, the design must choose OT, CRDT, server-authoritative locking, or merge-on-save based on the shape of the document and expected collaboration intensity.",
  "High visual fidelity competes with performance. A player can drop quality to avoid rebuffering; an editor can lower preview resolution while keeping export fidelity; a PDF viewer can render visible pages first. The product should make these trade-offs intentionally.",
  "Moderation before publication reduces user harm but slows creator workflows. Moderation after publication improves speed but can amplify abuse. Risk-based gating is usually better than one rule for every asset.",
  "Observability itself has cost and privacy risk. Capture event class, performance timings, asset IDs, and job IDs, but avoid logging raw document content, private annotations, media URLs with secrets, or user-entered text."
];
const practices = [
  "Model media as a lifecycle with immutable source versions, derived artifact versions, processing jobs, permission state, and deletion or redaction state. Make every derived object traceable to the source version that produced it.",
  "Use resumable upload and idempotent job creation. Browser crashes, mobile backgrounding, network loss, and worker retries should converge on one upload or processing job rather than duplicate assets.",
  "Keep interactive paths small. Use virtualization, bounded buffers, progressive decoding, idle work, worker threads where appropriate, and adaptive quality for constrained devices.",
  "Design explicit states for processing and failure. Users should know whether an asset is uploading, scanning, processing, ready, blocked, expired, or failed permanently. Support should see the same state with job history.",
  "Protect permissions at every derived surface: original file, thumbnail, transcript, annotation, search result, share preview, CDN URL, export, and notification. Derived media is often where privacy leaks happen.",
  "Build operational dashboards around user symptoms: playback startup, rebuffer, export queue age, upload resume success, annotation conflict rate, frame drops, failed processing jobs, and moderation SLA.",
  "Provide rollback controls for codecs, rendering engines, export workers, feature flags, and CDN publication. Media regressions can be severe because old clients and assets remain in circulation."
];
const pitfalls = [
  "A common pitfall is treating media as static files. In production, media has permissions, versions, processing state, cache state, moderation state, and support history.",
  "misaligned notes becomes visible quickly because media UX has little tolerance for pauses, jumps, or lost work. The design needs either prevention or honest recovery.",
  "stale permissions is often caused by mixing interactive and batch work in one path. Expensive jobs should not block low-latency controls unless the product absolutely requires it.",
  "redaction leaks needs explicit ownership and retry semantics. If a job can fail after the user leaves, there must be notification, retry, support visibility, or compensating state.",
  "offline conflicts should be considered during design, not after launch. Media products are natural abuse targets because images, video, documents, and streams can carry harmful or sensitive content.",
  "Another pitfall is missing cost governance. Transcoding, rendering, OCR, storage replication, CDN egress, and telemetry can dominate cost if the system eagerly processes every variant without demand signals."
];
const useCases = [
  "Legal contract review exercises the same principal design themes: durable intent, derived artifact lifecycle, client resource limits, permission enforcement, and operational recovery.",
  "Academic paper annotation exercises the same principal design themes: durable intent, derived artifact lifecycle, client resource limits, permission enforcement, and operational recovery.",
  "Enterprise document approval exercises the same principal design themes: durable intent, derived artifact lifecycle, client resource limits, permission enforcement, and operational recovery.",
  "An interviewer may push on device constraints. A strong answer explains how the UI adapts quality, bounds memory, uses background work carefully, and preserves the primary task when CPU or GPU is constrained.",
  "An interviewer may push on privacy. The answer should explain signed URLs, derived artifact permissions, local cache clearing, redaction propagation, and avoiding sensitive telemetry.",
  "An interviewer may push on incidents. The answer should cover queue backlog, worker rollback, CDN purge or versioning, disabled formats, degraded preview, and support-visible job history."
];
const questions = [
  {
    "question": "How would you design a PDF viewer annotation system end to end?",
    "answer": "I would model the media lifecycle first: source asset or document state, derived artifacts, permissions, processing jobs, client presentation, and operational telemetry. The client handles responsive interaction and local recovery, APIs enforce permission and idempotency, workers perform expensive processing, storage and CDN serve versioned artifacts, and observability links user symptoms back to asset version and job ID."
  },
  {
    "question": "Why choose this architecture over a simpler upload-and-display design?",
    "answer": "A simple upload-and-display design ignores derived artifacts, processing failures, permissions, moderation, cache invalidation, and device limits. It works for prototypes but fails when assets are large, private, collaborative, or safety-sensitive. The layered architecture adds complexity, but it isolates expensive work, makes retries safe, and gives operators control during incidents."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are misaligned notes, stale permissions, redaction leaks, offline conflicts. Scale also exposes CDN egress cost, processing queue backlog, hot assets, cache stampedes, memory pressure, long-tail device issues, and moderation delay. The prevention strategy is versioned artifacts, backpressure, adaptive quality, bounded client memory, queue observability, and remote rollback controls."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Original assets, permissions, and durable user edits need strong ownership and versioning. Derived media such as thumbnails, transcripts, previews, indexes, and exports can be eventually consistent, but must carry source version IDs and visible processing state. Collaborative editing may require CRDT, OT, or server-authoritative conflict resolution depending on the data model."
  },
  {
    "question": "How do you handle failure, privacy, cost, and observability?",
    "answer": "Failures are handled through resumable uploads, idempotent jobs, retryable processing, clear user states, and support-visible job history. Privacy requires permission checks on every derived surface, signed URLs, redaction propagation, and careful local storage. Cost is controlled through demand-aware derivative generation, cache hit targets, storage lifecycle policy, and telemetry sampling. Observability tracks QoE, queue age, job failures, cache behavior, and client resource pressure."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would separate interactive latency from batch processing, original truth from derived artifacts, and public assets from permissioned assets. Then I would explain which parts are optimized for immediacy, which are optimized for correctness, and which degrade during load or device pressure. That makes the trade-off defensible rather than generic."
  }
];
const references = [
  {
    "label": "MDN: Media Source Extensions",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API"
  },
  {
    "label": "MDN: WebCodecs API",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API"
  },
  {
    "label": "W3C: Media Source Extensions",
    "href": "https://www.w3.org/TR/media-source-2/"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "WebRTC specifications",
    "href": "https://www.w3.org/TR/webrtc/"
  },
  {
    "label": "Ink and Switch: local-first software",
    "href": "https://www.inkandswitch.com/local-first/"
  }
];

export default function PdfViewerAnnotationSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a PDF Viewer Annotation System around large payload handling, progressive rendering, processing pipelines, browser memory, permissions, and derived asset lifecycle. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: original content, derived renditions, metadata, and user annotations must remain independently recoverable and permission-safe.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a PDF Viewer Annotation System, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>{concepts.map((item, index) => index === 3 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: upload strategy, transcoding pipeline, preview rendering, CDN policy, annotation model, storage lifecycle, and failure fallback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/media-rich-content-systems/pdf-viewer-annotation-system-architecture.svg" alt="Design a PDF Viewer Annotation System architecture" caption="Architecture view: media lifecycle, client runtime, processing plane, storage, CDN, and control boundaries." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/media-rich-content-systems/pdf-viewer-annotation-system-collab.svg" alt="Design a PDF Viewer Annotation System flow" caption="Flow view: user intent, rendering or processing progression, fallback, and recovery states." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/media-rich-content-systems/pdf-viewer-annotation-system-operations.svg" alt="Design a PDF Viewer Annotation System operations" caption="Operations view: queue pressure, permission enforcement, moderation, QoE, rollback, and support visibility." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: time to first preview, processing lag, playback stalls, upload success rate, memory pressure, and derivative failure rate.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: corrupt derivatives, memory blowups, leaked private media, stalled processing, mismatched versions, and unavailable previews.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}

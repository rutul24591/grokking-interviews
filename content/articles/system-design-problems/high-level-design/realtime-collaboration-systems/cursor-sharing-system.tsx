"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-cursor-sharing-system",
  title: "Design a Cursor Sharing System",
  description: "Principal-level realtime collaboration system design covering shared state, ordering, CRDT/OT trade-offs, presence, conflict resolution, offline replay, fanout, abuse, and observability.",
  category: "high-level-design",
  subcategory: "realtime-collaboration-systems",
  slug: "cursor-sharing-system",
  wordCount: 3600,
  readingTime: 22,
  lastUpdated: "2026-05-29",
  tags: ["hld", "realtime", "collaboration", "crdt", "websocket", "sync"],
  relatedTopics: [],
};

const definition = [
  "Design a Cursor Sharing System is a realtime distributed product system where multiple clients observe, edit, or coordinate around shared state with low perceived latency. A principal-ready design treats a cursor sharing system as shared-state replication with product semantics, not just a websocket channel.",
  "The design must define what is durable, what is ephemeral, what can be approximate, what must be ordered, and what can be dropped. Durable edits, messages, lobby state, or meeting joins have different guarantees from cursors, typing indicators, heartbeats, viewport hints, and transient QoE signals.",
  "The visible frontend is responsible for responsiveness and local recovery, but the backend must own sequencing, authorization, fanout, replay, abuse controls, and observability. If every client invents its own truth, collaboration becomes inconsistent the moment users reconnect or edit concurrently.",
  "Realtime systems fail in user-visible ways: duplicated operations, lost updates, stale presence, delayed media, bad conflict resolution, and confusing pending states. The architecture should make these states explicit rather than hiding them behind generic loading spinners.",
  "A staff/principal answer should compare CRDT, OT, server-authoritative sequencing, locks, and eventual reconciliation. The right model depends on the data type, collaboration intensity, offline needs, auditability, and conflict cost."
];
const concepts = [
  "The first concept is state classification. cursor stream, presence registry, and viewport mapper should be classified as durable, derived, or ephemeral. Durable state needs replay and audit; ephemeral state needs freshness and expiry; derived state should be rebuildable.",
  "The second concept is ordering scope. Global total order is usually unnecessary and expensive. A document, room, board, lobby, or meeting can have its own sequence, while presence and cursor updates can use last-writer-wins with expiry.",
  "The third concept is conflict resolution. Text and structured document edits may use OT or CRDT. Object graphs may use operation transforms and snapshots. Lobbies may use server-authoritative state machines. Video conferencing uses signaling plus media adaptation rather than shared document merge.",
  "The fourth concept is local responsiveness. Clients should render local intent immediately where safe, mark it pending, then reconcile with server acknowledgement, transformed operations, or conflict decisions.",
  "The fifth concept is fanout and backpressure. Realtime systems can overload gateways and clients with low-value updates. Cursor, presence, typing, viewport, and QoE events should be sampled, coalesced, or dropped before durable edits are affected.",
  "The sixth concept is observability. Track operation ack latency, reconnect rate, missed-event replay, conflict rate, fanout pressure, stale presence, media QoE, dropped transient updates, and client/server version skew."
];
const architecture = [
  "The architecture contains cursor stream, presence registry, viewport mapper, rate limiter, fanout gateway. Clients keep local state and pending operations. Gateways authenticate connections and route room traffic. Sequencers or collaboration services assign order or merge operations. Snapshot stores compact history. Projections serve read-optimized views and replay.",
  "Every durable operation should include actor, target scope, client operation ID, base version or vector, schema version, authorization context, and idempotency key. This lets the system dedupe retries and explain why an operation was accepted, transformed, rejected, or replayed.",
  "Ephemeral events should have TTLs and rate limits. Presence, cursor, typing, viewport, and media quality hints should expire naturally because a missed disconnect or network loss should not leave a permanent artifact.",
  "Snapshots are essential at scale. Replaying an entire document, board, lobby, or room history from the beginning becomes too expensive. The system should periodically compact into snapshots while preserving enough operation history for audit, undo, and conflict repair.",
  "Authorization must be enforced on connect, read, write, replay, export, search, and notification surfaces. Collaboration state often leaks through presence, cursors, thumbnails, comments, and invitations even when the main document appears protected.",
  "Operations need controls for disabling a noisy ephemeral channel, rolling back a bad client version, replaying a room from snapshot, draining a gateway, isolating a hot room, and investigating missing or duplicated operations."
];
const tradeoffs = [
  "CRDTs support offline and peer-like convergence, but they can increase metadata size, make intent hard to express, and complicate authorization or undo. OT can preserve editing intent for text but is harder to generalize across arbitrary object graphs. Server-authoritative sequencing is simpler to reason about but weakens offline editing.",
  "WebSockets give low-latency bidirectional updates but require connection lifecycle, auth refresh, backpressure, and regional routing. Polling is simpler and robust but produces higher latency and more repeated work.",
  "Optimistic local updates improve responsiveness but can create visible rollbacks. For reversible, low-risk edits this is acceptable. For payments, permission changes, lobby readiness, or destructive actions, server confirmation should drive final UI.",
  "Strong consistency across all collaborators is expensive and often unnecessary. Durable document operations need convergence and replay. Presence, cursors, and typing can be approximate. Moderation, permission revocation, and room removal need fast enforcement.",
  "Coalescing transient events protects scale and battery but lowers fidelity. Sending every cursor pixel movement is wasteful; sending no cursor updates makes collaboration feel dead. Principal designs set per-event budgets.",
  "Regional routing improves latency but can split rooms or complicate sequencing. Room affinity, regional leaders, or global sequencers should be chosen based on collaboration intensity and correctness needs."
];
const practices = [
  "Design an explicit operation schema. Include actor, room/document ID, client op ID, base version, timestamp, schema version, and idempotency key.",
  "Keep durable and ephemeral channels separate. Durable edits need replay and acknowledgement; ephemeral presence and cursors need expiry, rate limits, and drop tolerance.",
  "Use snapshots and compaction. Bound replay cost while preserving audit history and enough operation log for recovery.",
  "Expose pending, synced, conflict, offline, reconnecting, and read-only states in the UI. Collaboration systems should not pretend every user sees the same state instantly.",
  "Enforce permissions on every surface: connection, read, write, replay, cursor/presence, comments, export, thumbnails, notifications, and support tools.",
  "Build abuse controls. Shared spaces need spam throttles, moderation, participant removal, report flows, and emergency room-level controls.",
  "Instrument from both client and server. Server ack latency alone does not reveal blocked main thread, dropped media frames, websocket reconnect loops, or client memory pressure."
];
const pitfalls = [
  "cursor flood usually means the system lacks clear operation identity, sequencing, or replay semantics. The fix is not more retries; it is a defined operation model.",
  "stale presence is often caused by treating ephemeral state as durable truth. Presence, cursor, and QoE hints need expiry and freshness rules.",
  "privacy leak shows that conflict policy must be product-specific. A game lobby, text editor, whiteboard, and video call do not share one merge strategy.",
  "viewport mismatch appears during reconnect and offline replay. The client should not blindly resend operations without idempotency and base-version context.",
  "Another pitfall is ignoring old clients. Realtime protocols need version negotiation and compatibility windows because users can keep stale browser tabs or mobile apps open for days.",
  "Teams also underestimate support needs. Operators should be able to inspect room membership, operation history, gateway region, client versions, replay gaps, and permission decisions without reading raw private content unnecessarily."
];
const useCases = [
  "design tool cursors needs low-latency local feedback while preserving convergence, authorization, replay, and operational recovery.",
  "document editor carets needs low-latency local feedback while preserving convergence, authorization, replay, and operational recovery.",
  "remote pair programming needs low-latency local feedback while preserving convergence, authorization, replay, and operational recovery.",
  "During a gateway outage, clients should reconnect with cursors, fetch missed durable events, discard expired ephemeral state, and avoid replaying already accepted operations.",
  "During a bad client rollout, operators should disable the affected feature, reject incompatible operation versions, and keep older rooms recoverable from snapshots.",
  "During abuse or spam, the system should throttle noisy actors, suppress low-value events, preserve evidence, and allow room owners or moderators to intervene safely."
];
const questions = [
  {
    "question": "How would you design a cursor sharing system end to end?",
    "answer": "I would classify state into durable operations, derived projections, and ephemeral realtime signals. Clients maintain local pending state and connect to authenticated gateways. Durable operations flow through a sequencer or merge service, are persisted in an operation log, compacted into snapshots, and replayed to reconnecting clients. Ephemeral channels use TTL and rate limits. Authorization, observability, rollback, and abuse controls are built into the protocol."
  },
  {
    "question": "Why this architecture over just broadcasting websocket messages?",
    "answer": "Broadcasting websocket messages is enough for a demo but not for recovery, replay, multi-device sync, authorization, conflict resolution, or support debugging. The operation-log plus snapshot model adds complexity, but it makes missed events recoverable and lets clients converge after reconnect or offline use."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are cursor flood, stale presence, privacy leak, viewport mismatch, plus hot rooms, reconnect storms, gateway overload, operation-log growth, stale clients, permission drift, and noisy ephemeral events. Prevention requires room affinity, backpressure, snapshots, protocol versioning, idempotency, replay cursors, and event priority tiers."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Durable shared edits need convergence and replayable ordering within a room or document. Presence, cursor, typing, and QoE events are ephemeral and eventually consistent with expiry. Permission revocation, moderation, room deletion, and destructive actions need fast server enforcement. The answer should classify state instead of claiming one model for everything."
  },
  {
    "question": "How do you handle failure, rollback, abuse, privacy, cost, and observability?",
    "answer": "Failure handling uses reconnect cursors, missed-event replay, snapshots, idempotency, and visible pending/offline states. Rollback uses protocol flags, client-version blocking, snapshot restore, and feature disablement. Abuse controls throttle noisy users and allow moderation. Privacy requires enforcing access on presence, cursors, exports, and notifications. Cost is controlled through coalescing ephemeral events and compacting logs. Observability tracks ack latency, reconnects, conflicts, fanout, and client QoE."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would defend separating durable operations from ephemeral signals because they need different guarantees. I would choose CRDT, OT, or server sequencing based on data shape and offline requirements. I would accept approximate presence but not approximate authorization. I would also explain why snapshots and replay are worth the operational complexity."
  }
];
const references = [
  {
    "label": "Automerge documentation",
    "href": "https://automerge.org/"
  },
  {
    "label": "Yjs documentation",
    "href": "https://docs.yjs.dev/"
  },
  {
    "label": "WebRTC specification",
    "href": "https://www.w3.org/TR/webrtc/"
  },
  {
    "label": "Matrix specification",
    "href": "https://spec.matrix.org/"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "Ink and Switch: local-first software",
    "href": "https://www.inkandswitch.com/local-first/"
  }
];

export default function CursorSharingSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Cursor Sharing System around presence, ordering, conflict resolution, offline reconciliation, fanout, and perceived realtime latency. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: participants must converge to a correct shared state while the UI clearly distinguishes local optimistic state from acknowledged collaborative state.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Cursor Sharing System, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>{concepts.map((item, index) => index === 2 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: transport choice, ordering model, CRDT or OT strategy, presence TTL, conflict policy, reconnect behavior, and backpressure.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/cursor-sharing-system-architecture.svg" alt="Design a Cursor Sharing System architecture" caption="Architecture view: clients, gateways, operation log, merge/sequencing, snapshots, authorization, and replay." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/cursor-sharing-system-workflow.svg" alt="Design a Cursor Sharing System flow" caption="Flow view: local intent, acknowledgement, fanout, replay, conflict handling, and recovery." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/cursor-sharing-system-scaling.svg" alt="Design a Cursor Sharing System operations" caption="Operations view: fanout pressure, conflict rate, reconnects, stale clients, abuse controls, and rollback." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: end-to-end event latency, reconnect rate, conflict rate, dropped events, presence accuracy, and convergence time.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: ghost presence, message reordering, duplicate events, split-brain edits, reconnect storms, and unbounded fanout cost.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}

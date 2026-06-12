"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-multi-channel-communication-hub",
  title: "Design a Multi-Channel Communication Hub",
  description: "Principal-level messaging and communication system design covering delivery semantics, ordering, read state, fanout, offline sync, privacy, abuse, and observability.",
  category: "high-level-design",
  subcategory: "messaging-communication",
  slug: "multi-channel-communication-hub",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-05-29",
  tags: ["hld", "messaging", "realtime", "notifications", "privacy", "sync"],
  relatedTopics: [],
};

const definition = [
  "Design a Multi-Channel Communication Hub is a communication system where correctness is user-visible: people notice missing messages, wrong unread counts, late notifications, broken drafts, and privacy leaks immediately. A principal-ready design treats a multi-channel communication hub as a distributed event and state synchronization problem, not simply a list of messages.",
  "The design must define message identity, ordering, delivery acknowledgement, read state, presence, offline behavior, notification policy, abuse controls, and recovery after reconnect. Different surfaces can be eventually consistent, but user intent and privacy-sensitive state need stronger guarantees.",
  "Communication systems also sit at the boundary between realtime UX and durable history. The UI should feel live, but messages, edits, deletes, receipts, and moderation decisions must survive refresh, device changes, network loss, and replay.",
  "A staff/principal answer should name what is authoritative: message append log, conversation membership, consent or preference policy, delivery receipt, read state, and moderation state. Derived views such as inbox rows, snippets, unread counts, search results, and push notifications can lag if they are observable and repairable.",
  "The system must be abuse-aware. Spam, phishing, harassment, notification bombing, large-room fanout, and provider outages are expected operating conditions, not rare edge cases."
];
const concepts = [
  "The first concept is message identity and ordering. Every message or communication event needs a stable ID, conversation or recipient scope, sender, timestamp, sequence or logical clock, edit/delete state, and idempotency key.",
  "The second concept is delivery semantics. Sent, accepted, delivered, read, failed, suppressed, and moderated are different states. Collapsing them into delivered creates incorrect UI and support confusion.",
  "The third concept is multi-device synchronization. channel router, template service, and delivery receipt must converge after offline use, app restart, token refresh, and reconnect.",
  "The fourth concept is privacy and membership. Conversation membership, blocks, consent, retention, legal hold, and channel policy must be enforced across message history, notifications, search, exports, and previews.",
  "The fifth concept is fanout and backpressure. Large rooms, high-volume channels, notification storms, and provider retries can overload clients and backend queues unless traffic is shaped by priority and recipient state.",
  "The sixth concept is observability. Track send success, delivery lag, unread drift, websocket reconnects, push receipt latency, provider failures, moderation actions, search indexing lag, and duplicate suppression."
];
const architecture = [
  "The architecture has channel router, template service, consent policy, delivery receipt, handoff timeline. The write path accepts user intent and appends durable events. The realtime path streams events to online clients. Projection workers build inboxes, unread counts, snippets, search documents, notifications, and analytics. Policy services enforce membership, consent, mute state, and moderation.",
  "Clients should maintain a local event cache and pending operation queue. This allows instant local rendering for pending sends while preserving authoritative reconciliation when the server accepts, rejects, edits, redacts, or reorders events.",
  "Ordering should be scoped. A global total order is unnecessary and expensive. Conversations or channels need stable ordering semantics, and cross-channel inbox projections can use per-conversation latest-event time plus tie-breakers.",
  "Read state and delivery receipts should be modeled separately. Read state is often per-user per-conversation and may be eventually consistent across devices. Delivery receipt may depend on device connectivity, provider acknowledgement, or policy suppression.",
  "The frontend should show truthful states: sending, sent, delivered, read, failed retryable, failed permanent, hidden by policy, deleted, edited, or blocked. These states reduce support issues and prevent dangerous duplicate user actions.",
  "Operations need controls to disable a provider, mute a noisy event type, replay a projection, rebuild search, quarantine spam, revoke a compromised sender, and inspect a message timeline with privacy-safe audit trails."
];
const tradeoffs = [
  "WebSockets or persistent connections give low-latency delivery but require connection management, backpressure, auth refresh, and fallback to polling. Polling is simpler but increases latency and cost at scale.",
  "Server-authoritative ordering prevents inconsistent history but can make local sends appear to move after acknowledgement. Local optimistic ordering feels responsive but needs reconciliation and visible pending states.",
  "Push notifications improve re-engagement but can leak private content on locked screens, violate user preferences, or amplify spam. Notification payloads should be minimized and policy-checked.",
  "Storing full local history improves offline UX but creates privacy, storage, and deletion challenges. A principal design caches only what is needed, encrypts where appropriate, and clears data on logout or device distrust.",
  "End-to-end encryption protects content privacy but limits server-side search, moderation, and support visibility. Systems must decide where encryption applies and how metadata, abuse reports, and recovery work.",
  "Strongly consistent unread counts are expensive and often unnecessary. Users tolerate slight unread drift if it converges quickly, but message loss, privacy leaks, and duplicate sends are not acceptable."
];
const practices = [
  "Use idempotency for send, edit, delete, mark-read, and notification creation. Retries from mobile devices and provider callbacks should converge on one logical event.",
  "Model conversation membership and consent as policy inputs for every surface: message fetch, push, email, search, preview, export, and support view.",
  "Keep pending local state visibly distinct from accepted server state. Users should know when a message or notification action is not yet durable.",
  "Use backpressure for realtime streams. Drop or coalesce low-value typing, presence, and read events before dropping durable messages.",
  "Build projection repair paths. Inbox rows, unread counts, search indexes, and digest summaries should be rebuildable from the authoritative event log.",
  "Create abuse controls for spam senders, phishing links, notification floods, and toxic threads. Moderation state should propagate to clients and notifications quickly.",
  "Instrument device cohorts separately. Messaging bugs often appear only on reconnect, app backgrounding, low battery, stale tokens, or older clients."
];
const pitfalls = [
  "wrong channel is usually caused by unclear ordering or reconciliation semantics. The design needs scoped sequence, idempotency, and client reconciliation.",
  "consent violation undermines user trust because communication UIs become task lists. Unread/read state should be observable, repairable, and separated from delivery.",
  "provider outage happens when privacy policy is enforced in the main view but not in notifications, previews, search, or exports.",
  "duplicate delivery should be expected for large rooms, provider retries, or viral notifications. Backpressure and throttling must be first-class.",
  "Another pitfall is treating push, email, websocket, and inbox as independent products. Users perceive them as one communication system, so policy and state must converge.",
  "Teams also forget retention and legal hold. Delete for user, delete for everyone, archive, export, and legal retention require explicit semantics."
];
const useCases = [
  "support hub requires durable event history, local responsiveness, policy enforcement, and eventually consistent projections that can be repaired.",
  "marketing communication center requires durable event history, local responsiveness, policy enforcement, and eventually consistent projections that can be repaired.",
  "transactional alert hub requires durable event history, local responsiveness, policy enforcement, and eventually consistent projections that can be repaired.",
  "During provider outage, the hub should fail over channels where allowed, queue retryable messages, suppress duplicates, and show delivery uncertainty clearly.",
  "During abuse spike, the system should throttle senders, reduce notification fanout, scan links, quarantine suspicious threads, and preserve review evidence.",
  "During reconnect, the client should fetch missed events from a cursor, reconcile local pending operations, update read state, and avoid replaying already accepted actions."
];
const questions = [
  {
    "question": "How would you design a multi-channel communication hub end to end?",
    "answer": "I would design an authoritative event log for durable communication events, realtime gateways for online delivery, projection workers for inboxes and unread counts, policy services for membership and consent, and client local state for pending operations and offline recovery. The frontend shows truthful delivery states while the backend owns ordering, idempotency, and enforcement."
  },
  {
    "question": "Why this architecture over direct client-to-client messaging or a simple notifications table?",
    "answer": "Direct client-to-client messaging cannot provide durable history, moderation, multi-device sync, search, retention, or support reconstruction. A simple notifications table cannot represent delivery, read state, retries, provider acknowledgements, and policy suppression. The event-log plus projection model adds complexity but makes the system repairable."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are wrong channel, consent violation, provider outage, duplicate delivery, plus reconnect storms, websocket fanout, unread drift, provider rate limits, spam waves, and projection lag. Prevention requires scoped ordering, backpressure, idempotency, projection repair, provider abstraction, and abuse controls."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Message append, membership, deletion/redaction, and consent policy need strong server control. Inbox rows, unread counts, search indexes, push delivery receipts, and presence can be eventually consistent if they converge and expose uncertainty. Read state usually accepts eventual consistency across devices."
  },
  {
    "question": "How do you handle failure, rollback, abuse, privacy, cost, and observability?",
    "answer": "Failures are handled with reconnect cursors, retry queues, provider failover, local pending state, and projection rebuilds. Rollback uses feature flags, provider disablement, and event replay. Abuse is controlled through rate limits, link scanning, reputation, and moderation. Privacy requires minimizing notification payloads and enforcing membership everywhere. Cost is controlled by coalescing presence/read events, batching, and sampling telemetry. Observability tracks send lag, delivery lag, reconnects, unread drift, provider errors, and moderation actions."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would separate durable message truth from derived communication surfaces. I would defend eventual unread counts but not eventual privacy enforcement. I would defend websocket complexity for realtime UX while keeping polling fallback. I would also acknowledge that E2EE, search, moderation, and support visibility create real trade-offs that must be product-specific."
  }
];
const references = [
  {
    "label": "Matrix specification",
    "href": "https://spec.matrix.org/"
  },
  {
    "label": "Slack engineering blog",
    "href": "https://slack.engineering/"
  },
  {
    "label": "RFC 5322 Internet Message Format",
    "href": "https://datatracker.ietf.org/doc/html/rfc5322"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "OWASP Logging Cheat Sheet",
    "href": "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
  }
];

export default function MultiChannelCommunicationHubArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Multi-Channel Communication Hub around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Multi-Channel Communication Hub, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>{concepts.map((item, index) => index === 1 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/messaging-communication/multi-channel-communication-hub.svg" alt="Design a Multi-Channel Communication Hub architecture" caption="Architecture view: durable event log, realtime gateway, projections, policy, and client sync." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/messaging-communication/multi-channel-communication-hub-flow.svg" alt="Design a Multi-Channel Communication Hub flow" caption="Flow view: send, acknowledge, deliver, read, moderate, notify, and recover." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/messaging-communication/multi-channel-communication-hub-operations.svg" alt="Design a Multi-Channel Communication Hub operations" caption="Operations view: fanout, reconnect, provider health, abuse controls, privacy, and projection repair." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: latency, error rate, fallback rate, conversion, stale-state duration, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: stale state, hidden partial failure, unbounded retries, ownership ambiguity, and missing observability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}

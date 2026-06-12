"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-resource-booking-system",
  title: "Design a Resource Booking System",
  description: "Principal-level scheduling and calendar system design covering availability, recurrence, time zones, resource holds, conflict detection, reminders, external sync, privacy, and observability.",
  category: "high-level-design",
  subcategory: "scheduling-calendar-systems",
  slug: "resource-booking-system",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-05-29",
  tags: ["hld", "calendar", "scheduling", "availability", "recurrence", "sync"],
  relatedTopics: [],
};

const definition = [
  "Design a Resource Booking System is a coordination system where correctness depends on time, people, resources, notifications, permissions, and external calendar state. A principal-ready design treats a resource booking system as a reservation and availability system, not just a date-picker UI.",
  "The hard problems are ambiguous time zones, recurrence, conflict detection, temporary holds, invitation state, external synchronization, reminder delivery, privacy, and operational repair. Users lose trust quickly when a system double-books them or sends incorrect reminders.",
  "The design should define authoritative state: event or reservation record, participant response, resource hold, recurrence rule, availability projection, notification state, and external sync cursor. Derived availability views and reminders can lag, but booking decisions need stronger protection.",
  "Calendar systems also have social and organizational semantics. A meeting can be tentative, accepted, declined, private, delegated, recurring, moved, canceled, or externally owned. A resource can require approval, capacity constraints, check-in, or cleanup time.",
  "A staff/principal answer should cover end-to-end creation, conflict checking, external sync, reminder delivery, cancellation, rollback, auditability, and how the system behaves when clocks, time zones, or provider integrations disagree."
];
const concepts = [
  "The first concept is time normalization. Store canonical instants in UTC, preserve the user's intended local time zone, and use a real time zone database for daylight-saving transitions. Recurring events need local-time semantics, not only UTC arithmetic.",
  "The second concept is reservation consistency. reservation ledger and conflict detector need atomic conflict checks for scarce resources or participant slots. Availability projections are useful, but final booking must revalidate authoritative state.",
  "The third concept is recurrence expansion. Recurrence rules should be stored compactly and expanded over bounded windows. Expanding unbounded recurring meetings into physical rows creates storage and update problems.",
  "The fourth concept is invitation workflow. Participants, resources, external guests, and approvers can each have independent state. The UI should not treat sent, delivered, accepted, tentative, declined, canceled, and failed as one status.",
  "The fifth concept is external sync. External calendar APIs are eventually consistent and can fail, rate limit, reorder, or replay changes. Sync needs cursors, idempotency, conflict policy, and user-visible stale states.",
  "The sixth concept is observability. Track booking conflict rate, hold expiry, reminder lag, sync error rate, recurrence expansion cost, timezone conversion errors, external provider latency, and user-visible stale availability."
];
const architecture = [
  "The architecture contains resource catalog, reservation ledger, conflict detector, approval workflow, check-in service. The write path creates or updates authoritative event/reservation state. The availability path builds read-optimized projections. The reminder path schedules notifications. The sync path reconciles external providers. The operations path repairs conflicts and failed notifications.",
  "Creation should begin with intent and validation: actor permission, participant/resource scope, requested time range, recurrence rule, buffer time, capacity, and policy constraints. Before committing, the system revalidates conflicts against authoritative records, not only cached availability.",
  "Temporary holds protect scarce slots during multi-step booking. A hold needs owner, resource, time range, TTL, idempotency key, and release semantics. Holds should expire automatically and be visible enough that users understand why a slot disappeared.",
  "Recurrence should store a rule, exceptions, cancellations, and moved instances. Query APIs can expand bounded windows for display. Edits should distinguish this instance, this and following, or all instances.",
  "Reminders and notifications should be driven by durable schedules. If a worker fails, reminders should be replayable without duplicate sends. Notification preferences and quiet hours must be respected.",
  "External sync should be asynchronous and conflict-aware. Provider events may arrive late or out of order. The system should store sync cursor, provider version, last successful sync, and conflict resolution decision."
];
const tradeoffs = [
  "Strong conflict checks protect users from double booking but add write latency and reduce availability during datastore issues. Cached availability improves browse performance but cannot be the final source of truth for booking.",
  "Pessimistic holds reduce conflicts but can make popular slots appear unavailable because users abandon flows. Optimistic booking improves utilization but creates more failed confirmations. TTL-based holds are usually the middle ground.",
  "Pre-expanding recurrence makes reads fast but creates huge update and deletion problems. On-demand bounded expansion is more flexible but needs efficient query windows and caching.",
  "External calendar sync improves adoption but adds rate limits, provider-specific semantics, privacy concerns, and eventual consistency. The UI should show sync uncertainty instead of pretending all providers are instantly consistent.",
  "Detailed reminders reduce no-shows but can become noisy or leak private event details. Notification payloads should respect event privacy, participant visibility, and channel preferences.",
  "Audit history helps support resolve disputes but stores sensitive calendar metadata. Retention, redaction, and access control are part of the design."
];
const practices = [
  "Use a proven recurrence and timezone model. Do not implement daylight-saving rules by hand. Preserve local-time intent for recurring events.",
  "Make final booking server-authoritative. Cached availability, client-side calendars, and external free/busy results are hints until revalidated.",
  "Use idempotency for create, update, cancel, RSVP, hold, reminder, and sync operations. Calendars are retry-heavy because clients and providers reconnect frequently.",
  "Separate event truth from projections: availability grids, notification schedules, search indexes, and external sync state should be rebuildable.",
  "Design explicit lifecycle states: proposed, held, confirmed, tentative, declined, canceled, expired, failed sync, failed reminder, and requires approval.",
  "Instrument provider-specific sync and reminder behavior. External API outages should not look like product bugs without context.",
  "Build repair tools for conflicting bookings, stuck holds, failed reminders, bad recurrence edits, and provider sync divergence."
];
const pitfalls = [
  "overbooking is the classic calendar failure. It happens when systems treat a local recurring meeting as fixed UTC or ignore daylight-saving transitions.",
  "ghost reservations occurs when recurrence is expanded without bounds or when edits to one instance mutate the wrong set of future events.",
  "approval bottleneck undermines trust because participants act on stale invite state. The UI should distinguish local state from externally synced state.",
  "capacity drift shows that notifications are part of the product contract. Late, duplicate, or privacy-leaking reminders can be as damaging as a wrong booking.",
  "Another pitfall is treating resource booking like ordinary CRUD. Scarce resources need conflict checks, holds, capacity rules, approvals, and operational repair.",
  "Teams also forget privacy. Free/busy is not the same as full event detail, and private events should not leak through reminders, search, availability suggestions, or support tools."
];
const useCases = [
  "conference room booking requires reliable time semantics, conflict checking, participant/resource state, reminders, and sometimes external calendar reconciliation.",
  "equipment reservation requires reliable time semantics, conflict checking, participant/resource state, reminders, and sometimes external calendar reconciliation.",
  "lab or facility scheduling requires reliable time semantics, conflict checking, participant/resource state, reminders, and sometimes external calendar reconciliation.",
  "During external provider outage, the system should keep local bookings safe, mark external sync stale, retry with backoff, and avoid overwriting newer provider state blindly.",
  "During a timezone rule change or daylight-saving bug, operators need to identify affected recurring events, replay expansion, notify impacted users, and preserve audit history.",
  "During a high-demand booking window, the system should use holds, rate limits, queueing, and clear expiry messaging to avoid overselling scarce slots."
];
const questions = [
  {
    "question": "How would you design a resource booking system end to end?",
    "answer": "I would model authoritative event or reservation state, recurrence rules, participant/resource status, temporary holds, notification schedules, and external sync cursors. The UI reads availability projections but final booking revalidates against authoritative records. Workers handle reminders and external sync with idempotency and replay. Operations need repair tools for conflicts, stuck holds, failed reminders, and provider divergence."
  },
  {
    "question": "Why this architecture over a simple events table?",
    "answer": "A simple events table cannot model recurrence exceptions, temporary holds, RSVP state, resource conflicts, external sync, reminders, privacy, and repair workflows. The layered model adds complexity, but it separates authoritative booking from projections and asynchronous side effects."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are overbooking, ghost reservations, approval bottleneck, capacity drift, plus hot resource contention, provider rate limits, sync loops, reminder fanout, stale availability caches, and support disputes. Prevention requires server-authoritative conflict checks, bounded recurrence expansion, idempotency, sync cursors, and operational repair."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Authoritative bookings, holds, resource conflicts, cancellations, and permission changes need strong server-side consistency. Availability grids, search, reminders, and external sync can be eventually consistent if they expose freshness and reconcile safely. Cached free/busy should never be the final booking decision."
  },
  {
    "question": "How do you handle failure, rollback, privacy, cost, and observability?",
    "answer": "Failures are handled through hold expiry, idempotent retries, reminder replay, sync backoff, and repair tools. Rollback uses event version history and provider reconciliation. Privacy requires free/busy controls and redacted notifications. Cost is controlled through bounded recurrence expansion, cached availability windows, and batched reminders. Observability tracks conflicts, sync lag, reminder lag, stale availability, and provider errors."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would defend server-authoritative final booking because double booking is worse than slight latency. I would defend cached availability for browsing because it improves UX, but only as a hint. I would use TTL holds to balance utilization and conflict prevention. I would also explain why recurrence and time zones require established standards rather than ad hoc logic."
  }
];
const references = [
  {
    "label": "RFC 5545 iCalendar specification",
    "href": "https://datatracker.ietf.org/doc/html/rfc5545"
  },
  {
    "label": "Google Calendar API concepts",
    "href": "https://developers.google.com/calendar/api/concepts"
  },
  {
    "label": "Microsoft Graph calendar API",
    "href": "https://learn.microsoft.com/en-us/graph/api/resources/calendar"
  },
  {
    "label": "IANA time zone database",
    "href": "https://www.iana.org/time-zones"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  }
];

export default function ResourceBookingSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Resource Booking System around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Resource Booking System, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>{concepts.map((item, index) => index === 1 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/scheduling-calendar-systems/resource-booking-system.svg" alt="Design a Resource Booking System architecture" caption="Architecture view: authoritative event or reservation state, availability projections, reminders, and external sync." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/scheduling-calendar-systems/resource-booking-system-flow.svg" alt="Design a Resource Booking System flow" caption="Flow view: proposal, hold, conflict check, confirmation, reminder, cancellation, and external reconciliation." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/scheduling-calendar-systems/resource-booking-system-operations.svg" alt="Design a Resource Booking System operations" caption="Operations view: timezone issues, stuck holds, recurrence repair, sync lag, reminder lag, and privacy controls." />
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

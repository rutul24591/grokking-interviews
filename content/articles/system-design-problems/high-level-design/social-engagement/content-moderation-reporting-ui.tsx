"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-content-moderation-reporting-ui",
  title: "Design a Content Moderation and Reporting UI",
  description: "Principal-level social engagement system design covering graph projections, ranking, privacy, moderation, virality, abuse controls, and operational recovery.",
  category: "high-level-design",
  subcategory: "social-engagement",
  slug: "content-moderation-reporting-ui",
  wordCount: 3400,
  readingTime: 21,
  lastUpdated: "2026-05-29",
  tags: ["hld", "social", "feed", "graph", "moderation", "ranking"],
  relatedTopics: [],
};

const definition = [
  "Design a Content Moderation and Reporting UI is a social-scale product system where the visible UI is only the last projection of graph state, ranking policy, media delivery, privacy rules, abuse controls, and user intent. A principal-ready design starts by separating durable social facts from derived surfaces.",
  "Durable facts include posts, follows, blocks, reports, shares, reactions, preferences, and moderation decisions. Derived surfaces include feeds, counters, notification groups, recommendations, summaries, search snippets, and ranking features. Derived surfaces can lag or be rebuilt; privacy and safety decisions must propagate quickly.",
  "The goal is to design a content moderation and reporting UI so users see relevant, fresh, and safe social content without exposing private actors, losing user actions, or amplifying abuse. The design must address graph scale, hot users, projection lag, mobile constraints, ranking changes, and trust-and-safety intervention.",
  "Social systems are adversarial. Engagement can be gamed, reports can be brigaded, spam can spread faster than review queues, and summaries can leak data that the main page hides. These are core architecture concerns, not policy details after launch.",
  "A staff/principal answer should name ownership boundaries: product owns ranking and user controls, integrity owns abuse detection, platform owns graph and fanout primitives, media owns asset safety and delivery, and operations owns incidents, takedowns, and review tooling."
];
const concepts = [
  "The first concept is graph-aware visibility. Every surface should call the same visibility policy for follow state, block state, private accounts, age restrictions, takedown state, regional policy, and viewer permissions. Inconsistency across feed, profile, notification, search, and share preview is a common privacy failure.",
  "The second concept is projection architecture. report intake, policy taxonomy, and review queue are optimized for different read patterns. The design should not force every UI to join raw social tables at request time.",
  "The third concept is hybrid fanout. Fanout-on-write makes ordinary feed reads fast but struggles with hot accounts. Fanout-on-read is flexible for ranking but expensive for every viewer. Mature systems combine precomputed home timelines, hot-author handling, cache windows, and online ranking.",
  "The fourth concept is stable pagination and dedupe. Feeds and notification lists should use opaque cursors tied to a ranking window or event sequence. Offset pagination fails when new content arrives, content is removed, or ranking changes mid-scroll.",
  "The fifth concept is integrity-aware ranking. Ranking should not blindly optimize clicks or shares. It should incorporate spam scores, report velocity, account reputation, block feedback, freshness, diversity, and policy constraints.",
  "The sixth concept is observability. Track fanout backlog, projection lag, ranking experiment health, duplicate rate, scroll restoration failures, moderation queue age, privacy invalidation delay, counter drift, and abuse escalation."
];
const architecture = [
  "The architecture has five cooperating planes: report intake, policy taxonomy, review queue, evidence store, appeal flow. The write plane records durable social facts and emits events. Projection workers build feed, profile, notification, counter, search, and analytics views. The read API serves surface-optimized projections. Integrity and moderation systems can remove or demote content quickly. The frontend renders stable cursors, pending actions, and recovery states.",
  "Writes should be idempotent and policy-checked. Follow, like, share, report, mute, block, and post actions need actor authorization, target visibility, rate limit, abuse score, and durable event emission. If the client retries, the backend should converge on one logical action.",
  "Projection workers should record source event sequence and policy version. This makes it possible to detect stale views and run fast invalidation when a block, takedown, private-account change, or legal removal occurs.",
  "Read APIs should be purpose-built. A home feed API needs ranked windows and dedupe. A profile API needs ownership, pinned content, privacy, counters, and media summaries. A notification API needs grouping and read state. A moderation UI needs evidence, queue priority, audit, and reviewer-safe presentation.",
  "The frontend should treat social actions as pending until acknowledged, but can use optimistic presentation for reversible low-risk actions. High-risk actions such as report submission, block changes, privacy changes, and account restriction need explicit confirmation and auditability.",
  "Operationally, social systems need kill switches and throttles for sharing, recommendations, notification fanout, media autoplay, comment creation, and report intake. Viral failures happen faster than normal deployments can respond."
];
const tradeoffs = [
  "Strong consistency for every counter and feed item is too expensive. Likes, follower counts, view counts, and notification grouping can be eventually consistent. Blocks, takedowns, private account visibility, and safety removals require fast invalidation and much stronger enforcement.",
  "Personalized ranking improves engagement but reduces explainability and can amplify harmful content. Chronological ranking is simpler and predictable but often less relevant. A principal design supports ranking guardrails, user controls, experiment holdouts, and integrity scoring.",
  "Fanout-on-write gives fast feed reads for ordinary accounts but creates write amplification for celebrities and viral posts. Fanout-on-read avoids massive writes but can increase read latency and backend load. Hybrid fanout is usually the defensible answer.",
  "Grouping notifications reduces fatigue but can hide important context or leak private actor information. Group summaries must be recomputed or redacted after privacy changes, blocks, deleted accounts, and moderation actions.",
  "Aggressive virality and sharing increase growth but also increase spam, fraud, harassment, and policy risk. Rate limits, reputation, link scanning, attribution validation, and circuit breakers are product architecture.",
  "Moderation before distribution reduces harm but increases latency and false positives. Moderation after distribution improves speed but can allow rapid amplification. Risk-based gating by account reputation, media type, virality, and policy class is more nuanced."
];
const practices = [
  "Centralize visibility policy and use it for every derived surface: feed, profile, search, notification, recommendation, share preview, email, push, and moderation queue.",
  "Use opaque cursors and dedupe sets for feeds. Cursor state should include enough ranking-window context to avoid duplicates, gaps, and scroll jumps after refresh or new content insertion.",
  "Track projection lag and invalidation latency as product SLOs. Privacy or safety invalidation should have a different urgency class from ordinary feed freshness.",
  "Use idempotency keys for social actions and report submissions. Duplicate taps, mobile retries, and offline replay should not create duplicate follows, reports, shares, or notifications.",
  "Build integrity and moderation tooling into the design. Reviewers need evidence, policy taxonomy, actor history, virality context, appeal state, and audit logs.",
  "Plan for hot objects. Celebrity posts, viral shares, live events, controversial content, and spam waves need cache isolation, rate limits, backpressure, and sometimes manual controls.",
  "Segment observability by surface, region, app version, ranking experiment, account class, and integrity bucket. Averages hide social failures because abuse and virality are highly skewed."
];
const pitfalls = [
  "queue overload is a scale failure that appears suddenly. The design should define hot-key handling, fanout backpressure, cache windows, and degraded behavior before traffic arrives.",
  "reviewer harm is usually caused by inconsistent policy enforcement across derived surfaces. Fixing the main UI is not enough if notifications, search, emails, or previews still expose restricted information.",
  "evidence loss undermines user trust because social products feel personal. Users notice missing posts, duplicate cards, incorrect counters, and unexplained ranking shifts quickly.",
  "policy inconsistency requires abuse-aware product design. Rate limits and classifiers help, but the system also needs support tooling, appeals, audit trails, and emergency controls.",
  "Another pitfall is treating moderation as a back-office queue only. At scale, moderation changes feed eligibility, ranking, notification delivery, profile visibility, and search indexing.",
  "Teams also underinvest in support reconstruction. When a user asks why they saw or did not see content, the system should expose ranking inputs, policy decisions, projection freshness, and moderation state at a safe level."
];
const useCases = [
  "user report flow requires graph visibility, ranking or grouping policy, projection freshness, and abuse controls to work together rather than as separate features.",
  "trust and safety console requires graph visibility, ranking or grouping policy, projection freshness, and abuse controls to work together rather than as separate features.",
  "appeal center requires graph visibility, ranking or grouping policy, projection freshness, and abuse controls to work together rather than as separate features.",
  "During a viral event, the system may need to reduce fanout, demote suspicious shares, disable some notification types, or route content to review without taking the whole social surface offline.",
  "During a privacy incident, the fastest path is not a UI patch. The system needs invalidation across projections, deletion from caches, search removal, notification redaction, and auditability.",
  "During an experiment rollout, teams should compare engagement lift against integrity metrics, report rate, block rate, hide rate, diversity, and long-term retention rather than only clicks."
];
const questions = [
  {
    "question": "How would you design a content moderation and reporting UI end to end?",
    "answer": "I would separate durable social facts from derived projections. Writes go through policy, rate limits, idempotency, and event emission. Projection workers build feed, profile, notification, counter, search, and moderation views with source sequence and policy version. Read APIs serve surface-specific projections, and the frontend renders stable cursors, pending states, privacy-safe summaries, and recovery states. Integrity, moderation, observability, and kill switches are part of the core design."
  },
  {
    "question": "Why this architecture over direct reads from source tables?",
    "answer": "Direct reads are simpler but fail at social scale because every surface needs different ranking, grouping, dedupe, privacy, and freshness behavior. Projection APIs let each surface optimize reads while still enforcing shared visibility and invalidation policy. The cost is projection lag and operational complexity, which must be measured and reconciled."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are queue overload, reviewer harm, evidence loss, policy inconsistency, plus hot users, viral content, counter drift, notification storms, moderation backlog, and cache stampedes. Prevention requires hybrid fanout, ranked windows, idempotent actions, integrity scoring, projection-lag monitoring, and emergency throttles."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Most engagement surfaces are eventually consistent: feeds, counters, ranking order, grouped notifications, and analytics. Privacy, blocks, takedowns, account restrictions, and safety removals need fast invalidation and strong enforcement. The design should explicitly classify each state instead of claiming one consistency model for the whole product."
  },
  {
    "question": "How do you handle abuse, privacy, rollback, cost, and observability?",
    "answer": "Abuse is handled through rate limits, reputation, classifiers, graph anomaly detection, link scanning, and review workflows. Privacy is enforced through shared visibility policy and projection invalidation. Rollback uses ranking flags, fanout throttles, notification kill switches, and moderation overrides. Cost is controlled through hybrid fanout, caching, batch projections, and approximate counters. Observability tracks fanout backlog, projection lag, duplicate rate, report velocity, and invalidation latency."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would explain which parts need strong enforcement and which can be eventual. I would defend hybrid fanout because it balances read latency and write amplification. I would defend projection APIs because social surfaces need ranking and privacy semantics that raw tables cannot provide efficiently. I would also acknowledge the cost: projection lag, more operations, and the need for reconciliation tooling."
  }
];
const references = [
  {
    "label": "Meta Engineering: TAO social graph storage",
    "href": "https://engineering.fb.com/2013/06/25/core-infra/tao-the-power-of-the-graph/"
  },
  {
    "label": "Twitter/X Engineering archive",
    "href": "https://blog.x.com/engineering/en_us"
  },
  {
    "label": "W3C ActivityPub recommendation",
    "href": "https://www.w3.org/TR/activitypub/"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "NIST online safety and platform governance resources",
    "href": "https://www.nist.gov/"
  }
];

export default function ContentModerationReportingUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Content Moderation and Reporting UI around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Content Moderation and Reporting UI, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>{concepts.map((item, index) => index === 2 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/social-engagement/content-moderation-reporting-ui.svg" alt="Design a Content Moderation and Reporting UI architecture" caption="Architecture view: graph writes, projections, ranking, privacy, integrity, and surface-specific reads." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/social-engagement/content-moderation-reporting-ui-flow.svg" alt="Design a Content Moderation and Reporting UI flow" caption="Flow view: user action, fanout or projection, ranking, notification, moderation, and recovery." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/social-engagement/content-moderation-reporting-ui-operations.svg" alt="Design a Content Moderation and Reporting UI operations" caption="Operations view: fanout backlog, projection lag, privacy invalidation, abuse signals, and moderation controls." />
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

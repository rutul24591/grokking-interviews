"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-priority-notification-delivery-ui",
  title: "Design a Priority Notification Delivery UI",
  description: "Principal-level notification delivery platform design covering preferences, consent, priority, channel routing, idempotency, provider failures, privacy, receipts, and observability.",
  category: "high-level-design",
  subcategory: "notification-delivery-platform",
  slug: "priority-notification-delivery-ui",
  wordCount: 3500,
  readingTime: 21,
  lastUpdated: "2026-05-29",
  tags: ["hld", "notifications", "delivery", "preferences", "privacy", "reliability"],
  relatedTopics: [],
};

const definition = [
  "Design a Priority Notification Delivery UI is a delivery and trust system. A principal-ready design treats a priority notification delivery UI as a policy-controlled communication platform, not as a queue that sends push, email, SMS, or in-app messages.",
  "The system must decide whether to notify, when to notify, which channel to use, how much content to reveal, how to respect preferences and consent, how to avoid duplicate or noisy delivery, and how to prove what happened when a user complains.",
  "Notifications sit between product urgency and user attention. A good platform protects critical messages without letting every product team label its event critical. The architecture needs priority, preference, quiet-hour, rate-limit, and abuse controls.",
  "The authoritative state includes event identity, recipient, topic, consent, preference version, policy decision, channel attempt, provider response, receipt, and user-visible notification state. Dashboards and analytics are derived from this delivery ledger.",
  "A staff/principal answer should cover fanout at scale, provider failures, idempotency, retries, digesting, channel fallback, privacy-safe payloads, user controls, operational kill switches, and observability."
];
const concepts = [
  "The first concept is event classification. priority classifier, urgency policy, and rate limiter determine whether an event is transactional, security-critical, workflow-critical, marketing, social, digestible, suppressible, or illegal to send without consent.",
  "The second concept is preference and consent resolution. Channel availability, user opt-in, quiet hours, topic preferences, tenant policy, regional law, and product priority should be resolved before a delivery attempt is created.",
  "The third concept is idempotent delivery. Every logical notification needs a stable notification ID so retries, duplicate events, provider callbacks, and multi-worker races do not spam the user.",
  "The fourth concept is channel strategy. Push, email, SMS, in-app, webhook, and digest channels have different latency, reliability, cost, privacy, and regulatory properties. Fallback should be policy-driven, not automatic for every failure.",
  "The fifth concept is attention budgeting. Rate limits, batching, digests, cooldowns, relevance scoring, and priority tiers protect users from fatigue and protect providers from traffic bursts.",
  "The sixth concept is observability. Track intake rate, policy suppression, preference suppression, queue lag, provider attempts, delivery success, receipt lag, duplicate suppression, complaint rate, unsubscribe rate, and critical missed alerts."
];
const architecture = [
  "The architecture contains priority classifier, urgency policy, rate limiter, digest scheduler, receipt tracker. Product systems emit notification intents. The platform resolves recipient, consent, preferences, priority, templates, and channel policy. Delivery workers send through providers. A delivery ledger records attempts, receipts, suppressions, and user interactions.",
  "Event intake should validate schema, source authorization, recipient scope, dedupe key, priority claim, and template variables. Product teams should not be allowed to send arbitrary payloads directly to providers.",
  "Preference resolution should be deterministic and versioned. A notification record should explain which preference version, consent state, topic taxonomy, quiet-hour policy, and tenant rule produced the decision.",
  "Delivery workers should use idempotency, retry budgets, provider-specific backoff, and dead-letter queues. A provider timeout should not automatically create another user-visible notification unless the policy allows retry or fallback.",
  "Payload rendering should be privacy-aware. Lock-screen push, email subject lines, SMS content, and in-app notifications may need different redaction. Sensitive messages can say an action is needed without revealing private details.",
  "Operations need controls for pausing a topic, disabling a provider, draining a queue, replaying failed transactional messages, suppressing a noisy product event, revoking a bad template, and auditing why a notification was or was not sent."
];
const tradeoffs = [
  "Centralized notification platforms improve consistency, compliance, and provider management, but they add dependency and governance overhead. Product-owned sending is faster initially but creates duplicate logic, inconsistent preferences, and provider sprawl.",
  "Immediate delivery is correct for security and transactional alerts, but noisy for low-priority engagement events. Digesting improves attention quality but can delay useful information. The priority taxonomy should drive this decision.",
  "Channel fallback improves reachability but can violate user expectations or consent. If push fails, SMS fallback may be inappropriate because SMS is more intrusive, expensive, and often more regulated.",
  "Rich payloads improve engagement but increase privacy risk. Minimal payloads are safer but may reduce clarity. Sensitive topics should prefer redacted payloads and authenticated deep links.",
  "Aggressive retries improve delivery probability but can create duplicate messages, provider throttling, and user annoyance. Retries need budgets, dedupe, and provider-specific backoff.",
  "Exact delivery analytics are difficult because providers expose different receipt semantics. A principal design distinguishes sent, accepted by provider, delivered, displayed, opened, clicked, suppressed, and failed."
];
const practices = [
  "Create a durable delivery ledger with event ID, recipient, topic, priority, preference version, policy decision, channel attempt, provider response, receipt, and interaction state.",
  "Use stable idempotency keys per logical notification. Retries, callback replays, and queue redelivery should update the same delivery record.",
  "Make preferences and consent a shared service used by every channel: push, email, SMS, in-app, webhook, and digest.",
  "Use a topic taxonomy with ownership. Every topic should have owner, priority range, allowed channels, default behavior, template rules, and suppression policy.",
  "Separate transactional, security-critical, workflow-critical, and marketing notifications. They have different consent, retry, fallback, and quiet-hour semantics.",
  "Build provider abstraction without erasing provider differences. Store provider-specific response codes and map them into platform-level states for operators.",
  "Instrument user harm signals: unsubscribe, mute, complaint, block, app notification disablement, duplicate reports, and missed-critical-event reports."
];
const pitfalls = [
  "alert fatigue usually comes from missing idempotency or treating each provider attempt as a new logical notification. Users experience this as spam, not resilience.",
  "missed urgent event should trigger provider failover or queueing only when policy allows it. Fallback without consent or urgency classification can be worse than delay.",
  "priority abuse often happens through payloads, previews, subject lines, or logs. Notification content should be treated as a privacy surface.",
  "quiet-hour violation is a system failure and a product failure. Rate limits, digests, cooldowns, topic ownership, and emergency suppressions are required.",
  "Another pitfall is using one global unsubscribe for every message type. Users need control, but some security or transactional notifications may be legally or product-critical.",
  "Teams also forget that provider accepted does not mean user saw it. Observability should not overstate delivery guarantees."
];
const useCases = [
  "incident paging UI requires event classification, preference resolution, channel policy, idempotent delivery, receipts, and user-visible recovery.",
  "financial risk alert requires event classification, preference resolution, channel policy, idempotent delivery, receipts, and user-visible recovery.",
  "critical account security notification requires event classification, preference resolution, channel policy, idempotent delivery, receipts, and user-visible recovery.",
  "During a provider outage, the platform should pause or reroute only eligible channels, preserve delivery records, avoid duplicate sends, and show provider-specific incident state.",
  "During a notification storm, operators should suppress the noisy topic, enforce rate limits, drain or drop low-priority queues, and preserve critical transactional delivery.",
  "During a privacy incident, teams should identify affected templates, payloads, channels, logs, and provider attempts so users and regulators can be notified accurately."
];
const questions = [
  {
    "question": "How would you design a priority notification delivery UI end to end?",
    "answer": "I would accept notification intents from product systems, validate schema and source authorization, resolve recipient, consent, preferences, quiet hours, priority, template, and channel policy, then create durable delivery records. Workers send through provider adapters with idempotency and retry budgets. Receipts and user interactions update the delivery ledger. Operators get controls for suppressing topics, disabling providers, replaying safe failures, and auditing decisions."
  },
  {
    "question": "Why this architecture over every product team sending its own push or email?",
    "answer": "Product-owned sending leads to inconsistent preferences, duplicate notifications, provider sprawl, privacy mistakes, and no central audit. A platform adds governance and latency, but it gives consistent policy, shared provider management, dedupe, receipts, and operational controls."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are alert fatigue, missed urgent event, priority abuse, quiet-hour violation, plus queue backlogs, provider throttling, template mistakes, unsubscribe spikes, preference cache drift, and receipt ambiguity. Prevention requires idempotency, priority queues, provider backoff, topic ownership, preference versioning, rate limits, and emergency suppression."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Consent, unsubscribe, channel blocks, and critical security policy need strong enforcement or fast invalidation. Delivery attempts and receipts are eventually consistent because providers respond asynchronously. Analytics and engagement metrics are derived. The delivery ledger should be authoritative for what the platform attempted and why."
  },
  {
    "question": "How do you handle failure, rollback, abuse, privacy, cost, and observability?",
    "answer": "Failures are handled through retry budgets, dead-letter queues, provider failover where allowed, and replay for safe transactional messages. Rollback uses topic suppression, template revocation, provider disablement, and preference cache invalidation. Abuse is controlled with rate limits and priority governance. Privacy uses redacted payloads and log minimization. Cost is controlled by digesting, channel policy, and provider routing. Observability tracks queue lag, provider errors, suppression, duplicates, receipts, complaints, and unsubscribe rates."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would classify messages by urgency, consent, reversibility, and privacy. I would defend immediate retry for critical transactional messages, but digest or suppress low-priority engagement. I would not automatically fail over to more intrusive channels without user consent. I would also distinguish provider accepted from user seen."
  }
];
const references = [
  {
    "label": "Firebase Cloud Messaging documentation",
    "href": "https://firebase.google.com/docs/cloud-messaging"
  },
  {
    "label": "Apple Push Notification service",
    "href": "https://developer.apple.com/documentation/usernotifications"
  },
  {
    "label": "Twilio Messaging documentation",
    "href": "https://www.twilio.com/docs/messaging"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "NIST Privacy Framework",
    "href": "https://www.nist.gov/privacy-framework"
  }
];

export default function PriorityNotificationDeliveryUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2>{concepts.map((item, index) => index === 1 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/notification-delivery-platform/priority-notification-delivery-ui.svg" alt="Design a Priority Notification Delivery UI architecture" caption="Architecture view: intake, preferences, policy, channel routing, delivery ledger, and provider adapters." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/notification-delivery-platform/priority-notification-delivery-ui-flow.svg" alt="Design a Priority Notification Delivery UI flow" caption="Flow view: event classification, preference resolution, channel attempt, receipt, digesting, and recovery." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/notification-delivery-platform/priority-notification-delivery-ui-operations.svg" alt="Design a Priority Notification Delivery UI operations" caption="Operations view: queue lag, provider outage, duplicate suppression, privacy, storm control, and user harm signals." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}

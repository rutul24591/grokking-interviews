"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-frontend-1m-concurrent-users",
  title: "Design a Frontend for 1M Concurrent Users",
  description: "Principal-level design for 1M concurrent frontend users covering CDN strategy, API protection, client concurrency, traffic shaping, incident modes, and cost governance.",
  category: "high-level-design",
  subcategory: "performance-scale-edge-cases",
  slug: "frontend-1m-concurrent-users",
  wordCount: 3600,
  readingTime: 22,
  lastUpdated: "2026-05-29",
  tags: [
  "hld",
  "frontend",
  "scale",
  "cdn",
  "traffic"
],
  relatedTopics: [
  "multi-region-frontend-architecture",
  "graceful-degradation-system"
],
};

const definition = [
  "Design a Frontend for 1M Concurrent Users is not a narrow rendering problem. It is a production system design problem where the frontend, edge, backend-for-frontend, platform APIs, observability, and product policy must work together for the product receives sudden or sustained traffic from one million concurrent users, often concentrated around launches, live events, promotions, or breaking news. A principal-ready answer starts by defining the user promise: what remains usable, what is allowed to be stale, what must be confirmed by the server, and what should be disabled before the product harms trust.",
  "The main goal is to keep static delivery, critical reads, and protected writes stable under massive fan-in while shedding nonessential work. The design should avoid the common trap of optimizing only average page load. Interviewers expect you to reason about p95 and p99 users, regional cohorts, low-end devices, dependency failures, and operational behavior during incident conditions.",
  "This topic sits at the boundary between product experience and distributed systems. The browser is not a passive renderer; it caches, schedules, retries, batches, predicts, persists state, and emits telemetry. Those client decisions can either protect the backend or multiply load during an outage.",
  "The scope should explicitly name what is in and out. In scope are route architecture, data loading, client scheduling, dependency handling, fallback behavior, observability, release guardrails, and user-facing recovery. Out of scope are rewriting every backend service or assuming unlimited network and device capability.",
  "A principal-level answer should also define decision ownership. Product owns which experiences can degrade. Platform owns shared performance budgets and observability contracts. Feature teams own route-level regressions. Operations owns incident playbooks and rollback controls. Without ownership, performance systems become dashboards that nobody acts on."
];
const concepts = [
  "The first core concept is an explicit user journey budget. For a frontend for 1M concurrent users, define budgets for startup, first useful content, first reliable interaction, bytes per route, request count, retry count, and background work. These budgets need route-level owners because a global average lets important cohorts fail quietly.",
  "The second concept is criticality tiering. Not every request, widget, script, metric, or personalization call deserves the same priority. Critical path work supports navigation, authentication, visible content, and correctness-sensitive actions. Secondary work supports recommendations, analytics, decorations, previews, and speculative prefetch.",
  "The third concept is client-side scheduling. The client should prioritize visible work, cancel obsolete requests, limit concurrency, pause nonessential background work, and avoid retry storms. Scheduling becomes especially important when cache misses stampede origins.",
  "The fourth concept is correctness classification. Some experiences can be optimistic or stale, while others require authoritative confirmation. Public content can use aggressive caching and stale-while-revalidate. User-specific writes need rate limits, idempotency, and authoritative server confirmation. Live counters may be approximate under load.",
  "The fifth concept is operational observability. A production design needs RUM, synthetic checks, edge metrics, API metrics, client error reports, long-task data, cache hit ratio, and release correlation. Metrics should be segmented by route, region, device class, network class, browser, and experiment variant.",
  "The sixth concept is progressive enhancement. The system should deliver a useful baseline first, then layer richer behavior when device, network, dependency, and permission state allow it. This is different from graceful failure after a rich app breaks; it is designing the baseline as a first-class product."
];
const architecture = [
  "The recommended architecture contains five cooperating layers: CDN and static asset tier, edge cache and compute, BFF/API gateway, rate limiting and queueing, client-side traffic governor. The exact technology choices vary, but the responsibility boundaries should be clear. The edge handles cacheable and regional concerns, the BFF shapes route payloads, the client schedules work and preserves local state, and telemetry closes the feedback loop.",
  "Requests should be grouped by route intent instead of by backend ownership. The browser should not make a sequence of dependent calls when a BFF or edge function can compose a page-specific response with stable latency and caching semantics. This reduces round trips and gives the platform one place to apply request budgets, timeouts, and fallback policy.",
  "The client should maintain a small runtime policy engine. It reads device and network hints, route priority, user intent, feature flags, and dependency health. Based on that policy it chooses image quality, prefetch aggressiveness, hydration priority, polling interval, cache strategy, and which widgets to defer.",
  "State should be split into durable server state, durable local intent, ephemeral UI state, and derived presentation state. Durable local intent matters when users act during degraded conditions. Ephemeral UI state should not be treated as truth after refresh or reconnect.",
  "The observability flow should correlate route render, data load, user interaction, dependency calls, cache behavior, errors, and release version. When a regression appears, engineers should know whether it came from a bundle change, third-party tag, CDN miss, backend latency, hydration error, feature flag, or experiment.",
  "The diagrams for this article should be read as architecture, flow, and operations views. The architecture diagram explains ownership boundaries. The flow diagram explains user-visible progression and fallback. The operations diagram explains how the system is observed, controlled, and recovered during abnormal conditions."
];
const tradeoffs = [
  "The first major trade-off is scale origins only versus tier traffic and protect correctness-critical APIs. Direct client access can be simple for small teams, but it creates route waterfalls, exposes backend shape to the browser, and makes fallback behavior inconsistent. A route-focused BFF adds another service tier, but it centralizes payload shaping, cache policy, and dependency control.",
  "cache everything at the edge can be attractive because it improves first paint and cacheability. The downside is that not all interactions become safe or fast just because the first HTML arrived quickly. You still need hydration or client logic, state reconciliation, and a plan for dynamic user-specific data.",
  "Aggressive caching improves latency and availability but creates correctness risk. Public static assets and editorial content can be cached heavily. User-specific data, entitlement checks, privacy-sensitive responses, and mutable transaction state require careful cache keys, short TTLs, or server confirmation.",
  "Optimistic UI improves perceived responsiveness but increases rollback complexity. It is appropriate for reversible actions such as toggling a view preference or drafting local text. It is unsafe for payment, permission, inventory, identity, deletion, and security-sensitive actions unless the UI clearly represents a pending state.",
  "Prefetching improves next-step latency but consumes bandwidth, battery, memory, and backend capacity. The principal answer should recommend intent-based prefetch, cohort-aware limits, data-saver respect, and cancellation when intent changes.",
  "Feature shedding protects the core journey but can damage product metrics or user trust if it is invisible. Degraded states should be explicit enough that users understand what happened, while avoiding noisy technical errors.",
  "Cost deserves a first-class trade-off. Every extra script, beacon, retry, cache miss, and speculative request becomes meaningful at scale. A principal design should defend a cost budget, not only a latency target."
];
const practices = [
  "Create route-level performance and resilience budgets. Budgets should include bytes, JavaScript execution, API calls, round trips, cache hit ratio, timeout rate, long tasks, and user interaction latency. Route owners should review budget changes during code review and release planning.",
  "Define a dependency criticality matrix. For each dependency, document whether it blocks rendering, blocks interaction, can use cached data, can fail open, can fail closed, or can be bypassed. This turns outage behavior from improvisation into design.",
  "Use idempotency and explicit pending states for writes. If the browser retries or the user refreshes, the backend should converge on one logical action. The UI should poll or subscribe to authoritative status rather than asking users to repeat dangerous actions.",
  "Use progressive loading and bounded resource use. Virtualize large lists, lazy-load below-fold widgets, cap memory caches, reduce image quality for constrained cohorts, and pause nonessential work while the user is interacting.",
  "Instrument the client as a production component. Track route timing, interaction timing, long tasks, hydration or render failures, cache state, retry count, timeout class, dependency health, and release version. Sample responsibly, but keep enough attribution to debug.",
  "Build rollback controls. Feature flags, remote config, kill switches, CDN invalidation, third-party script disablement, and route-level fallback switches should be available before an incident. These controls need audit logging and blast-radius limits.",
  "Exercise degraded modes continuously. Synthetic tests and game days should verify that fallback paths still work, because rarely used fallback code often rots faster than the primary path."
];
const pitfalls = [
  "A common pitfall is optimizing a lab metric while real users continue to fail. Lab tools are useful, but principal interviews expect field measurement segmented by real cohorts.",
  "Another pitfall is moving complexity to the client without operational controls. Client schedulers, local stores, and prefetchers can create backend load, stale data, or privacy issues if they are not governed.",
  "clients poll too aggressively. This is not a reason to avoid the technique entirely; it is a reason to bound it, observe it, and disable it remotely when it harms the system.",
  "analytics floods ingestion. A strong design identifies which actions need rollback, which need confirmation, and which should be blocked during degraded conditions.",
  "login and checkout become hot dependencies. Ambiguity is especially dangerous because users may repeat an action, support may not see the same state, and backend teams may reconcile the wrong records.",
  "Many designs forget support and operations. If a user reports a failed journey, support should see route, device, network cohort, dependency health, client state, server state, and recent release context without asking engineering to query raw logs."
];
const useCases = [
  "Ticket drop waiting room is a concrete use case where the design must choose between perceived speed, correctness, and degraded behavior rather than applying one generic loading pattern.",
  "Live sports scoreboard is a concrete use case where the design must choose between perceived speed, correctness, and degraded behavior rather than applying one generic loading pattern.",
  "Product launch homepage with logged-in personalization is a concrete use case where the design must choose between perceived speed, correctness, and degraded behavior rather than applying one generic loading pattern.",
  "A principal interviewer may ask you to handle a regional outage, a third-party script regression, an API latency spike, a client memory leak, or a sudden traffic surge. In each case, answer with the control loop: detect, isolate, degrade, communicate, recover, and prevent recurrence.",
  "For consumer products, the biggest risk is usually silent trust erosion: taps do nothing, pages jump, data appears stale, or users repeat actions. For enterprise products, auditability and support reconstruction often matter as much as the immediate UI behavior.",
  "For regulated or financial workflows, the product should prefer truthful pending states over optimistic success. Users can tolerate a slower confirmed action better than a fast lie that later becomes a support incident."
];
const questions = [
  {
    "question": "How would you design a frontend for 1M concurrent users end to end?",
    "answer": "I would start by defining the user journey and classifying each operation by criticality. Then I would place cacheable/static work at the CDN or edge, shape route payloads through a BFF, let the client scheduler prioritize visible and user-initiated work, and use local state only where correctness allows it. I would add RUM segmented by route, region, device, and network cohort, plus remote controls for feature shedding and rollback. The design is end to end because it covers request path, client runtime, backend dependencies, fallback behavior, observability, and operations."
  },
  {
    "question": "Why choose this architecture over a simpler client-only design?",
    "answer": "A client-only design is simpler initially, but it exposes every backend dependency to the browser, creates request waterfalls, and makes fallback policy inconsistent across teams. The proposed architecture adds a BFF or edge composition layer so the product can control payload shape, timeouts, cache behavior, and dependency degradation centrally. The trade-off is another operational tier, but that tier pays for itself when the product receives sudden or sustained traffic from one million concurrent users, often concentrated around launches, live events, promotions, or breaking news."
  },
  {
    "question": "What breaks at scale and how do you prevent it?",
    "answer": "The likely failures are cache misses stampede origins; clients poll too aggressively; analytics floods ingestion; login and checkout become hot dependencies. Prevention requires budgets, backpressure, cancellation, bounded prefetch, idempotent writes, dependency health signals, route-level ownership, and remote kill switches. At scale, small client inefficiencies become infrastructure incidents, so the frontend must be treated as a traffic-shaping system."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Public content can use aggressive caching and stale-while-revalidate. User-specific writes need rate limits, idempotency, and authoritative server confirmation. Live counters may be approximate under load. The important interview move is to classify state rather than claim everything is strongly consistent or eventually consistent. Cached reads, derived widgets, analytics, and noncritical counters can usually be stale. Security, entitlement, financial, inventory, and destructive actions require authoritative confirmation and reconciliation."
  },
  {
    "question": "How do you handle failure, rollback, privacy, cost, and observability?",
    "answer": "During peak load, the frontend should reduce polling, batch telemetry, serve stale content, disable expensive widgets, queue low-priority actions, and expose clear capacity states for scarce resources. Rollback relies on flags, config, CDN invalidation, third-party disablement, and safe fallback routes. Privacy requires data minimization in cache keys, logs, telemetry, and local storage. Cost is controlled through request budgets, sampling, cache hit targets, payload limits, and disabled speculation for constrained cohorts. Observability must connect client symptoms to release, route, dependency, device, network, and region."
  },
  {
    "question": "How would you defend the trade-offs under interviewer pressure?",
    "answer": "I would explicitly separate correctness-critical paths from experience-enhancing paths. Then I would explain why the architecture spends complexity on the former and sheds or simplifies the latter during stress. If challenged on complexity, I would point to the failure modes: ambiguous writes, retry storms, privacy leaks, hidden regressions, and poor p99 cohorts. The design is justified when those risks are more expensive than the added platform layer."
  }
];
const references = [
  {
    "label": "web.dev: Core Web Vitals",
    "href": "https://web.dev/vitals/"
  },
  {
    "label": "web.dev: Interaction to Next Paint",
    "href": "https://web.dev/inp/"
  },
  {
    "label": "MDN: Service Worker API",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API"
  },
  {
    "label": "MDN: Network Information API",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "Cloudflare: CDN and edge learning center",
    "href": "https://www.cloudflare.com/learning/cdn/what-is-a-cdn/"
  },
  {
    "label": "React documentation: server rendering APIs",
    "href": "https://react.dev/reference/react-dom/server"
  },
  {
    "label": "AWS Architecture Blog: static stability patterns",
    "href": "https://aws.amazon.com/blogs/architecture/"
  }
];

export default function Frontend1mConcurrentUsersArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>
        {definition.slice(1).map((item) => <p key={item}>{item}</p>)}
      </section>

      <section>
        <h2>Core Concepts</h2>
        {concepts.map((item, index) => index === 3 ? (
          <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock>
        ) : (
          <p key={item}>{item}</p>
        ))}
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        {architecture.map((item, index) => index === 0 ? (
          <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock>
        ) : (
          <p key={item}>{item}</p>
        ))}

        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/performance-scale-edge-cases/frontend-1m-concurrent-users.svg"
          alt="Design a Frontend for 1M Concurrent Users architecture"
          caption="Architecture view: ownership boundaries, control-plane decisions, and runtime paths for a frontend for 1M concurrent users."
        />

        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/performance-scale-edge-cases/frontend-1m-concurrent-users-flow.svg"
          alt="Design a Frontend for 1M Concurrent Users flow"
          caption="Flow view: user-visible progression, fallback behavior, and degraded-state recovery."
        />

        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/performance-scale-edge-cases/frontend-1m-concurrent-users-operations.svg"
          alt="Design a Frontend for 1M Concurrent Users operations"
          caption="Operations view: observability, rollback, cost controls, privacy boundaries, and incident response."
        />
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        {tradeoffs.map((item, index) => index === 0 ? (
          <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock>
        ) : (
          <p key={item}>{item}</p>
        ))}
      </section>

      <section>
        <h2>Best practices</h2>
        {practices.map((item) => <p key={item}>{item}</p>)}
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        {pitfalls.map((item) => <p key={item}>{item}</p>)}
      </section>

      <section>
        <h2>Real-world use cases</h2>
        {useCases.map((item) => <p key={item}>{item}</p>)}
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        {questions.map((item) => (
          <div key={item.question} className="mb-6">
            <h3 className="mb-2 text-lg font-semibold">{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>References</h2>
        <ul className="list-disc space-y-2 pl-6">
          {references.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </ArticleLayout>
  );
}

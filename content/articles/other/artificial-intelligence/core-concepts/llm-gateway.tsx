"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-ai-llm-gateway",
  title: "LLM Gateway — Centralized AI Proxy for Production Systems",
  description:
    "Comprehensive guide to the LLM Gateway pattern covering unified auth, intelligent model routing, cost attribution, rate limiting, semantic caching, request logging, and production architecture for centralizing all LLM calls in an organization.",
  category: "other",
  subcategory: "artificial-intelligence",
  slug: "llm-gateway",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-05-15",
  tags: [
    "ai",
    "llm-gateway",
    "proxy",
    "model-routing",
    "cost-attribution",
    "rate-limiting",
  ],
  relatedTopics: [
    "ai-application-architecture",
    "ai-cost-management",
    "ai-observability-monitoring",
    "ai-model-deployment",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: LLM Gateway — Centralized AI Proxy for Production Systems should be explained through a correctness invariant first, then through the implementation technique.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: In interviews, the decisive point is why this approach is valid under the stated constraints, not just what API or algorithm is used.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: The production-quality answer separates source of truth, derived state, failure behavior, and measurable cost.</HighlightBlock>
      {/* ── 1. Definition & Context ─────────────────────────────── */}
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Interview lens: frame LLM Gateway — Centralized AI Proxy for Production Systems around model behavior, grounding, memory, evaluation, safety boundaries, latency, and cost control. This is what turns the article from concept notes into interview-ready reasoning.</HighlightBlock>

        <HighlightBlock tier="important">
          An LLM Gateway is a reverse-proxy layer that sits between every
          application service and every AI provider, providing unified
          authentication, rate limiting, semantic caching, intelligent model
          routing, and cost attribution — all in one place rather than
          reimplementing them per team.
        </HighlightBlock>

        <p>
          When a company first experiments with LLMs, the fastest path is
          direct: each team grabs a provider API key, embeds it in environment
          variables, and calls OpenAI or Anthropic directly. This works for one
          or two teams, but at twenty teams it becomes unmanageable. Every team
          has its own key that gets rotated independently — or not at all.
          No one knows how many tokens the company spent last Tuesday, which
          feature caused the Thursday cost spike, or whether the customer-facing
          search feature is going to hit its rate limit at peak hours. Security
          reviews flag provider credentials appearing in GitHub Actions secrets
          in seventeen different repositories. An LLM Gateway solves all of
          this centrally so each team never has to solve it again.
        </p>

        <HighlightBlock tier="important">
          The LLM Gateway pattern is analogous to a traditional API gateway
          (Kong, AWS API Gateway) but specialized for the unique economics and
          operational characteristics of LLM calls: token-based cost models,
          multi-provider fallback, semantic deduplication of equivalent queries,
          and latency profiles that dwarf typical REST calls.
        </HighlightBlock>

        <p>
          Open-source and commercial options exist. LiteLLM provides a
          Python-native proxy that speaks the OpenAI wire format and translates
          to any provider backend, making it easy to drop in without changing
          client code. PortKey is a commercial gateway-as-a-service with a
          generous free tier that adds guardrails and observability.
          Helicone wraps calls at the HTTP level with minimal code changes and
          focuses primarily on logging and analytics. For organizations with
          strict data residency requirements, custom gateways built on Node.js
          or Go with a Redis sidecar for rate limiting and a Postgres store for
          cost records are common. The build-versus-buy decision comes down to
          three factors: whether you need deep integration with your internal
          IAM system, whether you have data residency constraints that prevent
          routing through a third-party SaaS, and whether you need custom
          routing logic beyond what off-the-shelf products offer.
        </p>

        <p>
          A gateway becomes non-negotiable at roughly the point where the
          organization has more than five teams using LLMs in production, or
          when a single AI budget line item exceeds what any one team owns. The
          transition from &quot;each team calls providers directly&quot; to
          &quot;every LLM call flows through the gateway&quot; is a migration,
          not a switch: teams gradually update their client code to point at the
          internal gateway URL instead of the provider URL, retaining the same
          OpenAI-compatible request format in most cases. LiteLLM&apos;s proxy
          makes this particularly smooth because it speaks the OpenAI wire
          protocol and translates requests to whichever provider the routing
          logic selects.
        </p>
      </section>

      {/* ── 2. Core Concepts ────────────────────────────────────── */}
      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core invariant to defend: AI systems must keep generated output attributable, bounded, observable, and recoverable despite probabilistic behavior.</HighlightBlock>

        <HighlightBlock tier="important">
          The five pillars of an LLM Gateway are: unified credential management
          (gateway holds secrets, clients hold scoped internal keys), intelligent
          model routing (cost/quality/latency strategies plus fallback chains),
          semantic caching (exact-match and approximate-match response reuse),
          multi-tier rate limiting (global, team, user, model), and per-call
          cost attribution with feature-level tagging.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/llm-gateway-architecture.svg"
          alt="LLM Gateway Architecture: Auth & Routing, Rate Limiting, Semantic Cache, and Cost Attribution quadrants"
          caption="Four quadrants of an LLM Gateway: centralized auth and model routing (A), token-bucket rate limiting with quota management (B), exact and semantic response caching (C), and per-call cost attribution with structured request logging (D)."
        />

        <h3>Unified Credential Management</h3>
        <p>
          The gateway holds all provider API keys — OpenAI, Anthropic, Google
          Gemini, Cohere — in a secrets manager such as AWS Secrets Manager or
          HashiCorp Vault. Teams never see provider keys. Instead, they receive
          an internal API key scoped to the models and features they are
          authorized to use. When a team&apos;s internal key is presented,
          the gateway looks up the associated policy: allowed model identifiers,
          maximum tokens per request, allowed endpoints, and whether the key
          can trigger provider fallback. Keys are rotated on a 90-day cycle
          without any team action required, because rotation happens in the
          gateway&apos;s secrets layer, not in team repositories. Every request
          is logged with the key identifier so the audit trail is complete —
          essential for SOC 2 and enterprise security reviews.
        </p>

        <h3>Intelligent Model Routing</h3>
        <p>
          Routing decisions happen before the request leaves the gateway.
          The routing engine evaluates the request against a set of rules that
          can prioritize cost (route to the cheapest model that meets quality
          thresholds), quality (route to the best model for the task category),
          or latency (route to the fastest provider for time-sensitive calls).
          For most organizations the default is a cost-first strategy with a
          quality floor: use GPT-4o-mini for requests below a complexity
          threshold estimated by prompt length and task category metadata, and
          escalate to GPT-4o or Claude 3.5 Sonnet only when the task requires
          it. Fallback chains are ordered sequences of (model, provider) pairs
          tried in sequence when upstream errors occur. A typical chain is
          GPT-4o → Claude 3.5 Sonnet → GPT-4o-mini, where the last entry is
          chosen because it is highly available even during incidents. Circuit
          breakers prevent the gateway from hammering a failing provider:
          when the 5xx rate on a provider exceeds 10% in a 60-second window,
          the circuit opens and all traffic routes around that provider for 30
          seconds before probing again.
        </p>

        <h3>Semantic Caching</h3>
        <p>
          Caching LLM responses has two levels. Exact-match caching computes a
          hash over the concatenation of model name, messages, temperature, and
          all sampling parameters; if the hash matches a stored entry, the
          cached response is returned immediately at zero provider cost. This
          handles common patterns like fixed system prompts paired with a small
          set of user queries (FAQ bots, documentation lookup). Semantic caching
          goes further: the user query is embedded using a small, fast embedding
          model (text-embedding-3-small), and an approximate nearest-neighbor
          search in a vector store (Redis with RediSearch or a dedicated vector
          DB) finds the closest stored query. If cosine similarity exceeds 0.95,
          the cached response is considered equivalent and returned. The
          threshold must be tuned per use case: customer-support queries can
          tolerate 0.92; code generation should be much stricter. TTL is
          query-type-aware: factual reference queries can be cached for 24 hours,
          current-event queries for 5 minutes, and code generation responses
          indefinitely (since the same code question has the same answer). A
          well-tuned semantic cache achieves 40-60% hit rates on high-volume
          customer-facing features and can reduce LLM spend by 35% or more.
        </p>

        <h3>Multi-Tier Rate Limiting</h3>
        <p>
          LLM providers enforce rate limits at the organization level, but the
          gateway enforces limits at multiple internal levels. A global limit
          caps the total tokens per minute the organization sends to each
          provider, preventing surprise overage charges. Team-level limits
          allocate quota to each team proportionally to their budget allocation.
          User-level limits prevent a single runaway automated process from
          exhausting a team&apos;s quota. Model-level limits track usage against
          each model&apos;s specific provider-imposed limit so the circuit
          breaker fires before the provider actually rejects requests. Token
          bucket is the preferred algorithm because it handles natural burst
          patterns (end-of-day report generation) while enforcing sustained
          throughput. Leaky bucket is used in stricter environments where even
          momentary bursts are unacceptable. When a team hits 80% of its quota,
          the gateway emits a Slack alert; at 100% it either queues requests
          (with a configured maximum queue depth and timeout), rejects them with
          429, or transparently switches to a fallback model with higher
          availability quota.
        </p>

        <h3>Cost Attribution</h3>
        <p>
          Every request carries a cost: input tokens multiplied by the input
          token price plus output tokens multiplied by the output token price,
          summed across all calls in a chain if the gateway is managing
          multi-step pipelines. Teams tag requests with a feature label (e.g.
          <code>feature=search-summarization</code> or
          <code>feature=onboarding-assistant</code>) so costs roll up to product
          features, not just teams. Daily, weekly, and monthly rollups per team
          and per feature feed an internal cost dashboard. Anomaly detection
          using a 3-sigma threshold on rolling 7-day cost per team fires alerts
          when costs spike unexpectedly — catching runaway loops, missing
          caching configurations, or accidental production deployments of
          expensive models.
        </p>
      </section>

      {/* ── 3. Architecture & Flow ──────────────────────────────── */}
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="important" className="mb-4">Decision quality comes from naming the constraint, the chosen technique, the proof boundary, and the cost model before discussing implementation details.</HighlightBlock>

        <HighlightBlock tier="important">
          The complete request path through an LLM Gateway is: client presents
          internal API key → gateway validates key and extracts policy → rate
          limit check → exact-match cache lookup → semantic cache lookup →
          routing decision → provider call → response logged (cost, latency,
          tokens) → cache write → response returned to client. Every step is
          synchronous in the hot path; cache writes and log flushes are async.
        </HighlightBlock>

        <p>
          Multi-region gateway deployment is essential for production systems.
          A gateway deployed only in us-east-1 becomes a bottleneck and a single
          point of failure for teams in Europe and Asia. The typical deployment
          is three regional instances (us-east-1, eu-west-1, ap-southeast-1),
          each with its own Redis cluster for rate-limit state and cache. Rate
          limit counters are per-region by default but can be synchronized using
          Redis replication with a small staleness tolerance (sub-second for most
          use cases). The semantic cache is per-region because embedding latency
          to a remote cache would negate the cache benefit. Provider credentials
          are replicated from the central secrets manager to each region on a
          pull schedule with a cache TTL of 10 minutes, so key rotation
          propagates within 10 minutes without a service restart. A global
          load balancer (AWS Global Accelerator or Cloudflare) routes each
          client to the nearest regional gateway using latency-based routing.
        </p>

        <HighlightBlock tier="important">
          Provider credential rotation without downtime requires the gateway to
          hold two valid keys per provider simultaneously during the rotation
          window. The new key is injected into the secrets manager and starts
          receiving traffic; the old key is deactivated only after all in-flight
          requests using it complete. Implementing this with a dual-key slot
          pattern (primary + secondary, rotating which slot is &apos;primary&apos;)
          eliminates any gap in service during rotation.
        </HighlightBlock>

        <p>
          Circuit breakers are implemented per (provider, model, region) tuple.
          Each slot maintains a rolling window of outcome counts. When the
          failure rate in the window exceeds the configured threshold, the breaker
          transitions from Closed to Open, and the routing layer immediately
          skips this slot when building the ordered fallback list. After a
          configurable cool-off period (typically 30 seconds), the breaker moves
          to Half-Open, allows one probe request, and returns to Closed on
          success or stays Open on failure. This pattern prevents cascading
          failures where a slow or error-prone provider causes the gateway to
          hold thousands of request threads waiting for timeouts.
        </p>

        <p>
          Request tracing uses OpenTelemetry. Each incoming request receives a
          trace ID that propagates through auth, cache, routing, and provider
          call spans. Spans are exported to a collector (Jaeger or Honeycomb)
          and the gateway also emits structured JSON logs including requestId,
          teamId, userId, model, tokensIn, tokensOut, latencyMs, costUsd, cached
          (boolean), cacheType (exact/semantic/miss), provider, region, and any
          error codes. Log retention is 90 days. Before storage, a PII scrubbing
          step runs the message payload through a regex and NER classifier to
          redact email addresses, phone numbers, and credential patterns. The
          Grafana dashboard surfaces per-team cost burn rates, cache hit ratios
          by feature, model distribution over time, and p50/p95/p99 latency
          by provider and model.
        </p>
      </section>

      {/* ── 4. Trade-offs & Comparison ──────────────────────────── */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <HighlightBlock tier="important">
          Build vs. buy depends on three variables: whether your IAM and
          compliance requirements demand deep integration that off-the-shelf
          products cannot provide, whether data residency rules prohibit routing
          through a third-party SaaS, and whether your routing logic is complex
          enough that a custom rule engine is necessary. For most companies
          under 200 engineers, LiteLLM or PortKey is the right starting point.
        </HighlightBlock>

        <p>
          LiteLLM is a strong choice for teams that are already Python-native
          and want a self-hosted proxy with minimal operational overhead.
          It speaks the OpenAI wire format on its inbound interface, which means
          existing client code needs only a base URL change to start routing
          through it. LiteLLM supports model aliases, basic rate limiting,
          spend tracking per key, and provider fallback. Its limitations are
          shallow observability (no native OpenTelemetry integration at the span
          level), limited semantic caching (exact-match only out of the box),
          and a single-instance deployment model that requires additional
          engineering to make truly HA. For a team of 5-20 engineers it is
          often the right answer for the first 12 months.
        </p>

        <p>
          PortKey is a commercial SaaS gateway with a generous free tier that
          adds a visual dashboard, guardrails (content filtering, regex
          blocklists), and a feedback mechanism for prompt optimization.
          The inbound interface is OpenAI-compatible. PortKey is appropriate
          when you want observability and guardrails out of the box and your
          compliance posture permits routing request payloads through PortKey&apos;s
          infrastructure. Helicone occupies a similar niche but focuses more
          heavily on analytics and less on routing intelligence. Neither product
          supports arbitrary routing rule engines or deep internal IAM
          integration, which is where custom gateways become necessary.
        </p>

        <p>
          A custom gateway built with a Node.js or Go HTTP server, Redis for
          rate limiting and exact-match cache, a vector DB sidecar for semantic
          cache, and Postgres for cost records gives full control but costs 2-4
          engineer-months to build to production quality and ongoing maintenance.
          The economic break-even over SaaS alternatives depends on request
          volume: at high volumes (hundreds of millions of tokens per month),
          the cost savings from semantic caching and optimized routing typically
          justify the investment within 3-6 months.
        </p>
      </section>

      {/* ── 5. Best Practices ───────────────────────────────────── */}
      <section>
        <h2>Best Practices</h2>

        <HighlightBlock tier="important">
          Tag every LLM request with a feature label and team identifier at the
          call site. Without this metadata, cost attribution is impossible after
          the fact. The gateway should reject requests missing required tags in
          production environments — enforcement at the gateway means no team
          can accidentally forget.
        </HighlightBlock>

        <p>
          Set budget alerts at 80% of monthly quota, not 100%. By the time
          you hit 100%, the spike has already happened. Configure alerts to fire
          in Slack with enough context for an on-call engineer to identify the
          responsible feature: team name, feature tag, and the absolute and
          percentage increase over the same period in the previous week.
          Anomaly detection based on rolling 7-day baselines catches gradual
          drifts that fixed thresholds miss — a feature that doubles its cost
          over two weeks may never trigger a percentage-change alert but will
          be caught by a 3-sigma model.
        </p>

        <HighlightBlock tier="important">
          Implement semantic caching for any high-volume feature where a
          significant fraction of queries are semantically equivalent even if
          not lexically identical. Support chatbots, FAQ assistants, and
          document summarization tools are common targets. Measure cache ROI as
          (cost saved by cache hits) / (cost of cache infrastructure + embedding
          calls for cache misses). If ROI is below 2x, the cache adds cost
          without sufficient benefit.
        </HighlightBlock>

        <p>
          Use circuit breakers, not just retries. Retries on a failing provider
          amplify load at exactly the moment when the provider is struggling;
          circuit breakers route traffic away. Implement exponential backoff with
          jitter for retries within the half-open probe logic, never in the main
          request path. Keep the gateway&apos;s own latency budget tight: auth
          and cache lookup should add no more than 10-20 ms to each request.
          Use in-process LRU caches for the policy lookup (team key to policy
          mapping) so that Redis is not on the critical path for policy
          resolution. Log asynchronously with a non-blocking queue; a slow log
          flush should never cause the gateway to time out on an LLM call.
        </p>
      </section>

      {/* ── 6. Common Pitfalls ──────────────────────────────────── */}
      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="important" className="mb-4">Failure modes to call out: hallucination, prompt injection, stale retrieval, unbounded context growth, hidden model cost, and UI that overstates certainty.</HighlightBlock>

        <HighlightBlock tier="important">
          Semantic cache serving stale responses for time-sensitive queries is
          the most common production incident in gateway deployments. A query
          like &quot;What are today&apos;s top news stories?&quot; cached two
          hours ago will confidently return yesterday&apos;s answer. Mitigation:
          classify queries by temporal sensitivity at index time and assign
          aggressive TTLs (1-5 minutes) to queries flagged as time-sensitive.
          When in doubt, err toward shorter TTLs.
        </HighlightBlock>

        <p>
          Rate limiting causing cascading failures across teams is a common
          operational failure mode. When one team hits its limit, the gateway
          returns 429 responses. If the team&apos;s service treats 429 as a
          hard failure rather than a retry-with-backoff signal, it can cause
          visible user-facing errors. The gateway should include a
          <code>Retry-After</code> header in all 429 responses, and teams
          should be required to implement exponential backoff in their LLM
          client libraries before launching to production. The gateway can
          enforce this at an SDK level by distributing an internal client library
          that wraps the HTTP call with mandatory backoff logic.
        </p>

        <HighlightBlock tier="important">
          Cost attribution gaps occur when teams bypass the gateway. This
          typically happens during local development (pointing directly at
          OpenAI), during incidents when engineers hardcode provider keys as
          a workaround, or in legacy services that predate the gateway. Enforce
          network egress rules at the infrastructure level (security group or
          firewall policy) so that direct provider calls from production
          environments are blocked, routing all traffic through the gateway.
        </HighlightBlock>

        <p>
          A single-region gateway with no high-availability configuration is
          a SPOF for every AI feature in the organization. If the gateway goes
          down, every team loses LLM access simultaneously. The minimum HA
          configuration is two instances behind a load balancer with health
          checks, a Redis cluster in primary/replica mode, and a readiness
          probe that validates the Redis connection and secrets manager
          reachability before accepting traffic. For critical applications,
          a multi-region active/active deployment with latency-based routing is
          the appropriate architecture.
        </p>
      </section>

      {/* ── 7. Real-World Use Cases ─────────────────────────────── */}
      <section>
        <h2>Real-World Use Cases</h2>

        <p>
          A platform team at a 500-person company standardizing LLM access
          across 30 product teams typically starts with a LiteLLM-based gateway
          running on two ECS tasks behind an ALB. The first win is centralized
          API key management: the platform team provisions one key per product
          team with a monthly token quota, and provider credentials live only
          in the platform team&apos;s Secrets Manager. Within 90 days, cost
          dashboards reveal that three features account for 70% of LLM spend,
          and semantic caching on the highest-volume feature (a support
          summarization tool) cuts spend by 40%. The platform team uses this
          data to negotiate a volume discount with the provider, which would
          have been impossible without the centralized view.
        </p>

        <p>
          A gaming company routing between providers based on user tier uses
          model routing as a product feature rather than just a cost optimization.
          Free-tier users are routed to GPT-4o-mini with a low token budget;
          premium subscribers are routed to GPT-4o with a higher budget and
          lower latency SLA. The gateway exposes a tier metadata field that
          product services set in the request headers, and routing rules consume
          it. This architecture gives the product team control over the
          quality-cost tradeoff per user segment without any changes to the AI
          provider configuration.
        </p>

        <p>
          A fintech company with strict audit requirements uses the gateway
          as their evidence trail for every AI-assisted decision. Loan
          underwriting assistants, fraud detection advisors, and customer
          communication drafters all route through the gateway, which logs every
          request and response (with PII redaction) to an immutable S3 bucket
          with object lock enabled. The 90-day retention policy satisfies their
          regulatory obligation to produce AI decision audit trails. Without the
          gateway, each team would have to implement this independently and
          compliance audits would involve piecing together logs from 12 different
          microservices.
        </p>
      </section>

      {/* ── 8. Interview Q&As ───────────────────────────────────── */}
      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <HighlightBlock as="p" tier="crucial">
          Interview focus: answer with constraints, decisions, trade-offs, and
          how you&apos;d validate/operate the system. Generic answers score
          poorly; answers that name specific algorithms, numbers, and failure
          modes score well.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: Why build an LLM Gateway instead of letting each team call
            providers directly?
          </h3>
          <HighlightBlock as="p" tier="important">
            Interview focus: don&apos;t just say &quot;centralization is
            good.&quot; Name the specific failure modes that emerge at scale
            without a gateway, and what the gateway specifically prevents.
          </HighlightBlock>
          <p>
            Without a gateway, each team holds its own provider API key. Key
            rotation becomes a 30-team coordination exercise. When OpenAI
            changes pricing, you have no aggregate view of impact — you find
            out when the monthly bill arrives. When one team&apos;s job hits
            a rate limit, you don&apos;t know which team or which feature.
            The gateway solves all of these by being the single chokepoint:
            it holds all credentials, it enforces all quotas, and it logs every
            call with team and feature context. Secondary benefits include
            semantic caching (which cuts provider costs by 30-50% for
            high-volume features), fallback chains (which improve availability
            without any client code changes), and PII redaction (which prevents
            sensitive data from reaching providers unintentionally). The
            operational case is essentially the same as why organizations run
            an API gateway for their internal microservices: you want to centralize
            cross-cutting concerns rather than implement them inconsistently
            in each service.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: Design a semantic cache for LLM responses with freshness
            guarantees.
          </h3>
          <HighlightBlock as="p" tier="important">
            Interview focus: explain exact vs. semantic cache mechanics, how
            you set thresholds, and how you handle TTL for different query
            types. A complete answer addresses the freshness problem explicitly.
          </HighlightBlock>
          <p>
            The cache has two tiers. Tier 1 is an exact-match cache using
            a hash of (model, messages, temperature, top_p) as the key, stored
            in Redis with a configurable TTL. Any bit-identical re-request hits
            this tier in under 1 ms. Tier 2 is a semantic cache: each incoming
            query is embedded using a small, fast embedding model (inference
            runs on the gateway server, not a remote call), and an ANN search
            in a vector store finds the nearest stored query. A cosine similarity
            above 0.95 is a cache hit and returns the stored response. The
            threshold must be tuned: for factual Q&amp;A, 0.95 is appropriate;
            for code generation, raise it to 0.98. For freshness: attach a
            query-type classifier to the embedding pipeline. Queries classified
            as time-sensitive (temporal keywords like &quot;today,&quot;
            &quot;current,&quot; &quot;latest&quot;) get a 5-minute TTL; general
            knowledge gets 24 hours; code and documentation get 7 days or
            indefinite. This classification happens at cache write time, so
            TTL is embedded in the stored entry. Monitor the cache by tracking
            hit rate per query type, average age of served cache entries, and
            user-reported accuracy degradation — the last is the ground truth
            for whether the freshness model is calibrated correctly.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: How do you implement provider fallback without losing request
            context?
          </h3>
          <HighlightBlock as="p" tier="important">
            Interview focus: the challenge is that different providers have
            different request formats, different context window sizes, and
            different feature support. Describe how the gateway normalizes
            these differences before a fallback.
          </HighlightBlock>
          <p>
            The gateway operates on a normalized internal request format that
            is provider-agnostic: a list of messages (system, user, assistant),
            a target quality tier (best/standard/economy), and optional
            parameters (temperature, max_tokens). When routing selects GPT-4o,
            the gateway serializes this to the OpenAI wire format. When the
            circuit breaker opens on OpenAI and routing falls back to Claude 3.5
            Sonnet, the same normalized request is serialized to the Anthropic
            Messages API format. The key challenge is context window limits:
            GPT-4o supports 128K tokens, Claude 3.5 Sonnet supports 200K,
            GPT-4o-mini supports 128K. If a request uses 100K tokens and falls
            back from GPT-4o to a model with a smaller window, the gateway must
            either truncate the conversation (keeping the most recent messages
            and the system prompt) or fail with a meaningful error rather than
            sending a request that the fallback model cannot handle. Tool call
            schemas must also be translated: OpenAI&apos;s function calling
            format differs from Anthropic&apos;s tool_use format, so the gateway
            maintains a translation layer for each provider&apos;s tool schema
            format. All of this translation is invisible to the client — from
            their perspective, the same request went out and a response came
            back.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: How do you attribute LLM costs to individual product features?
          </h3>
          <HighlightBlock as="p" tier="important">
            Interview focus: the mechanism for attribution is straightforward,
            but the enforcement and validation stories are what distinguish a
            senior answer from a junior one.
          </HighlightBlock>
          <p>
            Attribution requires three things: a tagging convention, enforcement
            at the gateway, and a reporting layer. For tagging, every request
            must include at least two metadata fields: teamId and featureId.
            The gateway validates these against a registry of known teams and
            features; unknown values result in a 400 error in strict mode or
            route to a catch-all &quot;untagged&quot; bucket in lenient mode
            during migration. In the access log, every record includes these
            identifiers alongside tokensIn, tokensOut, costUsd, model, and
            timestamp. Rollups are computed daily by a batch job that reads
            the log, aggregates by (teamId, featureId, date), and writes to
            a cost Postgres table. The frontend is a Grafana dashboard with
            drill-downs by team, feature, and model. For internal chargeback,
            the monthly rollup feeds into the finance system as a cost
            allocation entry per team. The validation story: on a rolling basis,
            compare the sum of per-team attributed costs against the provider
            invoice total. Any gap represents unattributed calls — usually from
            direct calls that bypassed the gateway. Tracking this gap to zero
            over time is the health metric for your attribution completeness.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q5 (Staff/Principal): Design a multi-tenant LLM gateway for a B2B
            SaaS platform where each customer has their own model preferences,
            quotas, and audit requirements.
          </h3>
          <HighlightBlock as="p" tier="important">
            Interview focus: this question tests your ability to generalize the
            gateway pattern to a product use case rather than an internal
            infrastructure use case. Address tenant isolation, per-tenant
            configuration, bring-your-own-key (BYOK), and compliance
            customization.
          </HighlightBlock>
          <p>
            The core architectural change is moving from a single-tenant
            operator model (one company using the gateway internally) to a
            multi-tenant product model (many customer organizations, each with
            their own configuration). Each tenant gets a tenant record that
            stores: their preferred models and fallback chains (some enterprise
            customers have agreements with specific providers they prefer),
            their token quota per billing period, their audit log configuration
            (whether to retain full payloads or just metadata), and their
            bring-your-own-key configuration (large customers often prefer to
            use their own OpenAI org to keep usage under their enterprise
            agreement).
          </p>
          <p>
            For BYOK, the gateway stores customer-provided provider API keys
            in the secrets manager keyed by tenantId. When routing a request
            for that tenant, the gateway fetches the tenant&apos;s own key
            and presents it to the provider, meaning usage accrues to the
            customer&apos;s account, not the SaaS platform&apos;s. The platform
            still controls routing, caching, and audit logging. Tenant isolation
            in the semantic cache requires namespacing: cache entries are keyed
            by (tenantId, hash) so one tenant&apos;s cached responses are never
            returned for another tenant&apos;s queries. For rate limiting, each
            tenant has an independent token bucket in Redis, namespaced by
            tenantId. Quota resets are per-tenant billing period, not
            calendar month.
          </p>
          <p>
            Audit log customization is critical for enterprise customers with
            different retention and redaction requirements. The audit
            configuration per tenant specifies: log payload (yes/no — some
            customers insist their data never leaves their infrastructure even
            in log form), redaction rules (custom PII patterns beyond the
            platform defaults), retention period (30-365 days), and export
            destination (platform-hosted S3 vs. customer-provided S3 bucket
            with customer-managed KMS key). Compliance certifications
            (SOC 2, HIPAA, GDPR) drive these requirements. For HIPAA-covered
            customers, the gateway must never log PHI — payload logging must
            be disabled and any fields containing health information must be
            caught by the PII scrubber before the metadata log entry is written.
            The operational challenge is validating that the per-tenant
            configuration is correct: run a configuration audit job nightly
            that checks each tenant&apos;s settings against their signed
            DPA/BAA and alerts on misconfigurations. The scale challenge is
            that tenant policy lookups must be fast (under 1 ms) in the hot
            path — store tenant configs in an in-process LRU cache backed by
            Redis, invalidated by a pub/sub channel when the tenant admin
            updates their configuration.
          </p>
        </div>
      </section>

      {/* ── 9. References ───────────────────────────────────────── */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            LiteLLM Documentation — LiteLLM Proxy Server:{" "}
            <span className="font-mono">docs.litellm.ai/docs/proxy</span>
          </li>
          <li>
            PortKey Gateway — Open-source AI Gateway:{" "}
            <span className="font-mono">github.com/portkey-ai/gateway</span>
          </li>
          <li>
            Helicone — LLM Observability Platform:{" "}
            <span className="font-mono">helicone.ai/docs</span>
          </li>
          <li>
            OpenTelemetry for LLM Observability — GenAI Semantic Conventions:{" "}
            <span className="font-mono">
              opentelemetry.io/docs/specs/semconv/gen-ai
            </span>
          </li>
          <li>
            Token Bucket vs. Leaky Bucket Rate Limiting — AWS Architecture Blog:{" "}
            <span className="font-mono">
              aws.amazon.com/blogs/architecture/throttling-api-requests
            </span>
          </li>
          <li>
            Circuit Breaker Pattern — Martin Fowler:{" "}
            <span className="font-mono">
              martinfowler.com/bliki/CircuitBreaker.html
            </span>
          </li>
          <li>
            Semantic Caching for LLMs — Redis Blog:{" "}
            <span className="font-mono">
              redis.com/blog/llm-semantic-caching
            </span>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

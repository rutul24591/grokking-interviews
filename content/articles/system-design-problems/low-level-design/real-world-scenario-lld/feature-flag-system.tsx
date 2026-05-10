"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-feature-flag-system",
  title: "Design Feature Flag System",
  description:
    "Production-grade feature flags with rule-based targeting, gradual rollout, A/B testing, and kill switches.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "feature-flag-system",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "feature-flags", "gradual-rollout", "ab-testing", "kill-switch"],
  relatedTopics: ["feature-rollout-system"],
};

export default function FeatureFlagSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Feature flags decouple code deployment from feature release. Without them, releasing a new feature means deploying it to all users simultaneously—a high-risk all-or-nothing event. With feature flags, the code ships to production weeks before the feature is visible to any user. When ready, the flag is enabled for a small group first: beta testers, internal users, or a random 1% of traffic. If problems emerge, the flag is turned off instantly—no deployment, no rollback, just a configuration change that takes effect in seconds. This is how large engineering teams ship continuously without sacrificing stability.</p>
        <p>The complexity goes beyond a simple boolean toggle. Production-grade feature flags need targeting rules (enable for users in specific countries, with specific plan tiers, or matching arbitrary attributes), percentage rollouts (enable for exactly 10% of users, consistently—the same user always gets the same variant), A/B testing support (assign users to variants and track which variant drives better outcomes), and a kill switch mechanism that propagates globally in seconds, not minutes.</p>
        <p><strong>Explicit assumptions:</strong> Flags are evaluated client-side in the SDK for latency (local evaluation after fetching the flag configuration), not via a server round-trip on each check. Flag configurations are delivered via SSE (Server-Sent Events) or polling and cached locally. Targeting rules support user attributes (userId, email, plan, country, custom properties). Percentage rollout uses consistent hashing so the same user always gets the same treatment. Flags have a lifecycle: in development, in rollout, fully enabled, or deprecated.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Flag evaluation:</strong> Given a flag key and user context, evaluate the flag locally and return the variant (true/false or string/number for multivariate flags).</li>
          <li><strong>Targeting rules:</strong> Rules based on user attributes (userId, email, plan, country, custom properties). Rules combine with AND/OR logic. First-matching rule wins.</li>
          <li><strong>Percentage rollout:</strong> Enable for N% of users. Assignment is deterministic—the same user always receives the same variant for the same flag.</li>
          <li><strong>A/B testing:</strong> Multiple variants (A, B, C) each with an assigned percentage. Track which variant each user receives for outcome analysis.</li>
          <li><strong>Kill switch:</strong> Emergency disable of a flag that propagates to all SDK instances within seconds, without requiring a code deployment.</li>
          <li><strong>Flag lifecycle management:</strong> Create, update, archive, and delete flags via a management API and dashboard.</li>
          <li><strong>Experimentation tracking:</strong> Emit events when a flag is evaluated, enabling downstream analysis of variant impact on metrics.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Evaluation latency:</strong> Flag checks must be synchronous and under 1ms (local evaluation against cached config, no network call).</li>
          <li><strong>Propagation speed:</strong> Flag changes must reach all SDK instances within 5 seconds (for kill switch scenarios).</li>
          <li><strong>Consistency:</strong> The same user must always receive the same variant for a given flag, across devices and sessions, until the flag configuration changes.</li>
          <li><strong>Availability:</strong> Flag evaluation must continue working if the flag delivery service is unavailable (local cache + defaults).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The system has two runtime components: the Flag Delivery Service and the Client SDK. The Flag Delivery Service stores flag configurations (targeting rules, rollout percentages, variants) and streams changes to connected SDK instances via SSE. The Client SDK caches flag configurations locally, evaluates flags synchronously against the cache, and exposes a simple API: isEnabled(flagKey, userContext) or getVariant(flagKey, userContext).</p>
        <p>On application startup, the SDK fetches all flag configurations in a single bootstrap request and stores them in memory. From that point, flag evaluation is a pure local computation—no network calls in the critical path. An SSE subscription delivers configuration updates in real-time; the SDK updates its cache when updates arrive. If the SSE connection drops, the SDK falls back to polling every 30 seconds. If the flag service is unavailable entirely, the SDK serves defaults (the configured default value for each flag, typically false for new features).</p>
        <p>The admin dashboard provides a UI for creating and managing flags, configuring targeting rules, and monitoring active evaluations. The dashboard writes to the flag database, which triggers a change event that is streamed to all connected SDK instances via the SSE channel.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/feature-flag-system.svg"
          alt="Feature flag system showing flag schema, evaluation pipeline from kill switch through targeting rules to percentage rollout, SDK delivery via SSE, and A/B test monitoring"
          caption="Feature flag system showing flag schema, evaluation pipeline from kill switch through targeting rules to percentage rollout, SDK delivery via SSE, and A/B test monitoring"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Flag Schema and Data Model</h3>
        <p>Each flag is a document containing: flagKey (string, globally unique, human-readable like "new-checkout-flow"), enabled (boolean, global on/off), defaultVariant (the variant returned when no rules match or enabled is false), variants (array of variant objects with key and value), rules (ordered array of targeting rules), rolloutPercentage (0-100, for traffic-split allocation), and updatedAt timestamp (used for cache invalidation).</p>
        <p>A targeting rule has: conditions (array of attribute comparisons like {"{"}attribute: "plan", operator: "eq", value: "enterprise"{"}"}), variant (which variant to return when this rule matches), and priority (rules are evaluated in priority order; first match wins). Conditions support operators: eq, neq, in, not_in, contains, starts_with, gt, lt, and exists. Rules with multiple conditions default to AND logic; OR across rules is implemented by creating multiple rules with the same variant.</p>
        <p>Variants are the possible return values: for a boolean flag, variants are "on" (true) and "off" (false). For multivariate flags, variants can be strings ("control", "variant_a", "variant_b") or numbers. The SDK's evaluation result is always a variant key, which the application maps to a behavior: isEnabled() maps "on" to true and anything else to false; getVariant() returns the variant key directly for multivariate use.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Consistent Percentage Hashing</h3>
        <p>Percentage rollout must be consistent: if user Alice is in the 10% rollout today, she must remain in the 10% rollout tomorrow and on her mobile device. If this is not guaranteed, the user might see the feature enabled sometimes and disabled others, which is confusing and invalidates A/B test results.</p>
        <p>The standard approach is deterministic hashing: bucket = parseInt(sha256(flagKey + userId).slice(0, 8), 16) % 100. This produces a stable 0-99 bucket for each (flag, user) pair. A user with bucket 7 is always in the first 10% rollout for every flag (not necessarily—each flag has a different effective distribution because the flagKey is mixed into the hash, so the same user gets different buckets for different flags). To enable 25%, include users with bucket less than 25. To increase from 25% to 50%, extend to bucket less than 50—users already in the 25% remain in the 50% (monotonic expansion, no variant switching for existing participants).</p>
        <p>For A/B testing with multiple variants (A gets 50%, B gets 50%), the bucket is computed the same way and then mapped to ranges: bucket less than 50 → variant A, bucket 50-99 → variant B. For three variants (A: 33%, B: 33%, C: 34%): bucket less than 33 → A, 33-65 → B, 66-99 → C. This keeps assignments stable as long as variant percentages don't change.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Evaluation Pipeline</h3>
        <p>The SDK's evaluate(flagKey, userContext) function follows a strict ordering: (1) if the flag does not exist in cache, return the SDK-level default (false); (2) if the flag's enabled field is false (global kill switch), return the defaultVariant; (3) evaluate targeting rules in priority order—for each rule, check if all conditions match the provided userContext; return the rule's variant on first match; (4) if no rules matched, apply percentage rollout using the consistent hash; (5) if rollout percentage is 100, return the "on" variant; (6) if the user's bucket is less than rolloutPercentage, return the "on" variant; (7) otherwise return the defaultVariant.</p>
        <p>This ordering is important: kill switches (enabled: false) always win before any rules. Force-targeting rules (typically used for QA engineers to always see a feature) run before percentage rollout. Percentage rollout is the last gate before the default. This ordering ensures that in an emergency, setting enabled: false immediately disables the feature for all users regardless of their targeting rules—that is the kill switch semantic.</p>
        <p>The userContext object should be constructed once per session and passed to all flag evaluations. It typically contains: userId (stable identifier for hashing), email, planTier, country, and any custom attributes the application tracks. The SDK should never fetch user attributes from the network during evaluation; the calling code must populate userContext before calling evaluate.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Flag Delivery via SSE</h3>
        <p>Server-Sent Events provide a persistent one-way HTTP connection over which the server pushes flag configuration changes to the SDK. When a flag is updated in the admin dashboard, the change is written to the database and simultaneously broadcast to an event bus (Redis pub/sub or Kafka). The Flag Delivery Service consumes from the event bus and pushes the changed flag's configuration to all connected SSE clients. SDK instances receive the event, update their local cache, and the next evaluate() call sees the new configuration. End-to-end propagation (dashboard change → SSE event → SDK cache update) typically takes under 2 seconds.</p>
        <p>SSE is preferred over WebSocket for flag delivery because it is unidirectional (server → client only), automatically reconnects on disconnect, and works through HTTP proxies and load balancers without special configuration. It uses a standard HTTP response with Content-Type: text/event-stream and keep-alive, making it compatible with any environment that supports long-lived HTTP connections.</p>
        <p>The SDK manages the SSE connection lifecycle: establish on initialization, reconnect with exponential backoff on disconnect (starting at 1 second, capping at 30 seconds), and fall back to polling every 30 seconds if three consecutive reconnection attempts fail. On reconnect, the SDK sends its last-seen event ID so the server can replay any events missed during the disconnection window (SSE's built-in Last-Event-ID mechanism).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">A/B Test Instrumentation</h3>
        <p>For flags used in A/B experiments, the SDK emits an exposure event every time a flag is evaluated and a non-default variant is returned. The exposure event contains: flagKey, variant, userId, sessionId, timestamp, and the page or feature context where the evaluation occurred. These events are batched locally (up to 20 events or 5 seconds, whichever comes first) and sent to an analytics ingestion endpoint.</p>
        <p>The exposure event is the unit of experiment analysis. To measure whether variant B increases conversion over variant A, the data team joins exposure events with conversion events on userId and timestamp, then compares conversion rates between variant groups. It is critical that exposure events are only emitted when the user actually encounters the evaluated flag (not for every flag in the configuration), to avoid diluting the experiment with users who received the variant but never reached the tested feature. This is why the application calls evaluate() at the point of use rather than eagerly evaluating all flags at startup.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Kill Switch Semantics and Operational Safety</h3>
        <p>The kill switch is the highest-priority operation in the system: an on-call engineer seeing an error spike must be able to disable a feature within seconds without requiring code changes, PR reviews, or deployments. This requires: (1) a prominent "Disable" button in the admin dashboard that requires a single click (not a multi-step confirmation—speed matters in incidents); (2) the flag delivery mechanism (SSE) having a sub-5-second propagation guarantee; (3) the SDK's evaluate() function checking enabled: false before any other logic.</p>
        <p>Operational safety extends to flag cleanup. Flags should have an explicit lifecycle: in_development (default off, not shown in production), in_rollout (percentage-based), fully_enabled (100%, effectively permanent), and deprecated (marked for removal). Fully-enabled flags that have been at 100% for more than 30 days should be flagged for cleanup—the feature code should have the flag check removed and the flag deleted. Accumulated stale flags degrade SDK performance (larger configuration payloads) and create confusion about which flags are still meaningful.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Local evaluation (SDK evaluates against cached config) versus remote evaluation (SDK sends context to server, server returns variant): local evaluation is vastly faster (microseconds versus tens of milliseconds) and works offline, but requires the SDK to download all flag configurations. For applications with thousands of flags, the configuration payload can be large. Remote evaluation keeps the payload small (one response per evaluate call) but adds network latency to every flag check. Most systems use local evaluation with flag configurations compressed and delivered efficiently; only systems with extremely sensitive flag configurations (where clients should not see disabled flags' rules) use remote evaluation.</p>
        <p>Client-side versus server-side evaluation for server-rendered applications: for Next.js or similar SSR frameworks, flags that affect the initial HTML render must be evaluated server-side to avoid layout shift (the flag determines which component to render, and client-side evaluation would cause a flash of the default variant). The SDK should support a server-side evaluation mode where the flag configuration is fetched at request time and evaluations run in Node.js. The evaluated variants can be passed as initial props or embedded in the page HTML for the client SDK to hydrate without re-fetching.</p>
        <p>Flag configuration consistency across user sessions: if a user's percentage bucket is based on their userId, they get a consistent experience across devices. But if userId is not yet available (pre-authentication), evaluation must use a different identifier (device ID from localStorage). When the user logs in, the userId becomes available, potentially changing their bucket. This variant switch at login is generally acceptable but can be jarring for A/B tests—some systems solve this by merging the anonymous and authenticated identities and preserving the anonymous bucket.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A production feature flag system decouples deployment from release and enables precise control over which users see which features. The core mechanism is deterministic hashing (sha256(flagKey + userId) % 100) for consistent percentage assignment, an evaluation pipeline that checks kill switch → targeting rules → rollout percentage → default, and SSE-based flag delivery for sub-5-second kill switch propagation. Local evaluation keeps flag checks under 1ms with a fallback to cached defaults when the flag service is unavailable. A/B testing is built on top of the same infrastructure: exposure events emit when non-default variants are evaluated, enabling downstream conversion analysis. Operational discipline—flag lifecycle management, stale flag cleanup, and one-click kill switch UX—is as important as the technical implementation.</p>
      </section>
    </ArticleLayout>
  );
}

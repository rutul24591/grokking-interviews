"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-feature-rollout-experimentation-system",
  title: "Design a Feature Rollout & Experimentation System",
  description:
    "Architecture for a feature rollout and experimentation system: feature flag evaluation at the edge with user targeting rules, percentage-based progressive rollouts with automatic rollback on error rate spike, kill switch for instant feature shutdown, SDK design for zero-latency flag reads, flag configuration storage and propagation, override rules for internal testing, audit log for flag changes, and integration with deployment pipelines for flag-gated releases.",
  category: "high-level-design",
  subcategory: "experimentation-growth-systems",
  slug: "feature-rollout-experimentation-system",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-14",
  tags: ["hld", "feature-flags", "rollout", "kill-switch", "progressive-delivery", "edge-evaluation", "targeting-rules", "sdk-design"],
  relatedTopics: ["ab-testing-platform-ui", "user-funnel-analytics-dashboard"],
};

export default function FeatureRolloutExperimentationSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A feature rollout and experimentation system decouples feature deployment from feature release. Code ships to production continuously (CI/CD), but features are exposed to users only when explicitly enabled via feature flags. This allows: gradual rollouts (expose to 1% of users, then 10%, then 100%, watching for regressions at each step), instant kill switches (turn off a misbehaving feature without a deployment), internal testing (enable a feature for employees before public release), and A/B experiments (expose variants to different user segments). The system is foundational infrastructure — every product team uses it daily.</p>
        <HighlightBlock as="p" tier="important">The critical design constraint: flag evaluation must be fast and available. A feature flag check that requires a network round trip adds latency to every page load and breaks if the flag service is down. The architecture must provide sub-millisecond flag evaluation with zero runtime dependency on the flag service — flags are evaluated against a local cache that is kept in sync with the flag service, not queried on every request.</HighlightBlock>
        <p><strong>Explicit scope:</strong> Flag evaluation engine, user targeting rules, percentage-based rollouts, automatic rollback, kill switches, SDK design, and flag configuration management UI. Not in scope: the statistical analysis of experiments (covered in the A/B testing article) or multi-armed bandit allocation.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Flag evaluation engine:</strong> A flag is evaluated by the SDK in O(1) against an in-memory flag store. The evaluation order: (1) Check if the flag is globally disabled (kill switch) → return false. (2) Check if the user matches any override rules (specific user IDs, internal employee accounts) → return the override value. (3) Check if the user matches the flag's targeting rules (country = US AND plan = enterprise) → if not, return the default value. (4) Compute the user's percentage bucket: hash(userId + flagKey) % 100. (5) If bucket &lt; rolloutPercentage → return true (enabled), else false. The evaluation is deterministic (same user always gets the same result for the same flag configuration), synchronous (no async), and runs entirely from the in-memory store.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Progressive rollout with automatic rollback:</strong> A rollout wizard allows configuring staged rollout: start at 1%, hold for 30 minutes while monitoring, automatically advance to 10%, hold, advance to 50%, hold, then 100%. Each stage has configurable hold duration and health criteria: if the error rate for users in the treatment group exceeds the baseline by more than 1 percentage point during any hold period, the rollout is automatically paused and the on-call engineer is paged. Manual override allows advancing or rolling back at any stage. The rollout stages are stored as a schedule on the flag configuration; a cron job on the flag service advances the percentage when the hold duration expires and health criteria pass.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Targeting rules:</strong> Flags can target by: user attributes (userId, email, country, plan, cohort, account age), device attributes (platform, browser, OS version), session attributes (referrer, UTM params), and custom attributes (injected by the application at flag evaluation time). Rules support AND/OR/NOT logic: (country IN [US, CA]) AND (plan = enterprise OR accountAgeDays &gt; 90). Rules are evaluated server-side for security-sensitive flags (never trust client-provided targeting attributes for flags that gate premium features). Rules are evaluated client-side (in the SDK) for UI flags where latency is critical.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Override rules for testing:</strong> Engineers can add individual user ID overrides: "always enable this flag for userId=12345." This allows QA testing, dogfooding by employees (all @company.com emails are in a special override group), and support for specific customers. Overrides take priority over rollout percentage — an overridden user always sees the overridden value regardless of the rollout stage. Overrides are visible in the flag configuration UI and logged to the audit log so they are not forgotten.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>SDK design for zero-latency reads:</strong> The client SDK bootstraps on page load: fetch GET /api/flags?context=&#123;userId,country,plan,...&#125; and receive the evaluated flag state for this user (a flat object &#123;flagKey: true/false, ...&#125;). This is a single request that evaluates all flags server-side and returns the results. The response is stored in memory. All subsequent isEnabled(flagKey) calls read from memory with O(1) lookup — zero network calls. The bootstrap response is also written to localStorage (as a fallback for the next page load — if the flags API is unavailable on next load, the SDK uses the stale cached flags from localStorage). The SDK re-fetches flags every 5 minutes (via a background setInterval) to pick up flag changes without a page reload.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Flag propagation latency:</strong> When a flag is changed in the UI (e.g., a kill switch is activated), the change must propagate to all active SDK instances within 30 seconds. Server-Sent Events (SSE) stream flag updates to all connected SDK instances: the SDK opens an EventSource connection to GET /api/flags/stream; when any flag changes, the server sends a flag_updated event with the new flag state. The SDK applies the update to its in-memory store immediately. For SDK instances that have lost their SSE connection (tab in background, network interruption), the 5-minute poll serves as the fallback propagation mechanism.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Kill switch:</strong> A kill switch is a flag that is immediately set to disabled globally, bypassing the rollout percentage and targeting rules. Kill switches can be activated from the flag detail page with a single button click (no confirmation required — speed is critical for incident response). The kill switch activation is: (1) set the flag's enabled field to false in the flag store; (2) publish a flag_updated event to all connected SDK instances via SSE; (3) log the kill switch activation to the audit log with the operator's identity and timestamp. Kill switch recovery (re-enabling the flag) requires a separate action and adds a confirmation step — accidental re-enabling of a killed flag during an incident is more dangerous than an accidental kill.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The flag service has three components: (1) the configuration store (a database of flag definitions: key, description, targeting rules, rollout percentage, overrides, audit log); (2) the evaluation API (takes a user context, evaluates all flags, returns the evaluated state — this is what the SDK bootstraps from); and (3) the streaming API (SSE stream that pushes flag changes to connected SDK instances). The flag store is also replicated to edge CDN nodes — the evaluation API can run at the edge, reducing latency for bootstrap requests by serving from the nearest geographic location.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The flag configuration UI is a separate web app (an internal tool) that reads from and writes to the configuration store. Changes to flag configurations are published to an event bus, which the streaming API subscribers to and relays to connected SDK instances. The audit log is an append-only table that records every flag change: who changed it, what changed (old value → new value), when, and from which UI action.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/experimentation-growth-systems/feature-rollout-experimentation-system.svg"
          alt="Feature rollout and experimentation system: SDK bootstrap fetches evaluated flag state for user context; in-memory store for O(1) isEnabled() reads; SSE stream propagates flag changes within 30 seconds to all connected clients; kill switch disables flag globally and bypasses rollout percentage; progressive rollout stages with automatic rollback on error rate spike; targeting rules evaluated with AND/OR/NOT logic; override rules for internal testing; audit log records all flag changes."
          caption="SDK bootstrap (single request evaluates all flags server-side, O(1) in-memory reads), SSE stream propagation (&lt;30s flag changes to all clients), kill switch (single click, immediate SSE push, audit logged), progressive rollout stages (automatic rollback on error spike), targeting rules (user+device+custom attributes, AND/OR/NOT), override rules for dogfooding"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Flag Configuration Data Model</h3>
        <HighlightBlock as="p" tier="important">Each flag record: &#123;key: "checkout_v2", description: "New checkout flow", createdBy: "user@co.com", createdAt: ISO8601, enabled: true, rolloutPercentage: 25, targetingRules: [&#123;attribute: "country", operator: "IN", values: ["US","CA"]&#125;], overrides: [&#123;userId: "12345", value: true&#125;], variants: null, auditLog: [...] &#125;. The enabled field is the kill switch — setting it to false immediately disables the feature for all users regardless of other settings. The rolloutPercentage is the fraction of users in the target segment who see the feature (0–100). The targetingRules define the segment that is eligible for the rollout at all — users outside this segment always get the default value (false).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Flag variants for multi-variant experiments: flags can be boolean (true/false) or multi-variant (returning a string: "control" | "variant-a" | "variant-b"). Multi-variant flags use the same deterministic hash bucketing: the hash value is mapped to a variant based on configured allocation ranges. The SDK's getVariant(flagKey) API returns the variant string; isEnabled(flagKey) is a boolean convenience wrapper (returns true if getVariant returns anything other than the default/control value).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Evaluation for Low Latency</h3>
        <HighlightBlock as="p" tier="crucial">The flag bootstrap request (GET /api/flags?context=...) is the latency-critical path. Moving this to the CDN edge reduces latency from ~100ms (origin server) to ~15ms (edge node). The edge worker (Cloudflare Worker or Fastly Compute) receives the request, fetches the flag configuration from the edge-replicated config store (KV store with &lt;1ms read latency at the edge), evaluates all flags for the user context locally (no round trip to origin), and returns the evaluated flag state. The flag configuration is replicated to the edge KV store every 30 seconds — changes propagate to the edge within 30 seconds, which is the same propagation target as the SSE stream.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Server-side SDK (Node.js, Python): for server-rendered pages, the flags are evaluated on the server before the HTML is generated. The server SDK maintains an in-process flag store (synced via polling every 30 seconds from the flag service). SSR pages include the evaluated flags in the HTML as window.__flags = &#123;...&#125;, and the client-side SDK bootstraps from this inline data (zero extra network request). This is the fastest possible bootstrap — the flags are already in the page when it arrives.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Automatic Rollback Implementation</h3>
        <HighlightBlock as="p" tier="crucial">Automatic rollback requires a monitoring integration. The flag service polls the metrics system (Datadog, Prometheus) every 60 seconds for the health metrics of each active rollout: error rate, p99 latency, and any configured custom metrics. The health check compares the metric value for users in the treatment group vs. the control group. If the treatment group's error rate exceeds the control group's error rate by more than the configured threshold (default: 1 absolute percentage point, e.g., 2% → 3%) with statistical significance (p &lt; 0.05), the rollout is automatically paused: rolloutPercentage is set to 0, an SSE event is broadcast, and a PagerDuty alert fires.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The automatic rollback is conservative — it pauses (sets to 0%) rather than rolls back (deletes the flag). This preserves the override rules and targeting configuration for the engineer who investigates. The engineer can then fix the issue and manually resume the rollout, or conclude it as a failure. Automatic rollback only applies during staged rollouts (while rolloutPercentage &lt; 100) — once a feature is at 100%, automatic rollback is not available (a kill switch is used instead for fully rolled-out features).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Flag Cleanup and Technical Debt Management</h3>
        <HighlightBlock as="p" tier="important">Flags that are never cleaned up accumulate as technical debt — dead code paths controlled by flags that no one remembers the purpose of. The flag management UI tracks: flag age, last modification date, current rollout percentage, and the owner team. Flags at 100% rollout for more than 30 days with no recent changes are flagged as "cleanup candidates" — a stale flag banner appears on the flag detail page: "This flag has been at 100% for 45 days. Consider removing the flag and the conditional code. Expected code cleanup: src/checkout/index.tsx line 47." The last field requires the flag to be tagged with its usage location (entered during creation, enforced by the creation form). The flag service exports a report of cleanup candidates to the team's weekly engineering meeting agenda.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Client-side vs. server-side flag evaluation: client-side evaluation (in the browser SDK) is fast and requires no server round trip after bootstrapping. But client-side evaluation exposes the flag configuration (which flags exist, what the targeting rules are) to any user who opens DevTools — a security concern for flags gating premium features. Server-side evaluation (the server evaluates flags and only tells the client the result, not the configuration) hides the flag logic but requires the server to be involved in every rendering decision. The pragmatic split: use server-side evaluation for security-sensitive flags (premium features, billing) and client-side evaluation for UI flags (which button color to show, whether to display a new onboarding tooltip).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Flag blast radius: a misconfigured flag that is broadly targeted can affect millions of users simultaneously. The flag creation UI enforces a rollout wizard for new flags — new flags must start at ≤10% rollout (no "launch at 100% immediately" button). Reaching 100% requires explicitly advancing through the staged rollout wizard. This is a UX guardrail, not a technical one, but the friction of the wizard prompts engineers to think about rollout strategy rather than defaulting to instant full launch.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">A feature rollout and experimentation system requires: (1) SDK bootstrap (single GET /api/flags with user context → evaluated flat object → in-memory O(1) reads, localStorage fallback, 5-min background re-fetch); (2) SSE stream propagation (&lt;30s flag changes to all connected SDK instances, 5-min poll fallback); (3) kill switch (single click → enabled=false → SSE broadcast → audit logged, recovery requires confirmation); (4) deterministic percentage bucketing (hash(userId+flagKey)%100, same user always same result); (5) targeting rules (user/device/custom attributes, AND/OR/NOT logic, server-side for security-sensitive flags); (6) progressive rollout stages (1%→10%→50%→100%, automatic pause on error rate spike via metrics polling, PagerDuty alert); (7) override rules (individual userId or employee group, priority over rollout); (8) edge evaluation (CDN KV store, 15ms latency, SSR inline flags as window.__flags); and (9) flag cleanup tracking (stale flag banner after 30d at 100%, cleanup candidate report). The foundational principle: flag evaluation must have zero runtime dependency on the flag service — local cache with SSE sync ensures availability even during flag service outages.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

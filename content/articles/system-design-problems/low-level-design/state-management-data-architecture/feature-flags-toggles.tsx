"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-feature-flags",
  title: "Design Feature Flags & Toggles for Frontend",
  description:
    "Production-grade feature flag system — remote config, gradual rollout, A/B testing, kill switches, flag dependencies, and safe flag evaluation.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "feature-flags-toggles",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: ["lld", "feature-flags", "gradual-rollout", "ab-testing", "kill-switch", "remote-config"],
  relatedTopics: ["local-vs-global-state-strategy", "cross-tab-state-synchronization"],
};

export default function FeatureFlagsTogglesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need a feature flag system that allows deploying features
          incrementally — enabling features for specific user segments, gradually
          increasing rollout percentage, A/B testing variants, and instantly
          disabling features (kill switch) if issues arise. Flags must be
          evaluated consistently across the application, cached locally for
          offline support, and synchronized with a remote config service.
        </p>
        <p><strong>Assumptions:</strong> React 19+, 50+ feature flags, remote config service, gradual rollout by percentage.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Remote Config:</strong> Flags fetched from server on app init, cached locally. Server is source of truth.</li>
          <li><strong>Gradual Rollout:</strong> Flag enabled for X% of users. Consistent hashing ensures same user always gets same result.</li>
          <li><strong>User Targeting:</strong> Flag can target specific users, segments (role, locale, plan), or everyone.</li>
          <li><strong>Kill Switch:</strong> Instantly disable a flag globally without deployment. Takes effect within 5 minutes.</li>
          <li><strong>Flag Dependencies:</strong> Flag B requires Flag A to be enabled. Evaluating B checks A first.</li>
          <li><strong>A/B Testing:</strong> Flag with multiple variants (control, treatment-A, treatment-B) with traffic split.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Remote config unreachable — use cached flags with stale indicator.</li>
          <li>Flag evaluated before remote config loaded — use default value, re-evaluate when config arrives.</li>
          <li>Conflicting flags (Flag A enables feature, Flag B disables it for same user) — priority resolution (explicit targeting &gt; gradual rollout &gt; default).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          Flags stored in a Zustand store with remote fetch on init. Each flag
          has: key, enabled boolean, rolloutPercentage, targeting rules, variants,
          and dependencies. Evaluation: check dependencies first, then targeting
          rules (user match → segment match → percentage hash), return result.
          Results cached per user session. React hook useFeatureFlag(key) returns
          boolean or variant string. Provider wraps app, fetches flags, populates
          store.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Six modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Flag Store (<code>stores/flag-store.ts</code>)</h4>
          <p>Zustand store with flag definitions, evaluation results cache, and loading state. Exposes getters and refresh action.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Flag Evaluator (<code>lib/flag-evaluator.ts</code>)</h4>
          <p>Pure function: evaluateFlag(flag, userContext) → boolean | variant. Checks dependencies, targeting rules, percentage hash.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Percentage Hasher (<code>lib/percentage-hasher.ts</code>)</h4>
          <p>Consistent hashing: hash(userId + flagKey) % 100 &lt; percentage → enabled. Same user always gets same result for same flag.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Remote Config Client (<code>lib/remote-config-client.ts</code>)</h4>
          <p>Fetches flags from server, handles retries, caching headers, and stale-while-revalidate. Falls back to cached flags on failure.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Flag Dependency Graph (<code>lib/flag-dependency-graph.ts</code>)</h4>
          <p>Validates flag dependency graph is a DAG. Evaluates dependencies before flag. Detects circular dependencies at config load time.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. React Integration (<code>hooks/useFeatureFlag.ts</code>)</h4>
          <p>useFeatureFlag(key) returns evaluation result. useFeatureVariant(key) returns variant string. Provider fetches remote config.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/feature-flags-toggles-architecture.svg"
          alt="Feature flag system showing remote config, flag evaluator, percentage hasher, and React integration"
          caption="Feature Flag Evaluation Pipeline"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <p>App init → fetch flags from remote config → populate store → components evaluate flags via hook → results cached. Flag refresh: poll remote config every 5 min → update store → components re-evaluate.</p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-3">
          <li><strong>Evaluate before load:</strong> Component mounts before flags fetched. Hook returns default value (false), re-evaluates when flags arrive. Use loading state for critical flags.</li>
          <li><strong>Kill switch latency:</strong> Server disables flag, but client has 5-min-old cached flags. Fix: remote config includes ETag — client polls every 5 min, detects change via ETag mismatch, refetches.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>Complete implementation: flag store, evaluator with dependency resolution, percentage hasher, remote config client, and React hooks.</p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Flag evaluation (cached)</td><td className="p-2">O(1) — cache lookup</td></tr>
              <tr><td className="p-2">Flag evaluation (uncached)</td><td className="p-2">O(d) — d dependencies</td></tr>
              <tr><td className="p-2">Percentage hash</td><td className="p-2">O(1) — murmur3 hash</td></tr>
              <tr><td className="p-2">Remote config fetch</td><td className="p-2">O(n) — n flags, network latency</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>Flags validated against schema — no arbitrary flag keys. Targeting rules sanitized (no code injection via flag config). Test: percentage hash consistency (same user + flag = same result), dependency evaluation order, kill switch propagation, offline fallback to cached flags.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Hardcoded flags:</strong> Flags defined in code — requires deployment to change. Interviewers expect remote config.</li>
          <li><strong>Inconsistent hashing:</strong> Using Math.random() for gradual rollout — user gets different result on each evaluation. Fix: hash(userId + flagKey) for consistent assignment.</li>
          <li><strong>No dependency validation:</strong> Circular flag dependencies cause infinite evaluation loops. Fix: validate DAG at config load time.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure the impact of a feature flag?</p>
            <p className="mt-2 text-sm">
              A: Tie the flag to analytics events. When flag is evaluated, emit an
              analytics event with flag key, result, and user segment. Aggregate
              events to measure engagement, error rates, and performance impact
              per flag variant. Build a dashboard showing flag performance metrics.
              On flag removal, clean up associated analytics events.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://launchdarkly.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">LaunchDarkly — Feature Management Platform</a></li>
          <li><a href="https://growthbook.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">GrowthBook — Open Source Feature Flags</a></li>
          <li><a href="https://en.wikipedia.org/wiki/MurmurHash" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Wikipedia — MurmurHash (Consistent Hashing)</a></li>
          <li><a href="https://martinfowler.com/articles/feature-toggles.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Martin Fowler — Feature Toggles</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

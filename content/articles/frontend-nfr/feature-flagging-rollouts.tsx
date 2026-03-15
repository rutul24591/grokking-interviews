"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-feature-flagging-rollouts",
  title: "Feature Flagging & Rollouts",
  description: "Comprehensive guide to feature flags: gradual rollouts, A/B testing, kill switches, targeting rules, and feature management platforms.",
  category: "frontend",
  subcategory: "nfr",
  slug: "feature-flagging-rollouts",
  version: "extensive",
  wordCount: 8500,
  readingTime: 34,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "feature-flags", "rollout", "ab-testing", "deployment", "targeting"],
  relatedTopics: ["deployment-strategy", "testing-strategy", "analytics"],
};

export default function FeatureFlaggingRolloutsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Feature Flagging</strong> (feature toggles, feature switches) is a technique for
          conditionally hiding or showing features in an application. Flags enable gradual rollouts,
          A/B testing, instant kill switches, and decoupling deployment from release. For staff
          engineers, feature flags are essential for risk mitigation and experimentation at scale.
        </p>
        <p>
          Feature flags transform release decisions from binary (deployed or not) to continuous
          (0% → 100% rollout). This enables testing in production with minimal risk, quick rollback
          without redeploy, and data-driven release decisions based on metrics.
        </p>
        <p>
          <strong>Feature flag use cases:</strong>
        </p>
        <ul>
          <li><strong>Gradual rollout:</strong> 1% → 5% → 25% → 50% → 100%</li>
          <li><strong>A/B testing:</strong> Compare variants with real users</li>
          <li><strong>Kill switch:</strong> Instant disable if issues detected</li>
          <li><strong>Targeted release:</strong> Beta users, internal teams, specific segments</li>
          <li><strong>Ops flags:</strong> Disable expensive features during incidents</li>
          <li><strong>Permission flags:</strong> Enable features by user role/plan</li>
        </ul>
      </section>

      <section>
        <h2>Flag Types</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Release Flags</h3>
        <ul className="space-y-2">
          <li>Short-lived flags for gradual rollout</li>
          <li>Remove flag after 100% rollout</li>
          <li>Enable/disable by percentage</li>
          <li>Target by user segment, geography</li>
          <li>Clean up after full release (technical debt)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Experiment Flags</h3>
        <ul className="space-y-2">
          <li>A/B test different variants</li>
          <li>Measure impact on metrics</li>
          <li>Statistical significance testing</li>
          <li>Longer-lived than release flags</li>
          <li>Remove after experiment concludes</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Ops Flags</h3>
        <ul className="space-y-2">
          <li>Operational controls</li>
          <li>Disable expensive features during incidents</li>
          <li>Long-lived, part of operations toolkit</li>
          <li>Quick access (dashboard, Slack command)</li>
          <li>Clear documentation of impact</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Permission Flags</h3>
        <ul className="space-y-2">
          <li>Enable features by user role/plan</li>
          <li>Enterprise features, beta access</li>
          <li>Long-lived, tied to business model</li>
          <li>Check user attributes/permissions</li>
          <li>Server-side validation required</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/flag-types.svg"
          alt="Feature Flag Types"
          caption="Feature flag types — release, experiment, ops, and permission flags with lifecycle and use cases"
        />
      </section>

      <section>
        <h2>Implementation Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Basic Flag Check</h3>
        <ul className="space-y-2">
          <li>Simple boolean flag</li>
          <li>Check flag before rendering feature</li>
          <li>Default value for offline/fallback</li>
          <li>Client-side evaluation</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Percentage Rollout</h3>
        <ul className="space-y-2">
          <li>Enable for X% of users</li>
          <li>Consistent assignment (same user gets same variant)</li>
          <li>Hash user ID for deterministic assignment</li>
          <li>Gradually increase percentage</li>
          <li>Monitor metrics at each stage</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Targeting Rules</h3>
        <ul className="space-y-2">
          <li>Target by user attributes (plan, role, geography)</li>
          <li>Target by behavior (power users, new users)</li>
          <li>Combine multiple conditions</li>
          <li>Priority ordering (specific rules before general)</li>
          <li>Server-side evaluation for sensitive rules</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Multivariate Testing</h3>
        <ul className="space-y-2">
          <li>Test multiple variants (A/B/C/D)</li>
          <li>Each variant has different configuration</li>
          <li>Track metrics per variant</li>
          <li>Statistical comparison</li>
          <li>Winner takes all or combine learnings</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/flag-evaluation-flow.svg"
          alt="Flag Evaluation Flow"
          caption="Feature flag evaluation — percentage rollout, targeting rules, and variant assignment"
        />
      </section>

      <section>
        <h2>Feature Management Platforms</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">LaunchDarkly</h3>
        <ul className="space-y-2">
          <li>Enterprise feature management</li>
          <li>Real-time flag updates</li>
          <li>Advanced targeting rules</li>
          <li>A/B testing and experimentation</li>
          <li>Audit logs, compliance</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Flagsmith</h3>
        <ul className="space-y-2">
          <li>Open-source option</li>
          <li>Self-host or cloud</li>
          <li>Feature flags and remote config</li>
          <li>A/B testing support</li>
          <li>Good for cost-conscious teams</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Unleash</h3>
        <ul className="space-y-2">
          <li>Open-source, self-hostable</li>
          <li>Simple, developer-friendly</li>
          <li>Gradual rollout strategies</li>
          <li>Good documentation</li>
          <li>Enterprise support available</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">In-House Implementation</h3>
        <ul className="space-y-2">
          <li>Full control over features</li>
          <li>No vendor lock-in</li>
          <li>Requires significant development</li>
          <li>Need to maintain and scale</li>
          <li>Consider for simple needs or specific requirements</li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Flag Hygiene</h3>
        <ul className="space-y-2">
          <li>Name flags descriptively (feature-checkout-v2)</li>
          <li>Document flag purpose and expected lifetime</li>
          <li>Remove flags after full rollout (release flags)</li>
          <li>Track flag usage (identify stale flags)</li>
          <li>Regular flag cleanup (quarterly audit)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Default Values</h3>
        <ul className="space-y-2">
          <li>Always provide default value</li>
          <li>Default should be safe (feature off by default)</li>
          <li>Handle flag service unavailability</li>
          <li>Cache flags locally for offline</li>
          <li>Graceful degradation if flags fail</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing</h3>
        <ul className="space-y-2">
          <li>Test all flag variants</li>
          <li>Test flag transitions (on → off, off → on)</li>
          <li>Test default value (flag service down)</li>
          <li>Include flag tests in CI/CD</li>
          <li>Test targeting rules thoroughly</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul className="space-y-2">
          <li>Track flag evaluation counts</li>
          <li>Monitor error rates per variant</li>
          <li>Compare metrics between variants</li>
          <li>Alert on anomalous flag behavior</li>
          <li>Dashboard for flag status</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security</h3>
        <ul className="space-y-2">
          <li>Server-side validation for permission flags</li>
          <li>Don&apos; expose sensitive logic to client</li>
          <li>Authenticate flag service requests</li>
          <li>Audit flag changes (who changed what)</li>
          <li>Role-based access to flag management</li>
        </ul>
      </section>

      <section>
        <h2>Rollout Strategies</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gradual Rollout</h3>
        <ol className="space-y-3">
          <li>Start with internal users (team, company)</li>
          <li>Expand to beta users (1-5%)</li>
          <li>Monitor metrics closely</li>
          <li>Increase to 10%, 25%, 50%</li>
          <li>Full rollout (100%) when confident</li>
          <li>Remove flag after stable period</li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Canary Release</h3>
        <ul className="space-y-2">
          <li>Deploy to small subset of users</li>
          <li>Compare metrics with control group</li>
          <li>Automated rollback if metrics degrade</li>
          <li>Gradual expansion if metrics good</li>
          <li>Combine with feature flags for control</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">A/B Testing</h3>
        <ul className="space-y-2">
          <li>Define hypothesis and success metrics</li>
          <li>Calculate sample size for significance</li>
          <li>Run test until statistical significance</li>
          <li>Analyze results (winner or inconclusive)</li>
          <li>Implement winner or iterate</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Kill Switch</h3>
        <ul className="space-y-2">
          <li>Instant disable without redeploy</li>
          <li>Pre-defined escalation procedure</li>
          <li>Test kill switch regularly</li>
          <li>Clear ownership (who can flip switch)</li>
          <li>Post-mortem after kill switch use</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/rollout-strategies.svg"
          alt="Rollout Strategies"
          caption="Rollout strategies — gradual rollout, canary release, A/B testing, and kill switch patterns"
        />
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are feature flags and why use them?</p>
            <p className="mt-2 text-sm">
              A: Feature flags enable conditional feature release without redeploy. Benefits:
              gradual rollout (reduce risk), A/B testing (data-driven decisions), kill switch
              (instant rollback), decouple deployment from release. Essential for modern CI/CD
              and experimentation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement percentage rollout?</p>
            <p className="mt-2 text-sm">
              A: Hash user ID to get consistent assignment. Compare hash to percentage threshold.
              Same user always gets same variant. Gradually increase percentage (1% → 5% → 25% →
              50% → 100%). Monitor metrics at each stage. Rollback if issues detected.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s your flag cleanup strategy?</p>
            <p className="mt-2 text-sm">
              A: Document flag purpose and expected lifetime. Track flag usage (identify stale
              flags). Remove release flags after 100% rollout and stable period. Quarterly flag
              audit. Keep ops and permission flags (long-lived). Technical debt if flags accumulate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle flag service unavailability?</p>
            <p className="mt-2 text-sm">
              A: Always provide default value. Cache flags locally for offline. Graceful degradation
              (feature off by default or last known state). Don&apos;t block page load waiting for
              flags. Retry with backoff. Monitor flag service health.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between release flags and experiment flags?</p>
            <p className="mt-2 text-sm">
              A: Release flags are short-lived, for gradual rollout, removed after 100% release.
              Experiment flags are for A/B testing, longer-lived, measure metric impact, removed
              after experiment concludes. Both need cleanup, but experiment flags require statistical
              analysis before removal.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://launchdarkly.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              LaunchDarkly — Feature Management
            </a>
          </li>
          <li>
            <a href="https://flagsmith.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Flagsmith — Open Source Feature Flags
            </a>
          </li>
          <li>
            <a href="https://getunleash.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Unleash — Feature Toggle System
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/articles/feature-toggles.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler — Feature Toggles
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

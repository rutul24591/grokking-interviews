"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-feature-rollout-strategy-extensive",
  title: "Feature Rollout Strategy",
  description: "Comprehensive guide to feature rollout strategies, covering feature flags, canary releases, phased rollouts, kill switches, and rollback procedures for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "feature-rollout-strategy",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "feature-flags", "rollout", "canary", "deployment", "release"],
  relatedTopics: ["canary-experimentation", "change-management", "incident-response"],
};

export default function FeatureRolloutStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Feature Rollout Strategy</strong> encompasses the systematic approach to releasing new
          functionality to users in a controlled, measurable, and reversible manner. It separates deployment
          (code running in production) from release (users can access the feature), enabling teams to test
          in production with minimal risk.
        </p>
        <p>
          A well-designed rollout strategy reduces the blast radius of issues, enables data-driven decisions
          about feature success, and provides clear rollback paths when problems occur. For staff and
          principal engineers, rollout strategy is a critical architectural concern—the decisions you make
          about feature flags, canary releases, and kill switches directly impact system reliability and
          team velocity.
        </p>
        <p>
          Modern deployment practices recognize that testing in staging is insufficient. Production has
          unique characteristics: real user behavior, production data volumes, complex distributed system
          interactions, and third-party integrations. Controlled production rollouts catch issues that
          staging cannot reveal.
        </p>
        <p>
          <strong>Key principles:</strong>
        </p>
        <ul>
          <li><strong>Gradual Exposure:</strong> Start small, expand based on confidence and metrics.</li>
          <li><strong>Measurable:</strong> Define success metrics before rollout begins.</li>
          <li><strong>Reversible:</strong> Clear rollback path at every stage of rollout.</li>
          <li><strong>Targeted:</strong> Control who sees the feature (segments, regions, percentages).</li>
          <li><strong>Observable:</strong> Monitor feature-specific metrics, not just system health.</li>
          <li><strong>Automated:</strong> Automate rollout progression where safe, manual gates where judgment needed.</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/feature-rollout-strategies.svg"
          alt="Feature Rollout Strategies comparison showing different approaches"
          caption="Feature Rollout Strategies: Comparison of percentage-based, segment-based, canary, blue-green, and dark launch approaches with their trade-offs and use cases."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Deployment ≠ Release</h3>
          <p>
            Deployment is code running in production. Release is users can access the feature. Feature
            flags decouple these—you can deploy without releasing, enabling testing in production and
            controlled rollouts. This separation is fundamental to modern deployment practices.
          </p>
        </div>
      </section>

      <section>
        <h2>Rollout Strategies</h2>
        <p>
          Different rollout strategies suit different scenarios. Choose based on risk tolerance, feature
          criticality, and organizational maturity.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Percentage-Based Rollout</h3>
        <p>
          Gradually increase the percentage of users who see the feature. This is the most common approach
          for consumer-facing features.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Typical Stages</h4>
        <ul>
          <li><strong>Stage 1: 1% (Canary)</strong> - Catch critical issues, minimal user impact</li>
          <li><strong>Stage 2: 5% (Early Adopters)</strong> - Broader testing, still limited blast radius</li>
          <li><strong>Stage 3: 25% (Broad Test)</strong> - Significant traffic, confident in stability</li>
          <li><strong>Stage 4: 50% (Majority)</strong> - Most users, ready for full rollout</li>
          <li><strong>Stage 5: 100% (Full Rollout)</strong> - Feature fully released</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Timing Considerations</h4>
        <p>
          Time at each stage depends on risk: low-risk features might spend hours per stage; high-risk
          features might spend days or weeks. Monitor metrics continuously; don&apos;t advance stages
          automatically without verifying health.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Consumer-facing features with broad audience</li>
          <li>Features where impact scales with user count</li>
          <li>When you want statistical significance for A/B testing</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Segment-Based Rollout</h3>
        <p>
          Target specific user segments rather than random percentages. This allows controlled exposure
          to users who are more tolerant of issues or whose feedback is most valuable.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Common Segments</h4>
        <ul>
          <li><strong>Internal Employees</strong> - First exposure, can report issues quickly</li>
          <li><strong>Beta Users / Power Users</strong> - More tolerant of bugs, provide valuable feedback</li>
          <li><strong>Specific Geographic Regions</strong> - Limit impact to one region, test infrastructure</li>
          <li><strong>Enterprise vs SMB Customers</strong> - Different risk profiles, different support needs</li>
          <li><strong>New vs Existing Users</strong> - New users have no expectations; existing users notice changes</li>
          <li><strong>Technical Sophistication</strong> - Tech-savvy users vs general audience</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Complex features requiring user feedback</li>
          <li>Features with different impact on different user types</li>
          <li>When you want feedback from specific user personas</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Canary Release</h3>
        <p>
          Deploy to a small subset of infrastructure or users, monitor closely, then expand. Named after
          canaries in coal mines—early warning system for problems.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Infrastructure Canary</h4>
        <p>
          Deploy to specific servers/pods first. Route small percentage of traffic to canary instances.
          Monitor error rates, latency, resource usage. If healthy, expand canary to more instances.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">User Canary</h4>
        <p>
          Deploy to all infrastructure but expose feature to small percentage of users. Monitor user-facing
          metrics. Expand user percentage if healthy.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Backend changes with potential performance impact</li>
          <li>Database migrations or schema changes</li>
          <li>Infrastructure upgrades</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Blue-Green Release</h3>
        <p>
          Maintain two identical production environments (blue and green). One serves production traffic;
          the other is idle. Deploy new version to idle environment, test, then switch traffic.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Process</h4>
        <ol>
          <li>Blue environment serves production traffic</li>
          <li>Deploy new version to green environment</li>
          <li>Test green environment thoroughly</li>
          <li>Switch load balancer to route traffic to green</li>
          <li>Monitor green; if issues, switch back to blue immediately</li>
          <li>Blue becomes idle environment for next deployment</li>
        </ol>
        <h4 className="mt-4 mb-2 font-semibold">Benefits</h4>
        <ul>
          <li>Instant rollback (switch back to blue)</li>
          <li>Zero downtime deployments</li>
          <li>Full environment testing before any user traffic</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Trade-offs</h4>
        <ul>
          <li>Requires 2x infrastructure (expensive)</li>
          <li>Database migrations need careful handling (both environments must work)</li>
          <li>State management complexity</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Dark Launch</h3>
        <p>
          Enable feature in production but don&apos;t expose it to users. Traffic flows through the new
          code path, allowing you to test infrastructure under real load without user impact.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Implementation</h4>
        <ul>
          <li>Deploy feature with flag turned off for all users</li>
          <li>Route production traffic through feature code path</li>
          <li>Log outputs, compare with existing system</li>
          <li>Monitor performance, error rates, resource usage</li>
          <li>When confident, turn flag on to expose to users</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Search algorithm changes (compare results with existing algorithm)</li>
          <li>Recommendation engine updates</li>
          <li>Backend refactoring with same external behavior</li>
          <li>Load testing new infrastructure</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Shadow Traffic</h3>
        <p>
          Duplicate production traffic and send to new system alongside existing system. Compare outputs
          without affecting users. More aggressive than dark launch—uses real traffic, not just routing
          through new code.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Use Cases</h4>
        <ul>
          <li>Database migrations (write to both, compare reads)</li>
          <li>Service rewrites (run old and new in parallel)</li>
          <li>Algorithm changes (compare outputs)</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Choose Strategy Based on Risk</h3>
          <p>
            Low-risk changes (UI tweaks, copy changes) can use simple percentage rollout. High-risk changes
            (database migrations, core algorithm changes) need canary, dark launch, or shadow traffic.
            Match the rollout strategy to the potential blast radius.
          </p>
        </div>
      </section>

      <section>
        <h2>Feature Flag Implementation</h2>
        <p>
          Feature flags are the technical foundation that enables controlled rollouts. A well-designed
          flag system provides flexibility, performance, and safety.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Flag Types</h3>
        <h4 className="mt-4 mb-2 font-semibold">Release Flags</h4>
        <p>
          Short-lived flags used to control feature rollout. Removed after feature is fully released.
          Lifecycle: created for rollout, active during gradual release, removed after 100% rollout.
        </p>
        <p><strong>Best practice:</strong> Set expiration date, track flag age, remove flags older than
        30 days.</p>

        <h4 className="mt-4 mb-2 font-semibold">Experiment Flags</h4>
        <p>
          Used for A/B testing, measuring feature impact. Multiple variants (control, variant A, variant B).
          Users assigned to variants, metrics compared across groups.
        </p>
        <p><strong>Best practice:</strong> Ensure statistical significance, run for sufficient duration,
        account for novelty effects.</p>

        <h4 className="mt-4 mb-2 font-semibold">Ops Flags (Kill Switches)</h4>
        <p>
          Emergency flags to disable features quickly. Long-lived, kept for operational safety. Should be
          tested regularly to ensure they work when needed.
        </p>
        <p><strong>Best practice:</strong> Document each kill switch, test quarterly, ensure low latency
        evaluation.</p>

        <h4 className="mt-4 mb-2 font-semibold">Permission Flags</h4>
        <p>
          Control feature access by tier, role, or entitlement. Long-lived, tied to business model.
          Examples: enterprise features, beta access, geographic restrictions.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Flag Evaluation</h3>
        <h4 className="mt-4 mb-2 font-semibold">Server-Side Evaluation</h4>
        <p>
          Evaluate flags on backend servers. Best for:
        </p>
        <ul>
          <li>Consistency across requests</li>
          <li>Security (users can&apos;t tamper with evaluation)</li>
          <li>Complex targeting rules</li>
          <li>Features affecting backend logic</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Client-Side Evaluation</h4>
        <p>
          Evaluate flags in client application (web, mobile). Best for:
        </p>
        <ul>
          <li>UI customization</li>
          <li>Reducing server load</li>
          <li>Offline scenarios</li>
          <li>Features only affecting presentation</li>
        </ul>
        <p><strong>Caveat:</strong> Users can potentially tamper; don&apos;t use for security or billing.</p>

        <h4 className="mt-4 mb-2 font-semibold">Edge Evaluation</h4>
        <p>
          Evaluate flags at CDN/edge layer. Best for:
        </p>
        <ul>
          <li>Lowest latency</li>
          <li>Global consistency</li>
          <li>Reducing origin traffic</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Targeting Rules</h3>
        <p>
          Targeting rules determine which users see a feature. Rules can combine multiple conditions:
        </p>
        <ul>
          <li><strong>User Attributes:</strong> User ID, email, account age, tier, role</li>
          <li><strong>Geographic:</strong> Country, region, city, datacenter</li>
          <li><strong>Device:</strong> Platform, OS version, browser, app version</li>
          <li><strong>Behavioral:</strong> Usage patterns, feature adoption, purchase history</li>
          <li><strong>Percentage:</strong> Hash-based percentage of users</li>
          <li><strong>Contextual:</strong> Time of day, request volume, system health</li>
        </ul>
        <p><strong>Best practice:</strong> Use sticky assignments (same user always gets same variant)
        for experiments. Use consistent hashing for percentage rollouts.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Flag Management Platform</h3>
        <p>
          Consider build vs. buy for feature flag management:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Build</h4>
        <p>
          Custom implementation gives full control but requires ongoing maintenance. Consider if you have
          unique requirements or want to avoid vendor lock-in.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Buy</h4>
        <p>
          Commercial platforms (LaunchDarkly, Split, Flagsmith) provide:
        </p>
        <ul>
          <li>Managed infrastructure (high availability, low latency)</li>
          <li>Rich targeting rules</li>
          <li>Analytics and experimentation</li>
          <li>Audit logs and compliance</li>
          <li>SDKs for multiple languages</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/feature-flag-management.svg"
          alt="Feature Flag Management Architecture showing evaluation flow"
          caption="Feature Flag Management: Centralized flag service with SDKs for multiple platforms, targeting rules engine, and real-time updates."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Flag Hygiene Is Critical</h3>
          <p>
            Flags accumulate technical debt. Stale flags (released features never cleaned up) clutter code
            and slow evaluation. Implement flag lifecycle management: track creation date, set expiration,
            alert on old flags, require removal plan for release flags.
          </p>
        </div>
      </section>

      <section>
        <h2>Kill Switches & Rollback</h2>
        <p>
          Every feature rollout needs a clear path to disable the feature quickly. Kill switches and
          rollback procedures are your safety net when things go wrong.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Kill Switch Levels</h3>
        <h4 className="mt-4 mb-2 font-semibold">Feature Level</h4>
        <p>
          Disable specific feature without affecting other functionality. Most granular, least disruptive.
          Implemented via feature flags.
        </p>
        <p><strong>Use when:</strong> Issue is isolated to one feature.</p>

        <h4 className="mt-4 mb-2 font-semibold">Service Level</h4>
        <p>
          Disable entire service. More disruptive but catches issues that span multiple features within
          a service.
        </p>
        <p><strong>Use when:</strong> Service-wide issues (performance degradation, cascading failures).</p>

        <h4 className="mt-4 mb-2 font-semibold">Region Level</h4>
        <p>
          Disable feature or service in affected region only. Limits impact to one geographic area.
        </p>
        <p><strong>Use when:</strong> Region-specific issues (datacenter problems, regional compliance).</p>

        <h4 className="mt-4 mb-2 font-semibold">Global Level</h4>
        <p>
          Emergency global disable. Nuclear option—use when issue affects all users and requires immediate
          action.
        </p>
        <p><strong>Use when:</strong> Critical security vulnerability, data corruption, widespread outage.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rollback Triggers</h3>
        <p>
          Define clear criteria for when to rollback. Don&apos;t wait for complete failure—early action
          minimizes impact.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Technical Metrics</h4>
        <ul>
          <li><strong>Error Rate:</strong> Exceeds threshold (e.g., &gt;1% for critical paths)</li>
          <li><strong>Latency:</strong> P99 latency increases beyond acceptable (e.g., &gt;50% increase)</li>
          <li><strong>Resource Usage:</strong> CPU, memory, database connections spike</li>
          <li><strong>Dependency Failures:</strong> Downstream services reporting issues</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Business Metrics</h4>
        <ul>
          <li><strong>Conversion Rate:</strong> Significant decline in checkout, signup, or key funnel</li>
          <li><strong>Engagement:</strong> Drop in feature usage, session duration</li>
          <li><strong>Revenue:</strong> Measurable revenue impact</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">User Signals</h4>
        <ul>
          <li><strong>Support Tickets:</strong> Spike in complaints about specific feature</li>
          <li><strong>Social Media:</strong> Negative mentions trending</li>
          <li><strong>App Store Reviews:</strong> Sudden negative reviews</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Human Judgment</h4>
        <p>
          On-call engineer can trigger rollback based on intuition or incomplete information. Better to
          rollback and investigate than wait for certainty while users suffer.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rollback Procedure</h3>
        <ol>
          <li>
            <strong>Flip Kill Switch:</strong> Disable feature via flag (seconds to execute).
          </li>
          <li>
            <strong>Verify Recovery:</strong> Monitor metrics to confirm they return to baseline.
          </li>
          <li>
            <strong>Communicate:</strong> Notify stakeholders (support, product, leadership) of rollback.
          </li>
          <li>
            <strong>Preserve State:</strong> Save logs, metrics, and state for investigation.
          </li>
          <li>
            <strong>Investigate:</strong> Root cause analysis in non-production environment.
          </li>
          <li>
            <strong>Document:</strong> Write incident report with timeline, impact, root cause, prevention.
          </li>
          <li>
            <strong>Plan Re-release:</strong> Fix issue, test thoroughly, plan safer rollout.
          </li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rollback vs. Roll-Forward</h3>
        <p>
          Sometimes rolling forward (fixing and redeploying) is better than rolling back:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Rollback When:</h4>
        <ul>
          <li>Fix will take hours or days</li>
          <li>Issue is severe (data loss, security, widespread outage)</li>
          <li>Rollback is well-tested and safe</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Roll-Forward When:</h4>
        <ul>
          <li>Fix is ready and tested (minutes away)</li>
          <li>Rollback is risky (database migrations, data format changes)</li>
          <li>Issue is minor and contained</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Test Kill Switches Regularly</h3>
          <p>
            Kill switches that haven&apos;t been tested may fail when you need them most. Include kill
            switch testing in game days and fire drills. Verify latency is acceptable (should be seconds,
            not minutes). Document exactly who can trigger kill switches and how.
          </p>
        </div>
      </section>

      <section>
        <h2>Success Metrics</h2>
        <p>
          Define success metrics before rollout begins. You can&apos;t make data-driven decisions without
          knowing what you&apos;re measuring.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Adoption Metrics</h3>
        <ul>
          <li><strong>Activation Rate:</strong> % of eligible users who try the feature</li>
          <li><strong>Time to Activation:</strong> How long until users discover and use feature</li>
          <li><strong>Feature Penetration:</strong> % of active users who use feature</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Engagement Metrics</h3>
        <ul>
          <li><strong>Retention:</strong> Do users continue using the feature over time?</li>
          <li><strong>Frequency:</strong> How often do users engage with feature?</li>
          <li><strong>Depth:</strong> How deeply do users engage (features used, time spent)?</li>
          <li><strong>Stickiness:</strong> DAU/MAU ratio for feature users</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Business Impact Metrics</h3>
        <ul>
          <li><strong>Revenue:</strong> Direct revenue from feature or uplift in overall revenue</li>
          <li><strong>Conversion:</strong> Impact on signup, purchase, upgrade funnels</li>
          <li><strong>Retention:</strong> Does feature improve user retention?</li>
          <li><strong>Efficiency:</strong> Cost savings, support ticket reduction, time savings</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Technical Health Metrics</h3>
        <ul>
          <li><strong>Error Rate:</strong> Feature-specific and overall error rates</li>
          <li><strong>Latency:</strong> P50, P95, P99 latency for feature endpoints</li>
          <li><strong>Resource Usage:</strong> CPU, memory, database load, bandwidth</li>
          <li><strong>Availability:</strong> Feature uptime, successful request rate</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Satisfaction Metrics</h3>
        <ul>
          <li><strong>NPS:</strong> Net Promoter Score for feature users</li>
          <li><strong>CSAT:</strong> Customer satisfaction surveys</li>
          <li><strong>Support Tickets:</strong> Volume and sentiment of support requests</li>
          <li><strong>User Feedback:</strong> Qualitative feedback from surveys, interviews</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Experiment Analysis</h3>
        <p>
          For A/B tests, use statistical analysis to determine winner:
        </p>
        <ul>
          <li><strong>Statistical Significance:</strong> P-value &lt; 0.05 (95% confidence)</li>
          <li><strong>Effect Size:</strong> Magnitude of difference between variants</li>
          <li><strong>Confidence Intervals:</strong> Range of likely true effect</li>
          <li><strong>Power Analysis:</strong> Ensure sufficient sample size</li>
        </ul>
        <p><strong>Best practice:</strong> Pre-register analysis plan, avoid p-hacking, run for full
        duration even if early results seem clear.</p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Define Success Criteria Before Rollout</h3>
          <p>
            Before starting rollout, document: what metrics indicate success? What metrics indicate
            failure? What are the thresholds for each? This prevents moving goalposts and enables
            clear go/no-go decisions at each stage.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/feature-flag-best-practices.svg"
          alt="Feature Flag Best Practices showing lifecycle management"
          caption="Feature Flag Best Practices: From flag creation through testing, rollout, monitoring, and retirement with proper hygiene throughout."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pre-Rollout</h3>
        <ul>
          <li>Define success metrics and thresholds before rollout</li>
          <li>Test feature flags in staging (all states: on, off, targeting rules)</li>
          <li>Prepare rollback plan and verify kill switch works</li>
          <li>Set up monitoring dashboards for feature-specific metrics</li>
          <li>Communicate rollout plan to stakeholders (support, product, leadership)</li>
          <li>Document feature behavior and expected impact</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">During Rollout</h3>
        <ul>
          <li>Start with smallest exposure (1% or internal only)</li>
          <li>Monitor continuously, especially in first hours</li>
          <li>Don&apos;t advance stages automatically—verify metrics at each stage</li>
          <li>Be prepared to rollback quickly if issues arise</li>
          <li>Document any issues and how they were resolved</li>
          <li>Keep stakeholders informed of progress</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Post-Rollout</h3>
        <ul>
          <li>Analyze experiment results (if A/B test)</li>
          <li>Document learnings and share with team</li>
          <li>Remove release flags after full rollout (within 30 days)</li>
          <li>Update documentation with final feature behavior</li>
          <li>Celebrate success with team</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Flag Hygiene</h3>
        <ul>
          <li>Track flag creation date and owner</li>
          <li>Set expiration dates for release flags</li>
          <li>Alert on flags older than threshold (30 days)</li>
          <li>Regular flag audits (quarterly)</li>
          <li>Remove stale flags to reduce technical debt</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>
            <strong>No rollback plan:</strong> Rolling out without clear rollback procedure. Fix: Always
            have kill switch ready and tested.
          </li>
          <li>
            <strong>Undefined success metrics:</strong> Can&apos;t determine if rollout is successful.
            Fix: Define metrics before rollout.
          </li>
          <li>
            <strong>Too fast progression:</strong> Moving through stages too quickly. Fix: Spend adequate
            time at each stage, verify metrics.
          </li>
          <li>
            <strong>Flag debt:</strong> Flags never removed after rollout. Fix: Track flag age, set
            expiration, regular cleanup.
          </li>
          <li>
            <strong>Testing only in staging:</strong> Skipping production testing. Fix: Use canary/dark
            launch for production validation.
          </li>
          <li>
            <strong>No monitoring:</strong> Rolling out without feature-specific dashboards. Fix: Set up
            monitoring before rollout.
          </li>
          <li>
            <strong>Complex targeting rules:</strong> Rules too complex to debug. Fix: Keep rules simple,
            document thoroughly.
          </li>
          <li>
            <strong>Flag evaluation latency:</strong> Flags add significant latency. Fix: Cache flag
            values, use edge evaluation.
          </li>
          <li>
            <strong>Inconsistent evaluation:</strong> User gets different variants across requests. Fix:
            Use sticky assignments, consistent hashing.
          </li>
          <li>
            <strong>No stakeholder communication:</strong> Support team unaware of rollout. Fix:
            Communicate plan to all stakeholders.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between deployment and release?</p>
            <p className="mt-2 text-sm">
              A: Deployment is code running in production. Release is users can access the feature. Feature
              flags decouple these—you can deploy without releasing, enabling testing in production and
              controlled rollouts. This separation is fundamental to modern deployment practices.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide rollout stages?</p>
            <p className="mt-2 text-sm">
              A: Start with 1% (canary) to catch critical issues. Expand to 5%, 25%, 50%, 100% based on
              confidence and metrics. Spend more time at early stages for risky changes. Monitor metrics
              at each stage before expanding. Don&apos;t advance automatically—verify health first.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use a kill switch vs rollback?</p>
            <p className="mt-2 text-sm">
              A: Kill switch (feature flag off) for quick response—seconds to disable. Use first when
              issues arise. Rollback (redeploy previous version) for fundamental issues that flags
              can&apos;t address (database schema changes, data format changes). Kill switch first to
              stabilize, then rollback if needed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you test feature flags?</p>
            <p className="mt-2 text-sm">
              A: Test all flag states (on/off) in staging. Test targeting rules with different user
              segments. Test flag transitions (turning on/off). Test kill switch in production (during
              maintenance window). Include flag state in test reports. Verify flag evaluation latency
              is acceptable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you monitor during rollout?</p>
            <p className="mt-2 text-sm">
              A: Technical: error rate, latency (P50/P95/P99), resource usage, availability. Business:
              conversion rate, engagement, revenue impact. User: support tickets, NPS, feedback. Compare
              metrics between control and variant groups. Set up alerts for metric degradation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle database migrations with feature flags?</p>
            <p className="mt-2 text-sm">
              A: Database changes need special care. For schema changes: make backward-compatible changes
              first (add columns, don&apos;t remove), deploy code that works with both old and new schema,
              migrate data, then clean up old schema. Use expand/contract pattern. Test rollback carefully
              since database changes may not be reversible.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>LaunchDarkly Best Practices: <a href="https://launchdarkly.com" className="text-accent hover:underline">launchdarkly.com</a></li>
          <li>Martin Fowler: FeatureToggle</li>
          <li>&quot;Continuous Delivery&quot; by Jez Humble and David Farley</li>
          <li>Google SRE Book: Release Engineering</li>
          <li>Split.io: Feature Flag Best Practices</li>
          <li>Netflix: Canary Deployments</li>
          <li>Flagsmith: Open Source Feature Flags</li>
          <li>&quot;Accelerate&quot; by Nicole Forsgren et al.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

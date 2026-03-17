"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-blue-green-deployment-extensive",
  title: "Blue-Green Deployment",
  description:
    "Deploy a new version into a parallel environment and switch traffic in a controlled cutover, enabling fast rollback at the cost of temporary duplicate capacity.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "blue-green-deployment",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "infra", "deployment"],
  relatedTopics: ["canary-deployment", "rolling-deployment", "feature-flags"],
};

export default function BlueGreenDeploymentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What Blue-Green Deployment Is</h2>
        <p>
          <strong>Blue-green deployment</strong> runs two separate but equivalent environments: the currently serving
          environment (blue) and the new candidate environment (green). You deploy the new version into green, validate
          it, and then switch production traffic from blue to green. If something goes wrong, rollback is fast: switch
          traffic back to blue.
        </p>
        <p>
          The primary benefit is rollback speed. Rolling deployments can roll back, but they often require reversing a
          partially completed rollout and dealing with mixed-version interactions. Blue-green aims for a clean cutover
          where only one environment serves at a time.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/blue-green-deployment-diagram-1.svg"
          alt="Blue-green deployment with two environments and a traffic switch between them"
          caption="Blue-green creates a parallel environment for validation and enables rapid rollback by switching traffic."
        />
      </section>

      <section>
        <h2>The Real Difficulty: Data and Side Effects</h2>
        <p>
          Blue-green is easy when the service is stateless and reads from stable dependencies. It becomes challenging
          when the service writes data or triggers side effects (emails, payments, event emission). When two environments
          exist, you must decide what it means for both to be &quot;identical&quot; and what happens during and after cutover.
        </p>
        <p>
          The most important constraint is rollback safety. If the green environment writes data in a way that the blue
          environment cannot understand, rolling back traffic to blue can break correctness. This is why schema and
          contract evolution discipline matters even with blue-green.
        </p>
      </section>

      <section>
        <h2>Traffic Switching: LB Cutover vs DNS Cutover</h2>
        <p>
          Blue-green needs a switching mechanism. Many systems switch at a load balancer or ingress layer because it is
          fast and reversible. DNS-based cutovers can work, but they introduce additional uncertainty because of caching
          and TTL behavior.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/blue-green-deployment-diagram-2.svg"
          alt="Blue-green cutover mechanisms: load balancer switch, DNS switch, and warmup or shadow traffic"
          caption="How you switch traffic determines rollback speed and how much caching uncertainty you must tolerate."
        />
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Cutover Considerations</h3>
          <ul className="space-y-2">
            <li>
              <strong>Session behavior:</strong> if sessions are sticky to instances or environments, plan how they move.
            </li>
            <li>
              <strong>Connection draining:</strong> allow in-flight requests on blue to complete before switching hard.
            </li>
            <li>
              <strong>Warmup:</strong> green should receive warmup traffic so caches, JITs, and dependency pools are ready.
            </li>
            <li>
              <strong>Health scope:</strong> validate readiness using real dependency checks, not just process liveness.
            </li>
          </ul>
        </div>
        <p>
          If you cut over too quickly without warmup, you can create a self-inflicted incident even when the new version
          is correct. The green environment may simply be cold and under-provisioned for immediate full traffic.
        </p>
      </section>

      <section>
        <h2>Validation Strategies: More Than &quot;Smoke Tests Pass&quot;</h2>
        <p>
          The reason to keep blue intact is so you can validate green safely. Simple smoke tests are necessary but often
          insufficient. Many regressions show up only under real traffic patterns and production data.
        </p>
        <p>
          Common validation steps include synthetic smoke checks, canary-like limited exposure, and shadow traffic where
          you send a copy of real requests to green but do not use green responses for users. Shadow traffic helps catch
          performance and correctness problems without user impact, but it requires careful handling to avoid duplicate
          side effects.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Blue-green reduces certain risks but introduces new ones. Most failures are about mismatched assumptions
          between environments or irreversible side effects that make rollback unsafe.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/blue-green-deployment-diagram-3.svg"
          alt="Blue-green failure modes: irreversible schema changes, cache cold-start, session stickiness, and dual-side-effects"
          caption="Blue-green failures are often about rollback safety: data and side effects must remain compatible across environments."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Irreversible changes</h3>
            <p className="mt-2 text-sm text-muted">
              Green writes data that blue cannot read or interpret, so rollback breaks users and workflows.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> expand/contract schema evolution and explicit rollback tests for data compatibility.
              </li>
              <li>
                <strong>Signal:</strong> rollback fails or produces correctness issues that did not exist before cutover.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Cold green</h3>
            <p className="mt-2 text-sm text-muted">
              Green is healthy under light checks but fails under full traffic due to cold caches, pools, or missing capacity.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> warmup traffic, capacity buffer, and gradual ramp even during a &quot;switch&quot;.
              </li>
              <li>
                <strong>Signal:</strong> latency and error spikes immediately after cutover, then recover as caches warm.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Dual side effects</h3>
            <p className="mt-2 text-sm text-muted">
              During validation or shadow traffic, both environments trigger side effects, causing duplicates or inconsistencies.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> isolate side effects during validation and use idempotency and deduplication for risky operations.
              </li>
              <li>
                <strong>Signal:</strong> duplicate notifications, double charges, or unexpected event volumes around cutover time.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Environment drift</h3>
            <p className="mt-2 text-sm text-muted">
              Blue and green are not truly equivalent due to config differences, dependency versions, or network policies.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> treat environments as code and validate parity; avoid one-off manual edits.
              </li>
              <li>
                <strong>Signal:</strong> issues reproduce only in green even before traffic cutover.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Upgrading a Critical Dependency With a Safe Backout</h2>
        <p>
          A service needs a major runtime upgrade. The team expects unknown production behaviors and wants a rollback path
          that does not depend on reversing a partial rollout. Blue-green fits: green can be validated thoroughly with
          smoke and shadow checks, then production traffic can switch. If issues appear, rollback is a traffic switch.
        </p>
        <p>
          The design success criteria is rollback safety. The team ensures schemas remain compatible across versions and
          that side effects are idempotent. They also warm green and validate capacity so the cutover does not create a
          cold-start outage.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Plan data evolution:</strong> ensure rollback does not break read and write paths by maintaining compatibility.
          </li>
          <li>
            <strong>Validate green with production-like load:</strong> use shadow traffic carefully and focus on tail latency and correctness.
          </li>
          <li>
            <strong>Warm and buffer:</strong> pre-warm caches and keep capacity headroom to absorb cutover spikes.
          </li>
          <li>
            <strong>Define cutover signals:</strong> decide which metrics block cutover and which metrics trigger immediate rollback.
          </li>
          <li>
            <strong>Keep rollback boring:</strong> rollback should be a well-understood switch, not an emergency procedure.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Can the old environment safely serve after the new environment has performed writes?
          </li>
          <li>
            Is traffic switching fast and reversible with clear health and draining semantics?
          </li>
          <li>
            Is green validated with realistic traffic patterns and production-like data?
          </li>
          <li>
            Are side effects controlled during validation to prevent duplicates?
          </li>
          <li>
            Is environment parity enforced so blue and green differ only by intended version changes?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Why is blue-green rollback considered &quot;fast&quot;?</p>
            <p className="mt-2 text-sm">
              Because rollback is a routing change rather than a multi-step redeploy. The old environment remains intact and ready to serve.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What makes blue-green unsafe?</p>
            <p className="mt-2 text-sm">
              Irreversible schema or side-effect changes that prevent the old environment from serving correctly after cutover.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">When would you prefer rolling or canary instead?</p>
            <p className="mt-2 text-sm">
              When you cannot afford duplicate capacity or when you want gradual exposure with fine-grained metrics gating rather than a single switch.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}


"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-rolling-deployment-extensive",
  title: "Rolling Deployment",
  description:
    "Update production gradually by replacing instances in batches, preserving availability while using health and metrics gates to detect regressions early.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "rolling-deployment",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "infra", "deployment"],
  relatedTopics: ["canary-deployment", "blue-green-deployment", "auto-scaling"],
};

export default function RollingDeploymentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What a Rolling Deployment Is</h2>
        <p>
          A <strong>rolling deployment</strong> updates a service by replacing instances in small batches. At any moment,
          part of the fleet is still on the old version while another part runs the new version. The goal is to preserve
          availability without provisioning a full parallel environment.
        </p>
        <p>
          Rolling deployments are the default in many orchestrators because they fit the desired-state model: the system
          creates new instances, waits for readiness, shifts traffic, and then removes old instances. When done well,
          rollouts are uneventful. When done poorly, the system ends up serving mixed versions with broken compatibility
          and slow failures that are difficult to debug.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/rolling-deployment-diagram-1.svg"
          alt="Rolling deployment replacing instances in batches with readiness gating and traffic draining"
          caption="Rolling deploys preserve availability by controlling how quickly capacity turns over and how traffic moves to new instances."
        />
      </section>

      <section>
        <h2>The Prerequisite: Compatibility During a Mixed-Version Window</h2>
        <p>
          Rolling deploys create a mixed-version window. That window is safe only if the system is designed for it. Most
          rolling-deploy outages are compatibility outages: a new version expects a schema or API shape that old versions
          do not understand, or a new background job conflicts with old job logic.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">What Must Stay Compatible</h3>
          <ul className="space-y-2">
            <li>
              <strong>API contracts:</strong> clients and downstream services must handle old and new responses during rollout.
            </li>
            <li>
              <strong>Data schemas:</strong> database changes should follow expand/contract patterns so both versions can operate safely.
            </li>
            <li>
              <strong>State transitions:</strong> if you use state machines, ensure transitions remain valid across versions.
            </li>
            <li>
              <strong>Background processing:</strong> ensure workers do not duplicate work or violate invariants when multiple versions coexist.
            </li>
          </ul>
        </div>
        <p>
          Feature flags often help because they separate deployment from release. You can ship new code while keeping the
          risky behavior off until the fleet is fully updated and stable.
        </p>
      </section>

      <section>
        <h2>Rollout Controls: Capacity, Readiness, and Draining</h2>
        <p>
          Rolling deployments are mostly about <strong>capacity management</strong>. You choose how many instances can be
          unavailable at once and how much extra capacity (if any) you add during the rollout. If you turn over capacity
          too quickly, you drop below the safe threshold and overload what remains.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/rolling-deployment-diagram-2.svg"
          alt="Rolling deployment control points: surge, max unavailable, readiness checks, and connection draining"
          caption="Rolling deploy safety comes from controlling turnover: readiness gates, surge buffers, and draining rules prevent overload."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Batch size and pace:</strong> smaller batches reduce blast radius but slow rollout; larger batches reduce time but increase risk.
          </li>
          <li>
            <strong>Surge capacity:</strong> allowing temporary extra instances preserves throughput during replacement.
          </li>
          <li>
            <strong>Readiness vs liveness:</strong> readiness determines when traffic is safe; liveness should be conservative to avoid restart storms.
          </li>
          <li>
            <strong>Connection draining:</strong> give in-flight requests time to finish; abrupt termination causes retries and load spikes.
          </li>
          <li>
            <strong>Warmup:</strong> new instances often need time to load caches, compile templates, or establish connections.
          </li>
        </ul>
        <p className="mt-4">
          The correct tuning depends on the service and the dependency graph. A service with expensive warmup and heavy
          downstream dependencies needs slower, more conservative rollouts than a stateless service with fast startup.
        </p>
      </section>

      <section>
        <h2>Gates and Observability: Decide Using Production Signals</h2>
        <p>
          A rolling deployment needs a decision loop: deploy a batch, observe, then continue or stop. That loop can be
          manual or automated, but it must exist. If you continuously replace instances without looking at signals, you
          are effectively doing a big-bang rollout slowly.
        </p>
        <p>
          The most useful gates are those that represent user impact and system health: error rate, tail latency, and
          saturation. For many systems you also want domain-level metrics that reveal correctness regressions that are not
          visible as 5xx errors, such as dropped events or missing writes.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Rolling deploys can fail in ways that look like general instability. The art is to recognize rollout-induced
          failure quickly and to stop the rollout before the system becomes unrecoverable.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/rolling-deployment-diagram-3.svg"
          alt="Rolling deployment failure modes: capacity drop, slow start, mixed-version incompatibility, and retry amplification"
          caption="Common failures include capacity cliffs, slow readiness, and mixed-version incompatibility. These are avoidable with gates and compatibility discipline."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Capacity cliff</h3>
            <p className="mt-2 text-sm text-muted">
              Too many instances become unavailable at once, and the remaining fleet overloads, causing widespread timeouts.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> conservative max-unavailable, surge buffers, and fast pause controls.
              </li>
              <li>
                <strong>Signal:</strong> rising saturation and p99 latency correlated with rollout steps.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Slow start and false readiness</h3>
            <p className="mt-2 text-sm text-muted">
              Instances pass readiness but are not actually ready under real traffic, causing a wave of errors as traffic shifts.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> meaningful readiness checks and gradual traffic shift within the batch.
              </li>
              <li>
                <strong>Signal:</strong> error spikes immediately after a new batch starts serving.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Mixed-version incompatibility</h3>
            <p className="mt-2 text-sm text-muted">
              New and old versions cannot safely coexist due to schema or contract changes, causing correctness bugs or request failures.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> expand/contract schema migrations, contract tests, and feature flags for risky behavior.
              </li>
              <li>
                <strong>Signal:</strong> failures cluster only on certain instances or routes during rollout.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Retry amplification</h3>
            <p className="mt-2 text-sm text-muted">
              Rolling deploy transient failures trigger client retries, multiplying load and making a small regression look catastrophic.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> sane timeouts, bounded retries, and capacity buffers during rollouts.
              </li>
              <li>
                <strong>Signal:</strong> request volume increases during rollout even when user traffic is stable.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Deploying a Schema Change Without Downtime</h2>
        <p>
          A service needs to add a new column and change business logic to use it. In a rolling deploy, you cannot assume
          all instances see the new schema immediately. A safe approach is to deploy in two phases: first deploy a schema
          expansion that old code tolerates, then deploy code that can use both old and new fields, then later remove the
          old field once the fleet is stable.
        </p>
        <p>
          The rolling deploy becomes a coordination mechanism: each phase rolls out with gates, and the mixed-version
          window is managed intentionally rather than accidentally.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Define pause and rollback:</strong> know how to stop a rollout quickly and what &quot;rollback&quot; means for your system.
          </li>
          <li>
            <strong>Gate on production signals:</strong> use error rate, p99 latency, and saturation, plus domain-level correctness metrics.
          </li>
          <li>
            <strong>Use conservative defaults:</strong> start with small batches and ample surge until you have confidence in warmup and readiness.
          </li>
          <li>
            <strong>Make compatibility a rule:</strong> treat mixed-version safety as a requirement for schema and API evolution.
          </li>
          <li>
            <strong>Test failure paths:</strong> simulate slow start, partial outages, and dependency degradation during staged rollouts.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Is the system safe during a mixed-version window (APIs, schemas, background jobs)?
          </li>
          <li>
            Are readiness checks meaningful and do they reflect real serving capacity?
          </li>
          <li>
            Is there enough capacity buffer (surge) to avoid overload during turnover?
          </li>
          <li>
            Are rollouts gated on production signals with clear stop conditions?
          </li>
          <li>
            Can you pause the rollout and roll back quickly without manual reconfiguration?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">When are rolling deploys a bad fit?</p>
            <p className="mt-2 text-sm">
              When mixed-version operation is unsafe or when rollback must be instantaneous, and the system cannot tolerate gradual replacement.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What metrics should stop a rollout?</p>
            <p className="mt-2 text-sm">
              Error rate and tail latency are baseline. For many systems, domain correctness signals and saturation indicators are equally important.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">How do you avoid capacity drops during rollout?</p>
            <p className="mt-2 text-sm">
              Use surge buffers, conservative batch sizes, and traffic draining so the system remains above the safe capacity threshold throughout.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}


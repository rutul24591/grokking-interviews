"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-auto-scaling-extensive",
  title: "Auto-Scaling",
  description:
    "Adjust capacity automatically in response to demand signals, keeping latency and availability targets while avoiding oscillation and runaway cost.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "auto-scaling",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "infra", "scaling"],
  relatedTopics: ["container-orchestration", "load-balancer-configuration", "capacity-planning"],
};

export default function AutoScalingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What Auto-Scaling Is</h2>
        <p>
          <strong>Auto-scaling</strong> changes capacity automatically based on observed demand. The most common form is
          horizontal scaling: increase or decrease the number of instances or containers serving traffic. The goal is to
          maintain performance and availability targets under variable load while avoiding excessive over-provisioning.
        </p>
        <p>
          Auto-scaling is often described as a cost optimization. In practice, it is a <strong>stability mechanism</strong>.
          Done well, it prevents overload and preserves tail latency. Done poorly, it oscillates, amplifies incidents, or
          scales into a dependency bottleneck that does not actually improve user experience.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/auto-scaling-diagram-1.svg"
          alt="Auto-scaling loop: metrics feed a scaling controller that adjusts capacity behind a load balancer"
          caption="Auto-scaling is a feedback loop: pick the right signal, account for delay, and make scale changes safe and observable."
        />
      </section>

      <section>
        <h2>Pick the Right Signal: Scaling Is Only as Smart as Its Metric</h2>
        <p>
          The scaling signal determines whether scaling actions match user demand. Many systems start with CPU usage
          because it is easy to measure, but CPU is not always correlated with user impact. For example, queue depth can
          capture backlog directly, and tail latency can capture user experience. The best signal depends on the workload.
        </p>
        <p>
          A useful way to reason about signals is to ask: what is the resource that saturates first? If the bottleneck
          is CPU, CPU can work. If the bottleneck is an outbound connection pool, a dependency rate limit, or a queue,
          CPU-based scaling can be misleading.
        </p>
      </section>

      <section>
        <h2>Reactive, Predictive, and Scheduled Scaling</h2>
        <p>
          There are multiple ways to scale. Reactive scaling responds to current metrics. Predictive scaling anticipates
          demand based on trends. Scheduled scaling uses known patterns such as daily peaks. Mature systems often combine
          them: scheduled scaling provides a baseline, predictive scaling smooths known patterns, and reactive scaling
          handles unexpected spikes.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/auto-scaling-diagram-2.svg"
          alt="Decision map for scaling signals and policies: CPU, concurrency, queue depth, latency, scheduled and predictive scaling"
          caption="Auto-scaling policy design is metric design: choose signals that reflect the real bottleneck and define safe bounds for change."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Resource signals:</strong> CPU, memory, and saturation indicators.
          </li>
          <li>
            <strong>Work signals:</strong> request concurrency, queue depth, or jobs waiting.
          </li>
          <li>
            <strong>Outcome signals:</strong> tail latency, error rate, or SLO burn rate, usually combined with safety thresholds.
          </li>
        </ul>
        <p className="mt-4">
          Outcome signals are powerful but noisy. Latency changes may be caused by downstream issues rather than lack of
          capacity. Scaling based on latency alone can cause runaway growth without improving user experience.
        </p>
      </section>

      <section>
        <h2>Scale-Up vs Scale-Down: The Asymmetry Most Teams Miss</h2>
        <p>
          Scaling up and scaling down should not be symmetric. Scaling up needs to be responsive enough to protect the
          system from overload. Scaling down should be conservative to avoid removing capacity during transient dips or
          before caches and warm state stabilize.
        </p>
        <p>
          Scale-down also has correctness concerns. If instances hold in-flight work, maintain connections, or own
          partitions, terminating them too aggressively can trigger retries and rebalancing storms. Safe scale-down
          requires graceful termination and coordination with load balancers and schedulers.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Auto-scaling can create incidents when the feedback loop is unstable or when scaling does not address the real
          bottleneck. Understanding failure modes helps you design guardrails up front.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/auto-scaling-diagram-3.svg"
          alt="Auto-scaling failure modes: oscillation, delayed scaling, scaling into bottlenecks, and runaway cost"
          caption="Scaling failures are usually control failures: unstable feedback loops, wrong signals, or lack of safe bounds and cooldown behavior."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Oscillation (thrash)</h3>
            <p className="mt-2 text-sm text-muted">
              Capacity repeatedly scales up and down due to noisy signals, causing instability and elevated cost without better performance.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> stabilization windows, cooldowns, and step limits on scaling rate.
              </li>
              <li>
                <strong>Signal:</strong> frequent scaling events and saw-tooth capacity graphs during stable demand.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Delayed scale-up</h3>
            <p className="mt-2 text-sm text-muted">
              Instances take too long to become ready, so scaling lags behind demand and users see timeouts.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> reduce warmup time, pre-scale for known peaks, and ensure readiness checks represent true readiness.
              </li>
              <li>
                <strong>Signal:</strong> traffic spikes followed by long periods of elevated latency before capacity catches up.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Scaling into the wrong bottleneck</h3>
            <p className="mt-2 text-sm text-muted">
              Adding instances increases load on a shared dependency (database, cache, third-party API), worsening the incident.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> identify the true bottleneck and protect dependencies with bulkheads and rate limits.
              </li>
              <li>
                <strong>Signal:</strong> more capacity does not improve latency or error rate, but increases downstream saturation.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Runaway cost</h3>
            <p className="mt-2 text-sm text-muted">
              A bug, retry storm, or metric anomaly causes capacity to grow far beyond what is useful.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> hard max bounds, alerts on unusual scaling rates, and rate-limited scaling changes.
              </li>
              <li>
                <strong>Signal:</strong> capacity increases while user experience does not improve and costs spike.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: A Sudden Traffic Spike on a Read-Heavy Endpoint</h2>
        <p>
          A marketing event drives a sudden spike. Auto-scaling starts adding instances, but each new instance triggers
          cache warmup and database connection churn. If scaling is too aggressive, the database saturates and the
          incident becomes worse.
        </p>
        <p>
          A stable approach uses queue depth or concurrency as the primary signal, adds cooldown and step limits, and
          pairs scaling with dependency protection: connection pools, rate limits, and caching strategies. The result is
          controlled growth that preserves system stability while meeting user demand.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Validate signals:</strong> ensure scaling metrics correlate with user impact and the real bottleneck.
          </li>
          <li>
            <strong>Bound behavior:</strong> set min and max capacity, plus limits on how fast scaling can change.
          </li>
          <li>
            <strong>Account for warmup:</strong> measure time-to-ready and pre-scale for known peaks to avoid lag.
          </li>
          <li>
            <strong>Protect dependencies:</strong> scaling often increases downstream load; use rate limits and bulkheads to prevent collapse.
          </li>
          <li>
            <strong>Test with load:</strong> simulate spikes and verify that scaling improves p95 and p99 without creating oscillation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Are you scaling on a signal that matches the true bottleneck and user impact?
          </li>
          <li>
            Are scale-up and scale-down policies asymmetric, with conservative scale-down?
          </li>
          <li>
            Are there hard bounds and cooldowns to prevent oscillation and runaway cost?
          </li>
          <li>
            Is instance warmup time measured and accounted for with pre-scaling or warm pools?
          </li>
          <li>
            Do you have dependency protections so scaling does not amplify downstream outages?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What metric would you scale on and why?</p>
            <p className="mt-2 text-sm">
              It depends on the bottleneck. CPU can work for compute-bound services; concurrency or queue depth often reflects backlog; latency can be useful but should be combined with saturation controls to avoid runaway scaling.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Why is scale-down dangerous?</p>
            <p className="mt-2 text-sm">
              Removing capacity too quickly can cause overload, cache churn, and dropped in-flight work. Scale-down needs conservative behavior and graceful termination.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Why does scaling sometimes not improve performance?</p>
            <p className="mt-2 text-sm">
              Because the bottleneck is elsewhere: a shared database, a third-party API, or a connection pool. Scaling adds load and can make the real bottleneck worse.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}


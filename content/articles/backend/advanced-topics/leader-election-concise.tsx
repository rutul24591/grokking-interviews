"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-leader-election-extensive",
  title: "Leader Election",
  description:
    "Choose a single coordinator safely: leader election patterns, leases and consensus, failure detection trade-offs, and operational practices to avoid split brain and flapping.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "leader-election",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "advanced", "distributed-systems", "coordination"],
  relatedTopics: ["quorum", "consensus", "service-registry"],
};

export default function LeaderElectionConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What Leader Election Is</h2>
        <p>
          <strong>Leader election</strong> is the process of selecting a single node to act as a coordinator among a
          group of nodes. Leaders are used to avoid conflicting actions: only one node schedules jobs, only one node
          performs a maintenance task, or only one node acts as the writer for a shard.
        </p>
        <p>
          The hard part is not picking a leader once. It is handling failure: detecting when the leader is dead,
          promoting a new leader quickly, and avoiding split brain where multiple nodes believe they are leader at the
          same time.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/leader-election-diagram-1.svg"
          alt="Leader election diagram showing nodes competing for leadership and a single leader coordinating"
          caption="Leader election is a coordination tool: one node holds leadership while others follow. Failure handling and avoiding split brain are the core design challenges."
        />
      </section>

      <section>
        <h2>Common Approaches: Leases, Consensus, and Ring Algorithms</h2>
        <p>
          There are multiple ways to elect a leader, and the right choice depends on your consistency needs and failure
          model.
        </p>
        <div className="my-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Lease-based</h3>
            <p className="mt-2 text-sm text-muted">
              A node acquires a time-bounded lease in a shared store. If it stops renewing, another node can take over.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Consensus-based</h3>
            <p className="mt-2 text-sm text-muted">
              A consensus group elects a leader and provides a consistent view of who the leader is (for example, Raft-like systems).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Topology algorithms</h3>
            <p className="mt-2 text-sm text-muted">
              Ring and bully-style algorithms can work in controlled environments, but are less common in modern cloud systems.
            </p>
          </div>
        </div>
        <p>
          Lease-based leadership is often good enough for background tasks and schedulers when you can tolerate brief
          gaps. Consensus-based leadership is preferred when you need stronger guarantees about single-writer behavior
          and consistent state transitions.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/leader-election-diagram-2.svg"
          alt="Leader election control points: leases, heartbeats, timeouts, and promotion"
          caption="Leader election is a time and failure-detection problem. Heartbeats, timeouts, and lease expiry determine failover speed and false leader changes."
        />
      </section>

      <section>
        <h2>Failure Detection: Fast Failover vs False Positives</h2>
        <p>
          Leader failover is driven by failure detection: how quickly you decide the leader is unhealthy. Aggressive
          timeouts produce fast failover but can cause false positives during transient pauses, GC events, or network
          jitter. Conservative timeouts reduce flapping but increase recovery time when the leader is truly down.
        </p>
        <p>
          This trade-off is operationally visible. If the system frequently changes leaders during normal load, you are
          likely over-sensitive. If leader failover takes too long during real outages, you may be too conservative or
          have an overloaded coordination plane.
        </p>
      </section>

      <section>
        <h2>Split Brain: The Failure You Must Prevent</h2>
        <p>
          Split brain occurs when multiple nodes believe they are leader and perform actions that should be unique. This
          can corrupt state: duplicate scheduled jobs, multiple writers, or inconsistent metadata updates. Systems avoid
          split brain by making leadership contingent on a single authoritative source: a lease, a quorum decision, or a
          fencing mechanism.
        </p>
        <p>
          Fencing is the practical mitigation. When a leader is replaced, the old leader must be prevented from
          continuing to act as leader even if it later resumes. Fencing is often implemented as monotonically increasing
          tokens that downstream systems reject if stale.
        </p>
      </section>

      <section>
        <h2>Operational Considerations</h2>
        <p>
          Leader election is a cross-cutting dependency. If the coordination store is degraded, leadership becomes
          unstable. Many incidents show up as repeated leader changes that cascade into higher load and retry storms.
        </p>
        <p>
          Observability should include leader change frequency, lease renewal errors, and time-to-failover. When a
          leader changes, downstream systems should surface whether the change was expected (planned maintenance) or
          unexpected (instability).
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Leader election failures tend to be coordination failures: instability, split brain, or slow recovery. The
          mitigations are about fencing, timeouts, and careful dependency management.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/leader-election-diagram-3.svg"
          alt="Leader election failure modes: split brain, leader flapping, and slow failover"
          caption="Leader election incidents come from instability: split brain, flapping leaders, and slow failover. Fencing and tuned timeouts keep coordination safe."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Leader flapping</h3>
            <p className="mt-2 text-sm text-muted">
              Leaders change frequently due to aggressive timeouts or coordination store instability, causing work churn and outages.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> tune timeouts, add jitter to renewals, and ensure coordination plane has capacity and low latency.
              </li>
              <li>
                <strong>Signal:</strong> increased leader changes without corresponding node failures and elevated coordination errors.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Split brain actions</h3>
            <p className="mt-2 text-sm text-muted">
              Two leaders execute unique actions concurrently, causing data corruption or duplicated work.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> fencing tokens and downstream validation that rejects stale leaders.
              </li>
              <li>
                <strong>Signal:</strong> duplicated scheduled tasks, conflicting writes, or inconsistent metadata updates.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Slow recovery</h3>
            <p className="mt-2 text-sm text-muted">
              Failover takes too long, leaving systems without a coordinator and causing backlog growth.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> adjust timeouts based on SLOs, ensure coordination store is reliable, and pre-warm candidates for leadership.
              </li>
              <li>
                <strong>Signal:</strong> long gaps with no leader and rising queue lag or maintenance job delays.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Coordination store outage</h3>
            <p className="mt-2 text-sm text-muted">
              The system cannot acquire or renew leadership, causing either global stop or unsafe failover behavior.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> redundant coordination plane, circuit breakers, and explicit degraded modes for non-critical leader tasks.
              </li>
              <li>
                <strong>Signal:</strong> spikes in lease renew failures and leader churn across multiple clusters at once.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Single Scheduler in a Multi-Node Cluster</h2>
        <p>
          A cluster runs periodic maintenance jobs, but only one node should schedule them. Lease-based leader election
          works well here: the leader renews a lease periodically and enqueues jobs. If the leader fails, another node
          takes over after lease expiry. Fencing prevents the old leader from continuing after recovery.
        </p>
        <p>
          The system must also handle flapping: if the leader changes too often, jobs can run twice or not at all. That
          is an operational sign that timeouts or coordination capacity need adjustment.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Leadership is tied to a single authoritative mechanism (lease or quorum), with clear rules for promotion and expiry.
          </li>
          <li>
            Fencing prevents stale leaders from performing unique actions after losing leadership.
          </li>
          <li>
            Timeouts are tuned to balance fast failover with avoiding false leader changes under jitter.
          </li>
          <li>
            Observability tracks leader change frequency, lease renewal errors, and time-to-failover.
          </li>
          <li>
            Coordination dependencies are engineered for reliability because many subsystems rely on stable leadership.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do you need fencing tokens?</p>
            <p className="mt-2 text-sm text-muted">
              A: Because leaders can recover after losing leadership and still act. Fencing tokens allow downstream systems to reject actions from stale leaders and prevent split brain effects.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What drives the failover time?</p>
            <p className="mt-2 text-sm text-muted">
              A: Failure detection and lease expiry: heartbeat intervals, timeouts, and coordination store latency determine how quickly a new leader can be safely promoted.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When do you prefer consensus-based leadership?</p>
            <p className="mt-2 text-sm text-muted">
              A: When a single-writer guarantee is critical for correctness and you need a consistent view of leadership across the cluster, not only best-effort coordination.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}


"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-advanced-chaos-testing-extensive",
  title: "Chaos Testing",
  description: "Comprehensive guide to chaos engineering, failure injection, resilience validation, and production readiness testing for staff/principal engineer interviews.",
  category: "advanced-topics",
  subcategory: "nfr",
  slug: "chaos-testing",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "chaos-engineering", "testing", "resilience", "failure-injection", "sre"],
  relatedTopics: ["fault-tolerance-resilience", "high-availability", "disaster-recovery"],
};

export default function ChaosTestingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Chaos Testing</strong> (Chaos Engineering) is the discipline of intentionally injecting
          failures into systems to validate resilience, discover weaknesses, and build confidence in the
          system&apos;s ability to withstand real-world disruptions. Rather than waiting for failures to
          happen unexpectedly, chaos testing proactively breaks things in controlled ways to learn and
          improve.
        </p>
        <p>
          Netflix pioneered chaos engineering with Chaos Monkey (2010), randomly terminating production
          instances to ensure resilience. The practice has since evolved into a mature discipline with
          tools, methodologies, and organizational practices adopted by leading technology companies.
        </p>
        <p>
          <strong>Core principles of chaos engineering:</strong>
        </p>
        <ul>
          <li>
            <strong>Define steady state:</strong> What does &quot;healthy&quot; look like? Define measurable
            metrics (latency, error rate, throughput).
          </li>
          <li>
            <strong>Hypothesize:</strong> Predict how system should behave during failure.
          </li>
          <li>
            <strong>Inject failures:</strong> Introduce real-world failures (instance termination, network
            latency, dependency failures).
          </li>
          <li>
            <strong>Observe &amp; learn:</strong> Compare actual behavior to hypothesis. Document surprises.
          </li>
          <li>
            <strong>Automate:</strong> Run chaos tests continuously, not just once.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Chaos Testing Is Not Random Breaking</h3>
          <p>
            Chaos engineering is scientific experimentation, not random destruction. Each test has a
            hypothesis, controlled conditions, measurable outcomes, and blast radius limits. The goal is
            learning, not breaking things for the sake of it.
          </p>
          <p className="mt-3">
            <strong>Start small:</strong> Begin in staging environments, with limited blast radius, during
            business hours when engineers are available. Gradually increase scope as confidence grows.
          </p>
        </div>

        <p>
          This article covers chaos testing methodologies, failure injection patterns, tooling, organizational
          practices, and the path to production chaos testing.
        </p>
      </section>

      <section>
        <h2>Failure Injection Patterns</h2>
        <p>
          Common failure scenarios to test.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compute Failures</h3>
        <p>
          Test instance/pod failures:
        </p>
        <ul>
          <li>
            <strong>Instance Termination:</strong> Kill random instances. Tests auto-scaling, load balancing.
          </li>
          <li>
            <strong>Pod Killing:</strong> Kubernetes pod deletion. Tests pod disruption budgets, replication.
          </li>
          <li>
            <strong>CPU Stress:</strong> Consume CPU resources. Tests throttling, scaling triggers.
          </li>
          <li>
            <strong>Memory Pressure:</strong> Consume memory. Tests OOM handling, eviction.
          </li>
          <li>
            <strong>Disk Full:</strong> Fill disk space. Tests disk monitoring, graceful degradation.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Network Failures</h3>
        <p>
          Test network-related failures:
        </p>
        <ul>
          <li>
            <strong>Latency Injection:</strong> Add delay to network calls. Tests timeouts, user experience.
          </li>
          <li>
            <strong>Packet Loss:</strong> Drop random packets. Tests retry logic, error handling.
          </li>
          <li>
            <strong>Connection Reset:</strong> Reset TCP connections. Tests reconnection logic.
          </li>
          <li>
            <strong>DNS Failure:</strong> Break DNS resolution. Tests DNS caching, fallback.
          </li>
          <li>
            <strong>Blackhole:</strong> Drop all traffic to specific service. Tests circuit breakers.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Dependency Failures</h3>
        <p>
          Test third-party and internal dependency failures:
        </p>
        <ul>
          <li>
            <strong>Database Failure:</strong> Kill database connections. Tests connection pooling, failover.
          </li>
          <li>
            <strong>Cache Failure:</strong> Disable cache layer. Tests cache miss handling, database load.
          </li>
          <li>
            <strong>Queue Failure:</strong> Break message queues. Tests message persistence, retry.
          </li>
          <li>
            <strong>API Failure:</strong> Return errors from dependencies. Tests fallback, graceful degradation.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stateful Failures</h3>
        <p>
          Test data-related failures:
        </p>
        <ul>
          <li>
            <strong>Database Failover:</strong> Force primary to standby switch. Tests replication, failover time.
          </li>
          <li>
            <strong>Replication Lag:</strong> Introduce replication delay. Tests read-your-writes handling.
          </li>
          <li>
            <strong>Corruption:</strong> Corrupt random data (in staging!). Tests validation, recovery.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/chaos-failure-patterns.svg"
          alt="Chaos Testing Failure Patterns"
          caption="Chaos Testing — showing compute, network, dependency, and stateful failure injection patterns with examples"
        />
      </section>

      <section>
        <h2>Chaos Testing Methodology</h2>
        <p>
          Structured approach to chaos experiments.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Experiment Lifecycle</h3>
        <p>
          Each chaos experiment follows a lifecycle:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Define Hypothesis:</strong> &quot;If service X fails, requests will route to service Y
            with {'<'}100ms latency increase.&quot;
          </li>
          <li>
            <strong>Define Metrics:</strong> What will you measure? Error rate, latency, throughput.
          </li>
          <li>
            <strong>Define Blast Radius:</strong> What percentage of traffic/users affected? Start small.
          </li>
          <li>
            <strong>Define Abort Conditions:</strong> When to stop experiment? Error rate {'>'} threshold.
          </li>
          <li>
            <strong>Run Experiment:</strong> Inject failure, monitor metrics.
          </li>
          <li>
            <strong>Analyze Results:</strong> Compare actual vs expected. Document surprises.
          </li>
          <li>
            <strong>Remediate:</strong> Fix discovered issues. Re-test to validate fix.
          </li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Blast Radius Control</h3>
        <p>
          Limit impact of chaos experiments:
        </p>
        <ul>
          <li>
            <strong>Percentage-Based:</strong> Affect X% of traffic. Start with 1%, increase gradually.
          </li>
          <li>
            <strong>User Segments:</strong> Target internal users, beta users first.
          </li>
          <li>
            <strong>Geographic:</strong> Limit to specific regions.
          </li>
          <li>
            <strong>Service Scope:</strong> Target non-critical services first.
          </li>
          <li>
            <strong>Time-Boxed:</strong> Auto-stop after X minutes.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Steady State Definition</h3>
        <p>
          Define what &quot;normal&quot; looks like:
        </p>
        <ul>
          <li>
            <strong>Latency:</strong> P50 {'<'} 100ms, P99 {'<'} 500ms.
          </li>
          <li>
            <strong>Error Rate:</strong> {'<'} 0.1% for critical paths.
          </li>
          <li>
            <strong>Throughput:</strong> {'>'} 1000 RPS per instance.
          </li>
          <li>
            <strong>Business Metrics:</strong> Conversion rate, successful transactions.
          </li>
        </ul>
        <p>
          During chaos experiments, monitor for deviation from steady state. Small deviations are expected;
          large deviations indicate resilience gaps.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/chaos-experiment-lifecycle.svg"
          alt="Chaos Experiment Lifecycle"
          caption="Chaos Experiment Lifecycle — showing hypothesis definition, blast radius control, execution, and analysis phases"
        />
      </section>

      <section>
        <h2>Chaos Testing Tools</h2>
        <p>
          Tools for implementing chaos experiments.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Infrastructure-Level Tools</h3>
        <ul>
          <li>
            <strong>Chaos Monkey:</strong> Netflix&apos;s original tool for terminating instances.
          </li>
          <li>
            <strong>Chaos Mesh:</strong> Kubernetes-native chaos engineering platform.
          </li>
          <li>
            <strong>Litmus:</strong> Kubernetes chaos engineering with SRE-focused scenarios.
          </li>
          <li>
            <strong>AWS Fault Injection Simulator:</strong> Managed chaos testing for AWS workloads.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Network-Level Tools</h3>
        <ul>
          <li>
            <strong>Toxiproxy:</strong> TCP proxy for simulating network conditions.
          </li>
          <li>
            <strong>tc (Traffic Control):</strong> Linux utility for network manipulation.
          </li>
          <li>
            <strong>Pumba:</strong> Network emulation for containers.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Application-Level Tools</h3>
        <ul>
          <li>
            <strong>Simian Army:</strong> Netflix&apos;s suite (Chaos Monkey, Latency Monkey, Conformity Monkey).
          </li>
          <li>
            <strong>Chaos Toolkit:</strong> Open-source chaos engineering toolkit with extensible drivers.
          </li>
          <li>
            <strong>Gremlin:</strong> Commercial chaos engineering platform with managed experiments.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Custom Injection</h3>
        <p>
          Build custom failure injection:
        </p>
        <ul>
          <li>
            <strong>Middleware:</strong> HTTP middleware that injects failures based on headers/percentage.
          </li>
          <li>
            <strong>Service Mesh:</strong> Istio/Linkerd fault injection capabilities.
          </li>
          <li>
            <strong>Feature Flags:</strong> Kill switches for disabling functionality.
          </li>
        </ul>
      </section>

      <section>
        <h2>Organizational Practices</h2>
        <p>
          Building a chaos engineering culture.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Game Days</h3>
        <p>
          Structured chaos testing events:
        </p>
        <ul>
          <li>
            <strong>Preparation:</strong> Define scenarios, assign roles, set up monitoring.
          </li>
          <li>
            <strong>Execution:</strong> Run experiments during scheduled window.
          </li>
          <li>
            <strong>Observation:</strong> Team observes system behavior, documents surprises.
          </li>
          <li>
            <strong>Retrospective:</strong> Review what happened, identify improvements.
          </li>
          <li>
            <strong>Remediation:</strong> Create tickets for discovered issues.
          </li>
        </ul>
        <p>
          <strong>Frequency:</strong> Monthly or quarterly game days. Regular cadence builds muscle memory.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Chaos Champions</h3>
        <p>
          Designate chaos engineering advocates:
        </p>
        <ul>
          <li>
            <strong>Role:</strong> Promote chaos testing, help teams design experiments.
          </li>
          <li>
            <strong>Training:</strong> Advanced training in chaos engineering practices.
          </li>
          <li>
            <strong>Office Hours:</strong> Available to help teams run experiments.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Production Readiness</h3>
        <p>
          Use chaos testing as production readiness gate:
        </p>
        <ul>
          <li>
            <strong>Pre-Launch:</strong> Run chaos tests before major launches.
          </li>
          <li>
            <strong>Onboarding:</strong> New services must pass chaos tests before production.
          </li>
          <li>
            <strong>Continuous:</strong> Automated chaos tests in production (limited blast radius).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/chaos-game-day.svg"
          alt="Chaos Game Day Structure"
          caption="Chaos Game Day — showing preparation, execution, observation, retrospective, and remediation phases"
        />
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is chaos engineering and why is it important?</p>
            <p className="mt-2 text-sm">
              A: Chaos engineering is intentionally injecting failures to validate resilience and discover
              weaknesses before they cause outages. Important because: (1) Failures will happen — better to
              discover gaps proactively, (2) Builds confidence in system resilience, (3) Tests monitoring
              and alerting, (4) Validates runbooks and incident response.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you start with chaos testing?</p>
            <p className="mt-2 text-sm">
              A: Start small: (1) Define steady state metrics, (2) Start in staging environment, (3) Begin
              with low-impact experiments (single instance termination), (4) Run during business hours with
              team available, (5) Document findings and fix issues, (6) Gradually increase scope to production
              with limited blast radius.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What failures would you test for an e-commerce checkout flow?</p>
            <p className="mt-2 text-sm">
              A: Payment service failure (fallback to retry/queue), inventory service failure (cached inventory?),
              database failover (transaction handling), network latency (timeout handling), cart service
              failure (can user still checkout?), CDN failure (static assets). Prioritize by likelihood and
              business impact.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you control blast radius in chaos experiments?</p>
            <p className="mt-2 text-sm">
              A: Percentage-based rollout (1% → 5% → 25%), target internal/beta users first, limit to
              specific regions, target non-critical services, time-box experiments with auto-stop, define
              abort conditions (error rate threshold), have rollback plan ready.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between chaos testing and load testing?</p>
            <p className="mt-2 text-sm">
              A: Load testing validates performance under high traffic (how much load can system handle?).
              Chaos testing validates resilience under failure conditions (how does system behave when
              components fail?). Both are important — load testing for capacity planning, chaos testing
              for reliability.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you build a chaos engineering culture?</p>
            <p className="mt-2 text-sm">
              A: Leadership support (allocate time for experiments), psychological safety (failures are
              learning opportunities, not blame), regular game days, chaos champions in each team, celebrate
              discoveries (found issue before outage!), integrate into production readiness process, document
              and share learnings organization-wide.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://principlesofchaos.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Principles of Chaos Engineering
            </a>
          </li>
          <li>
            <a href="https://github.com/Netflix/chaosmonkey" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Netflix Chaos Monkey
            </a>
          </li>
          <li>
            <a href="https://chaostoolkit.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chaos Toolkit
            </a>
          </li>
          <li>
            <a href="https://www.gremlin.com/chaos-engineering/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Gremlin — Chaos Engineering
            </a>
          </li>
          <li>
            <a href="https://landing.google.com/sre/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google SRE Book
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

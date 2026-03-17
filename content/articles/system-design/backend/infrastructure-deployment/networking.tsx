"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-networking-extensive",
  title: "Networking",
  description:
    "Design network boundaries, routing, and security controls so services connect predictably, perform well, and fail safely under change.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "networking",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "infra", "network"],
  relatedTopics: ["dns-management", "load-balancer-configuration", "cloud-services"],
};

export default function NetworkingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What &quot;Networking&quot; Means in Infrastructure</h2>
        <p>
          In infrastructure design, <strong>networking</strong> is the set of decisions that determine how systems
          connect, how traffic is routed, and how access is controlled. Networking is not just connectivity. It is also
          isolation, performance, and blast-radius management. A network design defines what can talk to what, through
          which paths, with what constraints.
        </p>
        <p>
          Strong network design reduces incident severity. When segmentation is intentional, a compromised service cannot
          reach everything. When routing is explicit, outages are easier to diagnose. When egress is controlled, security
          and cost are both easier to manage.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/networking-diagram-1.svg"
          alt="Infrastructure networking overview with subnets, routing, security boundaries, and traffic flows"
          caption="Networking design is boundary design: segmentation, routing, and policy together determine how failures and threats propagate."
        />
      </section>

      <section>
        <h2>Core Building Blocks</h2>
        <p>
          Regardless of provider, the primitives are similar. You allocate address space, carve it into subnets, define
          routing rules, and enforce security policy at multiple layers. The exact names vary, but the conceptual model is stable.
        </p>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Segmentation</h3>
            <p className="mt-2 text-sm text-muted">
              Split workloads into network zones (public, private, restricted) to reduce blast radius and enforce intent.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Routing</h3>
            <p className="mt-2 text-sm text-muted">
              Define how packets move between subnets, to the internet, and to other networks. Bad routes cause black holes.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Ingress and egress</h3>
            <p className="mt-2 text-sm text-muted">
              Control inbound and outbound flows. Egress control is a security and cost boundary, not an afterthought.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Policy enforcement</h3>
            <p className="mt-2 text-sm text-muted">
              Use layered controls to ensure least privilege. Policies should be reviewable and measurable.
            </p>
          </div>
        </div>
        <p>
          The most robust designs use multiple layers of enforcement: coarse network boundaries plus service-level
          identity and authorization. Network rules are excellent for limiting reachability, but they do not replace
          strong identity-based access control for sensitive paths.
        </p>
      </section>

      <section>
        <h2>Egress, NAT, and Private Connectivity</h2>
        <p>
          Many systems want private workloads to access external services without exposing inbound access. This drives
          designs that use private subnets with controlled egress paths. The goal is to make outbound traffic observable,
          rate-limited, and attributable.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/networking-diagram-2.svg"
          alt="Networking control points: NAT, peering/transit, private endpoints, and segmentation"
          caption="Egress design is a reliability and security lever. NAT and private endpoints control how private workloads reach dependencies."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>NAT capacity:</strong> NAT devices can saturate. Treat them as production dependencies with metrics and scaling plans.
          </li>
          <li>
            <strong>Private endpoints:</strong> prefer private connectivity to managed services when reducing exposure matters.
          </li>
          <li>
            <strong>Network linking:</strong> peering and transit constructs connect networks, but overlapping address space and route propagation can create surprises.
          </li>
          <li>
            <strong>Outbound policy:</strong> decide whether outbound is open, allow-listed, or identity-controlled, and ensure logs exist for investigation.
          </li>
        </ul>
        <p className="mt-4">
          Egress is also a common incident root cause. If outbound is blocked accidentally, it can look like random
          dependency timeouts across the fleet. Clear change control and observability make these failures easier to diagnose.
        </p>
      </section>

      <section>
        <h2>Performance and Reliability Considerations</h2>
        <p>
          Networking affects tail latency and availability in non-obvious ways. A healthy request path depends on DNS,
          routing, load balancing, and connection behavior. When networking is unstable, failures often show up as timeouts
          and retries rather than clean errors.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Latency distribution:</strong> cross-zone and cross-region hops add measurable tail latency, especially under congestion.
          </li>
          <li>
            <strong>Connection reuse:</strong> keepalive behavior and connection pooling affect load balancers and NAT state.
          </li>
          <li>
            <strong>MTU and fragmentation:</strong> mismatched MTU can cause subtle packet loss patterns that look like flaky dependencies.
          </li>
          <li>
            <strong>Failure domains:</strong> isolate by zones and regions so an outage does not eliminate all paths.
          </li>
        </ul>
        <p className="mt-4">
          Many performance problems are actually network problems. You want telemetry that can distinguish between
          application latency and network-induced latency: handshake time, connection resets, retransmits, and DNS resolution delay.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Network issues are high-impact because they affect many services at once. The best systems prevent common
          failure modes through disciplined change control and layered defenses.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/networking-diagram-3.svg"
          alt="Networking failure modes: route black holes, overly permissive security rules, NAT saturation, and address space issues"
          caption="Network incidents often look like application failures. Make routing and policy changes deliberate and observable."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Route black holes</h3>
            <p className="mt-2 text-sm text-muted">
              A route update sends traffic to nowhere, causing widespread timeouts with little diagnostic signal in apps.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> staged changes, route validation tests, and fast rollback procedures.
              </li>
              <li>
                <strong>Signal:</strong> sudden spikes in timeouts across many services with no correlated deploys.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Over-permissive rules</h3>
            <p className="mt-2 text-sm text-muted">
              Security rules allow broad access, increasing risk and making compromise blast radius large.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> least privilege by default, periodic audits, and policy enforcement in IaC.
              </li>
              <li>
                <strong>Signal:</strong> many services share wide-open inbound rules and ownership is unclear.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Address space exhaustion</h3>
            <p className="mt-2 text-sm text-muted">
              Subnets run out of addresses, preventing scaling and causing new deployments to fail.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> capacity planning for IPs, avoiding overly small subnets, and monitoring free addresses.
              </li>
              <li>
                <strong>Signal:</strong> scheduling or provisioning failures that correlate with subnet capacity rather than compute capacity.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">NAT and egress saturation</h3>
            <p className="mt-2 text-sm text-muted">
              Private workloads share limited egress capacity, causing connection failures and increased tail latency.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> monitor throughput and connection counts, scale egress components, and reduce unnecessary outbound chatter.
              </li>
              <li>
                <strong>Signal:</strong> outbound connection errors spike while internal CPU and memory look normal.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Designing a Network for a Service-Oriented Platform</h2>
        <p>
          A company builds a platform with multiple service teams. They need clear separation between public entry points,
          internal services, and sensitive data stores. A disciplined design uses public ingress only where necessary,
          private subnets for internal services, and strict rules for data-store access. Egress is controlled to reduce
          exposure and improve incident diagnosability.
        </p>
        <p>
          The platform remains operable because networking changes are managed through IaC with review, and there is
          observability at multiple layers: flow logs, load balancer logs, and service-level metrics that reveal network timeouts.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Version network changes:</strong> treat routing and policy updates as high-risk changes with review and staged rollout.
          </li>
          <li>
            <strong>Instrument the network:</strong> collect flow logs, LB metrics, and DNS metrics so network failures are visible.
          </li>
          <li>
            <strong>Audit least privilege:</strong> regularly review rules and remove broad access patterns that accumulate over time.
          </li>
          <li>
            <strong>Plan address capacity:</strong> monitor subnet utilization and avoid IP exhaustion surprises during scale events.
          </li>
          <li>
            <strong>Practice failure drills:</strong> simulate blocked egress or failed routes in staging to ensure runbooks work.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Are public and private zones clearly separated with minimal inbound exposure?
          </li>
          <li>
            Are routing changes reviewable, reversible, and validated before broad rollout?
          </li>
          <li>
            Do you have observability for DNS, routing, and egress capacity?
          </li>
          <li>
            Are security rules least-privilege and audited regularly?
          </li>
          <li>
            Is IP address capacity monitored so scaling does not fail silently?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What networking mistakes cause the biggest outages?</p>
            <p className="mt-2 text-sm">
              Route black holes, mis-scoped security rules, and shared egress saturation are common causes because they impact many services simultaneously.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">How do you reduce blast radius with networking?</p>
            <p className="mt-2 text-sm">
              Segment workloads, restrict reachability with least-privilege rules, isolate failure domains, and ensure critical paths do not share fragile dependencies like a single egress choke point.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">How do you debug network vs application issues?</p>
            <p className="mt-2 text-sm">
              Correlate service metrics with network telemetry (DNS latency, connection errors, flow logs) and look for cross-service patterns that suggest a shared network cause.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}


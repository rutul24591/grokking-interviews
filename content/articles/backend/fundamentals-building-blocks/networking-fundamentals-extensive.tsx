"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-networking-fundamentals-extensive",
  title: "Networking Fundamentals",
  description: "Comprehensive guide to routing, switching, NAT, firewalls, and VPNs for backend systems.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "networking-fundamentals",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "networking", "routing", "security"],
  relatedTopics: ["ip-addressing", "tcp-vs-udp", "request-response-lifecycle"],
};

export default function NetworkingFundamentalsExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          Networking fundamentals explain how packets traverse networks,
          how devices connect, and how security boundaries are enforced.
        </p>
      </section>

      <section>
        <h2>Core Building Blocks</h2>
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/network-routing-switching.svg"
          alt="Routing vs switching"
          caption="Switches forward within LANs; routers forward across networks"
        />
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/nat-firewall-overview.svg"
          alt="NAT and firewalls"
          caption="NAT translates addresses, firewalls enforce rules"
        />
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/vpn-tunnel.svg"
          alt="VPN tunnel"
          caption="VPNs create encrypted tunnels over public networks"
        />
      </section>

      <section>
        <h2>Practical Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Example: Node service behind a firewall
// Allow inbound 443, deny others
// Security group / firewall rule set applies at network boundary.`}</code>
        </pre>
      </section>

      <section>
        <h2>Operational Considerations</h2>
        <ul className="space-y-2">
          <li>Use private subnets for databases and internal services.</li>
          <li>Keep NAT gateways for outbound internet access only.</li>
          <li>Segment networks by environment and trust boundary.</li>
        </ul>
      </section>
    
      <section>
        <h2>Routing and Security Boundaries</h2>
        <p>
          Networks are segmented by trust boundary. Public entry points route to
          private subnets. Firewalls and security groups enforce least privilege.
        </p>
      </section>

      <section>
        <h2>Operational Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Example rule set
Allow: 443 from 0.0.0.0/0 to load balancer
Deny:  all inbound to database subnet`}</code>
        </pre>
      </section>

      <section>
        <h2>Deep Dive: Private Networking in Cloud</h2>
        <p>
          In cloud environments, private subnets prevent direct internet access. Public entry is
          routed through load balancers or gateways, while private subnets host app servers and
          databases. This architecture reduces exposure and simplifies compliance.
        </p>
      </section>

      <section>
        <h2>Deep Dive: Network Observability</h2>
        <p>
          Capture flow logs, trace packets during incidents, and monitor latency between tiers.
          Network-level telemetry is essential for diagnosing routing loops, packet loss, and
          DDoS events.
        </p>
      </section>

      <section>
        <h2>Deep Dive: Firewalls and Security Groups</h2>
        <p>
          Firewalls enforce allow/deny rules at network boundaries. In cloud
          environments, security groups provide stateful rules while network
          ACLs provide stateless filtering. Use least privilege by default.
        </p>
      </section>

      <section>
        <h2>Deep Dive: VPN vs Private Links</h2>
        <p>
          VPNs are encrypted tunnels over public networks. Private links connect
          networks via dedicated paths. Private links offer lower latency and
          better isolation but cost more and are less flexible.
        </p>
      </section>

      <section>
        <h2>Load Balancers and Reverse Proxies</h2>
        <p>
          Load balancers distribute traffic across instances and perform health
          checks. Reverse proxies often terminate TLS, enforce auth, and apply
          rate limits. At scale, these are core reliability components.
        </p>
        <ul className="space-y-2">
          <li>L4 balancers route by IP:port.</li>
          <li>L7 balancers route by host/path and can rewrite headers.</li>
        </ul>
      </section>

      <section>
        <h2>Peering, Transit, and Routing Policies</h2>
        <p>
          Enterprise networks often use VPC peering or transit gateways to
          connect environments. Routing policies determine which subnets can
          talk to each other and which must traverse inspection points.
        </p>
      </section>

      <section>
        <h2>DDoS and Traffic Spikes</h2>
        <p>
          High-traffic events can saturate links before app servers are
          overwhelmed. Mitigation typically involves upstream filtering, rate
          limiting, and CDNs that absorb volumetric traffic.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Separate public ingress from private service tiers.</li>
          <li>Apply default-deny firewall rules and explicit allowlists.</li>
          <li>Monitor flow logs and packet loss between tiers.</li>
          <li>Validate DNS, routing, and TLS during incidents.</li>
        </ul>
      </section>

      <section>
        <h2>Routing vs Switching: Practical Consequences</h2>
        <p>
          Switching happens within a single broadcast domain (L2). It is fast
          and simple but limited to a local network. Routing happens between
          networks (L3), which enables large-scale connectivity but introduces
          complexity such as route tables, subnets, and policy enforcement.
        </p>
        <p>
          In backend systems, routing decisions define how traffic flows between
          public ingress, application tiers, and databases. Misconfigured routes
          often appear as timeouts rather than explicit errors.
        </p>
      </section>

      <section>
        <h2>NAT in Production</h2>
        <p>
          NAT allows private networks to reach the public internet while hiding
          internal IPs. This is essential for IPv4 scale but introduces stateful
          translation tables and port exhaustion risks at high throughput.
        </p>
        <p>
          For backend services, NAT bottlenecks often show up as intermittent
          connection failures. Monitoring NAT gateway metrics and scaling egress
          capacity is critical in high-traffic systems.
        </p>
      </section>

      <section>
        <h2>Firewall Models: Stateful vs Stateless</h2>
        <p>
          Stateful firewalls track connections and automatically allow return
          traffic, which simplifies rule sets. Stateless firewalls require both
          inbound and outbound rules and are more error-prone but can be faster.
        </p>
        <p>
          In cloud environments, security groups are typically stateful and
          network ACLs are stateless. Understanding the difference prevents
          misconfigurations that block traffic unexpectedly.
        </p>
      </section>

      <section>
        <h2>Load Balancing Strategies</h2>
        <p>
          Load balancers operate at L4 or L7. L4 balancers are faster and handle
          raw TCP/UDP traffic. L7 balancers can route based on host/path and
          support TLS termination, but add more processing overhead.
        </p>
        <p>
          Health checks are essential. Without them, traffic can be sent to
          unhealthy instances, causing outages that look like application bugs.
        </p>
      </section>

      <section>
        <h2>DNS and Service Discovery</h2>
        <p>
          DNS is the simplest service discovery mechanism. Many internal systems
          rely on DNS to locate services, with short TTLs and automated updates.
          This is easy to adopt but can be slow to converge.
        </p>
        <p>
          For faster discovery, systems use service registries (e.g., Consul).
          These provide near-real-time updates but add operational complexity.
        </p>
      </section>

      <section>
        <h2>VPNs, Private Links, and Zero Trust</h2>
        <p>
          VPNs create encrypted tunnels across public networks. Private links
          provide dedicated connectivity between environments. Both are used
          to enforce trust boundaries and reduce exposure.
        </p>
        <p>
          Modern systems increasingly adopt zero-trust: every request must be
          authenticated and authorized, even within private networks. This shifts
          focus from perimeter defenses to identity-based controls.
        </p>
      </section>

      <section>
        <h2>Latency, Jitter, and Packet Loss</h2>
        <p>
          Latency determines responsiveness. Jitter affects real-time media and
          streaming quality. Packet loss triggers retransmissions and can degrade
          throughput dramatically. These are the three most important networking
          metrics for backend performance.
        </p>
        <p>
          Monitor p95 and p99 latency between tiers. A single slow hop can
          dominate end-to-end performance, even if application code is efficient.
        </p>
      </section>

      <section>
        <h2>DDoS Mitigation and Edge Protection</h2>
        <p>
          DDoS attacks saturate network bandwidth before servers are overwhelmed.
          Mitigation often requires upstream filtering, rate limiting, and CDNs
          that absorb traffic. These protections are part of networking, not just
          application security.
        </p>
        <p>
          For public APIs, edge rate limiting and WAF rules reduce attack impact.
          Internal APIs still need protection against accidental overload.
        </p>
      </section>

      <section>
        <h2>Operational Checklist (Expanded)</h2>
        <ul className="space-y-2">
          <li>Document subnet boundaries and routing rules.</li>
          <li>Ensure NAT gateways have enough egress capacity.</li>
          <li>Use health checks for every load-balanced service.</li>
          <li>Monitor jitter, loss, and tail latency.</li>
          <li>Apply zero-trust policies for internal traffic.</li>
        </ul>
      </section>
</ArticleLayout>
  );
}

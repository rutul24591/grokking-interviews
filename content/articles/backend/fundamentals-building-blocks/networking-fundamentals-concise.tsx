"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-networking-fundamentals-concise",
  title: "Networking Fundamentals",
  description: "Quick overview of routing, switching, NAT, firewalls, and VPNs for backend interviews.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "networking-fundamentals",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "networking", "routing", "firewalls"],
  relatedTopics: ["ip-addressing", "tcp-vs-udp", "request-response-lifecycle"],
};

export default function NetworkingFundamentalsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          Networking fundamentals cover how traffic moves between devices and
          across the internet. Core concepts include routing, switching, NAT,
          firewalls, and VPNs.
        </p>
        <p>
          For backend engineers, networking shows up in every request path:
          DNS resolution, TCP connections, TLS termination, and routing across
          subnets. Understanding these basics helps debug latency, timeouts,
          and connectivity failures.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Switching:</strong> L2 forwarding within a LAN.</li>
          <li><strong>Routing:</strong> L3 forwarding between networks.</li>
          <li><strong>NAT:</strong> Translates private to public addresses.</li>
          <li><strong>Firewalls:</strong> Allow/deny traffic by rules.</li>
          <li><strong>VPN:</strong> Encrypted tunnel over public networks.</li>
          <li><strong>Load Balancer:</strong> Distributes traffic and checks health.</li>
          <li><strong>Reverse Proxy:</strong> Fronts services, handles TLS termination.</li>
        </ul>
        <p className="mt-4">
          A practical model: switches move frames inside a subnet, routers move
          packets between subnets, NAT bridges private and public space, and
          firewalls enforce policy at each boundary.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Example: allow only HTTPS to a service
Allow: 443 from 0.0.0.0/0 to load balancer
Deny:  all inbound to database subnet`}</code>
        </pre>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain how NAT enables private subnets.</li>
          <li>Describe firewall rules and default-deny.</li>
          <li>Know the difference between routing and switching.</li>
          <li>Clarify L4 vs L7 load balancing and where TLS terminates.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do we need NAT?</p>
            <p className="mt-2 text-sm">A: It conserves public IPs and isolates private networks.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What does a firewall do?</p>
            <p className="mt-2 text-sm">A: Enforces traffic rules to allow or block connections.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Router vs switch?</p>
            <p className="mt-2 text-sm">A: Switches operate at L2, routers at L3.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Load balancer vs reverse proxy?</p>
            <p className="mt-2 text-sm">
              A: Load balancers distribute traffic; reverse proxies also handle TLS,
              routing, and caching in front of services.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

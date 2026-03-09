"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-ip-addressing-concise",
  title: "IP Addressing",
  description:
    "Quick overview of IPv4, IPv6, and subnetting for backend interviews and rapid learning.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "ip-addressing",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "ip", "networking", "fundamentals"],
  relatedTopics: ["domain-name-system", "tcp-vs-udp", "networking-fundamentals"],
};

export default function IpAddressingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>IP addressing</strong> identifies devices on a network. IPv4 uses
          32-bit addresses and is widely deployed. IPv6 uses 128-bit addresses to
          solve address exhaustion and improve routing efficiency.
        </p>
        <p>
          Subnetting and CIDR notation define address ranges and enable efficient
          routing. Understanding public vs private ranges is critical for backend
          networking and cloud design.
        </p>
        <p>
          For backend engineers, IP addressing shows up in firewall rules,
          allowlists, VPC design, and debugging connectivity issues. Knowing how
          addresses are structured and routed makes infra problems much easier to
          diagnose.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>IPv4:</strong> 32-bit, dotted decimal (192.168.1.10).</li>
          <li><strong>IPv6:</strong> 128-bit, hexadecimal (2001:db8::1).</li>
          <li><strong>CIDR:</strong> Classless Inter-Domain Routing, e.g. /24.</li>
          <li><strong>Public vs Private:</strong> Private ranges are not routable on the public internet.</li>
          <li><strong>Subnetting:</strong> Splits networks for isolation and routing control.</li>
          <li><strong>NAT:</strong> Translates private addresses to public IPs.</li>
          <li><strong>Routing Tables:</strong> Determine next hop by prefix match.</li>
          <li><strong>Dual-Stack:</strong> Run IPv4 and IPv6 side by side.</li>
        </ul>
        <p className="mt-4">
          A good mental model: IPs are location identifiers, CIDR defines the
          neighborhood, and routing tables decide the next hop toward a
          destination.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Check if an IP is private (Node)
import net from 'node:net';
const ip = '10.0.1.5';
console.log(net.isIP(ip) ? 'valid' : 'invalid');`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Standardized addressing scheme<br />
                ✓ Enables routing at scale<br />
                ✓ IPv6 removes address exhaustion
              </td>
              <td className="p-3">
                ✗ IPv4 exhaustion and NAT complexity<br />
                ✗ IPv6 adoption is still incomplete
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Know private IPv4 ranges and why NAT is used.</li>
          <li>Explain CIDR notation and how it defines address blocks.</li>
          <li>Describe IPv6 benefits and migration challenges.</li>
          <li>Give a simple subnet mask example (e.g. /24 = 256 addresses).</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do we need IPv6?</p>
            <p className="mt-2 text-sm">
              A: IPv4 addresses are exhausted. IPv6 provides a vastly larger
              address space and better routing aggregation.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What does /24 mean in CIDR?</p>
            <p className="mt-2 text-sm">
              A: It indicates the first 24 bits are the network prefix, leaving
              8 bits for host addresses.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are common private IPv4 ranges?</p>
            <p className="mt-2 text-sm">
              A: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is subnetting used?</p>
            <p className="mt-2 text-sm">
              A: It improves routing efficiency, isolates workloads, and reduces
              broadcast domains.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What problem does NAT solve?</p>
            <p className="mt-2 text-sm">
              A: It conserves public IPv4 addresses and hides private networks.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

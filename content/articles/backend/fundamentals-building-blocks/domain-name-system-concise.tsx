"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-dns-concise",
  title: "Domain Name System (DNS)",
  description:
    "Quick overview of DNS concepts for backend interviews and rapid learning.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "domain-name-system",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "dns", "networking", "fundamentals"],
  relatedTopics: [
    "http-https-protocol",
    "ip-addressing",
    "request-response-lifecycle",
  ],
};

export default function DomainNameSystemConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>DNS</strong> translates human-friendly domain names into IP
          addresses. It is a distributed, hierarchical system that powers almost
          every network request on the internet.
        </p>
        <p>
          DNS lookups resolve a name through recursive and authoritative servers,
          using cached results to reduce latency. Understanding DNS is critical
          for debugging latency, outages, and routing issues.
        </p>
        <p>
          In production systems, DNS is often the first point of failure. Small
          TTL mistakes, misconfigured records, or provider outages can make a
          healthy service appear down. Knowing how resolution works helps you
          troubleshoot faster.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Resolver:</strong> A recursive server that queries on behalf
            of the client.
          </li>
          <li>
            <strong>Recursive vs Iterative:</strong> Resolvers recurse; authoritative
            servers answer for their zone only.
          </li>
          <li>
            <strong>Authoritative:</strong> The server that owns a domain zone and
            returns final answers.
          </li>
          <li>
            <strong>Records:</strong> A, AAAA, CNAME, MX, TXT, NS, and SOA.
          </li>
          <li>
            <strong>TTL:</strong> Time to live for caching results.
          </li>
          <li>
            <strong>Negative Caching:</strong> NXDOMAIN responses are cached too.
          </li>
          <li>
            <strong>CNAME Chains:</strong> Multiple aliases add latency and can fail.
          </li>
          <li>
            <strong>Propagation:</strong> Changes take time to reach caches.
          </li>
          <li>
            <strong>DoH/DoT:</strong> DNS over HTTPS/TLS encrypts lookups.
          </li>
        </ul>
        <p className="mt-4">
          The DNS contract is simple: name in, IP out. But caching, delegation,
          and record types create many operational edge cases. Most DNS outages
          are configuration errors, not protocol failures.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Node.js: resolve a hostname
import dns from 'node:dns/promises';
const { address } = await dns.lookup('api.example.com');
console.log(address);`}</code>
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
                ✓ Human-friendly names<br />
                ✓ Global distributed system<br />
                ✓ Caching reduces latency
              </td>
              <td className="p-3">
                ✗ Propagation delays<br />
                ✗ Misconfiguration can cause outages<br />
                ✗ DNS is a common attack surface
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>
            Explain recursive vs authoritative resolution and where caching lives.
          </li>
          <li>
            Mention TTL and how it affects propagation and rollback speed.
          </li>
          <li>
            Know common record types and use cases.
          </li>
          <li>
            Mention CNAME limitations at the apex and chain length costs.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the role of a DNS resolver?</p>
            <p className="mt-2 text-sm">
              A: It performs recursive lookups and returns cached or resolved
              answers to the client.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why does DNS propagation take time?</p>
            <p className="mt-2 text-sm">
              A: Caches at resolvers and clients honor TTLs, so old values persist
              until they expire.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Recursive vs iterative lookup?</p>
            <p className="mt-2 text-sm">
              A: Recursive resolvers query on your behalf; iterative servers only
              answer for their zone or refer you upward.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use CNAME vs A records?</p>
            <p className="mt-2 text-sm">
              A: Use A for direct IPv4 addresses and CNAME to alias one name to
              another canonical domain.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What can go wrong in DNS during outages?</p>
            <p className="mt-2 text-sm">
              A: Misconfigured records, expired zones, or provider failures can
              break resolution and make services unreachable.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

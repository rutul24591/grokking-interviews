"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-dns-extensive",
  title: "Domain Name System (DNS)",
  description:
    "Comprehensive guide to DNS resolution, record types, caching, and operational pitfalls.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "domain-name-system",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "dns", "networking", "infrastructure"],
  relatedTopics: ["http-https-protocol", "ip-addressing", "networking-fundamentals"],
};

export default function DomainNameSystemExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>DNS</strong> is the distributed directory of the internet. It
          maps human-readable names to IP addresses and routes clients to the
          correct servers. Without DNS, users would have to memorize IPs.
        </p>
        <p>
          DNS is hierarchical and cache-driven. Resolvers query root servers,
          top-level domain servers, and authoritative servers to resolve a name.
          Results are cached to reduce latency and load.
        </p>
      </section>

      <section>
        <h2>Hierarchy and Resolution Flow</h2>
        <p>
          Resolution follows the DNS hierarchy: root servers, TLD servers, and
          authoritative name servers. Recursive resolvers hide this complexity
          from clients.
        </p>

        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/dns-hierarchy.svg"
          alt="DNS hierarchy diagram"
          caption="DNS hierarchy from root to authoritative zones"
        />

        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/ipv4-format.svg"
          alt="IPv4 address format"
          caption="DNS A records resolve names to IPv4 addresses"
        />

        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/ipv6-format.svg"
          alt="IPv6 address format"
          caption="DNS AAAA records resolve names to IPv6 addresses"
        />
      </section>

      <section>
        <h2>Record Types</h2>
        <ul className="space-y-2">
          <li><strong>A:</strong> IPv4 address mapping.</li>
          <li><strong>AAAA:</strong> IPv6 address mapping.</li>
          <li><strong>CNAME:</strong> Alias to another domain.</li>
          <li><strong>MX:</strong> Mail exchange servers.</li>
          <li><strong>TXT:</strong> Arbitrary text (SPF, DKIM, verification).</li>
          <li><strong>NS:</strong> Delegation to authoritative name servers.</li>
        </ul>
      </section>

      <section>
        <h2>TTL and Caching</h2>
        <p>
          DNS responses include a TTL that controls how long resolvers and
          clients cache the answer. Short TTLs allow fast changes but increase
          query load. Long TTLs reduce cost but slow rollbacks.
        </p>
      </section>

      <section>
        <h2>Operational Examples</h2>
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/tcp-three-way-handshake.svg"
          alt="TCP three way handshake diagram"
          caption="DNS usually uses UDP, but TCP is used for large responses and zone transfers"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Node.js DNS lookup example
import dns from 'node:dns/promises';

const result = await dns.lookup('example.com');
console.log(result.address);`}</code>
        </pre>

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// CLI example
$ dig example.com A
$ dig example.com AAAA
$ dig example.com CNAME`}</code>
        </pre>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <ul className="space-y-2">
          <li>DNS spoofing and cache poisoning risk.</li>
          <li>Use DNSSEC where applicable.</li>
          <li>Restrict access to zone management.</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>Misconfigured NS records causing resolution failure.</li>
          <li>Incorrect TTL values leading to slow rollbacks.</li>
          <li>Split-brain issues between providers and internal DNS.</li>
          <li>Failing to update reverse DNS when required.</li>
        </ul>
      </section>
    
      <section>
        <h2>Performance and Caching Strategy</h2>
        <p>
          DNS latency compounds across every request. Keep TTLs balanced: short
          enough for quick failover, long enough to reduce query volume. Use
          multiple authoritative providers for redundancy.
        </p>
        <ul className="space-y-2">
          <li>Use health checks with DNS failover.</li>
          <li>Prefer anycast DNS for global performance.</li>
          <li>Lower TTL before planned migrations.</li>
        </ul>
      </section>

      <section>
        <h2>Operational Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Example: DNS record strategy
A     api.example.com   1.2.3.4   TTL 300
AAAA  api.example.com   2606:4700::   TTL 300
CNAME www.example.com   app.example.net   TTL 300`}</code>
        </pre>
      </section>

      <section>
        <h2>Deep Dive: Resolver Behavior</h2>
        <p>
          Recursive resolvers cache answers and reduce global load. However, client-side caches
          (browser, OS, libraries) can override TTL behavior. This is why DNS debugging often
          requires clearing local caches in addition to waiting for TTL expiry.
        </p>
      </section>

      <section>
        <h2>Deep Dive: DNS Failover Patterns</h2>
        <p>
          DNS-based failover is common but not instant. To reduce downtime, use low TTLs on
          critical records and maintain a warm standby environment. Combine DNS with health
          checks to avoid routing traffic to unhealthy endpoints.
        </p>
      </section>

      <section>
        <h2>Deep Dive: DNS Load Balancing</h2>
        <p>
          DNS can distribute traffic using multiple A/AAAA records. Round-robin
          is simple but does not account for health or latency. Managed DNS
          providers add health checks and geo routing to direct clients to the
          nearest healthy endpoint.
        </p>
        <p>
          DNS load balancing is coarse-grained because of caching. It is best
          combined with application-level load balancing for faster reaction to
          failures.
        </p>
      </section>

      <section>
        <h2>Deep Dive: Negative Caching</h2>
        <p>
          NXDOMAIN responses can be cached too. This means a typo or temporary
          misconfiguration can persist longer than expected. Negative caching
          TTLs should be set carefully to avoid prolonged outages when records
          are recreated.
        </p>
      </section>

      <section>
        <h2>Resolution Timeline (What Actually Happens)</h2>
        <p>
          A single lookup can involve multiple caches. A browser cache may answer
          immediately. If it misses, the OS resolver checks its cache, then forwards
          to a recursive resolver (often ISP, enterprise, or public resolver).
          The recursive resolver walks the hierarchy only if it also misses.
        </p>
        <p>
          This layered caching means real-world DNS latency is often a few
          milliseconds for warm entries and tens to hundreds of milliseconds for
          cold entries. During incidents, this is why “it works on my machine”
          happens: different caches yield different answers.
        </p>
      </section>

      <section>
        <h2>Zone Management and Delegation</h2>
        <p>
          DNS is managed per zone. The zone file defines authoritative records,
          while NS records delegate control to the name servers responsible for
          that zone. Errors here are high impact because resolvers treat the NS
          set as the source of truth.
        </p>
        <ul className="space-y-2">
          <li>Keep NS records consistent across providers.</li>
          <li>Ensure SOA parameters match your update cadence.</li>
          <li>Avoid CNAME at the zone apex unless using ALIAS/ANAME.</li>
        </ul>
      </section>

      <section>
        <h2>DNSSEC in Practice</h2>
        <p>
          DNSSEC adds authenticity by signing records. It prevents cache
          poisoning but increases complexity and the risk of misconfiguration.
          Use it for high-value domains, and automate key rollover to avoid
          outages.
        </p>
        <p>
          Operationally, DNSSEC requires coordination between the registrar
          (DS records) and the authoritative provider (DNSKEY/RSIG). A mismatch
          can break resolution entirely.
        </p>
      </section>

      <section>
        <h2>Split-Horizon DNS</h2>
        <p>
          Split-horizon (split-view) DNS returns different answers based on the
          requester’s network. It is commonly used to route internal traffic to
          private IPs while keeping public traffic on public endpoints.
        </p>
        <p>
          The trade-off is operational complexity: you must keep internal and
          external views consistent, and debugging requires checking which view
          a resolver is using.
        </p>
      </section>

      <section>
        <h2>Troubleshooting Workflow</h2>
        <ol className="space-y-2">
          <li>Confirm the authoritative answer with <span className="ml-1">dig @ns</span>.</li>
          <li>Check recursive resolver caches and TTLs.</li>
          <li>Inspect CNAME chains and loop risks.</li>
          <li>Verify propagation by testing multiple resolvers/regions.</li>
          <li>Clear local caches if behavior differs by machine.</li>
        </ol>
      </section>

      <section>
        <h2>DNS Resolution: Step-by-Step Timeline</h2>
        <p>
          A full resolution often involves multiple hops. First, the client checks
          its browser cache. If that misses, the OS resolver checks its local cache.
          If still unresolved, the request is sent to a recursive resolver (ISP,
          enterprise, or public). The recursive resolver queries the root, then
          the TLD, then the authoritative server for the final answer.
        </p>
        <p>
          Each hop adds latency, but caching dramatically reduces cost. This is
          why most DNS lookups are fast when cached, yet slow on the first request
          after a TTL expiry. In practice, this creates variability in perceived
          performance and makes DNS issues hard to reproduce.
        </p>
      </section>

      <section>
        <h2>Record Types in Production Use</h2>
        <p>
          Beyond A and AAAA, production systems rely on TXT for verification,
          MX for mail routing, and SRV for service discovery. Each record type
          has different constraints, and misusing them often causes integration
          failures.
        </p>
        <ul className="space-y-2">
          <li><strong>A/AAAA:</strong> Primary web endpoints.</li>
          <li><strong>CNAME:</strong> Aliases, often for CDNs.</li>
          <li><strong>TXT:</strong> SPF/DKIM/DMARC and verification tokens.</li>
          <li><strong>MX:</strong> Mail server routing priorities.</li>
          <li><strong>SRV:</strong> Service discovery (less common on web).</li>
        </ul>
      </section>

      <section>
        <h2>CNAME Chains and Apex Constraints</h2>
        <p>
          CNAME records are powerful but easy to misuse. DNS standards do not allow
          a CNAME at the apex (the root of a zone) because it conflicts with NS and
          SOA records. Managed DNS providers often provide ALIAS or ANAME records
          to work around this, but they are provider-specific.
        </p>
        <p>
          Long CNAME chains increase latency and create more points of failure.
          Keep chains short and monitor for upstream changes that can break your
          alias targets.
        </p>
      </section>

      <section>
        <h2>TTL Strategy and Change Management</h2>
        <p>
          TTL values are a balance between agility and stability. Short TTLs allow
          quick cutovers and failovers but increase query volume. Long TTLs reduce
          load but can delay rollbacks during incidents.
        </p>
        <p>
          A standard practice is to lower TTLs before planned migrations, then
          raise them afterward. This reduces exposure during changes while
          preserving steady-state efficiency.
        </p>
      </section>

      <section>
        <h2>Negative Caching and NXDOMAIN</h2>
        <p>
          NXDOMAIN responses are cached, just like successful answers. If you
          accidentally delete a record, clients may continue to see it as missing
          until the negative cache expires. This often surprises teams during
          incident recovery.
        </p>
        <p>
          Tune negative TTL values carefully. Keep them short for critical zones
          to speed recovery, but not so short that they create excess query load.
        </p>
      </section>

      <section>
        <h2>DNS and Load Balancing Strategies</h2>
        <p>
          DNS can distribute traffic using multiple A/AAAA records (round-robin).
          This is coarse-grained because of caching. Managed providers extend DNS
          with health checks, geo routing, and latency-based routing to improve
          availability and user experience.
        </p>
        <p>
          DNS load balancing should complement, not replace, application load
          balancing. DNS is best for routing users to the right region; load
          balancers are best for routing within a region.
        </p>
      </section>

      <section>
        <h2>Reverse DNS and Compliance</h2>
        <p>
          Reverse DNS (PTR records) maps IPs to hostnames. It is often required
          for email deliverability, compliance audits, and some enterprise
          integrations. Neglecting reverse DNS can cause silent failures.
        </p>
        <p>
          Reverse DNS is usually managed by the IP owner (ISP or cloud provider),
          so updates can be slower and require coordination.
        </p>
      </section>

      <section>
        <h2>DNSSEC Operational Risks</h2>
        <p>
          DNSSEC improves authenticity but introduces operational risk. A broken
          DNSSEC chain (e.g., stale DS records, expired signatures) causes total
          resolution failure for validating resolvers. This is catastrophic for
          production systems.
        </p>
        <p>
          Automate key rollovers and monitor signature expiry. If your DNS
          provider supports DNSSEC, use their automation and alerting tools.
        </p>
      </section>

      <section>
        <h2>DoH/DoT and Privacy Considerations</h2>
        <p>
          DNS over HTTPS (DoH) and DNS over TLS (DoT) encrypt DNS queries, which
          improves privacy and reduces interception. However, it can complicate
          enterprise monitoring and policy enforcement because DNS traffic is
          no longer visible to traditional network tools.
        </p>
        <p>
          For internal networks, decide whether to allow or block DoH/DoT. This
          is a policy decision that balances user privacy with operational control.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Monitor TTLs and reduce them before planned migrations.</li>
          <li>Validate NS and SOA records after any provider change.</li>
          <li>Keep CNAME chains short and avoid apex CNAMEs.</li>
          <li>Test DNS changes from multiple regions and resolvers.</li>
          <li>Automate DNSSEC rollover if enabled.</li>
        </ul>
      </section>
</ArticleLayout>
  );
}

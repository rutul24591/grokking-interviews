"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-dns-extensive",
  title: "Domain Name System (DNS)",
  description: "Comprehensive guide to DNS covering resolution, record types, caching strategies, DNSSEC, load balancing, and production trade-offs for distributed systems.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "domain-name-system",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-19",
  tags: ["backend", "dns", "networking", "infrastructure", "security", "load-balancing"],
  relatedTopics: ["http-https-protocol", "ip-addressing", "networking-fundamentals", "load-balancers", "cdn-caching"],
};

export default function DomainNameSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>DNS (Domain Name System)</strong> is the distributed, hierarchical directory service of the internet. It translates human-readable domain names (example.com) into machine-readable IP addresses (93.184.216.34) and provides critical routing information for email, services, and infrastructure. Without DNS, users would need to memorize IP addresses for every website and service they use.
        </p>
        <p>
          DNS is one of the most critical yet overlooked components of modern infrastructure. Every HTTP request, email delivery, API call, and cloud service depends on DNS resolution. A DNS outage can take down your entire digital presence—even if your servers are healthy, users can&apos;t reach you without DNS.
        </p>
        <p>
          <strong>Why DNS matters for backend engineers:</strong>
        </p>
        <ul>
          <li>
            <strong>First Step in Every Request:</strong> DNS resolution happens before TCP connection, TLS handshake, and HTTP request. DNS latency directly impacts user-perceived performance.
          </li>
          <li>
            <strong>Global Traffic Management:</strong> DNS routes users to the nearest datacenter, enables failover, and distributes load across regions.
          </li>
          <li>
            <strong>Security Boundary:</strong> DNSSEC prevents cache poisoning. SPF/DKIM/DMARC records prevent email spoofing. DNS-based attacks (DDoS, amplification) are common.
          </li>
          <li>
            <strong>Operational Complexity:</strong> DNS changes propagate slowly (TTL-dependent). Misconfigurations cause outages that are hard to debug.
          </li>
        </ul>
        <p>
          <strong>DNS Architecture Overview:</strong>
        </p>
        <ul>
          <li><strong>Distributed:</strong> No single point of failure or control. Thousands of organizations operate DNS servers worldwide.</li>
          <li><strong>Hierarchical:</strong> Root → TLD → Authoritative servers. Each level delegates to the next.</li>
          <li><strong>Cached:</strong> Resolvers and clients cache responses to reduce load and latency. Caching is why DNS changes take time to propagate.</li>
          <li><strong>UDP-based:</strong> DNS primarily uses UDP port 53 (fast, low overhead). Falls back to TCP for large responses.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: DNS Is Not Instant</h3>
          <p>
            DNS changes are not immediate. When you update a DNS record, the old value persists in caches until TTL expires. This is &quot;propagation delay&quot;—not actual propagation, but cache expiration. For critical changes (failover, migrations), plan ahead: lower TTL days in advance, verify from multiple locations, and understand that some users will see old values until caches expire.
          </p>
        </div>
      </section>

      <section>
        <h2>DNS Hierarchy and Resolution</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The DNS Hierarchy</h3>
        <p>
          DNS is organized as a tree structure, with delegation at each level:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Root Servers (.</strong>): 13 logical root server clusters (A-M), operated by organizations like ICANN, NASA, and universities. They know where to find TLD servers.
          </li>
          <li>
            <strong>TLD Servers (.com, .org, .net, .io, etc.)</strong>: Top-Level Domain servers know where to find authoritative servers for domains in their TLD.
          </li>
          <li>
            <strong>Authoritative Name Servers</strong>: The final authority for a domain. They hold the actual DNS records (A, AAAA, CNAME, MX, etc.).
          </li>
        </ol>
        <p>
          <strong>Example: Resolving www.example.com:</strong>
        </p>
        <ol className="space-y-2">
          <li>Resolver asks root: &quot;Where is www.example.com?&quot;</li>
          <li>Root responds: &quot;Ask .com TLD servers at [IPs]&quot;</li>
          <li>Resolver asks .com TLD: &quot;Where is www.example.com?&quot;</li>
          <li>TLD responds: &quot;Ask example.com&apos;s authoritative servers at [IPs]&quot;</li>
          <li>Resolver asks authoritative: &quot;What is the A record for www.example.com?&quot;</li>
          <li>Authoritative responds: &quot;93.184.216.34&quot;</li>
          <li>Resolver caches result and returns to client.</li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recursive vs Iterative Resolution</h3>
        <p>
          <strong>Recursive Resolution:</strong> The resolver does all the work. Client asks resolver, resolver queries root → TLD → authoritative, caches result, returns to client. This is what your ISP or public resolver (8.8.8.8, 1.1.1.1) does.
        </p>
        <p>
          <strong>Iterative Resolution:</strong> The client does the work. Resolver returns referrals (root → TLD → authoritative), and client queries each level. Used by DNS debugging tools (dig +trace).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DNS Resolution Flow (What Actually Happens)</h3>
        <p>
          When a browser requests www.example.com, DNS resolution involves multiple cache layers:
        </p>
        <ol className="space-y-2">
          <li><strong>Browser Cache:</strong> Browser checks its own DNS cache (Chrome: ~1000 entries, 1-minute TTL).</li>
          <li><strong>OS Cache:</strong> If browser cache misses, OS resolver checks its cache (getent hosts, ipconfig /displaydns).</li>
          <li><strong>Recursive Resolver:</strong> If OS cache misses, query goes to configured resolver (ISP, 8.8.8.8, 1.1.1.1).</li>
          <li><strong>Root/TLD/Authoritative:</strong> If resolver cache misses, it walks the hierarchy.</li>
        </ol>
        <p>
          <strong>Latency Impact:</strong>
        </p>
        <ul>
          <li><strong>Warm cache (browser/OS/resolver):</strong> 1-10ms.</li>
          <li><strong>Cold cache (full resolution):</strong> 50-200ms depending on network conditions.</li>
        </ul>
        <p>
          <strong>Why &quot;it works on my machine&quot;:</strong> Different machines have different cache states. Your machine may have cached the correct IP while a user&apos;s machine has stale data.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/dns-hierarchy.svg"
          alt="DNS Hierarchy showing Root → TLD → Authoritative delegation"
          caption="DNS Hierarchy: Root servers delegate to TLD servers (.com, .org, etc.), which delegate to authoritative name servers. Resolution follows this chain from root to authoritative."
        />
      </section>

      <section>
        <h2>DNS Record Types</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Record Type</th>
              <th className="p-3 text-left">Purpose</th>
              <th className="p-3 text-left">Example</th>
              <th className="p-3 text-left">Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>A</strong></td>
              <td className="p-3">IPv4 address mapping</td>
              <td className="p-3">example.com → 93.184.216.34</td>
              <td className="p-3">Primary web endpoints</td>
            </tr>
            <tr>
              <td className="p-3"><strong>AAAA</strong></td>
              <td className="p-3">IPv6 address mapping</td>
              <td className="p-3">example.com → 2606:2800:220:1:248:1893:25c8:1946</td>
              <td className="p-3">IPv6-enabled endpoints</td>
            </tr>
            <tr>
              <td className="p-3"><strong>CNAME</strong></td>
              <td className="p-3">Alias to another domain</td>
              <td className="p-3">www.example.com → example.com</td>
              <td className="p-3">CDN aliases, subdomain redirects</td>
            </tr>
            <tr>
              <td className="p-3"><strong>MX</strong></td>
              <td className="p-3">Mail exchange servers</td>
              <td className="p-3">example.com → mail.example.com (priority 10)</td>
              <td className="p-3">Email routing</td>
            </tr>
            <tr>
              <td className="p-3"><strong>TXT</strong></td>
              <td className="p-3">Arbitrary text</td>
              <td className="p-3">&quot;v=spf1 include:_spf.google.com ~all&quot;</td>
              <td className="p-3">SPF, DKIM, DMARC, domain verification</td>
            </tr>
            <tr>
              <td className="p-3"><strong>NS</strong></td>
              <td className="p-3">Authoritative name servers</td>
              <td className="p-3">example.com → ns1.example.com</td>
              <td className="p-3">Delegation to name servers</td>
            </tr>
            <tr>
              <td className="p-3"><strong>PTR</strong></td>
              <td className="p-3">Reverse DNS (IP → domain)</td>
              <td className="p-3">34.216.184.93.in-addr.arpa → example.com</td>
              <td className="p-3">Email deliverability, compliance</td>
            </tr>
            <tr>
              <td className="p-3"><strong>SRV</strong></td>
              <td className="p-3">Service discovery</td>
              <td className="p-3">_sip._tcp.example.com → sipserver.example.com:5060</td>
              <td className="p-3">Service discovery (VoIP, XMPP, Kubernetes)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>SOA</strong></td>
              <td className="p-3">Start of Authority</td>
              <td className="p-3">Primary NS, admin email, serial, refresh, retry, expire, minimum TTL</td>
              <td className="p-3">Zone management metadata</td>
            </tr>
            <tr>
              <td className="p-3"><strong>CAA</strong></td>
              <td className="p-3">Certificate Authority Authorization</td>
              <td className="p-3">example.com → &quot;0 issue letsencrypt.org&quot;</td>
              <td className="p-3">Restrict which CAs can issue certificates</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">A vs AAAA Records</h3>
        <p>
          <strong>A records</strong> map domains to IPv4 addresses (32-bit, e.g., 192.0.2.1). <strong>AAAA records</strong> map domains to IPv6 addresses (128-bit, e.g., 2001:db8::1).
        </p>
        <p>
          <strong>Best practice:</strong> Publish both A and AAAA records (dual-stack). Clients prefer IPv6 if available, fall back to IPv4.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CNAME Records and Limitations</h3>
        <p>
          CNAME records alias one domain to another. When resolving www.example.com → example.com, the resolver then looks up example.com&apos;s A/AAAA records.
        </p>
        <p>
          <strong>Limitations:</strong>
        </p>
        <ul>
          <li><strong>Cannot use at zone apex:</strong> You cannot have a CNAME at example.com (the root of the zone) because it conflicts with NS and SOA records. Use ALIAS/ANAME records (provider-specific) or A records instead.</li>
          <li><strong>Cannot coexist with other records:</strong> A CNAME cannot coexist with MX, TXT, or other records for the same name.</li>
          <li><strong>Chain length matters:</strong> Long CNAME chains (A → B → C → D) increase latency and failure points. Keep chains short (max 2-3 hops).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TXT Records for Email and Verification</h3>
        <p>
          TXT records store arbitrary text. Common uses:
        </p>
        <ul>
          <li><strong>SPF (Sender Policy Framework):</strong> <code>v=spf1 include:_spf.google.com ~all</code> — Specifies which servers can send email for the domain.</li>
          <li><strong>DKIM (DomainKeys Identified Mail):</strong> Public key for email signature verification.</li>
          <li><strong>DMARC (Domain-based Message Authentication):</strong> <code>v=DMARC1; p=reject; rua=mailto:dmarc@example.com</code> — Policy for handling failed SPF/DKIM.</li>
          <li><strong>Domain Verification:</strong> Google, AWS, Azure provide TXT records to verify domain ownership.</li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/ipv4-format.svg"
          alt="IPv4 and IPv6 Address Format"
          caption="DNS A records map to IPv4 (32-bit), AAAA records map to IPv6 (128-bit). Dual-stack deployments publish both record types."
        />
      </section>

      <section>
        <h2>TTL and Caching</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Understanding TTL</h3>
        <p>
          <strong>TTL (Time To Live)</strong> is the number of seconds a DNS record can be cached before it must be refreshed. TTL is set per record in seconds:
        </p>
        <ul>
          <li><strong>60:</strong> 1 minute (very aggressive, high query volume)</li>
          <li><strong>300:</strong> 5 minutes (fast failover)</li>
          <li><strong>3600:</strong> 1 hour (balanced)</li>
          <li><strong>86400:</strong> 24 hours (stable, low query volume)</li>
          <li><strong>604800:</strong> 7 days (very stable, slow changes)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TTL Trade-offs</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">TTL Value</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
              <th className="p-3 text-left">Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Low (60-300s)</strong></td>
              <td className="p-3">Fast failover, quick changes</td>
              <td className="p-3">High query volume, increased cost, slower resolution</td>
              <td className="p-3">Critical services, active migrations</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Medium (3600s)</strong></td>
              <td className="p-3">Balanced performance and agility</td>
              <td className="p-3">1-hour delay for changes</td>
              <td className="p-3">Standard web services</td>
            </tr>
            <tr>
              <td className="p-3"><strong>High (86400s+)</strong></td>
              <td className="p-3">Low query volume, fast cached resolution</td>
              <td className="p-3">24+ hour delay for changes</td>
              <td className="p-3">Static records, rarely-changed infrastructure</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TTL Strategy for Migrations</h3>
        <p>
          When planning DNS changes (migrations, failover setup):
        </p>
        <ol className="space-y-2">
          <li><strong>7 days before:</strong> Lower TTL to 300s (5 minutes). Wait for old TTL to expire.</li>
          <li><strong>Make change:</strong> Update DNS record.</li>
          <li><strong>Verify:</strong> Check from multiple locations (DNS propagation checkers).</li>
          <li><strong>After migration:</strong> Raise TTL back to normal (86400s) to reduce query volume.</li>
        </ol>
        <p>
          <strong>Why:</strong> If TTL was 24 hours and you change the record, some users will see the old value for up to 24 hours. Lowering TTL in advance ensures caches expire quickly.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Negative Caching (NXDOMAIN)</h3>
        <p>
          When a domain doesn&apos;t exist, resolvers cache the NXDOMAIN response. This is governed by the SOA record&apos;s <strong>MINIMUM</strong> field (also called negative TTL).
        </p>
        <p>
          <strong>Problem:</strong> If you accidentally delete a record, users will see NXDOMAIN until the negative cache expires—even after you restore the record.
        </p>
        <p>
          <strong>Solution:</strong> Set negative TTL appropriately (300-3600s for critical domains). During incident recovery, be aware that NXDOMAIN may persist.
        </p>
      </section>

      <section>
        <h2>DNS Load Balancing and Failover</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DNS Round-Robin</h3>
        <p>
          Simple DNS load balancing: publish multiple A records for the same name:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          example.com → 192.0.2.1
          example.com → 192.0.2.2
          example.com → 192.0.2.3
        </pre>
        <p>
          Resolvers rotate through the IPs (round-robin). Simple, but has limitations:
        </p>
        <ul>
          <li><strong>No health checking:</strong> DNS doesn&apos;t know if a server is down. Clients may get a dead IP.</li>
          <li><strong>Uneven distribution:</strong> Client-side caching causes imbalance. Some clients stick to one IP.</li>
          <li><strong>Coarse-grained:</strong> No awareness of geography, latency, or server load.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Managed DNS Load Balancing</h3>
        <p>
          Managed DNS providers (Route53, Cloudflare, NS1) offer advanced features:
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Health Checks</h4>
        <p>
          DNS provider monitors endpoints. If an endpoint fails health check, it&apos;s removed from DNS responses.
        </p>
        <p>
          <strong>Limitation:</strong> DNS changes still take TTL to propagate. Health check failure → DNS update → cache expiration = 30s to 5min downtime.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Geolocation Routing</h4>
        <p>
          Route users to the nearest endpoint based on their geographic location:
        </p>
        <ul>
          <li>Users in US → us-east-1 endpoint</li>
          <li>Users in EU → eu-west-1 endpoint</li>
          <li>Users in Asia → ap-southeast-1 endpoint</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Latency-Based Routing</h4>
        <p>
          Route users to the endpoint with lowest latency (measured by DNS provider&apos;s probes).
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Weighted Routing</h4>
        <p>
          Distribute traffic by weight (percentage):
        </p>
        <ul>
          <li>90% to production (v2)</li>
          <li>10% to canary (v3)</li>
        </ul>
        <p>
          Useful for gradual rollouts and A/B testing.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DNS Failover Strategy</h3>
        <p>
          DNS-based failover is common but has limitations:
        </p>
        <ol className="space-y-2">
          <li><strong>Primary endpoint:</strong> Normal traffic goes to primary.</li>
          <li><strong>Health check:</strong> DNS provider monitors primary.</li>
          <li><strong>Failover:</strong> If primary fails, DNS updates to point to secondary.</li>
          <li><strong>Propagation:</strong> Clients with cached DNS must wait for TTL to expire.</li>
        </ol>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul>
          <li>Use low TTL (60-300s) for critical services.</li>
          <li>Combine with application-level failover (faster than DNS).</li>
          <li>Test failover regularly (quarterly drills).</li>
          <li>Monitor DNS provider health (they can have outages too).</li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/ipv6-format.svg"
          alt="DNS Load Balancing Strategies"
          caption="DNS Load Balancing: Round-robin (simple, no health checks), Geolocation (route by region), Latency-based (route by lowest latency), Weighted (percentage-based distribution)."
        />
      </section>

      <section>
        <h2>DNS Security</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DNS Spoofing and Cache Poisoning</h3>
        <p>
          <strong>DNS spoofing:</strong> Attacker sends fake DNS responses, poisoning resolver cache. Users are redirected to malicious IPs.
        </p>
        <p>
          <strong>Famous attack:</strong> 2008 Kaminsky attack exploited DNS transaction ID predictability. Modern DNS uses random transaction IDs and port randomization to mitigate.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DNSSEC (DNS Security Extensions)</h3>
        <p>
          DNSSEC adds cryptographic signatures to DNS records, ensuring authenticity and integrity:
        </p>
        <ul>
          <li><strong>DNSKEY:</strong> Public key for the zone.</li>
          <li><strong>RRSIG:</strong> Signature for each record set.</li>
          <li><strong>DS:</strong> Delegation Signer (links child zone to parent).</li>
          <li><strong>NSEC/NSEC3:</strong> Proves non-existence (prevents spoofed NXDOMAIN).</li>
        </ul>
        <p>
          <strong>How it works:</strong>
        </p>
        <ol className="space-y-2">
          <li>Resolver requests DNSKEY for the zone.</li>
          <li>Resolver verifies DNSKEY is signed by parent (DS record).</li>
          <li>Resolver verifies each record&apos;s signature (RRSIG) using DNSKEY.</li>
          <li>If signatures validate, response is authentic. If not, response is rejected.</li>
        </ol>
        <p>
          <strong>Advantages:</strong> Prevents cache poisoning, ensures data authenticity.
        </p>
        <p>
          <strong>Disadvantages:</strong> Increased complexity, larger responses, risk of misconfiguration (broken DNSSEC = total resolution failure).
        </p>
        <p>
          <strong>Operational considerations:</strong>
        </p>
        <ul>
          <li><strong>Key rollover:</strong> Keys must be rotated periodically. Automate this process.</li>
          <li><strong>Signature expiry:</strong> RRSIG records have expiry dates. Monitor and alert before expiry.</li>
          <li><strong>Chain of trust:</strong> DS record at registrar must match DNSKEY at authoritative. Mismatch = resolution failure.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DNS over HTTPS (DoH) and DNS over TLS (DoT)</h3>
        <p>
          Traditional DNS is unencrypted (UDP port 53). DoH and DoT encrypt DNS queries:
        </p>
        <ul>
          <li><strong>DoH (DNS over HTTPS):</strong> DNS queries over HTTPS (port 443). Looks like normal HTTPS traffic.</li>
          <li><strong>DoT (DNS over TLS):</strong> DNS queries over TLS (port 853).</li>
        </ul>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>Prevents eavesdropping (ISP can&apos;t see which domains you query).</li>
          <li>Prevents DNS manipulation (ISP can&apos;t inject fake responses).</li>
          <li>Improves privacy (especially on public WiFi).</li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>Enterprise visibility: IT can&apos;t monitor DNS for security threats.</li>
          <li>Bypasses corporate DNS policies (parental controls, content filtering).</li>
          <li>Slightly higher latency (TLS handshake overhead).</li>
        </ul>
        <p>
          <strong>Adoption:</strong> Firefox and Chrome support DoH. Cloudflare (1.1.1.1), Google (8.8.8.8) offer DoH/DoT resolvers.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Security: SPF, DKIM, DMARC</h3>
        <p>
          DNS TXT records secure email delivery:
        </p>
        <ul>
          <li><strong>SPF (Sender Policy Framework):</strong> Lists servers authorized to send email for the domain.</li>
          <li><strong>DKIM (DomainKeys Identified Mail):</strong> Cryptographic signature for email authenticity.</li>
          <li><strong>DMARC (Domain-based Message Authentication):</strong> Policy for handling failed SPF/DKIM (none, quarantine, reject).</li>
        </ul>
        <p>
          <strong>Why it matters:</strong> Without SPF/DKIM/DMARC, attackers can spoof your domain for phishing. Email providers (Gmail, Outlook) may mark your emails as spam.
        </p>
      </section>

      <section>
        <h2>Advanced DNS Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Split-Horizon DNS</h3>
        <p>
          Split-horizon (split-view) DNS returns different answers based on the requester&apos;s network:
        </p>
        <ul>
          <li><strong>Internal network:</strong> example.com → 10.0.0.1 (private IP)</li>
          <li><strong>External network:</strong> example.com → 93.184.216.34 (public IP)</li>
        </ul>
        <p>
          <strong>Use cases:</strong>
        </p>
        <ul>
          <li>Internal services accessible only from corporate network.</li>
          <li>Split-brain deployments (different environments for internal/external).</li>
          <li>Compliance (data residency requirements).</li>
        </ul>
        <p>
          <strong>Implementation:</strong> Bind views, AWS Route53 Resolver, Cloudflare Split DNS.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">DNS over TCP</h3>
        <p>
          DNS primarily uses UDP, but falls back to TCP in specific cases:
        </p>
        <ul>
          <li><strong>Large responses:</strong> If response exceeds UDP size limit (512 bytes standard, 4096 with EDNS0), server sets TC (truncated) flag. Client retries over TCP.</li>
          <li><strong>Zone transfers (AXFR/IXFR):</strong> Always use TCP (large data transfer).</li>
          <li><strong>DNSSEC:</strong> Signed responses are larger, often require TCP.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Reverse DNS (PTR Records)</h3>
        <p>
          Reverse DNS maps IP addresses to domain names (opposite of A/AAAA):
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
          34.216.184.93.in-addr.arpa → www.example.com
        </pre>
        <p>
          <strong>Use cases:</strong>
        </p>
        <ul>
          <li><strong>Email deliverability:</strong> Many mail servers reject email from IPs without matching PTR records.</li>
          <li><strong>Compliance:</strong> Some enterprise integrations require reverse DNS.</li>
          <li><strong>Debugging:</strong> Log analysis (IP → domain is more readable).</li>
        </ul>
        <p>
          <strong>Management:</strong> PTR records are managed by the IP owner (ISP, cloud provider), not the domain owner. Request through your hosting provider.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Anycast DNS</h3>
        <p>
          Anycast routes DNS queries to the nearest server (by BGP routing):
        </p>
        <ul>
          <li>Multiple servers worldwide advertise the same IP.</li>
          <li>BGP routes query to the closest server.</li>
          <li>Improves latency and provides DDoS resilience.</li>
        </ul>
        <p>
          <strong>Examples:</strong> 1.1.1.1 (Cloudflare), 8.8.8.8 (Google), root servers use anycast.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Global E-Commerce Site (Geolocation Routing)</h3>
        <p>
          <strong>Challenge:</strong> Serve customers worldwide with low latency.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>Route53 geolocation routing: US → us-east-1, EU → eu-west-1, Asia → ap-southeast-1.</li>
          <li>Health checks with automatic failover.</li>
          <li>TTL 300s for quick failover.</li>
        </ul>
        <p>
          <strong>Result:</strong> 40% latency reduction for international users, automatic failover during regional outages.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. SaaS Migration (DNS Cutover)</h3>
        <p>
          <strong>Challenge:</strong> Migrate from legacy infrastructure to new platform with zero downtime.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>7 days before: Lower TTL to 60s.</li>
          <li>Deploy new infrastructure, run parallel.</li>
          <li>Update DNS to new IPs.</li>
          <li>Monitor from 10+ locations (DNS propagation checkers).</li>
          <li>After 24 hours: Raise TTL to 3600s.</li>
        </ul>
        <p>
          <strong>Result:</strong> Zero-downtime migration, minimal user impact.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Email Security (SPF/DKIM/DMARC)</h3>
        <p>
          <strong>Challenge:</strong> Prevent email spoofing, improve deliverability.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>SPF: <code>v=spf1 include:_spf.google.com include:sendgrid.net ~all</code></li>
          <li>DKIM: Generate key pair, publish public key in TXT record.</li>
          <li>DMARC: <code>v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@example.com</code></li>
        </ul>
        <p>
          <strong>Result:</strong> 90% reduction in phishing emails spoofing domain, improved email deliverability.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. DDoS Mitigation (Cloudflare)</h3>
        <p>
          <strong>Challenge:</strong> Protect against DNS-based DDoS attacks.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>Use Cloudflare&apos;s anycast DNS (distributed across 200+ cities).</li>
          <li>DDoS traffic absorbed at edge, legitimate traffic proxied to origin.</li>
          <li>Rate limiting at DNS layer.</li>
        </ul>
        <p>
          <strong>Result:</strong> Survived 1 Tbps DDoS attack with zero downtime.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">5. Multi-Cloud DNS (Route53 + Cloudflare)</h3>
        <p>
          <strong>Challenge:</strong> Avoid single point of failure (DNS provider outage).
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>Delegate subdomains to different providers: api.example.com → Route53, www.example.com → Cloudflare.</li>
          <li>Or use DNS failover between providers.</li>
        </ul>
        <p>
          <strong>Result:</strong> Survived Route53 outage (2021) with partial functionality.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">6. Kubernetes Service Discovery (Internal DNS)</h3>
        <p>
          <strong>Challenge:</strong> Services need to discover each other dynamically.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>Kubernetes DNS (CoreDNS): Services get DNS names (my-service.default.svc.cluster.local).</li>
          <li>SRV records for port discovery.</li>
          <li>Headless services for direct pod IPs.</li>
        </ul>
        <p>
          <strong>Result:</strong> Seamless service discovery, no hardcoded IPs.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>

        <ul className="space-y-3">
          <li>
            <strong>CNAME at zone apex:</strong> Putting CNAME at example.com (root) breaks DNS. <strong>Solution:</strong> Use ALIAS/ANAME records (provider-specific) or A records.
          </li>
          <li>
            <strong>Long TTL during migrations:</strong> TTL 86400s means 24-hour propagation delay. <strong>Solution:</strong> Lower TTL 7 days before migration.
          </li>
          <li>
            <strong>Long CNAME chains:</strong> A → B → C → D → E increases latency and failure points. <strong>Solution:</strong> Flatten chains (max 2-3 hops).
          </li>
          <li>
            <strong>Missing negative TTL consideration:</strong> NXDOMAIN caching causes prolonged outages after record restoration. <strong>Solution:</strong> Set negative TTL appropriately (300-3600s).
          </li>
          <li>
            <strong>DNSSEC misconfiguration:</strong> Broken DNSSEC chain causes total resolution failure. <strong>Solution:</strong> Automate key rollover, monitor signature expiry, test before enabling.
          </li>
          <li>
            <strong>Single DNS provider:</strong> Provider outage = total downtime. <strong>Solution:</strong> Use multiple providers or delegate subdomains.
          </li>
          <li>
            <strong>No health checks:</strong> DNS round-robin sends traffic to dead servers. <strong>Solution:</strong> Use managed DNS with health checks.
          </li>
          <li>
            <strong>Forgetting reverse DNS:</strong> Email marked as spam, compliance failures. <strong>Solution:</strong> Set up PTR records for all outbound mail IPs.
          </li>
          <li>
            <strong>Not testing from multiple locations:</strong> DNS looks correct from your office but broken elsewhere. <strong>Solution:</strong> Use DNS propagation checkers (dnschecker.org).
          </li>
          <li>
            <strong>Ignoring DNS provider limits:</strong> Rate limits, query limits can cause issues during attacks. <strong>Solution:</strong> Understand provider limits, have escalation contacts.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: Explain the DNS resolution process. What happens when you type example.com in a browser?</p>
            <p className="mt-2 text-sm">
              A: Browser checks its cache → OS resolver cache → recursive resolver (ISP/8.8.8.8). If resolver cache misses, it queries root servers (where is .com?) → TLD servers (where is example.com?) → authoritative servers (what is the A record for example.com?). Response is cached at each level and returned to client. Total latency: 1-10ms for warm cache, 50-200ms for cold cache.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: What is TTL and how does it affect DNS changes?</p>
            <p className="mt-2 text-sm">
              A: TTL (Time To Live) is the number of seconds a DNS record can be cached. When you change a DNS record, old values persist in caches until TTL expires. For migrations, lower TTL (to 300s) 7 days before, make change, then raise TTL back. This ensures caches expire quickly, minimizing propagation delay.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: What is DNSSEC and why would you use it?</p>
            <p className="mt-2 text-sm">
              A: DNSSEC adds cryptographic signatures to DNS records, preventing cache poisoning and spoofing. It creates a chain of trust from root to authoritative servers. Advantages: authenticity, integrity. Disadvantages: complexity, larger responses, risk of misconfiguration (broken DNSSEC = total failure). Use for high-value domains (banks, government).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: How does DNS load balancing work? What are its limitations?</p>
            <p className="mt-2 text-sm">
              A: DNS load balancing publishes multiple A records (round-robin) or uses managed DNS with health checks, geolocation, latency-based routing. Limitations: DNS changes take TTL to propagate (slow failover), no real-time health awareness (unless using managed DNS), coarse-grained (can&apos;t route based on server load). Best combined with application-level load balancing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: What is the difference between recursive and iterative DNS queries?</p>
            <p className="mt-2 text-sm">
              A: Recursive: Resolver does all work (queries root → TLD → authoritative), returns final answer to client. Used by ISP/public resolvers. Iterative: Resolver returns referrals (root → TLD → authoritative), client queries each level. Used by debugging tools (dig +trace). Recursive is easier for clients; iterative gives more visibility.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: When would you use CNAME vs A records? What are CNAME limitations?</p>
            <p className="mt-2 text-sm">
              A: Use A records for direct IPv4 addresses (apex domains, stable IPs). Use CNAME to alias one domain to another (www → apex, CDN aliases). CNAME limitations: Cannot use at zone apex (conflicts with NS/SOA), cannot coexist with other records (MX, TXT), long chains increase latency. Use ALIAS/ANAME for apex aliases (provider-specific).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc1035" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 1035: Domain Names - Implementation and Specification - Original DNS specification
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Glossary/DNS" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs: DNS - Comprehensive DNS reference
            </a>
          </li>
          <li>
            <a href="https://aws.amazon.com/route53/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS Route53 Documentation - Managed DNS with advanced routing
            </a>
          </li>
          <li>
            <a href="https://cloudflare.com/dns/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Cloudflare DNS - DDoS-protected DNS with DoH/DoT
            </a>
          </li>
          <li>
            <a href="https://dnssec-analyzer.verisignlabs.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              DNSSEC Analyzer - Validate DNSSEC configuration
            </a>
          </li>
          <li>
            <a href="https://www.icann.org/resources/pages/dns-2019-03-05-en" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              ICANN DNS Resources - Root server information, DNS governance
            </a>
          </li>
          <li>
            <strong>Books:</strong> &quot;DNS and BIND&quot; by Cricket Liu (O&apos;Reilly) - Definitive DNS reference
          </li>
          <li>
            <strong>Tools:</strong> dig, nslookup, dnschecker.org (propagation), intoDNS (health check)
          </li>
        </ul>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          DNS is the foundation of internet infrastructure—translating domain names to IP addresses, routing traffic globally, and enabling email delivery. Key concepts include: hierarchical resolution (root → TLD → authoritative), record types (A, AAAA, CNAME, MX, TXT, etc.), TTL and caching (propagation delay), load balancing (round-robin, geolocation, latency-based), security (DNSSEC, DoH/DoT, SPF/DKIM/DMARC), and operational best practices (low TTL for migrations, health checks, multi-provider redundancy).
        </p>
        <p>
          For backend engineers, DNS is critical for: performance (resolution latency), reliability (failover, health checks), security (DNSSEC, email authentication), and operations (migrations, debugging). Understanding DNS deeply enables better system design, faster incident resolution, and more robust infrastructure.
        </p>
        <p>
          For staff/principal engineer interviews, expect to discuss: DNS resolution flow, TTL strategy for migrations, DNS load balancing approaches, DNSSEC trade-offs, and real-world examples from systems you&apos;ve designed. The key is demonstrating understanding of DNS as a distributed system with caching, delegation, and eventual consistency.
        </p>
      </section>
    </ArticleLayout>
  );
}

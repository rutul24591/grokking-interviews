"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-ip-addressing-extensive",
  title: "IP Addressing",
  description: "Comprehensive guide to IPv4, IPv6, CIDR, subnetting, NAT, and production IP design patterns for backend systems.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "ip-addressing",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: ["backend", "ip", "networking", "cidr", "ipv6", "subnetting", "nat", "vpc"],
  relatedTopics: ["domain-name-system", "tcp-vs-udp", "networking-fundamentals", "load-balancers"],
};

export default function IpAddressingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>IP (Internet Protocol) addressing</strong> provides unique identifiers for devices on a network, enabling routing, communication, and security policies across distributed systems. IPv4 uses 32-bit addresses (approximately 4.3 billion unique addresses), while IPv6 uses 128-bit addresses (approximately 3.4 × 10³⁸ addresses) to address global growth and improve routing efficiency.
        </p>
        <p>
          For backend engineers, IP addressing is foundational to: <strong>routing</strong> (directing traffic between services), <strong>security policies</strong> (firewall rules, security groups, network ACLs), <strong>service discovery</strong> (locating services within a network), and <strong>capacity planning</strong> (ensuring sufficient address space for growth). CIDR (Classless Inter-Domain Routing) and subnetting are fundamental for cloud networking and VPC design.
        </p>
        <p>
          The exhaustion of IPv4 addresses (officially depleted by IANA in 2011) has made IPv6 adoption critical for new services, while NAT (Network Address Translation) has become ubiquitous for extending IPv4 address space. Understanding both protocols and their operational implications is essential for building scalable, future-proof infrastructure.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          IP addressing encompasses several interconnected concepts that govern how networks are structured and how traffic flows between them.
        </p>
        <ul>
          <li>
            <strong>IPv4 Format:</strong> 32-bit addresses expressed in dotted-decimal notation (e.g., 192.168.1.1). Each octet represents 8 bits, ranging from 0-255. IPv4 supports approximately 4.3 billion unique addresses, which proved insufficient for global internet growth.
          </li>
          <li>
            <strong>IPv6 Format:</strong> 128-bit addresses expressed in hexadecimal notation with colons (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334). Leading zeros can be omitted, and consecutive zero groups can be compressed with :: (e.g., 2001:db8:85a3::8a2e:370:7334). IPv6 provides essentially unlimited addresses for foreseeable future growth.
          </li>
          <li>
            <strong>CIDR Notation:</strong> Expresses network ranges as a prefix length (e.g., 192.168.1.0/24). The /24 means the first 24 bits represent the network prefix, leaving 8 bits for host addresses (256 total addresses, 254 usable after reserving network and broadcast addresses).
          </li>
          <li>
            <strong>Public vs Private Ranges:</strong> Private IP ranges are not routable on the public internet and are used for internal networks. NAT translates private addresses to public ones at the network edge. IPv4 private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. IPv6 unique local addresses: fc00::/7.
          </li>
          <li>
            <strong>Subnetting:</strong> Dividing a network into smaller, manageable subnets for isolation, security, and efficient routing. Subnet size impacts scalability: overly small subnets cause IP exhaustion during autoscaling; overly large subnets waste address space and reduce isolation.
          </li>
          <li>
            <strong>NAT (Network Address Translation):</strong> Allows multiple private hosts to share a single public IP by translating ports and addresses. Essential for IPv4 scale but introduces stateful translation tables and port exhaustion risks at high throughput.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/ipv4-ipv6-comparison.svg"
          alt="IPv4 vs IPv6 Comparison"
          caption="IPv4 uses dotted decimal notation with 32 bits, providing ~4.3 billion addresses; IPv6 uses hexadecimal with 128 bits"
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/cidr-subnetting.svg"
          alt="CIDR Subnetting Diagram"
          caption="CIDR notation expresses network ranges as prefix length, enabling flexible subnet sizing"
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/cloud-network-hierarchy.svg"
          alt="Cloud Network Hierarchy"
          caption="VPC with public subnets (load balancers), private subnets (app servers), and isolated subnets (databases)"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          IP addressing architecture in cloud environments follows a hierarchical design that balances isolation, scalability, and operational simplicity.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Cloud Network Hierarchy</h3>
          <ol className="space-y-3">
            <li>
              <strong>VPC/VNet Allocation:</strong> Organizations allocate large CIDR blocks (/16 or /20) to virtual private clouds, providing 65,536 to 1,048,576 addresses for growth.
            </li>
            <li>
              <strong>Subnet Division:</strong> VPCs are subdivided into /24 or /26 subnets (256 or 64 addresses each) for different tiers: public subnets for load balancers, private subnets for application servers, isolated subnets for databases.
            </li>
            <li>
              <strong>Route Table Configuration:</strong> Each subnet is associated with a route table defining traffic flow. Public subnets route 0.0.0.0/0 to an internet gateway; private subnets route through NAT gateways.
            </li>
            <li>
              <strong>Security Boundaries:</strong> Security groups (stateful) and network ACLs (stateless) enforce traffic rules at instance and subnet levels respectively.
            </li>
            <li>
              <strong>Peering and Transit:</strong> VPC peering or transit gateways connect environments, but only if CIDR blocks do not overlap.
            </li>
          </ol>
        </div>

        <p>
          <strong>Routing and Prefix Matching:</strong> Routers choose routes using longest-prefix match. More specific routes override broader ones, which is why /24 beats /16 even if both match. Understanding this helps debug connectivity issues where traffic takes unexpected paths.
        </p>

        <p>
          <strong>Anycast and Global Routing:</strong> Anycast advertises the same IP prefix from multiple geographic locations. Traffic is routed to the nearest endpoint based on BGP policies. This is widely used by CDNs (Cloudflare, Akamai) and DNS providers (Route 53, Cloud DNS) to reduce latency and improve availability.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">IPv4</th>
              <th className="p-3 text-left">IPv6</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Address Space</strong>
              </td>
              <td className="p-3">
                32-bit (~4.3 billion addresses)
                <br />
                Exhausted in 2011
              </td>
              <td className="p-3">
                128-bit (~3.4 × 10³⁸ addresses)
                <br />
                Essentially unlimited
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Notation</strong>
              </td>
              <td className="p-3">
                Dotted-decimal (192.168.1.1)
                <br />
                Familiar, easy to read
              </td>
              <td className="p-3">
                Hexadecimal with colons
                <br />
                2001:db8:85a3::8a2e:370:7334
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>NAT Requirement</strong>
              </td>
              <td className="p-3">
                Required for most deployments
                <br />
                Complicates tracing and debugging
              </td>
              <td className="p-3">
                Optional (end-to-end addressing)
                <br />
                Simplifies network design
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Configuration</strong>
              </td>
              <td className="p-3">
                Manual or DHCP
                <br />
                Well-understood tooling
              </td>
              <td className="p-3">
                SLAAC or DHCPv6
                <br />
                Autoconfiguration capabilities
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Security</strong>
              </td>
              <td className="p-3">
                IPsec optional
                <br />
                NAT provides incidental security
              </td>
              <td className="p-3">
                IPsec mandatory in spec
                <br />
                Built-in security features
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Adoption</strong>
              </td>
              <td className="p-3">
                Universal (100%)
                <br />
                Legacy system support
              </td>
              <td className="p-3">
                Growing (~40% globally)
                <br />
                Required for mobile networks
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">IPv4 vs IPv6: When to Use Each</h3>
          <p>
            <strong>Use IPv4 when:</strong> you need universal compatibility, your client base has limited IPv6 adoption, or you're integrating with legacy systems that don't support IPv6.
          </p>
          <p className="mt-3">
            <strong>Use IPv6 when:</strong> building new services (future-proofing), serving mobile users (IPv6 required for 5G), operating in regions with high IPv6 adoption (India ~70%, Germany ~60%), or when you need end-to-end connectivity without NAT.
          </p>
          <p className="mt-3">
            <strong>Best practice:</strong> Implement dual-stack (both IPv4 and IPv6) during transition, with IPv6 preferred for new connections. Monitor client IPv6 adoption and gradually shift traffic as adoption increases.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Production IP addressing requires careful planning and operational discipline to avoid costly readdressing later.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Reserve CIDR Space for Growth:</strong> Allocate /16 or /20 blocks for VPCs, even if you only need /24 initially. Readdressing a running system is painful and risky. Reserve larger blocks for dynamic workloads (auto-scaling app tiers) and smaller blocks for stable services (databases, internal tools).
          </li>
          <li>
            <strong>Ensure Non-Overlapping CIDR Blocks:</strong> Overlapping CIDRs prevent VPC peering and complicate multi-region architectures. Use IPAM (IP Address Management) tools to track allocations across environments and accounts. Document all CIDR assignments in a central registry.
          </li>
          <li>
            <strong>Plan IPv6 Adoption Early:</strong> Even if traffic is mostly IPv4 today, design systems with IPv6 compatibility in mind. Ensure firewalls, load balancers, and observability tools are IPv6-aware to avoid blind spots. Track client IPv6 adoption metrics to inform migration timing.
          </li>
          <li>
            <strong>Monitor NAT Gateway Saturation:</strong> NAT gateways have port limits (~55,000 ports per gateway). Large systems use multiple NAT gateways or egress proxies to avoid port exhaustion. Monitor NAT metrics (ports used, packets dropped) and set alerts for saturation thresholds.
          </li>
          <li>
            <strong>Document Routing Tables and Dependencies:</strong> Route tables determine which networks can communicate. Document routing policies, especially for peering and VPN connections. Validate route tables after changes to prevent asymmetric routing and connectivity issues.
          </li>
          <li>
            <strong>Use Private Endpoints for Internal Services:</strong> Prefer private IPs and VPC endpoints for internal service-to-service communication. This reduces exposure, eliminates NAT costs, and improves latency. Reserve public IPs for user-facing entry points only.
          </li>
          <li>
            <strong>Implement IP Address Management (IPAM):</strong> Use IPAM tools (AWS IPAM, Infoblox, NetBox) to automate CIDR allocation, track utilization, and prevent overlaps. IPAM is critical for multi-account, multi-region architectures.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          IP addressing mistakes often surface months or years after deployment, making them expensive to fix.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Overlapping CIDR Blocks During VPC Peering:</strong> The most common multi-region mistake. VPC-A uses 10.0.0.0/16, VPC-B also uses 10.0.0.0/16. Peering fails because routes conflict. Prevention: centralize CIDR allocation, use IPAM tools, document all assignments.
          </li>
          <li>
            <strong>Using Public IPs for Internal Traffic:</strong> Routing internal service-to-service traffic over public IPs increases latency, incurs data transfer costs, and exposes services to the internet. Use private subnets and VPC endpoints instead.
          </li>
          <li>
            <strong>Ignoring IPv6 Compatibility:</strong> Building new services without IPv6 support creates technical debt. Mobile networks increasingly require IPv6. Dual-stack implementation during initial development is cheaper than retrofitting later.
          </li>
          <li>
            <strong>Subnet IP Exhaustion:</strong> Allocating /28 subnets (16 addresses) for auto-scaling groups causes failures during scale-out events. Monitor subnet utilization and allocate appropriately sized subnets (/24 or /26 for dynamic workloads).
          </li>
          <li>
            <strong>NAT Gateway Single Point of Failure:</strong> Relying on a single NAT gateway for all outbound traffic creates a bottleneck and single point of failure. Deploy NAT gateways in multiple AZs and use route table failover for high availability.
          </li>
          <li>
            <strong>Incorrect Security Group Assumptions:</strong> Assuming security groups are stateless (they're stateful) or that network ACLs are stateful (they're stateless). This leads to misconfigured rules that block legitimate traffic.
          </li>
        </ul>
      </section>

      <section>
        <h2>Production Case Studies</h2>
        <p>
          Real-world IP addressing implementations demonstrate how theoretical patterns adapt to production constraints.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Netflix: Multi-Region VPC Design</h3>
          <p className="mb-3">
            Netflix operates across multiple AWS regions with non-overlapping CIDR blocks for each region. Their approach includes:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Regional CIDR Allocation:</strong> Each region receives a unique /16 block (e.g., us-east-1: 10.0.0.0/16, us-west-2: 10.1.0.0/16), preventing overlap during disaster recovery failover.
            </li>
            <li>
              <strong>Subnet Tiering:</strong> Public subnets for load balancers, private subnets for application servers, isolated subnets for databases. Each tier has appropriately sized subnets for expected scale.
            </li>
            <li>
              <strong>IPv6 Readiness:</strong> Dual-stack configuration for all new services, with IPv6 traffic gradually increasing as client adoption grows.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Cloudflare: Anycast IP Architecture</h3>
          <p className="mb-3">
            Cloudflare's global network uses anycast IP addressing to route traffic to the nearest data center:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Same IP, Multiple Locations:</strong> Cloudflare advertises the same IP prefixes from 200+ data centers worldwide. BGP routing directs traffic to the nearest location.
            </li>
            <li>
              <strong>IPv6 Leadership:</strong> Cloudflare was an early IPv6 adopter, now serving ~50% of traffic over IPv6. This reduces latency for mobile users and future-proofs the network.
            </li>
            <li>
              <strong>Magic Transit:</strong> Cloudflare's DDoS protection uses anycast to absorb attacks across the global network, protecting customer origin IPs.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Kubernetes: Container IP Addressing</h3>
          <p className="mb-3">
            Kubernetes introduces overlay networking for container IP addressing:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Pod CIDR Allocation:</strong> Each node receives a /24 pod CIDR block. Pods get IPs from this block, enabling direct pod-to-pod communication without NAT.
            </li>
            <li>
              <strong>Service CIDR:</strong> A separate CIDR block for Kubernetes Service IPs (ClusterIP), enabling service discovery within the cluster.
            </li>
            <li>
              <strong>CNI Plugins:</strong> Container Network Interface plugins (Calico, Cilium, Flannel) implement different IP addressing strategies, each with trade-offs for scale, performance, and network policy enforcement.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <p>
          Understanding IP addressing performance characteristics helps optimize network design.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">NAT Gateway Performance</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">Single NAT Gateway</th>
                <th className="p-2 text-left">Multiple NAT Gateways</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Max Connections</td>
                <td className="p-2">~55,000 ports</td>
                <td className="p-2">N × 55,000 ports</td>
              </tr>
              <tr>
                <td className="p-2">Throughput</td>
                <td className="p-2">Up to 10 Gbps</td>
                <td className="p-2">N × 10 Gbps</td>
              </tr>
              <tr>
                <td className="p-2">Latency Impact</td>
                <td className="p-2">+1-5ms</td>
                <td className="p-2">+1-5ms per gateway</td>
              </tr>
              <tr>
                <td className="p-2">Cost</td>
                <td className="p-2">~$32/month + data</td>
                <td className="p-2">N × $32/month + data</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">IPv6 vs IPv4 Latency</h3>
          <ul className="space-y-2">
            <li>
              <strong>Direct Comparison:</strong> IPv6 often has slightly lower latency (1-3ms) due to simpler routing tables and no NAT traversal.
            </li>
            <li>
              <strong>Mobile Networks:</strong> IPv6 can be significantly faster (10-50ms) on mobile networks where IPv4 requires carrier-grade NAT.
            </li>
            <li>
              <strong>Dual-Stack Overhead:</strong> Running both protocols adds minimal overhead (~1% CPU) but provides compatibility during transition.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <p>
          IP addressing decisions directly impact infrastructure costs.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Infrastructure Cost Components</h3>
          <ul className="space-y-2">
            <li>
              <strong>Public IP Addresses:</strong> AWS charges ~$3.60/month per unused Elastic IP. Unused public IPs accumulate costs if not properly managed.
            </li>
            <li>
              <strong>NAT Gateways:</strong> ~$32/month per gateway plus $0.045/GB for data processing. Large-scale egress through NAT can cost thousands monthly.
            </li>
            <li>
              <strong>Data Transfer:</strong> Cross-AZ traffic costs $0.01/GB. Cross-region costs $0.02-0.05/GB. IP addressing that minimizes cross-AZ traffic reduces costs.
            </li>
            <li>
              <strong>IPAM Tools:</strong> Commercial IPAM solutions (Infoblox, BlueCat) cost $10,000-100,000+ annually. Cloud-native IPAM (AWS IPAM) costs ~$0.10/CIDR/month.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Cost Optimization Strategies</h3>
          <ul className="space-y-2">
            <li>
              <strong>Use VPC Endpoints:</strong> AWS PrivateLink eliminates NAT costs for AWS service access, saving $0.045/GB.
            </li>
            <li>
              <strong>Right-Size NAT Gateways:</strong> Monitor port utilization and consolidate underutilized NAT gateways.
            </li>
            <li>
              <strong>Release Unused Elastic IPs:</strong> Automate detection and release of unattached Elastic IPs to avoid monthly charges.
            </li>
            <li>
              <strong>Optimize Subnet Sizing:</strong> Avoid over-provisioning subnets, which can lead to wasted IP space and higher IPAM costs.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <p>
          IP addressing intersects with security at multiple layers.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">IP-Based Access Controls</h3>
          <ul className="space-y-2">
            <li>
              <strong>Security Groups:</strong> Stateful firewalls at the instance level. Allow rules automatically permit return traffic.
            </li>
            <li>
              <strong>Network ACLs:</strong> Stateless firewalls at the subnet level. Require explicit rules for both inbound and outbound traffic.
            </li>
            <li>
              <strong>WAF IP Rules:</strong> Web Application Firewalls can allowlist or blocklist IP ranges at the edge.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Best Practices</h3>
          <ul className="space-y-2">
            <li>
              <strong>IP Allowlists Are Coarse:</strong> IPs can be shared (NAT), reassigned, or spoofed. Use IP allowlists as a coarse filter, but rely on authentication and authorization for true security.
            </li>
            <li>
              <strong>Log Source IPs:</strong> Log source IPs for auditing, rate limiting, and abuse detection. Ensure systems correctly parse proxy headers (X-Forwarded-For) to avoid spoofing.
            </li>
            <li>
              <strong>Private Endpoints:</strong> Use VPC endpoints and private links for internal services to avoid exposing them to the public internet.
            </li>
            <li>
              <strong>IPv6 Security:</strong> IPv6 introduces new attack vectors (Neighbor Discovery spoofing, extension header abuse). Ensure security tools are IPv6-aware.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Decision Framework: Subnet Sizing</h2>
        <p>
          Choose appropriate subnet sizes based on workload characteristics.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Subnet Sizing Guide</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">CIDR</th>
                <th className="p-2 text-left">Total IPs</th>
                <th className="p-2 text-left">Usable IPs</th>
                <th className="p-2 text-left">Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">/28</td>
                <td className="p-2">16</td>
                <td className="p-2">11</td>
                <td className="p-2">Static services, bastion hosts</td>
              </tr>
              <tr>
                <td className="p-2">/27</td>
                <td className="p-2">32</td>
                <td className="p-2">27</td>
                <td className="p-2">Small services, dev environments</td>
              </tr>
              <tr>
                <td className="p-2">/26</td>
                <td className="p-2">64</td>
                <td className="p-2">59</td>
                <td className="p-2">Medium services, limited scaling</td>
              </tr>
              <tr>
                <td className="p-2">/24</td>
                <td className="p-2">256</td>
                <td className="p-2">251</td>
                <td className="p-2">Auto-scaling app tiers</td>
              </tr>
              <tr>
                <td className="p-2">/23</td>
                <td className="p-2">512</td>
                <td className="p-2">507</td>
                <td className="p-2">Large auto-scaling groups</td>
              </tr>
              <tr>
                <td className="p-2">/22</td>
                <td className="p-2">1024</td>
                <td className="p-2">1019</td>
                <td className="p-2">Kubernetes node subnets</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do we need IPv6?</p>
            <p className="mt-2 text-sm">
              A: IPv4 addresses are exhausted (~4.3 billion total). IPv6 provides a vastly larger address space (3.4 × 10³⁸ addresses), better routing aggregation, eliminates NAT requirements, and includes built-in security features. Mobile networks and IoT devices increasingly require IPv6.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What does /24 mean in CIDR notation?</p>
            <p className="mt-2 text-sm">
              A: /24 indicates the first 24 bits are the network prefix, leaving 8 bits for host addresses. This provides 256 total addresses (2⁸), with 254 usable after reserving network address (all zeros) and broadcast address (all ones).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the common private IPv4 ranges?</p>
            <p className="mt-2 text-sm">
              A: RFC 1918 defines three private ranges: 10.0.0.0/8 (16.7 million addresses), 172.16.0.0/12 (1 million addresses), and 192.168.0.0/16 (65,536 addresses). These are not routable on the public internet and are used for internal networks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is subnetting used?</p>
            <p className="mt-2 text-sm">
              A: Subnetting improves routing efficiency by reducing broadcast domains, isolates workloads for security, enables efficient IP allocation based on workload size, and simplifies network management by creating logical boundaries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What problem does NAT solve?</p>
            <p className="mt-2 text-sm">
              A: NAT conserves public IPv4 addresses by allowing many private hosts to share a single public IP through port translation. It also provides incidental security by hiding internal network topology. However, NAT complicates tracing, can break protocols that embed IPs, and becomes a bottleneck at scale.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent overlapping CIDR blocks in multi-region architectures?</p>
            <p className="mt-2 text-sm">
              A: Use centralized IP Address Management (IPAM) to track all CIDR allocations across regions and accounts. Allocate unique /16 or /20 blocks per region (e.g., us-east-1: 10.0.0.0/16, us-west-2: 10.1.0.0/16). Document all assignments and validate CIDRs before VPC peering.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc791"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 791 - Internet Protocol (IPv4 Specification)
            </a>
          </li>
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc8200"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 8200 - Internet Protocol, Version 6 (IPv6) Specification
            </a>
          </li>
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc1918"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 1918 - Address Allocation for Private Internets
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/vpc/faqs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS VPC FAQs - CIDR Blocks and Subnets
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/vpc/docs/vpc"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Cloud VPC Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.apnic.net/manage-ip/using-ipv6/why-ipv6/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              APNIC - Why IPv6 is Necessary
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

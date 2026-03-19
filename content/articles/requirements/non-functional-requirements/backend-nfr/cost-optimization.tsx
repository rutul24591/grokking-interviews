"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-cost-optimization-extensive",
  title: "Cost Optimization",
  description: "Comprehensive guide to infrastructure cost optimization, covering cloud cost management, resource right-sizing, reserved capacity, and FinOps practices for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "cost-optimization",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "cost-optimization", "cloud", "finops", "infrastructure", "efficiency"],
  relatedTopics: ["capacity-planning", "scalability-strategy", "auto-scaling", "data-retention-archival"],
};

export default function CostOptimizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Cost Optimization</strong> is the practice of minimizing infrastructure costs while
          maintaining required performance, availability, and reliability. For staff/principal engineers,
          cost is a design constraint alongside technical requirements.
        </p>
        <p>
          Cloud costs can spiral without discipline. A well-architected system balances cost against:
        </p>
        <ul>
          <li>Performance (latency, throughput).</li>
          <li>Availability (uptime SLAs).</li>
          <li>Reliability (error rates, recovery time).</li>
          <li>Security (compliance, protection).</li>
          <li>Operational efficiency (automation, toil reduction).</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Cost is an Architecture Decision</h3>
          <p>
            Every architectural choice has cost implications. Multi-region increases cost but improves
            availability. Caching reduces database cost but adds complexity. Make cost explicit in design
            discussions.
          </p>
        </div>
      </section>

      <section>
        <h2>Cloud Cost Categories</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/cost-optimization.svg"
          alt="Cloud Cost Optimization"
          caption="Cost Optimization — showing typical cloud cost breakdown, optimization strategies (Right-Sizing, Reserved, Spot, Auto-Scaling), pricing models comparison, and cost allocation"
        />
        <p>
          Major cost components in cloud infrastructure:
        </p>
      </section>

      <section>
        <h2>Cost Optimization Deep Dive</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/cost-optimization-deep-dive.svg"
          alt="Cost Optimization Deep Dive"
          caption="Cost Optimization Deep Dive — showing cost allocation and tagging, right-sizing resources, reserved instances vs on-demand pricing comparison"
        />
        <p>
          Advanced cost optimization strategies:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compute</h3>
        <ul>
          <li>VMs/instances (EC2, GCE, Azure VMs).</li>
          <li>Containers (EKS, GKE, AKS).</li>
          <li>Serverless (Lambda, Cloud Functions).</li>
          <li><strong>Optimization:</strong> Right-sizing, reserved instances, spot instances.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Storage</h3>
        <ul>
          <li>Block storage (EBS, persistent disks).</li>
          <li>Object storage (S3, GCS, Blob).</li>
          <li>Database storage.</li>
          <li><strong>Optimization:</strong> Lifecycle policies, tiered storage, compression.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Network</h3>
        <ul>
          <li>Data transfer (egress fees).</li>
          <li>Load balancers.</li>
          <li>CDN.</li>
          <li><strong>Optimization:</strong> Reduce cross-region traffic, use CDN, compress data.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Database</h3>
        <ul>
          <li>Managed databases (RDS, Cloud SQL).</li>
          <li>NoSQL (DynamoDB, CosmosDB).</li>
          <li><strong>Optimization:</strong> Right-sizing, read replicas, caching, query optimization.</li>
        </ul>
      </section>

      <section>
        <h2>Cost Optimization Strategies</h2>
        <p>
          Practical approaches to reduce costs:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Right-Sizing</h3>
        <p>
          Match resources to actual usage:
        </p>
        <ul>
          <li>Analyze CPU, memory, disk utilization.</li>
          <li>Downsize over-provisioned instances.</li>
          <li>Use auto-scaling to match demand.</li>
          <li>Review quarterly (workloads change).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Reserved Capacity</h3>
        <p>
          Commit to 1-3 year terms for discounts:
        </p>
        <ul>
          <li>Reserved Instances (AWS): Up to 72% discount.</li>
          <li>Committed Use Discounts (GCP): Up to 57% discount.</li>
          <li>Savings Plans (AWS): Flexible commitment.</li>
          <li><strong>Caveat:</strong> Only reserve stable, predictable workloads.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Spot/Preemptible Instances</h3>
        <p>
          Use spare capacity at 60-90% discount:
        </p>
        <ul>
          <li>Can be terminated with short notice.</li>
          <li>Ideal for batch processing, stateless workloads.</li>
          <li>Use with checkpointing and graceful shutdown.</li>
          <li>Mix with on-demand for reliability.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Caching</h3>
        <p>
          Reduce database and compute costs:
        </p>
        <ul>
          <li>Cache frequently accessed data.</li>
          <li>Reduce database read operations.</li>
          <li>CDN for static assets.</li>
          <li>Edge caching for global distribution.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Optimization</h3>
        <p>
          Reduce storage and transfer costs:
        </p>
        <ul>
          <li>Compression (gzip, Brotli).</li>
          <li>Data lifecycle policies (archive/delete old data).</li>
          <li>Deduplication.</li>
          <li>Reduce cross-region data transfer.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Your cloud bill doubled in 3 months. How do you investigate and reduce costs?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Analysis (Week 1):</strong> (1) Identify top 10 cost drivers. (2) Find unused resources. (3) Check for over-provisioned instances.</li>
                <li><strong>Quick wins (Week 2-3):</strong> (1) Delete unused resources (orphaned volumes, old snapshots). (2) Right-size over-provisioned instances. (3) Enable auto-scaling. Potential savings: 20-30%.</li>
                <li><strong>Reserved capacity (Month 2):</strong> Purchase reserved instances for stable workloads (databases, always-on services). Savings: 40-60%.</li>
                <li><strong>Spot instances (Month 3):</strong> Move fault-tolerant workloads (batch jobs, CI/CD) to spot. Savings: 70-90%.</li>
                <li><strong>Ongoing:</strong> Monthly cost reviews. Cost alerts at 80% budget. Showback to teams.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare on-demand, reserved, and spot instances. When would you use each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>On-Demand:</strong> Pay by hour/second. ✓ No commitment, flexible. ✗ Most expensive. Best for: Unpredictable workloads, short-term projects, testing.</li>
                <li><strong>Reserved (1-3 year):</strong> Commit to term. ✓ 40-60% discount. ✗ Upfront payment, locked in. Best for: Stable workloads (databases, always-on services).</li>
                <li><strong>Spot:</strong> Bid on spare capacity. ✓ 70-90% discount. ✗ Can be terminated anytime. Best for: Fault-tolerant workloads (batch jobs, CI/CD, stateless workers).</li>
                <li><strong>Mixed strategy:</strong> Baseline = Reserved. Spikes = On-Demand. Batch = Spot. Typical split: 50% Reserved, 30% On-Demand, 20% Spot.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. How do you balance cost optimization against reliability and performance?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Tiered approach:</strong> (1) Critical services: No cost cutting on reliability. Multi-AZ, auto-scaling, monitoring. (2) Non-critical: Optimize for cost.</li>
                <li><strong>SLO-driven:</strong> Define SLOs first. Optimize cost within SLO constraints. Don&apos;t sacrifice SLO for cost savings.</li>
                <li><strong>Gradual optimization:</strong> Reduce capacity gradually. Monitor error rates, latency. Stop if SLO impacted.</li>
                <li><strong>Cost of downtime:</strong> Calculate hourly downtime cost. If 1hr = $100K, don&apos;t risk $10K savings. Reliability ROI is positive.</li>
                <li><strong>Best practice:</strong> Optimize non-production first (dev/staging). Use learnings for production optimization.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Design a cost-effective architecture for a batch processing system that runs nightly.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Compute:</strong> Spot instances (70-90% savings). Use spot fleet with multiple instance types. Handle interruptions gracefully.</li>
                <li><strong>Storage:</strong> S3 for input/output data. Use S3 Intelligent Tiering for automatic cost optimization.</li>
                <li><strong>Orchestration:</strong> AWS Batch or Kubernetes with cluster autoscaler. Scale to zero when idle.</li>
                <li><strong>Data transfer:</strong> Process data in same region as storage. Avoid cross-region transfer costs.</li>
                <li><strong>Optimization:</strong> (1) Parallelize processing (reduce runtime). (2) Use efficient data formats (Parquet). (3) Compress data.</li>
                <li><strong>Example:</strong> 100 nodes × 4 hours on spot ($0.10/hr) = $40/night vs on-demand ($0.50/hr) = $200/night. 5× savings.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. What metrics do you track for cost management? How do you allocate costs to teams?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Key metrics:</strong> (1) Total cost per day/week/month. (2) Cost per service/product. (3) Cost per user/transaction. (4) Cost trends (week-over-week, month-over-month).</li>
                <li><strong>Alerts:</strong> (1) Daily cost exceeds threshold. (2) Week-over-week increase &gt;10%. (3) Anomaly detection (unusual spikes).</li>
                <li><strong>Allocation:</strong> Tag all resources (team, product, environment). Use tags for cost allocation. Showback reports to teams monthly.</li>
                <li><strong>Chargeback:</strong> Charge teams for their actual usage. Creates cost awareness. Teams optimize their own costs.</li>
                <li><strong>Tools:</strong> AWS Cost Explorer, GCP Cost Management, Kubecost for Kubernetes.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you optimize database costs in a high-traffic application?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Caching:</strong> Add Redis/Memcached for frequently accessed data. Target 80%+ cache hit ratio. Reduces database load 5-10×.</li>
                <li><strong>Read replicas:</strong> Offload read traffic to replicas. Use smaller instance types for replicas. Cheaper than scaling primary.</li>
                <li><strong>Query optimization:</strong> Identify slow queries. Add indexes. Reduce N+1 queries. Often eliminates need for scaling.</li>
                <li><strong>Data lifecycle:</strong> Archive old data to cold storage. Keep hot data small. Partition tables by date.</li>
                <li><strong>Instance rightsizing:</strong> Monitor actual CPU/memory usage. Downsize over-provisioned instances.</li>
                <li><strong>Reserved instances:</strong> Purchase reserved capacity for databases (always-on). 40-60% savings.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Cost Optimization Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Cost visibility (dashboards, alerts, per-service breakdown)</li>
          <li>✓ Resource right-sizing completed</li>
          <li>✓ Reserved capacity for stable workloads</li>
          <li>✓ Spot instances for fault-tolerant workloads</li>
          <li>✓ Auto-scaling configured</li>
          <li>✓ Caching implemented (application, CDN, database)</li>
          <li>✓ Data lifecycle policies (archival, deletion)</li>
          <li>✓ Cross-region transfer minimized</li>
          <li>✓ Regular cost reviews (monthly/quarterly)</li>
          <li>✓ Cost allocated to teams/products (showback/chargeback)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

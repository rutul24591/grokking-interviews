"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-advanced-multi-tenant-isolation-extensive",
  title: "Multi-Tenant Isolation",
  description: "Comprehensive guide to multi-tenant architecture, covering tenant isolation strategies, security boundaries, resource allocation, and data segregation for staff/principal engineer interviews.",
  category: "advanced-topics",
  subcategory: "nfr",
  slug: "multi-tenant-isolation",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "multi-tenancy", "isolation", "security", "saas", "architecture"],
  relatedTopics: ["scalability-strategy", "database-selection", "authorization-model"],
};

export default function MultiTenantIsolationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Multi-Tenancy</strong> is a software architecture where a single instance of an application
          serves multiple customers (tenants) while maintaining data isolation and security boundaries.
          Each tenant&apos;s data is invisible and inaccessible to other tenants, even though they share
          the same infrastructure.
        </p>
        <p>
          Multi-tenancy is fundamental to SaaS business models. It enables economies of scale (one codebase,
          one deployment) while providing each customer with a personalized, secure experience. The key
          challenge is balancing isolation (security, performance) with efficiency (resource utilization,
          operational simplicity).
        </p>
        <p>
          <strong>Tenant isolation levels:</strong>
        </p>
        <ul>
          <li>
            <strong>Data Isolation:</strong> Tenant data is segregated and inaccessible to other tenants.
          </li>
          <li>
            <strong>Performance Isolation:</strong> One tenant&apos;s load doesn&apos;t impact others.
          </li>
          <li>
            <strong>Security Isolation:</strong> Authentication, authorization, and access controls are
            tenant-scoped.
          </li>
          <li>
            <strong>Customization:</strong> Tenants can configure branding, workflows, and features.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Isolation Is a Spectrum</h3>
          <p>
            Multi-tenancy is not binary. It ranges from shared everything (maximum efficiency, minimum
            isolation) to dedicated infrastructure per tenant (maximum isolation, minimum efficiency).
            The right choice depends on tenant size, compliance requirements, and business model.
          </p>
          <p className="mt-3">
            <strong>Enterprise tenants</strong> often demand stronger isolation (dedicated databases or
            infrastructure) and pay premium prices. <strong>SMB tenants</strong> accept shared infrastructure
            for lower costs.
          </p>
        </div>

        <p>
          This article covers tenant isolation strategies, database patterns, security considerations,
          resource allocation, and operational practices for building multi-tenant systems.
        </p>
      </section>

      <section>
        <h2>Tenant Isolation Strategies</h2>
        <p>
          Choose isolation level based on requirements and cost constraints.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Database Isolation Patterns</h3>
        <p>
          Three primary patterns for data isolation:
        </p>
        <ul>
          <li>
            <strong>Database-per-Tenant:</strong> Each tenant has dedicated database. Maximum isolation,
            easiest compliance, highest cost.
          </li>
          <li>
            <strong>Schema-per-Tenant:</strong> Shared database, separate schema per tenant. Good isolation,
            moderate cost.
          </li>
          <li>
            <strong>Shared Table (Discriminator):</strong> All tenants in same tables with tenant_id column.
            Minimum cost, requires careful access control.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compute Isolation</h3>
        <p>
          How tenants share application servers:
        </p>
        <ul>
          <li>
            <strong>Shared Compute:</strong> All tenants served by same application instances. Most efficient,
            risk of noisy neighbor.
          </li>
          <li>
            <strong>Tenant Grouping:</strong> Group tenants by size/behavior. Enterprise tenants on dedicated
            instances.
          </li>
          <li>
            <strong>Dedicated Compute:</strong> Premium tenants get dedicated application instances. Highest
            isolation, highest cost.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/multi-tenant-isolation-patterns.svg"
          alt="Multi-Tenant Isolation Patterns"
          caption="Multi-Tenant Isolation — comparing database-per-tenant, schema-per-tenant, and shared table patterns with trade-offs"
        />
      </section>

      <section>
        <h2>Database Implementation Patterns</h2>
        <p>
          Detailed implementation of each database pattern.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Database-per-Tenant</h3>
        <p>
          <strong>Architecture:</strong> Each tenant has completely separate database. Connection routing
          based on tenant identifier.
        </p>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>Maximum data isolation — physical separation.</li>
          <li>Easiest compliance (GDPR, HIPAA, SOC2).</li>
          <li>Tenant-specific backups and restores.</li>
          <li>Can scale databases independently.</li>
          <li>Blast radius limited to single tenant.</li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>Highest cost — database overhead per tenant.</li>
          <li>Complex operations — migrations across many databases.</li>
          <li>Connection pool management complexity.</li>
          <li>Harder to aggregate data across tenants.</li>
        </ul>
        <p>
          <strong>Best for:</strong> Enterprise tenants, regulated industries, tenants requiring data
          residency.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Schema-per-Tenant</h3>
        <p>
          <strong>Architecture:</strong> Single database instance, separate schema for each tenant.
        </p>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>Good isolation — schemas are logically separated.</li>
          <li>Shared database resources — better utilization.</li>
          <li>Simpler backup than database-per-tenant.</li>
          <li>Easier cross-tenant analytics than database-per-tenant.</li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>Schema management complexity at scale.</li>
          <li>Database becomes single point of failure.</li>
          <li>Limited number of schemas per database.</li>
          <li>Some compliance requirements may not accept schema isolation.</li>
        </ul>
        <p>
          <strong>Best for:</strong> Mid-market tenants, moderate compliance requirements.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Shared Table (Row-Level Isolation)</h3>
        <p>
          <strong>Architecture:</strong> All tenants share same tables. Every row has tenant_id column.
          Application filters by tenant_id.
        </p>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>Lowest cost — maximum resource sharing.</li>
          <li>Simplest operations — single schema to manage.</li>
          <li>Easy cross-tenant analytics.</li>
          <li>Efficient for large numbers of small tenants.</li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>Requires strict access control — bugs can expose cross-tenant data.</li>
          <li>Noisy neighbor problem — one tenant can impact others.</li>
          <li>Complex compliance — data physically intermingled.</li>
          <li>Tenant-specific schema changes impossible.</li>
        </ul>
        <p>
          <strong>Best for:</strong> SMB/free tier tenants, high-volume low-cost scenarios.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/database-isolation-comparison.svg"
          alt="Database Isolation Comparison"
          caption="Database Isolation — showing data layout, query patterns, and isolation guarantees for each approach"
        />
      </section>

      <section>
        <h2>Tenant Identification & Routing</h2>
        <p>
          Every request must be associated with a tenant for proper isolation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tenant Identification Methods</h3>
        <p>
          How to determine which tenant a request belongs to:
        </p>
        <ul>
          <li>
            <strong>Subdomain:</strong> tenant.app.com. Clean separation, requires DNS/wildcard certificates.
          </li>
          <li>
            <strong>Path Prefix:</strong> app.com/tenant/. Simple, but URLs expose tenant information.
          </li>
          <li>
            <strong>Header:</strong> X-Tenant-ID header. Flexible, requires client cooperation.
          </li>
          <li>
            <strong>JWT Claim:</strong> Tenant embedded in authentication token. Secure, works with SSO.
          </li>
          <li>
            <strong>Database Lookup:</strong> Derive from user email/domain. Adds latency, requires cache.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Connection Routing</h3>
        <p>
          Route database connections based on tenant:
        </p>
        <ul>
          <li>
            <strong>Connection Pool per Tenant:</strong> Separate pool for each tenant database. Good
            isolation, connection overhead.
          </li>
          <li>
            <strong>Dynamic Connection:</strong> Look up connection string at request time. Flexible, adds
            latency.
          </li>
          <li>
            <strong>Middleware Interception:</strong> Framework middleware injects tenant_id into all queries.
            Transparent to application code.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tenant Context Propagation</h3>
        <p>
          Ensure tenant context flows through the system:
        </p>
        <ul>
          <li>
            <strong>Request Context:</strong> Store tenant in request context/thread-local storage.
          </li>
          <li>
            <strong>Logging:</strong> Include tenant_id in all log entries for debugging.
          </li>
          <li>
            <strong>Tracing:</strong> Propagate tenant context in distributed traces.
          </li>
          <li>
            <strong>Async Operations:</strong> Pass tenant context to background jobs and message handlers.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <p>
          Multi-tenancy introduces unique security challenges.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Access Control</h3>
        <p>
          Prevent cross-tenant data access:
        </p>
        <ul>
          <li>
            <strong>Row-Level Security:</strong> Database enforces tenant filtering (PostgreSQL RLS,
            SQL Server Security Policies).
          </li>
          <li>
            <strong>Query Scoping:</strong> All queries automatically scoped to tenant_id. Use ORM hooks
            or repository patterns.
          </li>
          <li>
            <strong>Code Review:</strong> Extra scrutiny for queries that might bypass tenant scoping.
          </li>
          <li>
            <strong>Testing:</strong> Explicit tests for cross-tenant access attempts.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Noisy Neighbor Prevention</h3>
        <p>
          Prevent one tenant from impacting others:
        </p>
        <ul>
          <li>
            <strong>Rate Limiting:</strong> Per-tenant API rate limits.
          </li>
          <li>
            <strong>Resource Quotas:</strong> Limit CPU, memory, database connections per tenant.
          </li>
          <li>
            <strong>Query Limits:</strong> Limit query complexity, result size, execution time.
          </li>
          <li>
            <strong>Priority Queues:</strong> Premium tenants get priority in job queues.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Residency</h3>
        <p>
          Comply with data sovereignty requirements:
        </p>
        <ul>
          <li>
            <strong>Regional Deployment:</strong> Deploy separate instances per region (US, EU, APAC).
          </li>
          <li>
            <strong>Tenant Assignment:</strong> Assign tenants to regions based on location/requirements.
          </li>
          <li>
            <strong>Data Transfer:</strong> Restrict cross-border data transfers.
          </li>
          <li>
            <strong>Certification:</strong> Regional compliance certifications (GDPR, CCPA).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/multi-tenant-security.svg"
          alt="Multi-Tenant Security Architecture"
          caption="Multi-Tenant Security — showing tenant isolation layers, access control, rate limiting, and data residency"
        />
      </section>

      <section>
        <h2>Operational Considerations</h2>
        <p>
          Operating multi-tenant systems requires specialized practices.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tenant Onboarding</h3>
        <p>
          Automate tenant provisioning:
        </p>
        <ul>
          <li>
            <strong>Self-Service:</strong> Automated signup with instant provisioning.
          </li>
          <li>
            <strong>Database Creation:</strong> Automated database/schema creation for new tenants.
          </li>
          <li>
            <strong>Seed Data:</strong> Populate default configuration, users, settings.
          </li>
          <li>
            <strong>DNS Setup:</strong> Automated subdomain/certificate provisioning.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Schema Migrations</h3>
        <p>
          Deploy schema changes across tenants:
        </p>
        <ul>
          <li>
            <strong>Shared Schema:</strong> Single migration run. Simplest case.
          </li>
          <li>
            <strong>Database-per-Tenant:</strong> Run migration across all tenant databases. Use parallel
            execution, canary first.
          </li>
          <li>
            <strong>Rolling Migration:</strong> Migrate tenants in batches. Monitor for issues.
          </li>
          <li>
            <strong>Backward Compatibility:</strong> Support old and new schema during migration window.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tenant Offboarding</h3>
        <p>
          Handle tenant deletion properly:
        </p>
        <ul>
          <li>
            <strong>Data Retention:</strong> Comply with contractual/legal retention requirements.
          </li>
          <li>
            <strong>Soft Delete:</strong> Mark tenant as deleted, retain data for period.
          </li>
          <li>
            <strong>Hard Delete:</strong> Permanently delete all tenant data after retention period.
          </li>
          <li>
            <strong>Export:</strong> Provide data export before deletion (GDPR right to portability).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring & Observability</h3>
        <p>
          Monitor per-tenant metrics:
        </p>
        <ul>
          <li>
            <strong>Usage Metrics:</strong> API calls, storage, compute per tenant.
          </li>
          <li>
            <strong>Performance:</strong> Latency, error rates per tenant.
          </li>
          <li>
            <strong>Health:</strong> Tenant-specific health checks.
          </li>
          <li>
            <strong>Alerting:</strong> Alert on tenant-specific anomalies.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the trade-offs between database-per-tenant vs shared table?</p>
            <p className="mt-2 text-sm">
              A: Database-per-tenant: Maximum isolation, easiest compliance, tenant-specific scaling, but
              highest cost and operational complexity. Shared table: Lowest cost, simplest operations,
              efficient resource utilization, but requires strict access control, noisy neighbor risk,
              harder compliance. Choose based on tenant size, compliance needs, and business model.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent cross-tenant data access?</p>
            <p className="mt-2 text-sm">
              A: Multiple layers: (1) Row-level security at database, (2) ORM/repository automatically
              scopes queries to tenant_id, (3) Code review for tenant scoping, (4) Tests for cross-tenant
              access attempts, (5) Audit logs for data access. Defense in depth — never rely on single layer.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle noisy neighbors in multi-tenant systems?</p>
            <p className="mt-2 text-sm">
              A: Per-tenant rate limiting, resource quotas (CPU, memory, connections), query complexity
              limits, priority queues for premium tenants, and tenant grouping (put heavy tenants on
              dedicated infrastructure). Monitor per-tenant metrics to identify problems early.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you deploy schema changes in database-per-tenant?</p>
            <p className="mt-2 text-sm">
              A: Run migrations in batches (canary first), use parallel execution for speed, support
              backward compatibility during migration window, monitor each batch for issues, have rollback
              plan. For large tenant counts, migration may take hours — plan maintenance windows or use
              online migration techniques.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle data residency requirements?</p>
            <p className="mt-2 text-sm">
              A: Deploy regional instances (US, EU, APAC), assign tenants to regions based on location/
              requirements, restrict cross-border data transfers, obtain regional compliance certifications
              (GDPR for EU), store tenant-region mapping for routing. Some tenants may require dedicated
              regional deployment.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you identify which tenant a request belongs to?</p>
            <p className="mt-2 text-sm">
              A: Common methods: subdomain (tenant.app.com), path prefix (app.com/tenant/), header
              (X-Tenant-ID), JWT claim (tenant in auth token). Subdomain provides cleanest separation.
              JWT claim works best with SSO. Always validate tenant ID against authenticated user&apos;s
              tenant membership.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/welcome.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS SaaS Lens — Well-Architected Framework
            </a>
          </li>
          <li>
            <a href="https://www.microsoft.com/en-us/industry/blog/2020/02/12/multi-tenancy-in-microsoft-365/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Microsoft — Multi-Tenancy in Microsoft 365
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/articles/multi-tenancy.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler — Multi-Tenancy Patterns
            </a>
          </li>
          <li>
            <a href="https://saasmagazine.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SaaS Magazine
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

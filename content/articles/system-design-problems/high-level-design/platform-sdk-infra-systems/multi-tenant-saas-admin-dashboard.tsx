"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-multi-tenant-saas-admin-dashboard",
  title: "Design a Multi-Tenant SaaS Admin Dashboard",
  description:
    "Architecture for a multi-tenant admin dashboard: tenant isolation, RBAC, bulk operations, audit logging, impersonation, and cross-tenant analytics at scale.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "multi-tenant-saas-admin-dashboard",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-10",
  tags: ["hld", "multi-tenant", "saas", "admin", "rbac", "audit-log"],
  relatedTopics: ["feature-flag-management-system-ui", "frontend-observability-dashboard-rum-like-datadog"],
};

export default function MultiTenantSaasAdminDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">A multi-tenant SaaS admin dashboard serves two distinct audiences with fundamentally different needs: platform operators (the SaaS company's own staff—support, engineering, sales) who need cross-tenant visibility and powerful management tools, and tenant administrators (customers who administer their own organization's account) who need scoped management tools for their own tenant only. The hardest engineering challenge is tenant isolation: a tenant administrator must never see or affect another tenant's data, while a platform operator needs to reach across tenant boundaries. Both user types interact with the same dashboard surface, requiring the authorization layer to be airtight.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The second challenge is scale: a SaaS platform with 10,000+ tenants generates cross-tenant analytics that cannot be computed per-request. A query like "show me all tenants on the Pro plan who had zero active users this month" requires scanning data across all tenants—a query that cannot be satisfied from a single tenant's database shard. The admin dashboard must be backed by a cross-tenant analytics store (a data warehouse or aggregation service) that is separate from the transactional per-tenant databases.</HighlightBlock>
        <p><strong>Explicit assumptions:</strong> The SaaS platform uses a shared database multi-tenancy model (all tenants in one database, with a tenantId column on every table) with row-level security enforcement. The admin dashboard has two user types: platform operators (full cross-tenant access, internal only) and tenant admins (scoped to their own tenant). Tenant admins can manage their organization's members, billing, settings, and usage. Platform operators can additionally manage tenants themselves (create, suspend, migrate), view cross-tenant metrics, and impersonate users (with audit logging).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Tenant management:</strong> Platform operators can view, create, suspend, and delete tenants. They can view cross-tenant metrics (active users, storage usage, API call volume) aggregated by plan, region, or cohort.</li>
          <li><strong>User management:</strong> Tenant admins manage their organization's members: invite, remove, change roles. Platform operators can manage members across all tenants.</li>
          <li><strong>Bulk operations:</strong> Platform operators can apply actions to groups of tenants: send an email to all tenants on a deprecated plan, apply a configuration change to all tenants in a region.</li>
          <li><strong>Audit log:</strong> All administrative actions are logged with the actor (who), the action (what), the target (which tenant/user/resource), and the timestamp. Audit logs are immutable and retained for at least 2 years.</li>
          <li><strong>Impersonation:</strong> Platform operators can impersonate any user (acting as that user in the platform) for debugging and support. Impersonation sessions are fully audit-logged and visible to the impersonated user (optional, configurable per tenant).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Tenant isolation:</strong> No API or UI path allows a tenant admin to access another tenant's data. Isolation is enforced at the API layer (not just the UI layer).</li>
          <li><strong>Cross-tenant query performance:</strong> Cross-tenant aggregate queries (e.g., tenant list with usage metrics) return within 3 seconds for up to 10,000 tenants.</li>
          <li><strong>Audit log integrity:</strong> Audit log entries are append-only and tamper-evident. No administrative action can be performed without generating an audit log entry.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The admin dashboard is a separate application from the main product (different hostname, different authentication context) sharing the same backend API. The API layer has two authorization contexts: the tenant context (enforces tenantId scoping for all requests from tenant admins) and the operator context (cross-tenant access for platform operators, gated by internal SSO). Cross-tenant queries are served by a separate Analytics Service backed by a data warehouse (BigQuery, Snowflake, or ClickHouse) that aggregates data from all tenant shards. Mutations (tenant management, user management) go through the Tenant Management Service backed by the primary database.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/multi-tenant-saas-admin-dashboard-architecture.svg"
          alt="Multi-tenant admin dashboard architecture showing two user types (platform operator via internal SSO, tenant admin via tenant SSO), authorization middleware (operator context: cross-tenant access; tenant context: tenantId scoping + row-level security), Tenant Management Service (CRUD, suspend, migrate), Analytics Service (cross-tenant ClickHouse queries, pre-aggregated metrics), Audit Log Service (append-only, immutable, Kafka-backed), and Impersonation Service (signed session tokens, audit-logged start/end)."
          caption="Admin dashboard: dual authorization contexts (operator vs tenant), Analytics Service for cross-tenant queries, append-only audit log via Kafka, impersonation with signed tokens"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Tenant Isolation and Authorization</h3>
        <HighlightBlock as="p" tier="important">Tenant isolation is enforced at the API layer, not the UI layer. Every API endpoint that returns tenant-scoped data requires a tenantId claim in the authenticated JWT. The authorization middleware validates that the requesting user's tenantId matches the tenantId of the requested resource. This validation uses PostgreSQL row-level security (RLS): the middleware sets a session variable (SET app.current_tenant_id = ?) at the start of every database connection, and RLS policies on every table enforce that rows are only returned where tenantId = current_setting('app.current_tenant_id'). This database-level enforcement means that even a bug in the application code that forgets to filter by tenantId cannot leak cross-tenant data—the database enforces the boundary.</HighlightBlock>
        <p>Platform operators bypass tenant RLS by using a separate connection pool (the operator pool) that connects with a superuser role that is exempt from RLS policies. This connection pool is only available to API endpoints that require operator authorization (verified by the internal SSO provider and an operator: true claim in the JWT). The operator pool is strictly separated from the tenant pool; no tenant-authenticated request ever touches the operator pool. This separation is enforced by the API gateway middleware before any business logic runs.</p>
        <HighlightBlock as="p" tier="important">RBAC within tenants: tenant administrators can have sub-roles within their organization (owner, admin, member, viewer). The roles determine which management actions are available: only owners can delete the organization or transfer billing; admins can invite and remove members; members have read-only management access. The RBAC is enforced by a permissions middleware layer that checks the user's role within the tenant against the required permission for each action. Permissions are defined as a flat list of permission strings (e.g., members:invite, billing:view) rather than a role hierarchy, which makes permission checks explicit and auditable.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cross-Tenant Analytics</h3>
        <HighlightBlock as="p" tier="important">Cross-tenant queries (tenant list with usage metrics, cohort analysis, plan distribution) cannot be served from the transactional database without full-table scans that would degrade production performance. These queries are served by a ClickHouse analytics database that receives data from the primary database via a CDC (Change Data Capture) pipeline (Debezium → Kafka → ClickHouse). ClickHouse's columnar storage and vectorized query execution make cross-tenant aggregations over millions of rows respond in under 3 seconds.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Pre-aggregated metrics: for the most common admin queries (active users per tenant in the last 30 days, storage usage per tenant, API calls per tenant per hour), the Analytics Service pre-computes and caches aggregates on a 1-hour schedule. Pre-aggregated results are stored in Redis keyed by the query type and time range. The admin dashboard UI reads from Redis for these common queries (sub-100ms response), falling through to ClickHouse for custom date ranges or filters that are not pre-aggregated. This two-tier approach (Redis for common queries, ClickHouse for custom) satisfies the 3-second latency requirement for the common case while preserving flexibility for ad-hoc analysis.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Bulk Operations</h3>
        <p>Bulk operations (apply a configuration change to 500 tenants, send an email to all tenants on a deprecated plan) are asynchronous jobs, not synchronous API calls. The platform operator selects a target set (defined by a filter: plan = 'deprecated', region = 'eu-west-1', etc.) and an action (send email, set configKey, suspend). The system evaluates the filter to determine the target count and previews the action for the operator before execution. The operator confirms, and the bulk job is enqueued in a job queue (Redis-backed BullMQ or similar).</p>
        <HighlightBlock as="p" tier="important">The bulk job is processed by worker processes that iterate through the target tenants in batches of 100. Each batch is processed transactionally: if any individual action fails (e.g., the email delivery fails for one tenant), the failure is recorded in the job's progress log, and the worker continues with the next batch rather than rolling back the entire operation. The progress UI shows real-time progress (updated via SSE): "Completed 347/500 tenants. 3 failures." The operator can view the failure details and re-run the operation for the failed subset. Bulk operations are audit-logged at the job level (one entry for the bulk action initiation) and at the item level (one entry per affected tenant), providing a complete record of what changed and when.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Audit Log Architecture</h3>
        <p>Every administrative action generates an audit event before the action is executed (not after—so even failed actions are logged). The audit event is written to Kafka synchronously (the action does not proceed until the Kafka write acknowledges). Kafka provides the audit log's immutability guarantee: Kafka topics with log compaction disabled and infinite retention policy ensure that events are never overwritten or deleted. The audit log consumer writes events to both a searchable database (PostgreSQL, for the UI query) and a long-term archive (S3, for regulatory compliance and 2-year retention).</p>
        <p>Audit log entries: actorId, actorType (operator or tenant_admin), actorIp, targetType (tenant, user, config), targetId, action (create, update, delete, suspend, impersonate_start, impersonate_end), before (previous state snapshot, for updates), after (new state snapshot), timestamp, requestId (for tracing). The before/after snapshots enable forensic analysis: "what was the tenant's billing plan before this change?" The requestId links the audit entry to the distributed trace of the API request, allowing the change to be correlated with the exact API call that caused it.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Impersonation</h3>
        <HighlightBlock as="p" tier="important">Platform operators can impersonate any user for support and debugging. The impersonation flow: the operator selects a tenant and user from the admin UI, and the Impersonation Service generates a signed impersonation token (JWT with claims: impersonatorId, targetUserId, targetTenantId, expiresAt (15 minutes), and a one-time-use nonce stored in Redis). The operator's browser is redirected to the main product with this token, which the product's authentication middleware exchanges for a full session cookie scoped to the target user's tenant. The product session is a normal user session in every way—API calls, UI rendering, data access—but with an impersonation flag in the session that suppresses any "sensitive account management" actions (the impersonator cannot change the target user's password, delete the account, or export data).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Impersonation audit: the impersonation start (impersonate_start) and end (impersonate_end or token expiry) are audit-logged. The target user can be notified of the impersonation session (configurable per tenant: always notify, never notify, or only notify if the impersonator performs a write action). The impersonation token's 15-minute TTL ensures that a forgotten impersonation session expires quickly without requiring an explicit sign-out. The one-time nonce prevents replay attacks (the token can only be used to create one session; subsequent uses with the same token fail).</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/multi-tenant-saas-admin-dashboard-permissions.svg"
          alt="Multi-tenant admin permissions model showing RLS enforcement (PostgreSQL session variable tenantId, RLS policies on all tables, operator connection pool bypasses RLS), RBAC within tenants (owner/admin/member/viewer permission strings, checked by permissions middleware), impersonation flow (signed JWT with nonce → product session with impersonation flag → suppressed sensitive actions → audit log start/end), and bulk operation lifecycle (filter → preview → confirm → async job → progress SSE → audit log per item)."
          caption="Permissions: database RLS for tenant isolation, permission-string RBAC within tenants, signed impersonation tokens with nonce, and async bulk jobs with per-item audit"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Shared database versus database-per-tenant multi-tenancy: database-per-tenant provides the strongest isolation (a bug cannot leak data across tenants even with a misconfigured query) and allows per-tenant performance tuning, but it makes cross-tenant queries impossible without a data warehouse. Shared database with RLS provides easier cross-tenant analytics and simpler operations (one database to manage) but requires rigorous application-level and database-level enforcement of tenant boundaries. For most SaaS platforms, the shared database model with RLS is the correct choice, as cross-tenant analytics is essential for business operations and RLS provides sufficient isolation when correctly configured. Database-per-tenant is appropriate for high-compliance industries (healthcare, financial services) where regulatory requirements mandate data segregation.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Audit log synchronous versus asynchronous write: writing the audit event synchronously to Kafka (before the action executes) adds latency to every admin action (typically 5–15ms for a Kafka write). The alternative—async audit log write after the action—risks missing audit events if the service crashes between action execution and audit log write. For compliance purposes, the synchronous write is required: the audit log must be complete, and a missed entry is a compliance failure. The 5–15ms latency is acceptable for admin operations (which are not latency-sensitive user interactions). If the Kafka write fails, the admin action should be rejected with an error—failing to audit is grounds for failing the action.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Self-service versus operator-assisted tenant management: allowing tenant admins to self-serve tenant management (billing changes, plan upgrades, data export) reduces the load on platform operators but increases the complexity of the tenant-facing admin UI. The decision depends on the SaaS product's sales model: product-led growth (PLG) requires a fully self-service admin UI; enterprise sales with dedicated account managers can defer many management operations to operator-assisted workflows. The admin dashboard should be designed with both paths in mind, with self-service as the default and operator escalation as a fallback rather than a primary workflow.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A multi-tenant SaaS admin dashboard serves two user types with different access scopes: platform operators (cross-tenant via internal SSO, operator connection pool bypassing RLS) and tenant admins (scoped to their tenant via JWT tenantId claim + PostgreSQL RLS). Cross-tenant analytics queries are served by a ClickHouse data warehouse fed by CDC pipeline, with pre-aggregated Redis cache for common queries (sub-100ms) and ClickHouse fallthrough for custom queries (under 3s). Bulk operations are async jobs (BullMQ) with batch processing, per-item failure tracking, real-time SSE progress, and per-item audit logging. The audit log is append-only and written synchronously to Kafka before each action executes, consuming to PostgreSQL (searchable UI) and S3 (2-year retention archive). Impersonation uses signed JWTs with one-time nonces (15-minute TTL), sessions scoped to the target tenant with sensitive actions suppressed, and full audit logging of start/end. The fundamental isolation mechanism is PostgreSQL RLS with a session variable—database-level enforcement that makes tenant data leaks impossible regardless of application-layer bugs.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

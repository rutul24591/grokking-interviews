"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-views-materialized-views",
  title: "Views & Materialized Views",
  description: "Comprehensive guide to database views and materialized views covering use cases, refresh strategies, performance trade-offs, and production considerations for query optimization.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "views-materialized-views",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-02",
  tags: ["backend", "database", "views", "materialized-views", "query-optimization", "sql"],
  relatedTopics: ["database-indexes", "query-optimization-techniques", "database-partitioning"],
};

export default function ViewsMaterializedViewsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Views</strong> are virtual tables defined by SQL queries. When you query a view, the database executes the underlying query and returns results. Views do not store data—they are stored queries that run at read time. <strong>Materialized views</strong> store the query results physically, like a table. When you query a materialized view, the database reads the stored results (fast) rather than executing the query. Materialized views must be refreshed periodically to stay current with base table changes.
        </p>
        <p>
          The distinction matters for system design: views excel at encapsulating complex queries (joins, aggregations), enforcing row-level security (filter by tenant), and simplifying application code (single view vs multiple joins). Materialized views excel at accelerating expensive read queries (dashboards, reports) where slight staleness is acceptable. Views trade compute for freshness (query runs every time), materialized views trade freshness for speed (pre-computed results).
        </p>
        <p>
          For staff-level engineers, understanding view trade-offs is essential for query optimization architecture. Key decisions include: when to use views vs materialized views, refresh strategy for materialized views (on commit, scheduled, manual), handling staleness (acceptable window, staleness indicators), and view dependencies (avoid stacking views). Views are supported in all major databases (PostgreSQL, Oracle, SQL Server, MySQL). Materialized views vary—Oracle and PostgreSQL have native support, MySQL requires manual implementation with summary tables.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/views-materialized-views-architecture.svg"
          alt="Views and materialized views architecture"
          caption="Views (virtual tables) vs materialized views (stored results) with refresh strategies"
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-4">
          <li>
            <strong>Standard Views:</strong> Views are named queries stored in database schema. Example: CREATE VIEW active_users AS SELECT * FROM users WHERE status = 'active'. Querying the view executes the underlying query. Views provide: query encapsulation (complex logic in one place), security (grant access to view, not base tables), simplification (application sees simple interface). Views add no storage overhead but execute query on every access. Views are always current—reflect base table changes immediately. Views can be updated through (INSERT/UPDATE/DELETE) if they meet certain criteria (single table, no aggregations).
          </li>
          <li>
            <strong>Materialized Views:</strong> Materialized views store query results physically. Example: CREATE MATERIALIZED VIEW daily_sales AS SELECT date, SUM(amount) FROM orders GROUP BY date. Querying reads stored results (fast). Materialized views must be refreshed: ON COMMIT (refresh on every base table change—strong consistency), scheduled (refresh hourly/daily—bounded staleness), manual (refresh on demand—full control). Choose based on freshness requirements. Materialized views can be indexed (unlike standard views) for additional performance.
          </li>
          <li>
            <strong>Refresh Strategies:</strong> Full refresh rebuilds entire materialized view—simple but expensive for large datasets. Incremental refresh (fast refresh) applies only changes since last refresh—complex but efficient. Requires materialized view logs to track changes. Scheduled refresh runs at intervals (hourly, daily)—predictable load, bounded staleness. On-commit refresh ensures consistency but impacts write performance. Choose based on data volume and freshness needs. CONCURRENTLY option (PostgreSQL) allows reads during refresh.
          </li>
          <li>
            <strong>View Dependencies:</strong> Views can reference tables and other views. Dependency chains (view A references view B references view C) create hidden complexity—changes to base tables cascade through chain. Query optimizer may struggle with deep view stacks. Document view dependencies, avoid excessive nesting (max 2-3 levels), monitor query plans for view expansion. Circular dependencies cause errors—database prevents but design should avoid. Use dependency graphs to understand impact of schema changes.
          </li>
          <li>
            <strong>Security Views:</strong> Views enforce row-level security by filtering data. Example: CREATE VIEW my_orders AS SELECT * FROM orders WHERE user_id = current_user_id(). Grant access to view, not base table—users only see their data. Views can also hide sensitive columns (exclude password, ssn from view). Security through views is defense-in-depth—application should also enforce access control. Views provide consistent security policy across all applications.
          </li>
          <li>
            <strong>Updatable Views:</strong> Some views support INSERT/UPDATE/DELETE operations. Requirements: single base table, no aggregations, no DISTINCT, include all NOT NULL columns. INSTEAD OF triggers enable updates on complex views (multiple tables, aggregations). Updatable views simplify application code (single interface for CRUD). Use WITH CHECK OPTION to enforce view constraints on updates.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/views-vs-materialized-views.svg"
          alt="Views vs materialized views comparison"
          caption="Comparison of standard views and materialized views showing key differences in storage, freshness, and performance"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Standard Views</th>
              <th className="p-3 text-left">Materialized Views</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Data Storage</strong>
              </td>
              <td className="p-3">
                • No storage (virtual table)
                <br />
                • Query runs on access
                <br />
                • Always current
              </td>
              <td className="p-3">
                • Stores results physically
                <br />
                • Read stored data
                <br />
                • Stale until refresh
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Performance</strong>
              </td>
              <td className="p-3">
                • Same as underlying query
                <br />
                • No acceleration
                <br />
                • Optimizer can rewrite
              </td>
              <td className="p-3">
                • Fast reads (stored results)
                <br />
                • Refresh overhead
                <br />
                • 10-100x faster for aggregations
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Freshness</strong>
              </td>
              <td className="p-3">
                • Always current
                <br />
                • Reflects base table changes
                <br />
                • No staleness concerns
              </td>
              <td className="p-3">
                • Stale between refreshes
                <br />
                • Refresh lag varies
                <br />
                • Must track staleness
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Use Cases</strong>
              </td>
              <td className="p-3">
                • Query encapsulation
                <br />
                • Security filtering
                <br />
                • Simplified interface
              </td>
              <td className="p-3">
                • Dashboard aggregations
                <br />
                • Report acceleration
                <br />
                • Expensive read queries
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/views-tradeoffs.svg"
          alt="Views trade-offs diagram"
          caption="Trade-offs between standard views and materialized views showing when to use each approach"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use Views for Security and Encapsulation:</strong> Create views to encapsulate complex joins (application sees simple interface), enforce row-level security (filter by tenant/user), hide sensitive columns (exclude password, ssn). Grant access to views, not base tables. Document view purpose and dependencies. Views simplify application code and provide consistent data access patterns across services. Use views as API layer between applications and base tables.
          </li>
          <li>
            <strong>Choose Refresh Strategy Based on Freshness Needs:</strong> For dashboards (hourly updates acceptable): scheduled refresh (cron job hourly). For reports (daily updates acceptable): scheduled refresh (nightly batch). For near-real-time (seconds acceptable): on-commit refresh or frequent scheduled refresh. For exact consistency: on-commit refresh (impacts write performance). Document acceptable staleness per materialized view. Monitor refresh duration and alert on delays.
          </li>
          <li>
            <strong>Monitor Staleness:</strong> Track last refresh time for each materialized view. Alert when refresh is delayed beyond SLA. Expose staleness metadata in API responses (last_updated field). For critical dashboards, show staleness indicator to users (data as of HH:MM). Automate refresh monitoring—failed refreshes should page on-call. Implement refresh retry logic with exponential backoff.
          </li>
          <li>
            <strong>Avoid Deep View Stacks:</strong> Limit view nesting to 2-3 levels maximum. Deep stacks (view A references view B references view C...) cause: query optimizer confusion (poor execution plans), debugging difficulty (hard to trace data flow), performance issues (query expansion). Document view dependencies, review before adding new views, prefer flat view architecture. Use EXPLAIN to analyze view query plans.
          </li>
          <li>
            <strong>Index Materialized Views:</strong> Materialized views are tables—add indexes for common query patterns. Example: daily_sales materialized view should have index on date column for time-range queries. Indexes accelerate reads but add refresh overhead (indexes must be updated). Choose indexes based on actual query patterns, not assumed patterns. Monitor index usage and drop unused indexes.
          </li>
          <li>
            <strong>Handle Refresh Failures:</strong> Implement alerting for refresh failures. Configure refresh jobs with timeout (prevent runaway refreshes). Use transactional refresh (all-or-nothing update). Maintain previous version during refresh (fallback if refresh fails). Document refresh procedures and rollback steps. Test refresh procedures regularly with production-like data volumes.
          </li>
        </ol>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-4">
          <li>
            <strong>Sales Dashboard with Materialized Views:</strong> E-commerce platform uses materialized views for sales dashboard—daily revenue, orders by category, top products. Materialized view pre-aggregates millions of orders into hundreds of summary rows. Refresh runs hourly during business hours, nightly off-hours. Dashboard queries materialized view (sub-second) instead of scanning orders table (30+ seconds). Staleness acceptable (hourly updates sufficient for business decisions). Indexes on date and category columns enable fast filtering.
          </li>
          <li>
            <strong>Multi-Tenant Security with Views:</strong> SaaS platform uses views for tenant isolation—CREATE VIEW tenant_orders AS SELECT * FROM orders WHERE tenant_id = current_tenant_id(). Application connects with tenant-specific credentials, automatically filtered to tenant data. Prevents cross-tenant data leaks (application bug cannot access other tenant data). Views provide defense-in-depth alongside application-level access control. Single view definition enforces security across all applications.
          </li>
          <li>
            <strong>Financial Reporting with Materialized Views:</strong> Financial system uses materialized views for regulatory reports—balance sheets, income statements, cash flow. Reports require complex aggregations across multiple tables. Materialized views pre-compute aggregations, refreshed nightly after market close. Reports run in seconds instead of hours. Exact consistency not required (end-of-day snapshots sufficient for regulatory reporting). Audit trail tracks report generation (who, when, which version).
          </li>
          <li>
            <strong>Query Simplification with Views:</strong> Analytics platform uses views to simplify complex queries—customer_lifetime_value view joins customers, orders, payments, calculates LTV. Application queries view instead of writing complex joins. Benefits: consistent calculation (all teams use same LTV formula), simplified application code (single query vs multiple joins), easier maintenance (change formula in one place). Views abstract complex business logic from application developers.
          </li>
          <li>
            <strong>Real-Time Analytics with Incremental Refresh:</strong> Real-time analytics platform uses materialized views with incremental refresh—page views by hour, user sessions, conversion funnels. Materialized view logs track changes to base tables. Incremental refresh applies only new/changed rows (seconds) instead of full rebuild (minutes). Near-real-time analytics (1-2 minute lag) with efficient refresh. Refresh runs continuously (streaming model) instead of batch.
          </li>
          <li>
            <strong>Compliance Reporting with Views:</strong> Regulated industries use views for compliance reporting—audit trails, access logs, data retention reports. Views filter and aggregate compliance data from multiple tables. Materialized views pre-compute compliance metrics (refreshed daily). Views enforce consistent reporting across audits. Compliance officers query views directly (no database access needed). Views provide read-only access to sensitive compliance data.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Access Control</h3>
          <ul className="space-y-2">
            <li>
              <strong>Grant Access to Views:</strong> Grant SELECT on views, not base tables. Users access data through views only. Views filter by tenant/user, hide sensitive columns. Base table access restricted to administrators. Prevents unauthorized data access even if application has bugs. Use database roles for permission management (analyst_role, admin_role).
            </li>
            <li>
              <strong>Row-Level Security:</strong> Use views with WHERE clauses for row-level security (tenant_id = current_tenant). Combine with database roles (each tenant has separate role). Application connects with tenant-specific role, automatically filtered. Defense-in-depth alongside application access control. Views provide consistent security policy across all applications.
            </li>
            <li>
              <strong>Column-Level Security:</strong> Views exclude sensitive columns (password, ssn, credit_card). Application cannot accidentally expose data not in view. Sensitive data accessed only through secure APIs with audit logging. Views provide column-level security without application changes. Different views for different user roles (admin view vs user view).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Audit and Compliance</h3>
          <ul className="space-y-2">
            <li>
              <strong>Execution Logging:</strong> Log all view queries (who, when, which view). Materialized view refreshes logged (success/failure, duration). Audit trail for compliance (SOX, HIPAA). Monitor for unusual access patterns (data exfiltration detection). Log query parameters for forensic analysis.
            </li>
            <li>
              <strong>Change Tracking:</strong> Track view definition changes (who modified, when, what changed). Use version control for view definitions. Require code review for view changes. Maintain change log for compliance audits. Document rationale for changes (why was this view modified).
            </li>
            <li>
              <strong>Refresh Auditing:</strong> Audit materialized view refresh operations (who triggered, when, duration, rows affected). Track refresh failures and retries. Monitor refresh SLA compliance. Alert on refresh delays (potential data quality issues). Maintain refresh history for troubleshooting.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Data Protection</h3>
          <ul className="space-y-2">
            <li>
              <strong>Encrypt Sensitive Data:</strong> Views handling sensitive data (PII, financial) should use encrypted base tables. Encrypt data at rest (TDE, column-level encryption). Encrypt data in transit (TLS for client connections). Views can decrypt data for authorized users only. Key management separate from database (HSM, key vault).
            </li>
            <li>
              <strong>Mask Sensitive Output:</strong> Views should mask sensitive data in output (show last 4 digits of SSN, not full SSN). Implement data masking based on user role (analysts see masked data, admins see full data). Masking applied at view level (consistent across all applications). Use CASE expressions for conditional masking.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Optimization</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">View Optimization</h3>
          <ul className="space-y-2">
            <li>
              <strong>Simplify View Definitions:</strong> Keep views simple—avoid complex subqueries, excessive joins. Complex views confuse query optimizer (poor execution plans). Break complex views into simpler intermediate views (but avoid deep stacks). Test query plans for views, optimize underlying queries. Use EXPLAIN ANALYZE to identify bottlenecks.
            </li>
            <li>
              <strong>Use Indexes on Base Tables:</strong> Views inherit indexes from base tables. Ensure base tables have appropriate indexes for view queries. Example: view filtering by status needs index on status column. Query optimizer uses indexes when executing view queries. Monitor index usage and add missing indexes.
            </li>
            <li>
              <strong>Materialized View Indexes:</strong> Add indexes to materialized views based on query patterns. Example: daily_sales materialized view needs index on date for time-range queries. Indexes accelerate reads but add refresh overhead. Monitor query patterns, add indexes for common filters. Use covering indexes for frequently accessed columns.
            </li>
            <li>
              <strong>Query Rewrite:</strong> Database can rewrite queries to use materialized views (query rewrite feature). Enable query rewrite for automatic performance improvement. Monitor query rewrite hit rate. Ensure materialized views are fresh enough for rewrite eligibility.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Refresh Optimization</h3>
          <ul className="space-y-2">
            <li>
              <strong>Use Incremental Refresh:</strong> For large materialized views, incremental refresh (fast refresh) is essential. Track changes with materialized view logs. Apply only inserts/updates/deletes since last refresh. Reduces refresh time from hours to minutes. Requires database support (Oracle, PostgreSQL support incremental). Monitor log size and purge after refresh.
            </li>
            <li>
              <strong>Schedule Refresh During Low Traffic:</strong> Run refresh jobs during low-traffic periods (night, early morning). Reduces contention with user queries. For critical dashboards, use overlapping refresh (start new refresh before old completes) for zero downtime. Monitor refresh duration, adjust schedule as data grows.
            </li>
            <li>
              <strong>Parallel Refresh:</strong> For large materialized views, use parallel refresh (multiple workers). Database partitions materialized view, each worker refreshes partition. Reduces refresh time proportionally to workers. Requires database support and sufficient resources. Monitor parallel execution for bottlenecks.
            </li>
            <li>
              <strong>CONCURRENTLY Option:</strong> PostgreSQL supports REFRESH MATERIALIZED VIEW CONCURRENTLY—allows reads during refresh. Requires unique index on materialized view. Prevents read blocking during refresh. Slightly longer refresh time (builds new version alongside old). Use for critical dashboards that cannot tolerate downtime.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Caching Strategies</h3>
          <ul className="space-y-2">
            <li>
              <strong>Application-Level Caching:</strong> Cache materialized view results at application layer (Redis, Memcached). Reduces database load for frequently accessed views. Cache invalidation on refresh (notify application when view refreshed). Cache key includes view name and parameters. TTL based on refresh frequency.
            </li>
            <li>
              <strong>Database Result Cache:</strong> Use database result cache (Oracle Result Cache, SQL Server Query Store). Cache view query results in database memory. Automatic invalidation on base table changes. Monitor cache hit rate. Size cache based on working set.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Storage Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Materialized View Storage:</strong> Materialized views store data physically—estimate storage based on aggregation level. Daily aggregations: 365 rows per year per metric. Hourly aggregations: 8760 rows per year per metric. Indexes add 20-50 percent overhead. Monitor storage growth, archive old data. Partition large materialized views by date.
            </li>
            <li>
              <strong>View Log Storage:</strong> Incremental refresh requires materialized view logs to track changes. Logs grow with base table change rate. Estimate: 10-50 bytes per changed row. Purge logs after successful refresh. Monitor log size, alert on unexpected growth. Logs consume storage until purged.
            </li>
            <li>
              <strong>Index Storage:</strong> Indexes on materialized views add storage overhead. Estimate: 20-50 percent of materialized view size. Indexes accelerate reads but consume storage. Monitor index usage, drop unused indexes. Use compression for large indexes.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Compute Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Refresh Compute:</strong> Refresh jobs consume CPU and I/O. Full refresh of large materialized views can saturate database. Schedule during low-traffic periods. Incremental refresh reduces compute cost. Monitor refresh duration, optimize slow refreshes. Budget for refresh compute (CPU hours per refresh).
            </li>
            <li>
              <strong>Query Compute:</strong> Views execute underlying query on every access—expensive views impact database performance. Materialized views reduce query compute (read stored results). Balance: more materialized views (faster queries, more refresh cost) vs fewer views (slower queries, less refresh cost). Profile query patterns to identify optimization candidates.
            </li>
            <li>
              <strong>Parallel Execution:</strong> Parallel refresh consumes more CPU but completes faster. Use parallel execution for large materialized views. Monitor parallel execution for resource contention. Configure parallel degree based on available CPU. Parallel execution increases compute cost but reduces wall-clock time.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Operational Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Monitoring:</strong> Track refresh duration, staleness, failure rates. Use database monitoring tools or custom scripts. Estimate: $100-300/month for comprehensive monitoring. Alert on refresh delays, failures, excessive staleness. Monitor storage growth for capacity planning.
            </li>
            <li>
              <strong>Maintenance:</strong> Materialized views require maintenance (index rebuilds, statistics updates, log purging). Estimate operational effort for view maintenance. Document maintenance procedures. Budget for DBA time for view maintenance. Automate routine maintenance tasks.
            </li>
            <li>
              <strong>Development:</strong> Views require development effort (design, testing, documentation). Estimate development time for new views. Include views in code review process. Document view dependencies and refresh schedules. Train developers on view best practices.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When do you use a materialized view?</p>
            <p className="mt-2 text-sm">
              A: Use materialized views for expensive read queries that are executed frequently and can tolerate slight staleness. Examples: dashboard aggregations (daily revenue, active users), report queries (monthly sales by region), complex joins (customer lifetime value across multiple tables). Materialized views pre-compute results, reducing query time from seconds/minutes to milliseconds. Trade-off: data is stale between refreshes. Choose materialized views when: query is expensive (complex aggregations, multiple joins), query is frequent (dashboard loaded every minute), staleness is acceptable (hourly updates sufficient). Avoid materialized views for: real-time data (stock prices), frequently changing data (inventory counts), infrequent queries (not worth refresh overhead).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the main risk with materialized views?</p>
            <p className="mt-2 text-sm">
              A: The main risk is stale data—materialized views show outdated information between refreshes. Risks include: business decisions based on stale data (dashboard shows yesterday's revenue), user confusion (counts don't match reality), compliance issues (regulatory reports must be current). Mitigation: document acceptable staleness per materialized view (hourly, daily), monitor refresh status (alert on failed/delayed refresh), expose staleness metadata (show last_updated timestamp), implement fallback (query base tables if materialized view too stale). Choose refresh strategy based on business requirements—critical dashboards need frequent refresh, reports can use nightly refresh. Test refresh procedures regularly—verify refresh completes within SLA.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you refresh materialized views safely?</p>
            <p className="mt-2 text-sm">
              A: Safe refresh strategies: (1) Incremental refresh—apply only changes since last refresh. Requires materialized view logs. Fastest option, minimal impact. (2) Concurrent refresh—create new materialized view alongside old, swap when complete. Zero downtime, requires 2x storage during refresh. (3) Scheduled refresh—run during low-traffic periods (night, early morning). Reduces contention with user queries. (4) Monitor refresh—track duration, alert on failures, verify row counts match expected. Best practices: test refresh on staging with production-like data, document refresh procedure and rollback steps, implement retry logic for transient failures, notify stakeholders before/after refresh for critical views. For critical dashboards, use overlapping refresh (start new refresh before old completes) for zero downtime.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use standard views instead of materialized views?</p>
            <p className="mt-2 text-sm">
              A: Use standard views when: data must be current (real-time requirements), storage is limited (views use no storage), query is simple (no performance benefit from materialization), data changes frequently (refresh overhead exceeds benefit). Standard views provide: query encapsulation (complex logic in one place), security (filter by tenant/user, hide columns), simplification (application sees simple interface). Standard views always return current data—no staleness concerns. Trade-off: views execute query on every access—no performance acceleration. Choose standard views for: security filtering, query simplification, current data requirements. Choose materialized views for: expensive aggregations, frequent read queries, acceptable staleness.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle materialized view staleness in production?</p>
            <p className="mt-2 text-sm">
              A: Staleness handling strategies: (1) Document acceptable staleness—per materialized view, based on business requirements (dashboard: hourly, reports: daily). (2) Monitor refresh status—track last refresh time, alert when refresh delayed beyond SLA. (3) Expose staleness metadata—include last_updated field in API responses, show staleness indicator to users (data as of HH:MM). (4) Implement fallback—query base tables if materialized view too stale (manual override for critical decisions). (5) Automate refresh—scheduled jobs with retry logic, alert on failures. For critical dashboards, implement near-real-time refresh (every 5 minutes) or incremental refresh. Communicate staleness to users—transparency builds trust, users understand data limitations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the differences between ON COMMIT and scheduled refresh?</p>
            <p className="mt-2 text-sm">
              A: ON COMMIT refresh: materialized view refreshes automatically on every base table commit. Advantages: always current (zero staleness), no manual intervention. Disadvantages: impacts write performance (every insert/update triggers refresh), can cause deadlocks (refresh locks materialized view), not suitable for large materialized views. Use for: small materialized views, critical consistency requirements, low write volume. Scheduled refresh: materialized view refreshes on schedule (hourly, daily). Advantages: predictable load (refresh during low-traffic), no write impact, suitable for large materialized views. Disadvantages: staleness between refreshes, requires monitoring (alert on failed refresh). Use for: dashboards (hourly refresh), reports (daily refresh), large materialized views. Choose based on freshness requirements and write volume.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.postgresql.org/docs/current/rules-materializedviews.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Documentation — Materialized Views
            </a>
          </li>
          <li>
            <a
              href="https://docs.oracle.com/en/database/oracle/oracle-database/21/vldbg/manage-snapshots.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Oracle Documentation — Materialized Views
            </a>
          </li>
          <li>
            <a
              href="https://docs.microsoft.com/en-us/sql/relational-databases/indexes/create-indexes-with-included-columns"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SQL Server Documentation — Indexed Views
            </a>
          </li>
          <li>
            <a
              href="https://www.enterprisedb.com/blog/materialized-views-postgresql"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              EnterpriseDB — Materialized Views in PostgreSQL
            </a>
          </li>
          <li>
            <a
              href="https://use-the-index-luke.com/sql/clause/select/the-from-clause/joins"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Use The Index, Luke — Query Optimization
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

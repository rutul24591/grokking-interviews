"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-relational-database-design",
  title: "Relational Database Design",
  description: "Comprehensive guide to relational database design covering normalization, entity-relationship modeling, foreign keys, schema evolution, and production considerations for data integrity.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "relational-database-design",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-02",
  tags: ["backend", "database", "relational", "schema-design", "normalization", "data-modeling"],
  relatedTopics: ["database-constraints", "database-indexes", "data-modeling-in-nosql"],
};

export default function RelationalDatabaseDesignArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Relational database design</strong> is the process of modeling data as normalized tables with explicit relationships defined by foreign keys. The relational model, introduced by Edgar Codd in 1970, organizes data into tables (relations) with rows (tuples) and columns (attributes). Relationships between tables are expressed through foreign keys—columns that reference primary keys in other tables. This design prioritizes data integrity, eliminates redundancy through normalization, and enables powerful query capabilities through joins.
        </p>
        <p>
          The distinction matters for system design: relational databases (PostgreSQL, MySQL, Oracle, SQL Server) excel at complex queries with strong consistency requirements (financial systems, ERP, CRM). NoSQL databases excel at horizontal scale, flexible schemas, and specific access patterns (document, key-value, graph). Relational design trades horizontal scalability for data integrity and query flexibility. The choice depends on consistency requirements, query complexity, and scale needs.
        </p>
        <p>
          For staff-level engineers, understanding relational design is essential for data architecture. Key decisions include: normalization level (1NF, 2NF, 3NF, BCNF), foreign key design (cascade actions, nullability), index strategy (covering indexes, composite indexes), and schema evolution (zero-downtime migrations). Modern systems often combine relational databases (core transactional data) with NoSQL (caching, analytics, flexible schemas). The right design balances normalization (data integrity) with denormalization (query performance).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/relational-design-er-diagram.svg"
          alt="Relational database ER diagram"
          caption="Entity-relationship diagram showing tables, primary keys, foreign keys, and relationships"
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-4">
          <li>
            <strong>Entities and Tables:</strong> Entities (customers, orders, products) map to tables. Each table has a primary key (unique identifier) and attributes (columns). Example: customers table has customer_id (primary key), name, email, created_at. Rows represent entity instances, columns represent attributes. Primary keys must be unique and not null. Choose stable identifiers (UUID, auto-increment) over business keys (email can change). Tables should represent single entity types—not mixed entities.
          </li>
          <li>
            <strong>Relationships and Foreign Keys:</strong> Relationships (one-to-many, many-to-many) are expressed through foreign keys. One-to-many: orders table has customer_id foreign key referencing customers. Many-to-many: junction table (order_items) with order_id and product_id foreign keys. Foreign keys enforce referential integrity—cannot reference non-existent records. Define cascade actions (ON DELETE CASCADE, SET NULL) for parent deletion handling. Foreign keys should be indexed for join performance.
          </li>
          <li>
            <strong>Normalization:</strong> Normalization reduces redundancy and update anomalies. First Normal Form (1NF): atomic values, no repeating groups. Second Normal Form (2NF): 1NF plus no partial dependencies (all columns depend on full primary key). Third Normal Form (3NF): 2NF plus no transitive dependencies (columns depend only on primary key). Boyce-Codd Normal Form (BCNF): stronger 3NF variant. Normalize to 3NF for transactional systems, denormalize for read-heavy workloads. Normalization eliminates update anomalies (inconsistent data from partial updates).
          </li>
          <li>
            <strong>Constraints:</strong> Constraints enforce data integrity. PRIMARY KEY (unique, not null), FOREIGN KEY (references valid record), UNIQUE (no duplicate values), CHECK (custom condition like amount greater than 0), NOT NULL (required field). Constraints prevent invalid data at insert/update time. Document all constraints, test constraint violations, monitor constraint errors in production. Constraints are documentation (express business rules) and enforcement (prevent invalid data).
          </li>
          <li>
            <strong>Indexes:</strong> Indexes accelerate queries at cost of write overhead. Create indexes on: primary keys (automatic), foreign keys (faster joins), frequently filtered columns (WHERE clauses), sort columns (ORDER BY). Composite indexes for multi-column queries (last_name, first_name). Covering indexes include all columns needed for query (no table lookup). Monitor index usage, drop unused indexes. Indexes are critical for query performance but add write overhead.
          </li>
          <li>
            <strong>Schema Evolution:</strong> Schemas evolve—add columns, tables, indexes over time. Plan migrations for zero-downtime: additive changes first (add column), backfill data, switch reads, remove old columns. Never drop columns or add NOT NULL columns without default in single migration. Use migration tools (Flyway, Liquibase) for version control and rollback. Test migrations on production-like data volume. Schema evolution is inevitable—plan for it.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/relational-design-normalization.svg"
          alt="Database normalization levels"
          caption="Normalization levels (1NF, 2NF, 3NF) showing progressive elimination of redundancy"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Relational Design</th>
              <th className="p-3 text-left">NoSQL Design</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Data Integrity</strong>
              </td>
              <td className="p-3">
                • Foreign key constraints
                <br />
                • ACID transactions
                <br />
                • Schema validation
              </td>
              <td className="p-3">
                • Application-enforced
                <br />
                • Eventual consistency
                <br />
                • Schema-less or flexible
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Query Flexibility</strong>
              </td>
              <td className="p-3">
                • Complex joins
                <br />
                • Ad-hoc queries
                <br />
                • SQL standard
              </td>
              <td className="p-3">
                • Limited joins
                <br />
                • Pre-defined queries
                <br />
                • API-based access
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Scalability</strong>
              </td>
              <td className="p-3">
                • Vertical scaling
                <br />
                • Read replicas
                <br />
                • Sharding complex
              </td>
              <td className="p-3">
                • Horizontal scaling
                <br />
                • Built-in sharding
                <br />
                • Distributed native
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Use Cases</strong>
              </td>
              <td className="p-3">
                • Financial systems
                <br />
                • ERP/CRM
                <br />
                • Complex reporting
              </td>
              <td className="p-3">
                • High-scale web
                <br />
                • Real-time analytics
                <br />
                • Flexible schemas
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/relational-design-principles.svg"
          alt="Relational design principles"
          caption="Relational design principles showing normalization, constraints, and indexing trade-offs"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Normalize to 3NF for Transactional Systems:</strong> Normalize transactional tables (orders, payments, inventory) to Third Normal Form. Eliminates redundancy (update once, not multiple places), prevents update anomalies (inconsistent data), enforces data integrity through constraints. Denormalize selectively for read-heavy queries (reporting tables, materialized views). Document denormalization rationale and refresh strategy. 3NF is the sweet spot for most transactional systems.
          </li>
          <li>
            <strong>Define Foreign Key Constraints:</strong> Always define foreign key constraints for relationships. Prevents orphaned records (orders without customers), ensures referential integrity, documents relationships explicitly. Choose cascade actions carefully: CASCADE for child records that should delete with parent (order_items with orders), SET NULL for optional relationships (assigned_user with tickets), RESTRICT for critical relationships (prevent delete if children exist).
          </li>
          <li>
            <strong>Use Surrogate Primary Keys:</strong> Use surrogate keys (auto-increment integer, UUID) instead of natural keys (email, username). Surrogate keys are stable (email can change), compact (integer vs string), and database-generated (no application logic). UUID for distributed systems (no coordination needed), auto-increment for single-database (smaller, faster). Natural keys should have UNIQUE constraint but not as primary key.
          </li>
          <li>
            <strong>Index Foreign Keys:</strong> Create indexes on all foreign key columns. Unindexed foreign keys cause full table scans on joins—performance degrades with data growth. Example: orders.customer_id needs index for customer orders query. Most databases don't auto-index foreign keys (unlike primary keys). Document index strategy, monitor missing index warnings.
          </li>
          <li>
            <strong>Plan Schema Migrations:</strong> Schema changes require careful planning for zero-downtime. Additive changes first (add column, add index), then backfill data, then switch reads, then remove old columns. Never drop columns or add NOT NULL columns without default in single migration. Test migrations on production-like data volume. Use migration tools (Flyway, Liquibase) for version control and rollback.
          </li>
          <li>
            <strong>Document Schema Design:</strong> Document table purposes, column meanings, relationships, constraints. Use ER diagrams for visual documentation. Document business rules encoded in constraints. Maintain data dictionary (column definitions, allowed values). Documentation is critical for team onboarding and schema evolution. Update documentation with schema changes.
          </li>
        </ol>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-4">
          <li>
            <strong>E-commerce Order Management:</strong> E-commerce platform uses relational design for orders—customers, orders, order_items, products tables with foreign keys. Normalized to 3NF (product details in products table, not duplicated in order_items). Foreign keys enforce referential integrity (cannot order non-existent product). ACID transactions ensure order and order_items created atomically. Complex queries (customer order history, product sales reports) use joins across tables.
          </li>
          <li>
            <strong>Banking Core System:</strong> Banking system uses relational design for accounts, transactions, customers. Normalized to BCNF (no redundancy in account data). Foreign keys with RESTRICT (cannot delete customer with open accounts). CHECK constraints (balance greater than or equal to zero for certain account types). ACID transactions for fund transfers (debit and credit atomic). Audit trail (all transactions logged with timestamps).
          </li>
          <li>
            <strong>Healthcare Patient Records:</strong> Healthcare system uses relational design for patients, visits, diagnoses, prescriptions. Normalized to 3NF (diagnosis codes in separate table). Foreign keys ensure data integrity (prescription references valid patient and visit). CHECK constraints (dosage within safe range). Row-level security (doctors see only their patients). Audit logging (HIPAA compliance—track all record access).
          </li>
          <li>
            <strong>ERP Manufacturing System:</strong> ERP system uses relational design for products, bills_of_materials, work_orders, inventory. Complex relationships (product has many BOM items, each BOM item references component product). Recursive foreign keys (component can be assembled product with its own BOM). Normalized to 3NF (component details stored once). Complex queries (cost rollup through BOM hierarchy) use recursive CTEs.
          </li>
          <li>
            <strong>SaaS Multi-Tenant Platform:</strong> SaaS platform uses relational design with tenant isolation—every table has tenant_id foreign key. Row-level security through views (each tenant sees only their data). Foreign keys include tenant_id (order belongs to customer within same tenant). Shared tables (all tenants in same database) with tenant_id filtering. Alternative: separate schema per tenant (stronger isolation, higher operational cost).
          </li>
          <li>
            <strong>Content Management System:</strong> CMS uses relational design for articles, authors, categories, tags. Many-to-many relationships (articles have multiple tags, tags belong to multiple articles) via junction tables. Normalized to 3NF (author details in authors table). Full-text search on article content. Versioning (article revisions table with foreign key to articles). Soft deletes (deleted_at column, not actual delete).
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Access Control</h3>
          <ul className="space-y-2">
            <li>
              <strong>Least Privilege:</strong> Grant minimum permissions—application user gets SELECT/INSERT/UPDATE on specific tables, not DROP or ALTER. Separate read-only users for reporting. Use database roles for permission management. Review permissions regularly, revoke unused grants.
            </li>
            <li>
              <strong>Row-Level Security:</strong> Implement row-level security for multi-tenant systems (tenant_id filter). Use database RLS features (PostgreSQL RLS policies) or views with WHERE clauses. Prevents cross-tenant data leaks even if application has bugs. Defense-in-depth alongside application access control.
            </li>
            <li>
              <strong>Column-Level Security:</strong> Restrict access to sensitive columns (salary, ssn, credit_card). Use column-level permissions (read salary only for HR role). Implement dynamic column masking based on user role. Masking applied at database level (consistent across all applications).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Data Protection</h3>
          <ul className="space-y-2">
            <li>
              <strong>Encryption at Rest:</strong> Enable transparent data encryption (TDE) for sensitive data. Encrypt specific columns (ssn, credit_card) at application level before storage. Protects against data theft from disk access or backups. Use encrypted EBS volumes for database storage.
            </li>
            <li>
              <strong>Encryption in Transit:</strong> Use TLS for all client connections. Prevents eavesdropping and man-in-the-middle attacks. Verify certificates on client side. Use mutual TLS for service-to-service communication.
            </li>
            <li>
              <strong>Audit Logging:</strong> Enable audit logging for sensitive tables (who accessed what, when). Required for compliance (SOX, HIPAA, PCI-DSS). Monitor for unusual access patterns (data exfiltration detection). Retain audit logs for required period (7 years for financial).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SQL Injection Prevention</h3>
          <ul className="space-y-2">
            <li>
              <strong>Parameterized Queries:</strong> Use parameterized queries or ORM frameworks. Never concatenate user input into SQL strings. SQL injection can bypass authentication, expose data, or modify database. Prepared statements separate query structure from data.
            </li>
            <li>
              <strong>Input Validation:</strong> Validate all user input (data types, ranges, formats). Whitelist allowed values where possible (enum validation). Reject invalid input with clear error messages. Don't rely solely on database constraints for validation.
            </li>
            <li>
              <strong>Stored Procedures:</strong> Use stored procedures for complex operations. Procedures can enforce business rules and validate input. Grant execute permission on procedures, not direct table access. Procedures act as security boundary.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Optimization</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Query Optimization</h3>
          <ul className="space-y-2">
            <li>
              <strong>Index Strategy:</strong> Create indexes on foreign keys, frequently filtered columns, and sort columns. Use composite indexes for multi-column queries (last_name, first_name). Covering indexes include all columns needed (no table lookup). Monitor index usage and add missing indexes. Indexes are critical for query performance.
            </li>
            <li>
              <strong>Query Analysis:</strong> Use EXPLAIN ANALYZE to understand query plans. Look for sequential scans on large tables (missing indexes), nested loop joins on large datasets (consider hash joins), filesort operations (add index on ORDER BY columns). Optimize queries based on actual execution plans, not assumptions.
            </li>
            <li>
              <strong>Denormalization for Performance:</strong> Selectively denormalize for read-heavy queries. Example: add customer_name to orders table (avoid join for order history display). Maintain denormalized columns with triggers or application logic. Document denormalization, monitor for data drift.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Schema Optimization</h3>
          <ul className="space-y-2">
            <li>
              <strong>Partitioning:</strong> Partition large tables by range (orders by order_date), list (orders by region), or hash (users by user_id). Improves query performance (scan only relevant partitions), simplifies maintenance (drop old partitions). PostgreSQL, MySQL, Oracle support partitioning.
            </li>
            <li>
              <strong>Archiving:</strong> Archive old data to separate tables or cold storage. Keep active data small (fast queries), move historical data to archive. Example: orders_current (last 12 months), orders_archive (older). Archive queries union both tables or query archive separately.
            </li>
            <li>
              <strong>Data Types:</strong> Choose appropriate data types (INTEGER vs BIGINT, VARCHAR vs TEXT). Smaller data types use less storage and memory. Use DATE for dates (not DATETIME), DECIMAL for money (not FLOAT). Proper data types improve performance and data integrity.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Connection Optimization</h3>
          <ul className="space-y-2">
            <li>
              <strong>Connection Pooling:</strong> Use connection pooling to reduce connection overhead. Pool maintains open connections for reuse. Configure pool size based on workload (too small causes queueing, too large wastes resources). Monitor pool utilization and connection wait times.
            </li>
            <li>
              <strong>Read Replicas:</strong> Use read replicas for read-heavy workloads. Route read queries to replicas, write queries to primary. Replicas sync asynchronously (may lag behind primary). Monitor replication lag. Read replicas provide read scaling and failover capability.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Infrastructure Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Storage:</strong> Relational databases store data efficiently (normalized). Estimate: 100-500 bytes per row depending on columns. Indexes add 20-50 percent overhead. SSDs recommended for performance. Estimate: $0.10-0.20/GB/month for SSD storage. Monitor storage growth, archive old data.
            </li>
            <li>
              <strong>Compute:</strong> Query-heavy workloads require more CPU. Estimate: 4-8 vCPU for moderate workloads, 16+ vCPU for high-throughput. Complex queries (joins, aggregations) benefit from more cores. Monitor CPU usage during peak queries. Scale vertically for more throughput.
            </li>
            <li>
              <strong>Memory:</strong> Databases use memory for caching (buffer pool, query cache). Estimate: 16-64GB RAM for moderate databases, 128GB+ for large databases. Memory directly impacts query performance. Monitor cache hit rate. Scale memory before hitting limits.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Operational Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Managed Services:</strong> RDS, Cloud SQL provide managed deployments. Estimate: $0.10-0.50/GB/month for storage, $0.10-0.30/hour for compute. Reduces operational overhead but increases cost vs self-hosted. Managed services include backups, patching, monitoring.
            </li>
            <li>
              <strong>Monitoring:</strong> Track query latency, cache hit rates, connection counts, storage growth. Use managed monitoring (CloudWatch, Stackdriver) or database-native tools. Estimate: $100-300/month for comprehensive monitoring. Alert on latency spikes, cache misses, storage growth.
            </li>
            <li>
              <strong>Backup and Recovery:</strong> Regular backups (daily full, hourly incremental), test restore procedures. Backup storage: 2-3x database size for retention. Estimate: $0.05-0.10/GB/month for backup storage. Test restore procedures regularly—verify backup integrity.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Development Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Schema Design:</strong> Schema design requires upfront effort (ER modeling, normalization). Estimate design time (2-4 weeks for complex systems). Document schema design decisions. Train developers on schema conventions. Good design prevents problems downstream.
            </li>
            <li>
              <strong>Migration Development:</strong> Schema migrations require development and testing. Estimate migration time (1-2 weeks per major migration). Test migrations on staging with production-like data. Plan rollback procedures. Budget for migration downtime (if any).
            </li>
            <li>
              <strong>DBA Expertise:</strong> Relational databases require DBA expertise (performance tuning, backup/recovery, capacity planning). Estimate DBA time (10-20 hours/week for moderate systems). Budget for DBA training and certification. Consider managed services to reduce DBA burden.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why normalize a schema?</p>
            <p className="mt-2 text-sm">
              A: Normalization reduces redundancy and prevents update anomalies. Benefits: data stored once (update in one place, not multiple), consistent data (no conflicting values), smaller storage (no duplication), easier maintenance (schema changes in one place). Normal forms: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies). Trade-off: normalized schemas require more joins for queries, which can impact read performance. Normalize transactional systems (data integrity critical), denormalize read-heavy workloads (reporting, analytics). Modern approach: normalize core tables, denormalize selectively for performance (materialized views, summary tables).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you denormalize?</p>
            <p className="mt-2 text-sm">
              A: Denormalize when: read performance is critical (dashboards, reports), joins are expensive (many-to-many across large tables), query patterns are predictable (known access patterns), data is read-heavy (90 percent reads, 10 percent writes). Examples: add customer_name to orders table (avoid join for order history display), pre-compute aggregates (daily_sales summary table), store redundant data for reporting (order_total in orders, not SUM of order_items). Trade-offs: update anomalies (must update multiple places), data inconsistency risk (values drift), increased storage. Mitigation: use triggers to maintain denormalized columns, document denormalization rationale, monitor for data drift, implement reconciliation jobs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle schema migrations in production?</p>
            <p className="mt-2 text-sm">
              A: Zero-downtime migration strategy: (1) Additive changes first—add new column (nullable or with default), add new table, add index. (2) Backfill data—populate new column from old, or migrate data to new table. (3) Switch reads—update application to read from new schema (feature flag for gradual rollout). (4) Remove old—drop old column/table after confirming new schema works. Never: drop columns with data, add NOT NULL columns without default, rename columns (breaks application). Use migration tools (Flyway, Liquibase) for version control and rollback. Test migrations on staging with production-like data volume.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between primary key and unique constraint?</p>
            <p className="mt-2 text-sm">
              A: Both enforce uniqueness, but differ in: NULL handling (primary key cannot be NULL, unique allows one NULL), clustering (primary key is clustered index by default in many databases, unique is non-clustered), purpose (primary key identifies row, unique prevents duplicates on non-key columns). Each table has one primary key (can be composite), but multiple unique constraints. Primary key is used for foreign key references, unique constraints cannot be referenced. Choose primary key for row identification (customer_id), unique constraints for business uniqueness (email, username).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design for multi-tenancy?</p>
            <p className="mt-2 text-sm">
              A: Multi-tenancy design options: (1) Shared database, shared schema—all tenants in same tables, tenant_id column filters data. Pros: cost-effective, easy maintenance. Cons: risk of cross-tenant data leaks, noisy neighbor (one tenant impacts others). (2) Shared database, separate schema—each tenant has separate schema. Pros: better isolation, easier backup per tenant. Cons: more complex maintenance, schema changes across all schemas. (3) Separate database—each tenant has separate database. Pros: strongest isolation, per-tenant customization. Cons: highest cost, complex maintenance. Choose based on isolation requirements, compliance needs, and operational capacity. Most SaaS uses shared database with tenant_id filtering and row-level security.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are foreign key cascade actions and when do you use each?</p>
            <p className="mt-2 text-sm">
              A: Foreign key cascade actions define behavior when parent record is deleted: CASCADE—delete child records automatically (use for order_items when order deleted). SET NULL—set foreign key to NULL (use for optional relationships like assigned_user on tickets). RESTRICT/NO ACTION—prevent parent deletion if children exist (use for critical relationships like customer with open orders). Default is RESTRICT (safest). Choose based on business logic: should child records survive parent deletion? If yes, use SET NULL or move to archive. If no, use CASCADE. If parent should never be deleted with children, use RESTRICT. Document cascade choices, test deletion scenarios.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.postgresql.org/docs/current/ddl.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Documentation — Data Definition
            </a>
          </li>
          <li>
            <a
              href="https://dev.mysql.com/doc/refman/8.0/en/innodb-foreign-key-constraints.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MySQL Documentation — Foreign Keys
            </a>
          </li>
          <li>
            <a
              href="https://docs.oracle.com/en/database/oracle/oracle-database/21/sqlrf/Constraints.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Oracle Documentation — Constraints
            </a>
          </li>
          <li>
            <a
              href="https://flywaydb.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Flyway — Database Migration Tool
            </a>
          </li>
          <li>
            <a
              href="https://www.liquibase.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Liquibase — Database Change Management
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

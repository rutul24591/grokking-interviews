"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-stored-procedures-functions",
  title: "Stored Procedures & Functions",
  description: "Comprehensive guide to stored procedures and functions covering use cases, trade-offs, security considerations, testing strategies, and when to use database logic vs application logic.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "stored-procedures-functions",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-02",
  tags: ["backend", "database", "stored-procedures", "functions", "sql", "database-logic"],
  relatedTopics: ["database-indexes", "query-optimization-techniques", "database-constraints"],
};

export default function StoredProceduresFunctionsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Stored procedures</strong> and <strong>functions</strong> are database objects that contain procedural logic executed on the database server. Stored procedures perform operations (INSERT, UPDATE, DELETE) and can return result sets. Functions compute and return values, usable within SQL queries. Both encapsulate business logic close to data, reducing network round-trips and centralizing data access rules. Major databases support stored logic: PostgreSQL (PL/pgSQL), Oracle (PL/SQL), SQL Server (T-SQL), MySQL (SQL procedures).
        </p>
        <p>
          The distinction matters for system design: stored procedures excel at batch operations (update thousands of rows atomically), complex calculations (financial computations), and data validation (enforce business rules at database level). Application logic excels at complex business workflows, external API integration, and scenarios requiring version control and testing frameworks. Stored procedures trade portability and testability for performance and data locality.
        </p>
        <p>
          For staff-level engineers, understanding stored procedure trade-offs is essential for architecture decisions. Key considerations include: coupling (database logic tightly couples application to database schema), testing (stored procedures harder to test than application code), deployment (database changes require careful migration), and security (procedures can enforce access control). Modern trends favor application logic for flexibility, but stored procedures remain valuable for specific use cases (batch processing, data integrity, performance-critical operations).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/stored-procedures-architecture.svg"
          alt="Stored procedures architecture"
          caption="Stored procedures showing application calling database procedures, execution context, and result flow"
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-4">
          <li>
            <strong>Stored Procedures:</strong> Procedures are named blocks of SQL and procedural code stored in database. They accept parameters, execute operations, and can return result sets. Example: transfer_funds(from_account, to_account, amount) debits one account, credits another, logs transaction—all atomically. Procedures reduce network round-trips (one call vs multiple queries) and centralize logic (single source of truth). Procedures can contain complex logic including loops, conditionals, exception handling, and multiple SQL statements. They execute as a single unit of work with transaction semantics.
          </li>
          <li>
            <strong>Functions:</strong> Functions compute and return values, usable within SQL queries. Scalar functions return single values (calculate_tax(amount)). Table functions return result sets (get_recent_orders(user_id, limit)). Functions enable computed columns, complex filtering, and reusable calculations. Unlike procedures, functions cannot modify database state (in most databases). Functions are deterministic (same input = same output) and can be used in SELECT, WHERE, and JOIN clauses. User-defined functions extend SQL with custom logic.
          </li>
          <li>
            <strong>Procedural Languages:</strong> Databases support procedural extensions to SQL. PL/pgSQL (PostgreSQL) adds loops, conditionals, exception handling. PL/SQL (Oracle) is mature with extensive libraries. T-SQL (SQL Server) integrates with .NET. SQL/PSM (MySQL) provides basic procedural features. Language choice affects portability—procedures written for Oracle won't run on PostgreSQL without modification. Each language has different syntax for variables, loops, error handling, and cursor management.
          </li>
          <li>
            <strong>Execution Context:</strong> Procedures execute with defined privileges (definer's rights or caller's rights). Definer's rights execute with procedure owner's permissions—useful for granting limited access. Caller's rights execute with caller's permissions—useful for auditing. Security model affects what operations procedures can perform and who can execute them. Definer's rights can be dangerous if not carefully managed (privilege escalation risk). Caller's rights provide better audit trails but may fail if caller lacks permissions.
          </li>
          <li>
            <strong>Triggers:</strong> Triggers are procedures that execute automatically on data changes (INSERT, UPDATE, DELETE). Use cases: audit logging (log all changes), data validation (enforce complex constraints), cascading updates (maintain denormalized summaries). Triggers are powerful but hidden—can cause unexpected behavior if not documented. BEFORE triggers execute before the operation (for validation), AFTER triggers execute after (for logging). INSTEAD OF triggers replace the operation (for views). Triggers should be used sparingly—too many triggers make debugging difficult.
          </li>
          <li>
            <strong>Parameters and Return Values:</strong> Procedures accept IN parameters (input values), OUT parameters (output values), and INOUT parameters (both). Functions return a single value or table. Procedures can return multiple result sets (multiple SELECT statements). Parameter types must match database types (VARCHAR, INTEGER, DATE). Default parameter values simplify common use cases. Named parameters improve readability over positional parameters. Large parameters (BLOB, CLOB) should be passed by reference, not by value.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/stored-procedures-vs-functions.svg"
          alt="Stored procedures vs functions comparison"
          caption="Comparison of stored procedures and functions showing key differences in usage, return values, and capabilities"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Stored Procedures</th>
              <th className="p-3 text-left">Application Logic</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Performance</strong>
              </td>
              <td className="p-3">
                • Reduced network round-trips
                <br />
                • Executed close to data
                <br />
                • Pre-compiled execution plans
              </td>
              <td className="p-3">
                • Network overhead per call
                <br />
                • Data transferred to app
                <br />
                • Query optimization per call
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Maintainability</strong>
              </td>
              <td className="p-3">
                • Version control challenging
                <br />
                • Testing requires database
                <br />
                • Debugging tools limited
              </td>
              <td className="p-3">
                • Standard version control
                <br />
                • Unit testing frameworks
                <br />
                • Rich debugging tools
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Portability</strong>
              </td>
              <td className="p-3">
                • Database-specific syntax
                <br />
                • Vendor lock-in
                <br />
                • Migration complex
              </td>
              <td className="p-3">
                • Database-agnostic
                <br />
                • ORM abstraction
                <br />
                • Easier database switch
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Use Cases</strong>
              </td>
              <td className="p-3">
                • Batch operations
                <br />
                • Data validation
                <br />
                • Complex calculations
              </td>
              <td className="p-3">
                • Business workflows
                <br />
                • External integrations
                <br />
                • Complex logic
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-storage-databases/stored-procedures-tradeoffs.svg"
          alt="Stored procedures trade-offs diagram"
          caption="Trade-offs between stored procedures and application logic showing when to use each approach"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use for Batch Operations:</strong> Stored procedures excel at batch operations that would require multiple round-trips from application. Example: end-of-day processing (update balances, calculate interest, generate statements) in single procedure call. Reduces network overhead, ensures atomicity, improves performance. Keep procedures focused—single responsibility, not monolithic business logic. Batch operations should be idempotent (safe to retry) and have clear success/failure semantics.
          </li>
          <li>
            <strong>Document Thoroughly:</strong> Stored procedures are hidden logic—document purpose, parameters, return values, side effects, and error handling. Use consistent naming conventions (verb_noun: calculate_interest, transfer_funds). Include usage examples in comments. Maintain procedure catalog accessible to development team. Undocumented procedures cause bugs when developers don't understand side effects. Document dependencies (which tables, which other procedures). Document performance characteristics (expected execution time, resource usage).
          </li>
          <li>
            <strong>Version Control Database Code:</strong> Treat stored procedures as code—store in version control (Git), review changes (pull requests), track history. Use migration tools (Flyway, Liquibase) for deployment. Tag releases with application versions. Enable rollback to previous versions. Database code deserves same rigor as application code. Use branching strategies (feature branches for procedure changes). Automate deployment with CI/CD pipelines.
          </li>
          <li>
            <strong>Test Rigorously:</strong> Write tests for stored procedures—unit tests (test individual procedures), integration tests (test with real database), performance tests (verify execution time). Use testing frameworks (pgTAP for PostgreSQL, utPLSQL for Oracle). Test edge cases, error conditions, concurrent execution. Automate tests in CI/CD pipeline. Untested procedures cause production bugs. Test with realistic data volumes—procedures may behave differently with millions of rows.
          </li>
          <li>
            <strong>Secure Appropriately:</strong> Use definer's rights for procedures that need elevated permissions (grant limited access through procedure). Use caller's rights for auditing (procedure executes with caller's permissions). Grant execute permission, not table access. Validate all parameters (prevent SQL injection). Log procedure execution for auditing. Review permissions regularly. Use parameterized queries inside procedures. Avoid dynamic SQL—use static SQL with parameters. If dynamic SQL is necessary, validate and sanitize inputs.
          </li>
          <li>
            <strong>Handle Errors Gracefully:</strong> Procedures should handle errors gracefully—log errors, rollback transactions, return meaningful error codes. Use exception handling (TRY/CATCH in SQL Server, EXCEPTION in PL/pgSQL). Don't swallow errors silently—log them for debugging. Return consistent error codes across procedures. Document error codes and their meanings. Test error handling—procedures should fail safely, not corrupt data.
          </li>
        </ol>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-4">
          <li>
            <strong>Banking Fund Transfers:</strong> Banks use stored procedures for fund transfers—debit source account, credit destination account, log transaction, check limits, validate accounts. All operations atomic—either all succeed or all fail. Procedure executes with elevated permissions (access all accounts), callers granted only execute permission. Reduces network round-trips, ensures data integrity, enforces business rules at database level. Transaction isolation prevents race conditions (two transfers from same account simultaneously).
          </li>
          <li>
            <strong>E-commerce Order Processing:</strong> E-commerce platforms use stored procedures for order processing—create order, reserve inventory, calculate totals, apply discounts, update statistics. Single procedure call ensures atomicity (order not created if inventory unavailable). Complex calculations (tax, shipping, discounts) executed close to data. Reduces application complexity, ensures consistent order processing. Procedures handle edge cases (out of stock, invalid address, payment failure) with clear error codes.
          </li>
          <li>
            <strong>Data Warehouse ETL:</strong> Data warehouses use stored procedures for ETL (Extract, Transform, Load)—transform source data, validate quality, load into warehouse tables, update metadata. Procedures handle millions of rows efficiently (set-based operations). Scheduled execution (nightly batch). Centralizes ETL logic, enables monitoring, provides audit trail. Procedures track progress (rows processed, errors encountered) for operational visibility.
          </li>
          <li>
            <strong>Financial Calculations:</strong> Financial systems use stored procedures for calculations—interest accrual, amortization schedules, risk calculations. Complex formulas executed close to data (no data transfer overhead). Calculations consistent across all applications (single source of truth). Versioned procedures ensure calculation changes tracked and auditable. Procedures handle edge cases (leap years, holidays, rate changes) with business logic.
          </li>
          <li>
            <strong>Audit Logging with Triggers:</strong> Regulated industries use triggers for audit logging—every INSERT, UPDATE, DELETE logged to audit table with timestamp, user, old/new values. Triggers ensure no changes bypass audit (application bugs can't skip logging). Audit trail meets compliance requirements (SOX, HIPAA). Triggers execute automatically—no application code needed. Audit tables separate from operational tables (different retention policies, access controls).
          </li>
          <li>
            <strong>Report Generation:</strong> Reporting systems use stored procedures for complex reports—aggregate data from multiple tables, apply business rules, format output. Procedures pre-compute report data (materialized views, summary tables). Scheduled execution (hourly, daily reports). Reduces load on operational database (reports run on replica). Procedures handle report parameters (date ranges, filters, groupings) efficiently.
          </li>
          <li>
            <strong>Data Migration:</strong> Database migrations use stored procedures for data transformation—migrate legacy data to new schema, validate data quality, handle edge cases. Procedures execute atomically (all-or-nothing migration). Procedures track migration progress (rows migrated, errors encountered). Procedures can be rolled back if migration fails. Migration procedures tested extensively before production deployment.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Access Control</h3>
          <ul className="space-y-2">
            <li>
              <strong>Principle of Least Privilege:</strong> Grant execute permission on procedures, not direct table access. Procedures run with definer's rights—can access tables caller cannot. Limits exposure if caller credentials compromised. Review permissions regularly, revoke unused grants. Use database roles for permission management (analyst_role, admin_role).
            </li>
            <li>
              <strong>Parameter Validation:</strong> Validate all parameters inside procedures. Never concatenate parameters into dynamic SQL (SQL injection risk). Use parameterized queries. Validate data types, ranges, formats. Reject invalid input with clear error messages. Whitelist allowed values where possible (enum validation).
            </li>
            <li>
              <strong>Dynamic SQL Security:</strong> Avoid dynamic SQL—use static SQL with parameters. If dynamic SQL is necessary (dynamic table names, dynamic filters), validate and sanitize inputs. Use QUOTENAME (SQL Server) or format (PostgreSQL) to safely quote identifiers. Never include user input directly in dynamic SQL strings.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Audit and Compliance</h3>
          <ul className="space-y-2">
            <li>
              <strong>Execution Logging:</strong> Log procedure execution (who, when, parameters, result). Essential for debugging and compliance. Use database audit features or custom logging tables. Protect audit logs from modification (append-only, restricted access). Log both successful and failed executions.
            </li>
            <li>
              <strong>Change Tracking:</strong> Track procedure changes (who modified, when, what changed). Use version control for database code. Require code review for procedure changes. Maintain change log for compliance audits. Document rationale for changes (why was this procedure modified).
            </li>
            <li>
              <strong>Data Access Auditing:</strong> Audit data access through procedures (which records accessed, by whom). Required for compliance (SOX, HIPAA, GDPR). Procedures can enforce row-level security (users see only their data). Audit trails must be tamper-proof (write-once storage, cryptographic signatures).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Encryption and Data Protection</h3>
          <ul className="space-y-2">
            <li>
              <strong>Encrypt Sensitive Data:</strong> Procedures handling sensitive data (PII, financial) should use encryption. Encrypt data at rest (TDE, column-level encryption). Encrypt data in transit (TLS for client connections). Procedures can decrypt data for authorized users only. Key management separate from database (HSM, key vault).
            </li>
            <li>
              <strong>Mask Sensitive Output:</strong> Procedures should mask sensitive data in output (show last 4 digits of SSN, not full SSN). Implement data masking based on user role (analysts see masked data, admins see full data). Masking applied at procedure level (consistent across all applications).
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
              <strong>Use Set-Based Operations:</strong> Procedures should use set-based SQL (UPDATE table SET...) not row-by-row loops. Set-based operations are orders of magnitude faster. Loops in procedural code should be last resort. Let database optimizer handle bulk operations. Rewrite cursor-based logic as set-based operations where possible.
            </li>
            <li>
              <strong>Avoid Unnecessary Cursors:</strong> Cursors process rows one at a time—slow and resource-intensive. Use set-based alternatives where possible. If cursor needed, use FORWARD_ONLY, READ_ONLY for best performance. Close cursors promptly to release resources. Use cursor variables for reusable cursor logic.
            </li>
            <li>
              <strong>Parameter Sniffing:</strong> Database optimizers use parameter values to create execution plans. Bad parameter values can create suboptimal plans. Use OPTION (RECOMPILE) in SQL Server, use local variables in PostgreSQL to avoid parameter sniffing issues. Test procedures with various parameter values to identify sniffing problems.
            </li>
            <li>
              <strong>Index Usage:</strong> Procedures should use indexes effectively. Avoid functions on indexed columns in WHERE clauses (prevents index usage). Use covering indexes for frequently accessed columns. Monitor execution plans for index usage. Update statistics regularly for optimal query plans.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Resource Management</h3>
          <ul className="space-y-2">
            <li>
              <strong>Transaction Management:</strong> Keep transactions short—long transactions hold locks, block other operations. Commit frequently in batch procedures. Use appropriate isolation levels (READ COMMITTED for most cases). Handle errors with proper rollback. Avoid nested transactions (can cause unexpected behavior).
            </li>
            <li>
              <strong>Memory Usage:</strong> Procedures should not load entire tables into memory. Use LIMIT/OFFSET for pagination. Process large datasets in chunks. Monitor procedure memory usage, optimize queries that spill to disk. Use temporary tables for intermediate results (better than variables for large datasets).
            </li>
            <li>
              <strong>Connection Pooling:</strong> Procedures should be connection-pool friendly. Don't hold connections open unnecessarily. Return connections to pool promptly. Use connection pooling at application layer (reduces connection overhead). Procedures should be stateless (no session-dependent logic).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Caching Strategies</h3>
          <ul className="space-y-2">
            <li>
              <strong>Result Caching:</strong> Cache procedure results for read-heavy workloads. Use database result cache (Oracle Result Cache, SQL Server Query Store). Cache at application layer (Redis, Memcached) for frequently called procedures. Invalidate cache on data changes. Cache key should include all parameters.
            </li>
            <li>
              <strong>Plan Caching:</strong> Database caches execution plans for procedures. Monitor plan cache for plan reuse. Avoid plan cache pollution (too many similar plans). Use plan guides for critical procedures (force optimal plan). Monitor for plan regressions (sudden performance degradation).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Development Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Developer Skills:</strong> Stored procedures require database-specific skills (PL/SQL, T-SQL, PL/pgSQL). Developers proficient in application languages may not know database languages. Training costs, hiring challenges. Consider skill availability when choosing approach. Budget for ongoing training (database versions change, new features).
            </li>
            <li>
              <strong>Testing Infrastructure:</strong> Testing procedures requires database instances, test data, testing frameworks. More complex than application unit tests. CI/CD pipeline needs database provisioning. Estimate infrastructure costs for testing. Use containerized databases for test environments (Docker, Kubernetes).
            </li>
            <li>
              <strong>Documentation Overhead:</strong> Procedures require thorough documentation (purpose, parameters, examples). Documentation takes time to create and maintain. Use automated documentation tools (SQLDoc, Redgate SQL Doc). Include documentation in code review process.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Operational Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Database Load:</strong> Procedures execute on database server, consuming CPU and memory. Heavy procedure usage may require larger database instances. Monitor database resource usage, scale vertically or offload to application tier if needed. Profile procedures to identify resource-intensive operations.
            </li>
            <li>
              <strong>Maintenance:</strong> Procedures require monitoring (execution time, error rates), tuning (query optimization), and updates (business rule changes). Estimate operational effort for procedure maintenance. Document procedures to reduce knowledge silo risk. Budget for DBA time for procedure maintenance.
            </li>
            <li>
              <strong>Licensing:</strong> Some database features (Oracle Advanced PL/SQL, SQL Server Integration Services) require additional licensing. Factor licensing costs into decision. Open-source databases (PostgreSQL, MySQL) have no licensing costs but may require commercial support.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Migration and Upgrade Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Database Migration:</strong> Migrating procedures between databases is expensive (syntax differences, feature gaps). Plan for rewrite, not direct migration. Test thoroughly after migration. Budget for migration effort (2-4x original development time).
            </li>
            <li>
              <strong>Version Upgrades:</strong> Database version upgrades may break procedures (deprecated features, behavior changes). Test procedures after upgrades. Budget for upgrade testing and fixes. Use compatibility levels to minimize breaking changes.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When are stored procedures useful?</p>
            <p className="mt-2 text-sm">
              A: Stored procedures are useful for: batch operations (update thousands of rows atomically), complex calculations (financial computations close to data), data validation (enforce business rules at database level), reducing network round-trips (single call vs multiple queries), centralizing data access (single source of truth for data operations). Examples: fund transfers in banking, order processing in e-commerce, ETL in data warehouses, interest calculations in financial systems. Stored procedures reduce latency (execute close to data), ensure atomicity (all operations succeed or fail together), and enforce consistency (same logic for all callers). Trade-off: procedures increase database coupling and reduce portability.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a major risk of stored procedures?</p>
            <p className="mt-2 text-sm">
              A: Major risks include: tight coupling (application logic tied to database schema, hard to change either), testing difficulty (requires database instances, harder to mock than application code), version control challenges (database code often not in Git, changes not tracked), debugging complexity (limited debugging tools compared to application IDEs), knowledge silos (only DBAs understand procedures, bus factor risk), vendor lock-in (Oracle PL/SQL won't run on PostgreSQL). Mitigation: treat database code like application code (version control, code review, testing), document thoroughly, cross-train team members, limit stored procedure use to appropriate scenarios (batch operations, data validation), keep business logic in application layer where possible.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you secure stored procedures?</p>
            <p className="mt-2 text-sm">
              A: Security best practices: use definer's rights (procedure executes with owner's permissions, caller granted only execute permission), validate all parameters (prevent SQL injection, check data types and ranges), grant minimum permissions (execute on procedure, not direct table access), log execution (who called, when, parameters, result), avoid dynamic SQL (use parameterized queries), review code for security issues (privilege escalation, data exposure), audit permission changes, use encrypted connections (TLS for client-database communication). Security model: caller should not be able to bypass procedure logic or access data directly. Procedures act as security boundary—grant access through procedures, not tables.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you test stored procedures?</p>
            <p className="mt-2 text-sm">
              A: Testing strategies: unit tests (test individual procedures with known inputs, verify outputs), integration tests (test procedures with real database, verify end-to-end behavior), performance tests (measure execution time, verify within SLO), use testing frameworks (pgTAP for PostgreSQL, utPLSQL for Oracle, tSQLt for SQL Server), mock dependent objects (test procedures in isolation), test error handling (verify proper rollback on failures), test concurrent execution (verify no race conditions), automate in CI/CD pipeline (run tests on every change). Test data: use realistic data volumes, include edge cases (empty inputs, maximum values), clean up after tests (transactions with rollback). Document test coverage for procedures.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you move logic from procedures to application?</p>
            <p className="mt-2 text-sm">
              A: Move logic to application when: business logic changes frequently (application deploys faster than database), logic requires external API calls (procedures cannot call HTTP endpoints), complex testing needed (application testing frameworks more mature), team lacks database expertise (easier to hire application developers), portability required (application code database-agnostic, procedures database-specific), logic involves complex workflows (orchestration better in application code), microservices architecture (each service owns its data, no shared database logic). Keep in procedures when: batch operations (set-based SQL efficient), data validation (enforce at database level), performance critical (reduce network round-trips), atomicity required (all operations in single transaction).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between stored procedures and functions?</p>
            <p className="mt-2 text-sm">
              A: Key differences: procedures perform operations (INSERT, UPDATE, DELETE), functions compute values (return single value or table). Procedures called with CALL or EXECUTE, functions used in expressions (SELECT calculate_tax(amount)). Procedures can have multiple output parameters, functions return single value. Procedures can modify database state, functions typically cannot (deterministic functions required for indexes). Procedures used for business operations (transfer_funds), functions used for calculations (calculate_interest). Both support parameters, both stored in database, both can contain procedural logic. Choice depends on use case: operation vs calculation, statement vs expression.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.postgresql.org/docs/current/sql-createprocedure.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Documentation — Stored Procedures
            </a>
          </li>
          <li>
            <a
              href="https://docs.oracle.com/en/database/oracle/oracle-database/21/lnpls/index.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Oracle Documentation — PL/SQL
            </a>
          </li>
          <li>
            <a
              href="https://docs.microsoft.com/en-us/sql/relational-databases/stored-procedures/stored-procedures-database-engine"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SQL Server Documentation — Stored Procedures
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

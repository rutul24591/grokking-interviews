"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-triggers-complete",
  title: "Triggers",
  description:
    "Comprehensive guide to database triggers: BEFORE, AFTER, INSTEAD OF triggers, row vs statement level, use cases for audit logging, data validation, and derived data.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "triggers",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "triggers", "database", "automation"],
  relatedTopics: [
    "stored-procedures-and-functions",
    "database-constraints",
    "views-and-materialized-views",
    "sql-queries-optimization",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Triggers</h1>
        <p className="lead">
          Database triggers are automatic actions that execute in response to specific events
          (INSERT, UPDATE, DELETE) on a table or view. Triggers run automatically—no application
          code needed. <strong>BEFORE triggers</strong> fire before the operation (validate/modify
          data). <strong>AFTER triggers</strong> fire after the operation (log changes, notify).
          <strong>INSTEAD OF triggers</strong> replace the operation (used for views). Triggers
          can execute at <strong>ROW level</strong> (once per affected row) or
          <strong>STATEMENT level</strong> (once per statement). Common use cases: audit logging
          (track all changes), data validation (enforce complex rules), derived data (auto-update
          totals), and notifications (alert on changes).
        </p>

        <p>
          Consider an e-commerce inventory system. When an order is placed, inventory must be
          updated. Without trigger: application sends INSERT order, then UPDATE inventory (two
          operations, can get out of sync). With trigger:
          <code className="inline-code">CREATE TRIGGER update_inventory AFTER INSERT ON orders
          FOR EACH ROW EXECUTE FUNCTION decrease_inventory()</code>. When order is inserted,
          trigger automatically decreases inventory. Benefits: always in sync (can't forget to
          update), centralized logic (all order logic in one place). Trade-offs: hidden logic
          (application doesn't see trigger firing), performance overhead (trigger runs on every
          insert).
        </p>

        <p>
          Triggers are ideal for: <strong>Audit logging</strong> (track who changed what, when),
          <strong>Data validation</strong> (enforce complex business rules),
          <strong>Derived data</strong> (auto-update totals, counters),
          <strong>Notifications</strong> (alert on critical changes). Triggers should be avoided
          for: <strong>Business logic</strong> (hard to test/maintain), <strong>Complex
          operations</strong> (slow triggers block operations), <strong>Cross-database
          operations</strong> (triggers are database-specific).
        </p>

        <p>
          This article provides a comprehensive examination of triggers: trigger types (BEFORE,
          AFTER, INSTEAD OF), execution levels (ROW vs STATEMENT), use cases (audit logging,
          validation, derived data), and trade-offs (automatic execution vs hidden logic).
          We'll explore when triggers excel (audit trails, data integrity) and when they
          introduce complexity (debugging, performance overhead). We'll also cover best
          practices (keep simple, avoid recursion, document well) and common pitfalls (complex
          logic, circular triggers, slow execution).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/triggers-architecture.svg`}
          caption="Figure 1: Database Triggers Architecture showing Trigger Execution Flow: Event (INSERT/UPDATE/DELETE) → Trigger Fires (BEFORE/AFTER) → Action (Execute function). Example: INSERT INTO orders → Trigger → Update inventory. Trigger Types: BEFORE Trigger (fire before operation - validate/modify), AFTER Trigger (fire after operation - log/notify), INSTEAD OF Trigger (replace operation - views), ROW vs STATEMENT (per row vs per statement). Common Use Cases: Audit Logging (track changes), Data Validation (enforce rules), Derived Data (auto-update totals), Notifications (alert on changes). Key characteristics: Automatic execution, BEFORE/AFTER/INSTEAD OF timing, ROW/STATEMENT level, event-driven (INSERT/UPDATE/DELETE)."
          alt="Database triggers architecture"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Trigger Types &amp; Execution</h2>

        <h3>Trigger Timing: BEFORE, AFTER, INSTEAD OF</h3>
        <p>
          <strong>BEFORE triggers</strong> fire before the operation executes. Use for:
          <strong>Validation</strong> (reject invalid data), <strong>Modification</strong>
          (change data before insert/update). Example:
          <code className="inline-code">CREATE TRIGGER validate_email BEFORE INSERT ON users
          FOR EACH ROW EXECUTE FUNCTION check_email_format()</code>. Trigger checks email
          format, raises exception if invalid (insert rejected). Benefits: prevent invalid
          data, modify data before storage. Trade-offs: adds latency to operation.
        </p>

        <p>
          <strong>AFTER triggers</strong> fire after the operation completes. Use for:
          <strong>Logging</strong> (record what changed), <strong>Notifications</strong>
          (alert on changes), <strong>Derived data</strong> (update totals). Example:
          <code className="inline-code">CREATE TRIGGER log_order AFTER INSERT ON orders FOR
          EACH ROW EXECUTE FUNCTION log_new_order()</code>. Trigger inserts audit record
          (order was created). Benefits: operation already committed (can't rollback), access
          to final data. Trade-offs: can't prevent operation (only react).
        </p>

        <p>
          <strong>INSTEAD OF triggers</strong> replace the operation. Used primarily for
          <strong>views</strong> (which can't be directly modified). Example:
          <code className="inline-code">CREATE TRIGGER insert_order_item INSTEAD OF INSERT
          ON order_summary_view FOR EACH ROW EXECUTE FUNCTION insert_into_base_tables()</code>.
          Trigger inserts into base tables (orders, order_items) instead of view. Benefits:
          make views updatable, abstract complex operations. Trade-offs: replaces original
          operation (must implement logic).
        </p>

        <h3>Execution Level: ROW vs STATEMENT</h3>
        <p>
          <strong>ROW-level triggers</strong> fire once per affected row.
          <code className="inline-code">FOR EACH ROW</code>. Example: update 100 rows →
          trigger fires 100 times. Use for: operations that need per-row data (audit each
          change, validate each row). Benefits: access to OLD and NEW values (before/after
          data). Trade-offs: can be slow for bulk operations (100 rows = 100 trigger
          executions).
        </p>

        <p>
          <strong>STATEMENT-level triggers</strong> fire once per statement.
          <code className="inline-code">FOR EACH STATEMENT</code> (default). Example:
          update 100 rows → trigger fires once. Use for: operations that don't need per-row
          data (log statement execution, send one notification). Benefits: fast for bulk
          operations (100 rows = 1 trigger execution). Trade-offs: no access to OLD/NEW
          values (can't see individual row changes).
        </p>

        <p>
          Choose ROW-level when: you need to see each row's data (audit, per-row validation).
          Choose STATEMENT-level when: you only care that operation happened (log execution,
          send summary notification).
        </p>

        <h3>Trigger Functions</h3>
        <p>
          Triggers execute <strong>trigger functions</strong> (special functions with access
          to trigger context). Function has access to: <strong>OLD</strong> (row before
          change, for UPDATE/DELETE), <strong>NEW</strong> (row after change, for
          INSERT/UPDATE), <strong>TG_OP</strong> (operation type: INSERT/UPDATE/DELETE),
          <strong>TG_TABLE_NAME</strong> (table name), <strong>TG_WHEN</strong> (BEFORE/AFTER).
        </p>

        <p>
          Example trigger function: <code className="inline-code">CREATE FUNCTION
          log_change() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'INSERT' THEN INSERT INTO
          audit_log (table_name, operation, new_data) VALUES (TG_TABLE_NAME, TG_OP,
          row_to_json(NEW)); RETURN NEW; ELSIF TG_OP = 'UPDATE' THEN INSERT INTO audit_log
          (table_name, operation, old_data, new_data) VALUES (TG_TABLE_NAME, TG_OP,
          row_to_json(OLD), row_to_json(NEW)); RETURN NEW; ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO audit_log (table_name, operation, old_data) VALUES (TG_TABLE_NAME,
          TG_OP, row_to_json(OLD)); RETURN OLD; END IF; END; $$ LANGUAGE plpgsql</code>.
          Function logs all changes (INSERT/UPDATE/DELETE) to audit_log table.
        </p>

        <h3>Trigger Metadata</h3>
        <p>
          Triggers have metadata: <strong>TG_NAME</strong> (trigger name),
          <strong>TG_TABLE_NAME</strong> (table name), <strong>TG_TABLE_SCHEMA</strong>
          (schema name), <strong>TG_OP</strong> (operation: INSERT/UPDATE/DELETE),
          <strong>TG_WHEN</strong> (BEFORE/AFTER/INSTEAD OF), <strong>TG_LEVEL</strong>
          (ROW/STATEMENT). Use metadata for: dynamic logging (which table changed),
          conditional logic (different handling per operation).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/triggers-use-cases.svg`}
          caption="Figure 2: Triggers Use Cases and Best Practices. Primary Use Cases: Audit Logging (track all changes, who changed what, when changed, old vs new values, compliance like SOX/GDPR), Data Validation (complex business rules, cross-table validation, prevent invalid data, enforce constraints, BEFORE triggers), Derived Data (auto-update totals, maintain counters, update summaries, keep denormalized data, AFTER triggers). Trigger Best Practices: Keep Simple (fast execution), Avoid Recursion (no circular triggers), Document Well (purpose, timing), Test Thoroughly (edge cases). Anti-patterns: complex logic in triggers (hard to debug), triggers calling triggers (recursion), hidden side effects (unclear behavior), slow triggers (block operations), business logic in triggers (hard to test/maintain)."
          alt="Triggers use cases and best practices"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Audit &amp; Derived Data</h2>

        <h3>Audit Logging with Triggers</h3>
        <p>
          Triggers are ideal for <strong>audit logging</strong>: track all changes to
          sensitive tables. Create audit table: <code className="inline-code">CREATE TABLE
          audit_log (id SERIAL, table_name TEXT, operation TEXT, old_data JSONB, new_data
          JSONB, changed_at TIMESTAMP, changed_by TEXT)</code>. Create trigger function
          (log_change from above). Create triggers for each table:
          <code className="inline-code">CREATE TRIGGER audit_users AFTER INSERT OR UPDATE
          OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION log_change()</code>.
        </p>

        <p>
          Benefits: <strong>Automatic</strong> (all changes logged, can't forget),
          <strong>Consistent</strong> (same logging for all operations),
          <strong>Complete</strong> (old and new values captured), <strong>Compliance</strong>
          (meets SOX, GDPR requirements). Trade-offs: <strong>Storage</strong> (audit table
          grows), <strong>Performance</strong> (extra INSERT per operation),
          <strong>Complexity</strong> (debugging trigger issues).
        </p>

        <p>
          Best practices: <strong>Async logging</strong> (use queue, not direct INSERT),
          <strong>Partition audit table</strong> (by date, for performance),
          <strong>Retention policy</strong> (delete old logs), <strong>Index audit
          table</strong> (for querying).
        </p>

        <h3>Derived Data with Triggers</h3>
        <p>
          Triggers maintain <strong>derived data</strong>: auto-update totals, counters,
          summaries. Example: order total in orders table (derived from order_items).
          <code className="inline-code">CREATE FUNCTION update_order_total() RETURNS TRIGGER
          AS $$ BEGIN UPDATE orders SET total = (SELECT SUM(quantity * price) FROM
          order_items WHERE order_id = NEW.order_id) WHERE id = NEW.order_id; RETURN NEW;
          END; $$ LANGUAGE plpgsql</code>. Trigger:
          <code className="inline-code">CREATE TRIGGER maintain_order_total AFTER INSERT OR
          UPDATE OR DELETE ON order_items FOR EACH ROW EXECUTE FUNCTION
          update_order_total()</code>.
        </p>

        <p>
          Benefits: <strong>Always current</strong> (total updated automatically),
          <strong>Fast queries</strong> (read total from orders, don't aggregate),
          <strong>Consistent</strong> (can't have mismatched total). Trade-offs:
          <strong>Write overhead</strong> (extra UPDATE per item change),
          <strong>Complexity</strong> (trigger logic must handle INSERT/UPDATE/DELETE).
        </p>

        <p>
          Use for: <strong>Counters</strong> (post count, follower count),
          <strong>Totals</strong> (order total, account balance), <strong>Summaries</strong>
          (daily stats, aggregated metrics). Avoid for: <strong>Complex aggregations</strong>
          (use materialized views), <strong>Cross-database data</strong> (triggers can't
          access other databases).
        </p>

        <h3>Data Validation with Triggers</h3>
        <p>
          BEFORE triggers enforce <strong>complex validation</strong>: cross-table checks,
          business rules. Example: prevent order if customer is suspended.
          <code className="inline-code">CREATE FUNCTION check_customer_status() RETURNS
          TRIGGER AS $$ BEGIN IF (SELECT status FROM customers WHERE id = NEW.customer_id)
          = 'suspended' THEN RAISE EXCEPTION 'Customer is suspended'; END IF; RETURN NEW;
          END; $$ LANGUAGE plpgsql</code>. Trigger:
          <code className="inline-code">CREATE TRIGGER validate_customer BEFORE INSERT ON
          orders FOR EACH ROW EXECUTE FUNCTION check_customer_status()</code>.
        </p>

        <p>
          Benefits: <strong>Enforced at database level</strong> (can't bypass),
          <strong>Consistent</strong> (all applications get same validation),
          <strong>Atomic</strong> (validation and insert in same transaction). Trade-offs:
          <strong>Hidden logic</strong> (application doesn't see validation),
          <strong>Hard to test</strong> (database-side logic), <strong>Performance</strong>
          (extra query per insert).
        </p>

        <p>
          Use for: <strong>Critical rules</strong> (can't be bypassed),
          <strong>Cross-table validation</strong> (check related tables),
          <strong>Complex constraints</strong> (beyond CHECK constraints). Avoid for:
          <strong>Business logic</strong> (belongs in application), <strong>Simple
          validation</strong> (use CHECK constraints), <strong>User-facing validation</strong>
          (validate in application for better error messages).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/triggers-tradeoffs.svg`}
          caption="Figure 3: Triggers Performance and Trade-offs showing Performance Impact: Automatic Execution (no application code needed - ✓), Adds Overhead (every operation fires trigger - ⚠), Can Block Operations (slow trigger = slow operation - ✗). Trade-offs Summary: Benefits (automatic, centralized, consistent), Drawbacks (hidden logic, hard to debug, overhead). When to Use vs Avoid: Use When (audit logging, derived data) vs Avoid When (business logic, complex rules). Key takeaway: Triggers are powerful for audit logging and derived data, but use sparingly. Hidden logic makes debugging hard. Keep triggers simple and fast. Prefer application logic for business rules."
          alt="Triggers performance and trade-offs"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Triggers vs Application Logic</h2>

        <p>
          The fundamental question: should logic be in triggers (database) or in application?
          Understanding the trade-offs helps you make the right choice.
        </p>

        <h3>Trigger Strengths</h3>
        <p>
          <strong>Automatic execution</strong> is the primary advantage. Triggers fire
          automatically—no application code needed. Can't forget to call trigger (it's
          automatic). Benefits: consistent behavior (all applications get same logic),
          can't bypass (trigger always fires).
        </p>

        <p>
          <strong>Centralized logic</strong>: Define once, all applications inherit. No
          duplication (same logic in multiple apps). Single source of truth (consistent
          behavior across apps).
        </p>

        <p>
          <strong>Data integrity</strong>: Triggers enforce rules at database level. Can't
          bypass (direct SQL access still fires trigger). Atomic (trigger runs in same
          transaction as operation).
        </p>

        <p>
          <strong>Audit trail</strong>: Triggers automatically log all changes. Complete
          audit trail (who, what, when). Compliance (SOX, GDPR requirements met).
        </p>

        <h3>Trigger Limitations</h3>
        <p>
          <strong>Hidden logic</strong>: Triggers fire silently. Application doesn't see
          trigger execution. Hard to understand system behavior (what triggers fire?).
          Debugging is challenging (trace trigger chain).
        </p>

        <p>
          <strong>Testing complexity</strong>: Database code is harder to test than
          application code. Requires database setup/teardown, harder to mock, slower test
          execution. Unit testing triggers is challenging.
        </p>

        <p>
          <strong>Performance overhead</strong>: Every operation fires trigger (5-20%
          overhead). Bulk operations are slow (ROW-level triggers fire per row). Slow
          triggers block operations (trigger must complete before operation completes).
        </p>

        <p>
          <strong>Maintenance challenges</strong>: Trigger logic is scattered (one trigger
          per table). Hard to see full picture (what triggers exist?). Version control for
          triggers is harder (migrations, rollbacks).
        </p>

        <p>
          <strong>Recursion risk</strong>: Trigger modifies table → fires another trigger
          → modifies original table → infinite loop. Must carefully design (avoid circular
          triggers).
        </p>

        <h3>Application Logic Strengths</h3>
        <p>
          <strong>Visible logic</strong>: Application code is explicit (see what happens).
          Easy to trace execution flow. Debugging is straightforward (IDE support,
          breakpoints).
        </p>

        <p>
          <strong>Easy to test</strong>: Application code can be unit tested, mocked,
          tested in isolation. Fast test execution (no database needed). CI/CD integration
          is straightforward.
        </p>

        <p>
          <strong>Scalable</strong>: Logic runs on application servers (can scale
          horizontally). Database is not bottleneck for logic execution.
        </p>

        <p>
          <strong>Maintainable</strong>: Version control (Git), code review, deployment
          pipelines are standard. Easy to track changes, rollback.
        </p>

        <h3>When to Use Triggers</h3>
        <p>
          Use triggers for: <strong>Audit logging</strong> (track all changes automatically),
          <strong>Derived data</strong> (auto-update totals, counters), <strong>Critical
          validation</strong> (can't be bypassed, cross-table checks),
          <strong>Notifications</strong> (alert on critical changes), <strong>Legacy
          systems</strong> (existing trigger-based architecture).
        </p>

        <p>
          Avoid triggers for: <strong>Business logic</strong> (rules, validation—use
          application), <strong>Complex operations</strong> (slow triggers block operations),
          <strong>User-facing features</strong> (hard to iterate, test),
          <strong>Cross-database operations</strong> (triggers are database-specific).
        </p>

        <h3>Hybrid Approach</h3>
        <p>
          Use <strong>both</strong> strategically:
        </p>

        <p>
          <strong>Database (triggers)</strong> for: Audit logging (automatic, complete),
          derived data (auto-update totals), critical validation (can't bypass), data
          integrity (enforce rules).
        </p>

        <p>
          <strong>Application</strong> for: Business logic (rules, validation), user-facing
          features (easy to iterate), most validation (better error messages), complex
          operations (easier to test).
        </p>

        <p>
          Example: E-commerce order. Application: validate input, check business rules,
          calculate prices. Database (trigger): log order change (audit), update order
          total (derived data), check inventory (critical validation). Hybrid: application
          handles business logic, trigger handles audit and derived data.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Triggers</h2>

        <p>
          <strong>Keep triggers simple.</strong> Triggers should do one thing well (log
          change, update total). Complex logic belongs in application (easier to test,
          maintain). Limit: 10-20 lines of code per trigger.
        </p>

        <p>
          <strong>Avoid recursion.</strong> Trigger A modifies table → triggers Trigger B
          → modifies table A → infinite loop. Solution: design carefully (no circular
          triggers), use recursion limits (max recursion depth), document trigger chains.
        </p>

        <p>
          <strong>Document well.</strong> Document trigger purpose, timing (BEFORE/AFTER),
          level (ROW/STATEMENT), what it does.
          <code className="inline-code">COMMENT ON TRIGGER audit_orders IS 'Logs all
          order changes to audit_log table. Fires AFTER INSERT/UPDATE/DELETE. ROW
          level.'</code>. Helps developers understand trigger behavior.
        </p>

        <p>
          <strong>Test thoroughly.</strong> Write tests for triggers (test normal cases,
          edge cases, error conditions). Test recursion (ensure no infinite loops). Test
          performance (trigger doesn't slow operations too much).
        </p>

        <p>
          <strong>Use STATEMENT-level when possible.</strong> ROW-level fires per row
          (100 rows = 100 executions). STATEMENT-level fires once (100 rows = 1 execution).
          Use ROW-level only when you need per-row data (OLD/NEW values).
        </p>

        <p>
          <strong>Keep triggers fast.</strong> Triggers block operations (must complete
          before operation completes). Avoid: long queries, external API calls, complex
          calculations. Use: simple queries, indexed lookups, minimal logic.
        </p>

        <p>
          <strong>Handle errors.</strong> Triggers should handle errors gracefully (log
          error, don't crash operation). Use exception handlers (TRY/CATCH). Decide: should
          error rollback operation? (usually yes for validation, no for logging).
        </p>

        <p>
          <strong>Monitor trigger performance.</strong> Track trigger execution time,
          frequency. Alert on slow triggers (may need optimization). Review execution
          plans (ensure indexes are used).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Complex logic in triggers.</strong> Putting business rules in triggers
          (hard to test, maintain, debug). Solution: Keep triggers simple (audit, derived
          data), put business logic in application.
        </p>

        <p>
          <strong>Triggers calling triggers (recursion).</strong> Trigger A modifies table
          → triggers Trigger B → modifies table A → infinite loop. Solution: design carefully
          (no circular triggers), use recursion limits, document trigger chains, test for
          recursion.
        </p>

        <p>
          <strong>Hidden side effects.</strong> Trigger does something unexpected (update
          unrelated table, send notification). Application doesn't know trigger fired.
          Solution: document triggers well, keep triggers focused (one purpose), avoid
          surprises (don't modify unrelated data).
        </p>

        <p>
          <strong>Slow triggers blocking operations.</strong> Trigger takes long time
          (complex query, external API call) → operation blocks. Solution: keep triggers
          fast (simple queries, indexed lookups), avoid external calls, use async logging
          (queue, not direct INSERT).
        </p>

        <p>
          <strong>Business logic in triggers.</strong> Validation, rules, calculations in
          triggers (hard to test, maintain). Solution: Put business logic in application
          (easy to test, iterate), use triggers only for audit, derived data, critical
          validation.
        </p>

        <p>
          <strong>No error handling.</strong> Triggers that don't handle errors (exceptions
          propagate, operation fails unexpectedly). Solution: Always handle errors (TRY/CATCH),
          decide on rollback behavior (rollback for validation, continue for logging), log
          errors (for debugging).
        </p>

        <p>
          <strong>ROW-level for bulk operations.</strong> ROW-level trigger fires per row
          (10,000 rows = 10,000 executions). Very slow for bulk operations. Solution: Use
          STATEMENT-level for bulk operations (fires once), or disable triggers during bulk
          load (re-enable after).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Audit Logging: Financial Transactions</h3>
        <p>
          Banking system uses triggers for audit logging:
          <code className="inline-code">CREATE TRIGGER audit_transactions AFTER INSERT OR
          UPDATE OR DELETE ON transactions FOR EACH ROW EXECUTE FUNCTION log_change()</code>.
          Every transaction change is logged (who, what, when, old/new values). Benefits:
          complete audit trail (compliance), automatic (can't forget), consistent (all
          changes logged).
        </p>

        <h3>Derived Data: Order Total</h3>
        <p>
          E-commerce maintains order total with trigger:
          <code className="inline-code">CREATE TRIGGER maintain_order_total AFTER INSERT
          OR UPDATE OR DELETE ON order_items FOR EACH ROW EXECUTE FUNCTION
          update_order_total()</code>. Order total is auto-updated when items change.
          Benefits: always current (no stale totals), fast queries (read total, don't
          aggregate), consistent (can't have mismatched total).
        </p>

        <h3>Validation: Inventory Check</h3>
        <p>
          Inventory system uses BEFORE trigger for validation:
          <code className="inline-code">CREATE TRIGGER check_inventory BEFORE INSERT ON
          orders FOR EACH ROW EXECUTE FUNCTION verify_stock()</code>. Trigger checks if
          sufficient stock exists, raises exception if not (order rejected). Benefits:
          enforced at database level (can't bypass), consistent (all orders checked),
          atomic (check and insert in same transaction).
        </p>

        <h3>Notification: Critical Changes</h3>
        <p>
          Healthcare system uses trigger for notifications:
          <code className="inline-code">CREATE TRIGGER notify_critical AFTER UPDATE ON
          patient_records FOR EACH ROW EXECUTE FUNCTION notify_on_critical_change()</code>.
          Trigger sends alert when critical patient data changes (lab results, medications).
          Benefits: automatic (no missed notifications), immediate (real-time alerts),
          consistent (all critical changes notified).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: What are database triggers? When would you use them?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Triggers are automatic actions that execute in
              response to events (INSERT/UPDATE/DELETE) on a table. Types: BEFORE (fire
              before operation - validate/modify), AFTER (fire after - log/notify),
              INSTEAD OF (replace operation - views). Levels: ROW (per row), STATEMENT
              (per statement). Use for: audit logging (track all changes automatically),
              derived data (auto-update totals, counters), critical validation (can't
              bypass), notifications (alert on changes). Avoid for: business logic (hard
              to test/maintain), complex operations (slow triggers block), user-facing
              features (hard to iterate).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the difference between ROW and STATEMENT
              level? Answer: ROW fires once per affected row (100 rows = 100 executions).
              STATEMENT fires once per statement (100 rows = 1 execution). Use ROW when
              you need per-row data (OLD/NEW values). Use STATEMENT for bulk operations
              (faster).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: How do triggers impact performance? How do you optimize slow triggers?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Triggers add overhead (5-20% per operation). Every
              operation fires trigger (extra work). ROW-level triggers fire per row (10,000
              rows = 10,000 executions - slow). Slow triggers block operations (must
              complete before operation completes). Optimize: (1) Keep triggers simple
              (minimal logic), (2) Use indexes (trigger queries use indexes), (3) Use
              STATEMENT-level when possible (fires once vs per row), (4) Avoid external
              calls (API, network), (5) Batch operations (disable triggers during bulk
              load, re-enable after).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When would you disable triggers? Answer: During
              bulk data migration/load (triggers slow down bulk operations). Disable:
              <code className="inline-code">ALTER TABLE orders DISABLE TRIGGER ALL</code>.
              Load data. Re-enable: <code className="inline-code">ALTER TABLE orders
              ENABLE TRIGGER ALL</code>. Trade-off: no trigger benefits during load (no
              audit, no derived data updates).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What is trigger recursion? How do you prevent it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Trigger recursion: Trigger A modifies table →
              triggers Trigger B → modifies table A → triggers Trigger A → infinite loop.
              Example: orders trigger updates inventory → inventory trigger updates order
              status → orders trigger fires again → loop. Prevent: (1) Design carefully
              (no circular triggers), (2) Use recursion limits (max recursion depth -
              PostgreSQL has max_recursive_depth), (3) Document trigger chains (know what
              fires what), (4) Test for recursion (simulate trigger chain), (5) Use flags
              (set flag to prevent re-entry).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you debug trigger recursion? Answer:
              Enable trigger logging (log when trigger fires), trace trigger chain (A →
              B → C → A), identify cycle, break cycle (remove one trigger, redesign).
              PostgreSQL: <code className="inline-code">SET log_min_messages = 'debug'</code>
              to see trigger execution.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: How do you implement audit logging with triggers?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Create audit table:
              <code className="inline-code">CREATE TABLE audit_log (id SERIAL, table_name
              TEXT, operation TEXT, old_data JSONB, new_data JSONB, changed_at TIMESTAMP,
              changed_by TEXT)</code>. Create trigger function (log_change - logs OLD/NEW
              values). Create triggers for each table:
              <code className="inline-code">CREATE TRIGGER audit_users AFTER INSERT OR
              UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION log_change()</code>.
              Benefits: automatic (all changes logged), complete (old and new values),
              consistent (same logging for all tables), compliant (meets audit requirements).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you optimize audit logging performance?
              Answer: (1) Async logging (use queue, not direct INSERT), (2) Partition
              audit table (by date, for performance), (3) Retention policy (delete old
              logs), (4) Index audit table (for querying), (5) Batch audit writes (buffer
              multiple changes).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: What's the difference between BEFORE and AFTER triggers? When would you
              use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> BEFORE triggers fire before operation executes. Use
              for: validation (reject invalid data), modification (change data before
              insert/update). Example: validate email format before insert (reject if
              invalid). AFTER triggers fire after operation completes. Use for: logging
              (record what changed), notifications (alert on changes), derived data (update
              totals). Example: log order creation after insert (audit trail). Key
              difference: BEFORE can prevent/modify operation, AFTER can only react (operation
              already committed).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Can AFTER triggers rollback the operation?
              Answer: No. AFTER triggers fire after operation is committed. Exception in
              AFTER trigger rolls back trigger, but not original operation (already
              committed). Use BEFORE triggers if you need to prevent operation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your trigger is causing performance issues. How do you diagnose and fix
              it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check trigger execution time (how long
              trigger takes), (2) Check trigger frequency (how often it fires - ROW-level
              fires per row), (3) Check trigger logic (complex queries, missing indexes),
              (4) Check for recursion (trigger chain causing multiple executions). Fix:
              (1) Simplify trigger logic (remove complex operations), (2) Add indexes
              (trigger queries use indexes), (3) Change ROW to STATEMENT level (if per-row
              data not needed), (4) Use async logging (queue, not direct INSERT), (5)
              Disable during bulk operations (re-enable after). Trade-off: trigger benefits
              vs performance.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When should you NOT use triggers? Answer: For
              business logic (hard to test/maintain), complex operations (slow triggers
              block), user-facing features (hard to iterate), cross-database operations
              (triggers are database-specific). Use application logic instead.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            PostgreSQL Documentation, "Triggers,"
            https://www.postgresql.org/docs/current/sql-createtrigger.html
          </li>
          <li>
            MySQL Documentation, "Triggers,"
            https://dev.mysql.com/doc/refman/8.0/en/triggers.html
          </li>
          <li>
            SQL Server Documentation, "Triggers,"
            https://docs.microsoft.com/en-us/sql/relational-databases/triggers/
          </li>
          <li>
            Oracle Documentation, "Database Triggers,"
            https://docs.oracle.com/en/database/oracle/oracle-database/
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapter 5.
          </li>
          <li>
            Use The Index, Luke, "Triggers,"
            https://use-the-index-luke.com/
          </li>
          <li>
            CMU Database Group, "Triggers" (YouTube lectures),
            https://www.youtube.com/c/CMUDatabaseGroup
          </li>
          <li>
            Brent Ozar, "SQL Server Triggers,"
            https://www.brentozar.com/archive/sql-server-triggers/
          </li>
          <li>
            Percona Blog, "Trigger Best Practices,"
            https://www.percona.com/blog/
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

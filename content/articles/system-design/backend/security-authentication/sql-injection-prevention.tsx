"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-sql-injection-prevention-extensive",
  title: "SQL Injection Prevention",
  description:
    "Staff-level deep dive into SQL injection attack vectors, parameterized queries, ORM security, least-privilege database accounts, and the operational practice of preventing SQLi at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "sql-injection-prevention",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "sql-injection", "database", "parameterized-queries"],
  relatedTopics: ["xss-prevention", "input-validation-sanitization", "api-security", "encryption"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition and Context
          ============================================================ */}
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>SQL Injection (SQLi)</strong> is a code injection attack where an attacker inserts malicious SQL
          statements into input fields, causing the database to execute unintended SQL commands. SQL injection
          exploits vulnerabilities that occur when user input is concatenated directly into SQL queries without
          proper sanitization or parameterization — the attacker&apos;s input becomes part of the SQL structure rather
          than just data.
        </p>
        <p>
          SQL injection is consistently ranked as the most dangerous web application vulnerability. According to
          OWASP, SQL injection is the number one risk in the OWASP Top 10 because it can lead to complete database
          compromise — an attacker can read, modify, or delete any data in the database, bypass authentication,
          execute operating system commands (through xp_cmdshell or similar), and in some cases gain full control
          of the database server. SQL injection has been responsible for some of the largest data breaches in
          history, including the 2008 Heartland Payment Systems breach (130 million credit cards) and the 2017
          Equifax breach (147 million records).
        </p>
        <p>
          There are several types of SQL injection: in-band SQLi (the attacker receives results directly in the
          response, either through error messages or UNION-based extraction), blind SQLi (the attacker infers data
          from true/false responses or response timing, without direct output), and out-of-band SQLi (the attacker
          receives results through a different channel, such as DNS or HTTP requests). Each type requires different
          exploitation techniques, but the same prevention strategies apply to all.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">What SQL Injection Can Do</h3>
          <p className="text-muted mb-3">
            <strong>Authentication bypass:</strong> Input: &apos; OR &apos;1&apos;=&apos;1&apos; -- results in a query that always returns a user, allowing the attacker to log in without valid credentials.
          </p>
          <p className="text-muted mb-3">
            <strong>Data exfiltration:</strong> UNION SELECT allows the attacker to extract data from any table — usernames, passwords, credit cards, PII.
          </p>
          <p className="text-muted mb-3">
            <strong>Data modification:</strong> UPDATE, INSERT, DELETE statements can modify or destroy data, causing data loss or corruption.
          </p>
          <p className="text-muted mb-3">
            <strong>Database structure discovery:</strong> Access to information_schema (MySQL) or sys.tables (SQL Server) reveals table names, column names, and data types.
          </p>
          <p>
            <strong>Operating system command execution:</strong> xp_cmdshell (SQL Server), INTO OUTFILE (MySQL), or COPY TO PROGRAM (PostgreSQL) can execute OS commands, giving the attacker full server control.
          </p>
        </div>
        <p>
          The evolution of SQL injection prevention has been shaped by increasingly sophisticated attacks. Early
          defenses relied on input filtering (escaping quotes, stripping keywords), which was easily bypassed
          (encoding tricks, comment sequences, stacked queries). The modern approach is parameterized queries
          (prepared statements) — they separate SQL structure from data, making injection impossible regardless of
          input content. Additionally, ORMs (Object-Relational Mappers) provide automatic parameterization for
          most queries, and defense-in-depth strategies (least-privilege database accounts, input validation, WAF)
          provide additional layers of protection.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          SQL injection occurs when user input is concatenated directly into SQL queries. For example:
          query = &quot;SELECT * FROM users WHERE username = &apos;&quot; + username + &quot;&apos; AND password = &apos;&quot; + password +
          &quot;&apos;&quot;. If the username input is &apos; OR &apos;1&apos;=&apos;1&apos; --, the resulting query becomes: SELECT * FROM users
          WHERE username = &apos;&apos; OR &apos;1&apos;=&apos;1&apos; -- &apos; AND password = &apos;...&apos;. The &apos;1&apos;=&apos;1&apos; condition is always true, so the
          query returns all users, and the attacker bypasses authentication.
        </p>
        <p>
          Parameterized queries (prepared statements) are the primary defense against SQL injection. Instead of
          concatenating user input into the SQL query, the query uses placeholders (?) for user input, and the
          input is sent separately as parameters. For example: query = &quot;SELECT * FROM users WHERE username = ?&quot;
          with params = [username]. The database parses and compiles the query structure first (without any user
          data), then binds the parameters as literal values. Because the parameters are never part of the SQL
          structure, they cannot change the query&apos;s logic — even if the input contains SQL syntax, it is treated
          as data, not as SQL commands.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/sql-injection-prevention-diagram-1.svg"
          alt="SQL injection attack flow showing authentication bypass, data exfiltration, and blind SQL injection techniques"
          caption="SQL injection: user input concatenated into SQL query allows authentication bypass (OR 1=1), data exfiltration (UNION SELECT), and blind extraction (boolean-based or time-based inference)."
        />
        <p>
          Prepared statements work by separating the SQL compilation phase from the execution phase. During the
          PREPARE phase, the database parses the SQL query, validates the syntax, and creates an execution plan —
          all without any user data. During the BIND phase, user input is bound to the placeholders as parameters.
          During the EXECUTE phase, the database runs the compiled query with the bound parameters. Because the
          parameters are never part of the SQL structure, they cannot inject SQL commands.
        </p>
        <p>
          ORMs (Object-Relational Mappers) provide automatic parameterization for most queries — when you use
          ORM methods (find, where, create, update), the ORM generates parameterized queries automatically. For
          example, User.where(username: username) in Rails or User.objects.filter(username=username) in Django
          generates a parameterized query. However, ORMs are not immune to SQL injection — if you use raw SQL
          methods (find_by_sql, raw(), execute()), you must parameterize those queries manually. ORM-based SQL
          injection is common when developers use raw SQL for complex queries without proper parameterization.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/sql-injection-prevention-diagram-2.svg"
          alt="Parameterized query vs string concatenation showing how prepared statements separate SQL structure from data"
          caption="Parameterized queries: the SQL structure is compiled first, then user data is bound as parameters. The database treats parameters as literal values, never as SQL commands, making injection impossible."
        />
        <p>
          Stored procedures can provide SQL injection protection if implemented correctly — stored procedures that
          use parameterized queries internally are safe. However, stored procedures that construct dynamic SQL
          (EXEC, EXECUTE IMMEDIATE, sp_executesql with concatenated input) are vulnerable to SQL injection. Stored
          procedures are not inherently safe — the safety depends on how they handle input.
        </p>
        <p>
          Input validation is a supplementary defense against SQL injection — validating input type, length,
          format, and range before using it in a query. For example, if a query parameter is expected to be a
          numeric ID, validate that the input is a number before using it in the query. If the input is expected
          to be an email address, validate the email format. Input validation does not prevent SQL injection on
          its own (attackers can bypass validation using encoding tricks), but it provides an additional layer of
          defense-in-depth.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The SQL injection prevention architecture consists of the parameterized query layer (which separates SQL
          structure from data), the ORM/query builder (which generates parameterized queries automatically), the
          input validator (which validates input before query execution), the database access control layer (which
          enforces least-privilege database accounts), and the WAF/monitoring layer (which detects and blocks SQL
          injection attempts). Each layer provides an independent defense, and together they provide comprehensive
          protection.
        </p>
        <p>
          The parameterized query flow begins with the application receiving user input (form data, URL parameter,
          API request body). The application constructs a parameterized query (using placeholders for user input)
          and sends the query and parameters separately to the database. The database compiles the query structure
          first, binds the parameters, and executes the compiled query with the bound parameters. The parameters
          are treated as literal values, never as SQL commands.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/sql-injection-prevention-diagram-3.svg"
          alt="SQL injection defense-in-depth showing parameterized queries, ORM, least privilege, input validation, and WAF/monitoring layers"
          caption="Defense-in-depth: parameterized queries prevent SQLi at source, ORM adds abstraction layer, least privilege limits blast radius, input validation catches malformed input, and WAF/monitoring detects attempted attacks."
        />
        <p>
          The ORM flow begins with the application using ORM methods (find, where, create, update, delete) to
          interact with the database. The ORM translates the ORM method into a parameterized SQL query and sends
          it to the database. For example, User.where(username: username) translates to SELECT * FROM users WHERE
          username = ? with params = [username]. The ORM handles parameterization automatically, so the developer
          does not need to worry about SQL injection for ORM-generated queries.
        </p>
        <p>
          The least-privilege database account flow begins with the application connecting to the database using a
          dedicated database account. The account is granted only the permissions necessary for the application&apos;s
          function — for example, a read-only account for read-only queries, a read-write account for queries that
          modify data, and no DROP, ALTER, or GRANT permissions. If SQL injection occurs, the attacker is limited
          to the permissions of the database account — they cannot drop tables, modify schema, or create new
          users.
        </p>
        <p>
          The WAF and monitoring flow begins with the WAF inspecting incoming requests for SQL injection patterns
          (UNION SELECT, DROP TABLE, information_schema access, comment sequences). If a pattern is detected, the
          WAF blocks the request and logs the attempt. Additionally, the application logs all database queries and
          monitors for anomalous patterns (queries accessing unexpected tables, queries with unusual syntax,
          queries that return unusually large result sets). Monitoring enables early detection of SQL injection
          attempts, even if the injection is successful.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Parameterized queries versus stored procedures is a trade-off between flexibility and control.
          Parameterized queries are flexible — they can be used for any SQL query, including complex joins,
          subqueries, and aggregations. Stored procedures encapsulate SQL logic on the database side, providing
          an additional layer of abstraction. However, stored procedures are database-specific (not portable),
          harder to test and debug, and can become a bottleneck if they contain complex logic. The recommended
          approach is parameterized queries in the application layer, with stored procedures only for
          database-specific optimizations (e.g., bulk operations, complex aggregations).
        </p>
        <p>
          ORM versus raw SQL is a trade-off between productivity and control. ORMs provide automatic
          parameterization, database abstraction (write once, run on any database), and productivity
          (less boilerplate code). However, ORMs can generate inefficient queries (N+1 queries, unnecessary
          JOINs) and are not suitable for complex queries (reporting, analytics). Raw SQL provides full control
          over query performance and complexity but requires manual parameterization. The recommended approach is
          ORM for most queries (CRUD operations, simple joins) and raw parameterized queries for complex queries
          (reporting, analytics, bulk operations).
        </p>
        <p>
          Input validation versus output encoding is a trade-off between prevention and mitigation. Input
          validation prevents malicious input from entering the system — it rejects obviously malicious content
          before it reaches the database. Output encoding (parameterization) ensures that even malicious input
          cannot execute as SQL. Input validation is the first line of defense but is not sufficient on its own
          (attackers can bypass validation using encoding tricks). Parameterization is the primary defense and
          is sufficient on its own, but input validation provides an additional layer of defense-in-depth.
        </p>
        <p>
          WAF versus application-level SQLi prevention is a trade-off between operational simplicity and
          reliability. WAF provides out-of-the-box SQL injection protection — it detects and blocks known SQLi
          patterns without requiring application changes. However, WAF can be bypassed (encoding tricks, novel
          attack patterns) and generates false positives (blocking legitimate requests). Application-level
          prevention (parameterized queries) is more reliable — it prevents SQL injection at the source,
          regardless of attack pattern. The recommended approach is application-level prevention as the primary
          defense, with WAF as a supplementary layer.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use parameterized queries for all database queries — never concatenate user input into SQL queries. Use
          prepared statements (PreparedStatement in Java, cursor.execute(query, params) in Python,
          connection.query(query, params) in Node.js) for all queries that include user input. Parameterized
          queries are the single most effective defense against SQL injection.
        </p>
        <p>
          Use ORM methods (find, where, create, update, delete) for most queries — ORMs generate parameterized
          queries automatically, reducing the risk of SQL injection. Only use raw SQL methods when necessary
          (complex queries, reporting, analytics), and always parameterize raw SQL queries manually.
        </p>
        <p>
          Use least-privilege database accounts — the application should connect to the database using a dedicated
          account with only the permissions necessary for its function. Read-only accounts for read-only queries,
          read-write accounts for queries that modify data, and no DROP, ALTER, or GRANT permissions. If SQL
          injection occurs, the attacker is limited to the permissions of the database account.
        </p>
        <p>
          Validate input type, length, format, and range before using it in a query — validate numeric IDs as
          numbers, email addresses as emails, and strings against expected patterns. Input validation does not
          prevent SQL injection on its own, but it provides an additional layer of defense-in-depth and catches
          malformed input early.
        </p>
        <p>
          Monitor database queries for anomalous patterns — log all queries and monitor for queries accessing
          unexpected tables, queries with unusual syntax, and queries that return unusually large result sets.
          Alert on SQL injection patterns (UNION SELECT, DROP TABLE, information_schema access, comment
          sequences). Early detection enables rapid response before significant data is exfiltrated.
        </p>
        <p>
          Use a WAF as a supplementary defense — configure the WAF to detect and block known SQL injection
          patterns. Monitor WAF logs for blocked attempts and investigate the source. Do not rely on the WAF as
          the primary defense — it can be bypassed and generates false positives. Use the WAF in conjunction with
          parameterized queries, not as a replacement.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Concatenating user input into SQL queries is the most common SQL injection pitfall. Even if the input
          is validated or sanitized, concatenation is vulnerable to SQL injection — attackers can bypass
          validation using encoding tricks, alternative syntaxes, or novel attack patterns. The fix is to use
          parameterized queries — never concatenate user input into SQL queries.
        </p>
        <p>
          Using raw SQL methods in ORM without parameterization is a common pitfall. ORM raw SQL methods
          (find_by_sql, raw(), execute()) do not automatically parameterize — if you concatenate user input into
          raw SQL, it is vulnerable to SQL injection. The fix is to use parameterized raw SQL methods
          (find_by_sql with params, raw() with bindings, execute() with parameters).
        </p>
        <p>
          Using stored procedures with dynamic SQL is a common pitfall. Stored procedures that construct dynamic
          SQL (EXEC, EXECUTE IMMEDIATE, sp_executesql with concatenated input) are vulnerable to SQL injection.
          The fix is to use parameterized stored procedures — stored procedures that use parameters for user input,
          not dynamic SQL construction.
        </p>
        <p>
          Using overly privileged database accounts is a common pitfall. If the application connects to the
          database using an admin account (with DROP, ALTER, GRANT permissions), SQL injection gives the attacker
          full database control. The fix is to use least-privilege database accounts — the application account
          should have only the permissions necessary for its function.
        </p>
        <p>
          Relying solely on WAF for SQL injection prevention is a common pitfall. WAF can be bypassed (encoding
          tricks, novel attack patterns) and generates false positives. The fix is to use parameterized queries as
          the primary defense, with WAF as a supplementary layer. WAF should never be the only defense against SQL
          injection.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses parameterized queries for all database queries — the application uses
          PreparedStatement (Java) for all queries that include user input (search, login, checkout, profile
          updates). The platform uses ORM (Hibernate) for CRUD operations and raw parameterized queries for
          complex reporting queries. The platform uses least-privilege database accounts — the application account
          has SELECT, INSERT, UPDATE, DELETE permissions on application tables, but no DROP, ALTER, or GRANT
          permissions. The platform monitors database queries for anomalous patterns and alerts on SQL injection
          attempts.
        </p>
        <p>
          A financial services company uses ORM (SQLAlchemy) for most database queries, with raw parameterized
          queries for complex reporting and analytics. The company uses least-privilege database accounts — the
          application account has SELECT permissions on a read-only replica for read queries, and SELECT, INSERT,
          UPDATE permissions on the primary database for write queries. The company monitors database queries and
          WAF logs for SQL injection attempts and has an incident response plan for SQL injection breaches.
        </p>
        <p>
          A healthcare organization uses parameterized queries for all database queries in its patient management
          system — the application uses cursor.execute(query, params) (Python) for all queries that include user
          input (patient search, appointment scheduling, record updates). The organization uses least-privilege
          database accounts — the application account has SELECT, INSERT, UPDATE permissions on patient tables,
          but no DROP, ALTER, or GRANT permissions. The organization monitors database queries for anomalous
          patterns and has achieved HIPAA compliance in part due to its SQL injection prevention controls.
        </p>
        <p>
          A SaaS platform uses a combination of ORM (Sequelize) for CRUD operations, parameterized raw SQL for
          complex queries, and input validation for all user input. The platform uses least-privilege database
          accounts — the application account has SELECT, INSERT, UPDATE, DELETE permissions on application tables,
          but no DROP, ALTER, or GRANT permissions. The platform uses a WAF as a supplementary defense and
          monitors WAF logs for SQL injection attempts. The platform has achieved SOC 2 compliance in part due to
          its SQL injection prevention controls.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: How do parameterized queries prevent SQL injection?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Parameterized queries separate SQL structure from data. The database compiles the SQL query structure first (without any user data), then binds user input as parameters. Because the parameters are never part of the SQL structure, they cannot change the query&apos;s logic — even if the input contains SQL syntax, it is treated as data, not as SQL commands.
            </p>
            <p>
              For example, if the query is &quot;SELECT * FROM users WHERE username = ?&quot; and the input is &apos; OR &apos;1&apos;=&apos;1&apos; --, the database treats the input as a literal string value (the username is literally &apos; OR &apos;1&apos;=&apos;1&apos; --), not as SQL logic. The query searches for a user with that exact username, which does not exist, and returns no results.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: Can ORM prevent SQL injection?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              ORM prevents SQL injection for queries generated by ORM methods (find, where, create, update, delete) — these methods automatically generate parameterized queries. However, ORM does not prevent SQL injection for raw SQL methods (find_by_sql, raw(), execute()) — if you concatenate user input into raw SQL, it is vulnerable to SQL injection.
            </p>
            <p>
              ORM-based SQL injection is common when developers use raw SQL for complex queries without proper parameterization. The fix is to use parameterized raw SQL methods — most ORMs support parameterized raw SQL (e.g., find_by_sql with params, raw() with bindings).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is blind SQL injection, and how do you prevent it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Blind SQL injection occurs when the application does not return query results or error messages directly, so the attacker infers data from true/false responses (boolean-based) or response timing (time-based). For example, the attacker injects &apos; AND 1=1 -- (true) and &apos; AND 1=2 -- (false) and observes the difference in the application&apos;s response to infer data character by character.
            </p>
            <p>
              Blind SQL injection is prevented by the same defense as other SQL injection types — parameterized queries. Because parameterized queries prevent SQL injection at the source, blind SQL injection is also prevented. Additionally, input validation and least-privilege database accounts provide supplementary protection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: Why is least-privilege database access important for SQL injection prevention?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Least-privilege database access limits the damage if SQL injection occurs. If the application connects to the database using an admin account (with DROP, ALTER, GRANT permissions), SQL injection gives the attacker full database control — they can drop tables, modify schema, create new users, and access any data. If the application connects using a least-privilege account (with only SELECT, INSERT, UPDATE permissions on specific tables), SQL injection is limited to those operations.
            </p>
            <p>
              Least-privilege database access does not prevent SQL injection, but it limits the blast radius — the attacker cannot drop tables, modify schema, or access data outside the application&apos;s scope. This is defense-in-depth — parameterized queries prevent SQL injection at the source, and least-privilege accounts limit the damage if prevention fails.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you detect SQL injection attempts in production?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Monitor database query logs for anomalous patterns — queries accessing unexpected tables (information_schema, sys.tables), queries with unusual syntax (UNION SELECT, comment sequences, stacked queries), and queries that return unusually large result sets. Monitor WAF logs for blocked SQL injection attempts. Monitor application error logs for SQL errors (syntax errors, permission denied) which may indicate SQL injection attempts.
            </p>
            <p>
              Set up alerts for SQL injection patterns (UNION SELECT, DROP TABLE, xp_cmdshell, information_schema access, comment sequences). Investigate alerts immediately to determine whether the injection was successful and what data was accessed. Maintain an incident response plan for SQL injection breaches — isolate the affected system, assess the scope of the breach, notify affected users, and remediate the vulnerability.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP SQL Injection Prevention Cheat Sheet
            </a> — Comprehensive SQLi defense recommendations.
          </li>
          <li>
            <a href="https://portswigger.net/web-security/sql-injection" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PortSwigger: SQL Injection
            </a> — SQLi attack techniques and defenses.
          </li>
          <li>
            <a href="https://www.w3schools.com/sql/sql_injection.asp" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              W3Schools: SQL Injection
            </a> — Introduction to SQL injection with examples.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Query Parameterization Cheat Sheet
            </a> — Parameterized query examples for all languages.
          </li>
          <li>
            <a href="https://www.us-cert.gov/ncas/alerts/TA17-116A" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              US-CERT: SQL Injection Awareness
            </a> — Government guidance on SQL injection risks.
          </li>
          <li>
            <a href="https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Injection_Prevention_Cheat_Sheet.md" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Injection Prevention Cheat Sheet
            </a> — General injection prevention guide.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
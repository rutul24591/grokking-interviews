"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-api-security-extensive",
  title: "API Security",
  description:
    "Staff-level deep dive into API security architecture, OWASP API Top 10, authentication, authorization, input validation, rate limiting, and the operational practice of securing APIs at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "api-security",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "api", "oauth", "authentication", "authorization"],
  relatedTopics: ["oauth-2-0", "rate-limiting", "input-validation-sanitization", "security-headers"],
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
          <strong>API security</strong> is the practice of protecting APIs (Application Programming Interfaces) from
          unauthorized access, abuse, and attacks. APIs are the primary interface for modern applications — they power
          mobile apps, web applications, third-party integrations, and service-to-service communication. Because APIs
          expose application logic and data to external clients, they are a prime target for attackers. According to
          Gartner, API abuses will become the most frequent attack vector by 2026, resulting in data breaches for
          enterprise web applications.
        </p>
        <p>
          API security is fundamentally different from web application security. Web applications render HTML in a
          browser, which provides built-in security controls (same-origin policy, CSP, XSS filters). APIs return
          structured data (JSON, XML) directly to clients, bypassing browser security controls. API security relies
          on application-level controls — authentication (verifying the client&apos;s identity), authorization (verifying
          the client&apos;s permissions), input validation (ensuring input is safe), rate limiting (preventing abuse), and
          encryption (protecting data in transit and at rest).
        </p>
        <p>
          The OWASP API Security Top 10 (2023) identifies the most critical API security risks: Broken Object Level
          Authorization (BOLA/IDOR), Broken Authentication, Broken Object Property Level Authorization, Unrestricted
          Resource Consumption, Broken Function Level Authorization, Unrestricted Access to Sensitive Business Flows,
          Server Side Request Forgery, Security Misconfiguration, Insufficient Logging &amp; Monitoring, and Consumption of
          Components from Untrusted Sources. These risks are specific to APIs — they are not covered by the general
          OWASP Top 10 for web applications.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">Why API Security Is Different from Web Security</h3>
          <p className="text-muted mb-3">
            <strong>No browser protections:</strong> APIs return data directly to clients, bypassing browser security controls (same-origin policy, CSP, XSS filters). API security must be implemented at the application level.
          </p>
          <p className="text-muted mb-3">
            <strong>Direct data access:</strong> APIs expose data directly — attackers can extract large volumes of data through API calls (scraping), whereas web applications require parsing HTML.
          </p>
          <p>
            <strong>Automated attacks:</strong> APIs are designed for machine-to-machine communication, making them easy to automate — attackers can send thousands of requests per second, whereas web applications require browser interaction.
          </p>
        </div>
        <p>
          API security requires defense-in-depth — multiple independent layers of protection that work together. The
          layers include authentication (OAuth 2.0, API keys, mTLS), authorization (RBAC, ABAC, scopes), input
          validation (schema validation, sanitization), rate limiting (per-user, per-IP, per-endpoint), encryption
          (TLS 1.3, data at rest), and monitoring (logging, alerting, anomaly detection). No single layer is
          sufficient — if one layer fails, the others still provide protection.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Broken Object Level Authorization (BOLA), also known as Insecure Direct Object Reference (IDOR), is the
          most common and impactful API security risk. BOLA occurs when an API endpoint accepts a user-controlled
          identifier (e.g., /api/users/123/orders) and does not verify that the authenticated user is authorized to
          access the referenced resource. An attacker can change the identifier (e.g., /api/users/456/orders) to
          access another user&apos;s data. BOLA is common because it is easy to introduce — developers often forget to
          add authorization checks when creating new endpoints, assuming that authentication (verifying the user&apos;s
          identity) is sufficient.
        </p>
        <p>
          Broken Authentication is the second most common API security risk. It occurs when API authentication is
          weak or misconfigured — allowing brute force attacks, using weak tokens (predictable API keys, short-lived
          JWTs without refresh rotation), or implementing flawed password reset flows. Broken Authentication enables
          attackers to compromise user accounts through credential stuffing, token theft, or password reset abuse.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/api-security-diagram-1.svg"
          alt="API security defense-in-depth architecture showing authentication, authorization, input validation, rate limiting, and encryption layers"
          caption="API security defense-in-depth: authentication verifies identity, authorization verifies permissions, input validation ensures safe input, rate limiting prevents abuse, and encryption protects data."
        />
        <p>
          Excessive Data Exposure occurs when APIs return more data than the client needs — for example, a user
          profile endpoint that returns the user&apos;s email, phone number, address, and internal metadata, when the
          client only needs the user&apos;s name and avatar. Attackers can exploit excessive data exposure by intercepting
          API responses and extracting sensitive data (PII, internal identifiers, system metadata) that was not
          intended for the client.
        </p>
        <p>
          Unrestricted Resource Consumption is the API equivalent of denial-of-service — it occurs when APIs do not
          limit the resources (CPU, memory, database connections) that a single client can consume. An attacker can
          send a request that triggers an expensive operation (e.g., a complex database query, a large file export),
          consuming server resources and degrading service for other clients. Rate limiting and request size limits
          are the primary defenses against unrestricted resource consumption.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/api-security-diagram-2.svg"
          alt="API security threat model showing common attack vectors and their defense mechanisms"
          caption="API security threats: broken authentication, broken object level auth (BOLA), excessive data exposure, injection attacks, security misconfiguration, and lack of monitoring. Each threat requires specific defenses."
        />
        <p>
          Server Side Request Forgery (SSRF) is an API-specific attack where an attacker manipulates the API server
          into making requests to internal resources. For example, if an API endpoint accepts a URL parameter and
          fetches data from that URL (e.g., for image processing, webhook delivery, or data import), an attacker
          can provide an internal URL (e.g., http://169.254.169.254/latest/meta-data/) to access cloud metadata
          services, internal APIs, or other internal resources. SSRF is particularly dangerous in cloud environments
          where metadata services expose credentials and configuration data.
        </p>
        <p>
          API security testing is essential for detecting vulnerabilities before they reach production. API security
          testing includes automated scanning (DAST tools like OWASP ZAP, Burp Suite), manual penetration testing
          (simulating real-world attacks), and code review (identifying security vulnerabilities in the codebase).
          API security testing should be integrated into the CI/CD pipeline — automated scans run on every pull
          request, and penetration testing is conducted before major releases.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The API security architecture consists of the API gateway (which enforces authentication, rate limiting,
          and routing), the authorization service (which evaluates permissions for each request), the input
          validator (which validates and sanitizes input before processing), the encryption layer (which encrypts
          data in transit and at rest), and the monitoring layer (which logs security events and alerts on
          anomalies). Each component is independent — if one component fails, the others still provide protection.
        </p>
        <p>
          The API security flow begins with the client sending a request to the API gateway. The API gateway
          authenticates the request (validates the JWT, API key, or mTLS certificate) and enforces rate limits. If
          authentication succeeds and the rate limit is not exceeded, the request is forwarded to the application
          server. The application server evaluates the authorization policy (RBAC, ABAC) to determine if the user
          is authorized to perform the requested action. If authorized, the input validator validates and sanitizes
          the request input, and the application processes the request. The response is encrypted (TLS 1.3) and
          returned to the client.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/api-security-diagram-3.svg"
          alt="API security best practices checklist showing authentication, authorization, input validation, rate limiting, encryption, security headers, error handling, logging, versioning, and penetration testing"
          caption="API security checklist: authentication, authorization, input validation, rate limiting, encryption, security headers, error handling, logging & monitoring, API versioning, and penetration testing."
        />
        <p>
          The authorization service evaluates permissions for each request — it receives the user&apos;s identity (from
          the authentication layer), the requested action (from the request), and the resource being accessed (from
          the request URL). The authorization service evaluates the policy (RBAC, ABAC) to determine if the user
          is authorized to perform the action on the resource. If authorized, the request proceeds; if not, it is
          rejected with a 403 Forbidden response. The authorization service should be centralized — all services
          should use the same authorization service to ensure consistent policy enforcement.
        </p>
        <p>
          Input validation is the practice of ensuring that request input is safe before processing it. Input
          validation includes schema validation (ensuring the input matches the expected schema — required fields,
          data types, value ranges), sanitization (removing or encoding dangerous content — SQL injection, XSS,
          command injection), and business rule validation (ensuring the input is valid within the business context
          — e.g., the order quantity is within the available inventory). Input validation should reject invalid
          input early — before the request reaches the application logic — to prevent vulnerabilities.
        </p>
        <p>
          API security monitoring is the practice of logging security events (authentication attempts, authorization
          failures, rate limit violations, input validation failures) and alerting on anomalous patterns. Monitoring
          enables early detection of attacks — credential stuffing (multiple failed authentication attempts from the
          same IP), BOLA exploitation (a user accessing many different resource IDs), and unrestricted resource
          consumption (a single client sending many expensive requests). Alerts should be routed to the security
          team for investigation and response.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          API gateway security versus application-level security is a trade-off between centralization and
          flexibility. API gateway security enforces security controls (authentication, rate limiting, input
          validation) at the gateway level — before requests reach the application. This is centralized — all
          security controls are in one place, making them easier to manage and audit. However, the API gateway
          cannot enforce application-specific security controls (object-level authorization, business rule
          validation) — these must be implemented at the application level. The recommended approach is defense-in-depth
          — API gateway security for centralized controls, application-level security for application-specific
          controls.
        </p>
        <p>
          Token-based authentication (JWT) versus API keys is a trade-off between security and simplicity. JWTs
          provide rich claims (user identity, roles, scopes, expiration) and enable stateless authentication — the
          resource server can validate the token without calling the authorization server. However, JWTs are complex
          to manage (key rotation, revocation, validation) and cannot be revoked until expiration. API keys are
          simpler — they are opaque tokens that the server validates against a database. API keys can be revoked
          immediately but require a database lookup on each request. The recommended approach is JWTs for
          user-facing APIs (where rich claims are needed) and API keys for service-to-service APIs (where
          simplicity and revocation are priorities).
        </p>
        <p>
          Centralized authorization (policy engine) versus decentralized authorization (each service enforces its
          own policies) is a trade-off between consistency and resilience. Centralized authorization provides
          consistent policy enforcement — all services use the same policies, making auditing and compliance
          straightforward. However, it introduces a dependency — if the policy engine is unavailable, services
          cannot evaluate policies. Decentralized authorization eliminates the dependency — each service enforces
          its own policies — but policies can drift across services, making auditing and compliance difficult. The
          recommended approach is centralized policy definition with decentralized evaluation — the policy engine
          distributes policies to each service, which evaluates them locally.
        </p>
        <p>
          Synchronous versus asynchronous input validation is a trade-off between accuracy and performance.
          Synchronous validation (the server waits for validation to complete before processing the request) is
          accurate — invalid input is rejected before processing. Asynchronous validation (the server validates
          input in the background and processes the request immediately) is faster — it does not add latency to
          the request — but it is inaccurate (invalid input may be processed before validation completes). The
          recommended approach is synchronous validation for security-critical input (SQL injection, XSS, command
          injection) and asynchronous validation for non-critical input (format validation, business rule validation).
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Implement defense-in-depth — use multiple independent layers of security (authentication, authorization,
          input validation, rate limiting, encryption, monitoring). No single layer is sufficient — if one layer
          fails, the others still provide protection. Each layer should be implemented independently, so that a
          failure in one layer does not affect the others.
        </p>
        <p>
          Enforce authorization on every request — do not trust the API gateway&apos;s authentication without performing
          your own authorization check. Object-level authorization (verifying that the user is authorized to access
          the specific resource being requested) must be enforced at the application level — the API gateway cannot
          enforce object-level authorization because it does not know the application&apos;s data model.
        </p>
        <p>
          Validate all input against a schema — use JSON Schema, OpenAPI, or a similar schema definition language
          to define the expected input for each endpoint. Validate input against the schema before processing —
          reject input that does not match the schema (missing required fields, invalid data types, out-of-range
          values). Schema validation is the first line of defense against injection attacks and data corruption.
        </p>
        <p>
          Use parameterized queries for all database queries — never concatenate user input into SQL queries.
          Parameterized queries (prepared statements) separate SQL structure from data, making SQL injection
          impossible. Use ORM methods (find, where, create, update) for most queries — ORMs generate parameterized
          queries automatically.
        </p>
        <p>
          Set rate limits at multiple levels — global limits (protecting infrastructure capacity), per-endpoint
          limits (protecting expensive operations), per-user limits (ensuring fair usage), and per-IP limits
          (preventing anonymous abuse). Return rate limit response headers (X-RateLimit-Limit, X-RateLimit-Remaining,
          X-RateLimit-Reset) and 429 Too Many Requests responses with Retry-After headers when limits are exceeded.
        </p>
        <p>
          Monitor API security events — log authentication attempts, authorization failures, rate limit violations,
          input validation failures, and unusual request patterns. Alert on anomalous patterns (multiple failed
          authentication attempts, a user accessing many different resource IDs, a single client sending many
          expensive requests). Early detection enables rapid response before significant data is exfiltrated.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Not enforcing object-level authorization is the most common API security pitfall. Developers often assume
          that authentication (verifying the user&apos;s identity) is sufficient — they forget to verify that the user
          is authorized to access the specific resource being requested. This leads to BOLA/IDOR vulnerabilities,
          where an attacker can access any resource by changing the resource ID in the request URL. The fix is to
          enforce object-level authorization on every request — verify that the user is authorized to access the
          specific resource before processing the request.
        </p>
        <p>
          Returning excessive data in API responses is a common pitfall. APIs often return the full resource object
          (including internal fields, metadata, and sensitive data) when the client only needs a subset of fields.
          Attackers can exploit excessive data exposure by intercepting API responses and extracting sensitive data.
          The fix is to filter API responses — return only the fields that the client needs, based on the user&apos;s
          permissions and the client&apos;s role.
        </p>
        <p>
          Not rate limiting API endpoints is a common pitfall. Without rate limiting, a single client can send
          millions of requests per second, overwhelming the server and degrading service for all other clients. The
          fix is to implement multi-tier rate limiting — global limits, per-endpoint limits, per-user limits, and
          per-IP limits. Rate limiting should be enforced at the API gateway level (before requests reach the
          application) and at the application level (for fine-grained control).
        </p>
        <p>
          Using sequential IDs (auto-incrementing integers) for resource identifiers is a common pitfall. Sequential
          IDs are predictable — an attacker can enumerate all resources by iterating through IDs (1, 2, 3, ...).
          The fix is to use UUIDs (universally unique identifiers) or ULIDs (universally unique lexicographically
          sortable identifiers) for resource identifiers. UUIDs are unpredictable and cannot be enumerated, making
          it harder for attackers to discover resources.
        </p>
        <p>
          Not logging API security events is a common operational pitfall. Without logging, security incidents go
          undetected — attackers can exploit vulnerabilities for weeks or months before discovery. The fix is to log
          all security events (authentication attempts, authorization failures, rate limit violations, input
          validation failures) and alert on anomalous patterns. Logs should be centralized (sent to a SIEM or
          log aggregation system) and monitored for anomalies.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform implements defense-in-depth API security for its public API — the API gateway
          enforces authentication (OAuth 2.0 with JWTs), rate limiting (per-user and per-IP limits), and input
          validation (JSON Schema validation). The application server enforces object-level authorization (verifying
          that the user is authorized to access each resource), filters API responses (returning only the fields the
          client needs), and logs security events (authentication attempts, authorization failures, rate limit
          violations). The platform monitors security events and alerts on anomalous patterns (users accessing many
          different resource IDs, clients sending many expensive requests). The platform has had zero successful API
          security breaches since implementing these controls.
        </p>
        <p>
          A financial services company implements strict API security for its banking API — the API gateway enforces
          mTLS (mutual TLS) for service-to-service authentication, OAuth 2.0 for user-facing authentication, and
          rate limiting (strict limits for login endpoints: 5 attempts per minute per user). The application server
          enforces object-level authorization (verifying that the user is authorized to access each account),
          validates all input against schemas (JSON Schema for all endpoints), and logs all security events. The
          company monitors security events and alerts on credential stuffing attempts (multiple failed login attempts
          from the same IP). The company has prevented over 1 million credential stuffing attempts per month through
          API security controls.
        </p>
        <p>
          A SaaS platform implements API security for its multi-tenant API — the API gateway enforces authentication
          (API keys for service-to-service, OAuth 2.0 for user-facing), rate limiting (per-user limits based on
          subscription tier: Free=100/min, Pro=1000/min, Enterprise=10000/min), and input validation (JSON Schema
          validation). The application server enforces tenant isolation (verifying that the user can only access
          resources within their tenant), filters API responses (returning only tenant-scoped data), and logs
          security events. The platform monitors security events and alerts on cross-tenant access attempts (which
          may indicate a BOLA vulnerability). The platform has achieved SOC 2 compliance in part due to its API
          security controls.
        </p>
        <p>
          A healthcare organization implements API security for its patient data API — the API gateway enforces
          mTLS for service-to-service authentication, OAuth 2.0 with MFA for user-facing authentication, and rate
          limiting (strict limits for patient record access: 100 requests per minute per user). The application
          server enforces object-level authorization (verifying that the healthcare provider is authorized to access
          each patient record), encrypts sensitive data at rest (envelope encryption with AWS KMS), and logs all
          security events. The organization monitors security events and alerts on anomalous patterns (providers
          accessing many different patient records, unusual access times). The organization has achieved HIPAA
          compliance in part due to its API security controls.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is BOLA (Broken Object Level Authorization), and how do you prevent it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              BOLA (also known as IDOR) occurs when an API endpoint accepts a user-controlled identifier and does not verify that the authenticated user is authorized to access the referenced resource. For example, an endpoint GET /api/users/123/orders that returns orders for user 123 without verifying that the authenticated user is user 123 — an attacker can change the ID to access another user&apos;s orders.
            </p>
            <p>
              Prevent BOLA by enforcing object-level authorization on every request — verify that the user is authorized to access the specific resource before processing the request. Use UUIDs instead of sequential IDs to make resource IDs unpredictable. Implement centralized authorization checks — all services should use the same authorization logic to ensure consistent enforcement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the difference between authentication and authorization in API security?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Authentication verifies the client&apos;s identity — it answers &quot;Who are you?&quot; through credential validation (JWT, API key, mTLS certificate). Authorization verifies the client&apos;s permissions — it answers &quot;What can you do?&quot; through policy evaluation (RBAC, ABAC, scopes). Authentication is a prerequisite for authorization — you cannot determine what someone is allowed to do until you know who they are.
            </p>
            <p>
              In API security, authentication is typically enforced at the API gateway level (validating JWTs, API keys), while authorization is enforced at the application level (verifying object-level permissions). Authentication without authorization is insufficient — an authenticated user with unrestricted access is equivalent to no access control at all.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you prevent SSRF in APIs that fetch external URLs?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              SSRF (Server Side Request Forgery) occurs when an API endpoint accepts a URL parameter and fetches data from that URL — an attacker can provide an internal URL (e.g., http://169.254.169.254/latest/meta-data/) to access internal resources. Prevent SSRF by validating the URL against a whitelist of allowed domains (e.g., only allow URLs from trusted external domains), blocking internal IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16), and using a proxy that blocks internal requests.
            </p>
            <p>
              Additionally, use a dedicated HTTP client that enforces URL validation — do not use generic HTTP libraries (curl, requests) that can access internal URLs. Log all external URL fetches and monitor for anomalous patterns (requests to internal IP ranges, requests to cloud metadata services).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you handle API key rotation without service disruption?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              API key rotation requires an overlap period — generate a new API key and activate it while keeping the old key active. During the overlap period (e.g., 7 days), both the old and new keys are valid. Clients update to the new key during the overlap period. After the overlap period, the old key is deactivated. This ensures zero downtime — clients that have not updated to the new key can still use the old key during the overlap period.
            </p>
            <p>
              Automate key rotation — use a secrets manager (AWS Secrets Manager, HashiCorp Vault) to generate new keys, distribute them to clients, and deactivate old keys. Monitor key usage — alert on keys that have not been updated after the overlap period (indicating clients that need manual intervention).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are the OWASP API Security Top 10, and why are they important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The OWASP API Security Top 10 (2023) identifies the most critical API security risks: (1) Broken Object Level Authorization, (2) Broken Authentication, (3) Broken Object Property Level Authorization, (4) Unrestricted Resource Consumption, (5) Broken Function Level Authorization, (6) Unrestricted Access to Sensitive Business Flows, (7) Server Side Request Forgery, (8) Security Misconfiguration, (9) Insufficient Logging &amp; Monitoring, and (10) Consumption of Components from Untrusted Sources.
            </p>
            <p>
              These risks are specific to APIs — they are not covered by the general OWASP Top 10 for web applications. Understanding the API Security Top 10 is essential for API developers and security teams — it provides a framework for identifying and mitigating API-specific vulnerabilities. Each risk has specific prevention strategies — for example, BOLA is prevented by object-level authorization, broken authentication is prevented by strong auth (OAuth 2.0 + MFA), and SSRF is prevented by URL validation and internal IP blocking.
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
            <a href="https://owasp.org/API-Security/editions/2023/en/0x11-t10/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP API Security Top 10 (2023)
            </a> — The definitive guide to API security risks.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP REST Security Cheat Sheet
            </a> — API security best practices.
          </li>
          <li>
            <a href="https://portswigger.net/web-security/api-testing" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PortSwigger: API Testing
            </a> — API security testing techniques.
          </li>
          <li>
            <a href="https://www.gartner.com/en/articles/top-cybersecurity-trends" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Gartner: API Security Trends
            </a> — API abuse as the most frequent attack vector.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Authorization Cheat Sheet
            </a> — Authorization best practices for APIs.
          </li>
          <li>
            <a href="https://noncombatant.org/2018/03/07/api-security-best-practices/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              API Security Best Practices
            </a> — Practical guide to API security architecture.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
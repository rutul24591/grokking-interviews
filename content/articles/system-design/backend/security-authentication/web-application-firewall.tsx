"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-waf-extensive",
  title: "Web Application Firewall (WAF)",
  description:
    "Staff-level deep dive into WAF architecture, OWASP Core Rule Set, custom rules, false positive management, WAF deployment modes, and the operational practice of protecting web applications at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "web-application-firewall",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "waf", "firewall", "owasp", "web-security"],
  relatedTopics: ["api-security", "xss-prevention", "sql-injection-prevention", "rate-limiting"],
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
          <strong>WAF (Web Application Firewall)</strong> is a security control that inspects HTTP requests and
          blocks malicious traffic before it reaches the application — it protects web applications from common
          attacks (SQL injection, XSS, file inclusion, path traversal, malicious bots). WAF sits between the
          client and the application server, inspecting every HTTP request and comparing it against a set of
          security rules. If a request matches a rule (indicating a potential attack), the WAF blocks the request
          and returns a 403 Forbidden response.
        </p>
        <p>
          WAF is a supplementary security control — it does not replace secure coding practices, input
          validation, or parameterized queries. WAF protects against known attack patterns, but it cannot protect
          against novel attacks (zero-days, business logic vulnerabilities, complex attack chains). WAF is most
          effective when used in conjunction with secure coding practices — it provides a safety net for
          vulnerabilities that were not caught during development.
        </p>
        <p>
          The evolution of WAF has been shaped by the need for accuracy and performance — early WAFs used simple
          pattern matching (blocking requests containing specific keywords like &quot;SELECT&quot;, &quot;DROP&quot;, &quot;&lt;script&gt;&quot;),
          which generated many false positives (blocking legitimate requests that happened to contain those
          keywords). Modern WAFs use machine learning, behavioral analysis, and the OWASP Core Rule Set (CRS) —
          a comprehensive set of rules that detect attack patterns with high accuracy and low false positive rates.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">WAF Deployment Modes</h3>
          <p className="text-muted mb-3">
            <strong>Reverse Proxy Mode:</strong> WAF sits in front of application servers, inspecting all traffic before it reaches the application. Cloudflare, AWS WAF, Azure WAF.
          </p>
          <p className="text-muted mb-3">
            <strong>Embedded Mode:</strong> WAF runs as a library within the application — it inspects requests within the application process. ModSecurity, libinjection.
          </p>
          <p>
            <strong>Host-Based Mode:</strong> WAF is installed on the application server — it inspects requests at the server level. ModSecurity on Apache/Nginx.
          </p>
        </div>
        <p>
          WAF is required by major compliance standards (PCI-DSS Requirement 6.6 requires WAF or code review for
          public-facing web applications). Beyond compliance, WAF is a fundamental security practice — it provides
          protection against common web attacks, reduces the attack surface, and provides visibility into attack
          patterns targeting the application.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          OWASP Core Rule Set (CRS) is the most widely used WAF rule set — it is a comprehensive set of rules
          that detect common web attacks (SQL injection, XSS, file inclusion, path traversal, remote code
          execution). CRS is maintained by the OWASP community and is updated regularly to detect new attack
          patterns. CRS rules are organized by attack type — Rule 941 detects XSS attacks, Rule 942 detects SQL
          injection attacks, Rule 930 detects file inclusion attacks, and so on.
        </p>
        <p>
          Custom rules are application-specific rules that complement the OWASP CRS — they detect attacks that
          are specific to the application&apos;s business logic, API structure, or user behavior. Custom rules include
          blocking specific user agents (known scraping bots, malicious crawlers), geo-blocking (blocking traffic
          from countries where the service is not offered), and API-specific rules (blocking requests without
          required headers, invalid API keys). Custom rules are essential for protecting against attacks that the
          OWASP CRS does not detect.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/web-application-firewall-diagram-1.svg"
          alt="WAF architecture showing how WAF sits between clients and application servers to filter malicious requests"
          caption="WAF architecture: clients send HTTP requests to the WAF, which inspects them against SQL injection rules, XSS rules, rate limiting, and bot detection. Allowed requests reach app servers; blocked requests receive 403 Forbidden."
        />
        <p>
          Rate limiting is a WAF feature that controls the rate at which clients can send requests — it limits
          the number of requests per minute per IP, per user, or per endpoint. Rate limiting prevents abuse
          (credential stuffing, scraping, denial-of-service) and protects backend infrastructure from overload.
          Rate limiting is typically configured with thresholds (e.g., 100 requests per minute per IP) and
          actions (block, challenge, or throttle when the threshold is exceeded).
        </p>
        <p>
          Bot management is a WAF feature that distinguishes between legitimate bots (search engine crawlers,
          monitoring bots) and malicious bots (scrapers, credential stuffing bots, spam bots). Bot management
          uses behavioral analysis (request patterns, mouse movements, JavaScript execution) and reputation
          databases (known good and bad bot signatures) to classify bots. Legitimate bots are allowed,
          suspicious bots are challenged (CAPTCHA, JavaScript challenge), and malicious bots are blocked.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/web-application-firewall-diagram-2.svg"
          alt="WAF rule types showing OWASP Core Rule Set, custom rules, rate limiting, and bot management"
          caption="WAF rules: OWASP CRS detects SQLi, XSS, file inclusion. Custom rules block specific user agents, geo-block traffic, and enforce API-specific rules. Rate limiting and bot management prevent abuse."
        />
        <p>
          WAF operation modes include monitor mode (logging violations without blocking) and blocking mode
          (blocking violations). Monitor mode is used for tuning — it allows the WAF to learn the application&apos;s
          traffic patterns and identify false positives (legitimate requests that match WAF rules). After tuning,
          the WAF is switched to blocking mode — it blocks violations and returns 403 Forbidden responses.
          Switching from monitor mode to blocking mode without tuning is a common pitfall — it may block
          legitimate requests and disrupt the application.
        </p>
        <p>
          False positive management is essential for WAF effectiveness — WAF rules may block legitimate requests
          (e.g., a webhook endpoint that receives XML payloads may match file inclusion rules). False positives
          are managed by adding rule exclusions — specific rules are disabled for specific paths (e.g., disable
          Rule 930 for /api/webhook). Rule exclusions should be reviewed regularly to ensure they are still
          necessary — as the application evolves, some exclusions may no longer be needed.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The WAF architecture consists of the rule engine (which evaluates requests against WAF rules), the
          rule set (OWASP CRS + custom rules), the logging system (which logs all requests, allowed and blocked),
          and the management console (which provides visibility into WAF activity and allows rule configuration).
          The rule engine is the core component — it inspects every HTTP request, evaluates it against the rule
          set, and returns an allow/block decision.
        </p>
        <p>
          The WAF request flow begins with the client sending an HTTP request to the WAF. The WAF inspects the
          request (headers, body, query parameters, cookies) against the rule set. If the request matches a
          rule (indicating a potential attack), the WAF blocks the request and returns a 403 Forbidden response.
          If the request does not match any rule, the WAF allows the request and forwards it to the application
          server. The WAF logs all requests (allowed and blocked) for audit and monitoring purposes.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/web-application-firewall-diagram-3.svg"
          alt="Defense-in-depth showing WAF as one layer among network, application, data, and monitoring security controls"
          caption="Defense-in-depth: WAF is one layer among many. Network layer (DDoS protection, ACLs), WAF layer (SQLi, XSS blocking), application layer (input validation, auth), data layer (encryption, parameterized queries), and monitoring layer (SIEM, anomaly detection)."
        />
        <p>
          WAF rule evaluation is performed in order — rules are evaluated from highest priority to lowest
          priority, and the first matching rule determines the action (allow or block). Rule priority is
          essential — Critical rules (blocking known attack patterns) should have the highest priority, followed
          by High rules (blocking suspicious patterns), and Low rules (logging informational patterns). Custom
          rules should have higher priority than OWASP CRS rules — they are application-specific and should be
          evaluated first.
        </p>
        <p>
          WAF logging is essential for security monitoring — it logs all requests (allowed and blocked),
          including the request method, URL, headers, body, matching rule, and action taken. WAF logs enable
          detection of attack patterns (SQL injection attempts, XSS attempts, scraping attempts), false positives
          (legitimate requests being blocked), and performance issues (requests taking too long to evaluate).
          WAF logs should be centralized (sent to a SIEM or log aggregation system) and monitored for anomalies.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Cloud-based WAF versus self-hosted WAF is a trade-off between management overhead and control.
          Cloud-based WAF (Cloudflare, AWS WAF, Azure WAF) is managed by the provider — rules are updated
          automatically, infrastructure is scaled automatically, and DDoS protection is included. However,
          cloud-based WAF has less customization — custom rules are limited to the provider&apos;s rule language.
          Self-hosted WAF (ModSecurity on Apache/Nginx) provides full control — custom rules can be written in
          any language, and the WAF can be tuned precisely for the application. However, self-hosted WAF requires
          management overhead — rule updates, infrastructure scaling, and DDoS protection must be managed
          manually. The recommended approach is cloud-based WAF for most applications, with self-hosted WAF for
          high-security applications that require full control.
        </p>
        <p>
          WAF versus application-level input validation is a trade-off between supplementary and primary defense.
          WAF is a supplementary defense — it blocks known attack patterns but cannot protect against novel
          attacks (zero-days, business logic vulnerabilities). Application-level input validation is the primary
          defense — it validates all input against expected patterns, preventing injection attacks at the source.
          The recommended approach is both — application-level input validation as the primary defense, with WAF
          as a supplementary defense.
        </p>
        <p>
          Blocking mode versus monitor mode is a trade-off between protection and false positives. Blocking mode
          blocks violations — it provides maximum protection but may block legitimate requests (false positives).
          Monitor mode logs violations without blocking — it provides visibility into attack patterns without
          blocking legitimate requests. The recommended approach is monitor mode for initial deployment (to
          identify false positives), followed by blocking mode after tuning (adding rule exclusions for false
          positives).
        </p>
        <p>
          OWASP CRS versus custom rules is a trade-off between comprehensiveness and specificity. OWASP CRS is
          comprehensive — it detects all common web attack patterns (SQLi, XSS, file inclusion, path traversal)
          and is maintained by the OWASP community. However, OWASP CRS does not detect application-specific
          attacks (business logic abuse, API-specific vulnerabilities). Custom rules are specific — they detect
          attacks that are specific to the application&apos;s business logic, API structure, or user behavior. The
          recommended approach is both — OWASP CRS for common attack patterns, with custom rules for
          application-specific attacks.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Start in monitor mode — deploy the WAF in monitor mode (logging violations without blocking) and
          monitor the logs for false positives (legitimate requests being blocked). Add rule exclusions for false
          positives, and switch to blocking mode after tuning. Starting in blocking mode without tuning is a
          common pitfall — it may block legitimate requests and disrupt the application.
        </p>
        <p>
          Use the OWASP Core Rule Set (CRS) — it is the most comprehensive and widely used WAF rule set,
          maintained by the OWASP community and updated regularly. CRS detects all common web attack patterns
          (SQLi, XSS, file inclusion, path traversal) and is compatible with all major WAF platforms. CRS should
          be the foundation of the WAF rule set, with custom rules added for application-specific attacks.
        </p>
        <p>
          Add custom rules for application-specific attacks — OWASP CRS does not detect business logic abuse,
          API-specific vulnerabilities, or user behavior anomalies. Custom rules detect these attacks — block
          specific user agents (scraping bots), geo-block traffic from unauthorized countries, enforce API-specific
          rules (required headers, valid API keys). Custom rules should have higher priority than OWASP CRS rules.
        </p>
        <p>
          Monitor WAF logs regularly — track the number of blocked requests, false positives, attack patterns,
          and performance issues. Alert on anomalous patterns (sudden spike in blocked requests, new attack
          patterns, WAF performance degradation). WAF logs provide visibility into the application&apos;s security
          posture and highlight areas for improvement.
        </p>
        <p>
          Review rule exclusions regularly — as the application evolves, some rule exclusions may no longer be
          needed. Regular review ensures that rule exclusions are still necessary and that they are not
          inadvertently allowing malicious requests. Rule exclusions should be documented (why the exclusion was
          added, when it was added, who approved it) and reviewed quarterly.
        </p>
        <p>
          Do not rely on WAF as the primary defense — WAF is a supplementary control that blocks known attack
          patterns. It does not replace secure coding practices, input validation, parameterized queries, or
          authentication/authorization. The primary defense is secure coding practices — WAF is a safety net for
          vulnerabilities that were not caught during development.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Switching to blocking mode without tuning is a common WAF pitfall — the WAF may block legitimate
          requests (false positives), disrupting the application. The fix is to start in monitor mode, monitor
          the logs for false positives, add rule exclusions for false positives, and then switch to blocking
          mode after tuning.
        </p>
        <p>
          Not reviewing rule exclusions is a common operational pitfall — rule exclusions may inadvertently
          allow malicious requests (e.g., a rule exclusion for /api/webhook may allow file inclusion attacks on
          that endpoint). The fix is to review rule exclusions regularly (quarterly) and remove exclusions that
          are no longer necessary. Rule exclusions should be documented and approved by the security team.
        </p>
        <p>
          Relying solely on WAF for security is a common pitfall — WAF blocks known attack patterns but does
          not protect against novel attacks (zero-days, business logic vulnerabilities, complex attack chains).
          The fix is to use WAF as a supplementary defense — the primary defense is secure coding practices
          (input validation, parameterized queries, authentication/authorization). WAF is a safety net, not a
          replacement for secure code.
        </p>
        <p>
          Not monitoring WAF logs is a common oversight — WAF logs provide visibility into attack patterns
          targeting the application, false positives (legitimate requests being blocked), and performance issues
          (requests taking too long to evaluate). Without monitoring, attacks go undetected, false positives
          disrupt the application, and performance issues degrade the user experience. The fix is to monitor WAF
          logs regularly and alert on anomalous patterns.
        </p>
        <p>
          Not updating WAF rules is a common operational pitfall — WAF rules are updated regularly to detect new
          attack patterns (new SQL injection techniques, new XSS payloads, new file inclusion patterns). Without
          updates, the WAF does not detect new attack patterns, leaving the application vulnerable. The fix is
          to update WAF rules regularly — cloud-based WAFs update automatically, self-hosted WAFs require manual
          updates.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses AWS WAF for its public-facing web application — the WAF is configured
          with OWASP CRS, custom rules (blocking known scraping bots, geo-blocking traffic from unauthorized
          countries), rate limiting (100 requests per minute per IP), and bot management (challenging suspicious
          bots, blocking known bad bots). The WAF is deployed in blocking mode after initial tuning in monitor
          mode. The platform monitors WAF logs and alerts on anomalous patterns (sudden spike in blocked
          requests, new attack patterns). The platform achieves PCI-DSS compliance in part due to its WAF
          controls.
        </p>
        <p>
          A financial services company uses Cloudflare WAF for its banking application — the WAF is configured
          with OWASP CRS, custom rules (blocking requests without required headers, invalid API keys), rate
          limiting (50 requests per minute per user), and bot management (challenging suspicious bots). The WAF
          is deployed in blocking mode after initial tuning in monitor mode. The company monitors WAF logs and
          alerts on anomalous patterns (SQL injection attempts, XSS attempts, credential stuffing attempts). The
          company achieves SOC 2 compliance in part due to its WAF controls.
        </p>
        <p>
          A healthcare organization uses ModSecurity (self-hosted WAF) for its patient portal — the WAF is
          configured with OWASP CRS, custom rules (blocking requests with unauthorized API keys, geo-blocking
          traffic from unauthorized countries), rate limiting (100 requests per minute per IP), and bot
          management (blocking known bad bots). The WAF is deployed on the Nginx server (host-based mode) and
          monitors all requests to the patient portal. The organization monitors WAF logs and alerts on anomalous
          patterns. The organization achieves HIPAA compliance in part due to its WAF controls.
        </p>
        <p>
          A SaaS platform uses Cloudflare WAF for its multi-tenant application — the WAF is configured with OWASP
          CRS, custom rules (blocking requests without required tenant headers, invalid API keys), rate limiting
          (100 requests per minute per tenant), and bot management (challenging suspicious bots). The WAF is
          deployed in blocking mode after initial tuning in monitor mode. The platform monitors WAF logs and
          alerts on anomalous patterns (cross-tenant access attempts, API abuse attempts). The platform achieves
          SOC 2 compliance in part due to its WAF controls.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the OWASP Core Rule Set, and how does it protect web applications?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              OWASP CRS is a comprehensive set of WAF rules that detect common web attacks — SQL injection (Rule 942), XSS (Rule 941), file inclusion (Rule 930), path traversal (Rule 930), remote code execution (Rule 932), and many others. CRS is maintained by the OWASP community and is updated regularly to detect new attack patterns.
            </p>
            <p>
              CRS protects web applications by inspecting every HTTP request and comparing it against the rule set. If a request matches a rule (indicating a potential attack), the WAF blocks the request and returns a 403 Forbidden response. CRS is the foundation of most WAF rule sets — it provides comprehensive protection against common web attacks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you manage false positives in WAF?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Start in monitor mode — deploy the WAF in monitor mode (logging violations without blocking) and monitor the logs for false positives (legitimate requests being blocked). Add rule exclusions for false positives — specific rules are disabled for specific paths (e.g., disable Rule 930 for /api/webhook that receives XML payloads). After tuning, switch to blocking mode.
            </p>
            <p>
              Review rule exclusions regularly — as the application evolves, some rule exclusions may no longer be needed. Regular review ensures that rule exclusions are still necessary and that they are not inadvertently allowing malicious requests. Rule exclusions should be documented and approved by the security team.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is the difference between cloud-based WAF and self-hosted WAF?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Cloud-based WAF (Cloudflare, AWS WAF, Azure WAF) is managed by the provider — rules are updated automatically, infrastructure is scaled automatically, and DDoS protection is included. However, cloud-based WAF has less customization — custom rules are limited to the provider&apos;s rule language.
            </p>
            <p>
              Self-hosted WAF (ModSecurity on Apache/Nginx) provides full control — custom rules can be written in any language, and the WAF can be tuned precisely for the application. However, self-hosted WAF requires management overhead — rule updates, infrastructure scaling, and DDoS protection must be managed manually. The recommended approach is cloud-based WAF for most applications, with self-hosted WAF for high-security applications that require full control.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: Why is WAF not a replacement for secure coding practices?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              WAF blocks known attack patterns — it detects SQL injection, XSS, file inclusion, path traversal, and other common attacks based on predefined rules. However, WAF does not protect against novel attacks (zero-days, business logic vulnerabilities, complex attack chains) that do not match predefined rules. WAF also has false positives (blocking legitimate requests) and false negatives (missing novel attacks).
            </p>
            <p>
              Secure coding practices (input validation, parameterized queries, authentication/authorization) are the primary defense — they prevent vulnerabilities at the source, making the application inherently secure. WAF is a supplementary defense — it provides a safety net for vulnerabilities that were not caught during development. The recommended approach is both — secure coding practices as the primary defense, with WAF as a supplementary defense.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you tune a WAF for a new application?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              (1) Deploy the WAF in monitor mode — log violations without blocking. (2) Monitor the logs for false positives — identify legitimate requests being blocked. (3) Add rule exclusions for false positives — disable specific rules for specific paths. (4) Review custom rules — add rules for application-specific attacks (business logic abuse, API-specific vulnerabilities). (5) Test the WAF — send legitimate requests and verify they are allowed, send malicious requests and verify they are blocked. (6) Switch to blocking mode — after tuning, switch the WAF to blocking mode. (7) Monitor continuously — track blocked requests, false positives, attack patterns, and performance issues.
            </p>
            <p>
              Tuning is an ongoing process — as the application evolves, new false positives may appear, and new attack patterns may emerge. Regular tuning ensures that the WAF remains effective and accurate.
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
            <a href="https://owasp.org/www-project-core-rule-set/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Core Rule Set (CRS)
            </a> — The definitive WAF rule set.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Web_Application_Security_Testing_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Web Application Security Testing Cheat Sheet
            </a> — WAF and testing best practices.
          </li>
          <li>
            <a href="https://www.pcidssguide.com/pci-dss-requirement-6-6/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PCI-DSS Requirement 6.6: WAF or Code Review
            </a> — WAF compliance requirements.
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS WAF Documentation
            </a> — AWS WAF configuration and best practices.
          </li>
          <li>
            <a href="https://www.cloudflare.com/waf/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Cloudflare WAF
            </a> — Cloud-based WAF with managed rules.
          </li>
          <li>
            <a href="https://modsecurity.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              ModSecurity
            </a> — Open-source WAF for Apache/Nginx.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
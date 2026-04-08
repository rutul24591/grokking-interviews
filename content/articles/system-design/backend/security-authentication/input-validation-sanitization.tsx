"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-input-validation-sanitization-extensive",
  title: "Input Validation & Sanitization",
  description:
    "Staff-level deep dive into input validation strategies, context-aware sanitization, schema validation, whitelist vs blacklist approaches, and the operational practice of preventing injection attacks at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "input-validation-sanitization",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "validation", "sanitization", "injection", "schema"],
  relatedTopics: ["sql-injection-prevention", "xss-prevention", "api-security", "csrf-protection"],
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
          <strong>Input validation</strong> is the practice of ensuring that user input conforms to expected types,
          formats, ranges, and constraints before processing. <strong>Sanitization</strong> is the practice of
          removing or encoding dangerous content from user input to prevent it from being interpreted as code
          (SQL, HTML, JavaScript, OS commands). Together, input validation and sanitization form the first line of
          defense against injection attacks — SQL injection, XSS, command injection, LDAP injection, and path
          traversal.
        </p>
        <p>
          Input validation is not optional — every piece of user input is untrusted and potentially malicious. This
          includes URL parameters, request bodies, headers, cookies, file uploads, and even data from third-party
          APIs (which may be compromised). The principle of &quot;never trust user input&quot; is fundamental to secure
          software design — assuming that user input is safe is the root cause of most injection vulnerabilities.
        </p>
        <p>
          The evolution of input validation has been shaped by increasingly sophisticated attacks. Early validation
          relied on blacklists (blocking known-bad patterns like &lt;script&gt;, SELECT, DROP), which was easily bypassed
          (encoding tricks, alternative syntaxes, novel attack patterns). The modern approach is whitelist validation
          (allowing only known-good patterns) — it is more restrictive but significantly more secure. Additionally,
          context-aware sanitization (encoding input differently depending on where it is placed — HTML body,
          attributes, JavaScript, URLs, CSS) provides defense-in-depth against injection attacks that bypass
          validation.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">The Input Validation Pipeline</h3>
          <p className="text-muted mb-3">
            <strong>Type validation:</strong> Is the input the expected type? (string, number, boolean, array, object). Reject wrong types immediately.
          </p>
          <p className="text-muted mb-3">
            <strong>Format validation:</strong> Does the input match the expected pattern? (email regex, URL format, date format, phone number). Reject invalid formats.
          </p>
          <p className="text-muted mb-3">
            <strong>Length/range validation:</strong> Is the input within expected bounds? (min/max length for strings, min/max value for numbers). Reject out-of-bounds values.
          </p>
          <p className="text-muted mb-3">
            <strong>Sanitization:</strong> Remove or encode dangerous content. HTML encode for HTML output, parameterize for SQL output, URL-encode for URL output.
          </p>
          <p>
            <strong>Business rule validation:</strong> Is the input valid within the business context? (user exists, inventory available, date in future). Reject invalid business logic.
          </p>
        </div>
        <p>
          Schema validation (JSON Schema, OpenAPI, GraphQL schemas) is the modern approach to input validation —
          it defines the expected input structure once and validates all requests automatically. Schema validation
          provides early rejection of invalid input (before reaching business logic), self-documenting APIs (the
          schema serves as API documentation), and consistent error messages (validation errors follow a standard
          format). Schema validation is integrated into most modern API frameworks (Express with express-validator,
          Django with DRF serializers, Rails with ActiveModel::Validations).
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Whitelist validation (allow only known-good patterns) is the recommended approach for input validation.
          Whitelist validation defines what is allowed — alphanumeric characters, specific symbols, expected
          formats — and rejects everything else. This is more restrictive than blacklist validation but
          significantly more secure — attackers cannot bypass whitelist validation using encoding tricks or novel
          attack patterns because anything not explicitly allowed is rejected.
        </p>
        <p>
          Blacklist validation (block known-bad patterns) is not recommended — it defines what is blocked
          (&lt;script&gt;, SELECT, DROP, javascript:, onerror=) and allows everything else. Blacklists are easily bypassed
          — attackers can use encoding tricks (&#60;script&#62;, java&#115;cript:, onload=), alternative syntaxes
          (&lt;img src=x onerror=alert(1)&gt;), or novel attack patterns that are not on the blacklist. Blacklist
          validation should only be used as a supplementary defense, never as the primary defense.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/input-validation-sanitization-diagram-1.svg"
          alt="Input validation pipeline showing type validation, format validation, length/range check, sanitization, and business rule validation stages"
          caption="Input validation pipeline: raw input passes through type validation, format validation, length/range checks, sanitization, and business rule validation before becoming safe data ready for processing."
        />
        <p>
          Context-aware sanitization is the practice of encoding input differently depending on the output context.
          The same malicious input must be sanitized differently for HTML output (HTML entity encoding: &lt; → &amp;lt;),
          SQL output (parameterized queries, not string concatenation), URL output (percent-encoding: &lt; → %3C), and
          file system output (stripping path traversal characters: ../). Context-aware sanitization is essential
          because using the wrong encoding for the context leaves the application vulnerable — encoding for HTML
          body context but placing the input in a JavaScript string allows an attacker to break out of the string
          and inject code.
        </p>
        <p>
          JSON Schema validation is the modern standard for API input validation — it defines the expected input
          structure (required fields, data types, formats, value ranges) and validates all requests against the
          schema. JSON Schema supports complex validation rules (pattern matching with regex, min/max length,
          min/max value, enum values, conditional required fields) and provides detailed error messages for
          validation failures. JSON Schema is integrated into most API frameworks and can be used to generate
          OpenAPI/Swagger documentation automatically.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/input-validation-sanitization-diagram-2.svg"
          alt="Context-aware sanitization showing how the same malicious input is sanitized differently for HTML, SQL, URL, and file system contexts"
          caption="Context-aware sanitization: the same malicious input is encoded differently for HTML (entity encoding), SQL (parameterized queries), URL (percent-encoding), and file system (stripping dangerous characters)."
        />
        <p>
          Input validation should be implemented at multiple layers — the API gateway layer (validating request
          structure, headers, and rate limits), the application layer (validating request body, parameters, and
          business rules), and the database layer (parameterized queries, stored procedures with parameterized
          input). Multi-layer validation provides defense-in-depth — if one layer fails, the others still provide
          protection.
        </p>
        <p>
          File upload validation is a specialized form of input validation — it validates file type (MIME type,
          file extension), file size (maximum upload size), file content (scanning for malware, verifying file
          structure), and file name (stripping path traversal characters, limiting length). File uploads are a
          common attack vector — attackers can upload malicious files (web shells, malware, XSS payloads) that
          are executed when accessed. File upload validation must be strict — only allow expected file types,
          validate file content (not just extension), store uploaded files outside the web root, and scan for
          malware before processing.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The input validation architecture consists of the schema validator (which validates input against JSON
          Schema or OpenAPI definitions), the sanitizer (which removes or encodes dangerous content), the business
          rule validator (which validates input within the business context), and the error handler (which returns
          consistent validation error messages). Each component is independent — if one component fails, the
          others still provide protection.
        </p>
        <p>
          The validation flow begins with the client sending a request to the API. The schema validator validates
          the request body, parameters, and headers against the schema — if the input does not match the schema
          (missing required fields, wrong data types, invalid formats, out-of-range values), the request is
          rejected with a 400 Bad Request response and detailed error messages. If the input passes schema
          validation, the sanitizer removes or encodes dangerous content (HTML encoding, SQL parameterization,
          URL encoding). The sanitized input is then passed to the business rule validator, which validates the
          input within the business context (user exists, inventory available, date in future). If all validation
          passes, the request is processed.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/input-validation-sanitization-diagram-3.svg"
          alt="JSON Schema validation showing schema definition and validation results for valid and invalid API request bodies"
          caption="JSON Schema validation: define expected input structure (required fields, types, formats, ranges), validate all requests automatically, and return consistent error messages for validation failures."
        />
        <p>
          The sanitizer uses context-aware encoding — it determines the output context (HTML body, HTML attribute,
          JavaScript, URL, CSS, SQL) and applies the appropriate encoding. For HTML output, the sanitizer uses
          HTML entity encoding (&lt; → &amp;lt;, &gt; → &amp;gt;, &amp; → &amp;amp;, &quot; → &amp;quot;, &apos; → &amp;#x27;). For SQL output, the sanitizer
          uses parameterized queries (separating SQL structure from data). For URL output, the sanitizer uses
          percent-encoding (special characters → %XX hex codes). For file system output, the sanitizer strips
          path traversal characters (../), null bytes, and special characters.
        </p>
        <p>
          Validation error messages should be consistent and informative — they should indicate which field failed
          validation, what the expected format is, and what the actual input was (with dangerous content removed).
          Error messages should follow a standard format (RFC 7807: Problem Details for HTTP APIs) — this enables
          API consumers to understand and fix validation errors. Error messages should not expose internal details
          (stack traces, database queries, internal field names) — they should use user-friendly field names and
          generic error descriptions.
        </p>
        <p>
          Input validation logging is essential for detecting injection attacks — log validation failures
          (rejected input, sanitized content, business rule violations) and alert on anomalous patterns
          (multiple validation failures from the same client, injection patterns in input, file uploads with
          malicious content). Validation failure logs enable early detection of injection attempts — attackers
          often send multiple malicious inputs before finding one that works, and logging these attempts enables
          rapid response before a successful attack.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Whitelist versus blacklist validation is the primary trade-off in input validation. Whitelist validation
          (allow only known-good patterns) is more secure but more restrictive — it may reject legitimate input
          that does not match the whitelist. Blacklist validation (block known-bad patterns) is more permissive
          but less secure — it allows any input that is not on the blacklist, including novel attack patterns. The
          recommended approach is whitelist validation for all security-critical input (SQL queries, HTML output,
          file names, URLs) and blacklist validation as a supplementary defense for non-critical input (comments,
          descriptions, free-form text).
        </p>
        <p>
          Schema validation versus manual validation is a trade-off between automation and flexibility. Schema
          validation (JSON Schema, OpenAPI) defines the expected input structure once and validates all requests
          automatically — it is automated, self-documenting, and provides consistent error messages. However,
          schema validation is limited to structural validation (types, formats, ranges) — it cannot validate
          business rules (user exists, inventory available, date in future). Manual validation (custom validation
          code) can validate business rules but is error-prone (developers may forget to validate a field) and
          does not provide consistent error messages. The recommended approach is schema validation for structural
          validation and manual validation for business rules.
        </p>
        <p>
          Client-side versus server-side validation is a trade-off between user experience and security.
          Client-side validation (JavaScript validation in the browser) provides immediate feedback to users —
          they see validation errors before submitting the form, improving the user experience. However,
          client-side validation is not a security control — attackers can bypass it by sending requests directly
          to the API (curl, Postman, custom scripts). Server-side validation is the security control — it
          validates all input on the server, regardless of whether client-side validation passed. The recommended
          approach is both — client-side validation for user experience, server-side validation for security.
        </p>
        <p>
          Synchronous versus asynchronous validation is a trade-off between accuracy and performance. Synchronous
          validation (the server waits for validation to complete before processing the request) is accurate —
          invalid input is rejected before processing. Asynchronous validation (the server validates input in the
          background and processes the request immediately) is faster — it does not add latency to the request —
          but it is inaccurate (invalid input may be processed before validation completes). The recommended
          approach is synchronous validation for all security-critical input (SQL injection, XSS, command
          injection) and asynchronous validation for non-critical input (format validation, business rule
          validation that does not affect security).
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use whitelist validation for all security-critical input — define what is allowed (alphanumeric
          characters, specific symbols, expected formats) and reject everything else. Whitelist validation is
          more restrictive but significantly more secure — attackers cannot bypass it using encoding tricks or
          novel attack patterns.
        </p>
        <p>
          Use JSON Schema or OpenAPI for API input validation — define the expected input structure (required
          fields, data types, formats, value ranges) and validate all requests against the schema. Schema
          validation provides early rejection of invalid input, self-documenting APIs, and consistent error
          messages. Integrate schema validation into the CI/CD pipeline — validate requests in staging before
          deploying to production.
        </p>
        <p>
          Use context-aware sanitization — encode input differently depending on the output context (HTML body,
          HTML attribute, JavaScript, URL, CSS, SQL). Use well-tested sanitization libraries (DOMPurify for HTML,
          parameterized queries for SQL, encodeURIComponent for URLs) — do not implement your own sanitization,
          as it is easy to make mistakes (missing characters, incorrect encoding for context).
        </p>
        <p>
          Validate file uploads strictly — only allow expected file types (validate MIME type, not just
          extension), limit file size (maximum upload size), validate file content (scan for malware, verify
          file structure), and store uploaded files outside the web root. File uploads are a common attack
          vector — strict validation is essential.
        </p>
        <p>
          Implement both client-side and server-side validation — client-side validation for user experience
          (immediate feedback before form submission), server-side validation for security (validating all input
          on the server, regardless of client-side validation). Server-side validation is the security control —
          never rely on client-side validation alone.
        </p>
        <p>
          Log validation failures and alert on anomalous patterns — log rejected input, sanitized content, and
          business rule violations. Alert on multiple validation failures from the same client (indicating
          injection attempts), injection patterns in input (SQL keywords, HTML tags, command injection patterns),
          and file uploads with malicious content. Early detection enables rapid response before a successful
          attack.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Relying solely on blacklist validation is a common pitfall. Blacklists are easily bypassed — attackers
          can use encoding tricks, alternative syntaxes, or novel attack patterns that are not on the blacklist.
          The fix is to use whitelist validation — define what is allowed and reject everything else. Blacklists
          should only be used as a supplementary defense, never as the primary defense.
        </p>
        <p>
          Not validating all input sources is a common pitfall. Developers often validate request body input but
          forget to validate URL parameters, headers, cookies, and file uploads. All input sources are untrusted
          and must be validated. The fix is to validate all input sources — request body, URL parameters, headers,
          cookies, file uploads, and third-party API responses.
        </p>
        <p>
          Using the wrong encoding for the output context is a common pitfall. Encoding user input for HTML body
          context but placing it in a JavaScript string allows an attacker to break out of the string and inject
          code. The fix is to use context-aware sanitization — encode input for the specific output context (HTML
          body, HTML attribute, JavaScript, URL, CSS, SQL).
        </p>
        <p>
          Trusting client-side validation is a common pitfall. Client-side validation (JavaScript validation in
          the browser) can be bypassed by sending requests directly to the API (curl, Postman, custom scripts).
          The fix is to validate all input on the server — client-side validation is for user experience,
          server-side validation is for security.
        </p>
        <p>
          Not validating file uploads is a common pitfall. File uploads are a common attack vector — attackers
          can upload malicious files (web shells, malware, XSS payloads) that are executed when accessed. The
          fix is to validate file uploads strictly — only allow expected file types, validate file content (not
          just extension), store uploaded files outside the web root, and scan for malware before processing.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses JSON Schema validation for all API endpoints — each endpoint has a
          JSON Schema definition (required fields, data types, formats, value ranges) that is validated
          automatically before processing. The platform uses context-aware sanitization (HTML entity encoding
          for product descriptions, parameterized queries for database queries, percent-encoding for URLs) and
          strict file upload validation (only image files, maximum 5MB, malware scanning). The platform logs
          validation failures and alerts on anomalous patterns (multiple validation failures from the same
          client, injection patterns in input). The platform has had zero successful injection attacks since
          implementing these controls.
        </p>
        <p>
          A financial services company uses whitelist validation for all security-critical input — account numbers
          (numeric only, fixed length), email addresses (validated against email regex), phone numbers (validated
          against phone number regex), and amounts (numeric, positive, two decimal places). The company uses
          parameterized queries for all database queries (no string concatenation) and HTML entity encoding for
          all HTML output. The company logs validation failures and alerts on injection patterns (SQL keywords,
          HTML tags, command injection patterns). The company has achieved PCI-DSS compliance in part due to its
          input validation controls.
        </p>
        <p>
          A healthcare organization uses JSON Schema validation for its patient data API — each endpoint has a
          JSON Schema definition that is validated automatically. The organization uses context-aware
          sanitization (HTML entity encoding for patient notes, parameterized queries for database queries,
          percent-encoding for URLs) and strict file upload validation (only PDF and image files, maximum 10MB,
          malware scanning). The organization logs validation failures and alerts on anomalous patterns (multiple
          validation failures from the same provider, injection patterns in input). The organization has achieved
          HIPAA compliance in part due to its input validation controls.
        </p>
        <p>
          A SaaS platform uses schema validation (OpenAPI) for its public API — the OpenAPI schema defines the
          expected input structure for all endpoints, and all requests are validated against the schema before
          processing. The platform uses context-aware sanitization (HTML entity encoding for user-generated
          content, parameterized queries for database queries, percent-encoding for URLs) and strict file upload
          validation (only expected file types, maximum 50MB, malware scanning). The platform logs validation
          failures and alerts on injection attempts. The platform has achieved SOC 2 compliance in part due to
          its input validation controls.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the difference between whitelist and blacklist validation, and why is whitelist preferred?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Whitelist validation defines what is allowed (alphanumeric characters, specific symbols, expected formats) and rejects everything else. Blacklist validation defines what is blocked (&lt;script&gt;, SELECT, DROP, javascript:) and allows everything else.
            </p>
            <p>
              Whitelist validation is preferred because it is more secure — attackers cannot bypass whitelist validation using encoding tricks, alternative syntaxes, or novel attack patterns because anything not explicitly allowed is rejected. Blacklist validation is easily bypassed — attackers can use encoding tricks (&#60;script&#62;, java&#115;cript:) or novel attack patterns that are not on the blacklist. Whitelist validation should be used for all security-critical input, with blacklist validation only as a supplementary defense.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is context-aware sanitization, and why is it important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Context-aware sanitization encodes input differently depending on the output context. HTML body encoding (&lt; → &amp;lt;, &gt; → &amp;gt;) prevents XSS in HTML content. HTML attribute encoding (&quot; → &amp;quot;) prevents breaking out of attributes. JavaScript encoding (\xHH) prevents breaking out of JavaScript strings. URL encoding (%XX) prevents injecting malicious URLs. SQL parameterization prevents SQL injection.
            </p>
            <p>
              Context-aware sanitization is important because using the wrong encoding for the context leaves the application vulnerable. Encoding for HTML body context but placing the input in a JavaScript string allows an attacker to break out of the string and inject code. Context-aware sanitization ensures that input is safely encoded for the specific output context, preventing injection attacks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you validate file uploads securely?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Validate file uploads strictly: (1) Validate file type — check MIME type (not just extension) against a whitelist of allowed types. (2) Limit file size — set a maximum upload size (e.g., 5MB) to prevent denial-of-service. (3) Validate file content — scan for malware, verify file structure (e.g., a JPEG file should have the correct JPEG header). (4) Sanitize file name — strip path traversal characters (../), null bytes, and special characters. (5) Store uploaded files outside the web root — prevent direct execution of uploaded files.
            </p>
            <p>
              File uploads are a common attack vector — attackers can upload malicious files (web shells, malware, XSS payloads) that are executed when accessed. Strict file upload validation is essential to prevent these attacks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is JSON Schema validation, and how does it improve API security?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              JSON Schema validation defines the expected input structure (required fields, data types, formats, value ranges) and validates all requests against the schema. It provides early rejection of invalid input (before reaching business logic), self-documenting APIs (the schema serves as API documentation), and consistent error messages (validation errors follow a standard format, RFC 7807).
            </p>
            <p>
              JSON Schema validation improves API security by rejecting obviously malicious input early — input with wrong data types, invalid formats, or out-of-range values is rejected before reaching the application logic. This reduces the attack surface — the application logic only receives validated input, making it harder for attackers to exploit vulnerabilities.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: Why is client-side validation not sufficient for security?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Client-side validation (JavaScript validation in the browser) can be bypassed by sending requests directly to the API (curl, Postman, custom scripts) — the attacker does not need to interact with the browser&apos;s validation. Client-side validation is for user experience (immediate feedback before form submission), not for security.
            </p>
            <p>
              Server-side validation is the security control — it validates all input on the server, regardless of whether client-side validation passed. The recommended approach is both — client-side validation for user experience, server-side validation for security. Never rely on client-side validation alone.
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
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Input Validation Cheat Sheet
            </a> — Comprehensive input validation best practices.
          </li>
          <li>
            <a href="https://json-schema.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              JSON Schema Specification
            </a> — JSON Schema definition and validation guide.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP XSS Prevention Cheat Sheet
            </a> — Context-aware output encoding guide.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP File Upload Cheat Sheet
            </a> — Secure file upload validation guide.
          </li>
          <li>
            <a href="https://tools.ietf.org/html/rfc7807" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 7807: Problem Details for HTTP APIs
            </a> — Standard format for API error responses.
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
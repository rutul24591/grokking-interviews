"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-security-input-validation-extensive",
  title: "Input Validation & Sanitization",
  description: "Comprehensive guide to input validation strategies, sanitization techniques, allowlist vs blocklist approaches, and defense-in-depth patterns for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "security",
  slug: "input-validation-sanitization",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-19",
  tags: ["security", "input-validation", "sanitization", "frontend", "web-security", "xss-prevention", "allowlist"],
  relatedTopics: ["xss-prevention", "content-security-policy", "csrf-protection"],
};

export default function InputValidationSanitizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Input validation</strong> is the process of verifying that user-provided data meets expected
          criteria before processing it. <strong>Sanitization</strong> goes further by cleaning or transforming
          input to remove potentially harmful content. Together, they form the first line of defense against
          injection attacks, data corruption, and application errors.
        </p>
        <p>
          Input validation answers: &quot;Is this input acceptable?&quot; Sanitization answers: &quot;How can I
          make this input safe to use?&quot; Both are essential because:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Security:</strong> Prevents injection attacks (XSS, SQL injection, command injection)
          </li>
          <li>
            <strong>Data integrity:</strong> Ensures data conforms to expected formats and ranges
          </li>
          <li>
            <strong>Error prevention:</strong> Catches invalid input early, before it causes downstream failures
          </li>
          <li>
            <strong>User experience:</strong> Provides immediate feedback on invalid input
          </li>
        </ul>
        <p>
          The fundamental principle is <strong>&quot;never trust user input&quot;</strong>. All input is
          potentially malicious until proven otherwise—whether from form fields, URL parameters, API requests,
          file uploads, or third-party integrations.
        </p>
        <p>
          <strong>Why input validation matters for staff/principal engineers:</strong> As a technical leader,
          you&apos;re responsible for establishing security standards, defining validation patterns, and making
          trade-off decisions between security and usability. Understanding validation strategies enables you to
          design systems that are secure by default while maintaining good user experience.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Validate at Every Boundary</h3>
          <p>
            Validate input at every trust boundary: client-side for UX, server-side for security, API gateways,
            database layer, and before output. Defense in depth means assuming any single validation layer might
            fail or be bypassed.
          </p>
        </div>
      </section>

      <section>
        <h2>Validation Strategies</h2>
        <p>
          There are two fundamental approaches to input validation: allowlist (whitelist) and blocklist
          (blacklist). Understanding when to use each is critical for effective security.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/validation-strategies.svg"
          alt="Input Validation Strategies comparing Allowlist vs Blocklist approaches"
          caption="Validation Strategies: Allowlist (whitelist) defines what&apos;s allowed; Blocklist (blacklist) defines what&apos;s forbidden. Allowlist is more secure."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Allowlist Validation (Recommended)</h3>
        <p>
          Allowlist validation defines what input is <strong>allowed</strong> and rejects everything else.
          This is the more secure approach because it&apos;s impossible for an attacker to guess all possible
          variations of malicious input. For example, check if input is in an array of allowed values like draft, published, or archived, or validate against patterns like email regex or username pattern for 3-20 alphanumeric characters.
        </p>
        <p>
          <strong>When to use allowlist:</strong>
        </p>
        <ul className="space-y-2">
          <li>When you know all valid values in advance (enums, status codes)</li>
          <li>For structured data (emails, phone numbers, dates)</li>
          <li>For identifiers (usernames, product IDs)</li>
          <li>Whenever possible—allowlist is always more secure than blocklist</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Blocklist Validation (Not Recommended)</h3>
        <p>
          Blocklist validation defines what input is <strong>forbidden</strong> and allows everything else.
          This approach is inherently weaker because attackers can find variations you haven&apos;t blocked. For example, blocking patterns like <code className="text-sm">&lt;script</code>, <code className="text-sm">javascript:</code>, <code className="text-sm">onerror=</code>, <code className="text-sm">onclick=</code> can be bypassed with case variations (<code className="text-sm">&lt;SCRIPT&gt;</code>), nested tags, HTML entities (<code className="text-sm">&amp;#60;script&amp;#62;</code>), different events (<code className="text-sm">&lt;svg onload=...&gt;</code>), and countless other bypasses.
        </p>
        <p>
          <strong>Why blocklist fails:</strong>
        </p>
        <ul className="space-y-2">
          <li>Impossible to enumerate all malicious variations</li>
          <li>Attackers find bypasses through encoding, case variations, Unicode</li>
          <li>Requires constant updates as new attack vectors emerge</li>
          <li>False sense of security</li>
        </ul>
        <p>
          <strong>When blocklist might be acceptable:</strong>
        </p>
        <ul className="space-y-2">
          <li>As a secondary defense layer (not primary)</li>
          <li>For rate limiting (block known bad IPs)</li>
          <li>For logging/monitoring (detect known attack patterns)</li>
          <li>Never as the sole validation mechanism</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Allowlist Is Always More Secure</h3>
          <p>
            Blocklist validation is like trying to keep water out of a sieve—you can&apos;t plug every hole.
            Allowlist validation is like a dam—it only lets through what you explicitly allow. Use allowlist
            whenever possible.
          </p>
        </div>
      </section>

      <section>
        <h2>Validation Layers</h2>
        <p>
          Effective input validation requires multiple layers. Each layer serves a different purpose and
          provides fallback protection if other layers fail.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/validation-layers.svg"
          alt="Input Validation Layers showing Client-side, Server-side, API, Database, and Output validation"
          caption="Validation Layers: Each layer provides different protection. Client-side for UX, server-side for security, database for integrity."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 1: Client-Side Validation</h3>
        <p>
          Client-side validation provides immediate user feedback but provides <strong>no security</strong>.
          Attackers can bypass client-side validation entirely. Use HTML5 built-in validation like <code className="text-sm">type="email"</code>, <code className="text-sm">required</code>, <code className="text-sm">minlength</code>, <code className="text-sm">maxlength</code>, <code className="text-sm">type="number"</code> with <code className="text-sm">min</code>/<code className="text-sm">max</code>, and <code className="text-sm">pattern</code> attribute. In JavaScript (React example), validate email with regex pattern and set error state. <strong>IMPORTANT:</strong> This is for UX only—the server MUST validate independently.
        </p>
        <p>
          <strong>Purpose:</strong> User experience, immediate feedback, reduce server load from invalid requests.
        </p>
        <p>
          <strong>Limitations:</strong> Can be completely bypassed via browser dev tools, direct API calls,
          or custom clients.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 2: Server-Side Validation (Critical)</h3>
        <p>
          Server-side validation is <strong>mandatory for security</strong>. Never trust client-side validation. In Node.js/Express, validate email with regex pattern, username with alphanumeric pattern for 3-20 characters, age with type and range check (18-120), sanitize before use, and return 400 status with error messages for invalid input.
        </p>
        <p>
          <strong>Purpose:</strong> Security, data integrity, business rule enforcement.
        </p>
        <p>
          <strong>Requirements:</strong> Validate all input, use allowlist patterns, sanitize before use,
          return generic error messages (don&apos;t leak implementation details).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 3: Database Validation</h3>
        <p>
          Database-level validation provides a final safety net for data integrity. Use SQL constraints like <code className="text-sm">NOT NULL</code>, <code className="text-sm">UNIQUE</code>, <code className="text-sm">CHECK</code> constraints (e.g., username pattern, age range 18-120, status IN list), and parameterized queries to prevent SQL injection. For example, use <code className="text-sm">INSERT INTO users (email, username, age) VALUES ($1, $2, $3)</code> with parameter array.
        </p>
        <p>
          <strong>Purpose:</strong> Data integrity, constraint enforcement, injection prevention.
        </p>
        <p>
          <strong>Requirements:</strong> Use constraints (CHECK, UNIQUE, NOT NULL), use parameterized queries,
          validate data types at database level.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 4: Output Validation</h3>
        <p>
          Validate and encode data before output to prevent injection attacks. React automatically escapes JSX expressions in <code className="text-sm">{'{userInput}'}</code>, but be careful with <code className="text-sm">dangerouslySetInnerHTML</code> which is dangerous without sanitization. Use DOMPurify to sanitize HTML content before using with dangerouslySetInnerHTML. For URLs, validate protocol using URL constructor and allow only <code className="text-sm">http:</code> and <code className="text-sm">https:</code>, returning a safe default like <code className="text-sm">/safe-default</code> for invalid URLs.
        </p>
        <p>
          <strong>Purpose:</strong> Prevent XSS, injection attacks at output layer.
        </p>
        <p>
          <strong>Requirements:</strong> Encode for context (HTML, JavaScript, URL, CSS), use sanitization
          libraries for HTML content, validate URLs before use in href/src attributes.
        </p>
      </section>

      <section>
        <h2>Sanitization Techniques</h2>
        <p>
          Sanitization transforms input to make it safe for use in a specific context. Unlike validation
          (which rejects invalid input), sanitization modifies input to remove harmful content.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTML Sanitization</h3>
        <p>
          When you must allow HTML input (rich text editors, comments with formatting), use battle-tested
          sanitization libraries. Import DOMPurify and use <code className="text-sm">DOMPurify.sanitize(dirtyHTML)</code> for basic sanitization. Configure allowed tags (like b, i, em, strong, a, p, br, ul, ol, li) and attributes (like href, target, rel), and use ALLOWED_URI_REGEXP for URL validation. For specific contexts, use USE_PROFILES like svg or mathMl. For server-side sanitization in Node.js, use createDOMPurify with JSDOM.
        </p>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul className="space-y-2">
          <li>Sanitize on both client and server</li>
          <li>Use strict allowlists for tags and attributes</li>
          <li>Validate URLs in href/src attributes</li>
          <li>Keep DOMPurify updated (new bypasses discovered regularly)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SQL Sanitization (Use Parameterized Queries)</h3>
        <p>
          Never concatenate user input into SQL queries. Use parameterized queries or ORMs. For example, use <code className="text-sm">SELECT * FROM users WHERE username = $1</code> with parameter array instead of string concatenation. For LIKE queries, escape special characters using a function like <code className="text-sm">escapeLike(str)</code> that replaces backslash, percent, and underscore with escaped versions.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">URL Sanitization</h3>
        <p>
          Validate and sanitize URLs before using them in href, src, or redirect attributes. Implement a <code className="text-sm">sanitizeUrl(url)</code> function that parses the URL, checks protocol against an allowlist (<code className="text-sm">http:</code>, <code className="text-sm">https:</code>, <code className="text-sm">mailto:</code>, <code className="text-sm">tel:</code>), blocks dangerous protocols like <code className="text-sm">javascript:</code>, <code className="text-sm">data:</code>, <code className="text-sm">vbscript:</code>, validates hostname to prevent internal network access (block localhost, 127.0.0.1, 192.168.*, 10.*), and returns <code className="text-sm">/safe-default</code> for invalid URLs. Usage: <code className="text-sm">{'<a href={sanitizeUrl(userProvidedUrl)}>Link</a>'}</code>.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">File Upload Sanitization</h3>
        <p>
          File uploads require special handling to prevent malicious file execution. Implement a <code className="text-sm">validateFile(file, allowedMimeTypes)</code> function that checks MIME type (not just extension), validates file size (e.g., 5MB max), sanitizes filename by replacing special characters and converting to lowercase, generates a new filename using crypto.randomUUID() to prevent path traversal, and stores uploads outside web root serving through controlled endpoints instead of direct URL access.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Sanitization Is Context-Specific</h3>
          <p>
            The same input requires different sanitization depending on where it&apos;s used. HTML sanitization
            doesn&apos;t protect against SQL injection. URL sanitization doesn&apos;t protect against XSS.
            Always sanitize for the specific context where data will be used.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Validation Patterns</h2>
        <p>
          These patterns cover the most common validation scenarios in web applications.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Validation</h3>
        <p>
          Use a basic email pattern which covers 99 percent of valid emails, or a more comprehensive RFC 5322 compliant pattern. Best practice: use built-in HTML5 validation (type email, required) plus server-side pattern matching. Server-side, check if email is a string, length is under 254 characters, and matches the pattern.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Username Validation</h3>
        <p>
          Use an allowlist pattern for alphanumeric plus underscore, 3-20 characters. Include a reserved username check for words like admin, root, system, api, null, undefined. Implement a validateUsername function that checks the pattern and excludes reserved words (case-insensitive).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Phone Number Validation</h3>
        <p>
          Use libphonenumber library for production (handles international numbers) with parsePhoneNumber and isValidPhoneNumber. For simple North American numbers, use a pattern for optional plus, country code, area code, and local number. Sanitize by removing all non-digits except leading plus.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Numeric Range Validation</h3>
        <p>
          Implement a validateNumber function that converts to Number, checks if it's actually a number (not NaN), checks integer requirement, and validates min/max range. Usage: validateNumber with age (min 18, max 120, integer true) or price (min 0) for non-negative.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Date Validation</h3>
        <p>
          Implement a validateDate function that takes dateString with optional min and max parameters, creates a Date object, checks if valid (not NaN), validates min/max range, and optionally checks date is not in future. Usage: for date of birth validation, set minDob to 120 years ago and maxDob to 18 years ago, then validate the date is within that range.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Considerations</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Allowlist</strong></td>
              <td className="p-3">
                • Maximum security<br/>
                • Impossible to bypass with unknown attacks<br/>
                • Clear, maintainable rules
              </td>
              <td className="p-3">
                • Requires knowing all valid values<br/>
                • May reject edge cases<br/>
                • More initial effort
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Blocklist</strong></td>
              <td className="p-3">
                • Easy to implement initially<br/>
                • Allows more input variations<br/>
                • Less restrictive UX
              </td>
              <td className="p-3">
                • Inherently insecure<br/>
                • Bypasses always possible<br/>
                • Requires constant updates
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Client-side only</strong></td>
              <td className="p-3">
                • Immediate feedback<br/>
                • Reduces server load<br/>
                • Better UX
              </td>
              <td className="p-3">
                • Zero security<br/>
                • Easily bypassed<br/>
                • False sense of security
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Server-side only</strong></td>
              <td className="p-3">
                • Secure<br/>
                • Single source of truth<br/>
                • Cannot be bypassed
              </td>
              <td className="p-3">
                • Poor UX (round-trip for errors)<br/>
                • Increased server load<br/>
                • Users frustrated by late errors
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Both (Recommended)</strong></td>
              <td className="p-3">
                • Best of both worlds<br/>
                • Good UX + security<br/>
                • Defense in depth
              </td>
              <td className="p-3">
                • More code to maintain<br/>
                • Must keep rules in sync<br/>
                • Higher initial effort
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Validation Design</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use allowlist whenever possible:</strong> Define what&apos;s allowed, not what&apos;s forbidden
          </li>
          <li>
            <strong>Validate at every layer:</strong> Client, server, database, output
          </li>
          <li>
            <strong>Fail closed:</strong> Reject input when validation is uncertain
          </li>
          <li>
            <strong>Use generic error messages:</strong> Don&apos;t leak implementation details
          </li>
          <li>
            <strong>Validate early:</strong> Reject invalid input as soon as possible
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sanitization</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use battle-tested libraries:</strong> DOMPurify for HTML, parameterized queries for SQL
          </li>
          <li>
            <strong>Sanitize for specific context:</strong> HTML sanitization doesn&apos;t protect against SQL injection
          </li>
          <li>
            <strong>Sanitize on input and output:</strong> Defense in depth
          </li>
          <li>
            <strong>Keep libraries updated:</strong> New bypasses discovered regularly
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Handling</h3>
        <ul className="space-y-2">
          <li>
            <strong>Return generic errors:</strong> &quot;Invalid input&quot; not &quot;Email format invalid&quot;
          </li>
          <li>
            <strong>Log detailed errors:</strong> For debugging and security monitoring
          </li>
          <li>
            <strong>Rate limit validation failures:</strong> Detect brute-force attempts
          </li>
          <li>
            <strong>Alert on patterns:</strong> Multiple validation failures from same source
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing</h3>
        <ul className="space-y-2">
          <li>
            <strong>Test with malicious payloads:</strong> XSS, SQL injection, path traversal
          </li>
          <li>
            <strong>Test edge cases:</strong> Empty strings, null, undefined, very long input
          </li>
          <li>
            <strong>Test encoding variations:</strong> URL encoding, HTML entities, Unicode
          </li>
          <li>
            <strong>Automate validation tests:</strong> Include in CI/CD pipeline
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Validation Is Ongoing</h3>
          <p>
            Input validation isn&apos;t a one-time implementation. New attack vectors emerge, requirements change,
            and edge cases are discovered. Regularly review and update validation rules, monitor for bypass attempts,
            and keep sanitization libraries updated.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Trusting client-side validation:</strong> Client-side validation is for UX only. Always
            validate on the server.
          </li>
          <li>
            <strong>Using blocklist as primary defense:</strong> Blocklists are inherently bypassable. Use
            allowlist whenever possible.
          </li>
          <li>
            <strong>Double-encoding bugs:</strong> Encoding already-encoded data can create vulnerabilities.
            Encode once, at the right layer.
          </li>
          <li>
            <strong>Inconsistent validation:</strong> Different validation rules on client and server lead to
            confusion and potential bypasses.
          </li>
          <li>
            <strong>Overly permissive patterns:</strong> <code className="text-sm">.*</code> or very broad
            patterns defeat the purpose of validation.
          </li>
          <li>
            <strong>Not validating content type:</strong> For file uploads, check MIME type, not just extension.
          </li>
          <li>
            <strong>Leaking information in errors:</strong> Detailed error messages help attackers understand
            your validation logic.
          </li>
          <li>
            <strong>Validating but not sanitizing:</strong> Validation checks if input is acceptable; sanitization
            makes it safe. Both are needed.
          </li>
          <li>
            <strong>Forgetting about Unicode:</strong> Attackers use Unicode variations, homoglyphs, and encoding
            to bypass ASCII-only validation.
          </li>
          <li>
            <strong>Not handling null/undefined:</strong> Always check for null, undefined, and empty strings
            before validation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-Commerce Product Search</h3>
        <p>
          <strong>Challenge:</strong> Users search for products with various query formats. Need to prevent
          injection attacks while allowing flexible search.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Client-side: Trim whitespace, minimum 2 characters</li>
          <li>Server-side: Escape LIKE query special characters (% and _)</li>
          <li>Database: Use parameterized queries, never string concatenation</li>
          <li>Output: Encode search term when displaying back to user</li>
          <li>Rate limit: Prevent search enumeration attacks</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Profile with Rich Bio</h3>
        <p>
          <strong>Challenge:</strong> Allow users to format their bio with HTML while preventing XSS attacks.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Client-side: WYSIWYG editor with limited formatting options</li>
          <li>Server-side: DOMPurify with strict allowlist (b, i, em, strong, a, p, br)</li>
          <li>URL validation: Sanitize href attributes, block javascript: protocol</li>
          <li>Database: Store sanitized HTML, not raw input</li>
          <li>Output: Additional encoding when rendering (React auto-escapes)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">File Upload for Profile Pictures</h3>
        <p>
          <strong>Challenge:</strong> Allow users to upload profile pictures while preventing malicious file
          execution.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Client-side: Check file type, size limit (5MB), image preview</li>
          <li>Server-side: Verify MIME type (not just extension), scan for malware</li>
          <li>Sanitization: Generate new filename (UUID), strip metadata</li>
          <li>Storage: Store outside web root, serve through controlled endpoint</li>
          <li>Processing: Resize and re-encode images (destroys embedded scripts)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">API Input Validation</h3>
        <p>
          <strong>Challenge:</strong> REST API accepts JSON from multiple clients (web, mobile, third-party).
          Need consistent validation across all entry points.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>Schema validation: Use JSON Schema or Zod for request validation</li>
          <li>Middleware: Centralized validation middleware for all routes</li>
          <li>Type checking: Validate types (string, number, boolean, array)</li>
          <li>Range validation: Check numeric ranges, string lengths</li>
          <li>Allowlist enums: Validate enum values against allowlist</li>
          <li>Error responses: Consistent 400 Bad Request with generic messages</li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Input Validation Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP XSS Filter Evasion Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://github.com/cure53/DOMPurify" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              DOMPurify GitHub Repository
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP SQL Injection Prevention Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Sandboxing" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs: HTML Sandboxing
            </a>
          </li>
          <li>
            <a href="https://portswigger.net/web-security" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PortSwigger Web Security Academy
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP File Upload Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://github.com/validatorjs/validator.js" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              validator.js - String Validation Library
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: What&apos;s the difference between allowlist and blocklist validation? Which is more secure?</p>
            <p className="mt-2 text-sm">
              A: <strong>Allowlist (whitelist)</strong> defines what input is allowed and rejects everything else.
              <strong>Blocklist (blacklist)</strong> defines what input is forbidden and allows everything else.
              Allowlist is significantly more secure because it&apos;s impossible for attackers to guess all
              possible variations of malicious input. Blocklists are inherently bypassable—attackers just need
              to find one variation you haven&apos;t blocked. Always use allowlist whenever possible.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: Why is client-side validation insufficient for security?</p>
            <p className="mt-2 text-sm">
              A: Client-side validation can be completely bypassed. Attackers can: modify JavaScript in browser
              dev tools, send direct API requests bypassing the frontend entirely, use custom clients or scripts,
              or disable JavaScript entirely. Client-side validation is for user experience (immediate feedback,
              reduced server load) but provides zero security. Server-side validation is mandatory—all input must
              be validated on the server regardless of client-side checks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: How would you validate and sanitize user input for a rich text comment field?</p>
            <p className="mt-2 text-sm">
              A: Layered approach: (1) Client-side WYSIWYG editor with limited formatting options for UX.
              (2) Server-side sanitization using DOMPurify with strict allowlist: ALLOWED_TAGS:
              [&apos;b&apos;, &apos;i&apos;, &apos;em&apos;, &apos;strong&apos;, &apos;a&apos;, &apos;p&apos;, &apos;br&apos;],
              ALLOWED_ATTR: [&apos;href&apos;]. (3) URL validation in href attributes—block javascript:, data:
              protocols. (4) Store sanitized HTML in database. (5) Output encoding when rendering (React
              auto-escapes by default). (6) Rate limit comment submissions to prevent abuse.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: What validation layers would you implement for a file upload feature?</p>
            <p className="mt-2 text-sm">
              A: Multiple layers: (1) Client-side: Check file type (MIME, not just extension), enforce size
              limit (e.g., 5MB), show preview. (2) Server-side: Verify MIME type by reading file header (magic
              bytes), scan for malware, check file size again. (3) Sanitization: Generate new filename (UUID),
              strip metadata (EXIF data can contain scripts), resize/re-encode images (destroys embedded
              payloads). (4) Storage: Store outside web root, serve through controlled endpoint (not direct URL
              access). (5) Content-Type header when serving files.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: Why shouldn&apos;t you use detailed error messages for validation failures?</p>
            <p className="mt-2 text-sm">
              A: Detailed error messages help attackers understand your validation logic. &quot;Email format
              invalid&quot; tells them the email pattern check failed. &quot;Username already taken&quot;
              enables user enumeration attacks. &quot;Password must be 8+ characters&quot; confirms the password
              length requirement. Instead: return generic messages (&quot;Invalid input&quot;) to users, log
              detailed errors server-side for debugging, and monitor validation failure patterns for attack
              detection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: How do you prevent SQL injection when validating user input?</p>
            <p className="mt-2 text-sm">
              A: Never concatenate user input into SQL queries. Use parameterized queries (prepared statements)
              where input is passed as parameters, not interpolated into the query string. Example:
              <code className="text-sm">db.query(&apos;SELECT * FROM users WHERE id = $1&apos;, [userId])</code>
              not <code className="text-sm">{`db.query(\`SELECT * FROM users WHERE id = \${userId}\`)`}</code>. ORMs
              (Sequelize, Prisma, TypeORM) handle parameterization automatically. For LIKE queries, escape
              special characters (% and _). Input validation helps but parameterized queries are the definitive
              defense.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

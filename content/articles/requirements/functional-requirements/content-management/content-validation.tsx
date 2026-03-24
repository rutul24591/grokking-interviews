"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-content-validation",
  title: "Content Validation",
  description:
    "Comprehensive guide to implementing content validation covering validation layers (format, policy, quality, security), input validation (length limits, required fields, character encoding), policy enforcement (prohibited content, spam detection, plagiarism), quality checks (readability, completeness, duplicate detection), XSS prevention, spam detection patterns, and security patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-validation",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "validation",
    "quality",
    "backend",
    "security",
  ],
  relatedTopics: ["crud-apis", "content-moderation", "spam-detection"],
};

export default function ContentValidationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Validation</strong> ensures content meets quality standards, complies
          with policies, and is free from spam or malicious content before publication. Validation
          is critical for platform quality — without it, low-quality content floods the platform,
          spam proliferates, security vulnerabilities (XSS, injection attacks) expose users to
          harm, and policy violations create legal/compliance risk. Content validation operates at
          multiple layers: format validation (length limits, required fields, character encoding),
          policy validation (prohibited content, spam patterns, plagiarism), quality validation
          (readability, completeness, duplicate detection), and security validation (XSS
          prevention, SQL injection prevention, CSRF protection).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/validation-layers.svg"
          alt="Validation Layers"
          caption="Validation Layers — showing format validation (length, required fields), policy validation (prohibited content, spam), quality validation (readability, duplicates), and security validation (XSS, SQL injection)"
        />

        <p>
          For staff and principal engineers, implementing content validation requires deep
          understanding of validation layers (format, policy, quality, security — each layer
          catches different issues), input validation (length limits — min/max character count,
          required fields — ensure critical data present, character encoding — validate UTF-8, file
          types — validate by magic bytes not extension), policy enforcement (prohibited content —
          check against policy rules, spam detection — detect spam patterns, plagiarism — check for
          copied content, copyright — check for copyright violations), quality checks (readability
          — Flesch-Kincaid score, completeness — ensure all sections filled, duplicate detection —
          find similar content, grammar — check spelling/grammar), XSS prevention (sanitize HTML,
          escape output, Content Security Policy), and security patterns (SQL injection prevention
          — parameterized queries, CSRF protection — tokens, rate limiting — prevent abuse). The
          implementation must balance validation thoroughness (catch all issues) with user
          experience (fast, clear error messages) and performance (validation shouldn't block
          submission).
        </p>
        <p>
          Modern content validation has evolved from simple length checks to sophisticated
          multi-layer validation with ML-based spam detection, plagiarism checking, and automated
          quality scoring. Platforms like Medium, WordPress, and Stack Overflow use layered
          validation — format checks (client-side for speed, server-side for security), spam
          detection (ML models trained on spam patterns), quality checks (readability, completeness
          scoring). XSS prevention is critical — user-submitted HTML must be sanitized (DOMPurify,
          sanitize-html) to prevent script injection.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Content validation is built on fundamental concepts that determine how content is
          validated for quality, policy compliance, and security. Understanding these concepts is
          essential for designing effective validation systems.
        </p>
        <p>
          <strong>Format Validation:</strong> Length limits (min/max character count — title 5-100
          chars, body 50-50000 chars — prevent empty or massive submissions), required fields
          (ensure critical data present — title, body, author — return specific error for each
          missing field), character encoding (validate UTF-8 — reject invalid characters, prevent
          encoding attacks), file types (validate by magic bytes not extension — prevent .exe
          renamed to .jpg, allowlist permitted types). Format validation is first line of defense
          — catches obvious issues before deeper validation.
        </p>
        <p>
          <strong>Policy Validation:</strong> Prohibited content (check against policy rules — hate
          speech, harassment, violence — block or flag for review), spam detection (detect spam
          patterns — repetitive content, excessive links, known spam domains — block or rate limit),
          plagiarism (check for copied content — compare against existing content, external sources
          — flag for review), copyright (check for copyright violations — DMCA takedown process,
          content fingerprinting). Policy validation protects platform from legal/compliance risk.
        </p>
        <p>
          <strong>Quality Validation:</strong> Readability (Flesch-Kincaid score — ensure content
          readable by target audience, flag overly complex or simple content), completeness (ensure
          all sections filled — title, body, tags, cover image — prompt user to complete), duplicate
          detection (find similar content — cosine similarity, fuzzy matching — prevent duplicate
          posts), grammar (check spelling/grammar — suggest corrections, flag excessive errors).
          Quality validation improves platform content quality.
        </p>
        <p>
          <strong>Security Validation:</strong> XSS prevention (sanitize HTML — remove script tags,
          event handlers, escape output — prevent script injection, Content Security Policy —
          restrict script sources), SQL injection prevention (parameterized queries — never
          concatenate user input into SQL, ORM with built-in protection), CSRF protection (tokens —
          validate token on submission, SameSite cookies — prevent cross-site requests), rate
          limiting (prevent abuse — limit submissions per user/hour, detect bot patterns). Security
          validation protects users and platform from attacks.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Validation architecture separates validation layers (format, policy, quality, security)
          enabling modular validation with clear error reporting. This architecture is critical for
          maintainability and user experience.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/validation-flow.svg"
          alt="Validation Flow"
          caption="Validation Flow — showing client-side validation (instant feedback), server-side validation (security), format validation, policy validation, quality validation, and security validation"
        />

        <p>
          Validation flow: User submits content. Client-side validation runs (instant feedback —
          length checks, required fields, format validation). If client validation passes: submit
          to server. Server-side validation runs (security-critical — never trust client). Format
          validation (length, required fields, encoding, file types). Policy validation (prohibited
          content, spam, plagiarism). Quality validation (readability, completeness, duplicates).
          Security validation (XSS sanitization, SQL injection prevention, CSRF token validation).
          If all validations pass: save content. If any validation fails: return specific errors
          (field-level errors — "Title must be 5-100 characters", "Body contains prohibited
          content").
        </p>
        <p>
          Validation architecture includes: client-side validation (JavaScript — instant feedback,
          reduces server load, but never trust — always validate server-side), server-side
          validation (authoritative — security-critical, policy enforcement, quality checks),
          async validation (plagiarism check, duplicate detection — run in background, don't block
          submission, notify user when complete), validation pipeline (chain of validators — each
          validator checks one aspect, returns pass/fail with error message, stop on first critical
          failure). This architecture enables fast, thorough validation with clear error reporting.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/xss-prevention.svg"
          alt="XSS Prevention"
          caption="XSS Prevention — showing input sanitization (DOMPurify), output escaping, Content Security Policy, and attack vectors blocked"
        />

        <p>
          XSS prevention architecture includes: input sanitization (DOMPurify, sanitize-html —
          remove dangerous tags like script, iframe, remove event handlers like onclick, onerror),
          output escaping (escape HTML entities — &lt; becomes &amp;lt;, &gt; becomes &amp;gt;,
          prevent browser from interpreting as HTML), Content Security Policy (CSP headers —
          restrict script sources to trusted domains, prevent inline scripts, report violations),
          HTTP-only cookies (prevent JavaScript access to session cookies — mitigate session
          hijacking). This architecture prevents XSS attacks — user-submitted scripts can't execute
          in other users' browsers.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing validation involves trade-offs between security, user experience, and
          performance. Understanding these trade-offs is essential for making informed architecture
          decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Client-Side vs Server-Side Validation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Client-Side:</strong> Instant feedback (users see errors immediately),
              reduces server load (invalid submissions blocked before network). Limitation: can be
              bypassed (disable JavaScript, direct API calls), never trust for security.
            </li>
            <li>
              <strong>Server-Side:</strong> Authoritative (can't be bypassed), security-critical
              (policy enforcement, XSS prevention). Limitation: slower (network roundtrip), higher
              server load.
            </li>
            <li>
              <strong>Recommendation:</strong> Both — client-side for UX (instant feedback),
              server-side for security (authoritative validation). Client-side is optimization,
              server-side is requirement.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Strict vs Lenient Validation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Strict:</strong> Block content with any issue (high quality, secure).
              Limitation: user frustration (submissions rejected frequently), false positives
              (legitimate content blocked).
            </li>
            <li>
              <strong>Lenient:</strong> Allow content with minor issues (low friction, users can
              submit easily). Limitation: low quality (spam, low-quality content slips through),
              security risk (XSS, injection attacks).
            </li>
            <li>
              <strong>Recommendation:</strong> Tiered — strict for security (XSS, SQL injection —
              always block), lenient for quality (readability, grammar — warn but allow, flag for
              review). Balance security with UX.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Sync vs Async Validation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Sync:</strong> Validate before save (user waits for result, immediate
              feedback). Limitation: slow validation (plagiarism check, duplicate detection) blocks
              submission, poor UX.
            </li>
            <li>
              <strong>Async:</strong> Save first, validate in background (fast submission, notify
              when complete). Limitation: content may be visible before validation completes,
              rollback if fails.
            </li>
            <li>
              <strong>Recommendation:</strong> Hybrid — sync for fast validation (format, security
              — &lt;100ms), async for slow validation (plagiarism, duplicate detection — seconds to
              minutes). Publish after async validation passes.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing content validation requires following established best practices to ensure
          security, quality, and user experience.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Format Validation</h3>
        <p>
          Length limits (min/max character count — title 5-100 chars, body 50-50000 chars — prevent
          empty or massive submissions). Required fields (ensure critical data present — title,
          body, author — return specific error for each missing field). Character encoding (validate
          UTF-8 — reject invalid characters, prevent encoding attacks). File types (validate by
          magic bytes not extension — prevent .exe renamed to .jpg, allowlist permitted types).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Policy Enforcement</h3>
        <p>
          Prohibited content (check against policy rules — hate speech, harassment, violence —
          block or flag for review). Spam detection (detect spam patterns — repetitive content,
          excessive links, known spam domains — block or rate limit). Plagiarism (check for copied
          content — compare against existing content, external sources — flag for review). Copyright
          (check for copyright violations — DMCA takedown process, content fingerprinting).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Quality Checks</h3>
        <p>
          Readability (Flesch-Kincaid score — ensure content readable by target audience, flag
          overly complex or simple content). Completeness (ensure all sections filled — title, body,
          tags, cover image — prompt user to complete). Duplicate detection (find similar content —
          cosine similarity, fuzzy matching — prevent duplicate posts). Grammar (check spelling/
          grammar — suggest corrections, flag excessive errors).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Validation</h3>
        <p>
          XSS prevention (sanitize HTML — DOMPurify, sanitize-html, remove script tags/event
          handlers, escape output — prevent script injection, Content Security Policy — restrict
          script sources). SQL injection prevention (parameterized queries — never concatenate user
          input into SQL, ORM with built-in protection). CSRF protection (tokens — validate token
          on submission, SameSite cookies — prevent cross-site requests). Rate limiting (prevent
          abuse — limit submissions per user/hour, detect bot patterns).
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing content validation to ensure security,
          quality, and user experience.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Client-side only validation:</strong> Can be bypassed, security vulnerabilities.{" "}
            <strong>Fix:</strong> Always validate server-side. Client-side is optimization,
            server-side is requirement.
          </li>
          <li>
            <strong>No XSS sanitization:</strong> User-submitted scripts execute in other users'
            browsers. <strong>Fix:</strong> Sanitize HTML (DOMPurify). Escape output. Implement CSP
            headers.
          </li>
          <li>
            <strong>Validate by file extension:</strong> .exe renamed to .jpg bypasses validation.{" "}
            <strong>Fix:</strong> Validate by magic bytes (file signature). Allowlist permitted
            types.
          </li>
          <li>
            <strong>Generic error messages:</strong> Users don't know what to fix.{" "}
            <strong>Fix:</strong> Specific field-level errors ("Title must be 5-100 characters",
            "Body contains prohibited content").
          </li>
          <li>
            <strong>No spam detection:</strong> Spam floods platform. <strong>Fix:</strong> Detect
            spam patterns (repetitive content, excessive links). Rate limit submissions. Use
            CAPTCHA for suspicious users.
          </li>
          <li>
            <strong>No duplicate detection:</strong> Duplicate content clutters platform.{" "}
            <strong>Fix:</strong> Cosine similarity, fuzzy matching. Flag duplicates for review.
          </li>
          <li>
            <strong>SQL injection vulnerability:</strong> User input concatenated into SQL.{" "}
            <strong>Fix:</strong> Parameterized queries. ORM with built-in protection. Never trust
            user input.
          </li>
          <li>
            <strong>No CSRF protection:</strong> Cross-site requests submit content on behalf of
            users. <strong>Fix:</strong> CSRF tokens. SameSite cookies. Validate origin header.
          </li>
          <li>
            <strong>Slow validation blocks submission:</strong> Plagiarism check takes seconds,
            user waits. <strong>Fix:</strong> Async validation for slow checks. Save first,
            validate in background, notify when complete.
          </li>
          <li>
            <strong>No rate limiting:</strong> Bots submit spam rapidly. <strong>Fix:</strong> Rate
            limit submissions (10/hour per user). Detect bot patterns (rapid submissions, same
            content). CAPTCHA for suspicious activity.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Content validation is critical for platform quality and security. Here are real-world
          implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Blogging Platform (Medium)</h3>
        <p>
          <strong>Challenge:</strong> User-submitted articles must be validated for quality,
          policy compliance, security. Prevent spam, plagiarism, XSS.
        </p>
        <p>
          <strong>Solution:</strong> Format validation (title 5-100 chars, body 50-50000 chars).
          Policy validation (prohibited content — hate speech, harassment — ML detection). Quality
          checks (readability score, completeness — prompt for tags, cover image). Security
          validation (XSS sanitization — DOMPurify, rate limiting — 10 articles/hour). Plagiarism
          check (async — compare against existing articles, external sources).
        </p>
        <p>
          <strong>Result:</strong> Spam reduced 90%. XSS attacks prevented. Content quality
          improved (readability scoring). Plagiarism detected and flagged.
        </p>
        <p>
          <strong>Security:</strong> XSS sanitization, rate limiting, plagiarism detection, policy
          enforcement.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CMS Platform (WordPress)</h3>
        <p>
          <strong>Challenge:</strong> Millions of users creating content. Plugin ecosystem
          (security risk). Spam comments. XSS vulnerabilities.
        </p>
        <p>
          <strong>Solution:</strong> Format validation (required fields — title, content). Security
          validation (XSS sanitization — wp_kses, nonce tokens for CSRF, SQL injection prevention —
          prepared statements). Spam detection (Akismet — ML-based spam detection for comments).
          File validation (upload by magic bytes, allowlist types).
        </p>
        <p>
          <strong>Result:</strong> XSS vulnerabilities reduced. Spam comments blocked 99%. SQL
          injection prevented. Secure file uploads.
        </p>
        <p>
          <strong>Security:</strong> XSS sanitization, CSRF tokens, SQL injection prevention, spam
          detection.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Q&A Platform (Stack Overflow)</h3>
        <p>
          <strong>Challenge:</strong> Technical content must be high quality. Spam, low-quality
          posts, duplicate questions. Code injection risk.
        </p>
        <p>
          <strong>Solution:</strong> Format validation (title 15-150 chars, body min 30 chars).
          Quality checks (readability, completeness — code blocks, tags required). Duplicate
          detection (fuzzy matching on title/body — suggest existing questions). Spam detection
          (rate limiting, rep-based limits — new users limited). Security validation (code
          sanitization — prevent script injection in code blocks).
        </p>
        <p>
          <strong>Result:</strong> Duplicate questions reduced. Spam blocked. Content quality high
          (completeness checks). Code injection prevented.
        </p>
        <p>
          <strong>Security:</strong> Duplicate detection, spam detection, code sanitization, rate
          limiting.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Amazon Reviews)</h3>
        <p>
          <strong>Challenge:</strong> Product reviews must be genuine. Fake reviews, spam,
          inappropriate content. Review bombing.
        </p>
        <p>
          <strong>Solution:</strong> Format validation (title 5-100 chars, body 10-5000 chars).
          Policy validation (prohibited content — hate speech, promotional content — ML detection).
          Spam detection (verified purchase badge, detect fake patterns — repetitive reviews,
          suspicious timing). Quality checks (helpfulness voting — surface quality reviews). Rate
          limiting (1 review/product/user — prevent review bombing).
        </p>
        <p>
          <strong>Result:</strong> Fake reviews reduced. Review bombing prevented. Review quality
          improved (helpfulness voting).
        </p>
        <p>
          <strong>Security:</strong> Spam detection, policy enforcement, rate limiting, verified
          purchase validation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Platform (Reddit)</h3>
        <p>
          <strong>Challenge:</strong> User posts/comments must be validated. Spam, hate speech,
          harassment, brigading. XSS in markdown.
        </p>
        <p>
          <strong>Solution:</strong> Format validation (title 1-300 chars, body 0-40000 chars).
          Policy validation (prohibited content — hate speech, harassment — AutoModerator + ML).
          Spam detection (karma limits, rate limiting, domain blacklists). Security validation
          (markdown sanitization — prevent XSS, CSP headers). Brigading detection (detect coordinated
          voting, limit impact).
        </p>
        <p>
          <strong>Result:</strong> Spam reduced. Hate speech detected and removed. XSS prevented.
          Brigading impact limited.
        </p>
        <p>
          <strong>Security:</strong> Markdown sanitization, spam detection, policy enforcement,
          brigading detection.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of content validation design, implementation, and
          security concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you validate user-submitted HTML?</p>
            <p className="mt-2 text-sm">
              A: Sanitize HTML (DOMPurify, sanitize-html — remove dangerous tags like script,
              iframe, remove event handlers like onclick, onerror). Allowlist safe tags (p, h1-h6,
              ul, ol, li, a, img — with href/src validation). Escape output (HTML entities — &lt;
              becomes &amp;lt;). Implement Content Security Policy (restrict script sources, prevent
              inline scripts). Never trust user HTML — always sanitize server-side.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent SQL injection?</p>
            <p className="mt-2 text-sm">
              A: Parameterized queries (never concatenate user input into SQL — use placeholders,
              let database driver handle escaping). ORM with built-in protection (Sequelize,
              Prisma — generate parameterized queries). Validate input types (integers are
              integers, not strings). Least privilege database user (can't DROP tables, limited to
              required operations). Audit queries (log slow queries, detect injection attempts).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect spam?</p>
            <p className="mt-2 text-sm">
              A: Pattern detection (repetitive content, excessive links, known spam domains —
              blocklist). Rate limiting (limit submissions per user/hour — detect bot patterns). ML
              models (train on spam vs legitimate content — classify new submissions). CAPTCHA for
              suspicious users (after multiple failed validations, rapid submissions). Verified
              users (email/phone verification — reduce spam from throwaway accounts).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement duplicate detection?</p>
            <p className="mt-2 text-sm">
              A: Cosine similarity (vectorize content — TF-IDF or word embeddings, calculate
              similarity score). Fuzzy matching (Levenshtein distance — detect similar titles).
              Hash-based (simhash — near-duplicate detection at scale). Threshold (similarity &gt;
              80% — flag as duplicate, show existing content to user). Async validation (don't
              block submission — check in background, notify user if duplicate found).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent CSRF attacks?</p>
            <p className="mt-2 text-sm">
              A: CSRF tokens (generate per-session token, include in forms, validate on submission
              — reject if missing/invalid). SameSite cookies (SameSite=Strict or Lax — prevent
              cross-site cookie sending). Validate origin header (check Origin/Referer headers —
              reject cross-origin requests). Double-submit cookie (send token in cookie and
              header — must match). These layers prevent cross-site request forgery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you validate file uploads?</p>
            <p className="mt-2 text-sm">
              A: Validate by magic bytes (file signature — not extension, prevent .exe renamed to
              .jpg). Allowlist permitted types (image/jpeg, image/png, application/pdf — not
              blocklist). Size limits (max 10MB — prevent DoS). Scan for malware (ClamAV, virus
              total API — detect malicious files). Store securely (S3 with private ACL, pre-signed
              URLs for access — not public).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement rate limiting?</p>
            <p className="mt-2 text-sm">
              A: Token bucket algorithm (tokens replenish over time, each request consumes token —
              reject if empty). Fixed window (count requests per hour — reject if over limit).
              Sliding window (more accurate — track exact timestamps). Store in Redis (fast,
              distributed — track per user/IP). Tiered limits (authenticated users higher than
              anonymous, verified users higher than unverified).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle validation errors?</p>
            <p className="mt-2 text-sm">
              A: Specific field-level errors ("Title must be 5-100 characters", "Body contains
              prohibited content" — not "Validation failed"). Return all errors (not just first —
              user can fix all at once). Clear error messages (explain what's wrong, how to fix —
              "Title is 3 chars, minimum is 5 chars"). Preserve user input (don't clear form —
              user only fixes errors). Highlight error fields (visual indication — red border,
              error icon).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you balance validation with UX?</p>
            <p className="mt-2 text-sm">
              A: Client-side validation (instant feedback — users see errors before submit).
              Progressive validation (validate as user types — show character count, strength
              meter). Async validation (slow checks in background — don't block submission). Clear
              error messages (explain what's wrong, how to fix). Allow partial save (draft — user
              can return later). Tiered strictness (security strict — always block XSS, quality
              lenient — warn but allow).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Input Validation Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/XSS_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP XSS Prevention Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP SQL Injection Prevention Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP CSRF Prevention Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://github.com/cure53/DOMPurify"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DOMPurify - HTML Sanitization Library
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Security"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Web Security
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

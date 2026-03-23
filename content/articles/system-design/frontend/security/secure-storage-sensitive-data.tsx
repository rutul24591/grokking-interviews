"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-security-secure-storage-extensive",
  title: "Secure Storage of Sensitive Data",
  description: "Comprehensive guide to securely storing sensitive data on the client-side, including tokens, credentials, PII, and best practices for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "security",
  slug: "secure-storage-sensitive-data",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-19",
  tags: ["security", "storage", "sensitive-data", "encryption", "frontend", "web-security", "tokens", "credentials"],
  relatedTopics: ["authentication-patterns", "secure-cookie-attributes", "xss-prevention"],
};

export default function SecureStorageSensitiveDataArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Secure storage of sensitive data</strong> refers to the practices and techniques for
          safely storing confidential information on the client-side. This includes authentication tokens,
          API keys, personal identifiable information (PII), payment details, and any data that could be
          misused if exposed.
        </p>
        <p>
          <strong>Critical principle:</strong> The browser is an <strong>untrusted environment</strong>.
          Anything stored client-side can potentially be accessed by attackers through XSS, malicious
          extensions, compromised devices, or physical access. The golden rule is: <strong>never store
          what you don&apos;t need</strong>.
        </p>
        <p>
          <strong>Common sensitive data types:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Authentication credentials:</strong> Passwords, API keys, access tokens, refresh tokens
          </li>
          <li>
            <strong>Personal data:</strong> Names, emails, addresses, phone numbers, government IDs
          </li>
          <li>
            <strong>Financial data:</strong> Credit card numbers, bank account details, payment tokens
          </li>
          <li>
            <strong>Health data:</strong> Medical records, health information (HIPAA protected)
          </li>
          <li>
            <strong>Session data:</strong> Session tokens, CSRF tokens, user preferences with PII
          </li>
        </ul>
        <p>
          <strong>Why secure storage matters for staff/principal engineers:</strong> As a technical leader,
          you&apos;re responsible for data protection strategies. Poor storage decisions lead to data
          breaches, compliance violations (GDPR, HIPAA, PCI-DSS), and loss of user trust. Understanding
          storage options and their trade-offs enables you to design secure, compliant applications.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Minimize Client-Side Storage</h3>
          <p>
            The most secure data is data you don&apos;t store. Question every piece of sensitive data:
            Does it need to be on the client? Can it be fetched on-demand? Can it be tokenized or
            encrypted? Default to server-side storage with minimal client-side caching.
          </p>
        </div>
      </section>

      <section>
        <h2>Storage Options Comparison</h2>
        <p>
          Different storage mechanisms offer different security characteristics. Understanding these is
          essential for making informed decisions.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/storage-options-comparison.svg"
          alt="Client-Side Storage Options comparison showing localStorage, sessionStorage, Cookies, and IndexedDB security characteristics"
          caption="Storage Options: Each has different security characteristics. Cookies with HttpOnly are most secure for tokens."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">localStorage</h3>
        <p>
          localStorage provides an API with methods like <code className="text-sm">setItem('key', 'value')</code>, <code className="text-sm">getItem('key')</code>, <code className="text-sm">removeKey('key')</code>, and <code className="text-sm">clear()</code>. It has ~5-10MB capacity, persists until explicitly cleared, is shared across all tabs/windows of the same origin, is XSS vulnerable (accessible via JavaScript), is NOT CSRF vulnerable (not auto-sent with requests), and has no encryption (plaintext storage). Never store sensitive data like auth tokens or passwords in localStorage as it's insecure.
        </p>
        <p>
          <strong>When to use:</strong> Non-sensitive data, user preferences, cached public data, UI state.
        </p>
        <p>
          <strong>When NOT to use:</strong> Tokens, passwords, PII, financial data, anything sensitive.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">sessionStorage</h3>
        <p>
          sessionStorage has the same API as localStorage (<code className="text-sm">setItem</code>, <code className="text-sm">getItem</code>, etc.) but different characteristics: ~5-10MB capacity, persists only until tab/window is closed, is per-tab (not shared across tabs), is XSS vulnerable (accessible via JavaScript), is NOT CSRF vulnerable, and has no encryption. It's slightly better than localStorage but still NOT secure for sensitive data like tokens.
        </p>
        <p>
          <strong>When to use:</strong> Temporary non-sensitive data, form state during multi-step flows,
          per-tab UI state.
        </p>
        <p>
          <strong>When NOT to use:</strong> Same as localStorage—anything sensitive.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cookies</h3>
        <p>
          Cookies are set server-side with the Set-Cookie header. A secure cookie configuration includes the name and value (like <code className="text-sm">authToken=abc123</code>), <code className="text-sm">HttpOnly</code> flag (JavaScript cannot access), <code className="text-sm">Secure</code> flag (HTTPS only), <code className="text-sm">SameSite=Strict</code> (CSRF protection), <code className="text-sm">Path=/</code>, and <code className="text-sm">Max-Age=3600</code>. Cookies have ~4KB capacity per cookie, persistence based on Max-Age/Expires, scope based on Domain/Path settings, are NOT XSS vulnerable (with HttpOnly), ARE CSRF vulnerable (auto-sent with requests but mitigated by SameSite), and are encrypted in transit (HTTPS) but plaintext at rest. Cookies are secure for tokens when properly configured with HttpOnly.
        </p>
        <p>
          <strong>When to use:</strong> Authentication tokens, session identifiers, CSRF tokens.
        </p>
        <p>
          <strong>When NOT to use:</strong> Large data (size limit), data needed by JavaScript.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">IndexedDB</h3>
        <p>
          IndexedDB uses an asynchronous API where you open a database with <code className="text-sm">indexedDB.open('MyDB', 1)</code>, handle the <code className="text-sm">onupgradeneeded</code> event to create object stores with a keyPath, then use <code className="text-sm">onsuccess</code> to get the database and perform transactions. It has ~50MB+ capacity (varies by browser), persists until explicitly cleared, is per-origin scope, is XSS vulnerable (accessible via JavaScript), is NOT CSRF vulnerable, and has encryption at rest (browser-dependent). It's better for large data but still NOT secure for sensitive plaintext data since encryption keys are also accessible via XSS.
        </p>
        <p>
          <strong>When to use:</strong> Large datasets, offline data, structured data with queries.
        </p>
        <p>
          <strong>When NOT to use:</strong> Sensitive data without encryption, simple key-value needs
          (use localStorage instead).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Storage Comparison Table</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Storage</th>
              <th className="p-3 text-left">XSS Safe</th>
              <th className="p-3 text-left">CSRF Safe</th>
              <th className="p-3 text-left">Capacity</th>
              <th className="p-3 text-left">Best Use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>localStorage</strong></td>
              <td className="p-3">✗ No</td>
              <td className="p-3">✓ Yes</td>
              <td className="p-3">5-10MB</td>
              <td className="p-3">Non-sensitive cached data</td>
            </tr>
            <tr>
              <td className="p-3"><strong>sessionStorage</strong></td>
              <td className="p-3">✗ No</td>
              <td className="p-3">✓ Yes</td>
              <td className="p-3">5-10MB</td>
              <td className="p-3">Per-tab temporary data</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Cookies (HttpOnly)</strong></td>
              <td className="p-3">✓ Yes</td>
              <td className="p-3">△ With SameSite</td>
              <td className="p-3">4KB</td>
              <td className="p-3">Auth tokens, sessions</td>
            </tr>
            <tr>
              <td className="p-3"><strong>IndexedDB</strong></td>
              <td className="p-3">✗ No</td>
              <td className="p-3">✓ Yes</td>
              <td className="p-3">50MB+</td>
              <td className="p-3">Large structured data</td>
            </tr>
          </tbody>
        </table>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: HttpOnly Cookies for Tokens</h3>
          <p>
            For authentication tokens, HttpOnly cookies are the gold standard. They&apos;re inaccessible
            to JavaScript (XSS-safe), automatically sent with requests (convenient), and can be protected
            against CSRF with SameSite. Never store tokens in localStorage if you can avoid it.
          </p>
        </div>
      </section>

      <section>
        <h2>Encryption for Client-Side Data</h2>
        <p>
          When you must store sensitive data client-side, encryption provides an additional layer of
          protection. However, encryption in the browser has fundamental limitations.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Web Crypto API</h3>
        <p>
          The Web Crypto API provides methods like <code className="text-sm">window.crypto.subtle.generateKey()</code> for generating AES-GCM keys with 256-bit length, <code className="text-sm">subtle.encrypt()</code> for encrypting data with a random IV, and <code className="text-sm">subtle.decrypt()</code> for decrypting. Encrypted data can be stored in IndexedDB. However, the fundamental question remains: where do you store the encryption key?
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The Key Management Problem</h3>
        <p>
          Client-side encryption faces a fundamental challenge: where do you store the encryption key?
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Hardcoded key:</strong> Easily extracted from JavaScript source
          </li>
          <li>
            <strong>Key in localStorage:</strong> Accessible via XSS
          </li>
          <li>
            <strong>Key derived from password:</strong> Better, but password might be weak
          </li>
          <li>
            <strong>Key from server:</strong> Server could decrypt; defeats purpose of client-side encryption
          </li>
        </ul>
        <p>
          <strong>Conclusion:</strong> Client-side encryption protects against some threats (device theft,
          browser cache inspection) but not others (XSS, malicious extensions). It&apos;s defense in depth,
          not a complete solution.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When Client-Side Encryption Makes Sense</h3>
        <ul className="space-y-2">
          <li>
            <strong>End-to-end encrypted apps:</strong> Messaging, file storage where server shouldn&apos;t
            see plaintext
          </li>
          <li>
            <strong>Offline-first apps:</strong> Data must be encrypted before syncing to cloud storage
          </li>
          <li>
            <strong>Regulatory requirements:</strong> Some regulations require encryption at rest, even
            client-side
          </li>
          <li>
            <strong>Defense in depth:</strong> Additional layer alongside other security measures
          </li>
        </ul>
      </section>

      <section>
        <h2>Secure Storage Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 1: HttpOnly Cookie for Tokens</h3>
        <p>
          On the server-side (Node.js/Express), verify credentials in the login handler, generate a JWT token for the authenticated user, and set it as an HttpOnly cookie with options like <code className="text-sm">httpOnly: true</code> (JavaScript cannot access), <code className="text-sm">secure: true</code> (HTTPS only), <code className="text-sm">sameSite: 'strict'</code> (CSRF protection), <code className="text-sm">maxAge: 3600000</code> (1 hour), and <code className="text-sm">path: '/'</code>. On the client-side, the token is automatically sent with requests when using <code className="text-sm">credentials: 'include'</code> in fetch calls, and JavaScript cannot access the token making it XSS-safe.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 2: Encrypted Storage for PII</h3>
        <p>
          For encrypting PII before storing, create a SecureStorage class that derives a key from a password using PBKDF2. In the <code className="text-sm">initialize()</code> method, generate a random salt, use <code className="text-sm">subtle.importKey()</code> with PBKDF2, derive the key with <code className="text-sm">subtle.deriveKey()</code> using 100,000 iterations and SHA-256, and store the salt (not secret) in localStorage. The <code className="text-sm">set()</code> method encrypts data using <code className="text-sm">subtle.encrypt()</code> with AES-GCM and a random IV, then stores the encrypted data and IV in IndexedDB. The <code className="text-sm">get()</code> method retrieves the record and decrypts it using <code className="text-sm">subtle.decrypt()</code>.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 3: Token Refresh with Minimal Exposure</h3>
        <p>
          For token refresh with minimal exposure, use access tokens and refresh tokens both in HttpOnly cookies (short-lived access token, long-lived rotated refresh token). The server-side refresh endpoint reads the refresh token from cookies, verifies and rotates it, invalidates the old refresh token to prevent reuse, generates new access and refresh tokens, and sets them as new HttpOnly cookies with appropriate maxAge values (15 minutes for access, 7 days for refresh). The client never exposes tokens to JavaScript and automatically refreshes on 401 responses.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 4: Memory-Only for Highly Sensitive Data</h3>
        <p>
          For memory-only storage (cleared on refresh), create a MemoryStore class that uses a Map to store data in memory, clears on page unload via <code className="text-sm">beforeunload</code> event listener, and auto-clears after a timeout (5 minutes). The <code className="text-sm">set()</code> method stores the value and resets the timeout, <code className="text-sm">get()</code> retrieves the value, and <code className="text-sm">clear()</code> clears the map and timeout. Usage: create an instance and use <code className="text-sm">set('encryptionKey', key)</code> or <code className="text-sm">set('tempToken', token)</code>. Data is gone on refresh, tab close, or after 5 minutes, but is still vulnerable to XSS while in memory.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Layer Your Defenses</h3>
          <p>
            No single storage mechanism is perfectly secure. Combine approaches: HttpOnly cookies for
            tokens, encryption for PII, memory-only for temporary secrets, and minimal storage overall.
            Each layer provides protection if others are compromised.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Minimization</h3>
        <ul className="space-y-2">
          <li>
            <strong>Question every field:</strong> Does this data need to be stored client-side?
          </li>
          <li>
            <strong>Fetch on-demand:</strong> Retrieve sensitive data only when needed, don&apos;t cache
            indefinitely
          </li>
          <li>
            <strong>Tokenize:</strong> Store references (tokens) instead of actual data
          </li>
          <li>
            <strong>Aggregate:</strong> Store summaries instead of detailed records
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Storage Selection</h3>
        <ul className="space-y-2">
          <li>
            <strong>Tokens → HttpOnly cookies:</strong> Never localStorage
          </li>
          <li>
            <strong>PII → Encrypted IndexedDB:</strong> Or don&apos;t store at all
          </li>
          <li>
            <strong>Temporary data → sessionStorage:</strong> Cleared on tab close
          </li>
          <li>
            <strong>Keys → Memory only:</strong> Derive from password, don&apos;t persist
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Access Control</h3>
        <ul className="space-y-2">
          <li>
            <strong>Principle of least privilege:</strong> Only store what&apos;s needed for current session
          </li>
          <li>
            <strong>Time-limited storage:</strong> Auto-clear after timeout
          </li>
          <li>
            <strong>Clear on logout:</strong> Remove all stored data, not just tokens
          </li>
          <li>
            <strong>Per-session isolation:</strong> Don&apos;t share sensitive data across sessions
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compliance Considerations</h3>
        <ul className="space-y-2">
          <li>
            <strong>GDPR:</strong> Right to erasure includes client-side data
          </li>
          <li>
            <strong>PCI-DSS:</strong> Never store card data client-side (use tokenization)
          </li>
          <li>
            <strong>HIPAA:</strong> Encrypt PHI at rest, even client-side
          </li>
          <li>
            <strong>CCPA:</strong> Disclose what data is stored and why
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Defense in Depth</h3>
          <p>
            Secure storage isn&apos;t about one perfect solution—it&apos;s about layering defenses.
            HttpOnly cookies protect against XSS. Encryption protects against cache inspection.
            Memory-only storage limits exposure window. Together they provide comprehensive protection.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Storing tokens in localStorage:</strong> Most common mistake. XSS = instant account
            takeover.
          </li>
          <li>
            <strong>Storing passwords anywhere:</strong> Never store passwords client-side, even encrypted.
          </li>
          <li>
            <strong>Hardcoded encryption keys:</strong> Keys in JavaScript source are easily extracted.
          </li>
          <li>
            <strong>Not clearing on logout:</strong> Sensitive data persists after user logs out.
          </li>
          <li>
            <strong>Storing more than needed:</strong> Cached PII, full user objects when IDs suffice.
          </li>
          <li>
            <strong>Ignoring browser storage limits:</strong> Quota exceeded errors, data loss.
          </li>
          <li>
            <strong>Not handling private browsing:</strong> IndexedDB blocked in private mode.
          </li>
          <li>
            <strong>Trusting client-side encryption:</strong> Encryption keys accessible via XSS defeat
            the purpose.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture at Scale: Secure Storage in Enterprise Systems</h2>
        <p>
          Enterprise-scale secure storage requires coordinated encryption key management, consistent storage policies, and centralized monitoring across multiple applications, services, and geographic regions. In microservices architectures, each service must handle sensitive data consistently while supporting different storage requirements.
        </p>
        <p>
          <strong>Centralized Key Management:</strong> Implement a centralized key management service (AWS KMS, HashiCorp Vault, Azure Key Vault) that manages encryption keys centrally. Services request keys on-demand for encryption/decryption operations. Implement key rotation policies with automatic key versioning. Document key management architecture in system design documentation.
        </p>
        <p>
          <strong>Multi-Tenant Data Isolation:</strong> For SaaS applications, implement tenant isolation at the storage layer. Use tenant-specific encryption keys for data isolation. Implement tenant-aware storage quotas. Support custom data retention policies per tenant. Document multi-tenant storage architecture in security documentation.
        </p>
        <p>
          <strong>Edge Storage Considerations:</strong> For edge-computed applications (Cloudflare Workers, Lambda@Edge), implement secure storage at the edge. Use edge key management for encryption. Implement edge-side token validation. Document edge storage security in infrastructure documentation.
        </p>
        <p>
          <strong>Cross-Device Synchronization:</strong> For applications requiring cross-device data sync, implement secure synchronization protocols. Use end-to-end encryption for synced data. Implement conflict resolution for concurrent modifications. Document sync security in API documentation.
        </p>
      </section>

      <section>
        <h2>Testing Strategies: Secure Storage Validation</h2>
        <p>
          Comprehensive secure storage testing requires automated scanning, manual verification, and penetration testing integrated into security operations.
        </p>
        <p>
          <strong>Automated Storage Scanning:</strong> Use browser DevTools, OWASP ZAP, or custom scripts to verify storage attributes. Configure CI/CD pipelines to scan storage usage after each deployment. Set up automated alerts for: sensitive data in localStorage, missing encryption for PII, excessive data retention, insecure cookie attributes.
        </p>
        <p>
          <strong>XSS Exfiltration Testing:</strong> Test for data exfiltration via XSS: (1) Inject XSS payload, (2) Attempt to read stored data, (3) Verify HttpOnly cookies are inaccessible, (4) Verify encrypted data cannot be decrypted without keys. Use tools like XSS Hunter for automated exfiltration testing. Document XSS test results.
        </p>
        <p>
          <strong>Encryption Validation:</strong> Test encryption implementation: (1) Verify data at rest is encrypted, (2) Verify encryption keys are not stored with data, (3) Test key derivation strength, (4) Verify encryption algorithm is industry-standard (AES-GCM, ChaCha20). Use cryptographic validation tools. Document encryption test results.
        </p>
        <p>
          <strong>Data Retention Testing:</strong> Test data retention policies: (1) Verify data is cleared on logout, (2) Verify session storage clears on tab close, (3) Verify expired data is purged, (4) Test auto-lock functionality. Implement automated retention testing in CI/CD. Document retention test results.
        </p>
        <p>
          <strong>Penetration Testing:</strong> Include storage security in quarterly penetration tests. Specific test cases: (1) localStorage data extraction, (2) Cookie theft via XSS, (3) Encryption key extraction, (4) IndexedDB injection attacks, (5) Cache poisoning. Require remediation of all storage-related findings before production deployment.
        </p>
      </section>

      <section>
        <h2>Compliance and Legal Context</h2>
        <p>
          Secure storage implementation has significant compliance implications, particularly for applications handling financial transactions, healthcare data, or operating in regulated industries.
        </p>
        <p>
          <strong>GDPR Requirements:</strong> GDPR Article 5 requires data minimization—only store necessary data client-side. Article 17 (Right to Erasure) requires clearing client-side data on user request. Article 32 requires appropriate encryption for personal data. Document storage practices in privacy policy. Implement data export functionality for Article 20 (Data Portability).
        </p>
        <p>
          <strong>CCPA/CPRA Requirements:</strong> California Consumer Privacy Act requires disclosure of data storage practices. Implement &quot;Do Not Sell My Personal Information&quot; mechanism. Disclose what data is stored client-side and why. Provide client-side data deletion mechanism for California residents.
        </p>
        <p>
          <strong>PCI-DSS Requirements:</strong> PCI-DSS Requirement 3.4 requires rendering PAN unreadable anywhere it is stored. Never store card data client-side—use payment processor tokens (Stripe, Braintree). Document tokenization approach in ROC (Report on Compliance). Annual penetration testing must include storage security testing.
        </p>
        <p>
          <strong>HIPAA Requirements:</strong> HIPAA Security Rule 45 CFR 164.312(a)(2)(iv) requires encryption for ePHI at rest. Implement encryption for any PHI stored client-side. Document encryption procedures in security policies. Audit access to encrypted PHI. Implement automatic logoff for apps storing PHI.
        </p>
        <p>
          <strong>SOC 2 Controls:</strong> Secure storage maps to SOC 2 Common Criteria CC6.1 (logical access controls) and CC7.2 (system monitoring). Document storage policies, encryption procedures, and monitoring for annual SOC 2 audits. Track storage-related security incidents.
        </p>
      </section>

      <section>
        <h2>Performance Trade-offs: Security vs. User Experience</h2>
        <p>
          Secure storage measures introduce measurable performance overhead that must be balanced against security requirements and user experience.
        </p>
        <p>
          <strong>Encryption Overhead:</strong> AES-GCM encryption adds 5-50ms per operation depending on data size. Use Web Workers for encryption to avoid blocking main thread. Cache encrypted data to reduce repeated encryption. For large datasets (&gt;1MB), consider chunked encryption. Monitor encryption latency and adjust algorithms accordingly.
        </p>
        <p>
          <strong>Key Derivation Latency:</strong> PBKDF2 key derivation takes 100-500ms depending on iteration count. This is intentional (slows brute force). Use appropriate iteration count (100,000+ for PBKDF2, 4+ for Argon2). Show loading indicator during key derivation. Cache derived keys in memory (not storage).
        </p>
        <p>
          <strong>Storage Access Latency:</strong> localStorage access is synchronous and blocks main thread (&lt;1ms). IndexedDB access is asynchronous (5-20ms). Use IndexedDB for large datasets to avoid blocking. Implement storage access queuing for concurrent operations. Monitor storage access patterns.
        </p>
        <p>
          <strong>Cookie Size Impact:</strong> Cookies are sent with every HTTP request. Large cookies (greater than 4KB) increase bandwidth and latency. Keep session cookies minimal (token only). Use localStorage for non-sensitive data that doesn&apos;t need server access. Monitor cookie size in performance budgets.
        </p>
        <p>
          <strong>Private Browsing Limitations:</strong> Private/Incognito modes block or limit storage. IndexedDB may be blocked. localStorage may be cleared on close. Implement graceful degradation for private browsing. Detect private browsing and inform users of limitations. Consider server-side fallback for private browsing users.
        </p>
      </section>

      <section>
        <h2>Browser and Platform Compatibility</h2>
        <p>
          Secure storage support varies across browsers, operating systems, and platforms, requiring careful compatibility planning.
        </p>
        <p>
          <strong>Web Crypto API Support:</strong> Supported in Chrome 37+, Firefox 34+, Safari 10.1+, Edge 79+. Not supported in IE11. For legacy browser support, use polyfills (webcrypto-liner) or server-side encryption fallback. Document Web Crypto support in browser compatibility matrix.
        </p>
        <p>
          <strong>IndexedDB Support:</strong> Supported in all modern browsers (IE10+, all current versions). Safari has had bugs with IndexedDB in private browsing. Test IndexedDB across target browsers. Implement localStorage fallback for very old browsers. Monitor IndexedDB quota across browsers.
        </p>
        <p>
          <strong>HttpOnly Cookie Support:</strong> HttpOnly supported in all modern browsers (IE6+, all current versions). Some older mobile browsers have partial HttpOnly support. Test HttpOnly effectiveness using browser DevTools. Document HttpOnly support in browser compatibility matrix.
        </p>
        <p>
          <strong>Mobile Storage Considerations:</strong> iOS WKWebView and Android WebView have separate storage from system browsers. Mobile browsers have stricter storage quotas. Implement storage quota detection and graceful degradation. Test storage on actual mobile devices, not just emulators.
        </p>
        <p>
          <strong>Storage Quota Variations:</strong> localStorage: 5-10MB across browsers. IndexedDB: varies (Chrome: 60% of disk, Firefox: 50%, Safari: 1GB max). Cookie: 4KB per cookie, 50+ cookies per domain. Monitor quota usage and implement cleanup strategies. Request quota increase for IndexedDB when needed.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Healthcare Patient Portal:</strong> Store encrypted patient records in IndexedDB for offline access. Encryption key derived from user password. Auto-lock after 5 minutes of inactivity. Clear all data on logout. HIPAA-compliant audit logging for all data access.
          </li>
          <li>
            <strong>Financial Trading Platform:</strong> Session tokens in HttpOnly cookies. Trading preferences in encrypted localStorage. Real-time portfolio data fetched on-demand, not cached. Auto-logout after 15 minutes of inactivity. PCI-DSS compliant—no card data stored client-side.
          </li>
          <li>
            <strong>Offline-First Field Service App:</strong> Customer PII encrypted with AES-GCM before storing in IndexedDB. Encryption key derived from user credentials, kept in memory only. Sync encrypted data to server when online. Auto-clear data after job completion. GDPR-compliant data retention policies.
          </li>
          <li>
            <strong>E-Commerce Shopping Cart:</strong> Cart contents in localStorage (non-sensitive). Session cookie with HttpOnly + Secure + SameSite for authentication. Payment data never stored—use Stripe/Braintree tokens. Clear cart on purchase completion. CCPA-compliant data disclosure.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions and Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: Where should you store authentication tokens and why?</p>
            <p className="mt-2 text-sm">
              A: <strong>HttpOnly cookies</strong> are the most secure option. They&apos;re inaccessible
              to JavaScript (XSS-safe), automatically sent with requests (convenient), and can be protected
              against CSRF with SameSite attribute. <strong>Never use localStorage</strong> for tokens—any
              XSS vulnerability gives attackers immediate access to all tokens. If you must use localStorage
              (e.g., for API clients), implement strict CSP and XSS protections.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: What are the limitations of client-side encryption?</p>
            <p className="mt-2 text-sm">
              A: The fundamental problem is <strong>key management</strong>. Where do you store the
              encryption key? Hardcoded keys are easily extracted. Keys in localStorage are accessible via
              XSS. Keys derived from passwords are only as strong as the password. Client-side encryption
              protects against some threats (device theft, cache inspection) but not others (XSS, malicious
              extensions). It&apos;s defense in depth, not a complete solution.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: How would you securely store user PII for an offline-first app?</p>
            <p className="mt-2 text-sm">
              A: Layered approach: (1) Encrypt PII using Web Crypto API (AES-GCM) before storing. (2) Store
              encrypted data in IndexedDB (not localStorage). (3) Derive encryption key from user password
              using PBKDF2 with high iterations. (4) Store salt in localStorage (not secret). (5) Keep
              encryption key in memory only, clear on logout. (6) Implement auto-lock after inactivity.
              This protects against cache inspection but not determined XSS attacks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: What&apos;s the difference between localStorage and sessionStorage?</p>
            <p className="mt-2 text-sm">
              A: Both are key-value stores accessible via JavaScript. <strong>localStorage</strong> persists
              until explicitly cleared and is shared across all tabs/windows of the same origin.
              <strong>sessionStorage</strong> is cleared when the tab/window closes and is isolated per-tab.
              Neither is secure for sensitive data (both accessible via XSS). sessionStorage is slightly
              better for temporary data since it auto-clears, but neither should store tokens or PII.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: How do you handle token refresh securely?</p>
            <p className="mt-2 text-sm">
              A: Use rotating refresh tokens in HttpOnly cookies. Access token (short-lived, 15 min) and
              refresh token (long-lived, 7 days) both in HttpOnly cookies. On refresh: verify refresh
              token, invalidate old refresh token (prevent reuse), generate new access and refresh tokens,
              set new cookies. This way tokens are never exposed to JavaScript, and stolen refresh tokens
              can&apos;t be reused. Implement refresh token rotation detection to detect and respond to
              token theft.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: What data should never be stored client-side?</p>
            <p className="mt-2 text-sm">
              A: <strong>Passwords</strong> (never, even encrypted). <strong>Full credit card numbers</strong>
              (use payment processor tokens). <strong>Government IDs</strong> (SSN, passport numbers).
              <strong>Raw encryption keys</strong> (derive on-demand). <strong>Other users&apos; data</strong>
              (only store what&apos;s needed for current user). General rule: if it would cause significant
              harm if exposed, don&apos;t store it client-side. Fetch on-demand, tokenize, or keep server-side.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References and Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs: Web Crypto API
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Client-side_Storage_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Client-side Storage Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://web.dev/storage-for-developers/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev: Storage for Developers
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/TR/WebCryptoAPI/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              W3C Web Crypto API Specification
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

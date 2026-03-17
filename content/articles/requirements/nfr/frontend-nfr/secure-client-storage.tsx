"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-secure-client-storage",
  title: "Secure Client Storage",
  description: "Comprehensive guide to securely storing sensitive data on the client. Covers localStorage security, token storage, encryption, XSS implications, and secure storage patterns.",
  category: "frontend",
  subcategory: "nfr",
  slug: "secure-client-storage",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "security", "storage", "tokens", "encryption", "xss"],
  relatedTopics: ["xss-injection-protection", "authentication-ux", "client-persistence"],
};

export default function SecureClientStorageArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Secure Client Storage</strong> addresses how to safely store sensitive data in the
          browser. This includes authentication tokens, PII, session data, and any information that
          could be exploited if accessed by attackers. The fundamental challenge: anything stored on
          the client is potentially accessible to anyone with access to the browser — including
          malicious scripts injected via XSS.
        </p>
        <p>
          For staff engineers, secure storage decisions balance security, usability, and functionality.
          Storing tokens enables seamless UX but increases attack surface. Encrypting data protects
          confidentiality but adds complexity. Understanding trade-offs is critical for security-sensitive
          applications.
        </p>
        <p>
          <strong>Security reality:</strong> No client-side storage is completely secure. The goal is
          defense in depth — making it difficult enough that attackers pursue easier targets.
        </p>
        <p>
          <strong>Storage options compared:</strong>
        </p>
        <ul>
          <li><strong>localStorage:</strong> Persistent, accessible via JavaScript, vulnerable to XSS</li>
          <li><strong>sessionStorage:</strong> Session-scoped, accessible via JavaScript, vulnerable to XSS</li>
          <li><strong>Cookies:</strong> Can be HttpOnly (inaccessible to JavaScript), Secure, SameSite</li>
          <li><strong>IndexedDB:</strong> Large storage, accessible via JavaScript, vulnerable to XSS</li>
          <li><strong>Memory (variables):</strong> Cleared on page unload, accessible while page is open</li>
        </ul>
      </section>

      <section>
        <h2>Storage Security Comparison</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">localStorage</h3>
        <p>
          Key-value storage with 5-10MB capacity. Data persists until explicitly cleared.
        </p>
        <ul className="space-y-2">
          <li><strong>Security:</strong> Accessible by any JavaScript on the page — XSS can steal all data</li>
          <li><strong>Persistence:</strong> Survives browser restarts, tab closes</li>
          <li><strong>Scope:</strong> Shared across all tabs/windows from same origin</li>
          <li><strong>Use for:</strong> Non-sensitive preferences, cached data, feature flags</li>
          <li><strong>Don&apos;t use for:</strong> Auth tokens, passwords, PII, sensitive data</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">sessionStorage</h3>
        <p>
          Same API as localStorage but scoped to single tab/window.
        </p>
        <ul className="space-y-2">
          <li><strong>Security:</strong> Still accessible by JavaScript — XSS can steal data</li>
          <li><strong>Persistence:</strong> Cleared when tab/window closes</li>
          <li><strong>Scope:</strong> Isolated per tab/window — not shared</li>
          <li><strong>Use for:</strong> Temporary form state, single-session data</li>
          <li><strong>Don&apos;t use for:</strong> Auth tokens (still XSS-vulnerable)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cookies</h3>
        <p>
          Small storage (4KB per cookie) sent with every HTTP request.
        </p>
        <ul className="space-y-2">
          <li><strong>Security:</strong> Can be HttpOnly (inaccessible to JavaScript), Secure (HTTPS only), SameSite (CSRF protection)</li>
          <li><strong>Persistence:</strong> Session cookies or with expiration</li>
          <li><strong>Scope:</strong> Sent to server with every request to domain</li>
          <li><strong>Use for:</strong> Session tokens (HttpOnly), CSRF tokens, user preferences</li>
          <li><strong>Don&apos;t use for:</strong> Large data (bandwidth overhead), sensitive data without encryption</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">IndexedDB</h3>
        <p>
          Full database in browser with large capacity (50MB+).
        </p>
        <ul className="space-y-2">
          <li><strong>Security:</strong> Accessible by JavaScript — XSS can steal data</li>
          <li><strong>Persistence:</strong> Survives browser restarts</li>
          <li><strong>Scope:</strong> Shared across tabs from same origin</li>
          <li><strong>Use for:</strong> Large offline data, cached API responses, complex queries</li>
          <li><strong>Don&apos;t use for:</strong> Sensitive data without encryption</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/storage-security-comparison.svg"
          alt="Client Storage Security Comparison"
          caption="Security comparison of localStorage, sessionStorage, cookies, and IndexedDB — showing XSS vulnerability and HttpOnly protection"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Comparison Table</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Storage Type</th>
              <th className="p-3 text-left">XSS Accessible</th>
              <th className="p-3 text-left">HttpOnly Option</th>
              <th className="p-3 text-left">Capacity</th>
              <th className="p-3 text-left">Best Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">localStorage</td>
              <td className="p-3">Yes (vulnerable)</td>
              <td className="p-3">No</td>
              <td className="p-3">5-10MB</td>
              <td className="p-3">Non-sensitive preferences</td>
            </tr>
            <tr>
              <td className="p-3">sessionStorage</td>
              <td className="p-3">Yes (vulnerable)</td>
              <td className="p-3">No</td>
              <td className="p-3">5-10MB</td>
              <td className="p-3">Single-session data</td>
            </tr>
            <tr>
              <td className="p-3">Cookies (HttpOnly)</td>
              <td className="p-3">No (protected)</td>
              <td className="p-3">Yes</td>
              <td className="p-3">4KB per cookie</td>
              <td className="p-3">Auth tokens, sessions</td>
            </tr>
            <tr>
              <td className="p-3">IndexedDB</td>
              <td className="p-3">Yes (vulnerable)</td>
              <td className="p-3">No</td>
              <td className="p-3">50MB+</td>
              <td className="p-3">Large offline data</td>
            </tr>
            <tr>
              <td className="p-3">In-Memory</td>
              <td className="p-3">Yes (while page open)</td>
              <td className="p-3">No</td>
              <td className="p-3">Limited by RAM</td>
              <td className="p-3">Temporary sensitive data</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Token Storage Strategies</h2>
        <p>
          Authentication token storage is the most critical security decision. Each approach has trade-offs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Option 1: HttpOnly Cookies (Recommended)</h3>
        <p>
          Store tokens in HttpOnly, Secure, SameSite cookies. JavaScript cannot access them.
        </p>
        <ul className="space-y-2">
          <li><strong>Security:</strong> XSS cannot steal tokens (HttpOnly), CSRF protected (SameSite)</li>
          <li><strong>UX:</strong> Automatic with every request, seamless authentication</li>
          <li><strong>Implementation:</strong> Server sets cookie on login, browser sends automatically</li>
          <li><strong>Considerations:</strong> CSRF protection still needed for state-changing operations</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Option 2: Memory + Refresh Token Rotation</h3>
        <p>
          Store access token in memory (variable), refresh token in HttpOnly cookie.
        </p>
        <ul className="space-y-2">
          <li><strong>Security:</strong> Access token cleared on refresh, refresh token protected</li>
          <li><strong>UX:</strong> Requires token refresh logic, slightly more complex</li>
          <li><strong>Implementation:</strong> Fetch token on load, store in variable, refresh before expiry</li>
          <li><strong>Considerations:</strong> Page refresh loses access token (must re-fetch)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Option 3: localStorage (Not Recommended for Sensitive Data)</h3>
        <p>
          Store tokens in localStorage. Simple but vulnerable to XSS.
        </p>
        <ul className="space-y-2">
          <li><strong>Security:</strong> XSS can steal tokens and impersonate user</li>
          <li><strong>UX:</strong> Simple implementation, tokens persist across refreshes</li>
          <li><strong>Implementation:</strong> Store token after login, read from localStorage for requests</li>
          <li><strong>Considerations:</strong> Only acceptable for low-security applications with strong XSS prevention</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Security Best Practices</h3>
        <ul className="space-y-2">
          <li>Use short-lived access tokens (15-60 minutes)</li>
          <li>Use rotating refresh tokens (new refresh token on each use)</li>
          <li>Implement token revocation on logout/password change</li>
          <li>Bind tokens to device/browser fingerprint</li>
          <li>Monitor for token reuse anomalies</li>
          <li>Use CSRF tokens for state-changing operations</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/token-storage-patterns.svg"
          alt="Token Storage Patterns"
          caption="Authentication token storage patterns — HttpOnly cookies, memory + refresh, and localStorage approaches"
        />
      </section>

      <section>
        <h2>Encryption for Client Storage</h2>
        <p>
          When you must store sensitive data client-side, encryption adds protection even if storage is compromised.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When to Encrypt</h3>
        <ul className="space-y-2">
          <li>PII that must be cached for offline use</li>
          <li>API keys for third-party services</li>
          <li>User data in offline-first applications</li>
          <li>Sensitive preferences or settings</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Encryption Approaches</h3>
        <ul className="space-y-2">
          <li>
            <strong>Web Crypto API:</strong> Native browser encryption. Generate keys, encrypt/decrypt data.
            Keys still accessible to JavaScript but provides cryptographic protection.
          </li>
          <li>
            <strong>libsodium.js:</strong> Portable encryption library. Easy API for authenticated encryption.
          </li>
          <li>
            <strong>AES-GCM:</strong> Recommended algorithm. Provides confidentiality and integrity.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Key Management Challenge</h3>
        <p>
          The fundamental problem: encryption keys must be accessible to your JavaScript to encrypt/decrypt,
          which means XSS can also access them. Mitigation strategies:
        </p>
        <ul className="space-y-2">
          <li>Derive keys from user password (not stored, entered each session)</li>
          <li>Store keys in memory only, not persistent storage</li>
          <li>Use separate key for each data item (limits blast radius)</li>
          <li>Rotate keys periodically</li>
          <li>Combine with strong CSP and XSS prevention</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Encryption Limitations</h3>
        <ul className="space-y-2">
          <li>Encryption protects data at rest, not during use (decrypted in memory)</li>
          <li>Keys accessible to JavaScript are accessible to XSS</li>
          <li>Encryption adds complexity and performance overhead</li>
          <li>Doesn&apos;t replace proper access control and authentication</li>
        </ul>
      </section>

      <section>
        <h2>Secure Storage Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 1: Sensitive Data in Memory Only</h3>
        <p>
          Store sensitive data in JavaScript variables, not persistent storage.
        </p>
        <ul className="space-y-2">
          <li>Data cleared on page refresh/navigation</li>
          <li>Re-fetch from server when needed</li>
          <li>Use for: API tokens, temporary sensitive data</li>
          <li>Combine with: HttpOnly refresh tokens for persistence</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 2: Encrypted IndexedDB</h3>
        <p>
          Encrypt data before storing in IndexedDB.
        </p>
        <ul className="space-y-2">
          <li>Encrypt with Web Crypto API before write</li>
          <li>Decrypt after read</li>
          <li>Store encryption key in memory (not IndexedDB)</li>
          <li>Use for: Offline data that must remain confidential</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 3: Split Storage</h3>
        <p>
          Store sensitive and non-sensitive data separately.
        </p>
        <ul className="space-y-2">
          <li>Non-sensitive preferences in localStorage</li>
          <li>Auth tokens in HttpOnly cookies</li>
          <li>Temporary sensitive data in memory</li>
          <li>Large encrypted data in IndexedDB</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 4: Server-Side Sessions</h3>
        <p>
          Minimize client storage by keeping state on server.
        </p>
        <ul className="space-y-2">
          <li>Session ID in HttpOnly cookie</li>
          <li>All session data on server</li>
          <li>Client is stateless between requests</li>
          <li>Use for: Maximum security, sensitive applications</li>
        </ul>
      </section>

      <section>
        <h2>Security Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Never store passwords client-side:</strong> Not even encrypted. Passwords should
            only transit through memory during authentication.
          </li>
          <li>
            <strong>Use HttpOnly cookies for tokens:</strong> This is the single most important storage
            security decision. XSS cannot steal HttpOnly cookies.
          </li>
          <li>
            <strong>Implement Content Security Policy:</strong> CSP reduces XSS risk, protecting all
            client storage from script injection.
          </li>
          <li>
            <strong>Clear sensitive data on logout:</strong> Clear localStorage, IndexedDB, memory
            variables. Invalidate server-side sessions.
          </li>
          <li>
            <strong>Use Secure flag on cookies:</strong> Cookies only sent over HTTPS, preventing
            network interception.
          </li>
          <li>
            <strong>Use SameSite cookies:</strong> Protects against CSRF attacks. Use SameSite=Strict
            or SameSite=Lax.
          </li>
          <li>
            <strong>Implement session timeout:</strong> Auto-logout after inactivity. Clear all stored
            data on timeout.
          </li>
          <li>
            <strong>Avoid storing PII when possible:</strong> Reference data by ID, fetch from server
            when needed.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight for Interviews</h3>
          <p>
            In staff engineer interviews, the correct answer for token storage is HttpOnly cookies.
            If asked about localStorage for tokens, explain the XSS risk and recommend HttpOnly as
            the secure alternative. Demonstrate understanding that no client storage is truly secure —
            it&apos;s about defense in depth and making attacks difficult enough to deter attackers.
          </p>
        </div>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Where should you store authentication tokens?</p>
            <p className="mt-2 text-sm">
              A: HttpOnly, Secure, SameSite cookies. This prevents XSS from stealing tokens (HttpOnly),
              ensures tokens only sent over HTTPS (Secure), and protects against CSRF (SameSite).
              localStorage is vulnerable to XSS — any script on the page can read tokens. For maximum
              security, use short-lived access tokens in memory with rotating refresh tokens in HttpOnly
              cookies.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the security implications of localStorage?</p>
            <p className="mt-2 text-sm">
              A: localStorage is accessible by any JavaScript running on the page. If an attacker
              injects malicious script via XSS, they can read all localStorage data including tokens,
              PII, and sensitive information. They can also modify data, potentially causing
              application bugs or security issues. Never store sensitive data in localStorage without
              encryption, and even encrypted data is at risk if keys are also stored client-side.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you protect against CSRF when using cookies?</p>
            <p className="mt-2 text-sm">
              A: Multiple layers: (1) SameSite cookie attribute (Strict or Lax) prevents cross-origin
              cookie sending. (2) CSRF tokens — unique token per session, validated on state-changing
              operations. (3) Custom headers (X-Requested-With) that browsers don&apos;t send
              cross-origin. (4) Require authentication for sensitive operations. Combine these for
              defense in depth.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use IndexedDB vs localStorage?</p>
            <p className="mt-2 text-sm">
              A: IndexedDB for large data (50MB+), complex queries, binary data, or when you need
              transactions. localStorage for simple key-value pairs under 5MB. Both are vulnerable
              to XSS, so neither is suitable for sensitive data without encryption. IndexedDB has
              more complex API but better performance for large datasets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement secure offline storage for a banking app?</p>
            <p className="mt-2 text-sm">
              A: Minimal data offline for security. Use IndexedDB with AES-GCM encryption. Derive
              encryption key from user password (not stored). Store only essential data (account
              balances, recent transactions) — no sensitive operations offline. Require
              re-authentication for transactions. Clear all data on logout. Implement auto-logout
              timer. Combine with strong CSP, certificate pinning, and jailbreak/root detection.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://owasp.org/www-community/controls/SecureCookieAttribute" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP — Secure Cookie Attributes
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Web Crypto API
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP — HTML5 Security Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://auth0.com/blog/cookies-vs-localstorage-for-authentication/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Auth0 — Cookies vs localStorage for Authentication
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

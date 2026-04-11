"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-secure-client-storage",
  title: "Secure Client Storage",
  description:
    "Comprehensive guide to securely storing sensitive data on the client. Covers localStorage security, token storage, encryption, XSS implications, and secure storage patterns.",
  category: "frontend",
  subcategory: "nfr",
  slug: "secure-client-storage",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "security",
    "storage",
    "tokens",
    "encryption",
    "xss",
  ],
  relatedTopics: [
    "xss-injection-protection",
    "authentication-ux",
    "client-persistence",
  ],
};

export default function SecureClientStorageArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Secure Client Storage</strong> addresses how to safely store
          sensitive data in the browser, including authentication tokens,
          personally identifiable information (PII), session data, and any
          information that could be exploited if accessed by attackers. The
          fundamental challenge is that anything stored on the client is
          potentially accessible to anyone with access to the browser —
          including malicious scripts injected via cross-site scripting (XSS)
          attacks, users with physical access to the device, and browser
          extensions with storage permissions. For staff engineers, secure
          storage decisions balance security, usability, and functionality —
          storing tokens enables seamless user experience but increases attack
          surface, while encrypting data protects confidentiality but adds
          complexity and performance overhead.
        </p>
        <p>
          The security reality is that no client-side storage is completely
          secure. The goal is defense in depth — making it difficult enough that
          attackers pursue easier targets, while implementing layered defenses
          so that breaching one layer does not compromise the entire system. The
          most important storage security decision is where to store
          authentication tokens, because token theft enables complete account
          takeover. Other sensitive data (PII, API keys, encryption keys) also
          requires careful consideration of storage mechanism, encryption, and
          access patterns.
        </p>
        <p>
          Client storage options vary significantly in their security
          characteristics. localStorage provides persistent key-value storage
          accessible by any JavaScript on the page — it is vulnerable to XSS
          theft. sessionStorage is identical to localStorage but scoped to a
          single tab — still XSS-vulnerable. Cookies can be configured as
          HttpOnly (inaccessible to JavaScript), Secure (HTTPS only), and
          SameSite (CSRF protection) — providing significantly stronger
          protection against XSS. IndexedDB offers large-capacity structured
          storage but is accessible by JavaScript — XSS-vulnerable like
          localStorage. In-memory storage (JavaScript variables) is cleared on
          page unload and is accessible only while the page is open — the most
          ephemeral but still accessible to XSS while the page is active.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The security comparison of storage mechanisms centers on XSS
          vulnerability. Any storage mechanism accessible by JavaScript
          (localStorage, sessionStorage, IndexedDB, in-memory variables) can be
          read by malicious scripts injected via XSS. The only mechanism that
          provides XSS protection is HttpOnly cookies — cookies with the
          HttpOnly flag are inaccessible to JavaScript, so even if an attacker
          injects a script, it cannot read the cookie value. This is why HttpOnly
          cookies are the recommended storage for authentication tokens. The
          trade-off is that HttpOnly cookies are automatically sent with every
          request to the domain, which can increase bandwidth for large cookies
          and requires CSRF protection for state-changing operations.
        </p>
        <p>
          Token storage strategy determines the security posture of the
          authentication system. The recommended approach is HttpOnly, Secure,
          SameSite cookies for both access and refresh tokens. This prevents XSS
          from stealing tokens (HttpOnly), ensures tokens are only sent over
          encrypted connections (Secure), and protects against CSRF attacks
          (SameSite). An alternative approach — access token in memory, refresh
          token in HttpOnly cookie — provides an additional security layer: the
          access token is cleared on page refresh, requiring a refresh from the
          server, which limits the window of opportunity for an attacker who
          gains memory access. Storing tokens in localStorage is not recommended
          for sensitive applications because any XSS vulnerability immediately
          compromises all user sessions.
        </p>
        <p>
          Client-side encryption adds a protection layer for sensitive data
          stored in XSS-vulnerable mechanisms (IndexedDB, localStorage). The
          Web Crypto API provides native browser encryption (AES-GCM is
          recommended for confidentiality and integrity). The fundamental
          limitation is key management — the encryption key must be accessible
          to JavaScript for encryption and decryption, which means XSS can also
          access the key. Mitigation strategies include deriving keys from user
          passwords (entered each session, not stored), storing keys in memory
          only (not persistent storage), using separate keys for each data item
          (limiting blast radius), and combining encryption with strong Content
          Security Policy and XSS prevention.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/storage-security-comparison.svg"
          alt="Client Storage Security Comparison"
          caption="Security comparison of localStorage, sessionStorage, HttpOnly cookies, and IndexedDB — showing XSS vulnerability, HttpOnly protection, capacity limits, and recommended use cases"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/client-storage-security-architecture.svg"
          alt="Client Storage Security Architecture"
          caption="Client storage security architecture — HttpOnly cookies for tokens (XSS-proof), in-memory variables for temporary sensitive data, encrypted IndexedDB for offline data, and localStorage for non-sensitive preferences only"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The secure token storage architecture follows the HttpOnly cookie
          pattern. On login, the server validates credentials and sets two
          cookies: an access token cookie (short-lived, 15-60 minutes) and a
          refresh token cookie (long-lived, 7-30 days), both with HttpOnly,
          Secure, and SameSite flags. The browser automatically includes these
          cookies with every request to the domain. The server validates the
          access token on each request. When the access token expires, the
          client receives a 401 response, calls the refresh endpoint (which
          sends the refresh cookie), obtains a new access token, and retries the
          original request. The refresh token is rotated on each use — a new
          refresh token is issued and the old one is invalidated, detecting
          token reuse attacks.
        </p>
        <p>
          The encryption architecture for client-stored sensitive data uses the
          Web Crypto API with AES-GCM. On app initialization, the encryption
          key is derived from the user&apos;s password (using PBKDF2 or
          Argon2) and stored in memory only. When data needs to be persisted,
          it is encrypted with the in-memory key before writing to IndexedDB.
          When data is read from IndexedDB, it is decrypted with the in-memory
          key before use. On logout or session timeout, the encryption key is
          cleared from memory, rendering all encrypted data in IndexedDB
          unreadable. The key is never persisted to any storage mechanism.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/token-storage-patterns.svg"
          alt="Token Storage Patterns"
          caption="Authentication token storage patterns — HttpOnly cookies (recommended), memory with refresh token rotation, and localStorage (not recommended) with their security characteristics"
        />

        <p>
          The split storage pattern uses different storage mechanisms for
          different data sensitivity levels. Non-sensitive preferences (theme,
          language, layout settings) are stored in localStorage for simple,
          persistent access. Authentication tokens are stored in HttpOnly
          cookies for XSS protection. Temporary sensitive data (API responses
          containing PII) is stored in memory only and cleared on page unload.
          Large encrypted data (offline documents, cached API responses with
          sensitive fields) is stored in IndexedDB with AES-GCM encryption.
          This pattern applies the right level of protection to each data type
          without over-engineering low-sensitivity data or under-protecting
          high-sensitivity data.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Token storage decisions represent the most critical security-versus-UX
          trade-off. HttpOnly cookies prevent XSS token theft but require CSRF
          protection for state-changing operations (since the browser
          automatically sends cookies with cross-site requests). In-memory
          storage with refresh token rotation adds a security layer (access
          token cleared on refresh) but requires re-fetching the access token
          on every page load, adding a server round-trip. localStorage storage
          is simplest to implement (one line of code) but most vulnerable — any
          XSS immediately compromises all sessions. For staff engineer
          interviews, the correct answer is HttpOnly cookies with an explanation
          of why localStorage is insecure for tokens.
        </p>
        <p>
          Client-side encryption presents a trade-off between data protection
          and operational complexity. Encrypting sensitive data before storing
          it in IndexedDB protects against direct storage access (someone
          copying the IndexedDB database cannot read the data) but does not
          protect against XSS (the malicious script can read the encryption key
          from memory and decrypt the data). The value of client-side encryption
          is in protecting data at rest — if a device is stolen or the browser
          profile is accessed directly, the encrypted data is unreadable without
          the key. It is a supplementary defense that strengthens the overall
          security posture but does not replace the need for XSS prevention.
        </p>
        <p>
          Server-side sessions versus client-side tokens present an architectural
          trade-off. Server-side sessions store all session data on the server
          and send only a session ID to the client (in an HttpOnly cookie). This
          provides maximum security — the client stores minimal data, sessions
          can be invalidated server-side immediately, and session data is never
          exposed to the client. The trade-off is server memory and database
          load — every active session consumes server resources. Client-side
          tokens (JWT) store session data in the token itself, eliminating
          server-side session storage but making token revocation more complex
          (tokens are valid until expiry unless a blocklist is maintained).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Store authentication tokens in HttpOnly, Secure, SameSite cookies —
          this is the single most important storage security decision. HttpOnly
          prevents JavaScript access (XSS cannot steal tokens), Secure ensures
          tokens are only transmitted over encrypted connections, and SameSite
          protects against CSRF attacks. Use short-lived access tokens (15-60
          minutes) with rotating refresh tokens (new refresh token issued on
          each use). Implement token revocation on logout and password change —
          add the token to a server-side blocklist. Never store passwords
          client-side, not even encrypted — passwords should only transit
          through memory during authentication.
        </p>
        <p>
          Implement Content Security Policy (CSP) as the primary XSS prevention
          mechanism, protecting all client storage from script injection. CSP
          restricts which scripts can execute on the page by specifying allowed
          sources (<code>script-src</code>), disallowing inline scripts (no{" "}
          <code>&apos;unsafe-inline&apos;</code>), and using nonces or hashes
          for legitimate inline scripts. Start with{" "}
          <code>Content-Security-Policy-Report-Only</code> to test policies
          without blocking, monitor violation reports, then enforce with{" "}
          <code>Content-Security-Policy</code>. A well-configured CSP
          significantly reduces XSS risk, indirectly protecting all client
          storage mechanisms.
        </p>
        <p>
          Clear sensitive data comprehensively on logout and session timeout.
          Clear localStorage of any sensitive preferences, clear IndexedDB of
          encrypted data, clear in-memory variables containing tokens or PII,
          and call the server to invalidate the session (add tokens to blocklist,
          destroy server-side session). Implement automatic session timeout
          based on inactivity (15-30 minutes for sensitive applications) with a
          warning before timeout and auto-save of user work. Clear all storage
          on timeout to prevent stale sessions from being hijacked.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Storing authentication tokens in localStorage is the most widespread
          security mistake in frontend applications. Many tutorials and
          boilerplate projects demonstrate this pattern because it is simple —{" "}
          <code>localStorage.setItem(&apos;token&apos;, token)</code> — but it
          means any XSS vulnerability immediately exposes all user sessions to
          theft. An attacker who injects a script can read all tokens and
          impersonate any user. The fix is HttpOnly cookies, which require
          server-side configuration (setting the cookie on login response) but
          provide fundamentally stronger protection. If localStorage must be
          used (for applications where HttpOnly cookies are genuinely
          impractical), implement additional defenses: very short token expiry,
          device fingerprinting, and anomaly detection.
        </p>
        <p>
          Failing to protect against CSRF when using cookies for authentication
          is a common oversight. Because browsers automatically send cookies
          with cross-site requests, an attacker can craft a malicious page that
          triggers state-changing operations (transfer money, change password)
          using the victim&apos;s cookies. The defense layers are: SameSite
          cookie attribute (Strict or Lax prevents cross-origin cookie sending),
          CSRF tokens (unique per-session token validated on state-changing
          operations), and custom headers (X-Requested-With) that browsers do
          not send cross-origin. Implement all three for defense in depth.
        </p>
        <p>
          Storing PII (names, email addresses, phone numbers) in client storage
          without a clear need is unnecessary risk. Every piece of PII stored
          client-side is potential exposure in a breach. The principle of data
          minimization applies: reference data by ID and fetch from the server
          when needed, rather than caching it client-side. If PII must be cached
          for offline functionality, encrypt it with the Web Crypto API and
          store the encryption key in memory only — never in persistent storage.
          Clear all PII from client storage on logout.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Banking and financial applications implement the most stringent client
          storage security. Authentication tokens are stored exclusively in
          HttpOnly, Secure, SameSite cookies with very short expiry (15 minutes
          for access tokens, 1 hour for refresh tokens). No PII is stored
          client-side — account balances and transaction history are fetched
          from the server on each view. Session timeout is aggressive (5 minutes
          of inactivity) with auto-logout. The application implements CSP with
          strict directives, certificate pinning for API communication, and
          jailbreak/root detection on mobile devices. Offline functionality is
          minimal — users can view the last cached balance but cannot perform
          transactions offline.
        </p>
        <p>
          Healthcare applications (HIPAA-compliant) use encrypted IndexedDB for
          offline patient data access. Patient records are fetched when online,
          encrypted with AES-GCM using a key derived from the user&apos;s
          credentials, and stored in IndexedDB for offline access. The
          encryption key is stored in memory only and cleared on logout or
          session timeout. All data access is logged for audit purposes.
          Authentication uses HttpOnly cookies with MFA. The application
          implements automatic data deletion — cached patient data is removed
          from IndexedDB after 24 hours to limit exposure window.
        </p>
        <p>
          Consumer SaaS applications use a balanced approach — HttpOnly cookies
          for authentication tokens, localStorage for non-sensitive preferences
          (theme, language, notification settings), and in-memory storage for
          temporary API responses. Session timeout is 30 minutes of inactivity
          with a &quot;Stay logged in&quot; option that issues a longer-lived
          refresh token. The CSP is configured to allow necessary third-party
          scripts (analytics, chat widget) while blocking inline scripts. User
          data (name, email) is fetched from the server on each session rather
          than cached client-side, minimizing PII exposure.
        </p>
      </section>

      <section>
        <h2>Advanced Security Architecture</h2>
        <p>
          The Web Crypto API provides native browser cryptographic operations without requiring external libraries. AES-GCM (Advanced Encryption Standard in Galois/Counter Mode) is the recommended symmetric encryption algorithm because it provides both confidentiality and integrity — the encrypted ciphertext cannot be modified without detection, as GCM produces an authentication tag that verifies the data has not been tampered with. The key derivation process uses PBKDF2 (Password-Based Key Derivation Function 2) or the more modern Argon2id to derive an encryption key from the user&apos;s password. PBKDF2 applies a pseudorandom function (typically HMAC-SHA256) thousands of iterations to the password combined with a random salt, producing a derived key that is computationally expensive to brute-force. The iteration count should be set as high as possible while maintaining acceptable user experience — typically 100,000 to 600,000 iterations, which takes 100-500ms on modern hardware. Argon2id is superior to PBKDF2 because it is memory-hard, requiring significant RAM during derivation, which makes GPU and ASIC-based attacks substantially more expensive. However, Argon2id has limited browser support and is typically used server-side, with the derived key transmitted to the client for local encryption operations. The encryption key is stored in memory only (JavaScript variables) and never persisted to any storage mechanism, ensuring that the key is lost when the page unloads or the session expires.
        </p>
        <p>
          Key rotation is a critical but often overlooked aspect of client-side encryption architecture. When the user changes their password, the encryption key derived from the old password becomes invalid, and all data encrypted with the old key must be re-encrypted with the new key. The implementation must decrypt all stored data using the old key (requiring the user to enter their old password during the password change flow), re-encrypt it with the new key, and replace the ciphertext in IndexedDB. If the user changes their password from a different device (where the old key is not available), the server must handle the re-encryption on behalf of the user, or the client must prompt the user to re-authenticate with the old password before completing the change. For applications with rotating encryption keys (periodic key changes for compliance), a key version identifier is stored alongside each encrypted record, and the decryption process checks the key version to determine which key to use. This allows multiple key versions to coexist in the database during the transition period, with old records decrypted using the old key and new records encrypted with the current key. The old key is retained until all records have been migrated to the new key, at which point it is securely destroyed.
        </p>
        <p>
          Token binding and DPoP (Demonstrating Proof-of-Possession) represent the next evolution in authentication token security beyond bearer tokens. Traditional bearer tokens (JWT, OAuth access tokens) are usable by anyone who possesses the token — if an attacker steals the token, they can authenticate as the user without additional proof. Token binding ties the token to a specific cryptographic key pair held by the client. The client generates a key pair, sends the public key to the server during authentication, and the server binds the issued token to that public key. When the client makes subsequent requests, it proves possession of the private key by signing a challenge or including a cryptographic proof in the request headers. DPoP formalizes this pattern as an HTTP extension — the client includes a DPoP proof header (a JWT signed with the client&apos;s private key) in each request, and the server validates the proof before accepting the bearer token. This prevents token replay attacks — even if an attacker intercepts the token, they cannot use it without the corresponding private key. For frontend applications, DPoP requires storing the private key in a secure location (ideally the browser&apos;s native key store or a Web Crypto API Key object that is non-extractable), and signing each request with the private key before sending it. The implementation overhead is significant but provides a substantial security improvement for high-value applications like banking and healthcare.
        </p>
        <p>
          Certificate pinning for mobile applications extends the trust chain validation beyond the standard CA (Certificate Authority) model. In the standard TLS model, the browser trusts any certificate signed by a trusted CA, which means a compromised CA or a corporate MITM proxy can issue a valid certificate for any domain and intercept traffic undetected. Certificate pinning adds an additional validation layer — the application maintains a list of expected certificate fingerprints (hashes of the certificate&apos;s public key) and rejects connections where the server&apos;s certificate does not match one of the pinned fingerprints. For native mobile applications (iOS, Android), certificate pinning is implemented using platform-specific APIs (NSURLSession delegate on iOS, OkHttp CertificatePinner on Android). For web applications, the HTTP Public Key Pinning (HPKP) header was deprecated due to the risk of self-lockout (if the pin is misconfigured, the application becomes inaccessible), but the concept remains relevant for mobile clients. Production implementations typically use a backup pin (a secondary certificate that can be used if the primary is rotated) and report-only mode during initial deployment to detect misconfigurations before enforcement. The pin set includes the current certificate&apos;s public key hash, the backup key hash, and the hash of the issuing CA&apos;s certificate for operational flexibility during certificate rotation.
        </p>
        <p>
          Secure enclave integration leverages hardware-based security features available on modern devices to protect sensitive cryptographic keys. The Secure Enclave on iOS devices and the StrongBox on Android devices are dedicated security coprocessors that generate, store, and use cryptographic keys without exposing them to the main processor&apos;s memory. Keys stored in the Secure Enclave are non-extractable — they cannot be read by the operating system, the application, or even a physical attacker with direct chip access. For mobile applications, the Secure Enclave is used to store the private key for token binding, the encryption key for local data, and the biometric authentication credentials. When the application needs to perform a cryptographic operation (signing a request, decrypting data), it sends the data to the Secure Enclave, which performs the operation internally and returns the result without exposing the key. For web applications running in the browser, direct Secure Enclave access is not available, but the Web Authentication API (WebAuthn) leverages the platform&apos;s secure enclave for passkey authentication. Passkeys are cryptographic key pairs stored in the device&apos;s secure enclave and protected by biometric authentication (Face ID, Touch ID, fingerprint). When the user authenticates with a passkey, the secure enclave signs the authentication challenge using the stored private key, and the server validates the signature against the registered public key. This provides phishing-resistant authentication without the application ever handling the private key.
        </p>
        <p>
          Storage quota management addresses the practical limits of client-side storage across different mechanisms. localStorage has a quota of approximately 5MB per origin, which is shared across all tabs and is sufficient for simple preferences and feature flags but inadequate for substantial offline data. IndexedDB has a much larger quota — typically 50-60% of available disk space on desktop browsers and a smaller but still substantial amount on mobile browsers. The quota is managed by the browser&apos;s storage manager, which may evict data from persistent storage when the device is running low on disk space. The StorageManager API (navigator.storage.estimate and navigator.storage.persist) allows applications to query their current storage usage and request persistent storage that is exempt from automatic eviction. Requesting persistent storage requires user engagement (the user must have interacted with the site meaningfully) and is granted at the browser&apos;s discretion. Production applications that rely on IndexedDB for offline data should request persistent storage during the onboarding flow or after the user has demonstrated engagement (completed a meaningful action, returned multiple times). When the storage quota is approaching its limit, the application should implement a data eviction strategy — remove the oldest cached data, compress existing data, or prompt the user to clear offline data for sections they no longer need. The quota estimate returned by navigator.storage.estimate includes both the current usage and the total quota, enabling the application to monitor storage consumption and proactively manage data before hitting the limit.
        </p>
        <p>
          Data classification and retention policies provide a structured approach to managing sensitive data throughout its lifecycle. Data should be classified by sensitivity level: critical (authentication tokens, encryption keys, biometric data), sensitive (PII, financial data, health records), moderate (user preferences, browsing history), and public (non-sensitive application data). Each classification level dictates specific storage requirements — critical data is stored in memory only or in HttpOnly cookies with very short expiry, sensitive data is encrypted before storage with keys in memory only, moderate data may be stored in encrypted IndexedDB with periodic cleanup, and public data can be stored in localStorage with standard retention policies. Retention policies define the maximum duration for which each data category is retained — session tokens are retained for 15-60 minutes, refresh tokens for 7-30 days, offline cached data for 24-72 hours, and user preferences indefinitely (or until the user clears them). The implementation uses scheduled cleanup tasks (triggered on app initialization, on periodic intervals via setInterval, or via service worker periodic sync) that scan the storage and remove data exceeding its retention period. The cleanup task logs each deletion for audit purposes, recording the data category, retention period, and deletion timestamp. For regulated applications (HIPAA, PCI-DSS, GDPR), the retention policy must be documented, reviewed by legal counsel, and enforced automatically — manual data deletion is not sufficient for compliance because human error and oversight lead to data being retained longer than permitted.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Where should you store authentication tokens?
            </p>
            <p className="mt-2 text-sm">
              A: HttpOnly, Secure, SameSite cookies. HttpOnly prevents
              JavaScript access (XSS cannot steal tokens), Secure ensures tokens
              only sent over HTTPS, SameSite protects against CSRF. For maximum
              security, use short-lived access tokens (15-60 min) in memory
              with rotating refresh tokens in HttpOnly cookies. Never store
              tokens in localStorage — any XSS exposes all sessions.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the security implications of localStorage?
            </p>
            <p className="mt-2 text-sm">
              A: localStorage is accessible by any JavaScript on the page. If an
              attacker injects a malicious script via XSS, they can read all
              localStorage data including tokens, PII, and sensitive
              information. They can also modify data, causing application bugs
              or security issues. Never store sensitive data in localStorage
              without encryption. Even encrypted data is at risk if the
              encryption key is also stored client-side. Use HttpOnly cookies
              for sensitive data instead.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you protect against CSRF when using cookies?
            </p>
            <p className="mt-2 text-sm">
              A: Multiple layers: SameSite cookie attribute (Strict or Lax)
              prevents cross-origin cookie sending. CSRF tokens — unique token
              per session, embedded in forms, validated on state-changing
              operations. Custom headers (X-Requested-With) that browsers
              don&apos;t send cross-origin. Require re-authentication for
              sensitive operations. Combine these for defense in depth — no
              single layer is sufficient on its own.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you use IndexedDB versus localStorage?
            </p>
            <p className="mt-2 text-sm">
              A: IndexedDB for large data (50MB+), complex queries, binary data,
              or when you need transactions. localStorage for simple key-value
              pairs under 5MB. Both are vulnerable to XSS, so neither is
              suitable for sensitive data without encryption. IndexedDB has a
              more complex API but better performance for large datasets. Use
              IndexedDB for offline-first applications, localStorage for simple
              preferences and feature flags.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement secure offline storage for a banking
              app?
            </p>
            <p className="mt-2 text-sm">
              A: Minimal data offline for security. Use IndexedDB with AES-GCM
              encryption. Derive encryption key from user password (not stored).
              Store only essential data (account balances, recent transactions)
              — no sensitive operations offline. Require re-authentication for
              transactions. Clear all data on logout. Implement aggressive
              auto-logout timer (5 minutes). Combine with strong CSP,
              certificate pinning, and device integrity checks.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://owasp.org/www-community/controls/SecureCookieAttribute"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP — Secure Cookie Attribute
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Web Crypto API
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP — HTML5 Security Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://auth0.com/blog/cookies-vs-localstorage-for-authentication/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Auth0 — Cookies vs localStorage for Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP — CSRF Prevention Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

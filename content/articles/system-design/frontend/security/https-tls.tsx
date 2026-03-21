"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-security-https-tls-extensive",
  title: "HTTPS/TLS",
  description: "Comprehensive guide to HTTPS and TLS protocols, certificate management, handshake process, security best practices, and implementation strategies for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "security",
  slug: "https-tls",
  version: "extensive",
  wordCount: 7500,
  readingTime: 30,
  lastUpdated: "2026-03-19",
  tags: ["security", "https", "tls", "ssl", "frontend", "web-security", "certificates", "encryption"],
  relatedTopics: ["secure-cookie-attributes", "content-security-policy", "subresource-integrity"],
};

export default function HTTPSTLSArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>HTTPS (Hypertext Transfer Protocol Secure)</strong> is the secure version of HTTP that uses
          <strong> TLS (Transport Layer Security)</strong> to encrypt communication between a client (browser)
          and a server. TLS is the successor to SSL (Secure Sockets Layer), and while the terms are often used
          interchangeably, modern implementations use TLS—SSL is deprecated due to security vulnerabilities.
        </p>
        <p>
          HTTPS provides three critical security guarantees:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Encryption:</strong> Data exchanged between client and server is encrypted, preventing
            eavesdroppers from reading sensitive information (credentials, personal data, payment details).
          </li>
          <li>
            <strong>Integrity:</strong> Data cannot be modified or corrupted during transit without detection.
            TLS uses message authentication codes (MACs) to detect tampering.
          </li>
          <li>
            <strong>Authentication:</strong> TLS certificates verify the server&apos;s identity, ensuring users
            are communicating with the legitimate website and not an imposter (preventing man-in-the-middle attacks).
          </li>
        </ul>
        <p>
          HTTPS has evolved from a best practice to a mandatory requirement. Modern browsers mark non-HTTPS sites
          as &quot;Not Secure,&quot; many web platform features (Service Workers, Geolocation, Payment Request API)
          require HTTPS, and search engines (Google) use HTTPS as a ranking signal. As of 2024, over 90% of web
          traffic uses HTTPS.
        </p>
        <p>
          <strong>Why HTTPS/TLS matters for staff/principal engineers:</strong> As a technical leader, you&apos;re
          responsible for security architecture, compliance requirements (PCI-DSS, HIPAA, GDPR all require encryption
          in transit), and infrastructure decisions. Understanding TLS enables you to make informed decisions about
          certificate management, cipher suite configuration, performance optimization (HTTP/2, HTTP/3 require TLS),
          and security hardening.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: HTTPS Is Table Stakes</h3>
          <p>
            HTTPS is no longer optional—it&apos;s the baseline for any production website. The question isn&apos;t
            &quot;should we use HTTPS?&quot; but &quot;how do we implement it correctly and keep it secure?&quot;
            Free certificates (Let&apos;s Encrypt), automated renewal, and CDN support have removed cost barriers.
          </p>
        </div>
      </section>

      <section>
        <h2>TLS Protocol Overview</h2>
        <p>
          TLS operates between the transport layer (TCP) and application layer (HTTP), providing a secure channel.
          Understanding the TLS handshake is essential for debugging connection issues and optimizing performance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TLS Handshake Process</h3>
        <p>
          The TLS handshake establishes a secure connection before any HTTP data is exchanged. TLS 1.3 (the current
          standard) simplified the handshake to reduce latency.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/tls-handshake-flow.svg"
          alt="TLS 1.3 Handshake Flow showing Client Hello, Server Hello, Certificate, Key Exchange, and Finished messages"
          caption="TLS 1.3 Handshake: Completed in 1-RTT (or 0-RTT for resumed connections), significantly faster than TLS 1.2's 2-RTT."
        />

        <h4 className="mt-4 mb-2 font-semibold">TLS 1.3 Handshake Steps</h4>
        <ol className="space-y-2">
          <li>
            <strong>Client Hello:</strong> Client sends supported TLS versions, cipher suites, and a key share
            (ephemeral public key for key exchange).
          </li>
          <li>
            <strong>Server Hello:</strong> Server selects TLS version and cipher suite, sends its key share and
            certificate.
          </li>
          <li>
            <strong>Certificate Verification:</strong> Client verifies server certificate against trusted Certificate
            Authorities (CAs).
          </li>
          <li>
            <strong>Key Derivation:</strong> Both parties derive shared session keys from the key exchange (using
            Diffie-Hellman or ECDHE).
          </li>
          <li>
            <strong>Finished:</strong> Both parties send encrypted &quot;Finished&quot; messages to verify the
            handshake wasn&apos;t tampered with.
          </li>
          <li>
            <strong>Application Data:</strong> Encrypted HTTP communication begins.
          </li>
        </ol>

        <h4 className="mt-4 mb-2 font-semibold">TLS 1.2 vs TLS 1.3</h4>
        <p>
          TLS 1.3 (RFC 8446, 2018) introduced significant improvements:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Faster handshake:</strong> 1-RTT instead of 2-RTT (or 0-RTT for resumed connections)
          </li>
          <li>
            <strong>Removed weak algorithms:</strong> No more RSA key exchange, SHA-1, RC4, DES, 3DES, MD5
          </li>
          <li>
            <strong>Perfect Forward Secrecy:</strong> Ephemeral key exchange is mandatory, not optional
          </li>
          <li>
            <strong>Encrypted handshake:</strong> More of the handshake is encrypted, improving privacy
          </li>
          <li>
            <strong>Simplified cipher suites:</strong> Fewer options, all considered secure
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TLS Record Layer</h3>
        <p>
          After the handshake, data is exchanged in TLS records:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Fragmentation:</strong> Application data is split into manageable chunks (max 16KB)
          </li>
          <li>
            <strong>Compression:</strong> Optional (disabled by default due to CRIME attack)
          </li>
          <li>
            <strong>Encryption:</strong> Data encrypted with session keys using agreed cipher (AES-GCM, ChaCha20)
          </li>
          <li>
            <strong>Authentication:</strong> MAC (Message Authentication Code) ensures integrity
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: TLS 1.3 Is Mandatory for Modern Security</h3>
          <p>
            TLS 1.2 is still widely supported but TLS 1.3 should be the default. It&apos;s faster, more secure,
            and supported by all modern browsers and servers. Disable TLS 1.0 and 1.1—they&apos;re deprecated
            and vulnerable.
          </p>
        </div>
      </section>

      <section>
        <h2>TLS Certificates</h2>
        <p>
          TLS certificates bind a domain name to a public key and are signed by trusted Certificate Authorities
          (CAs). Understanding certificate types, validation levels, and the trust chain is essential for proper
          implementation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Certificate Components</h3>
        <ul className="space-y-2">
          <li>
            <strong>Subject:</strong> Domain name(s) the certificate covers (Common Name, Subject Alternative Names)
          </li>
          <li>
            <strong>Issuer:</strong> Certificate Authority that signed the certificate
          </li>
          <li>
            <strong>Public Key:</strong> Used for key exchange and signature verification
          </li>
          <li>
            <strong>Validity Period:</strong> Not Before and Not After dates (max 398 days for public certificates)
          </li>
          <li>
            <strong>Signature:</strong> CA&apos;s digital signature proving authenticity
          </li>
          <li>
            <strong>Extensions:</strong> Key Usage, Extended Key Usage, Subject Alternative Names, etc.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Certificate Validation Levels</h3>

        <h4 className="mt-4 mb-2 font-semibold">Domain Validation (DV)</h4>
        <p>
          CA verifies control over the domain (via DNS record, email, or HTTP file). Fastest and cheapest option.
        </p>
        <ul className="space-y-2">
          <li><strong>Use case:</strong> Most websites, blogs, documentation sites</li>
          <li><strong>Validation:</strong> Automated, minutes to hours</li>
          <li><strong>Cost:</strong> Free (Let&apos;s Encrypt) to ~$10/year</li>
          <li><strong>Browser display:</strong> Padlock icon, no organization name</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Organization Validation (OV)</h4>
        <p>
          CA verifies domain control AND organization identity (business registration, phone verification).
        </p>
        <ul className="space-y-2">
          <li><strong>Use case:</strong> Business websites, e-commerce</li>
          <li><strong>Validation:</strong> Manual, 1-3 days</li>
          <li><strong>Cost:</strong> ~$50-200/year</li>
          <li><strong>Browser display:</strong> Padlock icon, organization in certificate details</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Extended Validation (EV)</h4>
        <p>
          Most rigorous validation. CA verifies legal, physical, and operational existence of organization.
        </p>
        <ul className="space-y-2">
          <li><strong>Use case:</strong> Financial institutions, healthcare, high-value e-commerce</li>
          <li><strong>Validation:</strong> Manual, 3-7 days</li>
          <li><strong>Cost:</strong> ~$200-500/year</li>
          <li><strong>Browser display:</strong> Organization name sometimes shown (varies by browser)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Certificate Types by Coverage</h3>
        <ul className="space-y-2">
          <li>
            <strong>Single Domain:</strong> Covers one domain (e.g., example.com)
          </li>
          <li>
            <strong>Wildcard:</strong> Covers domain and all subdomains (e.g., *.example.com covers
            www.example.com, api.example.com, etc.)
          </li>
          <li>
            <strong>Multi-Domain (SAN):</strong> Covers multiple unrelated domains in one certificate
            (e.g., example.com, example.org, example.net)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Certificate Trust Chain</h3>
        <p>
          Certificates form a chain of trust from the server certificate to a trusted root CA. The server certificate is signed by an Intermediate CA Certificate, which is in turn signed by a Root CA Certificate that is trusted by the browser/OS.
        </p>
        <p>
          <strong>Why intermediates exist:</strong> Root CAs keep their private keys offline for security.
          Intermediate CAs sign end-entity certificates, and if compromised, can be revoked without affecting
          the root.
        </p>
        <p>
          <strong>Certificate pinning:</strong> Some apps pin to specific certificates or public keys to detect
          MITM attacks, but this can cause issues if certificates change unexpectedly.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/tls-certificate-chain.svg"
          alt="TLS Certificate Chain showing Server Certificate → Intermediate CA → Root CA trust hierarchy"
          caption="Certificate Trust Chain: Browsers trust the Root CA, which signs Intermediates, which sign server certificates."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Certificate Lifecycle Management</h3>
        <ul className="space-y-2">
          <li>
            <strong>Generation:</strong> Create CSR (Certificate Signing Request) with private/public key pair
          </li>
          <li>
            <strong>Validation:</strong> CA verifies domain/organization ownership
          </li>
          <li>
            <strong>Issuance:</strong> CA signs and issues certificate
          </li>
          <li>
            <strong>Deployment:</strong> Install certificate on server/load balancer/CDN
          </li>
          <li>
            <strong>Monitoring:</strong> Track expiration dates, set up alerts (30, 14, 7 days before expiry)
          </li>
          <li>
            <strong>Renewal:</strong> Renew before expiration (automate with ACME/Let&apos;s Encrypt)
          </li>
          <li>
            <strong>Revocation:</strong> Revoke if compromised (via CRL or OCSP)
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Automate Certificate Management</h3>
          <p>
            Manual certificate renewal is a common cause of outages. Use ACME protocol (Let&apos;s Encrypt,
            ZeroSSL) with automatic renewal. Tools like certbot, acme.sh, or CDN-managed certificates eliminate
            human error. Set up monitoring alerts as a backup.
          </p>
        </div>
      </section>

      <section>
        <h2>Cipher Suites and Security Configuration</h2>
        <p>
          A cipher suite defines the algorithms used for key exchange, authentication, encryption, and integrity.
          Choosing secure cipher suites is critical for protecting data.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cipher Suite Components</h3>
        <p>
          A TLS cipher suite specifies four algorithms. For example, <code className="text-sm">TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</code> breaks down as: TLS protocol, ECDHE for key exchange, RSA for authentication, AES-128-GCM for encryption, and SHA256 for MAC/PRF.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Key Exchange</h4>
        <ul className="space-y-2">
          <li>
            <strong>ECDHE:</strong> Elliptic Curve Diffie-Hellman Ephemeral (recommended, provides Perfect Forward Secrecy)
          </li>
          <li>
            <strong>DHE:</strong> Diffie-Hellman Ephemeral (secure but slower)
          </li>
          <li>
            <strong>RSA:</strong> No forward secrecy (deprecated in TLS 1.3)
          </li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Authentication</h4>
        <ul className="space-y-2">
          <li>
            <strong>RSA:</strong> Widely supported, well-understood
          </li>
          <li>
            <strong>ECDSA:</strong> Faster, smaller keys, growing support
          </li>
          <li>
            <strong>Ed25519:</strong> Modern, fast, secure (TLS 1.3)
          </li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Encryption</h4>
        <ul className="space-y-2">
          <li>
            <strong>AES-GCM:</strong> Fast, secure, hardware-accelerated (recommended)
          </li>
          <li>
            <strong>ChaCha20-Poly1305:</strong> Fast on mobile/low-power devices, no hardware AES
          </li>
          <li>
            <strong>AES-CBC:</strong> Older, vulnerable to padding oracle attacks (avoid)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recommended Server Configuration</h3>
        <p>
          A recommended TLS configuration enables TLSv1.2 and TLSv1.3 only (disabling older protocols), uses secure cipher suites like <code className="text-sm">TLS_AES_128_GCM_SHA256</code> and <code className="text-sm">TLS_AES_256_GCM_SHA384</code> for TLS 1.3, prefers server ciphers, configures session caching with <code className="text-sm">ssl_session_cache shared:SSL:10m</code>, sets session timeout to 1 day, disables session tickets for forward secrecy, and enables OCSP stapling for certificate revocation checking.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Perfect Forward Secrecy (PFS)</h3>
        <p>
          PFS ensures that if a server&apos;s private key is compromised in the future, past sessions cannot be
          decrypted. This is achieved by using ephemeral key exchange (ECDHE, DHE) where each session uses a
          unique key pair.
        </p>
        <p>
          <strong>Why PFS matters:</strong> Without PFS, an attacker who records encrypted traffic and later
          obtains the server&apos;s private key can decrypt all past sessions. With PFS, each session&apos;s
          keys are independent and cannot be derived from the server&apos;s long-term key.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Headers for HTTPS</h3>
        <ul className="space-y-2">
          <li>
            <strong>Strict-Transport-Security (HSTS):</strong> Forces browsers to use HTTPS for future requests. Set with a max-age of 31536000 seconds (1 year), include <code className="text-sm">includeSubDomains</code> for all subdomains, and <code className="text-sm">preload</code> to submit to browser preload lists.
          </li>
          <li>
            <strong>Expect-CT:</strong> Enforces Certificate Transparency monitoring. Set with a max-age of 86400 seconds (1 day), <code className="text-sm">enforce</code> mode, and a <code className="text-sm">report-uri</code> for violation reports.
          </li>
          <li>
            <strong>Upgrade-Insecure-Requests:</strong> Upgrades HTTP resources to HTTPS automatically via CSP directive.
          </li>
        </ul>
      </section>

      <section>
        <h2>Performance Optimization</h2>
        <p>
          TLS adds latency and CPU overhead, but modern optimizations minimize the impact. Understanding these
          techniques is essential for balancing security and performance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TLS Handshake Optimization</h3>

        <h4 className="mt-4 mb-2 font-semibold">Session Resumption</h4>
        <p>
          Resume previous TLS sessions without full handshake:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Session IDs:</strong> Server stores session state, client sends session ID on reconnect
          </li>
          <li>
            <strong>Session Tickets (RFC 5077):</strong> Server encrypts session state, client stores and sends
            it back (stateless for server)
          </li>
          <li>
            <strong>0-RTT (TLS 1.3):</strong> Client sends data in first flight for resumed connections
            (warning: no replay protection for 0-RTT data)
          </li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">OCSP Stapling</h4>
        <p>
          Server periodically fetches OCSP (Online Certificate Status Protocol) response from CA and &quot;staples&quot;
          it to the TLS handshake. This avoids clients making separate OCSP requests, reducing latency and improving
          privacy.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">TLS False Start</h4>
        <p>
          Client sends application data before receiving server&apos;s Finished message, reducing latency by one
          round trip. Supported by most browsers.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP/2 and HTTP/3</h3>
        <p>
          Modern HTTP versions require or strongly benefit from TLS:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>HTTP/2:</strong> Requires TLS 1.2+ in practice (all major browsers require it). Provides
            multiplexing, header compression, server push.
          </li>
          <li>
            <strong>HTTP/3:</strong> Built on QUIC (UDP-based), includes TLS 1.3 by design. Eliminates head-of-line
            blocking, faster connection establishment.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/https-performance-comparison.svg"
          alt="HTTPS Performance Comparison showing HTTP/1.1 vs HTTP/2 vs HTTP/3 latency and connection patterns"
          caption="HTTP Performance: HTTP/2 and HTTP/3 significantly reduce latency through multiplexing and improved connection handling."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hardware Acceleration</h3>
        <ul className="space-y-2">
          <li>
            <strong>AES-NI:</strong> CPU instructions for AES encryption (10-20x speedup)
          </li>
          <li>
            <strong>ECC Acceleration:</strong> ARM NEON, Intel PCLMULQDQ for elliptic curve operations
          </li>
          <li>
            <strong>SSL/TLS Offloading:</strong> Load balancers or dedicated hardware handle TLS, backend servers
            handle application logic
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CDN and Edge TLS</h3>
        <p>
          CDNs terminate TLS at edge locations, reducing latency:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Edge certificates:</strong> CDN manages certificates, renews automatically
          </li>
          <li>
            <strong>Origin shielding:</strong> CDN uses separate TLS connection to origin, can use different
            cipher suites
          </li>
          <li>
            <strong>mTLS:</strong> Mutual TLS between CDN and origin for additional authentication
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: TLS Performance Is Good Enough</h3>
          <p>
            With TLS 1.3, HTTP/2, session resumption, and modern hardware, TLS overhead is typically &lt;1% of
            page load time. Focus on application-level optimizations (caching, compression, CDN) before worrying
            about TLS performance.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Vulnerabilities and Mitigations</h2>
        <p>
          Understanding TLS vulnerabilities helps you configure servers securely and avoid known pitfalls.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Protocol-Level Vulnerabilities</h3>

        <h4 className="mt-4 mb-2 font-semibold">POODLE (Padding Oracle On Downgraded Legacy Encryption)</h4>
        <p>
          Exploits SSL 3.0&apos;s weak padding validation. Mitigation: Disable SSL 3.0 entirely.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">BEAST (Browser Exploit Against SSL/TLS)</h4>
        <p>
          Exploits CBC mode in TLS 1.0. Mitigation: Use TLS 1.1+ or AES-GCM cipher suites.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">CRIME (Compression Ratio Info-leak Made Easy)</h4>
        <p>
          Exploits TLS compression to extract secrets. Mitigation: Disable TLS compression (disabled by default
          in modern implementations).
        </p>

        <h4 className="mt-4 mb-2 font-semibold">BREACH (Browser Reconnaissance and Exfiltration via Adaptive Compression)</h4>
        <p>
          Exploits HTTP compression (not TLS compression) to extract secrets. Mitigation: Disable HTTP
          compression for sensitive pages, use per-request random padding, or separate secrets from user input.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Heartbleed</h4>
        <p>
          OpenSSL vulnerability allowing memory disclosure. Mitigation: Use patched OpenSSL versions, rotate
          certificates and keys after patching.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implementation Vulnerabilities</h3>

        <h4 className="mt-4 mb-2 font-semibold">Weak Cipher Suites</h4>
        <p>
          Allowing weak ciphers (RC4, DES, 3DES, export ciphers) enables attacks. Mitigation: Configure servers
          to only allow strong ciphers (AES-GCM, ChaCha20).
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Certificate Validation Bypass</h4>
        <p>
          Some apps incorrectly validate certificates (accepting self-signed, ignoring hostname mismatch).
          Mitigation: Use platform TLS libraries, never implement custom certificate validation.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Mixed Content</h4>
        <p>
          HTTPS pages loading HTTP resources (images, scripts, styles). Mitigation: Use CSP
          <code className="text-sm">upgrade-insecure-requests</code>, fix all resource URLs to use HTTPS.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Testing</h3>
        <ul className="space-y-2">
          <li>
            <strong>SSL Labs Test:</strong> Comprehensive server configuration analysis
            (ssllabs.com/ssltest)
          </li>
          <li>
            <strong>testssl.sh:</strong> Command-line TLS testing tool
          </li>
          <li>
            <strong>nmap --script ssl-enum-ciphers:</strong> Enumerate supported cipher suites
          </li>
          <li>
            <strong>Mozilla Observatory:</strong> Web security scanning including TLS
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Disable Legacy Protocols</h3>
          <p>
            Disable SSL 2.0, SSL 3.0, TLS 1.0, and TLS 1.1. They&apos;re all deprecated and vulnerable. Use only
            TLS 1.2 and TLS 1.3. Most compliance frameworks (PCI-DSS 3.2.1) require this.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Server Configuration</h3>
        <ul className="space-y-2">
          <li>
            <strong>Enable TLS 1.2 and 1.3 only:</strong> Disable all older protocols
          </li>
          <li>
            <strong>Use strong cipher suites:</strong> Prioritize AES-GCM and ChaCha20-Poly1305
          </li>
          <li>
            <strong>Enable Perfect Forward Secrecy:</strong> Use ECDHE key exchange
          </li>
          <li>
            <strong>Enable OCSP Stapling:</strong> Improves performance and privacy
          </li>
          <li>
            <strong>Enable HTTP/2:</strong> Better performance, requires TLS 1.2+
          </li>
          <li>
            <strong>Set HSTS header:</strong> Enforce HTTPS for future requests
          </li>
          <li>
            <strong>Use secure certificate:</strong> 2048+ bit RSA or 256+ bit ECDSA
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Certificate Management</h3>
        <ul className="space-y-2">
          <li>
            <strong>Automate renewal:</strong> Use ACME protocol (Let&apos;s Encrypt, ZeroSSL)
          </li>
          <li>
            <strong>Monitor expiration:</strong> Set up alerts at 30, 14, and 7 days before expiry
          </li>
          <li>
            <strong>Use appropriate validity:</strong> Shorter validity periods (90 days) reduce exposure if
            compromised
          </li>
          <li>
            <strong>Implement key rotation:</strong> Generate new key pairs with each renewal
          </li>
          <li>
            <strong>Secure private keys:</strong> Store in HSM or secure key management service, restrict access
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Frontend Considerations</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use HTTPS for all resources:</strong> No mixed content
          </li>
          <li>
            <strong>Enable HSTS preload:</strong> Submit domain to HSTS preload list for maximum protection
          </li>
          <li>
            <strong>Use Subresource Integrity:</strong> Verify integrity of third-party scripts
          </li>
          <li>
            <strong>Implement Certificate Transparency monitoring:</strong> Detect unauthorized certificates
            for your domain
          </li>
          <li>
            <strong>Consider HPKP alternatives:</strong> HPKP is deprecated; use Expect-CT and CT monitoring
            instead
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compliance Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>PCI-DSS:</strong> Requires TLS 1.2+, strong cryptography, regular security testing
          </li>
          <li>
            <strong>HIPAA:</strong> Requires encryption in transit for PHI (Protected Health Information)
          </li>
          <li>
            <strong>GDPR:</strong> Requires appropriate security measures including encryption
          </li>
          <li>
            <strong>SOC 2:</strong> Requires encryption in transit as part of security controls
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Allowing legacy protocols:</strong> SSL 3.0, TLS 1.0, TLS 1.1 are all vulnerable. Disable them.
          </li>
          <li>
            <strong>Weak cipher suites:</strong> RC4, DES, 3DES, and export ciphers are broken. Configure servers
            to only allow strong ciphers.
          </li>
          <li>
            <strong>Certificate expiration:</strong> Manual renewal leads to outages. Automate with ACME.
          </li>
          <li>
            <strong>Mixed content warnings:</strong> HTTPS pages with HTTP resources break security. Fix all
            resource URLs.
          </li>
          <li>
            <strong>Not enabling HSTS:</strong> Without HSTS, first request can be downgraded to HTTP. Enable
            HSTS with preload.
          </li>
          <li>
            <strong>Ignoring OCSP:</strong> Not checking certificate revocation allows use of compromised
            certificates. Enable OCSP stapling.
          </li>
          <li>
            <strong>Poor private key security:</strong> Storing keys in plaintext, sharing keys across servers,
            or committing keys to version control. Use secure key management.
          </li>
          <li>
            <strong>Not testing configuration:</strong> Assuming default server config is secure. Regularly test
            with SSL Labs or similar tools.
          </li>
          <li>
            <strong>Ignoring Certificate Transparency:</strong> Not monitoring CT logs allows attackers to
            obtain certificates for your domain undetected.
          </li>
          <li>
            <strong>Using self-signed certificates in production:</strong> Browsers will show security warnings,
            eroding user trust. Use trusted CA certificates.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-Commerce Platform</h3>
        <p>
          <strong>Challenge:</strong> Process payments securely, comply with PCI-DSS, protect customer data.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>TLS 1.3 with AES-256-GCM cipher suites</li>
          <li>HSTS with preload enabled</li>
          <li>EV certificates for maximum trust</li>
          <li>Regular PCI-DSS compliance scans including TLS testing</li>
          <li>mTLS between load balancer and payment processing backend</li>
          <li>Certificate Transparency monitoring for all domains</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Application</h3>
        <p>
          <strong>Challenge:</strong> HIPAA compliance, protect PHI in transit, secure mobile app communication.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>TLS 1.3 mandatory (TLS 1.2 for legacy device compatibility)</li>
          <li>Certificate pinning in mobile apps (with backup pins)</li>
          <li>OV certificates with organization validation</li>
          <li>mTLS for API communication between services</li>
          <li>Automated certificate renewal with 90-day validity</li>
          <li>Regular security audits including penetration testing</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SaaS Platform with Global Users</h3>
        <p>
          <strong>Challenge:</strong> Low latency globally, high availability, secure multi-tenant architecture.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>CDN with edge TLS termination (Cloudflare, Fastly, CloudFront)</li>
          <li>Wildcard certificates for subdomain coverage</li>
          <li>HTTP/2 and HTTP/3 enabled for performance</li>
          <li>Session resumption with TLS 1.3 0-RTT for returning users</li>
          <li>Automated certificate management via CDN</li>
          <li>OCSP stapling enabled at edge and origin</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Financial Services</h3>
        <p>
          <strong>Challenge:</strong> Maximum security, regulatory compliance, fraud prevention.
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul className="space-y-2">
          <li>TLS 1.3 only (no TLS 1.2 fallback)</li>
          <li>Hardware Security Modules (HSM) for private key storage</li>
          <li>Short certificate validity (30 days) with automated renewal</li>
          <li>Certificate pinning with multiple backup pins</li>
          <li>Real-time Certificate Transparency monitoring with alerting</li>
          <li>Regular third-party security audits</li>
          <li>Strict HSTS with long max-age and includeSubDomains</li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs: TLS
            </a>
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc8446" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 8446: TLS 1.3 Specification
            </a>
          </li>
          <li>
            <a href="https://www.ssllabs.com/ssltest/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SSL Labs Server Test
            </a>
          </li>
          <li>
            <a href="https://wiki.mozilla.org/Security/Server_Side_TLS" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Mozilla TLS Configuration Generator
            </a>
          </li>
          <li>
            <a href="https://letsencrypt.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Let&apos;s Encrypt - Free TLS Certificates
            </a>
          </li>
          <li>
            <a href="https://www.certificate-transparency.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Certificate Transparency
            </a>
          </li>
          <li>
            <a href="https://github.com/drwetter/testssl.sh" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              testssl.sh - TLS Testing Tool
            </a>
          </li>
          <li>
            <a href="https://observatory.mozilla.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Mozilla Observatory - Security Scanning
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: What&apos;s the difference between SSL, TLS, and HTTPS?</p>
            <p className="mt-2 text-sm">
              A: <strong>SSL (Secure Sockets Layer)</strong> is the original protocol for secure communication,
              now deprecated due to vulnerabilities. <strong>TLS (Transport Layer Security)</strong> is the
              successor to SSL—TLS 1.0 was essentially SSL 3.1. Modern implementations use TLS 1.2 or 1.3.
              <strong>HTTPS</strong> is HTTP over TLS/SSL—the &quot;S&quot; stands for Secure. When people say
              &quot;SSL certificate,&quot; they technically mean TLS certificate, but the term persists
              historically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: Explain the TLS handshake process.</p>
            <p className="mt-2 text-sm">
              A: In TLS 1.3: (1) Client sends Client Hello with supported versions, cipher suites, and key share.
              (2) Server responds with Server Hello selecting version/cipher, sends certificate and key share.
              (3) Client verifies certificate against trusted CAs. (4) Both derive shared session keys from key
              exchange (ECDHE). (5) Both send encrypted &quot;Finished&quot; messages. (6) Application data flows
              encrypted. TLS 1.3 completes in 1-RTT (or 0-RTT for resumed connections), faster than TLS 1.2&apos;s
              2-RTT.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: What is Perfect Forward Secrecy and why does it matter?</p>
            <p className="mt-2 text-sm">
              A: <strong>Perfect Forward Secrecy (PFS)</strong> ensures that if a server&apos;s long-term private
              key is compromised, past session keys cannot be derived. This is achieved using ephemeral key
              exchange (ECDHE, DHE) where each session uses a unique, temporary key pair. Without PFS, an attacker
              who records encrypted traffic and later obtains the private key can decrypt all past sessions. With
              PFS, each session is independent—comproming the server key doesn&apos;t reveal past session keys.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: How would you configure a secure TLS server?</p>
            <p className="mt-2 text-sm">
              A: Enable only TLS 1.2 and 1.3 (disable SSL 2/3, TLS 1.0/1.1). Use strong cipher suites
              (AES-128/256-GCM, ChaCha20-Poly1305) with ECDHE key exchange for PFS. Enable OCSP stapling for
              certificate revocation checking. Set HSTS header with long max-age and preload. Use 2048+ bit RSA
              or 256+ bit ECDSA certificates. Enable HTTP/2. Implement automated certificate renewal (ACME).
              Regularly test configuration with SSL Labs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: What is HSTS and why is it important?</p>
            <p className="mt-2 text-sm">
              A: <strong>HSTS (HTTP Strict Transport Security)</strong> is a response header that tells browsers
              to only use HTTPS for future requests to the domain, even if the user types &quot;http://&quot; or
              clicks an HTTP link. This prevents SSL stripping attacks where an attacker downgrades HTTPS to HTTP.
              HSTS preload (submitting domain to browser preload list) provides protection even for the first
              visit. Example header: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: How do you prevent certificate-related outages?</p>
            <p className="mt-2 text-sm">
              A: Automate certificate renewal using ACME protocol (Let&apos;s Encrypt, ZeroSSL) with tools like
              certbot or acme.sh. Use short validity periods (90 days) with automatic renewal at day 60. Set up
              monitoring alerts at 30, 14, and 7 days before expiration as backup. Use CDN-managed certificates
              where possible. Implement certificate transparency monitoring to detect unauthorized certificates.
              Never rely on manual renewal—it will fail eventually.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

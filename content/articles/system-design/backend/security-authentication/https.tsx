"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-https-extensive",
  title: "HTTPS",
  description:
    "Staff-level deep dive into HTTPS architecture, TLS deployment, HTTP/2 and HTTP/3 performance, HSTS, certificate management, and the operational practice of securing web communication at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "https",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "https", "tls", "http2", "http3"],
  relatedTopics: ["tls-ssl", "security-headers", "cors-cross-origin-resource-sharing", "api-security"],
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
          <strong>HTTPS (Hypertext Transfer Protocol Secure)</strong> is HTTP layered on top of TLS (Transport Layer
          Security) — it encrypts HTTP communication between the client and server, providing confidentiality
          (eavesdroppers cannot read the traffic), integrity (attackers cannot modify the traffic), and
          authentication (the client verifies the server&apos;s identity through a certificate). HTTPS is the standard for
          all web communication — browsers mark non-HTTPS sites as &quot;Not Secure,&quot; search engines rank HTTPS sites
          higher, and compliance standards (PCI-DSS, HIPAA, SOC 2) require HTTPS for all communication involving
          sensitive data.
        </p>
        <p>
          HTTPS is not a separate protocol from HTTP — it is HTTP running over an encrypted TLS connection. The
          difference is that with HTTP, the traffic is plaintext and visible to anyone on the network path (ISPs,
          public Wi-Fi operators, nation-state actors), while with HTTPS, the traffic is encrypted and only the
          client and server can read it. The TLS layer sits between the application layer (HTTP) and the transport
          layer (TCP), encrypting all HTTP headers, cookies, and body content.
        </p>
        <p>
          The evolution of HTTPS has been driven by the increasing sophistication of network attacks. Early web
          traffic was entirely HTTP (plaintext), making it vulnerable to eavesdropping, session hijacking, and
          content injection. The introduction of TLS (initially SSL) enabled encrypted web communication, but
          adoption was slow due to performance concerns (TLS handshake added latency) and cost (certificates were
          expensive). The launch of Let&apos;s Encrypt (2016) provided free, automated TLS certificates, dramatically
          increasing HTTPS adoption. Today, over 90 percent of web pages load over HTTPS, and HTTPS is considered
          a baseline security requirement for all web applications.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">What HTTPS Protects</h3>
          <p className="text-muted mb-3">
            <strong>Confidentiality:</strong> HTTP headers (cookies, authorization tokens, referer), request/response bodies (form data, API responses), and URLs (path and query parameters) are all encrypted. Only the domain name (SNI) is visible during the TLS handshake — the rest of the URL is encrypted.
          </p>
          <p className="text-muted mb-3">
            <strong>Integrity:</strong> TLS ensures that the traffic has not been modified in transit — an attacker cannot inject ads, malware, or modified content into the response. This prevents ISP-level content injection and man-in-the-middle attacks.
          </p>
          <p>
            <strong>Authentication:</strong> The server&apos;s certificate proves its identity — the client verifies that the certificate was issued by a trusted CA, that it is valid (not expired, not revoked), and that it matches the domain being accessed. This prevents impersonation and phishing attacks (though phishing sites can obtain valid certificates for their own domains).
          </p>
        </div>
        <p>
          HTTPS deployment requires careful configuration — the server must have a valid TLS certificate, support
          modern TLS versions (1.2, 1.3), use strong cipher suites, and enforce HTTPS through redirects and HSTS
          (HTTP Strict Transport Security). Misconfigured HTTPS (expired certificates, weak cipher suites, mixed
          content) creates security vulnerabilities and user-facing errors (browser warnings, broken functionality).
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The HTTPS connection begins with DNS resolution (the client resolves the domain name to an IP address),
          followed by the TCP handshake (three-way handshake to establish the connection), followed by the TLS
          handshake (key exchange, certificate validation, cipher suite negotiation), followed by the HTTP request
          and response over the encrypted TLS connection. For TLS 1.3, the total handshake requires two round-trips
          (one for TCP, one for TLS) before the first HTTP request can be sent. For TLS 1.2, it requires three
          round-trips (one for TCP, two for TLS).
        </p>
        <p>
          HTTP/2 is a major revision of HTTP that improves performance over HTTPS. HTTP/2 introduces multiplexing
          (multiple requests and responses can be sent simultaneously over a single connection), header compression
          (HPACK reduces header overhead), server push (the server can send resources before the client requests
          them — deprecated in HTTP/3), and binary framing (HTTP/2 is binary, not text-based like HTTP/1.1).
          HTTP/2 requires HTTPS — most browsers only support HTTP/2 over TLS, so enabling HTTP/2 requires a valid
          TLS certificate and proper TLS configuration.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/https-diagram-1.svg"
          alt="HTTPS architecture comparing HTTP (insecure) vs HTTPS (secure) with TLS layer encryption"
          caption="HTTPS architecture: HTTP runs over an encrypted TLS tunnel. The TLS layer encrypts all HTTP headers, cookies, and body content, providing confidentiality, integrity, and authentication."
        />
        <p>
          HTTP/3 is the next generation of HTTP, built on top of QUIC (Quick UDP Internet Connections) — a
          transport protocol developed by Google that runs over UDP instead of TCP. HTTP/3 solves the head-of-line
          blocking problem in HTTP/2 (where a lost TCP packet blocks all multiplexed streams) by using QUIC&apos;s
          independent stream multiplexing. HTTP/3 also integrates TLS 1.3 directly into the QUIC handshake,
          reducing the total connection establishment to one round-trip (0-RTT for repeat connections). HTTP/3 is
          emerging as the standard for mobile and CDN-delivered content, where network conditions are variable and
          latency is critical.
        </p>
        <p>
          HSTS (HTTP Strict Transport Security) is an HTTP response header (Strict-Transport-Security) that
          instructs browsers to always use HTTPS for the domain. When a browser receives an HSTS header, it
          remembers the directive and automatically upgrades all future HTTP requests to HTTPS, even if the user
          types &quot;http://&quot; or clicks an HTTP link. HSTS prevents SSL stripping attacks — where an attacker intercepts
          the initial HTTP request and prevents the upgrade to HTTPS. HSTS should be configured with a max-age of
          at least 31536000 (one year) and includeSubDomains to protect all subdomains.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/https-diagram-2.svg"
          alt="HTTPS request lifecycle showing DNS resolution, TCP handshake, TLS handshake, HTTP request and encrypted response"
          caption="HTTPS request lifecycle: DNS resolution → TCP handshake → TLS 1.3 handshake (1 RTT) → encrypted HTTP request/response. Subsequent requests benefit from session resumption and HTTP/2 multiplexing."
        />
        <p>
          Mixed content is a common HTTPS deployment issue — when an HTTPS page loads HTTP resources (images,
          scripts, stylesheets), the page is considered to have mixed content. Browsers block mixed active content
          (scripts, iframes) and warn about mixed passive content (images, stylesheets). Mixed content undermines
          the security of HTTPS — an attacker can modify the HTTP resources to inject malicious content into the
          HTTPS page. The fix is to ensure all resources are loaded over HTTPS — update all resource URLs to use
          https:// or protocol-relative URLs (//example.com/resource).
        </p>
        <p>
          Certificate management is the operational practice of obtaining, installing, and renewing TLS certificates
          for HTTPS. Certificates have a limited validity period (90 days for Let&apos;s Encrypt, up to 398 days for
          commercial CAs), and they must be renewed before expiration. Certificate management should be automated
          using the ACME protocol (certbot, cert-manager) — certificates are obtained, installed, and renewed
          automatically. Manual certificate management leads to expired certificates and service outages.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The HTTPS architecture consists of the TLS library (OpenSSL, BoringSSL, LibreSSL, rustls) that implements
          the TLS protocol, the certificate store (which holds the server&apos;s TLS certificate and private key), and
          the HTTP server (Nginx, Apache, Envoy) that serves HTTP requests over the TLS connection. The TLS library
          handles the TLS handshake, encryption, and decryption. The certificate store provides the server&apos;s
          certificate and private key for the TLS handshake. The HTTP server serves HTTP requests over the encrypted
          TLS connection.
        </p>
        <p>
          The HTTPS request flow begins with the client resolving the domain name to an IP address (DNS resolution),
          establishing a TCP connection (three-way handshake), performing the TLS handshake (key exchange,
          certificate validation, cipher suite negotiation), sending the HTTP request over the encrypted TLS
          connection, and receiving the HTTP response over the encrypted TLS connection. For TLS 1.3, the total
          handshake requires two round-trips (one for TCP, one for TLS). For HTTP/2, multiple requests can be
          multiplexed over the same connection, reducing the per-request overhead.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/https-diagram-3.svg"
          alt="HTTPS security properties showing confidentiality, integrity, authentication, and attacks prevented"
          caption="HTTPS protects confidentiality (encryption), integrity (tamper detection), and authentication (server identity). It prevents eavesdropping, MITM attacks, and content injection, but does not protect against server-side breaches, client-side malware, or phishing."
        />
        <p>
          TLS termination is the practice of decrypting TLS traffic at a specific point in the network — typically
          at a load balancer, reverse proxy, or CDN edge server. The terminating server decrypts the traffic and
          forwards it to the backend servers over HTTP (unencrypted) or mTLS (encrypted). TLS termination at the
          edge simplifies backend server configuration (backends do not need TLS certificates) and enables the edge
          to inspect and route traffic based on HTTP headers. However, traffic between the edge and the backend is
          unencrypted (unless mTLS is used), which may be unacceptable for high-security environments.
        </p>
        <p>
          End-to-end TLS is the practice of encrypting traffic all the way from the client to the backend server —
          the edge server terminates the client&apos;s TLS connection and establishes a new TLS connection to the backend
          server. This ensures that traffic is encrypted at all points in the network — between the client and the
          edge, and between the edge and the backend. End-to-end TLS requires the backend server to have a valid TLS
          certificate (which can be an internal CA certificate, not necessarily a public CA certificate).
        </p>
        <p>
          HTTPS migration is the process of transitioning a website or API from HTTP to HTTPS. The migration
          involves obtaining a TLS certificate, configuring the server for HTTPS (port 443), redirecting HTTP
          requests to HTTPS (301 permanent redirect), enabling HSTS, and fixing mixed content issues. The migration
          should be done gradually — first, obtain and install the certificate, then enable HTTPS alongside HTTP,
          then redirect HTTP to HTTPS, then enable HSTS, and finally submit to the HSTS preload list. This ensures
          that the migration is reversible at each step and that users are not disrupted.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          TLS termination at the edge versus end-to-end TLS is a trade-off between operational simplicity and
          security. TLS termination at the edge (load balancer, CDN) simplifies backend server configuration —
          backends do not need TLS certificates, and the edge can inspect and route traffic based on HTTP headers.
          However, traffic between the edge and the backend is unencrypted (unless mTLS is used), which may be
          unacceptable for high-security environments. End-to-end TLS ensures that traffic is encrypted at all
          points in the network, but requires each backend server to have a TLS certificate (which can be an
          internal CA certificate).
        </p>
        <p>
          HTTP/2 versus HTTP/1.1 is a trade-off between performance and complexity. HTTP/2 provides multiplexing
          (multiple requests over a single connection), header compression (HPACK), and server push — significantly
          improving performance for HTTPS sites with many resources. However, HTTP/2 requires more server resources
          (connection state for multiplexing) and is more complex to configure. HTTP/1.1 is simpler and uses fewer
          server resources, but requires multiple connections for parallel requests (connection pooling), which
          increases overhead.
        </p>
        <p>
          HTTP/3 versus HTTP/2 is a trade-off between performance on lossy networks and compatibility. HTTP/3
          (over QUIC) solves head-of-line blocking and provides faster connection establishment (0-RTT for repeat
          connections), making it ideal for mobile networks and high-latency environments. However, HTTP/3 is not
          yet universally supported — some load balancers, proxies, and firewalls do not support QUIC (UDP-based),
          and some corporate networks block UDP traffic. HTTP/2 (over TCP) is universally supported and should be
          the baseline, with HTTP/3 as an optional enhancement for environments that support it.
        </p>
        <p>
          Public CA certificates versus internal CA certificates is a trade-off between trust and control. Public CA
          certificates (Let&apos;s Encrypt, DigiCert) are trusted by all browsers and operating systems — no configuration
          is needed for clients to trust them. Internal CA certificates (self-signed or enterprise CA) are not
          trusted by browsers by default — the internal CA certificate must be installed on all clients (or the
          browser must be configured to trust it). Public CA certificates are preferred for client-facing sites,
          while internal CA certificates are acceptable for internal services where clients can be configured to
          trust the internal CA.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use TLS 1.3 exclusively, with TLS 1.2 as a fallback for compatibility. Disable TLS 1.0 and 1.1 — they
          have known vulnerabilities and are deprecated by all major browsers. Use strong cipher suites
          (TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256) and disable all insecure cipher suites (RC4, 3DES,
          CBC-mode ciphers).
        </p>
        <p>
          Enable HTTP/2 for all HTTPS sites — HTTP/2 provides significant performance improvements (multiplexing,
          header compression) with minimal configuration overhead. Most modern servers (Nginx, Apache, Envoy)
          support HTTP/2 out of the box. Enable HTTP/3 if your infrastructure supports it (QUIC/UDP) — it provides
          additional performance improvements on mobile and high-latency networks.
        </p>
        <p>
          Enable HSTS with a max-age of at least 31536000 (one year) and includeSubDomains. Submit your domain to
          the HSTS preload list for maximum protection — this ensures that browsers always use HTTPS for your
          domain, even on the first visit (before receiving the HSTS header). HSTS prevents SSL stripping attacks
          and ensures that all communication is encrypted.
        </p>
        <p>
          Automate certificate management using the ACME protocol (Let&apos;s Encrypt, certbot, cert-manager). Certificates
          should be obtained, installed, and renewed automatically — manual certificate management leads to expired
          certificates and service outages. Set the certificate renewal to occur at least 30 days before expiration
          to provide a buffer for renewal failures.
        </p>
        <p>
          Fix all mixed content issues — ensure all resources (images, scripts, stylesheets, iframes) are loaded
          over HTTPS. Use protocol-relative URLs (//example.com/resource) or explicit HTTPS URLs (https://example.com/resource).
          Browsers block mixed active content (scripts, iframes) and warn about mixed passive content (images,
          stylesheets), which degrades the user experience and undermines HTTPS security.
        </p>
        <p>
          Monitor certificate expiration — set up alerts for certificates expiring within 30 days, 14 days, and 7
          days. Expired certificates cause service outages that are immediately visible to users (browser warnings,
          connection failures). Monitoring should cover all HTTPS-enabled services, including internal services,
          APIs, and load balancers.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Expired certificates causing service outages is the most common HTTPS operational failure. Certificates
          have a limited validity period, and if they are not renewed before expiration, TLS connections fail and
          users see browser warnings. The fix is to automate certificate management using the ACME protocol —
          certificates are obtained, installed, and renewed automatically. Additionally, monitor certificate
          expiration and alert on certificates expiring within 30 days.
        </p>
        <p>
          Mixed content undermining HTTPS security is a common deployment pitfall. When an HTTPS page loads HTTP
          resources, the page is considered to have mixed content, and an attacker can modify the HTTP resources to
          inject malicious content into the HTTPS page. The fix is to ensure all resources are loaded over HTTPS —
          update all resource URLs to use https:// or protocol-relative URLs, and use the browser&apos;s mixed content
          reporting tools to identify and fix issues.
        </p>
        <p>
          Not enabling HSTS is a common security pitfall. Without HSTS, an attacker can perform an SSL stripping
          attack — intercepting the initial HTTP request and preventing the upgrade to HTTPS, allowing the attacker
          to read and modify the traffic. The fix is to enable HSTS with a max-age of at least 31536000 and
          includeSubDomains, and submit to the HSTS preload list.
        </p>
        <p>
          Using weak cipher suites (RC4, 3DES, CBC-mode ciphers) is a common misconfiguration. Weak cipher suites
          have known vulnerabilities that allow attackers to decrypt traffic. The fix is to use only strong cipher
          suites (TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256) and disable all insecure cipher suites.
          Use Mozilla&apos;s SSL Configuration Generator as a starting point.
        </p>
        <p>
          Not redirecting HTTP to HTTPS is a common oversight. If the server serves both HTTP and HTTPS without
          redirecting HTTP to HTTPS, users who type &quot;http://&quot; or click HTTP links will connect over unencrypted HTTP.
          The fix is to configure the server to redirect all HTTP requests to HTTPS (301 permanent redirect) — this
          ensures that all communication is encrypted, even if the user initially requests HTTP.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses HTTPS with TLS 1.3, HTTP/2, and HSTS for all customer-facing
          communication — the website, API, and admin dashboard all run over HTTPS. The platform uses AWS
          Certificate Manager to manage TLS certificates, with automatic renewal and deployment. The platform
          enforces HSTS with a max-age of one year and includeSubDomains, and it monitors certificate expiration
          with alerts at 30, 14, and 7 days before expiration. The platform has achieved PCI-DSS compliance in part
          due to its HTTPS configuration.
        </p>
        <p>
          A financial services company uses end-to-end TLS for all internal communication — the load balancer
          terminates the client&apos;s TLS connection and establishes a new TLS connection to the backend server using
          an internal CA certificate. This ensures that traffic is encrypted at all points in the network — between
          the client and the load balancer, and between the load balancer and the backend server. The company uses
          HashiCorp Vault as its internal CA, issuing certificates to each backend server with a 24-hour validity
          period and automatic rotation.
        </p>
        <p>
          A SaaS platform uses HTTPS with HTTP/3 for its customer-facing API — the platform uses Cloudflare&apos;s CDN
          for TLS termination, HTTP/2 for most clients, and HTTP/3 for clients that support QUIC. The platform
          monitors HTTPS connections and alerts on connections using deprecated cipher suites or TLS versions. The
          platform has achieved SOC 2 compliance in part due to its HTTPS configuration and monitoring.
        </p>
        <p>
          A healthcare organization uses HTTPS with HSTS preloading for its patient portal — the platform is
          included in the HSTS preload list (built into browsers), ensuring that browsers always use HTTPS for the
          domain. The organization uses Let&apos;s Encrypt for certificate management, with certbot automating
          certificate renewal every 60 days (well before the 90-day expiration). The organization fixes all mixed
          content issues and monitors certificate expiration with alerts at 30, 14, and 7 days before expiration.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is HSTS, and why is it important for HTTPS?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              HSTS (HTTP Strict Transport Security) is an HTTP response header (Strict-Transport-Security) that instructs browsers to always use HTTPS for the domain. When a browser receives an HSTS header, it remembers the directive and automatically upgrades all future HTTP requests to HTTPS, even if the user types &quot;http://&quot; or clicks an HTTP link.
            </p>
            <p>
              HSTS is important because it prevents SSL stripping attacks — where an attacker intercepts the initial HTTP request and prevents the upgrade to HTTPS, allowing the attacker to read and modify the traffic. Without HSTS, the initial HTTP request is vulnerable. HSTS should be configured with a max-age of at least 31536000 (one year) and includeSubDomains to protect all subdomains.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the difference between HTTP/2 and HTTP/3?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              HTTP/2 runs over TCP and provides multiplexing (multiple requests over a single connection), header compression (HPACK), and server push. However, HTTP/2 suffers from head-of-line blocking — a lost TCP packet blocks all multiplexed streams until the packet is retransmitted.
            </p>
            <p>
              HTTP/3 runs over QUIC (UDP-based) and solves head-of-line blocking by using independent stream multiplexing — a lost packet in one stream does not block other streams. HTTP/3 also integrates TLS 1.3 directly into the QUIC handshake, reducing the total connection establishment to one round-trip (0-RTT for repeat connections). HTTP/3 is ideal for mobile networks and high-latency environments.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is mixed content, and how do you fix it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Mixed content occurs when an HTTPS page loads HTTP resources (images, scripts, stylesheets, iframes). The page is considered to have mixed content because some resources are loaded insecurely. Browsers block mixed active content (scripts, iframes) and warn about mixed passive content (images, stylesheets).
            </p>
            <p>
              The fix is to ensure all resources are loaded over HTTPS — update all resource URLs to use https:// or protocol-relative URLs (//example.com/resource). Use the browser&apos;s mixed content reporting tools (Content-Security-Policy: upgrade-insecure-requests) to identify and fix issues. Additionally, configure the server to redirect HTTP requests to HTTPS so that resources requested over HTTP are automatically upgraded.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is TLS termination, and where should it happen?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              TLS termination is the practice of decrypting TLS traffic at a specific point in the network — typically at a load balancer, reverse proxy, or CDN edge server. The terminating server decrypts the traffic and forwards it to the backend servers over HTTP (unencrypted) or mTLS (encrypted).
            </p>
            <p>
              TLS termination at the edge simplifies backend server configuration (backends do not need TLS certificates) and enables the edge to inspect and route traffic based on HTTP headers. However, traffic between the edge and the backend is unencrypted (unless mTLS is used). For high-security environments, use end-to-end TLS — the edge terminates the client&apos;s TLS connection and establishes a new TLS connection to the backend server, ensuring that traffic is encrypted at all points in the network.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you migrate from HTTP to HTTPS without disrupting users?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Migrate gradually: (1) Obtain and install a TLS certificate. (2) Enable HTTPS alongside HTTP — serve the same content over both HTTP and HTTPS. (3) Redirect HTTP requests to HTTPS (301 permanent redirect). (4) Enable HSTS with a max-age of at least 31536000 and includeSubDomains. (5) Fix all mixed content issues. (6) Submit to the HSTS preload list.
            </p>
            <p>
              This approach ensures that the migration is reversible at each step and that users are not disrupted. Monitor for errors (expired certificates, mixed content warnings, broken functionality) during each step and rollback if necessary. After the migration is complete, monitor certificate expiration and alert on certificates expiring within 30 days.
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
            <a href="https://datatracker.ietf.org/doc/html/rfc7540" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 7540: HTTP/2
            </a> — The HTTP/2 specification.
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc9114" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 9114: HTTP/3
            </a> — The HTTP/3 specification over QUIC.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: HSTS Header
            </a> — HSTS configuration and preload list.
          </li>
          <li>
            <a href="https://wiki.mozilla.org/Security/Server_Side_TLS" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Mozilla SSL Configuration Generator
            </a> — Recommended TLS and HTTPS configurations.
          </li>
          <li>
            <a href="https://letsencrypt.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Let's Encrypt
            </a> — Free, automated TLS certificates.
          </li>
          <li>
            <a href="https://developers.google.com/web/fundamentals/performance/http2" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google: HTTP/2 Performance
            </a> — HTTP/2 benefits and implementation guide.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
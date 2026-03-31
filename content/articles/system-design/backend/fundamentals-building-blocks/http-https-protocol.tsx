"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-http-https-extensive",
  title: "HTTP/HTTPS Protocol",
  description: "Comprehensive guide to HTTP and HTTPS covering HTTP/1.1, HTTP/2, HTTP/3 evolution, TLS handshake, caching, security, and production trade-offs.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "http-https-protocol",
  version: "extensive",
  wordCount: 7500,
  readingTime: 30,
  lastUpdated: "2026-03-19",
  tags: ["backend", "http", "https", "protocols", "networking", "tls", "web"],
  relatedTopics: ["client-server-architecture", "request-response-lifecycle", "tcp-vs-udp", "serialization-formats", "rest-api-design"],
};

export default function HttpHttpsProtocolArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>HTTP (Hypertext Transfer Protocol)</strong> is the application-layer protocol that powers the World Wide Web and most modern APIs. It defines a standardized request-response model where clients send requests (method, URL, headers, optional body) and servers respond with status codes, headers, and optional body content. HTTP&apos;s simplicity and extensibility have made it the universal interface for web, mobile, and service-to-service communication.
        </p>
        <p>
          <strong>HTTPS</strong> is HTTP over TLS (Transport Layer Security). TLS encrypts traffic in transit, authenticates the server (and optionally the client), and ensures message integrity. HTTPS protects against eavesdropping, man-in-the-middle attacks, and credential theft. Since 2018, HTTPS has become the default for all web traffic—browsers mark HTTP sites as &quot;Not Secure,&quot; and search engines rank HTTPS sites higher.
        </p>
        <p>
          <strong>Why HTTP matters for backend engineers:</strong>
        </p>
        <ul>
          <li>
            <strong>Universal Protocol:</strong> HTTP is the lingua franca of distributed systems. Every backend engineer must understand HTTP semantics, status codes, headers, and connection management.
          </li>
          <li>
            <strong>Performance Impact:</strong> HTTP version selection (1.1 vs 2 vs 3), connection pooling, and caching strategies directly affect latency and throughput.
          </li>
          <li>
            <strong>Security Foundation:</strong> TLS configuration, certificate management, and security headers protect user data and prevent attacks.
          </li>
          <li>
            <strong>Operational Complexity:</strong> HTTP intermediaries (load balancers, CDNs, proxies) add caching, retry, and transformation logic that can cause subtle bugs.
          </li>
        </ul>
        <p>
          <strong>HTTP Evolution:</strong> HTTP has evolved significantly:
        </p>
        <ul>
          <li><strong>HTTP/0.9 (1991):</strong> Simple GET-only protocol, no headers.</li>
          <li><strong>HTTP/1.0 (1996):</strong> Added headers, status codes, methods (GET, POST, HEAD).</li>
          <li><strong>HTTP/1.1 (1997, revised 2014):</strong> Persistent connections, chunked transfer, caching headers, host header (virtual hosting). Still the most widely deployed version.</li>
          <li><strong>HTTP/2 (2015):</strong> Binary protocol, multiplexed streams, header compression, server push. Reduces latency for page loads with many resources.</li>
          <li><strong>HTTP/3 (2022):</strong> Runs over QUIC (UDP instead of TCP), eliminates head-of-line blocking, faster handshakes. Optimized for mobile and lossy networks.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: HTTP Is More Than Transport</h3>
          <p>
            HTTP is not just a data pipe—it&apos;s a semantic contract. Methods communicate intent (safe vs. unsafe, idempotent vs. non-idempotent). Status codes communicate outcomes (success, client error, server error). Headers control caching, content negotiation, and intermediary behavior. Understanding these semantics is essential for building robust, scalable APIs.
          </p>
        </div>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP Methods and Semantics</h3>
        <p>
          HTTP methods (verbs) communicate the client&apos;s intent. Each method has specific semantics regarding safety and idempotency:
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Safety</h4>
        <p>
          A <strong>safe</strong> method does not modify server state. Safe methods can be cached, prefetched, and retried without side effects.
        </p>
        <ul>
          <li><strong>GET:</strong> Retrieve a resource. Safe, idempotent, cacheable.</li>
          <li><strong>HEAD:</strong> Like GET but returns headers only. Safe, idempotent, cacheable.</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Idempotency</h4>
        <p>
          An <strong>idempotent</strong> method produces the same result regardless of how many times it&apos;s executed. Idempotent methods can be safely retried after timeouts.
        </p>
        <ul>
          <li><strong>PUT:</strong> Replace a resource. Idempotent (putting the same value twice has the same effect as once).</li>
          <li><strong>DELETE:</strong> Remove a resource. Idempotent (deleting an already-deleted resource has no additional effect).</li>
          <li><strong>GET, HEAD:</strong> Both safe and idempotent.</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Non-Idempotent Methods</h4>
        <p>
          These methods may have side effects and should not be retried without caution:
        </p>
        <ul>
          <li><strong>POST:</strong> Create a resource or trigger an action. Not idempotent (posting twice may create two resources).</li>
          <li><strong>PATCH:</strong> Partial update. Idempotency depends on implementation.</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Idempotency Keys</h4>
        <p>
          For non-idempotent operations (like payments), APIs use <strong>idempotency keys</strong>. The client generates a unique key (UUID) and includes it in the request header. The server stores the result keyed by this token and returns the same response for duplicate requests.
        </p>
        <p>
          <strong>Example:</strong> Stripe&apos;s API requires <code>Idempotency-Key</code> header for POST requests. If a network timeout occurs, the client retries with the same key—Stripe returns the original charge without creating a duplicate.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP Status Codes</h3>
        <p>
          Status codes communicate the result of a request. They&apos;re grouped by class:
        </p>

        <h4 className="mt-4 mb-2 font-semibold">2xx Success</h4>
        <ul>
          <li><strong>200 OK:</strong> Request succeeded, response body contains result.</li>
          <li><strong>201 Created:</strong> Resource created (response includes Location header).</li>
          <li><strong>204 No Content:</strong> Request succeeded, no body (common for DELETE).</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">3xx Redirection</h4>
        <ul>
          <li><strong>301 Moved Permanently:</strong> Resource has new permanent URL (cacheable).</li>
          <li><strong>302 Found:</strong> Temporary redirect (not cacheable by default).</li>
          <li><strong>304 Not Modified:</strong> Resource unchanged (conditional GET with ETag/If-None-Match).</li>
          <li><strong>307/308:</strong> Temporary/permanent redirect that preserves method (unlike 301/302 which may change POST to GET).</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">4xx Client Error</h4>
        <ul>
          <li><strong>400 Bad Request:</strong> Malformed request syntax.</li>
          <li><strong>401 Unauthorized:</strong> Authentication required (invalid or missing credentials).</li>
          <li><strong>403 Forbidden:</strong> Authenticated but not authorized.</li>
          <li><strong>404 Not Found:</strong> Resource doesn&apos;t exist.</li>
          <li><strong>409 Conflict:</strong> Request conflicts with current state (e.g., version mismatch).</li>
          <li><strong>422 Unprocessable Entity:</strong> Valid syntax but semantic errors (validation failures).</li>
          <li><strong>429 Too Many Requests:</strong> Rate limited (includes Retry-After header).</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">5xx Server Error</h4>
        <ul>
          <li><strong>500 Internal Server Error:</strong> Generic server error.</li>
          <li><strong>502 Bad Gateway:</strong> Upstream server returned invalid response.</li>
          <li><strong>503 Service Unavailable:</strong> Server overloaded or down for maintenance.</li>
          <li><strong>504 Gateway Timeout:</strong> Upstream server didn&apos;t respond in time.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP Headers</h3>
        <p>
          Headers carry metadata about the request/response. Key categories:
        </p>

        <h4 className="mt-4 mb-2 font-semibold">General Headers</h4>
        <ul>
          <li><strong>Connection:</strong> Control persistent connections (keep-alive, close).</li>
          <li><strong>Date:</strong> Timestamp when message was generated.</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Request Headers</h4>
        <ul>
          <li><strong>Accept:</strong> Content types the client can handle (e.g., <code>application/json</code>).</li>
          <li><strong>Accept-Encoding:</strong> Compression algorithms (gzip, br, deflate).</li>
          <li><strong>Authorization:</strong> Credentials (Bearer token, Basic auth).</li>
          <li><strong>Content-Type:</strong> Media type of request body.</li>
          <li><strong>If-None-Match:</strong> For conditional requests (ETag validation).</li>
          <li><strong>User-Agent:</strong> Client identification.</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Response Headers</h4>
        <ul>
          <li><strong>Cache-Control:</strong> Caching directives (max-age, no-store, private).</li>
          <li><strong>Content-Length:</strong> Size of response body.</li>
          <li><strong>Content-Type:</strong> Media type of response body.</li>
          <li><strong>ETag:</strong> Entity tag for cache validation.</li>
          <li><strong>Location:</strong> Redirect target URL.</li>
          <li><strong>Retry-After:</strong> When to retry (for 429, 503).</li>
          <li><strong>Set-Cookie:</strong> Cookie to store on client.</li>
          <li><strong>Vary:</strong> Headers that affect cache key (e.g., <code>Vary: Accept-Encoding</code>).</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Security Headers</h4>
        <ul>
          <li><strong>Strict-Transport-Security (HSTS):</strong> Force HTTPS for future requests.</li>
          <li><strong>Content-Security-Policy (CSP):</strong> Restrict resource loading (prevent XSS).</li>
          <li><strong>X-Content-Type-Options: nosniff:</strong> Prevent MIME-type sniffing.</li>
          <li><strong>X-Frame-Options:</strong> Prevent clickjacking (deny embedding).</li>
          <li><strong>X-XSS-Protection:</strong> Enable browser XSS filter (legacy, use CSP instead).</li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/ajax-request-response.svg"
          alt="HTTP Request-Response Flow"
          caption="HTTP Request-Response Cycle: Client sends request with method, URL, headers, body. Server responds with status, headers, body. Intermediaries (proxies, CDNs, load balancers) may cache, transform, or route."
        />
      </section>

      <section>
        <h2>HTTP Version Comparison</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Feature</th>
              <th className="p-3 text-left">HTTP/1.1</th>
              <th className="p-3 text-left">HTTP/2</th>
              <th className="p-3 text-left">HTTP/3 (QUIC)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Transport</strong></td>
              <td className="p-3">TCP</td>
              <td className="p-3">TCP</td>
              <td className="p-3">QUIC (UDP)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Protocol Format</strong></td>
              <td className="p-3">Text-based (human-readable)</td>
              <td className="p-3">Binary (framed)</td>
              <td className="p-3">Binary (QUIC frames)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Multiplexing</strong></td>
              <td className="p-3">No (one request per connection at a time)</td>
              <td className="p-3">Yes (multiple streams per connection)</td>
              <td className="p-3">Yes (independent streams)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Head-of-Line Blocking</strong></td>
              <td className="p-3">Yes (at application layer)</td>
              <td className="p-3">Yes (at TCP transport layer)</td>
              <td className="p-3">No (streams are independent)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Header Compression</strong></td>
              <td className="p-3">No</td>
              <td className="p-3">Yes (HPACK)</td>
              <td className="p-3">Yes (QPACK)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Server Push</strong></td>
              <td className="p-3">No</td>
              <td className="p-3">Yes (push resources proactively)</td>
              <td className="p-3">Yes (but deprecated)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Handshake</strong></td>
              <td className="p-3">TCP handshake + optional TLS (2-3 RTT)</td>
              <td className="p-3">TCP + TLS 1.3 (1-2 RTT)</td>
              <td className="p-3">QUIC + TLS 1.3 (0-1 RTT for returning clients)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Connection Migration</strong></td>
              <td className="p-3">No (connection tied to IP/port)</td>
              <td className="p-3">No</td>
              <td className="p-3">Yes (connection ID survives IP changes)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Encryption</strong></td>
              <td className="p-3">Optional (HTTPS)</td>
              <td className="p-3">De facto mandatory (all major browsers require TLS)</td>
              <td className="p-3">Mandatory (QUIC always encrypted)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Adoption</strong></td>
              <td className="p-3">~95% of websites (backward compatibility)</td>
              <td className="p-3">~50% of websites (growing)</td>
              <td className="p-3">~25% of websites (emerging)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP/1.1: The Workhorse</h3>
        <p>
          HTTP/1.1 remains the most widely deployed version despite its age. Key features:
        </p>
        <ul>
          <li><strong>Persistent Connections:</strong> Keep-Alive allows multiple requests over one TCP connection (reduces handshake overhead).</li>
          <li><strong>Chunked Transfer:</strong> Stream response body in chunks (useful for large files).</li>
          <li><strong>Host Header:</strong> Enables virtual hosting (multiple domains on one IP).</li>
          <li><strong>Caching Headers:</strong> Comprehensive cache control (Cache-Control, ETag, Last-Modified).</li>
        </ul>
        <p>
          <strong>Limitations:</strong>
        </p>
        <ul>
          <li><strong>Head-of-Line Blocking:</strong> Only one request can be outstanding per connection at a time. Multiple connections (6-8 per browser) are needed for parallelism.</li>
          <li><strong>Text Protocol Overhead:</strong> Verbose headers repeated for each request.</li>
          <li><strong>No Server Push:</strong> Server cannot proactively send resources.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP/2: Multiplexing and Efficiency</h3>
        <p>
          HTTP/2 addresses HTTP/1.1&apos;s performance limitations:
        </p>
        <ul>
          <li><strong>Binary Protocol:</strong> More efficient parsing, compact framing.</li>
          <li><strong>Multiplexed Streams:</strong> Multiple requests/responses can be in flight simultaneously over one connection. Each stream is independent.</li>
          <li><strong>Header Compression (HPACK):</strong> Headers are compressed, reducing overhead for repetitive requests.</li>
          <li><strong>Server Push:</strong> Server can proactively push resources (e.g., CSS, JS) before the client requests them.</li>
          <li><strong>Stream Prioritization:</strong> Client can indicate which resources are more important.</li>
        </ul>
        <p>
          <strong>Limitations:</strong>
        </p>
        <ul>
          <li><strong>TCP Head-of-Line Blocking:</strong> While HTTP/2 multiplexes at the application layer, TCP still delivers bytes in order. If one packet is lost, all streams are blocked waiting for retransmission.</li>
          <li><strong>Server Push Complexity:</strong> Difficult to implement correctly; often pushes resources the client already has. Deprecated in HTTP/3.</li>
        </ul>
        <p>
          <strong>Real-World Impact:</strong> Google reports 10-15% faster page loads with HTTP/2 vs HTTP/1.1, primarily due to reduced connection overhead and better multiplexing.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP/3: QUIC and the End of HOL Blocking</h3>
        <p>
          HTTP/3 runs over QUIC (Quick UDP Internet Connections), a transport protocol developed by Google and standardized by IETF. QUIC addresses TCP&apos;s limitations:
        </p>
        <ul>
          <li><strong>UDP-Based:</strong> QUIC runs over UDP, avoiding TCP&apos;s strict ordering and congestion control.</li>
          <li><strong>No Transport HOL Blocking:</strong> Each stream is independent—loss on stream A doesn&apos;t block streams B, C, D.</li>
          <li><strong>0-RTT Handshake:</strong> Returning clients can send data in the first packet (vs TCP&apos;s 1-RTT minimum).</li>
          <li><strong>Connection Migration:</strong> Connection is identified by ID, not IP/port. Survives WiFi-to-cellular handoff without re-handshake.</li>
          <li><strong>Built-in Encryption:</strong> TLS 1.3 is integrated into QUIC—no separate handshake.</li>
        </ul>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li><strong>Complexity:</strong> QUIC is implemented in userspace, adding complexity.</li>
          <li><strong>Debugging:</strong> Encrypted headers make packet inspection harder (requires special tools).</li>
          <li><strong>Firewall Compatibility:</strong> Some firewalls block unknown UDP protocols.</li>
        </ul>
        <p>
          <strong>Real-World Impact:</strong> Google reports 3-15% faster page loads with HTTP/3, with larger gains on mobile/lossy networks. Cloudflare reports HTTP/3 reduces connection errors by 30%+ on mobile.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/http-pipelining.svg"
          alt="HTTP Version Evolution"
          caption="HTTP Evolution: HTTP/1.1 (sequential requests), HTTP/2 (multiplexed streams over TCP), HTTP/3 (independent streams over QUIC/UDP). Each version reduces latency and improves concurrency."
        />
      </section>

      <section>
        <h2>TLS and HTTPS</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TLS Handshake</h3>
        <p>
          TLS establishes an encrypted channel between client and server. The handshake authenticates the server, negotiates cipher suites, and derives session keys:
        </p>

        <h4 className="mt-4 mb-2 font-semibold">TLS 1.2 Handshake (Legacy)</h4>
        <ol className="space-y-2">
          <li><strong>Client Hello:</strong> Client sends supported cipher suites, random bytes.</li>
          <li><strong>Server Hello:</strong> Server selects cipher suite, sends certificate, random bytes.</li>
          <li><strong>Key Exchange:</strong> Client verifies certificate, generates pre-master secret, encrypts with server&apos;s public key.</li>
          <li><strong>Finished:</strong> Both sides derive session keys, send Finished messages.</li>
        </ol>
        <p><strong>Latency:</strong> 2 RTT minimum (TCP handshake + TLS handshake).</p>

        <h4 className="mt-4 mb-2 font-semibold">TLS 1.3 Handshake (Modern)</h4>
        <ol className="space-y-2">
          <li><strong>Client Hello:</strong> Client sends supported cipher suites, key share (Diffie-Hellman public key).</li>
          <li><strong>Server Hello:</strong> Server selects cipher suite, sends key share, certificate, Finished.</li>
          <li><strong>Client Finished:</strong> Client sends Finished.</li>
        </ol>
        <p><strong>Latency:</strong> 1 RTT (combined with TCP handshake). 0-RTT for returning clients.</p>

        <h4 className="mt-4 mb-2 font-semibold">0-RTT (Zero Round-Trip Time)</h4>
        <p>
          TLS 1.3 supports 0-RTT for returning clients. The client can send application data in the first flight (along with Client Hello). This reduces latency but has a caveat: 0-RTT data is not protected against replay attacks. Use only for idempotent requests (GET, not POST).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Certificate Management</h3>
        <p>
          TLS certificates authenticate the server. Key operational concerns:
        </p>
        <ul>
          <li><strong>Certificate Expiry:</strong> Certificates have validity periods (typically 90 days for Let&apos;s Encrypt, 1 year for commercial CAs). Expired certificates cause immediate outages.</li>
          <li><strong>Certificate Chain:</strong> Servers must send the full chain (leaf + intermediate certificates). Missing intermediates cause &quot;unknown issuer&quot; errors.</li>
          <li><strong>Subject Alternative Names (SAN):</strong> Certificates must cover all domains (example.com, www.example.com, *.example.com).</li>
          <li><strong>Automation:</strong> Use ACME protocol (Let&apos;s Encrypt) or certificate management services (AWS ACM, Cloudflare) for automatic renewal.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TLS Termination</h3>
        <p>
          TLS can be terminated at different layers:
        </p>
        <ul>
          <li><strong>Edge Termination:</strong> CDN or load balancer decrypts traffic, forwards unencrypted to backend. Simpler backend, but internal traffic is exposed.</li>
          <li><strong>End-to-End TLS:</strong> Traffic remains encrypted to the backend. Backend needs certificate management.</li>
          <li><strong>mTLS (Mutual TLS):</strong> Both client and server authenticate with certificates. Used for service-to-service auth in zero-trust architectures.</li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/tls-1-3-handshake.svg"
          alt="TLS 1.3 Handshake Flow"
          caption="TLS 1.3 Handshake: Reduced from 2 RTT (TLS 1.2) to 1 RTT. Client and Server exchange key shares, derive session keys. 0-RTT available for returning clients."
        />
      </section>

      <section>
        <h2>Caching and Conditional Requests</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache-Control Directives</h3>
        <p>
          The <code>Cache-Control</code> header controls caching behavior:
        </p>
        <ul>
          <li><strong>max-age=N:</strong> Cache for N seconds.</li>
          <li><strong>no-store:</strong> Do not cache (sensitive data).</li>
          <li><strong>no-cache:</strong> Cache but revalidate before use.</li>
          <li><strong>private:</strong> Cache only in browser (not shared caches).</li>
          <li><strong>public:</strong> Cache in shared caches (CDNs).</li>
          <li><strong>s-maxage=N:</strong> Override max-age for shared caches.</li>
          <li><strong>stale-while-revalidate=N:</strong> Serve stale content for N seconds while revalidating in background.</li>
          <li><strong>stale-if-error=N:</strong> Serve stale content if origin returns error.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Conditional Requests</h3>
        <p>
          Conditional requests allow clients to validate cached content without downloading the full response:
        </p>
        <ul>
          <li><strong>ETag / If-None-Match:</strong> Server sends ETag (hash of content). Client sends <code>If-None-Match: &quot;etag-value&quot;</code>. If content unchanged, server returns 304 Not Modified (no body).</li>
          <li><strong>Last-Modified / If-Modified-Since:</strong> Server sends last modification timestamp. Client sends <code>If-Modified-Since</code>. If unchanged, 304 returned.</li>
        </ul>
        <p>
          <strong>Benefit:</strong> 304 responses are small (headers only), saving bandwidth and latency.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Vary Header</h3>
        <p>
          The <code>Vary</code> header tells caches which request headers affect the response. This is critical for correct caching:
        </p>
        <ul>
          <li><code>Vary: Accept-Encoding</code> — Different responses for gzip vs. uncompressed.</li>
          <li><code>Vary: Accept-Language</code> — Different responses for different languages.</li>
          <li><code>Vary: Authorization</code> — Different responses for authenticated vs. anonymous users (critical for security!).</li>
        </ul>
        <p>
          <strong>Common Bug:</strong> Caching authenticated responses without <code>Vary: Authorization</code> causes user A to see user B&apos;s data.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Caching Strategies by Content Type</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Content Type</th>
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">Example Headers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Static Assets (JS, CSS, images)</td>
              <td className="p-3">Long-term cache with versioning</td>
              <td className="p-3"><code>Cache-Control: public, max-age=31536000, immutable</code></td>
            </tr>
            <tr>
              <td className="p-3">HTML Pages</td>
              <td className="p-3">Short cache or no-cache</td>
              <td className="p-3"><code>Cache-Control: no-cache</code> or <code>max-age=60</code></td>
            </tr>
            <tr>
              <td className="p-3">API Responses (public)</td>
              <td className="p-3">Short cache with stale-while-revalidate</td>
              <td className="p-3"><code>Cache-Control: public, max-age=60, stale-while-revalidate=300</code></td>
            </tr>
            <tr>
              <td className="p-3">API Responses (authenticated)</td>
              <td className="p-3">Private cache or no-store</td>
              <td className="p-3"><code>Cache-Control: private, no-store</code></td>
            </tr>
            <tr>
              <td className="p-3">Sensitive Data</td>
              <td className="p-3">No caching</td>
              <td className="p-3"><code>Cache-Control: no-store, must-revalidate</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Connection Management</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Keep-Alive and Connection Pooling</h3>
        <p>
          HTTP/1.1 introduced persistent connections (Keep-Alive), allowing multiple requests over one TCP connection. This reduces handshake overhead but requires careful management:
        </p>
        <ul>
          <li><strong>Client-Side Pooling:</strong> HTTP clients (curl, axios, HttpClient) maintain connection pools. Configure pool size, idle timeout, and max lifetime.</li>
          <li><strong>Server-Side Limits:</strong> Servers limit concurrent connections per client. Excessive connections may be rejected.</li>
          <li><strong>Idle Timeout:</strong> Connections are closed after inactivity (typically 60-120 seconds). Clients must handle reconnection.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Timeouts</h3>
        <p>
          Timeouts must be configured at every layer to prevent hanging requests:
        </p>
        <ul>
          <li><strong>Connect Timeout:</strong> Time to establish TCP connection (5-10 seconds).</li>
          <li><strong>Read Timeout:</strong> Time to wait for response data (10-30 seconds).</li>
          <li><strong>Write Timeout:</strong> Time to send request body (5-10 seconds).</li>
          <li><strong>Idle Timeout:</strong> Time before idle connection is closed (60-120 seconds).</li>
        </ul>
        <p>
          <strong>Best Practice:</strong> Align timeouts across layers. If client timeout is 30s but server timeout is 60s, client may retry while server is still processing—causing duplicate work.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Retries and Backoff</h3>
        <p>
          Retries improve reliability but can amplify failures:
        </p>
        <ul>
          <li><strong>Retry Safe Methods:</strong> GET, HEAD can be retried freely.</li>
          <li><strong>Retry Idempotent Methods:</strong> PUT, DELETE can be retried with caution.</li>
          <li><strong>Retry POST with Idempotency Keys:</strong> Include idempotency key to prevent duplicates.</li>
          <li><strong>Exponential Backoff:</strong> Wait 1s, 2s, 4s, 8s between retries.</li>
          <li><strong>Add Jitter:</strong> Randomize backoff to prevent thundering herd.</li>
          <li><strong>Retry Budget:</strong> Limit retries to 10-20% of total requests.</li>
        </ul>
        <p>
          <strong>When NOT to Retry:</strong>
        </p>
        <ul>
          <li>4xx client errors (except 408, 425, 429, 499).</li>
          <li>Non-idempotent POST without idempotency key.</li>
          <li>When circuit breaker is open.</li>
        </ul>
      </section>

      <section>
        <h2>Intermediaries: Proxies, Load Balancers, CDNs</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Forwarded Headers</h3>
        <p>
          When traffic passes through proxies/load balancers, the original client information is preserved in headers:
        </p>
        <ul>
          <li><strong>X-Forwarded-For:</strong> Original client IP (may be spoofed—trust only from known proxies).</li>
          <li><strong>X-Forwarded-Proto:</strong> Original protocol (http or https).</li>
          <li><strong>X-Forwarded-Host:</strong> Original Host header.</li>
          <li><strong>X-Real-IP:</strong> Single client IP (alternative to X-Forwarded-For).</li>
        </ul>
        <p>
          <strong>Security:</strong> Never trust these headers from untrusted sources. Configure load balancers to strip incoming forwarded headers and set their own.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CDN Caching</h3>
        <p>
          CDNs cache content at edge locations, reducing latency and origin load:
        </p>
        <ul>
          <li><strong>Cache Key:</strong> URL + query params + Vary headers.</li>
          <li><strong>Cache Hit:</strong> CDN serves cached response (fast, no origin request).</li>
          <li><strong>Cache Miss:</strong> CDN fetches from origin, caches, then serves.</li>
          <li><strong>Purge:</strong> Invalidate cached content (by URL, tag, or all).</li>
        </ul>
        <p>
          <strong>Best Practices:</strong>
        </p>
        <ul>
          <li>Use long cache TTLs for static assets with versioned URLs.</li>
          <li>Use stale-while-revalidate for dynamic content.</li>
          <li>Purge cache on content updates.</li>
          <li>Monitor cache hit ratio (target 80-95% for static content).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Load Balancer Considerations</h3>
        <ul>
          <li><strong>Health Checks:</strong> LB probes backend health. Configure appropriate thresholds.</li>
          <li><strong>Sticky Sessions:</strong> Route same client to same backend (needed for in-memory sessions).</li>
          <li><strong>SSL Termination:</strong> LB decrypts traffic, forwards to backend.</li>
          <li><strong>Request/Response Size Limits:</strong> LB may reject large payloads.</li>
          <li><strong>Timeout Configuration:</strong> LB timeout should be longer than backend timeout.</li>
        </ul>
      </section>

      <section>
        <h2>Security Beyond TLS</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Authentication and Authorization</h3>
        <ul>
          <li><strong>Bearer Tokens:</strong> JWT or opaque tokens in Authorization header (<code>Bearer &lt;token&gt;</code>).</li>
          <li><strong>API Keys:</strong> Simple key in header (<code>X-API-Key</code>) or query param.</li>
          <li><strong>OAuth 2.0:</strong> Delegated authorization with scopes.</li>
          <li><strong>mTLS:</strong> Client certificates for service-to-service auth.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rate Limiting</h3>
        <p>
          Protect APIs from abuse with rate limiting:
        </p>
        <ul>
          <li><strong>Token Bucket:</strong> Allow N requests per second, with burst capacity.</li>
          <li><strong>Leaky Bucket:</strong> Smooth out bursts, constant rate.</li>
          <li><strong>Sliding Window:</strong> Count requests in rolling time window.</li>
        </ul>
        <p>
          <strong>Response:</strong> Return 429 Too Many Requests with <code>Retry-After</code> header.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Headers Checklist</h3>
        <ul>
          <li><strong>Strict-Transport-Security:</strong> <code>max-age=31536000; includeSubDomains; preload</code></li>
          <li><strong>Content-Security-Policy:</strong> Restrict script, style, image sources.</li>
          <li><strong>X-Content-Type-Options:</strong> <code>nosniff</code></li>
          <li><strong>X-Frame-Options:</strong> <code>DENY</code> or <code>SAMEORIGIN</code></li>
          <li><strong>Referrer-Policy:</strong> <code>strict-origin-when-cross-origin</code></li>
          <li><strong>Permissions-Policy:</strong> Restrict browser features (camera, microphone, etc.).</li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. E-Commerce Website (HTTP/2 + CDN)</h3>
        <p>
          <strong>Requirements:</strong> Fast page loads, secure checkout, global audience.
        </p>
        <p>
          <strong>Architecture:</strong>
        </p>
        <ul>
          <li>HTTP/2 for multiplexed resource loading (CSS, JS, images).</li>
          <li>CDN caching for static assets (Cache-Control: max-age=31536000).</li>
          <li>TLS 1.3 for secure checkout.</li>
          <li>API Gateway with rate limiting for backend services.</li>
        </ul>
        <p>
          <strong>Results:</strong> 40% faster page loads vs HTTP/1.1, 99.9% uptime.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. Mobile App API (HTTP/3 for Emerging Markets)</h3>
        <p>
          <strong>Requirements:</strong> Low latency on unreliable networks, offline support.
        </p>
        <p>
          <strong>Architecture:</strong>
        </p>
        <ul>
          <li>HTTP/3 over QUIC for mobile clients (better performance on lossy networks).</li>
          <li>0-RTT for returning users (faster app startup).</li>
          <li>Connection migration survives network changes (WiFi to cellular).</li>
          <li>Offline-first with local caching, sync on reconnect.</li>
        </ul>
        <p>
          <strong>Results:</strong> 20% faster API calls in emerging markets (India, Brazil), 30% fewer connection errors.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Microservices Architecture (mTLS + HTTP/2)</h3>
        <p>
          <strong>Requirements:</strong> Service-to-service auth, low latency, observability.
        </p>
        <p>
          <strong>Architecture:</strong>
        </p>
        <ul>
          <li>mTLS for service authentication (zero-trust).</li>
          <li>HTTP/2 for efficient multiplexing.</li>
          <li>Service mesh (Istio/Linkerd) for traffic management.</li>
          <li>Distributed tracing with trace context propagation.</li>
        </ul>
        <p>
          <strong>Results:</strong> Secure service-to-service communication, 50% reduction in inter-service latency.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Real-Time Dashboard (Server-Sent Events over HTTP/2)</h3>
        <p>
          <strong>Requirements:</strong> Real-time updates, low latency, scalable.
        </p>
        <p>
          <strong>Architecture:</strong>
        </p>
        <ul>
          <li>Server-Sent Events (SSE) over HTTP/2 for push notifications.</li>
          <li>HTTP/2 multiplexing allows SSE + regular API calls on same connection.</li>
          <li>Long-lived connections with heartbeat keep-alive.</li>
        </ul>
        <p>
          <strong>Results:</strong> Sub-second updates, 10x fewer connections vs polling.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">5. File Upload Service (Chunked Transfer + Resumable Uploads)</h3>
        <p>
          <strong>Requirements:</strong> Large file uploads (GB+), resumable after failures.
        </p>
        <p>
          <strong>Architecture:</strong>
        </p>
        <ul>
          <li>Chunked transfer encoding for streaming uploads.</li>
          <li>TUS protocol for resumable uploads (upload offset tracking).</li>
          <li>Pre-signed URLs for direct-to-S3 uploads.</li>
        </ul>
        <p>
          <strong>Results:</strong> 99% upload success rate even on unstable connections.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">6. Public API (Rate Limiting + Caching)</h3>
        <p>
          <strong>Requirements:</strong> Protect backend from abuse, reduce load.
        </p>
        <p>
          <strong>Architecture:</strong>
        </p>
        <ul>
          <li>Rate limiting per API key (token bucket, 1000 req/hour free tier).</li>
          <li>CDN caching for public endpoints (Cache-Control: public, max-age=60).</li>
          <li>ETag/If-None-Match for conditional requests.</li>
        </ul>
        <p>
          <strong>Results:</strong> 80% cache hit ratio, 90% reduction in origin load.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>

        <ul className="space-y-3">
          <li>
            <strong>Missing Vary header:</strong> Caching authenticated responses without <code>Vary: Authorization</code> causes user A to see user B&apos;s data. <strong>Solution:</strong> Always include Vary for responses that vary by auth, language, or encoding.
          </li>
          <li>
            <strong>Misaligned timeouts:</strong> Client timeout (5s) shorter than server timeout (30s) causes client retries while server is still processing—duplicate work. <strong>Solution:</strong> Align timeouts across layers; client timeout should be longest.
          </li>
          <li>
            <strong>Retrying non-idempotent requests:</strong> Retrying POST without idempotency key creates duplicates. <strong>Solution:</strong> Use idempotency keys for POST, retry only safe/idempotent methods.
          </li>
          <li>
            <strong>Certificate expiry:</strong> Certificates expire unexpectedly, causing outages. <strong>Solution:</strong> Automate renewal (Let&apos;s Encrypt, AWS ACM), monitor expiry dates, set alerts 30 days before expiry.
          </li>
          <li>
            <strong>Trusting X-Forwarded-For:</strong> Accepting X-Forwarded-For from untrusted sources allows IP spoofing. <strong>Solution:</strong> Configure load balancer to strip incoming forwarded headers and set its own.
          </li>
          <li>
            <strong>Over-caching dynamic content:</strong> Caching personalized responses as public causes data leaks. <strong>Solution:</strong> Use <code>Cache-Control: private, no-store</code> for authenticated responses.
          </li>
          <li>
            <strong>Ignoring HTTP/2 prioritization:</strong> Not prioritizing critical resources (CSS, JS) delays page render. <strong>Solution:</strong> Use HTTP/2 stream prioritization or server push for critical assets.
          </li>
          <li>
            <strong>No retry budget:</strong> Unlimited retries during outages amplify load, causing cascade failures. <strong>Solution:</strong> Implement retry budgets (10-20% of total requests), circuit breakers.
          </li>
          <li>
            <strong>Large headers:</strong> Cookies or custom headers grow over time, exceeding server limits (typically 8-16KB). <strong>Solution:</strong> Monitor header sizes, prune unused cookies, use compression.
          </li>
          <li>
            <strong>Not monitoring HTTP metrics:</strong> Missing 4xx/5xx spikes, latency degradation. <strong>Solution:</strong> Monitor status codes by endpoint, p95/p99 latency, error rates, set alerts.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: Explain the difference between HTTP/1.1, HTTP/2, and HTTP/3. When would you choose each?</p>
            <p className="mt-2 text-sm">
              A: HTTP/1.1 is text-based, sequential (one request per connection at a time), requiring multiple connections for parallelism. HTTP/2 is binary, multiplexed (multiple streams per connection), reducing connection overhead. HTTP/3 runs over QUIC/UDP, eliminating TCP head-of-line blocking—loss on one stream doesn&apos;t block others. Choose HTTP/1.1 for maximum compatibility (legacy clients). HTTP/2 for modern web apps (best balance of performance and compatibility). HTTP/3 for mobile/global audiences (better on lossy networks, faster handshakes). Many services support all three, negotiating the best available version.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: What is head-of-line blocking? How does it affect HTTP/2, and how does HTTP/3 solve it?</p>
            <p className="mt-2 text-sm">
              A: Head-of-line (HOL) blocking occurs when packet N is lost, but packets N+1, N+2 arrive. The receiver buffers N+1, N+2 waiting for N&apos;s retransmission. In HTTP/2, multiple streams share one TCP connection. If one packet is lost, TCP buffers all subsequent packets—blocking all streams, even unrelated ones. HTTP/3 solves this by running over QUIC, which implements independent stream multiplexing at the transport layer. Loss on stream A doesn&apos;t block streams B, C, D—each stream has its own sequencing and retransmission.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: How do you design a retry strategy for HTTP requests? What are the risks?</p>
            <p className="mt-2 text-sm">
              A: Retry strategy: (1) Only retry safe (GET, HEAD) or idempotent (PUT, DELETE) methods. (2) For POST, use idempotency keys. (3) Use exponential backoff with jitter (1s, 2s, 4s + randomization). (4) Set retry budget (10-20% of total requests). (5) Don&apos;t retry 4xx errors (except 408, 429, 499). (6) Use circuit breakers when downstream is unhealthy. Risks: Retry storms amplify load during outages, causing cascade failures. Duplicate creates from retrying non-idempotent requests. Mitigation: Idempotency keys, retry budgets, circuit breakers, monitoring retry rates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: Explain TLS handshake. What improvements did TLS 1.3 introduce?</p>
            <p className="mt-2 text-sm">
              A: TLS handshake establishes encrypted channel: client and server negotiate cipher suite, authenticate server (certificate), derive session keys. TLS 1.2: 2 RTT (Client Hello → Server Hello → Key Exchange → Finished). TLS 1.3: 1 RTT (Client Hello with key share → Server Hello with Finished). Improvements: (1) Faster handshake (1 RTT vs 2 RTT). (2) 0-RTT for returning clients (send data in first packet). (3) Removed weak ciphers (RC4, 3DES). (4) Forward secrecy by default. (5) Encrypted handshake (Server Hello is encrypted). Trade-off: 0-RTT is vulnerable to replay attacks—use only for idempotent requests.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: What caching headers would you use for (a) static assets, (b) HTML pages, (c) authenticated API responses?</p>
            <p className="mt-2 text-sm">
              A: (a) Static assets (versioned URLs): <code>Cache-Control: public, max-age=31536000, immutable</code>—cache for 1 year, no revalidation needed (URL changes on update). (b) HTML pages: <code>Cache-Control: no-cache</code> or <code>max-age=60</code>—revalidate frequently, content changes often. (c) Authenticated API responses: <code>Cache-Control: private, no-store</code>—do not cache shared, may contain sensitive data. Critical: Include <code>Vary: Authorization</code> to prevent cross-user cache leaks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: What is QUIC, and why does HTTP/3 use it instead of TCP?</p>
            <p className="mt-2 text-sm">
              A: QUIC is a transport protocol over UDP, developed by Google, standardized by IETF. HTTP/3 uses QUIC because: (1) No TCP head-of-line blocking—streams are independent at transport layer. (2) Faster handshakes—0-RTT for returning clients. (3) Connection migration—connection survives IP changes (WiFi to cellular) via connection ID. (4) Built-in encryption—TLS 1.3 integrated. (5) Better congestion control—implemented in userspace, easier to iterate. Trade-offs: More complex, harder to debug (encrypted headers), firewall compatibility issues (some block unknown UDP). Google reports 3-15% faster page loads with HTTP/3, larger gains on mobile/lossy networks.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://httpwg.org/specs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              HTTP Working Group Specifications - RFC 7230-7237 (HTTP/1.1), RFC 7540 (HTTP/2), RFC 9113 (HTTP/3)
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs: HTTP - Comprehensive HTTP reference
            </a>
          </li>
          <li>
            <a href="https://hpbn.co/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              High Performance Browser Networking - Ilya Grigorik (free online book)
            </a>
          </li>
          <li>
            <a href="https://blog.cloudflare.com/the-road-to-http-3/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              The Road to HTTP/3 - Cloudflare engineering blog
            </a>
          </li>
          <li>
            <a href="https://letsencrypt.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Let&apos;s Encrypt - Free TLS certificates with automatic renewal
            </a>
          </li>
          <li>
            <a href="https://www.owasp.org/index.php/HTTP_Strict_Transport_Security" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP: HTTP Strict Transport Security (HSTS)
            </a>
          </li>
          <li>
            <strong>Books:</strong> &quot;High Performance Browser Networking&quot; by Ilya Grigorik, &quot;HTTP: The Definitive Guide&quot; by David Gourley
          </li>
          <li>
            <strong>Papers:</strong> &quot;QUIC: Better for What and for Whom?&quot; (Google), &quot;HTTP/3 Explained&quot; (Daniel Stenberg)
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

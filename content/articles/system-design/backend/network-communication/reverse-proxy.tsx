"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-reverse-proxy",
  title: "Reverse Proxy",
  description:
    "Deep dive into reverse proxy architecture — SSL termination, load balancing, caching, compression, request routing, security enforcement, and production deployment patterns.",
  category: "backend",
  subcategory: "network-communication",
  slug: "reverse-proxy",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-07",
  tags: ["backend", "proxy", "load-balancing", "tls", "caching", "security"],
  relatedTopics: ["api-gateway-pattern", "load-balancers", "forward-proxy"],
};

const BASE_PATH =
  "/diagrams/system-design-concepts/backend/network-communication";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A reverse proxy is a server that sits between clients and one or more
          backend servers, receiving incoming client requests, forwarding them
          to the appropriate backend, and returning the backend&apos;s response
          to the client. Unlike a forward proxy, which acts on behalf of clients
          to reach external destinations, a reverse proxy acts on behalf of
          backends to manage and control inbound traffic. From the client&apos;s
          perspective, the reverse proxy appears to be the origin server — the
          client is unaware of the internal topology behind the proxy, which
          provides both a security benefit and an operational abstraction.
        </p>
        <p>
          Reverse proxies serve as the front door of any production web
          architecture. They are the first point of contact for every incoming
          request, and they perform a wide range of functions that would
          otherwise need to be implemented by every individual backend service.
          These functions include TLS termination, which offloads the
          computationally expensive work of encrypting and decrypting traffic
          from the backends; load balancing, which distributes requests across
          multiple backend instances to prevent any single instance from
          becoming a bottleneck; caching, which stores frequently requested
          responses at the proxy layer to reduce backend load and improve
          response times; compression, which reduces the size of responses
          before they are sent to the client; request routing, which directs
          requests to different backends based on URL path, hostname, headers,
          or other criteria; and security enforcement, which includes rate
          limiting, IP filtering, Web Application Firewall rules, and
          authentication offloading.
        </p>
        <p>
          The importance of the reverse proxy layer cannot be overstated. It is
          the single most shared component in a production architecture,
          handling traffic for every service behind it. Its performance
          characteristics — the latency it adds, the throughput it can sustain,
          the reliability of its routing decisions — directly impact every user
          of the system. A misconfiguration at the proxy layer can take down an
          entire platform: an incorrectly set cache header can serve stale data
          to all users, a broken routing rule can return 502 errors for an
          entire service, and a misconfigured TLS setting can expose sensitive
          data in transit. For staff and principal engineers, understanding
          reverse proxy architecture is not optional; it is essential for
          designing systems that are performant, secure, and operationally
          manageable at scale.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/reverse-proxy-h2g2bob.svg`}
          alt="Reverse proxy architecture showing clients connecting to a proxy that routes traffic to multiple backend servers with TLS termination, caching, and load balancing"
          caption="Reverse proxy architecture — the proxy terminates TLS, routes requests, caches responses, and load-balances across backend instances"
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The reverse proxy operates through a pipeline of processing stages
          that each transform or inspect the request and response. Understanding
          these stages and how they interact is essential for designing a proxy
          configuration that is correct, efficient, and secure.
        </p>
        <p>
          TLS termination is the process by which the reverse proxy decrypts
          incoming HTTPS traffic from clients and optionally re-encrypts it
          before forwarding to backends. The proxy holds the TLS certificates
          and private keys for the domains it serves, and it performs the TLS
          handshake with every incoming client connection. This offloads the
          cryptographic work from the backend servers, which can then focus on
          application logic rather than encryption. The proxy can also
          re-encrypt traffic to backends — a configuration known as end-to-end
          TLS or TLS re-encryption — which provides defense in depth: even if
          the internal network is compromised, the traffic between the proxy and
          the backend remains encrypted. The choice between terminating TLS at
          the proxy only (and forwarding plaintext to backends) versus
          re-encrypting to backends is a trade-off between performance and
          security. In environments with strong internal network isolation
          (private VPCs, service meshes with mutual TLS), terminating at the
          proxy is common. In environments with weaker internal controls,
          re-encryption is preferred. Certificate management is a critical
          operational concern: certificates must be rotated before expiry, and
          the proxy must support hot-reloading of certificates without dropping
          existing connections. Tools like Let&apos;s Encrypt with automated
          renewal, or certificate managers like AWS ACM or HashiCorp Vault,
          handle this automation.
        </p>
        <p>
          Load balancing at the reverse proxy layer distributes incoming
          requests across multiple backend instances. The proxy maintains a pool
          of upstream servers and selects one for each request based on a
          configured algorithm. Round-robin distributes requests evenly across
          all backends in sequence. Least-connections directs each request to
          the backend with the fewest active connections, which is more
          effective when requests have variable processing times. IP hash routes
          requests from the same client IP to the same backend, which provides
          session affinity without requiring cookies. Weighted variants of these
          algorithms allow operators to direct more traffic to more powerful
          backends or to gradually shift traffic during a migration. The proxy
          also performs health checks on each backend, removing unhealthy
          instances from the pool and re-adding them when they recover. Health
          checks can be passive (monitoring actual request outcomes) or active
          (sending periodic probe requests to a health endpoint). Active health
          checks detect failures faster but add a small amount of background
          load to each backend.
        </p>
        <p>
          Caching at the reverse proxy layer stores the responses to frequently
          requested endpoints so that subsequent requests for the same resource
          can be served from the proxy&apos;s memory or disk cache without
          reaching the backend. The proxy respects standard HTTP cache-control
          headers (Cache-Control, ETag, Last-Modified, Expires) to determine
          what is cacheable and for how long. For static assets — images, CSS,
          JavaScript files — the cache TTL is typically set to hours or days,
          and the cache hit rate is very high. For dynamic content — API
          responses, personalized pages — caching is more nuanced. The proxy can
          cache responses based on a combination of URL, query parameters, and
          selected headers, and it can vary the cache by factors like the
          Accept-Encoding header to ensure that compressed and uncompressed
          versions are cached separately. The cache invalidation strategy is
          critical: stale caches serve outdated content, while overly aggressive
          invalidation reduces cache effectiveness. Common strategies include
          TTL-based expiration, explicit purge requests from the backend when
          content changes, and cache tagging, which allows the backend to
          invalidate all cache entries associated with a particular tag (e.g., a
          product ID or a user ID).
        </p>
        <p>
          Compression at the reverse proxy layer reduces the size of responses
          before they are sent to the client, which improves page-load times
          and reduces bandwidth costs. The proxy compresses responses using
          algorithms like gzip, Brotli, or Zstandard, depending on the
          algorithms supported by the client (advertised in the Accept-Encoding
          header). Brotli generally provides the best compression ratio for text
          content and is widely supported by modern browsers. The proxy should
          compress only responses that benefit from compression — text-based
          formats like HTML, CSS, JavaScript, JSON, and XML — and should skip
          already-compressed formats like images, videos, and archives.
          Compressing already-compressed content wastes CPU and can even
          increase the response size. The compression level — a trade-off
          between CPU usage and compression ratio — should be tuned
          empirically. A moderate level (typically 4–6 on a scale of 1–11)
          provides the best balance for most workloads.
        </p>
        <p>
          Request routing at the reverse proxy layer directs each incoming
          request to the appropriate backend based on configurable rules. The
          most common routing criterion is the URL path: requests to
          /api/users are routed to the user-service backend, requests to
          /api/orders are routed to the order-service backend, and requests to
          /static are routed to a static-file server. Path-based routing
          enables a single proxy to front dozens of microservices, providing a
          unified entry point for all client traffic. The proxy can also route
          based on the Host header (virtual hosting), which allows multiple
          domains to share the same proxy IP address. More advanced routing
          rules include header-based routing (route requests with a specific
          header to a canary backend), cookie-based routing (route based on
          session cookies for A/B testing), and content-type routing (route
          GraphQL requests to a different backend than REST requests). The
          routing configuration must be version-controlled, validated before
          deployment, and rollable within seconds, because a broken routing rule
          can take down an entire service.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/proxy-website-diagram.svg`}
          alt="Reverse proxy request routing showing path-based and host-based routing directing traffic to different backend service pools"
          caption="Request routing — the proxy directs traffic to different backend services based on URL path, hostname, and header-based rules"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production reverse proxy architecture is built around a processing
          pipeline that each request traverses from arrival to response. The
          pipeline consists of distinct stages that execute in a defined order,
          and each stage can inspect, modify, or short-circuit the request.
          Understanding this pipeline is essential for debugging issues,
          optimizing performance, and ensuring that security controls are
          applied at the correct stage.
        </p>
        <p>
          The request enters the pipeline at the TCP layer, where the proxy
          accepts the connection. If TLS is enabled, the TLS handshake occurs
          next, during which the proxy presents its certificate and negotiates
          the encryption parameters with the client. The TLS version and cipher
          suite are critical security decisions: modern proxies should support
          TLS 1.3 as the default, with TLS 1.2 as a fallback for legacy
          clients, and should disable older versions (TLS 1.0, TLS 1.1, SSL
          3.0) entirely. The cipher suite should be restricted to strong
          algorithms (AES-GCM, ChaCha20-Poly1305) and weak algorithms (RC4,
          3DES, DES) should be disabled. The proxy should also support OCSP
          stapling, which allows the proxy to provide a time-stamped OCSP
          response during the handshake, eliminating the need for the client to
          contact the certificate authority directly and reducing handshake
          latency.
        </p>
        <p>
          After the TLS handshake, the proxy parses the HTTP request and enters
          the request-processing stage. This is where security controls are
          applied: the proxy checks the client IP against an allowlist or
          blocklist, validates the request rate against the rate-limiting
          policy, inspects the request for known attack patterns (SQL injection,
          XSS, path traversal) if a WAF is enabled, and verifies authentication
          tokens if authentication offloading is configured. If any of these
          checks fail, the proxy returns an error response immediately without
          forwarding the request to the backend. This is the proxy&apos;s first
          line of defense: it blocks malicious traffic before it reaches the
          application layer.
        </p>
        <p>
          If the request passes all security checks, the proxy enters the
          routing stage. The proxy evaluates the routing rules in order of
          specificity and selects the upstream backend pool that matches the
          request. Within the selected pool, the load-balancing algorithm
          chooses a specific backend instance. The proxy then checks its cache
          for a cached response matching the request&apos;s URL, query
          parameters, and relevant headers. If a fresh cached response exists,
          the proxy returns it immediately, bypassing the backend entirely. This
          is the cache-hit path, and it is the fastest possible response path.
          If no cached response exists, or if the cached response is stale, the
          proxy forwards the request to the selected backend.
        </p>
        <p>
          When forwarding the request, the proxy modifies several headers to
          reflect the proxied nature of the connection. It adds or updates the
          X-Forwarded-For header to include the client&apos;s IP address, the
          X-Forwarded-Proto header to indicate whether the original request was
          HTTP or HTTPS, and the X-Forwarded-Port header to indicate the
          original port. It may also add an X-Real-IP header with the
          client&apos;s actual IP address (as opposed to the IP of the last
          proxy in the chain). These headers are critical for the backend&apos;s
          own logic: the backend uses X-Forwarded-For for rate limiting and
          logging, X-Forwarded-Proto for generating correct redirect URLs, and
          X-Real-IP for geolocation. The proxy must be careful about which
          headers it trusts: if the proxy is behind another proxy (e.g., a CDN),
          it must distinguish between headers set by the external proxy and
          headers set directly by the client, because a malicious client can
          forge X-Forwarded-For headers to spoof their IP address.
        </p>
        <p>
          The proxy then waits for the backend&apos;s response. The proxy
          enforces a connect timeout (the maximum time to establish a connection
          to the backend), a read timeout (the maximum time to wait for the
          backend to start sending the response), and a write timeout (the
          maximum time to wait for the backend to finish sending the response).
          These timeouts must be calibrated carefully: too short, and the proxy
          will prematurely terminate long-running but valid requests; too long,
          and the proxy will hold connections open for unresponsive backends,
          exhausting its own connection pool. When the response arrives, the
          proxy applies compression if the client supports it and the response
          is compressible, updates the cache if the response is cacheable, and
          forwards the response to the client.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/reverse-proxy-pipeline.svg`}
          alt="Reverse proxy processing pipeline showing the stages from TLS termination through security checks routing caching and forwarding to backends"
          caption="Request processing pipeline — each request flows through TLS termination, security enforcement, routing, cache lookup, and backend forwarding in sequence"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          The primary architectural decision with reverse proxies is whether to
          deploy a general-purpose proxy like NGINX or HAProxy, a programmable
          proxy like Envoy, or a cloud-managed proxy like AWS ALB or GCP Cloud
          Load Balancing. Each option has different trade-offs in terms of
          flexibility, operational overhead, and feature set.
        </p>
        <p>
          General-purpose proxies like NGINX and HAProxy are mature,
          well-understood, and performant. They handle high throughput with low
          latency, support all the standard proxy features (TLS termination,
          load balancing, caching, compression), and have large communities and
          extensive documentation. Their limitation is that they are not easily
          programmable: adding custom logic requires writing modules in C (for
          NGINX) or using Lua scripting (for OpenResty), which is beyond the
          skill set of most operations teams. For organizations with standard
          proxy needs — TLS termination, path-based routing, basic caching — a
          general-purpose proxy is the right choice. It is simple, reliable, and
          requires minimal expertise to operate.
        </p>
        <p>
          Programmable proxies like Envoy provide a richer feature set and a
          more flexible configuration model. Envoy supports advanced features
          like circuit breaking, outlier detection, request shadowing, and
          distributed tracing out of the box. Its configuration is expressed in
          a structured format (YAML/JSON) that can be managed through a control
          plane (like Istio or Gloo), enabling dynamic reconfiguration without
          restarting the proxy. Envoy also provides detailed observability
          through built-in metrics, access logs, and integration with
          distributed-tracing systems like Zipkin and Jaeger. The trade-off is
          that Envoy is more complex to configure and operate than NGINX. Its
          feature richness comes with a steeper learning curve, and the
          control-plane architecture introduces additional operational
          complexity. Envoy is the right choice for organizations that need
          advanced proxy features and have the operational maturity to manage a
          programmable proxy at scale.
        </p>
        <p>
          Cloud-managed proxies like AWS ALB, GCP Cloud Load Balancing, and
          Azure Application Gateway offload the operational burden entirely. The
          cloud provider manages the proxy infrastructure, handles TLS
          certificate rotation, provides built-in WAF integration, and scales
          automatically with traffic. The trade-off is that cloud-managed
          proxies are less flexible than self-managed options: the feature set
          is determined by the cloud provider, custom logic is limited, and the
          proxy&apos;s internal behavior is opaque. Cloud-managed proxies are
          the right choice for organizations that prioritize operational
          simplicity over customization and that are already committed to a
          single cloud provider.
        </p>
        <p>
          The trade-off between proxy-layer caching and application-layer
          caching is also worth examining. Caching at the proxy layer is
          effective for content that is cacheable using standard HTTP
          cache-control semantics — static assets, public API responses, and
          content that changes infrequently. For content that requires
          application-level cache logic — personalized responses, responses that
          depend on complex cache keys, or content that requires fine-grained
          invalidation — application-layer caching (using Redis, Memcached, or
          an in-memory cache) is more appropriate. The two approaches are
          complementary: proxy-layer caching reduces backend load for cacheable
          content, while application-layer caching provides flexibility for
          complex caching scenarios that the proxy cannot express.
        </p>
        <p>
          The comparison between reverse proxies and API gateways is a common
          source of confusion. An API gateway is essentially a reverse proxy
          with additional features tailored for API management: API-key
          validation, rate limiting per API consumer, request transformation,
          API versioning, and developer-portal integration. A reverse proxy is a
          more general-purpose component that handles any HTTP traffic, not just
          API traffic. In practice, the two often coexist: the reverse proxy
          handles general web traffic (static assets, server-rendered pages,
          WebSocket connections), while the API gateway handles API traffic
          (REST endpoints, GraphQL queries). The reverse proxy routes API
          traffic to the API gateway, which then routes it to the appropriate
          backend service.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Always terminate TLS at the proxy and enforce modern TLS versions and
          cipher suites. Disable TLS 1.0, TLS 1.1, and SSL 3.0. Enable TLS
          1.3 as the default and TLS 1.2 as a fallback. Use strong cipher suites
          (AES-256-GCM, ChaCha20-Poly1305) and disable weak ones (RC4, 3DES,
          DES). Enable OCSP stapling to reduce handshake latency. Automate
          certificate rotation using Let&apos;s Encrypt with certbot, a cloud
          provider&apos;s certificate manager, or a secrets-management tool like
          HashiCorp Vault. Test certificate rotation in staging before deploying
          to production, and monitor certificate expiry dates with alerts set at
          30, 14, and 7 days before expiry.
        </p>
        <p>
          Configure timeouts carefully at every stage: connect timeout, read
          timeout, and write timeout. The connect timeout should be short —
          typically one to three seconds — because a healthy backend should
          accept connections quickly. The read timeout should be calibrated to
          the backend&apos;s expected response time: for API endpoints, five to
          fifteen seconds is typical; for long-running operations like file
          uploads or report generation, the timeout should be set accordingly or
          the endpoint should be moved to an asynchronous processing model. The
          write timeout should match the read timeout. Ensure that the
          proxy&apos;s timeouts are shorter than the client&apos;s timeout, so
          that the proxy times out before the client does, allowing the proxy to
          return a meaningful 504 Gateway Timeout rather than the client
          receiving a generic connection-reset error.
        </p>
        <p>
          Implement strict header normalization and validation. The proxy should
          strip or normalize headers that could be used for header-injection
          attacks, including duplicate headers, headers with invalid characters,
          and headers that exceed a reasonable size limit. The proxy should set
          security headers on every response: Strict-Transport-Security (HSTS)
          to enforce HTTPS, X-Content-Type-Options: nosniff to prevent MIME-type
          sniffing, X-Frame-Options: DENY or SAMEORIGIN to prevent clickjacking,
          and Content-Security-Policy to restrict the sources from which the
          browser can load resources. These headers provide defense in depth and
          protect against common web vulnerabilities.
        </p>
        <p>
          Configure caching with explicit cache-control headers and a clear
          invalidation strategy. For static assets, use long TTLs (one year)
          with versioned filenames (app.v1.2.3.js) so that cache invalidation
          is handled by changing the filename. For API responses, use short TTLs
          (seconds to minutes) with ETag-based validation so that the proxy can
          return 304 Not Modified for unchanged content. For personalized or
          user-specific content, do not cache at the proxy layer, or use
          cache-varying headers to ensure that each user receives their own
          cached response. Implement cache purging through an API endpoint that
          the backend can call when content changes, and monitor cache hit rates
          to ensure that caching is providing value.
        </p>
        <p>
          Deploy the proxy in a highly available configuration with at least two
          instances behind an external load balancer. The external load balancer
          distributes traffic across the proxy instances and performs health
          checks, removing unhealthy proxies from the pool. The proxy instances
          should be stateless (except for shared cache storage, which should use
          a distributed cache like Redis if cache consistency across instances
          is required) so that any instance can handle any request. Use
          blue-green or canary deployments for proxy configuration changes, and
          validate the configuration in staging before deploying to production.
          A broken proxy configuration can take down an entire platform, so
          the deployment process must be safe and rollable.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is misconfiguring the trusted-headers
          boundary. When the proxy sits behind a CDN or another proxy, it
          receives requests with X-Forwarded-For headers that may have been set
          by the upstream proxy or by the client directly. If the proxy trusts
          these headers without validation, a malicious client can forge an
          X-Forwarded-For header to spoof their IP address, bypassing
          IP-based rate limiting, access controls, and audit logging. The
          solution is to configure the proxy to trust X-Forwarded-For headers
          only from known upstream proxies and to overwrite any
          client-provided headers. The proxy should set the X-Real-IP header to
          the actual source IP of the connection (the last hop), which is
          guaranteed to be correct.
        </p>
        <p>
          A second pitfall is caching user-specific or private data at the proxy
          layer. If the proxy caches a response that contains user-specific
          information (e.g., a personalized dashboard or an API response with
          the user&apos;s private data), and the cache key does not include the
          user&apos;s session or authentication token, a subsequent request from
          a different user may receive the cached response intended for the
          first user. This is a serious data-leakage vulnerability. The solution
          is to either disable caching for user-specific endpoints or to include
          the user&apos;s authentication token (or a hash of it) in the cache
          key, ensuring that each user receives their own cached response.
        </p>
        <p>
          A third pitfall is setting proxy timeouts that are longer than the
          client&apos;s timeout. If the client times out after 30 seconds but
          the proxy&apos;s read timeout is 60 seconds, the client will disconnect
          after 30 seconds while the proxy continues to wait for the backend.
          When the backend eventually responds, the proxy has no client to send
          the response to, and the work is wasted. Worse, if the client retries
          after timing out, the retry adds additional load to the backend. The
          proxy&apos;s timeouts should always be shorter than the client&apos;s
          timeout, so that the proxy can return a meaningful error response
          before the client gives up.
        </p>
        <p>
          A fourth pitfall is deploying a single proxy instance without
          redundancy. A single proxy instance is a single point of failure: if
          it crashes, becomes unreachable, or needs to be restarted for a
          configuration update, all traffic is disrupted. The proxy should
          always be deployed in a highly available configuration with at least
          two instances behind an external load balancer. For global services,
          the proxy should be deployed in multiple regions with DNS-based or
          anycast-based traffic distribution across regions.
        </p>
        <p>
          A fifth pitfall is neglecting to monitor proxy-level metrics. The
          proxy handles every request, and its metrics provide a comprehensive
          view of the system&apos;s health: request rate, error rate, latency
          distribution, cache hit rate, upstream response times, and connection
          pool utilization. Without these metrics, operators are blind to
          problems that originate at the proxy layer — routing misconfigurations,
          cache poisoning, TLS certificate expirations, and connection-pool
          exhaustion. Monitor all proxy-level metrics, set alerts on
          deviations from baseline, and include proxy metrics in incident
          response runbooks.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Netflix uses NGINX as its edge reverse proxy, handling all inbound
          traffic before it reaches the Zuul API gateway. NGINX performs TLS
          termination, static-asset serving, and initial request routing, while
          Zuul handles API-level concerns like authentication, rate limiting,
          and dynamic routing to microservices. This two-layer proxy
          architecture — a general-purpose edge proxy for TLS and static
          content, and a programmable API gateway for application logic — allows
          each layer to be optimized for its specific role. NGINX handles the
          high-throughput, low-latency workloads of TLS termination and static
          content, while Zuul handles the complex, dynamic routing decisions
          that require application-level logic.
        </p>
        <p>
          Cloudflare operates one of the world&apos;s largest reverse proxy
          networks, with proxy nodes in over 300 cities. Each node terminates
          TLS, applies WAF rules, serves cached content, and forwards
          uncached requests to the origin server. Cloudflare&apos;s proxy
          architecture is notable for its scale: it handles tens of millions of
          requests per second across its global network, and its caching layer
          serves the majority of requests without ever reaching the origin. The
          proxy also provides DDoS protection by absorbing and filtering
          malicious traffic at the edge, preventing it from reaching the origin
          server.
        </p>
        <p>
          Airbnb uses Envoy as its service-mesh sidecar proxy, with each
          microservice instance running an Envoy proxy alongside the application
          process. Envoy handles service-to-service communication, including TLS
          (mTLS), load balancing, retries, circuit breaking, and distributed
          tracing. The reverse proxy at the edge (a separate NGINX layer) routes
          traffic to the appropriate service, and from that point onward, Envoy
          manages all inter-service communication. This architecture provides
          consistent proxy behavior across the entire service graph and enables
          the platform team to update proxy behavior centrally through the Envoy
          control plane, without requiring changes to individual services.
        </p>
        <p>
          Shopify uses a custom reverse proxy built on top of NGINX to handle
          its multi-tenant e-commerce platform. Each Shopify store is a
          subdomain of myshopify.com or a custom domain, and the reverse proxy
          routes each request to the appropriate store&apos;s backend based on
          the hostname. The proxy also handles TLS termination for custom
          domains, automatically provisioning and rotating Let&apos;s Encrypt
          certificates for millions of domains. The proxy&apos;s caching layer
          serves cached storefront pages, reducing the load on the application
          servers and improving page-load times for shoppers. The proxy
          architecture is critical to Shopify&apos;s ability to serve millions
          of stores from a shared infrastructure while providing each store with
          its own custom domain and TLS certificate.
        </p>
      </section>

      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="rounded-lg bg-panel-soft p-6">
          <h3 className="mb-2 text-lg font-semibold">
            Q1: What is the role of a reverse proxy in a production
            architecture, and how does it differ from a forward proxy?
          </h3>
          <p>
            A reverse proxy sits in front of backend servers and handles inbound
            client traffic. It receives requests from clients, forwards them to
            the appropriate backend, and returns the backend&apos;s response to
            the client. The client is unaware of the internal topology — it sees
            only the proxy. A forward proxy, by contrast, sits in front of
            clients and handles outbound traffic to external destinations. The
            client configures the forward proxy as its gateway to the
            internet, and the proxy forwards the client&apos;s requests to
            external servers on the client&apos;s behalf. The key distinction is
            direction: a reverse proxy protects backends from inbound traffic,
            while a forward proxy protects clients when making outbound
            requests. In production web architectures, the reverse proxy is the
            standard front door, providing TLS termination, load balancing,
            caching, compression, routing, and security enforcement for all
            incoming traffic.
          </p>
        </div>

        <div className="rounded-lg bg-panel-soft p-6">
          <h3 className="mb-2 text-lg font-semibold">
            Q2: How do you handle TLS certificate rotation at the reverse proxy
            without dropping connections or causing downtime?
          </h3>
          <p>
            TLS certificate rotation requires the proxy to load the new
            certificate and private key while continuing to serve existing
            connections. Most modern proxies support hot-reloading of
            certificates: when the certificate file is updated on disk, the
            proxy reloads the certificate without restarting. NGINX supports
            this through the ssl_certificate and ssl_certificate_key directives,
            which are re-read on a graceful reload (nginx -s reload). Envoy
            supports this through its secret-discovery service (SDS), which
            pushes new certificates to the proxy dynamically. The operational
            process is to automate certificate renewal (using Let&apos;s Encrypt
            with certbot, or a cloud provider&apos;s certificate manager), place
            the renewed certificate in the expected location on disk, and
            trigger a graceful reload of the proxy. The graceful reload creates
            new worker processes with the new certificate while the old worker
            processes continue serving existing connections with the old
            certificate. Once the old connections close naturally, the old
            worker processes exit. This ensures zero downtime. Additionally,
            monitor certificate expiry dates and set alerts at 30, 14, and 7
            days before expiry to catch any automation failures before they
            cause an outage.
          </p>
        </div>

        <div className="rounded-lg bg-panel-soft p-6">
          <h3 className="mb-2 text-lg font-semibold">
            Q3: What are the security implications of the X-Forwarded-For
            header, and how do you prevent header spoofing?
          </h3>
          <p>
            The X-Forwarded-For header contains the client&apos;s original IP
            address as the request traverses multiple proxies. It is critical
            for rate limiting, access control, geolocation, and audit logging.
            The security risk is that a malicious client can forge the
            X-Forwarded-For header to spoof their IP address, bypassing IP-based
            controls. For example, a client blocked by IP can send a request
            with X-Forwarded-For set to an unblocked IP, and if the backend
            trusts this header, the block is bypassed. The prevention strategy
            is to configure the proxy to trust X-Forwarded-For headers only
            from known, trusted upstream proxies. The proxy should strip any
            X-Forwarded-For header set by the client and replace it with the
            actual source IP of the connection. If the proxy is behind another
            proxy (e.g., a CDN), it should append the connection&apos;s source
            IP to the existing X-Forwarded-For chain rather than replacing it.
            Additionally, the proxy should set the X-Real-IP header to the
            actual source IP of the last hop, which is guaranteed to be correct
            because it is derived from the TCP connection, not from a header.
          </p>
        </div>

        <div className="rounded-lg bg-panel-soft p-6">
          <h3 className="mb-2 text-lg font-semibold">
            Q4: How do you decide whether to cache a response at the reverse
            proxy layer, and what is your cache invalidation strategy?
          </h3>
          <p>
            The decision to cache at the proxy layer depends on the
            cacheability of the content. Static assets — images, CSS,
            JavaScript, fonts — are always cacheable and should be cached with
            long TTLs (one year) and versioned filenames so that cache
            invalidation is handled by changing the filename. Public API
            responses that do not vary by user — product catalogs, public
            listings, configuration data — are cacheable with short to moderate
            TTLs (seconds to minutes) and ETag-based validation. User-specific
            or personalized content should not be cached at the proxy layer, or
            it should be cached with a cache key that includes the user&apos;s
            authentication token to ensure per-user isolation. The cache
            invalidation strategy should combine TTL-based expiration (the
            cache entry expires naturally after its TTL), explicit purge
            requests (the backend calls a proxy API to purge specific URLs when
            content changes), and cache tagging (the backend tags cache entries
            with metadata like product IDs or category IDs, and can purge all
            entries with a given tag when that product or category changes).
            Monitor cache hit rates to ensure that caching is providing value —
            a low hit rate indicates that the caching policy is too aggressive
            or that the content is too dynamic to benefit from proxy-layer
            caching.
          </p>
        </div>

        <div className="rounded-lg bg-panel-soft p-6">
          <h3 className="mb-2 text-lg font-semibold">
            Q5: How do you ensure high availability and safe deployments for
            the reverse proxy layer?
          </h3>
          <p>
            The reverse proxy must be deployed in a highly available
            configuration with at least two instances behind an external load
            balancer. The external load balancer distributes traffic across the
            proxy instances and performs health checks, removing unhealthy
            instances from the pool. The proxy instances should be stateless
            (except for shared cache, which should use a distributed store like
            Redis if cross-instance consistency is required) so that any
            instance can handle any request. For global services, deploy proxy
            instances in multiple regions with DNS-based or anycast-based
            traffic distribution. For safe deployments of configuration changes,
            use a blue-green or canary approach: deploy the new configuration to
            a subset of proxy instances, route a small fraction of traffic to
            them, monitor error rates and latency, and gradually increase the
            traffic fraction while monitoring for regressions. If the new
            configuration causes errors, roll back immediately by reverting
            traffic to the old configuration. Validate the configuration in
            staging before deploying to production, using automated linting
            tools that check for common errors (invalid upstream references,
            missing timeout values, conflicting routing rules). A broken proxy
            configuration can take down an entire platform, so the deployment
            process must be safe, monitored, and rollable within seconds.
          </p>
        </div>

        <div className="rounded-lg bg-panel-soft p-6">
          <h3 className="mb-2 text-lg font-semibold">
            Q6: What is the difference between a reverse proxy and an API
            gateway, and when would you use both?
          </h3>
          <p>
            A reverse proxy is a general-purpose HTTP traffic manager that
            handles TLS termination, load balancing, caching, compression,
            routing, and basic security enforcement for any HTTP traffic. An
            API gateway is a specialized reverse proxy that adds API-management
            features: API-key validation, per-consumer rate limiting, request
            and response transformation, API versioning, authentication and
            authorization, developer-portal integration, and API analytics. The
            reverse proxy handles all web traffic — static assets,
            server-rendered pages, WebSocket connections, and API traffic —
            while the API gateway handles only API traffic. In a typical
            architecture, both coexist: the reverse proxy sits at the edge and
            handles TLS termination, static-asset serving, and initial routing.
            It routes API traffic to the API gateway, which then applies
            API-specific policies before forwarding to the appropriate backend
            service. This separation allows each component to be optimized for
            its role: the reverse proxy for high-throughput, low-latency general
            traffic, and the API gateway for complex, policy-driven API
            management. Using both is appropriate when the system serves both
            web content and APIs, and when the API traffic requires
            consumer-specific rate limiting, authentication, or transformation
            that a general-purpose reverse proxy cannot provide.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            NGINX Documentation, &quot;NGINX Reverse Proxy Configuration,&quot;
            2024. — Comprehensive reference for NGINX proxy directives, TLS
            configuration, and load-balancing algorithms.
          </li>
          <li>
            Envoy Proxy Documentation, &quot;Architecture Overview,&quot; 2024.
            — Detailed description of Envoy&apos;s processing pipeline,
            filtering architecture, and integration with service-mesh control
            planes.
          </li>
          <li>
            Kleppmann, M., &quot;Designing Data-Intensive Applications,&quot;
            O&apos;Reilly, 2017. — Chapter 12 covers load balancing, caching,
            and proxy architectures in distributed systems.
          </li>
          <li>
            Cloudflare Learning Center, &quot;What is a Reverse Proxy?&quot; —
            Accessible overview of reverse proxy functions and their role in
            modern web architectures.
          </li>
          <li>
            Netflix Technology Blog, &quot;Zuul 2: The Journey to a
            Non-Blocking Edge Service,&quot; 2018. — Discussion of Netflix&apos;s
            two-layer proxy architecture with NGINX at the edge and Zuul for
            API-level routing.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

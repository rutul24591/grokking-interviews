"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-rate-limiting-abuse-protection-extensive",
  title: "Rate Limiting & Abuse Protection",
  description: "Comprehensive guide to rate limiting and abuse protection, covering algorithms (token bucket, sliding window), DDoS mitigation, bot detection, and production patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "rate-limiting-abuse-protection",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "rate-limiting", "security", "ddos", "abuse-protection", "throttling"],
  relatedTopics: ["fault-tolerance-resilience", "scalability-strategy", "api-versioning", "load-balancing"],
};

export default function RateLimitingAbuseProtectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Rate Limiting</strong> controls the number of requests a client can make within a time window.
          It protects systems from overload, prevents abuse, and ensures fair resource allocation.
        </p>
        <p>
          <strong>Abuse Protection</strong> encompasses broader techniques to detect and mitigate malicious
          activity including DDoS attacks, bot traffic, credential stuffing, and scraping.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Rate Limiting is Defense in Depth</h3>
          <p>
            Rate limiting is one layer of defense. Effective abuse protection requires multiple layers:
            network-level (DDoS mitigation), application-level (rate limiting), and behavioral analysis
            (anomaly detection).
          </p>
        </div>

        <p>
          <strong>Why rate limiting matters:</strong>
        </p>
        <ul>
          <li>
            <strong>System protection:</strong> Prevents overload from legitimate traffic spikes.
          </li>
          <li>
            <strong>Abuse prevention:</strong> Stops brute force attacks, scraping, spam.
          </li>
          <li>
            <strong>Fair allocation:</strong> Ensures no single user monopolizes resources.
          </li>
          <li>
            <strong>Cost control:</strong> Reduces infrastructure costs from abusive traffic.
          </li>
          <li>
            <strong>API monetization:</strong> Enables tiered pricing based on usage limits.
          </li>
        </ul>
      </section>

      <section>
        <h2>Rate Limiting Algorithms</h2>
        <p>
          Several algorithms implement rate limiting, each with different characteristics:
        </p>

        <ArticleImage
          src="/diagrams/backend-nfr/rate-limiting-algorithms.svg"
          alt="Rate Limiting Algorithms Comparison"
          caption="Rate Limiting Algorithms — comparing Token Bucket, Sliding Window Log, and Leaky Bucket with selection guide and tier examples"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Bucket</h3>
        <p>
          <strong>How it works:</strong>
        </p>
        <ul>
          <li>Bucket holds tokens, refilled at constant rate.</li>
          <li>Each request consumes one token.</li>
          <li>If bucket is empty, request is rejected.</li>
          <li>Bucket has maximum capacity (allows bursts).</li>
        </ul>
        <p>
          <strong>Example:</strong> Bucket capacity = 100 tokens, refill rate = 10 tokens/second.
          Client can burst 100 requests immediately, then sustained 10 RPS.
        </p>
        <p>
          <strong>Best for:</strong> API rate limiting where bursts are acceptable.
        </p>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Allows controlled bursts.</li>
          <li>✓ Simple to implement.</li>
          <li>✓ Memory efficient (just counter + timestamp).</li>
          <li>✗ Bursts may overwhelm downstream services.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sliding Window Log</h3>
        <p>
          <strong>How it works:</strong>
        </p>
        <ul>
          <li>Track timestamp of each request.</li>
          <li>Count requests in rolling time window.</li>
          <li>Reject if count exceeds limit.</li>
        </ul>
        <p>
          <strong>Example:</strong> 100 requests per minute. Window slides continuously, not fixed minutes.
        </p>
        <p>
          <strong>Best for:</strong> Precise rate limiting, high-traffic APIs.
        </p>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Precise (no boundary issues).</li>
          <li>✓ No burst allowance (smooth traffic).</li>
          <li>✗ Memory intensive (store all timestamps).</li>
          <li>✗ Computationally expensive for high traffic.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sliding Window Counter</h3>
        <p>
          <strong>How it works:</strong> Approximation of sliding window log using fixed windows with
          weighted interpolation.
        </p>
        <p>
          <strong>Example:</strong> Current minute + previous minute weighted by time elapsed.
        </p>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Memory efficient (just counters).</li>
          <li>✓ Good approximation of sliding window.</li>
          <li>✗ Small boundary inaccuracies.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Leaky Bucket</h3>
        <p>
          <strong>How it works:</strong>
        </p>
        <ul>
          <li>Requests enter bucket (queue).</li>
          <li>Requests processed at constant rate (leak).</li>
          <li>If bucket overflows, requests dropped.</li>
        </ul>
        <p>
          <strong>Best for:</strong> Traffic shaping, smoothing bursty traffic.
        </p>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Smooths output rate.</li>
          <li>✓ Protects downstream services.</li>
          <li>✗ No bursts allowed.</li>
          <li>✗ Adds latency (queuing).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Fixed Window</h3>
        <p>
          <strong>How it works:</strong> Count requests in fixed time windows (e.g., per minute, per hour).
        </p>
        <p>
          <strong>Problem:</strong> Boundary issue — 100 requests at 1:59:59 + 100 at 2:00:01 = 200 in 2 seconds.
        </p>
        <p>
          <strong>Best for:</strong> Simple use cases where boundary issues are acceptable.
        </p>
      </section>

      <section>
        <h2>Rate Limiting Implementation</h2>
        <p>
          Where to implement rate limiting:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">API Gateway Level</h3>
        <p>
          Implement at API gateway (Kong, AWS API Gateway, Envoy).
        </p>
        <p>
          <strong>Pros:</strong> Centralized, protects all downstream services, easy to configure.
        </p>
        <p>
          <strong>Cons:</strong> Single point of failure, may not have business context.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Application Level</h3>
        <p>
          Implement in application code (middleware, decorators).
        </p>
        <p>
          <strong>Pros:</strong> Business-aware limiting (different limits per endpoint/user tier).
        </p>
        <p>
          <strong>Cons:</strong> Duplicated across services, application resources already consumed.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Distributed Rate Limiting</h3>
        <p>
          Use Redis or similar for distributed counter storage.
        </p>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Key: &quot;rate_limit:&lbrace;user_id&rbrace;:&lbrace;endpoint&rbrace;&quot;</li>
          <li>INCR key on each request.</li>
          <li>EXPIRE key after window.</li>
          <li>Check count against limit.</li>
        </ol>
        <p>
          <strong>Race condition fix:</strong> Use Lua script or Redis INCR with atomic operations.
        </p>
      </section>

      <section>
        <h2>Abuse Protection Patterns</h2>
        <p>
          Rate limiting is one tool. Comprehensive abuse protection requires multiple techniques:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">IP-Based Rate Limiting</h3>
        <p>
          Limit requests per IP address. Effective against simple attacks but vulnerable to IP rotation
          (botnets, proxies).
        </p>
        <p>
          <strong>Implementation:</strong> Combine with user-based limiting for defense in depth.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User-Based Rate Limiting</h3>
        <p>
          Limit requests per authenticated user. More accurate than IP-based but requires authentication.
        </p>
        <p>
          <strong>Tiered limits:</strong> Different limits for free vs paid users.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Behavioral Analysis</h3>
        <p>
          Detect anomalies in user behavior:
        </p>
        <ul>
          <li>Unusual request patterns (timing, endpoints).</li>
          <li>High error rates (credential stuffing).</li>
          <li>Scraping patterns (sequential ID access).</li>
          <li>Bot signatures (user agent, headers).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Progressive Delays</h3>
        <p>
          Instead of hard rejection, add increasing delays for suspicious clients:
        </p>
        <ul>
          <li>First violation: 1 second delay.</li>
          <li>Second violation: 5 second delay.</li>
          <li>Third violation: 30 second delay.</li>
          <li>Fourth violation: Block.</li>
        </ul>
        <p>
          <strong>Benefit:</strong> Makes attacks expensive without completely blocking legitimate users.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CAPTCHA Challenges</h3>
        <p>
          Trigger CAPTCHA when suspicious activity detected:
        </p>
        <ul>
          <li>Multiple failed login attempts.</li>
          <li>Unusual request volume.</li>
          <li>Known bad IP ranges.</li>
        </ul>
      </section>

      <section>
        <h2>DDoS Mitigation</h2>
        <p>
          Distributed Denial of Service attacks require specialized mitigation:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 3/4 DDoS (Network/Transport)</h3>
        <p>
          Volumetric attacks (SYN floods, UDP amplification):
        </p>
        <ul>
          <li>Use DDoS protection service (Cloudflare, AWS Shield).</li>
          <li>Anycast routing to distribute attack traffic.</li>
          <li>Rate limit at network edge.</li>
          <li>Blackhole routing for extreme attacks.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layer 7 DDoS (Application)</h3>
        <p>
          Application-layer attacks (HTTP floods, slowloris):
        </p>
        <ul>
          <li>WAF (Web Application Firewall) rules.</li>
          <li>Rate limiting per IP/user.</li>
          <li>Challenge suspicious requests (JavaScript challenge, CAPTCHA).</li>
          <li>Bot detection and blocking.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a rate limiting system for a public API with 1M users. What algorithm do you choose and how do you implement it at scale?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Algorithm:</strong> Token bucket for API (allows bursts, simple). Sliding window for billing-critical endpoints.</li>
                <li><strong>Storage:</strong> Redis cluster for distributed counters. Key: ratelimit:&#123;user_id&#125;:&#123;endpoint&#125;:&#123;window&#125;.</li>
                <li><strong>Implementation:</strong> Lua script for atomic INCR + EXPIRE. Prevents race conditions.</li>
                <li><strong>Scaling:</strong> Redis Cluster with 10+ nodes. Consistent hashing for key distribution. Each node handles ~100K keys.</li>
                <li><strong>Fallback:</strong> If Redis unavailable, use local rate limiting (per-instance). Graceful degradation.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare token bucket vs sliding window rate limiting. When would you choose each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Token bucket:</strong> Tokens added at fixed rate, requests consume tokens. ✓ Allows bursts, simple, memory efficient. ✗ Can exceed rate temporarily.</li>
                <li><strong>Sliding window:</strong> Track requests in rolling time window. ✓ Accurate, no boundary issues. ✗ Memory intensive (store timestamps).</li>
                <li><strong>Use token bucket when:</strong> API with burst traffic (mobile apps syncing), general rate limiting.</li>
                <li><strong>Use sliding window when:</strong> Accurate rate limiting critical (billing, strict quotas).</li>
                <li><strong>Leaky bucket:</strong> Fixed output rate, requests queue. Use when downstream has strict rate limits.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Your API is under a DDoS attack. How do you respond? What mitigation strategies do you implement?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Detection:</strong> Sudden traffic spike (10× normal), unusual patterns, high error rates, geographic anomalies.</li>
                <li><strong>Immediate response:</strong> (1) Enable WAF rules. (2) Tighten rate limits. (3) Block known bad IP ranges. (4) Enable CAPTCHA for suspicious traffic.</li>
                <li><strong>Layer 3/4 protection:</strong> Use DDoS service (Cloudflare, AWS Shield). Anycast routing, blackhole routing for extreme attacks.</li>
                <li><strong>Layer 7 protection:</strong> Request validation, API key authentication, bot detection (fingerprinting).</li>
                <li><strong>Scaling:</strong> Auto-scale to absorb attack. Use serverless for infinite scaling.</li>
                <li><strong>Post-attack:</strong> Analyze attack patterns, update WAF rules, document incident.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Design a tiered rate limiting system for free, pro, and enterprise users. How do you enforce different limits?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Tier limits:</strong> Free (100 req/hour), Pro (10,000 req/hour), Enterprise (100,000 req/hour or unlimited).</li>
                <li><strong>Implementation:</strong> Store tier in user record. Lookup tier on each request, apply corresponding limit.</li>
                <li><strong>Redis keys:</strong> ratelimit:&#123;tier&#125;:&#123;user_id&#125;:&#123;endpoint&#125;:&#123;window&#125;. Different TTL per tier.</li>
                <li><strong>Headers:</strong> Return X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset. Help clients self-regulate.</li>
                <li><strong>Over-limit:</strong> Return 429 with Retry-After header. Offer upgrade prompt for free users.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. How do you implement distributed rate limiting with Redis? What are the race conditions and how do you prevent them?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Basic implementation:</strong> INCR key, EXPIRE after window, check count against limit.</li>
                <li><strong>Race condition:</strong> Two requests arrive simultaneously, both see count = 99, both increment to 100, both allowed (should be 1 denied).</li>
                <li><strong>Fix with Lua:</strong> Atomic Lua script: count = redis.call(&apos;INCR&apos;, key); if count == 1 then redis.call(&apos;EXPIRE&apos;, key, ttl); end; return count;</li>
                <li><strong>Alternative:</strong> Redis INCR + check in single pipeline. Still has race condition but smaller window.</li>
                <li><strong>Best practice:</strong> Always use Lua script for accurate rate limiting.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. Detect and prevent credential stuffing attacks on your login endpoint. What patterns do you implement?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Rate limiting:</strong> Strict limits (5 attempts/hour per IP, 3 attempts/hour per email).</li>
                <li><strong>CAPTCHA:</strong> Show after 3 failed attempts. Use reCAPTCHA v3 (invisible) for better UX.</li>
                <li><strong>Account lockout:</strong> Lock after 10 failed attempts. Send email notification to user.</li>
                <li><strong>Breach detection:</strong> Check passwords against breached password databases (Have I Been Pwned API).</li>
                <li><strong>Monitoring:</strong> Alert on unusual login failure patterns. Detect distributed attacks (many IPs, same emails).</li>
                <li><strong>MFA:</strong> Require MFA for accounts with suspicious activity.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Rate Limiting Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Selected appropriate algorithm (token bucket, sliding window)</li>
          <li>✓ Defined rate limits per user tier</li>
          <li>✓ Implemented distributed rate limiting (Redis)</li>
          <li>✓ Added rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining)</li>
          <li>✓ Configured appropriate HTTP 429 responses</li>
          <li>✓ Implemented IP-based and user-based limiting</li>
          <li>✓ Set up DDoS protection (WAF, CDN)</li>
          <li>✓ Configured bot detection and blocking</li>
          <li>✓ Monitored rate limit violations</li>
          <li>✓ Documented rate limits for API consumers</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

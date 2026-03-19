"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-idempotency-guarantees-extensive",
  title: "Idempotency Guarantees",
  description: "Comprehensive guide to idempotency in distributed systems, covering idempotent APIs, deduplication, retry safety, and implementation patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "idempotency-guarantees",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "idempotency", "distributed-systems", "retry", "api-design", "consistency"],
  relatedTopics: ["fault-tolerance-resilience", "consistency-model", "api-versioning", "durability-guarantees"],
};

export default function IdempotencyGuaranteesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          An operation is <strong>idempotent</strong> if executing it multiple times produces the same
          result as executing it once. In distributed systems, idempotency is essential for handling
          retries, network failures, and duplicate requests safely.
        </p>
        <p>
          <strong>Mathematical definition:</strong> f(f(x)) = f(x)
        </p>
        <p>
          <strong>Example:</strong> Setting a value is idempotent (SET x = 5). Incrementing is not
          (INCREMENT x produces different results each time).
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Idempotency Enables Safe Retries</h3>
          <p>
            Without idempotency, retries are dangerous (double charges, duplicate orders). With idempotency,
            clients can retry freely without coordination, improving system resilience.
          </p>
        </div>
      </section>

      <section>
        <h2>HTTP Method Idempotency</h2>
        <p>
          HTTP methods have defined idempotency semantics:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Idempotent Methods</h3>
        <ul>
          <li>
            <strong>GET:</strong> Reading data has no side effects.
          </li>
          <li>
            <strong>PUT:</strong> Replacing a resource. PUT /users/123 with same body twice = same result.
          </li>
          <li>
            <strong>DELETE:</strong> Deleting a resource. DELETE /users/123 twice = resource deleted (second call may return 404).
          </li>
          <li>
            <strong>PATCH:</strong> Can be idempotent if designed carefully (set operations, not increments).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Non-Idempotent Methods</h3>
        <ul>
          <li>
            <strong>POST:</strong> Creating resources. POST /orders twice = two orders (usually not desired).
          </li>
        </ul>
        <p>
          <strong>Interview insight:</strong> POST can be made idempotent with idempotency keys.
        </p>
      </section>

      <section>
        <h2>Idempotency Implementation Patterns</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/idempotency-patterns.svg"
          alt="Idempotency Implementation Patterns"
          caption="Idempotency Patterns — showing idempotency key flow, deduplication table structure, HTTP method idempotency, and retry scenarios with/without idempotency"
        />
        <p>
          Making non-idempotent operations idempotent:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Idempotency Keys</h3>
        <p>
          Client generates unique key per operation, includes in request header:
        </p>
        <p>
          <code>Idempotency-Key: order-12345-client-abc</code>
        </p>
        <p>
          <strong>Server implementation:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Check if idempotency key exists in cache/database.</li>
          <li>If exists, return cached response (don&apos;t re-execute).</li>
          <li>If not exists, execute operation, store result with key, return response.</li>
        </ol>
        <p>
          <strong>Storage:</strong> Redis with TTL (24 hours typical).
        </p>
        <p>
          <strong>Key generation:</strong> Client should use business-unique identifier (order ID, transaction ID).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Conditional Requests</h3>
        <p>
          Use conditional headers to ensure operation only applies if state matches expectation:
        </p>
        <ul>
          <li><code>If-Match: &quot;etag-value&quot;</code> — Only process if resource matches ETag.</li>
          <li><code>If-None-Match: &quot;*&quot;</code> — Only create if resource doesn&apos;t exist.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Deduplication Tables</h3>
        <p>
          Maintain table of processed operations:
        </p>
        <ul>
          <li>Store operation_id as primary key with result and timestamp</li>
          <li>Before processing, check if operation_id already exists</li>
          <li>If exists, return cached result without re-executing</li>
          <li>If not exists, process operation and store result</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design an idempotent payment API. How do you prevent double charges when network failures cause retries?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Idempotency key:</strong> Client generates unique key (UUID) per payment. Include in request header (Idempotency-Key: abc123).</li>
                <li><strong>Server-side:</strong> (1) Check if key exists in idempotency table. (2) If exists, return cached response. (3) If not, process payment, store result with key.</li>
                <li><strong>Storage:</strong> Redis with TTL (24-48 hours). Key = idempotency_key, Value = response.</li>
                <li><strong>Concurrency:</strong> Use locking (Redis SETNX) to prevent concurrent duplicate processing.</li>
                <li><strong>Example:</strong> Stripe uses idempotency keys for all payment APIs. Same key = same result, no duplicate charges.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Explain idempotency keys. How do you implement them and what storage do you use?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Idempotency key:</strong> Client-generated unique identifier (UUID) per operation.</li>
                <li><strong>Implementation:</strong> (1) Check if key exists. (2) If exists, return cached response. (3) If not, process, store result with key.</li>
                <li><strong>Storage:</strong> Redis with TTL (24-48 hours). Key = idempotency_key, Value = response.</li>
                <li><strong>Concurrency:</strong> Use locking (Redis SETNX) to prevent concurrent duplicate processing.</li>
                <li><strong>Example:</strong> Stripe uses idempotency keys for all payment APIs.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Which HTTP methods are idempotent? Why is POST not idempotent by default?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Idempotent methods:</strong> GET (read), PUT (replace), DELETE (remove), PATCH (if designed properly).</li>
                <li><strong>Non-idempotent:</strong> POST (creates new resource each time).</li>
                <li><strong>Why POST not idempotent:</strong> POST /orders creates new order each time. Two POSTs = two orders. Not safe to retry.</li>
                <li><strong>Making POST idempotent:</strong> Add idempotency key. POST /orders with Idempotency-Key header. Same key = same order, no duplicate.</li>
                <li><strong>Best practice:</strong> Use PUT for updates (idempotent by design). Use POST with idempotency key for creates.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Your order creation API is being called twice due to client retries. How do you fix this?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Immediate fix:</strong> Implement idempotency keys. Require Idempotency-Key header for order creation.</li>
                <li><strong>Implementation:</strong> (1) Check idempotency table for key. (2) If exists, return cached order. (3) If not, create order, store key + order_id.</li>
                <li><strong>Database:</strong> Unique constraint on idempotency_key. Prevents duplicate inserts.</li>
                <li><strong>Client-side:</strong> Generate UUID per order. Retry with same key (not new UUID).</li>
                <li><strong>Verification:</strong> Test retry scenarios. Verify same order returned, no duplicates created.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Design a deduplication system for a message processing pipeline. How do you handle late duplicates?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Message ID:</strong> Each message has unique ID (producer-generated or system-generated).</li>
                <li><strong>Deduplication table:</strong> Store processed message IDs with TTL (24-48 hours). Redis SET or database table.</li>
                <li><strong>Processing:</strong> (1) Check if message ID exists. (2) If exists, skip (duplicate). (3) If not, process, store ID.</li>
                <li><strong>Late duplicates:</strong> After TTL expires, duplicate may be processed. Acceptable for most use cases.</li>
                <li><strong>Long-term deduplication:</strong> Use database with permanent storage. Query by message ID before processing.</li>
                <li><strong>Trade-off:</strong> TTL-based = faster, limited window. Permanent = slower, infinite window.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you make an increment operation (like adding to a cart) idempotent?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Problem:</strong> Increment (cart.quantity += 1) is not idempotent. Retry = double increment.</li>
                <li><strong>Solution 1:</strong> Use idempotency key. Track which increments have been applied.</li>
                <li><strong>Solution 2:</strong> Use absolute values instead of increments. Set quantity = 5 (not quantity += 1).</li>
                <li><strong>Solution 3:</strong> Use CRDTs (Conflict-Free Replicated Data Types). G-Counter for increments.</li>
                <li><strong>Example:</strong> Add item with idempotency key. If key exists, return existing cart. If not, add item, store key.</li>
                <li><strong>Best practice:</strong> Prefer absolute operations over increments when possible. Easier to make idempotent.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Idempotency Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Identified non-idempotent operations</li>
          <li>✓ Implemented idempotency keys for POST operations</li>
          <li>✓ Stored idempotency results with TTL</li>
          <li>✓ Documented idempotency guarantees for API consumers</li>
          <li>✓ Used conditional requests where appropriate</li>
          <li>✓ Implemented deduplication for message processing</li>
          <li>✓ Tested retry scenarios</li>
          <li>✓ Monitored duplicate request rates</li>
          <li>✓ Set appropriate idempotency key TTL (24+ hours)</li>
          <li>✓ Handled concurrent duplicate requests (locking)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

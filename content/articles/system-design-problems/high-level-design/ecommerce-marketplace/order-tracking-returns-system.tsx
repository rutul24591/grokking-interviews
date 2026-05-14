"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-order-tracking-returns-system",
  title: "Design an Order Tracking & Returns System",
  description:
    "Architecture for an order tracking and returns system: real-time shipment tracking with carrier webhook ingestion, order status state machine, push notification pipeline for status changes, returns initiation and label generation, return status tracking, refund workflow with idempotent payment credits, exception handling for lost/damaged shipments, and multi-carrier normalization.",
  category: "high-level-design",
  subcategory: "ecommerce-marketplace",
  slug: "order-tracking-returns-system",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-11",
  tags: ["hld", "ecommerce", "order-tracking", "returns", "refunds", "shipping", "webhooks", "notifications"],
  relatedTopics: ["cart-checkout-concurrency", "inventory-aware-ui"],
};

export default function OrderTrackingReturnsSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">Order tracking and returns is the post-purchase experience layer: after a customer places an order, they want to know where it is, when it will arrive, and what to do if something goes wrong. The tracking component is primarily a data aggregation challenge — each carrier (FedEx, UPS, DHL, USPS) has a different API format, tracking event vocabulary, and webhook integration style. The returns component is a workflow orchestration challenge — a return involves discrete steps (request, approval, label generation, shipment, receipt, inspection, refund) that must be tracked and the customer must be kept informed at each step.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The post-purchase period is when customer trust is most at risk. "Where is my order?" is the most common customer support inquiry for e-commerce platforms, and a poor tracking experience (stale status, confusing carrier jargon, missing ETA) drives significant support ticket volume. A well-designed tracking UI reduces "WISMO" (Where Is My Order?) support contacts by 40–60% by giving customers accurate, timely, and actionable information proactively. The return experience similarly determines whether a customer shops again — a painful return process is one of the top reasons for customer churn.</HighlightBlock>
        <p><strong>Explicit scope:</strong> Order status state machine, carrier webhook ingestion and normalization, tracking timeline UI, returns initiation, label generation, return tracking, refund workflow. Not in scope: warehouse management, carrier selection/rate shopping, or fraud detection on returns.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Order status timeline:</strong> Visual timeline showing order states: Order Placed → Payment Confirmed → Processing → Shipped → Out for Delivery → Delivered. Each state includes timestamp and relevant details (carrier name, tracking number, estimated delivery window).</li>
          <li><strong>Real-time tracking:</strong> Map view or carrier tracking link for "Out for Delivery" orders showing current package location and stops remaining. Push notification on status change (Shipped, Out for Delivery, Delivered, Exception).</li>
          <li><strong>Multi-carrier normalization:</strong> Carrier-specific tracking events (FedEx "On FedEx vehicle for delivery", UPS "Out for Delivery", USPS "Out for Delivery Today") are normalized to a canonical event vocabulary. Carrier tracking numbers link to the carrier's own tracking page as a fallback.</li>
          <li><strong>Returns initiation:</strong> Eligible orders (delivered within return window, not final sale) show a "Return or Replace" button. User selects item(s), return reason, and preference (refund / exchange / store credit). Platform generates a return shipping label (prepaid, via carrier API) and emails it to the customer.</li>
          <li><strong>Refund workflow:</strong> When return is received and inspected at the warehouse, refund is initiated via payment provider. Refund status (Processing, Refunded) is tracked and displayed. Partial refunds for partially returned orders.</li>
          <li><strong>Exceptions:</strong> Lost or significantly delayed shipments trigger an exception state. After a configurable threshold (e.g., no carrier scan for 5 business days past EDD), the customer is proactively notified and a resolution flow is offered (reship or refund).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Tracking update latency:</strong> Carrier tracking events must appear in the customer's tracking timeline within 5 minutes of the carrier scanning the package.</li>
          <li><strong>Notification delivery:</strong> Push/email notifications for status changes (Shipped, Delivered) must reach the customer within 2 minutes of the status change being detected.</li>
          <li><strong>Refund idempotency:</strong> Refund API calls must be idempotent — retrying a failed refund must not double-refund.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The system has three subsystems. The Carrier Integration Layer normalizes tracking events from multiple carriers (via webhooks where available, polling for carriers without webhook support) into a canonical TrackingEvent schema and publishes to Kafka. The Order Status Service consumes tracking events from Kafka, advances the order state machine, and publishes OrderStatusChanged events. The Notification Service consumes OrderStatusChanged events and delivers push notifications and emails to customers. The Returns Service handles the returns workflow: creating return requests, generating labels via carrier API, tracking return shipments, and orchestrating refunds via the Payment Service. All customer-facing status is served from a Redis cache updated by the Order Status Service, enabling sub-10ms reads for the tracking page.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ecommerce-marketplace/order-tracking-returns-system.svg"
          alt="Order tracking and returns system architecture showing carrier integration layer (FedEx webhook → carrier adapter normalize events; UPS webhook → adapter; USPS polling every 5min → adapter; canonical TrackingEvent: trackingNumber eventType timestamp location description → Kafka tracking-events topic), order status state machine (ORDER_PLACED → PAYMENT_CONFIRMED → PROCESSING → SHIPPED → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED or EXCEPTION; each transition: update orders DB + update Redis cache orders:{orderId} TTL 7d + publish OrderStatusChanged Kafka; exception: no scan 5 business days past EDD → EXCEPTION state → customer notification + resolution flow), tracking timeline UI (GET /api/orders/{id}/tracking → Redis O(1) read; visual stepper component each state timestamp detail; carrier map embed for out-for-delivery; estimated delivery window from carrier EDD; status polling every 5min on active orders; SSE push on status change), notification pipeline (Kafka consumer OrderStatusChanged → notification router: shipped → email+push; out_for_delivery → push; delivered → email+push; exception → email+push+SMS; notification worker: sendgrid email Expo push Twilio SMS; dedup: check notification_sent table to prevent duplicate notifications), returns workflow (POST /api/returns {orderId items returnReason preference}; eligibility check: delivered within return_window not final_sale; label generation: POST carrier API prepaid label → PDF S3 presigned URL emailed; return tracking: carrier scan events update return_shipments table; warehouse receipt → manual or automated inspection → POST /api/returns/{id}/received → refund trigger), refund workflow (POST /api/refunds {returnId amount}; idempotency key: returnId+attempt; Stripe refund API; webhook payment_intent.refunded → update refund status; partial refund for partial returns; refund timeline shown in order detail: Refund Initiated → Processing 3-5 business days → Refunded; exception handling: damaged item policy check → full or partial refund decision), lost shipment exception (cron job: query orders where last_scan_at < now - threshold AND status != DELIVERED; batch mark EXCEPTION; publish OrderException events; customer email proactive: your order seems delayed; resolution CTA: reship or refund; reship: create new order same items warehouse fulfillment; refund: initiate payment credit)."
          caption="Carrier webhook ingestion → event normalization → Kafka, order status state machine (ORDER_PLACED → DELIVERED / EXCEPTION), tracking timeline UI (Redis cache, SSE push on status change), notification pipeline (email/push/SMS per event type), returns workflow (eligibility check → label generation → tracking → warehouse receipt → refund), idempotent refund with Stripe webhook, and lost shipment exception cron"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Carrier Integration and Event Normalization</h3>
        <HighlightBlock as="p" tier="important">Each carrier has a unique event vocabulary and delivery mechanism. FedEx provides webhooks (HTTP POST to a configured endpoint) for tracking events. UPS offers webhooks via Quantum View Notify. USPS does not provide webhooks; the USPS Tracking API must be polled. The Carrier Integration Layer abstracts these differences via per-carrier adapters. Each adapter: (1) receives carrier-native events (via webhook handler or polling scheduler), (2) maps carrier-specific event codes to the canonical vocabulary: {"{ 'PD' → 'out_for_delivery', 'DL' → 'delivered', 'OC' → 'in_transit', ... }"}, (3) extracts structured location data (city, state, country), and (4) publishes a normalized TrackingEvent to Kafka. The canonical event types are: shipment_created, picked_up, in_transit, arrival_at_hub, departure_from_hub, out_for_delivery, delivery_attempted, delivered, exception. This normalization means the rest of the system deals only with canonical events — adding a new carrier requires only a new adapter, not changes to the Order Status Service or Notification Service.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Order Status State Machine</h3>
        <HighlightBlock as="p" tier="important">The order state machine is implemented as an explicit transition table (not ad-hoc if or else logic) to prevent invalid state transitions. Valid transitions: ORDER_PLACED → PAYMENT_CONFIRMED (on payment success webhook), PAYMENT_CONFIRMED → PROCESSING (on warehouse receiving order), PROCESSING → SHIPPED (on shipment_created tracking event), SHIPPED → IN_TRANSIT (on picked_up or departure_from_hub event), IN_TRANSIT → OUT_FOR_DELIVERY (on out_for_delivery event), OUT_FOR_DELIVERY → DELIVERED (on delivered event), any state → EXCEPTION (on exception event or lost shipment detection). Invalid transitions (e.g., DELIVERED → SHIPPED) are rejected. Each valid transition writes to the order_state_history table (append-only, never updated) for auditability and to the orders table (current status). A Redis cache (HSET orders:{"{orderId}"} status currentStatus estimatedDelivery trackingUrl) is updated synchronously with each transition, serving the tracking page with &lt;10ms reads.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Returns Eligibility and Label Generation</h3>
        <HighlightBlock as="p" tier="important">Return eligibility is evaluated at request time via a rule engine: order status must be DELIVERED; order age must be within the return window (configurable per category: electronics 15 days, apparel 30 days, final sale 0 days); item must not have a previous return in terminal state (REFUNDED, EXCHANGE_SHIPPED) for the same order_item. When a user initiates a return, the Returns Service calls the carrier's label generation API (FedEx Create Shipment, UPS Label API) to create a prepaid return label. The API call creates a return shipment in the carrier's system with a pre-assigned tracking number. The label PDF is stored in S3 with a presigned URL valid for 7 days. The presigned URL is emailed to the customer and displayed on the returns page. When the customer drops off the package (carrier scan), the return tracking number begins receiving tracking events, processed by the same Carrier Integration Layer as outbound shipments — the normalization is identical.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Refund Workflow and Idempotency</h3>
        <HighlightBlock as="p" tier="important">Refunds are triggered when the warehouse marks the return as received and inspected (POST /api/returns/{"{id}"}/received with condition assessment: good, damaged, not_as_described). The Returns Service evaluates the refund policy based on condition (full refund for good condition, partial for damaged but functional, dispute for items not matching description). The refund amount is computed (full order amount, or partial if only some items returned). The Refund Service calls the payment provider&apos;s refund API with an idempotency key: return_id + attempt_number. If the API call times out and the refund is retried, the same idempotency key returns the cached result from the first attempt, the customer is not double-refunded. The payment provider fires a refund.created webhook when the refund is processed; the Refund Service updates the refund status to PROCESSED and notifies the customer via email.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Lost Shipment Exception Handling</h3>
        <HighlightBlock as="p" tier="important">A cron job runs every 4 hours and queries for shipments in IN_TRANSIT state with last_scan_at older than (estimated_delivery_date + 5 business days). These shipments are flagged as LOST_IN_TRANSIT. The customer receives a proactive notification: "Your order was expected by [date] but we haven't received delivery confirmation. We're looking into this." The notification includes a resolution CTA: "Request a replacement" or "Request a refund." This proactive approach (reaching out before the customer contacts support) dramatically reduces support ticket volume and improves customer satisfaction scores. If the customer selects replacement, a new order is created from the original order's items via the warehouse fulfillment system, and the new order's tracking replaces the lost shipment's tracking in the UI. The original shipment status is set to EXCEPTION and remains visible in order history for audit purposes.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Webhook versus polling for carrier tracking: webhooks provide near-real-time tracking updates (package scanned → webhook fires → customer sees update within minutes) but require each carrier to support webhooks and require the platform to maintain publicly accessible webhook endpoints with carrier-specific authentication. Not all carriers support webhooks; some support only polling. A polling-based fallback runs every 5 minutes for carriers without webhook support, accepting higher latency in exchange for universal coverage. For the most important tracking events (out_for_delivery, delivered), the 5-minute polling lag is generally acceptable — customers do not expect to-the-second delivery notifications. A hybrid architecture (webhooks where available, polling as fallback) provides the best balance of timeliness and coverage.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Return window enforcement: the return eligibility rule engine evaluates rules server-side at return initiation time. Client-side enforcement (hiding the "Return" button after the return window closes) is UX convenience only — not security. A malicious user could call the returns API directly after the window closes. Server-side validation with the current timestamp (not a cached or pre-computed eligibility flag) is required for correctness. The UI refreshes eligibility on page load to ensure the displayed state matches server state, but the authoritative check is always server-side.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">An order tracking and returns system normalizes multi-carrier tracking events (per-carrier adapters mapping to canonical vocabulary → Kafka) and drives an order state machine (append-only state history, Redis cache for sub-10ms reads). The tracking timeline UI is served from Redis with SSE push for status changes (&lt;5-minute update latency from carrier scan). Notifications are event-driven (Kafka consumer → notification router → email/push/SMS per event type, deduplication table prevents duplicates). Returns initiation evaluates eligibility server-side (status + window + prior returns), generates prepaid labels via carrier API (PDF to S3 presigned URL emailed), and tracks return shipments through the same normalization pipeline. Refunds are idempotent (returnId + attempt idempotency key to payment provider) triggered on warehouse receipt inspection, confirmed via payment webhook. Lost shipments are proactively detected by a 4-hour cron (last_scan_at + 5 business days past EDD) with customer-facing resolution flow (reship or refund). The defining design goal: eliminate WISMO ("Where Is My Order?") support tickets by surfacing timely, accurate, and actionable tracking information proactively — before customers need to ask.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

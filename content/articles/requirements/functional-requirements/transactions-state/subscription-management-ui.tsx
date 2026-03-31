"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-subscription-management-ui",
  title: "Subscription Management UI",
  description:
    "Comprehensive guide to implementing subscription management interfaces covering plan selection, upgrade/downgrade flows, billing management, cancellation flows with retention, and self-service subscription controls for SaaS and membership businesses.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "subscription-management-ui",
  version: "extensive",
  wordCount: 5800,
  readingTime: 23,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "subscription",
    "billing",
    "frontend",
    "plan-management",
    "customer-self-service",
  ],
  relatedTopics: ["subscription-billing", "payment-ui", "customer-portal", "retention-strategies"],
};

export default function SubscriptionManagementUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Subscription management UI enables customers to self-serve their subscription: view current plan, upgrade or downgrade, manage billing, and cancel. A well-designed subscription management UI reduces support tickets (customers can help themselves), improves retention (easy upgrades, frictionless downgrades), and builds trust (transparent pricing, no hidden fees). For staff and principal engineers, subscription management UI involves pricing complexity (proration, effective dates), billing integration (payment method updates, invoice access), and retention strategy (cancellation flow with save offers).
        </p>
        <p>
          The complexity of subscription management UI extends beyond simple plan display. Proration calculation must be transparent (show credit for unused time, charge for new plan). Effective date must be clear (change now vs. next billing cycle). Billing management requires secure payment method updates (PCI compliance), invoice access (download PDF), and billing history (past charges). Cancellation flow requires retention offers (discount, pause, feature downgrade) without dark patterns (no guilt trips, no hidden cancellation). The UI must handle edge cases (mid-cycle changes, annual to monthly switch, team seat changes) gracefully with clear communication.
        </p>
        <p>
          For staff and principal engineers, subscription management UI architecture involves backend integration (subscription API, billing API), state management (current plan, pending changes, billing status), and retention logic (cancellation survey, save offers, win-back). The UI must support multiple subscription types (individual, team, enterprise), billing frequencies (monthly, annual), and add-ons (extra seats, premium features). Analytics track plan changes (upgrade rate, downgrade rate, churn), cancellation reasons (too expensive, not using, switched competitor), and retention effectiveness (save offer acceptance rate).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Plan Display and Comparison</h3>
        <p>
          Current plan display shows active subscription details. Plan name (Pro, Business, Enterprise), price ($29/month), billing frequency (monthly, annual), next billing date (Dec 15, 2024), features included (10 seats, 100GB storage, priority support). Status indicators: active (green), past_due (yellow), cancelled (gray, ends on date). Action buttons: upgrade (move to higher plan), downgrade (move to lower plan), cancel (end subscription).
        </p>
        <p>
          Plan comparison shows available plans side-by-side. Columns: plan name, price, features, action (select). Features listed: seats, storage, support level, advanced features (SSO, API access, custom branding). Highlight current plan (border, &quot;Current&quot; badge). Highlight recommended plan (&quot;Most Popular&quot; badge). Price display: monthly price, annual price (show savings, &quot;Save 20% with annual&quot;). Feature comparison: checkmarks for included, X for not included, tooltip for feature details.
        </p>
        <p>
          Feature gating shows what&apos;s included vs. upgrade required. Included features: full access (click to use). Upgrade features: locked icon, &quot;Upgrade to access&quot; tooltip. Usage limits: progress bar (8/10 seats used, 80GB/100GB storage used), &quot;Upgrade for more&quot; link. Feature previews: show locked features with description (&quot;SSO: Enable single sign-on for your team&quot;), upgrade CTA.
        </p>

        <h3 className="mt-6">Upgrade Flow</h3>
        <p>
          Upgrade initiation starts plan change. Entry points: current plan page (&quot;Upgrade&quot; button), feature gate (&quot;Upgrade to access&quot;), usage limit (&quot;Upgrade for more&quot;), pricing page (&quot;Select&quot; button). Upgrade flow: select new plan, review changes (price difference, new features), confirm (immediate or next billing), payment (if additional charge).
        </p>
        <p>
          Proration display shows credit and charge. Credit: unused time on current plan ($29/month × 15/30 days = $14.50 credit). Charge: new plan remaining time ($99/month × 15/30 days = $49.50 charge). Net: charge - credit = $35.00 due today. Effective date: immediate (access now, charged now) or next billing (access next cycle, charged next cycle). Display: clear breakdown (&quot;You&apos;ll be charged $35.00 today&quot;), next billing date, new recurring price.
        </p>
        <p>
          Upgrade confirmation confirms plan change. Success message: &quot;You&apos;ve upgraded to Business plan&quot;. Access: new features unlocked immediately (if immediate upgrade). Receipt: email sent, invoice available (download PDF). Next billing: date, amount ($99/month starting Jan 1). Action buttons: manage subscription (back to plan page), explore features (tour of new features), dismiss (close modal).
        </p>

        <h3 className="mt-6">Downgrade Flow</h3>
        <p>
          Downgrade initiation starts plan reduction. Entry points: current plan page (&quot;Downgrade&quot; button), billing settings (&quot;Change plan&quot;), cost reduction (customer wants to save). Downgrade flow: select lower plan, review changes (price difference, features lost), confirm (end of period or immediate), confirmation (downgrade scheduled).
        </p>
        <p>
          Feature loss warning shows what will be lost. Current features: list included features in current plan. Lost features: list features not in lower plan (SSO, priority support, advanced analytics). Usage impact: &quot;You have 10 seats, Basic plan includes 3 seats. Remove 7 team members before downgrade&quot;. Data impact: &quot;You have 150GB storage, Basic plan includes 10GB. Download or delete 140GB before downgrade&quot;. Acknowledgment: checkbox (&quot;I understand I will lose these features&quot;).
        </p>
        <p>
          Effective date options for downgrade. End of period: downgrade at next billing cycle (keep current features until then, no proration). Immediate: downgrade now (lose features now, prorated credit). Recommendation: end of period (customer keeps paid features, no disruption). Display: &quot;Downgrade on Dec 15 (next billing)&quot; vs. &quot;Downgrade now (credit $14.50)&quot;.
        </p>

        <h3 className="mt-6">Billing Management</h3>
        <p>
          Payment method management handles billing details. Current payment method: card type logo (Visa), last 4 digits (•••• 1234), expiry (12/25), billing address. Update: add new card (PCI-compliant form), select from saved cards, remove card (if multiple). Default: set default card (for multiple cards). Expiry notification: &quot;Card expires in 30 days, please update&quot; (email, in-app).
        </p>
        <p>
          Billing history shows past charges. Table: date, description (Pro Plan - Monthly), amount ($29.00), status (paid, failed, refunded), invoice (download PDF). Filters: date range, plan, status. Search: by invoice number, amount, date. Export: CSV for accounting (date, description, amount, category). Payment failure: &quot;Payment failed, please update card&quot; (retry button, update card link).
        </p>
        <p>
          Invoice access provides billing documents. Invoice list: invoice number, date, amount, status (paid, pending), download button (PDF). Invoice content: company info, billing address, line items (plan, seats, add-ons), taxes, total, payment method. Delivery: email (automatic), download (on-demand), API (for accounting integration). Customization: company logo, tax ID, purchase order number (for enterprise).
        </p>

        <h3 className="mt-6">Cancellation Flow</h3>
        <p>
          Cancellation initiation starts subscription end. Entry points: current plan page (&quot;Cancel&quot; button), billing settings (&quot;Cancel subscription&quot;), account settings (&quot;Close account&quot;). Cancellation flow: reason survey (why cancel), retention offer (discount, pause, downgrade), confirmation (confirm cancellation), effective date (end of period or immediate).
        </p>
        <p>
          Reason survey captures cancellation reason. Options: too expensive (price concern), not using (low engagement), missing features (product gap), switched competitor (competitor win), technical issues (support needed), other (open text). Follow-up: &quot;What made it too expensive?&quot; (budget cut, competitor cheaper, not enough value). Open text: &quot;Anything else we should know?&quot; (product feedback). Analytics: track reasons (improve product, pricing, retention).
        </p>
        <p>
          Retention offers attempt to save customer. Discount: 20-50% off for 3-6 months (&quot;Get 50% off for 3 months&quot;). Pause: pause subscription for 1-3 months (&quot;Pause for up to 3 months&quot;). Downgrade: move to lower plan (&quot;Try Basic plan for $9/month&quot;). Feature unlock: temporary access to premium features (&quot;Get Pro features free for 1 month&quot;). Acceptance: track offer acceptance rate (optimize offers). Ethics: no dark patterns (no guilt trips, easy to decline).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Subscription management UI architecture spans plan display, upgrade/downgrade flows, billing management, and cancellation. Plan display fetches current plan, available plans, features. Upgrade/downgrade flows handle plan changes, proration, effective dates. Billing management handles payment methods, invoices, billing history. Cancellation handles reason survey, retention offers, subscription end.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/subscription-management-ui/subscription-management-architecture.svg"
          alt="Subscription Management Architecture"
          caption="Figure 1: Subscription Management Architecture — Plan display, upgrade/downgrade flows, billing management, and cancellation"
          width={1000}
          height={500}
        />

        <h3>Plan Display Component</h3>
        <p>
          Current plan card displays active subscription. Plan name, price, billing frequency, next billing date. Status badge (active, past_due, cancelled). Feature list: included features (checkmarks), usage (seats used, storage used). Action buttons: upgrade, downgrade, cancel, manage billing. Loading state: skeleton loader (plan details loading). Error state: &quot;Failed to load plan, retry&quot; (API failure).
        </p>
        <p>
          Plan comparison table shows available plans. Columns: plan name, price, features, action. Rows: each available plan (Free, Pro, Business, Enterprise). Highlighting: current plan (border, &quot;Current&quot; badge), recommended plan (&quot;Most Popular&quot; badge). Feature toggle: show all features vs. key features only. Mobile: stacked cards (swipe horizontally), collapsed features (expand for details).
        </p>
        <p>
          Feature gating controls access. Included features: enabled (click to navigate). Upgrade features: disabled (grayed out), lock icon, tooltip (&quot;Upgrade to access&quot;). Usage limits: progress bar (80% used), warning color (90%+ used), &quot;Upgrade&quot; link. Feature preview: modal with feature description, benefits, upgrade CTA (&quot;Upgrade to access this feature&quot;).
        </p>

        <h3 className="mt-6">Upgrade/Downgrade Flow</h3>
        <p>
          Plan selection step shows available plans. Current plan: highlighted (&quot;Current Plan&quot;). Target plan: selected (radio button, highlight). Plan details: price, features, billing frequency toggle (monthly/annual). Proration preview: &quot;Upgrade now: $35 due today&quot; or &quot;Upgrade on Dec 15: no charge today&quot;. Navigation: back (cancel flow), next (review changes).
        </p>
        <p>
          Review step shows changes summary. Price change: current ($29/month) → new ($99/month), proration ($35 due today), next billing ($99/month starting Jan 1). Feature change: new features (SSO, priority support), lost features (none for upgrade, list for downgrade). Effective date: immediate or end of period. Navigation: back (change plan), confirm (execute change).
        </p>
        <p>
          Confirmation step executes plan change. Payment: if additional charge (payment form, saved card selection). Execution: API call (update subscription), loading state (updating plan). Success: confirmation message, email sent, invoice available. Error: &quot;Failed to update plan, please try again&quot; (payment failure, API error), retry option. Post-change: new features unlocked (upgrade), access until period end (downgrade).
        </p>

        <h3 className="mt-6">Billing Management</h3>
        <p>
          Payment method form handles card updates. Form fields: card number, expiry, CVV, billing address, name on card. Validation: real-time (Luhn algorithm, expiry date), on submit (all fields). PCI compliance: hosted fields (Stripe Elements), tokenization (no raw card data). Save option: &quot;Save for future payments&quot; (checked by default). Error handling: specific errors (&quot;Card number invalid&quot;), preserve data (don&apos;t clear on error).
        </p>
        <p>
          Billing history table shows past charges. Columns: date, description, amount, status, invoice. Sorting: by date (newest first), amount (highest first). Filtering: by status (paid, failed, refunded), date range, plan. Pagination: 10-20 per page, load more (infinite scroll). Export: CSV download (for accounting), email invoice (send to accountant).
        </p>
        <p>
          Invoice viewer displays invoice details. Invoice content: company info, billing address, line items, taxes, total, payment method. Actions: download PDF, print, email (send to colleague, accountant). Navigation: previous/next invoice, back to billing history. Loading: skeleton loader (invoice loading). Error: &quot;Failed to load invoice, retry&quot; (PDF generation failure).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/subscription-management-ui/cancellation-flow.svg"
          alt="Cancellation Flow"
          caption="Figure 2: Cancellation Flow — Reason survey, retention offers, confirmation, and effective date"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Cancellation Flow</h3>
        <p>
          Reason survey captures feedback. Question: &quot;Why are you cancelling?&quot;. Options: too expensive, not using, missing features, switched competitor, technical issues, other. Follow-up: dynamic based on selection (&quot;What&apos;s your budget?&quot; for too expensive, &quot;What features are missing?&quot; for missing features). Open text: &quot;Anything else?&quot; (optional). Analytics: track reasons (improve product, pricing).
        </p>
        <p>
          Retention offer step presents save options. Offer display: discount (50% off for 3 months), pause (pause for 3 months), downgrade (try Basic for $9/month). Benefits: &quot;Keep your data&quot;, &quot;No setup fee to return&quot;, &quot;Special offer for valued customers&quot;. Accept: select offer, confirm (apply offer). Decline: &quot;No thanks, continue to cancel&quot; (no guilt, no multiple declines).
        </p>
        <p>
          Confirmation step finalizes cancellation. Warning: &quot;You&apos;ll lose access to [features] on [date]&quot;, &quot;Download your data before [date]&quot;. Effective date: end of period (access until Dec 15) or immediate (access ends now, prorated refund). Confirmation: &quot;Cancel subscription&quot; button (red, clear action). Post-cancellation: confirmation message, email sent, data download link, win-back offer (return within 30 days, get 50% off).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/subscription-management-ui/plan-comparison.svg"
          alt="Plan Comparison"
          caption="Figure 3: Plan Comparison — Current plan, available plans, features, and pricing"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Subscription management UI design involves trade-offs between flexibility, simplicity, retention, and customer experience. Understanding these trade-offs enables informed decisions aligned with business model and customer expectations.
        </p>

        <h3>Effective Date: Immediate vs. End of Period</h3>
        <p>
          Immediate effective date (change now). Pros: Customer gets access now (upgrade), credit applied now (downgrade), clear billing (charged now). Cons: Disruption (downgrade loses features now), proration complexity (calculate credit/charge), support tickets (&quot;Why did I lose features?&quot;). Best for: Upgrades (customer wants access now), simple plans (no proration).
        </p>
        <p>
          End of period effective date (change at next billing). Pros: No disruption (keep paid features until period end), no proration (simpler billing), fewer support tickets (clear timing). Cons: Delayed access (upgrade waits), delayed savings (downgrade waits), customer confusion (&quot;When does change take effect?&quot;). Best for: Downgrades (customer keeps paid features), most production systems.
        </p>
        <p>
          Customer choice (select effective date). Pros: Customer control (choose what works), flexibility (immediate for upgrade, end of period for downgrade). Cons: Complexity (two options to explain), support tickets (&quot;Which should I choose?&quot;). Best for: Most production systems—default to end of period, offer immediate for upgrades.
        </p>

        <h3>Retention Offers: Aggressive vs. Minimal</h3>
        <p>
          Aggressive retention (multiple offers, multiple steps). Pros: Higher save rate (more offers, more chances), data collection (why customers leave). Cons: Customer frustration (hard to cancel, feels manipulative), brand damage (dark patterns, negative reviews). Best for: High-churn businesses (need saves), short-term metrics focus.
        </p>
        <p>
          Minimal retention (one offer, easy decline). Pros: Customer-friendly (easy to cancel, no pressure), brand trust (transparent, respectful). Cons: Lower save rate (fewer offers), may leave saves on table. Best for: Most production systems—balance retention with customer experience.
        </p>
        <p>
          Targeted retention (offer based on reason, customer value). Pros: Relevant offers (price offer for &quot;too expensive&quot;, feature offer for &quot;missing features&quot), higher save rate (right offer, right customer). Cons: Complexity (reason-based logic, customer segmentation). Best for: Most production systems—offer based on reason, customer LTV.
        </p>

        <h3>Proration Display: Detailed vs. Simplified</h3>
        <p>
          Detailed proration (line-item breakdown). Pros: Transparent (customer sees exact calculation), fewer disputes (clear charges). Cons: Complexity (customer may not understand), decision paralysis (too much info). Best for: B2B (accounting needs details), high-value plans (customers want transparency).
        </p>
        <p>
          Simplified proration (net charge only). Pros: Simple (one number to understand), faster decision (less info to process). Cons: Less transparent (customer may wonder how calculated), potential disputes (&quot;Why this amount?&quot;). Best for: B2C (simplicity priority), low-value plans (not worth detailed breakdown).
        </p>
        <p>
          Hybrid (detailed on demand). Pros: Simple default (net charge), detailed on click (&quot;How calculated?&quot; tooltip/modal). Cons: Complexity (two views to maintain). Best for: Most production systems—show net charge, detailed breakdown on demand.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/subscription-management-ui/retention-strategies.svg"
          alt="Retention Strategies"
          caption="Figure 4: Retention Strategies — Discount, pause, downgrade, and feature unlock offers"
          width={1000}
          height={450}
        />

        <h3>Feature Gating: Hard vs. Soft</h3>
        <p>
          Hard gating (feature completely disabled). Pros: Clear upgrade incentive (can&apos;t access without upgrade), protects premium value. Cons: Customer frustration (can&apos;t try before buy), support tickets (&quot;How do I access?&quot;). Best for: Core premium features (SSO, advanced analytics), clear value differentiation.
        </p>
        <p>
          Soft gating (preview with limitation). Pros: Try before buy (see feature value), lower upgrade friction. Cons: Complex implementation (partial access), may reduce upgrade incentive (preview sufficient). Best for: New features (build demand), features with network effects (collaboration tools).
        </p>
        <p>
          Time-limited access (free trial of premium). Pros: Full experience (try all features), time pressure (upgrade before trial ends). Cons: Complexity (trial management), may not convert (use trial, cancel). Best for: New customers (onboarding), enterprise sales (prove value).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Make plan comparison clear:</strong> Side-by-side comparison, highlight current plan, highlight recommended plan. Show features with checkmarks/X, tooltips for details. Price display: monthly and annual (show savings).
          </li>
          <li>
            <strong>Show proration transparently:</strong> Breakdown: credit (unused time), charge (new plan), net (due today). Effective date: immediate or end of period (customer choice for upgrades). Tooltip: &quot;How calculated&quot; (detailed breakdown).
          </li>
          <li>
            <strong>Warn about feature loss:</strong> Downgrade: list lost features, usage impact (remove seats, delete data). Acknowledgment: checkbox (&quot;I understand&quot;). Effective date: end of period (keep paid features).
          </li>
          <li>
            <strong>Secure payment method updates:</strong> PCI compliance (hosted fields, tokenization). Save multiple cards (default selection). Expiry notification (30 days before). Error handling: specific errors, preserve data.
          </li>
          <li>
            <strong>Provide billing history:</strong> Table: date, description, amount, status, invoice. Filters: date range, status, plan. Export: CSV for accounting. Invoice download: PDF, email.
          </li>
          <li>
            <strong>Make cancellation easy:</strong> Clear entry point (no hiding), simple flow (few steps), no dark patterns (no guilt trips). Confirmation: clear effective date, data download link.
          </li>
          <li>
            <strong>Use targeted retention:</strong> Reason survey (why cancel), offer based on reason (discount for &quot;too expensive&quot;, pause for &quot;not using&quot;). Customer value: high LTV (better offers), low LTV (standard offers).
          </li>
          <li>
            <strong>Track subscription metrics:</strong> Upgrade rate, downgrade rate, churn rate, retention rate. Cancellation reasons (improve product, pricing). Save offer acceptance rate (optimize offers).
          </li>
          <li>
            <strong>Support team subscriptions:</strong> Seat management (add/remove seats), role-based access (admin, member), billing contact (separate from users). Usage visibility (seats used, storage used).
          </li>
          <li>
            <strong>Localize for international:</strong> Currency (customer&apos;s currency), language (customer&apos;s language), tax (local tax calculation), payment methods (local preferences).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Hidden cancellation:</strong> Hard to find, multiple steps, requires call. Solution: Clear entry point, self-service, no dark patterns.
          </li>
          <li>
            <strong>Unclear proration:</strong> Customer doesn&apos;t understand charge. Solution: Transparent breakdown, tooltip (&quot;How calculated&quot;), effective date clear.
          </li>
          <li>
            <strong>No feature loss warning:</strong> Customer downgrades, loses data. Solution: Warning before downgrade, usage impact, acknowledgment required.
          </li>
          <li>
            <strong>Insecure payment updates:</strong> Raw card data on server. Solution: Hosted fields, tokenization, PCI compliance.
          </li>
          <li>
            <strong>No billing history:</strong> Customer can&apos;t find invoices. Solution: Billing history table, invoice download, export for accounting.
          </li>
          <li>
            <strong>Aggressive retention:</strong> Multiple steps, guilt trips, hard to decline. Solution: One offer, easy decline, no dark patterns.
          </li>
          <li>
            <strong>No usage visibility:</strong> Customer doesn&apos;t know they&apos;re near limit. Solution: Progress bars, usage alerts, upgrade prompt before limit.
          </li>
          <li>
            <strong>No team support:</strong> Individual UI for team plans. Solution: Seat management, role-based access, billing contact separate.
          </li>
          <li>
            <strong>No localization:</strong> USD only, English only. Solution: Multiple currencies, languages, local payment methods, tax calculation.
          </li>
          <li>
            <strong>No analytics:</strong> Don&apos;t track plan changes, churn, retention. Solution: Track metrics, cancellation reasons, save offer acceptance.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Stripe Billing Customer Portal</h3>
        <p>
          Stripe Customer Portal: self-service subscription management. Features: view current plan, upgrade/downgrade, update payment method, view billing history, download invoices, cancel subscription. Proration: transparent breakdown, effective date choice. Retention: customizable save offers. Localization: multiple currencies, languages, payment methods.
        </p>

        <h3 className="mt-6">Netflix Plan Management</h3>
        <p>
          Netflix plan management: simple upgrade/downgrade. Features: view current plan (Basic, Standard, Premium), upgrade (more screens, better quality), downgrade (end of period), update payment method, view billing history. No proration (changes at period end). Cancellation: easy (few steps), effective date (end of period), win-back (email offers).
        </p>

        <h3 className="mt-6">Slack Workspace Management</h3>
        <p>
          Slack workspace management: team subscription controls. Features: view current plan (Free, Pro, Business), upgrade (add features), downgrade (end of period), manage seats (add/remove), view billing history, download invoices. Seat-based pricing (per user). Role-based access (workspace admin, billing admin). Usage visibility (message history, integrations).
        </p>

        <h3 className="mt-6">Spotify Premium Management</h3>
        <p>
          Spotify Premium management: individual and family plans. Features: view current plan (Free, Premium, Family), upgrade (ad-free, offline), downgrade (end of period), update payment method, manage family members (add/remove). Student discount (verification required). Cancellation: easy, effective date (end of period), win-back (discount offers).
        </p>

        <h3 className="mt-6">Zoom Subscription Management</h3>
        <p>
          Zoom subscription management: individual and team plans. Features: view current plan (Basic, Pro, Business), upgrade (more participants, features), downgrade (end of period), manage hosts (add/remove), view billing history, download invoices. Usage visibility (meeting minutes, participants). Retention: discount offers, pause option.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle proration for plan changes?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Calculate credit (unused time on current plan) and charge (new plan remaining time). Display: credit ($14.50), charge ($49.50), net ($35.00 due today). Effective date: immediate (charged now, access now) or end of period (charged next cycle, access next cycle). Tooltip: &quot;How calculated&quot; (detailed breakdown). Invoice: line item for proration charge.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design cancellation flow?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Entry point: clear (no hiding). Flow: reason survey (why cancel), retention offer (discount, pause, downgrade), confirmation (effective date). Ethics: no dark patterns (no guilt trips, easy to decline offers). Effective date: end of period (access until period end). Post-cancellation: confirmation email, data download link, win-back offer.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle downgrade with usage impact?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Warning before downgrade: list lost features, usage impact (&quot;You have 10 seats, Basic includes 3. Remove 7 members&quot;), data impact (&quot;You have 150GB, Basic includes 10GB. Download or delete 140GB&quot;). Acknowledgment: checkbox (&quot;I understand&quot;). Effective date: end of period (keep paid features). Block if usage exceeds new plan (force reduction first).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement retention offers?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Reason-based: discount for &quot;too expensive&quot;, pause for &quot;not using&quot;, feature unlock for &quot;missing features&quot;. Customer value: high LTV (better offers), low LTV (standard offers). Display: one offer (not overwhelming), easy decline (no pressure). Analytics: track acceptance rate (optimize offers), reason distribution (improve product).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you support team subscriptions?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Seat management: add/remove seats, prorated charges. Role-based access: admin (manage plan, billing), member (use features). Billing contact: separate from users (receive invoices). Usage visibility: seats used, storage used, features used. Notifications: seat limit reached, billing failed (admin only).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track subscription metrics?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Plan changes: upgrade rate, downgrade rate, effective date distribution. Churn: cancellation rate, churn reasons (too expensive, not using, competitor). Retention: save offer acceptance rate, offer type effectiveness. Revenue: MRR, ARR, expansion revenue (upgrades), contraction revenue (downgrades). Dashboard: trends over time, cohort analysis.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://stripe.com/docs/billing/subscriptions/customer-portal"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe — Customer Portal Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.chargebee.com/docs/2.0/customer-portal.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chargebee — Customer Portal Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.profitwell.com/recur/all/customer-retention-strategies"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ProfitWell — Customer Retention Strategies
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/cancellation-flow/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Cancellation Flow Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.paddle.com/resources/subscription-retention-strategies"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Paddle — Subscription Retention Strategies
            </a>
          </li>
          <li>
            <a
              href="https://www.recurly.com/publish/subscription-management/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Recurly — Subscription Management Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

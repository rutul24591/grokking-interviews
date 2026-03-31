"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-transaction-fraud-detection",
  title: "Transaction Fraud Detection",
  description:
    "Comprehensive guide to implementing transaction fraud detection covering fraud signals, risk scoring models, machine learning approaches, rule engines, velocity checks, device fingerprinting, and balancing fraud prevention with customer experience.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "transaction-fraud-detection",
  version: "extensive",
  wordCount: 6400,
  readingTime: 26,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "fraud",
    "security",
    "backend",
    "machine-learning",
    "risk-scoring",
  ],
  relatedTopics: ["payment-processing", "risk-management", "machine-learning", "security"],
};

export default function TransactionFraudDetectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Transaction fraud detection identifies and prevents fraudulent transactions through risk scoring, pattern detection, and machine learning models. Fraud costs merchants billions annually—chargebacks, fees, lost merchandise, and reputational damage. For staff and principal engineers, fraud detection involves balancing fraud prevention (block fraudulent transactions) with customer experience (don&apos;t block legitimate transactions). False positives (legitimate transactions blocked) cost sales and customer trust. False negatives (fraudulent transactions approved) cost chargebacks and merchandise. The system must detect fraud in real-time (&lt;500ms for checkout), adapt to evolving fraud patterns, and comply with regulations (GDPR for data usage, PSD2 for SCA exemptions).
        </p>
        <p>
          The complexity of fraud detection extends beyond simple rule-based systems. Fraud signals include velocity (multiple transactions in short time), location (mismatch between billing/shipping/IP), amount (unusual for customer/product), device (new device, suspicious fingerprint), and behavior (rush shipping, high-value items). Machine learning models analyze historical fraud data to identify patterns humans miss. Rule engines encode business knowledge (block transactions over $X from high-risk countries). The system must handle concept drift (fraud patterns change over time), adversarial attacks (fraudsters adapt to detection), and data quality issues (incomplete signals, noisy labels).
        </p>
        <p>
          For staff and principal engineers, fraud detection architecture involves distributed systems patterns. Real-time scoring requires low-latency feature computation (aggregate transaction history in &lt;100ms). Model serving requires high availability (fraud scoring can&apos;t fail open). Feedback loops capture fraud outcomes (chargeback, confirmed fraud) to retrain models. The system must support multiple risk thresholds (auto-approve &lt;30, review 30-70, decline &gt;70), manual review workflows (fraud analyst queue), and integration with payment gateways (3D Secure for high-risk transactions).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Fraud Signals and Features</h3>
        <p>
          Transaction features capture fraud indicators. Amount: absolute amount, relative to customer history (unusual high amount), relative to product (high-value items targeted). Velocity: transactions per hour/day, amount per hour/day, failed attempts before success. Location: billing vs. shipping mismatch, IP geolocation vs. billing address, proxy/VPN detection, high-risk country. Device: new device (first seen), device fingerprint (browser, OS, screen resolution), device velocity (same device, multiple accounts).
        </p>
        <p>
          Customer history features capture behavioral patterns. Account age (new accounts higher risk), purchase history (first purchase vs. repeat customer), average order value (current vs. historical), typical shipping address (new address vs. saved), typical payment method (new card vs. saved card). Behavioral biometrics: typing speed, mouse movements, copy-paste usage (fraudsters copy card numbers). Session data: time on page (rush checkout), navigation pattern (direct to checkout vs. browsing).
        </p>
        <p>
          Network features capture relationships between entities. Email velocity (same email, multiple accounts), phone velocity (same phone, multiple accounts), address velocity (same address, multiple accounts), card velocity (same card, multiple accounts). Graph features: connected components (fraud rings), centrality (hub accounts), community detection (fraud clusters). Network features require graph database or specialized feature store for real-time computation.
        </p>

        <h3 className="mt-6">Risk Scoring Models</h3>
        <p>
          Risk score quantifies fraud likelihood (0-100, higher = more risky). Score calculation: weighted sum of features (logistic regression), decision tree ensemble (random forest, gradient boosting), neural network (deep learning). Score interpretation: 0-30 low risk (auto-approve), 30-70 medium risk (manual review), 70-100 high risk (auto-decline). Thresholds tuned based on business tolerance (higher thresholds = more fraud, lower thresholds = more false positives).
        </p>
        <p>
          Model types vary by complexity and interpretability. Logistic regression: simple, interpretable (feature weights), fast scoring. Limited accuracy for complex patterns. Random forest: ensemble of decision trees, higher accuracy, feature importance. Gradient boosting (XGBoost, LightGBM): state-of-the-art for tabular data, high accuracy, handles missing values. Neural network: captures complex patterns, requires large data, less interpretable. Hybrid: rules for clear fraud, ML for edge cases.
        </p>
        <p>
          Model training requires labeled data (fraud vs. legitimate). Labels from chargebacks (confirmed fraud), manual review (analyst decisions), customer reports (unauthorized transaction). Class imbalance: fraud is rare (0.1-1% of transactions), requires techniques (oversampling, undersampling, class weights). Feature engineering: domain knowledge (velocity features, network features), automated feature generation (feature crosses, aggregations). Model evaluation: precision (fraud detected / flagged), recall (fraud detected / total fraud), AUC-ROC (overall discrimination).
        </p>

        <h3 className="mt-6">Rule Engine</h3>
        <p>
          Rule engine encodes business knowledge for fraud detection. Rules: IF condition THEN action (approve, decline, review). Simple rules: amount &gt; $1000 AND new customer → review. Complex rules: velocity &gt; 5 transactions/hour AND different cards → decline. Rules are interpretable (analysts understand why declined), auditable (compliance), and fast (simple conditions). Rules catch clear fraud (stolen card testing, high-risk patterns) before ML scoring.
        </p>
        <p>
          Rule management requires versioning and testing. Rule versioning: track rule changes (who, when, why), rollback capability (revert bad rules). A/B testing: test new rules on subset of traffic, measure impact (fraud caught, false positives). Rule conflict resolution: priority ordering (high-priority rules first), mutually exclusive rules (only one rule fires). Rule performance monitoring: fire rate (how often rule triggers), precision (fraud caught / rule fires), false positive rate (legitimate / rule fires).
        </p>
        <p>
          Rule categories organize detection logic. Velocity rules: multiple transactions, multiple cards, multiple accounts. Location rules: high-risk country, billing/shipping mismatch, proxy/VPN. Amount rules: unusually high, round amounts (fraudsters test with round numbers). Device rules: new device, device velocity, suspicious fingerprint. Product rules: high-value items (electronics, gift cards), rush shipping (fraudsters want fast delivery).
        </p>

        <h3 className="mt-6">Device Fingerprinting</h3>
        <p>
          Device fingerprinting identifies devices across sessions. Browser fingerprint: user agent, screen resolution, timezone, installed fonts, browser plugins. Canvas fingerprint: render hidden canvas, hash pixel data (unique per device). WebGL fingerprint: GPU capabilities, renderer info. Audio fingerprint: audio context processing (unique per device). Combined fingerprint: hash of multiple signals (more stable than single signal).
        </p>
        <p>
          Fingerprint stability balances accuracy with privacy. Stable fingerprint: persists across browser restarts, cookie clearing (good for fraud detection). Unstable fingerprint: changes frequently (bad for fraud detection). Privacy considerations: GDPR requires consent for fingerprinting, some browsers block fingerprinting (Safari ITP, Firefox ETP). Fingerprint usage: identify returning devices, detect device velocity (same device, multiple accounts), link fraudulent sessions.
        </p>
        <p>
          Device reputation scores device trustworthiness. New device: first seen, higher risk (no history). Known device: previous legitimate transactions, lower risk. Suspicious device: associated with fraud, blocked. Device graph: link devices to accounts, cards, addresses. Fraud ring detection: multiple devices sharing signals (same IP, same fingerprint components).
        </p>

        <h3 className="mt-6">Velocity Checks</h3>
        <p>
          Velocity checks detect rapid-fire fraud attempts. Transaction velocity: transactions per minute/hour/day from same customer/card/device. Amount velocity: total amount per minute/hour/day. Failed attempt velocity: failed payments before success (fraudsters test stolen cards). Account creation velocity: new accounts per minute/hour (fraud rings create bulk accounts).
        </p>
        <p>
          Velocity windows define time ranges for counting. Short window (1 minute, 5 minutes): catch burst fraud (card testing, bot attacks). Medium window (1 hour, 1 day): catch sustained fraud (multiple transactions over hours). Long window (1 week, 1 month): catch patterns (weekly fraud attempts). Multiple windows: combine short + medium + long (catch different fraud patterns).
        </p>
        <p>
          Velocity aggregation levels define what to count. Per customer: transactions from same account. Per card: transactions from same card number. Per device: transactions from same device. Per IP: transactions from same IP address. Per email: transactions from same email. Cross-level: same card, different accounts (card testing), same device, different cards (fraud ring).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Fraud detection architecture spans feature computation, rule engine, ML scoring, and decision orchestration. Feature computation aggregates transaction history, computes velocity features, enriches with external data (IP geolocation, device reputation). Rule engine evaluates business rules (clear fraud patterns). ML scoring computes risk score (probability of fraud). Decision orchestration combines rules + score → decision (approve, decline, review).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/transaction-fraud-detection/fraud-detection-architecture.svg"
          alt="Fraud Detection Architecture"
          caption="Figure 1: Fraud Detection Architecture — Feature computation, rule engine, ML scoring, and decision orchestration"
          width={1000}
          height={500}
        />

        <h3>Feature Computation</h3>
        <p>
          Real-time feature computation aggregates transaction data. Transaction features: amount, currency, product category, shipping method. Customer features: account age, purchase count, total spend, average order value. Velocity features: transactions last hour/day, amount last hour/day, failed attempts last hour. Computation: stream processing (Flink, Kafka Streams) for low-latency, or pre-computed aggregates (Redis) for fast lookup.
        </p>
        <p>
          Feature enrichment adds external data. IP geolocation: country, city, ISP, proxy/VPN detection (MaxMind, IPQualityScore). Device fingerprint: browser, OS, device ID (FingerprintJS, ThreatMetrix). Email validation: valid domain, disposable email, email age (ZeroBounce, Kickbox). Phone validation: valid number, VOIP vs. mobile, phone risk score (Twilio, Telesign).
        </p>
        <p>
          Feature store manages features for training and serving. Training: historical features (reproducible, point-in-time correct). Serving: real-time features (low-latency, consistent with training). Feature consistency: same computation for training and serving (prevent training-serving skew). Feature versioning: track feature changes (who, when, why). Feature monitoring: data quality (missing values, outliers), drift (distribution changes).
        </p>

        <h3 className="mt-6">Rule Engine Execution</h3>
        <p>
          Rule engine evaluates business rules before ML scoring. Rule evaluation order: high-priority rules first (clear fraud), then medium-priority (review), then low-priority (monitor). Rule short-circuit: if high-priority rule fires (decline), skip remaining rules (fast decline). Rule logging: which rules fired, why (for auditing, debugging).
        </p>
        <p>
          Rule configuration manages rule definitions. Rule DSL (domain-specific language): declarative rule definition (IF condition THEN action). Rule testing: validate rules before deployment (syntax check, logic check). Rule simulation: test rules on historical data (how many would fire, fraud caught, false positives). Rule deployment: staged rollout (10% traffic → 50% → 100%), monitoring (fire rate, precision).
        </p>
        <p>
          Rule actions determine transaction handling. Approve: transaction proceeds (low risk). Decline: transaction blocked (high risk), customer notified (generic message, not &quot;fraud&quot;). Review: transaction held (medium risk), manual review queue (fraud analyst investigates). Step-up: additional verification (3D Secure, SMS code, email verification).
        </p>

        <h3 className="mt-6">ML Model Serving</h3>
        <p>
          Model serving infrastructure scores transactions in real-time. Model deployment: containerized (Docker, Kubernetes), auto-scaling (handle traffic spikes), high availability (multi-region). Model versioning: track model versions (who trained, when, metrics), rollback capability (revert bad models). Model monitoring: latency (p50, p95, p99), error rate (scoring failures), throughput (transactions/second).
        </p>
        <p>
          Feature pipeline feeds model at serving time. Real-time features: computed on-the-fly (velocity, aggregations). Batch features: pre-computed (customer history, device reputation). Feature consistency: same features as training (prevent skew). Feature validation: check for missing values, outliers, type mismatches.
        </p>
        <p>
          Model inference computes risk score. Input: feature vector (all features for transaction). Output: risk score (0-100), model metadata (version, confidence). Latency budget: &lt;100ms for scoring (total fraud check &lt;500ms). Fallback: if model unavailable, use rules only (degraded but functional). Caching: cache scores for identical transactions (same customer, same amount, same device within short window).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/transaction-fraud-detection/risk-scoring-flow.svg"
          alt="Risk Scoring Flow"
          caption="Figure 2: Risk Scoring Flow — Feature computation, rule evaluation, ML scoring, and decision thresholds"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Decision Orchestration</h3>
        <p>
          Decision orchestration combines rules + ML score → final decision. Decision logic: if rule decline → decline (override ML score), if rule review → review, else use ML score thresholds. Threshold tuning: balance fraud caught vs. false positives (business tolerance). Dynamic thresholds: adjust based on risk appetite (holiday season = higher tolerance), traffic patterns (spike = stricter).
        </p>
        <p>
          Manual review queue handles medium-risk transactions. Queue prioritization: highest risk first, oldest first, VIP customers first. Review workflow: analyst views transaction details, customer history, fraud signals. Analyst decision: approve (release transaction), decline (block transaction), request info (contact customer). Analyst feedback: label transaction (fraud, legitimate), feedback used for model retraining.
        </p>
        <p>
          Decision logging captures fraud decisions for audit and learning. Decision record: transaction ID, risk score, rules fired, decision (approve/decline/review), analyst ID (if manual review). Audit trail: compliance (why declined), debugging (why false positive), learning (feedback for model). Retention: keep decisions for 7+ years (regulatory requirements, chargeback disputes).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/transaction-fraud-detection/fraud-signals.svg"
          alt="Fraud Signals"
          caption="Figure 3: Fraud Signals — Velocity, location, device, amount, and network signals for fraud detection"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Fraud detection design involves trade-offs between fraud prevention, customer experience, operational cost, and complexity. Understanding these trade-offs enables informed decisions aligned with business risk tolerance and customer expectations.
        </p>

        <h3>Thresholds: Strict vs. Lenient</h3>
        <p>
          Strict thresholds (low decline threshold, e.g., &gt;50 decline). Pros: Lower fraud rate (more fraud caught), lower chargebacks. Cons: Higher false positives (legitimate transactions declined), lost sales, customer frustration. Best for: High-risk industries (electronics, gift cards), new merchants (building fraud baseline), high chargeback fees.
        </p>
        <p>
          Lenient thresholds (high decline threshold, e.g., &gt;80 decline). Pros: Lower false positives (fewer legitimate declines), higher conversion, better customer experience. Cons: Higher fraud rate (more fraud slips through), higher chargebacks, potential brand damage. Best for: Low-risk industries (digital goods, subscriptions), established merchants (known customer base), low chargeback fees.
        </p>
        <p>
          Dynamic thresholds (adjust based on context). Pros: Balances fraud prevention with conversion (stricter for high-risk, lenient for low-risk). Cons: Complexity (threshold logic), monitoring (threshold effectiveness). Best for: Most production systems—stricter for new customers, high amounts, high-risk countries; lenient for repeat customers, low amounts, low-risk countries.
        </p>

        <h3>Rules vs. ML: Coverage and Accuracy</h3>
        <p>
          Rules-only approach. Pros: Interpretable (analysts understand why declined), auditable (compliance), fast (simple conditions), no training data needed. Cons: Limited accuracy (can&apos;t capture complex patterns), high maintenance (rules need updating), fraudsters adapt (probe for rules). Best for: New merchants (no historical data), compliance-heavy industries (explainable decisions), clear fraud patterns (card testing).
        </p>
        <p>
          ML-only approach. Pros: Higher accuracy (captures complex patterns), adapts to new patterns (retraining), lower maintenance (model learns). Cons: Black box (hard to explain decisions), requires training data (cold start problem), model drift (performance degrades over time). Best for: Established merchants (historical fraud data), high-volume (enough fraud samples), low compliance requirements.
        </p>
        <p>
          Hybrid: rules + ML. Pros: Best of both (rules for clear fraud, ML for edge cases), interpretable (rules explain clear fraud), accurate (ML catches complex fraud). Cons: Complexity (two systems), tuning (rules + thresholds). Best for: Most production systems—rules catch obvious fraud (card testing, high-risk patterns), ML scores remaining transactions.
        </p>

        <h3>Real-time vs. Post-transaction Detection</h3>
        <p>
          Real-time detection (before transaction completes). Pros: Prevent fraud (block before chargeback), immediate feedback (customer knows instantly). Cons: Latency requirement (&lt;500ms), false positives block legitimate transactions, limited data (only pre-transaction signals). Best for: Most e-commerce (prevent fraud upfront), high-risk transactions.
        </p>
        <p>
          Post-transaction detection (after transaction completes). Pros: More data (fulfillment, delivery confirmation), lower latency requirement (can analyze asynchronously), false positives can be corrected (refund, re-ship). Cons: Fraud already happened (chargeback risk), customer already notified (awkward to reverse). Best for: Digital goods (can&apos;t ship fraud), low-risk transactions, supplement to real-time.
        </p>
        <p>
          Hybrid: real-time + post-transaction. Pros: Prevent obvious fraud (real-time), catch sophisticated fraud (post-transaction patterns). Cons: Complexity (two systems), customer experience (post-transaction decline is awkward). Best for: Most production systems—real-time blocks clear fraud, post-transaction catches fraud rings, account takeover.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/transaction-fraud-detection/detection-approaches.svg"
          alt="Detection Approaches Comparison"
          caption="Figure 4: Detection Approaches Comparison — Rules, ML, and hybrid approaches for fraud detection"
          width={1000}
          height={450}
        />

        <h3>Manual Review: Cost vs. Accuracy</h3>
        <p>
          High manual review (review medium-risk transactions). Pros: Higher accuracy (human judgment catches edge cases), lower false positives (analyst can approve legitimate), fraud learning (analysts label for model). Cons: High cost (analyst salaries), slow (review takes time), inconsistent (different analysts, different decisions). Best for: High-value transactions (worth review cost), new merchants (building fraud baseline), complex fraud patterns.
        </p>
        <p>
          Low manual review (auto-decline/auto-approve, minimal review). Pros: Low cost (few analysts), fast (automated decisions), consistent (rules/ML don&apos;t vary). Cons: Higher false positives (no human override), higher fraud (no human catches edge cases), no fraud learning (no analyst labels). Best for: Low-value transactions (not worth review cost), established merchants (good models), digital goods (low chargeback impact).
        </p>
        <p>
          Targeted manual review (review specific segments). Pros: Balances cost with accuracy (review high-value, new customers), fraud learning (label uncertain cases). Cons: Complexity (review criteria), analyst training (consistent decisions). Best for: Most production systems—review high-value transactions, new customers, edge cases (score near threshold).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Start with rules, add ML:</strong> Rules catch clear fraud (card testing, high-risk patterns). ML catches complex patterns (fraud rings, account takeover). Hybrid approach: rules first, then ML score remaining.
          </li>
          <li>
            <strong>Implement velocity checks:</strong> Transactions per hour/day, amount per hour/day, failed attempts. Multiple windows (1 min, 1 hour, 1 day). Per customer, per card, per device, per IP.
          </li>
          <li>
            <strong>Use device fingerprinting:</strong> Identify devices across sessions. Detect device velocity (same device, multiple accounts). Link fraudulent sessions. Respect privacy (GDPR consent, browser restrictions).
          </li>
          <li>
            <strong>Tune thresholds carefully:</strong> Balance fraud caught vs. false positives. Monitor precision (fraud / flagged), recall (fraud detected / total fraud). Adjust based on business tolerance, season, traffic patterns.
          </li>
          <li>
            <strong>Implement manual review queue:</strong> Review medium-risk transactions. Prioritize by risk, age, customer value. Analyst feedback for model retraining. Targeted review (high-value, new customers).
          </li>
          <li>
            <strong>Monitor fraud metrics:</strong> Fraud rate (fraud / transactions), chargeback rate (chargebacks / transactions), false positive rate (legitimate declined / declined). Alert on spikes (fraud attack, model degradation).
          </li>
          <li>
            <strong>Retrain models regularly:</strong> Concept drift (fraud patterns change). Retrain weekly/monthly with new labels. Monitor model performance (precision, recall, AUC). A/B test new models before deployment.
          </li>
          <li>
            <strong>Implement 3D Secure for high-risk:</strong> Step-up authentication for high-risk transactions. Shifts liability to issuer (reduces chargebacks). Customer friction (bank authentication), use selectively.
          </li>
          <li>
            <strong>Capture fraud feedback:</strong> Label transactions (fraud, legitimate) from chargebacks, manual review, customer reports. Feedback loop for model retraining. Track feedback quality (analyst accuracy).
          </li>
          <li>
            <strong>Plan for fraud attacks:</strong> Fraud spikes (card testing, account takeover). Rate limiting (transactions per minute). Emergency rules (block high-risk patterns). Incident response (detect, respond, recover).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No velocity checks:</strong> Fraudsters test cards rapidly. Solution: Velocity limits (transactions/hour, amount/day), block on exceed.
          </li>
          <li>
            <strong>Thresholds not tuned:</strong> Too strict (high false positives), too lenient (high fraud). Solution: Monitor precision/recall, adjust based on business tolerance.
          </li>
          <li>
            <strong>No manual review:</strong> All auto-decisions, no human override. Solution: Review queue for medium-risk, analyst feedback for learning.
          </li>
          <li>
            <strong>Model not retrained:</strong> Model drift (performance degrades). Solution: Regular retraining (weekly/monthly), monitor performance, A/B test new models.
          </li>
          <li>
            <strong>No device fingerprinting:</strong> Can&apos;t detect device velocity, fraud rings. Solution: Implement fingerprinting, respect privacy (consent, browser restrictions).
          </li>
          <li>
            <strong>Ignoring network features:</strong> Miss fraud rings, account links. Solution: Graph features (same email, phone, address across accounts).
          </li>
          <li>
            <strong>No fraud feedback loop:</strong> Can&apos;t improve models without labels. Solution: Capture chargebacks, manual review decisions, customer reports.
          </li>
          <li>
            <strong>Generic decline messages:</strong> &quot;Transaction declined&quot; reveals nothing. Solution: Generic messages (don&apos;t tip off fraudsters), specific internal logging.
          </li>
          <li>
            <strong>No attack monitoring:</strong> Fraud spikes undetected. Solution: Monitor fraud rate, velocity spikes, new device spikes. Alert on anomalies.
          </li>
          <li>
            <strong>Over-reliance on ML:</strong> Black box, hard to explain, cold start. Solution: Hybrid (rules + ML), rules for clear fraud, ML for edge cases.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Stripe Radar Fraud Detection</h3>
        <p>
          Stripe Radar: ML-powered fraud detection. Features: transaction history, device fingerprint, network analysis. Models: gradient boosting (XGBoost), neural networks. Rules: custom rules (block high-risk countries, velocity limits). Manual review: review queue for medium-risk. Feedback: chargeback labels for retraining. 3D Secure: step-up for high-risk (liability shift).
        </p>

        <h3 className="mt-6">PayPal Fraud Detection</h3>
        <p>
          PayPal fraud detection: decades of fraud data. Features: transaction history, device fingerprint, network graph (email, phone, address). Models: ensemble (multiple models), deep learning. Rules: clear fraud patterns (card testing, account takeover). Manual review: large analyst team. Feedback: chargeback data, customer reports. Step-up: SMS verification for suspicious transactions.
        </p>

        <h3 className="mt-6">Amazon Fraud Detection</h3>
        <p>
          Amazon fraud detection: massive transaction volume. Features: purchase history, device fingerprint, behavioral biometrics (mouse, typing). Models: real-time scoring (&lt;100ms), deep learning. Rules: clear fraud (new account, high-value, rush shipping). Manual review: targeted (high-value, edge cases). Feedback: delivery confirmation (fraud = not received), customer reports.
        </p>

        <h3 className="mt-6">Uber Fraud Detection</h3>
        <p>
          Uber fraud detection: ride fraud, payment fraud. Features: trip patterns, device fingerprint, location anomalies. Models: real-time scoring, anomaly detection. Rules: clear fraud (new account, free ride codes, unusual routes). Manual review: trip disputes, payment disputes. Feedback: driver reports, customer reports. Step-up: SMS verification for suspicious accounts.
        </p>

        <h3 className="mt-6">Shopify Fraud Detection</h3>
        <p>
          Shopify fraud detection: merchant fraud, payment fraud. Features: order history, device fingerprint, IP analysis. Models: risk score per order, ML-based. Rules: high-risk countries, velocity limits, gift card fraud. Manual review: merchant review queue (Shopify shows risk score). Feedback: chargeback data, merchant labels. Step-up: 3D Secure for high-risk orders.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you balance fraud prevention with customer experience?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Dynamic thresholds based on risk context. Stricter for new customers, high amounts, high-risk countries. Lenient for repeat customers, low amounts, low-risk countries. Step-up authentication (3D Secure, SMS) for medium-risk (verify, don&apos;t block). Manual review for edge cases (human judgment). Monitor false positive rate (legitimate declines), adjust thresholds to minimize customer friction while keeping fraud acceptable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect fraud rings?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Network features: same email, phone, address, device across multiple accounts. Graph analysis: connected components (fraud clusters), centrality (hub accounts), community detection. Velocity: multiple accounts created rapidly, multiple transactions from linked accounts. Device fingerprint: same device, different accounts. IP analysis: same IP, multiple accounts (proxy/VPN detection).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle model drift in fraud detection?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Regular retraining (weekly/monthly) with new fraud labels. Monitor model performance (precision, recall, AUC) over time. Alert on performance degradation. A/B test new models before deployment (compare to current model). Feature monitoring: detect distribution drift (feature values change), data quality issues (missing values, outliers). Retrain on new fraud patterns (fraudsters adapt).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement velocity checks?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Multiple time windows (1 min, 5 min, 1 hour, 1 day, 7 days). Multiple aggregation levels (per customer, per card, per device, per IP, per email). Count transactions, sum amounts, count failed attempts. Stream processing (Flink, Kafka Streams) for real-time aggregation. Redis for fast lookup of pre-computed aggregates. Alert/block on threshold exceed (e.g., &gt;5 transactions/hour, &gt;$1000/hour).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle false positives?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Manual review queue (analyst can approve legitimate transactions). Customer support escalation (customer calls, verify identity, approve). Retry logic (customer tries again with different card, same transaction). Threshold adjustment (if false positive rate high, relax thresholds). Model retraining (false positives as negative labels). Root cause analysis (why false positive, fix rules/features).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect card testing attacks?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Velocity checks: multiple cards from same IP/device in short time. Small amounts (fraudsters test with $1, $2). Failed attempts: multiple declines before success. BIN analysis: cards from same bank, different numbers. Device fingerprint: same device, multiple cards. IP analysis: proxy/VPN, high-risk country. Response: block IP/device after N attempts, require 3D Secure, rate limit.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://stripe.com/docs/radar"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Radar — Fraud Detection Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.paypal.com/us/webapps/mpp/fraud-protection"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PayPal — Fraud Protection Services
            </a>
          </li>
          <li>
            <a
              href="https://www.sift.com/resources/guides/fraud-prevention/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sift — Fraud Prevention Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.kount.com/learn/fraud-prevention/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kount — Fraud Prevention Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.fingerprintjs.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FingerprintJS — Device Fingerprinting
            </a>
          </li>
          <li>
            <a
              href="https://www.maxmind.com/en/fraud-prevention"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MaxMind — Fraud Prevention Services
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-feature-flag-management-system-ui",
  title: "Design a Feature Flag Management System UI",
  description:
    "Architecture for a feature flag management system: flag lifecycle, targeting rules, percentage rollouts, flag evaluation SDK, audit logging, and stale flag cleanup.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "feature-flag-management-system-ui",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-10",
  tags: ["hld", "feature-flags", "rollout", "targeting", "sdk", "a-b-testing"],
  relatedTopics: ["multi-tenant-saas-admin-dashboard", "frontend-observability-dashboard-rum-like-datadog"],
};

export default function FeatureFlagManagementSystemUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A feature flag management system allows engineering teams to control the availability of features in production without code deployments. A feature flag is a boolean (or multi-variant) condition evaluated at runtime that determines whether a code path executes. The management system is the control plane: the UI and API through which product managers and engineers create flags, configure targeting rules (which users see the flag enabled), roll out flags progressively (enable for 1%, then 10%, then 100% of users), and monitor flag behavior. The evaluation plane—the actual flag evaluation in the application—runs inside the application via a client SDK that fetches flag configurations from the management system.</p>
        <p>The key engineering challenges are: low-latency flag evaluation (flag evaluation must not add perceptible latency to any user request), consistent user assignment (a user who sees a feature enabled must continue seeing it enabled on every subsequent request—evaluation must be deterministic for the same user), and real-time flag updates (when a flag is toggled, enabled users must see the change within seconds, not after a full deployment). The management UI challenge is making the flag's targeting logic transparent and safe to configure: a misconfigured targeting rule could accidentally enable a feature for all users or disable it for the wrong segment, with immediate production impact.</p>
        <p><strong>Explicit assumptions:</strong> The system supports boolean flags (on/off) and multi-variant flags (A/B/C experiment). Targeting is based on user attributes (userId, email, plan, country, device type) and percentage rollouts. The SDK is a JavaScript client library and a server-side Node.js library. Flags are evaluated on the client SDK using locally cached rules (not per-request network calls). SSE pushes rule updates to connected SDK instances. The system tracks flag exposure events (which users saw which variant) for experiment analysis.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Flag CRUD:</strong> Create, read, update, and archive flags. Flags have a name, key (slug, immutable after creation), description, type (boolean or multivariate), and tags for organization.</li>
          <li><strong>Targeting rules:</strong> Configure targeting rules that evaluate to true/false based on user attributes. Rules support AND/OR logic, equality/inequality/contains/regex operators, and multi-value attribute matching (user.plan in [pro, enterprise]).</li>
          <li><strong>Percentage rollouts:</strong> Enable a flag for a configurable percentage of users (1%–100%). The percentage assignment is deterministic and sticky: the same userId always evaluates to the same bucket, regardless of when or where evaluation occurs.</li>
          <li><strong>Kill switch:</strong> Any flag can be globally disabled (overrides all targeting rules) with a single toggle, for emergency rollback of a misbehaving feature.</li>
          <li><strong>Audit log:</strong> All flag changes are recorded with the actor, change type, previous state, and new state.</li>
          <li><strong>Stale flag management:</strong> Flags that have been 100% enabled for more than 30 days without cleanup are flagged as stale (candidates for permanent removal from the codebase).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Evaluation latency:</strong> Client SDK flag evaluation (from local cache) completes in under 1ms. The 1ms budget includes all targeting rule evaluation.</li>
          <li><strong>Update propagation:</strong> When a flag rule changes in the management UI, connected SDK instances receive the update within 5 seconds.</li>
          <li><strong>Availability:</strong> Flag evaluation must continue working if the management system is unavailable. The SDK must fall back to a locally cached ruleset.</li>
          <li><strong>Scale:</strong> 100 million flag evaluations per day across all customers. The flag rule delivery infrastructure must support 50,000 concurrent SDK connections.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The system has two planes. The control plane (the management UI and API): where flags are created and configured, targeting rules are defined, changes are audit-logged, and the flag ruleset is stored (PostgreSQL). The evaluation plane: the SDK downloads the flag ruleset for the customer's environment on initialization and evaluates flags locally in memory. SSE connections from the SDK to the Streaming Service receive real-time ruleset updates when any flag changes. The evaluation plane never contacts the control plane for individual flag evaluations—all evaluation is local, ensuring sub-millisecond latency and availability independence from the control plane.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/feature-flag-management-system-ui-architecture.svg"
          alt="Feature flag system architecture showing control plane (management UI, REST API, PostgreSQL ruleset store, audit log), evaluation plane (client SDK: ruleset download on init, local evaluation in memory, SSE connection to Streaming Service for real-time updates), Streaming Service (Redis pub/sub for ruleset change events → SSE fan-out to connected SDK instances), CDN-cached ruleset snapshot (SDK bootstrap fallback), and flag evaluation algorithm (targeting rules → percentage hash → variant assignment)."
          caption="Two-plane architecture: control plane (UI + API + PostgreSQL) for management; evaluation plane (SDK local evaluation) for performance; SSE streaming for real-time updates"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Flag Configuration Data Model</h3>
        <p>A flag configuration is a serializable rule object: &#123;flagKey, type, defaultVariant, targeting: [&#123;conditions, variant&#125;], percentageRollout: &#123;enabled, percentage, seed&#125;, archived, globalKillSwitch&#125;. The targeting array is an ordered list of rules; evaluation processes rules in order and returns the first matching rule's variant. A rule has conditions (an array of condition objects with field, operator, and value) combined with AND logic; multiple rules are combined with OR (matching any rule triggers the variant). After targeting rules, if no rule matched, the percentageRollout is evaluated.</p>
        <p>Percentage rollout algorithm: the user is assigned to a percentage bucket (0–100) using a consistent hash of (userId + flagKey + seed). The hash function (MurmurHash3 or FNV-1a) produces a uniformly distributed integer; the bucket is (hash mod 10000) / 100, giving a floating-point percentage in [0, 100). If bucket &lt; rolloutPercentage, the flag is enabled for this user. The seed is a random value set when the rollout is created; different seeds produce different user assignments for the same flag, enabling the creation of mutually exclusive experiment groups. The bucket calculation is deterministic (same inputs always produce the same output) and local (no server call required), satisfying the stickiness requirement.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Management UI: Flag Configuration Interface</h3>
        <p>The flag detail page is the central UI surface. It shows the flag's current state (enabled/disabled, current rollout percentage), the targeting rule builder, the rollout control, and the audit log for this flag. The targeting rule builder is a visual form: each rule is a card with condition rows (attribute, operator, value) and an AND badge between conditions. Adding a new condition adds a row; adding a new rule adds a card below the existing rules. The UI validates the rule configuration before saving: it checks that all conditions reference valid attribute names, that the operator is valid for the attribute type (regex is only valid for string attributes), and that the value format matches the operator (numeric comparison requires a numeric value).</p>
        <p>Preview mode: the flag detail page includes a "Preview for user" panel where the operator can enter user attributes and instantly see which targeting rule would match (highlighted in the rule builder) and which variant the user would receive. This preview is computed client-side (the targeting rule evaluation algorithm runs in the browser) from the current unsaved rule configuration—the operator can test their rules before saving. The preview is invaluable for debugging unexpected flag behavior: "why is user X seeing variant B instead of A?" The operator enters user X's attributes, and the UI shows the exact rule that matched.</p>
        <p>Scheduling: flags can be configured to automatically enable or disable at a scheduled time (useful for planned feature launches or time-limited promotions). The scheduling UI shows a calendar and time picker; the scheduled state change is stored as a future event in the flag configuration. A background job (checking for scheduled events every minute) applies the state change at the configured time and appends the automated change to the audit log with actor: "scheduled automation."</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">SDK Design and Local Evaluation</h3>
        <p>The client SDK initializes by downloading the full flag ruleset for the environment (a JSON document containing all flag configurations) from a CDN-cached endpoint. The CDN caches the ruleset with a 60-second TTL; the SDK receives the latest ruleset within 60 seconds of initialization even without SSE. After initialization, the SDK opens an SSE connection to the Streaming Service; rule updates pushed via SSE update the in-memory ruleset immediately (bypassing the 60-second CDN cache).</p>
        <p>The SDK exposes two evaluation APIs: flagIsEnabled(flagKey, userContext) (returns boolean) and getVariant(flagKey, userContext) (returns the variant string or null). Both APIs evaluate the local in-memory ruleset synchronously; there is no async network call during evaluation. The userContext is a plain object containing the user's attributes (userId, email, plan, country, etc.). The SDK evaluates targeting rules against the userContext using the same algorithm as the management UI's preview mode—the client and server use identical evaluation logic, ensuring consistency.</p>
        <p>Offline resilience: the SDK persists the downloaded ruleset to localStorage (in browser environments) or to an in-memory fallback (in server environments where localStorage is unavailable). On next initialization, if the CDN endpoint is unreachable, the SDK falls back to the persisted ruleset. The fallback ruleset may be stale (up to the age of the last successful download), but it is better than returning defaultVariant for all flags. The SDK indicates the fallback state via a isStale flag on the evaluation context, allowing the application to handle stale evaluations differently if needed (e.g., disabling A/B test tracking when the ruleset is stale).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-Time Update Propagation</h3>
        <p>When a flag configuration is saved in the management UI, the control plane writes the change to PostgreSQL, appends an audit log entry, and publishes a ruleset_updated event to a Redis pub/sub channel keyed by the customer's environment ID. The Streaming Service is subscribed to all environment channels; on receiving the event, it re-fetches the full flag ruleset for that environment from PostgreSQL (or from a Redis cache warmed from PostgreSQL), serializes it as JSON, and pushes it to all SSE connections associated with that environment. Each SSE connection handles one SDK instance; the Streaming Service maintains a map of environment ID to a set of SSE connections.</p>
        <p>The full-ruleset push (rather than a delta of only the changed flag) simplifies the SDK's update handling: the SDK replaces its entire in-memory ruleset on each SSE event, rather than applying incremental patches that could produce inconsistent states if events arrive out of order. The full ruleset is typically 50–200KB JSON (for environments with 500–2,000 flags); this is a reasonable payload for a push that occurs at most a few times per minute per environment. For environments with very high change rates (continuous experimentation with hundreds of simultaneous experiments), the Streaming Service can apply rate limiting (coalescing multiple changes within a 500ms window into a single SSE event) to avoid overwhelming SDK instances with frequent full-ruleset pushes.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Stale Flag Detection and Cleanup Workflow</h3>
        <p>Flags that are permanently enabled (100% rollout with no targeting rules) but have not been removed from the codebase accumulate as technical debt. The management system detects stale flags by scanning for flags that have been fully enabled (rolloutPercentage = 100, no targeting rules) for more than 30 days. These flags are marked as stale in the flag list (with a visual indicator) and their owners are notified (via email and a banner in the management UI). The stale notification includes the codebase locations where the flag is referenced (derived from a code scanning integration with GitHub that searches for the flag key in the codebase).</p>
        <p>The cleanup workflow: the flag owner reviews the stale flag, verifies that the feature is stable, removes the flag from the codebase (guided by the code scanner's location list), and archives the flag in the management system. Archiving a flag retains it in the database (for audit and historical analysis) but removes it from the active flag ruleset (SDKs no longer download archived flags). A flag that is archived but still referenced in the codebase would cause evaluation to return the default variant—the code scanner warns if a flag key is archived but still present in the code. The stale flag cleanup process is important for keeping the flag ruleset size manageable and for preventing "zombie flags" that create confusion about whether a feature is intentionally always-on or forgotten.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/feature-flag-management-system-ui-targeting.svg"
          alt="Feature flag targeting UI showing rule builder (condition rows with AND logic between conditions, OR logic between rules, attribute selector, operator selector, value input), evaluation preview panel (enter user attributes → see matching rule highlighted + variant result), percentage rollout (slider + deterministic hash bucket: MurmurHash3(userId + flagKey + seed) mod 10000 / 100), stale flag detection (100% rollout for 30+ days → stale badge → code scanner shows codebase references → archive workflow)."
          caption="Targeting UI: visual rule builder with AND/OR logic, live evaluation preview panel, deterministic percentage hash, and stale flag detection with code scanner integration"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Local evaluation versus remote evaluation: remote evaluation (each flag check is a network request to the flag service) provides perfect consistency (the flag service always returns the latest state) but adds network latency to every flag evaluation and creates availability dependency on the flag service. Local evaluation (the SDK caches rules and evaluates locally) provides sub-millisecond performance and survives flag service downtime, but allows up to 60 seconds of staleness between rule changes and all SDK instances receiving the update. For most use cases, 60 seconds of staleness is acceptable—the SSE connection typically delivers updates in under 5 seconds for connected instances. Remote evaluation is only justified for flags that require real-time precision (e.g., fraud risk scores that change per-second), which is a narrow use case.</p>
        <p>Percentage rollout consistency across services: when a flag is evaluated in both the frontend SDK and a backend service for the same user, the assignment must be consistent (both evaluate to the same variant) to avoid a frontend showing a feature that the backend does not support. Consistency is guaranteed when both use the same deterministic hash function, the same flagKey, and the same userId. The platform must document this consistency guarantee and provide the same hash implementation in all SDK languages (JavaScript, Python, Go, etc.). Any divergence in the hash implementation breaks consistency; automated cross-SDK hash validation tests (comparing outputs for a test set of userId + flagKey inputs across all SDK implementations) should be part of the SDK release process.</p>
        <p>Flag key immutability: the flag key (the string identifier used in code) must be immutable once the flag is created. Renaming a flag key requires updating all codebase references simultaneously (practically impossible in a large codebase), so the management UI enforces immutability by making the flag key a read-only field after creation. If a flag needs to be "renamed" (the display name can be changed freely), a new flag with the new key is created, traffic is gradually shifted from the old flag to the new one (both flags have the same targeting rules), and the old flag is archived after the codebase references are updated. This two-flag transition process allows gradual migration without a large codebase change.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A feature flag management system separates the control plane (UI + API + PostgreSQL) from the evaluation plane (SDK local evaluation). The SDK downloads the full flag ruleset on initialization from a CDN-cached endpoint (60s TTL) and opens an SSE connection for real-time updates (delivered within 5 seconds of a change). Flag evaluation is local and synchronous (under 1ms): targeting rules are evaluated in order (first match wins), followed by a deterministic percentage hash (MurmurHash3(userId + flagKey + seed) mod 10000 / 100 &lt; rolloutPercentage). The management UI provides a visual rule builder with client-side live preview (evaluate rules against arbitrary user attributes before saving). Ruleset updates propagate via Redis pub/sub (control plane → Streaming Service → SSE fan-out to all SDK instances per environment), with full-ruleset push (not delta) for simplicity. Stale flag detection identifies flags at 100% rollout for 30+ days; a code scanner integration shows codebase references to guide cleanup. Flag keys are immutable after creation; renaming requires a two-flag transition process. The fundamental design choice—local evaluation with SSE updates—ensures flag evaluation never adds latency to user requests and survives control plane outages.</p>
      </section>
    </ArticleLayout>
  );
}

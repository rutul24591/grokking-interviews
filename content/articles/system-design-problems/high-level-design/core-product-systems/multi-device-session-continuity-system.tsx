"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-multi-device-session-continuity",
  title: "Design a Multi-Device Session Continuity System",
  description:
    "Architecture for seamless cross-device session handoff: state capture, transfer protocols, device management, security controls, and real-time sync.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "multi-device-session-continuity-system",
  wordCount: 6200,
  readingTime: 37,
  lastUpdated: "2026-05-20",
  tags: ["hld", "session-continuity", "multi-device", "handoff", "state-sync", "security"],
  relatedTopics: ["cross-device-user-settings-sync", "device-session-management-ui"],
};

export default function MultiDeviceSessionContinuityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Multi-device session continuity lets a user start an activity on one device and continue it on another with
          useful context preserved. The visible experience can feel simple: continue reading an article on a laptop,
          move a shopping session from phone to desktop, resume video playback on a TV, or pick up a support workflow
          on a tablet. The system behind it must decide what state is safe to capture, how to transfer it, how to
          authenticate the receiving device, and how to adapt state across very different form factors.
        </HighlightBlock>
        <p>
          The feature is not the same as authentication session sharing. A session-continuity snapshot should carry
          navigation and interaction context, not reusable login credentials or sensitive form data. The target device
          should already belong to the user and may still need re-authentication before restoration. This boundary is
          important in interviews because the most dangerous failure mode is turning a convenience feature into a
          session hijacking primitive.
        </p>
        <p>
          There are two common product modes. Explicit handoff lets the user choose a target device and initiate
          transfer. Passive continuity surfaces recently active sessions on nearby or recently active devices. Explicit
          handoff is simpler, easier to secure, and easier to explain in a system design round. Passive continuity
          requires stronger device presence, notification, privacy, and ranking rules because it can reveal activity
          without an explicit user action.
        </p>
        <p>
          A strong scope is a web product with articles, media, commerce, and forms. Captured state may include URL,
          route params, scroll anchor, media playback position, selected tab, open panel identifiers, lightweight draft
          state, and feature flags needed to interpret the snapshot. Excluded state includes passwords, payment fields,
          identity documents, medical data, secret tokens, and any field explicitly marked non-transferable.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Portable Session Snapshot</h3>
        <p>
          A portable snapshot should be semantic rather than pixel-perfect. Absolute scroll pixels from a desktop page
          rarely map well to mobile. Better signals include URL, content ID, nearest section anchor, scroll percentage,
          media ID, playback offset, selected object ID, and open workflow step. The target device uses these signals
          to reconstruct the closest equivalent experience.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Device Registry and Presence</h3>
        <p>
          Devices must be linked to the user's account and represented in a registry with device ID, display name,
          platform, trust level, last-seen time, push token or websocket connection, and revocation state. Active-device
          discovery should filter out the source device, expired devices, revoked devices, and devices that do not
          support the requested app or capability.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Transfer Tokens and One-Time Redemption</h3>
        <p>
          A handoff should use a short-lived, target-scoped, one-time transfer token. The token identifies a server-side
          snapshot and intended target device; it should not contain the full snapshot. One-time redemption protects
          against replay. Short TTLs reduce exposure if a notification or target device is compromised. The server logs
          all transfer creation, delivery, redemption, expiry, and denial events.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Adaptation and Capability Negotiation</h3>
        <p>
          Devices differ in screen size, input method, installed app capability, permission state, and available routes.
          Restoration should use a target capability manifest. A desktop split view may become a single mobile route. A
          mobile-only deep link may become a web fallback. A video session may restore playback position but require
          the user to press play due to autoplay restrictions.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/multi-device-session-continuity-system-architecture.svg"
          alt="Multi-device session continuity architecture showing source device state capture, device registry, session relay, state store with TTL, target device notification, authentication gate, and restoration"
          caption="Architecture: source captures safe state, relay stores a short-lived snapshot, target authenticates and redeems a one-time transfer."
        />
        <p>
          The source device owns capture. It asks feature modules for their transferable state, filters sensitive
          fields, stamps the snapshot with app version and capture time, and sends it to the relay service with the
          selected target device. Capture should be fast and bounded. For complex apps, modules should register small
          capture adapters rather than letting a generic scraper serialize arbitrary DOM or application memory.
        </p>
        <p>
          The relay service validates user identity, target ownership, device trust, user opt-in, and target capability.
          It stores the snapshot in a TTL-backed state store, creates a one-time transfer token, and notifies the
          target device through WebSocket, push notification, or in-app polling. If the target is temporarily offline,
          the snapshot can wait for a short window such as five minutes. Longer retention increases privacy risk and
          makes stale restoration more likely.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/multi-device-session-continuity-system-workflow.svg"
          alt="Session transfer workflow showing capture, relay storage, target notification, authentication check, one-time token redemption, adaptation, and audit logging"
          caption="Workflow: capture and delivery are decoupled, but redemption is target-scoped, authenticated, auditable, and short-lived."
        />
        <p>
          The target device receives an availability signal, not the full state. If the user accepts, the target checks
          current authentication and device trust. A sensitive workflow may require step-up authentication even when the
          user already has a session. After redemption, the target applies adaptation rules, navigates to the target
          route, restores scroll or section anchor, applies media offset, opens compatible panels, and reports
          restoration outcome.
        </p>
        <p>
          Restoration should be idempotent from the user's perspective. If a target app crashes after redeeming but
          before rendering, the system can either allow a bounded second redemption by the same target or treat the
          snapshot as consumed and ask the source to resend. The choice depends on sensitivity. For general reading
          state, retry is acceptable. For sensitive workflows, one-time consumption is safer.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/multi-device-session-continuity-system-security.svg"
          alt="Session continuity security model showing sensitive field exclusion, device trust, reauthentication, one-time token, TTL, target binding, and audit trail"
          caption="Security model: session continuity transfers context, not credentials; target binding, reauthentication, TTLs, and sensitive-field exclusion are core controls."
        />
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          Server-mediated transfer works across networks, supports offline target delivery, simplifies device discovery,
          and gives the product audit and policy enforcement. The trade-off is that state passes through the server and
          must be protected by encryption, TTL, access control, and minimization. Peer-to-peer transfer can reduce
          server exposure and latency, but device discovery, NAT traversal, cross-network behavior, and offline
          delivery become much harder.
        </p>
        <p>
          On-demand capture is freshest and best for media playback or form workflows. Background snapshots make
          transfer feel instant but can be stale. A hybrid approach works well: maintain low-risk coarse state
          continuously, then capture precise volatile state when the user initiates transfer. The article position,
          media offset, and current route should be captured at click time if possible.
        </p>
        <p>
          Pixel-perfect restoration is usually the wrong goal. It creates brittle coupling between devices and layouts.
          Semantic restoration is more resilient but may feel approximate. The UI should make approximation acceptable:
          resume near the relevant section, show the same item, restore the same video offset, and drop incompatible
          desktop-only panel state on mobile.
        </p>
        <p>
          Push notifications are useful for target awareness, but visible notifications can leak activity on shared or
          locked devices. A privacy-sensitive product can use silent push or in-app badges that reveal details only
          after unlock. The notification text should avoid URLs, titles, search terms, or content names unless the user
          explicitly opts in.
        </p>
        <p>
          Capturing form state improves convenience but raises risk. Low-risk drafts such as a search query or comment
          draft may be acceptable. Payment, password, health, identity, and secret fields should be excluded by default.
          Products should use explicit allowlists for transferable form fields rather than trying to maintain an
          exhaustive denylist.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-level decision frame</h3>
        <p>
          The highest-level decision is whether continuity is a convenience feature or a regulated workflow feature. A
          consumer reading or media product can tolerate approximate restoration, longer TTLs, and lightweight device
          trust. Healthcare, finance, enterprise admin, and identity workflows need shorter TTLs, step-up
          authentication, strict payload minimization, audit trails, and explicit user confirmation on the receiving
          device. The same transfer primitive should support policy tiers rather than one universal behavior.
        </p>
        <p>
          Operability depends on understanding failed handoffs. The system should classify failures as source capture
          failure, relay persistence failure, target notification failure, target authentication failure, incompatible
          route, expired token, or user cancellation. These categories matter because a high failure rate from
          notification delivery is fixed very differently from a high failure rate caused by schema incompatibility
          after a mobile release.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Use a schema-versioned snapshot. Include source app version, route schema version, capture timestamp, and
          feature capabilities. The target can reject snapshots from incompatible versions, use migration rules, or fall
          back to URL-only restoration instead of failing silently.
        </p>
        <p>
          Make sensitive-state exclusion conservative. Prefer module-level allowlists. Add platform-level filters for
          password, payment, secret, and explicitly private fields. Redact before the snapshot leaves the source device.
          Do not rely only on the relay service to remove sensitive data.
        </p>
        <p>
          Treat device trust as dynamic. Users should be able to rename, revoke, and remove devices. A target device
          that has not been seen recently, has lost push trust, or was reported lost should not receive handoffs.
          Enterprise environments may require managed-device checks before continuity is allowed.
        </p>
        <p>
          Record audit events without storing unnecessary content. Log source device, target device, user, time,
          result, and reason for denial or failure. Avoid logging full URLs or snapshot payloads when they may reveal
          private user activity.
        </p>
        <p>
          Design restoration as best-effort with visible fallback. If exact panel state or scroll position cannot be
          restored, open the closest route and tell the user the session was resumed approximately. Silent partial
          failure makes the feature feel unreliable.
        </p>
        <p>
          Test continuity across release boundaries. Source and target devices may run different app versions for weeks.
          Snapshot schemas need compatibility tests, migration rules, and telemetry for rejected snapshots by version.
          This is especially important for mobile apps where users do not upgrade in lockstep with web deployments.
        </p>
        <p>
          Session continuity needs a clear authority model. Some state should follow the user across devices, such as drafts, playback position, cart contents, or recently viewed items. Other state should stay device-local, such as biometric unlock, unsaved secrets, camera permission, or transient UI focus. A principal-level design classifies state by sensitivity, conflict behavior, freshness needs, and whether it can be safely synced through the cloud.
        </p>
        <p>
          Conflict resolution should be domain-specific. Last-write-wins is acceptable for a recently viewed list but dangerous for a document draft, checkout cart, or security setting. The system should record device id, user id, state version, timestamp, and operation intent so it can merge, prompt, or reject conflicts according to product semantics.
        </p>
        <p>
          Observability should be designed around continuity outcomes. Track resume success, handoff latency, conflict rate, stale-device writes, session revocations, failed decryptions, and user-visible recovery prompts by platform and app version. These metrics show whether continuity is helping users or creating confusing cross-device behavior. They also reveal when a new app release or backend policy change breaks older clients.
        </p>
        <p>
          The design should also cover offline-first devices. A mobile app may update draft state while offline and reconnect after the desktop session has advanced. The sync service needs operation timestamps, causal versions, and conflict UX so it can preserve user work without reviving stale state. For sensitive flows, stale offline writes may need to be rejected with a recovery prompt instead of merged automatically.
        </p>
        <p>
          Product teams should define explicit continuity boundaries per surface. A media queue, checkout cart, document draft, and security setting do not deserve the same sync interval or conflict policy. That classification should be visible in design docs and operational metrics.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most serious pitfall is transferring authentication instead of context. Session continuity should not
          move access tokens or bypass target-device authentication. The receiving device must already be trusted and
          may need step-up authentication before restoration.
        </p>
        <p>
          Another pitfall is serializing arbitrary app state. Large snapshots become brittle, leak private data, and
          fail across versions. Capture only the minimum semantic state needed to reconstruct the user experience.
        </p>
        <p>
          Device fingerprints can be unstable and privacy-sensitive. Use server-issued device IDs after login rather
          than relying on browser fingerprinting as an identity primitive. Treat fingerprint-like signals only as risk
          hints, not as durable identity.
        </p>
        <p>
          Long-lived pending transfers create privacy and freshness issues. A handoff from yesterday should not appear
          unexpectedly on a shared tablet. Use short TTLs, clear expiry messaging, and user-controlled device settings.
        </p>
        <p>
          Finally, hidden notification content can leak activity. A lock-screen message saying the exact article,
          product, or document being continued can expose private context. Keep external notifications generic and show
          details only inside an authenticated app session.
        </p>
        <p>
          Another common failure is designing only the happy-path handoff. Devices can be offline, revoked, shared,
          stale, managed by enterprise policy, or missing the relevant app route. The relay and target should classify
          these failures explicitly so users and support teams know whether to retry, reauthenticate, update the app,
          or choose a different device.
        </p>
        <p>
          Teams often underestimate trust and account-boundary transitions. A user can sign out on one device, lose a device, rotate credentials, join an enterprise tenant, or revoke sessions after compromise. Continuity features must respond to security events quickly and should not keep syncing sensitive state to stale devices.
        </p>
        <p>
          Another pitfall is making presence look stronger than it is. Online indicators, active-device lists, and handoff prompts are eventually consistent. The UI should avoid promising exact real-time truth when mobile backgrounding, push delivery, and network transitions make presence inherently approximate.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Content platforms use continuity for articles, videos, podcasts, and learning modules. The most important
          state is content ID, scroll anchor, playback position, and completion progress. Exact pixel restoration is
          less important than resuming at the right semantic section.
        </p>
        <p>
          Commerce products use continuity for carts, product comparison, checkout preparation, and support flows.
          They must be careful not to transfer payment fields or identity verification data, while still preserving
          product selection and workflow step where safe.
        </p>
        <p>
          Productivity tools use continuity for documents, dashboards, and workflows. They often need route-level
          restoration, selected object state, filter state, and tenant/project context. Enterprise policy may restrict
          transfer to managed devices.
        </p>
        <p>
          Media ecosystems use continuity to move playback from phone to TV, desktop, or speaker. These systems must
          handle device capability, autoplay policy, DRM constraints, network availability, and remote-control state.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          What state would you capture for session continuity?
        </h3>
        <p>
          I would capture semantic navigation state: route, content ID, query parameters, nearest section anchor,
          scroll percentage, media playback offset, selected tab, workflow step, and compatible open panel IDs. I would
          exclude credentials, payment data, passwords, sensitive identity fields, and arbitrary component memory. The
          snapshot should be schema-versioned and minimal enough to survive app and device differences.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you secure transfer to another device?
        </h3>
        <p>
          The target device must belong to the same user, be trusted and not revoked, and authenticate before
          restoration if the snapshot is sensitive. The relay stores the snapshot with a short TTL and issues a
          target-scoped one-time transfer token. The target receives only a notification until it redeems the token.
          All attempts are audited, and sensitive fields are excluded before upload.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Why not put the entire session state inside the transfer token?
        </h3>
        <p>
          Tokens should stay small, short-lived, and easy to revoke. Full snapshots can be large, sensitive, and need
          server-side deletion or expiry. Storing the snapshot server-side behind an opaque one-time token allows TTL
          cleanup, target binding, policy checks at redemption time, and smaller notifications.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you adapt desktop state to mobile?
        </h3>
        <p>
          Use a capability manifest. Universal state such as URL, content ID, media offset, and section anchor is
          restored first. Desktop-only state such as split panes or sidebars is ignored or mapped to a mobile route.
          If the exact target route does not exist, fall back to the closest available route and show a lightweight
          message that restoration was approximate.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you handle offline target devices?
        </h3>
        <p>
          The relay can store a pending transfer for a short TTL, such as five minutes, and deliver it when the target
          reconnects through WebSocket, push, or polling. If the TTL expires, the target should not receive stale
          continuity prompts. The source can offer to resend. Short retention protects privacy and avoids surprising
          users later.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          What metrics would you monitor?
        </h3>
        <p>
          I would track transfer initiation success, target delivery latency, redemption success, expired transfers,
          denied transfers by reason, restoration success by state type, sensitive-field filter hits, device registry
          churn, and user opt-out rate. These metrics show whether failures are caused by device presence, security
          policy, notification delivery, or weak adaptation.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.apple.com/handoff/" target="_blank" rel="noreferrer">
              Apple Handoff overview
            </a>
            , product reference for continuity concepts.
          </li>
          <li>
            <a href="https://developer.apple.com/documentation/foundation/nsuseractivity" target="_blank" rel="noreferrer">
              Apple NSUserActivity documentation
            </a>
            , activity-state handoff model.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" target="_blank" rel="noreferrer">
              MDN: WebSockets API
            </a>
            , realtime target notification transport.
          </li>
          <li>
            <a href="https://www.w3.org/TR/webauthn-3/" target="_blank" rel="noreferrer">
              W3C WebAuthn specification
            </a>
            , step-up authentication on target devices.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noreferrer">
              OWASP Session Management Cheat Sheet
            </a>
            , session security principles relevant to continuity boundaries.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

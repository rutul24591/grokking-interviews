"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-multi-device-session-continuity",
  title: "Design a Multi-Device Session Continuity System",
  description:
    "Architecture for seamless cross-device session handoff: state capture, transfer protocols, device management, security controls, and real-time sync.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "multi-device-session-continuity-system",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-10",
  tags: ["hld", "session-continuity", "multi-device", "handoff", "state-sync", "security"],
  relatedTopics: ["cross-device-user-settings-sync", "device-session-management-ui"],
};

export default function MultiDeviceSessionContinuityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Session continuity is the ability to start an activity on one device and seamlessly continue it on another without losing context. Apple's Handoff feature, Google's Nearby Share, and Spotify Connect are the most visible implementations. The UX is deceptively simple from the user's perspective: they pick up their laptop and the article they were reading on their phone is already open, mid-scroll, with the same tab state. The technical complexity lies in capturing sufficient session state to reconstruct the experience on the new device, transferring it securely, and handling the inevitable mismatch between device capabilities (a state captured on a desktop with a 4K display resuming on a mobile device with limited storage).</p>
        <p>There are two fundamentally different session continuity models: explicit handoff (the user intentionally initiates a transfer, like clicking "Continue on laptop" on their phone) and passive continuity (the device detects the user's presence and automatically surfaces what they were doing, like iOS's Handoff showing app icons in the Dock/App Switcher). This design covers both, with the explicit handoff path as primary.</p>
        <p><strong>Explicit assumptions:</strong> The application is a web-based content consumption platform (articles, videos, shopping). Session state includes: current URL, scroll position, form input state, media playback position, open tabs/panels, and user-specific UI customizations. Devices are linked to the user's account (not anonymous). The transfer is initiated explicitly by the user (not automatic proximity-based). Security requirement: a session transfer to a new device requires re-authentication on the receiving device.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>State capture:</strong> Capture the current session state (URL, scroll position, form state, media position, open panels) on the source device.</li>
          <li><strong>Device discovery:</strong> Show the user a list of their other active devices to transfer the session to. Active devices are those where the user is logged in and the app is in the foreground or recently active.</li>
          <li><strong>Transfer initiation:</strong> User selects a target device; the source device sends the session state to the server; the server notifies the target device.</li>
          <li><strong>Session restoration:</strong> The target device receives the session state and restores the user to the equivalent state on the new device (same URL, best-effort scroll position, media playback position).</li>
          <li><strong>Cross-platform adaptation:</strong> Session state captured on desktop adapts to mobile: full-page scroll position approximates to the nearest section heading on mobile; desktop panel states (sidebars, split views) degrade gracefully on mobile.</li>
          <li><strong>Security:</strong> Session transfer to a new device (one that has not completed the current session's authentication) requires re-authentication. A session cannot be transferred to a device not linked to the user's account.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Transfer latency:</strong> From the user initiating the transfer on the source device to the target device receiving the session state: under 3 seconds.</li>
          <li><strong>State freshness:</strong> The captured state should represent the user's session within 500ms of the capture moment (not a stale 30-second-old snapshot).</li>
          <li><strong>Reliability:</strong> If the target device is offline, the session state is stored on the server for 5 minutes and delivered when the device comes online.</li>
          <li><strong>Privacy:</strong> Form input values (especially password fields, payment information) are explicitly excluded from session state capture. The system captures navigation state, not user data.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The session continuity system has three components: the Session State Capture layer (running on the source device, producing a serialized session state snapshot), the Session Relay Service (a server-side store and delivery mechanism for session states), and the Session Restoration layer (running on the target device, consuming the snapshot and reconstructing the session). Devices communicate with the Session Relay Service via authenticated API calls; the relay service handles device discovery, state storage, and delivery notification via WebSocket or push notification.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/multi-device-session-continuity-system-architecture.svg"
          alt="Multi-device session continuity architecture showing source device (session state capture: URL, scroll position, media position, form state, open panels), Session Relay Service (device registry, state store with 5-minute TTL, target device notification), target device (session restoration, re-authentication gate, cross-platform adaptation). Security layer: transfer tokens, device verification, and sensitive field exclusion."
          caption="Session continuity architecture: state capture → server relay with TTL → target device notification → authenticated restoration with cross-platform adaptation"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Session State Schema</h3>
        <p>
          The session state is a structured snapshot serialized as JSON. The schema: url (the current page URL, including query parameters but not URL fragments—fragments are client-only state), scrollPosition (percentage of page scrolled, 0.0–1.0, rather than absolute pixel offset—pixel offsets are device-specific), sectionAnchor (the ID of the nearest visible section heading, as a fallback for scroll position when the target device has different layout), mediaState (an array of{" "}
          <code>{`{ mediaId, positionMs, isPlaying }`}</code>{" "}
          for all media elements on the page), formState (an array of{" "}
          <code>{`{ fieldId, value }`}</code>{" "}
          for non-sensitive form fields—password and payment fields are explicitly excluded), openPanels (a list of panel IDs that are currently expanded or open), selectedTabId (for tabbed interfaces), and capturedAt (timestamp for freshness validation).
        </p>
        <p>Scroll position as a percentage (0.0–1.0) is more portable than absolute pixel coordinates: a 2000px tall page on desktop viewed at 500px from the top is 25% scrolled, which maps reasonably to the equivalent 25% position on a mobile page where the same content may be 3000px tall. The sectionAnchor provides a semantically meaningful fallback: if the scroll percentage calculation produces a wildly different position due to layout differences, the target device can scroll to the nearest section anchor instead. This is the same approach Apple uses for Handoff: the restored state is a "best approximation" of the source state, not an exact reproduction.</p>
        <p>Sensitive field exclusion is enforced at the capture layer: before the form state is included in the session snapshot, it is filtered against a denylist of field types (input[type="password"], input[type="credit-card-number"], and fields marked with data-no-session-capture) and a denylist of field names (password, cvv, creditCard, ssn). This exclusion is conservative by default: it is safer to not capture a field than to accidentally include sensitive data in a session state that traverses the network.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Device Registry and Discovery</h3>
        <p>The device registry maintains a list of devices associated with each user's account. A device is added to the registry on first login: the client generates a device fingerprint (a stable identifier derived from device characteristics: user agent, screen resolution, hardware concurrency, timezone) and sends it to the server along with a device name (auto-generated: "Chrome on MacBook Pro" or user-customizable). The server assigns a deviceId and stores it with the device fingerprint, name, platform, and last-seen timestamp.</p>
        <p>Active device discovery: a device is considered "active" if its last heartbeat was within the past 5 minutes. Heartbeats are sent by the client every 60 seconds while the app is in the foreground. The device list API returns active devices for the current user, excluding the requesting device (you cannot send a session to yourself). For each active device, the response includes the deviceId, device name, platform icon (mobile/tablet/desktop), and last-active timestamp. This list is displayed in the "Transfer to device" picker in the app's session continuity UI.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Transfer Protocol</h3>
        <p>
          The transfer protocol has four steps. Step 1 (initiation): the source device captures the current session state and sends it to the Session Relay Service via{" "}
          <code>POST /sessions/transfer</code> with the session state JSON and the target deviceId. The server validates that the target device belongs to the requesting user, stores the session state with a 5-minute TTL (in Redis), and generates a transferToken (a signed JWT with{" "}
          <code>{`{ sessionId, sourceDeviceId, targetDeviceId, expiresAt }`}</code>
          ). Step 2 (notification): the server sends a push notification or WebSocket event to the target device: &ldquo;Session available from [source device name]. Tap to continue.&rdquo; Step 3 (authentication): the target device receives the notification. If the user has a valid session on the target device, they are shown the session restore prompt. If not, they are asked to authenticate first (re-enter password or use biometrics). Step 4 (restoration): after authentication, the target device calls{" "}
          <code>GET /sessions/&lt;sessionId&gt;?token=&lt;transferToken&gt;</code> to retrieve the session state. The server verifies the token, returns the state, and deletes it (one-time use). The target device restores the session.
        </p>
        <p>The transferToken is one-time-use: once redeemed (or expired after 5 minutes), it cannot be used again. This prevents replay attacks where a malicious party intercepts the notification and attempts to redeem the session state. The token is signed with a secret key; the server verifies the signature on redemption. The session state is stored in Redis (not in the token itself) so the token payload is minimal and the session state can be as large as needed without token size constraints.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cross-Platform Session Adaptation</h3>
        <p>Desktop-to-mobile adaptation: desktop apps commonly have sidebars, split views, and expanded panels that do not exist on mobile. The session state includes openPanels, but the target device's restoration logic filters these against a platform capability manifest: if the target device is mobile, right-sidebar panels are ignored (they don't exist on mobile); if the source device had a document open in a split view, the mobile device opens the primary document only. The URL is the only truly universal state—it reconstructs the page regardless of device capability differences.</p>
        <p>Mobile-to-desktop adaptation is simpler: desktop devices have more capability, so they can always render the source state and more. A mobile session opened on desktop may lose fidelity in the other direction only if the source URL was a mobile-specific deep link (a mobile app deep link that does not have a web equivalent); in this case, the restoration falls back to the base URL of the section, with a message: "Content from mobile app not available in browser. Showing the closest available page."</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Security and Privacy Controls</h3>
        <p>Session continuity is a high-value target for attackers: if a session state can be hijacked, an attacker can impersonate the user on their own device. The security controls: (1) the session state is only accessible via a one-time transferToken that expires in 5 minutes; (2) the target device must be linked to the user's account (not any device that receives the notification); (3) the target device requires authentication before the session state is restored (prevents a stolen unlocked device from being used to receive session states); (4) the session state excludes sensitive field values; (5) the transfer uses HTTPS, so the token and state are encrypted in transit; (6) the server logs all session transfer events (sourceDeviceId, targetDeviceId, timestamp) in the audit log for security review.</p>
        <p>Privacy controls allow users to opt out of session continuity entirely (disabling it for all devices) or to configure which devices can receive session transfers (an allowlist of device IDs). The opt-out is stored in the user's account settings and checked before any session state is transmitted. A user who is concerned about session states traversing the server can disable the feature; the alternative (peer-to-peer session transfer without a server) is not implemented in this design due to the complexity of NAT traversal and device discovery on different networks.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/multi-device-session-continuity-system-workflow.svg"
          alt="Session transfer workflow showing four steps: (1) source device captures state + POST to relay service, (2) server stores state in Redis with 5-min TTL and sends WebSocket/push notification to target device, (3) target device authentication gate, (4) target device redeems one-time transferToken, retrieves session state, applies cross-platform adaptation, and restores session. Security events logged in audit trail."
          caption="Session transfer workflow: state capture → server relay → authentication gate → one-time token redemption → adapted session restoration"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Server-mediated versus peer-to-peer transfer: routing the session state through a server adds latency (2× round trips) and introduces a server as a trust intermediary (the server could theoretically access session state in transit). Peer-to-peer transfer (WebRTC DataChannel for same-network devices, similar to Apple's local Handoff implementation) eliminates the server from the data path, reduces latency to near zero for same-network devices, and keeps sensitive state off the network. The trade-off: peer-to-peer requires complex setup (WebRTC signaling, NAT traversal, device discovery on arbitrary networks), fails for cross-network transfers (phone on cellular, laptop on a different WiFi), and provides no offline delivery (the target device must be reachable at the moment of transfer). Server-mediated transfer is simpler, more reliable across network boundaries, and supports offline delivery via TTL storage—the correct default for a web-based product.</p>
        <p>State capture timing: capturing the session state at the exact moment the user clicks "Transfer" (on-demand capture) is most accurate but may introduce a brief delay if the state capture is expensive (serializing a complex editor state, measuring scroll position across many elements). Alternatively, state can be captured proactively and updated every 30 seconds (background snapshot), making the transfer instant but potentially transferring a state that is 30 seconds stale. For most use cases (article reading, shopping browsing), 30-second staleness is acceptable. For media playback (video, audio), on-demand capture with the exact playback position is required—a 30-second-stale media position is a noticeable UX failure.</p>
        <p>Privacy of session state notifications: the push notification to the target device says "Session available from iPhone." This notification reveals to anyone who sees the target device's screen (and lock screen) that the user was active on their iPhone. For users with shared devices, this is a privacy concern. The notification should not display the URL (which might reveal the content being viewed), only the source device name. In the most privacy-conscious implementation, the notification is a silent notification (no visible toast) that triggers a background fetch; the app checks for pending session states and shows an in-app prompt only, not a system notification.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A multi-device session continuity system captures navigation state (URL, scroll position as percentage, section anchor, media position, open panels) on the source device, relays it through a server-side store with a 5-minute TTL, and delivers it to the target device via push notification or WebSocket. The session state is accessed via a one-time signed transferToken that expires in 5 minutes and requires target device authentication before redemption. Cross-platform adaptation maps desktop-specific state (sidebars, split views) to equivalent mobile views using a platform capability manifest. Sensitive form fields (passwords, payment data) are explicitly excluded from captured state. The device registry tracks active devices via 60-second heartbeats; only devices active within 5 minutes are shown as transfer targets. Security events (all transfers) are logged in the audit trail. The defining constraint is that session continuity is a convenience feature, not a security model: the authentication gate on the receiving device is what prevents misuse, and the one-time-use token prevents replay attacks.</p>
      </section>
    </ArticleLayout>
  );
}

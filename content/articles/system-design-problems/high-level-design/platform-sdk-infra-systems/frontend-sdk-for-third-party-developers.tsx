"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-frontend-sdk-for-third-party-developers",
  title: "Design a Frontend SDK for Third-Party Developers",
  description:
    "Architecture for a developer-facing frontend SDK: API design, versioning, iframe isolation, authentication delegation, bundle strategy, and developer experience.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "frontend-sdk-for-third-party-developers",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-10",
  tags: ["hld", "sdk", "third-party", "iframe", "versioning", "developer-experience"],
  relatedTopics: ["embeddable-analytics-sdk", "plugin-extension-marketplace-ui"],
};

export default function FrontendSdkForThirdPartyDevelopersArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A frontend SDK for third-party developers allows external developers to embed your platform's functionality into their own applications. Examples: Stripe's Elements (embed payment forms), Mapbox GL JS (embed interactive maps), Intercom's Messenger (embed support chat), Figma's Plugin API (extend the Figma UI). These SDKs face a unique design challenge: they must be powerful enough for sophisticated developers to build meaningful integrations, but they must not expose the platform's internals in ways that create security vulnerabilities, break when the platform changes, or enable developers to misuse resources.</p>
        <p>The fundamental tension is between capability and isolation. More capability means more surface area for security bugs; more isolation means more friction in the developer experience. The SDK design must choose where on this spectrum to sit based on the use case: a payments SDK must be maximally isolated (the host page must not be able to read card numbers), while a map SDK needs rich bidirectional interactivity (host page controls the map state, map fires events back to the host page). These different requirements lead to different architectural choices.</p>
        <p><strong>Explicit assumptions:</strong> The SDK embeds interactive platform UI components into third-party web pages. Authentication is delegated: the platform authenticates the SDK using a publishable API key (for client-side use, scoped to read/low-risk operations) or a session token (obtained by the developer's server using a secret API key, then passed to the SDK). The SDK communicates with the platform's backend API on behalf of the authenticated session. The SDK is distributed as both an npm package (for build-tool integration) and a CDN-hosted script (for direct script-tag loading).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Component embedding:</strong> Developers can embed platform UI components (forms, widgets, viewers) into their pages with a few lines of code. Components render correctly in any host page environment.</li>
          <li><strong>Bidirectional communication:</strong> The SDK fires events to the host page (e.g., paymentSucceeded, userLoggedIn) and accepts configuration and commands from the host page (e.g., setTheme, prefillField).</li>
          <li><strong>Authentication delegation:</strong> The developer passes an API key or session token to the SDK on initialization. The SDK handles authentication with the platform's backend transparently.</li>
          <li><strong>Versioning and stability:</strong> The SDK follows semantic versioning. Breaking changes require a major version bump. Developers can pin to a specific major version and receive non-breaking updates automatically.</li>
          <li><strong>Customization:</strong> Developers can customize the appearance of embedded components (colors, fonts, border radius) via a theming API, without access to the platform's internal CSS.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Security:</strong> Sensitive data (credentials, payment card numbers) must never be accessible to the host page's JavaScript. The SDK must enforce origin validation on all postMessage communications.</li>
          <li><strong>Performance:</strong> SDK initialization must complete in under 500ms on a fast connection. The SDK must not cause layout shifts or block the host page's rendering.</li>
          <li><strong>Compatibility:</strong> The SDK must work in all modern browsers (Chrome, Firefox, Safari, Edge). It must not conflict with common frameworks (React, Vue, Angular) or global variables in the host page.</li>
          <li><strong>Developer experience:</strong> The SDK must have TypeScript type definitions, clear error messages, and comprehensive documentation. Developer errors (wrong API usage) must be surfaced clearly in development mode.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The SDK architecture has two sides: the host-side SDK (the JavaScript code that runs in the third-party developer's page) and the platform-side embed (the content that actually runs the platform's functionality). For security-sensitive use cases, the platform-side embed runs inside a sandboxed iframe hosted on the platform's domain; the host-side SDK communicates with it via postMessage. For non-security-sensitive use cases (maps, rich text viewers), the SDK renders directly into the host page's DOM, avoiding the performance overhead and cross-origin communication complexity of iframes.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/frontend-sdk-for-third-party-developers-architecture.svg"
          alt="Frontend SDK architecture showing host-side SDK (npm/CDN bundle, public API, postMessage bridge, DOM mounting point), platform-side iframe embed (sandboxed origin, full platform UI, API calls to platform backend, postMessage listener with origin validation), authentication flow (publishable key or server-side session token), versioning (major.minor.patch, CDN-hosted per major version, npm for exact pinning), and theming API (CSS custom properties passed as configuration, applied inside iframe)."
          caption="SDK architecture: host-side public API + postMessage bridge ↔ platform-side sandboxed iframe + platform backend API, with authentication delegation and theming"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Iframe Isolation and postMessage Protocol</h3>
        <p>For security-sensitive components (payment forms, authentication flows, credential displays), the platform renders the sensitive UI inside an iframe with src on the platform's own domain. The iframe is sandboxed (sandbox="allow-scripts allow-forms allow-same-origin") to prevent the embedded page from navigating the top-level frame, opening popups, or accessing the host page's DOM. The platform's sensitive UI (card number field, password field) runs inside this iframe, making it inaccessible to the host page's JavaScript regardless of what scripts the host page runs. This is the security model Stripe Elements uses: the card number input is an iframe; Stripe's server receives the card number directly; the host page only receives a token.</p>
        <p>The postMessage protocol between the host SDK and the iframe defines the full API surface. Each message has a type (a string enum), a payload, and a correlationId (UUID for matching responses to requests). The iframe validates every incoming message's origin against the known host origins (registered by the developer in the platform's dashboard). This origin validation prevents malicious third-party pages from injecting commands into the iframe. The iframe rejects messages from unknown origins and logs a security warning. Message types: INITIALIZE (send configuration and auth token), SET_THEME (send theme configuration), RESIZE (iframe notifies host of its content height for auto-resizing), EVENT (iframe fires a domain event like PAYMENT_SUCCEEDED to the host), COMMAND (host sends a command like SUBMIT_FORM to the iframe).</p>
        <p>Auto-resizing: the iframe has a fixed height initially, but its content height changes as the user interacts (validation errors appear, additional fields are shown). The iframe sends RESIZE messages with its scrollHeight to the host SDK, which sets the iframe's height style accordingly. This avoids scrollbars inside the iframe and makes the embedded component feel like a native part of the host page. ResizeObserver inside the iframe monitors content size changes and triggers RESIZE messages on every change.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Authentication Delegation</h3>
        <p>The SDK uses two authentication models depending on the operation. Publishable key authentication: for low-risk, read-only operations (rendering a product catalog, showing a map), the developer passes their publishable API key directly to the SDK (sdk.init(publishableKey)). The publishable key is safe to expose in client-side code because it is scoped to read-only operations on public data. The key is sent with every API request as a header; the platform's backend validates it and scopes the response to the key's permissions.</p>
        <p>Session token authentication: for operations that involve user-specific data or write operations (processing a payment, updating user settings), the developer's server obtains a short-lived session token by calling the platform's API with the developer's secret key (which never touches the browser). The server passes this session token to the browser (e.g., as a data attribute on the SDK mount point or via a JavaScript variable), and the SDK initializes with it. The session token has a 15-minute TTL and is scoped to a single user session. This model ensures the secret key never appears in client-side code, and the session token has limited blast radius if intercepted. Token refresh: the SDK automatically refreshes the session token before expiry by calling a developer-provided refresh callback function (sdk.init(sessionToken, &#123; onTokenExpiring: async function() &#123; return fetchNewToken(); &#125; &#125;)).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">SDK Versioning Strategy</h3>
        <p>The SDK follows semantic versioning (major.minor.patch). The CDN distribution provides version-pinned URLs at three granularities: exact version (v2.3.1), minor-pinned (v2.3), and major-pinned (v2). Developers who load the SDK from the major-pinned URL automatically receive patch and minor updates (which are guaranteed non-breaking). Developers who need precise control pin to an exact version. Major version URLs (v2, v3) coexist indefinitely on the CDN; a developer on v2 never involuntarily upgrades to v3.</p>
        <p>The platform maintains the previous major version for at least 18 months after a new major version is released (the deprecation window). During this window, the old major version receives security fixes but no new features. Developers are notified via email and in-SDK deprecation warnings (logged to the console in development mode) that the version is deprecated. The deprecation warning includes a migration guide link and the timeline for end-of-life. After the deprecation window, the old major version's CDN URL returns a 410 Gone response (not a 404—the distinction signals intentional removal rather than a broken link).</p>
        <p>Breaking change governance: any change to the SDK's public API surface (method signatures, event names, postMessage protocol) requires a major version bump, regardless of how small the change appears. The API surface is explicitly documented as a contract. An internal changelog tracks every change with a categorization (breaking, feature, fix); this changelog drives the semantic version decision and the migration guide content. The "expand-contract" pattern is used to add new API surface before removing old: a new method is added in a minor version; the old method is deprecated; the old method is removed in the next major version. This gives developers a migration window without forcing an immediate major version upgrade.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Theming and Customization API</h3>
        <p>Developers can customize the appearance of embedded components without access to the platform's internal CSS. The theming API accepts a flat configuration object (sdk.init(key, &#123; theme: &#123; colorPrimary: '#1a73e8', borderRadius: '8px', fontFamily: 'Inter' &#125; &#125;)). The host SDK validates the theme object against a schema (type checking, allowed values for enum properties like fontFamily) and transmits it to the iframe as part of the INITIALIZE message. Inside the iframe, the platform's CSS applies the theme values as CSS custom property overrides on the root element, which cascade to all component styles.</p>
        <p>The theming API intentionally exposes only a curated set of design tokens (20–30 properties: colors, border radius, font family, spacing scale) rather than arbitrary CSS injection. Arbitrary CSS injection would be a security risk (it could be used to overlay the iframe with deceptive content—a clickjacking variant) and a maintenance burden (any platform CSS refactor could break developer-injected styles). The curated token set is stable across platform versions (tokens are never renamed without a major version bump) and provides enough customization for most integration use cases.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Bundle Strategy and Distribution</h3>
        <p>The SDK is distributed in three forms. The npm package provides the full SDK source with TypeScript types, tree-shakeable named exports (import &#123; createPaymentForm &#125; from '@platform/sdk'), and a CommonJS build for older toolchains. The CDN-hosted bundle (UMD format) is a single self-contained file loaded via script tag, accessible on the window.PlatformSDK global. The CDN bundle is split into a core module (always loaded) and feature modules (loaded on demand via dynamic import from the CDN).</p>
        <p>Build tooling: the SDK uses tsup (esbuild-based) for building all output formats from a single TypeScript source. The build generates: ESM for modern bundlers, CJS for legacy bundlers, a UMD bundle for CDN distribution, and a .d.ts TypeScript declaration file. The UMD bundle is minified and compressed (Brotli for CDN delivery). The CDN uses a long-lived cache (Cache-Control: max-age=31536000, immutable) on exact-version URLs (v2.3.1) and a short-lived cache (max-age=300) on major-pinned URLs (v2) to balance cache efficiency with update delivery speed.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/frontend-sdk-for-third-party-developers-versioning.svg"
          alt="SDK versioning and embed boundaries showing CDN URL structure (v2/sdk.js = major-pinned, v2.3/sdk.js = minor-pinned, v2.3.1/sdk.js = exact), deprecation lifecycle (18-month support window, in-SDK console warnings with migration guide link, 410 Gone after EOL), iframe sandbox attributes (allow-scripts allow-forms allow-same-origin), postMessage origin validation (allowlist from developer dashboard), and theme token flow (host configuration object → INITIALIZE message → CSS custom properties inside iframe)."
          caption="SDK versioning: CDN major/minor/exact URLs, 18-month deprecation window, iframe sandbox + postMessage origin validation, theme tokens as CSS custom properties"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Iframe versus direct DOM rendering: iframes provide strong security isolation (host page JavaScript cannot access iframe content) but add latency (iframe load time), complicate styling (iframe contents do not inherit host page CSS), and require postMessage for all communication (adding serialization overhead). Direct DOM rendering is faster and simpler but exposes the platform's internals to the host page and creates CSS namespace conflicts. The decision should be driven by security requirements: use iframes for any component that handles sensitive data (credentials, payments), and use direct DOM rendering for components where isolation is not a security requirement (maps, charts, content viewers).</p>
        <p>Developer experience versus security: requiring developers to obtain session tokens from their own server (for write operations) adds implementation complexity compared to a simple publishable key. However, a publishable key that can perform write operations is a significant security risk (any user who inspects the network requests gets a credential that can perform writes). The server-side token fetch is the correct trade-off for write operations. Reducing friction: provide server-side SDK libraries (Node.js, Python, Ruby) that make the token fetch a one-liner, and provide a development mode that uses mock tokens (clearly labeled as unsafe for production) so developers can prototype without setting up their server.</p>
        <p>CSP (Content Security Policy) compatibility: host pages with strict CSP headers may block the SDK's iframe or its network requests. The platform must document its CSP requirements (frame-src, connect-src directives) and provide a CSP compatibility checker in the developer dashboard. The platform's iframe URL and API endpoint origins should be stable (not dynamically generated) so developers can add them to their CSP allowlists once and not update them frequently. Inline scripts (often blocked by CSP) must not be used; the SDK's initialization script should be loadable from the CDN URL that is already in the developer's CSP allowlist.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A frontend SDK for third-party developers provides embeddable platform UI components via a public API that hides implementation details behind a stable, versioned contract. Security-sensitive components use sandboxed iframes with a postMessage protocol (type, payload, correlationId) validated by origin allowlisting—the iframe isolation ensures host-page JavaScript cannot access sensitive data regardless of what scripts run on the host page. Authentication uses publishable keys for read operations and short-lived session tokens (obtained server-side) for write operations. Versioning uses CDN major-pinned URLs (v2/sdk.js) for automatic non-breaking updates, exact-pinned URLs for strict control, and an 18-month deprecation window for major versions with in-SDK console warnings. The theming API exposes a curated set of CSS custom property tokens (not arbitrary CSS injection) transmitted via INITIALIZE messages. The SDK is distributed as npm (ESM + CJS + TypeScript types) and CDN UMD bundle built with tsup. The fundamental design decision—iframe versus direct DOM—is driven by whether the component handles sensitive data that must be isolated from the host page's JavaScript context.</p>
      </section>
    </ArticleLayout>
  );
}

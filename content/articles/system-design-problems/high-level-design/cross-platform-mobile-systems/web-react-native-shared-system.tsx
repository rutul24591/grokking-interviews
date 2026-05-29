"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-web-react-native-shared-system",
  title: "Design a Web + React Native Shared System",
  description:
    "Principal-level design of a shared Web and React Native system using monorepo boundaries, platform-specific UI implementations, shared domain logic, design tokens, storage adapters, navigation separation, release governance, and CI/CD.",
  category: "high-level-design",
  subcategory: "cross-platform-mobile-systems",
  slug: "web-react-native-shared-system",
  wordCount: 5700,
  readingTime: 33,
  lastUpdated: "2026-05-22",
  tags: ["hld", "react-native", "monorepo", "code-sharing", "cross-platform", "design-tokens", "deep-links", "push-notifications", "turborepo"],
  relatedTopics: ["responsive-cross-device-architecture", "pwa-offline-sync"],
};

export default function WebReactNativeSharedSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A Web and React Native shared system lets a product organization build a browser application and a native mobile application from one coordinated codebase while preserving platform-specific user experience. React and React Native share a programming model, but they do not share a rendering target. Web renders DOM, CSS, browser navigation, cookies, and service workers. React Native renders native views, uses native navigation, and integrates with APNs, FCM, SecureStore, Keychain, Keystore, sensors, and app lifecycle APIs.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The principal-level design problem is deciding what must be shared, what must remain platform-native, and how to enforce that boundary as teams scale. The winning architecture shares domain logic aggressively, shares UI contracts selectively, and keeps rendering, navigation, storage, permissions, notifications, and release mechanics platform-aware.
        </HighlightBlock>
        <p>
          The common target is not one hundred percent code reuse. A realistic high-quality system may share API clients, schema validation, domain models, business workflows, state machines, analytics contracts, design tokens, and test utilities, while keeping web and native screen implementations distinct where interaction quality matters. The goal is consistent product behavior, not identical implementation.
        </p>
        <p>
          This architecture fits organizations that need a web product, iOS app, and Android app with aligned behavior and moderate to high product velocity. It is risky when teams use sharing as a mandate rather than an engineering decision. Over-sharing can produce awkward mobile UI, inaccessible web components, fragile bundling, and platform bugs that are harder to isolate.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The monorepo is the coordination mechanism. It allows atomic changes across shared packages and platform apps, common linting, shared testing utilities, consistent dependency versions, and cached CI tasks. A typical structure separates web and mobile apps from packages for core logic, API clients, validation, design tokens, analytics, and UI contracts. The dependency graph must flow inward from apps to shared packages, not from shared packages back to platform applications.
        </p>
        <p>
          The core package should be platform-neutral. It can contain domain models, validation schemas, API request construction, state machines, feature-flag evaluation, analytics event definitions, and business rules. It should not import browser APIs, React Native APIs, navigation libraries, storage implementations, DOM types, or native modules. This boundary should be enforced by TypeScript configuration, lint rules, package dependency checks, and code ownership.
        </p>
        <HighlightBlock as="p" tier="important">
          Platform-specific file resolution is a controlled escape hatch. A shared import can resolve to web or native implementations for UI primitives, storage adapters, network reachability, secure token access, and notification delivery. The shared contract remains stable, while the implementation uses the right platform primitive.
        </HighlightBlock>
        <p>
          Design tokens provide visual consistency without forcing identical components. Tokens define color semantics, spacing, radii, typography scale, motion duration, and density rules once. Web can consume tokens as CSS custom properties or compiled CSS. React Native can consume them as JavaScript values for native styles. The same semantic token can map to platform-appropriate rendering while preserving brand and accessibility intent.
        </p>
        <p>
          Navigation should usually not be shared as an abstraction. Web navigation is URL and browser-history centered. React Native navigation is stack, tab, modal, and deep-link centered. What can be shared is route identity, typed route params, permission rules, deep-link parsing, analytics events, and business side effects. The actual navigation call should remain platform-specific.
        </p>
        <p>
          Release governance differs by platform. Web can deploy many times per day. Mobile requires app-store review, installed-version compatibility, phased rollout, crash monitoring, and long-tail support. Shared package changes must account for both clocks. A change that is safe for web can still break an older mobile app if the contract is not versioned and guarded.
        </p>
        <p>
          Dependency governance is part of the system design. React Native, Metro, Expo, Hermes, native modules, Next.js, bundlers, and TypeScript do not always upgrade on the same cadence. A shared repository needs compatibility windows, upgrade ownership, dependency grouping, and a policy for native-module adoption. Otherwise a web-only dependency decision can force mobile bundle growth, native build failures, or JavaScript runtime incompatibilities.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The architecture has three layers. Platform apps own entry points, routing, platform permissions, native module wiring, platform-specific storage, and release configuration. Shared platform adapters expose a common interface for storage, network status, notifications, analytics transport, and secure token access. Pure shared packages contain domain logic, schemas, state transitions, API contracts, feature flag interpretation, and reusable UI contracts.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/cross-platform-mobile-systems/web-react-native-shared-system.svg"
          alt="Web and React Native shared monorepo architecture with web app, mobile app, shared UI, core package, design tokens, platform file resolution, deep links, push notifications, and Turborepo CI."
          caption="A shared Web and React Native system works best when pure domain logic is shared, platform adapters isolate runtime differences, and UI implementations remain native where interaction quality matters."
        />
        <p>
          A typical feature begins with a shared domain contract: API types, validation, feature flag names, analytics events, and state transition rules. The web app composes a route using DOM components, browser storage, and web navigation. The mobile app composes a screen using React Native primitives, native storage, and native navigation. Both consume the same domain workflow and emit the same analytics event names, but they render and navigate through platform-native mechanisms.
        </p>
        <p>
          Boundary enforcement should run before code reaches production. The core package should be compiled without DOM types, linted against platform imports, and tested in a runtime that resembles both server-side JavaScript and React Native&apos;s JavaScript engine constraints. UI packages should allow platform imports only inside platform-specific files. Dependency graph checks should prevent shared packages from depending on apps.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/cross-platform-mobile-systems/web-react-native-shared-system-boundaries.svg"
          alt="Platform boundary diagram showing pure shared core, platform adapters, web app, mobile app, forbidden imports, and allowed dependency direction."
          caption="Mechanical boundary enforcement matters more than team convention: pure shared packages must not depend on browser, native, navigation, or app-layer APIs."
        />
        <p>
          CI/CD should understand the dependency graph. A token-only change should rebuild token consumers. A core change should run web, mobile, and shared package tests. A web-only route change should not rebuild the mobile app. Remote build caching and affected-package detection keep the monorepo fast enough for daily work, while release pipelines remain platform-specific after validation passes.
        </p>
        <p>
          Runtime capability negotiation protects against release skew. The mobile app should expose app version, native module versions, enabled capabilities, and supported contract versions to shared code at startup. Shared workflows can then choose a supported path, hide unsupported actions, or request an app update for hard dependencies. Web can usually update with the backend, but mobile must assume old native capability surfaces will exist in the wild for months.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/cross-platform-mobile-systems/web-react-native-shared-system-release.svg"
          alt="Release governance flow showing shared package change, affected tests, web deployment, mobile phased rollout, version compatibility, crash monitoring, and rollback."
          caption="Shared systems need release governance across two clocks: web deploys immediately, while mobile rolls out through app stores and must support older installed versions."
        />
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          Sharing more code reduces duplication and keeps behavior aligned, but it can also flatten platform quality. Business rules, validation, API clients, feature flags, analytics contracts, and state machines are usually good sharing candidates. Rendering, navigation, gestures, platform permissions, storage, notification delivery, and performance-sensitive UI often need platform-specific implementation. The important decision is not how much code is shared, but whether the shared boundary preserves product correctness and platform quality.
        </p>
        <p>
          A monorepo improves atomic changes and dependency visibility, but it increases tooling complexity, CI cost, and ownership coordination. Multiple repositories can provide clearer access boundaries and independent release cycles, but shared package versioning becomes slower and cross-platform changes require more choreography. For a product team that owns both web and mobile, a monorepo is usually worth it. For independent platform organizations, versioned shared packages may be safer.
        </p>
        <HighlightBlock as="p" tier="important">
          Universal UI components are tempting but risky. A button, icon, token, or simple text primitive can be shared behind platform implementations. Complex screens, gestures, modals, forms, tables, maps, media controls, and navigation flows often need platform-specific UX. Principal-level answers should emphasize native-feeling outcomes over theoretical reuse percentages.
        </HighlightBlock>
        <p>
          Shared validation improves consistency but does not replace backend validation. Client schemas can provide immediate feedback on both platforms, but the server remains authoritative for security, authorization, and business invariants. If the same schema is used across client and server, versioning still matters because mobile clients may run older schema versions after the backend changes.
        </p>
        <p>
          Shared state management reduces duplicate behavior, but persistence and lifecycle differ. Browser storage, HttpOnly cookies, service workers, tab synchronization, app backgrounding, secure native storage, and mobile memory pressure are not equivalent. The state model can be shared, but storage adapters and lifecycle reconciliation should be platform-specific.
        </p>
        <p>
          Shared analytics improves product consistency but can hide platform-specific meaning. A tap on a mobile push notification, a browser deep link, and a desktop sidebar click might all open the same route, but they represent different acquisition and lifecycle contexts. The event taxonomy should share stable event names and entity ids while allowing platform fields such as notification campaign, app foreground state, browser referrer, install source, and native app version.
        </p>
        <p>
          Faster web deployment can create contract skew with mobile. If web and backend move ahead of mobile assumptions, old app versions may break. Shared API and feature contracts should be versioned, capabilities should be negotiated, and backend changes should remain backward-compatible across the supported mobile version window.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Define package boundaries in writing and enforce them mechanically. Core packages should have no platform dependencies. Adapter packages can depend on platform APIs. App packages can compose everything. Lint rules, TypeScript project references, dependency graph checks, and code owners should all reinforce the same architecture.
        </p>
        <p>
          Share contracts before sharing UI. Typed route params, analytics events, validation schemas, domain state machines, API clients, feature-flag names, and error models usually create more consistency than forcing every screen into one universal component model. This keeps product behavior aligned while leaving platform teams room to produce excellent UX.
        </p>
        <p>
          Use platform adapters for storage, secure tokens, network status, notifications, and device capabilities. The shared layer should call a stable interface. Web implementations can use browser primitives. Native implementations can use AsyncStorage, SecureStore, Keychain, Keystore, NetInfo, APNs, FCM, and native lifecycle hooks.
        </p>
        <p>
          Keep navigation platform-native but route contracts shared. A shared route registry can define route names, params, auth requirements, and analytics metadata. Web maps those routes to URLs. React Native maps them to screens and deep-link configurations. This avoids an awkward lowest-common-denominator navigation abstraction.
        </p>
        <p>
          Build CI around affected packages. A changed validator package should run shared tests and app integration tests that consume it. A changed native adapter should run mobile tests. A changed web page should avoid unnecessary mobile rebuilds. Fast feedback is essential because slow monorepo CI encourages teams to bypass shared packages.
        </p>
        <p>
          Treat mobile compatibility as a long-lived contract. Feature flags, API versions, migration plans, and deprecation windows should account for users who do not update immediately. Monitor app version adoption before removing old shared contract behavior.
        </p>
        <p>
          Shared web and React Native systems need a clear boundary between portable domain logic and platform-specific capability. Validation, state machines, analytics schemas, feature flags, and API clients often share well. Navigation primitives, accessibility semantics, file handling, push notifications, background tasks, and media permissions usually need platform adapters. Principal-level designs avoid pretending that every component can be universal.
        </p>
        <p>
          Dependency governance is a production concern. A shared package can pull different transitive dependencies into web and native bundles, affect app-store review, break tree shaking, or introduce native module version conflicts. The platform should define allowed dependency classes, bundle budgets, native-module review, and release compatibility across web deploys and mobile app versions.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is importing platform APIs into shared core packages because it is convenient. One browser storage call or one React Native module import can make a package unusable in SSR, tests, or the other platform. The boundary must fail at lint or compile time, not during a mobile release candidate.
        </p>
        <p>
          Another pitfall is abstracting navigation too aggressively. A generic navigate function that hides browser history, deep links, modal stacks, tab state, and native back behavior often becomes leaky. Shared route metadata is useful; shared navigation execution is usually not.
        </p>
        <p>
          Teams also overestimate UI reuse. Components that look similar in design files may need different accessibility semantics, focus behavior, press feedback, gestures, layout constraints, and performance tuning. Sharing a contract and platform-specific implementation is often better than sharing one universal implementation.
        </p>
        <p>
          Release coupling can surprise teams. A shared package change might be deployed instantly to web but only reach mobile users over weeks. If backend behavior changes during that gap, older mobile apps may fail. Versioned contracts, capability checks, and staged mobile rollout are necessary parts of the architecture.
        </p>
        <p>
          Monorepo tooling can become a bottleneck. If dependency graphs are unclear, cache keys are unstable, or every change triggers every build, developers will avoid shared improvements. The build system must be treated as production infrastructure for the engineering organization.
        </p>
        <p>
          Teams often underestimate release skew. Web can deploy many times per day, while native users may run old app versions for months. Shared contracts must be backward compatible, feature flags must include minimum app versions, and server APIs should support old clients during migration. A principal-ready design treats version skew as normal rather than exceptional.
        </p>
        <p>
          Another pitfall is sharing UI too aggressively and losing platform quality. Native users expect platform navigation, gestures, accessibility, keyboard handling, and performance characteristics. Web users expect links, browser history, responsive layout, and SEO where relevant. Shared systems should maximize consistency in behavior and design language while still allowing platform-native presentation.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Consumer marketplaces often share search query construction, filter schemas, listing models, pricing rules, experimentation flags, and analytics events across web and mobile. The web app may prioritize SEO and dense comparison pages, while native apps focus on push re-engagement, saved searches, and smooth gesture navigation.
        </p>
        <p>
          Banking and fintech products share validation, money formatting, error models, fraud challenge state machines, and API clients, while keeping secure token storage, biometrics, native attestation, and platform-specific risk flows separate. This preserves consistency while respecting mobile security requirements.
        </p>
        <p>
          SaaS tools can share permissions, role models, entity schemas, notification routing, and business workflows. Desktop web may provide dense admin screens and bulk actions, while mobile focuses on approvals, alerts, comments, and lightweight updates.
        </p>
        <p>
          Media and learning platforms share content models, entitlement checks, playback metadata, progress tracking, and recommendation contracts. Web uses browser media and SEO surfaces. Native apps integrate downloads, background playback, push, and app-store subscription flows.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. What would you share between web and React Native, and what would you keep separate?</h3>
        <p>
          I would share domain models, API clients, validation schemas, business workflows, feature-flag interpretation, analytics contracts, design tokens, and state-machine logic. I would keep rendering, navigation execution, native modules, secure storage, notification delivery, gestures, animations, and platform lifecycle handling separate or behind adapters. The goal is shared product correctness with platform-native UX.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. How would you enforce the platform boundary?</h3>
        <p>
          I would enforce it with package layering, TypeScript project references, lint rules that block platform imports in shared core, dependency graph checks, code ownership, and tests that compile shared packages in platform-neutral environments. UI packages can allow platform imports only in platform-specific files. This makes architecture violations fail during development instead of after a mobile build or SSR deployment.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. How do you handle storage and authentication differences?</h3>
        <p>
          The shared auth state and API client can be common, but token persistence should be platform-specific. Web can rely on HttpOnly cookies or browser storage depending on security requirements. Native should use SecureStore, Keychain, or Keystore-backed storage for sensitive tokens. The shared layer should depend on a storage and token adapter interface so the auth workflow remains consistent while storage mechanics remain platform-appropriate.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How would you design navigation and deep links across both platforms?</h3>
        <p>
          I would share route names, typed params, auth requirements, analytics metadata, and deep-link parsing rules. Web maps those contracts to URLs and browser history. React Native maps them to navigation screens, stacks, tabs, and universal or app links. Deep links should be tested for cold start and already-running app states. I would not hide both routing systems behind a single generic navigation abstraction because their behavior differs too much.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. How do you manage CI/CD and releases in a shared monorepo?</h3>
        <p>
          CI should run tasks based on the affected dependency graph. Shared package changes trigger tests for consumers. Platform-only changes run platform-specific checks. Build caching keeps feedback fast. Release remains platform-specific: web can deploy immediately with rollback, while mobile uses app-store builds, phased rollout, crash monitoring, and compatibility windows. Shared contracts need versioning because mobile clients update slowly.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. What are the main risks of this architecture at scale?</h3>
        <p>
          The main risks are leaky shared boundaries, over-shared UI, slow monorepo builds, dependency conflicts, release skew between web and mobile, and unclear ownership of shared packages. I would mitigate them with strict package rules, clear ownership, affected-package CI, platform adapter patterns, contract versioning, and product guidelines that optimize for platform quality rather than a reuse percentage target.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://reactnative.dev/docs/platform-specific-code" target="_blank" rel="noreferrer">React Native Documentation: Platform-Specific Code</a>
          </li>
          <li>
            <a href="https://reactnavigation.org/docs/deep-linking/" target="_blank" rel="noreferrer">React Navigation: Deep Linking</a>
          </li>
          <li>
            <a href="https://turbo.build/repo/docs" target="_blank" rel="noreferrer">Turborepo Documentation</a>
          </li>
          <li>
            <a href="https://docs.expo.dev/versions/latest/sdk/securestore/" target="_blank" rel="noreferrer">Expo Documentation: SecureStore</a>
          </li>
          <li>
            <a href="https://docs.expo.dev/push-notifications/overview/" target="_blank" rel="noreferrer">Expo Documentation: Push Notifications</a>
          </li>
          <li>
            <a href="https://www.typescriptlang.org/docs/handbook/project-references.html" target="_blank" rel="noreferrer">TypeScript Documentation: Project References</a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-plugin-extension-marketplace-ui",
  title: "Design a Plugin / Extension Marketplace UI",
  description:
    "Architecture for a plugin marketplace: plugin registry, trust and permissions model, installation workflow, sandboxed execution, versioning, and developer portal.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "plugin-extension-marketplace-ui",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-10",
  tags: ["hld", "plugin", "marketplace", "extension", "sandbox", "permissions"],
  relatedTopics: ["frontend-sdk-for-third-party-developers", "frontend-architecture-for-an-internal-developer-platform"],
};

export default function PluginExtensionMarketplaceUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A plugin marketplace allows third-party developers to extend a platform's functionality beyond what the platform team can build. Examples: Figma plugins (design tools and automation), VS Code extensions (editor features), Shopify apps (e-commerce integrations), Slack apps (workflow automation). The marketplace is the interface through which end users discover, install, and manage these extensions. The platform team cannot vet every plugin before installation (scale is too large), so the architecture must enforce a permission model that limits what a plugin can do and makes those limits clear to users before installation.</p>
        <p>The trust problem is the defining challenge: a plugin is code written by a third-party developer who is not a platform employee. That code runs in the user's browser (or on the platform's servers) with access to the user's data. A malicious or buggy plugin can read the user's documents, exfiltrate data, inject deceptive UI, or degrade performance. The marketplace must make users aware of the risks (the permissions the plugin requests), enforce technical limits (sandbox the plugin code so it cannot exceed its declared permissions), and provide recourse (reporting, takedown mechanisms) when a plugin abuses its access.</p>
        <p><strong>Explicit assumptions:</strong> The marketplace serves a design/productivity platform (Figma-like). Plugins are JavaScript/TypeScript bundles that run inside a sandboxed iframe in the platform. Plugins communicate with the platform via a typed postMessage API (the plugin API). Plugins can read and write to the active document (scoped to the platform's data model), make network requests to declared external domains, and display UI in a panel alongside the document. The marketplace has a developer portal for plugin submission, review, and distribution.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Plugin discovery:</strong> Users can browse and search the marketplace by category, popularity, and rating. Each plugin listing shows its name, description, screenshots, permission requirements, and install count.</li>
          <li><strong>Installation workflow:</strong> Installing a plugin shows the permissions it requires (read document, write document, network access to listed domains). The user explicitly approves the permissions before installation proceeds.</li>
          <li><strong>Plugin management:</strong> Users can view their installed plugins, enable/disable them, update to new versions, and uninstall. Admins (for team/organization accounts) can control which plugins are available to team members.</li>
          <li><strong>Plugin execution:</strong> Installed plugins run in a sandboxed iframe with access only to the declared API surface. Plugins can open a UI panel, run background tasks (while the platform is open), and execute on document events (e.g., on file save).</li>
          <li><strong>Developer portal:</strong> Plugin developers can submit new plugins, upload new versions, manage their listing (screenshots, description, changelog), and view usage analytics (install counts, active users, error rates).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Sandbox enforcement:</strong> A plugin cannot access platform data or capabilities beyond its declared permissions, regardless of what code it contains.</li>
          <li><strong>Plugin isolation:</strong> A plugin crash or infinite loop must not affect the platform's main UI or other plugins.</li>
          <li><strong>Installation time:</strong> Plugin installation (after permission approval) completes in under 5 seconds.</li>
          <li><strong>Marketplace search latency:</strong> Search results return within 500ms for queries against the full plugin catalog.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The marketplace has three components: the registry (database of plugin metadata, versions, permission manifests, and installation records), the distribution layer (CDN-hosted plugin bundles, served per-version), and the execution environment (the platform's plugin host that loads installed plugins into sandboxed iframes). The developer portal is a separate application for plugin authors to submit and manage plugins. The marketplace UI is part of the main platform UI, showing the plugin catalog and managing installation state.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/plugin-extension-marketplace-ui-architecture.svg"
          alt="Plugin marketplace architecture showing registry (plugin metadata, versions, permission manifests, install records), distribution layer (CDN-hosted plugin bundles per version, content-addressed by hash), developer portal (plugin submission, review workflow, version management, usage analytics), execution environment (platform plugin host: iframe per plugin, postMessage API bridge, permission enforcement, timeout watchdog), and marketplace UI (search and browse, plugin listing with permissions, installation workflow with permission approval dialog)."
          caption="Marketplace architecture: registry + CDN distribution + developer portal + sandboxed iframe execution with postMessage API bridge and permission enforcement"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Plugin Manifest and Permission Model</h3>
        <p>Every plugin has a manifest file (plugin.json) that declares its identity and permission requirements. The manifest: name, description, version (semver), authorId, permissions (an array of permission strings), networkAccess (an array of allowed domain patterns), uiCapabilities (panel type, dimensions), and the entry point URL (the plugin's JavaScript bundle URL on the CDN). The permissions array is a declarative list of platform API capabilities the plugin uses: document.read, document.write, currentUser.read, fileSystem.read, clipboard.write. The platform enforces that the plugin can only call postMessage API methods that correspond to its declared permissions; calls to undeclared methods are silently rejected.</p>
        <p>Permission granularity: the permission list is intentionally granular (document.read is separate from document.write; currentUser.read is separate from currentUser.write) so that users can make informed decisions. A plugin that only needs to read the document (e.g., an export tool) does not need write permissions, and the install dialog communicates this: "This plugin can read your document but cannot make changes." A plugin that requests document.write is more powerful and should be scrutinized more carefully. The install dialog groups permissions into user-readable categories with clear descriptions ("Can modify your document," "Can access your profile information") rather than showing raw permission strings.</p>
        <p>Network access declaration: plugins that make external network requests must declare the target domains in their manifest (networkAccess: ["api.plugin-author.com"]). The sandbox enforces this by intercepting fetch/XHR calls inside the plugin iframe and blocking requests to undeclared domains. Users see the declared domains in the install dialog ("This plugin communicates with api.plugin-author.com"). Domain patterns support wildcards for subdomains (*.plugin-author.com) but not for TLDs (*.com is not allowed). This network declaration is both a user transparency mechanism and a technical enforcement point.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Plugin Review and Trust Levels</h3>
        <p>The marketplace assigns trust levels to plugins: submitted (newly uploaded, not yet reviewed), verified (manually reviewed by the platform team), and featured (curated by the platform team as high-quality). Trust level affects discoverability (featured plugins appear at the top of search results) and the install warning displayed to users (submitted plugins show a "This plugin has not been reviewed by [Platform]" warning; verified plugins do not). The trust level does not affect sandbox enforcement—all plugins, regardless of trust level, are sandboxed identically.</p>
        <p>The review process for verification: the platform team reviews the plugin's source code (required for submission: the bundle must be accompanied by a source map and a GitHub repository link), its manifest (permissions must be consistent with the stated functionality), its UI screenshots, and its privacy policy (required for plugins that request any user data). The review is manual but tool-assisted: automated checks flag manifest inconsistencies (a plugin that declares document.write but has no source code paths that call the document.write API), suspicious network domains, and known malicious code patterns (via a static analysis scan of the bundle).</p>
        <p>Automated security scanning: each uploaded plugin bundle is scanned by a static analysis tool before it appears in the marketplace (even as "submitted" status). The scanner checks for: direct eval() calls (a signal that the plugin may be trying to evaluate user-provided code), obfuscated code (a signal of attempted detection evasion), known vulnerable library versions (matching the bundle's dependencies against a CVE database), and overly broad CSP bypasses. Plugins that fail the automated scan are rejected with a specific failure reason surfaced to the developer in the portal.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Installation Workflow and Permission Approval</h3>
        <p>The installation workflow is a three-step modal. Step 1: show the plugin listing (name, author, description, screenshots, install count, average rating). Step 2: show the permission approval screen—a clear, plain-language list of what the plugin can do (organized by risk level: high-risk permissions like document.write are listed first). The user can see the full list of declared network domains. Step 3: installation confirmation—the plugin is registered in the user's install list, and the plugin bundle URL is recorded (pinned to the current version). Installation does not auto-update to new major versions (which may add new permissions); only patch and minor updates (which cannot add new permissions—enforced by the registry) are applied automatically.</p>
        <p>Organization-level plugin control: organization admins can create an allowlist of permitted plugins (only allowlisted plugins can be installed by members), a denylist (specific plugins blocked for all members), and a "open marketplace" policy (any plugin can be installed). The default for new organizations is the open marketplace policy; security-conscious organizations switch to allowlist mode. When a member tries to install a non-allowlisted plugin, they see a message: "Your organization admin has restricted plugin installation. Contact your admin to request this plugin." The admin receives a notification of the request.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Sandboxed Plugin Execution</h3>
        <p>Each installed plugin runs in its own sandboxed iframe. The iframe's src is a platform-controlled URL (plugin-sandbox.platform.com/&#123;pluginId&#125;) that serves a minimal HTML shell loading the plugin's JavaScript bundle. The iframe has strict CSP: default-src 'none'; script-src 'self'; connect-src [allowed domains from manifest]. This CSP blocks inline scripts, eval, and connections to undeclared domains. The iframe sandbox attribute: sandbox="allow-scripts" (Scripts are allowed, but no same-origin privileges, no form submission, no popups, no pointer lock). The plugin bundle runs in this sandboxed environment.</p>
        <p>The postMessage API bridge: the plugin communicates with the platform via postMessage. The plugin calls methods on a platform API object (e.g., platform.document.getNodes()), which internally sends a postMessage to the platform's main window. The platform's plugin host receives the message, validates that the plugin has the required permission for the called method, executes the operation in the platform's context, and sends the result back via postMessage. The plugin's API object receives the result and resolves the corresponding Promise. All plugin API calls are asynchronous (Promise-based) because they cross the iframe boundary via postMessage.</p>
        <p>Plugin lifecycle management: the plugin host manages each plugin's lifecycle. Plugin start: the iframe is created and the plugin bundle loads. Plugin stop: the iframe is removed from the DOM (destroying the plugin's JavaScript context). Timeout watchdog: if a plugin's postMessage call does not receive a response acknowledgment within 30 seconds, the plugin host assumes the plugin is stuck in an infinite loop and terminates the iframe. The termination is reported to the developer (in the developer portal's error logs) and surfaced to the user as "Plugin timed out and was stopped." The user can manually restart the plugin.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Plugin Versioning and Updates</h3>
        <p>Plugins follow semantic versioning. The registry enforces the following update rules: patch updates (1.0.0 → 1.0.1) can only contain bug fixes—no new permissions, no new API surface. Minor updates (1.0.0 → 1.1.0) can add new optional functionality but cannot add new permission requirements. Major updates (1.0.0 → 2.0.0) can change permissions and require users to re-approve the new permission set (the next time the plugin runs, the user is prompted to review and approve the changed permissions before the plugin starts). This versioning enforcement is the platform's guarantee that auto-updates are safe: users never discover their plugin silently gained new permissions after an auto-update.</p>
        <p>The registry validates version constraints at upload time: when a developer uploads v1.0.1, the registry diffs the new version's manifest against v1.0.0's manifest and rejects the upload if any permissions were added or removed (that would require a minor or major version bump). The developer receives a specific error: "Permission document.write was not present in v1.0.0. This change requires a minor version bump (1.1.0) or major version bump (2.0.0)." This automated enforcement eliminates the manual review step for version constraint compliance, reducing the review burden on the platform team while maintaining the permission guarantee.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/plugin-extension-marketplace-ui-trust-permissions.svg"
          alt="Plugin trust and permission model showing trust levels (submitted: unreviewed warning shown; verified: platform-reviewed; featured: curated), install workflow (listing → permission approval screen grouped by risk → install confirmation → version pinned), sandbox enforcement (iframe CSP: default-src none, connect-src declared domains only; postMessage API bridge: permission check before executing each method), and version constraint enforcement (registry diffs manifests on upload: new permissions in patch/minor version rejected; major version requires user re-approval)."
          caption="Trust model: review levels + installation permission approval dialog + postMessage permission enforcement + version manifest diff for auto-update safety"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Iframe sandbox versus Realm API versus Web Workers: iframes provide the strongest available sandbox for third-party JavaScript in browsers (combined with strict CSP, they prevent most common attack vectors). The Realm API (TC39 proposal for isolated JavaScript realms) is not yet widely available but would provide an even more granular sandbox (a separate JavaScript realm with a custom global object, within the same document). Web Workers provide a sandbox for computation but have no DOM access and limited postMessage-based communication overhead. For plugins that need to display UI, iframes are the only viable option in current browsers. The Realm API would be superior when available (no iframe overhead, easier inter-realm communication), and the plugin API bridge should be designed to support both backends transparently when the Realm API becomes available.</p>
        <p>Plugin performance impact: each installed plugin adds an iframe to the page. An organization with 10 installed plugins active simultaneously has 10 additional iframes (each with their own JavaScript context, memory, and event loop). This overhead is manageable for typical plugin counts (under 5) but can degrade performance for power users with many plugins. Mitigation: only auto-start plugins that the user has enabled (not all installed plugins are started by default); plugins that have not been used in the last 7 days are marked as dormant and not auto-started on page load. The user can manually start dormant plugins from the plugin panel. This reduces the typical active plugin count to 1–3 for most users.</p>
        <p>Marketplace spam and abuse: open plugin submission creates incentives for spam (low-quality plugins polluting search results) and abuse (malicious plugins that pass automated scanning by hiding malicious behavior). Mitigations: require developer account verification (GitHub OAuth or email verification with domain allowlist); limit initial publish rate (new accounts can publish 1 plugin per week); implement a user reporting mechanism (flag a plugin as spam or malicious); have a takedown process (platform can remove a plugin and revoke installations within 1 hour of a confirmed abuse report). The takedown mechanism must work end-to-end: removing a plugin from the registry prevents new installations, but also revokes existing installations by marking the plugin as revoked in all users' install records, causing the plugin host to refuse to load it on next startup.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A plugin marketplace has four components: a plugin registry (metadata, permission manifests, version history, install records), a CDN distribution layer (versioned plugin bundles, content-addressed), a sandboxed execution environment (iframe per plugin, strict CSP, postMessage API bridge with per-method permission validation), and a developer portal (submission, review, analytics). The permission model is declarative (plugin.json manifest) and enforced at two levels: the install dialog (user approves permissions before installation) and the API bridge (platform validates permissions before executing each postMessage call). Version constraint enforcement (registry diffs manifests on upload and rejects illegal permission changes) makes auto-updates safe. Trust levels (submitted/verified/featured) gate discoverability and show appropriate warnings. Automated static analysis (eval detection, obfuscation detection, CVE scanning) blocks obviously malicious plugins before they appear in the marketplace. Plugin lifecycle management (timeout watchdog at 30s, dormant plugin suppression after 7 days) prevents individual plugins from degrading platform performance. The foundational security guarantee is the iframe + CSP sandbox: a plugin cannot access platform data or external domains beyond its declared permissions, regardless of the code it contains.</p>
      </section>
    </ArticleLayout>
  );
}

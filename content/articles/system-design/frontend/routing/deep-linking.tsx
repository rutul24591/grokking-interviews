"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "deep-linking",
  title: "Deep Linking",
  description:
    "Deep linking strategies for web and mobile — direct URL access to specific app states, Universal Links, App Links, deferred deep linking, and preserving context across platforms.",
  category: "frontend",
  subcategory: "routing",
  slug: "deep-linking",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-30",
  tags: ["deep linking", "Universal Links", "App Links", "mobile", "web"],
  relatedTopics: ["client-side-routing", "url-parameter-handling", "dynamic-routes"],
};

export default function DeepLinkingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          Deep linking is the practice of using URLs to point directly to a specific piece of
          content or state within an application, rather than the application&apos;s home page. On
          the web, this means any URL that resolves to a specific page — <code>/products/42</code>{" "}
          is a deep link to product 42. In mobile contexts, deep linking extends this to native
          apps: a URL that opens a specific screen within an installed app, bypassing the home
          screen.
        </p>
        <p className="mb-4">
          Deep linking is foundational to the web&apos;s architecture. Every URL is technically a
          deep link — it points to a specific resource. The term became significant in the SPA era
          when client-side routed applications often broke direct URL access (the server returned
          404 for paths it didn&apos;t know about), and in the mobile era when opening a web URL
          needed to route to the corresponding native app screen.
        </p>
        <p>
          Modern deep linking encompasses three scenarios: <strong>web deep linking</strong>{" "}
          (direct URL access to SPA routes), <strong>mobile deep linking</strong> (URLs that
          open native apps to specific screens), and <strong>deferred deep linking</strong>{" "}
          (preserving the intended destination through an app install flow — the user clicks a
          link, installs the app from the store, and still lands on the intended screen).
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/deep-linking-diagram-1.svg"
        alt="Deep linking flow across web, installed app, and deferred install scenarios"
        caption="Figure 1: Three deep linking scenarios — web (direct URL access), app (Universal Links/App Links), and deferred (preserving context through install)."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Web Deep Linking</h3>
        <p className="mb-4">
          For SPAs, deep linking means the server must return the application shell for any route
          path, and the client-side router must correctly resolve the URL to the right component
          and data. This requires: (1) server catch-all configuration (return index.html for all
          non-asset paths), (2) the router reading the current URL on initial load and matching it
          against route definitions, and (3) data loading triggered by the matched route parameters.
        </p>
        <p className="mb-4">
          With SSR or SSG, deep links are even more powerful — the server renders the specific
          page content for the URL, providing instant first paint and full SEO crawlability. The
          URL <code>/articles/react-hooks-guide</code> returns fully rendered HTML for that specific
          article, not a blank shell that hydrates later.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Universal Links (iOS) and App Links (Android)</h3>
        <p className="mb-4">
          Universal Links (iOS) and App Links (Android) are platform mechanisms that associate
          web URLs with native apps. When a user taps a URL that matches a registered domain, the
          OS opens the native app directly instead of the browser. The app receives the URL and
          routes to the corresponding screen. If the app isn&apos;t installed, the URL opens in the
          browser as a normal web page — providing a graceful fallback.
        </p>
        <p className="mb-4">
          Setup requires: (1) hosting an association file on your web domain (
          <code>apple-app-site-association</code> for iOS,{" "}
          <code>assetlinks.json</code> at <code>/.well-known/</code> for Android),
          (2) registering the domain in the native app&apos;s configuration (entitlements for iOS,
          intent filters for Android), and (3) implementing URL routing in the native app to handle
          incoming URLs and map them to screens.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Deferred Deep Linking</h3>
        <p>
          Deferred deep linking preserves the deep link destination across an app install. A user
          clicks a link to <code>app.com/promo/summer2026</code>, doesn&apos;t have the app
          installed, is redirected to the App Store, installs the app, and on first launch is
          taken directly to the summer promo screen. This requires a server-side component that
          stores the deep link context (associated with a device fingerprint or tracking parameter)
          and a client-side SDK that retrieves it on first launch. Services like Branch.io and
          Firebase Dynamic Links (deprecated) provide this infrastructure.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/deep-linking-diagram-2.svg"
        alt="Universal Links setup showing association file, app registration, and URL handling"
        caption="Figure 2: Universal Links / App Links setup — a server-hosted association file tells the OS which URLs should open in the native app."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">URL Schema Design for Deep Links</h3>
        <p className="mb-4">
          Effective deep links require well-designed URL schemas. The URL should encode enough
          context to render the target state: resource identifiers (product ID, user handle),
          navigation context (active tab, open modal), and optionally, UI state (scroll position,
          filter settings). Keep URLs human-readable and stable — changing URL structure breaks
          existing bookmarks and shared links.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Custom URL Schemes (Legacy)</h3>
        <p className="mb-4">
          Before Universal Links and App Links, apps used custom URL schemes:{" "}
          <code>myapp://products/42</code>. These still exist but have significant drawbacks: no
          web fallback (if the app isn&apos;t installed, the link fails silently), no verification
          (any app can claim any scheme), and they don&apos;t work in all contexts (some apps strip
          non-http schemes). Modern applications should prefer Universal Links/App Links with
          custom schemes as a legacy fallback only.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Open Graph and Social Sharing</h3>
        <p>
          Deep links shared on social media need proper Open Graph (OG) metadata. When a user
          shares <code>app.com/products/42</code>, social platforms fetch the OG tags (title,
          description, image) to render a rich preview. For SPAs, this requires SSR or a
          pre-rendering service — the server must return OG tags in the HTML for the specific
          product, not generic app-level tags. Each deep-linkable page should have unique,
          descriptive OG metadata.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/deep-linking-diagram-3.svg"
        alt="Deferred deep linking flow from click through install to app launch"
        caption="Figure 3: Deferred deep linking — context is preserved through the App Store install flow using server-side storage and device fingerprinting."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>
        <div className="my-6 overflow-x-auto rounded-lg border border-theme">
          <table className="min-w-full text-sm">
            <thead className="bg-panel-soft">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Approach</th>
                <th className="px-4 py-3 text-left font-semibold">Web Fallback</th>
                <th className="px-4 py-3 text-left font-semibold">Verification</th>
                <th className="px-4 py-3 text-left font-semibold">Deferred Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="px-4 py-3 font-medium">Custom schemes (myapp://)</td><td className="px-4 py-3">None</td><td className="px-4 py-3">None (any app can claim)</td><td className="px-4 py-3">No</td></tr>
              <tr><td className="px-4 py-3 font-medium">Universal Links / App Links</td><td className="px-4 py-3">Automatic (opens browser)</td><td className="px-4 py-3">Domain verification</td><td className="px-4 py-3">No (native only)</td></tr>
              <tr><td className="px-4 py-3 font-medium">Deferred deep links (Branch.io)</td><td className="px-4 py-3">Yes (with redirect)</td><td className="px-4 py-3">Service-level</td><td className="px-4 py-3">Yes</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Design stable URL schemas — changing URL structure breaks bookmarks and shared links</li>
          <li>Use Universal Links / App Links instead of custom URL schemes for mobile deep linking</li>
          <li>Ensure every deep-linkable page has unique Open Graph metadata for social sharing</li>
          <li>Support direct URL access for all SPA routes — configure server catch-all and test deep links</li>
          <li>Implement deferred deep linking for onboarding flows where users arrive from external links</li>
          <li>Handle expired or invalid deep links gracefully — show helpful 404 pages with navigation options</li>
          <li>Track deep link attribution to understand which channels and campaigns drive engagement</li>
          <li>Test deep links across platforms: web browsers, iOS Safari, Android Chrome, in-app webviews, social media apps</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Broken SPA deep links:</strong> Server returns 404 for client-side routes because no catch-all rule is configured</li>
          <li><strong>Missing association file:</strong> Universal Links / App Links fail silently if the association file is misconfigured, expired, or not served with the correct content type</li>
          <li><strong>Generic OG tags:</strong> All shared links show the same title and image because the server returns the same HTML shell for every URL — fix with SSR or pre-rendering</li>
          <li><strong>In-app browser interference:</strong> Some apps (Instagram, Facebook, TikTok) open links in embedded webviews that don&apos;t trigger Universal Links. Users must &quot;Open in Safari/Chrome&quot; to reach the native app</li>
          <li><strong>URL encoding issues:</strong> Deep link parameters with special characters break when not properly encoded/decoded through the link chain</li>
          <li><strong>Stale deep links:</strong> Links to deleted content, expired promotions, or restructured URLs return errors. Implement redirects for changed URLs and friendly 404s for removed content</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Slack Message Links</h3>
          <p>
            Slack message permalinks (<code>slack.com/archives/C123/p456</code>) are deep links
            that resolve to a specific message in a specific channel. On desktop, clicking the
            link opens the Slack app and scrolls to that message. On mobile, Universal Links open
            the Slack native app to the same location. If the app isn&apos;t installed, the web
            version renders the message with a prompt to install.
          </p>
        </div>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">E-commerce Promotional Campaigns</h3>
          <p>
            E-commerce platforms use deferred deep linking in marketing campaigns. An Instagram ad
            links to <code>shop.com/sale/summer?ref=ig_ad_123</code>. If the user has the app, it
            opens directly to the sale page with the attribution parameter. If not, the user lands
            on the mobile web page with a smart banner prompting app install. After installing, the
            app SDK retrieves the deferred link and opens the sale page — maintaining the campaign
            attribution for analytics.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do Universal Links differ from custom URL schemes?</p>
            <p className="mt-2 text-sm">
              A: Universal Links use standard https:// URLs with domain verification — the OS
              checks a server-hosted association file to confirm the app is authorized for that
              domain. Custom schemes (myapp://) have no verification, no web fallback, and can be
              claimed by any app. Universal Links fall back to the web browser if the app isn&apos;t
              installed; custom schemes fail silently.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does deferred deep linking work?</p>
            <p className="mt-2 text-sm">
              A: When a user clicks a deep link without the app installed, a server records the link
              context alongside a device fingerprint (IP, user agent, screen size). The user is
              redirected to the App Store. After installing and launching, the app&apos;s SDK calls
              the server with the same device fingerprint, retrieves the stored link context, and
              navigates to the intended screen. This bridges the gap between the web click and the
              first app launch.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure deep links work for an SPA?</p>
            <p className="mt-2 text-sm">
              A: Two requirements: (1) Configure the server with a catch-all rule that returns the
              SPA shell (index.html) for any path that doesn&apos;t match a static asset. Without
              this, direct URL access returns 404. (2) Ensure the client-side router reads the
              current URL on initial load and matches it against route definitions — not just
              on navigation events. Test by pasting deep link URLs directly into the browser
              address bar, not just navigating within the app.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do some deep links fail when shared on social media?</p>
            <p className="mt-2 text-sm">
              A: Social platforms scrape OG (Open Graph) metadata from the URL to generate link
              previews. If the SPA returns a generic HTML shell without route-specific OG tags,
              every shared link shows the same title, description, and image. Fix: use SSR or a
              pre-rendering service to return unique OG metadata per route. Also, hash-based
              routing fails entirely — social platforms strip or ignore URL fragments when scraping,
              so hash-routed deep links lose their route context when shared.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What challenges do in-app browsers create for deep linking?</p>
            <p className="mt-2 text-sm">
              A: Apps like Instagram, Facebook, and TikTok open links in embedded WebViews that
              don&apos;t trigger Universal Links or App Links — the link stays in the WebView
              instead of opening the native app. Users must tap &quot;Open in Safari/Chrome&quot;
              manually. Workarounds include: detecting the WebView user agent and showing a banner
              prompting users to open in the system browser, using JavaScript-based redirect chains
              that attempt the custom scheme first and fall back to the web view, or using smart
              banner meta tags that the WebView may honor.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle expired or changed deep links?</p>
            <p className="mt-2 text-sm">
              A: Content gets deleted, URLs get restructured, promotions expire. For restructured
              URLs, implement server-side 301 redirects from old paths to new ones — this preserves
              SEO value and fixes bookmarks. For deleted content, show a user-friendly 404 with
              search or navigation to related content rather than a generic error. For expired
              promotions, redirect to the current version or a landing page explaining the
              promotion has ended. Track 404 rates to identify broken deep links in the wild.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Apple — Universal Links documentation</li>
          <li>Android — App Links verification and handling</li>
          <li>Branch.io — Deferred deep linking implementation</li>
          <li>Open Graph Protocol — metadata for social sharing</li>
          <li>web.dev — Social discovery and link previews</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

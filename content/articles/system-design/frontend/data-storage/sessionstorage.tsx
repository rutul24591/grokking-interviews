"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-sessionstorage-concise",
  title: "SessionStorage",
  description: "Deep dive into sessionStorage covering tab-scoped persistence, session lifetime, security properties, and differences from localStorage.",
  category: "frontend",
  subcategory: "data-storage",
  slug: "sessionstorage",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: ["frontend", "storage", "sessionStorage", "Web Storage API", "tab-scoped", "session"],
  relatedTopics: ["localstorage", "cookies", "storage-quotas-and-eviction"],
};

export default function SessionStorageConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>sessionStorage</strong> is a synchronous, string-only key-value store provided by the Web Storage API
          (alongside localStorage). Its defining characteristic is <strong>tab-scoped persistence</strong>: data written
          to sessionStorage lives only as long as the browser tab (or window) that created it remains open. When the user
          closes that tab, the data is irreversibly destroyed. This stands in sharp contrast to localStorage, which
          persists across tabs and browser restarts until explicitly cleared.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The scoping model is precise and often misunderstood. Each top-level browsing context (roughly: each tab) gets
          its own, isolated sessionStorage area, keyed by origin. Two tabs open to the same URL do not share
          sessionStorage -- each has a completely independent store. This is the critical architectural property that
          distinguishes sessionStorage from every other client-side persistence mechanism.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Duplicate-tab behavior</strong> introduces a subtle nuance specified in the HTML Living Standard. When
          a user duplicates a tab (Ctrl+Shift+T in most browsers, or right-click {">"} "Duplicate"), the browser
          creates a <em>snapshot copy</em> of the original tab's sessionStorage and hands it to the new tab. From that
          moment, the two stores diverge -- writes in one do not propagate to the other. This behavior is intentional:
          it allows duplicate tabs to inherit context (e.g., a form wizard's progress) while remaining independent.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Why does sessionStorage matter at a staff/principal engineer level? Because it occupies a specific niche in the
          client-side storage spectrum: ephemeral, tab-isolated state that must survive same-tab navigations and refreshes
          but must <em>not</em> leak across tabs or persist after the session ends. Getting the storage choice wrong --
          using localStorage where sessionStorage is correct, or vice versa -- leads to subtle bugs: shared form state
          across tabs, stale CSRF tokens, or data that should have been cleared but was not.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <h3 className="mt-4 font-semibold">API Surface</h3>
        <HighlightBlock as="p" tier="important">
          sessionStorage exposes the exact same <strong>Storage interface</strong> as localStorage. The five methods are
          identical: <strong>setItem(key, value)</strong>, <strong>getItem(key)</strong>,{" "}
          <strong>removeItem(key)</strong>, <strong>clear()</strong>, and <strong>key(index)</strong>. The{" "}
          <strong>length</strong> property returns the number of stored keys. Both keys and values must be strings; any
          non-string value is coerced via <code>toString()</code>, which means objects become "[object Object]" unless
          you explicitly serialize with <code>JSON.stringify()</code>.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">Tab Isolation Model</h3>
        <HighlightBlock as="p" tier="crucial">
          The isolation boundary is the <strong>top-level browsing context</strong> combined with the <strong>origin</strong>.
          Every tab has its own sessionStorage per origin. An iframe embedded in a page shares the parent tab's
          sessionStorage <em>only if</em> the iframe's origin matches the parent's origin. Cross-origin iframes get
          their own separate sessionStorage, scoped to the iframe's origin but still tied to the parent tab's lifetime.
          When the parent tab closes, the iframe's sessionStorage is also destroyed.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/sessionstorage-tab-scope.svg"
          alt="Diagram showing three browser tabs with isolated sessionStorage stores"
          caption="Each tab maintains its own sessionStorage -- duplicate tabs receive a snapshot copy that immediately diverges"
          captionTier="important"
        />

        <h3 className="mt-4 font-semibold">Crash Recovery</h3>
        <HighlightBlock as="p" tier="important">
          The HTML specification explicitly states that browsers <em>may</em> restore sessionStorage when recovering
          from a crash. All major browsers (Chrome, Firefox, Safari, Edge) implement this behavior. If the browser
          crashes and the user restores the session, tabs are reopened and their sessionStorage is preserved. This means
          sessionStorage data can survive events that would intuitively seem like "session end" scenarios. This is
          spec-compliant, not a bug, and must be accounted for when designing security-sensitive flows.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">Storage Quota</h3>
        <p>
          The typical quota is <strong>5 MB per origin per tab</strong>, measured in UTF-16 code units (so roughly 2.5
          million characters in practice for ASCII data, but each character consumes 2 bytes). Unlike IndexedDB, there is
          no mechanism to request additional quota. Exceeding the limit throws a <strong>QuotaExceededError</strong>{" "}
          DOMException. Because the operations are synchronous, this exception is thrown inline and must be caught with
          a try/catch block -- there is no promise rejection to handle.
        </p>

        <h3 className="mt-4 font-semibold">Navigation Persistence</h3>
        <p>
          Navigating within a tab -- whether via client-side routing, full page loads to the same origin, or even
          navigating away and pressing back -- preserves sessionStorage. The data persists through <code>location.href</code>{" "}
          changes, form submissions, and the <code>history.pushState()</code>/<code>history.replaceState()</code> cycle.
          This makes sessionStorage ideal for data that needs to survive a redirect chain (e.g., OAuth flows) within
          a single tab.
        </p>

        <h3 className="mt-4 font-semibold">Iframe Scoping Details</h3>
        <p>
          Same-origin iframes access the parent tab's sessionStorage for that origin directly -- they share the same
          Storage object. This means an iframe can read and write keys that the parent page set, and vice versa. For
          cross-origin iframes, the iframe gets its own sessionStorage keyed to the iframe's origin, but its lifetime is
          still bound to the parent tab. This creates an important security boundary: a third-party widget embedded via
          iframe cannot read the host page's sessionStorage, but its own sessionStorage disappears when the host tab
          closes.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="important">
          Understanding the sessionStorage lifecycle is essential for reasoning about when data exists and when it
          vanishes. The lifecycle begins when a tab opens (creating an empty store, or a snapshot copy if duplicated)
          and ends permanently when the tab closes.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/sessionstorage-lifecycle.svg"
          alt="Timeline diagram showing sessionStorage lifecycle from tab open to tab close"
          caption="sessionStorage lifecycle -- data survives navigation and refresh but is destroyed on tab close; crash recovery restores it"
          captionTier="important"
        />

        <h3 className="mt-4 font-semibold">Read/Write Path</h3>
        <HighlightBlock as="p" tier="crucial">
          All sessionStorage operations execute <strong>synchronously on the main thread</strong>. When{" "}
          <code>setItem()</code> is called, the browser writes the key-value pair to an in-memory map, then
          asynchronously flushes it to a backing store (typically an SQLite database or LevelDB) for crash recovery.
          The synchronous nature means that large writes (hundreds of kilobytes) can cause jank by blocking the main
          thread for several milliseconds. For this reason, sessionStorage should store small payloads -- metadata,
          tokens, form state -- not large datasets.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">The storage Event</h3>
        <HighlightBlock as="p" tier="crucial">
          A critical and often misunderstood fact: the <code>storage</code> event fires for <strong>localStorage
          changes only</strong>. When a key changes in sessionStorage, no <code>storage</code> event is dispatched to
          any window -- not even to same-origin iframes within the same tab. This means there is no built-in cross-frame
          notification mechanism for sessionStorage changes. If you need reactive updates between a parent page and a
          same-origin iframe, you must use <code>postMessage()</code> or poll.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">Interaction with Service Workers</h3>
        <HighlightBlock as="p" tier="important">
          Service workers cannot access sessionStorage (or localStorage). The Storage interface is only available in
          window contexts. A service worker that needs session-scoped data must receive it via <code>postMessage()</code>{" "}
          from the client page, or the application must use the Cache API or IndexedDB instead. This is a fundamental
          architectural constraint: if your session data must be accessible during offline scenarios handled by a service
          worker, sessionStorage is the wrong choice.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs</h2>
        <HighlightBlock as="p" tier="important">
          Choosing the right client-side storage mechanism is a core architectural decision. The following comparison
          covers the four primary options across the dimensions that matter most in production systems.
        </HighlightBlock>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="px-3 py-2 text-left font-semibold">Dimension</th>
                <th className="px-3 py-2 text-left font-semibold">sessionStorage</th>
                <th className="px-3 py-2 text-left font-semibold">localStorage</th>
                <th className="px-3 py-2 text-left font-semibold">Cookies</th>
                <th className="px-3 py-2 text-left font-semibold">IndexedDB</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme">
                <td className="px-3 py-2 font-medium">Scope</td>
                <td className="px-3 py-2">Tab + origin</td>
                <td className="px-3 py-2">Origin (all tabs)</td>
                <td className="px-3 py-2">Origin + path (sent to server)</td>
                <td className="px-3 py-2">Origin (all tabs)</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-3 py-2 font-medium">Lifetime</td>
                <td className="px-3 py-2">Tab close</td>
                <td className="px-3 py-2">Until cleared</td>
                <td className="px-3 py-2">Expires / session</td>
                <td className="px-3 py-2">Until cleared</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-3 py-2 font-medium">Capacity</td>
                <td className="px-3 py-2">~5 MB</td>
                <td className="px-3 py-2">~5-10 MB</td>
                <td className="px-3 py-2">~4 KB</td>
                <td className="px-3 py-2">Quota-managed (GBs)</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-3 py-2 font-medium">API</td>
                <td className="px-3 py-2">Sync, string KV</td>
                <td className="px-3 py-2">Sync, string KV</td>
                <td className="px-3 py-2">String, via document.cookie</td>
                <td className="px-3 py-2">Async, structured clone</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-3 py-2 font-medium">Server Access</td>
                <td className="px-3 py-2">No</td>
                <td className="px-3 py-2">No</td>
                <td className="px-3 py-2">Yes (every request)</td>
                <td className="px-3 py-2">No</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-3 py-2 font-medium">Worker Access</td>
                <td className="px-3 py-2">No</td>
                <td className="px-3 py-2">No</td>
                <td className="px-3 py-2">No</td>
                <td className="px-3 py-2">Yes</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-3 py-2 font-medium">Cross-tab Sync</td>
                <td className="px-3 py-2">None</td>
                <td className="px-3 py-2">storage event</td>
                <td className="px-3 py-2">Shared via server</td>
                <td className="px-3 py-2">Manual (BroadcastChannel)</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-3 py-2 font-medium">Main Thread Impact</td>
                <td className="px-3 py-2">Blocks (sync)</td>
                <td className="px-3 py-2">Blocks (sync)</td>
                <td className="px-3 py-2">Minimal</td>
                <td className="px-3 py-2">Non-blocking (async)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">Best For</td>
                <td className="px-3 py-2">Tab-isolated ephemeral state</td>
                <td className="px-3 py-2">User preferences, persistent cache</td>
                <td className="px-3 py-2">Auth tokens, server-readable state</td>
                <td className="px-3 py-2">Large datasets, offline-first apps</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBlock as="p" tier="crucial" className="mt-4">
          The critical decision factor is <strong>isolation requirements</strong>. If data must be isolated per tab
          (CSRF tokens, form wizard state, checkout progress), sessionStorage is the correct choice. If data should be
          shared across tabs (user preferences, auth state, cached API responses), localStorage or IndexedDB is
          appropriate. If data must reach the server on every request, cookies are the only option.
        </HighlightBlock>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Always wrap setItem in try/catch:</strong> The synchronous API throws{" "}
            <code>QuotaExceededError</code> when the 5 MB limit is reached and <code>SecurityError</code> when storage
            is disabled (e.g., in some private browsing modes in older Safari). Unhandled exceptions from storage writes
            can crash your application.
          </HighlightBlock>
          <li>
            <strong>Use a namespace prefix for keys:</strong> In applications with same-origin iframes or micro-frontends,
            key collisions are a real risk. Prefix all keys with your application or module name (e.g.,{" "}
            <code>checkout:wizardStep</code>) to avoid silent overwrites from other code sharing the same sessionStorage
            instance.
          </li>
          <li>
            <strong>Serialize and deserialize explicitly:</strong> Never rely on implicit <code>toString()</code> coercion.
            Always use <code>JSON.stringify()</code> when writing and <code>JSON.parse()</code> when reading. Wrap the
            parse in try/catch to handle corrupted or manually edited values gracefully.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Keep payloads small:</strong> sessionStorage operations block the main thread. Storing more than a few
            hundred kilobytes per write can cause visible jank. If you need to store large objects, consider IndexedDB
            with a session-scoped cleanup strategy instead.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Clean up on logout or session end:</strong> Even though sessionStorage clears on tab close, users
            who log out without closing the tab will leave sensitive data accessible. Explicitly call{" "}
            <code>sessionStorage.clear()</code> in your logout handler.
          </HighlightBlock>
          <li>
            <strong>Feature-detect before use:</strong> In some environments (embedded WebViews, privacy-focused browsers,
            or when storage is disabled by enterprise policy), accessing <code>window.sessionStorage</code> throws a{" "}
            <code>SecurityError</code>. Wrap the initial access in a try/catch and fall back to an in-memory Map if
            sessionStorage is unavailable.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Do not store authentication tokens:</strong> sessionStorage is accessible to any JavaScript running
            on the same origin. An XSS vulnerability gives an attacker full read/write access. Use HttpOnly cookies for
            authentication tokens, and reserve sessionStorage for non-sensitive ephemeral state.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Account for duplicate-tab behavior:</strong> If your application stores one-time tokens or
            nonces in sessionStorage, a duplicate tab will receive a copy of those values. Design your flow so that
            consuming a token invalidates it server-side, preventing replay from a duplicated tab.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Assuming cross-tab visibility:</strong> The most common mistake is treating sessionStorage like
            localStorage. Developers write to sessionStorage in one tab and expect to read it in another. This silently
            fails -- the other tab's sessionStorage simply does not contain the key. This often surfaces as "works in
            development, fails in production" when users open links in new tabs.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Relying on storage events:</strong> The <code>storage</code> event does not fire for sessionStorage
            changes. Code that listens for <code>window.addEventListener("storage", handler)</code> expecting to react to
            sessionStorage mutations will never execute. This is a spec decision, not a browser bug.
          </HighlightBlock>
          <li>
            <strong>Storing unserialized objects:</strong> Setting <code>sessionStorage.setItem("user", userObj)</code>{" "}
            without stringifying results in the string "[object Object]" being stored. The subsequent{" "}
            <code>JSON.parse()</code> call throws a SyntaxError. This bug is pernicious because the write succeeds
            silently.
          </li>
          <li>
            <strong>Ignoring quota limits in batch writes:</strong> Applications that store multiple independent
            items rarely check for <code>QuotaExceededError</code> on each write. A partial failure leaves the store
            in an inconsistent state -- some keys updated, others stale. Always transact writes atomically by storing
            a single serialized object when consistency matters.
          </li>
          <li>
            <strong>Private browsing inconsistencies:</strong> Older versions of Safari (pre-11) threw{" "}
            <code>QuotaExceededError</code> on any <code>setItem()</code> call in private browsing mode, even for the
            first write. Modern browsers allow sessionStorage in private mode but destroy it when the private window
            closes. Always test your storage code in private/incognito mode.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Forgetting crash recovery semantics:</strong> Developers assume sessionStorage is cleared when the
            browser "restarts." But crash recovery restores it. Security-critical flows (CSRF tokens, one-time nonces)
            must validate server-side, not rely on sessionStorage eviction for security guarantees.
          </HighlightBlock>
          <li>
            <strong>Blocking the main thread with large reads:</strong> Reading a large value (hundreds of KB) via{" "}
            <code>getItem()</code> is synchronous and copies the string into JavaScript memory. Doing this on every
            render (e.g., inside a React component body without memoization) causes unnecessary allocation and GC
            pressure. Read once, cache in a ref or state variable, and update only when you write.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-4 font-semibold">Multi-Step Wizard / Form Progress</h3>
        <HighlightBlock as="p" tier="crucial">
          A checkout or onboarding wizard that spans multiple pages benefits from sessionStorage because: (1) progress
          survives page refreshes, (2) each tab gets its own wizard state (a user can have two checkouts in parallel
          without interference), and (3) data is automatically cleaned up when the tab closes, avoiding stale abandoned
          cart data polluting localStorage.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">CSRF Token Storage</h3>
        <HighlightBlock as="p" tier="important">
          CSRF tokens are per-session and should not be shared across tabs (to prevent token fixation attacks via
          shared storage). sessionStorage provides natural tab isolation. The server issues a unique token per tab
          session, the client stores it in sessionStorage, and every subsequent mutating request includes the token.
          Each tab has its own token, and closing the tab removes it.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">One-Time Notifications and Banners</h3>
        <p>
          "Welcome back" banners, feature announcements, or one-time onboarding tooltips that should appear once per
          tab session are a natural fit. Set a flag in sessionStorage after the first display. The flag survives
          navigation within the tab but does not carry over to new tabs, ensuring each tab session sees the notification
          exactly once.
        </p>

        <h3 className="mt-4 font-semibold">OAuth Redirect State</h3>
        <HighlightBlock as="p" tier="important">
          During OAuth authorization code flows, the client generates a random <code>state</code> parameter, stores it
          in sessionStorage, and redirects to the authorization server. When the redirect returns, the client verifies
          the <code>state</code> parameter matches. sessionStorage is ideal because: (1) the redirect stays within
          the same tab, (2) the state is automatically unavailable to other tabs, preventing CSRF, and (3) it survives
          the full page navigation to the authorization server and back.
        </HighlightBlock>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <p className="font-semibold">When NOT to use sessionStorage</p>
          <ul className="mt-2 space-y-2 text-sm">
            <HighlightBlock as="li" tier="important">
              <strong>User preferences</strong> (theme, language): These must persist across sessions and tabs.
              Use localStorage.
            </HighlightBlock>
            <HighlightBlock as="li" tier="crucial">
              <strong>Authentication tokens</strong>: XSS-accessible. Use HttpOnly cookies.
            </HighlightBlock>
            <li>
              <strong>Application cache</strong> for offline use: Not available in service workers. Use IndexedDB
              or the Cache API.
            </li>
            <li>
              <strong>Data that must be shared across tabs</strong>: Use localStorage with the storage event, or
              BroadcastChannel for more complex coordination.
            </li>
            <li>
              <strong>Large datasets (&gt;1 MB)</strong>: Synchronous API blocks the main thread. Use IndexedDB.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: A user opens your checkout flow in two tabs simultaneously. How do you ensure the checkout
              state in each tab is independent without cross-contamination?
            </p>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              A: Store the checkout wizard state (current step, selected items, shipping details) in
              sessionStorage rather than localStorage or a global store. Because sessionStorage is scoped
              to the tab, each tab automatically gets its own isolated state. The user can progress through
              checkout independently in both tabs. On tab close, the abandoned checkout state is automatically
              cleaned up. For duplicate-tab scenarios, detect by storing a unique tab ID in sessionStorage
              and validate against server-side session. Use idempotency keys stored in each tab's sessionStorage
              to prevent order conflicts.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Your security team reports that CSRF tokens stored in sessionStorage were replayed from a
              duplicated tab. How do you mitigate this?
            </p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: The root cause is that duplicate-tab copies sessionStorage, including the CSRF token. Two
              mitigations work together: (1) Server-side token binding -- bind the CSRF token to a server-side
              session identifier and validate on each request. Once consumed, invalidate it. (2) Token rotation
              -- after each mutating request, the server returns a new CSRF token, and the client replaces the
              old one. The duplicated tab's old token becomes invalid. For defense in depth, also check Origin
              and Referer headers. sessionStorage provides tab isolation but not uniqueness guarantees.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: You need to persist form state across page refreshes but also need the data accessible in a
              service worker for background sync. Can sessionStorage solve this?
            </p>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              A: No. Service workers run in a separate execution context without access to the Storage API
              (neither sessionStorage nor localStorage). The correct approach is IndexedDB, which is accessible
              from both window contexts and service workers. Store the form state in IndexedDB using a key that
              includes a session identifier (e.g., a UUID generated on page load and stored in sessionStorage).
              Implement a cleanup routine to scan IndexedDB for entries whose session IDs do not match any
              active tab (tracked via BroadcastChannel heartbeat or clients.matchAll() API).
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Compare sessionStorage, localStorage, cookies, and IndexedDB for different use cases. When
              would you choose each?
            </p>
            <p className="mt-2 text-sm">
              A: sessionStorage: tab-scoped, cleared on tab close (5-10MB) -- wizard state, form drafts,
              temporary filters. localStorage: persistent across sessions (5-10MB), no server transmission --
              theme preferences, feature flags. Cookies: small (4KB), sent with requests, HttpOnly option --
              auth tokens, session IDs. IndexedDB: large structured storage (50MB+), async, complex queries --
              offline-first apps, large datasets, binary data. Choose based on: persistence needs, size
              requirements, server access needs, and query complexity.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://html.spec.whatwg.org/multipage/webstorage.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              HTML Living Standard -- Web Storage
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs -- Window.sessionStorage
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP -- HTML5 Security Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://web.dev/storage-for-the-web/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev -- Storage for the Web
            </a>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc6265" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6265 -- HTTP State Management Mechanism
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

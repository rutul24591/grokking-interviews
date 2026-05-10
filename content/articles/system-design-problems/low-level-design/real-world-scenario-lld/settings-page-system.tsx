"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-settings-page-system",
  title: "Design Settings Page System",
  description:
    "Production-grade settings with preference taxonomy, save strategies, re-auth gates, danger zone, and cross-device sync.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "settings-page-system",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "settings", "preferences", "storage", "ux"],
  relatedTopics: ["multi-tenant-ui", "audit-log-viewer-ui"],
};

export default function SettingsPageSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>The settings page is the most underrated surface in a complex web application. It spans user preferences (theme, language, notifications), account management (email, password, two-factor authentication), workspace settings (organization name, billing, team members), and danger zone operations (deactivate account, delete data). Each category has different persistence, authorization, and UX requirements—a dark mode toggle can save instantly and optimistically; a password change requires re-authentication and server-side validation; account deletion requires multi-step confirmation and a cooling-off period.</p>
        <p>The engineering challenge is providing a coherent settings system without a monolithic God component. The settings surface must be extensible (new settings added as the product evolves without restructuring the entire page), handle heterogeneous save behaviors (instant for preferences, explicit submit for sensitive fields), enforce the right authorization rules per section (regular users vs admins), and surface errors specific to each setting without global error states that are disconnected from the relevant field.</p>
        <p><strong>Explicit assumptions:</strong> Settings are organized into sections: user preferences, account, workspace (multi-tenant), and danger zone. Preferences sync server-side for cross-device consistency. Some settings require password re-authentication before change (email, password, payment method). Danger zone operations (delete account) are deferred (30-day soft delete) and require email confirmation. The settings page is accessible to both regular users and administrators, with section visibility gated by role.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Preference settings:</strong> Theme (light/dark/system), language, timezone, date format, notification preferences. Save immediately on change (no submit button).</li>
          <li><strong>Account settings:</strong> Email, display name, avatar, password, two-factor authentication. Require explicit submit; sensitive fields require current password re-entry before change.</li>
          <li><strong>Workspace settings:</strong> Organization name, logo, domain, billing, member management. Admin-only. Explicit submit with confirmation for destructive changes.</li>
          <li><strong>Danger zone:</strong> Deactivate account (reversible), delete account (irreversible after 30-day cooling period). Multi-step confirmation with typed verification ("type your email to confirm").</li>
          <li><strong>Cross-device sync:</strong> Preference changes persist to server and apply on next login from another device.</li>
          <li><strong>Settings search:</strong> A search field that filters visible settings sections and highlights matching settings labels for discoverability.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Instant feedback for preferences:</strong> Applying a preference change (theme switch) must take effect immediately, before server confirmation.</li>
          <li><strong>Security:</strong> Sensitive settings (email, password) changes require re-authentication. The re-auth session should time out after 5 minutes.</li>
          <li><strong>Accessibility:</strong> Settings form fields must have associated labels, error messages associated with fields via aria-describedby, and logical tab order.</li>
          <li><strong>Error isolation:</strong> An error saving one setting must not prevent other settings from saving. Errors must be displayed adjacent to the relevant field.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The settings page is a collection of independent sections, each with its own form state, validation, and save behavior. Sections do not share form state or error state. This isolation means a server error updating the workspace name does not affect the user's ability to change their notification preferences in the same UI session. Each section component manages its own dirty state (has the user modified the form since last save?) and submission state (is a save request in flight?).</p>
        <p>Save behavior is categorized: "instant" sections (preferences) update server-side via a debounced optimistic update on every change event; "explicit" sections (account, workspace) show a Save button that becomes active only when the form is dirty and passes client-side validation; "gated" sections (email, password) require re-authentication before the Save button is active. Danger zone actions use a dedicated modal with multi-step confirmation, disconnected from the standard form patterns.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/settings-page-system.svg"
          alt="Settings page system showing preference taxonomy, instant-save vs explicit-save strategies, re-auth gate for sensitive settings, danger zone multi-step confirm, and cross-device preference sync"
          caption="Settings page system showing preference taxonomy, instant-save vs explicit-save strategies, re-auth gate for sensitive settings, danger zone multi-step confirm, and cross-device preference sync"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Settings Taxonomy and Navigation</h3>
        <p>Settings are organized into a two-level hierarchy: sections (the primary navigation items in the left sidebar) and groups within sections (collapsible groups within a section for related settings). Common section taxonomy: Profile (avatar, display name, bio), Account (email, password, 2FA, connected apps, sessions), Notifications (email, push, in-app preferences per notification type), Appearance (theme, language, density), Privacy (activity visibility, data download, right to erasure), Workspace (organization-level settings, admin-only), Billing (plan, payment method, invoice history, admin-only), and Danger Zone (deactivate, delete).</p>
        <p>The left sidebar navigation scrolls the user to the relevant section (anchor link to a section id) rather than loading a separate page per section. This keeps the browser's back button behavior intuitive and allows the URL to reflect the current section (/settings#account, /settings#notifications) for shareability. Active section highlighting in the sidebar uses an IntersectionObserver to detect which section is currently in the viewport as the user scrolls.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Instant-Save Preferences</h3>
        <p>Preferences (theme, language, notification toggles) should take effect immediately and save without an explicit button press. The user expects to toggle dark mode and see it apply instantly—requiring a "Save" click after a toggle is an unnecessary friction that confuses users accustomed to mobile-style settings UX.</p>
        <p>The save flow: user changes a toggle or select → apply the change to local state immediately (instant UI response) → debounce 500ms → send PATCH /preferences/{"{"}key{"}"} to the server → on success, do nothing; on failure, revert the local state and show an inline error. The 500ms debounce prevents a network request on every single toggle flick for users who are exploring settings. The revert on failure is important: if the server rejects a preference change (unusual, but possible for plan-gated features), the UI must not stay in a state that contradicts the actual setting.</p>
        <p>Cross-device sync: preference changes are stored server-side per user. On login from another device, the application fetches the server preferences and applies them to the local theme/language state. If the user has local preferences (stored in localStorage before they were authenticated), the server preferences take priority on login, with a fallback to local if the server fetch fails.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Explicit-Save Forms for Account Settings</h3>
        <p>Account settings (display name, avatar, bio) use an explicit Save button pattern. The form tracks dirty state: the Save button is disabled and grayed out when the form values match the server state, and active when the user has made a change. Client-side validation runs on blur (when the user leaves a field) and on submit attempt. Server-side validation results are displayed as field-level errors adjacent to the relevant input.</p>
        <p>The avatar upload is a specialized case. The user selects or drags an image file; the client crops/resizes it client-side (using a canvas-based image processing step, offloaded to a Web Worker to avoid blocking the UI) and uploads it to the server. While the upload is in progress, a preview of the new avatar is shown alongside the current avatar. On success, the new avatar is applied globally (the header avatar, all references in the app) via the global user state store. On failure, the preview is removed and an error is shown.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Re-Authentication Gate for Sensitive Changes</h3>
        <p>Changing email or password requires the user to confirm their current password, even if they are already authenticated. This is "step-up authentication" for high-impact account operations: a stolen session cookie allows viewing account settings but should not allow changing the account's primary contact email or password without knowing the current password. The re-auth requirement is a fundamental defense against session hijacking escalation.</p>
        <p>The re-auth gate UI: when the user clicks into the email or password field, a modal appears: "To change sensitive settings, please confirm your password." After confirming, the user has a 5-minute re-auth window during which the sensitive fields are editable. After 5 minutes, the gate closes and re-confirmation is required. The 5-minute window is held in memory (not localStorage) so it doesn't persist across browser restarts.</p>
        <p>The re-auth token (returned by the confirm-password endpoint) is short-lived (5-minute TTL) and single-purpose (only accepted by the sensitive-settings endpoints). It should not be stored in a way that survives XSS (httpOnly cookie via a different path, or in-memory JavaScript variable). Storing in-memory means it cannot be exfiltrated by malicious scripts that can only read storage APIs.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Danger Zone Operations</h3>
        <p>Account deactivation and deletion are the highest-stakes operations in the settings page. They require: (1) a clearly separated UI zone ("Danger Zone" header in red, visually distinct from other settings sections); (2) explicit confirmation beyond a button click; (3) a cooling-off period for irreversible operations; and (4) an email notification confirming the action was taken (allowing the user to contact support if the action was unauthorized).</p>
        <p>Account deletion flow: user clicks "Delete Account" → modal explains consequences (data permanently deleted after 30 days, subscriptions cancelled immediately, cannot be undone) → user types their email address in a confirmation field ("Type your email address to confirm") → on match, the Delete button becomes active → user clicks Delete → server schedules account deletion for 30 days from now and immediately deactivates the account → confirmation email sent → user is logged out and redirected to a "Your account deletion is scheduled" page with a "Cancel deletion" option available for the next 30 days.</p>
        <p>The typed-email confirmation (rather than a "yes I'm sure" checkbox) significantly reduces accidental deletions. The effort of typing the email acts as a commitment device—the user must consciously engage with the confirmation rather than mindlessly clicking through a dialog. This pattern is used by GitHub, Heroku, and other platforms for high-stakes destructive operations.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Settings Search</h3>
        <p>Settings discoverability is a common problem: users know they want to change a setting but cannot find which section it is in. A search field at the top of the settings page filters the visible sections and highlights matching labels. The search is client-side (all settings are already loaded on the page) using fuzzy matching against a pre-built index of section names, group names, and individual setting labels.</p>
        <p>Matching behavior: entering "notification" shows the Notifications section highlighted and scrolls to it. Entering "dark" shows the Appearance section with the theme setting highlighted. Entering a setting name that appears in multiple sections shows all matching sections. No results for a query shows a "No settings found" message with a fallback suggestion ("Contact support for help"). The search index is built once on page load and is updated if sections are dynamically added (unusual but possible in plugin architectures).</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Instant-save versus explicit-save for all settings: using instant-save for all settings (no submit buttons anywhere) is consistent and reduces friction, but creates challenges for settings that require validation (you can't partially validate a password as the user types it) and for settings that should only take effect when complete (changing a domain name requires the whole new domain, not character-by-character application). The hybrid approach (instant-save for toggles and selects, explicit-save for text fields) matches user expectations from native OS settings panels.</p>
        <p>Page-per-section versus single-page with anchors: a separate page per settings section (/settings/account, /settings/notifications) is easier to implement (each page loads only its own settings) and provides cleaner URLs. A single scrollable page with anchor links is more cohesive and allows the user to see all settings without navigation. For large settings surfaces (30+ sections), the page-per-section approach is more maintainable. For smaller products, single-page is preferable for cohesion. The hybrid (sections as URL-fragment anchor links, smooth-scroll navigation) provides the URL benefits of page-per-section without page reloads.</p>
        <p>Server-side versus client-side preference storage: localStorage for preferences (theme, language) is fast but not cross-device. Server-side storage is cross-device but requires a network call on application startup to fetch preferences (delaying the first render of theme-dependent content). The standard solution is to use localStorage as the immediate cache, read from it synchronously for the initial render, and sync from the server in the background—updating localStorage and applying any differences between the local and server preferences after the application loads.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A production settings page system organizes settings into sections (Profile, Account, Notifications, Appearance, Workspace, Billing, Danger Zone) with section-isolated form state. Save strategies differ by section type: instant-save with 500ms debounce and optimistic revert for preferences, explicit Save button with dirty-state tracking for account settings, and re-auth gate (5-minute step-up authentication window) for sensitive changes (email, password). Danger zone operations use typed-email confirmation and a 30-day deferred delete cooling period. Settings search uses client-side fuzzy matching against a pre-built label index. Preferences sync server-side for cross-device consistency, using localStorage as a synchronous cache hydrated before the first render. Each section is an independent component with its own error state—a server error in one section never prevents other sections from functioning.</p>
      </section>
    </ArticleLayout>
  );
}

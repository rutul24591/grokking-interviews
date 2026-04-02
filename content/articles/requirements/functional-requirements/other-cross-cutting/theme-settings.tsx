"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-functional-theme-settings",
  title: "Theme Settings",
  description:
    "Comprehensive guide to implementing theme settings covering light mode, dark mode, system theme, custom themes, theme persistence, and theme management for user interface customization.",
  category: "functional-requirements",
  subcategory: "other-cross-cutting-functional-requirements",
  slug: "theme-settings",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "cross-cutting",
    "theme-settings",
    "dark-mode",
    "light-mode",
    "ui-customization",
  ],
  relatedTopics: ["language-settings", "accessibility-settings", "user-preferences", "saved-preferences"],
};

export default function ThemeSettingsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Theme Settings enable users to customize the visual appearance of the application. Users can select theme mode (light mode, dark mode, system theme), customize themes (custom colors, custom styles), persist themes (save theme preferences), and manage themes (view and edit saved themes). Theme settings are fundamental to user experience (personalized appearance), accessibility (appropriate contrast), and user satisfaction (users appreciate customization). For platforms with user interfaces, effective theme settings are essential for user experience, accessibility, and satisfaction.
        </p>
        <p>
          For staff and principal engineers, theme settings architecture involves theme management (manage themes), theme persistence (persist theme preferences), theme sync (sync across devices), theme application (apply themes), and theme customization (customize themes). The implementation must balance customization (users can customize) with consistency (consistent experience) and performance (fast theme switching). Poor theme settings lead to user frustration, accessibility issues, and inconsistent experience.
        </p>
        <p>
          The complexity of theme settings extends beyond simple light/dark toggle. Theme modes (light, dark, system). Theme customization (custom colors, custom styles). Theme persistence (save preferences). Theme sync (sync across devices). Theme application (apply themes correctly). For staff engineers, theme settings are a user interface infrastructure decision affecting user experience, accessibility, and satisfaction.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Theme Modes</h3>
        <p>
          Light mode displays light theme. Light background (light background colors). Dark text (dark text colors). Light icons (light icon colors). Light mode enables light theme. Benefits include readability (readable in bright light), familiarity (familiar appearance). Drawbacks includes eye strain (eye strain in dark), battery usage (higher battery usage on OLED).
        </p>
        <p>
          Dark mode displays dark theme. Dark background (dark background colors). Light text (light text colors). Dark icons (dark icon colors). Dark mode enables dark theme. Benefits include eye comfort (comfortable in dark), battery saving (saves battery on OLED). Drawbacks includes readability issues (hard to read in bright light), unfamiliarity (unfamiliar appearance).
        </p>
        <p>
          System theme follows system theme. System detection (detect system theme). Auto switch (automatically switch theme). System override (override system theme). System theme enables system-following theme. Benefits include consistency (consistent with system), automation (automatically switch). Drawbacks includes system dependency (depends on system), may not match preference (may not match user preference).
        </p>

        <h3 className="mt-6">Theme Customization</h3>
        <p>
          Color customization customizes theme colors. Primary color (customize primary color). Accent color (customize accent color). Background color (customize background color). Color customization enables color customization. Benefits include personalization (personalized colors), branding (match branding). Drawbacks includes complexity (many color options), may be ugly (users may choose ugly colors).
        </p>
        <p>
          Style customization customizes theme styles. Font style (customize font style). Icon style (customize icon style). Layout style (customize layout style). Style customization enables style customization. Benefits include personalization (personalized styles), accessibility (accessible styles). Drawbacks includes complexity (many style options), consistency issues (may break consistency).
        </p>
        <p>
          Preset themes provide preset themes. Light preset (light theme preset). Dark preset (dark theme preset). Custom preset (custom theme preset). Preset themes enable preset themes. Benefits include simplicity (simple selection), consistency (consistent themes). Drawbacks includes limited customization (limited customization), may not match preference (may not match user preference).
        </p>

        <h3 className="mt-6">Theme Persistence</h3>
        <p>
          Local persistence persists theme locally. Local storage (store locally). Device storage (store on device). App storage (store in app). Local persistence enables local theme persistence. Benefits include fast access (fast theme access), offline access (access without network). Drawbacks includes device limitation (theme only on device), data loss risk (device failure loses theme).
        </p>
        <p>
          Cloud persistence persists theme in cloud. Cloud storage (store in cloud). Account storage (store with account). Server storage (store on server). Cloud persistence enables cloud theme persistence. Benefits include device independence (access from any device), data protection (protect from device failure). Drawbacks includes network dependency (need network for access), privacy concern (theme in cloud).
        </p>
        <p>
          Hybrid persistence persists theme locally and in cloud. Local storage (store locally). Cloud sync (sync to cloud). Hybrid persistence enables local and cloud persistence. Benefits include fast access (fast local access), device independence (sync to cloud). Drawbacks includes complexity (manage local and cloud), sync issues (sync conflicts).
        </p>

        <h3 className="mt-6">Theme Sync</h3>
        <p>
          Real-time sync syncs theme in real-time. Real-time delivery (deliver immediately). No delay (no delay). Real-time sync enables instant sync. Benefits include immediacy (instant sync), consistency (consistent across devices). Drawbacks includes network usage (uses network), battery drain (drains battery).
        </p>
        <p>
          Batched sync syncs theme in batches. Batch delivery (deliver in batches). Batch frequency (sync daily, weekly). Batch content (sync changed theme). Batched sync reduces network usage. Benefits include reduced usage (less network usage), battery saving (saves battery). Drawbacks includes delay (not instant sync), inconsistency (inconsistent across devices).
        </p>
        <p>
          Manual sync syncs theme manually. Manual trigger (manually trigger sync). Manual selection (manually select what to sync). Manual sync enables manual sync. Benefits include user control (users control sync), network saving (save network). Drawbacks includes user burden (must manually sync), may forget (may forget to sync).
        </p>

        <h3 className="mt-6">Theme Application</h3>
        <p>
          Immediate application applies theme immediately. Immediate apply (apply immediately). No delay (no delay). Immediate application enables instant theme change. Benefits include immediacy (instant theme change), user satisfaction (users see change immediately). Drawbacks includes performance impact (may impact performance), flash of unstyled content (may flash).
        </p>
        <p>
          Delayed application applies theme with delay. Delayed apply (apply with delay). Transition (transition theme). Delayed application enables smooth theme change. Benefits include smooth transition (smooth theme change), performance optimization (optimize performance). Drawbacks includes delay (not instant), user frustration (users may be frustrated).
        </p>
        <p>
          Conditional application applies theme conditionally. Condition check (check conditions). Conditional apply (apply conditionally). Conditional application enables conditional theme change. Benefits include appropriate application (appropriate theme), user control (users control application). Drawbacks includes complexity (check conditions), may not apply (may not apply correctly).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Theme settings architecture spans theme service, persistence service, sync service, and application service. Theme service manages themes. Persistence service manages theme persistence. Sync service manages theme sync. Application service manages theme application. Each layer has specific responsibilities and integration requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/theme-settings/theme-architecture.svg"
          alt="Theme Settings Architecture"
          caption="Figure 1: Theme Settings Architecture — Theme service, persistence service, sync service, and application service"
          width={1000}
          height={500}
        />

        <h3>Theme Service</h3>
        <p>
          Theme service manages user themes. Theme storage (store themes). Theme retrieval (retrieve themes). Theme update (update themes). Theme service is the core of theme settings. Benefits include centralization (one place for themes), consistency (same themes everywhere). Drawbacks includes complexity (manage themes), coupling (services depend on theme service).
        </p>
        <p>
          Theme policies define theme rules. Default themes (default themes). Theme validation (validate themes). Theme sync (sync themes). Theme policies automate theme management. Benefits include automation (automatic management), consistency (same rules for all). Drawbacks includes complexity (define policies), may not fit all cases.
        </p>

        <h3 className="mt-6">Persistence Service</h3>
        <p>
          Persistence service manages theme persistence. Local persistence (persist locally). Cloud persistence (persist in cloud). Hybrid persistence (persist locally and in cloud). Persistence service enables theme persistence. Benefits include persistence management (manage persistence), persistence (persist themes). Drawbacks includes complexity (manage persistence), persistence failures (may not persist correctly).
        </p>
        <p>
          Persistence preferences define persistence rules. Persistence selection (select persistence). Persistence frequency (configure persistence frequency). Persistence priority (configure persistence priority). Persistence preferences enable persistence customization. Benefits include customization (customize persistence), user control (users control persistence). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/theme-settings/theme-modes.svg"
          alt="Theme Modes"
          caption="Figure 2: Theme Modes — Light mode, dark mode, and system theme"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Sync Service</h3>
        <p>
          Sync service manages theme sync. Sync registration (register sync). Sync delivery (deliver by sync). Sync preferences (configure sync). Sync service enables sync management. Benefits include sync management (manage sync), delivery (deliver by sync). Drawbacks includes complexity (manage sync), sync failures (may not sync correctly).
        </p>
        <p>
          Sync preferences define sync rules. Sync selection (select sync). Sync frequency (configure sync frequency). Sync priority (configure sync priority). Sync preferences enable sync customization. Benefits include customization (customize sync), user control (users control sync). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/theme-settings/theme-customization.svg"
          alt="Theme Customization"
          caption="Figure 3: Theme Customization — Color, style, and preset customization"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Theme settings design involves trade-offs between light and dark mode, local and cloud persistence, and immediate and delayed application. Understanding these trade-offs enables informed decisions aligned with user needs and business requirements.
        </p>

        <h3>Mode: Light vs. Dark</h3>
        <p>
          Light mode (light theme). Pros: Readability (readable in bright light), familiarity (familiar appearance), accessibility (accessible for most users). Cons: Eye strain (eye strain in dark), battery usage (higher battery usage on OLED), glare (glare in dark). Best for: Bright environments, general use.
        </p>
        <p>
          Dark mode (dark theme). Pros: Eye comfort (comfortable in dark), battery saving (saves battery on OLED), reduced glare (reduced glare in dark). Cons: Readability issues (hard to read in bright light), unfamiliarity (unfamiliar appearance), color accuracy (color accuracy issues). Best for: Dark environments, OLED displays.
        </p>
        <p>
          Hybrid: system theme with manual override. Pros: Best of both (system for automatic, manual for override). Cons: Complexity (system and manual), may confuse users. Best for: Most platforms—system theme with manual override.
        </p>

        <h3>Persistence: Local vs. Cloud</h3>
        <p>
          Local persistence (persist locally). Pros: Fast access (fast theme access), offline access (access without network), privacy (theme local). Cons: Device limitation (theme only on device), data loss risk (device failure loses theme), no sync (no sync across devices). Best for: Fast access, offline access, privacy-focused.
        </p>
        <p>
          Cloud persistence (persist in cloud). Pros: Device independence (access from any device), data protection (protect from device failure), sync (sync across devices). Cons: Network dependency (need network for access), privacy concern (theme in cloud), slower access (slower than local). Best for: Device independence, data protection, sync.
        </p>
        <p>
          Hybrid: local with cloud sync. Pros: Best of both (fast local access, cloud sync). Cons: Complexity (manage local and cloud), sync issues (sync conflicts). Best for: Most platforms—local with cloud sync.
        </p>

        <h3>Application: Immediate vs. Delayed</h3>
        <p>
          Immediate application (apply immediately). Pros: Immediacy (instant theme change), user satisfaction (users see change immediately), simplicity (simple application). Cons: Performance impact (may impact performance), flash of unstyled content (may flash), disruption (disrupts user). Best for: Fast devices, simple themes.
        </p>
        <p>
          Delayed application (apply with delay). Pros: Smooth transition (smooth theme change), performance optimization (optimize performance), no flash (no flash). Cons: Delay (not instant), user frustration (users may be frustrated), complexity (manage delay). Best for: Slow devices, complex themes.
        </p>
        <p>
          Hybrid: immediate with transition. Pros: Best of both (immediate with smooth transition). Cons: Complexity (immediate and transition), may still flash. Best for: Most platforms—immediate with transition.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/theme-settings/theme-comparison.svg"
          alt="Theme Approaches Comparison"
          caption="Figure 4: Theme Approaches Comparison — Mode, persistence, and application trade-offs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Provide theme modes:</strong> Light mode. Dark mode. System theme. Let users choose.
          </li>
          <li>
            <strong>Enable theme customization:</strong> Color customization. Style customization. Preset themes. Let users choose.
          </li>
          <li>
            <strong>Persist themes:</strong> Local persistence. Cloud persistence. Hybrid persistence. Let users choose.
          </li>
          <li>
            <strong>Sync themes:</strong> Real-time sync. Batched sync. Manual sync. Let users choose.
          </li>
          <li>
            <strong>Apply themes correctly:</strong> Immediate application. Delayed application. Conditional application.
          </li>
          <li>
            <strong>Manage themes:</strong> Theme center. Show saved themes. Enable theme editing. Enable theme deletion.
          </li>
          <li>
            <strong>Notify of themes:</strong> Notify when theme saved. Notify of theme sync. Notify of theme change.
          </li>
          <li>
            <strong>Monitor themes:</strong> Monitor theme usage. Monitor theme sync. Monitor theme application.
          </li>
          <li>
            <strong>Test themes:</strong> Test theme persistence. Test theme sync. Test theme application.
          </li>
          <li>
            <strong>Ensure accessibility:</strong> Appropriate contrast. Accessible colors. Accessible styles.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No theme modes:</strong> Only one theme. <strong>Solution:</strong> Provide theme modes.
          </li>
          <li>
            <strong>No theme customization:</strong> Can&apos;t customize theme. <strong>Solution:</strong> Enable theme customization.
          </li>
          <li>
            <strong>No theme persistence:</strong> Theme not saved. <strong>Solution:</strong> Persist themes.
          </li>
          <li>
            <strong>No theme sync:</strong> Theme not synced. <strong>Solution:</strong> Sync themes.
          </li>
          <li>
            <strong>Poor application:</strong> Theme not applied correctly. <strong>Solution:</strong> Apply themes correctly.
          </li>
          <li>
            <strong>No theme management:</strong> Can&apos;t manage themes. <strong>Solution:</strong> Provide theme center.
          </li>
          <li>
            <strong>No notification:</strong> Don&apos;t notify of theme. <strong>Solution:</strong> Notify when saved.
          </li>
          <li>
            <strong>No monitoring:</strong> Don&apos;t know theme usage. <strong>Solution:</strong> Monitor themes.
          </li>
          <li>
            <strong>Poor accessibility:</strong> Inaccessible themes. <strong>Solution:</strong> Ensure accessibility.
          </li>
          <li>
            <strong>No testing:</strong> Don&apos;t test themes. <strong>Solution:</strong> Test theme persistence and application.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>OS Theme Settings</h3>
        <p>
          Operating systems provide theme settings. Theme modes (light, dark, system). Theme customization (custom colors, custom styles). Theme persistence (persist themes). Theme sync (sync across devices). Users control OS theme.
        </p>

        <h3 className="mt-6">Browser Theme Settings</h3>
        <p>
          Browsers provide theme settings. Theme modes (light, dark, system). Theme customization (custom colors, custom styles). Theme persistence (persist themes). Theme sync (sync across devices). Users control browser theme.
        </p>

        <h3 className="mt-6">App Theme Settings</h3>
        <p>
          Apps provide theme settings. Theme modes (light, dark, system). Theme customization (custom colors, custom styles). Theme persistence (persist themes). Theme sync (sync across devices). Users control app theme.
        </p>

        <h3 className="mt-6">Website Theme Settings</h3>
        <p>
          Websites provide theme settings. Theme modes (light, dark, system). Theme customization (custom colors). Theme persistence (persist themes). Theme sync (sync across devices). Users control website theme.
        </p>

        <h3 className="mt-6">Gaming Platform Theme Settings</h3>
        <p>
          Gaming platforms provide theme settings. Theme modes (light, dark, system). Theme customization (custom colors, custom styles). Theme persistence (persist themes). Theme sync (sync across devices). Users control gaming platform theme.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design theme settings that balance customization with consistency?</p>
            <p className="mt-2 text-sm">
              Implement sensible customization with constraints because users want customization (personal expression, accessibility needs) but don&apos;t want inconsistency (broken UI, unreadable text). Provide theme modes: light mode (bright background, dark text), dark mode (dark background, light text), system mode (follow OS preference)—core modes cover most needs. Enable color customization: within constraints (choose accent color from palette, not arbitrary colors; ensure sufficient contrast)—personalization without breaking design. Enable style customization: within constraints (choose font size from range, not arbitrary; choose spacing from options)—accessibility without breaking layout. Ensure consistency: constrain customization (validate choices, enforce minimum contrast, prevent broken combinations)—design system integrity maintained. The consistency insight: users want customization but don&apos;t want inconsistency—provide customization with constraints (palettes, ranges, validation), ensure consistency (validate, enforce minimums), and balance personal expression with design integrity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement theme persistence?</p>
            <p className="mt-2 text-sm">
              Implement persistence management because users expect themes to persist across sessions, restarts, and updates. Local persistence: persist locally (localStorage, config files, user defaults)—fast access, works offline, survives app restart. Cloud persistence: persist in cloud (user account, encrypted storage, synced)—survives device loss, available across devices, requires network. Hybrid persistence: persist locally and in cloud (local for speed, cloud for backup/sync)—best of both, local first with cloud backup. Persistence enforcement: enforce persistence (save on change, verify saved, restore on launch)—themes actually persist, not lost on restart. The persistence insight: users want themes saved—provide local (fast, offline), cloud (backup, sync), hybrid (best of both), enforce persistence (save, verify, restore), and ensure themes survive restarts, updates, device changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle theme sync across devices?</p>
            <p className="mt-2 text-sm">
              Implement theme sync because users expect theme to follow them across devices seamlessly. Sync selection: select what to sync (theme mode, colors, fonts, all settings)—user control, sensitive settings can stay local. Sync scheduling: schedule sync (sync on change, sync on app launch, sync periodically)—balance freshness with bandwidth, battery. Sync conflict resolution: resolve conflicts (last-write-wins, manual resolution, merge non-conflicting)—conflicts inevitable when editing on multiple devices. Sync enforcement: enforce sync (sync required for cloud settings, verify sync complete, retry on failure)—ensure consistency across devices. The sync insight: users want sync across devices—provide selection (what syncs), scheduling (when to sync), conflict resolution (handle conflicts), enforcement (ensure consistency), and make sync seamless and reliable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you apply themes correctly?</p>
            <p className="mt-2 text-sm">
              Implement theme application because themes must be applied correctly to all UI elements. Immediate application: apply immediately (theme changes visible instantly, no reload needed)—feels responsive, user sees change immediately. Delayed application: apply with delay (batch changes, apply on save, apply on restart)—performance optimization, avoid flicker during editing. Conditional application: apply conditionally (apply only to supported elements, skip unsupported, fallback for missing)—handle partial theme support gracefully. Application enforcement: enforce application (verify theme applied, check all elements themed, fix unthemed elements)—ensure complete theming, no unthemed elements. The application insight: themes must be applied correctly—provide immediate (instant feedback), delayed (batch, optimize), conditional (handle partial support), enforce application (verify, check, fix), and ensure all UI elements properly themed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure theme accessibility?</p>
            <p className="mt-2 text-sm">
              Implement accessibility checks because themes must be usable by all users including those with visual impairments. Contrast check: check contrast (WCAG AA minimum 4.5:1 for text, AAA 7:1 for enhanced)—ensure text readable on background, reject insufficient contrast. Color check: check colors (not color-only indicators, support color blindness, provide alternatives)—users with color vision deficiency can use interface. Style check: check styles (readable font sizes, sufficient spacing, clear focus indicators)—users with low vision can navigate. Accessibility enforcement: enforce accessibility (block inaccessible themes, warn before applying, provide accessible alternatives)—prevent inaccessible themes from being applied. The accessibility insight: themes must be accessible—check contrast (WCAG standards), check colors (color blindness support), check styles (readability, navigation), enforce accessibility (block, warn, provide alternatives), and ensure all users can use themed interface.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle system theme?</p>
            <p className="mt-2 text-sm">
              Implement system theme handling because users want apps to follow system preference automatically. System detection: detect system theme (listen for OS theme change events, query current theme, handle theme updates)—know when system theme changes. Auto switch: automatically switch theme (app follows system, no user action needed, instant switch)—seamless experience, app matches OS. System override: override system theme (user can choose app-specific theme, override system, persist override)—user control, app can differ from system. System sync: sync with system (sync on launch, sync on system change, sync periodically)—keep app in sync with system unless overridden. The system insight: users want system theme—detect (listen, query, handle), auto switch (follow system, instant), override (user control, app-specific), sync (launch, change, periodic), and provide seamless system integration with user override option.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — prefers-color-scheme Media Query
            </a>
          </li>
          <li>
            <a
              href="https://developer.apple.com/design/human-interface-guidelines/dark-mode/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple — Dark Mode Design Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://material.io/design/color/dark-theme.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Material Design — Dark Theme
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WCAG — Contrast Minimum
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/prefers-color-scheme/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Dark Mode with prefers-color-scheme
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/dark-mode-as-a-default/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Dark Mode as Default
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

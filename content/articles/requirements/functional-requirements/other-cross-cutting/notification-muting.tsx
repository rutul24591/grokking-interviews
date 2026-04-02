"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-functional-notification-muting",
  title: "Notification Muting",
  description:
    "Comprehensive guide to implementing notification muting covering mute duration, mute scope, temporary muting, permanent muting, and mute management for notification control and user experience.",
  category: "functional-requirements",
  subcategory: "other-cross-cutting-functional-requirements",
  slug: "notification-muting",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "cross-cutting",
    "notification-muting",
    "notifications",
    "user-preferences",
    "mute-management",
  ],
  relatedTopics: ["notification-preferences", "email-digest-preferences", "notification-frequency-controls", "quiet-hours"],
};

export default function NotificationMutingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Notification Muting enables users to temporarily or permanently silence notifications. Users can mute notifications for specific duration (15 minutes, 1 hour, 8 hours, 24 hours), mute specific sources (mute specific users, groups, channels), mute specific types (mute specific notification types), and manage mutes (view and edit active mutes). Notification muting is fundamental to user control (users control notifications), notification fatigue prevention (reduce notification overload), and user satisfaction (users appreciate control). For platforms with user notifications, effective notification muting is essential for user control, fatigue prevention, and user satisfaction.
        </p>
        <p>
          For staff and principal engineers, notification muting architecture involves mute duration (how long to mute), mute scope (what to mute), mute enforcement (enforce mute), and mute management (manage active mutes). The implementation must balance user control (users can mute) with engagement (don&apos;t mute important notifications) and platform needs (communicate with users). Poor notification muting leads to notification fatigue, user churn, and missed important notifications.
        </p>
        <p>
          The complexity of notification muting extends beyond simple mute toggle. Mute duration (temporary vs. permanent). Mute scope (what to mute). Mute enforcement (enforce mute). Mute override (override for important). Mute management (manage active mutes). For staff engineers, notification muting is a user notification control infrastructure decision affecting user experience, notification fatigue, and user satisfaction.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Mute Duration</h3>
        <p>
          Temporary mute mutes for specific duration. Short duration (15 minutes, 30 minutes). Medium duration (1 hour, 2 hours). Long duration (8 hours, 24 hours). Temporary mute enables temporary silence. Benefits include flexibility (mute temporarily), automatic resume (automatically resume). Drawbacks includes complexity (manage duration), may forget mute (users may forget).
        </p>
        <p>
          Permanent mute mutes indefinitely. Indefinite duration (mute until unmute). Manual unmute (user must unmute). Permanent mute enables permanent silence. Benefits include permanence (mute until unmute), user control (user decides when to unmute). Drawbacks includes may miss important (may miss important notifications), user must remember to unmute.
        </p>
        <p>
          Scheduled mute mutes on schedule. Quiet hours (mute during quiet hours). Recurring mute (mute on recurring schedule). Event-based mute (mute for specific events). Scheduled mute enables scheduled silence. Benefits include automation (automatically mute), consistency (consistently mute). Drawbacks includes complexity (manage schedule), may miss important (may miss important during mute).
        </p>

        <h3 className="mt-6">Mute Scope</h3>
        <p>
          Global mute mutes all notifications. All channels (mute all channels). All types (mute all types). All sources (mute all sources). Global mute enables complete silence. Benefits include complete silence (no notifications), simplicity (one mute). Drawbacks includes may miss important (miss all notifications), may be too broad (mute everything).
        </p>
        <p>
          Channel mute mutes specific channels. Email mute (mute email notifications). Push mute (mute push notifications). SMS mute (mute SMS notifications). Channel mute enables channel-specific silence. Benefits include targeted silence (mute specific channels), flexibility (mute only unwanted). Drawbacks includes complexity (mute per channel), may miss important (may miss important on muted channel).
        </p>
        <p>
          Source mute mutes specific sources. User mute (mute specific users). Group mute (mute specific groups). Topic mute (mute specific topics). Source mute enables source-specific silence. Benefits include targeted silence (mute specific sources), flexibility (mute only unwanted). Drawbacks includes complexity (mute per source), may miss important (may miss important from muted source).
        </p>
        <p>
          Type mute mutes specific types. Activity mute (mute activity notifications). System mute (mute system notifications). Marketing mute (mute marketing notifications). Type mute enables type-specific silence. Benefits include targeted silence (mute specific types), flexibility (mute only unwanted). Drawbacks includes complexity (mute per type), may miss important (may miss important of muted type).
        </p>

        <h3 className="mt-6">Mute Enforcement</h3>
        <p>
          Mute check checks mute before sending. Mute status (check mute status). Mute scope (check mute scope). Mute duration (check mute duration). Mute check ensures mute enforced. Benefits include enforcement (enforce mute), respect (respect user mute). Drawbacks includes complexity (check mute), may miss important (may filter important).
        </p>
        <p>
          Mute filtering filters muted notifications. Filter by duration (filter by mute duration). Filter by scope (filter by mute scope). Filter by type (filter by mute type). Mute filtering ensures muted notifications filtered. Benefits include filtering (filter muted), respect (respect user mute). Drawbacks includes complexity (filter correctly), may miss important (may filter important).
        </p>
        <p>
          Mute override overrides mute for important. Priority override (override for priority). Emergency override (override for emergency). Important override (override for important). Mute override ensures important notifications delivered. Benefits include important delivery (deliver important), safety (deliver emergency). Drawbacks includes complexity (define important), may be wrong (may override incorrectly).
        </p>

        <h3 className="mt-6">Mute Management</h3>
        <p>
          Mute UI provides interface for managing mutes. Mute center (central place for mutes). Duration selection (select duration). Scope selection (select scope). Mute UI enables managing mutes. Benefits include user control (users control mutes), clarity (clear mutes). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>
        <p>
          Mute storage stores user mutes. Mute database (store mutes). Mute sync (sync across devices). Mute backup (backup mutes). Mute storage enables persisting mutes. Benefits include persistence (mutes saved), sync (sync across devices). Drawbacks includes storage (store mutes), complexity (manage mutes).
        </p>
        <p>
          Mute status shows mute status. Active mutes (show active mutes). Mute duration (show mute duration). Mute scope (show mute scope). Mute status enables mute awareness. Benefits include awareness (know active mutes), control (can manage mutes). Drawbacks includes complexity (show status), may be confusing (users may not understand).
        </p>

        <h3 className="mt-6">Mute Patterns</h3>
        <p>
          Meeting mute mutes during meetings. Meeting detection (detect meetings). Auto mute (automatically mute during meetings). Auto unmute (automatically unmute after meetings). Meeting mute enables meeting silence. Benefits include meeting focus (don&apos;t interrupt meetings), automation (automatically mute). Drawbacks includes detection accuracy (may not detect correctly), may miss important (may miss important during meetings).
        </p>
        <p>
          Sleep mute mutes during sleep. Sleep schedule (define sleep schedule). Auto mute (automatically mute during sleep). Auto unmute (automatically unmute after sleep). Sleep mute enables sleep silence. Benefits include sleep protection (don&apos;t interrupt sleep), automation (automatically mute). Drawbacks includes schedule accuracy (may not match sleep), may miss important (may miss important during sleep).
        </p>
        <p>
          Focus mute mutes during focus. Focus mode (enable focus mode). Auto mute (automatically mute during focus). Auto unmute (automatically unmute after focus). Focus mute enables focus silence. Benefits include focus protection (don&apos;t interrupt focus), automation (automatically mute). Drawbacks includes mode management (manage focus mode), may miss important (may miss important during focus).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Notification muting architecture spans mute service, duration service, scope service, and enforcement service. Mute service manages mutes. Duration service manages mute duration. Scope service manages mute scope. Enforcement service enforces mutes. Each layer has specific responsibilities and integration requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/notification-muting/muting-architecture.svg"
          alt="Notification Muting Architecture"
          caption="Figure 1: Notification Muting Architecture — Mute service, duration service, scope service, and enforcement service"
          width={1000}
          height={500}
        />

        <h3>Mute Service</h3>
        <p>
          Mute service manages user mutes. Mute storage (store mutes). Mute retrieval (retrieve mutes). Mute update (update mutes). Mute service is the core of notification muting. Benefits include centralization (one place for mutes), consistency (same mutes everywhere). Drawbacks includes complexity (manage mutes), coupling (services depend on mute service).
        </p>
        <p>
          Mute policies define mute rules. Default mutes (default mutes). Mute validation (validate mutes). Mute sync (sync mutes). Mute policies automate mute management. Benefits include automation (automatic management), consistency (same rules for all). Drawbacks includes complexity (define policies), may not fit all cases.
        </p>

        <h3 className="mt-6">Duration Service</h3>
        <p>
          Duration service manages mute duration. Duration selection (select duration). Duration tracking (track duration). Duration expiration (expire duration). Duration service enables duration management. Benefits include duration management (manage duration), expiration (automatically expire). Drawbacks includes complexity (manage duration), expiration failures (may not expire correctly).
        </p>
        <p>
          Duration preferences define duration rules. Duration options (define duration options). Duration defaults (define duration defaults). Duration limits (define duration limits). Duration preferences enable duration customization. Benefits include customization (customize duration), user control (users control duration). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/notification-muting/mute-scope.svg"
          alt="Mute Scope"
          caption="Figure 2: Mute Scope — Global, channel, source, and type mute"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Scope Service</h3>
        <p>
          Scope service manages mute scope. Scope registration (register scopes). Scope delivery (deliver by scope). Scope preferences (configure scope). Scope service enables scope management. Benefits include scope management (manage scopes), delivery (deliver by scope). Drawbacks includes complexity (manage scopes), scope failures (scopes may fail).
        </p>
        <p>
          Scope preferences define scope rules. Scope selection (select scopes). Scope frequency (configure scope frequency). Scope priority (configure scope priority). Scope preferences enable scope customization. Benefits include customization (customize scopes), user control (users control scopes). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/notification-muting/mute-enforcement.svg"
          alt="Mute Enforcement"
          caption="Figure 3: Mute Enforcement — Mute check, filtering, and override"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Notification muting design involves trade-offs between temporary and permanent mute, broad and narrow scope, and strict and lenient enforcement. Understanding these trade-offs enables informed decisions aligned with user needs and business requirements.
        </p>

        <h3>Duration: Temporary vs. Permanent</h3>
        <p>
          Temporary mute (mute for specific duration). Pros: Automatic resume (automatically resume), flexibility (mute temporarily), user convenience (don&apos;t forget to unmute). Cons: May forget mute (users may forget), may expire too soon (may expire before wanted), complexity (manage duration). Best for: Short-term silence, meetings, sleep.
        </p>
        <p>
          Permanent mute (mute indefinitely). Pros: Permanence (mute until unmute), user control (user decides when to unmute), simplicity (no duration management). Cons: May miss important (may miss important notifications), user must remember to unmute, may forget muted (users may forget muted). Best for: Long-term silence, unwanted sources.
        </p>
        <p>
          Hybrid: temporary with option for permanent. Pros: Best of both (temporary for short, permanent for long). Cons: Complexity (two duration types), may confuse users. Best for: Most platforms—temporary for short-term, permanent for long-term.
        </p>

        <h3>Scope: Broad vs. Narrow</h3>
        <p>
          Broad scope (mute many notifications). Pros: Maximum silence (mute many notifications), simplicity (few mutes), user convenience (don&apos;t mute individually). Cons: May miss important (may miss important notifications), too broad (mute wanted notifications), user frustration (mute too much). Best for: Complete silence, notification fatigue.
        </p>
        <p>
          Narrow scope (mute few notifications). Pros: Targeted silence (mute specific notifications), don&apos;t miss important (don&apos;t mute important), user control (mute only unwanted). Cons: Complexity (mute individually), may miss some (may not mute all unwanted), user burden (must mute individually). Best for: Targeted silence, specific sources.
        </p>
        <p>
          Hybrid: broad with narrow options. Pros: Best of both (broad for complete, narrow for targeted). Cons: Complexity (broad and narrow), may confuse users. Best for: Most platforms—broad for complete silence, narrow for targeted silence.
        </p>

        <h3>Enforcement: Strict vs. Lenient</h3>
        <p>
          Strict enforcement (enforce all mutes). Pros: Maximum respect (respect all mutes), user trust (users trust platform), notification fatigue prevention (prevent fatigue). Cons: May miss important (may miss important notifications), no override (no override for important), user frustration (may miss important). Best for: User control, notification fatigue prevention.
        </p>
        <p>
          Lenient enforcement (override some mutes). Pros: Important delivery (deliver important notifications), safety (deliver emergency), platform communication (communicate with users). Cons: Less respect (don&apos;t respect all mutes), user distrust (users distrust platform), may override too much (override too many). Best for: Important notifications, emergency notifications.
        </p>
        <p>
          Hybrid: strict with emergency override. Pros: Best of both (respect mutes, deliver emergency). Cons: Complexity (define emergency), may override incorrectly. Best for: Most platforms—strict enforcement with emergency override.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/notification-muting/muting-comparison.svg"
          alt="Muting Approaches Comparison"
          caption="Figure 4: Muting Approaches Comparison — Duration, scope, and enforcement trade-offs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Provide mute options:</strong> Temporary mute. Permanent mute. Scheduled mute. Multiple duration options.
          </li>
          <li>
            <strong>Enable mute scope:</strong> Global mute. Channel mute. Source mute. Type mute. Let users choose.
          </li>
          <li>
            <strong>Enforce mutes:</strong> Check mute before sending. Filter muted notifications. Override for emergency only.
          </li>
          <li>
            <strong>Manage mutes:</strong> Mute center. Show active mutes. Enable mute editing. Enable mute deletion.
          </li>
          <li>
            <strong>Notify of mute:</strong> Notify when muted. Notify when mute expires. Notify of active mutes.
          </li>
          <li>
            <strong>Sync mutes:</strong> Sync across devices. Backup mutes. Restore mutes.
          </li>
          <li>
            <strong>Provide presets:</strong> Meeting preset. Sleep preset. Focus preset. Quick mute options.
          </li>
          <li>
            <strong>Monitor mutes:</strong> Monitor mute usage. Monitor mute expiration. Monitor mute effectiveness.
          </li>
          <li>
            <strong>Test mutes:</strong> Test mute enforcement. Test mute expiration. Test mute override.
          </li>
          <li>
            <strong>Respect mutes:</strong> Respect all mutes. Don&apos;t override unless emergency. Log mute enforcement.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No mute options:</strong> Can&apos;t mute notifications. <strong>Solution:</strong> Provide mute options.
          </li>
          <li>
            <strong>Limited scope:</strong> Only global mute. <strong>Solution:</strong> Enable channel, source, type mute.
          </li>
          <li>
            <strong>Don&apos;t enforce mutes:</strong> Send despite mute. <strong>Solution:</strong> Enforce mutes.
          </li>
          <li>
            <strong>No mute management:</strong> Can&apos;t manage active mutes. <strong>Solution:</strong> Provide mute center.
          </li>
          <li>
            <strong>No mute notification:</strong> Don&apos;t notify of mute. <strong>Solution:</strong> Notify when muted, when expires.
          </li>
          <li>
            <strong>No sync:</strong> Mutes not synced. <strong>Solution:</strong> Sync across devices.
          </li>
          <li>
            <strong>Too many overrides:</strong> Override mutes too much. <strong>Solution:</strong> Override only for emergency.
          </li>
          <li>
            <strong>No monitoring:</strong> Don&apos;t know mute usage. <strong>Solution:</strong> Monitor mutes.
          </li>
          <li>
            <strong>Complex mute:</strong> Too complicated to mute. <strong>Solution:</strong> Simple mute interface.
          </li>
          <li>
            <strong>No testing:</strong> Don&apos;t test mutes. <strong>Solution:</strong> Test mute enforcement.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Social Media Notification Muting</h3>
        <p>
          Social media platforms provide notification muting. Mute duration (15 minutes, 1 hour, 24 hours). Mute scope (mute specific users, groups). Mute types (mute specific notification types). Users control social media notifications.
        </p>

        <h3 className="mt-6">Messaging App Notification Muting</h3>
        <p>
          Messaging apps provide notification muting. Mute duration (1 hour, 8 hours, 24 hours, 1 week). Mute scope (mute specific chats, groups). Mute mentions (mute mentions only). Users control messaging notifications.
        </p>

        <h3 className="mt-6">Email App Notification Muting</h3>
        <p>
          Email apps provide notification muting. Mute duration (temporary, permanent). Mute scope (mute specific senders, threads). Mute types (mute specific email types). Users control email notifications.
        </p>

        <h3 className="mt-6">Productivity App Notification Muting</h3>
        <p>
          Productivity apps provide notification muting. Focus mode (mute during focus). Meeting mute (mute during meetings). Sleep mute (mute during sleep). Users control productivity notifications.
        </p>

        <h3 className="mt-6">E-commerce App Notification Muting</h3>
        <p>
          E-commerce apps provide notification muting. Mute duration (temporary, permanent). Mute scope (mute specific promotions, types). Marketing mute (mute marketing notifications). Users control e-commerce notifications.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design notification muting that balances user control with engagement?</p>
            <p className="mt-2 text-sm">
              Implement flexible muting with emergency override because users want control (mute when needed) but don&apos;t want to miss important notifications. Enable temporary and permanent mute: temporary mute (15 minutes, 1 hour, 24 hours, custom duration)—temporary silence for meetings, sleep; permanent mute (mute until manually unmuted)—permanent silence for unwanted sources. Enable broad and narrow scope: broad scope (mute all notifications, mute entire app)—complete silence; narrow scope (mute specific users, specific types, specific channels)—targeted muting. Override only for emergency: emergency override (critical notifications bypass mute, safety alerts, security alerts)—ensure critical notifications get through. Monitor mute usage: monitor how users mute (mute frequency, mute duration, mute patterns)—identify problematic muting, suggest adjustments. The engagement insight: users want control but don&apos;t want to miss important—provide flexible muting (temporary, permanent, broad, narrow), override only for emergency (critical, safety, security), monitor usage (frequency, duration, patterns), and balance user control with engagement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement mute duration?</p>
            <p className="mt-2 text-sm">
              Implement duration management because users want control over how long to mute. Duration selection: select duration (preset durations—15 min, 1 hour, 24 hours, 1 week; custom duration—user specifies exact duration)—flexible options for different needs. Duration tracking: track duration (track when mute started, track remaining time, track expiration)—know mute status, when expires. Duration expiration: expire duration (automatically unmute when expires, notify before expires, notify on expire)—automatic unmute, user awareness. Notification: notify when expires (notify mute expiring soon, notify mute expired, notify unmuted)—user awareness, can extend if needed. The duration insight: users want control over duration—provide selection (preset, custom), track (started, remaining, expiration), expire (automatically, notify before, notify on), notify (expiring, expired, unmuted), and give users control over mute duration.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you enforce mutes?</p>
            <p className="mt-2 text-sm">
              Implement mute enforcement because mutes are meaningless if not enforced. Check mute: check before sending (check mute status before sending notification, verify mute active, check mute scope)—prevent muted notifications from being sent. Filter notifications: filter by mute (filter muted notifications, remove muted from queue, don&apos;t deliver muted)—ensure muted notifications not delivered. Override only for emergency: emergency override (critical notifications bypass mute, safety alerts bypass, security alerts bypass)—ensure critical notifications get through despite mute. Log enforcement: log mute enforcement (log mute checks, log filtered notifications, log overrides)—audit trail, debug issues, verify enforcement. The enforcement insight: must enforce mutes—check (before sending, active, scope), filter (muted, remove, don&apos;t deliver), override only for emergency (critical, safety, security), log (checks, filtered, overrides), and ensure mutes actually prevent notifications.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle mute scope?</p>
            <p className="mt-2 text-sm">
              Implement scope management because users want targeted muting, not all-or-nothing. Global scope: mute all (mute all notifications, complete silence, app-wide mute)—complete control, total silence. Channel scope: mute channels (mute specific channels, mute email, mute push, mute SMS)—channel-specific muting, selective silence. Source scope: mute sources (mute specific users, mute specific groups, mute specific senders)—source-specific muting, targeted silence. Type scope: mute types (mute specific notification types, mute marketing, mute social, mute updates)—type-specific muting, category silence. The scope insight: users want targeted muting—provide global (all, complete, app-wide), channel (specific, email, push, SMS), source (users, groups, senders), type (types, marketing, social, updates), and enable precise control over what&apos;s muted.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent mute abuse?</p>
            <p className="mt-2 text-sm">
              Implement mute monitoring because users may mute too much and miss important notifications. Monitor mute usage: monitor how users mute (mute frequency, mute duration, mute patterns, what&apos;s muted)—identify problematic muting (muting everything, permanent mute of important sources). Monitor mute effectiveness: monitor if mutes effective (notifications still getting through, mute enforcement working, user satisfaction)—ensure mutes working as expected. Alert on issues: alert on mute issues (alert if muting everything, alert if muting critical sources, alert if mutes not working)—proactive intervention, help users. The abuse insight: users may mute too much—monitor usage (frequency, duration, patterns, what&apos;s muted), effectiveness (getting through, working, satisfaction), alert on issues (everything, critical, not working), and help users maintain healthy notification balance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you sync mutes across devices?</p>
            <p className="mt-2 text-sm">
              Implement mute sync because users expect mutes to follow them across devices. Central storage: store centrally (store mutes in cloud, central mute database, synced storage)—single source of truth, consistent across devices. Sync service: sync across devices (sync mutes to all devices, propagate mute changes, ensure consistency)—mute on phone applies to desktop, consistent experience. Conflict resolution: resolve conflicts (handle concurrent mute changes, merge mute changes, resolve conflicts)—conflicts inevitable when editing on multiple devices. Backup/restore: backup and restore (backup mutes, restore mutes on new device, recover mutes)—survives device loss, device changes. The sync insight: users use multiple devices—sync mutes (central, propagate, consistent), resolve conflicts (concurrent, merge, resolve), backup/restore (backup, restore, recover), and ensure mutes follow users across all devices.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.apple.com/design/human-interface-guidelines/notifications/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple — Notification Design Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://material.io/design/communication/understanding-notification.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Material Design — Understanding Notification
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/notification-fatigue/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Notification Fatigue
            </a>
          </li>
          <li>
            <a
              href="https://support.google.com/android/answer/9079351"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Android — Mute Notifications
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/en-us/HT201176"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              iOS — Mute Notifications
            </a>
          </li>
          <li>
            <a
              href="https://onesignal.com/blog/notification-best-practices/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OneSignal — Notification Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

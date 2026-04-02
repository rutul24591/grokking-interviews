"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-functional-profile-visibility",
  title: "Profile Visibility",
  description:
    "Comprehensive guide to implementing profile visibility controls covering profile privacy settings, visibility levels, audience selection, profile discovery, and privacy-preserving profile viewing for user control over profile exposure.",
  category: "functional-requirements",
  subcategory: "other-cross-cutting-functional-requirements",
  slug: "profile-visibility",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "cross-cutting",
    "profile-visibility",
    "privacy-controls",
    "user-profile",
    "privacy",
  ],
  relatedTopics: ["privacy-settings", "data-sharing-preferences", "access-history-logs", "permission-management"],
};

export default function ProfileVisibilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Profile Visibility controls enable users to manage who can see their profile and profile information. Users can set their profile to public (anyone can see), private (only approved connections can see), or limited visibility (specific audiences can see specific information). Profile visibility is fundamental to user privacy and safety—users need control over their digital identity, personal information exposure, and who can find and contact them. For platforms with user profiles (social networks, professional networks, dating apps, marketplaces), effective visibility controls are essential for user trust, safety, and regulatory compliance (GDPR, CCPA privacy rights).
        </p>
        <p>
          For staff and principal engineers, profile visibility architecture involves visibility levels (public, private, connections-only, custom), profile section visibility (different visibility for different profile sections), audience selection (who can see profile), profile discovery controls (search visibility, recommendations), privacy-preserving profile viewing (view without revealing viewer identity), and enforcement (visibility checks at profile access). The implementation must balance user privacy (control over exposure) with platform goals (discoverability, connections, engagement). Poor visibility controls lead to privacy violations, unwanted contact, safety risks, and user trust erosion.
        </p>
        <p>
          The complexity of profile visibility extends beyond simple public/private toggle. Granular visibility (different sections have different visibility—profile photo public, email private). Connection-based visibility (visibility depends on relationship—connections see more than non-connections). Context-aware visibility (visibility changes based on context—viewing from search vs. direct link). Discovery controls (profile may be visible but not discoverable in search). Viewer anonymity (view profiles without revealing identity). For staff engineers, profile visibility is a privacy infrastructure decision affecting user safety, trust, and regulatory compliance.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Visibility Levels</h3>
        <p>
          Public visibility allows anyone to see profile. Search engines can index profile. Anyone with link can view. Profile appears in public directories. Maximum discoverability (easy to find and connect). Benefits include networking (easy for others to find you), professional presence (public professional profile). Drawbacks include privacy exposure (personal information public), unwanted contact (anyone can reach out), safety risks (stalkers, harassers can find you).
        </p>
        <p>
          Private visibility restricts profile to approved connections only. Profile not visible to non-connections. Search engines cannot index. Profile doesn&apos;t appear in public directories. Maximum privacy (only approved people see profile). Benefits include privacy protection (control who sees information), safety (unwanted people can&apos;t find you), reduced spam (only connections can contact). Drawbacks include reduced discoverability (harder for legitimate connections to find you), networking limitations (can&apos;t be found by opportunities).
        </p>
        <p>
          Connections-only visibility allows connections to see profile. Friends/followers can see full profile. Non-connections see limited or no profile. Balance between public and private (some discoverability with privacy). Benefits include controlled exposure (connections see you, strangers don&apos;t), networking within network (connections can still find you). Drawbacks includes connection barrier (must connect before seeing profile).
        </p>
        <p>
          Custom visibility enables granular control over who sees what. Specific audiences for specific sections (public sees name/photo, connections see work history, close friends see personal info). Block lists (specific users can&apos;t see profile). Include/exclude lists (these people can see, these can&apos;t). Custom visibility provides maximum control but increases complexity.
        </p>

        <h3 className="mt-6">Profile Section Visibility</h3>
        <p>
          Different profile sections have independent visibility settings. Basic info (name, photo, headline—often public for identification). Contact info (email, phone—typically private or connections-only). Work/education (professional info—often public or connections-only). Personal info (birthday, location—typically private or close friends). Activity (posts, comments—depends on content visibility). Section-level visibility enables granular privacy control.
        </p>
        <p>
          Visibility inheritance determines how section visibility relates to profile visibility. Profile-level default (sections inherit profile visibility unless overridden). Section override (sections can be more restrictive than profile). Minimum visibility (section can&apos;t be more public than profile). Inheritance balances simplicity (set once) with flexibility (override when needed).
        </p>
        <p>
          Visibility preview shows users how their profile appears to different audiences. View as public (see what public sees). View as connection (see what connections see). View as specific user (see what specific person sees). Preview helps users understand visibility settings and catch misconfigurations.
        </p>

        <h3 className="mt-6">Profile Discovery Controls</h3>
        <p>
          Search visibility controls whether profile appears in search results. Search engine indexing (allow/disallow Google, Bing indexing). Internal search visibility (appear in platform search or not). Search by email/phone (allow people to find you by contact info). Discovery controls separate visibility from findability—profile may be visible if someone has link, but not discoverable through search.
        </p>
        <p>
          Recommendation visibility controls whether profile is suggested to others. &quot;People you may know&quot; recommendations. Similar user recommendations. Connection recommendations. Recommendation visibility affects network growth—opting out reduces discoverability but increases privacy.
        </p>
        <p>
          Activity visibility controls whether profile activity is visible. Online status (show/hide when online). Activity feed (show/hide recent activity). Profile updates (notify/don&apos;t notify about changes). Activity visibility affects how others perceive engagement and presence.
        </p>

        <h3 className="mt-6">Privacy-Preserving Profile Viewing</h3>
        <p>
          Anonymous viewing enables viewing profiles without revealing viewer identity. Private mode (view profiles anonymously). Incognito viewing (temporary anonymous viewing). Anonymous viewing benefits privacy-conscious users but reduces transparency (profile owner doesn&apos;t know who viewed).
        </p>
        <p>
          View notifications inform profile owners when their profile is viewed. Viewer identity (show who viewed). Anonymous viewer (show &quot;someone viewed&quot; without identity). View count (show how many views without identities). View notifications provide engagement feedback but may discourage viewing (privacy concern).
        </p>
        <p>
          View restrictions limit who can view profile. Connection required (must be connected to view). Approval required (profile owner approves viewers). Limited views (non-connections see limited profile). View restrictions protect privacy but create friction for legitimate viewers.
        </p>

        <h3 className="mt-6">Visibility Enforcement</h3>
        <p>
          Access control checks visibility at profile access. Authentication check (is viewer logged in). Authorization check (does viewer have permission to see). Visibility evaluation (what sections can viewer see). Access control ensures visibility settings are enforced.
        </p>
        <p>
          Caching respects visibility in cached content. Visibility-aware caching (cache different versions for different audiences). Cache invalidation (invalidate when visibility changes). Private content not cached (or cached with strict access). Caching must respect visibility to prevent leaks.
        </p>
        <p>
          API enforcement ensures visibility is enforced at API level. API authorization (check visibility at API endpoint). Response filtering (filter response based on viewer permission). Rate limiting by visibility (different limits for public vs. private access). API enforcement prevents bypassing visibility through direct API access.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Profile visibility architecture spans visibility settings, access control, discovery service, and enforcement layer. Visibility settings store user visibility preferences. Access control evaluates visibility at access time. Discovery service manages search and recommendation visibility. Enforcement layer ensures visibility is respected across all access paths. Each layer has specific responsibilities and integration requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/profile-visibility/visibility-architecture.svg"
          alt="Profile Visibility Architecture"
          caption="Figure 1: Profile Visibility Architecture — Settings, access control, discovery, and enforcement"
          width={1000}
          height={500}
        />

        <h3>Visibility Settings Service</h3>
        <p>
          Visibility settings service stores and manages visibility preferences. Profile-level settings (overall profile visibility). Section-level settings (per-section visibility). Discovery settings (search, recommendations). Settings persistence (store in database). Settings API (get/set visibility settings). Settings service is the source of truth for visibility preferences.
        </p>
        <p>
          Visibility inheritance manages default and override behavior. Default visibility (profile-level default for all sections). Section overrides (sections can override default). Inheritance resolution (determine effective visibility for each section). Inheritance simplifies settings (set once) while allowing flexibility (override when needed).
        </p>

        <h3 className="mt-6">Access Control Service</h3>
        <p>
          Access control service evaluates visibility at access time. Viewer identification (who is requesting access). Relationship check (what is relationship between viewer and profile owner). Visibility evaluation (what can this viewer see). Response construction (build response with visible content only). Access control ensures only authorized content is returned.
        </p>
        <p>
          Relationship graph enables relationship-based visibility. Connection status (are they connected). Connection degree (1st degree, 2nd degree, etc.). Group membership (shared groups). Relationship graph enables nuanced visibility (connections see more than strangers).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/profile-visibility/visibility-levels.svg"
          alt="Visibility Levels"
          caption="Figure 2: Visibility Levels — Public, private, connections-only, and custom visibility"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Discovery Service</h3>
        <p>
          Discovery service manages profile discoverability. Search indexing (index profile for search or not). Recommendation eligibility (include in recommendations or not). Discovery filtering (filter based on discovery settings). Discovery service ensures visibility preferences extend to discovery.
        </p>
        <p>
          Search integration respects visibility in search. Search index filtering (don&apos;t index private profiles). Search result filtering (filter results based on viewer permission). Search visibility ensures private profiles don&apos;t appear in search.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/profile-visibility/access-control-flow.svg"
          alt="Access Control Flow"
          caption="Figure 3: Access Control Flow — Profile access request, visibility check, and response"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Profile visibility design involves trade-offs between privacy and discoverability, simplicity and granularity, and transparency and anonymity. Understanding these trade-offs enables informed decisions aligned with platform values and user needs.
        </p>

        <h3>Visibility: Public vs. Private Default</h3>
        <p>
          Public default (profiles are public by default). Pros: Maximum discoverability (easy to find and connect), network growth (more connections), platform engagement (more profile views). Cons: Privacy risk (users may not realize public), unwanted contact (strangers can reach out), safety concerns (stalkers, harassers). Best for: Professional networks, public figures, platforms prioritizing growth.
        </p>
        <p>
          Private default (profiles are private by default). Pros: Privacy protection (users start private), safety (control who sees profile), user trust (privacy-first approach). Cons: Reduced discoverability (harder to find), network growth friction (must approve connections), lower engagement. Best for: Safety-focused platforms, dating apps, platforms with sensitive user data.
        </p>
        <p>
          Hybrid: guided setup with informed choice. Pros: Best of both (users make informed decision, default to safer option). Cons: Complexity (setup flow), may still confuse some users. Best for: Most platforms—guide users through visibility choices during onboarding.
        </p>

        <h3>Granularity: Simple vs. Granular Controls</h3>
        <p>
          Simple controls (public/private toggle). Pros: Easy to understand (simple mental model), quick to set (one click), less decision fatigue. Cons: Limited control (all or nothing), may not fit all needs, users may choose extreme (all public or all private). Best for: Simple platforms, casual users.
        </p>
        <p>
          Granular controls (per-section visibility, custom audiences). Pros: Precise control (exactly who sees what), flexibility (different visibility for different info), user empowerment (full control). Cons: Complexity (many settings), decision fatigue (many choices), misconfiguration risk (users may set incorrectly). Best for: Professional networks, platforms with diverse profile types.
        </p>
        <p>
          Hybrid: simple defaults with advanced options. Pros: Best of both (simple for most, granular for power users). Cons: Complexity (two tiers), advanced options may be hidden. Best for: Most platforms—simple default with &quot;advanced settings&quot; for granular control.
        </p>

        <h3>Viewing: Anonymous vs. Identified</h3>
        <p>
          Identified viewing (viewers always identified). Pros: Transparency (profile owner knows who viewed), engagement signal (interest indicated), networking (mutual interest visible). Cons: Privacy concern (viewers may not want to be identified), viewing inhibition (may not view if identified), power imbalance (some users always identified, others not). Best for: Professional networks, dating apps (mutual interest).
        </p>
        <p>
          Anonymous viewing (viewers can be anonymous). Pros: Privacy protection (view without revealing), viewing freedom (view without inhibition), user control (choose when to reveal). Cons: Reduced transparency (profile owner doesn&apos;t know who viewed), reduced engagement signal (no interest indication), potential abuse (stalkers can view anonymously). Best for: Privacy-focused platforms, general social networks.
        </p>
        <p>
          Hybrid: anonymous with premium identified features. Pros: Best of both (free users anonymous, premium can reveal). Cons: Complexity (two tiers), may create confusion. Best for: Platforms with premium tiers—basic anonymous viewing, premium features include identified viewing benefits.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/profile-visibility/visibility-comparison.svg"
          alt="Visibility Approaches Comparison"
          caption="Figure 4: Visibility Approaches Comparison — Default, granularity, and viewing trade-offs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Provide clear visibility levels:</strong> Public, private, connections-only. Clear descriptions of each level. Visual indicators of current visibility.
          </li>
          <li>
            <strong>Support granular section visibility:</strong> Per-section visibility controls. Section inheritance from profile. Override when needed.
          </li>
          <li>
            <strong>Enable discovery controls:</strong> Search visibility toggle. Recommendation opt-out. Activity visibility controls.
          </li>
          <li>
            <strong>Provide visibility preview:</strong> View as public. View as connection. View as specific user. Catch misconfigurations.
          </li>
          <li>
            <strong>Enforce visibility consistently:</strong> Access control at API level. Response filtering. Caching respects visibility.
          </li>
          <li>
            <strong>Support anonymous viewing option:</strong> Private mode for viewing. Incognito viewing. Balance with transparency.
          </li>
          <li>
            <strong>Guide users during onboarding:</strong> Explain visibility options. Recommend appropriate settings. Allow changes later.
          </li>
          <li>
            <strong>Notify of visibility changes:</strong> Notify when visibility changes. Confirm major changes. Provide undo option.
          </li>
          <li>
            <strong>Respect relationship-based visibility:</strong> Connection status affects visibility. Degree of connection matters. Group membership considered.
          </li>
          <li>
            <strong>Audit visibility access:</strong> Log profile access. Track visibility violations. Monitor for abuse.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Public by default without notice:</strong> Users don&apos;t realize profile is public. <strong>Solution:</strong> Clear notice during setup, guided visibility choices.
          </li>
          <li>
            <strong>Inconsistent enforcement:</strong> Visibility works in UI but not API. <strong>Solution:</strong> Enforce at API level, test all access paths.
          </li>
          <li>
            <strong>Caching leaks private content:</strong> Cached content visible to unauthorized users. <strong>Solution:</strong> Visibility-aware caching, private content not cached.
          </li>
          <li>
            <strong>No visibility preview:</strong> Users don&apos;t know what others see. <strong>Solution:</strong> Provide &quot;view as&quot; preview for different audiences.
          </li>
          <li>
            <strong>Overly complex controls:</strong> Too many options confuse users. <strong>Solution:</strong> Simple defaults with advanced options, clear descriptions.
          </li>
          <li>
            <strong>No discovery controls:</strong> Profile visible but discoverable in search. <strong>Solution:</strong> Separate visibility from discovery controls.
          </li>
          <li>
            <strong>Anonymous viewing without limits:</strong> Stalkers can view anonymously. <strong>Solution:</strong> Rate limit anonymous viewing, allow users to block anonymous viewers.
          </li>
          <li>
            <strong>No relationship consideration:</strong> Same visibility for all viewers. <strong>Solution:</strong> Relationship-based visibility (connections see more).
          </li>
          <li>
            <strong>Visibility changes without notice:</strong> Profile suddenly more visible. <strong>Solution:</strong> Notify users of visibility changes, require confirmation.
          </li>
          <li>
            <strong>No audit trail:</strong> Can&apos;t track who accessed profile. <strong>Solution:</strong> Log profile access, monitor for violations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>LinkedIn Profile Visibility</h3>
        <p>
          LinkedIn provides professional profile visibility controls. Public profile (customizable public URL, select what&apos;s visible). Connection visibility (connections see full profile, non-connections see limited). Search visibility (control appearing in search results). Activity visibility (control who sees when you view profiles). Premium features (see who viewed your profile). Professional networking balance (discoverable for opportunities, privacy for sensitive info).
        </p>

        <h3 className="mt-6">Facebook Profile Visibility</h3>
        <p>
          Facebook provides granular profile visibility. Profile sections (each section has independent visibility). Friend lists (different visibility for different friend lists). Public posts vs. friends-only posts. Search visibility (control search engine indexing). Timeline review (approve tags before appearing). Social networking focus (share with friends, control public exposure).
        </p>

        <h3 className="mt-6">Dating App Profile Visibility</h3>
        <p>
          Dating apps provide visibility controls for safety. Profile visibility (only visible to potential matches). Incognito mode (browse without being seen). Block users (specific users can&apos;t see profile). Distance visibility (show approximate vs. exact location). Safety focus (control who can see and contact).
        </p>

        <h3 className="mt-6">Professional Marketplace Profile</h3>
        <p>
          Marketplace provides seller profile visibility. Public seller profile (visible to all buyers). Contact info (visible only after connection). Reviews visibility (public reviews build trust). Availability status (show/hide availability). Business focus (visible for business, private for personal).
        </p>

        <h3 className="mt-6">Healthcare Patient Portal Profile</h3>
        <p>
          Healthcare portal provides strict profile visibility. Private by default (only healthcare providers see). Patient control (patient can grant access to family). HIPAA compliance (strict privacy requirements). Audit trail (track all profile access). Medical privacy focus (maximum privacy, minimum exposure).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design profile visibility that balances privacy with discoverability?</p>
            <p className="mt-2 text-sm">
              Implement tiered visibility with informed defaults that match platform purpose and user expectations. Public default for professional networks like LinkedIn (with clear notice: &quot;Your profile is visible to anyone on the internet&quot;) because discoverability is the goal. Private default for safety-focused platforms like dating apps or support communities because user safety is paramount. Granular section visibility: basic info (name, avatar) public for recognition, contact info (email, phone) private by default, work history visible to connections for networking. Discovery controls separate from visibility: user can be visible (profile exists) but not discoverable (doesn&apos;t appear in search). Preview feature: show users exactly what their profile looks like to strangers, connections, and public—&quot;This is what strangers see&quot; with actual rendered preview. The key insight: privacy and discoverability aren&apos;t binary opposites—provide granular controls so users can balance both based on their specific needs, career stage, and comfort level.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you enforce profile visibility consistently across all access paths?</p>
            <p className="mt-2 text-sm">
              Implement visibility enforcement at multiple layers because any bypass is a privacy violation. API layer: check visibility at every endpoint before returning data—query includes visibility filter, not just application logic check. Response filtering: filter response based on viewer permission even if data was retrieved—defense in depth. Caching layer: implement visibility-aware caching where private content isn&apos;t cached or is cached with user-specific keys—prevent private data leaking through cache. CDN layer: respect visibility at edge—CDN should not serve private profile images to unauthorized viewers. Database layer: use row-level security for highly sensitive data—database itself enforces visibility regardless of application bugs. The operational insight: visibility must be enforced at every layer because attackers (and bugs) will find the weakest point. A privacy setting that only works at application layer but not API layer is a failed privacy setting. Defense in depth ensures consistent enforcement even when one layer has bugs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle relationship-based visibility?</p>
            <p className="mt-2 text-sm">
              Implement relationship graph with flexible visibility rules that match real-world social complexity. Connection status: binary connected vs. not connected is simplest—connections see full profile, strangers see limited. Connection degree: 1st degree (direct connections), 2nd degree (connections of connections), 3rd degree—each degree can have different visibility levels. Group membership: shared groups create relationship (group members see more about each other). Custom relationships: allow users to define custom relationship types (family, close friends, colleagues, acquaintances) with custom visibility per type. Visibility rules based on relationship: connections see work history, family sees personal photos, colleagues see professional info, strangers see only public info. The complexity insight: relationships are nuanced and contextual—support multiple relationship types, allow users to define custom visibility per relationship type, and handle edge cases (what if someone is both colleague and friend? Use most permissive or let user decide).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent visibility misconfiguration?</p>
            <p className="mt-2 text-sm">
              Implement multiple safeguards against misconfiguration because privacy mistakes can have serious, lasting consequences. Visibility preview: before saving changes, show user exactly what their profile will look like to different audiences—&quot;If you make this change, strangers will see your email address.&quot; Confirmation for major changes: making profile from private to fully public requires explicit confirmation with clear warning about implications. Gradual visibility changes: don&apos;t allow jumping from maximum privacy to maximum publicity in one step—require intermediate steps with pauses. Audit trail: track all visibility changes with timestamp, what changed, and from what value to what value—enables recovery from mistakes. Notifications: notify user when visibility changes significantly (especially when becoming more public). The safety insight: visibility misconfiguration can lead to harassment, doxxing, job loss, or worse—implement multiple safeguards to prevent accidental over-exposure, and make it easy to undo mistakes quickly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle anonymous profile viewing?</p>
            <p className="mt-2 text-sm">
              Implement anonymous viewing with appropriate limits that balance viewer privacy with profile owner transparency. Private mode: allow users to opt-in to anonymous viewing (they can browse without being seen), but clearly explain this is a privacy feature for viewers. Rate limiting: prevent mass anonymous viewing (e.g., 20 anonymous views per day) to prevent scraping or stalking behavior. Block anonymous option: give profile owners ability to block anonymous viewers entirely—if you want to see my profile, identify yourself. Premium features: offer identified viewing benefits (people you viewed can see you viewed them, which can be networking opportunity). Balance privacy (viewers deserve some anonymity) with transparency (profile owners deserve to know who&apos;s viewing their profile). The balance insight: anonymous viewing is a legitimate privacy feature for viewers, but can enable abuse (stalking, competitive intelligence gathering)—implement limits, give profile owners control over anonymous viewers, and make the trade-offs clear to both parties.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle visibility for deceased users?</p>
            <p className="mt-2 text-sm">
              Implement memorialization process for deceased users that respects the deceased&apos;s wishes while providing family closure. Legacy contact: allow users to designate someone (family member, executor) to manage their profile after death—this person can update visibility, add memorial message, but can&apos;t post as deceased. Memorialization: when account memorialized, profile visibility changes—shows &quot;Remembering [Name],&quot; stops appearing in birthday reminders, doesn&apos;t appear in &quot;people you may know.&quot; Family verification: require death certificate or obituary to verify death before memorializing—prevent abuse. Privacy preservation: maintain user&apos;s visibility preferences after death unless legacy contact changes them—respect deceased&apos;s privacy choices. The sensitive insight: deceased user profiles require special handling that balances multiple stakeholders—respect the deceased&apos;s wishes (their privacy choices), provide family closure (ability to memorialize), prevent abuse (verification required), and maintain dignity (appropriate memorial presentation).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.facebook.com/privacy/settings/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Privacy Settings — Profile Visibility Controls
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/psettings/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Privacy Settings — Profile Visibility
            </a>
          </li>
          <li>
            <a
              href="https://support.google.com/accounts/answer/16907"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Account — Profile Privacy Settings
            </a>
          </li>
          <li>
            <a
              href="https://www.eff.org/issues/privacy"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              EFF — Online Privacy Resources
            </a>
          </li>
          <li>
            <a
              href="https://www.gdpr.eu/profile-data/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GDPR.eu — Profile Data and Privacy Rights
            </a>
          </li>
          <li>
            <a
              href="https://www.privacytools.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Tools — Privacy-Focused Services and Guides
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
